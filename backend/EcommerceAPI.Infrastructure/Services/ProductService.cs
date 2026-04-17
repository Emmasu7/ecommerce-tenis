using EcommerceAPI.Application.Common;
using EcommerceAPI.Application.DTOs.Products;
using EcommerceAPI.Application.Interfaces;
using EcommerceAPI.Domain.Entities;
using EcommerceAPI.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace EcommerceAPI.Infrastructure.Services;

public class ProductService(AppDbContext db) : IProductService
{
    public async Task<PagedResult<ProductDto>> GetAllAsync(ProductFilterDto filter)
    {
        // Only active products are visible to the catalog
        var query = db.Products
            .Where(p => p.IsActive)
            .AsQueryable();

        if (filter.Size.HasValue)
            query = query.Where(p => p.Size == filter.Size.Value);

        if (filter.Color.HasValue)
            query = query.Where(p => p.Color == filter.Color.Value);

        if (filter.MinPrice.HasValue)
            query = query.Where(p => p.Price >= filter.MinPrice.Value);

        if (filter.MaxPrice.HasValue)
            query = query.Where(p => p.Price <= filter.MaxPrice.Value);

        var totalCount = await query.CountAsync();

        var items = await query
            .OrderBy(p => p.Id)
            .Skip((filter.Page - 1) * filter.PageSize)
            .Take(filter.PageSize)
            .Select(p => MapToDto(p))
            .ToListAsync();

        return new PagedResult<ProductDto>
        {
            Items      = items,
            TotalCount = totalCount,
            Page       = filter.Page,
            PageSize   = filter.PageSize
        };
    }

    public async Task<ProductDto?> GetByIdAsync(int id)
    {
        var product = await db.Products
            .FirstOrDefaultAsync(p => p.Id == id && p.IsActive);

        return product is null ? null : MapToDto(product);
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

        db.Products.Add(product);
        await db.SaveChangesAsync();
        return MapToDto(product);
    }

    public async Task<ProductDto?> UpdateAsync(int id, UpdateProductDto dto)
    {
        var product = await db.Products
            .FirstOrDefaultAsync(p => p.Id == id && p.IsActive);

        if (product is null) return null;

        if (dto.Name        is not null) product.Name        = dto.Name;
        if (dto.Description is not null) product.Description = dto.Description;
        if (dto.Size.HasValue)           product.Size        = dto.Size.Value;
        if (dto.Color.HasValue)          product.Color       = dto.Color.Value;
        if (dto.Price.HasValue)          product.Price       = dto.Price.Value;
        if (dto.Stock.HasValue)          product.Stock       = dto.Stock.Value;
        if (dto.ImageUrl    is not null) product.ImageUrl    = dto.ImageUrl;
        if (dto.IsActive.HasValue)       product.IsActive    = dto.IsActive.Value;

        await db.SaveChangesAsync();
        return MapToDto(product);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var product = await db.Products
            .FirstOrDefaultAsync(p => p.Id == id && p.IsActive);

        if (product is null) return false;

        // Soft delete: never physically remove products
        product.IsActive = false;
        await db.SaveChangesAsync();
        return true;
    }

    private static ProductDto MapToDto(Product p) => new()
    {
        Id          = p.Id,
        Code        = p.Code,
        Name        = p.Name,
        Description = p.Description,
        Size        = p.Size,
        Color       = p.Color,
        Price       = p.Price,
        Stock       = p.Stock,
        ImageUrl    = p.ImageUrl,
        IsActive    = p.IsActive,
        CreatedAt   = p.CreatedAt
    };
}