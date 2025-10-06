
public interface IUserRepository
{
    Task<User?> GetByUsernameAsync(string username);
}