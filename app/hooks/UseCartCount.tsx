"use client";

import { useEffect, useState, useTransition } from "react";
import { getCartCount } from "@/lib/actions/Cart.actions";
import { useUser } from "@clerk/nextjs";

export function useCartCount() {
  const [count, setCount] = useState(0);
  const [isPending, startTransition] = useTransition();
  const { isSignedIn, isLoaded } = useUser();

  const update = () => {
    startTransition(async () => {
      const total = await getCartCount();
      setCount(total);
    });
  };

  useEffect(() => {
    if (isLoaded) {
      update();
    }
  }, [isSignedIn, isLoaded]);

  useEffect(() => {
    window.addEventListener("cartUpdated", update);
    return () => window.removeEventListener("cartUpdated", update);
  }, []);
// se ejecuta una vez al montar el componente para obtener el conteo inicial del carrito.
//  Luego, se agrega un event listener para escuchar el evento "cartUpdated" y 
// actualizar el conteo cada vez que se dispare ese evento. 
// El conteo se actualiza solo si el usuario está autenticado y 
// los datos del usuario han sido cargados.
  return { count, loading: isPending };
}
