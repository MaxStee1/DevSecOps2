import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import db from "@/lib/database"

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

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = verifyToken(request)
    const noteId = params.id

    const note = db
      .prepare(`
      SELECT id, title, content, created_at, updated_at 
      FROM notes 
      WHERE id = ? AND user_id = ?
    `)
      .get(noteId, user.userId) as Note | undefined

    if (!note) {
      return NextResponse.json({ error: "Nota no encontrada" }, { status: 404 })
    }

    return NextResponse.json({ note })
  } catch (error) {
    console.error("Error al obtener nota:", error)
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }
}
