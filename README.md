# Your Plan

[![CI](https://github.com/bessar2004/todo_list/actions/workflows/ci.yml/badge.svg)](https://github.com/bessar2004/todo_list/actions/workflows/ci.yml)
[![Lisans: MIT](https://img.shields.io/badge/lisans-MIT-blue.svg)](LICENSE)

**Your Plan**, görevlerini Kanban panosunda düzenlemeni, takvimde görmeni ve raporlarla ilerlemeni takip etmeni sağlayan kişisel bir görev yönetim uygulamasıdır. Her kullanıcı yalnızca kendi görevlerini görür. Arayüz Türkçe, İngilizce ve Arapça olarak kullanılabilir.

_Your Plan is a personal task manager with a Kanban board, calendar and reports. Built with Angular and ASP.NET Core; the UI is available in Turkish, English and Arabic._

![Your Plan giriş ekranı](docs/screenshots/login.png)

## Ne işe yarar?

Bir hesap oluşturup giriş yaparsın, görevlerini ekler, önceliklerini belirler ve **Yapılacak → Devam Ediyor → Tamamlandı** sütunları arasında sürükleyerek ilerletirsin. Son tarihi olan görevler takvimde görünür, raporlar sayfası da durum ve öncelik dağılımını grafiklerle gösterir.

## Özellikler

- **Kanban panosu:** Görevleri sürükle-bırak ile sütunlar arasında taşı. Durum değişikliği veritabanına kaydedilir.
- **Görev yönetimi:** Başlık, açıklama, öncelik (düşük / orta / yüksek) ve son tarih ile görev ekle, düzenle, sil. Görev tamamlanınca tamamlanma zamanı kaydedilir.
- **Arama ve filtre:** Görevleri metne, duruma ve önceliğe göre filtrele.
- **Takvim:** Son tarihi olan görevleri takvim üzerinde gör.
- **Raporlar:** Durum ve öncelik dağılımını grafiklerle incele.
- **Hesap sistemi:** Kayıt, giriş, "şifremi unuttum" (e-posta ile sıfırlama), profil adını güncelleme ve şifre değiştirme.
- **Kullanıcıya özel veri:** Görevler hesaba bağlıdır, başka bir kullanıcının görevine erişilemez.
- **Çoklu dil ve tema:** Türkçe, İngilizce, Arapça; açık ve koyu tema.
- **Güvenlik:** JWT ile kimlik doğrulama, şifre değişince eski oturumların geçersiz olması, hesap kilitleme ve giriş/kayıt/şifre işlemlerinde hız sınırı.

## Ekran görüntüleri

**Takvim:** Son tarihi olan görevler günlerin üzerinde öncelik rengiyle görünür.

![Takvim sayfası](docs/screenshots/calendar.png)

**Raporlar:** Toplam, tamamlanan, devam eden ve geciken görevler; durum ve öncelik grafikleri.

![Raporlar sayfası](docs/screenshots/reports.png)

**Ayarlar:** Açık/koyu tema, dil seçimi ve görev tercihleri.

![Ayarlar sayfası](docs/screenshots/settings.png)

## Kullanılan teknolojiler

| Katman  | Teknoloji                                                  |
| ------- | ---------------------------------------------------------- |
| Arayüz  | Angular 21, PrimeNG, Chart.js, Angular CDK (sürükle-bırak) |
| API     | ASP.NET Core 10 (Web API), Identity, JWT, Swagger          |
| Veri    | Entity Framework Core, SQL Server                          |
| E-posta | MailKit (SMTP)                                             |
| Test    | xUnit (API), Vitest (arayüz)                               |
| CI      | GitHub Actions                                             |

## Hızlı başlangıç

### Gereksinimler

- .NET SDK 10
- Node.js 22 ve npm
- SQL Server LocalDB (Windows)
- EF Core komut aracı (`dotnet ef`)

### Kurulum

Komutları proje klasöründe PowerShell ile çalıştır:

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

### Çalıştırma

İki ayrı terminal aç:

```powershell
dotnet run --project TodoApp.Api.csproj --launch-profile http
```

```powershell
Set-Location todo-app-client
npm.cmd start
```

- Uygulama: http://localhost:4200/login
- API / Swagger: http://localhost:5072/swagger

Giriş ekranından **Kayıt Ol** ile bir hesap oluşturup kullanmaya başlayabilirsin. Şifre en az 15 karakter olmalıdır.

## Proje yapısı

```text
.
├── Controllers/            API uç noktaları (auth, me, todo)
├── Services/               İş mantığı, JWT, e-posta gönderimi
├── Repositories/           Veri erişimi
├── Dtos/  Models/  Data/   Veri modelleri ve EF Core bağlamı
├── Migrations/             Veritabanı şema geçmişi
├── TodoApp.Api.Tests/      API birim testleri (xUnit)
├── todo-app-client/        Angular arayüzü
└── docs/screenshots/       README görselleri
```

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

Testler API ve istemci tarafındaki birim testleri kapsar; kayıt/giriş, görev işlemleri, kullanıcılar arası veri ayrımı, TR/EN/AR, mobil görünüm ve şifre sıfırlama akışını tarayıcıda da elle denemeni öneririm.

## Yayına alma (production)

Frontend `/api` adresini kullanır; bu yüzden SPA ve API aynı alan adı altında, bir reverse proxy (IIS, nginx vb.) arkasında yayınlanmalıdır. Production'da `appsettings.Development.json` kullanılmaz; ayarlar ortam değişkenleri veya gizli yönetim sistemiyle verilir (`:` yerine `__` kullan):

| Ayar                                   | Açıklama                                                                                                                               |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `ConnectionStrings__DefaultConnection` | Production SQL Server bağlantı dizesi (LocalDB yalnızca yerel geliştirme içindir).                                                     |
| `Jwt__SigningKey`                      | En az 32 baytlık Base64 anahtar. Kaynak koda veya Git'e yazma.                                                                         |
| `Jwt__AccessTokenMinutes`              | Erişim token'ı ömrü, varsayılan 60 dakika.                                                                                             |
| `Cors__AllowedOrigins__0`              | Frontend'in adresi (ör. `https://app.example.com`). Aynı alan adı kullanılıyorsa bile tanımlaman önerilir; boşsa uygulama uyarı yazar. |
| `Auth__ResetPasswordUrl`               | Şifre sıfırlama bağlantısının kökü (ör. `https://app.example.com/reset-password`).                                                     |
| `Email__Smtp__*`                       | Şifre sıfırlama e-postası için SMTP bilgileri (yukarıdaki bölüm).                                                                      |
| `ForwardedHeaders__Enabled`            | Güvenilir bir reverse proxy arkasındaysan `true` yap; hız sınırı gerçek istemci IP'sini görür.                                         |

Veritabanı şemasını yayın öncesi `dotnet ef database update` veya `dotnet ef migrations script --idempotent` ile uygula. Frontend için `npm run build` çıktısı `todo-app-client/dist/` altında oluşur.

GitHub Actions (`.github/workflows/ci.yml`) her push ve pull request'te backend/frontend testlerini ve frontend build'ini çalıştırır.

## Lisans

[MIT](LICENSE)
