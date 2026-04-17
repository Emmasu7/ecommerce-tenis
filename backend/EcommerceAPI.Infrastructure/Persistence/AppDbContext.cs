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

        // ── Seed Products ─────────────────────────────────────────────────────
        modelBuilder.Entity<Product>().HasData(
            new Product
            {
                Id          = 1,
                Code        = "NK-AM270-10-BLK",
                Name        = "Nike Air Max 270",
                Description = "Zapatilla lifestyle con la unidad Air Max más grande hasta la fecha.",
                Size        = ProductSize.Ten,
                Color       = ProductColor.Black,
                Price       = 389000,
                Stock       = 20,
                IsActive    = true,
                ImageUrl    = "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/skwgyqrbfzhu6uyeh0gg/air-max-270-shoes-2V5C4p.png",
                CreatedAt   = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Product
            {
                Id          = 2,
                Code        = "NK-AF1-9-WHT",
                Name        = "Nike Air Force 1",
                Description = "Ícono del baloncesto reconvertido en clásico urbano desde 1982.",
                Size        = ProductSize.Nine,
                Color       = ProductColor.White,
                Price       = 329000,
                Stock       = 15,
                IsActive    = true,
                ImageUrl    = "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/350bcd75-d4e6-48b1-af35-a7faeecba8b5/air-force-1-07-shoes-WjmPLN.png",
                CreatedAt   = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Product
            {
                Id          = 3,
                Code        = "AD-UB22-10-BLK",
                Name        = "Adidas Ultraboost 22",
                Description = "Running de alto rendimiento con entresuela BOOST para máxima energía.",
                Size        = ProductSize.Ten,
                Color       = ProductColor.Black,
                Price       = 449000,
                Stock       = 12,
                IsActive    = true,
                ImageUrl    = "https://assets.adidas.com/images/h_840,f_auto,q_auto/fbaf991a78bc4896a3e9ad7800abcec6_9366/Ultraboost_22_Shoes_Black_GZ0127_01_standard.jpg",
                CreatedAt   = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Product
            {
                Id          = 4,
                Code        = "AD-SS-8-WHT",
                Name        = "Adidas Stan Smith",
                Description = "La zapatilla de tenis que se convirtió en leyenda del streetwear global.",
                Size        = ProductSize.Eight,
                Color       = ProductColor.White,
                Price       = 279000,
                Stock       = 25,
                IsActive    = true,
                ImageUrl    = "https://assets.adidas.com/images/h_840,f_auto,q_auto/7ed0855435194229a525aad6009a0497_9366/Stan_Smith_Shoes_White_FX5502_01_standard.jpg",
                CreatedAt   = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Product
            {
                Id          = 5,
                Code        = "NB-574-9-GRY",
                Name        = "New Balance 574",
                Description = "Silhouette retro con tecnología ENCAP para confort duradero todo el día.",
                Size        = ProductSize.Nine,
                Color       = ProductColor.Gray,
                Price       = 299000,
                Stock       = 18,
                IsActive    = true,
                ImageUrl    = "https://nb.scene7.com/is/image/NB/ml574evg_nb_02_i?$pdpflexf2$&qlt=80&fmt=webp&wid=880&hei=880",
                CreatedAt   = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Product
            {
                Id          = 6,
                Code        = "PM-RSX-8-WHT",
                Name        = "Puma RS-X",
                Description = "Diseño chunky futurista con tecnología RS de amortiguación en carrera.",
                Size        = ProductSize.Eight,
                Color       = ProductColor.White,
                Price       = 259000,
                Stock       = 10,
                IsActive    = true,
                ImageUrl    = "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_600,h_600/global/369666/01/sv01/fnd/PNA/fmt/png/RS-X-Sneakers",
                CreatedAt   = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Product
            {
                Id          = 7,
                Code        = "CV-CTAS-7-BLK",
                Name        = "Converse Chuck Taylor All Star",
                Description = "La zapatilla más icónica de todos los tiempos, favorita desde 1917.",
                Size        = ProductSize.Seven,
                Color       = ProductColor.Black,
                Price       = 199000,
                Stock       = 30,
                IsActive    = true,
                ImageUrl    = "https://www.converse.com/dw/image/v2/BCZC_PRD/on/demandware.static/-/Sites-cnv-master-catalog/default/dw2e84c4e7/images/a_107/101001_A_107X1.jpg",
                CreatedAt   = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Product
            {
                Id          = 8,
                Code        = "VN-OS-9-BLK",
                Name        = "Vans Old Skool",
                Description = "Primera zapatilla con el Jazz Stripe de Vans, emblema del skate desde 1977.",
                Size        = ProductSize.Nine,
                Color       = ProductColor.Black,
                Price       = 219000,
                Stock       = 22,
                IsActive    = true,
                ImageUrl    = "https://images.vans.com/is/image/Vans/VN000D3HY28-HERO?$583x583$",
                CreatedAt   = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            }
        );
    }
}