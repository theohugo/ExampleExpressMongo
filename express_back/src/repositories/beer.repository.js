import Beer from '../model/beer.model.js';

class BeerRepository {
    async create(beerData) {
        return Beer.create(beerData);
    }

    async createMany(beerDataList) {
        return Beer.insertMany(beerDataList, { ordered: false });
    }

    async countAll() {
        return Beer.countDocuments();
    }

    async findById(id) {
        return Beer.findById(id).select('-__v').lean();
    }

    async findAll(filters = {}, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [items, total] = await Promise.all([
            Beer.find(filters).sort({ nom_article: 1 }).skip(skip).limit(limit).lean(),
            Beer.countDocuments(filters),
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

    async getStats() {
        const [total, avgPrice, byType, byColor] = await Promise.all([
            Beer.countDocuments(),
            Beer.aggregate([{ $group: { _id: null, avg: { $avg: '$prix_15' } } }]),
            Beer.aggregate([
                { $group: { _id: '$type', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $project: { _id: 0, type: '$_id', count: 1 } },
                { $limit: 10 },
            ]),
            Beer.aggregate([
                { $group: { _id: '$couleur', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $project: { _id: 0, couleur: '$_id', count: 1 } },
            ]),
        ]);

        return {
            total,
            averagePriceTtc: Number((avgPrice[0]?.avg || 0).toFixed(2)),
            byType,
            byColor,
        };
    }

    async updateById(id, updateData) {
        return Beer.findByIdAndUpdate(
            id,
            updateData,
            {
                new: true,
                runValidators: true,
            }
        ).select('-__v');
    }
}

export default new BeerRepository();
