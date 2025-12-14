import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useNotes } from "../contexts/NotesContext";
import { Search, Heart, Calendar, Trash2 } from "lucide-react";

const Dashboard: React.FC = () => {
  const {
    notes,
    loading,
    fetchNotes,
    searchNotes,
    deleteNote,
    toggleFavorite,
  } = useNotes();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchParams] = useSearchParams();
  const filter = searchParams.get("filter");

  useEffect(() => {
    fetchNotes();
  }, [filter]);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      searchNotes(searchTerm);
      if (searchTerm || filter) fetchNotes();
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm, filter]);

  const handleDelete = async (e: React.MouseEvent, noteId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        await deleteNote(noteId);
      } catch (error) {
        console.error("Failed to delete note:", error);
      }
    }
  };

  const handleToggleFavorite = async (e: React.MouseEvent, noteId: string) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await toggleFavorite(noteId);
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const displayNotes =
    filter === "favorites" ? notes.filter((note) => note.isFavorite) : notes;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div>Loading notes...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="w-full max-w-md">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search your notes..."
          className="w-full h-10 px-4 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* Empty State */}
      {displayNotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96 text-center text-neutral-500 space-y-4">
          <Search size={48} className="opacity-50" />
          <h3 className="text-lg font-semibold text-neutral-900">
            {searchTerm
              ? "No notes found"
              : `No ${filter === "favorites" ? "favorite " : ""}notes yet`}
          </h3>
          <p className="text-sm">
            {searchTerm
              ? "Try adjusting your search terms"
              : filter === "favorites"
              ? "Start favoriting notes to see them here"
              : "Create your first note to get started"}
          </p>
          {!searchTerm && filter !== "favorites" && (
            <Link
              to="/notes/new"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-md font-medium hover:bg-indigo-600 transition"
            >
              Create First Note
            </Link>
          )}
        </div>
      ) : (
        // Notes Grid
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayNotes.map((note) => (
            <Link
              key={note.id}
              to={`/notes/${note.id}`}
              className="block bg-white rounded-md p-4 shadow hover:shadow-md transition text-neutral-900"
            >
              {/* Note Header */}
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg truncate">
                  {note.title || "Untitled"}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => handleToggleFavorite(e, note.id)}
                    className={`text-sm ${
                      note.isFavorite ? "text-yellow-500" : "text-neutral-400"
                    }`}
                  >
                    <Heart
                      size={16}
                      fill={note.isFavorite ? "currentColor" : "none"}
                    />
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, note.id)}
                    className="text-neutral-400 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Note Content */}
              <p className="text-sm text-neutral-700">
                {note.description ||
                  (note.content.length > 150
                    ? note.content.substring(0, 150) + "..."
                    : note.content)}
              </p>

              {/* Tags */}
              {note.tags && note.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {note.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-indigo-50 text-indigo-600 text-xs font-medium px-2 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Date */}
              <div className="flex items-center text-xs text-neutral-400 mt-2">
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
