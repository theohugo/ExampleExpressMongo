import Beer from '../model/beer.model.js';
import { isValidObjectId } from '../utils/mongo.util.js';

function toQuantity(value) {
    const quantity = Number(value);
    return Number.isInteger(quantity) && quantity > 0 ? quantity : null;
}

class OrderBuilderService {
    validateCustomer(customer) {
        return Boolean(customer && customer.name && customer.address);
    }

    async buildOrderLines(rawItems = []) {
        if (!Array.isArray(rawItems) || rawItems.length === 0) {
            const error = new Error('La commande doit contenir au moins un article');
            error.code = 'BAD_ITEMS';
            throw error;
        }

        const groupedItems = new Map();
        for (const item of rawItems) {
            const beerId = item?.beerId;
            const quantity = toQuantity(item?.quantity);

            if (!beerId || !isValidObjectId(beerId)) {
                const error = new Error('Chaque item doit contenir un beerId valide');
                error.code = 'BAD_BEER_ID';
                throw error;
            }
            if (!quantity) {
                const error = new Error('Chaque item doit contenir une quantite entiere > 0');
                error.code = 'BAD_QTY';
                throw error;
            }

            groupedItems.set(beerId, (groupedItems.get(beerId) || 0) + quantity);
        }

        const beerIds = [...groupedItems.keys()];
        const beers = await Beer.find({ _id: { $in: beerIds } });
        if (beers.length !== beerIds.length) {
            const error = new Error('Certaines bieres sont introuvables');
            error.code = 'MISSING_BEER';
            throw error;
        }

        const beerById = new Map(beers.map((beer) => [String(beer._id), beer]));
        const orderItems = [];
        let totalAmount = 0;

        for (const [beerId, quantity] of groupedItems.entries()) {
            const beer = beerById.get(beerId);
            const lineTotal = Number((beer.prix_15 * quantity).toFixed(2));
            totalAmount += lineTotal;

            orderItems.push({
                seller: beer.vendeur,
                beer: beer._id,
                beerName: beer.nom_article,
                unitPriceTtc: beer.prix_15,
                quantity,
                lineTotal,
            });
        }

        return {
            items: orderItems,
            totalAmount: Number(totalAmount.toFixed(2)),
        };
    }
}

export default new OrderBuilderService();
