import mongoose from 'mongoose';
import ApiResponse from '../utils/apiResponse.js';
import beerRepository from '../repositories/beer.repository.js';

function isValidObjectId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

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
            const page = Math.max(1, Number(req.query.page) || 1);
            const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
            const filters = buildBeerFilters(req.query);

            const result = await beerRepository.findAll(filters, page, limit);
            return ApiResponse.success(res, 'Liste des bieres recuperee', result);
        } catch (error) {
            return ApiResponse.error(res, 'Erreur lors de la recuperation des bieres', null, 500, error.message);
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
}

export default new BeerController();
