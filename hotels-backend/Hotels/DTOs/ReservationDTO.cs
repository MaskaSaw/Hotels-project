using Hotels.JsonConverters;
using Hotels.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Hotels.DTOs
{
    public partial class ReservationDTO
    {
        public int Id { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        [JsonConverter(typeof(TimeSpanConverter))]
        public TimeSpan ArrivalTime { get; set; }

        [JsonConverter(typeof(TimeSpanConverter))]
        public TimeSpan DepartureTime { get; set; }

        public string HotelName { get; set; }
        public string Country { get; set; }
        public string City { get; set; }
        public string RoomNumber { get; set; }

        public int RoomId { get; set; }

        public virtual ICollection<ReservationService> ReservationServices { get; set; }
    }
}
