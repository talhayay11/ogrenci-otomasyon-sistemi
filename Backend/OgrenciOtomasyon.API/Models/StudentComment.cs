namespace OgrenciOtomasyon.API.Models;

public class StudentComment
{
    public int Id { get; set; }
    public int StudentId { get; set; }
    public Student? Student { get; set; }
    public int? TeacherId { get; set; }
    public Teacher? Teacher { get; set; }
    public string Comment { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}



