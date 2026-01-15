import React, { createContext, useState } from 'react'

const AccessTokenContext = createContext();

export const AccessTokenProvider = ({children}) => {
    const [accessToken,setAccessToken] = useState('');

    const handleAccessToken = (token) => {
        localStorage.setItem('accessToken', token);
        setAccessToken(token);
    }

    const removeAccessToken = () => {
        localStorage.removeItem('accessToken');
        setAccessToken('');
    }

    const getAccessToken = () => {
        return localStorage.getItem('accessToken') || accessToken || '';
    }
    return (
        <AccessTokenContext.Provider value={{getAccessToken,handleAccessToken,removeAccessToken}}>
            {children}
        </AccessTokenContext.Provider>
    )
}
const useAccessToken = () => React.useContext(AccessTokenContext);

export default useAccessToken;