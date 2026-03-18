using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using Microsoft.Extensions.Configuration;
using RecipeApp.Core.Models;

namespace RecipeApp.Tests
{
    public class UnitTest1
    {
        [Fact]
        public async Task CategoriesController_GetCategories_ReturnsOkWithList()
        {
            // Arrange
            var categories = new List<Category>
            {
                new Category { CategoryId = 1, Name = "Dessert" },
                new Category { CategoryId = 2, Name = "Main" }
            };

            var mockService = new Mock<ICategoryService>();
            mockService.Setup(s => s.GetCategoriesAsync()).ReturnsAsync(categories);

            var controller = new CategoriesController(mockService.Object, Mock.Of<ILogger<CategoriesController>>());

            // Act
            var actionResult = await controller.GetCategories();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var returned = Assert.IsAssignableFrom<IEnumerable<Category>>(okResult.Value);
            Assert.Equal(2, ((List<Category>)returned).Count);
        }

        [Fact]
        public async Task RecipesController_CreateRecipe_ReturnsCreatedAtAction()
        {
            // Arrange
            var input = new Recipe { Title = "Test", Description = "Desc", Instructions = "Step 1", CategoryId = 1 };
            var created = new Recipe { RecipeId = 42, Title = "Test", Description = "Desc", Instructions = "Step 1", CategoryId = 1 };

            var mockService = new Mock<IRecipeService>();
            mockService.Setup(s => s.CreateRecipeAsync(It.IsAny<Recipe>())).ReturnsAsync(created);

            var controller = new RecipesController(mockService.Object, Mock.Of<ILogger<RecipesController>>());

            // Act
            var result = await controller.CreateRecipe(input);

            // Assert
            var createdAt = Assert.IsType<CreatedAtActionResult>(result);
            Assert.Equal(nameof(RecipesController.GetRecipe), createdAt.ActionName);
            var returned = Assert.IsAssignableFrom<Recipe>(createdAt.Value);
            Assert.Equal(created.RecipeId, returned.RecipeId);
        }

        [Fact]
        public async Task RecipesController_AddComment_ReturnsCreatedAtAction()
        {
            // Arrange
            var input = new Comment { RecipeId = 1, Content = "Nice" };
            var added = new Comment { CommentId = 7, RecipeId = 1, Content = "Nice" };
            var mockService = new Mock<IRecipeService>();
            mockService.Setup(s => s.AddCommentAsync(It.IsAny<Comment>())).ReturnsAsync(added);
            var controller = new RecipesController(mockService.Object, Mock.Of<ILogger<RecipesController>>());

            // Act
            var result = await controller.AddComment(1, input);

            // Assert
            var createdAt = Assert.IsType<CreatedAtActionResult>(result);
            var returned = Assert.IsAssignableFrom<Comment>(createdAt.Value);
            Assert.Equal(added.CommentId, returned.CommentId);
        }

        [Fact]
        public async Task RecipesController_AddRating_ReturnsCreatedAtAction()
        {
            // Arrange
            var input = new Rating { RecipeId = 1, RatingValue = 4 };
            var added = new Rating { RatingId = 8, RecipeId = 1, RatingValue = 4 };
            var mockService = new Mock<IRecipeService>();
            mockService.Setup(s => s.AddRatingAsync(It.IsAny<Rating>())).ReturnsAsync(added);
            var controller = new RecipesController(mockService.Object, Mock.Of<ILogger<RecipesController>>());

            // Act
            var result = await controller.AddRating(1, input);

            // Assert
            var createdAt = Assert.IsType<CreatedAtActionResult>(result);
            var returned = Assert.IsAssignableFrom<Rating>(createdAt.Value);
            Assert.Equal(added.RatingId, returned.RatingId);
        }

        [Fact]
        public async Task RecipesController_GetRecipes_Paging_Works()
        {
            // Arrange
            var paged = new RecipeApp.Api.Models.PagedResult<Recipe>
            {
                Items = new List<Recipe> { new Recipe { RecipeId = 5, Title = "A" } },
                TotalCount = 100
            };
            var mockService = new Mock<IRecipeService>();
            mockService.Setup(s => s.GetRecipesPagedAsync(2, 10)).ReturnsAsync(paged);
            var controller = new RecipesController(mockService.Object, Mock.Of<ILogger<RecipesController>>());

            // Act
            var result = await controller.GetRecipes(2, 10) as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            var returned = Assert.IsType<RecipeApp.Api.Models.PagedResult<Recipe>>(result.Value);
            Assert.Single(returned.Items);
            Assert.Equal(100, returned.TotalCount);
        }

        [Fact]
        public async Task AuthController_Login_ReturnsUnauthorized_WhenInvalid()
        {
            // Arrange
            var mockService = new Mock<IUserService>();
            mockService.Setup(s => s.AuthenticateAsync(It.IsAny<string>(), It.IsAny<string>()))
                       .ReturnsAsync((User?)null);
            var controller = new AuthController(mockService.Object, Mock.Of<IConfiguration>());

            var login = new LoginRequest { Username = "bad", Password = "bad" };

            // Act
            var result = await controller.Login(login);

            // Assert
            Assert.IsType<UnauthorizedResult>(result);
        }

        [Fact]
        public async Task AuthController_Login_ReturnsOk_WhenValid()
        {
            // Arrange
            var user = new User { UserId = System.Guid.NewGuid(), Username = "user", PasswordHash = "hash" };
            var mockService = new Mock<IUserService>();
            mockService.Setup(s => s.AuthenticateAsync(user.Username, "pass"))
                       .ReturnsAsync(user);
            var config = new Microsoft.Extensions.Configuration.ConfigurationBuilder()
                .AddInMemoryCollection(new Dictionary<string, string?>
                {
                    // symmetric key must be long enough for HmacSha256 (at least 32 characters)
                    ["Jwt:Key"] = "abcdefghijklmnopqrstuvwxyz123456",
                    ["Jwt:Issuer"] = "test",
                    ["Jwt:Audience"] = "test"
                })
                .Build();
            var controller = new AuthController(mockService.Object, config);

            var login = new LoginRequest { Username = user.Username, Password = "pass" };

            // Act
            var result = await controller.Login(login);

            // Assert
            var ok = Assert.IsType<OkObjectResult>(result);
            // token or user object depends on controller implementation - at least ensure not null
            Assert.NotNull(ok.Value);
        }
    }
}