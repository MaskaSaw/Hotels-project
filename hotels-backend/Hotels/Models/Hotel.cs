using System;
using System.Collections.Generic;

#nullable disable

namespace Hotels.Models
{
    public partial class Hotel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Country { get; set; }
        public string City { get; set; }
        public string Address { get; set; }
        public bool Parking { get; set; }
        public bool Massage { get; set; }
        public bool ExtraTowels { get; set; }
        public string Image { get; set; }

        public virtual ICollection<Room> Rooms { get; set; }
    }
}
