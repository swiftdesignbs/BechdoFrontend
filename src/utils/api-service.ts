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

export interface CustomerLoginRequest {
  mobile: string;
  isVendor: number;
  channel_partner_id?: string;
}

export interface CustomerLoginResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export interface OTPVerifyRequest {
  mobile: string;
  otp: string;
}

export interface OTPVerifyResponse {
  result: boolean;
  token?: string;
  customer?: {
    id: number;
    customer_name: string | null;
    company_name: string | null;
    sale_tax: string | null;
    email: string | null;
    mobile: string;
    address: string | null;
    state: string | null;
    city: string | null;
    zipcode: string | null;
    otp: string;
    status: number;
    isVendor: number;
    vendorCode: string | null;
    channel_partner_id: number | null;
  };
}

export interface ProfileUpdateRequest {
  fullname: string;
  email: string;
  address: string;
  state: string;
  pincode: string;
}

export interface ProfileUpdateResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export interface State {
  id: number;
  name: string;
  country_id: number;
}

export interface StatesListResponse {
  data: State[];
  pagination?: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
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

// ----------------------------------------------------------------------
// SETTINGS MANAGEMENT APIs
// ----------------------------------------------------------------------

export interface Setting {
  id: number;
  name: string;
  value: string;
  created_at?: string;
  updated_at?: string;
}

export interface SettingsListResponse {
  data: Setting[];
  pagination?: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
}

export interface CreateSettingRequest {
  name: string;
  value: string;
}

export interface UpdateSettingRequest extends Partial<CreateSettingRequest> {
  id: number;
}

export interface SaveOrderRequest {
  config_type: string;
  item_ids: string[];
  is_mac?: number;
}

export interface SystemConfigCategory {
  id: number;
  active: boolean;
  price?: number;
  extra_price?: number;
}

export interface ConfigItemDetail {
  id: number;
  config_id: number;
  config_type_id: number;
  parent_id: number;
  parent_type_id: number;
  price: number;
  extra_price: number;
  active: boolean;
}

export interface ConfigItem {
  id: number;
  config_type_id: number;
  is_mac: boolean;
  title: string;
  extra_price_title: string | null;
  show_extra_price: number;
  description: string | null;
  order: number;
  image_id: number | null;
}

export interface SystemConfigEditResponse {
  config_item_details?: ConfigItemDetail[];
  config_item?: ConfigItem;
  result?: {
    config_item_details: ConfigItemDetail[];
    config_item: ConfigItem;
  };
}

export interface SystemConfigRequest {
  title: string;
  categories: SystemConfigCategory[];
  is_mac: boolean;
  is_parent: number;
  config_type: string;
  default_config_price: number;
  edit_mode: boolean;
  edit_id?: number;
  image_id?: number | null;
}

export interface SystemConfigResponse {
  id: number;
  title: string;
  config_type: string;
  default_config_price: number;
  is_mac: boolean;
  categories: SystemConfigCategory[];
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

export interface OrderStatus {
  id: number;
  name: string;
  status: number;
}

export interface OrderStatusListResponse {
  data: OrderStatus[];
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

export interface CreateOrderStatusRequest {
  name: string;
  status: number;
}

export interface UpdateOrderStatusRequest extends Partial<CreateOrderStatusRequest> {
  id: number;
}

// ----------------------------------------------------------------------
// SYSTEM SETTINGS INTERFACES
// ----------------------------------------------------------------------

export interface SwitchCondition {
  id: number;
  swtich_condition: string;
  swtich_price: number;
}

export interface ParentCategory {
  id: number;
  parent_type_id: number;
  title: string;
  price: number;
  order: number;
  is_mac: boolean;
  bonus: number;
  bonus_applicable: boolean;
}

export interface ConfigDataItem {
  id: number;
  config_type_id: number;
  is_mac: boolean;
  title: string;
  extra_price_title?: string | null;
  show_extra_price: number;
  description?: string | null;
  order: number;
  image_id?: number | null;
  image?: {
    id: number;
    image_name: string;
    image_path: string;
  } | null;
}

export interface ConfigSection {
  type: string;
  title: string;
  data: ConfigDataItem[];
  show_description?: boolean;
  show_image?: boolean;
}

export interface WindowsSettingsData {
  switch: SwitchCondition[];
  parentCategories: ParentCategory[];
  series_mac: ParentCategory[];
  isMac: boolean;
  parentCategoryTypeName: string;
  parentCategoryType: string;
  configData: ConfigSection[];
  image: Array<{
    id: number;
    image_name: string;
    image_path: string;
  }>;
  parentTypeId: number;
  deductionPercent: string;
  bonus_applicable: boolean;
}

// ----------------------------------------------------------------------

class ApiService {

    /**
     * Create new customer
     */
    async createCustomer(data: Record<string, any>): Promise<ApiResponse<any>> {
      return this.request<any>('/api/customer/create', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    }

    /**
     * Update customer by ID
     */
    async updateCustomer(id: number, data: Record<string, any>): Promise<ApiResponse<any>> {
      return this.request<any>(`/api/customer/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    }

    /**
     * Delete customer by ID
     */
    async deleteCustomer(id: number): Promise<ApiResponse<any>> {
      return this.request<any>(`/api/customer/${id}`, {
        method: 'DELETE',
      });
    }
    /**
     * Get customers by channel partner
     */
    async getPartnerCustomers(params: { channel_partner_id: number; page?: number; limit?: number }): Promise<ApiResponse<any>> {
      const query = new URLSearchParams({
        channel_partner_id: String(params.channel_partner_id),
        page: String(params.page ?? 1),
        limit: String(params.limit ?? 10),
      }).toString();
      return this.request<any>(`/api/customer/by-channel-partner?${query}`, {
        method: 'GET',
      });
    }
 
  private baseUrl: string;

  constructor() {
    // Always use the configured base URL for consistency
    this.baseUrl = CONFIG.apiBaseUrl;
  }

    // ----------------------------------------------------------------------
    // CHANNEL PARTNER MANAGEMENT APIs
    // ----------------------------------------------------------------------

    /**
     * Get channel partners list with pagination
     */
    async getChannelPartners(page: number = 1, limit: number = 10): Promise<ApiResponse<any>> {
      return this.request<any>(`/api/channel-partner?page=${page}&limit=${limit}`, {
        method: 'GET',
      });
    }

    /**
     * Create new channel partner
     * Supports FormData for file upload, or JSON for plain objects
     */
    async createChannelPartner(data: Record<string, any> | FormData): Promise<ApiResponse<any>> {
      if (data instanceof FormData) {
        // Get token from localStorage if available
        const token = localStorage.getItem('authToken');
        const url = import.meta.env.DEV ? '/api/channel-partner/create' : `${this.baseUrl}/api/channel-partner/create`;
        const requestOptions: RequestInit = {
          method: 'POST',
          headers: {
            // Do NOT set Content-Type for FormData
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: data,
          mode: 'cors',
          credentials: 'omit',
        };
        const response = await fetch(url, requestOptions);
        const contentType = response.headers.get('content-type');
        let respData;
        if (contentType && contentType.includes('application/json')) {
          respData = await response.json();
        } else {
          const text = await response.text();
          respData = text ? { message: text } : {};
        }
        if (!response.ok) {
          return { success: false, error: respData?.message || respData?.error || `HTTP Error: ${response.status}` };
        }
        return { success: true, data: respData };
      } else {
        // Otherwise, send as JSON
        return this.request<any>('/api/channel-partner/create', {
          method: 'POST',
          body: JSON.stringify(data),
        });
      }
    }

    /**
     * Get single channel partner by ID
     */
    async getChannelPartner(id: number): Promise<ApiResponse<any>> {
      return this.request<any>(`/api/channel-partner/${id}`, {
        method: 'GET',
      });
    }

    /**
     * Update channel partner by ID
     */
    async updateChannelPartner(id: number, data: Record<string, any>): Promise<ApiResponse<any>> {
      return this.request<any>(`/api/channel-partner/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    }

    /**
     * Delete channel partner by ID
     */
    async deleteChannelPartner(id: number): Promise<ApiResponse<any>> {
      return this.request<any>(`/api/channel-partner/${id}`, {
        method: 'DELETE',
      });
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

  /**
   * Customer login (Send OTP)
   */
  async customerLogin(loginData: CustomerLoginRequest): Promise<ApiResponse<CustomerLoginResponse>> {
    return this.request<CustomerLoginResponse>('/api/customer/login', {
      method: 'POST',
      body: JSON.stringify(loginData),
    });
  }

  /**
   * Verify OTP
   */
  async verifyOTP(otpData: OTPVerifyRequest): Promise<ApiResponse<OTPVerifyResponse>> {
    return this.request<OTPVerifyResponse>('/api/customer/otpverify', {
      method: 'POST',
      body: JSON.stringify(otpData),
    });
  }

  /**
   * Update customer profile
   */
  async updateProfile(profileData: ProfileUpdateRequest): Promise<ApiResponse<ProfileUpdateResponse>> {
    return this.request<ProfileUpdateResponse>('/api/customer/profileUpdate', {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
  }

  /**
   * Change customer password
   */
  async changePassword(passwordData: ChangePasswordRequest): Promise<ApiResponse<ChangePasswordResponse>> {
    return this.request<ChangePasswordResponse>('/api/customer/changePassword', {
      method: 'POST',
      body: JSON.stringify(passwordData),
    });
  }

  /**
   * Get states list with pagination
   */
  async getStates(page: number = 1, limit: number = 50): Promise<ApiResponse<StatesListResponse>> {
    return this.request<StatesListResponse>(`/api/state?page=${page}&limit=${limit}`, {
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
   * Get customer orders with filters
   */
  async getCustomerOrders(params: Record<string, string>): Promise<ApiResponse<any>> {
    const query = new URLSearchParams(params).toString();
    return this.request<any>(`/api/orders/customer-reports?${query}`, {
      method: 'GET',
    });
  }

  /**
   * Get city orders with filters
   */
  async getCityOrders(params: Record<string, string>): Promise<ApiResponse<any>> {
    const query = new URLSearchParams(params).toString();
    return this.request<any>(`/api/orders/city-wise-reports?${query}`, {
      method: 'GET',
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
   * Get user orders with pagination
   */
  async getMyOrders(page: number = 1, limit: number = 10): Promise<ApiResponse<any>> {
    return this.request<any>(`/api/my-order?page=${page}&limit=${limit}`, {
      method: 'GET',
    });
  }

  /**
   * Get single user order by ID
   */
  async getMyOrderById(orderId: number): Promise<ApiResponse<any>> {
    return this.request<any>(`/api/my-order/${orderId}`, {
      method: 'GET',
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

  // ----------------------------------------------------------------------
  // ORDER STATUS MANAGEMENT APIs
  // ----------------------------------------------------------------------

  /**
   * Get order statuses list with pagination
   */
  async getOrderStatuses(page: number = 1, limit: number = 10): Promise<ApiResponse<OrderStatusListResponse>> {
    return this.request<OrderStatusListResponse>(`/api/order-status?page=${page}&limit=${limit}`, {
      method: 'GET',
    });
  }

  /**
   * Get single order status by ID
   */
  async getOrderStatus(id: number): Promise<ApiResponse<OrderStatus>> {
    return this.request<OrderStatus>(`/api/order-status/${id}`, {
      method: 'GET',
    });
  }

  /**
   * Create new order status
   */
  async createOrderStatus(orderStatusData: CreateOrderStatusRequest): Promise<ApiResponse<OrderStatus>> {
    return this.request<OrderStatus>('/api/order-status/create', {
      method: 'POST',
      body: JSON.stringify(orderStatusData),
    });
  }

  /**
   * Update order status
   */
  async updateOrderStatus(orderStatusData: UpdateOrderStatusRequest): Promise<ApiResponse<OrderStatus>> {
    return this.request<OrderStatus>(`/api/order-status/${orderStatusData.id}`, {
      method: 'PUT',
      body: JSON.stringify(orderStatusData),
    });
  }

  /**
   * Delete order status
   */
  async deleteOrderStatus(id: number): Promise<ApiResponse<any>> {
    return this.request(`/api/order-status/${id}`, {
      method: 'DELETE',
    });
  }

  // ----------------------------------------------------------------------
  // SETTINGS MANAGEMENT APIs
  // ----------------------------------------------------------------------

  /**
   * Get settings list with pagination
   */
  async getSettings(page: number = 1, limit: number = 10): Promise<ApiResponse<SettingsListResponse>> {
    return this.request<SettingsListResponse>(`/api/settings?page=${page}&limit=${limit}`, {
      method: 'GET',
    });
  }

  /**
   * Get single setting by ID
   */
  async getSetting(id: number): Promise<ApiResponse<Setting>> {
    return this.request<Setting>(`/api/settings/${id}`, {
      method: 'GET',
    });
  }

  /**
   * Create new setting
   */
  async createSetting(settingData: CreateSettingRequest): Promise<ApiResponse<Setting>> {
    return this.request<Setting>('/api/settings/create', {
      method: 'POST',
      body: JSON.stringify(settingData),
    });
  }

  /**
   * Update setting
   */
  async updateSetting(id: number, settingData: UpdateSettingRequest): Promise<ApiResponse<Setting>> {
    return this.request<Setting>(`/api/settings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(settingData),
    });
  }

  /**
   * Delete setting
   */
  async deleteSetting(id: number): Promise<ApiResponse<any>> {
    return this.request(`/api/settings/${id}`, {
      method: 'DELETE',
    });
  }

  // ----------------------------------------------------------------------
  // SYSTEM SETTINGS APIs
  // ----------------------------------------------------------------------

  /**
   * Get Windows settings
   */
  async getWindowsSettings(): Promise<ApiResponse<WindowsSettingsData>> {
    return this.request<WindowsSettingsData>('/api/system/setting_windows', {
      method: 'GET',
    });
  }

  /**
   * Get Mac settings
   */
  async getWindowsSettingsMac(): Promise<ApiResponse<WindowsSettingsData>> {
    return this.request<WindowsSettingsData>('/api/system/setting_mac', {
      method: 'GET',
    });
  }

  /**
   * Save order indexes for configuration items
   */
  async saveOrderIndexes(orderData: SaveOrderRequest): Promise<ApiResponse<any>> {
    return this.request<any>('/api/system/save-order-indexes', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  /**
   * Create system configuration
   */
  async createSystemConfig(configData: SystemConfigRequest): Promise<ApiResponse<SystemConfigResponse>> {
    return this.request<SystemConfigResponse>('/api/system/system-config', {
      method: 'POST',
      body: JSON.stringify(configData),
    });
  }

  /**
   * Get system configuration by ID (for editing)
   */
  async getSystemConfig(id: number, parentTypeId?: number): Promise<ApiResponse<SystemConfigEditResponse>> {
    const params = parentTypeId ? `?parent_type_id=${parentTypeId}` : '';
    return this.request<SystemConfigEditResponse>(`/api/system/system-config/${id}${params}`, {
      method: 'GET',
    });
  }

  /**
   * Update system configuration
   */
  async updateSystemConfig(configData: SystemConfigRequest): Promise<ApiResponse<SystemConfigResponse>> {
    return this.request<SystemConfigResponse>('/api/system/system-config', {
      method: 'POST',
      body: JSON.stringify(configData),
    });
  }

  /**
   * Save system configuration order
   */
  async saveSystemConfigOrder(orderData: {
    config_type: string;
    item_ids: string[];
    is_mac: number;
  }): Promise<ApiResponse<{ success: boolean; message: string }>> {
    return this.request<{ success: boolean; message: string }>('/api/system/system-config-save-order', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  // ----------------------------------------------------------------------
  // DASHBOARD APIs
  // ----------------------------------------------------------------------

  /**
   * Get dashboard statistics
   */
  async getDashboardStats(): Promise<ApiResponse<{
    totalOrders: number;
    totalRegisters: number;
    totalApproved: number;
    ordersByMonth: {
      jan: number;
      feb: number;
      mar: number;
      apr: number;
      may: number;
      jun: number;
      jul: number;
      aug: number;
      sep: number;
      oct: number;
      nov: number;
      dec: number;
    };
    ordersByBrand: {
      apple: number;
      acer: number;
      lenovo: number;
      hp: number;
      dell: number;
      asus: number;
    };
    companyData: any[];
    userFiles: any[];
  }>> {
    return this.request('/api/dashboard', {
      method: 'GET',
    });
  }

}

export const apiService = new ApiService();