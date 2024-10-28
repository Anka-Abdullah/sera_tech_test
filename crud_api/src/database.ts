import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('database.db');

db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE
  )
`);

export default db;