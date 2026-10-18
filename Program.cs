using Microsoft.EntityFrameworkCore;
using TodoApp.Api.Data;
using TodoApp.Api.Models;
using TodoApp.Api.Repositories;
using TodoApp.Api.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.RateLimiting;
using System.Threading.RateLimiting;
using Microsoft.OpenApi; // OpenAPI, web servislerinin ve API'lerin tanımlanması, belgelenmesi ve test edilmesi için kullanılan bir standarttır. OpenAPI, API'lerin yapısını ve işlevselliğini tanımlayan bir sözleşme sağlar. Bu sözleşme, API'nin uç noktalarını (endpoints), HTTP yöntemlerini (GET, POST, PUT, DELETE vb.), istek ve yanıt formatlarını, parametreleri ve hata durumlarını içerir. OpenAPI, geliştiricilerin API'leri daha kolay anlamasını ve kullanmasını sağlar. Ayrıca, OpenAPI belgeleri otomatik olarak oluşturulabilir ve Swagger gibi araçlarla görselleştirilebilir. Bu sayede, API kullanıcıları için daha iyi bir deneyim sunulur ve entegrasyon süreçleri hızlanır.


var builder = WebApplication.CreateBuilder(args);



var allowedOrigins = builder.Configuration
    .GetSection("Cors:AllowedOrigins")
    .Get<string[]>()
    ?? Array.Empty<string>();




builder.Logging.ClearProviders();
builder.Logging.AddConsole();


// Add services to the container.
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Şifre sıfırlama tokenları için gerekli.
builder.Services.AddDataProtection();
builder.Services.Configure<DataProtectionTokenProviderOptions>(options =>
    options.TokenLifespan = TimeSpan.FromHours(1));



// Identity framework'ü için gerekli olan servisleri ekler. Bu servisler, kullanıcı kimlik doğrulama ve yetkilendirme işlemlerini yönetmek için kullanılır.

var jwtIssuer = builder.Configuration["Jwt:Issuer"]
    ?? throw new InvalidOperationException("Jwt:Issuer eksik.");

var jwtAudience = builder.Configuration["Jwt:Audience"]
    ?? throw new InvalidOperationException("Jwt:Audience eksik.");

var jwtKey = Convert.FromBase64String(
    builder.Configuration["Jwt:SigningKey"]
    ?? throw new InvalidOperationException("Jwt:SigningKey eksik."));

if (jwtKey.Length < 32)
{
    throw new InvalidOperationException("JWT anahtarı en az 32 bayt olmalı.");
}

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.MapInboundClaims = false;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            // JWT'nin imzasını doğrulamak için gerekli ayarlar
            ValidateIssuer = true,
            // JWT'nin yayıncısını doğrulamak için gerekli ayarlar
            ValidIssuer = jwtIssuer,
            // JWT'nin yayıncısını doğrulamak için gerekli ayarlar
            ValidateAudience = true,
            // JWT'nin hedef kitlesini doğrulamak için gerekli ayarlar
            ValidAudience = jwtAudience,

            // JWT'nin imzasını doğrulamak için gerekli ayarlar
            ValidateIssuerSigningKey = true,
            // JWT imzalama anahtarını doğrulamak için gerekli ayarlar
            IssuerSigningKey = new SymmetricSecurityKey(jwtKey),
            // Token ömrünü doğrulamak için gerekli ayarlar
            ValidateLifetime = true,
            RequireExpirationTime = true,
            ClockSkew = TimeSpan.FromMinutes(1)
        };
    });





builder.Services.AddAuthorization();

// Kullanıcı hesaplarını ve şifre kurallarını yapılandırır.
builder.Services
    .AddIdentityCore<ApplicationUser>(options =>
    {
        // Kullanıcıların benzersiz e-posta adresine sahip olmasını zorunlu kılar.
        options.User.RequireUniqueEmail = true;

        options.Password.RequiredLength = 15;

        options.Password.RequireDigit = false;

        options.Password.RequireLowercase = false;

        options.Password.RequireUppercase = false;

        options.Password.RequireNonAlphanumeric = false;
    })
    //
    .AddEntityFrameworkStores<AppDbContext>()
    //
    .AddSignInManager()

    .AddDefaultTokenProviders();
// JWT token oluşturmak için kullanılan JwtTokenService sınıfını singleton olarak ekler. Bu, uygulama boyunca tek bir örneğin kullanılmasını sağlar.
builder.Services.AddSingleton<JwtTokenService>();
builder.Services.AddTransient<IPasswordResetEmailSender, SmtpPasswordResetEmailSender>();

builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.AddPolicy("password-reset", context =>
        RateLimitPartition.GetFixedWindowLimiter(
            context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 5,
                Window = TimeSpan.FromMinutes(1),
                QueueLimit = 0,
                AutoReplenishment = true
            }));
});





builder.Services.AddScoped<ITodoRepository, TodoRepository>(); // ITodoRepository ve TodoRepository ekle
builder.Services.AddScoped<ITodoService, TodoService>();
builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();


builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        Description = "Yalnızca accessToken değerini gir. Başına Bearer yazma."
    });

    options.AddSecurityRequirement(document =>
        new OpenApiSecurityRequirement
        {
            [new OpenApiSecuritySchemeReference("Bearer", document)] = []
        });
});


// CORS ayarlarını yapılandır
builder.Services.AddCors(options =>
{

    options.AddPolicy("AllowAngular", policy =>
    {

        policy.WithOrigins(allowedOrigins) // Angular uygulamasının çalıştığı adresi ekleyin
     .AllowAnyHeader()
     .AllowAnyMethod();

    });

}
);

var app = builder.Build();




// Swagger yalnızca geliştirme ortamında açılır.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseHttpsRedirection();
app.UseRouting();

// CORS: Backend’in, Angular’dan gelen isteğe izin vermesini sağlayan bir guvenlik kuralidir 
app.UseCors("AllowAngular"); // CORS politikasını kullan
app.UseRateLimiter();

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();



