using System.ComponentModel.DataAnnotations;
using TodoApp.Api.Models;


namespace TodoApp.Api.Dtos;

public class CreateTodoDto

{


    // bos birakilamaz 
    [Required]
    [MaxLength(100)]

    public string Title { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    public TodoStatus Status { get; set; } = TodoStatus.todo;

    public TodoPriority Priority { get; set; } = TodoPriority.Medium;

    public DateTime? DueDate { get; set; }







}