namespace RecipeApp.Core.Models   // <-- make sure this is present
{
    public class Rating
    {
        public int RatingId { get; set; }
        public int RecipeId { get; set; }
        public Recipe Recipe { get; set; }
        public int RatingValue { get; set; }
    }
}