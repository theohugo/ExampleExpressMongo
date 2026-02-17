import mongoose from "mongoose";

async function connectDB(mongoURI) {
    try
    {  
        const connection = await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 5000, // timeout de connexion de 5 secondes
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB connecté : ${connection.connection.host}`);
    } catch (error) {
        console.error('Erreur de connexion à MongoDB :', error.message);
        process.exit(1); // quitter le processus avec une erreur
        // on peut mettre des choix different selon les cas d'erreur (ex: retry, fallback, etc.)
    }
}

// gestion des événements de connexion
mongoose.connection.on('connected', () => {
    console.log('MongoDB connecté avec succès');
});

mongoose.connection.on('error', (err) => {
    console.error('Erreur de connexion à MongoDB :', err.message);
});

mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB déconnecté');
});