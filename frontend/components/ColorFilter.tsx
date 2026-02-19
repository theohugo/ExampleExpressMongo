'use client';

import { useState, useEffect } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

interface ColorOption {
  couleur: string;
  count: number;
}

interface ColorFilterProps {
  currentColors?: string[];
}

export default function ColorFilter({ currentColors = [] }: ColorFilterProps) {
  const [colors, setColors] = useState<ColorOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string[]>(currentColors);
  const [open, setOpen] = useState(false);
  const router = useRouter();
    const searchParams = useSearchParams();

  // Charger les couleurs au montage du composant
  useEffect(() => {
    fetch('http://localhost:5000/api/beers/colors')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // Ajoute l'option "Toutes les couleurs" en premier
          setColors([{ couleur: 'Toutes les couleurs', count: 0 }, ...data.data]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Erreur chargement couleurs:', err);
        setLoading(false);
      });
  }, []);

  const toggleColor = (couleur: string) => {
    if (couleur === 'Toutes les couleurs') {
      setSelected([]); // désélectionne tout
    } else {
      setSelected(prev =>
        prev.includes(couleur)
          ? prev.filter(c => c !== couleur)
          : [...prev, couleur]
      );
    }
  };

    const handleApply = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (selected.length > 0) {
        params.set('couleur', selected.join(','));
    } else {
        params.delete('couleur');
    }

    params.set('page', '1');

    router.push(`/beers?${params.toString()}`);
    setOpen(false);
    };

  const handleCancel = () => {
    setSelected(currentColors);
    setOpen(false);
  };

  return (
    <div className="relative inline-block">
      {/* Bouton principal */}
      <button
        onClick={() => setOpen(!open)}
        className="px-5 py-2.5 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
      >
        Filtre couleur
        <ChevronDown size={18} className={open ? 'rotate-180' : ''} />
      </button>

      {/* Menu déroulant */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-300 rounded-lg shadow-2xl z-50 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-6 text-center text-gray-500">Chargement...</div>
          ) : colors.length === 0 ? (
            <div className="p-6 text-center text-gray-500">Aucune couleur trouvée</div>
          ) : (
            <>
              {colors.map((item) => (
                <div
                  key={item.couleur}
                  onClick={() => toggleColor(item.couleur)}
                  className={`px-5 py-3.5 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors ${
                    selected.includes(item.couleur) || (item.couleur === 'Toutes les couleurs' && selected.length === 0)
                      ? 'bg-amber-50'
                      : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {(selected.includes(item.couleur) || (item.couleur === 'Toutes les couleurs' && selected.length === 0)) && (
                      <Check size={20} className="text-green-600" />
                    )}
                    <span className="font-medium">{item.couleur}</span>
                  </div>
                  {item.couleur !== 'Toutes les couleurs' && (
                    <span className="text-gray-500 text-sm">({item.count})</span>
                  )}
                </div>
              ))}

              {/* Boutons Valider / Annuler */}
              <div className="p-5 border-t border-gray-200 flex gap-4">
                <button
                  onClick={handleApply}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Valider
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Annuler
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}