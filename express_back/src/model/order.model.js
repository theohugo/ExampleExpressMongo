import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
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
}, { _id: false });

const orderSchema = new mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    customer: {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        address: {
            type: String,
            trim: true,
            required: true,
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
orderSchema.index({ 'items.seller': 1, createdAt: -1 });

const Order = mongoose.model('Order', orderSchema);
export default Order;
