namespace OgrenciOtomasyon.API.Models;

public class Attendance
{
    public int Id { get; set; }
    public DateOnly Date { get; set; }
    public bool IsPresent { get; set; }

    public int StudentId { get; set; }
    public Student? Student { get; set; }

    public int CourseId { get; set; }
    public Course? Course { get; set; }
}




