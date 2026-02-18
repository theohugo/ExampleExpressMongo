import ApiResponse from '../utils/apiResponse.js';

export function requestLogger(req, res, next) {
    console.log(`[HTTP] ${req.method} ${req.path} - ${new Date().toISOString()}`);
    next();
}

export function notFoundHandler(req, res) {
    ApiResponse.notFound(res, 'Route non trouvee');
}
