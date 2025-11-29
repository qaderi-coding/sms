using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopManagementSystem.Infrastructure.Data;
using Swashbuckle.AspNetCore.Annotations;

namespace ShopManagementSystem.API.Controllers;

[ApiController]
[Route("api/seed")]
[SwaggerTag("Database seeding endpoints")]
public class SeedController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<IdentityUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;

    public SeedController(
        ApplicationDbContext context,
        UserManager<IdentityUser> userManager,
        RoleManager<IdentityRole> roleManager)
    {
        _context = context;
        _userManager = userManager;
        _roleManager = roleManager;
    }

    [HttpPost("all")]
    [SwaggerOperation(Summary = "Migrate and seed all tables with sample data")]
    [SwaggerResponse(200, "Database migrated and seeded successfully")]
    public async Task<ActionResult> SeedAll()
    {
        try
        {
            // Ensure database is created
            await _context.Database.EnsureCreatedAsync();
            
            // Then seed data
            await DatabaseSeeder.SeedAsync(_context, _userManager, _roleManager);
            return Ok(new { message = "Database created and seeded successfully" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = "Database creation and seeding failed", error = ex.Message });
        }
    }

    [HttpPost("reset")]
    [SwaggerOperation(Summary = "Reset, create and seed database")]
    [SwaggerResponse(200, "Database reset, created and seeded successfully")]
    public async Task<ActionResult> ResetAndSeed()
    {
        try
        {
            await _context.Database.EnsureDeletedAsync();
            await _context.Database.EnsureCreatedAsync();
            await DatabaseSeeder.SeedAsync(_context, _userManager, _roleManager);
            return Ok(new { message = "Database reset, created and seeded successfully" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = "Reset, creation and seeding failed", error = ex.Message });
        }
    }
}