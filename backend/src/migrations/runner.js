const fs = require("fs");
const path = require("path");
const db = require("../config/database");

async function runMigrations() {
  try {
    console.log("🗑 Dropping all tables, types, and extensions...");

    // Drop all tables
    await db.query(`
      DO $$ DECLARE
          r RECORD;
      BEGIN
          FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = current_schema()) LOOP
              EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
          END LOOP;
      END $$;
    `);

    // Drop all user-defined types
    await db.query(`
      DO $$ DECLARE
          t RECORD;
      BEGIN
          FOR t IN (SELECT typname FROM pg_type WHERE typcategory = 'E') LOOP
              EXECUTE 'DROP TYPE IF EXISTS ' || quote_ident(t.typname) || ' CASCADE';
          END LOOP;
      END $$;
    `);

    // Drop extensions
    await db.query(`
      DROP EXTENSION IF EXISTS "uuid-ossp" CASCADE;
      DROP EXTENSION IF EXISTS "pgcrypto" CASCADE;
    `);

    console.log("✅ All tables, types, and extensions dropped");

    // Recreate migrations table
    await db.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        filename TEXT UNIQUE,
        applied_at TIMESTAMP DEFAULT NOW()
      );
    `);

    const migrationsDir = path.join(__dirname);
    const files = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith(".sql"))
      .sort();

    for (const file of files) {
      try {
        const sql = fs.readFileSync(path.join(migrationsDir, file), "utf-8");
        await db.query(sql);
        await db.query("INSERT INTO migrations (filename) VALUES ($1)", [file]);
        console.log(`🚀 Migration applied: ${file}`);
      } catch (err) {
        console.error(`❌ Migration failed (${file}):`, err.message);
      }
    }

    console.log("🎉 Database fully reset and all migrations applied ✅");
  } catch (err) {
    console.error("Migration process failed:", err.message);
  }
}

module.exports = { runMigrations };
