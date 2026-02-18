import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
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

const orderSchema = new mongoose.Schema(
    {
        customer: {
            name: {
                type: String,
                required: [true, 'Le nom client est requis'],
                trim: true,
            },
            email: {
                type: String,
                trim: true,
                lowercase: true,
                match: [/^\S+@\S+\.\S+$/, 'Email client invalide'],
                default: null,
            },
            phone: {
                type: String,
                trim: true,
                default: null,
            },
            address: {
                type: String,
                trim: true,
                required: [true, 'L adresse de livraison est requise'],
            },
        },
        items: {
            type: [orderItemSchema],
            validate: {
                validator: (value) => Array.isArray(value) && value.length > 0,
                message: 'Une commande doit contenir au moins un article',
            },
        },
        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        status: {
            type: String,
            enum: ['pending', 'paid', 'preparing', 'shipped', 'cancelled'],
            default: 'pending',
        },
        notes: {
            type: String,
            trim: true,
            default: null,
        },
    },
    {
        collection: 'orders',
        timestamps: true,
        versionKey: false,
    }
);

orderSchema.index({ createdAt: -1 });
orderSchema.index({ status: 1 });

const Order = mongoose.model('Order', orderSchema);
export default Order;
