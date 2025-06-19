import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { z } from "zod"
import db from "@/lib/database"

// Esquema de validación para notas
const noteSchema = z.object({
  title: z.string().min(1, "El título es requerido").max(100, "El título es muy largo"),
  content: z.string().min(1, "El contenido es requerido").max(5000, "El contenido es muy largo"),
})

interface Note {
  id: number
  user_id: number
  title: string
  content: string
  created_at: string
  updated_at: string
}

function verifyToken(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value

  if (!token) {
    throw new Error("Token no encontrado")
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret-key") as any
    return decoded
  } catch (error) {
    throw new Error("Token inválido")
  }
}

// GET - Obtener todas las notas del usuario
export async function GET(request: NextRequest) {
  try {
    const user = verifyToken(request)

    const notes = db
      .prepare(`
      SELECT id, title, content, created_at, updated_at 
      FROM notes 
      WHERE user_id = ? 
      ORDER BY updated_at DESC
    `)
      .all(user.userId) as Note[]

    return NextResponse.json({ notes })
  } catch (error) {
    console.error("Error al obtener notas:", error)
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }
}

// POST - Crear nueva nota
export async function POST(request: NextRequest) {
  try {
    const user = verifyToken(request)
    const body = await request.json()

    // Validar datos de entrada
    const validatedData = noteSchema.parse(body)

    // Insertar nota en la base de datos
    const result = db
      .prepare(`
      INSERT INTO notes (user_id, title, content) 
      VALUES (?, ?, ?)
    `)
      .run(user.userId, validatedData.title, validatedData.content)

    // Obtener la nota creada
    const newNote = db
      .prepare(`
      SELECT id, title, content, created_at, updated_at 
      FROM notes 
      WHERE id = ?
    `)
      .get(result.lastInsertRowid) as Note

    return NextResponse.json({ note: newNote }, { status: 201 })
  } catch (error) {
    console.error("Error al crear nota:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Datos inválidos",
          details: error.errors,
        },
        { status: 400 },
      )
    }

    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// PUT - Actualizar nota existente
export async function PUT(request: NextRequest) {
  try {
    const user = verifyToken(request)
    const body = await request.json()
    const { searchParams } = new URL(request.url)
    const noteId = searchParams.get("id")

    if (!noteId) {
      return NextResponse.json({ error: "ID de nota requerido" }, { status: 400 })
    }

    // Validar datos de entrada
    const validatedData = noteSchema.parse(body)

    // Verificar que la nota pertenece al usuario
    const existingNote = db
      .prepare(`
      SELECT id FROM notes WHERE id = ? AND user_id = ?
    `)
      .get(noteId, user.userId)

    if (!existingNote) {
      return NextResponse.json({ error: "Nota no encontrada" }, { status: 404 })
    }

    // Actualizar nota
    db.prepare(`
      UPDATE notes 
      SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ? AND user_id = ?
    `).run(validatedData.title, validatedData.content, noteId, user.userId)

    // Obtener la nota actualizada
    const updatedNote = db
      .prepare(`
      SELECT id, title, content, created_at, updated_at 
      FROM notes 
      WHERE id = ?
    `)
      .get(noteId) as Note

    return NextResponse.json({ note: updatedNote })
  } catch (error) {
    console.error("Error al actualizar nota:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Datos inválidos",
          details: error.errors,
        },
        { status: 400 },
      )
    }

    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// DELETE - Eliminar nota
export async function DELETE(request: NextRequest) {
  try {
    const user = verifyToken(request)
    const { searchParams } = new URL(request.url)
    const noteId = searchParams.get("id")

    if (!noteId) {
      return NextResponse.json({ error: "ID de nota requerido" }, { status: 400 })
    }

    // Verificar que la nota pertenece al usuario y eliminarla
    const result = db
      .prepare(`
      DELETE FROM notes 
      WHERE id = ? AND user_id = ?
    `)
      .run(noteId, user.userId)

    if (result.changes === 0) {
      return NextResponse.json({ error: "Nota no encontrada" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Nota eliminada correctamente" })
  } catch (error) {
    console.error("Error al eliminar nota:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
