"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard-layout";
import BalanceDisplay from "@/components/balance-display";
import TransactionList from "@/components/transaction-list";

export default function WithdrawPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState("bank");
  const [currency, setCurrency] = useState("USD");
  const [loading, setLoading] = useState(true);

  // extra fields
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [cryptoNetwork, setCryptoNetwork] = useState("");
  const [cryptoAddress, setCryptoAddress] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");
  const [selectedCard, setSelectedCard] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, txRes] = await Promise.all([
          fetch("https://72.60.93.14/server/Api/dashboard.php", {
            method: "GET",
            credentials: "include",
          }),
          fetch("https://72.60.93.14/server/Api/withdraw.php", {
            method: "GET",
            credentials: "include",
          }),
        ]);

        if (userRes.status === 401 || txRes.status === 401) {
          router.replace("/login");
          return;
        }

        const userData = await userRes.json();
        const txData = await txRes.json();

        if (!userData.success) throw new Error(userData.message);
        if (txData.status !== "success") throw new Error(txData.message);

        setUser(userData.user);
        setTransactions(txData.transactions ?? []);
      } catch (err) {
        alert("Failed to load withdraw page: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted">Loading withdraw page...</p>
      </div>
    );
  }

  if (!user) return null;

  const balances = [
    { id: "usd", name: "US Dollar", color: "from-green-500/20 to-green-500/5", symbol: "USD", icon: "$", balance: user.usd_balance },
    { id: "eur", name: "Euro", color: "from-blue-500/20 to-blue-500/5", symbol: "EUR", icon: "€", balance: user.eur_balance },
    { id: "gbp", name: "British Pound", color: "from-purple-500/20 to-purple-500/5", symbol: "GBP", icon: "£", balance: user.gbp_balance },
    { id: "ngn", name: "Naira", color: "from-primary/20 to-primary/5", symbol: "NGN", icon: "₦", balance: user.ngn_balance },
    { id: "inr", name: "Indian Rupee", color: "from-orange-500/20 to-orange-500/5", symbol: "INR", icon: "₹", balance: user.inr_balance },
  ];

  const handleWithdraw = async () => {
    if (!amount || parseFloat(amount) <= 0) return;

    let details = {};
    if (withdrawMethod === "bank") {
      details = { bankName, accountNumber };
    } else if (withdrawMethod === "crypto") {
      details = { cryptoNetwork, cryptoAddress };
    } else if (withdrawMethod === "paypal") {
      details = { paypalEmail };
    } else if (withdrawMethod === "card") {
      details = { cardId: selectedCard };
    }

    try {
      const res = await fetch("https://72.60.93.14/server/Api/withdraw.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          amount: parseFloat(amount),
          currency,
          method: withdrawMethod,
          details,
        }),
      });

      const data = await res.json();
      if (data.status === "success") {
        alert("Withdrawal pending, processed in 30 minutes");
        setAmount("");
        const txRes = await fetch("https://72.60.93.14/server/Api/withdraw.php", {
          method: "GET",
          credentials: "include",
        });
        const txData = await txRes.json();
        if (txData.status === "success") setTransactions(txData.transactions);
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Error submitting withdrawal: " + err.message);
    }
  };

  return (
    <DashboardLayout user={user}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h1 className="text-2xl font-bold mb-6">Withdraw Funds</h1>
          <BalanceDisplay balances={balances} />

          <div className="bg-surface rounded-xl p-6 mb-6">
            {/* Currency */}
            <div className="mb-6">
              <label className="block text-sm text-muted mb-2">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border"
              >
                {balances.map((b) => (
                  <option key={b.id} value={b.symbol}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Method */}
            <div className="mb-6">
              <label className="block text-sm text-muted mb-2">Withdrawal Method</label>
              <select
                value={withdrawMethod}
                onChange={(e) => setWithdrawMethod(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border"
              >
                <option value="bank">Bank Transfer</option>
                <option value="paypal">PayPal</option>
                <option value="crypto">Cryptocurrency</option>
                <option value="card">Card</option>
              </select>
            </div>

            {/* Conditional fields */}
            {withdrawMethod === "bank" && (
              <>
                <div className="mb-6">
                  <label className="block text-sm text-muted mb-2">Bank Name</label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm text-muted mb-2">Account Number</label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border"
                  />
                </div>
              </>
            )}

            {withdrawMethod === "crypto" && (
              <>
                <div className="mb-6">
                  <label className="block text-sm text-muted mb-2">Crypto Network</label>
                  <select
                    value={cryptoNetwork}
                    onChange={(e) => setCryptoNetwork(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border"
                  >
                    <option value="">Select Network</option>
                    <option value="BTC">Bitcoin</option>
                    <option value="ETH">Ethereum</option>
                    <option value="BNB">Binance Smart Chain</option>
                  </select>
                </div>
                <div className="mb-6">
                  <label className="block text-sm text-muted mb-2">Wallet Address</label>
                  <input
                    type="text"
                    value={cryptoAddress}
                    onChange={(e) => setCryptoAddress(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border"
                  />
                </div>
              </>
            )}

            {withdrawMethod === "paypal" && (
              <div className="mb-6">
                <label className="block text-sm text-muted mb-2">PayPal Email</label>
                <input
                  type="email"
                  value={paypalEmail}
                  onChange={(e) => setPaypalEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border"
                />
              </div>
            )}

            {withdrawMethod === "card" && (
              <div className="mb-6">
                <label className="block text-sm text-muted mb-2">Select Saved Card</label>
                <select
                  value={selectedCard}
                  onChange={(e) => setSelectedCard(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border"
                >
                  <option value="">Select Card</option>
                  {user.cards?.map((card) => (
                    <option key={card.id} value={card.id}>
                      {card.brand} ****{card.last4}
                    </option>
                  ))}
                </select>
                           </div>
            )}

            {/* Amount */}
            <div className="mb-6">
              <label className="block text-sm text-muted mb-2">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border"
              />
            </div>

            {/* Submit button */}
            <button
              onClick={handleWithdraw}
              disabled={!amount || parseFloat(amount) <= 0}
              className="w-full py-4 bg-primary text-background font-semibold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              Request Withdrawal
            </button>
          </div>
        </div>

        {/* Transaction history */}
        <div>
          <TransactionList
            transactions={transactions}
            title="Withdraw Transaction History"
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
