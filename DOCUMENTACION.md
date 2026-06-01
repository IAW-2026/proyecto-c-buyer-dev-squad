# Documentación Complementaria - Buyer App

## Descripción técnica

Buyer App es la aplicación destinada a los compradores dentro del ecosistema Marketplace desarrollado para el proyecto integrador.
La aplicación fue construida utilizando Next.js con App Router, TypeScript, Prisma y PostgreSQL. Para la autenticación y autorización se utilizó Clerk, mientras que Tailwind CSS se empleó para el diseño de la interfaz.
La arquitectura se organizó separando la lógica de negocio en servicios, las operaciones ejecutadas desde el cliente mediante Server Actions y el acceso a datos a través de Prisma. Esta estructura permitió mantener el código modular, escalable y de fácil mantenimiento.
---

## Funcionalidades implementadas

### Compradores

* Registro e inicio de sesión.
* Exploración de productos.
* Búsqueda de productos.
* Filtros por categoría, marca, color y rango de precios.
* Visualización de detalles de productos.
* Gestión de carrito de compras.
* Creación de pedidos.
* Historial de compras.
* Recomendaciones personalizadas de productos.
* Persistencia del carrito entre sesiones.
* Conservación de productos agregados al carrito antes de iniciar sesión.

### Administradores

* Dashboard con métricas generales.
* Gestión de usuarios.
* Suspensión y reactivación de cuentas.
* Gestión y actualización de pedidos.
* Visualización de reportes básicos.
* Acceso a las funcionalidades disponibles para compradores.
* Modificación manual de información del sistema cuando sea necesario.
---

## Arquitectura general

La aplicación sigue una estructura basada en capas:

```text
app/
 ├── páginas y layouts
 ├── componentes
 ├── acciones del servidor

lib/
 ├── services/
 ├── prisma/
 └── utilidades

database/
 └── PostgreSQL
```
La mayor parte de las operaciones se realizan mediante Server Actions de Next.js, evitando la necesidad de exponer una gran cantidad de endpoints REST.
---

## Integraciones externas

Durante esta etapa del proyecto las aplicaciones externas fueron simuladas respetando los contratos definidos en el diseño del sistema.
Las integraciones consideradas son:
* Seller App
* Payments App
* Shipping App
* Feedback App

Para simular eventos provenientes de Payments y Shipping se implementaron scripts que permiten actualizar el estado de una orden:

```bash
npx tsx status-paid.ts <orderId>
npx tsx status-shipping.ts <orderId>
npx tsx status-delivered.ts <orderId>
```
Estos scripts representan eventos que, en un entorno real, serían enviados automáticamente por servicios externos.
Una vez creada una orden, el sistema permanece a la espera de cambios de estado provenientes de estas integraciones. Cuando se recibe una actualización, la orden se actualiza automáticamente reflejando el nuevo estado del proceso de pago o envío.

---

## Sistema de recomendaciones

Se implementó una funcionalidad de recomendaciones personalizadas utilizando OpenAI.
A partir del historial de compras de cada usuario se analizan categorías, marcas y rangos de precios frecuentes para sugerir productos relacionados que aún no hayan sido comprados.
Como mecanismo de respaldo, si la API de OpenAI no se encuentra disponible, el sistema genera recomendaciones utilizando productos populares almacenados en la base de datos.

---

## Seguridad

Las principales medidas implementadas son:

* Autenticación mediante Clerk.
* Control de acceso por roles (ADMIN y USER).
* Protección de rutas administrativas.
* Verificación de usuarios suspendidos antes de ejecutar operaciones sensibles.
* Restricción de compras para usuarios suspendidos.
* Validación de permisos sobre órdenes y recursos pertenecientes a cada usuario.
* Protección de endpoints externos mediante clave compartida (`BUYER_SECRET`).
* Validaciones tanto del lado del cliente como del servidor.

Además, determinadas funcionalidades requieren autenticación previa:

* Consultar pedidos.
* Acceder al carrito de compras.
* Agregar productos al carrito.
* Realizar compras.

Cuando un usuario intenta agregar productos al carrito sin haber iniciado sesión, los productos seleccionados se conservan y se incorporan automáticamente al carrito una vez completado el proceso de autenticación.

---

## Experiencia de usuario

Durante el desarrollo se puso especial énfasis en la experiencia de usuario mediante:
* Indicadores visuales de carga (loaders) durante operaciones asíncronas.
* Confirmaciones previas para acciones críticas como cierre de sesión o eliminación de información.
* Mensajes de error y validaciones claras en formularios.
* Persistencia del carrito de compras en base de datos.
* Recuperación automática del carrito al volver a iniciar sesión.
* Navegación optimizada mediante paginación.
La paginación fue implementada en:
* Catálogo de productos.
* Gestión de usuarios.
* Gestión de pedidos.
Esto permite reducir la carga sobre la base de datos y mejorar el rendimiento general de la aplicación.

---

## Decisiones de diseño

Durante el desarrollo se tomaron las siguientes decisiones:
* Utilizar Server Actions como mecanismo principal de comunicación entre cliente y servidor.
* Centralizar la lógica de negocio en servicios reutilizables.
* Mantener una única base de datos PostgreSQL administrada mediante Prisma.
* Implementar datos semilla para facilitar las pruebas y la corrección del proyecto.
* Incorporar recomendaciones basadas en IA como funcionalidad adicional de valor agregado.
* Priorizar la validación temprana de datos para reducir inconsistencias.
* Persistir el carrito en base de datos para mantener continuidad entre sesiones.
---

## Limitaciones conocidas

* Las integraciones con Payments, Shipping, Feedback y Seller se encuentran simuladas.
* No existe sincronización real de stock con vendedores externos.
* Los cambios de estado de pago y envío se realizan mediante scripts de prueba.
* No se implementó un sistema de notificaciones por correo electrónico.
* Los productos muestran una única imagen por artículo, independientemente del color seleccionado.
* La búsqueda y filtrado de productos no considera la ubicación geográfica del usuario ni la proximidad de los vendedores.
* Las métricas administrativas son básicas y orientadas a demostración académica.

El sistema permite que los administradores modifiquen manualmente información de usuarios y pedidos. Estas acciones ofrecen flexibilidad de gestión, aunque la responsabilidad por posibles inconsistencias derivadas de cambios manuales recae en el administrador que las realiza.

---

## Posibles mejoras futuras

* Integración real con servicios de pago.
* Integración completa con la aplicación de logística.
* Gestión de stock en tiempo real.
* Integración completa con la aplicación de reseñas y calificaciones.
* Notificaciones automáticas por correo electrónico.
* Dashboard administrativo con métricas avanzadas.
* Optimización y ampliación del sistema de recomendaciones.
* Actualización dinámica de imágenes según color o variante seleccionada.
* Filtrado y recomendaciones basadas en ubicación geográfica.
* Incorporación de favoritos y listas de productos guardados.
* Comparación de productos similares.
* Seguimiento de envíos en tiempo real.
* Sistema de cupones, descuentos y promociones.
* Notificaciones en tiempo real sobre cambios de estado de pedidos.
