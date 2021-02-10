using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Hotels.Extensions
{
    public static class ControllerExtension
    {
        public static (int authUserId, string authUserRole) GetIdentity(this ControllerBase controller)
        {
            var identity = controller.HttpContext.User.Identity as ClaimsIdentity;
            int authUserId = GetAuthorizedUserId(identity.Claims);
            string authUserRole = GetAuthorizedUserRole(identity.Claims);

            return (authUserId, authUserRole);
        }

        private static int GetAuthorizedUserId(IEnumerable<Claim> claims)
        {
            return Convert.ToInt32(claims
                .Where(x => x.Type == ClaimTypes.NameIdentifier)
                .FirstOrDefault()
                .Value);
        }

        private static string GetAuthorizedUserRole(IEnumerable<Claim> claims)
        {
            return claims
                .Where(x => x.Type == ClaimTypes.Role)
                .FirstOrDefault()
                .Value;
        }
    }
}
