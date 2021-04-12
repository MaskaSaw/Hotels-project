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
using Hotels.Extensions;
using Hotels.DTOs;
using Microsoft.AspNetCore.SignalR;
using Hotels.HubConfig;

namespace Hotels.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReservationsController : ControllerBase
    {
        private readonly HotelsDBContext _context;
        private IHubContext<ReservationDataHub> _hub;
        private readonly int _itemsCount = 100;

        public ReservationsController(HotelsDBContext context, IHubContext<ReservationDataHub> hub)
        {
            _context = context;
            _hub = hub;
        }

        // GET: api/Reservations
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Reservation>>> GetReservations([FromQuery] int page)
        {
            return await _context.Reservations
                .Skip((page - 1) * _itemsCount)
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

            if (identity.GetAuthorizedUserId() == reservation.UserId || identity.GetAuthorizedUserRole() == "Admin")
            {
                return reservation;
            }

            return Forbid();
        }

        // PUT: api/Reservations/5
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutReservation(int id, Reservation reservation)
        {
            if (id != reservation.Id)
            {
                return BadRequest();
            }

            var existingServices = await _context.ReservationServices
                .Where(service => service.ReservationId == id)
                .ToListAsync();

            var identity = HttpContext.User.Identity as ClaimsIdentity;

            if (identity.GetAuthorizedUserId() == reservation.UserId || identity.GetAuthorizedUserRole() == "Admin")
            {

                foreach (var service in reservation.ReservationServices)
                {
                    var existingService = existingServices.Find(existingService => existingService.Id == service.Id);

                    if (existingService != null)
                    {
                        _context.Entry(existingService).CurrentValues.SetValues(service);
                    }
                    else
                    {
                        _context.ReservationServices.Add(service);
                    }
                }

                foreach (var existingService in existingServices)
                {
                    if (!reservation.ReservationServices.Any(service => service.Id == existingService.Id))
                    {
                        _context.ReservationServices.Remove(existingService);
                    }
                }

                _context.Entry(reservation).State = EntityState.Modified;

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
        public async Task<ActionResult<ReservationDTO>> PostReservation(Reservation reservation)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;

            if (identity.GetAuthorizedUserId() == reservation.UserId || identity.GetAuthorizedUserRole() == "Admin")
            {
                _context.Reservations.Add(reservation);
                await _context.SaveChangesAsync();

                var createdReservation = await _context.Reservations
                    .Include(createdReservation => createdReservation.ReservationServices)
                    .Include(createdReservation => createdReservation.Room)
                    .Include(createdReservation => createdReservation.Room.Hotel)
                    .Include(createdReservation => createdReservation.User)
                    .FirstOrDefaultAsync(createdReservation => reservation.Id == createdReservation.Id);

                await _hub.Clients.All.SendAsync("transferCreatedReservationData",
                    new ReservationCreatedSignalDTO
                    {
                        HotelId = createdReservation.Room.HotelId
                    }
                );

                return CreatedAtAction("GetReservation",
                    new { id = reservation.Id },
                    new ReservationDTO
                    {
                        Id = reservation.Id,
                        RoomId = reservation.RoomId,
                        UserId = reservation.UserId,
                        UserName = reservation.User.Login,
                        ArrivalTime = reservation.ArrivalTime,
                        DepartureTime = reservation.DepartureTime,
                        StartDate = reservation.StartDate,
                        EndDate = reservation.EndDate,
                        ReservationServices = reservation.ReservationServices,
                        RoomNumber = reservation.Room.RoomNumber,
                        HotelName = reservation.Room.Hotel.Name,
                        Country = reservation.Room.Hotel.Country,
                        City = reservation.Room.Hotel.City
                    }
                );
            }

            return Forbid();
        }

        // DELETE: api/Reservations/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReservation(int id)
        {
            var reservation = await _context.Reservations
                .Include(reservation => reservation.ReservationServices)
                .FirstOrDefaultAsync(reservation => reservation.Id == id);

            if (reservation == null)
            {
                return NotFound();
            }

            var identity = HttpContext.User.Identity as ClaimsIdentity;

            if (identity.GetAuthorizedUserId() == reservation.UserId || identity.GetAuthorizedUserRole() == "Admin")
            {
                _context.Reservations.Remove(reservation);
                await _context.SaveChangesAsync();

                return NoContent();
            }

            return Forbid();
        }

        private bool ReservationExists(int id)
        {
            return _context.Reservations.Any(e => e.Id == id);
        }
    }
}
