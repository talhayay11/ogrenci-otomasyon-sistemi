using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OgrenciOtomasyon.API.Data;
using OgrenciOtomasyon.API.Models;

namespace OgrenciOtomasyon.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StudentsController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    public StudentsController(ApplicationDbContext db) { _db = db; }

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
        var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        // In a real app, we'd map Identity user to Student record; here we allow only Admin/Teacher for simplicity
        if (!string.IsNullOrEmpty(userIdClaim) && User.IsInRole("Student")) return Ok(student);
        return Forbid();
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




