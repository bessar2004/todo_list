using TodoApp.Api.Dtos;
using TodoApp.Api.Models;
using TodoApp.Api.Repositories;

namespace TodoApp.Api.Services;

public class TodoService : ITodoService
{
    private readonly ITodoRepository _todoRepository;

    public TodoService(ITodoRepository todoRepository)
    {
        _todoRepository = todoRepository;
    }





    public async Task<List<TodoDto>> GetAllForUserAsync(string userId)
    {
        var todos = await _todoRepository.GetAllForUserAsync(userId);
        return todos.Select(todo => MapToDto(todo)).ToList();
    }




    public async Task<TodoDto?> GetByIdForUserAsync(int id, string userId)
    {
        var todo = await _todoRepository.GetByIdForUserAsync(id, userId);

        if (todo == null)
        {
            return null;
        }

        return MapToDto(todo);
    }

    public async Task<TodoDto> CreateAsync(CreateTodoDto dto, string userId)
    {
        var todoItem = new TodoItem
        {
            UserId = userId,
            Title = dto.Title,
            Description = dto.Description,
            Status = dto.Status,
            Priority = dto.Priority,
            DueDate = dto.DueDate,
            CreatedAt = DateTime.UtcNow
        };

        await _todoRepository.AddAsync(todoItem);

        await _todoRepository.SaveChangesAsync();

        return MapToDto(todoItem);
    }






    // bunun gorevi kayit guncelleme
    public async Task<bool> UpdateForUserAsync(
        int id,
        UpdateTodoDto dto,
        string userId)
    {
        var todo = await _todoRepository.GetByIdForUserAsync(id, userId);

        if (todo == null)
        {
            return false;
        }

        todo.Title = dto.Title;
        todo.Description = dto.Description;
        todo.Status = dto.Status;
        todo.Priority = dto.Priority;
        todo.DueDate = dto.DueDate;

        _todoRepository.Update(todo);
        await _todoRepository.SaveChangesAsync();

        return true;
    }














    public async Task<bool> DeleteForUserAsync(int id, string userId)
    {
        var todo = await _todoRepository.GetByIdForUserAsync(id, userId);

        if (todo == null)
        {
            return false;
        }

        _todoRepository.Delete(todo);
        await _todoRepository.SaveChangesAsync();

        return true;
    }



    // bu metot, TodoItem nesnesini TodoDto nesnesine dönüştürmek için kullanılır. Bu dönüşüm, istemciye gönderilecek verilerin formatını belirler ve istemcinin ihtiyaç duyduğu bilgileri sağlar.

    //bir görevi, API cevabında kullanılabilecek veri nesnesine dönüştürür
    private static TodoDto MapToDto(TodoItem todo)
    {
        return new TodoDto
        {
            Id = todo.Id,
            Title = todo.Title,
            Description = todo.Description,
            Status = todo.Status,
            Priority = todo.Priority,
            CreatedAt = todo.CreatedAt,
            DueDate = todo.DueDate
        };
    }





}
