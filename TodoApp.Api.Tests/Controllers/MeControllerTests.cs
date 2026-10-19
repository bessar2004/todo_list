using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using TodoApp.Api.Controllers;
using TodoApp.Api.Dtos;
using TodoApp.Api.Models;
using TodoApp.Api.Services;
using TodoApp.Api.Tests.Fakes;

namespace TodoApp.Api.Tests.Controllers;

public sealed class MeControllerTests : IDisposable
{
    private const string OldPassword = "Test-only old passphrase";
    private const string NewPassword = "Test-only new passphrase";
    private readonly UserManager<ApplicationUser> users = new(
        new MemoryAccountStore(), Options.Create(new IdentityOptions
        {
            Password = new PasswordOptions { RequiredLength = 15, RequireDigit = false,
                RequireLowercase = false, RequireUppercase = false, RequireNonAlphanumeric = false }
        }), new PasswordHasher<ApplicationUser>(), [new UserValidator<ApplicationUser>()],
        [new PasswordValidator<ApplicationUser>()], new UpperInvariantLookupNormalizer(),
        new IdentityErrorDescriber(), null!, NullLogger<UserManager<ApplicationUser>>.Instance);

    public void Dispose() => users.Dispose();

    [Fact]
    public async Task ProfileUpdate_TrimsName_ChangesOnlyAuthenticatedUser()
    {
        var user = await CreateUser("first");
        var other = await CreateUser("second");
        var stamp = user.SecurityStamp;
        var result = await Controller(user.Id).UpdateProfile(new() { FullName = "  Yeni Ad  " });

        var profile = Assert.IsType<CurrentUserResponse>(Assert.IsType<OkObjectResult>(result).Value);
        Assert.Equal("Yeni Ad", profile.FullName);
        Assert.Equal(user.Id, profile.UserId);
        Assert.Equal("first@example.com", profile.Email);
        Assert.Equal("second", other.FullName);
        Assert.Equal(stamp, user.SecurityStamp);
        Assert.True(await users.CheckPasswordAsync(user, OldPassword));
    }

    [Theory]
    [InlineData(null)]
    [InlineData("deleted-user")]
    public async Task MissingAccount_CannotReadOrChangeProfile(string? id)
    {
        var controller = Controller(id);
        Assert.IsType<UnauthorizedResult>(await controller.Get());
        Assert.IsType<UnauthorizedResult>(await controller.UpdateProfile(new() { FullName = "Name" }));
        Assert.IsType<UnauthorizedResult>(await controller.ChangePassword(PasswordRequest()));
    }

    [Fact]
    public async Task WrongCurrentPassword_LeavesPasswordAndSessionUnchanged()
    {
        var user = await CreateUser();
        var stamp = user.SecurityStamp;
        var request = PasswordRequest();
        request.CurrentPassword = "wrong password";
        var result = Assert.IsType<BadRequestObjectResult>(await Controller(user.Id).ChangePassword(request));

        Assert.Equal(400, result.StatusCode);
        Assert.Contains("PasswordMismatch", Assert.IsType<ValidationProblemDetails>(result.Value).Errors.Keys);
        Assert.Equal(stamp, user.SecurityStamp);
        Assert.True(await users.CheckPasswordAsync(user, OldPassword));
    }

    [Fact]
    public async Task ShortNewPassword_IsRejectedByIdentity()
    {
        var user = await CreateUser();
        var request = PasswordRequest();
        request.NewPassword = request.ConfirmPassword = "short";
        var result = Assert.IsType<BadRequestObjectResult>(await Controller(user.Id).ChangePassword(request));
        Assert.Contains("PasswordTooShort", Assert.IsType<ValidationProblemDetails>(result.Value).Errors.Keys);
        Assert.True(await users.CheckPasswordAsync(user, OldPassword));
    }

    [Fact]
    public async Task PasswordChange_RevokesOldSignedJwt_AndAcceptsNewSignedJwt()
    {
        var user = await CreateUser();
        // Test anahtarıdır; uygulamanın gerçek JWT anahtarı kullanılmaz.
        var key = Enumerable.Range(1, 32).Select(i => (byte)i).ToArray();
        var config = new ConfigurationBuilder().AddInMemoryCollection(new Dictionary<string, string?>
        {
            ["Jwt:SigningKey"] = Convert.ToBase64String(key),
            ["Jwt:Issuer"] = "test", ["Jwt:Audience"] = "test"
        }).Build();
        var tokens = new JwtTokenService(config);
        var oldToken = ValidateSignedToken(tokens.CreateToken(user), key);
        await new AccountTokenEvents(users).TokenValidated(oldToken);
        Assert.Null(oldToken.Result);
        Assert.NotEqual(user.SecurityStamp, oldToken.Principal!.FindFirst(AccountTokenEvents.SessionVersionClaim)!.Value);

        Assert.IsType<NoContentResult>(await Controller(user.Id).ChangePassword(PasswordRequest()));
        Assert.False(await users.CheckPasswordAsync(user, OldPassword));
        Assert.True(await users.CheckPasswordAsync(user, NewPassword));
        await new AccountTokenEvents(users).TokenValidated(oldToken);
        Assert.NotNull(oldToken.Result?.Failure);

        var newToken = ValidateSignedToken(tokens.CreateToken(user), key);
        await new AccountTokenEvents(users).TokenValidated(newToken);
        Assert.Null(newToken.Result);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("wrong-version")]
    public async Task TokenWithoutMatchingSessionVersion_IsRejected(string? version)
    {
        var user = await CreateUser();
        var claims = new List<Claim> { new("sub", user.Id) };
        if (version is not null) claims.Add(new(AccountTokenEvents.SessionVersionClaim, version));
        var context = TokenContext(new ClaimsPrincipal(new ClaimsIdentity(claims, "test")));
        await new AccountTokenEvents(users).TokenValidated(context);
        Assert.NotNull(context.Result?.Failure);
    }

    [Fact]
    public async Task DeletedUserToken_IsRejected()
    {
        var user = await CreateUser();
        var context = TokenContext(new ClaimsPrincipal(new ClaimsIdentity([
            new Claim("sub", user.Id),
            new Claim(AccountTokenEvents.SessionVersionClaim, AccountTokenEvents.GetSessionVersion(user))
        ], "test")));
        await users.DeleteAsync(user);
        await new AccountTokenEvents(users).TokenValidated(context);
        Assert.NotNull(context.Result?.Failure);
    }

    [Fact]
    public void RequestValidation_RejectsBlankOrLongNames_AndMismatchedPasswords()
    {
        foreach (var name in new[] { "", "   ", new string('a', 101) })
            Assert.False(IsValid(new UpdateProfileRequest { FullName = name }));
        var request = PasswordRequest();
        request.ConfirmPassword = "another password";
        Assert.False(IsValid(request));
        request.ConfirmPassword = request.NewPassword;
        request.CurrentPassword = "";
        Assert.False(IsValid(request));
        Assert.True(IsValid(PasswordRequest()));
    }

    private static bool IsValid(object value) => Validator.TryValidateObject(value, new ValidationContext(value), [], true);
    private static ChangePasswordRequest PasswordRequest() => new() { CurrentPassword = OldPassword, NewPassword = NewPassword, ConfirmPassword = NewPassword };

    private async Task<ApplicationUser> CreateUser(string name = "account")
    {
        var user = new ApplicationUser { UserName = name, FullName = name, Email = name + "@example.com" };
        Assert.True((await users.CreateAsync(user, OldPassword)).Succeeded);
        return user;
    }

    private MeController Controller(string? id) => new(users)
    {
        ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext
            {
                User = new ClaimsPrincipal(new ClaimsIdentity(id is null ? [] : new[] { new Claim("sub", id) }, "test"))
            }
        }
    };

    private static TokenValidatedContext TokenContext(ClaimsPrincipal principal) => new(
        new DefaultHttpContext(), new AuthenticationScheme("Bearer", "Bearer", typeof(JwtBearerHandler)), new JwtBearerOptions()) { Principal = principal };

    private static TokenValidatedContext ValidateSignedToken(string token, byte[] key)
    {
        var handler = new JwtSecurityTokenHandler { MapInboundClaims = false };
        var principal = handler.ValidateToken(token, new TokenValidationParameters
        {
            ValidIssuer = "test", ValidAudience = "test", IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuerSigningKey = true, ValidateLifetime = true, ClockSkew = TimeSpan.Zero
        }, out _);
        return TokenContext(principal);
    }
}
