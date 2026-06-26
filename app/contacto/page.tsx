import Link from "next/link";
import { Mail, MessageSquare, HelpCircle } from "lucide-react";

export default function ContactoPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12 text-foreground">
      <Link href="/home" className="text-sm text-muted hover:text-foreground transition-colors mb-6 inline-block">
        &larr; Volver a la tienda
      </Link>
      <h1 className="text-3xl font-bold mb-8">Contacto</h1>

      <div className="grid gap-6 md:grid-cols-3 mb-12">
        <div className="border border-muted rounded-2xl p-6 text-center">
          <Mail className="w-8 h-8 mx-auto mb-3 text-primary" />
          <h2 className="font-semibold mb-1">Correo Electrónico</h2>
          <a href="mailto:buyerzapasya@gmail.com" className="text-sm text-muted hover:text-foreground transition-colors">
            buyerzapasya@gmail.com
          </a>
        </div>

        <div className="border border-muted rounded-2xl p-6 text-center">
          <MessageSquare className="w-8 h-8 mx-auto mb-3 text-primary" />
          <h2 className="font-semibold mb-1">Atención al Cliente</h2>
          <p className="text-sm text-muted">
            Respondemos en menos de 24 horas
          </p>
        </div>

        <div className="border border-muted rounded-2xl p-6 text-center">
          <HelpCircle className="w-8 h-8 mx-auto mb-3 text-primary" />
          <h2 className="font-semibold mb-1">Preguntas Frecuentes</h2>
          <p className="text-sm text-muted">
            Revisá nuestros <Link href="/terminos" className="text-primary underline">términos</Link>
          </p>
        </div>
      </div>

      <div className="border border-muted rounded-2xl p-8">
        <h2 className="text-xl font-semibold mb-4">Envianos un mensaje</h2>
        <p className="text-sm text-muted mb-4">
          Escribinos a{" "}
          <a href="mailto:buyerzapasya@gmail.com" className="text-primary underline font-medium">
            buyerzapasya@gmail.com
          </a>{" "}
          y te responderemos a la brevedad.
        </p>
        <div className="bg-surface-alt border border-muted rounded-xl p-4 text-sm text-muted">
          <p className="font-medium text-foreground mb-1">Horarios de atención:</p>
          <p>Lunes a viernes de 9:00 a 18:00 hs</p>
          <p>Sábados de 10:00 a 14:00 hs</p>
        </div>
      </div>
    </main>
  );
}
