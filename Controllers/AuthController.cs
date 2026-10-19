using Microsoft.AspNetCore.Authorization; // Authorization, ASP.NET Core uygulamalarında kullanıcıların belirli kaynaklara veya işlemlere erişimini kontrol etmek için kullanılan bir mekanizmadır. Bu mekanizma, kullanıcıların kimlik doğrulama ve yetkilendirme süreçlerini yönetmek için kullanılır. Yetkilendirme, kullanıcıların belirli roller veya izinler temelinde belirli eylemleri gerçekleştirmesine izin verir veya engeller. Örneğin, bir kullanıcı belirli bir sayfaya erişim iznine sahip olabilirken, başka bir kullanıcı aynı sayfaya erişim iznine sahip olmayabilir. Yetkilendirme, uygulamanın güvenliğini artırmak ve kullanıcıların yalnızca yetkili oldukları kaynaklara erişmesini sağlamak için önemlidir.
using Microsoft.AspNetCore.Identity; // Identity, ASP.NET Core uygulamalarında kullanıcı kimlik doğrulama ve yetkilendirme işlemlerini yönetmek için kullanılan bir framework'tür. Bu framework, kullanıcıların kimlik bilgilerini (kullanıcı adı, e-posta, şifre vb.) güvenli bir şekilde saklamak, doğrulamak ve yönetmek için çeşitli özellikler sunar. Identity, kullanıcıların kayıt olmasını, giriş yapmasını, şifrelerini sıfırlamasını ve roller veya izinler gibi yetkilendirme mekanizmalarını yönetmesini sağlar. Ayrıca, Identity framework'ü, kullanıcıların kimlik bilgilerini güvenli bir şekilde saklamak için şifreleme ve hashing gibi güvenlik önlemlerini de içerir.
using Microsoft.AspNetCore.Mvc; // MVC (Model-View-Controller), yazılım geliştirme sürecinde kullanılan bir tasarım desenidir. Bu desen, uygulamanın üç ana bileşenini birbirinden ayırarak daha düzenli ve yönetilebilir bir yapı sağlar. Model, uygulamanın veri ve iş mantığını temsil eder; View, kullanıcı arayüzünü ve verilerin nasıl görüntüleneceğini belirler; Controller ise kullanıcı etkileşimlerini işler ve Model ile View arasında iletişimi sağlar. Bu ayrım, kodun daha kolay test edilebilir, yeniden kullanılabilir ve bakımının yapılabilir olmasını sağlar. ASP.NET Core MVC, bu tasarım desenini kullanarak web uygulamaları geliştirmek için güçlü bir framework sunar.
using TodoApp.Api.Dtos;// Dtos (Data Transfer Objects), yazılım geliştirme sürecinde veri transferini kolaylaştırmak ve optimize etmek için kullanılan özel nesnelerdir. Bu nesneler, genellikle bir uygulamanın farklı katmanları veya bileşenleri arasında veri taşımak için kullanılır. Dtos, veri modelinden bağımsız olarak tasarlanabilir ve yalnızca gerekli verileri içerecek şekilde özelleştirilebilir. Bu sayede, gereksiz veri taşımaktan kaçınılır ve performans artırılır. Ayrıca, Dtos kullanımı, uygulamanın güvenliğini artırabilir; çünkü hassas verilerin istemciye gönderilmesini önleyebilir ve yalnızca gerekli bilgilerin paylaşılmasını sağlar.
using TodoApp.Api.Models; // Models, yazılım geliştirme sürecinde uygulamanın veri yapısını ve iş mantığını temsil eden sınıflardır. Bu sınıflar, genellikle veritabanı tablolarını veya uygulamanın iş mantığını yansıtan nesneleri temsil eder. Model sınıfları, uygulamanın farklı katmanları arasında veri taşımak ve işlemek için kullanılır. Ayrıca, model sınıfları, veri doğrulama ve iş kurallarını uygulamak için de kullanılabilir. Örneğin, bir kullanıcı modelinde e-posta adresinin geçerli bir formatta olup olmadığını kontrol etmek için doğrulama kuralları eklenebilir. Model sınıfları, uygulamanın temel yapı taşlarını oluşturur ve veri yönetimi ile iş mantığının merkezi bir noktada toplanmasını sağlar.
using TodoApp.Api.Services;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.AspNetCore.WebUtilities;

// 

namespace TodoApp.Api.Controllers;

// Gelen isteklerin denetlenmesi ve işlenmesi için kullanılan sınıf. 
[ApiController]
// herkes erisebilir 
[AllowAnonymous]
// isteklerin hangi URL adresinden gelecegini belirler
[Route("api/auth")]
public class AuthController : ControllerBase
{

    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly JwtTokenService _jwtTokenService;
    private readonly IPasswordResetEmailSender _passwordResetEmailSender;
    private readonly IConfiguration _configuration;
    private readonly ILogger<AuthController> _logger;


    // AuthController sınıfının yapıcı metodu. Bu metod, sınıfın örneği oluşturulduğunda çağrılır ve gerekli bağımlılıkları alır.
    public AuthController(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        JwtTokenService jwtTokenService,
        IPasswordResetEmailSender passwordResetEmailSender,
        IConfiguration configuration,
        ILogger<AuthController> logger)
    {
        // Kullanıcı yönetimi ve kimlik doğrulama işlemlerini gerçekleştirmek için kullanılan UserManager ve SignInManager sınıflarını ve JWT token oluşturmak için kullanılan JwtTokenService sınıfını başlatır.
        _userManager = userManager;
        _signInManager = signInManager;
        _jwtTokenService = jwtTokenService;
        _passwordResetEmailSender = passwordResetEmailSender;
        _configuration = configuration;
        _logger = logger;
    }


    [HttpPost("register")]
    [EnableRateLimiting("register")]

    // Kullanıcı kayıt işlemini gerçekleştiren 
    // bir HTTP POST isteği. Bu istek, kullanıcıdan alınan kayıt bilgilerini 
    // (ad, e-posta, şifre vb.) işleyerek yeni bir kullanıcı oluşturur ve veritabanına 
    // kaydeder. Eğer kayıt işlemi başarılı olursa, 201 Created HTTP durum kodu döndürülür; 
    // aksi takdirde, doğrulama hataları ile birlikte uygun bir hata yanıtı döndürülür.
    public async Task<IActionResult> Register(RegisterRequest request)
    {
        var email = request.Email.Trim();

        // Kullanıcının e-posta adresini ve şifresini kullanarak yeni bir kullanıcı oluşturur.
        var user = new ApplicationUser
        {
            FullName = request.FullName.Trim(),
            UserName = email,
            Email = email
        };
        // Kullanıcıyı veritabanına kaydeder ve şifreyi hashleyerek güvenli bir şekilde saklar.
        var result = await _userManager.CreateAsync(user, request.Password);

        if (!result.Succeeded)
        {

            foreach (var error in result.Errors)
            {
                // dondurulen hatalari API hata listesine eklenir 
                ModelState.AddModelError(error.Code, error.Description);
            }
            // neden kayit olmadigini aciklayan detayli bir hata  mesaji dondurur.

            return ValidationProblem(ModelState);
        }
        // burada basarili bir sekilde kayit olunduysa 201 Created 
        // HTTP durum kodu dondurulur. Bu, kayit isleminin 
        // basarili oldugunu ve yeni bir kaynak (kullanici) 
        // olusturuldugunu belirtir.
        return StatusCode(StatusCodes.Status201Created);
    }

    // Kullanıcı giriş işlemini gerçekleştiren 
    // bir HTTP POST isteği. Bu istek, kullanıcıdan alınan giriş 
    // bilgilerini (e-posta ve şifre) işleyerek kullanıcının kimliğini 
    // doğrular. Eğer doğrulama başarılı olursa, kullanıcıya bir JWT token
    //  oluşturulur ve döndürülür; aksi takdirde, 401 Unauthorized HTTP durum kodu 
    // döndürülür.
    [HttpPost("login")]
    [EnableRateLimiting("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        var user = await ValidateCredentialsAsync(request);

        if (user is null)
        {
            return Unauthorized();
        }

        // Kullanıcı doğrulandıktan sonra, JWT token oluşturmak için JwtTokenService sınıfını kullanır. 
        var token = _jwtTokenService.CreateToken(user);
        return Ok(new { accessToken = token });
    }

    [HttpPost("forgot-password")]
    [EnableRateLimiting("password-reset")]
    public async Task<IActionResult> ForgotPassword(
        ForgotPasswordRequest request,
        CancellationToken cancellationToken)
    {
        var resetUrl = _configuration["Auth:ResetPasswordUrl"];
        if (!_passwordResetEmailSender.IsConfigured ||
            !Uri.TryCreate(resetUrl, UriKind.Absolute, out var parsedUrl) ||
            parsedUrl.Scheme is not ("http" or "https"))
        {
            return StatusCode(StatusCodes.Status503ServiceUnavailable);
        }

        var user = await _userManager.FindByEmailAsync(request.Email.Trim());
        if (user is not null && !string.IsNullOrWhiteSpace(user.Email))
        {
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var link = QueryHelpers.AddQueryString(resetUrl!, new Dictionary<string, string?>
            {
                ["userId"] = user.Id,
                ["token"] = token
            });

            try
            {
                await _passwordResetEmailSender.SendAsync(
                    user.Email,
                    link,
                    request.Language,
                    cancellationToken);
            }
            catch (Exception exception) when (exception is not OperationCanceledException)
            {
                // Hata ayrıntısını kullanıcıya verme: kayıtlı e-posta adresleri anlaşılmamalı.
                _logger.LogError(exception, "Şifre sıfırlama e-postası gönderilemedi.");
            }
        }

        // Var olmayan hesaplar için de aynı yanıt: e-posta adresi keşfini önler.
        return Accepted();
    }

    [HttpPost("reset-password")]
    [EnableRateLimiting("password-reset")]
    public async Task<IActionResult> ResetPassword(ResetPasswordRequest request)
    {
        var user = await _userManager.FindByIdAsync(request.UserId);
        if (user is null)
        {
            return BadRequest(new { message = "Bağlantı geçersiz veya süresi dolmuş." });
        }

        var result = await _userManager.ResetPasswordAsync(
            user,
            request.Token,
            request.NewPassword);

        return result.Succeeded
            ? NoContent()
            : BadRequest(new { message = "Bağlantı geçersiz veya süresi dolmuş." });
    }

    // E-posta ve şifreyi kontrol eder; başarısızsa null, başarılıysa kullanıcıyı döndürür.
    // Bu yardımcı metot HTTP endpoint'i değildir ve JWT üretmez.
    private async Task<ApplicationUser?> ValidateCredentialsAsync(LoginRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email.Trim());

        if (user is null)
        {
            return null;
        }

        var result = await _signInManager.CheckPasswordSignInAsync(
            user,
            request.Password,
            lockoutOnFailure: true);

        if (!result.Succeeded)
        {
            return null;
        }

        // Kullanıcının kimlik bilgileri doğrulandıktan sonra, kullanıcı nesnesi döndürülür.
        return user;
    }










}
