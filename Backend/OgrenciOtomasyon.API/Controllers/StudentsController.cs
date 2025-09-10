using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OgrenciOtomasyon.API.Data;
using OgrenciOtomasyon.API.Models;
using System.Security.Claims;

namespace OgrenciOtomasyon.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StudentsController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    public StudentsController(ApplicationDbContext db) { _db = db; }

    [HttpGet("me")]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> GetMe()
    {
        var userId = User.FindFirstValue(System.Security.Claims.ClaimTypes.NameIdentifier);
        var student = await _db.Students.AsNoTracking().FirstOrDefaultAsync(s => s.UserId == userId);
        if (student is null) return NotFound();
        return Ok(student);
    }

    [HttpGet]
    [Authorize(Roles = "Admin,Teacher")]
    public async Task<IActionResult> GetAll()
    {
        var students = await _db.Students.AsNoTracking().ToListAsync();
        return Ok(students);
    }

    [HttpGet("{id:int}")]
    [Authorize]
    public async Task<IActionResult> GetById([FromRoute] int id)
    {
        var student = await _db.Students.AsNoTracking().FirstOrDefaultAsync(s => s.Id == id);
        if (student is null) return NotFound();
        if (User.IsInRole("Admin") || User.IsInRole("Teacher")) return Ok(student);
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!string.IsNullOrEmpty(userIdClaim) && User.IsInRole("Student") && student.UserId == userIdClaim) return Ok(student);
        return Forbid();
    }

    [HttpPost("{id:int}/comments")]
    [Authorize(Roles = "Teacher")]
    public async Task<IActionResult> AddComment([FromRoute] int id, [FromBody] string comment)
    {
        var student = await _db.Students.FindAsync(id);
        if (student is null) return NotFound();
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var teacher = await _db.Teachers.FirstOrDefaultAsync(t => t.UserId == userId);
        _db.StudentComments.Add(new StudentComment { StudentId = id, TeacherId = teacher?.Id, Comment = comment });
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Teacher")]
    public async Task<IActionResult> Create([FromBody] Student student)
    {
        _db.Students.Add(student);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = student.Id }, student);
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin,Teacher")]
    public async Task<IActionResult> Update([FromRoute] int id, [FromBody] Student update)
    {
        var student = await _db.Students.FindAsync(id);
        if (student is null) return NotFound();
        student.FirstName = update.FirstName;
        student.LastName = update.LastName;
        student.StudentNumber = update.StudentNumber;
        await _db.SaveChangesAsync();
        return NoContent();
    }
}




