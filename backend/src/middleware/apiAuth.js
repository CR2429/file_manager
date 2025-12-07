// Middleware d'authentification simple par token d'API

function apiAuth(req, res, next) {
    const expected = process.env.API_TOKEN;

    // Si aucun token n'est défini dans .env, on ne bloque pas (mode dev)
    if (!expected) {
        return next();
    }

    // On accepte soit le header x-api-token, soit un Bearer dans Authorization
    const header = req.headers["x-api-token"] || req.headers["authorization"];

    if (!header) {
        return res.status(401).json({ error: "Missing API token" });
    }

    let token = header;

    if (token.startsWith("Bearer ")) {
        token = token.slice(7).trim();
    }

    if (token !== expected) {
        return res.status(403).json({ error: "Invalid API token" });
    }

    next();
}

module.exports = apiAuth;
