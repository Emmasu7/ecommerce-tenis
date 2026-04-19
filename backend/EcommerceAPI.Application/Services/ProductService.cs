using EcommerceAPI.Application.Common;
using EcommerceAPI.Application.DTOs.Products;
using EcommerceAPI.Application.Interfaces;
using EcommerceAPI.Application.Interfaces.Repositories;
using EcommerceAPI.Domain.Entities;

namespace EcommerceAPI.Application.Services;

public class ProductService(IProductRepository products) : IProductService
{
    public async Task<PagedResult<ProductDto>> GetAllAsync(ProductFilterDto filter)
    {
        var (items, total) = await products.GetFilteredAsync(
            filter.Search, filter.Size, filter.Color,
            filter.MinPrice, filter.MaxPrice,
            filter.Page, filter.PageSize);

        return new PagedResult<ProductDto>
        {
            Items      = items.Select(MapToDto).ToList(),
            TotalCount = total,
            Page       = filter.Page,
            PageSize   = filter.PageSize
        };
    }

    public async Task<ProductDto?> GetByIdAsync(int id)
    {
        var p = await products.GetByIdAsync(id);
        return p is null ? null : MapToDto(p);
    }

    public async Task<ProductDto> CreateAsync(CreateProductDto dto)
    {
        var product = new Product
        {
            Code        = dto.Code,
            Name        = dto.Name,
            Description = dto.Description,
            Size        = dto.Size,
            Color       = dto.Color,
            Price       = dto.Price,
            Stock       = dto.Stock,
            ImageUrl    = dto.ImageUrl,
            IsActive    = true,
            CreatedAt   = DateTime.UtcNow
        };

        var created = await products.AddAsync(product);
        return MapToDto(created);
    }

    public async Task<ProductDto?> UpdateAsync(int id, UpdateProductDto dto)
    {
        var updated = await products.UpdateAsync(id, p =>
        {
            if (dto.Name        is not null) p.Name        = dto.Name;
            if (dto.Description is not null) p.Description = dto.Description;
            if (dto.Size.HasValue)           p.Size        = dto.Size.Value;
            if (dto.Color.HasValue)          p.Color       = dto.Color.Value;
            if (dto.Price.HasValue)          p.Price       = dto.Price.Value;
            if (dto.Stock.HasValue)          p.Stock       = dto.Stock.Value;
            if (dto.ImageUrl    is not null) p.ImageUrl    = dto.ImageUrl;
            if (dto.IsActive.HasValue)       p.IsActive    = dto.IsActive.Value;
        });

        return updated is null ? null : MapToDto(updated);
    }

    public Task<bool> DeleteAsync(int id) => products.SoftDeleteAsync(id);

    private static ProductDto MapToDto(Product p) => new()
    {
        Id          = p.Id,
        Code        = p.Code,
        Name        = p.Name,
        Description = p.Description,
        Size        = p.Size.ToString(),
        Color       = p.Color.ToString(),
        Price       = p.Price,
        Stock       = p.Stock,
        ImageUrl    = p.ImageUrl,
        IsActive    = p.IsActive,
        CreatedAt   = p.CreatedAt
    };
}