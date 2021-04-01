using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Hotels.Models
{
    public partial class RoomBlock
    {
        public int Id { get; set; }
        public DateTime CheckIn { get; set; }
        public DateTime CheckOut { get; set; }
        public DateTime End { get; set; }
        public int RoomId { get; set; }

        public virtual Room Room { get; set; }
    }
}
