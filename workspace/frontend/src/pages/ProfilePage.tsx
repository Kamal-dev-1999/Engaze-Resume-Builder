import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAppDispatch } from '../utils/hooks';
import { logout } from '../redux/slices/authSlice';
import { authAPI } from '../services/api';

interface UserProfile {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

const ProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Form states for profile editing
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  
  // Form states for password change
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching user profile...');
        const profileData = await authAPI.getProfile();
        console.log('Profile data:', profileData);
        setProfile(profileData);
        setFirstName(profileData.first_name || '');
        setLastName(profileData.last_name || '');
        setEmail(profileData.email || '');
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleSaveProfile = async () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setError('All fields are required');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Invalid email format');
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      console.log('Updating profile...');
      const updatedProfile = await authAPI.updateProfile({
        first_name: firstName,
        last_name: lastName,
        email: email
      });
      console.log('Profile updated:', updatedProfile);
      setProfile(updatedProfile);
      setIsEditMode(false);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error('Error updating profile:', err);
      const errorMessage = err.response?.data?.detail || 
                          err.response?.data?.message || 
                          'Failed to update profile. Please try again.';
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError(null);

    if (!oldPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      setPasswordError('All password fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long');
      return;
    }

    setIsSaving(true);
    try {
      console.log('Changing password...');
      await authAPI.changePassword({
        old_password: oldPassword,
        new_password: newPassword
      });
      console.log('Password changed successfully');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordForm(false);
      setSuccessMessage('Password changed successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error('Error changing password:', err);
      const errorMessage = err.response?.data?.detail || 
                          err.response?.data?.message || 
                          'Failed to change password. Please check your current password.';
      setPasswordError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFirstName(profile.first_name || '');
      setLastName(profile.last_name || '');
      setEmail(profile.email || '');
      setIsEditMode(false);
      setError(null);
    }
  };

  // Don't redirect based on user state - ProtectedRoute handles auth check
  // Just check if we got an auth error during profile fetch
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar onLogout={handleLogout} />
      
      <main className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-semibold transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Dashboard
            </button>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 border-l-4 border-l-green-500 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-green-800 font-medium">{successMessage}</span>
            </div>
          )}

          {loading ? (
            <div className="bg-white shadow-lg rounded-xl p-12 flex justify-center items-center">
              <div className="flex flex-col items-center gap-4">
                <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-gray-600 font-medium">Loading profile...</p>
              </div>
            </div>
          ) : error && !isEditMode ? (
            <div className="bg-white shadow-lg rounded-xl p-8 border-l-4 border-l-red-500">
              <div className="flex items-start gap-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Profile</h3>
                  <p className="text-red-700 mb-4">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
                  >
                    Retry
                  </button>
                </div>
              </div>
            </div>
          ) : profile ? (
            <div className="space-y-6">
              {/* Profile Header Card */}
              <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 h-40"></div>
                <div className="px-6 sm:px-8 pb-8">
                  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-20 mb-8">
                    <div className="flex items-end gap-4">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-500 via-blue-400 to-purple-500 rounded-2xl flex items-center justify-center text-white shadow-lg border-4 border-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="pb-2">
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
                          {firstName} {lastName}
                        </h1>
                        <p className="text-gray-500 text-sm font-medium mt-1">@{profile.username}</p>
                      </div>
                    </div>
                    {!isEditMode && (
                      <button
                        onClick={() => setIsEditMode(true)}
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 font-semibold text-sm flex items-center gap-2 whitespace-nowrap shadow-md hover:shadow-lg"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM9.172 9.172a2 2 0 012.828 0l7.071-7.071a2 2 0 10-2.828-2.828L9.172 6.344a2 2 0 000 2.828z" />
                        </svg>
                        Edit Profile
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Profile Information Card */}
              <div className="bg-white shadow-lg rounded-xl p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a1 1 0 001 1h14a1 1 0 001-1V6a2 2 0 00-2-2H4zm2 6a1 1 0 100 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                </div>

                {error && isEditMode && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 border-l-4 border-l-red-500 rounded-lg flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="text-red-700 text-sm font-medium">{error}</p>
                  </div>
                )}

                {isEditMode ? (
                  // Edit Mode
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
                          First Name
                        </label>
                        <input
                          id="firstName"
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400"
                          placeholder="Enter your first name"
                        />
                      </div>

                      <div>
                        <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
                          Last Name
                        </label>
                        <input
                          id="lastName"
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400"
                          placeholder="Enter your last name"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400"
                        placeholder="Enter your email"
                      />
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                      <button
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className="flex-1 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                      >
                        {isSaving ? (
                          <>
                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                          </>
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1 4.5 4.5 0 11-4.814 6.5z" />
                            </svg>
                            Save Changes
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleCancel}
                        disabled={isSaving}
                        className="flex-1 px-6 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 active:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="pb-6 border-b md:border-b-0">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">First Name</p>
                        <p className="text-xl font-semibold text-gray-900">{firstName || '—'}</p>
                      </div>
                      <div className="pb-6 border-b md:border-b-0">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Last Name</p>
                        <p className="text-xl font-semibold text-gray-900">{lastName || '—'}</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</p>
                      <p className="text-xl font-semibold text-gray-900">{email}</p>
                    </div>

                    <div className="pt-2">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Username</p>
                      <p className="text-xl font-semibold text-gray-900">@{profile.username}</p>
                    </div>

                    <div className="pt-2">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">User ID</p>
                      <p className="text-lg font-mono text-gray-700 bg-gray-50 px-3 py-2 rounded-lg inline-block">{profile.id}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Security Section */}
              <div className="bg-white shadow-lg rounded-xl p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Security</h2>
                </div>

                {!showPasswordForm ? (
                  <button
                    onClick={() => setShowPasswordForm(true)}
                    className="px-6 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 active:bg-orange-700 transition-all duration-200 font-semibold text-sm flex items-center gap-2 shadow-md hover:shadow-lg"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    Change Password
                  </button>
                ) : (
                  <div className="space-y-5">
                    {passwordError && (
                      <div className="p-4 bg-red-50 border border-red-200 border-l-4 border-l-red-500 rounded-lg flex items-start gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <p className="text-red-700 text-sm font-medium">{passwordError}</p>
                      </div>
                    )}

                    <div>
                      <label htmlFor="oldPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                        Current Password
                      </label>
                      <input
                        id="oldPassword"
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all placeholder-gray-400"
                        placeholder="Enter your current password"
                      />
                    </div>

                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                        New Password
                      </label>
                      <input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all placeholder-gray-400"
                        placeholder="Enter your new password (min 8 characters)"
                      />
                      <p className="text-xs text-gray-500 mt-2 font-medium">Minimum 8 characters required</p>
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all placeholder-gray-400"
                        placeholder="Confirm your new password"
                      />
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                      <button
                        onClick={handleChangePassword}
                        disabled={isSaving}
                        className="flex-1 px-6 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 active:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-sm shadow-md hover:shadow-lg"
                      >
                        {isSaving ? 'Updating...' : 'Update Password'}
                      </button>
                      <button
                        onClick={() => {
                          setShowPasswordForm(false);
                          setOldPassword('');
                          setNewPassword('');
                          setConfirmPassword('');
                          setPasswordError(null);
                        }}
                        disabled={isSaving}
                        className="flex-1 px-6 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 active:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
