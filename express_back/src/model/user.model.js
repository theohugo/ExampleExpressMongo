// importer mes librairies
import mongoose from 'mongoose';

// modeliser avec un schemas
const userSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: [true, 'Le nom est requis'],
        trim: true,
        minlength: [2, 'Le nom doit contenir au moins 2 caractères'],
        maxlength: [50, 'Le nom ne peut pas dépasser 50 caractères']
    },
    prenom: {
        type: String,
        required: [true, 'Le prénom est requis'],
        trim: true,
        minlength: [2, 'Le prénom doit contenir au moins 2 caractères']
    },
    email: {
        type: String,
        required: [true, 'L\'email est requis'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Email invalide']
    },
    age: {
        type: Number,
        min: [18, 'L\'âge doit être superieur à 18 ans'],
        max: [150, 'L\'âge doit être réaliste']
    },
    telephone: {
        type: String,
        match: [/^[0-9]{10}$/, 'Le téléphone doit contenir 10 chiffres']
    },
    adresse: {
        rue: String,
        ville: String,
        codePostal: String,
        pays: {
        type: String,
        default: 'France'
        }
    },
    actif: {
        type: Boolean,
        default: true
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'moderator'],
        default: 'user'
    }
}, {
    timestamps: true,
    versionKey: false
});

userSchema.virtual('fullName').get(function() {
    return `${this.prenom} ${this.nom}`;
});

userSchema.set('toJSON', { virtuals: true });

// creer le model
const User = mongoose.model('User', userSchema);
export default User;