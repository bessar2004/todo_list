# Hesap güvenliği ve e-posta ayarları

[← README](../README.md)

## Şifre sıfırlama e-postası (isteğe bağlı)

Bu ayar yapılmazsa uygulama normal çalışır; yalnızca "Şifremi unuttum" özelliği `503` döner. Şifre sıfırlama API'si, Identity'nin süresi bir saat olan token'ını kullanır. E-posta gönderimi için SMTP hesabı gereklidir; ayar yoksa kullanıcıya gönderilmiş gibi gösterilmez.

Sağlayıcı seçtikten sonra aşağıdaki değerleri **kendi bilgisayarındaki user-secrets** içine gir; gerçek şifreleri Git'e koyma:

```powershell
dotnet user-secrets set 'Email:Smtp:Host' '<SMTP_HOST>' --project TodoApp.Api.csproj
dotnet user-secrets set 'Email:Smtp:Port' '587' --project TodoApp.Api.csproj
dotnet user-secrets set 'Email:Smtp:Security' 'StartTls' --project TodoApp.Api.csproj
dotnet user-secrets set 'Email:Smtp:Username' '<SMTP_USERNAME>' --project TodoApp.Api.csproj
dotnet user-secrets set 'Email:Smtp:Password' '<SMTP_PASSWORD>' --project TodoApp.Api.csproj
dotnet user-secrets set 'Email:Smtp:FromAddress' '<SENDER_EMAIL>' --project TodoApp.Api.csproj
```

Sağlayıcı 465 portu ve doğrudan TLS kullanıyorsa `Security` değerini `SslOnConnect` yap. Gönderici adı için isteğe bağlı `Email:Smtp:FromName` kullanılabilir. Sıfırlama bağlantısı `Auth:ResetPasswordUrl` ayarından oluşturulur; yerel örnekte `http://localhost:4200/reset-password` kullanılır.

## Profil ve hesap güvenliği

Ayarlar sayfasında ad–soyad güncellenebilir; e-posta alanı salt okunurdur. Profil ve şifre ayrı düğmelerle kaydedilir. `PUT /api/me` yalnızca JWT'deki hesabın adını değiştirir. `POST /api/me/change-password` mevcut şifreyi doğrular; yeni şifre en az 15 karakter olmalı ve tekrarıyla eşleşmelidir. Şifre değiştirmek SMTP gerektirmez.

Şifre değişikliği/sıfırlama, Identity güvenlik damgasını yeniler. Her korumalı API isteğinde JWT'deki oturum sürümü bu damgayla karşılaştırılır; eski JWT'ler reddedilir. Şifre değişince kullanıcı yeniden giriş yapar.
