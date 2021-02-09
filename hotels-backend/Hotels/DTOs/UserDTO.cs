using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Hotels.DTO
{
    public partial class UserDTO
    {
       // public int Id { get; set; }

        [Required]
        public string Login { get; set; }

        [Required]
        [StringLength(10, MinimumLength = 4, ErrorMessage = "You must specify a password between 4 and 10 characters.")]
        public string Password { get; set; }
        public string Role { get; set; }
    }
}
