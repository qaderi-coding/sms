using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
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
    [SwaggerOperation(Summary = "Seed all tables with sample data")]
    [SwaggerResponse(200, "Database seeded successfully")]
    public async Task<ActionResult> SeedAll()
    {
        try
        {
            await DatabaseSeeder.SeedAsync(_context, _userManager, _roleManager);
            return Ok(new { message = "Database seeded successfully" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = "Seeding failed", error = ex.Message });
        }
    }

    [HttpPost("reset")]
    [SwaggerOperation(Summary = "Reset and seed database")]
    [SwaggerResponse(200, "Database reset and seeded successfully")]
    public async Task<ActionResult> ResetAndSeed()
    {
        try
        {
            await _context.Database.EnsureDeletedAsync();
            await _context.Database.EnsureCreatedAsync();
            await DatabaseSeeder.SeedAsync(_context, _userManager, _roleManager);
            return Ok(new { message = "Database reset and seeded successfully" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = "Reset and seeding failed", error = ex.Message });
        }
    }
}