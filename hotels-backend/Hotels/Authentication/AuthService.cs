﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Hotels.Models;
using Hotels.DTOs;
using System.Text;
using Microsoft.EntityFrameworkCore;

namespace Hotels.Authentication
{
    public class AuthService
    {
        private readonly HotelsDBContext _context;

        public AuthService(HotelsDBContext context)
        {
            _context = context;
        }

        public async Task<User> Login(string login, string password)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Login == login);

            if (user == null)
            {
                return null;
            }

            if (!VerifyPassword(password, user.PasswordHash, user.PasswordSalt))
            {
                return null;
            }

            return user;
        }

        private bool VerifyPassword(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512(passwordSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                return computedHash.SequenceEqual(passwordHash);
            }
        }

        public async Task<User> Register(UserDTO userDTO)
        {
            var hash = CreatePasswordHash(userDTO.Password);

            User user = new User
            {
                Login = userDTO.Login,
                Name = userDTO.Name,
                Surname = userDTO.Surname,
                PasswordHash = hash.passwordHash,
                PasswordSalt = hash.passwordSalt,
                Role = userDTO.Role
            };

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            return user;
        }

        public (byte[] passwordHash, byte[] passwordSalt) CreatePasswordHash(string password)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                byte[] passwordSalt = hmac.Key;
                byte[] passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));

                return (passwordHash, passwordSalt);
            }
        }

        public async Task<bool> UserExists(string login)
        {
            if (await _context.Users.AnyAsync(x => x.Login == login))
            {
                return true;
            }

            return false;
        }
    }
}
