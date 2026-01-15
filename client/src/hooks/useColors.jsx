import React, { createContext } from 'react'

const colorContext = createContext();


export const ColorsProvider = ({children}) => {
    const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'];
    return (
        <colorContext.Provider value={COLORS}>
            {children}
        </colorContext.Provider>
    )
}

const useColors = () => React.useContext(colorContext);

export default useColors;