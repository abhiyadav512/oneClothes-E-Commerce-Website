import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

import { useDeleteUser, useGetAllProfile, useUpdateRole } from '@/hooks/useProfile';
import UserCardAdmin from './UserCardAdmin';
import { Skeleton } from '@/components/ui/skeleton';

const CustomersManagement = () => {
  const { user } = useSelector((state) => state.auth);
  const { data, isLoading, error } = useGetAllProfile();
  const [filterRole, setFilterRole] = useState('ALL');
  const [filterLocation, setFilterLocation] = useState('');
  const queryClient = useQueryClient();

  const users = data?.data || [];
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  const filteredUsers = users.filter((u) =>
    (filterRole === 'ALL' || u.role === filterRole) &&
    (filterLocation.trim() === '' || u.location?.toLowerCase().includes(filterLocation.toLowerCase()))
  );

  const updateRoleMutation = useUpdateRole({
    onSuccess: () => {
      toast.success('User role updated');
      queryClient.invalidateQueries(['customer']);
    },
    onError: (err) => {
      toast.error(err?.message || 'Failed to update role');
    },
  });

  const handleEdit = (updatedUser) => {
    updateRoleMutation.mutate({ id: updatedUser.id, role: updatedUser.role });
  };

  const deleteUserMutation = useDeleteUser({
    onSuccess: () => {
      toast.success("User deleted successfully");
      queryClient.invalidateQueries(['customer']);
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to delete user");
    },
  });

  const handleDelete = (userToDelete) => {
    if (window.confirm(`Are you sure you want to delete ${userToDelete.name}?`)) {
      deleteUserMutation.mutate(userToDelete.id);
    }
  };
  
  
  return (
    <div className="space-y-6 px-4 py-6 md:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Customers Management</h1>
        <div className="text-sm text-gray-600">
          Showing <strong>{filteredUsers.length}</strong> of <strong>{users.length}</strong> users
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="w-full md:w-48 border px-3 py-2 rounded text-sm text-gray-700"
        >
          <option value="ALL">All Roles</option>
          <option value="ADMIN">Admin</option>
          <option value="SUPER_ADMIN">Super Admin</option>
          <option value="USER">User</option>
        </select>

        <input
          placeholder="Filter by location"
          value={filterLocation}
          onChange={(e) => setFilterLocation(e.target.value)}
          className="w-full md:w-60 border px-3 py-2 rounded text-sm text-gray-700"
        />
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-md" />
          ))}
        </div>
      ) : error ? (
        <div className="text-red-600">Failed to load users.</div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-gray-500 text-sm">No users found matching the filters.</div>
      ) : (
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <UserCardAdmin
              key={user.id}
              user={user}
              isSuperAdmin={isSuperAdmin}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomersManagement;
