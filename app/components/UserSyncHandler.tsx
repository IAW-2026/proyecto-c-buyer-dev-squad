"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useRef } from "react";
import { syncUserToServices } from "@/lib/actions/SyncUser.actions";

export function UserSyncHandler() {
  const { isSignedIn, isLoaded } = useUser();
  const synced = useRef(false);

  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn && !synced.current) {
      synced.current = true;
      syncUserToServices().catch(console.error);
    }
    if (!isSignedIn) {
      synced.current = false;
    }
  }, [isSignedIn, isLoaded]);

  return null;
}
