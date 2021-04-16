using Hotels.JsonConverters;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Hotels.Models
{
    public partial class Reservation
    {
        [Required]
        public int Id { get; set; }

        [Required]
        [DataType(DataType.Date)]
        public DateTime StartDate { get; set; }

        [Required]
        [DataType(DataType.Date)]
        public DateTime EndDate { get; set; }

        [JsonConverter(typeof(TimeSpanConverter))]
        public TimeSpan ArrivalTime { get; set; }

        [JsonConverter(typeof(TimeSpanConverter))]
        public TimeSpan DepartureTime { get; set; }
        [Required]
        public int UserId { get; set; }

        [Required]
        [Range(0, 999999.99)]
        public decimal Cost { get; set; }

        [Required]
        public int RoomId { get; set; }
        public virtual Room Room { get; set; }
        public virtual User User { get; set; }

        public virtual ICollection<ReservationService> ReservationServices { get; set; }
    }
}
