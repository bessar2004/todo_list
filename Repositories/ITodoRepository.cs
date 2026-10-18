using TodoApp.Api.Models;

namespace TodoApp.Api.Repositories;




public interface ITodoRepository
{




    Task<TodoItem?> GetByIdForUserAsync(int id, string userId); // id ve kullaniciya gore kayit getir

    Task AddAsync(TodoItem todoItem); // yeni kayit ekle

    void Update(TodoItem todoItem); // kayit guncelle

    void Delete(TodoItem todoItem); // kayit sil
    Task<List<TodoItem>> GetAllForUserAsync(string userId); // kullaniciya gore kayitlari getir

    Task SaveChangesAsync(); // degisiklikleri kaydet


}
