using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OgrenciOtomasyon.API.Data;
using OgrenciOtomasyon.API.Models;

namespace OgrenciOtomasyon.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GradesController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    public GradesController(ApplicationDbContext db) { _db = db; }

    [HttpPost]
    [Authorize(Roles = "Teacher")]
    public async Task<IActionResult> Create([FromBody] Grade grade)
    {
        var exists = await _db.Grades.AnyAsync(g => g.StudentId == grade.StudentId && g.CourseId == grade.CourseId);
        if (exists) return Conflict("Grade already exists for this student and course.");
        _db.Grades.Add(grade);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetMyGrades), new { }, grade);
    }

    [HttpGet("my-grades")]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> GetMyGrades()
    {
        // In a real app map logged-in student to StudentId
        var grades = await _db.Grades.AsNoTracking().ToListAsync();
        return Ok(grades);
    }
}




