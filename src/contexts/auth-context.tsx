import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

import { authService, type AuthState } from 'src/utils/auth-service';

// ----------------------------------------------------------------------

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  checkAuth: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ----------------------------------------------------------------------

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    userType: null,
    token: null,
    user: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = () => {
    setIsLoading(true);
    
    // Validate session first
    if (!authService.validateSession()) {
      authService.logout();
      setAuthState({
        isAuthenticated: false,
        userType: null,
        token: null,
        user: null,
      });
    } else {
      const currentAuthState = authService.getAuthState();
      setAuthState(currentAuthState);
    }
    
    setIsLoading(false);
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.adminLogin({ email, password });
      
      if (response.success) {
        checkAuth(); // Update state after successful login
        return { success: true };
      }
      
      return { 
        success: false, 
        error: response.error || 'Login failed' 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Login failed' 
      };
    }
  };

  const logout = () => {
    setIsLoading(true);
    authService.logout();
    setAuthState({
      isAuthenticated: false,
      userType: null,
      token: null,
      user: null,
    });
    setIsLoading(false);
  };

  useEffect(() => {
    // Check authentication state on component mount
    checkAuth();

    // Check auth state when window regains focus (user switches back to tab)
    const handleFocus = () => {
      if (authState.isAuthenticated) {
        checkAuth();
      }
    };

    window.addEventListener('focus', handleFocus);
    
    // Cleanup event listener
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [authState.isAuthenticated]);

  const contextValue: AuthContextType = {
    ...authState,
    login,
    logout,
    checkAuth,
    isLoading,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// ----------------------------------------------------------------------

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

// ----------------------------------------------------------------------

// Higher-order component for protected routes
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  requiredUserType?: string
) {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, userType, isLoading } = useAuth();

    if (isLoading) {
      return (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh' 
        }}>
          Checking authentication...
        </div>
      );
    }

    if (!isAuthenticated) {
      return <div>Please log in to access this page.</div>;
    }

    if (requiredUserType && userType !== requiredUserType) {
      return <div>You don't have permission to access this page.</div>;
    }

    return <Component {...props} />;
  };
}