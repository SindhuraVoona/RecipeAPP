using System.ComponentModel.DataAnnotations;

namespace RecipeApp.Core.Models   // <-- make sure this is present
{
    public class Rating
    {
        [Key]
        public int RatingId { get; set; }
        public int RecipeId { get; set; }
        public int? RatingValue { get; set; }
    }
}