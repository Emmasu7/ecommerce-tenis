using EcommerceAPI.Application.Interfaces.Repositories;
using EcommerceAPI.Domain.Entities;
using EcommerceAPI.Domain.Enums;
using EcommerceAPI.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace EcommerceAPI.Infrastructure.Repositories;

public class OrderRepository(AppDbContext db) : IOrderRepository
{
    public async Task<Order> AddAsync(Order order)
    {
        db.Orders.Add(order);
        await db.SaveChangesAsync();
        return order;
    }

    public Task<Order?> GetByIdAsync(int id) =>
        db.Orders
          .Include(o => o.User)
          .Include(o => o.OrderItems).ThenInclude(oi => oi.Product)
          .FirstOrDefaultAsync(o => o.Id == id);

    public async Task<(List<Order> Items, int Total)> GetFilteredAsync(
        int? userId, OrderStatus? status, int page, int pageSize)
    {
        var query = db.Orders.AsQueryable();

        if (userId.HasValue) query = query.Where(o => o.UserId == userId.Value);
        if (status.HasValue) query = query.Where(o => o.Status == status.Value);

        var total = await query.CountAsync();
        var items = await query
            .OrderByDescending(o => o.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Include(o => o.User)
            .Include(o => o.OrderItems).ThenInclude(oi => oi.Product)
            .ToListAsync();

        return (items, total);
    }

    public async Task<Order?> UpdateStatusAsync(int id, OrderStatus status)
    {
        var order = await db.Orders.FindAsync(id);
        if (order is null) return null;

        order.Status    = status;
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

        db.Orders.Remove(order);
        await db.SaveChangesAsync();
        return true;
    }
}