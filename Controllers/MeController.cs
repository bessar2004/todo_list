using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using TodoApp.Api.Dtos;
using TodoApp.Api.Models;

namespace TodoApp.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/me")]
public sealed class MeController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;

    public MeController(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var userId = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;

        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized();
        }

        var user = await _userManager.FindByIdAsync(userId);

        if (user is null)
        {
            return Unauthorized();
        }

        return Ok(ToResponse(user));
    }

    [HttpPut]
    public async Task<IActionResult> UpdateProfile(UpdateProfileRequest request)
    {
        var user = await FindCurrentUserAsync();
        if (user is null) return Unauthorized();

        // Hesap kimliği JWT'den gelir; istemci başka bir hesabı seçemez.
        user.FullName = request.FullName.Trim();
        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded) return IdentityValidationProblem(result);

        return Ok(ToResponse(user));
    }

    [HttpPost("change-password")]
    [EnableRateLimiting("password-change")]
    public async Task<IActionResult> ChangePassword(ChangePasswordRequest request)
    {
        var user = await FindCurrentUserAsync();
        if (user is null) return Unauthorized();

        // Identity mevcut şifreyi doğrular, yenisini hash'ler ve SecurityStamp'i yeniler.
        var result = await _userManager.ChangePasswordAsync(
            user, request.CurrentPassword, request.NewPassword);
        return result.Succeeded ? NoContent() : IdentityValidationProblem(result);
    }

    private async Task<ApplicationUser?> FindCurrentUserAsync()
    {
        var userId = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
        return string.IsNullOrWhiteSpace(userId) ? null : await _userManager.FindByIdAsync(userId);
    }

    private IActionResult IdentityValidationProblem(IdentityResult result)
    {
        foreach (var error in result.Errors)
            ModelState.AddModelError(error.Code, error.Description);
        return ValidationProblem(statusCode: StatusCodes.Status400BadRequest, modelStateDictionary: ModelState);
    }

    private static CurrentUserResponse ToResponse(ApplicationUser user) =>
        new(user.Id, user.FullName, user.Email ?? string.Empty);
}
