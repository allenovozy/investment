"use client"

import { useEffect, useState } from "react"
import DataTable from "../components/DataTable"
import "../css/Transactions.css"
import "../css/Index.css"

const Transactions = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      const res = await fetch("https://72.60.93.14/server/Api/Admin/transactions/list.php", {
        credentials: "include",
      })
      const data = await res.json()
      setTransactions(data.transactions || [])
    } catch (err) {
      console.error("Error fetching transactions:", err)
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    { key: "id", label: "ID" },
    { key: "user_id", label: "User ID" },
    { key: "type", label: "Type" },
    {
      key: "amount",
      label: "Amount",
      render: (val, row) => `${val} ${row.currency}`,
    },
    {
      key: "status",
      label: "Status",
      render: (val) => <span className={`status-badge status-${val}`}>{val}</span>,
    },
    {
      key: "created_at",
      label: "Date",
      render: (val) => new Date(val).toLocaleDateString(),
    },
  ]

  return (
    <div className="transactions-page">
      <div className="page-header">
        <h1>Transactions</h1>
        <p>View and manage all user transactions</p>
      </div>

      {loading ? (
        <div className="loading">Loading transactions...</div>
      ) : (
        <div className="table-wrapper">
          <DataTable columns={columns} data={transactions} />
        </div>
      )}
    </div>
  )
}

export default Transactions
