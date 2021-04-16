using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Hotels.Models
{
    public partial class Service
    {
        [Required]
        public int Id { get; set; }
        [Required]
        [StringLength(20)]
        public string Name { get; set; }
        [Required]
        [Range(0, 9999.99)]
        public decimal Cost { get; set; }
        [Required]
        public int HotelId { get; set; }
    }
}
