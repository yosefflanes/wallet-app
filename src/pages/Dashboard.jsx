import { useAuth } from "../contexts/AuthContext";

export default function Dashboard() {
  const { logout, user } = useAuth();
  return (
    <div>
      <h1>Dashboard Wallet</h1>
      <p>Selamat datang, {user?.username}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
