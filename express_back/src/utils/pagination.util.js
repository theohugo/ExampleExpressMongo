export function parsePagination(query, options = {}) {
    const defaultPage = options.defaultPage || 1;
    const defaultLimit = options.defaultLimit || 20;
    const maxLimit = options.maxLimit || 100;

    return {
        page: Math.max(1, Number(query.page) || defaultPage),
        limit: Math.min(maxLimit, Math.max(1, Number(query.limit) || defaultLimit)),
    };
}
