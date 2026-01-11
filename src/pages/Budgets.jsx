import React from 'react'

const Budgets = ({
    categories,
    budgets,
    filteredExpenses,
    updateBudget
}) => {
    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Category Budgets</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map(category => {
                    const spent = filteredExpenses
                        .filter(e => e.category === category)
                        .reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
                    const budget = budgets[category] || 0;
                    const percentage = budget > 0 ? (spent / budget) * 100 : 0;

                    return (
                        <div key={category} className="bg-white p-6 rounded-lg shadow">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-semibold">{category}</h3>
                                <input
                                    type="number"
                                    placeholder="Set budget"
                                    value={budgets[category] || ''}
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
                                        className={`h-2 rounded-full ${percentage > 100 ? 'bg-red-600' : percentage > 80 ? 'bg-yellow-500' : 'bg-green-600'}`}
                                        style={{ width: `${Math.min(percentage, 100)}%` }}
                                    />
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{percentage.toFixed(1)}% used</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default Budgets