import mongoose from 'mongoose';
import ApiResponse from '../utils/apiResponse.js';
import userRepository from '../repositories/user.repository.js';

function resolveUserId(req) {
    return String(
        req.headers['x-user-id']
        || req.body?.userId
        || req.query?.userId
        || ''
    ).trim();
}

export async function loadCurrentUser(req, res, next) {
    try {
        const userId = resolveUserId(req);
        if (!userId) {
            return ApiResponse.unauthorized(res, 'Utilisateur requis (x-user-id)');
        }
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return ApiResponse.badRequest(res, "L'identifiant utilisateur est invalide");
        }

        const user = await userRepository.findById(userId);
        if (!user) {
            return ApiResponse.unauthorized(res, 'Utilisateur non trouve');
        }

        req.currentUser = user;
        return next();
    } catch (error) {
        return ApiResponse.error(res, "Erreur lors de l'authentification", null, 500, error.message);
    }
}

export function requireRole(role) {
    return async (req, res, next) => {
        return loadCurrentUser(req, res, () => {
            if (req.currentUser.role !== role) {
                return ApiResponse.unauthorized(res, `Acces reserve au role ${role}`);
            }
            return next();
        });
    };
}
