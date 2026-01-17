import React, { useCallback, useEffect, useState } from "react";
import useAuthToken from "../hooks/AccessToken"
import useCategories from "../hooks/useCategories";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


const Budgets = () => {
    const CATEGORIES = useCategories();
    const { getAccessToken } = useAuthToken();

    const accessToken = getAccessToken();

    const [budgets, setBudgets] = useState({});
    const [expenses, setExpenses] = useState([]);
    const [error, setError] = useState("");

    const fetchBudgets = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/budget`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            const mapped = {};
            data.data.forEach(b => {
                mapped[b.category] = b.amount;
            });

            setBudgets(mapped);
        } catch (err) {
            setError(err.message);
        }
    }, [accessToken]);


    const fetchExpenses = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/expense`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            setExpenses(data.data);
        } catch (err) {
            setError(err.message);
        }
    }, [ accessToken]);


    useEffect(() => {
        fetchBudgets();
        fetchExpenses();
    }, [fetchBudgets, fetchExpenses]);

    /* -------- UPDATE BUDGET -------- */
    const updateBudget = async (category, value) => {
        const amount = Number(value);
        if (amount < 0) return;

        try {
            const res = await fetch(`${API_BASE_URL}/budget`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`
                },
                body: JSON.stringify({ category, amount })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            setBudgets(prev => ({ ...prev, [category]: amount }));
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="p-4 md:p-6">
            <h2 className="text-2xl font-semibold mb-6">Category Budgets</h2>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CATEGORIES.map(category => {
                    const spent = expenses
                        .filter(e => e.category === category)
                        .reduce((sum, e) => sum + Number(e.amount || 0), 0);

                    const budget = budgets[category] || 0;
                    const percentage = budget > 0 ? (spent / budget) * 100 : 0;

                    return (
                        <div key={category} className="bg-white p-6 rounded-lg shadow">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-semibold">{category}</h3>
                                <input
                                    type="number"
                                    placeholder="Set budget"
                                    value={budgets[category] || ""}
                                    onChange={(e) => updateBudget(category, e.target.value)}
                                    className="w-32 px-3 py-1 border rounded text-right"
                                />
                            </div>

                            <div className="mt-2">
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Spent: ₹{spent.toLocaleString()}</span>
                                    <span>Budget: ₹{budget.toLocaleString()}</span>
                                </div>

                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full ${percentage > 100
                                            ? "bg-red-600"
                                            : percentage > 80
                                                ? "bg-yellow-500"
                                                : "bg-green-600"
                                            }`}
                                        style={{ width: `${Math.min(percentage, 100)}%` }}
                                    />
                                </div>

                                <p className="text-sm text-gray-600 mt-1">
                                    {percentage.toFixed(1)}% used
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Budgets;
