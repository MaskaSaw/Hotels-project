using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Hotels.Models;
using Hotels.ImageProcessing;
using Newtonsoft.Json;
using Hotels.DTOs;

namespace Hotels.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomsController : ControllerBase
    {
        private readonly HotelsDBContext _context;
        private readonly ImageService _imageService;

        public RoomsController(HotelsDBContext context, ImageService imageService)
        {
            _context = context;
            _imageService = imageService;
        }

        // GET: api/Rooms/5
        [HttpGet("{id}")]
        public async Task<ActionResult<RoomDTO>> GetRoom(int id)
        {
            var room = await _context.Rooms.FindAsync(id);

            if (room == null)
            {
                return NotFound();
            }

            return new RoomDTO
            {
                Id = room.Id,
                RoomNumber = room.RoomNumber,
                RoomType = room.RoomType,
                Cost = room.Cost,
                VacantBeds = room.VacantBeds,
                Image = room.Image,
                HotelId = room.HotelId
            };
        }

        // GET: api/Rooms/5/Services
        [HttpGet("{id}/Services")]
        public async Task<ActionResult<IEnumerable<Service>>> GetServices(int id)
        {
            var room = await _context.Rooms.FindAsync(id);

            return await _context.Services
                .Where(service => service.HotelId == room.HotelId)
                .ToListAsync();
        }

        //GET: api/Rooms/5/Reservations
        [Authorize(Roles = "Admin")]
        [HttpGet("{id}/Reservations")]
        public async Task<ActionResult<IEnumerable<ReservationDTO>>> GetReservations(int id, [FromQuery] string userName)
        {
            var reservations = _context.Reservations
                   .Include(reservation => reservation.ReservationServices)
                   .Where(reservation => reservation.RoomId == id)
                   .AsQueryable();

            if (!string.IsNullOrEmpty(userName))
            {
                reservations = reservations.Where(reservation =>
                    ($"{reservation.User.Name} {reservation.User.Surname}").Contains(userName)
                );
            }

            return await reservations
                .Select(reservation =>
                        new ReservationDTO
                        {
                            Id = reservation.Id,
                            RoomId = reservation.RoomId,
                            UserId = reservation.UserId,
                            UserName = $"{reservation.User.Name} {reservation.User.Surname}",
                            ArrivalTime = reservation.ArrivalTime,
                            DepartureTime = reservation.DepartureTime,
                            StartDate = reservation.StartDate,
                            EndDate = reservation.EndDate,
                            Cost = reservation.Cost,
                            ReservationServices = reservation.ReservationServices,
                            RoomNumber = reservation.Room.RoomNumber,
                            HotelName = reservation.Room.Hotel.Name,
                            Country = reservation.Room.Hotel.Country,
                            City = reservation.Room.Hotel.City
                        }
                    )
                    .ToListAsync();
        }

        //GET: api/Rooms/Numbers
        [Authorize]
        [HttpGet("Numbers")]
        public async Task<ActionResult<IEnumerable<RoomSearchDTO>>> GetRoomsByNumber([FromQuery] string roomNumber, string hotelName)
        {
            var hotel = _context.Hotels
                    .Where(hotel => hotel.Name == hotelName)
                    .FirstOrDefault();

            if (hotel == null)
            {
                return new List<RoomSearchDTO>();
            }
            return await _context.Rooms
                .Where(room => room.Hotel.Name.Contains(hotelName))
                .Where(room => room.RoomNumber.Contains(roomNumber))
                .Select(room =>
                    new RoomSearchDTO
                    {
                        Id = room.Id,
                        RoomNumber = room.RoomNumber
                    }
                )
                .ToListAsync();
        }

        [HttpGet("{id}/Cost")]
        public async Task<ActionResult<decimal>> GetRoomCost(int id)
        {
            var room = await _context.Rooms.FindAsync(id);

            if (room == null)
            {
                return NotFound();
            }

            return room.Cost;
        }

        // PUT: api/Rooms/5
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRoom(int id, Room room)
        {
            if (id != room.Id)
            {
                return BadRequest();
            }

            _context.Entry(room).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RoomExists(id))
                {
                    return NotFound();
                }
                else
                {
                    return Conflict();
                }
            }

            return NoContent();
        }

        // POST: api/Rooms
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<Room>> PostRoom(Room room)
        {
            _context.Rooms.Add(room);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetRoom", new { id = room.Id }, room);
        }

        // POST: api/Rooms/Blocks
        [Authorize]
        [HttpPost("Blocks")]
        public async Task<IActionResult> PostRoomBlock(RoomBlock block)
        {
            _context.RoomBlocks.Add(block);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Rooms/5
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRoom(int id)
        {
            var room = await _context.Rooms.FindAsync(id);

            if (room == null)
            {
                return NotFound();
            }

            _context.Rooms.Remove(room);
            if (string.IsNullOrEmpty(room.Image))
            {
                _imageService.DeleteImage(room.Image);
            }
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool RoomExists(int id)
        {
            return _context.Rooms.Any(e => e.Id == id);
        }
    }
}
