# Yayına alma (production)

[← README](../README.md)

Frontend `/api` adresini kullanır; bu yüzden SPA ve API aynı alan adı altında, bir reverse proxy (IIS, nginx vb.) arkasında yayınlanmalıdır. Production'da `appsettings.Development.json` kullanılmaz; ayarlar ortam değişkenleri veya gizli yönetim sistemiyle verilir (`:` yerine `__` kullan):

| Ayar                                   | Açıklama                                                                                                                               |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `ConnectionStrings__DefaultConnection` | Production SQL Server bağlantı dizesi (LocalDB yalnızca yerel geliştirme içindir).                                                     |
| `Jwt__SigningKey`                      | En az 32 baytlık Base64 anahtar. Kaynak koda veya Git'e yazma.                                                                         |
| `Jwt__AccessTokenMinutes`              | Erişim token'ı ömrü, varsayılan 60 dakika.                                                                                             |
| `Cors__AllowedOrigins__0`              | Frontend'in adresi (ör. `https://app.example.com`). Aynı alan adı kullanılıyorsa bile tanımlaman önerilir; boşsa uygulama uyarı yazar. |
| `Auth__ResetPasswordUrl`               | Şifre sıfırlama bağlantısının kökü (ör. `https://app.example.com/reset-password`).                                                     |
| `Email__Smtp__*`                       | Şifre sıfırlama e-postası için SMTP bilgileri ([Hesap güvenliği ve e-posta ayarları](hesap-guvenligi.md)).                                                                      |
| `ForwardedHeaders__Enabled`            | Güvenilir bir reverse proxy arkasındaysan `true` yap; hız sınırı gerçek istemci IP'sini görür.                                         |

Veritabanı şemasını yayın öncesi `dotnet ef database update` veya `dotnet ef migrations script --idempotent` ile uygula. Frontend için `npm run build` çıktısı `todo-app-client/dist/` altında oluşur.

## Güvenlik başlıkları

API her yanıta `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` ve kısıtlayıcı bir `Content-Security-Policy` ekler; `/api` yanıtları `Cache-Control: no-store` ile döner. Production'da ayrıca HSTS (180 gün) açıktır. HSTS yalnızca HTTPS üzerinden çalışan bir alan adında anlamlıdır.

Angular dosyalarını API değil reverse proxy sunduğu için arayüzün güvenlik başlıklarını proxy'de tanımlaman gerekir. nginx için başlangıç noktası (tarayıcı konsolunda CSP hatası olup olmadığını mutlaka kontrol et, gerekirse gevşet):

```nginx
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "DENY" always;
add_header Referrer-Policy "no-referrer" always;
add_header Content-Security-Policy "default-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none'" always;
```
