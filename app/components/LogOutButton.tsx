"use client";
import { useState } from "react";
import { useClerk } from "@clerk/nextjs";

export function LogOutButton() {
  const { signOut } = useClerk();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-sm px-5 py-2.5 rounded-xl btn-primary shadow-sm transition font-medium"
      >
        Sign Out
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-surface-alt border border-muted rounded-2xl p-6 w-[90%] max-w-sm">
            
            <h2 className="text-lg font-semibold text-foreground">
              ¿Cerrar sesión?
            </h2>

            <p className="text-sm text-muted mt-2">
              Vas a salir de tu cuenta.
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded-lg border border-muted text-muted hover:text-foreground"
              >
                Cancelar
              </button>

              <button
                onClick={() => signOut({ redirectUrl: "/" })}
                className="px-4 py-2 rounded-lg btn-danger"
              >
                Sí, salir
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}