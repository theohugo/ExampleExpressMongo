"use client";

import { useState } from "react";
import { API_BASE_URL } from "@/lib/api/config";
import { buildUserHeaders, getCartId, getStoredUser } from "@/lib/auth";

type Props = {
  beerId: string;
};

export default function AddToCartButton({ beerId }: Props) {
  const [loading, setLoading] = useState(false);

  const onAdd = async () => {
    const user = getStoredUser();
    if (!user) {
      alert("Connecte-toi pour ajouter au panier.");
      window.location.href = "/login";
      return;
    }
    if (user.role !== "CLIENT") {
      alert("Le panier est reserve aux comptes client.");
      return;
    }

    setLoading(true);
    try {
      const cartId = getCartId(user);
      const res = await fetch(`${API_BASE_URL}/api/carts/${cartId}/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...buildUserHeaders(user),
        },
        body: JSON.stringify({
          beerId,
          quantity: 1,
          userId: user._id,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Ajout panier impossible");
      }

      alert("Article ajoute au panier.");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erreur panier");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={onAdd}
      disabled={loading}
      className="flex-1 bg-amber-600 text-white py-4 rounded-xl font-medium hover:bg-amber-700 transition-colors text-lg disabled:opacity-60"
    >
      {loading ? "Ajout..." : "Ajouter au panier"}
    </button>
  );
}
