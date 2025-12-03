const pool = require("./db/connection");

async function test() {
    try {
        const [rows] = await pool.query("SELECT 1 + 1 AS result");
        console.log("DB OK:", rows);
    } catch (err) {
        console.error("DB ERROR:", err);
    }
}

test();
