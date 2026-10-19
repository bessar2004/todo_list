using System.ComponentModel.DataAnnotations;

namespace TodoApp.Api.Dtos;

public sealed class UpdateProfileRequest
{
    [Required, MaxLength(100)]
    public string FullName { get; set; } = string.Empty;
}
