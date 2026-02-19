// app/beers/page.tsx
import { Beer } from '@/types';
import BeerCard from '@/components/BeerCard';
import Link from 'next/link';
import { Search } from 'lucide-react';
import ColorFilter from '@/components/ColorFilter';

const ITEMS_PER_PAGE = 12;

async function getBeers(page: number = 1, limit: number = ITEMS_PER_PAGE, q: string = '', couleur: string = ''): Promise<{
  items: Beer[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}> {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (q.trim()) {
    queryParams.append('q', q.trim());
  }
  if (couleur.trim()) queryParams.append('couleur', couleur.trim());

  try {
    const res = await fetch(
      `http://localhost:5000/api/beers?${queryParams.toString()}`,
      { cache: 'no-store' }
    );

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const json = await res.json();

    if (!json.success) throw new Error(json.message || 'Erreur');

    return json.data;
  } catch (error) {
    console.error('Erreur getBeers:', error);
    return { items: [], pagination: { page: 1, limit: 0, total: 0, totalPages: 0 } };
  }
}

export default async function BeersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string; couleur?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const searchQuery = params.q || '';
    const colorQuery = params.couleur || '';
  const { items: beers, pagination } = await getBeers(currentPage, ITEMS_PER_PAGE, searchQuery, colorQuery);

  const totalPages = pagination.totalPages || 1;

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Titre + barre de recherche */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
          <h1 className="text-4xl font-bold text-gray-900">
            Catalogue complet
          </h1>

          {/* Filtre couleur multi-sélection */}
            <ColorFilter
                currentColors={params.couleur ? params.couleur.split(',') : []}
            />

          {/* Barre de recherche */}
          <form
            action="/beers"
            method="GET"
            className="w-full sm:w-150 flex items-center gap-2"
          >
            <input
              type="text"
              name="q"
              defaultValue={searchQuery}
              placeholder="Rechercher par nom, marque, type..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2"
            >
              <Search size={20} />
              Rechercher
            </button>

            {/* Input caché pour garder la page actuelle si on veut */}
            <input type="hidden" name="page" value="1" />
          </form>
        </div>

        <p className="text-gray-600 mb-8">
          {pagination.total || 0} bières trouvées
        </p>

        {/* Grille */}
        {beers.length === 0 ? (
          <div className="text-center py-20 text-gray-500 text-xl">
            Aucune bière ne correspond à votre recherche...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {beers.map((beer) => (
              <BeerCard key={beer._id} beer={beer} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center gap-6">
            <Link
              href={`/beers?page=${Math.max(1, currentPage - 1)}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ''}`}
              className={`px-6 py-3 rounded-lg border text-lg font-medium transition-colors ${
                currentPage === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-white hover:bg-gray-100 border-gray-300'
              }`}
            >
              Précédent
            </Link>

            <span className="text-gray-700 font-medium text-lg">
              Page {currentPage} sur {totalPages}
            </span>

            <Link
              href={`/beers?page=${Math.min(totalPages, currentPage + 1)}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ''}`}
              className={`px-6 py-3 rounded-lg border text-lg font-medium transition-colors ${
                currentPage === totalPages
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-white hover:bg-gray-100 border-gray-300'
              }`}
            >
              Suivant
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}