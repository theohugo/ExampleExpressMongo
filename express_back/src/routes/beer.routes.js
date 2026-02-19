import express from 'express';
import beerController from '../controllers/beer.controller.js';
import { requireRole } from '../middlewares/role.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { validateCreateBeerPayload, validateUpdateBeerPayload } from '../validators/beer.validator.js';

const beerRouter = express.Router();

// GET /api/beers
beerRouter.get('/', beerController.getAll);

// GET /api/beers/stats
beerRouter.get('/stats', beerController.getStats);

// POST /api/beers
beerRouter.post('/', requireRole('VENDEUR'), validate(validateCreateBeerPayload), beerController.create);

// PUT /api/beers/:id
beerRouter.put('/:id', requireRole('VENDEUR'), validate(validateUpdateBeerPayload), beerController.update);

// GET /api/beers/:id
beerRouter.get('/:id', beerController.getById);

// GET /api/beers/color

export default beerRouter;
