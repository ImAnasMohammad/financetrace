import { Download, Upload } from 'lucide-react'
import React, { useState } from 'react'

const Navbar = () => {

    const downloadExcel = () => {
        // const wb = XLSX.utils.book_new();

        // const incomeSheet = XLSX.utils.json_to_sheet(income.map(({ id, ...rest }) => rest));
        // XLSX.utils.book_append_sheet(wb, incomeSheet, 'Income');

        // const expenseSheet = XLSX.utils.json_to_sheet(expenses.map(({ id, ...rest }) => rest));
        // XLSX.utils.book_append_sheet(wb, expenseSheet, 'Expenses');

        // const budgetData = Object.entries(budgets).map(([category, budget]) => ({
        //     Category: category,
        //     Budget: budget
        // }));
        // const budgetSheet = XLSX.utils.json_to_sheet(budgetData);
        // XLSX.utils.book_append_sheet(wb, budgetSheet, 'Budgets');

        // XLSX.writeFile(wb, 'expense_tracker.xlsx');
    };

    const handleFileUpload = (e) => {
        // const file = e.target.files[0];
        // if (!file) return;

        // const reader = new FileReader();
        // reader.onload = (event) => {
        //     try {
        //         const workbook = XLSX.read(event.target.result, { type: 'binary' });

        //         if (workbook.SheetNames.includes('Income')) {
        //             const incomeSheet = XLSX.utils.sheet_to_json(workbook.Sheets['Income']);
        //             setIncome(incomeSheet.map((item, idx) => ({ ...item, id: idx + 1 })));
        //         }

        //         if (workbook.SheetNames.includes('Expenses')) {
        //             const expenseSheet = XLSX.utils.sheet_to_json(workbook.Sheets['Expenses']);
        //             setExpenses(expenseSheet.map((item, idx) => ({ ...item, id: idx + 1 })));
        //         }

        //         if (workbook.SheetNames.includes('Budgets')) {
        //             const budgetSheet = XLSX.utils.sheet_to_json(workbook.Sheets['Budgets']);
        //             const budgetObj = {};
        //             budgetSheet.forEach(item => {
        //                 budgetObj[item.Category] = item.Budget;
        //             });
        //             setBudgets(budgetObj);
        //         }
        //     } catch (error) {
        //         alert('Error reading file. Please upload a valid Excel file.');
        //     }
        // };
        // reader.readAsBinaryString(file);
    };

    const [activeTab, setActiveTab] = useState('dashboard');
    return (
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
    )
}

export default Navbar