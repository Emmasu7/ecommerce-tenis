using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace EcommerceAPI.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class UpdateProductSeed : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 2,
                column: "ImageUrl",
                value: "https://www.shopwss.com/cdn/shop/files/DD8959103_2.jpg?v=1732751405");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 7,
                column: "ImageUrl",
                value: "https://images.unsplash.com/photo-1494496195158-c3bc975f9935?w=600&q=80");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 8,
                column: "ImageUrl",
                value: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&q=80");

            migrationBuilder.InsertData(
                table: "Products",
                columns: new[] { "Id", "Code", "Color", "CreatedAt", "Description", "ImageUrl", "IsActive", "Name", "Price", "Size", "Stock" },
                values: new object[,]
                {
                    { 9, "NK-FREE-7-GRY", 3, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Suela flexible que imita el movimiento natural del pie. Ultraligera y transpirable para entrenamientos dinámicos.", "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&q=80", true, "Nike Free Run 5.0", 319000m, 7, 14 },
                    { 10, "AD-GAZL-8-WHT", 1, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Clásico de los años 60 reinventado. Corte de gamuza suave con la icónica franja de las 3 bandas en el lateral.", "https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&q=80", true, "Adidas Gazelle", 269000m, 8, 16 }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 10);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 2,
                column: "ImageUrl",
                value: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/350bcd75-d4e6-48b1-af35-a7faeecba8b5/air-force-1-07-shoes-WjmPLN.png");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 7,
                column: "ImageUrl",
                value: "https://www.converse.com/dw/image/v2/BCZC_PRD/on/demandware.static/-/Sites-cnv-master-catalog/default/dw2e84c4e7/images/a_107/101001_A_107X1.jpg");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 8,
                column: "ImageUrl",
                value: "https://images.vans.com/is/image/Vans/VN000D3HY28-HERO?$583x583$");
        }
    }
}
