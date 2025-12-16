import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FileText, Heart, Plus, LogOut } from "lucide-react";

const Sidebar: React.FC = () => {
  const { user, logout, loading } = useAuth();
  const location = useLocation();

  const baseLink =
    "flex items-center gap-3 h-10 px-4 rounded-md text-sm font-medium transition";

  return (
    <aside className="w-64 bg-white border-r border-neutral-200 p-6 flex flex-col">
      {/* Logo */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-indigo-600">iNoteBook</h2>
      </div>

      {/* Navigation */}
      <nav className="space-y-1 mb-8">
        <Link
          to="/dashboard"
          className={`${baseLink} ${
            location.pathname === "/dashboard"
              ? "bg-indigo-50 text-indigo-600"
              : "text-neutral-900 hover:bg-neutral-100"
          }`}
        >
          <FileText size={20} />
          All Notes
        </Link>

        <Link
          to="/dashboard?filter=favorites"
          className={`${baseLink} ${
            location.search === "?filter=favorites"
              ? "bg-indigo-50 text-indigo-600"
              : "text-neutral-900 hover:bg-neutral-100"
          }`}
        >
          <Heart size={20} />
          Favorites
        </Link>
      </nav>

      {/* New Note Button */}
      <Link
        to="/notes/new"
        className="flex items-center justify-center gap-2 h-11 rounded-md bg-indigo-500 text-white font-medium hover:bg-indigo-600 transition mb-8"
      >
        <Plus size={20} />
        New Note
      </Link>

      {/* Footer */}
      <div className="mt-auto pt-6 border-t border-neutral-200">
        <div className="mb-4 text-sm text-neutral-500">
          Signed in as
          <div className="mt-1 font-semibold text-neutral-900">
            {loading
              ? "Loading..."
              : user
              ? `${user.firstName} ${user.lastName}`
              : "Guest"}
          </div>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-3 h-10 w-full px-4 rounded-md text-sm font-medium text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 transition"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
