"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

import { LayoutDashboard, Users, ShoppingBag, Package, ChevronRight } from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Usuarios", icon: Users },
  { href: "/admin/orders", label: "Pedidos", icon: ShoppingBag },
];

interface AdminSidebarProps {
  user: {
    firstName?: string | null;
    lastName?: string | null;
    email: string;
    role: string;
  };
}

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-header">
        <div className="admin-logo">
          <span className="admin-logo-icon">⚡</span>
          <div>
            <p className="admin-logo-title">Admin Panel</p>
            <p className="admin-logo-sub">Zapatillas</p>
          </div>
        </div>
      </div>

      <nav className="admin-nav">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`admin-nav-item ${isActive ? "active" : ""}`}
            >
              <Icon size={18} />
              <span>{label}</span>
              {isActive && <ChevronRight size={14} className="ml-auto" />}
            </Link>
          );
        })}
      </nav>

      <div className="admin-sidebar-footer">
        <div className="admin-user-info">
          <UserButton
            userProfileMode="navigation"
            userProfileUrl="/user-profile"
          />
          <div className="admin-user-text">
            <p className="admin-user-name">
              {user.firstName ?? ""} {user.lastName ?? ""}
            </p>
            <p className="admin-user-role">Administrador</p>
          </div>
        </div>
        <Link href="/" className="admin-back-link">
          ← Volver a la tienda
        </Link>
      </div>
    </aside>
  );
}