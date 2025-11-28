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
    if (_context.Recipes == null)
        throw new InvalidOperationException("Recipes DbSet is null.");

    // Load existing with collections
    var existing = await _context.Recipes!
        .Include(r => r.RecipeIngredients)
            .ThenInclude(ri => ri.Ingredient)
        .FirstOrDefaultAsync(r => r.RecipeId == recipe.RecipeId);

    if (existing == null)
        return null;

    // Update scalar properties
    existing.Title = recipe.Title;
    existing.Description = recipe.Description;
    existing.Instructions = recipe.Instructions;
    existing.CategoryId = recipe.CategoryId;

    // Replace RecipeIngredients:
    // Remove existing
   
     _context.RecipeIngredients?.RemoveRange(existing.RecipeIngredients);
    
    // Add incoming ones (map to RecipeIngredient entities)
    if (recipe.RecipeIngredients != null)
    {
        var newList = new List<RecipeIngredient>();
        foreach (var ri in recipe.RecipeIngredients)
        {
            // If the incoming model includes Ingredient object with Name, create ingredient entity
            // If your domain expects existing Ingredient Ids instead of new Ingredients,
            // adapt mapping accordingly.
            var ingredient = ri.Ingredient != null
                ? new Ingredient { Name = ri.Ingredient.Name }
                : null;

            var newRi = new RecipeIngredient
            {
                Ingredient = ingredient,
                Quantity = ri.Quantity,
                // If RecipeIngredient has RecipeId/IngredientId fields, EF will set them after attaching
            };
            newList.Add(newRi);
        }

        existing.RecipeIngredients = newList;
        // Attach new RecipeIngredients to context
        _context.Set<RecipeIngredient>().AddRange(newList);
    }
    else
    {
        existing.RecipeIngredients = new List<RecipeIngredient>();
    }

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
