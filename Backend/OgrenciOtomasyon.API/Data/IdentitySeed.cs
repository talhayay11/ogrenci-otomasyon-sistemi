using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace OgrenciOtomasyon.API.Data;

public static class IdentitySeed
{
    public static async Task SeedAsync(IServiceProvider services)
    {
        using var scope = services.CreateScope();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<IdentityUser>>();

        // Simple retry to wait for DB readiness
        const int maxAttempts = 10;
        const int delayMs = 2000;
        int attempt = 0;
        while (true)
        {
            try
            {
                string[] roles = ["Admin", "Teacher", "Student"];
                foreach (var role in roles)
                {
                    if (!await roleManager.RoleExistsAsync(role))
                    {
                        await roleManager.CreateAsync(new IdentityRole(role));
                    }
                }

                // Seed a test admin
                var adminEmail = "admin@test.com";
                var admin = await userManager.Users.FirstOrDefaultAsync(u => u.Email == adminEmail);
                if (admin is null)
                {
                    admin = new IdentityUser { UserName = adminEmail, Email = adminEmail, EmailConfirmed = true };
                    var create = await userManager.CreateAsync(admin, "Admin123!*");
                    if (create.Succeeded)
                    {
                        await userManager.AddToRoleAsync(admin, "Admin");
                    }
                }

                break; // success
            }
            catch
            {
                attempt++;
                if (attempt >= maxAttempts) throw;
                await Task.Delay(delayMs);
            }
        }
    }
}




