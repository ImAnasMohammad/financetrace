import React from 'react'
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts'
// import { useAppContext } from '../context/AppContext'
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28EFF', '#FF6699']


// totalIncome,
//     totalExpenses,
//     savings,
//     savingsPercentage,
//     categoryExpenses,
//     categoryExpenses,
//     categoryExpenses,
//     getMonthlyTrend
const Dashboard = ({
    totalIncome,
    totalExpenses,
    savings,
    savingsPercentage,
    categoryExpenses,
    getMonthlyTrend

}) => {
    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Income</p>
                            <p className="text-2xl font-bold text-green-600">₹{totalIncome.toLocaleString()}</p>
                        </div>
                        <TrendingUp className="text-green-600" size={32} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Expenses</p>
                            <p className="text-2xl font-bold text-red-600">₹{totalExpenses.toLocaleString()}</p>
                        </div>
                        <TrendingDown className="text-red-600" size={32} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Savings</p>
                            <p className="text-2xl font-bold text-blue-600">₹{savings.toLocaleString()}</p>
                        </div>
                        <DollarSign className="text-blue-600" size={32} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div>
                        <p className="text-sm text-gray-600">Savings Rate</p>
                        <p className="text-2xl font-bold text-purple-600">{savingsPercentage}%</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">Category-wise Expenses</h3>
                    {categoryExpenses.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={categoryExpenses} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                    {categoryExpenses.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-gray-500 text-center py-8">No expense data available</p>
                    )}
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">Monthly Expense Trend</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={getMonthlyTrend()}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="expenses" stroke="#8884d8" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}

export default Dashboard