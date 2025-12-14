import type { ReactNode } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { NotesProvider } from "./contexts/NotesContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashBoard from "./pages/DashBoard";
import Layout from "./components/Layout";
import NoteEditor from "./pages/NoteEditor";
import NoteView from "./pages/NoteView";

/* ================= LOADER ================= */

const FullScreenLoader = () => (
  <div className="flex items-center justify-center h-screen">
    <div>Loading...</div>
  </div>
);

/* ================= ROUTE TYPES ================= */

interface RouteProps {
  children: ReactNode;
}

/* ================= PROTECTED ROUTE ================= */

const ProtectedRoute = ({ children }: RouteProps) => {
  const { user, loading } = useAuth();

  if (loading) return <FullScreenLoader />;

  return user ? children : <Navigate to="/login" replace />;
};

/* ================= PUBLIC ROUTE ================= */

const PublicRoute = ({ children }: RouteProps) => {
  const { user, loading } = useAuth();

  if (loading) return <FullScreenLoader />;

  return user ? <Navigate to="/dashboard" replace /> : children;
};

/* ================= APP ================= */

const App = () => {
  return (
    <AuthProvider>
      <NotesProvider>
        <Router>
          <Routes>
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />

            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <DashBoard />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/notes/new"
              element={
                <ProtectedRoute>
                  <Layout>
                    <NoteEditor />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/notes/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <NoteView />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/notes/:id/edit"
              element={
                <ProtectedRoute>
                  <Layout>
                    <NoteEditor />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Default route */}
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </Router>
      </NotesProvider>
    </AuthProvider>
  );
};

export default App;
