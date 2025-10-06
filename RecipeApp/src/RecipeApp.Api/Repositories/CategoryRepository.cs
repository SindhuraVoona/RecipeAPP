using Microsoft.EntityFrameworkCore;
using RecipeApp.Api.Data;
using RecipeApp.Core.Models;

public class CategoryRepository : ICategoryRepository
{
    private readonly RecipeDbContext _context;

    public CategoryRepository(RecipeDbContext context)
    {
        _context = context;
    }

    public async Task<List<Category>> GetAllCategoriesAsync()
    {
        return await (_context.Categories ?? throw new InvalidOperationException("Categories DbSet is null")).ToListAsync();
    }

    public async Task<Category?> GetCategoryByIdAsync(int id)
    {
        return await (_context.Categories ?? throw new InvalidOperationException("Categories DbSet is null")).FindAsync(id);
    }
}