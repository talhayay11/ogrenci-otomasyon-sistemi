using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using OgrenciOtomasyon.API.Services;
using OgrenciOtomasyon.API.Data;
using OgrenciOtomasyon.API.Models;

namespace OgrenciOtomasyon.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<IdentityUser> _userManager;
    private readonly SignInManager<IdentityUser> _signInManager;
    private readonly JwtTokenService _jwtTokenService;

    private readonly ApplicationDbContext _db;
    public AuthController(UserManager<IdentityUser> userManager,
        SignInManager<IdentityUser> signInManager,
        JwtTokenService jwtTokenService,
        ApplicationDbContext db)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _jwtTokenService = jwtTokenService;
        _db = db;
    }

    public record RegisterRequest(string Email, string Password, string Role);
    public record LoginRequest(string Email, string Password);

    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var user = new IdentityUser { UserName = request.Email, Email = request.Email };
        var result = await _userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }

        if (!string.IsNullOrWhiteSpace(request.Role))
        {
            await _userManager.AddToRoleAsync(user, request.Role);
            if (request.Role == "Student")
            {
                _db.Students.Add(new Student { UserId = user.Id, FirstName = request.Email, LastName = "", StudentNumber = DateTime.UtcNow.Ticks.ToString() });
                await _db.SaveChangesAsync();
            }
            else if (request.Role == "Teacher")
            {
                _db.Teachers.Add(new Teacher { UserId = user.Id, FirstName = request.Email, LastName = "" });
                await _db.SaveChangesAsync();
            }
        }

        return Ok();
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user is null)
        {
            return Unauthorized();
        }

        var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);
        if (!result.Succeeded)
        {
            return Unauthorized();
        }

        var roles = await _userManager.GetRolesAsync(user);
        var token = _jwtTokenService.GenerateToken(user, roles);
        return Ok(new { token });
    }
}




