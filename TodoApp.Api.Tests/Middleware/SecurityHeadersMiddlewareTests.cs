using Microsoft.AspNetCore.Http;
using TodoApp.Api.Middleware;

namespace TodoApp.Api.Tests.Middleware;

public sealed class SecurityHeadersMiddlewareTests
{
    [Fact]
    public async Task ApiResponse_GetsSecurityHeadersAndNoStore()
    {
        var context = await RunAsync("/api/todo");

        var headers = context.Response.Headers;
        Assert.Equal("nosniff", headers["X-Content-Type-Options"]);
        Assert.Equal("DENY", headers["X-Frame-Options"]);
        Assert.Equal("no-referrer", headers["Referrer-Policy"]);
        Assert.Equal("default-src 'none'; frame-ancestors 'none'", headers["Content-Security-Policy"]);
        Assert.Equal("no-store", headers["Cache-Control"]);
    }

    [Fact]
    public async Task SwaggerResponse_SkipsContentSecurityPolicy()
    {
        var context = await RunAsync("/swagger/index.html");

        Assert.Equal("nosniff", context.Response.Headers["X-Content-Type-Options"]);
        Assert.False(context.Response.Headers.ContainsKey("Content-Security-Policy"));
        Assert.False(context.Response.Headers.ContainsKey("Cache-Control"));
    }

    private static async Task<DefaultHttpContext> RunAsync(string path)
    {
        var context = new DefaultHttpContext();
        context.Request.Path = path;
        var middleware = new SecurityHeadersMiddleware(_ => Task.CompletedTask);

        await middleware.InvokeAsync(context);
        return context;
    }
}
