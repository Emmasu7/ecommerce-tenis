using EcommerceAPI.Application.Interfaces.Repositories;
using EcommerceAPI.Domain.Entities;
using EcommerceAPI.Domain.Enums;
using EcommerceAPI.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace EcommerceAPI.Infrastructure.Repositories;

public class ProductRepository(AppDbContext db) : IProductRepository
{
    public async Task<(List<Product> Items, int Total)> GetFilteredAsync(
        string? search, ProductSize? size, ProductColor? color,
        decimal? minPrice, decimal? maxPrice, int page, int pageSize)
    {
        var query = db.Products.Where(p => p.IsActive).AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.Trim().ToLower();
            query = query.Where(p => p.Name.ToLower().Contains(s) ||
                                     p.Code.ToLower().Contains(s));
        }

        if (size.HasValue)     query = query.Where(p => p.Size  == size.Value);
        if (color.HasValue)    query = query.Where(p => p.Color == color.Value);
        if (minPrice.HasValue) query = query.Where(p => p.Price >= minPrice.Value);
        if (maxPrice.HasValue) query = query.Where(p => p.Price <= maxPrice.Value);

        var total = await query.CountAsync();
        var items = await query.OrderBy(p => p.Id)
                               .Skip((page - 1) * pageSize)
                               .Take(pageSize)
                               .ToListAsync();

        return (items, total);
    }

    public Task<Product?> GetByIdAsync(int id) =>
        db.Products.FirstOrDefaultAsync(p => p.Id == id && p.IsActive);

    public async Task<Product> AddAsync(Product product)
    {
        db.Products.Add(product);
        await db.SaveChangesAsync();
        return product;
    }

    public async Task<Product?> UpdateAsync(int id, Action<Product> applyChanges)
    {
        var product = await db.Products.FirstOrDefaultAsync(p => p.Id == id && p.IsActive);
        if (product is null) return null;

        applyChanges(product);
        await db.SaveChangesAsync();
        return product;
    }

    public async Task<bool> SoftDeleteAsync(int id)
    {
        var product = await db.Products.FirstOrDefaultAsync(p => p.Id == id && p.IsActive);
        if (product is null) return false;

        product.IsActive = false;
        await db.SaveChangesAsync();
        return true;
    }

    public Task<List<Product>> GetByIdsActiveAsync(List<int> ids) =>
        db.Products.Where(p => ids.Contains(p.Id) && p.IsActive).ToListAsync();
}