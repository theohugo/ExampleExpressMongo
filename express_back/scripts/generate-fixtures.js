import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../src/config/database.js';
import User from '../src/model/user.model.js';
import Beer from '../src/model/beer.model.js';
import Order from '../src/model/order.model.js';
import Cart from '../src/model/cart.model.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME || 'demoDatabase';
const shouldReset = process.argv.includes('--reset');

function buildLine(beer, quantity) {
    const unitPriceTtc = Number(beer.prix_ttc);
    const lineTotal = Number((unitPriceTtc * quantity).toFixed(2));

    return {
        seller: beer.vendeur,
        beer: beer._id,
        beerName: beer.nom_article,
        unitPriceTtc,
        quantity,
        lineTotal,
    };
}

function sumTotal(items) {
    return Number(items.reduce((acc, item) => acc + item.lineTotal, 0).toFixed(2));
}

async function upsertFixtureUsers() {
    const seller = await User.findOneAndUpdate(
        { email: 'fixture.vendeur@mongoapi.local' },
        {
            nom: 'Vendeur',
            prenom: 'Fixture',
            email: 'fixture.vendeur@mongoapi.local',
            password: 'fixture123',
            age: 30,
            telephone: '0612345678',
            actif: true,
            role: 'VENDEUR',
            adresse: {
                rue: '1 Rue des Brasseurs',
                ville: 'Lille',
                codePostal: '59000',
                pays: 'France',
            },
        },
        { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    const client = await User.findOneAndUpdate(
        { email: 'fixture.client@mongoapi.local' },
        {
            nom: 'Client',
            prenom: 'Fixture',
            email: 'fixture.client@mongoapi.local',
            password: 'fixture123',
            age: 28,
            telephone: '0698765432',
            actif: true,
            role: 'CLIENT',
            adresse: {
                rue: '10 Avenue des Tests',
                ville: 'Paris',
                codePostal: '75010',
                pays: 'France',
            },
        },
        { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    return { seller, client };
}

async function recreateFixtureBeers(sellerId) {
    await Beer.deleteMany({ nom_marque: 'Fixture Brew Co' });

    const beers = await Beer.insertMany([
        {
            couleur: 'Blonde',
            nom_article: 'Fixture Lager',
            nom_marque: 'Fixture Brew Co',
            prix_ht: 2.1,
            prix_ttc: 2.52,
            titrage: 5,
            type: 'Lager',
            volume: 33,
            stock: 250,
            vendeur: sellerId,
        },
        {
            couleur: 'Ambrée',
            nom_article: 'Fixture Amber',
            nom_marque: 'Fixture Brew Co',
            prix_ht: 2.6,
            prix_ttc: 3.12,
            titrage: 6,
            type: 'Ale',
            volume: 33,
            stock: 180,
            vendeur: sellerId,
        },
        {
            couleur: 'Brune',
            nom_article: 'Fixture Stout',
            nom_marque: 'Fixture Brew Co',
            prix_ht: 3.2,
            prix_ttc: 3.84,
            titrage: 7.5,
            type: 'Stout',
            volume: 50,
            stock: 120,
            vendeur: sellerId,
        },
        {
            couleur: 'Blanche',
            nom_article: 'Fixture Wheat',
            nom_marque: 'Fixture Brew Co',
            prix_ht: 2.4,
            prix_ttc: 2.88,
            titrage: 4.8,
            type: 'Wheat',
            volume: 33,
            stock: 200,
            vendeur: sellerId,
        },
    ]);

    return beers;
}

async function recreateFixtureOrders(client, beers) {
    await Order.deleteMany({
        $or: [
            { notes: { $regex: '^\\[fixture\\]' } },
            { client: client._id },
        ],
    });

    const order1Items = [buildLine(beers[0], 2), buildLine(beers[2], 1)];
    const order2Items = [buildLine(beers[1], 3)];
    const order3Items = [buildLine(beers[3], 4), buildLine(beers[0], 1)];

    const orders = await Order.insertMany([
        {
            client: client._id,
            customer: {
                name: `${client.prenom} ${client.nom}`,
                email: client.email,
                phone: client.telephone,
                address: '10 Avenue des Tests, 75010 Paris',
            },
            items: order1Items,
            totalAmount: sumTotal(order1Items),
            status: 'paid',
            notes: '[fixture] Premiere commande',
        },
        {
            client: client._id,
            customer: {
                name: `${client.prenom} ${client.nom}`,
                email: client.email,
                phone: client.telephone,
                address: '10 Avenue des Tests, 75010 Paris',
            },
            items: order2Items,
            totalAmount: sumTotal(order2Items),
            status: 'preparing',
            notes: '[fixture] Commande en preparation',
        },
        {
            client: client._id,
            customer: {
                name: `${client.prenom} ${client.nom}`,
                email: client.email,
                phone: client.telephone,
                address: '10 Avenue des Tests, 75010 Paris',
            },
            items: order3Items,
            totalAmount: sumTotal(order3Items),
            status: 'shipped',
            notes: '[fixture] Commande expediee',
        },
    ]);

    return orders;
}

async function recreateFixtureCart(client, beers) {
    await Cart.deleteMany({ cartId: { $regex: '^fixture-' } });

    const items = [buildLine(beers[0], 1), buildLine(beers[1], 2)];
    const cart = await Cart.create({
        cartId: 'fixture-cart-client-1',
        client: client._id,
        items,
        totalAmount: sumTotal(items),
    });

    return cart;
}

async function run() {
    if (!MONGO_URI) {
        throw new Error('MONGO_URI est manquante');
    }

    await connectDB(MONGO_URI, { dbName: MONGO_DB_NAME });

    if (shouldReset) {
        console.log('[FIXTURES] --reset active: nettoyage complet des collections');
        await Promise.all([
            Order.deleteMany({}),
            Cart.deleteMany({}),
            Beer.deleteMany({}),
            User.deleteMany({ email: { $regex: '^fixture\\.' } }),
        ]);
    }

    const { seller, client } = await upsertFixtureUsers();
    const beers = await recreateFixtureBeers(seller._id);
    const orders = await recreateFixtureOrders(client, beers);
    const cart = await recreateFixtureCart(client, beers);

    console.log('[FIXTURES] Generation terminee');
    console.log(`[FIXTURES] seller=${seller.email}`);
    console.log(`[FIXTURES] client=${client.email}`);
    console.log(`[FIXTURES] beers=${beers.length}`);
    console.log(`[FIXTURES] orders=${orders.length}`);
    console.log(`[FIXTURES] cartId=${cart.cartId}`);
}

run()
    .catch((error) => {
        console.error(`[FIXTURES] Erreur: ${error.message}`);
        process.exitCode = 1;
    })
    .finally(async () => {
        try {
            await mongoose.connection.close();
        } catch (error) {
            // no-op
        }
    });
