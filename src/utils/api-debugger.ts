import { apiService } from './api-service';
import { CONFIG } from '../config-global';

// ----------------------------------------------------------------------

/**
 * Debugging utilities for API testing
 */
export class ApiDebugger {
  /**
   * Test the admin login API with debug information
   */
  static async testAdminLogin() {
    console.group('🔍 Admin Login API Test');
    
    console.log('📋 Configuration:');
    console.log('Base URL:', CONFIG.apiBaseUrl);
    console.log('Development Mode:', import.meta.env.DEV);
    console.log('Proxy URL (dev):', import.meta.env.DEV ? '/api/auth/login' : `${CONFIG.apiBaseUrl}/api/auth/login`);
    
    console.log('\n📤 Request Details:');
    const credentials = { email: 'admin', password: '123456' };
    console.log('Credentials:', credentials);
    
    try {
      console.log('\n⏳ Making API call...');
      const response = await apiService.adminLogin(credentials);
      
      console.log('\n📥 Response:');
      console.log('Success:', response.success);
      
      if (response.success) {
        console.log('✅ Login successful!');
        console.log('Data:', response.data);
      } else {
        console.log('❌ Login failed!');
        console.log('Error:', response.error);
      }
      
      return response;
    } catch (error) {
      console.log('\n💥 Exception occurred:');
      console.error(error);
      return { success: false, error: 'Exception occurred' };
    } finally {
      console.groupEnd();
    }
  }

  /**
   * Test API connectivity
   */
  static async testConnection() {
    console.group('🌐 API Connection Test');
    
    try {
      const testUrl = import.meta.env.DEV ? '/api/health' : CONFIG.apiBaseUrl;
      console.log('Testing URL:', testUrl);
      
      // Try a simple fetch to see if the server is reachable
      const response = await fetch(testUrl, { 
        method: 'GET',
        mode: 'cors',
      });
      
      console.log('Server Response Status:', response.status);
      console.log('Server Response Status Text:', response.statusText);
      
      if (response.ok) {
        console.log('✅ Server is reachable!');
      } else {
        console.log('⚠️ Server responded with error status');
      }
      
    } catch (error) {
      console.log('❌ Server is not reachable');
      console.error('Connection Error:', error);
    } finally {
      console.groupEnd();
    }
  }

  /**
   * Manual API test using raw fetch
   */
  static async testRawLogin() {
    console.group('🔧 Raw Fetch Test');
    
    const url = import.meta.env.DEV ? '/api/auth/login' : `${CONFIG.apiBaseUrl}/api/auth/login`;
    const credentials = { email: 'admin', password: '123456' };
    
    console.log('URL:', url);
    console.log('Development Mode:', import.meta.env.DEV);
    console.log('Payload:', credentials);
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify(credentials),
      });
      
      console.log('Response Status:', response.status);
      console.log('Response Headers:', Object.fromEntries(response.headers.entries()));
      
      const responseText = await response.text();
      console.log('Response Text:', responseText);
      
      try {
        const responseJson = JSON.parse(responseText);
        console.log('Response JSON:', responseJson);
      } catch {
        console.log('Response is not valid JSON');
      }
      
    } catch (error) {
      console.error('Raw fetch error:', error);
    } finally {
      console.groupEnd();
    }
  }
}

// Make it available globally for browser console testing
if (typeof window !== 'undefined') {
  (window as any).ApiDebugger = ApiDebugger;
}