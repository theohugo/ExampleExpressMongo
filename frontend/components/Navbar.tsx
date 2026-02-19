"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react"; // en haut du fichier


export default function Navbar() {
  const [email, setEmail] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    setEmail(storedEmail);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    setEmail(null);
    window.location.href = "/";
  };

  return (
    <nav className="bg-gray-900 text-white px-8 py-4 flex justify-between items-center">
      
      {/* Logo */}
      <Link href="/" className="text-2xl font-bold">
        Beermazone
      </Link>

      {/* Right side */}
      {email ? (
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="bg-gray-700 px-4 py-2 rounded flex items-center gap-2"
          >
            {email}
            <ChevronDown size={16} className={open ? "rotate-180 transition-transform" : "transition-transform"} />

          </button>

          {open && (
            <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-md z-50">
              <button
                onClick={handleLogout}
                className="block px-6 py-3 w-full text-left hover:bg-red-600 hover:text-white transition-colors rounded"
              >
                Déconnexion
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