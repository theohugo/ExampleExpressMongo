import ApiResponse from '../utils/apiResponse.js';
import cartRepository from '../repositories/cart.repository.js';
import orderRepository from '../repositories/order.repository.js';
import orderBuilderService from '../service/orderBuilder.service.js';
import { isValidObjectId } from '../utils/mongo.util.js';

function normalizeCartId(value) {
    return String(value || '').trim();
}

function resolveClientId(req) {
    return String(
        req.headers['x-user-id']
        || req.body?.userId
        || req.query?.userId
        || ''
    ).trim();
}

class CartController {
    async getCart(req, res) {
        try {
            const cartId = normalizeCartId(req.params.cartId);
            const clientId = resolveClientId(req);
            if (!cartId) {
                return ApiResponse.badRequest(res, 'cartId est requis');
            }
            if (!isValidObjectId(clientId)) {
                return ApiResponse.badRequest(res, 'userId client invalide');
            }

            const cart = await cartRepository.findByCartId(cartId, clientId);
            if (!cart) {
                return ApiResponse.success(res, 'Panier vide', { cartId, items: [], totalAmount: 0 });
            }

            return ApiResponse.success(res, 'Panier recupere', cart);
        } catch (error) {
            return ApiResponse.error(res, 'Erreur lors de la recuperation du panier', null, 500, error.message);
        }
    }

    async addItem(req, res) {
        try {
            const cartId = normalizeCartId(req.params.cartId);
            const clientId = resolveClientId(req);
            const { beerId, quantity } = req.body;
            if (!cartId) {
                return ApiResponse.badRequest(res, 'cartId est requis');
            }
            if (!isValidObjectId(clientId)) {
                return ApiResponse.badRequest(res, 'userId client invalide');
            }

            const cart = await cartRepository.findByCartId(cartId, clientId);
            const rawItems = (cart?.items || []).map((item) => ({
                beerId: String(item.beer),
                quantity: item.quantity,
            }));

            rawItems.push({ beerId, quantity });
            const { items, totalAmount } = await orderBuilderService.buildOrderLines(rawItems);

            const savedCart = await cartRepository.upsertByCartId(cartId, {
                client: clientId,
                items,
                totalAmount
            });
            return ApiResponse.success(res, 'Article ajoute au panier', savedCart);
        } catch (error) {
            if (error.name === 'ValidationError') {
                return ApiResponse.badRequest(res, error.message);
            }
            if ((error.code && error.code.startsWith('BAD_')) || error.code === 'MISSING_BEER') {
                return ApiResponse.badRequest(res, error.message);
            }
            return ApiResponse.error(res, 'Erreur lors de la mise a jour du panier', null, 500, error.message);
        }
    }

    async setItemQuantity(req, res) {
        try {
            const cartId = normalizeCartId(req.params.cartId);
            const clientId = resolveClientId(req);
            const beerId = String(req.params.beerId || '').trim();
            const quantity = Number(req.body?.quantity);
            if (!cartId) {
                return ApiResponse.badRequest(res, 'cartId est requis');
            }
            if (!isValidObjectId(clientId)) {
                return ApiResponse.badRequest(res, 'userId client invalide');
            }
            if (!beerId) {
                return ApiResponse.badRequest(res, 'beerId est requis');
            }

            const cart = await cartRepository.findByCartId(cartId, clientId);
            if (!cart) {
                return ApiResponse.notFound(res, 'Panier non trouve');
            }

            const rawItems = (cart.items || [])
                .map((item) => ({
                    beerId: String(item.beer),
                    quantity: item.quantity,
                }))
                .filter((item) => item.beerId !== beerId);

            if (!Number.isInteger(quantity) || quantity < 0) {
                return ApiResponse.badRequest(res, 'quantity doit etre un entier >= 0');
            }
            if (quantity > 0) {
                rawItems.push({ beerId, quantity });
            }

            if (rawItems.length === 0) {
                const clearedCart = await cartRepository.upsertByCartId(cartId, { client: clientId, items: [], totalAmount: 0 });
                return ApiResponse.success(res, 'Panier mis a jour', clearedCart);
            }

            const { items, totalAmount } = await orderBuilderService.buildOrderLines(rawItems);
            const savedCart = await cartRepository.upsertByCartId(cartId, { client: clientId, items, totalAmount });
            return ApiResponse.success(res, 'Panier mis a jour', savedCart);
        } catch (error) {
            if ((error.code && error.code.startsWith('BAD_')) || error.code === 'MISSING_BEER') {
                return ApiResponse.badRequest(res, error.message);
            }
            return ApiResponse.error(res, 'Erreur lors de la mise a jour du panier', null, 500, error.message);
        }
    }

    async removeItem(req, res) {
        try {
            const cartId = normalizeCartId(req.params.cartId);
            const clientId = resolveClientId(req);
            const beerId = String(req.params.beerId || '').trim();
            if (!cartId) {
                return ApiResponse.badRequest(res, 'cartId est requis');
            }
            if (!isValidObjectId(clientId)) {
                return ApiResponse.badRequest(res, 'userId client invalide');
            }
            if (!beerId) {
                return ApiResponse.badRequest(res, 'beerId est requis');
            }

            const cart = await cartRepository.findByCartId(cartId, clientId);
            if (!cart) {
                return ApiResponse.notFound(res, 'Panier non trouve');
            }

            const rawItems = (cart.items || [])
                .map((item) => ({
                    beerId: String(item.beer),
                    quantity: item.quantity,
                }))
                .filter((item) => item.beerId !== beerId);

            if (rawItems.length === 0) {
                const clearedCart = await cartRepository.upsertByCartId(cartId, { client: clientId, items: [], totalAmount: 0 });
                return ApiResponse.success(res, 'Article supprime du panier', clearedCart);
            }

            const { items, totalAmount } = await orderBuilderService.buildOrderLines(rawItems);
            const savedCart = await cartRepository.upsertByCartId(cartId, { client: clientId, items, totalAmount });
            return ApiResponse.success(res, 'Article supprime du panier', savedCart);
        } catch (error) {
            return ApiResponse.error(res, 'Erreur lors de la suppression de l article', null, 500, error.message);
        }
    }

    async clear(req, res) {
        try {
            const cartId = normalizeCartId(req.params.cartId);
            const clientId = resolveClientId(req);
            if (!cartId) {
                return ApiResponse.badRequest(res, 'cartId est requis');
            }
            if (!isValidObjectId(clientId)) {
                return ApiResponse.badRequest(res, 'userId client invalide');
            }

            const cart = await cartRepository.upsertByCartId(cartId, { client: clientId, items: [], totalAmount: 0 });
            return ApiResponse.success(res, 'Panier vide', cart);
        } catch (error) {
            return ApiResponse.error(res, 'Erreur lors du vidage du panier', null, 500, error.message);
        }
    }

    async checkout(req, res) {
        try {
            const cartId = normalizeCartId(req.params.cartId);
            const clientId = resolveClientId(req);
            const { customer, notes } = req.body;

            if (!cartId) {
                return ApiResponse.badRequest(res, 'cartId est requis');
            }
            if (!isValidObjectId(clientId)) {
                return ApiResponse.badRequest(res, 'userId client invalide');
            }
            if (!orderBuilderService.validateCustomer(customer)) {
                return ApiResponse.badRequest(res, 'Le client doit contenir name et address');
            }

            const cart = await cartRepository.findByCartId(cartId, clientId);
            if (!cart || !cart.items || cart.items.length === 0) {
                return ApiResponse.badRequest(res, 'Le panier est vide');
            }

            const createdOrder = await orderRepository.create({
                client: clientId,
                customer,
                items: cart.items,
                totalAmount: cart.totalAmount,
                notes: notes || null,
            });

            await cartRepository.upsertByCartId(cartId, { client: clientId, items: [], totalAmount: 0 });

            return ApiResponse.created(res, 'Commande creee depuis le panier', createdOrder);
        } catch (error) {
            if (error.name === 'ValidationError') {
                return ApiResponse.badRequest(res, error.message);
            }
            return ApiResponse.error(res, 'Erreur lors du checkout', null, 500, error.message);
        }
    }
}

export default new CartController();
