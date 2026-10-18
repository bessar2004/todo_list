using Microsoft.AspNetCore.Mvc;
using TodoApp.Api.Controllers;
using TodoApp.Api.Dtos;
using TodoApp.Api.Models;
using TodoApp.Api.Tests.Fakes;

using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;

namespace TodoApp.Api.Tests.Controllers;

public class TodoControllerTests
{
    [Fact]
    public async Task GetAll_ReturnsOkWithTodos()
    {
        var todos = new List<TodoDto>
        {
            new()
            {
                Id = 1,
                Title = "Test görevi",
                Status = TodoStatus.todo,
                Priority = TodoPriority.Medium
            }
        };
        var service = new FakeTodoService
        {
            AllTodosResult = todos
        };
        var controller = CreateControllerWithUser(service);

        var result = await controller.GetAll();

        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        Assert.Same(todos, okResult.Value);
        Assert.Equal("test-user-id", service.RequestedUserId);
    }

    [Fact]
    public async Task GetById_WhenTodoExists_ReturnsOk()
    {
        var todo = new TodoDto
        {
            Id = 2,
            Title = "Bulunan görev"
        };
        var service = new FakeTodoService
        {
            TodoByIdResult = todo
        };
        var controller = CreateControllerWithUser(service);
        var result = await controller.GetById(2);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Same(todo, okResult.Value);

        Assert.Equal(2, service.RequestedTodoId);
        Assert.Equal("test-user-id", service.RequestedUserId);
    }

    // GetById_WhenTodoDoesNotExist_ReturnsNotFound testini ekledik
    // bu test, GetById metodunun, belirtilen ID'ye sahip bir Todo öğesi bulunamadığında NotFoundResult döndürdüğünü doğrular.
    [Fact]
    public async Task GetById_WhenTodoDoesNotExist_ReturnsNotFound()
    {
        var controller = CreateControllerWithUser(new FakeTodoService());
        var result = await controller.GetById(404);

        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public async Task Create_ReturnsCreatedAtAction()
    {
        var createdTodo = new TodoDto
        {
            Id = 8,
            Title = "Oluşturulan görev"
        };
        var service = new FakeTodoService
        {
            CreatedTodoResult = createdTodo
        };
        var controller = CreateControllerWithUser(service);

        var result = await controller.Create(
            new CreateTodoDto
            {
                Title = "Oluşturulan görev"
            }
        );

        var createdResult = Assert.IsType<CreatedAtActionResult>(result);
        Assert.Equal(nameof(TodoController.GetById), createdResult.ActionName);
        Assert.Equal(8, createdResult.RouteValues!["id"]);
        Assert.Same(createdTodo, createdResult.Value);
    }

    [Fact]
    public async Task Create_WhenServiceRejectsRequest_ReturnsBadRequest()
    {
        var service = new FakeTodoService
        {
            CreateException = new ArgumentException("Görev geçersiz.")
        };
        var controller = CreateControllerWithUser(service);

        var result = await controller.Create(new CreateTodoDto());

        var badRequest = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("Görev geçersiz.", badRequest.Value);
    }

    [Fact]
    public async Task Update_WhenTodoExists_ReturnsNoContent()
    {

        // bunun gorevi UpdateForUserAsync metodunun doğru parametrelerle çağrıldığını doğrulamak
        var service = new FakeTodoService
        {
            UpdateResult = true
        };

        // bunun gorevi CreateControllerWithUser metodunu kullanarak bir TodoController örneği oluşturmak
        var controller = CreateControllerWithUser(service);

        // bunun gorevi Update metodunu çağırmak ve sonucu almak
        var result = await controller.Update(
            3,
            new UpdateTodoDto
            {
                Title = "Güncellenen görev"
            }
        );

        // burada NotFoundResult yerine NoContentResult döndüğünü doğruluyoruz
        Assert.IsType<NoContentResult>(result);
        // burada UpdateForUserAsync metodunun doğru parametrelerle çağrıldığını doğruluyoruz
        Assert.Equal(3, service.RequestedTodoId);
        // burada UpdateForUserAsync metodunun doğru kullanıcı ID'si ile çağrıldığını doğruluyoruz
        Assert.Equal("test-user-id", service.RequestedUserId);
    }

    [Fact]
    public async Task Update_WhenTodoDoesNotExist_ReturnsNotFound()
    {
        var controller = CreateControllerWithUser(new FakeTodoService());
        var result = await controller.Update(
            404,
            new UpdateTodoDto
            {
                Title = "Bulunmayan görev"
            }
        );

        Assert.IsType<NotFoundResult>(result);
    }
    // bunun gorevi Update_WhenTodoDoesNotExist_ReturnsNotFound testini eklemek ve açıklamak
    [Fact]
    public async Task Delete_WhenTodoExists_ReturnsNoContent()
    {
        var service = new FakeTodoService
        {
            DeleteResult = true
        };
        var controller = CreateControllerWithUser(service);

        var result = await controller.Delete(5);

        Assert.IsType<NoContentResult>(result);
        Assert.Equal(5, service.RequestedTodoId);
        Assert.Equal("test-user-id", service.RequestedUserId);
    }

    //  bunun gorevi Delete_WhenTodoDoesNotExist_ReturnsNotFound testini eklemek ve açıklamak
    [Fact]
    public async Task Delete_WhenTodoDoesNotExist_ReturnsNotFound()
    {
        var controller = CreateControllerWithUser(new FakeTodoService());

        var result = await controller.Delete(404);

        Assert.IsType<NotFoundResult>(result);
    }



    private static TodoController CreateControllerWithUser(FakeTodoService service)
    {
        var controller = new TodoController(service);

        var identity = new ClaimsIdentity(
            new[] { new Claim(JwtRegisteredClaimNames.Sub, "test-user-id") },
            "Test");

        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext
            {
                User = new ClaimsPrincipal(identity)
            }
        };

        return controller;
    }




}


// not:

//Özetle bu dosyalar, yazdığın silme fonksiyonunun (Controller) hem doğru veri 
// geldiğinde hem de hatalı/eksik veri geldiğinde tam olarak senin tasarladığın
//  gibi, kontrollü bir şekilde çalıştığını ispatlayan kod bloklarıdır.
