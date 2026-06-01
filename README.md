# Buyer App — Marketplace

## Deploy de producción

https://zapasya.vercel.app/

---

## Usuarios para pruebas

| Rol           | Email                                                     | Contraseña |
| ------------- | --------------------------------------------------------- | ---------- |
| Administrador | [admin+clerktest@iaw.com](mailto:admin+clerktest@iaw.com) | iawuser#   |
| Comprador     | [user+clerktest@iaw.com](mailto:user+clerktest@iaw.com)   | iawuser#   |

---

## Instrucciones para evaluación

* Iniciar sesión con alguno de los usuarios de prueba.
* Como comprador se pueden explorar productos, aplicar filtros, agregar productos al carrito, generar pedidos y consultar el historial de compras.
* Como administrador se puede acceder al dashboard, gestionar usuarios y actualizar estados de pedidos.
* La aplicación incluye datos precargados de productos, usuarios y órdenes para facilitar las pruebas.
* Las integraciones con Payments y Shipping se encuentran simuladas mediante scripts de prueba:

```bash
npm run status-paid
npm run status-shipping
npm run status-delivered
```

---

## Descripción del proyecto

Buyer App es una aplicación de compras para un marketplace estilo Mercado Libre desarrollada con Next.js, PostgreSQL, Prisma, Clerk Authentication y Tailwind CSS.

La plataforma permite a los compradores buscar productos, aplicar filtros, gestionar un carrito de compras, realizar pedidos y consultar su historial de compras. Además, incorpora recomendaciones personalizadas basadas en compras previas utilizando OpenAI.

También incluye un panel de administración con métricas generales, gestión de usuarios y administración de pedidos. Durante esta etapa del proyecto, las integraciones con Seller App, Payments App y Shipping App se encuentran simuladas respetando los contratos definidos en la etapa de diseño.

---

## Notas para la corrección

* Se implementó autenticación y autorización mediante Clerk.
* Las recomendaciones de productos utilizan OpenAI y cuentan con un mecanismo de respaldo cuando el servicio externo no está disponible.
* Las aplicaciones externas (Seller, Payments y Shipping) están mockeadas según los requisitos de la etapa.
* Los cambios de estado de pago y envío se simulan mediante scripts locales.
* La aplicación fue desplegada en Vercel utilizando PostgreSQL y Prisma como capa de persistencia.

Para documentación técnica adicional, configuración local y detalles de implementación, consultar la documentación complementaria del repositorio.
