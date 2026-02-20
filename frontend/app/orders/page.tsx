"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/api/config";
import { buildUserHeaders, getStoredUser } from "@/lib/auth";
import { Order, User } from "@/types";

type OrderApiResult = {
  items: Order[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export default function OrdersPage() {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      const currentUser = getStoredUser();
      setUser(currentUser);

      if (!currentUser) {
        setLoading(false);
        return;
      }

      const endpoint = currentUser.role === "VENDEUR" ? "/api/orders" : "/api/orders/client";

      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: buildUserHeaders(currentUser),
        cache: "no-store",
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Impossible de charger les commandes");
      }

      const payload = data.data as OrderApiResult | Order[];
      setOrders(Array.isArray(payload) ? payload : payload.items || []);
    };

    loadOrders()
      .catch((error) => alert(error instanceof Error ? error.message : "Erreur commandes"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <main className="p-8">Chargement des commandes...</main>;

  if (!user) {
    return (
      <main className="p-8 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Commandes</h1>
        <p className="mb-6">Connecte-toi pour voir les commandes.</p>
        <Link href="/login" className="bg-blue-600 text-white px-4 py-2 rounded">
          Connexion
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">
          {user.role === "VENDEUR" ? "Toutes les commandes" : "Mes commandes"}
        </h1>

        {orders.length === 0 ? (
          <div className="bg-white p-6 rounded-xl shadow">Aucune commande.</div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white p-6 rounded-xl shadow space-y-3">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <p className="font-semibold">Commande #{order._id}</p>
                  <span className="text-sm px-2 py-1 rounded bg-gray-200 w-fit">{order.status}</span>
                </div>
                <p className="text-sm text-gray-600">
                  {new Date(order.createdAt).toLocaleString("fr-FR")}
                </p>
                <p className="text-sm">
                  Client: {order.customer?.name} | Adresse: {order.customer?.address}
                </p>
                <div className="space-y-1">
                  {order.items.map((item) => (
                    <p key={`${order._id}-${item.beer}`} className="text-sm">
                      {item.beerName} x{item.quantity} - {item.lineTotal.toFixed(2)} EUR
                    </p>
                  ))}
                </div>
                <p className="font-bold">Total: {order.totalAmount.toFixed(2)} EUR</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
