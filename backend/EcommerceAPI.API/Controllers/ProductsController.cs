using EcommerceAPI.Application.DTOs.Products;
using EcommerceAPI.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EcommerceAPI.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController(IProductService productService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] ProductFilterDto filter)
    {
        var result = await productService.GetAllAsync(filter);
        return Ok(new { success = true, message = "Products retrieved successfully.", data = result });
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var product = await productService.GetByIdAsync(id);
        if (product is null)
            return NotFound(new { success = false, message = $"Product with id {id} not found.", data = (object?)null });

        return Ok(new { success = true, message = "Product retrieved successfully.", data = product });
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] CreateProductDto dto)
    {
        var created = await productService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id },
            new { success = true, message = "Product created successfully.", data = created });
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateProductDto dto)
    {
        var updated = await productService.UpdateAsync(id, dto);
        if (updated is null)
            return NotFound(new { success = false, message = $"Product with id {id} not found.", data = (object?)null });

        return Ok(new { success = true, message = "Product updated successfully.", data = updated });
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await productService.DeleteAsync(id);
        if (!deleted)
            return NotFound(new { success = false, message = $"Product with id {id} not found.", data = (object?)null });

        return Ok(new { success = true, message = "Product deactivated successfully.", data = (object?)null });
    }
}