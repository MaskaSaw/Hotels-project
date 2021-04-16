using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Hotels.ValidationAttributes
{
    public class UserRoleAttribute : ValidationAttribute
    {
        private readonly List<string> _roles = new List<string>()
        {
             "User",
            "Admin"
        };

        public string GetErrorMessage() =>
            "User role should be neither 'User' or 'Admin'";

        protected override ValidationResult IsValid(object role, ValidationContext validationContext)
        {

            if (_roles.Contains(role))
            {
                return ValidationResult.Success;
            }

            return new ValidationResult(GetErrorMessage());

        }
    }
}
