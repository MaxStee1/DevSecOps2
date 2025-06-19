const Database = require("better-sqlite3")
const bcrypt = require("bcryptjs")
const { join } = require("path")
const { mkdirSync, existsSync } = require("fs")

async function initializeDatabase() {
  try {
    // Crear directorio data si no existe
    const dataDir = join(process.cwd(), "data")
    if (!existsSync(dataDir)) {
      mkdirSync(dataDir, { recursive: true })
    }

    const dbPath = join(dataDir, "miapp.db")
    const db = new Database(dbPath)

    // Configurar WAL mode
    db.pragma("journal_mode = WAL")

    // Crear tablas
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    `)

    // Verificar si ya existe un usuario
    const userExists = db.prepare("SELECT COUNT(*) as count FROM users").get()

    if (userExists.count === 0) {
      // Crear usuario de prueba
      const hashedPassword = await bcrypt.hash("password123", 10)

      db.prepare(`
        INSERT INTO users (email, password, name) 
        VALUES (?, ?, ?)
      `).run("admin@miapp.com", hashedPassword, "Administrador")

      // Crear algunas notas de ejemplo
      const userId = db.prepare("SELECT id FROM users WHERE email = ?").get("admin@miapp.com").id

      const sampleNotes = [
        {
          title: "Bienvenido a MiApp Segura",
          content:
            "Esta es tu primera nota. Aquí puedes escribir tus ideas, recordatorios y pensamientos.\n\nLa aplicación cuenta con:\n- Autenticación segura\n- Base de datos SQLite\n- Pipeline DevSecOps\n- Controles de seguridad automatizados",
        },
        {
          title: "Lista de tareas",
          content:
            "✅ Configurar la aplicación\n⏳ Revisar el pipeline de seguridad\n⏳ Documentar el proceso\n⏳ Realizar pruebas de penetración",
        },
        {
          title: "Notas de seguridad",
          content:
            "Recordatorios importantes sobre seguridad:\n\n1. Cambiar contraseñas regularmente\n2. Usar autenticación de dos factores\n3. Mantener el software actualizado\n4. Realizar backups regulares",
        },
      ]

      for (const note of sampleNotes) {
        db.prepare(`
          INSERT INTO notes (user_id, title, content) 
          VALUES (?, ?, ?)
        `).run(userId, note.title, note.content)
      }

      console.log("✅ Base de datos inicializada correctamente")
      console.log("📧 Email: admin@miapp.com")
      console.log("🔑 Password: password123")
      console.log("📝 Se crearon 3 notas de ejemplo")
    } else {
      console.log("ℹ️  La base de datos ya está inicializada")
    }

    db.close()
  } catch (error) {
    console.error("❌ Error al inicializar la base de datos:", error)
    process.exit(1)
  }
}

initializeDatabase()
