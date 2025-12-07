const pool = require("../db/connection");

// Endpoint générique pour mettre à jour la position d'un fichier ou d'un keyword
// Body attendu : { type: "file" | "keyword", id, pos_x?, pos_y?, pos_z? }
exports.updatePosition = async (req, res) => {
    try {
        const { type, id, pos_x, pos_y, pos_z } = req.body;

        if (!type || !id) {
            return res.status(400).json({
                error: "type et id sont obligatoires"
            });
        }

        let table = null;
        if (type === "file") {
            table = "draft_files";
        } else if (type === "keyword") {
            table = "draft_keywords";
        } else {
            return res.status(400).json({
                error: "type doit être 'file' ou 'keyword'"
            });
        }

        await pool.query(
            `
            UPDATE ${table}
            SET
                pos_x = IFNULL(?, pos_x),
                pos_y = IFNULL(?, pos_y),
                pos_z = IFNULL(?, pos_z)
            WHERE id = ?
            `,
            [pos_x, pos_y, pos_z, id]
        );

        res.json({ success: true });

    } catch (err) {
        console.error("Error updating position:", err);
        res.status(500).json({ error: "Database error" });
    }
};
