'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Settings, Save, User, Shield, Bell, Palette, Database, Globe } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import InputField from '@/components/ui/InputField';
import { Textarea } from '@/components/ui/textarea';

interface SettingsSection {
  id: string;
  title: string;
  icon: any;
  description: string;
}

const settingsSections: SettingsSection[] = [
  {
    id: 'profile',
    title: 'Profile Settings',
    icon: User,
    description: 'Manage your account profile and personal information'
  },
  {
    id: 'security',
    title: 'Security & Privacy',
    icon: Shield,
    description: 'Configure security settings and privacy preferences'
  },
  {
    id: 'notifications',
    title: 'Notifications',
    icon: Bell,
    description: 'Customize your notification preferences'
  },
  {
    id: 'appearance',
    title: 'Appearance',
    icon: Palette,
    description: 'Customize the admin panel appearance'
  },
  {
    id: 'data',
    title: 'Data Management',
    icon: Database,
    description: 'Manage data backup and export settings'
  },
  {
    id: 'site',
    title: 'Site Settings',
    icon: Globe,
    description: 'Configure website settings and SEO'
  }
];

export default function SettingsManagement() {
  const [activeSection, setActiveSection] = useState('profile');
  const [settings, setSettings] = useState({
    profile: {
      name: 'Admin User',
      email: 'admin@techorbitze.com',
      bio: 'TechOrbitze Administrator'
    },
    security: {
      twoFactorEnabled: false,
      sessionTimeout: 30,
      passwordExpiry: 90
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: false,
      commentAlerts: true,
      postAlerts: true
    },
    appearance: {
      theme: 'light',
      sidebarCollapsed: false,
      compactMode: false
    }
  });

  const handleSettingChange = (section: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value
      }
    }));
  };

  const saveSettings = () => {
    // TODO: Implement settings save
    console.log('Saving settings:', settings);
    alert('Settings saved successfully!');
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            <span className="text-coral-primary">Settings</span> Management
          </h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={saveSettings}
            className="bg-coral-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-coral-secondary transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Settings
          </motion.button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Settings</h2>
              <nav className="space-y-2">
                {settingsSections.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;
                  
                  return (
                    <motion.button
                      key={section.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left ${
                        isActive
                          ? 'bg-coral-primary text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                      <span className="font-medium">{section.title}</span>
                    </motion.button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-6">
              {activeSection === 'profile' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Settings</h2>
                  <p className="text-gray-600 mb-6">Manage your account profile and personal information</p>
                  
                  <div className="space-y-4">
                    <InputField
                      label="Full Name"
                      type="text"
                      value={settings.profile.name}
                      onChange={(e) => handleSettingChange('profile', 'name', e.target.value)}
                    />
                    <InputField
                      label="Email Address"
                      type="email"
                      value={settings.profile.email}
                      onChange={(e) => handleSettingChange('profile', 'email', e.target.value)}
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bio
                      </label>
                      <Textarea
                        value={settings.profile.bio}
                        onChange={(e) => handleSettingChange('profile', 'bio', e.target.value)}
                        placeholder="Tell us about yourself..."
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {activeSection === 'security' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Security & Privacy</h2>
                  <p className="text-gray-600 mb-6">Configure security settings and privacy preferences</p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                        <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.security.twoFactorEnabled}
                          onChange={(e) => handleSettingChange('security', 'twoFactorEnabled', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-coral-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-coral-primary"></div>
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeSection === 'notifications' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Notifications</h2>
                  <p className="text-gray-600 mb-6">Customize your notification preferences</p>
                  
                  <div className="space-y-4">
                    {Object.entries(settings.notifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </h3>
                          <p className="text-sm text-gray-600">Receive notifications for {key.toLowerCase()}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => handleSettingChange('notifications', key, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-coral-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-coral-primary"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeSection === 'appearance' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Appearance</h2>
                  <p className="text-gray-600 mb-6">Customize the admin panel appearance</p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">Theme</h3>
                        <p className="text-sm text-gray-600">Choose your preferred theme</p>
                      </div>
                      <select
                        value={settings.appearance.theme}
                        onChange={(e) => handleSettingChange('appearance', 'theme', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-primary focus:border-transparent"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="auto">Auto</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeSection === 'data' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Data Management</h2>
                  <p className="text-gray-600 mb-6">Manage data backup and export settings</p>
                  
                  <div className="space-y-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full p-4 border border-gray-200 rounded-lg text-left hover:bg-gray-50 transition-colors"
                    >
                      <h3 className="font-medium text-gray-900 mb-2">Export Data</h3>
                      <p className="text-sm text-gray-600">Download all your data in JSON format</p>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full p-4 border border-gray-200 rounded-lg text-left hover:bg-gray-50 transition-colors"
                    >
                      <h3 className="font-medium text-gray-900 mb-2">Backup Database</h3>
                      <p className="text-sm text-gray-600">Create a backup of your database</p>
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {activeSection === 'site' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Site Settings</h2>
                  <p className="text-gray-600 mb-6">Configure website settings and SEO</p>
                  
                  <div className="space-y-4">
                    <InputField
                      label="Site Title"
                      type="text"
                      placeholder="TechOrbitze"
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Site Description
                      </label>
                      <Textarea
                        placeholder="Your site description for SEO"
                        className="min-h-[80px]"
                      />
                    </div>
                    <InputField
                      label="Contact Email"
                      type="email"
                      placeholder="contact@techorbitze.com"
                    />
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
