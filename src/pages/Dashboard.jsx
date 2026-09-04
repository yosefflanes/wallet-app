import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { apiRequest } from "../utils/axios";
import { formatIDR } from "../utils/format";
import { LogOut, Wallet, User, AlertCircle } from "lucide-react";

import TopUpForm from "../components/TopUpForm";
import TransferForm from "../components/TransferForm";
import TransactionHistory from "../components/TransactionHistory";

export default function Dashboard() {
  const { user, logout } = useAuth();

  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const fetchDashboardData = useCallback(async () => {
    try {
      setFetchError("");
      const [balanceRes, txRes] = await Promise.all([
        apiRequest("/wallet", { method: "GET" }),
        apiRequest("/transactions", { method: "GET" }),
      ]);

      setBalance(balanceRes.data.balance);
      setTransactions(txRes.data);
    } catch (err) {
      setFetchError("Gagal memuat data dashboard.", err);
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <div className="min-h-screen p-4 md:p-8 relative overflow-hidden">
      {/* Dekorasi Ambient */}
      <div className="absolute top-[-10%] left-[-10%] w-125 h-125 bg-blue-600/20 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 z-0 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-125 h-125 bg-slate-600/20 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 z-0 pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10 space-y-6">
        {/* Header Section */}
        <header className="flex justify-between items-center bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 px-6 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-500/30">
              <User className="text-blue-400 h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Selamat datang kembali,</p>
              <h2 className="text-lg font-semibold text-white">
                {user?.username ? user.username.charAt(0).toUpperCase() + user.username.slice(1) : ''}
              </h2>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-sm text-slate-300 hover:text-red-400 transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </header>

        {fetchError && (
          <div className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p className="text-sm">{fetchError}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Kolom Kiri: Saldo & Aksi */}
          <div className="lg:col-span-1 space-y-6">
            {/* Card Saldo */}
            <div className="bg-linear-to-br from-blue-900/40 to-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl translate-x-10 -translate-y-10 pointer-events-none"></div>
              <div className="flex items-center gap-2 text-slate-300 mb-2 relative z-10">
                <Wallet className="h-5 w-5" />
                <span className="font-medium">Total Saldo</span>
              </div>

              {isLoadingData ? (
                <div className="h-10 w-48 bg-white/10 animate-pulse rounded mt-2 relative z-10"></div>
              ) : (
                <h3 className="text-3xl font-bold text-white tracking-tight relative z-10">
                  {formatIDR(balance)}
                </h3>
              )}
            </div>

            {/* Komponen Form dengan melempar fungsi fetchDashboardData sebagai callback */}
            <TopUpForm onSuccess={fetchDashboardData} />
            <TransferForm
              onSuccess={fetchDashboardData}
              currentBalance={balance}
            />
          </div>

          {/* Kolom Kanan: Riwayat Transaksi */}
          <TransactionHistory
            transactions={transactions}
            isLoading={isLoadingData}
          />
        </div>
      </div>
    </div>
  );
}
