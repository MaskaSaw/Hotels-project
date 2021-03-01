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

namespace Hotels.Controllers
{
    [Route("api/[controller]") ]
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
        public async Task<ActionResult<Room>> GetRoom(int id)
        {
            var room = await _context.Rooms.FindAsync(id);

            if (room == null)
            {
                return NotFound();
            }

            return room;
        }

        //GET: api/Rooms/5/Reservations
        [Authorize(Roles = "Admin")]
        [HttpGet("{id}/Reservations")]
        public async Task<ActionResult<IEnumerable<Reservation>>> GetReservations(int id)
        {
            return await _context.Reservations
                .Where(reservation => reservation.RoomId == id)
                .ToListAsync();
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
            _imageService.DeleteImage(room.Image);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool RoomExists(int id)
        {
            return _context.Rooms.Any(e => e.Id == id);
        }
    }
}
