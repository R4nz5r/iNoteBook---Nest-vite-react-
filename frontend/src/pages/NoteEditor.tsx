import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useNotes } from "../contexts/NotesContext";
import { Save, X } from "lucide-react";

const NoteEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { createNote, updateNote, getNoteById } = useNotes();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | null>(null);
  const [error, setError] = useState("");

  const isEditing = Boolean(id);
  const existingNote = id ? getNoteById(id) : null;

  useEffect(() => {
    if (isEditing && existingNote) {
      setTitle(existingNote.title);
      setContent(existingNote.content);
      setDescription(existingNote.description || "");
      setTags(existingNote.tags || []);
    }
  }, [isEditing, existingNote]);

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSave = async () => {
    if (!title.trim() && !content.trim()) {
      setError("Please add a title or content to save the note");
      return;
    }

    setSaving(true);
    setSaveStatus("saving");
    setError("");

    try {
      const noteData = {
        title: title.trim() || "Untitled",
        content: content.trim(),
        description: description.trim() || content.substring(0, 200),
        tags,
      };

      if (isEditing && id) {
        await updateNote(id, noteData);
      } else {
        await createNote(noteData);
      }

      setSaveStatus("saved");
      setTimeout(() => setSaveStatus(null), 2000);
      navigate("/dashboard");
    } catch{
      setError("Failed to save note. Please try again.");
      setSaveStatus(null);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Save Status */}
      {saveStatus && (
        <div
          className={`px-4 py-2 rounded-md text-white font-medium ${
            saveStatus === "saving" ? "bg-blue-500" : "bg-green-500"
          }`}
        >
          {saveStatus === "saving" ? "Saving..." : "Saved"}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition disabled:opacity-50"
        >
          <Save size={20} />
          {saving ? "Saving..." : isEditing ? "Update Note" : "Save Note"}
        </button>
        <button
          onClick={handleCancel}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
        >
          <X size={20} />
          Cancel
        </button>
      </div>

      {/* Error Message */}
      {error && <div className="text-red-500 font-medium">{error}</div>}

      {/* Title */}
      <input
        type="text"
        placeholder="Note title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      />

      {/* Content */}
      <textarea
        placeholder="Start writing your note..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md min-h-[200px] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      />

      {/* Description */}
      <div className="space-y-2">
        <label className="block font-medium text-gray-700">
          Description (optional)
        </label>
        <textarea
          placeholder="Brief description of your note..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md min-h-[80px] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <label className="block font-medium text-gray-700">Tags</label>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className="flex items-center gap-1 bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded text-sm"
            >
              {tag}
              <button
                onClick={() => handleRemoveTag(tag)}
                className="text-indigo-600 hover:text-indigo-800 text-lg leading-none"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <input
          type="text"
          placeholder="Add tags (press Enter to add)"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleAddTag}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
    </div>
  );
};

export default NoteEditor;
