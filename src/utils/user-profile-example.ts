// Example usage of the new profile APIs in user dashboard components
import { apiService } from './api-service';

// Example: Update Profile Function
export async function updateUserProfile(profileData: {
  fullname: string;
  email: string;
  address: string;
  state: string;
  pincode: string;
}) {
  try {
    const response = await apiService.updateProfile(profileData);
    
    if (response.success) {
      console.log('Profile updated successfully:', response.data);
      // You can show success message to user
      return { success: true, message: 'Profile updated successfully!' };
    } else {
      console.error('Profile update failed:', response.error);
      return { success: false, message: response.error || 'Profile update failed' };
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    return { success: false, message: 'Network error occurred' };
  }
}

// Example: Change Password Function
export async function changeUserPassword(passwordData: {
  oldPassword: string;
  newPassword: string;
}) {
  try {
    const response = await apiService.changePassword(passwordData);
    
    if (response.success) {
      console.log('Password changed successfully:', response.data);
      // You can show success message to user
      return { success: true, message: 'Password changed successfully!' };
    } else {
      console.error('Password change failed:', response.error);
      return { success: false, message: response.error || 'Password change failed' };
    }
  } catch (error) {
    console.error('Error changing password:', error);
    return { success: false, message: 'Network error occurred' };
  }
}

// Example: How to use in a React component
/*
import { useState } from 'react';
import { updateUserProfile, changeUserPassword } from 'src/utils/user-profile-example';

function ProfileForm() {
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    fullname: '',
    email: '',
    address: '',
    state: '',
    pincode: ''
  });

  const handleUpdateProfile = async () => {
    setLoading(true);
    const result = await updateUserProfile(profileData);
    
    if (result.success) {
      // Show success message
      alert(result.message);
    } else {
      // Show error message
      alert(result.message);
    }
    setLoading(false);
  };

  const handleChangePassword = async () => {
    setLoading(true);
    const result = await changeUserPassword({
      oldPassword: 'currentPassword',
      newPassword: 'newPassword'
    });
    
    if (result.success) {
      alert(result.message);
    } else {
      alert(result.message);
    }
    setLoading(false);
  };

  return (
    // Your form JSX here
  );
}
*/