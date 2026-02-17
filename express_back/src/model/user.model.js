import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
        trim: true,
    },
    email : {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    age : {
        type: Number,
        required: true,
        min: 0,
    },
    createdAt : {
        type: Date,
        default: Date.now,
    }
});

const User = mongoose.model('User', userSchema);