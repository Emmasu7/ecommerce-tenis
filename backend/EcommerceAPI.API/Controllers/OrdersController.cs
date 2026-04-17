using System.Security.Claims;
using EcommerceAPI.Application.DTOs.Orders;
using EcommerceAPI.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EcommerceAPI.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrdersController(IOrderService orderService) : ControllerBase
{
    // Cliente crea una orden desde su carrito
    [HttpPost]
    [Authorize(Roles = "Client")]
    public async Task<IActionResult> Create([FromBody] CreateOrderDto dto)
    {
        var userId  = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var created = await orderService.CreateAsync(userId, dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id },
            new { success = true, message = "Order created successfully.", data = created });
    }

    // Admin ve todas las órdenes con filtro por estado
    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAll([FromQuery] OrderFilterDto filter)
    {
        var result = await orderService.GetAllAsync(filter);
        return Ok(new { success = true, message = "Orders retrieved successfully.", data = result });
    }

    // Cliente ve solo sus propias órdenes
    [HttpGet("my-orders")]
    [Authorize(Roles = "Client")]
    public async Task<IActionResult> GetMyOrders([FromQuery] OrderFilterDto filter)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await orderService.GetByUserAsync(userId, filter);
        return Ok(new { success = true, message = "Orders retrieved successfully.", data = result });
    }

    // Admin y cliente pueden ver detalle (cliente solo las suyas, validado en servicio)
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var order = await orderService.GetByIdAsync(id);
        if (order is null)
            return NotFound(new { success = false, message = $"Order with id {id} not found.", data = (object?)null });

        // Cliente solo puede ver sus propias órdenes
        var role   = User.FindFirstValue(ClaimTypes.Role);
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        if (role == "Client" && order.UserId != userId)
            return Forbid();

        return Ok(new { success = true, message = "Order retrieved successfully.", data = order });
    }

    // Admin cambia el estado
    [HttpPatch("{id:int}/status")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateOrderStatusDto dto)
    {
        var updated = await orderService.UpdateStatusAsync(id, dto);
        if (updated is null)
            return NotFound(new { success = false, message = $"Order with id {id} not found.", data = (object?)null });

        return Ok(new { success = true, message = "Order status updated successfully.", data = updated });
    }

    // Admin elimina una orden
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await orderService.DeleteAsync(id);
        if (!deleted)
            return NotFound(new { success = false, message = $"Order with id {id} not found.", data = (object?)null });

        return Ok(new { success = true, message = "Order deleted successfully.", data = (object?)null });
    }
}