import React, { useEffect, useState,useCallback } from "react";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid
} from "recharts";
import useAccessToken from "../hooks/AccessToken";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28EFF", "#FF6699"];

const Dashboard = () => {
    const { getAccessToken } = useAccessToken();
    const accessToken = getAccessToken();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [savings, setSavings] = useState(0);
    const [savingsPercentage, setSavingsPercentage] = useState(0);
    const [categoryExpenses, setCategoryExpenses] = useState([]);
    const [monthlyTrend, setMonthlyTrend] = useState([]);

    

    const fetchDashboard = useCallback(async () => {
        try {
            setLoading(true);

            const res = await fetch(`${API_BASE_URL}/dashboard`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            const {
                totalIncome,
                totalExpenses,
                savings,
                savingsPercentage,
                categoryExpenses,
                monthlyTrend
            } = data.data;

            setTotalIncome(totalIncome);
            setTotalExpenses(totalExpenses);
            setSavings(savings);
            setSavingsPercentage(savingsPercentage);
            setCategoryExpenses(categoryExpenses);
            setMonthlyTrend(monthlyTrend);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [ accessToken]);


    useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard]);

    if (loading) {
        return <p className="text-center py-10 text-gray-500">Loading dashboard...</p>;
    }

    if (error) {
        return <p className="text-center py-10 text-red-500">{error}</p>;
    }

    return (
        <div className="p-4 md:p-6">
            {/* SUMMARY CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-gray-600">Total Income</p>
                            <p className="text-2xl font-bold text-green-600">
                                ₹{totalIncome.toLocaleString()}
                            </p>
                        </div>
                        <TrendingUp className="text-green-600" size={32} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-gray-600">Total Expenses</p>
                            <p className="text-2xl font-bold text-red-600">
                                ₹{totalExpenses.toLocaleString()}
                            </p>
                        </div>
                        <TrendingDown className="text-red-600" size={32} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-gray-600">Savings</p>
                            <p className="text-2xl font-bold text-blue-600">
                                ₹{savings.toLocaleString()}
                            </p>
                        </div>
                        <DollarSign className="text-blue-600" size={32} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <p className="text-sm text-gray-600">Savings Rate</p>
                    <p className="text-2xl font-bold text-purple-600">
                        {savingsPercentage}%
                    </p>
                </div>
            </div>

            {/* CHARTS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* CATEGORY PIE */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">Category-wise Expenses</h3>

                    {categoryExpenses.length ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={categoryExpenses}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    label
                                >
                                    {categoryExpenses.map((_, index) => (
                                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-gray-500 text-center py-8">
                            No expense data available
                        </p>
                    )}
                </div>

                {/* MONTHLY TREND */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">Monthly Expense Trend</h3>

                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={monthlyTrend}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="expenses"
                                stroke="#8884d8"
                                strokeWidth={2}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
