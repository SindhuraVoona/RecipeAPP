namespace RecipeApp.Core.Models
{
    public class Comment
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string Content { get; set; }
        public int RecipeId { get; set; }
        public Recipe Recipe { get; set; }
    }
}
