using EcommerceAPI.Domain.Enums;

namespace EcommerceAPI.Application.DTOs.Orders;

public class UpdateOrderStatusDto
{
    public OrderStatus Status { get; set; }
}