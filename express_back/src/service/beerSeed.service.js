import fs from 'fs';
import path from 'path';
import readline from 'readline';
import beerRepository from '../repositories/beer.repository.js';

function toNumber(value, fallback = 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
}

class BeerSeedService {
    async seedIfEmpty() {
        const count = await beerRepository.countAll();
        if (count > 0) {
            console.log(`[SEED] Collection beer deja remplie (${count} documents)`);
            return;
        }

        const datasetPath = path.resolve(process.cwd(), 'mongodb', 'dataset', 'beer.json');
        if (!fs.existsSync(datasetPath)) {
            console.warn(`[SEED] Dataset introuvable: ${datasetPath}`);
            return;
        }

        const beers = [];
        const stream = fs.createReadStream(datasetPath);
        const lineReader = readline.createInterface({
            input: stream,
            crlfDelay: Infinity,
        });

        for await (const line of lineReader) {
            const trimmed = line.trim();
            if (!trimmed) continue;

            try {
                const row = JSON.parse(trimmed);
                beers.push({
                    couleur: row.couleur || 'Inconnue',
                    nom_article: row.nom_article || 'Biere sans nom',
                    nom_marque: row.nom_marque || 'Marque inconnue',
                    prix_ht: toNumber(row.prix_ht),
                    prix_15: toNumber(row.prix_15),
                    titrage: toNumber(row.titrage),
                    type: row.type || 'Non classe',
                    volume: toNumber(row.volume, 33),
                    stock: 100,
                });
            } catch (error) {
                console.warn(`[SEED] Ligne ignoree (JSON invalide): ${error.message}`);
            }
        }

        if (beers.length === 0) {
            console.warn('[SEED] Aucun document valide a inserer');
            return;
        }

        await beerRepository.createMany(beers);
        console.log(`[SEED] ${beers.length} bieres inserees`);
    }
}

export default new BeerSeedService();
