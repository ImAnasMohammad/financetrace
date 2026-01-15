import useAccessToken from '../hooks/AccessToken'
import { Navigate, Outlet } from 'react-router-dom';

const AuthProtectedRoute = () => {
    const {getAccessToken} = useAccessToken();
    
    if(!getAccessToken()){
        return <Navigate to="/" replace />;
    }

    return <Outlet/>
}

export default AuthProtectedRoute