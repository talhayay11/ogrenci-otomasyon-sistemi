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

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] Course course)
    {
        _db.Courses.Add(course);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetAll), new { id = course.Id }, course);
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll()
    {
        var courses = await _db.Courses.Include(c => c.Teacher).AsNoTracking().ToListAsync();
        return Ok(courses);
    }

    [HttpGet("my-courses")]
    [Authorize(Roles = "Teacher")]
    public async Task<IActionResult> GetMyCourses()
    {
        var teacherIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        // In a real app, we'd map Identity user to Teacher; here we return all for demo
        var courses = await _db.Courses.Include(c => c.Students).AsNoTracking().ToListAsync();
        return Ok(courses);
    }

    [HttpPost("{courseId:int}/students/{studentId:int}")]
    [Authorize(Roles = "Teacher")]
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
    [Authorize(Roles = "Teacher")]
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
}




