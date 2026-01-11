import React from 'react'
import { Plus, X, Edit2, Trash2 } from 'lucide-react'


const Expense = ({
    showExpenseForm,
    setShowExpenseForm,
    expenseForm,
    setExpenseForm,
    addExpense,
    filteredExpenses,
    editExpense,
    deleteExpense,
    editingItem,
    setEditingItem,
    categories,
    PAYMENT_MODES
}) => {
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Expense Entries</h2>
                <button onClick={() => setShowExpenseForm(true)} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                    <Plus size={18} />
                    Add Expense
                </button>
            </div>

            {showExpenseForm && (
                <div className="bg-white p-6 rounded-lg shadow mb-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">{editingItem ? 'Edit Expense' : 'Add Expense'}</h3>
                        <button onClick={() => { setShowExpenseForm(false); setEditingItem(null); }} className="text-gray-500 hover:text-gray-700">
                            <X size={20} />
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <input type="number" placeholder="Amount" value={expenseForm.amount} onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })} className="px-4 py-2 border rounded-lg" />
                        <select value={expenseForm.category} onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })} className="px-4 py-2 border rounded-lg">
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                        <input type="date" value={expenseForm.date} onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })} className="px-4 py-2 border rounded-lg" />
                        <select value={expenseForm.paymentMode} onChange={(e) => setExpenseForm({ ...expenseForm, paymentMode: e.target.value })} className="px-4 py-2 border rounded-lg">
                            {PAYMENT_MODES.map(mode => <option key={mode} value={mode}>{mode}</option>)}
                        </select>
                        <input type="text" placeholder="Notes" value={expenseForm.notes} onChange={(e) => setExpenseForm({ ...expenseForm, notes: e.target.value })} className="px-4 py-2 border rounded-lg col-span-2" />
                    </div>
                    <button onClick={addExpense} className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                        {editingItem ? 'Update' : 'Add'}
                    </button>
                </div>
            )}

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredExpenses.map(item => (
                            <tr key={item.id}>
                                <td className="px-6 py-4 text-red-600 font-semibold">₹{parseFloat(item.amount).toLocaleString()}</td>
                                <td className="px-6 py-4">{item.category}</td>
                                <td className="px-6 py-4">{item.date}</td>
                                <td className="px-6 py-4">{item.paymentMode}</td>
                                <td className="px-6 py-4">{item.notes}</td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        <button onClick={() => editExpense(item)} className="text-blue-600 hover:text-blue-800">
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={() => deleteExpense(item.id)} className="text-red-600 hover:text-red-800">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Expense