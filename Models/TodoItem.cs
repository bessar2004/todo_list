namespace TodoApp.Api.Models;


public class TodoItem
{


    public int Id { get; set; } // Primary Key olarak kullanılacak ve veritabanında otomatik artacak şekilde ayarlanacak.
    public string Title { get; set; } = string.Empty; // Todo öğesinin başlığı, boş olamaz ve varsayılan olarak boş bir string ile başlatılır.

    public string? Description { get; set; }  // Todo öğesinin açıklaması, boş olabilir ve null değer alabilir.

    public string? UserId { get; set; }
    public ApplicationUser? User { get; set; }


    public TodoStatus Status { get; set; } = TodoStatus.todo;// Todo öğesinin durumu, varsayılan olarak "todo" durumuna ayarlanır.

    public TodoPriority Priority { get; set; } = TodoPriority.Low; // Todo öğesinin öncelik seviyesi, varsayılan olarak "Low" öncelik seviyesine ayarlanır.



    public DateTime CreatedAt { get; set; } = DateTime.UtcNow; // Todo öğesinin oluşturulma tarihi, varsayılan olarak UTC zaman diliminde geçerli tarih ve saat ile başlatılır.
    public DateTime? DueDate { get; set; }
    public DateTime? CompletedAt { get; set; }  // Todo öğesinin tamamlanma tarihi, boş olabilir ve null değer alabilir. Eğer todo öğesi tamamlanmışsa, bu alan tamamlanma tarihini tutar.



}
