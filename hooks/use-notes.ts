"use client"

import { useState, useEffect } from "react"

export interface Note {
  id: number
  title: string
  content: string
  created_at: string
  updated_at: string
}

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Cargar notas desde la API
  const fetchNotes = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/notes")

      if (response.ok) {
        const data = await response.json()
        setNotes(data.notes || [])
      } else {
        console.error("Error al cargar notas")
        setNotes([])
      }
    } catch (error) {
      console.error("Error al cargar notas:", error)
      setNotes([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchNotes()
  }, [])

  const addNote = async (title: string, content: string) => {
    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      })

      if (response.ok) {
        const data = await response.json()
        setNotes((prev) => [data.note, ...prev])
        return { success: true }
      } else {
        const error = await response.json()
        return { success: false, error: error.error }
      }
    } catch (error) {
      console.error("Error al crear nota:", error)
      return { success: false, error: "Error de conexión" }
    }
  }

  const updateNote = async (id: number, title: string, content: string) => {
    try {
      const response = await fetch(`/api/notes?id=${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      })

      if (response.ok) {
        const data = await response.json()
        setNotes((prev) => prev.map((note) => (note.id === id ? data.note : note)))
        return { success: true }
      } else {
        const error = await response.json()
        return { success: false, error: error.error }
      }
    } catch (error) {
      console.error("Error al actualizar nota:", error)
      return { success: false, error: "Error de conexión" }
    }
  }

  const deleteNote = async (id: number) => {
    try {
      const response = await fetch(`/api/notes?id=${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setNotes((prev) => prev.filter((note) => note.id !== id))
        return { success: true }
      } else {
        const error = await response.json()
        return { success: false, error: error.error }
      }
    } catch (error) {
      console.error("Error al eliminar nota:", error)
      return { success: false, error: "Error de conexión" }
    }
  }

  return {
    notes,
    isLoading,
    addNote,
    updateNote,
    deleteNote,
    refreshNotes: fetchNotes,
  }
}
