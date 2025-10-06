using Microsoft.EntityFrameworkCore;
using RecipeApp.Core.Models;

namespace RecipeApp.Api.Data
{
    public class RecipeDbContext : DbContext
    {
        public RecipeDbContext(DbContextOptions<RecipeDbContext> options) : base(options) { }

        public DbSet<Category>? Categories { get; set; }
        public DbSet<Recipe>? Recipes { get; set; }
        public DbSet<Ingredient>? Ingredients { get; set; }
        public DbSet<RecipeIngredient>? RecipeIngredients { get; set; }
        public DbSet<Comment>? Comments { get; set; }
        public DbSet<Rating>? Ratings { get; set; }
        public DbSet<User>? Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<RecipeIngredient>()
                .HasKey(ri => new { ri.RecipeId, ri.IngredientId });

            // Recipe - RecipeIngredients (no navigation property on RecipeIngredient)
            modelBuilder.Entity<Recipe>()
                .HasMany(r => r.RecipeIngredients)
                .WithOne() // No navigation property
                .HasForeignKey(ri => ri.RecipeId);

            // Recipe - Comments (no navigation property on Comment)
            modelBuilder.Entity<Recipe>()
                .HasMany(r => r.Comments)
                .WithOne() // No navigation property
                .HasForeignKey(c => c.RecipeId);

            // Recipe - Ratings (no navigation property on Rating)
            modelBuilder.Entity<Recipe>()
                .HasMany(r => r.Ratings)
                .WithOne() // No navigation property
                .HasForeignKey(rt => rt.RecipeId);
        }
    }
}
