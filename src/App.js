import { useState } from 'react';
import Navbar from './components/Navbar';
import SelectTime from './components/SelectTime';
import Dashboard from './pages/Dashboard';
import Income from './pages/Income';
import Expense from './pages/Expense';
import Budgets from './pages/Budgets';
import usePayments from './hooks/usePayments';
import useCategories from './hooks/useCategories';
import { Route, Routes } from 'react-router-dom';
import HomeLayout from './layouts/HomeLayout';



export default function ExpenseTracker() {
  const payments = ['UPI', 'Cash', 'Card'];
  // const CATEGORIES = ['Food', 'Fashion', 'Travel', 'Rent', 'Utilities', 'Stocks', 'Investments', 'Others'];
  const categories = useCategories();
  console.log('Categories from hook:', categories);
  const [income, setIncome] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState({});
  const [activeTab, setActiveTab] = useState('budgets');
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

  const categoryExpenses = categories.map(category => ({
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

    <Routes>
      <Route path="/" element={
<HomeLayout>
          <Dashboard
            totalIncome={totalIncome}
            totalExpenses={totalExpenses}
            savings={savings}
            savingsPercentage={savingsPercentage}
            categoryExpenses={categoryExpenses}
            getMonthlyTrend={getMonthlyTrend}
          />
        </HomeLayout>
      } />
    </Routes>
    // <div className="min-h-screen bg-gray-50">
    //   <Navbar/>
    //   <div className="max-w-7xl mx-auto px-4 py-6">
    //     <SelectTime filterMonth={filterMonth} filterYear={filterYear} setFilterMonth={setFilterMonth} setFilterYear={setFilterYear} />

    //     {activeTab === 'dashboard' && (
    //       <Dashboard
    //         totalIncome={totalIncome}
    //         totalExpenses={totalExpenses}
    //         savings={savings}
    //         savingsPercentage={savingsPercentage}
    //         categoryExpenses={categoryExpenses}
    //         getMonthlyTrend={getMonthlyTrend}
    //       />
    //     )}

    //     {activeTab === 'income' && (
    //       <Income
    //         showIncomeForm={showIncomeForm}
    //         setShowIncomeForm={setShowIncomeForm}
    //         incomeForm={incomeForm}
    //         setIncomeForm={setIncomeForm}
    //         addIncome={addIncome}
    //         filteredIncome={filteredIncome}
    //         editIncome={editIncome}
    //         deleteIncome={deleteIncome}
    //         editingItem={editingItem}
    //         setEditingItem={setEditingItem}
    //       />
    //     )}

    //     {activeTab === 'expenses' && (
    //       <Expense
    //         showExpenseForm={showExpenseForm}
    //         setShowExpenseForm={setShowExpenseForm}
    //         expenseForm={expenseForm}
    //         setExpenseForm={setExpenseForm}
    //         addExpense={addExpense}
    //         filteredExpenses={filteredExpenses}
    //         editExpense={editExpense}
    //         deleteExpense={deleteExpense}
    //         editingItem={editingItem}
    //         setEditingItem={setEditingItem}
    //         categories={categories}
    //         payments={payments}
    //       />
    //     )}

    //     {activeTab === 'budgets' && (
    //       <Budgets
    //         categories={categories}
    //         budgets={budgets}
    //         filteredExpenses={filteredExpenses}
    //         updateBudget={updateBudget}
    //       />
    //     )}
    //   </div>
    // </div>
  );
}