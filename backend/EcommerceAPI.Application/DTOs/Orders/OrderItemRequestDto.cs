namespace EcommerceAPI.Application.DTOs.Orders;

public class OrderItemRequestDto
{
    public int ProductId { get; set; }
    public int Quantity  { get; set; }
}