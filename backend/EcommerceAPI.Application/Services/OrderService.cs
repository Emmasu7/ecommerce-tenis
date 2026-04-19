using EcommerceAPI.Application.Common;
using EcommerceAPI.Application.DTOs.Orders;
using EcommerceAPI.Application.Interfaces;
using EcommerceAPI.Application.Interfaces.Repositories;
using EcommerceAPI.Domain.Entities;
using EcommerceAPI.Domain.Enums;

namespace EcommerceAPI.Application.Services;

public class OrderService(
    IOrderRepository   orders,
    IProductRepository products) : IOrderService
{
    public async Task<OrderDto> CreateAsync(int userId, CreateOrderDto dto)
    {
        // Validate all products exist and have enough stock
        var productIds    = dto.Items.Select(i => i.ProductId).ToList();
        var foundProducts = await products.GetByIdsActiveAsync(productIds);

        if (foundProducts.Count != productIds.Count)
            throw new InvalidOperationException("One or more products were not found or are inactive.");

        foreach (var item in dto.Items)
        {
            var product = foundProducts.First(p => p.Id == item.ProductId);
            if (product.Stock < item.Quantity)
                throw new InvalidOperationException(
                    $"Insufficient stock for product '{product.Name}'. Available: {product.Stock}.");
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
            var product = foundProducts.First(p => p.Id == item.ProductId);

            order.OrderItems.Add(new OrderItem
            {
                ProductId = product.Id,
                Quantity  = item.Quantity,
                UnitPrice = product.Price,
                Subtotal  = product.Price * item.Quantity
            });

            product.Stock -= item.Quantity;
        }

        order.TotalAmount = order.OrderItems.Sum(oi => oi.Subtotal);

        var created = await orders.AddAsync(order);
        return MapToDto(await orders.GetByIdAsync(created.Id) ?? created);
    }

    public async Task<PagedResult<OrderDto>> GetAllAsync(OrderFilterDto filter)
    {
        var (items, total) = await orders.GetFilteredAsync(
            null, filter.Status, filter.Page, filter.PageSize);

        return new PagedResult<OrderDto>
        {
            Items      = items.Select(MapToDto).ToList(),
            TotalCount = total,
            Page       = filter.Page,
            PageSize   = filter.PageSize
        };
    }

    public async Task<PagedResult<OrderDto>> GetByUserAsync(int userId, OrderFilterDto filter)
    {
        var (items, total) = await orders.GetFilteredAsync(
            userId, filter.Status, filter.Page, filter.PageSize);

        return new PagedResult<OrderDto>
        {
            Items      = items.Select(MapToDto).ToList(),
            TotalCount = total,
            Page       = filter.Page,
            PageSize   = filter.PageSize
        };
    }

    public async Task<OrderDto?> GetByIdAsync(int id)
    {
        var order = await orders.GetByIdAsync(id);
        return order is null ? null : MapToDto(order);
    }

    public async Task<OrderDto?> UpdateStatusAsync(int id, UpdateOrderStatusDto dto)
    {
        var updated = await orders.UpdateStatusAsync(id, dto.Status);
        return updated is null ? null : MapToDto(updated);
    }

    public Task<bool> DeleteAsync(int id) => orders.DeleteAsync(id);

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