import Beer from '../model/beer.model.js';
import ApiResponse from '../utils/apiResponse.js';
import beerRepository from '../repositories/beer.repository.js';
import { isValidObjectId } from '../utils/mongo.util.js';
import { parsePagination } from '../utils/pagination.util.js';

function buildBeerFilters(query) {
    const {
        q,
        type,
        couleur,
        marque,
        minPrice,
        maxPrice,
    } = query;

    const filters = {};

    if (q) {
        filters.$or = [
            { nom_article: { $regex: q, $options: 'i' } },
            { nom_marque: { $regex: q, $options: 'i' } },
            { type: { $regex: q, $options: 'i' } },
        ];
    }

    if (type) {
        filters.type = { $regex: type, $options: 'i' };
    }

    if (couleur) {
        filters.couleur = { $regex: couleur, $options: 'i' };
    }

    if (marque) {
        filters.nom_marque = { $regex: marque, $options: 'i' };
    }

    const min = Number(minPrice);
    const max = Number(maxPrice);
    if (Number.isFinite(min) || Number.isFinite(max)) {
        filters.prix_15 = {};
        if (Number.isFinite(min)) filters.prix_15.$gte = min;
        if (Number.isFinite(max)) filters.prix_15.$lte = max;
    }

    return filters;
}

class BeerController {
    async create(req, res) {
        try {
            const createdBeer = await beerRepository.create({
                ...req.body,
                vendeur: req.currentUser._id,
            });

            return ApiResponse.created(res, 'Biere creee', createdBeer);
        } catch (error) {
            if (error.name === 'ValidationError') {
                return ApiResponse.badRequest(res, error.message);
            }
            return ApiResponse.error(res, 'Erreur lors de la creation de la biere', null, 500, error.message);
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            if (!isValidObjectId(id)) {
                return ApiResponse.badRequest(res, "L identifiant biere est invalide");
            }

            const payload = { ...req.body };
            delete payload.vendeur;

            const updatedBeer = await beerRepository.updateById(id, payload);
            if (!updatedBeer) {
                return ApiResponse.notFound(res, 'Biere non trouvee');
            }
            return ApiResponse.success(res, 'Biere mise a jour', updatedBeer);
        } catch (error) {
            if (error.name === 'ValidationError') {
                return ApiResponse.badRequest(res, error.message);
            }
            return ApiResponse.error(res, 'Erreur lors de la mise a jour de la biere', null, 500, error.message);
        }
    }

    async getAll(req, res) {
    try {
        const { page = 1, limit = 20, q = '', couleur } = req.query;

        const query = {};

        // 🔎 Recherche texte
        if (q && q.trim() !== '') {
        const searchRegex = new RegExp(q.trim(), 'i');
        query.$or = [
            { nom_article: searchRegex },
            { nom_marque: searchRegex },
            { type: searchRegex },
        ];
        }

        // 🎨 Filtre couleur
        if (couleur && couleur.trim() !== '') {
        const colorsArray = couleur.split(',').map(c => c.trim());
        query.couleur = { $in: colorsArray };
        }

        const skip = (Number(page) - 1) * Number(limit);

        const items = await Beer.find(query)
        .skip(skip)
        .limit(Number(limit))
        .lean();

        const total = await Beer.countDocuments(query);

        res.json({
        success: true,
        message: q ? 'Résultats de recherche' : 'Liste des bières récupérée',
        data: {
            items,
            pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPages: Math.ceil(total / Number(limit)) || 1,
            },
        },
        timestamp: new Date().toISOString(),
        });
    } catch (err) {
        console.error('Erreur dans getAll:', err);
        res.status(500).json({ success: false, message: err.message || 'Erreur serveur' });
    }
    }

    async getById(req, res) {
        try {
            const { id } = req.params;
            if (!isValidObjectId(id)) {
                return ApiResponse.badRequest(res, "L identifiant biere est invalide");
            }

            const beer = await beerRepository.findById(id);
            if (!beer) {
                return ApiResponse.notFound(res, 'Biere non trouvee');
            }

            return ApiResponse.success(res, 'Biere trouvee', beer);
        } catch (error) {
            return ApiResponse.error(res, 'Erreur lors de la recuperation de la biere', null, 500, error.message);
        }
    }

    async getStats(req, res) {
        try {
            const stats = await beerRepository.getStats();
            return ApiResponse.success(res, 'Statistiques des bieres', stats);
        } catch (error) {
            return ApiResponse.error(res, 'Erreur lors de la recuperation des statistiques', null, 500, error.message);
        }
    }

    async getColors(req, res) {
        try {
            const colors = await Beer.aggregate([
            { $group: { _id: '$couleur', count: { $sum: 1 } } },
            { $project: { _id: 0, couleur: '$_id', count: 1 } },
            { $sort: { count: -1 } },
            ]);

            res.json({
            success: true,
            message: 'Couleurs des bières récupérées',
            data: colors,
            });
        } catch (err) {
            console.error('Erreur getColors:', err);
            res.status(500).json({ success: false, message: err.message });
        }
    }
}

export default new BeerController();
