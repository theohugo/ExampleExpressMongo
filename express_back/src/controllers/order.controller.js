import ApiResponse from '../utils/apiResponse.js';
import orderRepository from '../repositories/order.repository.js';
import orderBuilderService from '../service/orderBuilder.service.js';
import { isValidObjectId } from '../utils/mongo.util.js';
import { parsePagination } from '../utils/pagination.util.js';

function buildOrderFilters(query) {
    const filters = {};
    if (query.status) {
        filters.status = query.status;
    }
    return filters;
}

class OrderController {
    async create(req, res) {
        try {
            const { customer, items, notes } = req.body;

            if (!orderBuilderService.validateCustomer(customer)) {
                return ApiResponse.badRequest(res, 'Le client doit contenir name et address');
            }
            const { items: orderItems, totalAmount } = await orderBuilderService.buildOrderLines(items);

            const createdOrder = await orderRepository.create({
                customer,
                items: orderItems,
                totalAmount,
                notes: notes || null,
            });

            return ApiResponse.created(res, 'Commande creee', createdOrder);
        } catch (error) {
            if (error.name === 'ValidationError') {
                return ApiResponse.badRequest(res, error.message);
            }
            if ((error.code && error.code.startsWith('BAD_')) || error.code === 'MISSING_BEER') {
                return ApiResponse.badRequest(res, error.message);
            }
            return ApiResponse.error(res, 'Erreur lors de la creation de la commande', null, 500, error.message);
        }
    }

    async getAll(req, res) {
        try {
            const { page, limit } = parsePagination(req.query);
            const filters = buildOrderFilters(req.query);

            const result = await orderRepository.findAll(filters, page, limit);
            return ApiResponse.success(res, 'Liste des commandes recuperee', result);
        } catch (error) {
            return ApiResponse.error(res, 'Erreur lors de la recuperation des commandes', null, 500, error.message);
        }
    }

    async getSellerOrders(req, res) {
        try {
            const { page, limit } = parsePagination(req.query);
            const filters = buildOrderFilters(req.query);

            const result = await orderRepository.findAllBySeller(req.currentUser._id, filters, page, limit);
            return ApiResponse.success(res, 'Liste des commandes vendeur recuperee', result);
        } catch (error) {
            return ApiResponse.error(res, 'Erreur lors de la recuperation des commandes vendeur', null, 500, error.message);
        }
    }

    async getClientOrders(req, res) {
        try {
            const { page, limit } = parsePagination(req.query);
            const filters = buildOrderFilters(req.query);

            const result = await orderRepository.findAllByClient(req.currentUser._id, filters, page, limit);
            return ApiResponse.success(res, 'Liste des commandes client recuperee', result);
        } catch (error) {
            return ApiResponse.error(res, 'Erreur lors de la recuperation des commandes client', null, 500, error.message);
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params;
            if (!isValidObjectId(id)) {
                return ApiResponse.badRequest(res, "L identifiant commande est invalide");
            }

            const order = await orderRepository.findById(id);
            if (!order) {
                return ApiResponse.notFound(res, 'Commande non trouvee');
            }

            return ApiResponse.success(res, 'Commande trouvee', order);
        } catch (error) {
            return ApiResponse.error(res, 'Erreur lors de la recuperation de la commande', null, 500, error.message);
        }
    }

    async updateStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            if (!isValidObjectId(id)) {
                return ApiResponse.badRequest(res, "L identifiant commande est invalide");
            }
            if (!status) {
                return ApiResponse.badRequest(res, 'Le status est requis');
            }

            const updatedOrder = await orderRepository.updateStatusById(id, status);
            if (!updatedOrder) {
                return ApiResponse.notFound(res, 'Commande non trouvee');
            }

            return ApiResponse.success(res, 'Status de commande mis a jour', updatedOrder);
        } catch (error) {
            if (error.name === 'ValidationError') {
                return ApiResponse.badRequest(res, error.message);
            }
            return ApiResponse.error(res, 'Erreur lors de la mise a jour du status', null, 500, error.message);
        }
    }

    async getStats(req, res) {
        try {
            const stats = await orderRepository.getStats();
            return ApiResponse.success(res, 'Statistiques des commandes', stats);
        } catch (error) {
            return ApiResponse.error(res, 'Erreur lors de la recuperation des statistiques', null, 500, error.message);
        }
    }
}

export default new OrderController();
