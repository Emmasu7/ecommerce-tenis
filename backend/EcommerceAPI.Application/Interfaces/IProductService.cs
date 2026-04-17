using EcommerceAPI.Application.Common;
using EcommerceAPI.Application.DTOs.Products;

namespace EcommerceAPI.Application.Interfaces;

public interface IProductService
{
    Task<PagedResult<ProductDto>> GetAllAsync(ProductFilterDto filter);
    Task<ProductDto?>             GetByIdAsync(int id);
    Task<ProductDto>              CreateAsync(CreateProductDto dto);
    Task<ProductDto?>             UpdateAsync(int id, UpdateProductDto dto);
    Task<bool>                    DeleteAsync(int id);  // soft delete → IsActive = false
}