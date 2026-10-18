using TodoApp.Api.Dtos;
using TodoApp.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.IdentityModel.Tokens.Jwt;

namespace TodoApp.Api.Controllers;



[ApiController]
[Authorize]
// Bu sınıf, Todo öğeleri ile ilgili HTTP isteklerini işlemek için bir denetleyici (controller) olarak görev yapar. Bu denetleyici, Todo öğelerini oluşturma, okuma, güncelleme ve silme işlemlerini yönetir. Ayrıca, kullanıcıların yetkilendirilmiş olması gerektiğini belirtir.
[Route("api/[controller]")]
public class TodoController : ControllerBase
{

    private readonly ITodoService _todoService;

    public TodoController(ITodoService todoService)
    {
        _todoService = todoService;
    }

    [HttpGet]

    public async Task<ActionResult<List<TodoDto>>> GetAll()
    {
        var userId = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;

        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized();
        }

        var todos = await _todoService.GetAllForUserAsync(userId);
        return Ok(todos);
    }

    [HttpGet("{id}")]

    public async Task<IActionResult> GetById(int id)
    {
        var userId = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;

        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized();
        }

        var todo = await _todoService.GetByIdForUserAsync(id, userId);

        if (todo == null)
        {
            return NotFound();
        }

        return Ok(todo);
    }

    [HttpPost]

    public async Task<IActionResult> Create(CreateTodoDto dto)
    {



        var userId = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;

        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized();
        }



        try
        {
            var createdTodo = await _todoService.CreateAsync(dto, userId);



            return CreatedAtAction(nameof(GetById), new { id = createdTodo.Id }, createdTodo);
        }


        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }


    // kayit guncelleme
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateTodoDto dto)
    {
        // kullanici id sini al
        var userId = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
        // kullanici id si yoksa yetkisiz
        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized();
        }

        // kayit guncelleme
        var result = await _todoService.UpdateForUserAsync(id, dto, userId);
        // kayit yoksa not found
        if (!result)
        {
            return NotFound();
        }

        // kayit guncellendiyse no content
        return NoContent();
    }


    // kayit silme

    // bunun gorevi kayit silme ve kullanici id sini alarak kayit silme islemini yapmak
    // kayit silme islemi basariliysa no content, kayit yoksa not found, kullanici id si yoksa unauthorized doner
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {

        // kullanici id sini al
        var userId = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;

        // kullanici id si yoksa yetkisiz
        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized();
        }
        // kayit silme islemi basariliysa no content, kayit yoksa not found doner
        var result = await _todoService.DeleteForUserAsync(id, userId);

        if (!result)
        {
            return NotFound();
        }

        return NoContent();
    }


}












