using EcommerceAPI.Application.Common;
using EcommerceAPI.Application.DTOs.Orders;
using EcommerceAPI.Application.Interfaces;
using EcommerceAPI.Domain.Entities;
using EcommerceAPI.Domain.Enums;
using EcommerceAPI.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace EcommerceAPI.Infrastructure.Services;

public class OrderService(AppDbContext db) : IOrderService
{
    public async Task<OrderDto> CreateAsync(int userId, CreateOrderDto dto)
    {
        // Validate all products exist and have enough stock
        var productIds = dto.Items.Select(i => i.ProductId).ToList();
        var products   = await db.Products
            .Where(p => productIds.Contains(p.Id) && p.IsActive)
            .ToListAsync();

        if (products.Count != productIds.Count)
            throw new InvalidOperationException("One or more products were not found or are inactive.");

        foreach (var item in dto.Items)
        {
            var product = products.First(p => p.Id == item.ProductId);
            if (product.Stock < item.Quantity)
                throw new InvalidOperationException($"Insufficient stock for product '{product.Name}'. Available: {product.Stock}.");
        }

        // Build order
        var order = new Order
        {
            UserId          = userId,
            Status          = OrderStatus.EnProceso,
            ShippingAddress = dto.ShippingAddress,
            CreatedAt       = DateTime.UtcNow,
            UpdatedAt       = DateTime.UtcNow
        };

        // Freeze unit price and discount stock
        foreach (var item in dto.Items)
        {
            var product = products.First(p => p.Id == item.ProductId);

            order.OrderItems.Add(new OrderItem
            {
                ProductId = product.Id,
                Quantity  = item.Quantity,
                UnitPrice = product.Price,                      // precio histórico congelado
                Subtotal  = product.Price * item.Quantity
            });

            product.Stock -= item.Quantity;                     // descuento de stock
        }

        order.TotalAmount = order.OrderItems.Sum(oi => oi.Subtotal);

        db.Orders.Add(order);
        await db.SaveChangesAsync();

        return await GetByIdAsync(order.Id) ?? throw new InvalidOperationException("Order could not be retrieved after creation.");
    }

    public async Task<PagedResult<OrderDto>> GetAllAsync(OrderFilterDto filter)
    {
        var query = db.Orders.AsQueryable();

        if (filter.Status.HasValue)
            query = query.Where(o => o.Status == filter.Status.Value);

        var totalCount = await query.CountAsync();

        var items = await query
            .OrderByDescending(o => o.CreatedAt)
            .Skip((filter.Page - 1) * filter.PageSize)
            .Take(filter.PageSize)
            .Include(o => o.User)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
            .Select(o => MapToDto(o))
            .ToListAsync();

        return new PagedResult<OrderDto>
        {
            Items      = items,
            TotalCount = totalCount,
            Page       = filter.Page,
            PageSize   = filter.PageSize
        };
    }

    public async Task<PagedResult<OrderDto>> GetByUserAsync(int userId, OrderFilterDto filter)
    {
        var query = db.Orders.Where(o => o.UserId == userId);

        if (filter.Status.HasValue)
            query = query.Where(o => o.Status == filter.Status.Value);

        var totalCount = await query.CountAsync();

        var items = await query
            .OrderByDescending(o => o.CreatedAt)
            .Skip((filter.Page - 1) * filter.PageSize)
            .Take(filter.PageSize)
            .Include(o => o.User)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
            .Select(o => MapToDto(o))
            .ToListAsync();

        return new PagedResult<OrderDto>
        {
            Items      = items,
            TotalCount = totalCount,
            Page       = filter.Page,
            PageSize   = filter.PageSize
        };
    }

    public async Task<OrderDto?> GetByIdAsync(int id)
    {
        var order = await db.Orders
            .Include(o => o.User)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
            .FirstOrDefaultAsync(o => o.Id == id);

        return order is null ? null : MapToDto(order);
    }

    public async Task<OrderDto?> UpdateStatusAsync(int id, UpdateOrderStatusDto dto)
    {
        var order = await db.Orders.FindAsync(id);
        if (order is null) return null;

        order.Status    = dto.Status;
        order.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync();
        return await GetByIdAsync(id);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var order = await db.Orders
            .Include(o => o.OrderItems)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order is null) return false;

        db.Orders.Remove(order);    // OrderItems se eliminan en cascada (Cascade delete configurado)
        await db.SaveChangesAsync();
        return true;
    }

    private static OrderDto MapToDto(Order o) => new()
    {
        Id              = o.Id,
        UserId          = o.UserId,
        UserFullName    = o.User is not null ? $"{o.User.FirstName} {o.User.LastName}" : string.Empty,
        Status          = o.Status,
        TotalAmount     = o.TotalAmount,
        ShippingAddress = o.ShippingAddress,
        CreatedAt       = o.CreatedAt,
        UpdatedAt       = o.UpdatedAt,
        Items           = o.OrderItems.Select(oi => new OrderItemDto
        {
            Id          = oi.Id,
            ProductId   = oi.ProductId,
            ProductName = oi.Product?.Name ?? string.Empty,
            ProductCode = oi.Product?.Code ?? string.Empty,
            Quantity    = oi.Quantity,
            UnitPrice   = oi.UnitPrice,
            Subtotal    = oi.Subtotal
        }).ToList()
    };
}