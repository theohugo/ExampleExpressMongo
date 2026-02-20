// types/index.ts

export interface Beer {
  _id: string;
  couleur: string;
  nom_article: string;
  nom_marque: string;
  prix_15: number;
  prix_ht: number;
  prix_ttc: number;
  titrage: number;
  type: string;
  volume: number;
  stock?: number;
  vendeur?: string;
}

export interface BeerStats {
  total: number;
  averagePriceTtc: number;
  byType: { type: string; count: number }[];
}

export type UserRole = "CLIENT" | "VENDEUR";

export interface User {
  _id: string;
  nom: string;
  prenom: string;
  email: string;
  role: UserRole;
  telephone?: string;
}

export interface CartItem {
  seller: string;
  beer: string;
  beerName: string;
  unitPriceTtc: number;
  quantity: number;
  lineTotal: number;
}

export interface Cart {
  _id?: string;
  cartId: string;
  client?: string;
  items: CartItem[];
  totalAmount: number;
}

export type OrderStatus = "pending" | "paid" | "preparing" | "shipped" | "cancelled";

export interface Order {
  _id: string;
  client: string;
  customer: {
    name: string;
    email?: string;
    phone?: string;
    address: string;
  };
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  notes?: string | null;
  createdAt: string;
}
