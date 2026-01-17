import { useCallback, useEffect, useState } from "react";
import { Plus, X, Edit2, Trash2 } from "lucide-react";
import useAccessToken from "../hooks/AccessToken";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Income = () => {
    const defaultData = { source: "", amount: "", date: new Date().toISOString().split("T")[0], note: "" };

    const { getAccessToken } = useAccessToken();
    const accessToken = getAccessToken();

    const [incomeList, setIncomeList] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState(defaultData);


    const fetchIncome = useCallback(async () => {
        try {
            setLoading(true);

            const res = await fetch(`${API_BASE_URL}/income`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            setIncomeList(data.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [API_BASE_URL, accessToken]);


    useEffect(() => {
        fetchIncome();
    }, [fetchIncome]);

    /* ---------------- ADD / UPDATE ---------------- */
    const handleSubmit = async () => {
        console.log("Submitting form:", form);
        if (!form.source || !form.amount || !form.date) {
            setError("Source, amount and date are required");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const url = editingItem
                ? `${API_BASE_URL}/income/${editingItem._id}`
                : `${API_BASE_URL}/income`;

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
            setForm(defaultData);
            fetchIncome();
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
            source: item.source,
            amount: item.amount,
            date: item.date.split("T")[0],
            note: item.note || ""
        });
        setShowForm(true);
    };

    /* ---------------- DELETE ---------------- */
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this income?")) return;

        try {
            setLoading(true);
            const res = await fetch(`${API_BASE_URL}/income/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            fetchIncome();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleForm = (e) => {

        const { name, value } = e.target;
        console.log("Form change:", name, value);
        setForm({ ...form, [name]: value });
    }

    return (
        <div className="p-4 md:p-6">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <h2 className="text-2xl font-semibold">Income</h2>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                    <Plus size={18} /> Add Income
                </button>
            </div>

            {/* FORM */}
            {showForm && (
                <div className="bg-white p-5 rounded-xl shadow mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">
                            {editingItem ? "Edit Income" : "Add Income"}
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
                            className="border rounded-lg px-3 py-2"
                            placeholder="Source"
                            value={form.source}
                            onChange={handleForm}
                            name="source"
                        />
                        <input
                            type="number"
                            className="border rounded-lg px-3 py-2"
                            placeholder="Amount"
                            value={form.amount}
                            onChange={handleForm}
                            name="amount"
                        />
                        <input
                            type="date"
                            className="border rounded-lg px-3 py-2"
                            value={form.date}
                            onChange={handleForm}
                            name="date"
                        />
                        <input
                            className="border rounded-lg px-3 py-2"
                            placeholder="Note"
                            value={form.note}
                            onChange={handleForm}
                            name="note"
                        />
                    </div>

                    {error && <p className="text-red-500 mt-3">{error}</p>}

                    <button
                        onClick={handleSubmit}
                        className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
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
                            <th className="px-4 py-3 text-left">Source</th>
                            <th className="px-4 py-3 text-left">Amount</th>
                            <th className="px-4 py-3 text-left">Date</th>
                            <th className="px-4 py-3 text-left">Note</th>
                            <th className="px-4 py-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {incomeList.map((item) => (
                            <tr key={item._id}>
                                <td className="px-4 py-3">{item.source}</td>
                                <td className="px-4 py-3 text-green-600 font-semibold">
                                    ₹{Number(item.amount).toLocaleString()}
                                </td>
                                <td className="px-4 py-3">
                                    {new Date(item.date).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-3">{item.note}</td>
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

                {!incomeList.length && !loading && (
                    <p className="text-center py-6 text-gray-500">No income added yet</p>
                )}
            </div>
        </div>
    );
};

export default Income;
