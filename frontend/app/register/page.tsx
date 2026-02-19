"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    age: "",
    telephone: "",
    email: "",
    password: "",
    adresse: {
      rue: "",
      ville: "",
      codePostal: "",
      pays: "France"
    }
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Conversion des champs numériques
    const payload = {
        ...form,
        age: form.age ? Number(form.age) : undefined,
        telephone: form.telephone?.trim() === "" ? undefined : form.telephone.trim()
    };


    const res = await fetch("http://localhost:5000/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (data.success) {
      alert("Inscription réussie");
      window.location.href = "/login";
    } else {
      alert(data.message);
    }
  };

  const handleChange = (key: string, value: string) => {
    if (key.startsWith("adresse.")) {
      const addrKey = key.split(".")[1];
      setForm({
        ...form,
        adresse: { ...form.adresse, [addrKey]: value }
      });
    } else {
      setForm({ ...form, [key]: value });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 shadow-md rounded w-full max-w-4xl">
        <h2 className="text-2xl mb-6 font-bold">Inscription</h2>

        <div className="grid grid-cols-2 gap-8">
          {/* Colonne de gauche */}
          <div className="flex flex-col gap-4">
            <div>
              <label className="block mb-1 font-medium">Nom *</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={form.nom}
                onChange={(e) => handleChange("nom", e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Prénom *</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={form.prenom}
                onChange={(e) => handleChange("prenom", e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Âge</label>
              <input
                type="number"
                className="w-full p-2 border rounded"
                value={form.age}
                onChange={(e) => handleChange("age", e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Téléphone</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={form.telephone}
                onChange={(e) => handleChange("telephone", e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Email *</label>
              <input
                type="email"
                className="w-full p-2 border rounded"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Mot de passe *</label>
              <input
                type="password"
                className="w-full p-2 border rounded"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
              />
            </div>
          </div>

          {/* Colonne de droite - Adresse */}
          <div className="flex flex-col gap-4">
            <div>
              <label className="block mb-1 font-medium">Rue</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={form.adresse.rue}
                onChange={(e) => handleChange("adresse.rue", e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Ville</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={form.adresse.ville}
                onChange={(e) => handleChange("adresse.ville", e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Code Postal</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={form.adresse.codePostal}
                onChange={(e) => handleChange("adresse.codePostal", e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Pays</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={form.adresse.pays}
                onChange={(e) => handleChange("adresse.pays", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Bouton */}
        <button className="mt-6 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors">
          S'inscrire
        </button>

        {/* Note obligatoire */}
        <p className="mt-4 text-gray-500 text-sm">(* : obligatoire)</p>
      </form>
    </div>
  );
}