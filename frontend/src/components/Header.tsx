import React from "react";
import { useLocation } from "react-router-dom";

const Header: React.FC = () => {
  const location = useLocation();

  const getPageTitle = () => {
    if (location.pathname === "/dashboard") return "All Notes";
    if (location.pathname === "/notes/new") return "New Note";
    if (location.pathname.endsWith("/edit")) return "Edit Note";
    if (location.pathname.startsWith("/notes/")) return "Note";
    return "Dashboard";
  };

  return (
    <header className="h-16 flex items-center px-8 border-b border-neutral-200 bg-white">
      <h1 className="text-xl font-semibold text-neutral-900">
        {getPageTitle()}
      </h1>
    </header>
  );
};

export default Header;
