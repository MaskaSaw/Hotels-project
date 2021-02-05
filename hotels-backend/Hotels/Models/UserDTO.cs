using System;
using System.Collections.Generic;

namespace Hotels.Models
{
    public partial class UserDTO
    {
        public int Id { get; set; }
        public string Login { get; set; }
        public string Password { get; set; }
        public bool IsAdmin { get; set; }
    }
}
