import React, { createContext } from 'react'

const categoryContext = createContext();

export const CategoriesProvider = ({children}) => {
    const CATEGORIES = ['Food', 'Fashion','Movies','Entertainment', 'Travel', 'Rent', 'Utilities', 'Stocks', 'Investments','Issued','Returned','Health', 'Others'];
    return (
        <categoryContext.Provider value={CATEGORIES}>
            {children}
        </categoryContext.Provider>
    )
}
const useCategories = () => React.useContext(categoryContext);

export default useCategories;