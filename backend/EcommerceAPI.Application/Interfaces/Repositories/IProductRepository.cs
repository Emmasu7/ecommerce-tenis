using EcommerceAPI.Domain.Entities;
using EcommerceAPI.Domain.Enums;

namespace EcommerceAPI.Application.Interfaces.Repositories;

public interface IProductRepository
{
    Task<(List<Product> Items, int Total)> GetFilteredAsync(
        string? search, ProductSize? size, ProductColor? color,
        decimal? minPrice, decimal? maxPrice, int page, int pageSize);

    Task<Product?> GetByIdAsync(int id);
    Task<Product>  AddAsync(Product product);
    Task<Product?> UpdateAsync(int id, Action<Product> applyChanges);
    Task<bool>     SoftDeleteAsync(int id);
    Task<List<Product>> GetByIdsActiveAsync(List<int> ids);
}