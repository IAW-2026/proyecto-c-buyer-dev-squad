# Buyer App --- Marketplace (Etapa 3)

## Deploy de producción

https://zapasya.vercel.app/

------------------------------------------------------------------------

## Usuarios para pruebas

  Rol             Email                      Contraseña
  --------------- -------------------------- ------------
  Administrador   admin+clerk_test@iaw.com   iawuser#
  Comprador       user+clerk_test@iaw.com    iawuser#

------------------------------------------------------------------------

## Instrucciones para evaluación

-   Iniciar sesión utilizando alguno de los usuarios de prueba
    proporcionados.
-   Como comprador (usuario), es posible explorar el catálogo de
    productos, aplicar filtros de búsqueda, visualizar detalles de
    productos y vendedores, gestionar el carrito de compras, realizar
    pedidos y consultar el historial de compras.
-   Como administrador, además de contar con todas las funcionalidades
    del comprador, se puede acceder al dashboard administrativo para
    gestionar usuarios y pedidos del sistema.
-   La aplicación incluye datos precargados para facilitar la
    evaluación.

------------------------------------------------------------------------

## Integración entre aplicaciones (Etapa 3)

En esta etapa se reemplazaron los mocks utilizados en la Etapa 2 por
integraciones reales entre webapps del marketplace, respetando los
contratos definidos.

### Integraciones implementadas

-   **Seller App → Buyer App**
    -   Los productos y vendedores ahora se obtienen mediante llamadas
        reales a la Seller App.
-   **Payments App**
    -   El flujo de pago ahora se integra con la Payments App.
    -   Las órdenes cambian de estado según la respuesta real del
        servicio.
-   **Shipping App**
    -   El estado de envío se gestiona mediante la Shipping App.
    -   Permite simular el ciclo completo: pendiente → pagado → en envío
        → entregado.

------------------------------------------------------------------------

## Flujo de órdenes

-   PENDING → PAID → SHIPPED → DELIVERED
-   Integración completa entre servicios externos.

------------------------------------------------------------------------

## Descripción del proyecto

Buyer App es una aplicación de marketplace estilo Mercado Libre
desarrollada con Next.js, PostgreSQL, Prisma, Clerk Authentication y
Tailwind CSS.

------------------------------------------------------------------------
