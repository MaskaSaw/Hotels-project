﻿using System;
using System.Collections.Generic;

namespace Hotels.Models
{
    public partial class Room
    {
        public int Id { get; set; }
        public string RoomNumber { get; set; }
        public string RoomType { get; set; }
        public int VacantBeds { get; set; }
        public decimal Cost { get; set; }
        public string Image { get; set; }
        public int HotelId { get; set; }
        public virtual Hotel Hotel { get; set; }

        public virtual ICollection<Reservation> Reservations { get; set; }
        public virtual ICollection<RoomBlock> RoomBlocks { get; set; }
    }
}
