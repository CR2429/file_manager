const pool = require("../db/connection");
const { v4: uuidv4 } = require("uuid");

// CREATE
exports.createDraftFile = async (req, res) => {
    try {
        const id = uuidv4();
        const { title = "Nouveau fichier", content = "" } = req.body;

        await pool.query(
            `INSERT INTO draft_files (id, title, content) VALUES (?, ?, ?)`,
            [id, title, content]
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

        await pool.query(`DELETE FROM draft_files WHERE id = ?`, [id]);

        res.json({ success: true });
    } catch (err) {
        console.error("Error deleting draft file:", err);
        res.status(500).json({ error: "Database error" });
    }
};
