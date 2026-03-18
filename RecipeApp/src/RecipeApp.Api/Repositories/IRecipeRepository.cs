using RecipeApp.Core.Models;

public interface IRecipeRepository
{
    Task<IEnumerable<Recipe>> GetAllRecipesAsync();

    // paging support
    Task<RecipeApp.Api.Models.PagedResult<Recipe>> GetRecipesPagedAsync(int page, int pageSize);
    Task<Recipe?> GetRecipeByIdAsync(int id);
    Task<Recipe> AddRecipeAsync(Recipe recipe);
    Task<Recipe?> UpdateRecipeAsync(Recipe recipe);
    Task<bool> DeleteRecipeAsync(int id);

    // comments and ratings support
    Task<Comment> AddCommentAsync(Comment comment);
    Task<Rating> AddRatingAsync(Rating rating);
}
