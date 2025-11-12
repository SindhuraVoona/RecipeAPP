using RecipeApp.Core.Models;

public class UserService : IUserService
{
    private readonly UserRepository _repository;
    public UserService(UserRepository repository) => _repository = repository;

    public async Task<User?> AuthenticateAsync(string username, string password)
    {
       var user = await _repository.GetByUsernameAsync(username);
       if (user != null && BCrypt.Net.BCrypt.Verify(password, user.Password))
        {
        return user;
        }
       return null;
    }

    public async Task<User> CreateUserAsync(User user, string password)
    {
        return await _repository.CreateUserAsync(user, password);
    }

    public async Task<User?> GetUserByIdAsync(Guid userId)
    {
        return await _repository.GetUserByIdAsync(userId);
    }
}   