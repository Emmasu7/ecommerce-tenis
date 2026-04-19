# ecommerce-tenis (RunZone)

![Angular](https://img.shields.io/badge/Angular-20.1.4-DD0031?logo=angular&logoColor=white)
![.NET](https://img.shields.io/badge/.NET-9.0-512BD4?logo=dotnet&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-3-003B57?logo=sqlite&logoColor=white)
![License](https://img.shields.io/badge/license-Academic-blue)

RunZone es un MVP de e-commerce para la venta de tenis deportivos, desarrollado como prueba técnica. El proyecto incluye autenticación JWT, catálogo de productos, carrito en `localStorage`, órdenes de compra y panel administrativo.

## Descripción general

La solución está organizada en tres bloques principales:

- `frontend/`: aplicación Angular 20.
- `backend/`: API REST en .NET 9 con arquitectura limpia.
- `docs/`: diagramas y documentación de soporte.

El proyecto cumple con los requisitos funcionales de la prueba técnica, incluyendo registro, login, catálogo, detalle de producto, carrito, órdenes y administración de inventario y estados de compra.

## Funcionalidades

### Cliente
- Registro de usuario.
- Inicio de sesión con email y contraseña.
- Catálogo de productos con filtros por nombre, descripción, código, talla y color.
- Detalle completo del producto.
- Carrito de compras persistido en `localStorage`.
- Finalización de compra con cálculo de totales.

### Administrador
- CRUD de productos.
- Gestión de órdenes.
- Cambio de estado de órdenes.
- Eliminación de órdenes.
- Filtro por estado de orden.

## Tecnologías

### Frontend
- Angular CLI 20.1.4.
- Angular 20.1.4.
- Node.js 22.20.0.
- npm 10.9.3.
- TypeScript 5.8.3.
- RxJS 7.8.2.
- Tailwind CSS 3.4.11.

### Backend
- .NET SDK 9.0.305.
- ASP.NET Core Web API.
- Target Framework: `net9.0`.
- Entity Framework Core.
- SQLite.
- JWT Bearer Authentication.
- BCrypt.

## Estructura del proyecto

```text
ecommerce-tenis/
├── backend/
├── frontend/
├── docs/
├── .gitignore
└── README.md
```

### Frontend
```text
frontend/
├── public/
│   └── favicon.svg
└── src/
    ├── index.html
    ├── main.ts
    ├── styles.css
    ├── app/
    │   ├── app.config.ts
    │   ├── app.routes.ts
    │   ├── app.ts
    │   ├── core/
    │   │   ├── guards/
    │   │   ├── interceptors/
    │   │   ├── models/
    │   │   └── services/
    │   ├── features/
    │   │   ├── admin/
    │   │   ├── auth/
    │   │   ├── cart/
    │   │   ├── catalog/
    │   │   └── orders/
    │   └── shared/
    │       ├── components/
    │       └── pipes/
    └── environments/
        └── environment.ts
```

### Backend
```text
backend/
├── EcommerceAPI.sln
├── EcommerceAPI.API/
├── EcommerceAPI.Application/
├── EcommerceAPI.Domain/
└── EcommerceAPI.Infrastructure/
```

## Arquitectura

El backend sigue Clean Architecture y separa claramente dominio, aplicación, infraestructura y API. Esto facilita mantenimiento, pruebas y escalabilidad.

### Capas del backend
- **Domain**: entidades y enums del negocio.
- **Application**: interfaces, DTOs, servicios, validadores y wrappers.
- **Infrastructure**: EF Core, repositorios y seguridad.
- **API**: controllers, configuración, Swagger y manejo global de errores.

### Frontend
La aplicación Angular está organizada por responsabilidad funcional:
- `core`: guards, interceptors, modelos y servicios.
- `features`: auth, catálogo, carrito, órdenes y admin.
- `shared`: componentes reutilizables y pipes.

## Decisiones de diseño

- **IDs enteros autoincrementales** para mantener compatibilidad con SQLite.
- **JWT con expiración de 24 horas** para autenticación stateless.
- **Roles `client` y `admin`** para separar permisos.
- **BCrypt** para el hash de contraseñas.
- **Carrito en `localStorage`** porque así lo exige la prueba.
- **Precio histórico congelado** en `OrderItems.UnitPrice` al crear la orden.
- **Descuento de stock al crear la orden**.
- **Soft delete** en productos usando `Products.IsActive = false`.
- **Estados de orden**: `En proceso`, `Pagado`, `Enviado`, `Entregado`.

## Supuestos y consideraciones adicionales

Para completar el alcance del MVP y resolver aspectos no definidos explícitamente en el enunciado, se adoptaron los siguientes supuestos de implementación:

- El carrito de compras se maneja exclusivamente en `localStorage`, sin persistencia en base de datos, para mantener una solución ligera y alineada con el alcance de la prueba.
- Los usuarios registrados se crean con rol `client` por defecto. El rol `admin` se asigna manualmente en base de datos para pruebas locales del panel administrativo.
- La compra se realiza bajo el modelo de pago contra entrega, por lo que no se implementa integración con pasarelas de pago ni procesamiento de transacciones electrónicas.
- Cada producto maneja una única imagen principal mediante el campo `ImageUrl`, sin soporte para galería múltiple.
- El precio unitario de cada producto se congela en `OrderItems.UnitPrice` al momento de crear la orden, con el fin de preservar el historial de compra.
- El stock se descuenta al crear la orden, asumiendo que la confirmación de compra reserva inmediatamente el inventario.
- La eliminación de productos se implementa mediante borrado lógico usando `IsActive = false`, evitando pérdida de trazabilidad y manteniendo integridad referencial.
- Los estados de orden se limitan a `En proceso`, `Pagado`, `Enviado` y `Entregado`, de acuerdo con el alcance funcional definido para el MVP.
- La autenticación se implementa con JWT Bearer Token y expiración de 24 horas, usando BCrypt para el almacenamiento seguro de contraseñas.
- Se utilizan identificadores enteros autoincrementales en todas las entidades para simplificar el modelo relacional y mantener compatibilidad con SQLite.
- La validación funcional del backend se complementa con Swagger y una colección de Postman incluida en la carpeta `docs/`.

## Instalación local

### Requisitos
- Node.js 22.20.0 o superior.
- npm 10.9.3 o superior.
- .NET SDK 9.0.305.
- Git.

### Frontend
```bash
cd frontend
npm install
ng serve
```

### Backend
```bash
cd backend
dotnet restore
dotnet build
dotnet ef database update --project EcommerceAPI.Infrastructure --startup-project EcommerceAPI.API
dotnet run --project EcommerceAPI.API
```

## Tabla de URLs

| Servicio | URL |
|---|---|
| Frontend | `http://localhost:4200` |
| Backend | `https://localhost:5296` |
| Swagger | `https://localhost:5296/swagger` |

## Configuración

### Frontend
Archivo principal:
- `frontend/src/environments/environment.ts`

### Backend
Archivos principales:
- `backend/EcommerceAPI.API/appsettings.json`
- `backend/EcommerceAPI.API/appsettings.Development.json`

### Nota sobre roles
Los usuarios se crean con rol `client` por defecto. Para probar el panel administrativo, el rol debe cambiarse manualmente a `admin` en la base de datos usando DB Browser for SQLite.

## Uso de la aplicación

### Cliente
1. Registrarse.
2. Iniciar sesión.
3. Navegar el catálogo.
4. Ver el detalle de un producto.
5. Agregar productos al carrito.
6. Modificar cantidades o eliminar productos.
7. Finalizar la compra.

### Administrador
1. Iniciar sesión con una cuenta `admin`.
2. Administrar productos.
3. Ver órdenes registradas.
4. Cambiar estados de órdenes.
5. Eliminar órdenes si es necesario.

## API y documentación

La API está documentada con Swagger y disponible en `https://localhost:5296/swagger`. Desde allí se pueden probar autenticación, productos y órdenes.

Formato de respuesta estándar:

```json
{
  "data": {},
  "message": "Operation completed successfully",
  "success": true
}
```

## Buenas prácticas

- Clean Architecture.
- Principios SOLID.
- Conventional Commits.
- Reactive Forms.
- Validaciones en frontend y backend.
- ProblemDetails para errores.
- Componentes reutilizables.
- Tipado fuerte.
- Diseño responsive.
- Separación de responsabilidades.

## Solución de problemas

### El frontend no conecta con el backend
Verifica que la API esté ejecutándose en `https://localhost:5296` y que el archivo `environment.ts` del frontend tenga configurada la URL correcta.

### Error al aplicar migraciones o levantar la base de datos
Asegúrate de ejecutar el comando desde la carpeta `backend` y de tener instalado el SDK de .NET 9. Si el archivo `ecommerce.db` no existe, `dotnet ef database update` debe crearlo.

### No puedo entrar al panel administrador
Las cuentas nuevas se crean con rol `client`. Para probar funcionalidades administrativas, abre `ecommerce.db` con DB Browser for SQLite y cambia manualmente el campo `Role` del usuario a `admin`.

## Diagramas

La carpeta `docs/` contiene los diagramas de soporte del proyecto:
- diagrama de arquitectura general;
- diagrama entidad-relación.

## Postman

Se incluye una colección de Postman en `docs/` para validar:
- autenticación;
- productos;
- órdenes;
- panel administrativo.

## Licencia

Este proyecto fue desarrollado con fines académicos como parte de una evaluación técnica de la Universidad EAFIT.

## Notas finales

RunZone fue diseñado para ser claro, mantenible y fácil de ejecutar localmente. La solución prioriza separación de capas, validaciones correctas, documentación y una estructura lista para evaluación técnica.