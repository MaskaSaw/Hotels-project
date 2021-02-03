using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Hotels.Models;

namespace Hotels.Controllers
{
    [Route("api/[controller]") ]
    [ApiController]
    public class RoomsController : ControllerBase
    {
        private readonly HotelsDBContext _context;

        public RoomsController(HotelsDBContext context)
        {
            _context = context;
        }

        // GET: api/Rooms
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Room>>> GetRooms()
        {
            var rooms = await _context.Rooms.ToListAsync();
            var reservations = await _context.Reservations.ToListAsync();

            foreach (var room in rooms)
            {
                room.Reservations = reservations
                    .Where(x => x.RoomId == room.Id)
                    .ToList();
            }
            return rooms;
        }

        // GET: api/Hotels/5/Rooms
        [HttpGet("api/Hotels/{hotelId}/[controller]")]
        public async Task<ActionResult<IEnumerable<Room>>> GetRooms(int hotelId)
        {
            var rooms = await _context.Rooms.ToListAsync();
            var reservations = await _context.Reservations.ToListAsync();

            foreach (var room in rooms)
            {
                room.Reservations = reservations
                    .Where(x => x.RoomId == room.Id)
                    .ToList();
            }
        
            return rooms
                .Where(x => x.HotelId == hotelId)
                .ToList();
        }

        // GET: api/Rooms/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Room>> GetRoom(int id)
        {
            var room = await _context.Rooms.FindAsync(id);

            if (room == null)
            {
                return NotFound();
            }

            room.Reservations =  await _context.Reservations.Where(x => x.RoomId == id).ToListAsync();
            
            return room;
        }

        // GET: api/Hotels/5/Rooms/5
        [HttpGet("api/Hotels/{hotelId}/[controller]/{id}")]
        public async Task<ActionResult<Room>> GetRoom(int id, int hotelId)
        {
            var room = await _context.Rooms.FindAsync(id);

            if (room == null || room.HotelId != hotelId)
            {
                return NotFound();
            }

            room.Reservations = await _context.Reservations.Where(x => x.RoomId == id).ToListAsync();

            return room;
        }


        // PUT: api/Rooms/5
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
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Rooms
        [HttpPost]
        public async Task<ActionResult<Room>> PostRoom(Room room)
        {
            _context.Rooms.Add(room);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetRoom", new { id = room.Id }, room);
        }

        // DELETE: api/Rooms/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRoom(int id)
        {
            var room = await _context.Rooms.FindAsync(id);
            if (room == null)
            {
                return NotFound();
            }

            _context.Rooms.Remove(room);

            var reservations = await _context.Reservations.Where(x => x.RoomId == id).ToListAsync();

            foreach (var reservation in reservations)
            {
                _context.Reservations.Remove(reservation);
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
