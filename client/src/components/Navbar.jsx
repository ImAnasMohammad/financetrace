
import {NavLink} from 'react-router-dom';
import useAccessToken from '../hooks/AccessToken'

const Navbar = () => {
    const {removeAccessToken} = useAccessToken();
    const handleLogout = () => {
        removeAccessToken();
        window.location.href = '/';

    }
    return (
        <div className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 py-4">

                <ul className="flex gap-4 mt-4">
                    <li>
                        <NavLink  to={'/dashboard'} className='px-4 py-2 rounded-lg' activeClassName='text-red-500' >Dashboard</NavLink >
                    </li>
                    <li>
                        <NavLink  to={'/dashboard/income'} className='px-4 py-2 rounded-lg'>Income</NavLink >
                    </li>
                    <li>
                        <NavLink  to={'/dashboard/expenses'} className='px-4 py-2 rounded-lg'>Expenses</NavLink >
                    </li>
                    <li>
                        <NavLink  to={'/dashboard/budgets'} className='px-4 py-2 rounded-lg'>Budgets</NavLink >
                    </li>
                    <li>
                        <NavLink  to={'/dashboard/logout'} className='px-4 py-2 rounded-lg' onClick={handleLogout}>Logout</NavLink >
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default Navbar