using TodoApp.Api.Models;
using TodoApp.Api.Dtos;




namespace TodoApp.Api.Services;



public interface ITodoService

{


    Task<List<TodoDto>> GetAllForUserAsync(string userId); // gorevi kullaniciya gore getirme

    Task<TodoDto?> GetByIdForUserAsync(int id, string userId);
    Task<TodoDto> CreateAsync(CreateTodoDto dto, string userId);

    // bunun gorevi kayit guncelleme
    Task<bool> UpdateForUserAsync(int id, UpdateTodoDto dto, string userId);


    // bunun gorevi kayit silme
    Task<bool> DeleteForUserAsync(int id, string userId);



}
