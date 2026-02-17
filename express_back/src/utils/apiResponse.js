class ApiResponse {
    static success(res, message, data = null, statusCode = 200) {
        // actions ...
        return res.status(statusCode).json({
            success: true,
            message,
            data,
            timestamp: new Date().toISOString(),
        });
    }

    static created(res, message, data = null) {
        return this.success(res, message, data, 201);
    }

    static error(res, message, data = null, statusCode = 500, error = null) {
        return res.status(statusCode).json({
            success: false,
            message,
            data,
            error,
            timestamp: new Date().toISOString(),
        });
    }

    static notFound(res, message = 'Resource not found', data = null) {
        return this.error(res, message, data, 404);
    }

    static badRequest(res, message = 'Bad request', data = null) {
        return this.error(res, message, data, 400);
    }

    static unauthorized(res, message = 'Unauthorized', data = null) {
        return this.error(res, message, data, 401);
    }
}

export default ApiResponse;