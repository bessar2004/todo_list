namespace TodoApp.Api.Models;


// bu enum, todo öğelerinin öncelik seviyelerini temsil eder. Her bir öncelik seviyesi, bir tamsayı değeri ile eşleştirilmiştir. Bu sayede, todo öğeleri önceliklerine göre sıralanabilir veya filtrelenebilir.
public enum TodoPriority
{
    Low = 0,
    Medium = 1,
    High = 2
}