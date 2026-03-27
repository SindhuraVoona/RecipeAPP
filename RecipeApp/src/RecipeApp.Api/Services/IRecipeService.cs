using RecipeApp.Core.Models;

public interface IRecipeService
{
    Task<IEnumerable<Recipe>> GetRecipesAsync();

    // paging support
    Task<RecipeApp.Api.Models.PagedResult<Recipe>> GetRecipesPagedAsync(int page, int pageSize);
    Task<Recipe?> GetRecipeAsync(int id);
    Task<Recipe> CreateRecipeAsync(Recipe recipe);
    Task<Recipe?> UpdateRecipeAsync(int id, Recipe recipe);
    Task<bool> DeleteRecipeAsync(int id);

    // comment & rating operations
    Task<Comment> AddCommentAsync(Comment comment);
    Task<Rating> AddRatingAsync(Rating rating);
}
