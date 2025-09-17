// Services/IRecipeService.cs
using RecipeApp.Core.Models;

public interface IRecipeService
{
    Task<IEnumerable<Recipe>> GetRecipesAsync();
    Task<Recipe?> GetRecipeAsync(int id);
    Task<Recipe> CreateRecipeAsync(Recipe recipe);
    Task<Recipe?> UpdateRecipeAsync(int id, Recipe recipe);
    Task<bool> DeleteRecipeAsync(int id);
}
