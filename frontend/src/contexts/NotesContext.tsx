import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import axios from "axios";

export interface Note {
  id: string;
  title: string;
  content: string;
  description?: string;
  tags: string[];
  isFavorite: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface NotesContextType {
  notes: Note[];
  favorites: Note[];
  loading: boolean;
  searchTerm: string;
  fetchNotes: () => Promise<void>;
  fetchFavorites: () => Promise<void>;
  createNote: (noteData: Partial<Note>) => Promise<Note>;
  updateNote: (id: string, noteData: Partial<Note>) => Promise<Note>;
  deleteNote: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<Note>;
  searchNotes: (term: string) => void;
  getNoteById: (id: string) => Note | undefined;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error("useNotes must be used within a NotesProvider");
  }
  return context;
};

interface NotesProviderProps {
  children: ReactNode;
}

export const NotesProvider: React.FC<NotesProviderProps> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [favorites, setFavorites] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const params = searchTerm ? { search: searchTerm } : {};
      const response = await axios.get("/api/notes", { params });
      setNotes(response.data);
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await axios.get("/api/notes/favorites");
      setFavorites(response.data);
    } catch (error) {
      console.error("Failed to fetch favorites:", error);
    }
  };

  const createNote = async (noteData: Partial<Note>): Promise<Note> => {
    try {
      const response = await axios.post("/api/notes", noteData);
      const newNote = response.data;
      setNotes((prev) => [newNote, ...prev]);
      return newNote;
    } catch (error) {
      console.error("Failed to create note:", error);
      throw error;
    }
  };

  const updateNote = async (
    id: string,
    noteData: Partial<Note>
  ): Promise<Note> => {
    try {
      const response = await axios.patch(`/api/notes/${id}`, noteData);
      const updatedNote = response.data;

      setNotes((prev) =>
        prev.map((note) => (note.id === id ? updatedNote : note))
      );
      setFavorites((prev) =>
        prev.map((note) => (note.id === id ? updatedNote : note))
      );

      return updatedNote;
    } catch (error) {
      console.error("Failed to update note:", error);
      throw error;
    }
  };

  const deleteNote = async (id: string): Promise<void> => {
    try {
      await axios.delete(`/api/notes/${id}`);
      setNotes((prev) => prev.filter((note) => note.id !== id));
      setFavorites((prev) => prev.filter((note) => note.id !== id));
    } catch (error) {
      console.error("Failed to delete note:", error);
      throw error;
    }
  };

  const toggleFavorite = async (id: string): Promise<Note> => {
    try {
      const response = await axios.patch(`/api/notes/${id}/favorite`);
      const updatedNote = response.data;

      setNotes((prev) =>
        prev.map((note) => (note.id === id ? updatedNote : note))
      );

      // Update favorites list
      if (updatedNote.isFavorite) {
        setFavorites((prev) => [...prev, updatedNote]);
      } else {
        setFavorites((prev) => prev.filter((note) => note.id !== id));
      }

      return updatedNote;
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      throw error;
    }
  };

  const searchNotes = (term: string) => {
    setSearchTerm(term);
  };

  const getNoteById = (id: string): Note | undefined => {
    return notes.find((note) => note.id === id);
  };

  const value = {
    notes,
    favorites,
    loading,
    searchTerm,
    fetchNotes,
    fetchFavorites,
    createNote,
    updateNote,
    deleteNote,
    toggleFavorite,
    searchNotes,
    getNoteById,
  };

  return (
    <NotesContext.Provider value={value}>{children}</NotesContext.Provider>
  );
};
