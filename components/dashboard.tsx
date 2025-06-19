"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { LogOut, Plus, StickyNote, Loader2 } from "lucide-react"
import { useNotes, type Note } from "../hooks/use-notes"
import { NoteForm } from "./note-form"
import { NotesList } from "./notes-list"
import { useToast } from "./toast-provider"

interface DashboardProps {
  user: { name: string; email: string }
  onLogout: () => void
}

export function Dashboard({ user, onLogout }: DashboardProps) {
  const { notes, isLoading, addNote, updateNote, deleteNote } = useNotes()
  const [showForm, setShowForm] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSave = async (title: string, content: string) => {
    setIsSubmitting(true)

    try {
      let result

      if (editingNote) {
        result = await updateNote(editingNote.id, title, content)
      } else {
        result = await addNote(title, content)
      }

      if (result.success) {
        setShowForm(false)
        setEditingNote(null)
        toast({
          title: "Éxito",
          description: editingNote ? "Nota actualizada correctamente" : "Nota creada correctamente",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Error al guardar la nota",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error inesperado al guardar la nota",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (note: Note) => {
    setEditingNote(note)
    setShowForm(true)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingNote(null)
  }

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta nota?")) {
      const result = await deleteNote(id)

      if (result.success) {
        toast({
          title: "Éxito",
          description: "Nota eliminada correctamente",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Error al eliminar la nota",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-2">
              <StickyNote className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">Mis Notas</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Hola, {user.name}</span>
              <Button variant="outline" onClick={onLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Action Bar */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Tus Notas {!isLoading && `(${notes.length})`}</h2>
              <p className="text-gray-600">Organiza tus ideas y pensamientos</p>
            </div>
            {!showForm && (
              <Button onClick={() => setShowForm(true)} disabled={isLoading}>
                <Plus className="mr-2 h-4 w-4" />
                Nueva Nota
              </Button>
            )}
          </div>

          {/* Note Form */}
          {showForm && (
            <NoteForm
              note={editingNote || undefined}
              onSave={handleSave}
              onCancel={handleCancel}
              isSubmitting={isSubmitting}
            />
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Cargando notas...</span>
            </div>
          )}

          {/* Notes List */}
          {!isLoading && <NotesList notes={notes} onEdit={handleEdit} onDelete={handleDelete} />}
        </div>
      </main>
    </div>
  )
}
