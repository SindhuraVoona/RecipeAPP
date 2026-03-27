// Controllers/RecipesController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using RecipeApp.Core.Models;

[Route("api/[controller]")]
[ApiController]
public class RecipesController : ControllerBase
{
    private readonly IRecipeService _service;
    private readonly ILogger<RecipesController> _logger;

    public RecipesController(IRecipeService service, ILogger<RecipesController> logger)
    {
        _service = service;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetRecipes(
        [FromQuery] int? page,
        [FromQuery] int? pageSize)
    {
        try
        {
            var p = page.HasValue && page.Value > 0 ? page.Value : 1;
            var ps = pageSize.HasValue && pageSize.Value > 0 ? pageSize.Value : 20;
            var paged = await _service.GetRecipesPagedAsync(p, ps);
            return Ok(paged);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching recipes");
            return StatusCode(500, "An unexpected error occurred.");
        }
    }

    [HttpGet("{recipeId}")]
    public async Task<IActionResult> GetRecipe(int recipeId)
    {
        var recipe = await _service.GetRecipeAsync(recipeId);
        if (recipe is null) return NotFound();
        return Ok(recipe!);
    }

    [HttpPost]
    public async Task<IActionResult> CreateRecipe(Recipe recipe)
    {
        var created = await _service.CreateRecipeAsync(recipe);
        return CreatedAtAction(nameof(GetRecipe), new { recipeId = created.RecipeId }, created);
    }

    [HttpPut("{recipeId}")]
    public async Task<IActionResult> UpdateRecipe(int recipeId, Recipe recipe)
    {
        var updated = await _service.UpdateRecipeAsync(recipeId, recipe);
        if (updated == null) return NotFound();
        return Ok(updated);
    }

    [HttpDelete("{recipeId}")]
    public async Task<IActionResult> DeleteRecipe(int recipeId)
    {
        var deleted = await _service.DeleteRecipeAsync(recipeId);
        if (!deleted) return NotFound();
        return NoContent();
    }

    // ------------------------------------------------------------------
    // Comments and ratings
    // ------------------------------------------------------------------

    /// <summary>
    /// Add a comment to a recipe. Requires authentication.
    /// </summary>
    [Authorize]
    [HttpPost("{recipeId}/comments")]
    public async Task<IActionResult> AddComment(int recipeId, Comment comment)
    {
        // ensure recipe id matches route
        if (comment.RecipeId != recipeId)
            comment.RecipeId = recipeId;
        comment.CreatedAt = DateTime.UtcNow;
        var added = await _service.AddCommentAsync(comment);
        return CreatedAtAction(nameof(GetRecipe), new { recipeId }, added);
    }

    /// <summary>
    /// Submit a rating for a recipe. Requires authentication.
    /// </summary>
    [Authorize]
    [HttpPost("{recipeId}/ratings")]
    public async Task<IActionResult> AddRating(int recipeId, Rating rating)
    {
        if (rating.RecipeId != recipeId)
            rating.RecipeId = recipeId;
        // simple validation
        if (rating.RatingValue is < 1 or > 5)
            return BadRequest("Rating value must be between 1 and 5.");
        var added = await _service.AddRatingAsync(rating);
        return CreatedAtAction(nameof(GetRecipe), new { recipeId }, added);
    }
}
