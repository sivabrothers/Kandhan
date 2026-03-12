import Database from "better-sqlite3";
const db = new Database("matrimony.db");
const users = db.prepare("SELECT id, email, password, is_verified FROM users").all();
console.log("Users in DB (Passwords are now hashed):", users);
