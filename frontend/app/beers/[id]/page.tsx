// app/beers/[id]/page.tsx
import { Beer } from '@/types';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

async function getBeerById(id: string): Promise<Beer | null> {
  try {
    const res = await fetch(`http://localhost:5000/api/beers/${id}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error(`Erreur HTTP pour bière ${id}: ${res.status}`);
      return null;
    }

    const json = await res.json();

    if (!json.success || !json.data) {
      console.error('Réponse API non réussie ou sans data');
      return null;
    }

    // Selon ton API, la bière est soit directement json.data, soit json.data.item
    return json.data.item || json.data;
  } catch (error) {
    console.error('Erreur getBeerById:', error);
    return null;
  }
}

export default async function BeerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const beer = await getBeerById(id);

  if (!beer) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-20">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Bière non trouvée
          </h1>
          <p className="text-gray-600 mb-8">
            Cette référence n'existe pas ou a été supprimée.
          </p>
          <Link
            href="/beers"
            className="inline-flex items-center px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour au catalogue
          </Link>
        </div>
      </main>
    );
  }

  // Image placeholder (comme dans BeerCard)
  const imageUrl = `https://bieromatique.fr/wp-content/uploads/2021/07/pinte-de-biere.jpg`;

  const fallbackImage =
    'https://bieromatique.fr/wp-content/uploads/2021/07/pinte-de-biere.jpg';

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Bouton retour */}
        <Link
          href="/beers"
          className="inline-flex items-center text-amber-700 hover:text-amber-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Retour au catalogue
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image grande */}
          <div className="rounded-2xl overflow-hidden shadow-2xl bg-white">
            <img
              src={imageUrl}
              alt={`${beer.nom_article} - ${beer.nom_marque}`}
              className="w-full h-auto object-cover aspect-square lg:aspect-auto"
            />
          </div>

          {/* Infos */}
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {beer.nom_article}
            </h1>

            <p className="text-2xl text-gray-600 mb-8">
              {beer.nom_marque}
            </p>

            <div className="grid grid-cols-2 gap-8 mb-10 text-lg">
              <div>
                <span className="block text-gray-500 text-sm uppercase tracking-wide mb-1">
                  Type
                </span>
                <span className="font-medium">{beer.type}</span>
              </div>
              <div>
                <span className="block text-gray-500 text-sm uppercase tracking-wide mb-1">
                  Couleur
                </span>
                <span className="font-medium">{beer.couleur}</span>
              </div>
              <div>
                <span className="block text-gray-500 text-sm uppercase tracking-wide mb-1">
                  Volume
                </span>
                <span className="font-medium">{beer.volume} cl</span>
              </div>
              <div>
                <span className="block text-gray-500 text-sm uppercase tracking-wide mb-1">
                  Degré
                </span>
                <span className="font-medium">{beer.titrage}%</span>
              </div>
            </div>

            <div className="flex gap-65 mb-10">
                <div>
                    <span className="block text-gray-500 text-sm uppercase tracking-wide mb-2">
                        Prix HT
                    </span>
                    <span className="block text-gray-600 mt-2">
                        {beer.prix_ht.toFixed(2)} €
                    </span>
                </div>
                <div>
                    <span className="block text-gray-600 mt-2">
                        Prix ( TTC ) pour {beer.volume} cl :
                        </span>
                    {beer.prix_15 && (
                        <span className='text-5xl font-bold text-green-700'>
                            {beer.prix_15.toFixed(2)} €
                        </span>
                    )}
                </div>
            </div>

            {/* Boutons d'action (à développer plus tard) */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex-1 bg-amber-600 text-white py-4 rounded-xl font-medium hover:bg-amber-700 transition-colors text-lg">
                Ajouter au panier
              </button>
              <button className="flex-1 bg-white border-2 border-gray-300 py-4 rounded-xl font-medium hover:bg-gray-50 transition-colors text-lg">
                Voir les similaires
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}