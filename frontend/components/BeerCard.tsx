'use client';

import { Beer } from '@/types';
import Link from 'next/link';

interface BeerCardProps {
  beer: Beer;
}

export default function BeerCard({ beer }: BeerCardProps) {
  const seed = encodeURIComponent(
    `${beer._id || beer.nom_article}${beer.type}${beer.couleur}${beer.nom_marque}`
  );

  const imageUrl = `https://bieromatique.fr/wp-content/uploads/2021/07/pinte-de-biere.jpg`;

  // Fallback fiable
  const fallbackImage =
    'https://bieromatique.fr/wp-content/uploads/2021/07/pinte-de-biere.jpg';

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-200 group flex flex-col h-full">
      {/* Image */}
      <div className="h-48 overflow-hidden bg-amber-50 relative">
        <img
          src={imageUrl}
          alt={`${beer.nom_article} - ${beer.nom_marque}`}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          onError={(e) => {
            e.currentTarget.src = fallbackImage;
            e.currentTarget.alt = 'Image bière indisponible';
          }}
          loading="lazy"
        />
        {/* Overlay léger au hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Contenu */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-1 group-hover:text-amber-800 transition-colors">
          {beer.nom_article}
        </h3>

        <p className="text-sm text-gray-600 mb-4 line-clamp-1 italic">
          {beer.nom_marque}
        </p>

        <div className="space-y-2.5 text-sm text-gray-700 flex-grow">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Type</span>
            <span className="font-medium bg-amber-100 px-2.5 py-0.5 rounded-full">
              {beer.type}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Couleur</span>
            <span className="font-medium">{beer.couleur}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Volume</span>
            <span className="font-medium">{beer.volume} cl</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Degré</span>
            <span className="font-medium">{beer.titrage}%</span>
          </div>
        </div>

        {/* Prix + bouton */}
        <div className="pt-5 mt-auto border-t border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600 font-medium">Prix HT</span>
            <span className="text-2xl font-bold text-green-700">
              {beer.prix_ht.toFixed(2)} €
            </span>
          </div>
            <Link
                href={`/beers/${beer._id}`}
                className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-3 rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all duration-300 font-medium shadow-sm hover:shadow-md text-center block"
            >
                Voir détails
            </Link>
        </div>
      </div>
    </div>
  );
}