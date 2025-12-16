import React, { createContext, useContext, useState, useMemo } from "react";

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
  filteredNotes: Note[];
  loading: boolean;
  fetchNotes: () => Promise<void>;
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
  if (!context) {
    throw new Error("useNotes must be used within a NotesProvider");
  }
  return context;
};

interface NotesProviderProps {
  children: ReactNode;
}

export const NotesProvider: React.FC<NotesProviderProps> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const baseURL = `${import.meta.env.VITE_API_BASE_URL}/notes`;

  /* ---------------- FETCH ---------------- */
  const fetchNotes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(baseURL);
      setNotes(response.data);
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- CREATE ---------------- */
  const createNote = async (noteData: Partial<Note>) => {
    const response = await axios.post(baseURL, noteData);
    setNotes((prev) => [response.data, ...prev]);
    return response.data;
  };

  /* ---------------- UPDATE ---------------- */
  const updateNote = async (id: string, noteData: Partial<Note>) => {
    const response = await axios.patch(`${baseURL}/${id}`, noteData);
    setNotes((prev) =>
      prev.map((note) => (note.id === id ? response.data : note))
    );
    return response.data;
  };

  /* ---------------- DELETE ---------------- */
  const deleteNote = async (id: string) => {
    await axios.delete(`${baseURL}/${id}`);
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  /* ---------------- FAVORITE ---------------- */
  const toggleFavorite = async (id: string) => {
    const response = await axios.patch(`${baseURL}/${id}/favorite`);
    setNotes((prev) =>
      prev.map((note) => (note.id === id ? response.data : note))
    );
    return response.data;
  };

  /* ---------------- SEARCH (LOCAL) ---------------- */
  const filteredNotes = useMemo(() => {
    if (!searchTerm.trim()) return notes;

    const lower = searchTerm.toLowerCase();
    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(lower) ||
        note.content.toLowerCase().includes(lower) ||
        note.description?.toLowerCase().includes(lower)
    );
  }, [notes, searchTerm]);

  const searchNotes = (term: string) => setSearchTerm(term);

  const getNoteById = (id: string) => notes.find((note) => note.id === id);

  return (
    <NotesContext.Provider
      value={{
        notes,
        filteredNotes,
        loading,
        fetchNotes,
        createNote,
        updateNote,
        deleteNote,
        toggleFavorite,
        searchNotes,
        getNoteById,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};
