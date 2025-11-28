// Controllers/RecipesController.cs
using Microsoft.AspNetCore.Mvc;
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
    public async Task<IActionResult> GetRecipes()
    {
        try
        { 
            var recipes = await _service.GetRecipesAsync();
            return Ok(recipes);
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
}
