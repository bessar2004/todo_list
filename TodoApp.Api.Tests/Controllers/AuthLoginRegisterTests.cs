using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using System.Security.Claims;
using TodoApp.Api.Controllers;
using TodoApp.Api.Dtos;
using TodoApp.Api.Models;
using TodoApp.Api.Services;
using SignInResult = Microsoft.AspNetCore.Identity.SignInResult;

namespace TodoApp.Api.Tests.Controllers;

public sealed class AuthLoginRegisterTests
{
    [Fact]
    public async Task Register_TrimsInputAndReturns201()
    {
        var users = new FakeUserManager();
        var controller = CreateController(users, new FakeSignInManager(users));

        var result = await controller.Register(new RegisterRequest
        {
            FullName = "  Ali Veli ",
            Email = " ali@example.com ",
            Password = "123456789012345",
            ConfirmPassword = "123456789012345"
        });

        Assert.Equal(201, Assert.IsType<StatusCodeResult>(result).StatusCode);
        Assert.Equal("Ali Veli", users.Created!.FullName);
        Assert.Equal("ali@example.com", users.Created.Email);
        Assert.Equal("ali@example.com", users.Created.UserName);
    }

    [Fact]
    public async Task Register_WhenIdentityRejects_ReturnsValidationProblem()
    {
        var users = new FakeUserManager
        {
            CreateResult = IdentityResult.Failed(new IdentityError { Code = "DuplicateEmail", Description = "Zaten var" })
        };
        var controller = CreateController(users, new FakeSignInManager(users));

        var result = await controller.Register(new RegisterRequest
        {
            FullName = "Ali", Email = "ali@example.com", Password = "123456789012345", ConfirmPassword = "123456789012345"
        });

        var problem = Assert.IsType<ObjectResult>(result);
        Assert.IsType<ValidationProblemDetails>(problem.Value);
    }

    [Fact]
    public async Task Login_WithUnknownEmail_ReturnsUnauthorized()
    {
        var users = new FakeUserManager();
        var controller = CreateController(users, new FakeSignInManager(users));

        var result = await controller.Login(new LoginRequest { Email = "none@example.com", Password = "x" });

        Assert.IsType<UnauthorizedResult>(result);
    }

    [Fact]
    public async Task Login_WithWrongPassword_ReturnsUnauthorized()
    {
        var users = new FakeUserManager { User = new ApplicationUser { Id = "u1", SecurityStamp = "stamp" } };
        var signIn = new FakeSignInManager(users) { Result = SignInResult.Failed };
        var controller = CreateController(users, signIn);

        var result = await controller.Login(new LoginRequest { Email = "ali@example.com", Password = "wrong" });

        Assert.IsType<UnauthorizedResult>(result);
        Assert.True(signIn.LockoutOnFailure);
    }

    [Fact]
    public async Task Login_WithLockedOutAccount_ReturnsUnauthorized()
    {
        var users = new FakeUserManager { User = new ApplicationUser { Id = "u1", SecurityStamp = "stamp" } };
        var controller = CreateController(users, new FakeSignInManager(users) { Result = SignInResult.LockedOut });

        var result = await controller.Login(new LoginRequest { Email = "ali@example.com", Password = "right" });

        Assert.IsType<UnauthorizedResult>(result);
    }

    [Fact]
    public async Task Login_WithValidCredentials_ReturnsAccessToken()
    {
        var users = new FakeUserManager { User = new ApplicationUser { Id = "u1", SecurityStamp = "stamp" } };
        var controller = CreateController(users, new FakeSignInManager(users) { Result = SignInResult.Success });

        var result = await controller.Login(new LoginRequest { Email = " ali@example.com ", Password = "right" });

        var ok = Assert.IsType<OkObjectResult>(result);
        var token = ok.Value!.GetType().GetProperty("accessToken")!.GetValue(ok.Value) as string;
        Assert.False(string.IsNullOrWhiteSpace(token));
        Assert.Equal("ali@example.com", users.LastEmailLookup);
    }

    private static AuthController CreateController(FakeUserManager users, FakeSignInManager signIn)
    {
        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Jwt:SigningKey"] = Convert.ToBase64String(new byte[32]),
                ["Jwt:Issuer"] = "test",
                ["Jwt:Audience"] = "test"
            })
            .Build();

        return new AuthController(
            users,
            signIn,
            new JwtTokenService(configuration),
            null!,
            configuration,
            NullLogger<AuthController>.Instance);
    }

    private sealed class FakeUserManager : UserManager<ApplicationUser>
    {
        public FakeUserManager()
            : base(
                new Fakes.MemoryAccountStore(),
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
        public ApplicationUser? Created { get; private set; }
        public IdentityResult CreateResult { get; set; } = IdentityResult.Success;
        public string? LastEmailLookup { get; private set; }

        public override Task<ApplicationUser?> FindByEmailAsync(string email)
        {
            LastEmailLookup = email;
            return Task.FromResult(User);
        }

        public override Task<IdentityResult> CreateAsync(ApplicationUser user, string password)
        {
            Created = user;
            return Task.FromResult(CreateResult);
        }
    }

    private sealed class FakeSignInManager : SignInManager<ApplicationUser>
    {
        public FakeSignInManager(UserManager<ApplicationUser> users)
            : base(
                users,
                new HttpContextAccessor { HttpContext = new DefaultHttpContext() },
                new NoClaimsFactory(),
                Microsoft.Extensions.Options.Options.Create(new IdentityOptions()),
                NullLogger<SignInManager<ApplicationUser>>.Instance,
                null!,
                null!)
        {
        }

        public SignInResult Result { get; set; } = SignInResult.Failed;
        public bool LockoutOnFailure { get; private set; }

        public override Task<SignInResult> CheckPasswordSignInAsync(
            ApplicationUser user,
            string password,
            bool lockoutOnFailure)
        {
            LockoutOnFailure = lockoutOnFailure;
            return Task.FromResult(Result);
        }
    }

    private sealed class NoClaimsFactory : IUserClaimsPrincipalFactory<ApplicationUser>
    {
        public Task<ClaimsPrincipal> CreateAsync(ApplicationUser user) =>
            Task.FromResult(new ClaimsPrincipal());
    }
}
