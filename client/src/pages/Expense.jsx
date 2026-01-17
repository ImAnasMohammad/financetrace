import React, { useCallback, useEffect, useState } from "react";
import { Plus, X, Edit2, Trash2 } from "lucide-react";
import useAuthToken from "../hooks/AccessToken";
import useCategories from "../hooks/useCategories";
import usePayments from "../hooks/usePayments";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Expense = () => {

    const PAYMENT_MODES = usePayments();
    const CATEGORIES = useCategories();
    const { getAccessToken } = useAuthToken();
    const accessToken = getAccessToken();

    const [expenses, setExpenses] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        amount: "",
        category: CATEGORIES[0],
        date: new Date().toISOString().split("T")[0],
        paymentMode: PAYMENT_MODES[0],
        notes: ""
    });

    /* ---------------- FETCH EXPENSES ---------------- */

    const fetchExpenses = useCallback(async () => {
        try {
            setLoading(true);

            const res = await fetch(`${API_BASE_URL}/expense`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            setExpenses(data.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [ accessToken]);


    useEffect(() => {
        fetchExpenses();
    }, [fetchExpenses]);

    /* ---------------- ADD / UPDATE ---------------- */
    const handleSubmit = async () => {
        if (!form.amount || !form.date) {
            setError("Amount and date are required");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const url = editingItem
                ? `${API_BASE_URL}/expense/${editingItem._id}`
                : `${API_BASE_URL}/expense`;

            const method = editingItem ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`
                },
                body: JSON.stringify(form)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            setShowForm(false);
            setEditingItem(null);
            setForm({
                amount: "",
                category: CATEGORIES[0],
                date: new Date().toISOString().split("T")[0],
                paymentMode: PAYMENT_MODES[0],
                notes: ""
            });

            fetchExpenses();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    /* ---------------- EDIT ---------------- */
    const handleEdit = (item) => {
        setEditingItem(item);
        setForm({
            amount: item.amount,
            category: item.category,
            date: item.date.split("T")[0],
            paymentMode: item.paymentMode,
            notes: item.notes || ""
        });
        setShowForm(true);
    };

    /* ---------------- DELETE ---------------- */
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this expense?")) return;

        try {
            setLoading(true);
            const res = await fetch(`${API_BASE_URL}/expense/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            fetchExpenses();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 md:p-6">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <h2 className="text-2xl font-semibold">Expenses</h2>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                    <Plus size={18} /> Add Expense
                </button>
            </div>

            {/* FORM */}
            {showForm && (
                <div className="bg-white p-5 rounded-xl shadow mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">
                            {editingItem ? "Edit Expense" : "Add Expense"}
                        </h3>
                        <button
                            onClick={() => {
                                setShowForm(false);
                                setEditingItem(null);
                            }}
                        >
                            <X />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="number"
                            placeholder="Amount"
                            className="border rounded-lg px-3 py-2"
                            value={form.amount}
                            onChange={(e) => setForm({ ...form, amount: e.target.value })}
                        />

                        <select
                            className="border rounded-lg px-3 py-2"
                            value={form.category}
                            onChange={(e) => setForm({ ...form, category: e.target.value })}
                        >
                            {CATEGORIES.map((cat) => (
                                <option key={cat}>{cat}</option>
                            ))}
                        </select>

                        <input
                            type="date"
                            className="border rounded-lg px-3 py-2"
                            value={form.date}
                            onChange={(e) => setForm({ ...form, date: e.target.value })}
                        />

                        <select
                            className="border rounded-lg px-3 py-2"
                            value={form.paymentMode}
                            onChange={(e) => setForm({ ...form, paymentMode: e.target.value })}
                        >
                            {PAYMENT_MODES.map((mode) => (
                                <option key={mode}>{mode}</option>
                            ))}
                        </select>

                        <input
                            placeholder="Notes"
                            className="border rounded-lg px-3 py-2 md:col-span-2"
                            value={form.notes}
                            onChange={(e) => setForm({ ...form, notes: e.target.value })}
                        />
                    </div>

                    {error && <p className="text-red-500 mt-3">{error}</p>}

                    <button
                        onClick={handleSubmit}
                        className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                        {loading ? "Saving..." : editingItem ? "Update" : "Add"}
                    </button>
                </div>
            )}

            {/* TABLE */}
            <div className="bg-white rounded-xl shadow overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left">Amount</th>
                            <th className="px-4 py-3 text-left">Category</th>
                            <th className="px-4 py-3 text-left">Date</th>
                            <th className="px-4 py-3 text-left">Payment</th>
                            <th className="px-4 py-3 text-left">Notes</th>
                            <th className="px-4 py-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {expenses.map((item) => (
                            <tr key={item._id}>
                                <td className="px-4 py-3 text-red-600 font-semibold">
                                    ₹{Number(item.amount).toLocaleString()}
                                </td>
                                <td className="px-4 py-3">{item.category}</td>
                                <td className="px-4 py-3">
                                    {new Date(item.date).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-3">{item.paymentMode}</td>
                                <td className="px-4 py-3">{item.notes}</td>
                                <td className="px-4 py-3 flex gap-3">
                                    <button onClick={() => handleEdit(item)} className="text-blue-600">
                                        <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(item._id)} className="text-red-600">
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {!expenses.length && !loading && (
                    <p className="text-center py-6 text-gray-500">
                        No expenses added yet
                    </p>
                )}
            </div>
        </div>
    );
};

export default Expense;
