using System.ComponentModel.DataAnnotations;

namespace RecipeApp.Core.Models
{
    public class Comment
    {
        [Key]
        public int CommentId { get; set; }
        public int RecipeId { get; set; }
        public string? Content { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
