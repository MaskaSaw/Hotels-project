using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Configuration;
using Hotels.Authentication;
using Hotels.DTO;
using Hotels.Models;
using System.Text;

namespace Hotels.Controllers
{
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthRepository _repo;
        private readonly IConfiguration _config;
        public AuthController(AuthRepository repo, IConfiguration config)
        {
            _repo = repo;
            _config = config;
        }

        //POST: api/auth/register
        [HttpPost("register")] 
        public async Task<IActionResult> Register(UserDTO userForRegister)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            userForRegister.Login = userForRegister.Login.ToLower();

            if (await _repo.UserExists(userForRegister.Login))
                return BadRequest("Username is already taken");

            var createdUser = await _repo.Register(userForRegister);

            return Created($"api/Users/{createdUser.Id}", createdUser);
        }

        //POST: api/auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login(UserDTO userForLogin)
        {
            var userFromRepo = await _repo.Login(userForLogin.Login.ToLower(), userForLogin.Password);
            if (userFromRepo == null) //User login failed
                return Unauthorized();

            //generate token
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_config.GetSection("AppSettings:TokenSecretKey").Value);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(
                    new Claim[]
                    {
                        new Claim(ClaimTypes.NameIdentifier,userFromRepo.Id.ToString()),
                        new Claim(ClaimTypes.Name, userFromRepo.Login),
                        new Claim(ClaimTypes.Role, userFromRepo.Role)
                    }
                ),

                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha512Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            return Ok(new { tokenString });
        }
    }
}
