namespace TodoApp.Api.Services;

public interface IPasswordResetEmailSender
{
    bool IsConfigured { get; }

    Task SendAsync(
        string address,
        string resetLink,
        string language,
        CancellationToken cancellationToken);
}
