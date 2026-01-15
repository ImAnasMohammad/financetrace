import React from 'react'
import Navbar from '../components/Navbar'

const HomeLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* <SelectTime filterMonth={filterMonth} filterYear={filterYear} setFilterMonth={setFilterMonth} setFilterYear={setFilterYear} /> */}
                {children}
            </div>
        </div>
    )
}

export default HomeLayout