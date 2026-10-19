using Microsoft.EntityFrameworkCore;
using TodoApp.Api.Data;
using TodoApp.Api.Models;
using TodoApp.Api.Repositories;

namespace TodoApp.Api.Tests.Repositories;

// Gerçek EF sorguları üzerinde kullanıcılar arası veri ayrımını doğrular.
public sealed class TodoRepositoryTests
{
    [Fact]
    public async Task GetAllForUserAsync_ReturnsOnlyOwnTodos()
    {
        await using var context = CreateContext();
        context.TodoItems.AddRange(
            new TodoItem { Title = "Ali 1", UserId = "ali" },
            new TodoItem { Title = "Ali 2", UserId = "ali" },
            new TodoItem { Title = "Ayşe", UserId = "ayse" });
        await context.SaveChangesAsync();

        var result = await new TodoRepository(context).GetAllForUserAsync("ali");

        Assert.Equal(2, result.Count);
        Assert.All(result, todo => Assert.Equal("ali", todo.UserId));
    }

    [Fact]
    public async Task GetByIdForUserAsync_WhenTodoBelongsToAnotherUser_ReturnsNull()
    {
        await using var context = CreateContext();
        var todo = new TodoItem { Title = "Ayşe", UserId = "ayse" };
        context.TodoItems.Add(todo);
        await context.SaveChangesAsync();
        var repository = new TodoRepository(context);

        Assert.Null(await repository.GetByIdForUserAsync(todo.Id, "ali"));
        Assert.NotNull(await repository.GetByIdForUserAsync(todo.Id, "ayse"));
    }

    [Fact]
    public async Task Delete_RemovesOnlyTheSelectedTodo()
    {
        await using var context = CreateContext();
        var mine = new TodoItem { Title = "Benim", UserId = "ali" };
        var other = new TodoItem { Title = "Başkası", UserId = "ayse" };
        context.TodoItems.AddRange(mine, other);
        await context.SaveChangesAsync();
        var repository = new TodoRepository(context);

        repository.Delete(mine);
        await repository.SaveChangesAsync();

        var remaining = await context.TodoItems.ToListAsync();
        Assert.Equal(other.Id, Assert.Single(remaining).Id);
    }

    private static AppDbContext CreateContext() =>
        new(new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options);
}
