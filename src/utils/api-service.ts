  /**
   * Get channel partner orders with filters
   */
import { CONFIG } from '../config-global';

// ----------------------------------------------------------------------
// USER MANAGEMENT APIs
// ----------------------------------------------------------------------

export interface User {
  id: number;
  name: string;
  email: string;
  created_at?: string;
  updated_at?: string;
}

export interface UsersListResponse {
  data: User[];
  pagination?: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
  total?: number;
  page?: number;
  limit?: number;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserRequest extends Partial<CreateUserRequest> {
  id: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token?: string;
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export interface BrandImage {
  id: number;
  image_name: string;
  image_path: string;
}

export interface Image {
  id: number;
  image_name: string;
  image_path: string;
  created_at?: string;
  updated_at?: string;
}

export interface ImagesListResponse {
  data: Image[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface Brand {
  id: number;
  brand_name: string;
  brand_image: number;
  banner_image: number;
  category: string;
  price_range: string;
  brandImage: BrandImage;
  bannerImage: BrandImage;
  created_at?: string;
  updated_at?: string;
}

export interface BrandsListResponse {
  data: Brand[];
  pagination?: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
  // Legacy fields for backward compatibility
  total?: number;
  page?: number;
  limit?: number;
}

export interface CreateBrandRequest {
  brand_name: string;
  category: string;
  price_range: string;
  brand_image: number; // image id
  banner_image: number; // image id
}

export interface UpdateBrandRequest extends Partial<CreateBrandRequest> {
  id: number;
}

export interface Model {
  id: number;
  brand_id: number;
  model_name: string;
  model_image: string;
  price_rng: string;
  created_at?: string;
  updated_at?: string;
  brandName: {
    id: number;
    brand_name: string;
    category: string;
  };
  modelImage: {
    id: number;
    image_name: string;
    image_path: string;
  };
}

export interface ModelsListResponse {
  data: Model[];
  pagination?: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
  // Legacy fields for backward compatibility
  total?: number;
  page?: number;
  limit?: number;
}

export interface CreateModelRequest {
  brand_id: number;
  model_name: string;
  price_rng: string;
  model_image: number; // image id
}

export interface UpdateModelRequest extends Partial<CreateModelRequest> {
  id: number;
}

export interface Customer {
  id: number;
  customer_name: string;
  company_name?: string | null;
  sale_tax?: string | null;
  email: string;
  mobile: string;
  address: string;
  state?: string | null;
  city?: string | null;
  zipcode?: string | null;
  otp?: string;
  status: number;
  isVendor: number;
  vendorCode?: string | null;
  channel_partner_id?: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface CustomersListResponse {
  data: Customer[];
  pagination?: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
  // Legacy fields for backward compatibility
  total?: number;
  page?: number;
  limit?: number;
}

export interface Vendor {
  id: number;
  store_name: string;
  store_address: string;
  contact_name?: string | null;
  contact_number: string;
  email: string;
  buyback_volume : string;
  vendor_registration_procedure : string;
  alt_contact_number?: string | null;
  alt_contact_name?: string | null;
  notes?: string | null;
  is_interested?: boolean | null; 
}

export interface VendorsListResponse {
  data: Vendor[];
  pagination?: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
  // Legacy fields for backward compatibility
  total?: number;
  page?: number;
  limit?: number;
}

// ----------------------------------------------------------------------

class ApiService {
 
  private baseUrl: string;

  constructor() {
    // Always use the configured base URL for consistency
    this.baseUrl = CONFIG.apiBaseUrl;
  }

  /**
   * Handle logout and redirect to login page
   */
  private handleAuthError(): void {
    console.log('Authentication error detected, logging out...');
    
    // Clear all auth data
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    // Redirect to login page
    window.location.href = '/admin/sign-in';
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    // In development, use proxy (empty base URL), in production use full URL
    const url = import.meta.env.DEV ? endpoint : `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    // Get token from localStorage if available
    const token = localStorage.getItem('authToken');
    
    const requestOptions: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      // Add CORS handling
      mode: 'cors',
      credentials: 'omit',
    };

    console.log('API Request:', {
      url,
      method: requestOptions.method || 'GET',
      headers: requestOptions.headers,
      body: requestOptions.body,
    });

    try {
      const response = await fetch(url, requestOptions);

      console.log('API Response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      });

      // Check for auth errors first, before processing response
      if (response.status === 401 || response.status === 403) {
        console.error(`Authentication error: ${response.status} ${response.statusText}`);
        this.handleAuthError();
        return {
          success: false,
          error: 'Session expired. Please login again.',
        };
      }

      // Handle empty responses
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.log('Non-JSON response:', text);
        data = text ? { message: text } : {};
      }

      if (!response.ok) {
        const errorMessage = data?.message || data?.error || `HTTP Error: ${response.status} ${response.statusText}`;
        console.error('API Error:', errorMessage, data);
        return {
          success: false,
          error: errorMessage,
        };
      }

      console.log('API Success:', data);
      return {
        success: true,
        data,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Network error occurred';
      console.error('Network Error:', error);
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  async adminLogin(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return this.request<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  /**
   * Test API connectivity
   */
  async testConnection(): Promise<ApiResponse<any>> {
    return this.request('/api/health', {
      method: 'GET',
    });
  }

  /**
   * Get API base URL for debugging
   */
  getBaseUrl(): string {
    return this.baseUrl;
  }

  /**
   * Get base URL for images (always returns full URL)
   */
  getImageBaseUrl(): string {
    return CONFIG.apiBaseUrl;
  }

  // ----------------------------------------------------------------------
  // IMAGE MANAGEMENT APIs
  // ----------------------------------------------------------------------

  /**
   * Get images list with pagination
   */
  async getImages(page: number = 1, limit: number = 20): Promise<ApiResponse<ImagesListResponse>> {
    return this.request<ImagesListResponse>(`/api/images?page=${page}&limit=${limit}`, {
      method: 'GET',
    });
  }

  /**
   * Get single image by ID
   */
  async getImage(id: number): Promise<ApiResponse<Image>> {
    return this.request<Image>(`/api/images/${id}`, {
      method: 'GET',
    });
  }

  /**
   * Upload new image
   */
  async uploadImage(file: File): Promise<ApiResponse<Image>> {
    const formData = new FormData();
    formData.append('image', file);

    // Use the same URL handling as other methods to work with proxy
    const url = import.meta.env.DEV ? '/api/images/create' : `${this.baseUrl}/api/images/create`;

    // Get token from localStorage if available
    const token = localStorage.getItem('authToken');
    
    const requestOptions: RequestInit = {
      method: 'POST',
      headers: {
        // Don't set Content-Type for FormData, let browser set it with boundary
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
      mode: 'cors',
      credentials: 'omit',
    };

    console.log('Upload Request:', {
      url,
      method: requestOptions.method,
      headers: requestOptions.headers,
    });

    try {
      const response = await fetch(url, requestOptions);
      
      console.log('Upload Response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      });

      // Check for auth errors first, before processing response
      if (response.status === 401 || response.status === 403) {
        console.error(`Authentication error: ${response.status} ${response.statusText}`);
        this.handleAuthError();
        return {
          success: false,
          error: 'Session expired. Please login again.',
        };
      }

      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.log('Non-JSON upload response:', text);
        data = text ? { message: text } : {};
      }

      if (!response.ok) {
        const errorMessage = data?.message || data?.error || `HTTP Error: ${response.status} ${response.statusText}`;
        console.error('Upload Error:', errorMessage, data);
        return {
          success: false,
          error: errorMessage,
        };
      }

      console.log('Upload Success:', data);
      return {
        success: true,
        data,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Network error occurred';
      console.error('Upload Network Error:', error);
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Delete image
   */
  async deleteImage(id: number): Promise<ApiResponse<any>> {
    return this.request(`/api/images/${id}`, {
      method: 'DELETE',
    });
  }

  // ----------------------------------------------------------------------
  // BRAND MANAGEMENT APIs
  // ----------------------------------------------------------------------

  /**
   * Get brands list with pagination
   */
  async getBrands(page: number = 1, limit: number = 10): Promise<ApiResponse<BrandsListResponse>> {
    return this.request<BrandsListResponse>(`/api/brands?page=${page}&limit=${limit}`, {
      method: 'GET',
    });
  }

  /**
   * Get single brand by ID
   */
  async getBrand(id: number): Promise<ApiResponse<Brand>> {
    return this.request<Brand>(`/api/brands/${id}`, {
      method: 'GET',
    });
  }

  /**
   * Create new brand
   */
  async createBrand(brandData: CreateBrandRequest): Promise<ApiResponse<Brand>> {
    return this.request<Brand>('/api/brands/create', {
      method: 'POST',
      body: JSON.stringify(brandData),
    });
  }

  /**
   * Update brand
   */
  async updateBrand(brandData: UpdateBrandRequest): Promise<ApiResponse<Brand>> {
    return this.request<Brand>(`/api/brands/${brandData.id}`, {
      method: 'PUT',
      body: JSON.stringify(brandData),
    });
  }

  /**
   * Delete brand
   */
  async deleteBrand(id: number): Promise<ApiResponse<any>> {
    return this.request(`/api/brands/${id}`, {
      method: 'DELETE',
    });
  }

  // ----------------------------------------------------------------------
  // MODEL MANAGEMENT APIs
  // ----------------------------------------------------------------------

  /**
   * Get models list with pagination
   */
  async getModels(page: number = 1, limit: number = 10): Promise<ApiResponse<ModelsListResponse>> {
    return this.request<ModelsListResponse>(`/api/models?page=${page}&limit=${limit}`, {
      method: 'GET',
    });
  }

  /**
   * Get single model by ID
   */
  async getModel(id: number): Promise<ApiResponse<Model>> {
    return this.request<Model>(`/api/models/${id}`, {
      method: 'GET',
    });
  }

  /**
   * Create new model
   */
  async createModel(modelData: CreateModelRequest): Promise<ApiResponse<Model>> {
    return this.request<Model>('/api/models/create', {
      method: 'POST',
      body: JSON.stringify(modelData),
    });
  }

  /**
   * Update model
   */
  async updateModel(modelData: UpdateModelRequest): Promise<ApiResponse<Model>> {
    return this.request<Model>(`/api/models/${modelData.id}`, {
      method: 'PUT',
      body: JSON.stringify(modelData),
    });
  }

  /**
   * Delete model
   */
  async deleteModel(id: number): Promise<ApiResponse<any>> {
    return this.request(`/api/models/${id}`, {
      method: 'DELETE',
    });
  }

  // ----------------------------------------------------------------------
  // CUSTOMER MANAGEMENT APIs
  // ----------------------------------------------------------------------

  /**
   * Get customers list with pagination
   */
  async getCustomers(page: number = 1, limit: number = 10): Promise<ApiResponse<CustomersListResponse>> {
    return this.request<CustomersListResponse>(`/api/customer?page=${page}&limit=${limit}`, {
      method: 'GET',
    });
  }

  // ----------------------------------------------------------------------
  // Vendor MANAGEMENT APIs
  // ----------------------------------------------------------------------

  /**
   * Get vendors list with pagination
   */
  async getVendors(page: number = 1, limit: number = 10): Promise<ApiResponse<VendorsListResponse>> {
    return this.request<VendorsListResponse>(`/api/vendor?page=${page}&limit=${limit}`, {
      method: 'GET',
    });
  }

  /**
   * Get single vendor by ID
   */
  async getVendor(id: number): Promise<ApiResponse<Vendor>> {
    return this.request<Vendor>(`/api/vendor/${id}`, {
      method: 'GET',
    });
  }

  /**
   * Delete vendor
   */
  async deleteVendor(id: number): Promise<ApiResponse<any>> {
    return this.request(`/api/vendor/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Get channel partner orders with filters
   */
  async getPartnerOrders(params: Record<string, string>): Promise<ApiResponse<any>> {
    const query = new URLSearchParams(params).toString();
    return this.request<any>(`/api/orders/channel-partner-reports?${query}`, {
      method: 'GET',
    });
  }
  /**
   * Update order data by ID
   */
  async updateOrderData(orderId: number, data: { order_status: number; offer_price: number; comments: string }): Promise<ApiResponse<any>> {
    return this.request<any>(`/api/orders/${orderId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

   /**
   * Get users list with pagination
   */
  async getUsers(page: number = 1, limit: number = 10): Promise<ApiResponse<UsersListResponse>> {
    return this.request<UsersListResponse>(`/api/users/?page=${page}&limit=${limit}`, {
      method: 'GET',
    });
  }

  /**
   * Get single user by ID
   */
  async getUser(id: number): Promise<ApiResponse<User>> {
    return this.request<User>(`/api/users/${id}`, {
      method: 'GET',
    });
  }

  /**
   * Create new user
   */
  async createUser(userData: CreateUserRequest): Promise<ApiResponse<User>> {
    return this.request<User>('/api/users/create', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  /**
   * Update user
   */
  async updateUser(userData: UpdateUserRequest): Promise<ApiResponse<User>> {
    return this.request<User>(`/api/users/${userData.id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  /**
   * Delete user
   */
  async deleteUser(id: number): Promise<ApiResponse<any>> {
    return this.request(`/api/users/${id}`, {
      method: 'DELETE',
    });
  }


}

export const apiService = new ApiService();