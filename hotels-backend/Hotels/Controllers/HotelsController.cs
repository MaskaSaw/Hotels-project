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
        public async Task<ActionResult<IEnumerable<Hotel>>> GetHotels(
            [FromQuery] int page,
            int itemsPerPage,
            [FromQuery] HotelsParams inputParams
        )
        {
            var hotels = _context.Hotels
                .Include(hotel => hotel.Rooms)
                .Include(hotel => hotel.Services)
                .AsQueryable();

            if (!string.IsNullOrEmpty(inputParams.Country))
            {
                hotels = hotels.Where(hotel => hotel.Country == inputParams.Country);
            }

            if (!string.IsNullOrEmpty(inputParams.City))
            {
                hotels = hotels.Where(hotel => hotel.City == inputParams.City);
            }

            if (inputParams.NumberOfResidents != null && inputParams.NumberOfResidents != 0)
            {
                hotels = hotels
                    .Where(hotel => hotel.Rooms
                        .Any(room => room.VacantBeds >= inputParams.NumberOfResidents)
                    );
            }

            int returnedNumberOfItems = (MaxItemsPerPage < itemsPerPage) ? MaxItemsPerPage : itemsPerPage;
            if (inputParams.CheckIn != null & inputParams.CheckOut != null)
            {
                hotels = hotels
                    .Where(hotel => hotel.Rooms
                        .Any(room => room.Reservations.Count == 0 || !room.Reservations
                            .Any(reservation =>
                                (reservation.EndDate > inputParams.CheckIn && reservation.EndDate < inputParams.CheckOut) ||
                                (reservation.StartDate > inputParams.CheckIn && reservation.StartDate < inputParams.CheckOut) ||
                                (reservation.StartDate < inputParams.CheckIn && reservation.EndDate > inputParams.CheckOut)
                            )
                        )
                    );
            }
            return await hotels
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

        //GET: api/Hotels/Countries
        [HttpGet("Countries")]
        public async Task<ActionResult<IEnumerable<string>>> GetCountries()
        {
            return await _context.Hotels
                .Select(hotel => hotel.Country)
                .Distinct()
                .ToListAsync();
        }

        //GET: api/Hotels/Cities
        [HttpGet("Cities")]
        public async Task<ActionResult<IEnumerable<string>>> GetCities([FromQuery] string country, string city)
        {
            return await _context.Hotels
                .Where(hotel => hotel.Country == country)
                .Where(hotel => hotel.City.Contains(city))
                .Select(hotel => hotel.City)
                .Distinct()
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

            var existingServices = await _context.Services
                .Where(service => service.HotelId == id)
                .ToListAsync();

            foreach (var service in hotel.Services)
            {
                var existingService = existingServices.Find(existingService => existingService.Id == service.Id);

                if (existingService != null)
                {
                    _context.Entry(existingService).CurrentValues.SetValues(service);
                }
                else
                {
                    _context.Services.Add(service);
                }
            }

            foreach (var existingService in existingServices)
            {
                if (!hotel.Services.Any(service => service.Id == existingService.Id))
                {
                    _context.Services.Remove(existingService);
                }
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

            if (!HotelExists(id))
            {
                return NotFound();
            }

            var hotel = await _context.Hotels
                .Include(hotel => hotel.Services)
                .Where(hotel => hotel.Id == id)
                .FirstOrDefaultAsync();

            _context.Hotels.Remove(hotel);

            await _context.SaveChangesAsync();

            if (!string.IsNullOrEmpty(hotel.Image))
            {
                _imageService.DeleteImage(hotel.Image);
            }

            return NoContent();
        }

        private bool HotelExists(int id)
        {
            return _context.Hotels.Any(hotel => hotel.Id == id);
        }
    }
}
