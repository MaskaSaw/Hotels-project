using Hotels.ValidationAttributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Hotels.Models
{
    public partial class Room
    {
        [Required]
        public int Id { get; set; }

        [Required]
        [StringLength(20)]
        public string RoomNumber { get; set; }

        [Required]
        [RoomType]
        public string RoomType { get; set; }

        [Required]
        [Range(1, 50)]
        public int VacantBeds { get; set; }

        [Required]
        [Range(0, 9999.99)]
        public decimal Cost { get; set; }

        [Url]
        public string Image { get; set; }

        [Required]
        public int HotelId { get; set; }
        public virtual Hotel Hotel { get; set; }

        public virtual ICollection<Reservation> Reservations { get; set; }
        public virtual ICollection<RoomBlock> RoomBlocks { get; set; }
    }
}
