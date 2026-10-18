
using System.ComponentModel.DataAnnotations;

namespace TodoApp.Api.Dtos;

public class RegisterRequest
{
    [Required]
    [MaxLength(100)]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(256)]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MinLength(15)]
    public string Password { get; set; } = string.Empty;

    [Required]
    // Kullanıcının şifresini doğrulamak için kullanılan bir alan. Bu alan, kullanıcının girdiği şifreyi tekrar girmesini sağlar ve şifre doğrulama işlemi sırasında kullanılır.
    [Compare(nameof(Password))]
    public string ConfirmPassword { get; set; } = string.Empty;
}