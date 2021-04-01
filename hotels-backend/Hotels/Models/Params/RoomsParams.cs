using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Hotels.Models.Params
{
    public class RoomsParams
    {
        [FromQuery(Name = "checkIn")]
        public DateTime? CheckIn { get; set; }
        [FromQuery(Name = "checkOut")]
        public DateTime? CheckOut { get; set; }
    }
}
