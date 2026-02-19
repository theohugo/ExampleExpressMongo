"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: ""
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.success) {
      alert("Inscription réussie");
      window.location.href = "/login";
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-8 shadow-md rounded w-96">
        <h2 className="text-2xl mb-6">Inscription</h2>

        {Object.keys(form).map((key) => (
          <input
            key={key}
            type={key === "password" ? "password" : "text"}
            placeholder={key}
            className="w-full mb-4 p-2 border"
            onChange={(e) =>
              setForm({ ...form, [key]: e.target.value })
            }
          />
        ))}

        <button className="w-full bg-green-600 text-white py-2">
          S'inscrire
        </button>
      </form>
    </div>
  );
}