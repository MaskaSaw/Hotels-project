using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Hotels.Extensions
{
    public static class IdentityExtension
    {
        public static int GetAuthorizedUserId(this ClaimsIdentity identity)
        {
            return Convert.ToInt32(
                identity.Claims
                    .Where(x => x.Type == ClaimTypes.NameIdentifier)
                    .FirstOrDefault()
                    .Value
            );
        }

        public static string GetAuthorizedUserRole(this ClaimsIdentity identity)
        {
            return identity.Claims
                .Where(x => x.Type == ClaimTypes.Role)
                .FirstOrDefault()
                .Value;
        }
    }
}
