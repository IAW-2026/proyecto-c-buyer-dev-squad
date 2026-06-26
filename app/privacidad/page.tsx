import Link from "next/link";

export default function PrivacidadPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12 text-foreground">
      <Link href="/home" className="text-sm text-muted hover:text-foreground transition-colors mb-6 inline-block">
        &larr; Volver a la tienda
      </Link>
      <h1 className="text-3xl font-bold mb-8">Política de Privacidad</h1>

      <section className="space-y-6 text-sm leading-relaxed">
        <p>
          En <strong>ZapasYa</strong> nos tomamos muy en serio tu privacidad. Esta política describe cómo recopilamos, usamos y protegemos tu información personal.
        </p>

        <h2 className="text-xl font-semibold mt-8">1. Información que Recopilamos</h2>
        <p>
          Recopilamos la información que nos proporcionás al registrarte (nombre, correo electrónico, dirección) y la generada por tu actividad en el sitio (compras, publicaciones, reseñas).
        </p>

        <h2 className="text-xl font-semibold mt-8">2. Uso de la Información</h2>
        <p>
          Usamos tus datos para procesar compras, facilitar la comunicación entre compradores y vendedores, mejorar nuestros servicios y enviarte notificaciones relacionadas con tu cuenta.
        </p>

        <h2 className="text-xl font-semibold mt-8">3. Protección de Datos</h2>
        <p>
          Implementamos medidas de seguridad técnicas y organizativas para proteger tu información contra acceso no autorizado, pérdida o divulgación.
        </p>

        <h2 className="text-xl font-semibold mt-8">4. Compartir Información</h2>
        <p>
          No vendemos tu información personal a terceros. Compartimos datos solo con vendedores para procesar compras y con proveedores de servicios esenciales (pagos, envíos).
        </p>

        <h2 className="text-xl font-semibold mt-8">5. Cookies</h2>
        <p>
          Utilizamos cookies y tecnologías similares para mejorar tu experiencia, recordar tus preferencias y analizar el tráfico del sitio. Podés configurar tu navegador para rechazarlas.
        </p>

        <h2 className="text-xl font-semibold mt-8">6. Tus Derechos</h2>
        <p>
          Tenés derecho a acceder, rectificar o eliminar tus datos personales en cualquier momento. Podés hacerlo desde la configuración de tu cuenta o contactándonos.
        </p>

        <h2 className="text-xl font-semibold mt-8">7. Contacto</h2>
        <p>
          Si tenés preguntas sobre esta política, escribinos a{" "}
          <a href="mailto:buyerzapasya@gmail.com" className="text-primary underline">buyerzapasya@gmail.com</a>.
        </p>

        <p className="text-muted mt-8">
          Última actualización: Junio 2026
        </p>
      </section>
    </main>
  );
}
