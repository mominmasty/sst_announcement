import React, { useState } from 'react';
import { Button } from '../ui/button';
import type { User } from '../../types';
import { apiService } from '../../services/api';
import { type UserRole, canManageUsers, getRoleDisplay, normalizeUserRole } from '../../utils/announcementUtils';
import { useAppUser } from '../../contexts/AppUserContext';

interface UserManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  loading?: boolean;
  onRefresh: () => void;
}

interface RoleChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onRoleChange: (userId: number, newRole: UserRole) => Promise<void>;
  loading: boolean;
}

const UserManagementModal: React.FC<UserManagementModalProps> = ({
  isOpen,
  onClose,
  users,
  loading = false,
  onRefresh,
}) => {
  const [searchEmail, setSearchEmail] = useState('');
  const [searchResult, setSearchResult] = useState<User | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUserForRole, setSelectedUserForRole] = useState<User | null>(null);
  const { user: currentUser } = useAppUser();
  
  const currentUserRole: UserRole = normalizeUserRole(currentUser?.role, currentUser?.is_admin);
  const isSuperAdmin = canManageUsers(currentUserRole);

  const handleSearch = async () => {
    if (!searchEmail.trim()) {
      setError('Please enter an email address');
      return;
    }
    setSearchLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await apiService.searchUsersByEmail(searchEmail);
      if (response.success && response.data) {
        setSearchResult(response.data);
        setSuccess('User found successfully');
      } else {
        setSearchResult(null);
        setError(response.error || 'User not found');
      }
    } catch (error) {
      setSearchResult(null);
      setError('Failed to search user. Please try again.');
      console.error('Search error:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleToggleAdmin = async (userId: number, currentStatus: boolean) => {
    if (!userId) {
      setError('Invalid user ID');
      return;
    }
    setUpdatingUserId(userId);
    setError(null);
    setSuccess(null);
    try {
      const response = await apiService.updateUserAdminStatus(userId, !currentStatus);
      if (response.success) {
        setSuccess(`User ${!currentStatus ? 'promoted to admin' : 'removed from admin'} successfully`);
        onRefresh();
        if (searchResult && searchResult.id === userId) {
          setSearchResult({ ...searchResult, is_admin: !currentStatus });
        }
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(response.error || 'Failed to update user status');
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update user status';
      setError(errorMessage);
      console.error('Failed to update user status:', error);
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleRoleChange = async (userId: number, newRole: UserRole) => {
    setUpdatingUserId(userId);
    setError(null);
    setSuccess(null);
    try {
      const response = await apiService.updateUserRole(userId, newRole);
      if (response.success) {
        setSuccess(`User role updated to ${getRoleDisplay(newRole)} successfully`);
        onRefresh();
        if (searchResult && searchResult.id === userId) {
          setSearchResult({ ...searchResult, role: newRole });
        }
        setShowRoleModal(false);
        setSelectedUserForRole(null);
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(response.error || 'Failed to update user role');
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update user role';
      setError(errorMessage);
      console.error('Failed to update user role:', error);
    } finally {
      setUpdatingUserId(null);
    }
  };

  const openRoleModal = (user: User) => {
    setSelectedUserForRole(user);
    setShowRoleModal(true);
    setError(null);
    setSuccess(null);
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xl animate-in fade-in duration-200"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="bg-black rounded-2xl border border-gray-900 shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto custom-scrollbar m-4 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        <div className="p-6 border-b border-gray-900 bg-black flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg ring-2 ring-white/10">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white">User Management</h2>
          </div>
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-900 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>
        <div className="p-6 space-y-6">
          {/* Error/Success Messages */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg flex items-center justify-between">
              <span>{error}</span>
              <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          {success && (
            <div className="bg-green-500/20 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg flex items-center justify-between">
              <span>{success}</span>
              <button onClick={() => setSuccess(null)} className="text-green-400 hover:text-green-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Search User by Email</h3>
            <div className="flex gap-2">
              <input
                type="email"
                value={searchEmail}
                onChange={(e) => {
                  setSearchEmail(e.target.value);
                  setError(null);
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Enter email address"
                className="flex-1 px-4 py-2.5 bg-black/70 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600/40 focus:border-blue-600/40"
              />
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSearch} disabled={searchLoading}>
                {searchLoading ? 'Searching...' : 'Search'}
              </Button>
            </div>
            {searchResult && (
              <div className="mt-4 bg-black/70 rounded-lg p-4 border border-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium">{searchResult.email}</div>
                    <div className="text-sm text-gray-400 flex items-center gap-2">
                      {searchResult.username || 'No username'}
                      {(() => {
                        const userRole = normalizeUserRole(searchResult.role, searchResult.is_admin);
                        const roleConfig = {
                          super_admin: { label: 'SUPER ADMIN', bg: 'bg-purple-600' },
                          admin: { label: 'ADMIN', bg: 'bg-blue-600' },
                          student_admin: { label: 'STUDENT ADMIN', bg: 'bg-green-600' },
                          student: { label: 'STUDENT', bg: 'bg-gray-600' }
                        };
                        const config = roleConfig[userRole as keyof typeof roleConfig] || roleConfig.student;
                        return (
                          <span className={`ml-2 px-2 py-1 ${config.bg} text-white text-xs rounded`}>
                            {config.label}
                          </span>
                        );
                      })()}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {isSuperAdmin ? (
                      <Button
                        onClick={() => openRoleModal(searchResult)}
                        disabled={updatingUserId === searchResult.id}
                        variant="default"
                        size="sm"
                      >
                        {updatingUserId === searchResult.id ? 'Updating...' : 'Change Role'}
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleToggleAdmin(searchResult.id, searchResult.is_admin || false)}
                        disabled={updatingUserId === searchResult.id}
                        variant={searchResult.is_admin ? 'outline' : 'default'}
                        size="sm"
                        className={searchResult.is_admin ? 'border-red-600 text-red-400 hover:bg-red-600/20' : ''}
                      >
                        {updatingUserId === searchResult.id
                          ? 'Updating...'
                          : searchResult.is_admin
                          ? 'Remove Admin'
                          : 'Make Admin'}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">All Users ({users.length})</h3>
            {loading ? (
              <div className="text-gray-400 text-center py-8">Loading users...</div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar-thin">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="bg-black/70 rounded-lg p-4 border border-gray-800 flex items-center justify-between hover:bg-gray-900/40 hover:border-gray-700 transition-colors"
                  >
                    <div>
                      <div className="text-white font-medium">{user.email}</div>
                      <div className="text-sm text-gray-400 flex items-center gap-2">
                        {user.username || 'No username'}
                        {(() => {
                          const userRole = normalizeUserRole(user.role, user.is_admin);
                          const roleConfig = {
                            super_admin: { label: 'SUPER ADMIN', bg: 'bg-purple-600' },
                            admin: { label: 'ADMIN', bg: 'bg-blue-600' },
                            student_admin: { label: 'STUDENT ADMIN', bg: 'bg-green-600' },
                            student: { label: 'STUDENT', bg: 'bg-gray-600' }
                          };
                          const config = roleConfig[userRole as keyof typeof roleConfig] || roleConfig.student;
                          return (
                            <span className={`ml-2 px-2 py-1 ${config.bg} text-white text-xs rounded`}>
                              {config.label}
                            </span>
                          );
                        })()}
                      </div>
                    </div>
                    {isSuperAdmin ? (
                      <Button
                        onClick={() => openRoleModal(user)}
                        disabled={updatingUserId === user.id}
                        variant="default"
                        size="sm"
                      >
                        {updatingUserId === user.id ? 'Updating...' : 'Change Role'}
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleToggleAdmin(user.id, user.is_admin || false)}
                        disabled={updatingUserId === user.id}
                        variant={user.is_admin ? 'outline' : 'default'}
                        size="sm"
                        className={user.is_admin ? 'border-red-600 text-red-400 hover:bg-red-600/20' : ''}
                      >
                        {updatingUserId === user.id
                          ? 'Updating...'
                          : user.is_admin
                          ? 'Remove Admin'
                          : 'Make Admin'}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
      
      {showRoleModal && selectedUserForRole && (
        <RoleChangeModal
          isOpen={showRoleModal}
          onClose={() => {
            setShowRoleModal(false);
            setSelectedUserForRole(null);
          }}
          user={selectedUserForRole}
          onRoleChange={handleRoleChange}
          loading={updatingUserId === selectedUserForRole.id}
        />
      )}
    </>
  );
};

const RoleChangeModal: React.FC<RoleChangeModalProps> = ({ 
  isOpen, 
  onClose, 
  user, 
  onRoleChange, 
  loading 
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(
    normalizeUserRole(user.role, user.is_admin)
  );

  const availableRoles: { value: UserRole; label: string; description: string }[] = [
    { value: 'student', label: 'Student', description: 'Basic user access' },
    { value: 'student_admin', label: 'Student Admin', description: 'Admin access with lower announcement priority' },
    { value: 'admin', label: 'Admin', description: 'Full admin access with higher announcement priority' },
    { value: 'super_admin', label: 'Super Admin', description: 'Highest access level, can manage all users' },
  ];

  const handleSubmit = () => {
    onRoleChange(user.id, selectedRole);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="bg-gray-900 rounded-2xl border border-gray-700 shadow-2xl w-full max-w-md m-4 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        <div className="p-6 border-b border-gray-700">
          <h3 className="text-xl font-bold text-white mb-2">Change User Role</h3>
          <p className="text-gray-400 text-sm">
            Changing role for: <span className="text-white font-medium">{user.email}</span>
          </p>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="space-y-3">
            {availableRoles.map((role) => (
              <label
                key={role.value}
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedRole === role.value
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-gray-700 hover:border-gray-600 hover:bg-gray-800/50'
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value={role.value}
                  checked={selectedRole === role.value}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  className="mt-1 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900"
                />
                <div className="flex-1">
                  <div className="text-white font-medium">{role.label}</div>
                  <div className="text-gray-400 text-sm">{role.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-700 flex gap-3 justify-end">
          <Button
            onClick={onClose}
            variant="outline"
            disabled={loading}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || selectedRole === normalizeUserRole(user.role, user.is_admin)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? 'Updating...' : 'Update Role'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserManagementModal;
