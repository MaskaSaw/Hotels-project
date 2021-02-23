using Hotels.JsonConverters;
using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Hotels.Models
{
    public partial class Reservation
    {
        public int Id { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        [JsonConverter(typeof(TimeSpanConverter))]
        public TimeSpan ArrivalTime { get; set; }
        public bool Parking { get; set; }
        public bool Massage { get; set; }
        public bool ExtraTowels { get; set; }

        public int UserId { get; set; }
        public int RoomId { get; set; }
    }
}
