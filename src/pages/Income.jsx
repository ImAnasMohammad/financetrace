import React from 'react'
import { Plus, X, Edit2, Trash2 } from 'lucide-react'


const Income = ({
    showIncomeForm,
    setShowIncomeForm,
    incomeForm,
    setIncomeForm,
    addIncome,
    filteredIncome,
    editIncome,
    deleteIncome,
    editingItem,
    setEditingItem
}) => {
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Income Entries</h2>
                <button onClick={() => setShowIncomeForm(true)} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    <Plus size={18} />
                    Add Income
                </button>
            </div>

            {showIncomeForm && (
                <div className="bg-white p-6 rounded-lg shadow mb-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">{editingItem ? 'Edit Income' : 'Add Income'}</h3>
                        <button onClick={() => { setShowIncomeForm(false); setEditingItem(null); }} className="text-gray-500 hover:text-gray-700">
                            <X size={20} />
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="Source" value={incomeForm.source} onChange={(e) => setIncomeForm({ ...incomeForm, source: e.target.value })} className="px-4 py-2 border rounded-lg" />
                        <input type="number" placeholder="Amount" value={incomeForm.amount} onChange={(e) => setIncomeForm({ ...incomeForm, amount: e.target.value })} className="px-4 py-2 border rounded-lg" />
                        <input type="date" value={incomeForm.date} onChange={(e) => setIncomeForm({ ...incomeForm, date: e.target.value })} className="px-4 py-2 border rounded-lg" />
                        <input type="text" placeholder="Notes" value={incomeForm.notes} onChange={(e) => setIncomeForm({ ...incomeForm, notes: e.target.value })} className="px-4 py-2 border rounded-lg" />
                    </div>
                    <button onClick={addIncome} className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                        {editingItem ? 'Update' : 'Add'}
                    </button>
                </div>
            )}

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredIncome.map(item => (
                            <tr key={item.id}>
                                <td className="px-6 py-4">{item.source}</td>
                                <td className="px-6 py-4 text-green-600 font-semibold">₹{parseFloat(item.amount).toLocaleString()}</td>
                                <td className="px-6 py-4">{item.date}</td>
                                <td className="px-6 py-4">{item.notes}</td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        <button onClick={() => editIncome(item)} className="text-blue-600 hover:text-blue-800">
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={() => deleteIncome(item.id)} className="text-red-600 hover:text-red-800">
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

export default Income