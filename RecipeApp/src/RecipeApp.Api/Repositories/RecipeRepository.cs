// Repositories/RecipeRepository.cs
using Microsoft.EntityFrameworkCore;
using RecipeApp.Api.Data;
using RecipeApp.Core.Models;

public class RecipeRepository : IRecipeRepository
{
    private readonly RecipeDbContext _context;

    public RecipeRepository(RecipeDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Recipe>> GetAllRecipesAsync()
    {
        return await _context.Recipes!
            .Include(r => r.Category)
            .Include(r => r.RecipeIngredients)
                .ThenInclude(ri => ri.Ingredient)
            .ToListAsync();
    }

    public async Task<Recipe?> GetRecipeByIdAsync(int id)
    {
        return await _context.Recipes!
            .Include(r => r.Category)
            .Include(r => r.RecipeIngredients)
                .ThenInclude(ri => ri.Ingredient)
            .FirstOrDefaultAsync(r => r.RecipeId == id);
    }

    public async Task<Recipe> AddRecipeAsync(Recipe recipe)
    {
        if (_context.Recipes == null)
            throw new InvalidOperationException("Recipes DbSet is null.");

        _context.Recipes.Add(recipe);
        await _context.SaveChangesAsync();
        return recipe;
    }

    public async Task<Recipe?> UpdateRecipeAsync(Recipe recipe)
    {
        var existing = await _context.Recipes!.FindAsync(recipe.RecipeId);
        if (existing == null)
            return null;

        _context.Entry(existing).CurrentValues.SetValues(recipe);
        await _context.SaveChangesAsync();

        return existing;
    }

    public async Task<bool> DeleteRecipeAsync(int id)
    {
        if (_context.Recipes == null)
            throw new InvalidOperationException("Recipes DbSet is null.");

        var recipe = await _context.Recipes.FindAsync(id);
        if (recipe == null) return false;

        _context.Recipes.Remove(recipe);
        await _context.SaveChangesAsync();

        return true;
    }
}
