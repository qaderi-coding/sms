export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  is_superuser: boolean;
  groups: any[];
  permissions: any[];
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
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}