using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using TodoApp.Api.Models;

namespace TodoApp.Api.Services;

public sealed class JwtTokenService
{
    private readonly IConfiguration _configuration;

    public JwtTokenService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    // JWT token oluşturmak için kullanılan bir servis sınıfıdır
    public string CreateToken(ApplicationUser user)
    {
        var now = DateTime.UtcNow;

        var key = Convert.FromBase64String(
            _configuration["Jwt:SigningKey"]
                ?? throw new InvalidOperationException("Jwt:SigningKey eksik."));

        // JWT token oluşturmak için gerekli olan kullanıcı bilgilerini ve imzalama anahtarını kullanır.
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };
        // JWT token oluşturur ve kullanıcıya geri döndürür. Token, kullanıcının kimliğini doğrulamak ve yetkilendirmek için kullanılır.
        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            notBefore: now,
            expires: now.AddMinutes(15),
            signingCredentials: new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256));

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}