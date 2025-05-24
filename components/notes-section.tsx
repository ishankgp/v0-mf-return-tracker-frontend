"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Plus, X, Edit, Save, Trash2 } from "lucide-react"

interface Note {
  id: string
  content: string
  date: string
}

export function NotesSection() {
  const [notes, setNotes] = useState<Note[]>(() => {
    // Load notes from localStorage if available
    if (typeof window !== "undefined") {
      const savedNotes = localStorage.getItem("mf-tracker-notes")
      return savedNotes ? JSON.parse(savedNotes) : []
    }
    return []
  })

  const [showAddNote, setShowAddNote] = useState(false)
  const [newNoteContent, setNewNoteContent] = useState("")
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)

  // Save notes to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("mf-tracker-notes", JSON.stringify(notes))
    }
  }, [notes])

  const handleAddNote = () => {
    if (newNoteContent.trim() === "") return

    const note: Note = {
      id: Date.now().toString(),
      content: newNoteContent,
      date: new Date().toISOString(),
    }

    setNotes([note, ...notes])
    setNewNoteContent("")
    setShowAddNote(false)
  }

  const handleUpdateNote = (id: string, updatedContent: string) => {
    setNotes(
      notes.map((note) =>
        note.id === id
          ? {
              ...note,
              content: updatedContent,
              date: new Date().toISOString(), // Update the date when edited
            }
          : note,
      ),
    )
    setEditingNoteId(null)
  }

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id))
    if (editingNoteId === id) {
      setEditingNoteId(null)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Notes</CardTitle>
        <Button variant="outline" size="sm" onClick={() => setShowAddNote(!showAddNote)} className="h-8 px-2">
          {showAddNote ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4 mr-1" />}
          {!showAddNote && "Add Note"}
        </Button>
      </CardHeader>
      <CardContent>
        {showAddNote && (
          <div className="mb-4 p-4 border rounded-md bg-gray-50">
            <Textarea
              placeholder="Write your note here..."
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              className="min-h-[100px] mb-2"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowAddNote(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleAddNote}>
                Save Note
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
          {notes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No notes yet. Click "Add Note" to create one.</p>
            </div>
          ) : (
            notes.map((note) => (
              <div key={note.id} className="p-3 border rounded-md">
                {editingNoteId === note.id ? (
                  <div>
                    <Textarea
                      defaultValue={note.content}
                      id={`edit-content-${note.id}`}
                      className="min-h-[100px] mb-2"
                    />
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => setEditingNoteId(null)}>
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={() =>
                          handleUpdateNote(
                            note.id,
                            (document.getElementById(`edit-content-${note.id}`) as HTMLTextAreaElement)?.value || "",
                          )
                        }
                      >
                        <Save className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-xs text-gray-400">{formatDate(note.date)}</p>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => setEditingNoteId(note.id)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleDeleteNote(note.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
