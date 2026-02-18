import mongoose from 'mongoose';
import ApiResponse from '../utils/apiResponse.js';
import userRepository from '../repositories/user.repository.js';

function isValidObjectId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

class UserController {
    async getAll(req, res) {
        try {
            const users = await userRepository.findAll();
            return ApiResponse.success(res, 'Liste des utilisateurs recuperee', users);
        } catch (error) {
            return ApiResponse.error(res, 'Erreur lors de la recuperation des utilisateurs', null, 500, error.message);
        }
    }

    async getStats(req, res) {
        try {
            const stats = await userRepository.getStats();
            return ApiResponse.success(res, 'Statistiques des utilisateurs', stats);
        } catch (error) {
            return ApiResponse.error(res, 'Erreur lors de la recuperation des statistiques', null, 500, error.message);
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params;
            if (!isValidObjectId(id)) {
                return ApiResponse.badRequest(res, "L'identifiant utilisateur est invalide");
            }

            const user = await userRepository.findById(id);
            if (!user) {
                return ApiResponse.notFound(res, 'Utilisateur non trouve');
            }

            return ApiResponse.success(res, 'Utilisateur trouve', user);
        } catch (error) {
            return ApiResponse.error(res, "Erreur lors de la recuperation de l'utilisateur", null, 500, error.message);
        }
    }

    async create(req, res) {
        try {
            const createdUser = await userRepository.create(req.body);
            return ApiResponse.created(res, 'Utilisateur cree', createdUser);
        } catch (error) {
            if (error.name === 'ValidationError') {
                return ApiResponse.badRequest(res, error.message);
            }
            if (error.code === 11000) {
                return ApiResponse.badRequest(res, "L'email existe deja");
            }
            return ApiResponse.error(res, "Erreur lors de la creation de l'utilisateur", null, 500, error.message);
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            if (!isValidObjectId(id)) {
                return ApiResponse.badRequest(res, "L'identifiant utilisateur est invalide");
            }

            const updatedUser = await userRepository.updateById(id, req.body);
            if (!updatedUser) {
                return ApiResponse.notFound(res, 'Utilisateur non trouve');
            }

            return ApiResponse.success(res, 'Utilisateur mis a jour', updatedUser);
        } catch (error) {
            if (error.name === 'ValidationError') {
                return ApiResponse.badRequest(res, error.message);
            }
            if (error.code === 11000) {
                return ApiResponse.badRequest(res, "L'email existe deja");
            }
            return ApiResponse.error(res, "Erreur lors de la mise a jour de l'utilisateur", null, 500, error.message);
        }
    }

    async remove(req, res) {
        try {
            const { id } = req.params;
            if (!isValidObjectId(id)) {
                return ApiResponse.badRequest(res, "L'identifiant utilisateur est invalide");
            }

            const deletedUser = await userRepository.deleteById(id);
            if (!deletedUser) {
                return ApiResponse.notFound(res, 'Utilisateur non trouve');
            }

            return ApiResponse.success(res, 'Utilisateur supprime', deletedUser);
        } catch (error) {
            return ApiResponse.error(res, "Erreur lors de la suppression de l'utilisateur", null, 500, error.message);
        }
    }
}

export default new UserController();
