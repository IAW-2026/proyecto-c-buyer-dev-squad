# Buyer App — Marketplace

Aplicación de compras para un marketplace estilo Mercado Libre desarrollada como parte de la Etapa 2 del proyecto integrador.

La plataforma permite a los compradores explorar productos, aplicar filtros de búsqueda, gestionar un carrito de compras, realizar pedidos y consultar su historial de compras. Además, incorpora recomendaciones personalizadas basadas en compras previas y un panel de administración para la gestión del sistema.

Construida con Next.js, PostgreSQL, Prisma, Clerk Authentication y Tailwind CSS. Durante esta etapa del proyecto, las integraciones con las aplicaciones Seller, Payments y Shipping se encuentran mockeadas/simuladas respetando los contratos definidos en la etapa de diseño.

## Características principales

### Compradores

* Registro e inicio de sesión mediante Clerk.
* Búsqueda de productos.
* Filtros por categoría, marca, color y rango de precios.
* Visualización de detalles de productos y vendedores.
* Gestión de carrito de compras.
* Creación y seguimiento de pedidos.
* Historial de compras.
* Recomendaciones de productos basadas en compras anteriores.

### Administración

* Dashboard con métricas generales.
* Gestión de usuarios.
* Suspensión y reactivación de usuarios.
* Gestión y actualización de pedidos.
* Visualización de reportes y listados relevantes.

## Tecnologías

* **Next.js** — Framework React full-stack.
* **TypeScript** — Tipado estático.
* **PostgreSQL** — Base de datos relacional.
* **Prisma** — ORM y sistema de migraciones.
* **Clerk** — Autenticación y manejo de sesiones.
* **Tailwind CSS** — Estilos y diseño responsivo.
* **Vercel** — Deploy de la aplicación.

## Deploy

https://[completar-url-de-vercel]

## Credenciales de acceso

| Rol           | Email                   | Contraseña  |
| ------------- | ----------------------- | ----------- |
| Administrador | zapasya.clerk@gmail.com | ZapasYa11@  |
| Comprador     | buyerzapasya@gmail.com  | dev-squad   |

## Datos de prueba incluidos

La aplicación cuenta con:

* Usuarios precargados.
* Productos precargados en distintas categorías.
* Pedidos en diferentes estados.
* Historial de compras asociado a distintos usuarios.

Para simular la integración con los servicios externos del marketplace, se incluyen scripts que permiten modificar el estado de las órdenes:

```bash
npm run status-paid
npm run status-shipping
npm run status-delivered
```

Estos scripts representan los eventos que, en una integración real, serían enviados por las aplicaciones de pagos y logística.

## Ejecución local

```bash
# 1. Clonar repositorio
git clone https://github.com/IAW-2026/proyecto-c-buyer-dev-squad.git

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local

# 4. Ejecutar migraciones
npx prisma migrate dev

# 5. Cargar datos iniciales
npm run seed

# 6. Iniciar aplicación
npm run dev
```

## Variables de entorno

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
OPENAI_API_KEY=
DATABASE_URL=
BUYER_SECRET=
```
### Recomendaciones inteligentes con IA

La aplicación incorpora un sistema de recomendaciones personalizadas utilizando la API de OpenAI.

A partir del historial de compras del usuario, se analizan sus categorías más frecuentes, marcas preferidas y rango habitual de precios. Esta información se utiliza para generar sugerencias de productos que aún no han sido comprados y que se ajustan a sus preferencias.

Para garantizar la disponibilidad de la funcionalidad, el sistema incluye un mecanismo de respaldo que genera recomendaciones basadas en categorías populares cuando la API externa no se encuentra disponible.

Debido a que el consumo de la API tiene costos asociados, el uso de esta funcionalidad se encuentra limitado en el entorno de pruebas. Como mejora futura se planea optimizar el sistema mediante caché de recomendaciones, reducción de llamadas a la API y la incorporación de algoritmos híbridos de recomendación.

## Limitaciones actuales

* Las integraciones con Seller App, Payments App y Shipping App están simuladas.
* No existe sincronización real de stock con vendedores.
* Los estados de envío y pago son actualizados mediante scripts de prueba.

## Futuras mejoras

* Control de stock en tiempo real.
* Integración completa con las demás aplicaciones del marketplace.
* Más medios y opciones de compra.
* Sistema avanzado de recomendaciones.
* Lista de favoritos y productos guardados.
* Notificaciones en tiempo real sobre cambios de estado de pedidos.
* Comparación de productos y mejoras en la experiencia de búsqueda.
* Optimización del sistema de recomendaciones basado en IA para reducir costos de OpenAI.
* Dashboard analítico más avanzado con nuevas métricas comerciales.