import React, { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useNotes } from "../contexts/NotesContext";
import { Edit, Heart, Trash2, ArrowLeft } from "lucide-react";

const NoteView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { notes, toggleFavorite, deleteNote } = useNotes();

  const note = notes.find((n) => n.id === id);

  useEffect(() => {
    if (!note && id) {
      console.log("Note not found in current state");
    }
  }, [note, id]);

  const handleDelete = async () => {
    if (!note) return;

    if (window.confirm("Are you sure you want to delete this note?")) {
      await deleteNote(note.id);
      navigate("/dashboard");
    }
  };

  const handleToggleFavorite = async () => {
    if (!note) return;
    await toggleFavorite(note.id);
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  /* ------------------ NOT FOUND ------------------ */
  if (!note) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] text-center text-neutral-500">
        <h3 className="text-xl font-semibold text-neutral-900 mb-2">
          Note not found
        </h3>
        <p className="mb-6">
          The note you're looking for doesn't exist or has been deleted.
        </p>
        <Link
          to="/dashboard"
          className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  /* ------------------ MAIN VIEW ------------------ */
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 px-3 py-2 border rounded-md text-neutral-600 hover:bg-neutral-100"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="flex-1" />

        <button
          onClick={handleToggleFavorite}
          className={`flex items-center gap-2 px-3 py-2 rounded-md border ${
            note.isFavorite
              ? "text-yellow-500 border-yellow-300"
              : "text-neutral-500 hover:bg-neutral-100"
          }`}
        >
          <Heart size={18} fill={note.isFavorite ? "currentColor" : "none"} />
          {note.isFavorite ? "Favorited" : "Add to Favorites"}
        </button>

        <Link
          to={`/notes/${note.id}/edit`}
          className="flex items-center gap-2 px-3 py-2 border rounded-md text-neutral-600 hover:bg-neutral-100"
        >
          <Edit size={18} />
          Edit
        </Link>

        <button
          onClick={handleDelete}
          className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          <Trash2 size={18} />
          Delete
        </button>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-semibold text-neutral-900">
        {note.title || "Untitled"}
      </h1>

      {/* Description */}
      {note.description && (
        <p className="text-lg text-neutral-600 italic">{note.description}</p>
      )}

      {/* Content */}
      <div className="bg-white border rounded-lg p-6 whitespace-pre-wrap leading-relaxed text-neutral-800">
        {note.content || "No content"}
      </div>

      {/* Tags */}
      {note.tags?.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-neutral-900 mb-2">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {note.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-indigo-50 text-indigo-600 text-sm font-medium px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Dates */}
      <div className="flex justify-between text-sm text-neutral-500 border-t pt-4">
        <div>
          <strong>Created:</strong> {formatDate(note.createdAt)}
        </div>
        <div>
          <strong>Last updated:</strong> {formatDate(note.updatedAt)}
        </div>
      </div>
    </div>
  );
};

export default NoteView;
