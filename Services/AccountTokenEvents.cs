using System.IdentityModel.Tokens.Jwt;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using TodoApp.Api.Models;

namespace TodoApp.Api.Services;

// Şifre değişince/sıfırlanınca eski JWT'leri bir sonraki API isteğinde reddeder.
public sealed class AccountTokenEvents(UserManager<ApplicationUser> userManager) : JwtBearerEvents
{
    public const string SessionVersionClaim = "session_version";

    public static string GetSessionVersion(ApplicationUser user)
    {
        if (string.IsNullOrWhiteSpace(user.SecurityStamp))
            throw new InvalidOperationException("Hesabın güvenlik damgası eksik.");

        // Identity'nin ham güvenlik damgasını tarayıcıya göndermeyiz.
        return Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(user.SecurityStamp)));
    }

    public override async Task TokenValidated(TokenValidatedContext context)
    {
        var userId = context.Principal?.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
        var version = context.Principal?.FindFirst(SessionVersionClaim)?.Value;
        if (string.IsNullOrWhiteSpace(userId) || string.IsNullOrWhiteSpace(version))
        {
            context.Fail("Geçersiz oturum.");
            return;
        }

        var user = await userManager.FindByIdAsync(userId);
        if (user is null || string.IsNullOrWhiteSpace(user.SecurityStamp)
            || version != GetSessionVersion(user))
            context.Fail("Oturum artık geçerli değil.");
    }
}
