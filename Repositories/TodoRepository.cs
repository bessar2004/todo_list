using Microsoft.EntityFrameworkCore;
using TodoApp.Api.Data;
using TodoApp.Api.Models;


namespace TodoApp.Api.Repositories;


public class TodoRepository : ITodoRepository


{


    private readonly AppDbContext _context; // AppDbContext nesnesini tutacak alan


    // Constructor injection ile AppDbContext nesnesini alıyoruz
    public TodoRepository(AppDbContext context)
    {
        _context = context;
    }







    // id ve kullaniciya gore kayit getir
    public async Task<TodoItem?> GetByIdForUserAsync(int id, string userId)
    {
        return await _context.TodoItems
            .FirstOrDefaultAsync(todo => todo.Id == id && todo.UserId == userId);
    }



    public async Task<List<TodoItem>> GetAllForUserAsync(string userId)
    {
        return await _context.TodoItems
            .Where(todo => todo.UserId == userId)
            .ToListAsync();
    }

    public async Task AddAsync(TodoItem todoItem)
    {
        await _context.TodoItems.AddAsync(todoItem); // yeni kayit ekle
    }

    public void Update(TodoItem todoItem)
    {
        _context.TodoItems.Update(todoItem); // kayit guncelle
    }


    public void Delete(TodoItem todoItem)
    {
        _context.TodoItems.Remove(todoItem); // kayit sil
    }


    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync(); // degisiklikleri kaydet
    }











}


