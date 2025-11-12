public interface IUserService
{
    Task<User> CreateUserAsync(User user, string password);
    Task<User?> AuthenticateAsync(string username, string password);
    Task<User?> GetUserByIdAsync(Guid userId);
}