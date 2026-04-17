namespace EcommerceAPI.Application.DTOs.Orders;

public class CreateOrderDto
{
    public string                     ShippingAddress { get; set; } = string.Empty;
    public List<OrderItemRequestDto>  Items           { get; set; } = [];
}