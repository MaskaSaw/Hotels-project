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

        [JsonConverter(typeof(TimeSpanConverter))]
        public TimeSpan DepartureTime { get; set; }

        public int UserId { get; set; }
        public int RoomId { get; set; }
        public virtual Room Room { get; set; }
        public virtual User User { get; set; }

        public virtual ICollection<ReservationService> ReservationServices { get; set; }
    }
}
