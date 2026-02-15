"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import { Gift, TrendingUp, Users, Wallet, CheckCircle } from "lucide-react";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Fetch user and tasks
  const fetchUser = async () => {
    const res = await fetch("https://faitcurrency.online/server/Api/dashboard.php", {
      credentials: "include",
    });
    const data = await res.json();
    if (data.success) setUser(data.user);
  };

  const fetchTasks = async () => {
    const res = await fetch("https://faitcurrency.online/server/Api/tasks.php", {
      credentials: "include",
    });
    const data = await res.json();
    if (data.success) {
      const normalized = data.tasks.map((t) => ({
        id: t.id,
        title: t.title,
        description: t.description,
        reward: Number(t.reward),
        currency: "USD", // assuming reward is always USD
        completed: !!t.completed, // ✅ include completed flag
      }));
      setTasks(normalized);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchUser();
      await fetchTasks();
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <DashboardLayout user={user}>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Task Center</h1>

        {loading ? (
          <p>Loading tasks...</p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-surface rounded-xl p-5">
                <p className="text-muted text-sm mb-1">Total Tasks</p>
                <p className="text-2xl font-bold">{tasks.length}</p>
              </div>
              <div className="bg-surface rounded-xl p-5">
                <p className="text-muted text-sm mb-1">Rewards Earned</p>
                <p className="text-2xl font-bold text-primary">
                  {user?.earnings ?? 0}
                </p>
              </div>
            </div>

            <div className="bg-surface rounded-xl p-6">
              <h2 className="font-semibold mb-4">Tasks</h2>
              <div className="flex flex-col gap-4">
                {tasks.length === 0 ? (
                  <p className="text-muted">No tasks available right now.</p>
                ) : (
                  tasks.map((task) => {
                    const IconMap = { Users, Wallet, TrendingUp, Gift };
                    const Icon =
                      IconMap[
                        task.title.includes("Profile")
                          ? "Users"
                          : task.title.includes("Deposit")
                          ? "Wallet"
                          : task.title.includes("Investment")
                          ? "TrendingUp"
                          : task.title.includes("Daily")
                          ? "Gift"
                          : "Users"
                      ];
                    return (
                      <div
                        key={task.id}
                        className={`flex items-center gap-4 p-4 rounded-xl border border-border ${
                          task.completed ? "bg-gray-100 opacity-70" : "bg-surface-light"
                        }`}
                      >
                        <div className="p-2 rounded-lg bg-primary/20">
                          <Icon size={20} className="text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{task.title}</p>
                          <p className="text-sm text-muted">{task.description}</p>
                        </div>
                        <div className="text-right">
                          {task.completed ? (
                            <div className="flex items-center gap-1 text-success font-semibold">
                              <CheckCircle size={16} /> Completed
                            </div>
                          ) : (
                            <p className="font-semibold text-primary">
                              +${task.reward} {task.currency}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
