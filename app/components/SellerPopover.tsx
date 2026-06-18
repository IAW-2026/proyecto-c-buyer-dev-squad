"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Seller } from "../types/seller";

export function SellerPopover({ seller }: { seller: Seller }) {
  const [open, setOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={popoverRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-xl px-3 py-2 border border-muted bg-surface hover:bg-surface-alt transition-colors"
        aria-expanded={open}
      >
        <div className="relative h-8 w-8 rounded-full overflow-hidden border border-muted shrink-0">
          <img
            src={seller.avatarUrl}
            alt={seller.name}
            className="object-cover w-full h-full"
          />
        </div>
        <span className="text-sm font-medium text-foreground">
          {seller.name}
        </span>
        <svg
          className={`h-3 w-3 text-muted transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M2 4l4 4 4-4" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute bottom-full mb-2 left-0 z-50 w-72 rounded-xl border border-muted p-4 shadow-lg"
          style={{ backgroundColor: "var(--color-surface-alt)" }}
        >
          <div
            className="absolute -bottom-2 left-5 h-3 w-3 rotate-45 border-r border-b border-muted"
            style={{ backgroundColor: "var(--color-surface-alt)" }}
          />

          <div className="flex items-center gap-3 mb-3">
            <div className="relative h-12 w-12 rounded-full overflow-hidden border border-muted shrink-0">
              <img
                src={seller.avatarUrl}
                alt={seller.name}
                className="object-cover w-full h-full"
              />
            </div>
            <div>
              <p className="font-semibold text-sm text-foreground">
                {seller.name}
              </p>
              <p className="text-xs text-muted">{seller.email}</p>
            </div>
          </div>

          <p className="text-sm text-muted leading-relaxed line-clamp-4">
            {seller.description}
          </p>
          <Link
            href={`${process.env.NEXT_PUBLIC_FEEDBACK_URL}/explorar/vendedor/${seller.id}`}
            className="btn-secondary text-sm px-4 py-2 rounded-xl"
          >
            ⭐ Ver opiniones
          </Link>
        </div>
      )}
    </div>
  );
}
