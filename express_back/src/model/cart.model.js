import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema(
    {
        beer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Beer',
            required: true,
        },
        beerName: {
            type: String,
            required: true,
        },
        unitPriceTtc: {
            type: Number,
            required: true,
            min: 0,
        },
        quantity: {
            type: Number,
            required: true,
            min: [1, 'La quantite doit etre superieure a 0'],
        },
        lineTotal: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    { _id: false }
);

const cartSchema = new mongoose.Schema(
    {
        cartId: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        items: {
            type: [cartItemSchema],
            default: [],
        },
        totalAmount: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    {
        collection: 'carts',
        timestamps: true,
        versionKey: false,
    }
);

cartSchema.index({ updatedAt: -1 });

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
