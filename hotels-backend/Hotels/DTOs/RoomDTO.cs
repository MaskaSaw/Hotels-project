using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Hotels.DTOs
{
    public class RoomDTO
    {
        public int Id { get; set; }
        public string RoomNumber { get; set; }
        public string RoomType { get; set; }
        public int VacantBeds { get; set; }
        public decimal Cost { get; set; }
        public string Image { get; set; }
        public int HotelId { get; set; }
    }
}
