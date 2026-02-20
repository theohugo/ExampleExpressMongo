"use client";

import { FormEvent, useState } from "react";
import { API_BASE_URL } from "@/lib/api/config";
import { UserRole } from "@/types";

type RegisterForm = {
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  password: string;
  role: UserRole;
};

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<RegisterForm>({
    nom: "",
    prenom: "",
    telephone: "",
    email: "",
    password: "",
    role: "CLIENT",
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...form,
      telephone: form.telephone.trim() || undefined,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Inscription impossible");
      }

      alert("Compte cree. Connecte-toi pour continuer.");
      window.location.href = "/login";
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key: keyof RegisterForm, value: string) => {
    if (key === "role") {
      setForm((prev) => ({ ...prev, role: value as UserRole }));
      return;
    }
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 shadow-md rounded w-full max-w-xl">
        <h2 className="text-2xl mb-6 font-bold">Inscription</h2>

        <div className="flex flex-col gap-4">
          <label className="text-sm font-medium">
            Nom *
            <input
              type="text"
              required
              className="mt-1 w-full p-2 border rounded"
              value={form.nom}
              onChange={(e) => handleChange("nom", e.target.value)}
            />
          </label>

          <label className="text-sm font-medium">
            Prenom *
            <input
              type="text"
              required
              className="mt-1 w-full p-2 border rounded"
              value={form.prenom}
              onChange={(e) => handleChange("prenom", e.target.value)}
            />
          </label>

          <label className="text-sm font-medium">
            Role *
            <select
              className="mt-1 w-full p-2 border rounded"
              value={form.role}
              onChange={(e) => handleChange("role", e.target.value)}
            >
              <option value="CLIENT">Client</option>
              <option value="VENDEUR">Vendeur</option>
            </select>
          </label>

          <label className="text-sm font-medium">
            Telephone
            <input
              type="text"
              className="mt-1 w-full p-2 border rounded"
              value={form.telephone}
              onChange={(e) => handleChange("telephone", e.target.value)}
            />
          </label>

          <label className="text-sm font-medium">
            Email *
            <input
              type="email"
              required
              className="mt-1 w-full p-2 border rounded"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </label>

          <label className="text-sm font-medium">
            Mot de passe *
            <input
              type="password"
              required
              className="mt-1 w-full p-2 border rounded"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
            />
          </label>
        </div>

        <button disabled={loading} className="mt-6 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-60">
          {loading ? "Creation..." : "S'inscrire"}
        </button>
      </form>
    </div>
  );
}
