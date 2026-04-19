using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace EcommerceAPI.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Products",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Code = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    Name = table.Column<string>(type: "TEXT", maxLength: 150, nullable: false),
                    Description = table.Column<string>(type: "TEXT", maxLength: 500, nullable: false),
                    Size = table.Column<int>(type: "INTEGER", nullable: false),
                    Color = table.Column<int>(type: "INTEGER", nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Stock = table.Column<int>(type: "INTEGER", nullable: false),
                    ImageUrl = table.Column<string>(type: "TEXT", maxLength: 300, nullable: false),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false, defaultValue: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false, defaultValueSql: "datetime('now')")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Products", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    FirstName = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    LastName = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Age = table.Column<int>(type: "INTEGER", nullable: false),
                    BirthDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    Country = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    State = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    City = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Phone = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false),
                    Address = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    Email = table.Column<string>(type: "TEXT", maxLength: 150, nullable: false),
                    PasswordHash = table.Column<string>(type: "TEXT", nullable: false),
                    Role = table.Column<int>(type: "INTEGER", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false, defaultValueSql: "datetime('now')")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Orders",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    UserId = table.Column<int>(type: "INTEGER", nullable: false),
                    Status = table.Column<int>(type: "INTEGER", nullable: false),
                    TotalAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ShippingAddress = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false, defaultValueSql: "datetime('now')"),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: false, defaultValueSql: "datetime('now')")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Orders", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Orders_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "OrderItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    OrderId = table.Column<int>(type: "INTEGER", nullable: false),
                    ProductId = table.Column<int>(type: "INTEGER", nullable: false),
                    Quantity = table.Column<int>(type: "INTEGER", nullable: false),
                    UnitPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Subtotal = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OrderItems_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OrderItems_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "Products",
                columns: new[] { "Id", "Code", "Color", "CreatedAt", "Description", "ImageUrl", "IsActive", "Name", "Price", "Size", "Stock" },
                values: new object[,]
                {
                    { 1, "NK-AM270-10-BLK", 2, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Zapatilla lifestyle con la unidad Air Max más grande hasta la fecha.", "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/skwgyqrbfzhu6uyeh0gg/air-max-270-shoes-2V5C4p.png", true, "Nike Air Max 270", 389000m, 10, 20 },
                    { 2, "NK-AF1-9-WHT", 1, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Ícono del baloncesto reconvertido en clásico urbano desde 1982.", "https://www.shopwss.com/cdn/shop/files/DD8959103_2.jpg?v=1732751405", true, "Nike Air Force 1", 329000m, 9, 15 },
                    { 3, "AD-UB22-10-BLK", 2, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Running de alto rendimiento con entresuela BOOST para máxima energía.", "https://assets.adidas.com/images/h_840,f_auto,q_auto/fbaf991a78bc4896a3e9ad7800abcec6_9366/Ultraboost_22_Shoes_Black_GZ0127_01_standard.jpg", true, "Adidas Ultraboost 22", 449000m, 10, 12 },
                    { 4, "AD-SS-8-WHT", 1, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "La zapatilla de tenis que se convirtió en leyenda del streetwear global.", "https://assets.adidas.com/images/h_840,f_auto,q_auto/7ed0855435194229a525aad6009a0497_9366/Stan_Smith_Shoes_White_FX5502_01_standard.jpg", true, "Adidas Stan Smith", 279000m, 8, 25 },
                    { 5, "NB-574-9-GRY", 3, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Silhouette retro con tecnología ENCAP para confort duradero todo el día.", "https://nb.scene7.com/is/image/NB/ml574evg_nb_02_i?$pdpflexf2$&qlt=80&fmt=webp&wid=880&hei=880", true, "New Balance 574", 299000m, 9, 18 },
                    { 6, "PM-RSX-8-WHT", 1, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Diseño chunky futurista con tecnología RS de amortiguación en carrera.", "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_600,h_600/global/369666/01/sv01/fnd/PNA/fmt/png/RS-X-Sneakers", true, "Puma RS-X", 259000m, 8, 10 },
                    { 7, "CV-CTAS-7-BLK", 2, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "La zapatilla más icónica de todos los tiempos, favorita desde 1917.", "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/060db9efed07b6790dbe0b6d21c98dec77c80f4b.jpg", true, "Converse Chuck Taylor All Star", 199000m, 7, 30 },
                    { 8, "VN-OS-9-BLK", 2, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Primera zapatilla con el Jazz Stripe de Vans, emblema del skate desde 1977.", "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/babb6084892da86491d0380d688b0e0f031c5050.jpg", true, "Vans Old Skool", 219000m, 9, 22 },
                    { 9, "NK-FREE-7-GRY", 3, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Suela flexible que imita el movimiento natural del pie. Ultraligera y transpirable para entrenamientos dinámicos.", "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/322508958aebc893b8fb63d49c00637a91b2c142.jpg", true, "Nike Free Run 5.0", 319000m, 7, 14 },
                    { 10, "AD-GAZL-8-WHT", 1, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Clásico de los años 60 reinventado. Corte de gamuza suave con la icónica franja de las 3 bandas en el lateral.", "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/aeb3d9dd0deaa0997915073f7fe86e4477f94938.jpg", true, "Adidas Gazelle", 269000m, 8, 16 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_OrderId",
                table: "OrderItems",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_ProductId",
                table: "OrderItems",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_UserId",
                table: "Orders",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Products_Code",
                table: "Products",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "OrderItems");

            migrationBuilder.DropTable(
                name: "Orders");

            migrationBuilder.DropTable(
                name: "Products");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
