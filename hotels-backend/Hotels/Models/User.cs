using System;
using System.Collections.Generic;

namespace Hotels.Models
{
    public partial class User
    {
        public int Id { get; set; }
        public string Login { get; set; }
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }
        public string Role { get; set; }

        public virtual ICollection<Reservation> Reservations { get; set; }
    }
}
