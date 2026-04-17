using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace EcommerceAPI.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddProductFieldsAndSeed : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Products",
                columns: new[] { "Id", "Code", "Color", "CreatedAt", "Description", "ImageUrl", "IsActive", "Name", "Price", "Size", "Stock" },
                values: new object[,]
                {
                    { 1, "NK-AM270-10-BLK", 2, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Zapatilla lifestyle con la unidad Air Max más grande hasta la fecha.", "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/skwgyqrbfzhu6uyeh0gg/air-max-270-shoes-2V5C4p.png", true, "Nike Air Max 270", 389000m, 10, 20 },
                    { 2, "NK-AF1-9-WHT", 1, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Ícono del baloncesto reconvertido en clásico urbano desde 1982.", "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/350bcd75-d4e6-48b1-af35-a7faeecba8b5/air-force-1-07-shoes-WjmPLN.png", true, "Nike Air Force 1", 329000m, 9, 15 },
                    { 3, "AD-UB22-10-BLK", 2, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Running de alto rendimiento con entresuela BOOST para máxima energía.", "https://assets.adidas.com/images/h_840,f_auto,q_auto/fbaf991a78bc4896a3e9ad7800abcec6_9366/Ultraboost_22_Shoes_Black_GZ0127_01_standard.jpg", true, "Adidas Ultraboost 22", 449000m, 10, 12 },
                    { 4, "AD-SS-8-WHT", 1, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "La zapatilla de tenis que se convirtió en leyenda del streetwear global.", "https://assets.adidas.com/images/h_840,f_auto,q_auto/7ed0855435194229a525aad6009a0497_9366/Stan_Smith_Shoes_White_FX5502_01_standard.jpg", true, "Adidas Stan Smith", 279000m, 8, 25 },
                    { 5, "NB-574-9-GRY", 3, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Silhouette retro con tecnología ENCAP para confort duradero todo el día.", "https://nb.scene7.com/is/image/NB/ml574evg_nb_02_i?$pdpflexf2$&qlt=80&fmt=webp&wid=880&hei=880", true, "New Balance 574", 299000m, 9, 18 },
                    { 6, "PM-RSX-8-WHT", 1, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Diseño chunky futurista con tecnología RS de amortiguación en carrera.", "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_600,h_600/global/369666/01/sv01/fnd/PNA/fmt/png/RS-X-Sneakers", true, "Puma RS-X", 259000m, 8, 10 },
                    { 7, "CV-CTAS-7-BLK", 2, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "La zapatilla más icónica de todos los tiempos, favorita desde 1917.", "https://www.converse.com/dw/image/v2/BCZC_PRD/on/demandware.static/-/Sites-cnv-master-catalog/default/dw2e84c4e7/images/a_107/101001_A_107X1.jpg", true, "Converse Chuck Taylor All Star", 199000m, 7, 30 },
                    { 8, "VN-OS-9-BLK", 2, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Primera zapatilla con el Jazz Stripe de Vans, emblema del skate desde 1977.", "https://images.vans.com/is/image/Vans/VN000D3HY28-HERO?$583x583$", true, "Vans Old Skool", 219000m, 9, 22 }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 8);
        }
    }
}
