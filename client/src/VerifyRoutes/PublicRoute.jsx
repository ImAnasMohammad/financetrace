import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import useAccessToken from '../hooks/AccessToken';

const PublicRoute = () => {
    const {getAccessToken} = useAccessToken();
    
    if(getAccessToken()){
        return <Navigate to="/dashboard" replace />;
    }
    return <Outlet />;
}

export default PublicRoute