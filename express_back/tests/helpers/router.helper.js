import assert from 'node:assert/strict';

export function getRouteLayers(router) {
    return router.stack.filter((layer) => layer.route);
}

export function findRoute(router, method, path) {
    const upperMethod = method.toLowerCase();
    return getRouteLayers(router).find(
        (layer) => layer.route?.path === path && Boolean(layer.route?.methods?.[upperMethod])
    );
}

export function assertRoute(router, method, path, handlersCount = null) {
    const layer = findRoute(router, method, path);
    assert.ok(layer, `Route ${method.toUpperCase()} ${path} introuvable`);
    if (handlersCount !== null) {
        assert.equal(
            layer.route.stack.length,
            handlersCount,
            `Route ${method.toUpperCase()} ${path} devrait avoir ${handlersCount} handlers`
        );
    }
}
