using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OgrenciOtomasyon.API.Data;
using OgrenciOtomasyon.API.Models;

namespace OgrenciOtomasyon.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TeachersController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    public TeachersController(ApplicationDbContext db) { _db = db; }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAll()
    {
        var teachers = await _db.Teachers.AsNoTracking().ToListAsync();
        return Ok(teachers);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] Teacher teacher)
    {
        _db.Teachers.Add(teacher);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetAll), new { id = teacher.Id }, teacher);
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update([FromRoute] int id, [FromBody] Teacher update)
    {
        var teacher = await _db.Teachers.FindAsync(id);
        if (teacher is null) return NotFound();
        teacher.FirstName = update.FirstName;
        teacher.LastName = update.LastName;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete([FromRoute] int id)
    {
        var teacher = await _db.Teachers.FindAsync(id);
        if (teacher is null) return NotFound();
        
        _db.Teachers.Remove(teacher);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}




