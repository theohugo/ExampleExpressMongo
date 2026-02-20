"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/api/config";
import { buildUserHeaders, getCartId, getStoredUser } from "@/lib/auth";
import { Cart, User } from "@/types";

export default function CartPage() {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [notes, setNotes] = useState("");

  const cartId = useMemo(() => (user ? getCartId(user) : null), [user]);

  const loadCart = async (currentUser: User) => {
    const currentCartId = getCartId(currentUser);
    const res = await fetch(`${API_BASE_URL}/api/carts/${currentCartId}?userId=${currentUser._id}`, {
      headers: buildUserHeaders(currentUser),
      cache: "no-store",
    });
    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || "Impossible de charger le panier");
    }
    setCart(data.data as Cart);
  };

  useEffect(() => {
    const currentUser = getStoredUser();
    setUser(currentUser);

    if (!currentUser) {
      setLoading(false);
      return;
    }
    if (currentUser.role !== "CLIENT") {
      setLoading(false);
      return;
    }

    setCustomerName(`${currentUser.prenom} ${currentUser.nom}`.trim());
    setCustomerAddress(
      [currentUser.adresse?.rue, currentUser.adresse?.codePostal, currentUser.adresse?.ville, currentUser.adresse?.pays]
        .filter(Boolean)
        .join(" ")
    );

    loadCart(currentUser)
      .catch((error) => alert(error instanceof Error ? error.message : "Erreur panier"))
      .finally(() => setLoading(false));
  }, []);

  const setQuantity = async (beerId: string, quantity: number) => {
    if (!user || !cartId) return;

    const res = await fetch(`${API_BASE_URL}/api/carts/${cartId}/items/${beerId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...buildUserHeaders(user),
      },
      body: JSON.stringify({ quantity, userId: user._id }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Mise a jour impossible");
    }
    setCart(data.data as Cart);
  };

  const removeItem = async (beerId: string) => {
    if (!user || !cartId) return;

    const res = await fetch(`${API_BASE_URL}/api/carts/${cartId}/items/${beerId}?userId=${user._id}`, {
      method: "DELETE",
      headers: buildUserHeaders(user),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Suppression impossible");
    }
    setCart(data.data as Cart);
  };

  const checkout = async () => {
    if (!user || !cartId) return;
    if (!customerName.trim() || !customerAddress.trim()) {
      alert("Nom et adresse client obligatoires.");
      return;
    }

    setCheckoutLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/carts/${cartId}/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...buildUserHeaders(user),
        },
        body: JSON.stringify({
          customer: {
            name: customerName.trim(),
            address: customerAddress.trim(),
            email: user.email,
            phone: user.telephone,
          },
          notes: notes.trim() || undefined,
          userId: user._id,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Checkout impossible");
      }

      await loadCart(user);
      alert("Commande creee.");
      window.location.href = "/orders";
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erreur checkout");
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) return <main className="p-8">Chargement du panier...</main>;

  if (!user) {
    return (
      <main className="p-8 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Panier</h1>
        <p className="mb-6">Connecte-toi pour acceder au panier.</p>
        <Link href="/login" className="bg-blue-600 text-white px-4 py-2 rounded">
          Connexion
        </Link>
      </main>
    );
  }

  if (user.role !== "CLIENT") {
    return (
      <main className="p-8 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Panier</h1>
        <p>Acces reserve aux comptes client.</p>
      </main>
    );
  }

  const items = cart?.items || [];

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Mon panier</h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-xl p-6 shadow">
            <p>Panier vide.</p>
            <Link href="/beers" className="inline-block mt-4 text-amber-700 font-semibold">
              Aller au catalogue
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl p-6 shadow space-y-4">
            {items.map((item) => (
              <div key={item.beer} className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="font-semibold">{item.beerName}</p>
                  <p className="text-sm text-gray-600">{item.unitPriceTtc.toFixed(2)} EUR / unite</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1 border rounded" onClick={() => setQuantity(item.beer, Math.max(0, item.quantity - 1))}>
                    -
                  </button>
                  <span className="min-w-8 text-center">{item.quantity}</span>
                  <button className="px-3 py-1 border rounded" onClick={() => setQuantity(item.beer, item.quantity + 1)}>
                    +
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-semibold">{item.lineTotal.toFixed(2)} EUR</p>
                  <button className="text-red-600" onClick={() => removeItem(item.beer)}>
                    Supprimer
                  </button>
                </div>
              </div>
            ))}

            <div className="border-t pt-4 flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>{(cart?.totalAmount || 0).toFixed(2)} EUR</span>
            </div>
          </div>
        )}

        {items.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow space-y-3">
            <h2 className="text-xl font-semibold">Checkout</h2>
            <input
              className="w-full border rounded p-2"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Nom du client"
            />
            <textarea
              className="w-full border rounded p-2"
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              placeholder="Adresse de livraison"
            />
            <textarea
              className="w-full border rounded p-2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes (optionnel)"
            />
            <button disabled={checkoutLoading} onClick={checkout} className="bg-green-600 text-white px-5 py-2 rounded disabled:opacity-60">
              {checkoutLoading ? "Validation..." : "Valider la commande"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
