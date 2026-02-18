import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import ApiResponse from './src/utils/apiResponse.js';
import user_router from './src/routes/user.routes.js';
import beerRouter from './src/routes/beer.routes.js';
import orderRouter from './src/routes/order.routes.js';
import cartRouter from './src/routes/cart.routes.js';
import connectDB from './src/config/database.js';
import beerSeedService from './src/service/beerSeed.service.js';
import { requestLogger, notFoundHandler } from './src/middlewares/app.middleware.js';
import { errorHandler } from './src/middlewares/error.middleware.js';

dotenv.config();

const EXPRESS_HOST = process.env.EXPRESS_HOST || 'localhost';
const PORT = Number(process.env.PORT) || 5000;
const MONGO_URI = process.env.MONGO_URI;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME || 'demoDatabase';
const AUTO_SEED_BEERS = process.env.AUTO_SEED_BEERS !== 'false';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);

app.get('/', (req, res) => {
    const apiBaseUrl = `http://${EXPRESS_HOST}:${PORT}`;

    ApiResponse.success(
        res,
        'Serveur Express en fonctionnement !',
        {
            version: '1.0.0',
            endpoints: {
                users: `${apiBaseUrl}/api/users`,
                stats: `${apiBaseUrl}/api/users/stats`,
                beers: `${apiBaseUrl}/api/beers`,
                beerStats: `${apiBaseUrl}/api/beers/stats`,
                orders: `${apiBaseUrl}/api/orders`,
                orderStats: `${apiBaseUrl}/api/orders/stats`,
                carts: `${apiBaseUrl}/api/carts/{cartId}`,
                mongoExpress: `http://${EXPRESS_HOST}:8081`,
            },
        }
    );
});

app.use('/api/users', user_router);
app.use('/api/beers', beerRouter);
app.use('/api/orders', orderRouter);
app.use('/api/carts', cartRouter);

app.use(notFoundHandler);
app.use(errorHandler);

async function bootstrap() {
    try {
        console.log('[BOOT] Demarrage de Express Back...');
        console.log(`[BOOT] ENV=${process.env.NODE_ENV || 'development'} PORT=${PORT}`);

        if (!MONGO_URI) {
            throw new Error('MONGO_URI est manquante');
        }

        console.log('[BOOT] Connexion a MongoDB en cours...');
        await connectDB(MONGO_URI, { dbName: MONGO_DB_NAME });
        console.log('[BOOT] Connexion MongoDB OK');

        if (AUTO_SEED_BEERS) {
            await beerSeedService.seedIfEmpty();
        }

        app.listen(PORT, () => {
            console.log(`[BOOT] Serveur Express demarre sur http://${EXPRESS_HOST}:${PORT}`);
            console.log(`[BOOT] Mongo Express: http://${EXPRESS_HOST}:8081`);
        });
    } catch (error) {
        console.error(`[BOOT] Echec au demarrage: ${error.message}`);
        process.exit(1);
    }
}

bootstrap();

process.on('SIGINT', () => {
    console.log('[BOOT] Arret du serveur (SIGINT)...');
    process.exit(0);
});
