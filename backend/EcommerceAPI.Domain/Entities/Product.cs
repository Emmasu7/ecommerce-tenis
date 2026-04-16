using EcommerceAPI.Domain.Enums;

namespace EcommerceAPI.Domain.Entities;

public class Product
{
    public int         Id          { get; set; }
    public string      Code        { get; set; } = string.Empty;
    public string      Name        { get; set; } = string.Empty;
    public string      Description { get; set; } = string.Empty;
    public ProductSize Size        { get; set; }
    public ProductColor Color      { get; set; }
    public decimal     Price       { get; set; }
    public int         Stock       { get; set; }
    public string      ImageUrl    { get; set; } = string.Empty;
    public bool        IsActive    { get; set; } = true;
    public DateTime    CreatedAt   { get; set; } = DateTime.UtcNow;

    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}
