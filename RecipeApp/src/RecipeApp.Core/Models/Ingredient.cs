using System.ComponentModel.DataAnnotations;

namespace RecipeApp.Core.Models
{
    public class Ingredient
    {
        [Key]
        public int IngredientId { get; set; }
        public string? Name { get; set; }
    }
}
