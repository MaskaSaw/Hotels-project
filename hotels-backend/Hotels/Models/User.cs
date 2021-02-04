using System;
using System.Collections.Generic;

#nullable disable

namespace Hotels.Models
{
    public partial class User
    {
        public int Id { get; set; }
        public string Login { get; set; }
        public string Password { get; set; }
        public bool IsAdmin { get; set; }

        public virtual ICollection<Reservation> Reservations { get; set; }
    }
}
