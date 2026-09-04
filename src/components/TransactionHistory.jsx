import { History, ArrowUpRight, ArrowDownLeft, Loader2 } from "lucide-react";
import { formatIDR } from "../utils/format";

export default function TransactionHistory({ transactions, isLoading }) {
  return (
    <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg flex flex-col h-[calc(100vh-12rem)] min-h-125">
      <div className="p-6 border-b border-white/10 flex justify-between items-center shrink-0">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <History className="h-5 w-5 text-slate-400" /> Riwayat Transaksi
        </h3>
      </div>

      <div className="p-6 overflow-y-auto flex-1 space-y-3 custom-scrollbar">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center text-slate-500 py-10">
            Belum ada transaksi.
          </div>
        ) : (
          transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-2 rounded-full shrink-0 ${
                    tx.type === "transfer_out"
                      ? "bg-red-500/20 text-red-400"
                      : "bg-green-500/20 text-green-400"
                  }`}
                >
                  {tx.type === "transfer_out" ? (
                    <ArrowUpRight className="h-5 w-5" />
                  ) : (
                    <ArrowDownLeft className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-200">
                    {tx.description}
                  </p>
                  <p className="text-xs text-slate-500">
                    {new Date(tx.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
              <div
                className={`font-semibold shrink-0 ${
                  tx.type === "transfer_out" ? "text-red-400" : "text-green-400"
                }`}
              >
                {tx.type === "transfer_out" ? "-" : "+"}
                {formatIDR(tx.amount)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
