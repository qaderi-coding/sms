using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ShopManagementSystem.Application.DTOs.Requests;
using ShopManagementSystem.Application.DTOs.Responses;
using ShopManagementSystem.Application.Services;
using Swashbuckle.AspNetCore.Annotations;

namespace ShopManagementSystem.API.Controllers;

[ApiController]
[Route("api/auth")]
[SwaggerTag("Authentication endpoints")]
public class AuthController : ControllerBase
{
    private readonly UserManager<IdentityUser> _userManager;
    private readonly SignInManager<IdentityUser> _signInManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly ITokenService _tokenService;

    public AuthController(
        UserManager<IdentityUser> userManager,
        SignInManager<IdentityUser> signInManager,
        RoleManager<IdentityRole> roleManager,
        ITokenService tokenService)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _roleManager = roleManager;
        _tokenService = tokenService;
    }

    [HttpPost("register")]
    [SwaggerOperation(Summary = "Register new user")]
    [SwaggerResponse(200, "User registered successfully", typeof(RegisterResponse))]
    [SwaggerResponse(400, "Registration failed", typeof(RegisterResponse))]
    public async Task<ActionResult<RegisterResponse>> Register([FromBody] RegisterRequest request)
    {
        var user = new IdentityUser
        {
            UserName = request.Email, // Use email as username to avoid validation issues
            Email = request.Email
        };

        var result = await _userManager.CreateAsync(user, request.Password);

        if (result.Succeeded)
        {
            // Store first and last name in claims
            await _userManager.AddClaimAsync(user, new System.Security.Claims.Claim("FirstName", request.FirstName));
            await _userManager.AddClaimAsync(user, new System.Security.Claims.Claim("LastName", request.LastName));
            
            // Assign default role
            await _userManager.AddToRoleAsync(user, "User");
            
            return Ok(new RegisterResponse
            {
                Success = true,
                Message = "User registered successfully"
            });
        }

        return BadRequest(new RegisterResponse
        {
            Success = false,
            Message = "Registration failed",
            Errors = result.Errors.Select(e => e.Description).ToList()
        });
    }

    [HttpPost("login")]
    [SwaggerOperation(Summary = "User login")]
    [SwaggerResponse(200, "Login successful", typeof(LoginResponse))]
    [SwaggerResponse(401, "Invalid credentials")]
    public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null)
        {
            return Unauthorized("Invalid credentials");
        }

        var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);
        if (!result.Succeeded)
        {
            return Unauthorized("Invalid credentials");
        }

        var roles = await _userManager.GetRolesAsync(user);
        var claims = await _userManager.GetClaimsAsync(user);
        
        var firstName = claims.FirstOrDefault(c => c.Type == "FirstName")?.Value ?? "";
        var lastName = claims.FirstOrDefault(c => c.Type == "LastName")?.Value ?? "";
        
        var token = await _tokenService.GenerateTokenAsync(user.Id, user.UserName!, user.Email!, roles);

        return Ok(new LoginResponse
        {
            Token = token,
            Email = user.Email!,
            FirstName = firstName,
            LastName = lastName,
            Roles = roles.ToList(),
            ExpiresAt = DateTime.Now.AddHours(24)
        });
    }

    [HttpGet("me")]
    [Authorize]
    [SwaggerOperation(Summary = "Get current user details")]
    [SwaggerResponse(200, "User details retrieved successfully", typeof(UserDetailsResponse))]
    [SwaggerResponse(401, "Unauthorized")]
    public async Task<ActionResult<UserDetailsResponse>> GetCurrentUser()
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            return Unauthorized();
        }

        var roles = await _userManager.GetRolesAsync(user);
        var claims = await _userManager.GetClaimsAsync(user);
        
        var firstName = claims.FirstOrDefault(c => c.Type == "FirstName")?.Value ?? "";
        var lastName = claims.FirstOrDefault(c => c.Type == "LastName")?.Value ?? "";

        return Ok(new UserDetailsResponse
        {
            Id = user.Id,
            Email = user.Email!,
            FirstName = firstName,
            LastName = lastName,
            Roles = roles.ToList(),
            EmailConfirmed = user.EmailConfirmed
        });
    }

    [HttpPost("seed-roles")]
    [SwaggerOperation(Summary = "Seed default roles")]
    public async Task<ActionResult> SeedRoles()
    {
        var roles = new[] { "Admin", "Manager", "User" };

        foreach (var role in roles)
        {
            if (!await _roleManager.RoleExistsAsync(role))
            {
                await _roleManager.CreateAsync(new IdentityRole(role));
            }
        }

        return Ok("Roles seeded successfully");
    }
}