using TodoApp.Api.Dtos;
using TodoApp.Api.Models;
using TodoApp.Api.Services;
using TodoApp.Api.Tests.Fakes;

namespace TodoApp.Api.Tests.Services;

public class TodoServiceTests
{

    // GetAllForUserAsync_ReturnsOnlyOwnersTodosAndMapsToDtos testini ekledik 
    // ne yapar: Bu test, GetAllForUserAsync metodunun yalnızca belirli bir kullanıcıya ait görevleri döndürdüğünü ve bu görevlerin doğru şekilde DTO'ya dönüştürüldüğünü doğrular. Farklı kullanıcı kimliklerine sahip görevler ve sahibi olmayan görevler test verisi olarak eklenir ve yalnızca istenen kullanıcıya ait görevlerin döndürüldüğü kontrol edilir.
    [Fact]
    public async Task GetAllForUserAsync_ReturnsOnlyOwnersTodosAndMapsToDtos()
    {
        var dueDate = new DateTime(2026, 10, 15, 0, 0, 0, DateTimeKind.Utc);

        var repository = new FakeTodoRepository(
            new TodoItem
            {
                Id = 7,
                UserId = "ali-id",
                Title = "Ders çalış",
                Description = "Backend testlerini tamamla",
                Status = TodoStatus.InProgress,
                Priority = TodoPriority.High,
                CreatedAt = new DateTime(2026, 9, 27, 0, 0, 0, DateTimeKind.Utc),
                DueDate = dueDate
            },
            new TodoItem
            {
                Id = 8,
                UserId = "ayse-id",
                Title = "Ayşe'nin görevi"
            },
            new TodoItem
            {
                Id = 9,
                UserId = null,
                Title = "Sahibi olmayan eski görev"
            }
        );

        var service = new TodoService(repository);

        var result = await service.GetAllForUserAsync("ali-id");

        var todo = Assert.Single(result);
        Assert.Equal(7, todo.Id);
        Assert.Equal("Ders çalış", todo.Title);
        Assert.Equal("Backend testlerini tamamla", todo.Description);
        Assert.Equal(TodoStatus.InProgress, todo.Status);
        Assert.Equal(TodoPriority.High, todo.Priority);
        Assert.Equal(dueDate, todo.DueDate);
    }




    [Fact]
    public async Task GetByIdForUserAsync_ReturnsOnlyOwnersTodo()
    {
        var repository = new FakeTodoRepository(
            new TodoItem
            {
                Id = 7,
                UserId = "ali-id",
                Title = "Ali'nin görevi"
            }
        );
        var service = new TodoService(repository);

        var aliTodo = await service.GetByIdForUserAsync(7, "ali-id");
        var ayseTodo = await service.GetByIdForUserAsync(7, "ayse-id");

        Assert.NotNull(aliTodo);
        Assert.Equal("Ali'nin görevi", aliTodo.Title);
        Assert.Null(ayseTodo);
    }



    [Fact]
    public async Task CreateAsync_AddsTodoAndSavesChanges()
    {
        var repository = new FakeTodoRepository();
        var service = new TodoService(repository);
        var beforeCreate = DateTime.UtcNow;
        var dto = new CreateTodoDto
        {
            Title = "Yeni görev",
            Description = "Test açıklaması",
            Status = TodoStatus.todo,
            Priority = TodoPriority.Medium,
            DueDate = new DateTime(2026, 10, 20, 0, 0, 0, DateTimeKind.Utc)
        };

        var result = await service.CreateAsync(dto, "test-user-id");
        var storedTodo = Assert.Single(repository.Todos);
        Assert.Equal("test-user-id", storedTodo.UserId);
        Assert.Equal(1, result.Id);
        Assert.Equal(dto.Title, storedTodo.Title);
        Assert.Equal(dto.Description, storedTodo.Description);
        Assert.Equal(dto.Status, storedTodo.Status);
        Assert.Equal(dto.Priority, storedTodo.Priority);
        Assert.Equal(dto.DueDate, storedTodo.DueDate);
        Assert.InRange(result.CreatedAt, beforeCreate, DateTime.UtcNow);
        Assert.Equal(1, repository.SaveChangesCallCount);
    }

    [Fact]
    public async Task UpdateForUserAsync_WhenTodoExists_UpdatesTodoAndSavesChanges()
    {
        var storedTodo = new TodoItem
        {
            Id = 3,
            UserId = "ali-id",
            Title = "Eski başlık",
            Status = TodoStatus.todo,
            Priority = TodoPriority.Low
        };
        var repository = new FakeTodoRepository(storedTodo);
        var service = new TodoService(repository);
        var dto = new UpdateTodoDto
        {
            Title = "Yeni başlık",
            Description = "Yeni açıklama",
            Status = TodoStatus.Done,
            Priority = TodoPriority.High,
            DueDate = new DateTime(2026, 11, 1, 0, 0, 0, DateTimeKind.Utc)
        };

        var result = await service.UpdateForUserAsync(3, dto, "ali-id");

        Assert.True(result);
        Assert.Equal(dto.Title, storedTodo.Title);
        Assert.Equal(dto.Description, storedTodo.Description);
        Assert.Equal(dto.Status, storedTodo.Status);
        Assert.Equal(dto.Priority, storedTodo.Priority);
        Assert.Equal(dto.DueDate, storedTodo.DueDate);
        Assert.Equal(1, repository.SaveChangesCallCount);
    }

    [Fact]
    public async Task UpdateForUserAsync_WhenMovedToDone_SetsCompletedAt()
    {
        var storedTodo = new TodoItem { Id = 3, UserId = "ali-id", Title = "Görev", Status = TodoStatus.InProgress };
        var service = new TodoService(new FakeTodoRepository(storedTodo));
        var before = DateTime.UtcNow;

        await service.UpdateForUserAsync(3, new UpdateTodoDto { Title = "Görev", Status = TodoStatus.Done }, "ali-id");

        Assert.NotNull(storedTodo.CompletedAt);
        Assert.InRange(storedTodo.CompletedAt!.Value, before, DateTime.UtcNow);
    }

    [Fact]
    public async Task UpdateForUserAsync_WhenAlreadyDone_KeepsOriginalCompletedAt()
    {
        var completedAt = new DateTime(2026, 10, 1, 8, 0, 0, DateTimeKind.Utc);
        var storedTodo = new TodoItem
        {
            Id = 3, UserId = "ali-id", Title = "Görev", Status = TodoStatus.Done, CompletedAt = completedAt
        };
        var service = new TodoService(new FakeTodoRepository(storedTodo));

        await service.UpdateForUserAsync(3, new UpdateTodoDto { Title = "Yeni", Status = TodoStatus.Done }, "ali-id");

        Assert.Equal(completedAt, storedTodo.CompletedAt);
    }

    [Fact]
    public async Task UpdateForUserAsync_WhenReopened_ClearsCompletedAt()
    {
        var storedTodo = new TodoItem
        {
            Id = 3, UserId = "ali-id", Title = "Görev", Status = TodoStatus.Done, CompletedAt = DateTime.UtcNow
        };
        var service = new TodoService(new FakeTodoRepository(storedTodo));

        await service.UpdateForUserAsync(3, new UpdateTodoDto { Title = "Görev", Status = TodoStatus.InProgress }, "ali-id");

        Assert.Null(storedTodo.CompletedAt);
    }

    [Fact]
    public async Task CreateAsync_WhenCreatedAsDone_SetsCompletedAt()
    {
        var service = new TodoService(new FakeTodoRepository());

        var result = await service.CreateAsync(new CreateTodoDto { Title = "Bitmiş", Status = TodoStatus.Done }, "ali-id");

        Assert.NotNull(result.CompletedAt);
    }

    [Fact]
    public async Task UpdateForUserAsync_WhenTodoDoesNotExist_ReturnsFalseWithoutSaving()
    {
        var repository = new FakeTodoRepository();
        var service = new TodoService(repository);
        var dto = new UpdateTodoDto
        {
            Title = "Bulunmayan görev",
            Status = TodoStatus.todo,
            Priority = TodoPriority.Low
        };

        var result = await service.UpdateForUserAsync(404, dto, "ali-id");
        Assert.False(result);
        Assert.Equal(0, repository.SaveChangesCallCount);
    }


    // UpdateForUserAsync_ChangesOnlyOwnersTodo testini ekledik
    // ne yapar: Bu test, UpdateForUserAsync metodunun yalnızca görev sahibinin kaydını güncellediğini doğrular. Başka bir kullanıcı aynı görevi güncellemeye çalıştığında, değişiklik yapılmaz ve SaveChanges çağrılmaz. Görev sahibi doğru kullanıcı kimliği ile güncelleme yaptığında ise değişiklikler uygulanır ve SaveChanges çağrılır.
    [Fact]
    public async Task UpdateForUserAsync_ChangesOnlyOwnersTodo()
    {
        var storedTodo = new TodoItem
        {
            Id = 3,
            UserId = "ali-id",
            Title = "Eski başlık"
        };
        var repository = new FakeTodoRepository(storedTodo);
        var service = new TodoService(repository);
        var dto = new UpdateTodoDto { Title = "Yeni başlık" };

        var denied = await service.UpdateForUserAsync(3, dto, "ayse-id");

        Assert.False(denied);
        Assert.Equal("Eski başlık", storedTodo.Title);
        Assert.Equal(0, repository.SaveChangesCallCount);

        var allowed = await service.UpdateForUserAsync(3, dto, "ali-id");

        Assert.True(allowed);
        Assert.Equal("Yeni başlık", storedTodo.Title);
        Assert.Equal(1, repository.SaveChangesCallCount);
    }




    // bunun gorevi DeleteForUserAsync_DeletesOnlyOwnersTodo testini eklemek ve açıklamak
    // ne yapar: Bu test, DeleteForUserAsync metodunun yalnızca görev sahibinin kaydını sildiğini doğrular. Başka bir kullanıcı aynı görevi silmeye çalıştığında, silme işlemi gerçekleşmez ve SaveChanges çağrılmaz. Görev sahibi doğru kullanıcı kimliği ile silme yaptığında ise görev silinir ve SaveChanges çağrılır.
    [Fact]
    public async Task DeleteForUserAsync_DeletesOnlyOwnersTodo()
    {
        var storedTodo = new TodoItem
        {
            Id = 5,
            UserId = "ali-id",
            Title = "Ali'nin görevi"
        };
        var repository = new FakeTodoRepository(storedTodo);
        var service = new TodoService(repository);

        var denied = await service.DeleteForUserAsync(5, "ayse-id");

        Assert.False(denied);
        Assert.Single(repository.Todos);
        Assert.Equal(0, repository.SaveChangesCallCount);

        var allowed = await service.DeleteForUserAsync(5, "ali-id");

        Assert.True(allowed);
        Assert.Empty(repository.Todos);
        Assert.Equal(1, repository.SaveChangesCallCount);
    }



    [Fact]
    public async Task DeleteForUserAsync_WhenTodoExists_DeletesTodoAndSavesChanges()
    {
        var repository = new FakeTodoRepository(
            new TodoItem
            {

                Id = 5,
                UserId = "ali-id",
                Title = "Silinecek görev"
            }
        );
        var service = new TodoService(repository);

        var result = await service.DeleteForUserAsync(5, "ali-id");
        Assert.True(result);
        Assert.Empty(repository.Todos);
        Assert.Equal(1, repository.SaveChangesCallCount);
    }

    // DeleteForUserAsync_WhenTodoDoesNotExist_ReturnsFalseWithoutSaving testini ekledik

    // ne yapar: Bu test, DeleteForUserAsync metodunun var olmayan bir görevi silmeye çalıştığında false döndürdüğünü ve SaveChanges çağrılmadığını doğrular.
    [Fact]
    public async Task DeleteForUserAsync_WhenTodoDoesNotExist_ReturnsFalseWithoutSaving()
    {
        var repository = new FakeTodoRepository();
        var service = new TodoService(repository);

        var result = await service.DeleteForUserAsync(404, "ali-id");
        Assert.False(result);
        Assert.Equal(0, repository.SaveChangesCallCount);
    }
}
