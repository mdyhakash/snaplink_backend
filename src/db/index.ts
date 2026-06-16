import config from "../config";
import { Pool } from "pg";

export const pool = new Pool({
    connectionString:config.connection_string
})


export const initDB= async()=>{
    try {
        await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `)

    await pool.query(`
        CREATE TABLE IF NOT EXISTS links (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        title VARCHAR(255),
        original_url TEXT NOT NULL,
        short_url VARCHAR(30) NOT NULL UNIQUE,
        click_count INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP DEFAULT NULL
      );
    `)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS click_events(
        id SERIAL PRIMARY KEY,
        link_id INTEGER REFERENCES links(id) ON DELETE CASCADE,
        clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log("Database initialized successfully")
    } catch (error) {
        console.log(error)
    }
}