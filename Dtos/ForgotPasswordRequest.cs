using System.ComponentModel.DataAnnotations;

namespace TodoApp.Api.Dtos;

public sealed class ForgotPasswordRequest
{
    [Required, EmailAddress, MaxLength(256)]
    public string Email { get; set; } = string.Empty;

    [RegularExpression("^(tr|en|ar)$")]
    public string Language { get; set; } = "tr";
}
