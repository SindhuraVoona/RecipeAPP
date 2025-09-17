using RecipeApp.Core.Models;

public interface IRecipeRepository
{
    Task<IEnumerable<Recipe>> GetAllRecipesAsync();
    Task<Recipe?> GetRecipeByIdAsync(int id);
    Task<Recipe> AddRecipeAsync(Recipe recipe);
    Task<Recipe?> UpdateRecipeAsync(Recipe recipe);
    Task<bool> DeleteRecipeAsync(int id);
}
