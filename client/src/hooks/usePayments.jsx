import { createContext, useContext, useState } from "react";


const paymentContext = createContext();

export const PaymentsProvider = ({children})=>{
    const [payments] = useState(['UPI', 'Cash', 'Card']);

    return <paymentContext.Provider value={payments}>
        {children}
    </paymentContext.Provider>
}

const usePayments = ()=>useContext(paymentContext);

export default usePayments;