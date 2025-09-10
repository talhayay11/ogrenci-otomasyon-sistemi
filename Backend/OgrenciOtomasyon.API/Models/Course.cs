namespace OgrenciOtomasyon.API.Models;

public class Course
{
    public int Id { get; set; }
    public string CourseName { get; set; } = string.Empty;
    public string CourseCode { get; set; } = string.Empty;
    public string Status { get; set; } = "Planned"; // Planned, Ongoing, Finished

    public int TeacherId { get; set; }
    public Teacher? Teacher { get; set; }

    public ICollection<Student> Students { get; set; } = new List<Student>();
    public ICollection<Grade> Grades { get; set; } = new List<Grade>();
    public ICollection<Attendance> Attendances { get; set; } = new List<Attendance>();
}




