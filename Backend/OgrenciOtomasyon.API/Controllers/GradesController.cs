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
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<IActionResult> Create([FromBody] Grade grade)
    {
        var existing = await _db.Grades.FirstOrDefaultAsync(g => g.StudentId == grade.StudentId && g.CourseId == grade.CourseId);
        if (existing != null)
        {
            existing.Score = grade.Score;
            await _db.SaveChangesAsync();
            return Ok(existing);
        }
        _db.Grades.Add(grade);
        await _db.SaveChangesAsync();
        return Ok(grade);
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




