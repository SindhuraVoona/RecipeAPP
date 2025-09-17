using RecipeApp.Core.Models;

public class RecipeService : IRecipeService
{
    private readonly IRecipeRepository _repository;

    public RecipeService(IRecipeRepository repository)
    {
        _repository = repository;
    }

    public Task<IEnumerable<Recipe>> GetRecipesAsync() => _repository.GetAllRecipesAsync();

    public Task<Recipe?> GetRecipeAsync(int id) => _repository.GetRecipeByIdAsync(id);

    public Task<Recipe> CreateRecipeAsync(Recipe recipe) => _repository.AddRecipeAsync(recipe);

    public async Task<Recipe?> UpdateRecipeAsync(int id, Recipe recipe)
    {
        if (id != recipe.RecipeId)
            return null;

        return await _repository.UpdateRecipeAsync(recipe);
    }

    public Task<bool> DeleteRecipeAsync(int id) => _repository.DeleteRecipeAsync(id);
}
