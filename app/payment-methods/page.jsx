"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout";
import { Plus, Trash2, Building2 } from "lucide-react";

export default function PaymentMethodsPage() {
  const router = useRouter()
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("cards");
  const [showCardBack, setShowCardBack] = useState("cards");
  const [cards, setCards] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [showAddCard, setShowAddCard] = useState(false);
  const [showAddBank, setShowAddBank] = useState(false);
  const [newCard, setNewCard] = useState({ number: "", expiry: "", cvc: "", name: "" });
  const [newBank, setNewBank] = useState({ bankName: "", accountNumber: "", accountName: "" });

  // ✅ Fetch payment methods from backend
  useEffect(() => {
    const loadPaymentMethods = async () => {
      try {
        const res = await fetch("https://faitcurrency.online/server/Api/get_payment_method.php", {
          method: "GET",
          credentials: "include",
        });

        if (res.status === 401) {
          router.replace("/login")
          return
        }

        const data = await res.json();

        if (!data.success) {
          if (data.message === "Session expired due to inactivity") {
            router.replace("/login")
            return
          }
          throw new Error(data.message)
        }

        setUser(data.user)
        setCards(data.cards ?? []);
        setBankAccounts(data.bankAccounts ?? []);
        } catch (err) {
        alert("Error loading payment methods");
      }
    };

    loadPaymentMethods();
  }, [router]);

  const handleAddCard = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://faitcurrency.online/server/Api/add_card.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newCard),
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        // refresh list from DB
        setCards([...cards, {
          id: Date.now(),
          type: newCard.number.startsWith("4") ? "visa" : "mastercard",
          last4: newCard.number.slice(-4),
          expiry: newCard.expiry,
          name: newCard.name,
          number: `**** **** **** ${newCard.number.slice(-4)}`,
        }]);
        setNewCard({ number: "", expiry: "", cvc: "", name: "" });
        setShowAddCard(false);
      } else {
        alert(data.message);
      }
    } catch {
      alert("Error adding card");
    }
  };

  const handleAddBank = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://faitcurrency.online/server/Api/add_bank.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newBank),
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        setBankAccounts([...bankAccounts, {
          id: Date.now(),
          ...newBank,
          accountNumber: `****${newBank.accountNumber.slice(-4)}`,
        }]);
        setNewBank({ bankName: "", accountNumber: "", accountName: "" });
        setShowAddBank(false);
      } else {
        alert(data.message);
      }
    } catch {
      alert("Error adding bank account");
    }
  };

  const removeCard = (id) => setCards(cards.filter((c) => c.id !== id));
  const removeBank = (id) => setBankAccounts(bankAccounts.filter((b) => b.id !== id));

  return (
    <DashboardLayout user={user}>
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold">Payment Methods</h1>
          <button
            onClick={() => (activeTab === "cards" ? setShowAddCard(true) : setShowAddBank(true))}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-background font-medium rounded-lg hover:bg-primary-dark transition-colors"
          >
            <Plus size={18} />
            Add {activeTab === "cards" ? "Card" : "Bank"}
          </button>
        </div>

        <div className="flex border-b border-border mb-6">
          {["cards", "banks"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-sm font-medium capitalize transition-colors
                ${activeTab === tab ? "text-primary border-b-2 border-primary" : "text-muted hover:text-foreground"}`}
            >
              {tab === "cards" ? "Credit/Debit Cards" : "Bank Accounts"}
            </button>
          ))}
        </div>

        {activeTab === "cards" ? (
          <div className="flex flex-col gap-4">
            {cards.length === 0 ? (
              <div className="bg-surface rounded-xl p-8 text-center text-muted">
                No cards added yet. Click "Add Card" to get started.
              </div>
            ) : (
              cards.map((card) => (
                <div key={card.id} className="bg-surface rounded-xl p-5">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Card Preview */}
                    <div
                      className="relative w-full sm:w-72 h-44 rounded-xl p-4 flex flex-col justify-between cursor-pointer perspective-1000"
                      onClick={() => setShowCardBack(!showCardBack)}
                      style={{
                        background:
                          card.type === "visa"
                            ? "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)"
                            : "linear-gradient(135deg, #2d1b4e 0%, #1a1a2e 50%, #16213e 100%)",
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div className="w-10 h-8 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded" />
                        <span className="text-white/80 text-xs uppercase">{card.type}</span>
                      </div>
                      <div>
                        <p className="text-white font-mono text-lg tracking-wider mb-3">{card.number}</p>
                        <div className="flex justify-between text-white/80 text-sm">
                          <div>
                            <p className="text-[10px] uppercase">Card Holder</p>
                            <p className="font-medium">{card.name}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] uppercase">Expires</p>
                            <p className="font-medium">{card.expiry}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <p className="font-medium capitalize mb-1">{card.type} Card</p>
                        <p className="text-sm text-muted">Ending in {card.last4}</p>
                      </div>
                      <button
                        onClick={() => removeCard(card.id)}
                        className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors text-sm mt-4"
                      >
                        <Trash2 size={16} />
                        Remove Card
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {bankAccounts.length === 0 ? (
              <div className="bg-surface rounded-xl p-8 text-center text-muted">
                No bank accounts added yet. Click "Add Bank" to get started.
              </div>
            ) : (
              bankAccounts.map((bank) => (
                <div key={bank.id} className="bg-surface rounded-xl p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <Building2 size={24} className="text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium">{bank.bankName}</p>
                      <p className="text-sm text-muted">
                        {bank.accountNumber} - {bank.accountName}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeBank(bank.id)}
                    className="p-2 text-muted hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* Add Card Modal */}
        {showAddCard && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-surface rounded-xl p-6 w-full max-w-lg">
              <h2 className="text-xl font-semibold mb-6">Add New Card</h2>

              {/* Card Preview */}
              <div
                className="w-full h-48 rounded-xl p-5 flex flex-col justify-between mb-6"
                style={{
                  background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
                }}
              >
                <div className="flex justify-between items-start">
                  <div className="w-12 h-9 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded" />
                  <div className="w-8 h-8 bg-white/10 rounded-full" />
                </div>
                <div>
                  <p className="text-white font-mono text-xl tracking-wider mb-4">
                    {newCard.number || "**** **** **** ****"}
                  </p>
                  <div className="flex justify-between text-white/80 text-sm">
                    <div>
                      <p className="text-[10px] uppercase">Card Holder</p>
                      <p className="font-medium">{newCard.name || "Your Name Here"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase">Expires</p>
                      <p className="font-medium">{newCard.expiry || "**/**"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <form onSubmit={handleAddCard} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm text-muted mb-2">Card Number</label>
                  <input
                    type="text"
                    value={newCard.number}
                    onChange={(e) => setNewCard({ ...newCard, number: (e.target.value) })}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className="w-full px-4 py-3 bg-surface-light rounded-xl border border-border focus:border-primary outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted mb-2">Cardholder Name</label>
                  <input
                    type="text"
                    value={newCard.name}
                    onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 bg-surface-light rounded-xl border border-border focus:border-primary outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-muted mb-2">Expiry Date</label>
                    <input
                      type="text"
                      value={newCard.expiry}
                      onChange={(e) => setNewCard({ ...newCard, expiry:(e.target.value) })}
                      placeholder="MM/YY"
                      maxLength={5}
                      className="w-full px-4 py-3 bg-surface-light rounded-xl border border-border focus:border-primary outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted mb-2">CVC</label>
                    <input
                      type="text"
                      value={newCard.cvc}
                      onChange={(e) => setNewCard({ ...newCard, cvc: e.target.value.replace(/\D/g, "") })}
                      placeholder="123"
                      maxLength={4}
                      className="w-full px-4 py-3 bg-surface-light rounded-xl border border-border focus:border-primary outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddCard(false)}
                    className="flex-1 py-3 bg-surface-light rounded-xl hover:bg-border transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-primary text-background font-semibold rounded-xl hover:bg-primary-dark transition-colors"
                  >
                    Add Card
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Bank Modal */}
        {showAddBank && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-surface rounded-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Add Bank Account</h2>

              <form onSubmit={handleAddBank} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm text-muted mb-2">Bank Name</label>
                  <input
                    type="text"
                    value={newBank.bankName}
                    onChange={(e) => setNewBank({ ...newBank, bankName: e.target.value })}
                    placeholder="First Bank"
                    className="w-full px-4 py-3 bg-surface-light rounded-xl border border-border focus:border-primary outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted mb-2">Account Number</label>
                  <input
                    type="text"
                    value={newBank.accountNumber}
                    onChange={(e) => setNewBank({ ...newBank, accountNumber: e.target.value.replace(/\D/g, "") })}
                    placeholder="1234567890"
                    maxLength={10}
                    className="w-full px-4 py-3 bg-surface-light rounded-xl border border-border focus:border-primary outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted mb-2">Account Name</label>
                  <input
                    type="text"
                    value={newBank.accountName}
                    onChange={(e) => setNewBank({ ...newBank, accountName: e.target.value })}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 bg-surface-light rounded-xl border border-border focus:border-primary outline-none"
                    required
                  />
                </div>

                <div className="flex gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddBank(false)}
                    className="flex-1 py-3 bg-surface-light rounded-xl hover:bg-border transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-primary text-background font-semibold rounded-xl hover:bg-primary-dark transition-colors"
                  >
                    Add Bank
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
