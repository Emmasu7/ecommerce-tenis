using EcommerceAPI.Domain.Enums;

namespace EcommerceAPI.Application.DTOs.Products;

public class ProductFilterDto
{
    public string?       Search    { get; set; }
    public ProductSize?  Size      { get; set; }
    public ProductColor? Color     { get; set; }
    public decimal?      MinPrice  { get; set; }
    public decimal?      MaxPrice  { get; set; }
    public int           Page      { get; set; } = 1;
    public int           PageSize  { get; set; } = 10;
}