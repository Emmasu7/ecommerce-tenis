using EcommerceAPI.Application.DTOs.Auth;
using EcommerceAPI.Application.Interfaces;
using EcommerceAPI.Application.Interfaces.Repositories;
using EcommerceAPI.Application.Interfaces.Security;
using EcommerceAPI.Domain.Entities;
using EcommerceAPI.Domain.Enums;

namespace EcommerceAPI.Application.Services;

public class AuthService(
    IUserRepository    users,
    IPasswordHasher    hasher,
    IJwtTokenGenerator jwt) : IAuthService
{
    public async Task<AuthResponseDto> RegisterAsync(RegisterRequestDto dto)
    {
        if (await users.ExistsByEmailAsync(dto.Email))
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
            PasswordHash = hasher.Hash(dto.Password),
            Role         = UserRole.Client,
            CreatedAt    = DateTime.UtcNow
        };

        await users.AddAsync(user);
        return BuildAuthResponse(user);
    }

    public async Task<AuthResponseDto> LoginAsync(LoginRequestDto dto)
    {
        var user = await users.GetByEmailAsync(dto.Email)
            ?? throw new UnauthorizedAccessException("Invalid credentials.");

        if (!hasher.Verify(dto.Password, user.PasswordHash))
            throw new UnauthorizedAccessException("Invalid credentials.");

        return BuildAuthResponse(user);
    }

    // ── JWT generation ─────────────────────────────────────────────────────────
    private AuthResponseDto BuildAuthResponse(User user) => new()
    {
        Token    = jwt.GenerateToken(user),
        Email    = user.Email,
        FullName = $"{user.FirstName} {user.LastName}",
        Role     = user.Role.ToString()
    };
}