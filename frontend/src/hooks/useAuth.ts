import { useContext } from 'react';

// auth provider
import JWTContext from 'contexts/JWTContext';

// types
import { JWTContextType } from 'types/auth';

// ==============================|| AUTH HOOKS ||============================== //

const useAuth = (): JWTContextType => {
  const context = useContext(JWTContext);

  if (!context) throw new Error('context must be use inside provider');

  return context;
};

export default useAuth;