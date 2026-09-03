import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Protected Route */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        {/* Redirect root (/) ke dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Halaman 404 sederhana */}
        <Route path="*" element={<div>404 - Halaman Tidak Ditemukan</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
