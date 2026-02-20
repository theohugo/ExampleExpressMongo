"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronDown, ShoppingCart } from "lucide-react";
import { clearUser, getStoredUser } from "@/lib/auth";
import { User } from "@/types";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const syncUser = () => setUser(getStoredUser());

    syncUser();
    window.addEventListener("auth-changed", syncUser);
    window.addEventListener("storage", syncUser);

    return () => {
      window.removeEventListener("auth-changed", syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  const handleLogout = () => {
    clearUser();
    window.location.href = "/";
  };

  return (
    <nav className="bg-gray-900 text-white px-4 md:px-8 py-4 flex justify-between items-center gap-4">
      <div className="flex items-center gap-6">
        <Link href="/" className="text-2xl font-bold">
          Beermazone
        </Link>
        <div className="hidden md:flex items-center gap-4 text-sm">
          <Link href="/beers" className="hover:text-amber-300 transition-colors">
            Catalogue
          </Link>
          {user?.role === "CLIENT" && (
            <Link href="/cart" className="hover:text-amber-300 transition-colors flex items-center gap-1">
              <ShoppingCart size={16} />
              Panier
            </Link>
          )}
          {user && (
            <Link href="/orders" className="hover:text-amber-300 transition-colors">
              Commandes
            </Link>
          )}
          {user?.role === "VENDEUR" && (
            <Link href="/manage/beers" className="hover:text-amber-300 transition-colors">
              Manage
            </Link>
          )}
        </div>
      </div>

      {user ? (
        <div className="relative">
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="bg-gray-700 px-4 py-2 rounded flex items-center gap-2 text-sm"
          >
            <span className="hidden md:inline">
              {user.prenom} {user.nom}
            </span>
            <span className="text-xs bg-gray-600 px-2 py-0.5 rounded">{user.role}</span>
            <ChevronDown size={16} className={open ? "rotate-180 transition-transform" : "transition-transform"} />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-md z-50 min-w-64">
              <div className="px-4 py-3 border-b border-gray-200">
                <p className="font-semibold">
                  {user.prenom} {user.nom}
                </p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="block px-6 py-3 w-full text-left hover:bg-red-600 hover:text-white transition-colors rounded"
              >
                Deconnexion
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex gap-4">
          <Link href="/login" className="bg-blue-600 px-4 py-2 rounded">
            Connexion
          </Link>
          <Link href="/register" className="bg-green-600 px-4 py-2 rounded">
            Inscription
          </Link>
        </div>
      )}
    </nav>
  );
}
