"use client";

import { FormEvent, useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/api/config";
import { buildUserHeaders, getStoredUser } from "@/lib/auth";
import { Beer, User } from "@/types";

type BeerForm = {
  nom_article: string;
  nom_marque: string;
  couleur: string;
  type: string;
  prix_ht: string;
  prix_ttc: string;
  titrage: string;
  volume: string;
  stock: string;
};

export default function ManageBeersPage() {
  const [user, setUser] = useState<User | null>(null);
  const [beers, setBeers] = useState<Beer[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<BeerForm>({
    nom_article: "",
    nom_marque: "",
    couleur: "",
    type: "",
    prix_ht: "",
    prix_ttc: "",
    titrage: "",
    volume: "",
    stock: "100",
  });

  const loadBeers = async () => {
    const res = await fetch(`${API_BASE_URL}/api/beers?limit=100`, { cache: "no-store" });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Chargement bieres impossible");
    }

    const allBeers = (data.data?.items || []) as Beer[];
    setBeers(allBeers);
  };

  useEffect(() => {
    const currentUser = getStoredUser();
    setUser(currentUser);

    if (!currentUser || currentUser.role !== "VENDEUR") {
      setLoading(false);
      return;
    }

    loadBeers()
      .catch((error) => alert(error instanceof Error ? error.message : "Erreur chargement"))
      .finally(() => setLoading(false));
  }, []);

  const submitBeer = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      const payload = {
        ...form,
        prix_ht: Number(form.prix_ht),
        prix_ttc: Number(form.prix_ttc),
        titrage: Number(form.titrage),
        volume: Number(form.volume),
        stock: Number(form.stock),
      };

      const res = await fetch(`${API_BASE_URL}/api/beers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...buildUserHeaders(user),
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Creation de biere impossible");
      }

      setForm({
        nom_article: "",
        nom_marque: "",
        couleur: "",
        type: "",
        prix_ht: "",
        prix_ttc: "",
        titrage: "",
        volume: "",
        stock: "100",
      });
      await loadBeers();
      alert("Biere creee.");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erreur de creation");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <main className="p-8">Chargement...</main>;

  if (!user) return <main className="p-8">Connecte-toi pour acceder au manage.</main>;
  if (user.role !== "VENDEUR") return <main className="p-8">Acces refuse: page reservee aux vendeurs.</main>;

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Manage bieres</h1>

        <form onSubmit={submitBeer} className="bg-white p-6 rounded-xl shadow grid grid-cols-1 md:grid-cols-2 gap-4">
          <input required className="border rounded p-2" placeholder="Nom article" value={form.nom_article} onChange={(e) => setForm((p) => ({ ...p, nom_article: e.target.value }))} />
          <input required className="border rounded p-2" placeholder="Marque" value={form.nom_marque} onChange={(e) => setForm((p) => ({ ...p, nom_marque: e.target.value }))} />
          <input className="border rounded p-2" placeholder="Couleur" value={form.couleur} onChange={(e) => setForm((p) => ({ ...p, couleur: e.target.value }))} />
          <input className="border rounded p-2" placeholder="Type" value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))} />
          <input required type="number" min="0" step="0.01" className="border rounded p-2" placeholder="Prix HT" value={form.prix_ht} onChange={(e) => setForm((p) => ({ ...p, prix_ht: e.target.value }))} />
          <input required type="number" min="0" step="0.01" className="border rounded p-2" placeholder="Prix TTC" value={form.prix_ttc} onChange={(e) => setForm((p) => ({ ...p, prix_ttc: e.target.value }))} />
          <input required type="number" min="0" step="0.1" className="border rounded p-2" placeholder="Titrage" value={form.titrage} onChange={(e) => setForm((p) => ({ ...p, titrage: e.target.value }))} />
          <input required type="number" min="1" className="border rounded p-2" placeholder="Volume (cl)" value={form.volume} onChange={(e) => setForm((p) => ({ ...p, volume: e.target.value }))} />
          <input type="number" min="0" className="border rounded p-2" placeholder="Stock" value={form.stock} onChange={(e) => setForm((p) => ({ ...p, stock: e.target.value }))} />
          <button disabled={saving} className="bg-amber-600 text-white px-4 py-2 rounded disabled:opacity-60">
            {saving ? "Creation..." : "Creer la biere"}
          </button>
        </form>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Catalogue</h2>
          <div className="space-y-3">
            {beers.map((beer) => (
              <div key={beer._id} className="border rounded p-3 flex justify-between gap-4">
                <div>
                  <p className="font-semibold">{beer.nom_article}</p>
                  <p className="text-sm text-gray-600">{beer.nom_marque} - {beer.type}</p>
                </div>
                <p className="font-semibold">{beer.prix_ttc?.toFixed(2) ?? beer.prix_15.toFixed(2)} EUR</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
