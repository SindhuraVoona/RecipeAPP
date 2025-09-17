namespace RecipeApp.Core.Models
{
    public class Comment
    {
        public int CommentId { get; set; }
        public int RecipeId { get; set; }
        public Recipe Recipe { get; set; }
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
