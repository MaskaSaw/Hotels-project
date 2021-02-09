﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Hotels.Models;
using Microsoft.AspNetCore.Authorization;

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

        // GET: api/Rooms/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Room>> GetRoom(int id)
        {
            var room = await _context.Rooms.FindAsync(id);

            if (room == null)
            {
                return NotFound();
            }

            room.Reservations =  await _context.Reservations
                .Where(x => x.RoomId == id)
                .ToListAsync();
            
            return room;
        }

        [Authorize (Roles = "Admin")]
        //GET: api/Rooms/5/Reservations
        [HttpGet("{id}/Reservations")]
        public async Task<ActionResult<IEnumerable<Reservation>>> GetReservations(int id)
        {
            return await _context.Reservations
                .Where(reservation => reservation.RoomId == id)
                .ToListAsync();
        }

        [Authorize (Roles = "Admin")]
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
                    return Conflict();
                }
            }

            return NoContent();
        }

        [Authorize (Roles = "Admin")]
        // POST: api/Rooms
        [HttpPost]
        public async Task<ActionResult<Room>> PostRoom(Room room)
        {
            _context.Rooms.Add(room);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetRoom", new { id = room.Id }, room);
        }

        [Authorize (Roles = "Admin")]
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
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool RoomExists(int id)
        {
            return _context.Rooms.Any(e => e.Id == id);
        }
    }
}
