import { useState } from "react";
import { Send, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { apiRequest } from "../utils/axios";
import { formatNumber } from "../utils/format";

export default function TransferForm({ onSuccess, currentBalance }) {
  const [target, setTarget] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Fungsi untuk membersihkan error saat user mulai mengetik ulang di input Tujuan
  const handleTargetChange = (e) => {
    setTarget(e.target.value);
    if (message.text) setMessage({ type: "", text: "" });
  };

  // Fungsi untuk memformat input angka mentah dan membersihkan error
  const handleAmountChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    setAmount(rawValue);
    if (message.text) setMessage({ type: "", text: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    const cleanTarget = target.trim();
    const parsedAmount = parseInt(amount);

    if (!cleanTarget) {
      setMessage({ type: "error", text: "Tujuan tidak boleh kosong." });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      return;
    }
    if (!parsedAmount || parsedAmount <= 0) {
      setMessage({
        type: "error",
        text: "Nominal transfer tidak valid.",
      });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      return;
    }
    if (parsedAmount > currentBalance) {
      setMessage({ type: "error", text: "Saldo tidak cukup." });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      return;
    }

    setIsLoading(true);
    try {
      const idempotencyKey = crypto.randomUUID();
      const res = await apiRequest("/transfer", {
        method: "POST",
        body: {
          target: cleanTarget,
          amount: parsedAmount,
          idempotency_key: idempotencyKey,
        },
      });

      setMessage({ type: "success", text: res.message });
      setTarget("");
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
        <Send className="h-4 w-4 text-purple-400" /> Transfer Dana
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

      <form onSubmit={handleSubmit} className="space-y-3" noValidate>
        <div>
          <input
            type="text"
            value={target}
            onChange={handleTargetChange}
            placeholder="Email atau No. HP Tujuan"
            disabled={isLoading}
            className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500 disabled:opacity-50"
          />
        </div>
        <div>
          <input
            type="text" // text agar titik ribuan bisa muncul
            inputMode="numeric"
            value={amount ? formatNumber(amount) : ""}
            onChange={handleAmountChange}
            placeholder="Nominal Transfer"
            disabled={isLoading}
            className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500 disabled:opacity-50"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !target || !amount}
          className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            "Kirim Sekarang"
          )}
        </button>
      </form>
    </div>
  );
}
