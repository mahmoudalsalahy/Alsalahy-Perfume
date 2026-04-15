import initSqlJs from 'sql.js';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DB_PATH = join(__dirname, 'alsalahy.db');

let db;

export async function initDatabase() {
  const SQL = await initSqlJs();

  // Load existing database or create new one
  if (existsSync(DB_PATH)) {
    const buffer = readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }

  // Create tables
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT DEFAULT '',
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name_ar TEXT NOT NULL,
      name_en TEXT NOT NULL,
      desc_ar TEXT,
      desc_en TEXT,
      notes_ar TEXT,
      notes_en TEXT,
      price_30ml INTEGER NOT NULL,
      price_50ml INTEGER NOT NULL,
      price_100ml INTEGER NOT NULL,
      image TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      customer_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      address TEXT NOT NULL,
      city TEXT NOT NULL,
      notes TEXT DEFAULT '',
      total INTEGER NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      size TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      price INTEGER NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Seed products if empty
  const result = db.exec('SELECT COUNT(*) as count FROM products');
  const count = result[0]?.values[0][0] || 0;

  if (count === 0) {
    const stmt = db.prepare(`
      INSERT INTO products (name_ar, name_en, desc_ar, desc_en, notes_ar, notes_en, price_30ml, price_50ml, price_100ml, image)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run([
      'عود ملكي', 'Oud Royal',
      'عطر فاخر بنفحات العود الطبيعي الممزوج بالعنبر والمسك الأبيض، يمنحك حضوراً ملكياً لا يُنسى. تركيبة شرقية أصيلة تدوم طويلاً.',
      'A luxurious fragrance with natural oud notes blended with amber and white musk, giving you an unforgettable royal presence.',
      'العود • العنبر • المسك الأبيض • خشب الصندل',
      'Oud • Amber • White Musk • Sandalwood',
      200, 350, 550,
      '/images/product-1.png'
    ]);

    stmt.run([
      'مسك فضي', 'Silver Musk',
      'مزيج أنيق من المسك الفاخر والزهور البيضاء مع لمسات من الفانيليا، عطر يعكس الأناقة والنقاء. مثالي للمناسبات الخاصة.',
      'An elegant blend of premium musk and white flowers with touches of vanilla, a fragrance that reflects elegance and purity.',
      'المسك • الزهور البيضاء • الفانيليا • الأرز',
      'Musk • White Flowers • Vanilla • Cedar',
      160, 280, 450,
      '/images/product-2.png'
    ]);

    stmt.run([
      'وردة مخملية', 'Velvet Rose',
      'عطر ساحر يجمع بين الورد الدمشقي والعود الفاخر مع لمسة من التوت البري، تجربة عطرية فريدة تأسر الحواس.',
      'A captivating fragrance that combines Damascene rose with premium oud and a touch of berry, a unique olfactory experience.',
      'الورد الدمشقي • العود • التوت البري • الباتشولي',
      'Damascene Rose • Oud • Berry • Patchouli',
      180, 320, 500,
      '/images/product-3.png'
    ]);

    stmt.free();
    saveDatabase();
    console.log('✅ Seeded 3 products into database');
  }

  saveDatabase();
  console.log('✅ Database initialized');
  return db;
}

export function saveDatabase() {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    writeFileSync(DB_PATH, buffer);
  }
}

export function getDb() {
  return db;
}

// Helper functions that mimic better-sqlite3 API
export function dbAll(sql, params = []) {
  const stmt = db.prepare(sql);
  if (params.length) stmt.bind(params);
  const results = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();
  return results;
}

export function dbGet(sql, params = []) {
  const stmt = db.prepare(sql);
  if (params.length) stmt.bind(params);
  let result = null;
  if (stmt.step()) {
    result = stmt.getAsObject();
  }
  stmt.free();
  return result;
}

export function dbRun(sql, params = []) {
  db.run(sql, params);
  saveDatabase();
  const lastId = db.exec('SELECT last_insert_rowid()')[0]?.values[0][0];
  return { lastInsertRowid: lastId };
}
