import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
        trim: true,
        maxlength: [50, 'Le nom ne peut pas dépasser 50 caractères'],
    },
    email : {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/\S+@\S+\.\S+/, 'Email invalide'],
    },
    age : {
        type: Number,
        required: true,
        min: [0, 'L\'âge doit être positif'],
    },
    createdAt : {
        type: Date,
        default: Date.now,
    }
});

const User = mongoose.model('User', userSchema);