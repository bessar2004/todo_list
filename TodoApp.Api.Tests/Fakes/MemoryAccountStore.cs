using Microsoft.AspNetCore.Identity;
using TodoApp.Api.Models;

namespace TodoApp.Api.Tests.Fakes;

// Yalnızca testlerde kullanılır; gerçek kullanıcı veritabanına bağlanmaz.
internal sealed class MemoryAccountStore : IUserPasswordStore<ApplicationUser>, IUserSecurityStampStore<ApplicationUser>
{
    private readonly Dictionary<string, ApplicationUser> users = new();
    public void Dispose() { }
    public Task<string> GetUserIdAsync(ApplicationUser u, CancellationToken ct) => Task.FromResult(u.Id);
    public Task<string?> GetUserNameAsync(ApplicationUser u, CancellationToken ct) => Task.FromResult(u.UserName);
    public Task SetUserNameAsync(ApplicationUser u, string? value, CancellationToken ct) { u.UserName = value; return Task.CompletedTask; }
    public Task<string?> GetNormalizedUserNameAsync(ApplicationUser u, CancellationToken ct) => Task.FromResult(u.NormalizedUserName);
    public Task SetNormalizedUserNameAsync(ApplicationUser u, string? value, CancellationToken ct) { u.NormalizedUserName = value; return Task.CompletedTask; }
    public Task<IdentityResult> CreateAsync(ApplicationUser u, CancellationToken ct) { users.Add(u.Id, u); return Task.FromResult(IdentityResult.Success); }
    public Task<IdentityResult> UpdateAsync(ApplicationUser u, CancellationToken ct) { users[u.Id] = u; return Task.FromResult(IdentityResult.Success); }
    public Task<IdentityResult> DeleteAsync(ApplicationUser u, CancellationToken ct) { users.Remove(u.Id); return Task.FromResult(IdentityResult.Success); }
    public Task<ApplicationUser?> FindByIdAsync(string id, CancellationToken ct) => Task.FromResult(users.GetValueOrDefault(id));
    public Task<ApplicationUser?> FindByNameAsync(string name, CancellationToken ct) => Task.FromResult(users.Values.FirstOrDefault(u => u.NormalizedUserName == name));
    public Task SetPasswordHashAsync(ApplicationUser u, string? hash, CancellationToken ct) { u.PasswordHash = hash; return Task.CompletedTask; }
    public Task<string?> GetPasswordHashAsync(ApplicationUser u, CancellationToken ct) => Task.FromResult(u.PasswordHash);
    public Task<bool> HasPasswordAsync(ApplicationUser u, CancellationToken ct) => Task.FromResult(u.PasswordHash is not null);
    public Task SetSecurityStampAsync(ApplicationUser u, string value, CancellationToken ct) { u.SecurityStamp = value; return Task.CompletedTask; }
    public Task<string?> GetSecurityStampAsync(ApplicationUser u, CancellationToken ct) => Task.FromResult(u.SecurityStamp);
}
