import { Beer, BeerStats } from "@/types";
import { API_BASE_URL } from "./config";

export async function getBeerStats(): Promise<BeerStats> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/beers/stats`, { cache: "no-store" });

    if (!res.ok) {
      throw new Error(`Erreur HTTP ${res.status}`);
    }

    const json = await res.json();
    if (!json.success) {
      throw new Error(json.message || "Erreur lors de la recuperation des statistiques");
    }

    const data = json.data;
    return {
      total: data.total,
      averagePriceTtc: Number(data.averagePriceTtc),
      byType: data.byType,
    };
  } catch (error) {
    console.error("Erreur getBeerStats:", error);
    return {
      total: 0,
      averagePriceTtc: 0,
      byType: [],
    };
  }
}

export async function getFeaturedBeers(limit = 6): Promise<Beer[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/beers?limit=${limit}&page=1`, { cache: "no-store" });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const json = await res.json();
    if (!json.success) {
      throw new Error(json.message || "Erreur");
    }

    return json.data.items;
  } catch (error) {
    console.error("Erreur fetch featured beers:", error);
    return [];
  }
}
