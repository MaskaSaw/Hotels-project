using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Hotels.ValidationAttributes
{
    public class RoomTypeAttribute : ValidationAttribute
    {
        private readonly List<string> _roomTypes = new List<string>()
        {
            "Standart",
            "Bedroom",
            "Balcony",
            "Superior",
            "Studio",
            "Suit",
            "Buisness",
            "Duplex",
            "Apartment",
            "Cottage",
            "President"
        };

        public string GetErrorMessage()
        {
            var resultString = "Room type should be one of the following: ";
            foreach (var str in _roomTypes)
            {
                resultString = $"{resultString}{str}, ";
            }

            return resultString;
        }

        protected override ValidationResult IsValid(object roomType, ValidationContext validationContext)
        {

            if (_roomTypes.Contains(roomType))
            {
                return ValidationResult.Success;
            }

            return new ValidationResult(GetErrorMessage());

        }
    }
}
