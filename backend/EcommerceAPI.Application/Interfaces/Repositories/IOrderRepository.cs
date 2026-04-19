using EcommerceAPI.Domain.Entities;
using EcommerceAPI.Domain.Enums;

namespace EcommerceAPI.Application.Interfaces.Repositories;

public interface IOrderRepository
{
    Task<Order>        AddAsync(Order order);
    Task<Order?>       GetByIdAsync(int id);
    Task<(List<Order> Items, int Total)> GetFilteredAsync(
        int? userId, OrderStatus? status, int page, int pageSize);
    Task<Order?> UpdateStatusAsync(int id, OrderStatus status);
    Task<bool>   DeleteAsync(int id);
}