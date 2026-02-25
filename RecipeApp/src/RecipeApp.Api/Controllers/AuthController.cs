// ...existing code...
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using RecipeApp.Core.Models;
using System.Diagnostics;
using Microsoft.AspNetCore.Authorization;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly IConfiguration _config;

    public AuthController(IUserService userService, IConfiguration config)
    {
        _userService = userService;
        _config = config;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest request)
    {
        var user = new User
        {
            Username = request.Username,
            Name = request.Name,
            Age = request.Age,
            Gender = request.Gender,
            Address = request.Address
        };

        await _userService.CreateUserAsync(user, request.Password);
        return Ok(new { message = "Registered" });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        var user = await _userService.AuthenticateAsync(request.Username!, request.Password!);
        if (user == null) return Unauthorized();

        var token = GenerateJwt(user);
        return Ok(new { token });
    }

[Authorize] // Ensure the user is authenticated
[HttpGet("profile")]
public async Task<IActionResult> GetProfile()
{
    // Get the user ID from the token claims
    var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "id");
    if (userIdClaim == null) return Unauthorized();

        if (!Guid.TryParse(userIdClaim.Value, out var userId))
        {
            return Unauthorized();
        }

    // Fetch user details from the database
    var user = await _userService.GetUserByIdAsync(userId);
    if (user == null) return NotFound();

    // Return user profile details
    return Ok(new
    {
        user.UserId,
        user.Username,
        user.Email,
        user.Name,
        user.Age,
        user.Gender,
        user.Address,
        user.CreatedAt
    });
}
    private string GenerateJwt(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"] ?? throw new InvalidOperationException("Jwt:Key not set")));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Username ?? string.Empty),
            new Claim("id", user.UserId.ToString())
        };

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(2),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}