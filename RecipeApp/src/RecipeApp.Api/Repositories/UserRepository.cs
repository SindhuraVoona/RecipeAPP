using RecipeApp.Api.Data;
using RecipeApp.Core.Models;
using Microsoft.EntityFrameworkCore;

public class UserRepository : IUserRepository
{
    private readonly RecipeDbContext _context;
    public UserRepository(RecipeDbContext context) => _context = context;

    // create user - hash password before saving
    public async Task<User> CreateUserAsync(User user, string password)
    {
        // store bcrypt hash in PasswordHash property
        user.Password = BCrypt.Net.BCrypt.HashPassword(password);
        await _context.Users!.AddAsync(user);
        await _context.SaveChangesAsync();
        return user;
    }
    
    public async Task<User?> GetByUsernameAsync(string username)
    {
        return await _context.Users!.FirstOrDefaultAsync(u => u.Username == username);
    }

    public async Task<User?> GetUserByIdAsync(Guid userId)
    {
        return await _context.Users!.FirstOrDefaultAsync(u => u.UserId == userId);
    }
}