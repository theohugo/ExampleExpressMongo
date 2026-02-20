import Beer from '../model/beer.model.js';
import User from '../model/user.model.js';
import { isValidObjectId } from '../utils/mongo.util.js';

function toQuantity(value) {
    const quantity = Number(value);
    return Number.isInteger(quantity) && quantity > 0 ? quantity : null;
}

function isFiniteNumber(value) {
    return Number.isFinite(Number(value));
}

class OrderBuilderService {
    fallbackSellerId = null;

    validateCustomer(customer) {
        return Boolean(customer && customer.name && customer.address);
    }

    async resolveFallbackSellerId() {
        if (this.fallbackSellerId) return this.fallbackSellerId;

        let seller = await User.findOne({ role: 'VENDEUR' }).select('_id').lean();
        if (!seller?._id) {
            seller = await User.findOne({}).select('_id').lean();
        }
        this.fallbackSellerId = seller?._id ? String(seller._id) : null;
        return this.fallbackSellerId;
    }

    async resolveSellerId(beer) {
        if (beer?.vendeur) return String(beer.vendeur);
        return this.resolveFallbackSellerId();
    }

    resolveUnitPriceTtc(beer) {
        if (isFiniteNumber(beer?.prix_ttc)) return Number(beer.prix_ttc);
        if (isFiniteNumber(beer?.prix_15)) return Number(beer.prix_15);
        if (isFiniteNumber(beer?.prix_ht)) return Number((Number(beer.prix_ht) * 1.15).toFixed(2));
        return null;
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
            const sellerId = await this.resolveSellerId(beer);
            const unitPriceTtc = this.resolveUnitPriceTtc(beer);

            if (!sellerId) {
                const error = new Error(`Biere invalide: vendeur manquant (${beer.nom_article})`);
                error.code = 'BAD_BEER_SELLER';
                throw error;
            }
            if (!isFiniteNumber(unitPriceTtc)) {
                const error = new Error(`Biere invalide: prix TTC manquant (${beer.nom_article})`);
                error.code = 'BAD_BEER_PRICE';
                throw error;
            }

            const lineTotal = Number((unitPriceTtc * quantity).toFixed(2));
            totalAmount += lineTotal;

            orderItems.push({
                seller: sellerId,
                beer: beer._id,
                beerName: beer.nom_article,
                unitPriceTtc,
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
