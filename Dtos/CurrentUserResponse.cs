namespace TodoApp.Api.Dtos;

public sealed record CurrentUserResponse(string UserId, string FullName, string Email);
