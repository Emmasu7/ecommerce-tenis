using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using EcommerceAPI.Application.DTOs.Auth;
using EcommerceAPI.Application.Interfaces;
using EcommerceAPI.Domain.Entities;
using EcommerceAPI.Domain.Enums;
using EcommerceAPI.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace EcommerceAPI.Infrastructure.Services;

public class AuthService(AppDbContext db, IConfiguration config) : IAuthService
{
    public async Task<AuthResponseDto> RegisterAsync(RegisterRequestDto dto)
    {
        bool emailExists = await db.Users.AnyAsync(u => u.Email == dto.Email);
        if (emailExists)
            throw new InvalidOperationException("Email already registered.");

        var user = new User
        {
            FirstName    = dto.FirstName,
            LastName     = dto.LastName,
            Age          = dto.Age,
            BirthDate    = dto.BirthDate,
            Country      = dto.Country,
            State        = dto.State,
            City         = dto.City,
            Phone        = dto.Phone,
            Address      = dto.Address,
            Email        = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Role         = UserRole.Client,
            CreatedAt    = DateTime.UtcNow
        };

        db.Users.Add(user);
        await db.SaveChangesAsync();

        return BuildAuthResponse(user);
    }

    public async Task<AuthResponseDto> LoginAsync(LoginRequestDto dto)
    {
        var user = await db.Users.FirstOrDefaultAsync(u => u.Email == dto.Email)
            ?? throw new UnauthorizedAccessException("Invalid credentials.");

        if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            throw new UnauthorizedAccessException("Invalid credentials.");

        return BuildAuthResponse(user);
    }

    // ── JWT generation ─────────────────────────────────────────────────────────

    private AuthResponseDto BuildAuthResponse(User user)
    {
        return new AuthResponseDto
        {
            Token    = GenerateToken(user),
            Email    = user.Email,
            FullName = $"{user.FirstName} {user.LastName}",
            Role     = user.Role.ToString()
        };
    }

    private string GenerateToken(User user)
    {
        var jwtSection  = config.GetSection("Jwt");
        var secretKey   = jwtSection["SecretKey"]!;
        var issuer      = jwtSection["Issuer"]!;
        var audience    = jwtSection["Audience"]!;
        var expiryHours = int.Parse(jwtSection["ExpirationHours"]!);

        var key   = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email,          user.Email),
            new Claim(ClaimTypes.Role,           user.Role.ToString()),
            new Claim("FullName", $"{user.FirstName} {user.LastName}")
        };

        var token = new JwtSecurityToken(
            issuer:             issuer,
            audience:           audience,
            claims:             claims,
            expires:            DateTime.UtcNow.AddHours(expiryHours),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}