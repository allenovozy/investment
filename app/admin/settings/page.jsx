"use client"
import AdminLayout from "../layout"

export default function AdminSettings() {
  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <div className="space-y-3">
        <p className="text-gray-700">Keep DB defaults numeric to avoid NULL math:</p>
        <pre className="bg-gray-100 p-3 rounded text-sm">
{`ALTER TABLE users 
  MODIFY usd_balance DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  MODIFY ngn_balance DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  MODIFY gbp_balance DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  MODIFY eur_balance DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  MODIFY inr_balance DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  MODIFY earnings DECIMAL(12,2) NOT NULL DEFAULT 0.00;`}
        </pre>
      </div>
    </AdminLayout>
  )
}