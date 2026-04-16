using EcommerceAPI.Domain.Enums;

namespace EcommerceAPI.Domain.Entities;

public class User
{
    public int    Id           { get; set; }
    public string FirstName    { get; set; } = string.Empty;
    public string LastName     { get; set; } = string.Empty;
    public int    Age          { get; set; }
    public DateTime BirthDate  { get; set; }
    public string Country      { get; set; } = string.Empty;
    public string State        { get; set; } = string.Empty;
    public string City         { get; set; } = string.Empty;
    public string Phone        { get; set; } = string.Empty;
    public string Address      { get; set; } = string.Empty;
    public string Email        { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public UserRole Role       { get; set; } = UserRole.Client;
    public DateTime CreatedAt  { get; set; } = DateTime.UtcNow;

    public ICollection<Order> Orders { get; set; } = new List<Order>();
}
