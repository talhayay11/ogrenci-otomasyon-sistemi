using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OgrenciOtomasyon.API.Data;
using OgrenciOtomasyon.API.Models;
using System.Security.Claims;

namespace OgrenciOtomasyon.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AttendanceController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    public AttendanceController(ApplicationDbContext db) { _db = db; }

    [HttpPost]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<IActionResult> Mark([FromBody] Attendance attendance)
    {
        // expects Date, IsPresent, StudentId, CourseId
        _db.Attendances.Add(attendance);
        await _db.SaveChangesAsync();
        return Created("", attendance);
    }

    [HttpGet("my")]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> MyAttendance()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var student = await _db.Students.AsNoTracking().FirstOrDefaultAsync(s => s.UserId == userId);
        if (student is null) return Ok(Array.Empty<Attendance>());
        var list = await _db.Attendances.Where(a => a.StudentId == student.Id).AsNoTracking().ToListAsync();
        return Ok(list);
    }
}



