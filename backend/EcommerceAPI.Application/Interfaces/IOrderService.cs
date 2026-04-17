using EcommerceAPI.Application.Common;
using EcommerceAPI.Application.DTOs.Orders;

namespace EcommerceAPI.Application.Interfaces;

public interface IOrderService
{
    Task<OrderDto>              CreateAsync(int userId, CreateOrderDto dto);
    Task<PagedResult<OrderDto>> GetAllAsync(OrderFilterDto filter);
    Task<PagedResult<OrderDto>> GetByUserAsync(int userId, OrderFilterDto filter);
    Task<OrderDto?>             GetByIdAsync(int id);
    Task<OrderDto?>             UpdateStatusAsync(int id, UpdateOrderStatusDto dto);
    Task<bool>                  DeleteAsync(int id);
}