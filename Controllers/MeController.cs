using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
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

        return Ok(new
        {
            userId = user.Id,
            fullName = user.FullName,
            email = user.Email ?? string.Empty
        });
    }
}