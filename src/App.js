import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Upload, Download, Plus, Edit2, Trash2, Save, X, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

const CATEGORIES = ['Food', 'Fashion', 'Travel', 'Rent', 'Utilities', 'Stocks', 'Investments', 'Others'];
const PAYMENT_MODES = ['UPI', 'Cash', 'Card'];
const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'];

export default function ExpenseTracker() {
  const [income, setIncome] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState({});
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingItem, setEditingItem] = useState(null);
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1);
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showBudgetForm, setShowBudgetForm] = useState(false);

  const [incomeForm, setIncomeForm] = useState({
    source: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const [expenseForm, setExpenseForm] = useState({
    amount: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0],
    paymentMode: 'UPI',
    notes: ''
  });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const workbook = XLSX.read(event.target.result, { type: 'binary' });
        
        if (workbook.SheetNames.includes('Income')) {
          const incomeSheet = XLSX.utils.sheet_to_json(workbook.Sheets['Income']);
          setIncome(incomeSheet.map((item, idx) => ({ ...item, id: idx + 1 })));
        }
        
        if (workbook.SheetNames.includes('Expenses')) {
          const expenseSheet = XLSX.utils.sheet_to_json(workbook.Sheets['Expenses']);
          setExpenses(expenseSheet.map((item, idx) => ({ ...item, id: idx + 1 })));
        }
        
        if (workbook.SheetNames.includes('Budgets')) {
          const budgetSheet = XLSX.utils.sheet_to_json(workbook.Sheets['Budgets']);
          const budgetObj = {};
          budgetSheet.forEach(item => {
            budgetObj[item.Category] = item.Budget;
          });
          setBudgets(budgetObj);
        }
      } catch (error) {
        alert('Error reading file. Please upload a valid Excel file.');
      }
    };
    reader.readAsBinaryString(file);
  };

  const downloadExcel = () => {
    const wb = XLSX.utils.book_new();
    
    const incomeSheet = XLSX.utils.json_to_sheet(income.map(({ id, ...rest }) => rest));
    XLSX.utils.book_append_sheet(wb, incomeSheet, 'Income');
    
    const expenseSheet = XLSX.utils.json_to_sheet(expenses.map(({ id, ...rest }) => rest));
    XLSX.utils.book_append_sheet(wb, expenseSheet, 'Expenses');
    
    const budgetData = Object.entries(budgets).map(([category, budget]) => ({
      Category: category,
      Budget: budget
    }));
    const budgetSheet = XLSX.utils.json_to_sheet(budgetData);
    XLSX.utils.book_append_sheet(wb, budgetSheet, 'Budgets');
    
    XLSX.writeFile(wb, 'expense_tracker.xlsx');
  };

  const addIncome = () => {
    if (!incomeForm.source || !incomeForm.amount) return;
    
    if (editingItem && editingItem.type === 'income') {
      setIncome(income.map(item => 
        item.id === editingItem.id 
          ? { ...incomeForm, amount: parseFloat(incomeForm.amount), id: item.id }
          : item
      ));
      setEditingItem(null);
    } else {
      const newIncome = {
        id: income.length + 1,
        source: incomeForm.source,
        amount: parseFloat(incomeForm.amount),
        date: incomeForm.date,
        notes: incomeForm.notes
      };
      setIncome([...income, newIncome]);
    }
    
    setIncomeForm({ source: '', amount: '', date: new Date().toISOString().split('T')[0], notes: '' });
    setShowIncomeForm(false);
  };

  const addExpense = () => {
    if (!expenseForm.amount) return;
    
    if (editingItem && editingItem.type === 'expense') {
      setExpenses(expenses.map(item => 
        item.id === editingItem.id 
          ? { ...expenseForm, amount: parseFloat(expenseForm.amount), id: item.id }
          : item
      ));
      setEditingItem(null);
    } else {
      const newExpense = {
        id: expenses.length + 1,
        amount: parseFloat(expenseForm.amount),
        category: expenseForm.category,
        date: expenseForm.date,
        paymentMode: expenseForm.paymentMode,
        notes: expenseForm.notes
      };
      setExpenses([...expenses, newExpense]);
    }
    
    setExpenseForm({ amount: '', category: 'Food', date: new Date().toISOString().split('T')[0], paymentMode: 'UPI', notes: '' });
    setShowExpenseForm(false);
  };

  const deleteIncome = (id) => {
    setIncome(income.filter(item => item.id !== id));
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter(item => item.id !== id));
  };

  const editIncome = (item) => {
    setIncomeForm({
      source: item.source,
      amount: item.amount,
      date: item.date,
      notes: item.notes || ''
    });
    setEditingItem({ ...item, type: 'income' });
    setShowIncomeForm(true);
  };

  const editExpense = (item) => {
    setExpenseForm({
      amount: item.amount,
      category: item.category,
      date: item.date,
      paymentMode: item.paymentMode,
      notes: item.notes || ''
    });
    setEditingItem({ ...item, type: 'expense' });
    setShowExpenseForm(true);
  };

  const updateBudget = (category, amount) => {
    setBudgets({ ...budgets, [category]: parseFloat(amount) || 0 });
  };

  const getFilteredData = () => {
    const filterFunc = (item) => {
      const date = new Date(item.date);
      return date.getMonth() + 1 === filterMonth && date.getFullYear() === filterYear;
    };
    
    return {
      income: income.filter(filterFunc),
      expenses: expenses.filter(filterFunc)
    };
  };

  const { income: filteredIncome, expenses: filteredExpenses } = getFilteredData();
  
  const totalIncome = filteredIncome.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
  const totalExpenses = filteredExpenses.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
  const savings = totalIncome - totalExpenses;
  const savingsPercentage = totalIncome > 0 ? ((savings / totalIncome) * 100).toFixed(1) : 0;

  const categoryExpenses = CATEGORIES.map(category => ({
    name: category,
    value: filteredExpenses
      .filter(e => e.category === category)
      .reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0)
  })).filter(item => item.value > 0);

  const getMonthlyTrend = () => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(filterYear, filterMonth - 1 - i, 1);
      const month = d.getMonth() + 1;
      const year = d.getFullYear();
      
      const monthExpenses = expenses
        .filter(e => {
          const date = new Date(e.date);
          return date.getMonth() + 1 === month && date.getFullYear() === year;
        })
        .reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
      
      months.push({
        name: d.toLocaleString('default', { month: 'short' }),
        expenses: monthExpenses
      });
    }
    return months;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Personal Finance Tracker</h1>
            <div className="flex gap-2">
              <label className="cursor-pointer">
                <input type="file" accept=".xlsx,.xls" onChange={handleFileUpload} className="hidden" />
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Upload size={18} />
                  Upload
                </div>
              </label>
              <button onClick={downloadExcel} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                <Download size={18} />
                Download
              </button>
            </div>
          </div>
          
          <div className="flex gap-4 mt-4">
            <button onClick={() => setActiveTab('dashboard')} className={`px-4 py-2 rounded-lg ${activeTab === 'dashboard' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'}`}>
              Dashboard
            </button>
            <button onClick={() => setActiveTab('income')} className={`px-4 py-2 rounded-lg ${activeTab === 'income' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'}`}>
              Income
            </button>
            <button onClick={() => setActiveTab('expenses')} className={`px-4 py-2 rounded-lg ${activeTab === 'expenses' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'}`}>
              Expenses
            </button>
            <button onClick={() => setActiveTab('budgets')} className={`px-4 py-2 rounded-lg ${activeTab === 'budgets' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'}`}>
              Budgets
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-4 mb-6">
          <select value={filterMonth} onChange={(e) => setFilterMonth(parseInt(e.target.value))} className="px-4 py-2 border rounded-lg">
            {[...Array(12)].map((_, i) => (
              <option key={i} value={i + 1}>{new Date(2024, i).toLocaleString('default', { month: 'long' })}</option>
            ))}
          </select>
          <select value={filterYear} onChange={(e) => setFilterYear(parseInt(e.target.value))} className="px-4 py-2 border rounded-lg">
            {[2024, 2025, 2026].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {activeTab === 'dashboard' && (
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
        )}

        {activeTab === 'income' && (
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
        )}

        {activeTab === 'expenses' && (
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
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
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
        )}

        {activeTab === 'budgets' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Category Budgets</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CATEGORIES.map(category => {
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
        )}
      </div>
    </div>
  );
}