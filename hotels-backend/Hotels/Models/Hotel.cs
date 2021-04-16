using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Hotels.Models
{
    public partial class Hotel
    {
        [Required]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string Name { get; set; }

        [Required]
        [StringLength(20)]
        public string Country { get; set; }

        [Required]
        [StringLength(20)]
        public string City { get; set; }

        [Required]
        [StringLength(50)]
        public string Address { get; set; }

        [Url]
        public string Image { get; set; }

        public virtual ICollection<Room> Rooms { get; set; }
        public virtual ICollection<Service> Services { get; set; }
    }
}
