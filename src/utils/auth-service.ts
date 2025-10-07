import { apiService, type LoginRequest, type ApiResponse, type LoginResponse } from './api-service';

// ----------------------------------------------------------------------

export interface AuthState {
  isAuthenticated: boolean;
  userType: string | null;
  token: string | null;
  user: any | null;
}

// ----------------------------------------------------------------------

class AuthService {
  private readonly STORAGE_KEYS = {
    TOKEN: 'authToken',
    USER_TYPE: 'userType',
    IS_AUTHENTICATED: 'isAuthenticated',
    USER_DATA: 'userData',
  };

  /**
   * Admin login using the API
   */
  async adminLogin(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    try {
      const response = await apiService.adminLogin(credentials);

      if (response.success && response.data) {
        // Store authentication data
        this.setAuthData({
          token: response.data.token || '',
          userType: 'admin',
          userData: response.data.user,
        });
      }

      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed',
      };
    }
  }

  /**
   * Store authentication data in localStorage
   */
  private setAuthData({
    token,
    userType,
    userData,
  }: {
    token: string;
    userType: string;
    userData?: any;
  }): void {
    localStorage.setItem(this.STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(this.STORAGE_KEYS.USER_TYPE, userType);
    localStorage.setItem(this.STORAGE_KEYS.IS_AUTHENTICATED, 'true');
    
    if (userData) {
      localStorage.setItem(this.STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
    }
  }

  /**
   * Get current authentication state
   */
  getAuthState(): AuthState {
    try {
      const isAuthenticated = localStorage.getItem(this.STORAGE_KEYS.IS_AUTHENTICATED) === 'true';
      const userType = localStorage.getItem(this.STORAGE_KEYS.USER_TYPE);
      const token = localStorage.getItem(this.STORAGE_KEYS.TOKEN);
      const userDataStr = localStorage.getItem(this.STORAGE_KEYS.USER_DATA);
      
      // Additional validation: if token exists but other fields are missing, clear everything
      if (token && (!isAuthenticated || !userType)) {
        this.logout();
        return {
          isAuthenticated: false,
          userType: null,
          token: null,
          user: null,
        };
      }
      
      let user = null;
      if (userDataStr) {
        try {
          user = JSON.parse(userDataStr);
        } catch (error) {
          console.error('Error parsing user data:', error);
          // If user data is corrupted, logout to prevent issues
          this.logout();
          return {
            isAuthenticated: false,
            userType: null,
            token: null,
            user: null,
          };
        }
      }

      return {
        isAuthenticated,
        userType,
        token,
        user,
      };
    } catch (error) {
      console.error('Error getting auth state:', error);
      // If there's any error accessing localStorage, return logged out state
      return {
        isAuthenticated: false,
        userType: null,
        token: null,
        user: null,
      };
    }
  }

  /**
   * Check if user is authenticated as admin
   */
  isAdminAuthenticated(): boolean {
    const { isAuthenticated, userType } = this.getAuthState();
    return isAuthenticated && userType === 'admin';
  }

  /**
   * Get authentication token
   */
  getToken(): string | null {
    return localStorage.getItem(this.STORAGE_KEYS.TOKEN);
  }

  /**
   * Logout user and clear all auth data
   */
  logout(): void {
    try {
      Object.values(this.STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  /**
   * Validate current session
   */
  validateSession(): boolean {
    try {
      const authState = this.getAuthState();
      
      // Check if all required fields are present
      if (!authState.isAuthenticated || !authState.token || !authState.userType) {
        return false;
      }
      
      // Additional validation can be added here (token expiry, etc.)
      return true;
    } catch (error) {
      console.error('Error validating session:', error);
      return false;
    }
  }

  /**
   * Clear authentication data
   */
  clearAuthData(): void {
    this.logout();
  }
}

export const authService = new AuthService();