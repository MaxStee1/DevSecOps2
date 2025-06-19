import { NextResponse } from "next/server"
import db from "@/lib/database"

export async function GET() {
  try {
    // Verificar conexión a la base de datos
    const result = db.prepare("SELECT 1 as test").get()

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      database: "connected",
      version: "1.0.0",
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        database: "disconnected",
        error: "Database connection failed",
      },
      { status: 503 },
    )
  }
}
