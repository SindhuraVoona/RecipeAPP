using System.ComponentModel.DataAnnotations;

namespace RecipeApp.Core.Models
{
    public class Recipe
    {
        [Key]
        public int RecipeId { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Instructions { get; set; }
        public int? CategoryId { get; set; }
        public Category? Category { get; set; }
        public List<RecipeIngredient> RecipeIngredients { get; set; } = new();
        public List<Comment> Comments { get; set; } = new();
        public List<Rating> Ratings { get; set; } = new();
    }
}