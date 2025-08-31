'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, Eye, UserPlus, Shield, 
  Mail, Phone, Calendar, Search, Filter,
  MoreVertical, CheckCircle, XCircle, Clock
} from 'lucide-react';
import InputField from '@/components/ui/InputField';
import CustomSelect from '@/components/ui/CustomSelect';
import AdminLayout from '@/components/admin/AdminLayout';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'EDITOR' | 'AUTHOR' | 'VIEWER';
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  avatar: string;
  joinedAt: string;
  lastLogin: string;
  postsCount: number;
  phone?: string;
  department?: string;
}

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'USER' as const,
    phone: '',
    department: ''
  });

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 }
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: '1',
        limit: '10',
        ...(roleFilter !== 'ALL' && { role: roleFilter }),
        ...(searchTerm && { search: searchTerm })
      });

      const response = await fetch(`/api/admin/users?${params}`);
      if (!response.ok) throw new Error('Failed to fetch users');
      
      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create new user
  const handleCreateUser = async () => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) throw new Error('Failed to create user');
      
      // Reset form and refresh users
      setNewUser({
        name: '',
        email: '',
        role: 'USER',
        phone: '',
        department: ''
      });
      setShowAddUser(false);
      fetchUsers();
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Failed to create user');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, searchTerm]);

  const filteredUsers = users;

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-100 text-red-900';
      case 'EDITOR': return 'bg-blue-100 text-blue-900';
      case 'AUTHOR': return 'bg-green-100 text-green-900';
      case 'VIEWER': return 'bg-gray-100 text-gray-900';
      default: return 'bg-gray-100 text-gray-900';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-900';
      case 'INACTIVE': return 'bg-red-100 text-red-900';
      case 'PENDING': return 'bg-yellow-100 text-yellow-900';
      default: return 'bg-gray-100 text-gray-900';
    }
  };

  return (
    <AdminLayout title="User Management" subtitle="Manage user accounts and permissions">
      <div className="max-w-7xl mx-auto">
        {/* Stats Cards */}
        <motion.div 
          initial="initial"
          animate="animate"
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          {[
            { label: 'Total Users', value: users.length.toString(), icon: UserPlus, color: 'text-blue-900' },
            { label: 'Active Users', value: users.filter(u => u.status === 'ACTIVE').length.toString(), icon: CheckCircle, color: 'text-green-900' },
            { label: 'Pending Users', value: users.filter(u => u.status === 'PENDING').length.toString(), icon: Clock, color: 'text-yellow-900' },
            { label: 'Admins', value: users.filter(u => u.role === 'ADMIN').length.toString(), icon: Shield, color: 'text-red-900' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="bg-white p-6 rounded-xl shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Search and Filters */}
        <motion.div 
          variants={fadeInUp}
          className="bg-white p-6 rounded-xl shadow-sm mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
                          <InputField
                type="search"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={Search}
                variant="minimal"
                size="sm"
                className="flex-1"
                inputClassName="text-gray-900"
              />
            <div className="w-[200px]">
              <CustomSelect
                options={[
                  { value: 'ALL', label: 'All Roles', emoji: '👥' },
                  { value: 'ADMIN', label: 'Admin', emoji: '👑' },
                  { value: 'EDITOR', label: 'Editor', emoji: '✏️' },
                  { value: 'AUTHOR', label: 'Author', emoji: '✍️' },
                  { value: 'VIEWER', label: 'Viewer', emoji: '👁️' }
                ]}
                value={roleFilter}
                onChange={setRoleFilter}
                placeholder="Filter by Role"
                width="w-full"
              />
            </div>
            <div className="w-[200px]">
              <CustomSelect
                options={[
                  { value: 'ALL', label: 'All Status', emoji: '📊' },
                  { value: 'ACTIVE', label: 'Active', emoji: '✅' },
                  { value: 'INACTIVE', label: 'Inactive', emoji: '❌' },
                  { value: 'PENDING', label: 'Pending', emoji: '⏳' }
                ]}
                value={statusFilter}
                onChange={setStatusFilter}
                placeholder="Filter by Status"
                width="w-full"
              />
            </div>
          </div>
        </motion.div>

        {/* Users Table */}
        <motion.div 
          variants={fadeInUp}
          className="bg-white rounded-xl shadow-sm overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coral-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading users...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Posts
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Login
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-coral-light rounded-full flex-shrink-0 flex items-center justify-center">
                            <span className="text-coral-primary font-medium">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {user.name}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {user.email}
                            </p>
                            {user.department && (
                              <p className="text-xs text-gray-400">
                                {user.department}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.postsCount} posts
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.lastLogin).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-coral-primary hover:text-coral-secondary"
                          >
                            <Eye className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-blue-500 hover:text-blue-600"
                          >
                            <Edit className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>

      {/* Add User Modal */}
      {showAddUser && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowAddUser(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New User</h3>
            
            <div className="space-y-4">
              <InputField
                type="text"
                placeholder="Full Name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                variant="minimal"
                size="md"
                inputClassName="text-gray-900"
              />
              <InputField
                type="email"
                placeholder="Email Address"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                variant="minimal"
                size="md"
                inputClassName="text-gray-900"
              />
              <InputField
                type="tel"
                placeholder="Phone Number (Optional)"
                value={newUser.phone}
                onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                variant="minimal"
                size="md"
                inputClassName="text-gray-900"
              />
              <CustomSelect
                options={[
                  { value: 'USER', label: 'User', emoji: '👤' },
                  { value: 'AUTHOR', label: 'Author', emoji: '✍️' },
                  { value: 'ADMIN', label: 'Admin', emoji: '👑' }
                ]}
                value={newUser.role}
                onChange={(value) => setNewUser({ ...newUser, role: value as any })}
                placeholder="Select Role"
                width="w-full"
              />
            </div>

            <div className="flex gap-3 mt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowAddUser(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCreateUser}
                disabled={!newUser.name || !newUser.email}
                className="flex-1 px-4 py-2 bg-coral-primary text-white rounded-lg hover:bg-coral-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add User
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AdminLayout>
  );
}
