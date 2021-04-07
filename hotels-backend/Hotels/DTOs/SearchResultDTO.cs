using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Hotels.DTOs
{
    public class SearchResultDTO
    {
        public string ViewField { get; set; }
        public string FilterData { get; set; }
        public string AdditionalFilterData { get; set; }
        public string Type { get; set; }
    }
}
