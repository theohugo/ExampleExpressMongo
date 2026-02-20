"use client";

import { FormEvent, useState } from "react";
import { API_BASE_URL } from "@/lib/api/config";
import { UserRole } from "@/types";

type RegisterForm = {
  nom: string;
  prenom: string;
  age: string;
  telephone: string;
  email: string;
  password: string;
  role: UserRole;
  adresse: {
    rue: string;
    ville: string;
    codePostal: string;
    pays: string;
  };
};

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<RegisterForm>({
    nom: "",
    prenom: "",
    age: "",
    telephone: "",
    email: "",
    password: "",
    role: "CLIENT",
    adresse: {
      rue: "",
      ville: "",
      codePostal: "",
      pays: "France",
    },
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...form,
      age: form.age ? Number(form.age) : undefined,
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

  const handleChange = (
    key: keyof RegisterForm | `adresse.${keyof RegisterForm["adresse"]}`,
    value: string
  ) => {
    if (key.startsWith("adresse.")) {
      const addrKey = key.split(".")[1] as keyof RegisterForm["adresse"];
      setForm((prev) => ({
        ...prev,
        adresse: { ...prev.adresse, [addrKey]: value },
      }));
      return;
    }

    if (key === "role") {
      setForm((prev) => ({ ...prev, role: value as UserRole }));
      return;
    }
    if (key === "nom" || key === "prenom" || key === "age" || key === "telephone" || key === "email" || key === "password") {
      setForm((prev) => ({ ...prev, [key]: value }));
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 shadow-md rounded w-full max-w-4xl">
        <h2 className="text-2xl mb-6 font-bold">Inscription</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
              Age
              <input
                type="number"
                className="mt-1 w-full p-2 border rounded"
                value={form.age}
                onChange={(e) => handleChange("age", e.target.value)}
              />
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

          <div className="flex flex-col gap-4">
            <label className="text-sm font-medium">
              Rue
              <input
                type="text"
                className="mt-1 w-full p-2 border rounded"
                value={form.adresse.rue}
                onChange={(e) => handleChange("adresse.rue", e.target.value)}
              />
            </label>
            <label className="text-sm font-medium">
              Ville
              <input
                type="text"
                className="mt-1 w-full p-2 border rounded"
                value={form.adresse.ville}
                onChange={(e) => handleChange("adresse.ville", e.target.value)}
              />
            </label>
            <label className="text-sm font-medium">
              Code postal
              <input
                type="text"
                className="mt-1 w-full p-2 border rounded"
                value={form.adresse.codePostal}
                onChange={(e) => handleChange("adresse.codePostal", e.target.value)}
              />
            </label>
            <label className="text-sm font-medium">
              Pays
              <input
                type="text"
                className="mt-1 w-full p-2 border rounded"
                value={form.adresse.pays}
                onChange={(e) => handleChange("adresse.pays", e.target.value)}
              />
            </label>
          </div>
        </div>

        <button disabled={loading} className="mt-6 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-60">
          {loading ? "Creation..." : "S'inscrire"}
        </button>
      </form>
    </div>
  );
}
