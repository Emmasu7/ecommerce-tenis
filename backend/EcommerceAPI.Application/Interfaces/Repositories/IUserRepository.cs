using EcommerceAPI.Domain.Entities;

namespace EcommerceAPI.Application.Interfaces.Repositories;

public interface IUserRepository
{
    Task<bool>  ExistsByEmailAsync(string email);
    Task<User?> GetByEmailAsync(string email);
    Task<User>  AddAsync(User user);
}