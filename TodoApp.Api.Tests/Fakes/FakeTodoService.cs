using TodoApp.Api.Dtos;
using TodoApp.Api.Services;


// bunun gorevi sahte bir TodoService sınıfı oluşturmak ve ITodoService arayüzünü uygulamak
namespace TodoApp.Api.Tests.Fakes;

internal sealed class FakeTodoService : ITodoService
{
    public List<TodoDto> AllTodosResult { get; set; } = [];

    public TodoDto? TodoByIdResult { get; set; }

    public TodoDto CreatedTodoResult { get; set; } = new();

    public ArgumentException? CreateException { get; set; }

    public bool UpdateResult { get; set; }

    public bool DeleteResult { get; set; }


    public string? RequestedUserId { get; private set; } // kullaniciya gore kayit getirme

    public int? RequestedTodoId { get; private set; } // id ye gore kayit getirme

    // bunun gorevi kullaniciya gore getirme
    public Task<List<TodoDto>> GetAllForUserAsync(string userId)
    {
        RequestedUserId = userId;
        return Task.FromResult(AllTodosResult);
    }




    // bunun gorevi id ve kullaniciya gore kayit getirme
    public Task<TodoDto?> GetByIdForUserAsync(int id, string userId)
    {
        RequestedTodoId = id;
        RequestedUserId = userId;
        return Task.FromResult(TodoByIdResult);
    }


    // yeni kayit ekleme
    public Task<TodoDto> CreateAsync(CreateTodoDto dto, string userId)
    {
        if (CreateException is not null)
        {
            throw CreateException;
        }

        return Task.FromResult(CreatedTodoResult);
    }

    // kayit guncelleme




    //  bunun gorevi kayit guncelleme
    public Task<bool> UpdateForUserAsync(int id, UpdateTodoDto dto, string userId)
    {
        RequestedTodoId = id;
        RequestedUserId = userId;
        return Task.FromResult(UpdateResult);
    }


    //  bunun gorevi kayit silme
    public Task<bool> DeleteForUserAsync(int id, string userId)
    {
        RequestedTodoId = id;
        RequestedUserId = userId;
        return Task.FromResult(DeleteResult);
    }



}
