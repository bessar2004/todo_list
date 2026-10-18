using TodoApp.Api.Models;

namespace TodoApp.Api.Dtos;


// Api den istemciye 
public class TodoDto

{

    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    public TodoStatus Status { get; set; }

    public TodoPriority Priority { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? DueDate { get; set; }










}
