using System.Collections.Generic;

namespace RecipeApp.Core.Models
{
    public class Recipe
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Instructions { get; set; }
        public int CategoryId { get; set; }
        public Category Category { get; set; }
        public List<Ingredient> Ingredients { get; set; }
        public List<Comment> Comments { get; set; }
    }
}