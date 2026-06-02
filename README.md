# Buyer App — Marketplace

## Deploy de producción

https://zapasya.vercel.app/

---

## Usuarios para pruebas

| Rol           | Email                    | Contraseña |
| ------------- | ------------------------ | ---------- |
| Administrador | [admin+clerk_test@iaw.com]| iawuser#   |
| Comprador     | [user+clerk_test@iaw.com] | iawuser#   |

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
* Cuando se crea una orden y se procede al pago, se mantiene en estado pendiente hasta que detecta que su estado cambió a PAID, y se muestra la orden de pago exitoso.

## Descripción del proyecto

Buyer App es una aplicación de compras para un marketplace estilo Mercado Libre desarrollada con Next.js, PostgreSQL, Prisma, Clerk Authentication y Tailwind CSS.
La plataforma permite a los compradores buscar productos, aplicar filtros, gestionar un carrito de compras, realizar pedidos y consultar su historial de compras. Además, incorpora recomendaciones personalizadas basadas en compras previas utilizando OpenAI.
También incluye un panel de administración con métricas generales, gestión de usuarios y administración de pedidos. Durante esta etapa del proyecto, las integraciones con Seller App, Feedback App, Payments App y Shipping App se encuentran simuladas respetando los contratos definidos en la etapa de diseño.

---

## Notas para la corrección
# Notas y comentarios para la corrección

## Aspectos a destacar

* Las recomendaciones de productos utilizan inteligencia artificial mediante OpenAI. Debido a las limitaciones de la versión gratuita del servicio, se implementó un mecanismo de respaldo (fallback) para garantizar el funcionamiento de la funcionalidad cuando la API no se encuentra disponible o alcanza sus límites de uso.
* Los cambios de estado de pago y envío se simulan mediante scripts locales, permitiendo representar el comportamiento esperado de las integraciones externas sin depender de servicios de terceros durante la evaluación del proyecto.
* Se priorizó la validación de formularios tanto del lado del cliente como del servidor para garantizar la integridad de los datos ingresados por los usuarios.
* Se implementó la actualización de páginas mediante Server Actions y revalidación de rutas, asegurando que los datos mostrados se mantengan consistentes con la información almacenada en la base de datos.

## Limitaciones conocidas y posibles mejoras futuras

* En esta versión se priorizó la simplicidad de implementación y la consistencia de los datos utilizando Server Actions junto con `revalidatePath()`. Como mejora futura, podría incorporarse actualización optimista para ofrecer una experiencia más fluida y evitar recargas completas de ciertas vistas.
* Optimizar las consultas a la base de datos y reducir los tiempos de carga de determinadas páginas y paneles administrativos.
* Incorporar filtros adicionales para la gestión de pedidos, incluyendo filtros por rango de fechas.
* Mejorar la edición de pedidos por parte del administrador utilizando listas desplegables (select) con los usuarios existentes en lugar de campos de texto libres.
* Permitir que los administradores agreguen productos a pedidos existentes, además de la funcionalidad actual de eliminación de productos.
* Incorporar la posibilidad de cancelar pedidos desde la aplicación.
* Continuar mejorando aspectos visuales y de experiencia de usuario de la interfaz.
* Actualmente se muestran identificadores de productos y pedidos para facilitar las pruebas y la ejecución de los scripts de simulación. En una versión de producción estos identificadores deberían ocultarse o reemplazarse por referencias más amigables para el usuario.
* Evaluar la incorporación de servicios de inteligencia artificial con mayores capacidades o límites de uso más amplios para mejorar las funcionalidades basadas en IA.
