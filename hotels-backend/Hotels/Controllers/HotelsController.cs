﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.IO;
using Hotels.ImageProcessing;
using Hotels.Models;

namespace Hotels.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HotelsController : ControllerBase
    {
        private readonly HotelsDBContext _context;
        private const int MaxItemsPerPage = 100;

        public HotelsController(HotelsDBContext context)
        {
            _context = context;
        }

        // GET: api/Hotels
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Hotel>>> GetHotels([FromQuery] int page, int itemsPerPage)
        {
            int returnedNumberOfItems = (MaxItemsPerPage < itemsPerPage) ? MaxItemsPerPage : itemsPerPage;
            var hotels = await _context.Hotels
                .Skip((page - 1) * returnedNumberOfItems)
                .Take(returnedNumberOfItems)
                .ToListAsync();

            foreach (Hotel hotel in hotels)
            {
                hotel.Image = ImageProcessor.GetImage(hotel.Image);
            }

            return hotels;         
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

            hotel.Image = ImageProcessor.GetImage(hotel.Image);

            return hotel;
        }

        //GET: api/Hotels/5/Rooms
        [HttpGet("{id}/Rooms")]
        public async Task<ActionResult<IEnumerable<Room>>> GetRooms(int id)
        {
            var rooms = await _context.Rooms
                .Include(room => room.Reservations)
                .Where(room => room.HotelId == id)      
                .ToListAsync();

            foreach (Room room in rooms)
            {
                room.Image = ImageProcessor.GetImage(room.Image);
            }

            return rooms;
        }

        // PUT: api/Hotels/5
        [Authorize (Roles ="Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutHotel(int id, Hotel hotel)
        {
            if (id != hotel.Id)
            {
                return BadRequest();
            }

            hotel.Image = ImageProcessor.SaveImage(hotel.Image);
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
        //[Authorize (Roles ="Admin")]
        [HttpPost]
        public async Task<ActionResult<Hotel>> PostHotel(Hotel hotel)
        {
            hotel.Image = ImageProcessor.SaveImage(hotel.Image);
           
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
            ImageProcessor.DeleteImage(hotel.Image);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool HotelExists(int id)
        {
            return _context.Hotels.Any(hotel => hotel.Id == id);
        }
    }
}
