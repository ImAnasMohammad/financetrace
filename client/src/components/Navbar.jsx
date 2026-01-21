import { NavLink } from "react-router-dom";
import { useState } from "react";
import useAccessToken from "../hooks/AccessToken";

const Navbar = () => {
    const { removeAccessToken } = useAccessToken();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        removeAccessToken();
        window.location.href = "/";
    };

    const linkClass = ({ isActive }) =>
        `block px-4 py-2 rounded-lg ${isActive ? "text-blue-500 font-semibold" : "text-gray-700"
        } hover:bg-gray-100`;

    return (
        <div className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">

                {/* Logo / Title */}
                <h1 className="text-lg font-bold">Finance Tracker</h1>

                {/* Hamburger (Mobile) */}
                <button
                    className="md:hidden text-gray-700"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    ☰
                </button>

                {/* Desktop Menu */}
                <ul className="hidden md:flex gap-4">
                    <li><NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink></li>
                    <li><NavLink to="/dashboard/income" className={linkClass}>Income</NavLink></li>
                    <li><NavLink to="/dashboard/expenses" className={linkClass}>Expenses</NavLink></li>
                    <li><NavLink to="/dashboard/budgets" className={linkClass}>Budgets</NavLink></li>
                    <li>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
                        >
                            Logout
                        </button>
                    </li>
                </ul>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <ul className="md:hidden px-4 pb-4 space-y-2">
                    <li><NavLink to="/dashboard" className={linkClass} onClick={() => setIsOpen(false)}>Dashboard</NavLink></li>
                    <li><NavLink to="/dashboard/income" className={linkClass} onClick={() => setIsOpen(false)}>Income</NavLink></li>
                    <li><NavLink to="/dashboard/expenses" className={linkClass} onClick={() => setIsOpen(false)}>Expenses</NavLink></li>
                    <li><NavLink to="/dashboard/budgets" className={linkClass} onClick={() => setIsOpen(false)}>Budgets</NavLink></li>
                    <li>
                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100"
                        >
                            Logout
                        </button>
                    </li>
                </ul>
            )}
        </div>
    );
};

export default Navbar;
