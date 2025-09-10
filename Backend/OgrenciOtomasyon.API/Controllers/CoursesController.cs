using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OgrenciOtomasyon.API.Data;
using OgrenciOtomasyon.API.Models;
using System.Security.Claims;

namespace OgrenciOtomasyon.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CoursesController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    public CoursesController(ApplicationDbContext db) { _db = db; }

    public class CreateCourseRequest
    {
        public string CourseName { get; set; } = string.Empty;
        public string CourseCode { get; set; } = string.Empty;
        public int TeacherId { get; set; }
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] CreateCourseRequest request)
    {
        var teacher = await _db.Teachers.FindAsync(request.TeacherId);
        if (teacher is null)
        {
            return BadRequest("Geçerli bir öğretmen seçiniz.");
        }
        var course = new Course
        {
            CourseName = request.CourseName,
            CourseCode = request.CourseCode,
            TeacherId = request.TeacherId,
            Status = "Planned"
        };
        _db.Courses.Add(course);
        await _db.SaveChangesAsync();
        return Ok(course);
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll()
    {
        var courses = await _db.Courses.Include(c => c.Teacher).AsNoTracking().ToListAsync();
        return Ok(courses);
    }

    [HttpGet("{id:int}")]
    [Authorize]
    public async Task<IActionResult> GetById([FromRoute] int id)
    {
        var course = await _db.Courses
            .Include(c => c.Teacher)
            .Include(c => c.Students)
            .Include(c => c.Grades)
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == id);
        if (course is null) return NotFound();
        return Ok(course);
    }

    [HttpGet("my-enrollments")]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> GetMyEnrollments()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var student = await _db.Students.Include(s => s.Courses)
            .ThenInclude(c => c.Teacher)
            .AsNoTracking()
            .FirstOrDefaultAsync(s => s.UserId == userId);
        var list = student?.Courses?.ToList() ?? new List<Course>();
        return Ok(list);
    }

    [HttpGet("my-courses")]
    [Authorize(Roles = "Teacher")]
    public async Task<IActionResult> GetMyCourses()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var teacher = await _db.Teachers.AsNoTracking().FirstOrDefaultAsync(t => t.UserId == userId);
        var courses = await _db.Courses.Include(c => c.Students)
            .Where(c => teacher != null ? c.TeacherId == teacher.Id : false)
            .AsNoTracking().ToListAsync();
        return Ok(courses);
    }

    [HttpPost("{courseId:int}/students/{studentId:int}")]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<IActionResult> AddStudent([FromRoute] int courseId, [FromRoute] int studentId)
    {
        var course = await _db.Courses.Include(c => c.Students).FirstOrDefaultAsync(c => c.Id == courseId);
        var student = await _db.Students.FindAsync(studentId);
        if (course is null || student is null) return NotFound();
        if (!course.Students.Any(s => s.Id == studentId))
        {
            course.Students.Add(student);
            await _db.SaveChangesAsync();
        }
        return NoContent();
    }

    [HttpDelete("{courseId:int}/students/{studentId:int}")]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<IActionResult> RemoveStudent([FromRoute] int courseId, [FromRoute] int studentId)
    {
        var course = await _db.Courses.Include(c => c.Students).FirstOrDefaultAsync(c => c.Id == courseId);
        if (course is null) return NotFound();
        var student = course.Students.FirstOrDefault(s => s.Id == studentId);
        if (student is null) return NotFound();
        course.Students.Remove(student);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpPut("{courseId:int}/assign-teacher/{teacherId:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> AssignTeacher([FromRoute] int courseId, [FromRoute] int teacherId)
    {
        var course = await _db.Courses.FindAsync(courseId);
        if (course is null) return NotFound();
        var teacherExists = await _db.Teachers.AnyAsync(t => t.Id == teacherId);
        if (!teacherExists) return NotFound("Teacher not found");
        course.TeacherId = teacherId;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpPut("{courseId:int}/status")]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<IActionResult> UpdateStatus([FromRoute] int courseId, [FromBody] string status)
    {
        var course = await _db.Courses.FindAsync(courseId);
        if (course is null) return NotFound();
        course.Status = status;
        await _db.SaveChangesAsync();
        return NoContent();
    }
}




