namespace OgrenciOtomasyon.API.Models;

public class Teacher
{
    public int Id { get; set; }
    public string? UserId { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;

    // Navigation
    public ICollection<Course> Courses { get; set; } = new List<Course>();
}




