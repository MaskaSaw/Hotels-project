using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Hotels.Models
{
    public class HotelsParams
    {
        [FromQuery(Name = "globalSearch")]
        public bool GlobalSearch { get; set; }
        [FromQuery(Name = "checkIn")]
        public DateTime? CheckIn { get; set; }
        [FromQuery(Name = "checkOut")]
        public DateTime? CheckOut { get; set; }
        [FromQuery(Name = "hotelName")]
        public string HotelName { get; set; }
        [FromQuery(Name = "city")]
        public string City { get; set; }
        [FromQuery(Name = "country")]
        public string Country { get; set; }
        [FromQuery(Name = "numberOfResidents")]
        public int? NumberOfResidents { get; set; }
    }
}
