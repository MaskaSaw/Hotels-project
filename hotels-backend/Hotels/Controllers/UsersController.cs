using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Hotels.Models;
using Hotels.DTOs;
using Hotels.Authentication;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Hotels.Extensions;

namespace Hotels.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly HotelsDBContext _context;
        private readonly AuthService _authService;
        private const int MaxItemsPerPage = 100;

        public UsersController(HotelsDBContext context, AuthService authService)
        {
            _context = context;
            _authService = authService;
        }

        // GET: api/Users
        [Authorize (Roles = "Admin")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDTO>>> GetUsers([FromQuery] int page, int itemsPerPage)
        {
            int returnedNumberOfItems = (MaxItemsPerPage < itemsPerPage) ? MaxItemsPerPage : itemsPerPage;
            var users = await _context.Users
                .Skip((page - 1) * returnedNumberOfItems)
                .Take(returnedNumberOfItems)
                .Include(user => user.Reservations)
                .ToListAsync();

            return users
                .Select(user => new UserDTO
                {
                    Id = user.Id,
                    Login = user.Login,
                    Name = user.Name,
                    Surname = user.Surname,
                    Password = string.Empty,
                    Role = user.Role
                })
                .ToList();
        }

        // GET: api/Users/5
        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        //GET: api/Users/Names
        [Authorize]
        [HttpGet("Names")]
        public async Task<ActionResult<IEnumerable<UserDTO>>> GetUsersByName([FromQuery]string namePart)
        {
            return await _context.Users
                .Where(user => user.Login.Contains(namePart))
                .Select(user => new UserDTO
                {
                    Id = user.Id,
                    Login = user.Login,
                    Name = user.Name,
                    Surname = user.Surname,
                    Password = string.Empty,
                    Role = user.Role
                })
                .ToListAsync();
        }

        // GET: api/Users/5/Reservations
        [Authorize]
        [HttpGet("{id}/Reservations")]
        public async Task<ActionResult<IEnumerable<ReservationDTO>>> GetReservations(
            int id,
            [FromQuery] ReservationsParams inputParams
        )
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;

            if (identity.GetAuthorizedUserId() == id || identity.GetAuthorizedUserRole() == "Admin")
            {
                var reservations = _context.Reservations
                    .Include(reservation => reservation.ReservationServices)
                    .Where(reservation => reservation.UserId == id)
                    .AsQueryable();

                if (!string.IsNullOrEmpty(inputParams.HotelName))
                {
                    reservations = reservations.Where(reservation => reservation.Room.Hotel.Name.Contains(inputParams.HotelName));
                }

                if (!string.IsNullOrEmpty(inputParams.RoomNumber))
                {
                    reservations = reservations.Where(reservation => reservation.Room.RoomNumber.Contains(inputParams.RoomNumber));
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
                            ReservationServices = reservation.ReservationServices,
                            RoomNumber = reservation.Room.RoomNumber,
                            HotelName = reservation.Room.Hotel.Name,
                            Country = reservation.Room.Hotel.Country,
                            City = reservation.Room.Hotel.City
                        }
                    )
                    .ToListAsync();
            }

            return Forbid();
        }

        [Authorize]
        [HttpGet("{id}/Reservations/Detailed")]
        public async Task<ActionResult<IEnumerable<ReservationDTO>>> GetReservationsDetailed(int id, [FromQuery] bool all)
        {
            var reservations = _context.Reservations
                .Include(reservation => reservation.ReservationServices)
                .Where(reservation => reservation.UserId == id)
                .AsQueryable();

            if (!all)
            {
                reservations = reservations
                    .Where(reservation => reservation.StartDate >= DateTime.Today);
            };

            return await reservations
                .Select(reservation =>
                    new ReservationDTO
                    {
                        Id = reservation.Id,
                        RoomId = reservation.RoomId,
                        UserId = reservation.UserId,
                        UserName = reservation.User.Name + " " + reservation.User.Surname,
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
                )
                .ToListAsync();
        }

        // PUT: api/Users/5
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, UserDTO userDTO)
        {
            if (id != userDTO.Id)
            {
                return BadRequest();
            }

            var identity = HttpContext.User.Identity as ClaimsIdentity;

            if (identity.GetAuthorizedUserId() == id || identity.GetAuthorizedUserRole() == "Admin")
            {
                var hash = _authService.CreatePasswordHash(userDTO.Password);
                User user = new User
                {
                    Id = userDTO.Id,
                    Login = userDTO.Login,
                    Name = userDTO.Name,
                    Surname = userDTO.Surname,
                    PasswordHash = hash.passwordHash,
                    PasswordSalt = hash.passwordSalt,
                    Role = userDTO.Role
                };

                _context.Entry(user).State = EntityState.Modified;

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!UserExists(id))
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

        // POST: api/Users
        [Authorize (Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<User>> PostUser(UserDTO userDTO)
        {
            userDTO.Login = userDTO.Login.ToLower();
            var user = await _authService.Register(userDTO);

            return CreatedAtAction("GetUser", new { id = user.Id }, userDTO);
        }

        // DELETE: api/Users/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            var identity = HttpContext.User.Identity as ClaimsIdentity;

            if (identity.GetAuthorizedUserId() == id || identity.GetAuthorizedUserRole() == "Admin")
            {
                _context.Users.Remove(user);

                var reservations = await _context.Reservations
                    .Where(x => x.UserId == id)
                    .ToListAsync();

                foreach (var reservation in reservations)
                {
                    _context.Reservations.Remove(reservation);
                }
                await _context.SaveChangesAsync();

                return NoContent();
            }

            return Forbid();
        }

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.Id == id);
        }
    }
}
