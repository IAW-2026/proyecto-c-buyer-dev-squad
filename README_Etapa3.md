# Buyer App — Marketplace (Etapa 3)

## Deploy

https://zapasya.vercel.app/

## Usuarios de prueba

| Rol           | Email                    | Contraseña |
| ------------- | ------------------------ | ---------- |
| Administrador | admin+clerk_test@iaw.com | iawuser#   |
| Comprador     | user+clerk_test@iaw.com  | iawuser#   |

## Evaluación

- Iniciar sesión con uno de los usuarios de prueba.
- **Comprador**: explorar catálogo, filtrar, ver detalles, carrito, pedidos, historial.
- **Administrador**: todo lo anterior más dashboard con gestión de usuarios y pedidos.

## Integraciones (Etapa 3)

Los mocks de la Etapa 2 se reemplazaron por integraciones reales:

- **Seller App** → productos y vendedores obtenidos mediante llamadas reales.
- **Payments App** → flujo de pago integrado; órdenes cambian según respuesta del servicio.
- **Shipping App** → ciclo pendiente → pagado → en envío → entregado.

## Flujo de órdenes

`PENDING → PAID → SHIPPED → DELIVERED`

## Descripción

Buyer App es un marketplace desarrollado con Next.js, PostgreSQL, Prisma, Clerk Authentication y Tailwind CSS.
