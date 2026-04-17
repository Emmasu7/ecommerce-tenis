using EcommerceAPI.Domain.Enums;

namespace EcommerceAPI.Domain.Entities;

public class Order
{
    public int         Id              { get; set; }
    public int         UserId          { get; set; }
    public OrderStatus Status          { get; set; } = OrderStatus.EnProceso;  // ← corregido
    public decimal     TotalAmount     { get; set; }
    public string      ShippingAddress { get; set; } = string.Empty;
    public DateTime    CreatedAt       { get; set; } = DateTime.UtcNow;
    public DateTime    UpdatedAt       { get; set; } = DateTime.UtcNow;

    public User                   User       { get; set; } = null!;
    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}