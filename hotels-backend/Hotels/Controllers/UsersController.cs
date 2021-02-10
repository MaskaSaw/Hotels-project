using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Hotels.Models;
using Hotels.DTO;
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
        public async Task<ActionResult<IEnumerable<User>>> GetUsers([FromQuery] int page, int itemsPerPage)
        {
            int returnedNumberOfItems = (MaxItemsPerPage < itemsPerPage) ? MaxItemsPerPage : itemsPerPage;
            return await _context.Users
                .Skip((page - 1) * returnedNumberOfItems)
                .Take(returnedNumberOfItems)
                .ToListAsync();
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

        // GET: api/Users/5/Reservations
        [Authorize]
        [HttpGet("{id}/Reservations")]
        public async Task<ActionResult<IEnumerable<Reservation>>> GetReservations(int id)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;

            if (identity.GetAuthorizedUserId() == id || identity.GetAuthorizedUserRole() == "Admin")
            {
                return await _context.Reservations
                    .Where(reservation => reservation.UserId == id)
                    .ToListAsync();
            }

            return Forbid();         
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
