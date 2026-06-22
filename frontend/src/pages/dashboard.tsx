import { useEffect, useState } from "react";

function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/dashboard")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error(err));

    fetch("http://127.0.0.1:8000/transactions")
      .then((res) => res.json())
      .then((data) => setTransactions(data))
      .catch((err) => console.error(err));
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">

      {/* Navbar */}
      <nav className="bg-white shadow px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">
          Finance AI Coach
        </h1>

        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Upload Statement
        </button>
      </nav>

      <div className="p-8">

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6">

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-gray-500">Income</h2>
            <p className="text-3xl font-bold text-green-600">
              ₹{data.income}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-gray-500">Expense</h2>
            <p className="text-3xl font-bold text-red-600">
              ₹{data.expense}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-gray-500">Savings</h2>
            <p className="text-3xl font-bold text-blue-600">
              ₹{data.savings}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-gray-500">Transactions</h2>
            <p className="text-3xl font-bold text-purple-600">
              {transactions.length}
            </p>
          </div>

        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-xl shadow p-6 mt-8">

          <h2 className="text-xl font-semibold mb-4">
            Recent Transactions
          </h2>

          <table className="w-full">

            <thead>
              <tr className="border-b">
                <th className="text-left py-3">Description</th>
                <th className="text-left py-3">Amount</th>
                <th className="text-left py-3">Category</th>
              </tr>
            </thead>

            <tbody>

              {transactions.length > 0 ? (

                transactions.map((t) => (

                  <tr
                    key={t.id}
                    className="border-b"
                  >
                    <td className="py-3">
                      {t.description}
                    </td>

                    <td>
                      ₹{t.amount}
                    </td>

                    <td>
                      {t.category}
                    </td>
                  </tr>

                ))

              ) : (

                <tr>
                  <td
                    colSpan={3}
                    className="text-center py-4"
                  >
                    No transactions found
                  </td>
                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>
    </div>
  );
}

export default Dashboard;