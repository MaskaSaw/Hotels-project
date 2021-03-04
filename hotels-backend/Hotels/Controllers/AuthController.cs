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
using Hotels.DTOs;
using Hotels.Models;
using System.Text;

namespace Hotels.Controllers
{
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;
        private readonly IConfiguration _config;
        public AuthController(AuthService authService, IConfiguration config)
        {
            _authService = authService;
            _config = config;
        }

        //POST: api/auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register(UserDTO userForRegister)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            userForRegister.Login = userForRegister.Login.ToLower();

            if (await _authService.UserExists(userForRegister.Login))
            {
                return BadRequest("Username is already taken");
            }

            var createdUser = await _authService.Register(userForRegister);

            return Created($"api/Users/{createdUser.Id}", createdUser);
        }

        //POST: api/auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody]UserDTO userForLogin)
        {
            var userFromRepo = await _authService.Login(userForLogin.Login.ToLower(), userForLogin.Password);

            if (userFromRepo == null)
            {
                return Unauthorized();
            }

            var tokenString = CreateTokenString(userFromRepo);

            return Ok(new { tokenString });
        }

        private string CreateTokenString(User user)
        {
            //generate token
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_config.GetSection("AppSettings:TokenSecretKey").Value);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(
                    new Claim[]
                    {
                        new Claim(ClaimTypes.NameIdentifier,user.Id.ToString()),
                        new Claim(ClaimTypes.Name, user.Login),
                        new Claim(ClaimTypes.Role, user.Role)
                    }
                ),

                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha512Signature
                )
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
