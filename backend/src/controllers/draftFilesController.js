const pool = require("../db/connection");
const { v4: uuidv4 } = require("uuid");

// CREATE
exports.createDraftFile = async (req, res) => {
    try {
        const id = uuidv4();
        const {
            title = "Nouveau fichier",
            content = "",
            x = 0,
            y = 0,
            z = 0
        } = req.body;

        await pool.query(
            `INSERT INTO draft_files (id, title, content, pos_x, pos_y, pos_z)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [id, title, content, x, y, z]
        );

        res.json({ success: true, id });
    } catch (err) {
        console.error("Error creating draft file:", err);
        res.status(500).json({ error: "Database error" });
    }
};


// READ
exports.getDraftFiles = async (req, res) => {
    try {
        const [rows] = await pool.query(`SELECT * FROM draft_files`);
        res.json(rows);
    } catch (err) {
        console.error("Error fetching draft files:", err);
        res.status(500).json({ error: "Database error" });
    }
};

// UPDATE (autosave)
exports.updateDraftFile = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, pos_x, pos_y, pos_z } = req.body;

        await pool.query(
            `
            UPDATE draft_files
            SET 
                title = IFNULL(?, title),
                content = IFNULL(?, content),
                pos_x = IFNULL(?, pos_x),
                pos_y = IFNULL(?, pos_y),
                pos_z = IFNULL(?, pos_z)
            WHERE id = ?
            `,
            [title, content, pos_x, pos_y, pos_z, id]
        );

        res.json({ success: true });
    } catch (err) {
        console.error("Error updating draft file:", err);
        res.status(500).json({ error: "Database error" });
    }
};

// DELETE
exports.deleteDraftFile = async (req, res) => {
    try {
        const { id } = req.params;

        // Supprimer d'abord tous les liens liés aux keywords de ce fichier
        await pool.query(
            `
            DELETE dl
            FROM draft_links dl
            JOIN draft_keywords dk
                ON dl.from_id = dk.id
                OR dl.to_id = dk.id
            WHERE dk.file_id = ?
            `,
            [id]
        );

        // Puis supprimer le fichier (les keywords seront supprimés par ON DELETE CASCADE si configuré)
        await pool.query(
            `DELETE FROM draft_files WHERE id = ?`,
            [id]
        );

        res.json({ success: true });

    } catch (err) {
        console.error("Error deleting draft file:", err);
        res.status(500).json({ error: "Database error" });
    }
};