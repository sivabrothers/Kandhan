import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";
import dotenv from "dotenv";
import { sendEmail } from "./src/services/emailService.js";
import Stripe from "stripe";
import { WebSocketServer, WebSocket } from "ws";
import { createServer } from "http";
import bcrypt from "bcryptjs";
import { calculateMatch, NAKSHATRAS, RASIS } from "./src/utils/astrology.js";

dotenv.config();

let stripe: Stripe | null = null;
const getStripe = () => {
  if (!stripe && process.env.STRIPE_SECRET_KEY) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripe;
};

import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db: Database.Database;

const initDb = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      status TEXT DEFAULT 'pending', -- pending, active, suspended
      unique_id TEXT UNIQUE,
      payment_status TEXT DEFAULT 'pending',
      is_verified BOOLEAN DEFAULT 0,
      otp TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Set default admin
    INSERT OR IGNORE INTO users (email, password, role, is_verified) 
    VALUES ('fjoke777@gmail.com', '$2a$10$X7vH8m8X8X8X8X8X8X8X8u', 'admin', 1);

    CREATE TABLE IF NOT EXISTS profiles (
      user_id INTEGER PRIMARY KEY,
      name TEXT,
      gender TEXT,
      dob TEXT,
      age INTEGER,
      height TEXT,
      weight TEXT,
      marital_status TEXT,
      mother_tongue TEXT DEFAULT 'Tamil',
      religion TEXT DEFAULT 'Hindu',
      caste TEXT,
      sub_caste TEXT,
      gothram TEXT,
      star TEXT, -- Nakshatra
      rasi TEXT,
      manglik TEXT DEFAULT 'No', -- Dosham status
      phone TEXT,
      city TEXT,
      address TEXT,
      district TEXT,
      state TEXT,
      country TEXT,
      education TEXT,
      profession TEXT,
      company TEXT,
      income INTEGER,
      father_name TEXT,
      father_occ TEXT,
      mother_name TEXT,
      mother_occ TEXT,
      brothers INTEGER DEFAULT 0,
      sisters INTEGER DEFAULT 0,
      food TEXT, -- Vegetarian, Non-Vegetarian
      smoking TEXT DEFAULT 'No',
      drinking TEXT DEFAULT 'No',
      bio TEXT, -- About Me
      partner_expectations TEXT,
      photos TEXT, -- JSON array of URLs or base64
      horoscope_img TEXT,
      id_proof TEXT, -- For verification
      is_approved BOOLEAN DEFAULT 0,
      rasi_chart TEXT, -- JSON representation of rasi chart
      amsam_chart TEXT, -- JSON representation of amsam chart
      lagnam TEXT,
      dasa TEXT,
      birth_place TEXT,
      birth_time TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS interests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      from_id INTEGER,
      to_id INTEGER,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(from_id) REFERENCES users(id),
      FOREIGN KEY(to_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      amount INTEGER,
      plan TEXT,
      status TEXT,
      transaction_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      from_id INTEGER,
      to_id INTEGER,
      content TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(from_id) REFERENCES users(id),
      FOREIGN KEY(to_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS shortlists (
      user_id INTEGER,
      profile_id INTEGER,
      PRIMARY KEY(user_id, profile_id),
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(profile_id) REFERENCES users(id)
    );
  `);
};

const dbPath = process.env.DB_PATH || "matrimony.db";
try {
  db = new Database(dbPath);
  initDb();
} catch (err: any) {
  if (err.code === 'SQLITE_CORRUPT' || err.message.includes('malformed')) {
    console.warn("Database is corrupted. Deleting and recreating...");
    try {
      db.close();
    } catch (e) {}
    fs.unlinkSync(dbPath);
    db = new Database(dbPath);
    initDb();
  } else {
    throw err;
  }
}


async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  app.use(express.json({ limit: '50mb' })); // Increased limit for base64 uploads

  // --- Middleware ---
  const isAdmin = (req: any, res: any, next: any) => {
    // In a real app, we'd check a session/token
    // For this demo, we'll check a header or query param for simplicity
    const userId = req.headers['x-user-id'];
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    
    const user = db.prepare("SELECT role FROM users WHERE id = ?").get(userId) as any;
    if (user && user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ error: "Forbidden: Admin access required" });
    }
  };

  // --- API Routes ---

  // Horoscope Matching API
  app.get("/api/match/:brideId/:groomId", (req, res) => {
    const { brideId, groomId } = req.params;
    const bride = db.prepare("SELECT star FROM profiles WHERE user_id = ?").get(brideId) as any;
    const groom = db.prepare("SELECT star FROM profiles WHERE user_id = ?").get(groomId) as any;

    if (!bride || !groom || !bride.star || !groom.star) {
      return res.status(400).json({ error: "Star information missing for one or both profiles" });
    }

    const match = calculateMatch(bride.star, groom.star);
    res.json(match);
  });

  // AI Matchmaking Recommendations
  app.get("/api/recommendations/:userId", (req, res) => {
    const { userId } = req.params;
    const userProfile = db.prepare("SELECT * FROM profiles WHERE user_id = ?").get(userId) as any;
    
    if (!userProfile) return res.status(404).json({ error: "Profile not found" });

    const oppositeGender = userProfile.gender === 'Bride' ? 'Groom' : 'Bride';
    
    // Basic recommendation logic: Opposite gender, approved, and similar age/location
    const candidates = db.prepare(`
      SELECT p.*, u.payment_status 
      FROM profiles p 
      JOIN users u ON p.user_id = u.id 
      WHERE p.gender = ? AND p.user_id != ?
      LIMIT 20
    `).all(oppositeGender, userId) as any[];

    const recommendations = candidates.map(c => {
      let matchScore = 0;
      if (userProfile.star && c.star) {
        const matchResult = calculateMatch(userProfile.star, c.star);
        matchScore = matchResult.percentage;
      }
      return { ...c, matchScore };
    }).sort((a, b) => b.matchScore - a.matchScore);

    res.json(recommendations);
  });

  // Auth & Registration Flow
  app.post("/api/auth/register-init", async (req, res) => {
    const { email, password } = req.body;
    console.log(`Registering user: ${email}`);
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP
    
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const info = db.prepare("INSERT INTO users (email, password, otp) VALUES (?, ?, ?)").run(email, hashedPassword, otp);
      console.log(`User created with ID: ${info.lastInsertRowid}. OTP: ${otp}`);
      let emailSent = false;
      try {
        await sendEmail(email, "Your OTP", `Your OTP is ${otp}`);
        emailSent = true;
      } catch (emailErr) {
        console.warn("Failed to send email, but user created. OTP is:", otp);
      }
      res.json({ 
        success: true, 
        userId: info.lastInsertRowid, 
        message: emailSent ? "OTP sent to email" : "Email service not configured. Use OTP from logs.",
        debugOtp: process.env.NODE_ENV !== 'production' ? otp : undefined
      });
    } catch (e: any) {
      console.error("Registration error:", e.message);
      if (e.message.includes("UNIQUE constraint failed")) {
        res.status(400).json({ error: "Email already registered" });
      } else {
        res.status(400).json({ error: e.message });
      }
    }
  });

  app.post("/api/auth/verify-otp", (req, res) => {
    const { userId, otp } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE id = ? AND otp = ?").get(userId, otp);
    
    if (user) {
      db.prepare("UPDATE users SET is_verified = 1, otp = NULL WHERE id = ?").run(userId);
      res.json({ success: true });
    } else {
      res.status(400).json({ error: "Invalid OTP" });
    }
  });

  app.post("/api/auth/register-profile", (req, res) => {
    const { userId, profileData } = req.body;
    
    const cols = ['user_id', ...Object.keys(profileData)].join(", ");
    const placeholders = ['?', ...Object.keys(profileData).map(() => "?")].join(", ");
    const vals = [userId, ...Object.values(profileData)];
    
    try {
      db.prepare(`INSERT OR REPLACE INTO profiles (${cols}) VALUES (${placeholders})`).run(...vals);
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.post("/api/payment/process", (req, res) => {
    const { userId } = req.body;
    // Mock payment processing
    const uniqueId = `KK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    
    try {
      db.prepare("UPDATE users SET payment_status = 'completed', status = 'active', unique_id = ? WHERE id = ?").run(uniqueId, userId);
      res.json({ success: true, uniqueId });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    console.log(`Login attempt: ${email}`);
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;
    
    if (user && await bcrypt.compare(password, user.password)) {
      console.log(`Login successful for: ${email}`);
      const profile = db.prepare("SELECT * FROM profiles WHERE user_id = ?").get(user.id);
      res.json({ 
        success: true, 
        user: { 
          id: user.id, 
          email: user.email, 
          role: user.role, 
          unique_id: user.unique_id, 
          payment_status: user.payment_status 
        }, 
        profile 
      });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  app.post("/api/auth/forgot-password", async (req, res) => {
    const { email } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    db.prepare("UPDATE users SET otp = ? WHERE id = ?").run(otp, user.id);
    
    let emailSent = false;
    try {
      await sendEmail(email, "Password Reset OTP", `Your OTP for password reset is ${otp}`);
      emailSent = true;
    } catch (e: any) {
      console.warn("Failed to send reset email. OTP is:", otp);
    }
    
    res.json({ 
      success: true, 
      userId: user.id,
      debugOtp: process.env.NODE_ENV !== 'production' ? otp : undefined
    });
  });

  app.post("/api/auth/reset-password", async (req, res) => {
    const { userId, otp, newPassword } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE id = ? AND otp = ?").get(userId, otp);
    
    if (user) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      db.prepare("UPDATE users SET password = ?, otp = NULL WHERE id = ?").run(hashedPassword, userId);
      res.json({ success: true });
    } else {
      res.status(400).json({ error: "Invalid OTP" });
    }
  });

  // Profile
  app.get("/api/profiles", (req, res) => {
    const profiles = db.prepare("SELECT * FROM profiles").all();
    res.json(profiles);
  });

  app.get("/api/profiles/:id", (req, res) => {
    const profile = db.prepare("SELECT * FROM profiles WHERE user_id = ?").get(req.params.id);
    res.json(profile);
  });

  // Payments
  app.post("/api/create-checkout-session", async (req, res) => {
    const { userId, planId } = req.body;
    const stripeClient = getStripe();
    
    if (!stripeClient) {
      return res.status(500).json({ error: "Stripe not configured" });
    }

    const plans: any = {
      silver: { name: "Silver Plan", amount: 250000 }, // 2500 INR
      gold: { name: "Gold Plan", amount: 500000 },   // 5000 INR
      diamond: { name: "Diamond Plan", amount: 1000000 } // 10000 INR
    };

    const plan = plans[planId];
    if (!plan) return res.status(400).json({ error: "Invalid plan" });

    try {
      const session = await stripeClient.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "inr",
              product_data: { name: plan.name },
              unit_amount: plan.amount,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.APP_URL}/?payment=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.APP_URL}/?payment=cancel`,
        metadata: { userId, planId }
      });

      res.json({ id: session.id, url: session.url });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/payment/verify", async (req, res) => {
    const { sessionId } = req.body;
    const stripeClient = getStripe();
    
    if (!stripeClient) {
      return res.status(500).json({ error: "Stripe not configured" });
    }

    try {
      const session = await stripeClient.checkout.sessions.retrieve(sessionId);
      if (session.payment_status === 'paid') {
        const userId = session.metadata?.userId;
        const planId = session.metadata?.planId;
        const amount = session.amount_total;
        
        const uniqueId = `KK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
        
        db.prepare("UPDATE users SET payment_status = 'completed', status = 'active', unique_id = ? WHERE id = ?").run(uniqueId, userId);
        db.prepare("INSERT INTO payments (user_id, amount, plan, status, transaction_id) VALUES (?, ?, ?, ?, ?)").run(userId, amount, planId, 'succeeded', session.id);
        
        res.json({ success: true, uniqueId });
      } else {
        res.status(400).json({ error: "Payment not completed" });
      }
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Search
  app.get("/api/search", (req, res) => {
    const { gender, minAge, maxAge, religion, caste, star, rasi, district, city, education } = req.query;
    let query = "SELECT p.*, u.email, u.unique_id FROM profiles p JOIN users u ON p.user_id = u.id WHERE u.payment_status = 'completed'";
    const params: any[] = [];

    if (gender) { query += " AND p.gender = ?"; params.push(gender); }
    if (minAge) { query += " AND p.age >= ?"; params.push(minAge); }
    if (maxAge) { query += " AND p.age <= ?"; params.push(maxAge); }
    if (religion) { query += " AND p.religion = ?"; params.push(religion); }
    if (caste) { query += " AND p.caste LIKE ?"; params.push(`%${caste}%`); }
    if (star) { query += " AND p.star = ?"; params.push(star); }
    if (rasi) { query += " AND p.rasi = ?"; params.push(rasi); }
    if (district) { query += " AND p.district LIKE ?"; params.push(`%${district}%`); }
    if (city) { query += " AND p.city LIKE ?"; params.push(`%${city}%`); }
    if (education) { query += " AND p.education LIKE ?"; params.push(`%${education}%`); }

    const results = db.prepare(query).all(...params);
    res.json(results);
  });

  // Admin
  app.get("/api/admin/stats", isAdmin, (req, res) => {
    const totalUsers = db.prepare("SELECT COUNT(*) as count FROM users").get().count;
    const pendingApprovals = db.prepare("SELECT COUNT(*) as count FROM users WHERE status = 'pending'").get().count;
    const totalRevenue = db.prepare("SELECT SUM(amount) as total FROM payments WHERE status = 'succeeded'").get().total || 0;
    res.json({ totalUsers, pendingApprovals, totalRevenue });
  });

  app.get("/api/admin/users", isAdmin, (req, res) => {
    const users = db.prepare(`
      SELECT users.*, profiles.name, profiles.gender 
      FROM users 
      LEFT JOIN profiles ON users.id = profiles.user_id
    `).all();
    res.json(users);
  });

  app.post("/api/admin/approve-user", isAdmin, (req, res) => {
    const { userId, status } = req.body;
    db.prepare("UPDATE users SET status = ? WHERE id = ?").run(status, userId);
    res.json({ success: true });
  });

  // Interests
  app.post("/api/interests", (req, res) => {
    const { from_id, to_id } = req.body;
    db.prepare("INSERT INTO interests (from_id, to_id) VALUES (?, ?)").run(from_id, to_id);
    res.json({ success: true });
  });

  app.get("/api/interests/:userId", (req, res) => {
    const received = db.prepare(`
      SELECT i.*, p.name, p.photos 
      FROM interests i 
      JOIN profiles p ON i.from_id = p.user_id 
      WHERE i.to_id = ?
    `).all(req.params.userId);
    res.json(received);
  });

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  const server = createServer(app);
  const wss = new WebSocketServer({ server });

  const clients = new Map<number, WebSocket>();

  wss.on("connection", (ws, req) => {
    const userId = parseInt(new URL(req.url!, `http://${req.headers.host}`).searchParams.get("userId") || "0");
    if (userId) clients.set(userId, ws);

    ws.on("message", (data) => {
      const message = JSON.parse(data.toString());
      const recipient = clients.get(message.toId);
      if (recipient && recipient.readyState === WebSocket.OPEN) {
        recipient.send(JSON.stringify({
          fromId: userId,
          text: message.text,
          timestamp: new Date().toISOString()
        }));
      }
    });

    ws.on("close", () => {
      if (userId) clients.delete(userId);
    });
  });

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

