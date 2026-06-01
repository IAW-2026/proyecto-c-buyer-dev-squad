"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateUserProfile } from "@/lib/actions/User.actions";

type UserData = {
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  address?: string | null;
  birthDate?: Date | null;
};

type Props = {
  user: UserData;
  imageUrl: string;
  onClose: () => void;
  onSave?: (data: {       
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    birthDate: string;
  }) => void;
};

export function ProfileModal({ user, imageUrl, onClose, onSave }: Props) {  
  const router = useRouter();  // 👈 faltaba
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    firstName: user.firstName ?? "",
    lastName: user.lastName ?? "",
    phone: user.phone ?? "",
    address: user.address ?? "",
    birthDate: user.birthDate
      ? new Date(user.birthDate).toISOString().split("T")[0]
      : "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    startTransition(async () => {
      await updateUserProfile(form);
      onSave?.(form);  
      router.refresh();
      onClose();
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-surface border border-muted rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center gap-4 mb-6">
          <img
            src={imageUrl}
            alt="Avatar"
            className="w-14 h-14 rounded-full border border-muted object-cover"
          />
          <div>
            <h2 className="text-lg font-semibold text-foreground">Mi perfil</h2>
            <p className="text-sm text-muted">Completá tus datos personales</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted mb-1 block">Nombre</label>
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="Juan"
                className="w-full px-3 py-2 rounded-lg border border-muted bg-surface-alt text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted mb-1 block">Apellido</label>
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Pérez"
                className="w-full px-3 py-2 rounded-lg border border-muted bg-surface-alt text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted mb-1 block">Teléfono</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+54 9 11 1234-5678"
              className="w-full px-3 py-2 rounded-lg border border-muted bg-surface-alt text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted mb-1 block">Dirección</label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Av. Corrientes 1234, CABA"
              className="w-full px-3 py-2 rounded-lg border border-muted bg-surface-alt text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted mb-1 block">Fecha de nacimiento</label>
            <input
              type="date"
              name="birthDate"
              value={form.birthDate}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-muted bg-surface-alt text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={isPending}
            className="flex-1 py-2 rounded-lg border border-muted text-sm text-muted hover:bg-surface-alt transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="flex-1 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60"
          >
            {isPending ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}