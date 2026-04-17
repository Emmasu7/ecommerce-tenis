using EcommerceAPI.Domain.Enums;

namespace EcommerceAPI.Application.DTOs.Orders;

public class OrderFilterDto
{
    public OrderStatus? Status   { get; set; }
    public int          Page     { get; set; } = 1;
    public int          PageSize { get; set; } = 10;
}