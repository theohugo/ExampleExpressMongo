import User from '../model/user.model.js';

class UserRepository {
    async create(userData) {
        return User.create(userData);
    }

    async findAll() {
        return User.find().sort({ createdAt: -1 });
    }

    async findById(id) {
        return User.findById(id).select('-__v');
    }

    async updateById(id, updateData) {
        return User.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        }).select('-__v');
    }

    async deleteById(id) {
        return User.findByIdAndDelete(id);
    }

    async getStats() {
        const [total, actifs, byRole] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ actif: true }),
            User.aggregate([
                { $group: { _id: '$role', count: { $sum: 1 } } },
                { $project: { _id: 0, role: '$_id', count: 1 } },
            ]),
        ]);

        return { total, actifs, byRole };
    }
}

export default new UserRepository();
