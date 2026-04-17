namespace EcommerceAPI.Application.DTOs.Auth;

public class RegisterRequestDto
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName  { get; set; } = string.Empty;
    public int Age          { get; set; }
    public DateTime BirthDate { get; set; }
    public string Country   { get; set; } = string.Empty;
    public string State     { get; set; } = string.Empty;
    public string City      { get; set; } = string.Empty;
    public string Phone     { get; set; } = string.Empty;
    public string Address   { get; set; } = string.Empty;
    public string Email     { get; set; } = string.Empty;
    public string Password  { get; set; } = string.Empty;
}