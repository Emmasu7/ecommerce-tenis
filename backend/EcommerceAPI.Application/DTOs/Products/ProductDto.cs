using EcommerceAPI.Domain.Enums;

namespace EcommerceAPI.Application.DTOs.Products;

public class ProductDto
{
    public int          Id          { get; set; }
    public string       Code        { get; set; } = string.Empty;
    public string       Name        { get; set; } = string.Empty;
    public string       Description { get; set; } = string.Empty;
    public ProductSize  Size        { get; set; }
    public ProductColor Color       { get; set; }
    public decimal      Price       { get; set; }
    public int          Stock       { get; set; }
    public string       ImageUrl    { get; set; } = string.Empty;
    public bool         IsActive    { get; set; }
    public DateTime     CreatedAt   { get; set; }
}