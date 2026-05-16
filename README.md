# 👟 Marketplace de Zapatillas

Proyecto fullstack desarrollado con **Next.js**, **TypeScript**, **Prisma** y **Clerk** que simula un marketplace de zapatillas con autenticación, carrito de compras, órdenes y checkout.

---

# 🚀 Tecnologías utilizadas

* Next.js (App Router)
* TypeScript
* Prisma ORM
* PostgreSQL
* Clerk Authentication
* Tailwind CSS
* React

---

# 📦 Funcionalidades

## 🔐 Autenticación

El proyecto utiliza Clerk como proveedor de autenticación.

Características:

* Registro e inicio de sesión
* Persistencia de sesión
* Protección de rutas privadas
* Integración de usuarios entre servicios mediante Clerk JWT

---

## 🛒 Carrito de compras

Los usuarios autenticados pueden:

* Agregar productos al carrito
* Elegir talle y color
* Incrementar cantidades automáticamente
* Eliminar productos
* Obtener el carrito asociado a su cuenta

### Endpoints principales

| Método | Endpoint        | Descripción                    |
| ------ | --------------- | ------------------------------ |
| GET    | `/api/cart`     | Obtiene el carrito del usuario |
| POST   | `/api/cart`     | Agrega un producto al carrito  |
| DELETE | `/api/cart?id=` | Elimina o decrementa un item   |

---

## 📦 Órdenes

El sistema permite:

* Crear órdenes desde el carrito
* Asociar órdenes a usuarios
* Consultar historial de compras
* Consultar una orden específica

### Endpoints principales

| Método | Endpoint          | Descripción                  |
| ------ | ----------------- | ---------------------------- |
| POST   | `/api/orders`     | Crea una nueva orden         |
| GET    | `/api/orders`     | Obtiene órdenes del usuario  |
| GET    | `/api/orders?id=` | Obtiene una orden específica |

---

## 💳 Checkout y pagos simulados

El proyecto incluye una simulación de integración con una API de pagos.

Flujo:

1. Se obtiene la orden.
2. Se genera un payload de pago.
3. Se simula el envío a una API externa.
4. La orden cambia su estado a `COMPLETED`.
5. Se redirige a la confirmación de compra.

### Endpoint principal

| Método | Endpoint             | Descripción                      |
| ------ | -------------------- | -------------------------------- |
| POST   | `/api/checkout/[id]` | Procesa el checkout de una orden |

---

## 🔍 Productos y filtros

El marketplace permite:

* Filtrar por categoría
* Filtrar por marca
* Filtrar por precio
* Buscar por nombre o marca
* Obtener información del vendedor

### Endpoint principal

| Método | Endpoint        | Descripción                 |
| ------ | --------------- | --------------------------- |
| GET    | `/api/products` | Obtiene productos filtrados |

### Parámetros soportados

| Parámetro | Descripción               |
| --------- | ------------------------- |
| category  | Filtrar por categoría     |
| brand     | Filtrar por marca         |
| minPrice  | Precio mínimo             |
| maxPrice  | Precio máximo             |
| search    | Buscar por nombre o marca |

Ejemplo:

```bash
/api/products?brand=Nike&minPrice=100&maxPrice=300
```

---

## 🏪 Sellers

El sistema también expone información de vendedores.

### Endpoints principales

| Método | Endpoint           | Descripción                  |
| ------ | ------------------ | ---------------------------- |
| GET    | `/api/sellers`     | Obtiene todos los sellers    |
| GET    | `/api/sellers?id=` | Obtiene un seller específico |

---

# 🧠 Arquitectura

El proyecto sigue una arquitectura basada en:

* Frontend y backend integrados con Next.js App Router
* API Routes para lógica de negocio
* Prisma como capa de acceso a datos
* Clerk para autenticación centralizada
* Separación modular por features

---

# ⚙️ Instalación

## 1. Clonar repositorio

```bash
git clone <repo-url>
```

---

## 2. Instalar dependencias

```bash
npm install
```

---

## 3. Configurar variables de entorno

Crear un archivo `.env`:

```env
DATABASE_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

---

## 4. Ejecutar migraciones

```bash
npx prisma migrate dev
```

---

## 5. Ejecutar el proyecto

```bash
npm run dev
```

---

# 🗄️ Modelo de datos

Entidades principales:

* User
* Product
* CartItem
* Order
* OrderItem
* Seller

Relaciones:

* Un usuario puede tener múltiples items en el carrito.
* Un usuario puede tener múltiples órdenes.
* Una orden contiene múltiples productos.
* Un producto pertenece a un seller.

---

# 📁 Estructura del proyecto

```bash
src/
 ├── app/
 │    ├── api/
 │    ├── components/
 │    ├── admin/
 │    └── checkout/
 │
 ├── lib/
 │    ├── prisma.ts
 │    ├── products.ts
 │    └── sellers.ts
 │
 ├── generated/
 └── prisma/
```

---

# 🔒 Seguridad

* Validación de autenticación con Clerk
* Protección de endpoints privados
* Validación de recursos por usuario
* Manejo de errores HTTP

---

# 📌 Estados de órdenes

| Estado    | Descripción                    |
| --------- | ------------------------------ |
| PENDING   | Orden creada pendiente de pago |
| COMPLETED | Pago realizado correctamente   |

---

# 🧪 Posibles mejoras futuras

* Integración real con otras apis
* Panel de administración avanzado
* Gestión de stock
* Reviews y ratings
* Notificaciones
* Emails transaccionales
* Dashboard de vendedores

---

# 👨‍💻 Autor

Desarrollado como proyecto académico/fullstack utilizando tecnologías modernas del ecosistema React y Next.js.
