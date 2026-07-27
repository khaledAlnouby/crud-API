const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function initializeDatabase() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS tasks (
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            done BOOLEAN NOT NULL DEFAULT FALSE
        )
    `);

    const result = await pool.query(
        "SELECT COUNT(*) FROM tasks"
    );

    if (parseInt(result.rows[0].count) === 0) {
        await pool.query(`
            INSERT INTO tasks (title, done)
            VALUES
                ('Task 1', FALSE),
                ('Task 2', FALSE),
                ('Task 3', FALSE)
        `);
    }

    console.log("PostgreSQL database initialized successfully");
}

module.exports = {
    pool,
    initializeDatabase
};