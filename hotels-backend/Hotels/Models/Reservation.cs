﻿using System;
using System.Collections.Generic;

namespace Hotels.Models
{
    public partial class Reservation
    {
        public int Id { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public TimeSpan ArrivalTime { get; set; }
        public bool Parking { get; set; }
        public bool Massage { get; set; }
        public bool ExtraTowels { get; set; }

        public int UserId { get; set; }
        public int RoomId { get; set; }
    }
}
