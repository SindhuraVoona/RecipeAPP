using Microsoft.AspNetCore.Mvc;
using RecipeApp.Core.Models;

[Route("api/[controller]")]
[ApiController]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryService _service;
    private readonly ILogger<CategoriesController> _logger;

    public CategoriesController(ICategoryService service, ILogger<CategoriesController> logger)
    {
        _service = service;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Category>>> GetCategories()
    {
        var categories = await _service.GetCategoriesAsync();
        return Ok(categories);
    }
}