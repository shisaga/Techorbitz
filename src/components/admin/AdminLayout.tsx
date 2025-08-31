'use client';

import { motion } from 'framer-motion';
import { ReactNode, useState, useEffect } from 'react';
import { Menu, LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AdminSidebar from './AdminSidebar';

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export default function AdminLayout({ children, title, subtitle }: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user, logout } = useAuth();

  // Load initial state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState !== null) {
      setSidebarCollapsed(savedState === 'true');
    }
  }, []);

  // Handle sidebar toggle
  const handleSidebarToggle = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', newState.toString());
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
      {/* Sidebar - Controlled by AdminLayout */}
      <AdminSidebar 
        collapsed={sidebarCollapsed} 
        onToggle={handleSidebarToggle}
      />
      
      {/* Main content */}
      <main className="flex-1 transition-all duration-300 overflow-hidden">
        {/* Top bar */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-sm border-b sticky top-0 z-40"
        >
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                {title && (
                  <h1 className="text-2xl font-bold text-gray-900">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="text-gray-600 mt-1">
                    {subtitle}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-4">
                {/* Sidebar Toggle Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSidebarToggle}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                >
                  <Menu className="w-5 h-5 text-gray-600" />
                </motion.button>

                {/* User Info */}
                {user && (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="w-4 h-4" />
                      <span>{user.name || user.email}</span>
                    </div>
                    
                    {/* Logout Button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleLogout}
                      className="p-2 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
                      title="Logout"
                    >
                      <LogOut className="w-5 h-5" />
                    </motion.button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.header>

        {/* Page content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6  !h-[calc(100vh-100px)] overflow-y-auto overflow-x-hidden"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
