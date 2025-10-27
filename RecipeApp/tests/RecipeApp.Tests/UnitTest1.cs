using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
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
            var input = new Recipe { Title = "Test", Description = "Desc", CategoryId = 1 };
            var created = new Recipe { RecipeId = 42, Title = "Test", Description = "Desc", CategoryId = 1 };

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
        public async Task AuthController_Login_ReturnsUnauthorized_WhenInvalid()
        {
            // Arrange
            var mockService = new Mock<IUserService>();
            mockService.Setup(s => s.AuthenticateAsync(It.IsAny<string>(), It.IsAny<string>()))
                       .ReturnsAsync((User?)null);

            var controller = new AuthController(mockService.Object);

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
            var user = new User { UserId = 1, Username = "user", Password = "pass" };
            var mockService = new Mock<IUserService>();
            mockService.Setup(s => s.AuthenticateAsync(user.Username, user.Password))
                       .ReturnsAsync(user);

            var controller = new AuthController(mockService.Object);

            var login = new LoginRequest { Username = user.Username, Password = user.Password };

            // Act
            var result = await controller.Login(login);

            // Assert
            var ok = Assert.IsType<OkObjectResult>(result);
            // token or user object depends on controller implementation - at least ensure not null
            Assert.NotNull(ok.Value);
        }
    }
}