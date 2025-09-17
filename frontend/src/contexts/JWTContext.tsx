import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer, ReactNode } from 'react';

// third-party
import { jwtDecode } from 'jwt-decode';

// reducer - state management
import { login, logout, initialize } from 'store/slices/auth';
import { dispatch } from 'store';

// project imports
import Loader from 'components/Loader';
import axios from 'utils/axios';

// types
import { JWTContextType, User } from 'types/auth';

interface JWTProviderProps {
  children: ReactNode;
}

interface AuthAction {
  type: 'INITIALIZE' | 'LOGIN' | 'LOGOUT';
  payload?: {
    isLoggedIn: boolean;
    user: User | null;
  };
}

interface AuthStateLocal {
  isLoggedIn: boolean;
  isInitialized: boolean;
  user: User | null;
}

// constant
const initialState: AuthStateLocal = {
  isLoggedIn: false,
  isInitialized: false,
  user: null
};

const verifyToken = (serviceToken: string): boolean => {
  if (!serviceToken) {
    return false;
  }
  const decoded: any = jwtDecode(serviceToken);
  return decoded.exp > Date.now() / 1000;
};

const setSession = (serviceToken: string | null): void => {
  if (serviceToken) {
    localStorage.setItem('serviceToken', serviceToken);
    axios.defaults.headers.common.Authorization = `Bearer ${serviceToken}`;
  } else {
    localStorage.removeItem('serviceToken');
    delete axios.defaults.headers.common.Authorization;
  }
};

// ==============================|| JWT CONTEXT & PROVIDER ||============================== //

const JWTContext = createContext<JWTContextType | null>(null);

export const JWTProvider = ({ children }: JWTProviderProps) => {
  const [state, dispatchLocal] = useReducer((prevState: AuthStateLocal, action: AuthAction): AuthStateLocal => {
    switch (action.type) {
      case 'INITIALIZE': {
        const { isLoggedIn, user } = action.payload;
        return { ...prevState, isLoggedIn, isInitialized: true, user };
      }
      case 'LOGIN': {
        const { user } = action.payload;
        return { ...prevState, isLoggedIn: true, user };
      }
      case 'LOGOUT': {
        return { ...prevState, isLoggedIn: false, user: null };
      }
      default: {
        return { ...prevState };
      }
    }
  }, initialState);

  useEffect(() => {
    const init = async () => {
      try {
        const serviceToken = window.localStorage.getItem('serviceToken');
        if (serviceToken && verifyToken(serviceToken)) {
          setSession(serviceToken);
          try {
            const response = await axios.get('/api/auth/user/');
            const user = response.data;
            
            dispatchLocal({
              type: 'INITIALIZE',
              payload: { isLoggedIn: true, user }
            });
            
            dispatch(initialize({ isLoggedIn: true, user, token: serviceToken }));
          } catch (error) {
            // Token might be expired, clear it
            setSession(null);
            dispatchLocal({
              type: 'INITIALIZE',
              payload: { isLoggedIn: false, user: null }
            });
            
            dispatch(initialize({ isLoggedIn: false, user: null, token: null }));
          }
        } else {
          dispatchLocal({
            type: 'INITIALIZE',
            payload: { isLoggedIn: false, user: null }
          });
          
          dispatch(initialize({ isLoggedIn: false, user: null, token: null }));
        }
      } catch (err) {
        console.error(err);
        dispatchLocal({
          type: 'INITIALIZE',
          payload: { isLoggedIn: false, user: null }
        });
        
        dispatch(initialize({ isLoggedIn: false, user: null, token: null }));
      }
    };

    init();
  }, []);

  const loginHandler = async (username: string, password: string): Promise<void> => {
    const response = await axios.post('/api/auth/login/', { username, password });
    const { access, user } = response.data;
    
    setSession(access);
    
    dispatchLocal({
      type: 'LOGIN',
      payload: { isLoggedIn: true, user }
    });
    
    dispatch(login({ user, token: access }));
  };

  const logoutHandler = () => {
    setSession(null);
    dispatchLocal({ type: 'LOGOUT' });
    dispatch(logout());
  };

  if (state.isInitialized !== undefined && !state.isInitialized) {
    return <Loader />;
  }

  return (
    <JWTContext.Provider value={{ ...state, login: loginHandler, logout: logoutHandler }}>
      {children}
    </JWTContext.Provider>
  );
};

JWTProvider.propTypes = { children: PropTypes.node };

export default JWTContext;