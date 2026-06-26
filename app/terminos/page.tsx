import Link from "next/link";

export default function TerminosPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12 text-foreground">
      <Link href="/home" className="text-sm text-muted hover:text-foreground transition-colors mb-6 inline-block">
        &larr; Volver a la tienda
      </Link>
      <h1 className="text-3xl font-bold mb-8">Términos y Condiciones</h1>

      <section className="space-y-6 text-sm leading-relaxed">
        <p>
          Bienvenido a <strong>ZapasYa</strong>. Al acceder y utilizar este marketplace, aceptás los siguientes términos y condiciones. Si no estás de acuerdo, por favor no uses nuestros servicios.
        </p>

        <h2 className="text-xl font-semibold mt-8">1. Uso del Marketplace</h2>
        <p>
          ZapasYa actúa como intermediario entre vendedores y compradores de calzado. No nos responsabilizamos por la calidad, autenticidad o estado de los productos publicados por vendedores externos.
        </p>

        <h2 className="text-xl font-semibold mt-8">2. Registro de Usuario</h2>
        <p>
          Para comprar o vender en ZapasYa, debés registrarte con información veraz y mantener tu cuenta segura. Sos responsable de toda actividad realizada con tu cuenta.
        </p>

        <h2 className="text-xl font-semibold mt-8">3. Publicaciones de Vendedores</h2>
        <p>
          Los vendedores se comprometen a publicar productos auténticos, con descripciones precisas y precios claros. ZapasYa se reserva el derecho de eliminar publicaciones que incumplan estas normas.
        </p>

        <h2 className="text-xl font-semibold mt-8">4. Compras y Pagos</h2>
        <p>
          Todas las compras realizadas a través de ZapasYa están sujetas a disponibilidad. Los precios pueden variar sin previo aviso. Una vez realizada la compra, recibirás un comprobante por correo electrónico.
        </p>

        <h2 className="text-xl font-semibold mt-8">5. Envíos y Entregas</h2>
        <p>
          Los plazos de envío son estimados y dependen del vendedor y la empresa de logística. ZapasYa no se hace responsable por demoras fuera de nuestro control.
        </p>

        <h2 className="text-xl font-semibold mt-8">6. Devoluciones y Reembolsos</h2>
        <p>
          Cada vendedor establece su propia política de devoluciones. Ante cualquier inconveniente, contactate con el vendedor directamente. Si no llegás a un acuerdo, podés contactarnos para mediar.
        </p>

        <h2 className="text-xl font-semibold mt-8">7. Modificaciones</h2>
        <p>
          ZapasYa puede modificar estos términos en cualquier momento. Te recomendamos revisarlos periódicamente. El uso continuado del sitio implica la aceptación de los cambios.
        </p>

        <p className="text-muted mt-8">
          Última actualización: Junio 2026
        </p>
      </section>
    </main>
  );
}
