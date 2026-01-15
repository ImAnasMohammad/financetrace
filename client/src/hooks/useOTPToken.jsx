import React, { createContext, useState } from 'react'

const OTPTokenContext = createContext();

export const OTPTokenProvider = ({children}) => {
    const [OTPToken,setOTPToken] = useState('');

    const handleOTPToken = (token) => {
        localStorage.setItem('OTPToken', token);
        setOTPToken(token);
    }

    const removeOTPToken = () => {
        localStorage.removeItem('OTPToken');
        setOTPToken('');
    }

    const getOTPToken = () => {
        return localStorage.getItem('OTPToken') || OTPToken || '';
    }

    return (
        <OTPTokenContext.Provider value={{getOTPToken,handleOTPToken,removeOTPToken}}>
            {children}
        </OTPTokenContext.Provider>
    )
}
const useOTPToken = () => React.useContext(OTPTokenContext);

export default useOTPToken;