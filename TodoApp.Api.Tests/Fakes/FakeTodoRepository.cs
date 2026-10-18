using TodoApp.Api.Models;
using TodoApp.Api.Repositories;

namespace TodoApp.Api.Tests.Fakes;

internal sealed class FakeTodoRepository : ITodoRepository
{
    private readonly List<TodoItem> _todos;

    public FakeTodoRepository(params TodoItem[] todos)
    {
        _todos = todos.ToList();
    }

    public IReadOnlyList<TodoItem> Todos => _todos;

    public int SaveChangesCallCount { get; private set; }




    public Task<List<TodoItem>> GetAllForUserAsync(string userId)
    {
        return Task.FromResult(
            _todos.Where(todo => todo.UserId == userId).ToList()
        );
    }



    public Task<TodoItem?> GetByIdForUserAsync(int id, string userId)
    {
        return Task.FromResult(
            _todos.FirstOrDefault(todo => todo.Id == id && todo.UserId == userId)
        );
    }




    public Task AddAsync(TodoItem todoItem)
    {
        if (todoItem.Id == 0)
        {
            todoItem.Id = _todos.Count == 0
                ? 1
                : _todos.Max(todo => todo.Id) + 1;
        }

        _todos.Add(todoItem);
        return Task.CompletedTask;
    }

    public void Update(TodoItem todoItem)
    {
        // Nesne bellek içinde izlendiği için ayrıca işlem gerekmez.
    }

    public void Delete(TodoItem todoItem)
    {
        _todos.Remove(todoItem);
    }

    public Task SaveChangesAsync()
    {
        SaveChangesCallCount++;
        return Task.CompletedTask;
    }
}
