using RecipeApp.Core.Models;

public class UserService : IUserService
{
    private readonly UserRepository _repository;
    public UserService(UserRepository repository) => _repository = repository;

    public async Task<User?> AuthenticateAsync(string username, string password)
    {
        var user = await _repository.GetByUsernameAsync(username);
        if (user != null && user.Password == password) // Use hashing in production!
            return user;
        return null;
    }
}   