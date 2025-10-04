import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// project imports
import useAuth from 'hooks/useAuth';
import { GuardProps } from 'types';
import UnAuthorized from 'ui-custom/UnAuthorized';
import { useAppDispatch } from 'store';
import { ComponentPermissionActions } from 'apps/authentication/permission/ComponentPermissionSlice';
import Loader from 'ui-component/Loader';

interface AuthPermissionGuardProps extends GuardProps {
    code?: string; // optional code for permission check
}

const AuthGuard = ({ children, code }: AuthPermissionGuardProps) => {
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [loading, setLoading] = useState(true); // start in loading state
    const { permission, permissions } = useSelector((state: any) => state.permission);

    // fetch all permissions if not already loaded
    useEffect(() => {
        const fetchPermissions = async () => {
            if (!permissions || permissions.length === 0) {
                try {
                    setLoading(true);
                    await dispatch(ComponentPermissionActions.getComponentPermissions());
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };
        fetchPermissions();
    }, [permissions, dispatch]);

    // fetch single permission if code is provided
    useEffect(() => {
        const fetchPermissionByCode = async () => {
            if (code) {
                try {
                    setLoading(true);
                    await dispatch(ComponentPermissionActions.getComponentPermission(code));
                } catch (error) {
                    console.error('Permission fetch failed:', error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchPermissionByCode();
    }, [code, dispatch]);

    // redirect to login if not authenticated
    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login', { replace: true });
        }
    }, [isLoggedIn, navigate]);

    // still loading? keep showing loader
    if (loading) return <Loader />;

    // check permission only after loading finishes
    const isComponentVisible = code ? permission?.menu_visible_fl === 'Y' : true;

    if (!isLoggedIn) return null; // wait until redirect happens
    if (!isComponentVisible) return <UnAuthorized />;

    return <>{children}</>;
};

export default AuthGuard;
