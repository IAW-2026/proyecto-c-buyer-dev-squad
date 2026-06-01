# Buyer App — Marketplace

## Deploy de producción

https://zapasya.vercel.app/

---

## Usuarios para pruebas

| Rol           | Email                    | Contraseña |
| ------------- | ------------------------ | ---------- |
| Administrador | [admin+clerktest@iaw.com]| iawuser#   |
| Comprador     | [user+clerktest@iaw.com] | iawuser#   |

---

## Instrucciones para evaluación

* Iniciar sesión utilizando alguno de los usuarios de prueba proporcionados.

* Como comprador (usuario), es posible explorar el catálogo de productos, aplicar filtros de búsqueda, visualizar detalles de productos y vendedores, gestionar el carrito de compras, realizar pedidos y consultar el historial de compras.

* Como administrador, además de contar con todas las funcionalidades disponibles para un comprador, se puede acceder al dashboard administrativo, gestionar usuarios, modificar sus datos, suspender y reactivar cuentas de usuarios (excepto administradores), y administrar los pedidos del sistema.

* La aplicación incluye datos precargados de usuarios, productos, vendedores y órdenes para facilitar las pruebas y la evaluación.

* Actualmente, los productos y vendedores son cargados mediante el script de inicialización (`seed.ts`). En una futura integración, esta información será obtenida dinámicamente desde la Seller App a través de los servicios definidos para el marketplace.

* Las integraciones con Payments App y Shipping App se encuentran simuladas mediante scripts de prueba que permiten actualizar el estado de las órdenes durante la evaluación.

```bash
npm run status-paid
npm run status-shipping
npm run status-delivered
```

---

## Descripción del proyecto

Buyer App es una aplicación de compras para un marketplace estilo Mercado Libre desarrollada con Next.js, PostgreSQL, Prisma, Clerk Authentication y Tailwind CSS.

La plataforma permite a los compradores buscar productos, aplicar filtros, gestionar un carrito de compras, realizar pedidos y consultar su historial de compras. Además, incorpora recomendaciones personalizadas basadas en compras previas utilizando OpenAI.

También incluye un panel de administración con métricas generales, gestión de usuarios y administración de pedidos. Durante esta etapa del proyecto, las integraciones con Seller App, Feedback App, Payments App y Shipping App se encuentran simuladas respetando los contratos definidos en la etapa de diseño.

---

## Notas para la corrección

* Se implementó autenticación y autorización mediante Clerk.
* Las recomendaciones de productos utilizan OpenAI y cuentan con un mecanismo de respaldo cuando el servicio externo no está disponible.
* Las aplicaciones externas (Seller, Payments, Feedback y Shipping) están mockeadas según los requisitos de la etapa.
* Los cambios de estado de pago y envío se simulan mediante scripts locales.
* La aplicación fue desplegada en Vercel utilizando PostgreSQL y Prisma como capa de persistencia.

## Documentación adicional
- DOCUMENTACION.md