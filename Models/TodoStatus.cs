namespace TodoApp.Api.Models;

// bu enum, todo öğelerinin durumlarını temsil eder. Her bir durum, bir tamsayı değeri ile eşleştirilmiştir. Bu sayede, todo öğeleri durumlarına göre sıralanabilir veya filtrelenebilir.
public enum TodoStatus
{
    
    todo=0,
    InProgress=1,
    Done=2
}