public class User
{
    public Guid UserId { get; set; } = Guid.NewGuid();
    public string? Name { get; set; }
    public int? Age { get; set; }
    public string? Gender { get; set; }
    public string? Address { get; set; }
    public string? Username { get; set; }
    public string PasswordHash { get; set; } = string.Empty;
    public string? Email { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}