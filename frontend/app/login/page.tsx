"use client";

import { FormEvent, useState } from "react";
import { API_BASE_URL } from "@/lib/api/config";
import { saveUser } from "@/lib/auth";
import { User } from "@/types";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success || !data.data?._id) {
        throw new Error(data.message || "Connexion impossible");
      }

      saveUser(data.data as User);
      window.location.href = "/";
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 shadow-md rounded-xl w-full max-w-md">
        <h2 className="text-2xl mb-6 font-bold text-gray-900">Connexion</h2>

        <input
          type="email"
          placeholder="Email"
          required
          className="w-full mb-4 p-3 border rounded-lg"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />

        <input
          type="password"
          placeholder="Mot de passe"
          required
          className="w-full mb-4 p-3 border rounded-lg"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />

        <button disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg disabled:opacity-60">
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
}
