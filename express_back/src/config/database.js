import mongoose from 'mongoose';

async function connectDB(mongoURI, options = {}) {
    const connection = await mongoose.connect(mongoURI, {
        serverSelectionTimeoutMS: 5000,
        ...options,
    });

    console.log(`[DB] Connecte a MongoDB (${connection.connection.host}:${connection.connection.port})`);
    return connection;
}

// Gestion des evenements de connexion
mongoose.connection.on('connected', () => {
    console.log('[DB] Etat: connected');
});

mongoose.connection.on('error', (err) => {
    console.error(`[DB] Etat: error - ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
    console.warn('[DB] Etat: disconnected');
});

export default connectDB;
