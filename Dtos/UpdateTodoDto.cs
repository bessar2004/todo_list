using System.ComponentModel.DataAnnotations;
using TodoApp.Api.Models;


namespace TodoApp.Api.Dtos;

public class UpdateTodoDto

{


    [Required]
    [MaxLength(100)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    public TodoStatus Status { get; set; }

    public TodoPriority Priority { get; set; }

    // bu alan, todo öğesinin son teslim tarihini temsil eder. Boş olabilir ve null değer alabilir. Eğer todo öğesi için bir son teslim tarihi belirlenmişse, bu alan o tarihi tutar.
    public DateTime? DueDate { get; set; }







}