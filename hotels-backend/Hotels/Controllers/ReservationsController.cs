using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Hotels.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Hotels.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReservationsController : ControllerBase
    {
        private readonly HotelsDBContext _context;
        private readonly int _itemsCount = 100;

        public ReservationsController(HotelsDBContext context)
        {
            _context = context;
        }

        // GET: api/Reservations
        [Authorize (Roles = "Admin")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Reservation>>> GetReservations([FromQuery] int page)
        {
            return await _context.Reservations
                .Skip((page - 1)* _itemsCount)
                .Take(_itemsCount)
                .ToListAsync();
        }

        // GET: api/Reservations/5
        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<Reservation>> GetReservation(int id)
        {
            var reservation = await _context.Reservations.FindAsync(id);

            if (reservation == null)
            {
                return NotFound();
            }

            var identity = HttpContext.User.Identity as ClaimsIdentity;
            int authUserId = GetAuthorizedUserId(identity.Claims);
            string authUserRole = GetAuthorizedUserRole(identity.Claims);

            if (authUserId == reservation.UserId || authUserRole == "Admin")
            {                
                return reservation;
            }

            return Forbid();
        }

        // PUT: api/Reservations/5
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutReservation(int id, Reservation modifiedReservation)
        {
            if (id != modifiedReservation.Id)
            {
                return BadRequest();
            }
            var reservation = await _context.Reservations.FindAsync(id);

            var identity = HttpContext.User.Identity as ClaimsIdentity;
            int authUserId = GetAuthorizedUserId(identity.Claims);
            string authUserRole = GetAuthorizedUserRole(identity.Claims);
            if (authUserId == reservation.UserId || authUserRole == "Admin")
            {
                _context.Entry(modifiedReservation).State = EntityState.Modified;

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!ReservationExists(id))
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

            return Forbid();
        }

        // POST: api/Reservations
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Reservation>> PostReservation(Reservation reservation)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            int authUserId = GetAuthorizedUserId(identity.Claims);
            string authUserRole = GetAuthorizedUserRole(identity.Claims);
            if (authUserId == reservation.UserId || authUserRole == "Admin")
            {
                _context.Reservations.Add(reservation);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetReservation", new { id = reservation.Id }, reservation);
            }

            return Forbid();
        }

        // DELETE: api/Reservations/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReservation(int id)
        {
            var reservation = await _context.Reservations.FindAsync(id);
            if (reservation == null)
            {
                return NotFound();
            }

            _context.Reservations.Remove(reservation);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ReservationExists(int id)
        {
            return _context.Reservations.Any(e => e.Id == id);
        }

        private int GetAuthorizedUserId(IEnumerable<Claim> claims)
        {
            return Convert.ToInt32(claims
                .Where(x => x.Type == ClaimTypes.NameIdentifier)
                .FirstOrDefault()
                .Value);
        }

        private string GetAuthorizedUserRole(IEnumerable<Claim> claims)
        {
            return claims
                .Where(x => x.Type == ClaimTypes.Role)
                .FirstOrDefault()
                .Value;
        }
    }
}
