const pool = require("../db/connection");
const { v4: uuidv4 } = require("uuid");

// CREATE
exports.createDraftKeyword = async (req, res) => {
    try {
        const id = uuidv4();
        const {
            fileId,
            label,
            start_index,
            end_index,
            pos_x = 0,
            pos_y = 0,
            pos_z = 0
        } = req.body;

        if (!fileId || !label || start_index == null || end_index == null) {
            return res.status(400).json({
                error: "fileId, label, start_index et end_index sont obligatoires"
            });
        }

        await pool.query(
            `
            INSERT INTO draft_keywords
                (id, file_id, label, start_index, end_index, pos_x, pos_y, pos_z)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [id, fileId, label, start_index, end_index, pos_x, pos_y, pos_z]
        );

        res.json({ success: true, id });
    } catch (err) {
        console.error("Error creating draft keyword:", err);
        res.status(500).json({ error: "Database error" });
    }
};

// READ
// GET /draft/keywords           -> tous les keywords
// GET /draft/keywords?fileId=xx -> seulement pour un fichier
exports.getDraftKeywords = async (req, res) => {
    try {
        const { fileId } = req.query;

        let rows;
        if (fileId) {
            [rows] = await pool.query(
                `SELECT * FROM draft_keywords WHERE file_id = ?`,
                [fileId]
            );
        } else {
            [rows] = await pool.query(`SELECT * FROM draft_keywords`);
        }

        res.json(rows);
    } catch (err) {
        console.error("Error fetching draft keywords:", err);
        res.status(500).json({ error: "Database error" });
    }
};

// UPDATE
exports.updateDraftKeyword = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            label,
            start_index,
            end_index,
            pos_x,
            pos_y,
            pos_z
        } = req.body;

        await pool.query(
            `
            UPDATE draft_keywords
            SET
                label = IFNULL(?, label),
                start_index = IFNULL(?, start_index),
                end_index = IFNULL(?, end_index),
                pos_x = IFNULL(?, pos_x),
                pos_y = IFNULL(?, pos_y),
                pos_z = IFNULL(?, pos_z)
            WHERE id = ?
            `,
            [label, start_index, end_index, pos_x, pos_y, pos_z, id]
        );

        res.json({ success: true });
    } catch (err) {
        console.error("Error updating draft keyword:", err);
        res.status(500).json({ error: "Database error" });
    }
};

// UPDATE POSITION
exports.updateDraftKeywordPosition = async (req, res) => {
    try {
        const { id } = req.params;
        const { pos_x, pos_y, pos_z } = req.body;

        // Validation stricte : positions = CASES
        if (!Number.isInteger(pos_x) || !Number.isInteger(pos_y)) {
            return res.status(400).json({
                error: "pos_x and pos_y must be integers (grid cases)"
            });
        }

        await pool.query(
            `
            UPDATE draft_keywords
            SET
                pos_x = ?,
                pos_y = ?,
                pos_z = IFNULL(?, pos_z)
            WHERE id = ?
            `,
            [pos_x, pos_y, pos_z ?? null, id]
        );

        res.json({ success: true });
    } catch (err) {
        console.error("Error updating draft file position:", err);
        res.status(500).json({ error: "Database error" });
    }
};

// DELETE
// On ne supprime le keyword que s'il n'a aucun lien dans draft_links
exports.deleteDraftKeyword = async (req, res) => {
    try {
        const { id } = req.params;

        // Vérifier s'il existe des liens associés
        const [linkRows] = await pool.query(
            `
            SELECT COUNT(*) AS count
            FROM draft_links
            WHERE from_id = ? OR to_id = ?
            `,
            [id, id]
        );

        if (linkRows[0].count > 0) {
            return res.status(400).json({
                error: "Impossible de supprimer ce keyword tant qu'il est relié à des liens"
            });
        }

        await pool.query(
            `DELETE FROM draft_keywords WHERE id = ?`,
            [id]
        );

        res.json({ success: true });
    } catch (err) {
        console.error("Error deleting draft keyword:", err);
        res.status(500).json({ error: "Database error" });
    }
};
