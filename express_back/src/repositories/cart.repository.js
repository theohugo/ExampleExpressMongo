import Cart from '../model/cart.model.js';

class CartRepository {
    async findByCartId(cartId) {
        return Cart.findOne({ cartId });
    }

    async upsertByCartId(cartId, data) {
        return Cart.findOneAndUpdate(
            { cartId },
            data,
            {
                new: true,
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
