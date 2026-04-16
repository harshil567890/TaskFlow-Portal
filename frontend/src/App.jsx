import { Navigate, Route, Routes, Link, useNavigate } from "react-router-dom";
import useAuth from "./context/useAuth";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";

function App() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">REST API DEMO</p>
          <h1>TaskFlow Portal</h1>
        </div>
        <nav className="nav-links">
          {!isAuthenticated && <Link to="/login">Login</Link>}
          {!isAuthenticated && <Link to="/register">Register</Link>}
          {isAuthenticated && <Link to="/dashboard">Dashboard</Link>}
          {isAuthenticated && (
            <button type="button" onClick={handleLogout}>
              Logout
            </button>
          )}
        </nav>
      </header>

      {isAuthenticated && (
        <section className="user-chip">
          Signed in as <strong>{user?.name || "User"}</strong> ({user?.role || "user"})
        </section>
      )}

      <main className="page-wrap">
        <Routes>
          <Route
            path="/"
            element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />}
          />
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
          />
          <Route
            path="/register"
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />}
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
