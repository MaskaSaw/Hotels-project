using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Hotels.Models
{
    public class ReservationsParams
    {
        [FromQuery(Name = "hotelName")]
        public string HotelName { get; set; }
        [FromQuery(Name = "roomNumber")]
        public string RoomNumber { get; set; }
    }
}
