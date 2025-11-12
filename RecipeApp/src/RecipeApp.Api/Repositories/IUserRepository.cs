
public interface IUserRepository
{
    Task<User> CreateUserAsync(User user, string password);
    Task<User?> GetByUsernameAsync(string username);
    Task<User?> GetUserByIdAsync(Guid userId);
}