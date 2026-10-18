using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace TodoApp.Api.Services;

public sealed class SmtpPasswordResetEmailSender : IPasswordResetEmailSender
{
    private readonly IConfiguration _configuration;

    public SmtpPasswordResetEmailSender(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public bool IsConfigured =>
        !string.IsNullOrWhiteSpace(_configuration["Email:Smtp:Host"]) &&
        !string.IsNullOrWhiteSpace(_configuration["Email:Smtp:FromAddress"]) &&
        !string.IsNullOrWhiteSpace(_configuration["Email:Smtp:Username"]) &&
        !string.IsNullOrWhiteSpace(_configuration["Email:Smtp:Password"]);

    public async Task SendAsync(
        string address,
        string resetLink,
        string language,
        CancellationToken cancellationToken)
    {
        if (!IsConfigured)
        {
            throw new InvalidOperationException("SMTP ayarları eksik.");
        }

        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(
            _configuration["Email:Smtp:FromName"] ?? "Your Plan",
            _configuration["Email:Smtp:FromAddress"]!));
        message.To.Add(MailboxAddress.Parse(address));
        message.Subject = language switch
        {
            "en" => "Your Plan - reset your password",
            "ar" => "Your Plan - إعادة تعيين كلمة المرور",
            _ => "Your Plan - şifre sıfırlama"
        };
        message.Body = new TextPart("plain")
        {
            Text = language switch
            {
                "en" => $"Open this link to reset your password:\n{resetLink}\n\n" +
                        "If you did not request this, ignore this email. The link expires in 1 hour.",
                "ar" => $"افتح هذا الرابط لإعادة تعيين كلمة المرور:\n{resetLink}\n\n" +
                        "إذا لم تطلب ذلك، فتجاهل هذه الرسالة. تنتهي صلاحية الرابط بعد ساعة.",
                _ => $"Şifreni sıfırlamak için bu bağlantıyı aç:\n{resetLink}\n\n" +
                     "Bu isteği sen yapmadıysan e-postayı yok say. Bağlantı 1 saat geçerlidir."
            }
        };

        var host = _configuration["Email:Smtp:Host"]!;
        var port = _configuration.GetValue("Email:Smtp:Port", 587);
        var security = _configuration["Email:Smtp:Security"] switch
        {
            "SslOnConnect" => SecureSocketOptions.SslOnConnect,
            "StartTls" or null => SecureSocketOptions.StartTls,
            _ => throw new InvalidOperationException("SMTP güvenlik modu StartTls veya SslOnConnect olmalı.")
        };

        using var client = new SmtpClient();
        await client.ConnectAsync(host, port, security, cancellationToken);
        await client.AuthenticateAsync(
            _configuration["Email:Smtp:Username"]!,
            _configuration["Email:Smtp:Password"]!,
            cancellationToken);
        await client.SendAsync(message, cancellationToken);
        await client.DisconnectAsync(true, cancellationToken);
    }
}
