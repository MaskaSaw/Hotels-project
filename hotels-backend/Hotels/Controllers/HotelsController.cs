using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Hotels.ImageProcessing;
using Hotels.Models;
using Newtonsoft.Json;

namespace Hotels.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HotelsController : ControllerBase
    {
        private readonly ImageService _imageService;
        private readonly HotelsDBContext _context;
        private const int MaxItemsPerPage = 100;

        public HotelsController(HotelsDBContext context, ImageService imageService)
        {
            _context = context;
            _imageService = imageService;
        }

        // GET: api/Hotels
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Hotel>>> GetHotels([FromQuery]int page, int itemsPerPage,[FromQuery] HotelsParams inputParams)
        {
            int returnedNumberOfItems = (MaxItemsPerPage < itemsPerPage) ? MaxItemsPerPage : itemsPerPage;
            if (inputParams.CheckIn != null & inputParams.CheckOut != null)
            {
                var hotels = await _context.Hotels
                .Include(hotel => hotel.Rooms)
                .Where(hotel => string.IsNullOrEmpty(inputParams.Country) || hotel.Country == inputParams.Country)
                .Where(hotel => string.IsNullOrEmpty(inputParams.City) || hotel.City == inputParams.City)
                .ToListAsync();

                if (inputParams.NumberOfResidents != null && inputParams.NumberOfResidents != 0)
                {
                    hotels = hotels.Where(hotel =>
                        hotel.Rooms
                            .Where(room => room.VacantBeds >= inputParams.NumberOfResidents)
                            .ToList()
                            .Count > 0
                        )
                        .ToList();
                }

                for (int i = 0; i > hotels.Count; i++)
                {
                    var rooms = hotels[i].Rooms;

                    foreach (var room in rooms)
                    {
                        var reservations = room.Reservations.Where(reservation =>
                            reservation.StartDate > inputParams.CheckOut || reservation.EndDate < inputParams.CheckIn ||
                            (reservation.StartDate < inputParams.CheckOut && reservation.EndDate > inputParams.CheckIn));
                    }

                    if (rooms.Count == 0)
                    {
                        hotels.RemoveAt(i);
                        i--;
                    }
                }

                return hotels
                    .Skip((page - 1) * returnedNumberOfItems)
                    .Take(returnedNumberOfItems)
                    .ToList();
            }

            return await _context.Hotels
                .Include(hotel => hotel.Rooms)
                .Skip((page - 1) * returnedNumberOfItems)
                .Take(returnedNumberOfItems)
                .ToListAsync();
        }

        // GET: api/Hotels/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Hotel>> GetHotel(int id)
        {
            var hotel = await _context.Hotels.FindAsync(id);

            if (hotel == null)
            {
                return NotFound();
            }

            return hotel;
        }

        //GET: api/Hotels/5/Rooms
        [HttpGet("{id}/Rooms")]
        public async Task<ActionResult<IEnumerable<Room>>> GetRooms(int id)
        {
            return await _context.Rooms
                .Include(room => room.Reservations)
                .Where(room => room.HotelId == id)
                .ToListAsync();
        }

        // PUT: api/Hotels/5
        [Authorize (Roles ="Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutHotel([FromRoute]int id, Hotel hotel)
        {
            if (id != hotel.Id)
            {
                return BadRequest();
            }

            _context.Entry(hotel).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!HotelExists(id))
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

        // POST: api/Hotels
        [Authorize (Roles ="Admin")]
        [HttpPost]
        public async Task<ActionResult<Hotel>> PostHotel(Hotel hotel)
        {
            _context.Hotels.Add(hotel);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetHotel", new { id = hotel.Id }, hotel);
        }

        // DELETE: api/Hotels/5
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHotel(int id)
        {
            var hotel = await _context.Hotels.FindAsync(id);

            if (hotel == null)
            {
                return NotFound();
            }

            _context.Hotels.Remove(hotel);
            if (string.IsNullOrEmpty(hotel.Image))
            {
                _imageService.DeleteImage(hotel.Image);
            }
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool HotelExists(int id)
        {
            return _context.Hotels.Any(hotel => hotel.Id == id);
        }
    }
}
