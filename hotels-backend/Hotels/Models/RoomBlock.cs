using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Hotels.Models
{
    public partial class RoomBlock
    {
        [Required]
        public int Id { get; set; }

        [Required]
        public DateTime CheckIn { get; set; }

        [Required]
        public DateTime CheckOut { get; set; }

        [Required]
        public DateTime End { get; set; }

        [Required]
        public int RoomId { get; set; }

        public virtual Room Room { get; set; }
    }
}
