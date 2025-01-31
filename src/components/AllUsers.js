import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import EditUserModal from './EditUserModal';
import { toast } from 'react-toastify';

const DeleteConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  userName 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Confirm Deletion</h2>
        <p className="mb-6">
          Are you sure you want to delete the user 
          <span className="font-bold"> {userName}</span>?
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  // ... (previous methods remain the same)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await axios.get('https://new-auth-with-admin.vercel.app/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setUsers(response.data.users);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to fetch users');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleEditUser = (userData) => {
    setSelectedUser(userData);
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = (updatedUser) => {
    setUsers(prevUsers => 
      prevUsers.map(u => u._id === updatedUser._id ? updatedUser : u)
    );
  };

  const initiateDeleteUser = (userId) => {
    // Check if trying to delete own account
    if (userId === user._id) {
      toast.error("You cannot delete your own account");
      return;
    }

    const userToDelete = users.find(u => u._id === userId);
    setUserToDelete(userToDelete);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`https://new-auth-with-admin.vercel.app/api/admin/user/${userToDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUsers(prevUsers => prevUsers.filter(u => u._id !== userToDelete._id));
      toast.success('User deleted successfully');
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(error.response?.data?.message || 'Failed to delete user');
      setIsDeleteModalOpen(false);
    }
  };

  const handleBack = () => {
    navigate('/admin/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="container mx-auto max-w-6xl">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white p-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold">Manage Users</h1>
            <button 
              onClick={handleBack}
              className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>

          {/* Users Table */}
          <div className="p-6">
  <div className="overflow-x-auto">
    <table className="w-full table-auto">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-4 py-2 text-center">Name</th>
          <th className="px-4 py-2 text-center">Email</th>
          <th className="px-4 py-2 text-center">Mobile No</th>
          <th className="px-4 py-2 text-center">Role</th>
          <th className="px-4 py-2 text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((userData) => (
          <tr 
            key={userData._id} 
            className="border-b hover:bg-gray-50 transition-colors"
          >
            <td className="px-4 py-3 text-center">
              <div className="flex items-center justify-center">
                {userData.profilePicture ? (
                  <img 
                    src={userData.profilePicture} 
                    alt={userData.name} 
                    className="w-10 h-10 rounded-full mr-3 object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full mr-3 bg-blue-200 flex items-center justify-center text-blue-800">
                    {userData.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="font-medium">{userData.name}</span>
              </div>
            </td>
            <td className="px-4 py-3 text-center">
              <div className="flex items-center justify-center">
                <span className="text-black-600 font-medium">{userData.email}</span>
              </div>
            </td>
            <td className="px-4 py-3 text-center">
              <div className="flex items-center justify-center">
                <span className="text-black-600 font-medium">
                  {userData.mobileNumber || 'N/A'}
                </span>
              </div>
            </td>
            <td className="px-4 py-3 text-center">
              <div className="flex items-center justify-center">
                <span 
                  className={`
                    px-3 py-1 rounded-full text-x font-semibold text-center
                    ${userData.role === 'superadmin' 
                      ? 'bg-red-200 text-red-800' 
                      : userData.role === 'admin' 
                      ? 'bg-blue-200 text-blue-800' 
                      : 'bg-green-200 text-green-800'
                    }
                  `}
                >
                  {userData.role}
                </span>
              </div>
            </td>
            <td className="px-4 py-3">
              <div className="flex justify-center space-x-2">
                <button 
                  className="
                    bg-blue-500 text-white px-4 py-2 rounded 
                    hover:bg-blue-600 transition-colors 
                    flex items-center justify-center
                    group
                  "
                  onClick={() => handleEditUser(userData)}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 mr-2 group-hover:animate-pulse" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Edit
                </button>
                <button 
                  className="
                    bg-red-500 text-white px-4 py-2 rounded 
                    hover:bg-red-600 transition-colors 
                    flex items-center justify-center
                    group
                  "
                  onClick={() => initiateDeleteUser(userData._id)}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 mr-2 group-hover:animate-pulse" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* Empty State */}
    {users.length === 0 && (
      <div className="text-center py-10 text-gray-500">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-16 w-16 mx-auto mb-4 text-gray-300" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path 
            fillRule="evenodd" 
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" 
            clipRule="evenodd" 
          />
        </svg>
        <p className="text-xl">No users found</p>
      </div>
    )}
  </div>
</div>

        </div>

        {/* Edit User Modal */}
        <EditUserModal
          user={selectedUser}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onUpdateUser={handleUpdateUser}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setUserToDelete(null);
          }}
          onConfirm={handleDeleteUser}
          userName={userToDelete?.name}
        />
      </div>
    </div>
  );
};

export default AllUsers;
