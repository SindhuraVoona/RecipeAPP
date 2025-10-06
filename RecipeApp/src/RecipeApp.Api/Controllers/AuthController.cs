using Microsoft.AspNetCore.Mvc;
using RecipeApp.Core.Models;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IUserService _service;

    public AuthController(IUserService service)
    {
        _service = service;
    }
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        if (string.IsNullOrEmpty(request?.Username) || string.IsNullOrEmpty(request?.Password))
        {
            return BadRequest("Username and password are required.");
        }

        var user = await _service.AuthenticateAsync(request.Username, request.Password);
        if (user != null)
        {
            // Return a token or user info (for demo, just user id)
            return Ok(new { userId = user.UserId, username = user.Username });
        }
        return Unauthorized();
    }
}