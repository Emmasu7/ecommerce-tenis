using EcommerceAPI.Domain.Enums;

namespace EcommerceAPI.Application.DTOs.Orders;

public class OrderDto
{
    public int              Id              { get; set; }
    public int              UserId          { get; set; }
    public string           UserFullName    { get; set; } = string.Empty;
    public OrderStatus      Status          { get; set; }
    public decimal          TotalAmount     { get; set; }
    public string           ShippingAddress { get; set; } = string.Empty;
    public DateTime         CreatedAt       { get; set; }
    public DateTime         UpdatedAt       { get; set; }
    public List<OrderItemDto> Items         { get; set; } = [];
}