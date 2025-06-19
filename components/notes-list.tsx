"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, FileText } from "lucide-react"
import type { Note } from "../hooks/use-notes"

interface NotesListProps {
  notes: Note[]
  onEdit: (note: Note) => void
  onDelete: (id: number) => void
}

export function NotesList({ notes, onEdit, onDelete }: NotesListProps) {
  if (notes.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500 text-center">No tienes notas aún. ¡Crea tu primera nota!</p>
        </CardContent>
      </Card>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-4">
      {notes.map((note) => (
        <Card key={note.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg">{note.title}</CardTitle>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => onEdit(note)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => onDelete(note.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary">{formatDate(note.created_at)}</Badge>
              {note.updated_at !== note.created_at && (
                <Badge variant="outline">Editado: {formatDate(note.updated_at)}</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 whitespace-pre-wrap line-clamp-3">{note.content}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
