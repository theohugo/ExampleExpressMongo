import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: [true, 'Le nom est requis'],
        trim: true,
        minlength: [2, 'Le nom doit contenir au moins 2 caracteres'],
        maxlength: [50, 'Le nom ne peut pas depasser 50 caracteres']
    },
    prenom: {
        type: String,
        required: [true, 'Le prenom est requis'],
        trim: true,
        minlength: [2, 'Le prenom doit contenir au moins 2 caracteres']
    },
    email: {
        type: String,
        required: [true, "L'email est requis"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Email invalide']
    },
    password: {
        type: String,
        required: [true, 'Le mot de passe est requis'],
        minlength: [6, 'Le mot de passe doit contenir au moins 6 caracteres']
    },
    telephone: {
        type: String,
        match: [/^[0-9]{10}$/, 'Le telephone doit contenir 10 chiffres']
    },
    actif: {
        type: Boolean,
        default: true
    },
    role: {
        type: String,
        enum: ['VENDEUR', 'CLIENT'],
        default: 'CLIENT',
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
});

userSchema.virtual('fullName').get(function() {
    return `${this.prenom} ${this.nom}`;
});

userSchema.set('toJSON', { virtuals: true });

userSchema.methods.toJSON = function () {
    const userObject = this.toObject();
    delete userObject.password;
    return userObject;
};

const User = mongoose.model('User', userSchema);
export default User;
