using EcommerceAPI.Domain.Enums;

namespace EcommerceAPI.Application.DTOs.Products;

public class UpdateProductDto
{
    public string?       Name        { get; set; }
    public string?       Description { get; set; }
    public ProductSize?  Size        { get; set; }
    public ProductColor? Color       { get; set; }
    public decimal?      Price       { get; set; }
    public int?          Stock       { get; set; }
    public string?       ImageUrl    { get; set; }
    public bool?         IsActive    { get; set; }
}