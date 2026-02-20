import Cart from '../model/cart.model.js';

class CartRepository {
    async findByCartId(cartId, client = null) {
        const filters = { cartId };
        if (client) {
            filters.client = client;
        }
        return Cart.findOne(filters);
    }

    async upsertByCartId(cartId, data) {
        return Cart.findOneAndUpdate(
            { cartId },
            data,
            {
                returnDocument: 'after',
                upsert: true,
                runValidators: true,
                setDefaultsOnInsert: true,
            }
        );
    }

    async deleteByCartId(cartId) {
        return Cart.findOneAndDelete({ cartId });
    }
}

export default new CartRepository();
