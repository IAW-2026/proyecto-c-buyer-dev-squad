"use client";

import { useState } from "react";
import { ProfileModal } from "./ProfileModal";
import { LogOutButton } from "./LogOutButton";

type Props = {
  imageUrl: string;
  fullName: string | null;
  dbUser: {
    firstName?: string | null;
    lastName?: string | null;
    phone?: string | null;
    address?: string | null;
    birthDate?: Date | null;
  };
};

export function UserAvatarMenu({ imageUrl, fullName, dbUser }: Props) {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <>
      <div className="flex items-center gap-3">
        <button onClick={() => setShowProfile(true)} className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50">
          <img
            src={imageUrl}
            alt={fullName ?? "Avatar"}
            className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border border-muted shadow-sm hover:opacity-80 transition-opacity cursor-pointer"
          />
        </button>
        <LogOutButton />
      </div>

      {showProfile && (
        <ProfileModal
          user={dbUser}
          imageUrl={imageUrl}
          onClose={() => setShowProfile(false)}
        />
      )}
    </>
  );
}