using System;
using System.Collections.Generic;

#nullable disable

namespace Hotels.Models
{
    public partial class Room
    {
        public Room()
        {
        //    Reservations = new HashSet<Reservation>();
        }

        public int Id { get; set; }
        public string RoomType { get; set; }
        public int? VacantBeds { get; set; }
        public int? Cost { get; set; }
        public bool? Available { get; set; }
        public bool? Reserved { get; set; }
        public string Image { get; set; }
        public int HotelId { get; set; }

      //  public virtual Hotel Hotel { get; set; }
      //  public virtual ICollection<Reservation> Reservations { get; set; }
    }
}
