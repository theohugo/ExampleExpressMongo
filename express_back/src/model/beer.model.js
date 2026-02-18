import mongoose from 'mongoose';

const beerSchema = new mongoose.Schema(
{
    couleur: {
        type: String,
        trim: true,
        default: 'Inconnue',
    },
    nom_article: {
        type: String,
        required: [true, 'Le nom de la biere est requis'],
        trim: true,
    },
    nom_marque: {
        type: String,
        required: [true, 'La marque est requise'],
        trim: true,
    },
    prix_ht: {
        type: Number,
        required: [true, 'Le prix HT est requis'],
        min: [0, 'Le prix HT doit etre positif'],
    },
    prix_ttc: {
        type: Number,
        required: [true, 'Le prix TTC est requis'],
        min: [0, 'Le prix TTC doit etre positif'],
    },
    titrage: {
        type: Number,
        required: [true, 'Le titrage est requis'],
        min: [0, 'Le titrage doit etre positif'],
    },
    type: {
        type: String,
        trim: true,
        default: 'Non classe',
    },
    volume: {
        type: Number,
        required: [true, 'Le volume est requis'],
        min: [1, 'Le volume doit etre superieur a 0'],
    },
    stock: {
        type: Number,
        default: 100,
        min: [0, 'Le stock doit etre positif'],
    },
    vendeur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},
{
    collection: 'beer',
    timestamps: true,
    versionKey: false,
}
);

beerSchema.index({ nom_article: 'text', nom_marque: 'text', type: 'text' });

const Beer = mongoose.model('Beer', beerSchema);
export default Beer;
