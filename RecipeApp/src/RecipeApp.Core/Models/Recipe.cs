using System.Collections.Generic;

namespace RecipeApp.Core.Models
{
    public class Recipe
    {
       public int RecipeId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int? CategoryId { get; set; }
        public Category Category { get; set; }
        public List<RecipeIngredient> RecipeIngredients { get; set; }
        public List<Comment> Comments { get; set; }
        public List<Rating> Ratings { get; set; }
    }
}