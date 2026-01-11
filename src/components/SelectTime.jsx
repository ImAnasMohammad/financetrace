import React from 'react'

const SelectTime = ({filterMonth, filterYear, setFilterMonth, setFilterYear}) => {
    return (
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
    )
}

export default SelectTime