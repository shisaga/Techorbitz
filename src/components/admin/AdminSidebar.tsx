'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, FileText, Users, Image,
  Settings, BarChart3, Calendar, MessageSquare,
  ChevronLeft, ChevronRight, User, Home, LogOut
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface NavItem {
  id: string;
  label: string;
  icon: any;
  href: string;
  badge?: string;
}

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home, href: '/' },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
  { id: 'posts', label: 'Posts', icon: FileText, href: '/admin/posts' },
  { id: 'editor', label: 'Editor', icon: FileText, href: '/admin/editor' },
  { id: 'users', label: 'Users', icon: Users, href: '/admin/users' },
  { id: 'media', label: 'Media', icon: Image, href: '/admin/media' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, href: '/admin/analytics' },
  { id: 'comments', label: 'Comments', icon: MessageSquare, href: '/admin/comments' },
  { id: 'calendar', label: 'Calendar', icon: Calendar, href: '/admin/calendar' },
  { id: 'settings', label: 'Settings', icon: Settings, href: '/admin/settings' }
];

export default function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="h-screen bg-white border-r border-gray-200 flex-shrink-0 overflow-hidden"
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
              <div className="w-8 h-8 bg-coral-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="font-semibold text-gray-900">TechXak</span>
            </motion.div>
          )}
          {collapsed && (
            <div className="w-8 h-8 bg-coral-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">T</span>
            </div>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggle}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </motion.button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <motion.div key={item.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group ${active ? 'bg-coral-primary text-white' : 'text-gray-700 hover:bg-gray-100'
                    } ${collapsed ? 'justify-center' : ''}`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-white' : 'text-gray-500 group-hover:text-coral-primary'}`} />
                  <motion.span
                    animate={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : 'auto' }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden whitespace-nowrap flex-1 font-medium"
                  >
                    {item.label}
                  </motion.span>
                  {!collapsed && item.badge && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`px-2 py-1 text-xs font-medium rounded-full ${active ? 'bg-white text-coral-primary' : 'bg-coral-light text-coral-primary'
                        }`}
                    >
                      {item.badge}
                    </motion.span>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-gray-200 flex-shrink-0 relative">
          <motion.div
            animate={{ width: collapsed ? 0 : 'auto' }}
            className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}
          >
           {!collapsed && (<> <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center ">
              <User className="w-4 h-4 text-gray-600" />
            </div>
            
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500">admin@techxak.com</p>
              </div></>
            )}
            {!collapsed ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={logout}
                className="p-1 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
              >
                <LogOut className="w-4 h-4 text-gray-600" />
              </motion.button>
            ) : (
              <div
                onClick={logout}
                className='flex items-center justify-center  absolute  left-0 right-0 h-10 my-4 bg-gray-300  rounded -ml-1'
                
              >
                <LogOut className="w-4 h-4 text-gray-600" />
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.aside>
  );
}
