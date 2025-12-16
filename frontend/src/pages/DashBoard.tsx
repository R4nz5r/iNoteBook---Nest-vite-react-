import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useNotes } from "../contexts/NotesContext";
import { Search, Heart, Calendar, Trash2 } from "lucide-react";

const Dashboard: React.FC = () => {
  const {
    filteredNotes,
    loading,
    fetchNotes,
    searchNotes,
    deleteNote,
    toggleFavorite,
  } = useNotes();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchParams] = useSearchParams();
  const filter = searchParams.get("filter");

  /* Fetch once */
  useEffect(() => {
    fetchNotes();
  }, []);

  /* Search debounce (NO FETCH) */
  useEffect(() => {
    const timer = setTimeout(() => {
      searchNotes(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const displayNotes =
    filter === "favorites"
      ? filteredNotes.filter((note) => note.isFavorite)
      : filteredNotes;

  const handleDelete = async (e: React.MouseEvent, noteId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("Delete this note?")) {
      await deleteNote(noteId);
    }
  };

  const handleToggleFavorite = async (e: React.MouseEvent, noteId: string) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleFavorite(noteId);
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        Loading notes...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="w-full max-w-md">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search your notes..."
          className="w-full h-10 px-4 border rounded-md focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Empty State */}
      {displayNotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96 text-neutral-500">
          <Search size={48} />
          <p className="mt-4">
            {searchTerm ? "No notes found" : "No notes yet"}
          </p>
          {!searchTerm && (
            <Link
              to="/notes/new"
              className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-md"
            >
              Create First Note
            </Link>
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayNotes.map((note) => (
            <Link
              key={note.id}
              to={`/notes/${note.id}`}
              className="bg-white p-4 rounded-md shadow hover:shadow-md"
            >
              <div className="flex justify-between">
                <h3 className="font-semibold truncate">
                  {note.title || "Untitled"}
                </h3>
                <div className="flex gap-2">
                  <button onClick={(e) => handleToggleFavorite(e, note.id)}>
                    <Heart
                      size={16}
                      fill={note.isFavorite ? "currentColor" : "none"}
                      className={
                        note.isFavorite ? "text-yellow-500" : "text-neutral-400"
                      }
                    />
                  </button>
                  <button onClick={(e) => handleDelete(e, note.id)}>
                    <Trash2 size={16} className="text-neutral-400" />
                  </button>
                </div>
              </div>

              <p className="text-sm mt-2 text-neutral-700">
                {note.description || note.content.slice(0, 150) + "..."}
              </p>

              <div className="flex items-center text-xs mt-2 text-neutral-400">
                <Calendar size={12} className="mr-1" />
                {formatDate(note.updatedAt)}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
