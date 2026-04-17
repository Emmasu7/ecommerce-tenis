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

    [HttpPost("{id:int}/image")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UploadImage(int id, IFormFile file)
    {
        if (file is null || file.Length == 0)
            return BadRequest(new { success = false, message = "No file provided.", data = (object?)null });

        var allowed = new[] { ".jpg", ".jpeg", ".png", ".webp" };
        var ext     = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!allowed.Contains(ext))
            return BadRequest(new { success = false, message = "Only jpg, jpeg, png and webp are allowed.", data = (object?)null });

        if (file.Length > 5_242_880)
            return BadRequest(new { success = false, message = "File exceeds 5MB limit.", data = (object?)null });

        var folder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", "products");
        Directory.CreateDirectory(folder);

        var fileName = $"{id}-{Guid.NewGuid()}{ext}";
        var filePath = Path.Combine(folder, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
            await file.CopyToAsync(stream);

        var imageUrl = $"/images/products/{fileName}";
        var updated  = await productService.UpdateAsync(id, new UpdateProductDto { ImageUrl = imageUrl });

        if (updated is null)
        {
            System.IO.File.Delete(filePath);
            return NotFound(new { success = false, message = $"Product with id {id} not found.", data = (object?)null });
        }

        return Ok(new { success = true, message = "Image uploaded successfully.", data = new { imageUrl } });
    }
}