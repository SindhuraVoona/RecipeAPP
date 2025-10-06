using RecipeApp.Api.Data;
using RecipeApp.Core.Models;
using Microsoft.EntityFrameworkCore;

public class UserRepository : IUserRepository
{
    private readonly RecipeDbContext _context;
    public UserRepository(RecipeDbContext context) => _context = context;

    public async Task<User?> GetByUsernameAsync(string username)
    {
        return await _context.Users!.FirstOrDefaultAsync(u => u.Username == username);
    }
}