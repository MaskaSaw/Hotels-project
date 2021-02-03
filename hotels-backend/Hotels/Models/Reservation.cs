using System;
using System.Collections.Generic;

#nullable disable

namespace Hotels.Models
{
    public partial class Reservation
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int RoomId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public TimeSpan ArrivalTime { get; set; }
        public bool Parking { get; set; }
        public bool Massage { get; set; }
        public bool ExtraTowels { get; set; }

        public virtual Room Room { get; set; }
        public virtual User User { get; set; }
    }
}
