using EcommerceAPI.Domain.Entities;

namespace EcommerceAPI.Application.Interfaces.Security;

public interface IJwtTokenGenerator
{
    string GenerateToken(User user);
}