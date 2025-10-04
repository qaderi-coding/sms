export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name?: string;
  roles: string[];
  emailConfirmed?: boolean;
}

export interface AuthState {
  isLoggedIn: boolean;
  isInitialized: boolean;
  user: User | null;
  token: string | null;
}

export interface JWTContextType {
  isLoggedIn: boolean;
  isInitialized: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}