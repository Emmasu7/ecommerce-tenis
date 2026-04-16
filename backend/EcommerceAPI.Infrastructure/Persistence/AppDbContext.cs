using EcommerceAPI.Domain.Entities;
using EcommerceAPI.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace EcommerceAPI.Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User>      Users      => Set<User>();
    public DbSet<Product>   Products   => Set<Product>();
    public DbSet<Order>     Orders     => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // ── User ─────────────────────────────────────────────────────────────
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(u => u.Id);

            entity.Property(u => u.FirstName)
                  .IsRequired()
                  .HasMaxLength(100);

            entity.Property(u => u.LastName)
                  .IsRequired()
                  .HasMaxLength(100);

            entity.Property(u => u.Email)
                  .IsRequired()
                  .HasMaxLength(150);

            entity.HasIndex(u => u.Email)
                  .IsUnique();

            entity.Property(u => u.PasswordHash)
                  .IsRequired();

            entity.Property(u => u.Phone)
                  .HasMaxLength(20);

            entity.Property(u => u.Country)
                  .HasMaxLength(100);

            entity.Property(u => u.State)
                  .HasMaxLength(100);

            entity.Property(u => u.City)
                  .HasMaxLength(100);

            entity.Property(u => u.Address)
                  .HasMaxLength(255);

            entity.Property(u => u.Role)
                  .HasConversion<int>();

            entity.Property(u => u.CreatedAt)
                  .HasDefaultValueSql("datetime('now')");

            entity.HasMany(u => u.Orders)
                  .WithOne(o => o.User)
                  .HasForeignKey(o => o.UserId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // ── Product ──────────────────────────────────────────────────────────
        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(p => p.Id);

            entity.Property(p => p.Code)
                  .IsRequired()
                  .HasMaxLength(50);

            entity.HasIndex(p => p.Code)
                  .IsUnique();

            entity.Property(p => p.Name)
                  .IsRequired()
                  .HasMaxLength(150);

            entity.Property(p => p.Description)
                  .HasMaxLength(500);

            entity.Property(p => p.Price)
                  .HasColumnType("decimal(18,2)");

            entity.Property(p => p.Size)
                  .HasConversion<int>();

            entity.Property(p => p.Color)
                  .HasConversion<int>();

            entity.Property(p => p.IsActive)
                  .HasDefaultValue(true);

            entity.Property(p => p.ImageUrl)
                  .HasMaxLength(300);

            entity.Property(p => p.CreatedAt)
                  .HasDefaultValueSql("datetime('now')");

            entity.HasMany(p => p.OrderItems)
                  .WithOne(oi => oi.Product)
                  .HasForeignKey(oi => oi.ProductId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // ── Order ────────────────────────────────────────────────────────────
        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(o => o.Id);

            entity.Property(o => o.Status)
                  .HasConversion<int>();

            entity.Property(o => o.TotalAmount)
                  .HasColumnType("decimal(18,2)");

            entity.Property(o => o.ShippingAddress)
                  .IsRequired()
                  .HasMaxLength(255);

            entity.Property(o => o.CreatedAt)
                  .HasDefaultValueSql("datetime('now')");

            entity.Property(o => o.UpdatedAt)
                  .HasDefaultValueSql("datetime('now')");

            entity.HasMany(o => o.OrderItems)
                  .WithOne(oi => oi.Order)
                  .HasForeignKey(oi => oi.OrderId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // ── OrderItem ────────────────────────────────────────────────────────
        modelBuilder.Entity<OrderItem>(entity =>
        {
            entity.HasKey(oi => oi.Id);

            entity.Property(oi => oi.UnitPrice)
                  .HasColumnType("decimal(18,2)");

            entity.Property(oi => oi.Subtotal)
                  .HasColumnType("decimal(18,2)");
        });
    }
}
