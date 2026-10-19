using System.ComponentModel.DataAnnotations;

namespace TodoApp.Api.Dtos;

public sealed class ChangePasswordRequest
{
    [Required]
    public string CurrentPassword { get; set; } = string.Empty;

    [Required, MinLength(15)]
    public string NewPassword { get; set; } = string.Empty;

    [Required, Compare(nameof(NewPassword))]
    public string ConfirmPassword { get; set; } = string.Empty;
}
