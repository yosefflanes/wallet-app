import { useState } from "react";
import { Plus, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { apiRequest } from "../utils/axios";
import { formatNumber } from "../utils/format";

export default function TopUpForm({ onSuccess }) {
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleAmountChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    setAmount(rawValue);
    if (message.text) setMessage({ type: "", text: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    const parsedAmount = parseInt(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      setMessage({ type: "error", text: "Nominal harus lebih dari 0." });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      return;
    }

    setIsLoading(true);
    try {
      const res = await apiRequest("/topup", {
        method: "POST",
        body: { amount: parsedAmount },
      });
      setMessage({ type: "success", text: res.message });
      setAmount("");
      onSuccess();
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (err) {
      setMessage({ type: "error", text: err.message });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg">
      <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
        <Plus className="h-4 w-4 text-blue-400" /> Isi Saldo
      </h4>

      {message.text && (
        <div
          className={`mb-4 p-3 rounded-lg flex items-start gap-2 text-sm border ${
            message.type === "error"
              ? "bg-red-500/10 border-red-500/20 text-red-400"
              : "bg-green-500/10 border-green-500/20 text-green-400"
          }`}
        >
          {message.type === "error" ? (
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          ) : (
            <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2" noValidate>
        <input
          type="text" // text agar titik ribuan bisa muncul
          inputMode="numeric"
          value={amount ? formatNumber(amount) : ""}
          onChange={handleAmountChange}
          placeholder="Nominal"
          disabled={isLoading}
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isLoading || !amount}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0 flex items-center justify-center min-w-20"
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Top Up"}
        </button>
      </form>
    </div>
  );
}
