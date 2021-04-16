using Hotels.ValidationAttributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Hotels.DTOs
{
    public partial class UserDTO
    {
        [Required]
        public int Id { get; set; }

        [Required]
        public string Login { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Surname { get; set; }

        public string FullName { get; set; }

        [Required]
        [StringLength(10, MinimumLength = 4, ErrorMessage = "You must specify a password between 4 and 10 characters.")]
        public string Password { get; set; }
        [Required]
        [UserRole]
        public string Role { get; set; }
    }
}
