import mongoose from 'mongoose';

export function isValidObjectId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}
