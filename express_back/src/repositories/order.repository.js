import Order from '../model/order.model.js';

class OrderRepository {
    async create(orderData) {
        return Order.create(orderData);
    }

    async findAll(filters = {}, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [items, total] = await Promise.all([
            Order.find(filters).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
            Order.countDocuments(filters),
        ]);

        return {
            items,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findAllBySeller(sellerId, filters = {}, page = 1, limit = 20) {
        const mergedFilters = {
            ...filters,
            'items.seller': sellerId,
        };
        return this.findAll(mergedFilters, page, limit);
    }

    async findAllByClient(clientId, filters = {}, page = 1, limit = 20) {
        const mergedFilters = {
            ...filters,
            client: clientId,
        };
        return this.findAll(mergedFilters, page, limit);
    }

    async findById(id) {
        return Order.findById(id).lean();
    }

    async updateStatusById(id, status) {
        return Order.findByIdAndUpdate(
            id,
            { status },
            {
                new: true,
                runValidators: true,
            }
        );
    }

    async getStats() {
        const [total, totalRevenue, byStatus] = await Promise.all([
            Order.countDocuments(),
            Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
            Order.aggregate([
                { $group: { _id: '$status', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $project: { _id: 0, status: '$_id', count: 1 } },
            ]),
        ]);

        return {
            total,
            totalRevenue: Number((totalRevenue[0]?.total || 0).toFixed(2)),
            byStatus,
        };
    }
}

export default new OrderRepository();
