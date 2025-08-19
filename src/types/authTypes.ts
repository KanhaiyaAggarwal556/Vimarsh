export interface AuthUser {
  _id: string;
  fullName: string;
  userName: string;
  profilepic: string;
  email: string;
  isVerified?: boolean;
  role?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthStore {
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}