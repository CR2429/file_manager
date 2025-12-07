const pool = require("../db/connection");
const { v4: uuidv4 } = require("uuid");

// Vérifie s'il existe déjà un chemin de startId vers targetId
async function hasPath(startId, targetId) {
    const visited = new Set();
    const queue = [startId];

    while (queue.length > 0) {
        const current = queue.shift();
        if (current === targetId) {
            return true;
        }
        if (visited.has(current)) {
            continue;
        }
        visited.add(current);

        const [rows] = await pool.query(
            "SELECT to_id FROM draft_links WHERE from_id = ?",
            [current]
        );

        for (const row of rows) {
            if (!visited.has(row.to_id)) {
                queue.push(row.to_id);
            }
        }
    }

    return false;
}

/* CREATE */
exports.createDraftLink = async (req, res) => {
    try {
        const id = uuidv4();
        const { from_id, to_id, type } = req.body;

        if (!from_id || !to_id || !type) {
            return res.status(400).json({
                error: "from_id, to_id et type sont obligatoires"
            });
        }

        if (from_id === to_id) {
            return res.status(400).json({
                error: "from_id et to_id ne peuvent pas être identiques"
            });
        }

        if (!["origin", "relation"].includes(type)) {
            return res.status(400).json({
                error: "type doit être 'origin' ou 'relation'"
            });
        }

        // Vérifier que les deux keywords existent
        const [[fromRows], [toRows]] = await Promise.all([
            pool.query("SELECT id FROM draft_keywords WHERE id = ?", [from_id]),
            pool.query("SELECT id FROM draft_keywords WHERE id = ?", [to_id])
        ]);

        if (fromRows.length === 0 || toRows.length === 0) {
            return res.status(400).json({
                error: "from_id ou to_id ne correspond à aucun keyword"
            });
        }

        // Vérifier doublon exact
        const [dupRows] = await pool.query(
            `
            SELECT COUNT(*) AS count
            FROM draft_links
            WHERE from_id = ? AND to_id = ? AND type = ?
            `,
            [from_id, to_id, type]
        );

        if (dupRows[0].count > 0) {
            return res.status(409).json({
                error: "Un lien identique existe déjà"
            });
        }

        // Vérifier qu'on ne crée pas de cycle dans le graphe
        const willCreateCycle = await hasPath(to_id, from_id);
        if (willCreateCycle) {
            return res.status(400).json({
                error: "Ce lien créerait une boucle dans le graphe de keywords"
            });
        }

        await pool.query(
            `
            INSERT INTO draft_links (id, from_id, to_id, type)
            VALUES (?, ?, ?, ?)
            `,
            [id, from_id, to_id, type]
        );

        res.json({ success: true, id });

    } catch (err) {
        console.error("Error creating draft link:", err);
        res.status(500).json({ error: "Database error" });
    }
};

/* GET */
exports.getDraftLinks = async (req, res) => {
    try {
        const { keywordId } = req.query;

        let rows;

        if (keywordId) {
            [rows] = await pool.query(
                `
                SELECT * FROM draft_links
                WHERE from_id = ? OR to_id = ?
                `,
                [keywordId, keywordId]
            );
        } else {
            [rows] = await pool.query("SELECT * FROM draft_links");
        }

        res.json(rows);

    } catch (err) {
        console.error("Error fetching draft links:", err);
        res.status(500).json({ error: "Database error" });
    }
};

/* DELETE */
exports.deleteDraftLink = async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query(
            "DELETE FROM draft_links WHERE id = ?",
            [id]
        );

        res.json({ success: true });

    } catch (err) {
        console.error("Error deleting draft link:", err);
        res.status(500).json({ error: "Database error" });
    }
};
