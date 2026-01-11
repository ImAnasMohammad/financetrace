import React, { createContext } from 'react'

const categoryContext = createContext();

export const CategoriesProvider = ({children}) => {
    const CATEGORIES = ['Food', 'Fashion', 'Travel', 'Rent', 'Utilities', 'Stocks', 'Investments', 'Others'];
    return (
        <categoryContext.Provider value={CATEGORIES}>
            {children}
        </categoryContext.Provider>
    )
}
const useCategories = () => React.useContext(categoryContext);

export default useCategories;