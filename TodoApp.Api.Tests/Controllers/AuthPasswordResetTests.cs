using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using TodoApp.Api.Controllers;
using TodoApp.Api.Dtos;
using TodoApp.Api.Models;
using TodoApp.Api.Services;

namespace TodoApp.Api.Tests.Controllers;

public sealed class AuthPasswordResetTests
{
    [Fact]
    public async Task ForgotPassword_WithoutSmtp_Returns503ForEveryAddress()
    {
        var users = new FakeUserManager { User = new ApplicationUser { Id = "user-1" } };
        var sender = new FakeSender { IsConfigured = false };
        var controller = CreateController(users, sender);

        var result = await controller.ForgotPassword(
            new ForgotPasswordRequest { Email = "user@example.com" },
            CancellationToken.None);

        Assert.Equal(503, Assert.IsType<StatusCodeResult>(result).StatusCode);
        Assert.Equal(0, users.EmailLookups);
        Assert.Null(sender.LastAddress);
    }

    [Fact]
    public async Task ForgotPassword_UsesGenericResponseForUnknownUser()
    {
        var sender = new FakeSender();
        var controller = CreateController(new FakeUserManager(), sender);

        var result = await controller.ForgotPassword(
            new ForgotPasswordRequest { Email = "unknown@example.com" },
            CancellationToken.None);

        Assert.IsType<AcceptedResult>(result);
        Assert.Null(sender.LastAddress);
    }

    [Fact]
    public async Task ForgotPassword_SendsEncodedTokenAndSelectedLanguage()
    {
        var users = new FakeUserManager
        {
            User = new ApplicationUser { Id = "user-1", Email = "user@example.com" }
        };
        var sender = new FakeSender();
        var controller = CreateController(users, sender);

        var result = await controller.ForgotPassword(
            new ForgotPasswordRequest { Email = " user@example.com ", Language = "ar" },
            CancellationToken.None);

        Assert.IsType<AcceptedResult>(result);
        Assert.Equal("user@example.com", users.LastEmailLookup);
        Assert.Equal("user@example.com", sender.LastAddress);
        Assert.Equal("ar", sender.LastLanguage);
        Assert.Contains("userId=user-1", sender.LastLink);
        Assert.Contains("token=A%2BB%2FC%3D", sender.LastLink);
    }

    [Fact]
    public async Task ResetPassword_RejectsUnknownUser()
    {
        var controller = CreateController(new FakeUserManager(), new FakeSender());

        var result = await controller.ResetPassword(ResetRequest());

        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task ResetPassword_ReturnsNoContentWhenIdentityAcceptsToken()
    {
        var users = new FakeUserManager { User = new ApplicationUser { Id = "user-1" } };
        var controller = CreateController(users, new FakeSender());

        var result = await controller.ResetPassword(ResetRequest());

        Assert.IsType<NoContentResult>(result);
        Assert.Equal("A+B/C=", users.LastResetToken);
    }

    [Fact]
    public async Task ResetPassword_RejectsInvalidToken()
    {
        var users = new FakeUserManager
        {
            User = new ApplicationUser { Id = "user-1" },
            ResetResult = IdentityResult.Failed(new IdentityError { Code = "InvalidToken" })
        };
        var controller = CreateController(users, new FakeSender());

        var result = await controller.ResetPassword(ResetRequest());

        Assert.IsType<BadRequestObjectResult>(result);
    }

    private static ResetPasswordRequest ResetRequest() => new()
    {
        UserId = "user-1",
        Token = "A+B/C=",
        NewPassword = "123456789012345",
        ConfirmPassword = "123456789012345"
    };

    private static AuthController CreateController(FakeUserManager users, FakeSender sender)
    {
        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Auth:ResetPasswordUrl"] = "http://localhost:4200/reset-password"
            })
            .Build();

        return new AuthController(
            users,
            null!,
            null!,
            sender,
            configuration,
            NullLogger<AuthController>.Instance);
    }

    private sealed class FakeSender : IPasswordResetEmailSender
    {
        public bool IsConfigured { get; set; } = true;
        public string? LastAddress { get; private set; }
        public string? LastLink { get; private set; }
        public string? LastLanguage { get; private set; }

        public Task SendAsync(
            string address,
            string resetLink,
            string language,
            CancellationToken cancellationToken)
        {
            LastAddress = address;
            LastLink = resetLink;
            LastLanguage = language;
            return Task.CompletedTask;
        }
    }

    private sealed class FakeUserManager : UserManager<ApplicationUser>
    {
        public FakeUserManager()
            : base(
                new StubStore(),
                Microsoft.Extensions.Options.Options.Create(new IdentityOptions()),
                new PasswordHasher<ApplicationUser>(),
                [],
                [],
                new UpperInvariantLookupNormalizer(),
                new IdentityErrorDescriber(),
                null!,
                NullLogger<UserManager<ApplicationUser>>.Instance)
        {
        }

        public ApplicationUser? User { get; set; }
        public IdentityResult ResetResult { get; set; } = IdentityResult.Success;
        public int EmailLookups { get; private set; }
        public string? LastEmailLookup { get; private set; }
        public string? LastResetToken { get; private set; }

        public override Task<ApplicationUser?> FindByEmailAsync(string email)
        {
            EmailLookups++;
            LastEmailLookup = email;
            return Task.FromResult(User);
        }

        public override Task<ApplicationUser?> FindByIdAsync(string userId) =>
            Task.FromResult(User);

        public override Task<string> GeneratePasswordResetTokenAsync(ApplicationUser user) =>
            Task.FromResult("A+B/C=");

        public override Task<IdentityResult> ResetPasswordAsync(
            ApplicationUser user,
            string token,
            string newPassword)
        {
            LastResetToken = token;
            return Task.FromResult(ResetResult);
        }
    }

    private sealed class StubStore : IUserStore<ApplicationUser>
    {
        public void Dispose() { }
        public Task<string> GetUserIdAsync(ApplicationUser user, CancellationToken cancellationToken) =>
            throw new NotSupportedException();
        public Task<string?> GetUserNameAsync(ApplicationUser user, CancellationToken cancellationToken) =>
            throw new NotSupportedException();
        public Task SetUserNameAsync(ApplicationUser user, string? userName, CancellationToken cancellationToken) =>
            throw new NotSupportedException();
        public Task<string?> GetNormalizedUserNameAsync(ApplicationUser user, CancellationToken cancellationToken) =>
            throw new NotSupportedException();
        public Task SetNormalizedUserNameAsync(ApplicationUser user, string? normalizedName, CancellationToken cancellationToken) =>
            throw new NotSupportedException();
        public Task<IdentityResult> CreateAsync(ApplicationUser user, CancellationToken cancellationToken) =>
            throw new NotSupportedException();
        public Task<IdentityResult> UpdateAsync(ApplicationUser user, CancellationToken cancellationToken) =>
            throw new NotSupportedException();
        public Task<IdentityResult> DeleteAsync(ApplicationUser user, CancellationToken cancellationToken) =>
            throw new NotSupportedException();
        public Task<ApplicationUser?> FindByIdAsync(string userId, CancellationToken cancellationToken) =>
            throw new NotSupportedException();
        public Task<ApplicationUser?> FindByNameAsync(string normalizedUserName, CancellationToken cancellationToken) =>
            throw new NotSupportedException();
    }
}
