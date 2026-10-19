# Your Plan

Angular 21 ve ASP.NET Core 10 ile geliştirilmiş kişisel görev uygulaması. Kayıt/giriş, kullanıcıya özel görevler, Kanban panosu, takvim, raporlar ve TR/EN/AR arayüzü içerir.

## Yerel gereksinimler

- .NET SDK 10
- Node.js 22 ve npm
- SQL Server LocalDB (Windows)
- EF Core komut aracı (`dotnet ef`)

## İlk kurulum

Komutları bu klasörde PowerShell ile çalıştır:

```powershell
if (-not (Test-Path appsettings.Development.json)) {
    Copy-Item appsettings.Development.example.json appsettings.Development.json
}
$jwtKey = [Convert]::ToBase64String([Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
dotnet user-secrets set 'Jwt:SigningKey' $jwtKey --project TodoApp.Api.csproj
dotnet ef database update --project TodoApp.Api.csproj
npm.cmd ci --prefix todo-app-client
```

`appsettings.Development.json` ve kullanıcı sırları Git'e eklenmez. JWT anahtarını README'ye veya kaynak koda yazma. Komut, var olan yerel ayar dosyanın üzerine yazmaz.

## Çalıştırma

İki ayrı terminal aç:

```powershell
dotnet run --project TodoApp.Api.csproj --launch-profile http
```

```powershell
Set-Location todo-app-client
npm.cmd start
```

- Angular: http://localhost:4200/login
- API / Swagger: http://localhost:5072/swagger

## Şifre sıfırlama e-postası

Şifre sıfırlama API'si, Identity'nin süresi bir saat olan token'ını kullanır. E-posta gönderimi için SMTP hesabı gereklidir. SMTP henüz ayarlanmadıysa istek `503` döner; kullanıcıya gönderilmiş gibi gösterilmez.

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

Şifre değişikliği/sıfırlama, Identity güvenlik damgasını yeniler. Her korumalı API isteğinde JWT'deki oturum sürümü bu damgayla karşılaştırılır; eski JWT'ler reddedilir. Şifre değişince kullanıcı yeniden giriş yapar. Bu kontrol eklenmeden önce alınmış tokenlar da bir kez yeniden giriş gerektirir. Veritabanı şema değişikliği gerekmez.

## Test komutları

```powershell
dotnet test TodoApp.Api.Tests/TodoApp.Api.Tests.csproj
npm.cmd test --prefix todo-app-client -- --watch=false
npm.cmd run build --prefix todo-app-client
```

GitHub'a yüklemeden önce kayıt/giriş, görev CRUD işlemleri, kullanıcılar arası veri ayrımı, TR/EN/AR, mobil görünüm ve şifre sıfırlama akışını tarayıcıda da kontrol et.
