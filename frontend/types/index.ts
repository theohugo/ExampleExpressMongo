// types/index.ts

export interface Beer {
  _id: string;
  couleur: string;
  nom_article: string;
  nom_marque: string;
  prix_15: number;
  prix_ht: number;
  titrage: number;
  type: string;
  volume: number;
  // Ajoute d'autres champs si ton API en renvoie plus tard (ex: description, stock, imageUrl...)
}

export interface BeerStats {
  total: number;
  averagePriceTtc: number;
  byType: { type: string; count: number }[];
}