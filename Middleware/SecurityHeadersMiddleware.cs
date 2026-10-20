namespace TodoApp.Api.Middleware;

// Her yanıta tarayıcı tarafı saldırılarını zorlaştıran güvenlik başlıklarını ekler.
public sealed class SecurityHeadersMiddleware(RequestDelegate next)
{
    private static readonly PathString SwaggerPath = new("/swagger");

    public Task InvokeAsync(HttpContext context)
    {
        var headers = context.Response.Headers;

        headers["X-Content-Type-Options"] = "nosniff";
        headers["X-Frame-Options"] = "DENY";
        headers["Referrer-Policy"] = "no-referrer";
        headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()";

        // Swagger arayüzü satır içi betik/stil kullandığı için CSP'den muaftır (yalnızca geliştirmede açıktır).
        if (!context.Request.Path.StartsWithSegments(SwaggerPath))
        {
            headers["Content-Security-Policy"] = "default-src 'none'; frame-ancestors 'none'";
        }

        // Token ve kişisel veri içeren API yanıtları tarayıcıda/proxy'de saklanmasın.
        if (context.Request.Path.StartsWithSegments("/api"))
        {
            headers["Cache-Control"] = "no-store";
        }

        return next(context);
    }
}

public static class SecurityHeadersExtensions
{
    public static IApplicationBuilder UseSecurityHeaders(this IApplicationBuilder app) =>
        app.UseMiddleware<SecurityHeadersMiddleware>();
}
