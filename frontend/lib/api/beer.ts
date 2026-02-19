// lib/api/beer.ts
import axios from 'axios';

import { Beer, BeerStats } from '@/types';

const API_BASE = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:5000' 
  : 'https://ton-backend-production.com'; // ou une variable d'env

// ────────────────────────────────────────────────
// lib/api/beer.ts

export async function getBeerStats(): Promise<BeerStats> {
  try {
    const res = await fetch(`${API_BASE}/api/beers/stats`, {
      cache: 'no-store', // force le refresh en dev
    });

    if (!res.ok) {
      throw new Error(`Erreur HTTP ${res.status}`);
    }

    const json = await res.json();

    if (!json.success) {
      throw new Error(json.message || 'Erreur lors de la récupération des statistiques');
    }

    const data = json.data;

    // Mapping exact vers ton interface BeerStats
    return {
      total: data.total,
      averagePriceTtc: Number(data.averagePriceTtc),
      byType: data.byType,
      // Si tu veux aussi utiliser byColor plus tard :
      // byColor: data.byColor,
    };
  } catch (error: any) {
    console.error('Erreur getBeerStats:', error.message || error);
    
    // Valeur de secours (affichage 0 au lieu de crash)
    return {
      total: 0,
      averagePriceTtc: 0,
      byType: [],
    };
  }
}

// ────────────────────────────────────────────────
export async function getFeaturedBeers(limit = 6): Promise<Beer[]> {
  try {
    const res = await fetch(
      `${API_BASE}/api/beers?limit=${limit}&page=1`,
      { cache: 'no-store' } // pas de cache en dev
    );

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const json = await res.json();

    if (!json.success) {
      throw new Error(json.message || 'Erreur');
    }

    return json.data.items;
  } catch (error: any) {
    console.error('Erreur fetch featured beers:', error.message || error);
    return [];
  }
}