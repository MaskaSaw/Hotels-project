using Hotels.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Hotels.DTOs
{
    public class HotelDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Country { get; set; }
        public string City { get; set; }
        public string Address { get; set; }
        public string Image { get; set; }
        public int RoomCount { get; set; }
        public virtual ICollection<Service> Services { get; set; }
    }
}
