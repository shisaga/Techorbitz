'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  Upload, Search, Filter, Grid, List, 
  Image, Video, File, Trash2, Download,
  Eye, Copy, MoreVertical, FolderOpen,
  Calendar, FileText, Image as ImageIcon
} from 'lucide-react';
import InputField from '@/components/ui/InputField';
import CustomSelect from '@/components/ui/CustomSelect';
import AdminLayout from '@/components/admin/AdminLayout';

interface MediaFile {
  id: string;
  name: string;
  type: 'IMAGE' | 'VIDEO' | 'DOCUMENT' | 'AUDIO';
  size: number;
  url: string;
  thumbnail?: string;
  uploadedAt: string;
  uploadedBy: string;
  tags: string[];
  dimensions?: { width: number; height: number };
  duration?: number;
}

export default function MediaManagement() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);

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

  // Mock data
  const mockFiles: MediaFile[] = [
    {
      id: '1',
      name: 'hero-banner.jpg',
      type: 'IMAGE',
      size: 2048576, // 2MB
      url: '/uploads/hero-banner.jpg',
      thumbnail: '/uploads/thumbnails/hero-banner.jpg',
      uploadedAt: '2024-12-15T10:00:00Z',
      uploadedBy: 'Sarah Johnson',
      tags: ['banner', 'hero', 'marketing'],
      dimensions: { width: 1920, height: 1080 }
    },
    {
      id: '2',
      name: 'product-demo.mp4',
      type: 'VIDEO',
      size: 15728640, // 15MB
      url: '/uploads/product-demo.mp4',
      thumbnail: '/uploads/thumbnails/product-demo.jpg',
      uploadedAt: '2024-12-14T14:30:00Z',
      uploadedBy: 'Mike Chen',
      tags: ['demo', 'product', 'video'],
      duration: 120 // 2 minutes
    },
    {
      id: '3',
      name: 'company-logo.png',
      type: 'IMAGE',
      size: 512000, // 500KB
      url: '/uploads/company-logo.png',
      thumbnail: '/uploads/thumbnails/company-logo.png',
      uploadedAt: '2024-12-13T09:15:00Z',
      uploadedBy: 'Emily Rodriguez',
      tags: ['logo', 'branding'],
      dimensions: { width: 500, height: 500 }
    },
    {
      id: '4',
      name: 'technical-specs.pdf',
      type: 'DOCUMENT',
      size: 1048576, // 1MB
      url: '/uploads/technical-specs.pdf',
      uploadedAt: '2024-12-12T16:45:00Z',
      uploadedBy: 'David Kim',
      tags: ['documentation', 'technical']
    },
    {
      id: '5',
      name: 'team-photo.jpg',
      type: 'IMAGE',
      size: 3145728, // 3MB
      url: '/uploads/team-photo.jpg',
      thumbnail: '/uploads/thumbnails/team-photo.jpg',
      uploadedAt: '2024-12-11T11:20:00Z',
      uploadedBy: 'Sarah Johnson',
      tags: ['team', 'photo', 'about'],
      dimensions: { width: 2400, height: 1600 }
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setFiles(mockFiles);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === 'ALL' || file.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'IMAGE': return ImageIcon;
      case 'VIDEO': return Video;
      case 'DOCUMENT': return FileText;
      case 'AUDIO': return File;
      default: return File;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'IMAGE': return 'text-blue-900';
      case 'VIDEO': return 'text-purple-900';
      case 'DOCUMENT': return 'text-orange-900';
      case 'AUDIO': return 'text-green-900';
      default: return 'text-gray-900';
    }
  };

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const selectAllFiles = () => {
    setSelectedFiles(filteredFiles.map(file => file.id));
  };

  const deselectAllFiles = () => {
    setSelectedFiles([]);
  };

  return (
    <AdminLayout title="Media Library" subtitle="Manage your media files and uploads">
      <div className="max-w-7xl mx-auto">
        {/* Stats Cards */}
        <motion.div 
          initial="initial"
          animate="animate"
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          {[
            { label: 'Total Files', value: files.length.toString(), icon: File, color: 'text-blue-900' },
            { label: 'Images', value: files.filter(f => f.type === 'IMAGE').length.toString(), icon: Image, color: 'text-green-900' },
            { label: 'Videos', value: files.filter(f => f.type === 'VIDEO').length.toString(), icon: Video, color: 'text-purple-900' },
            { label: 'Documents', value: files.filter(f => f.type === 'DOCUMENT').length.toString(), icon: FileText, color: 'text-orange-900' }
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
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <InputField
              type="search"
              placeholder="Search files..."
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
                  { value: 'ALL', label: 'All Types', emoji: '📁' },
                  { value: 'IMAGE', label: 'Images', emoji: '🖼️' },
                  { value: 'VIDEO', label: 'Videos', emoji: '🎥' },
                  { value: 'DOCUMENT', label: 'Documents', emoji: '📄' },
                  { value: 'AUDIO', label: 'Audio', emoji: '🎵' }
                ]}
                value={typeFilter}
                onChange={setTypeFilter}
                placeholder="Filter by Type"
                width="w-full"
              />
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-coral-primary text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Grid className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-coral-primary text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <List className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Selection Actions */}
        {selectedFiles.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-coral-light border border-coral-primary rounded-lg p-4 mb-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-coral-primary">
                  {selectedFiles.length} file(s) selected
                </span>
                <button
                  onClick={deselectAllFiles}
                  className="text-sm text-coral-primary hover:text-coral-secondary"
                >
                  Deselect All
                </button>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Selected
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Files Display */}
        <motion.div 
          variants={fadeInUp}
          className="bg-white rounded-xl shadow-sm overflow-hidden"
        >
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coral-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading files...</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {filteredFiles.map((file) => {
                  const FileIcon = getFileIcon(file.type);
                  return (
                    <motion.div
                      key={file.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`relative group cursor-pointer rounded-lg border-2 transition-all ${
                        selectedFiles.includes(file.id) 
                          ? 'border-coral-primary bg-coral-light' 
                          : 'border-gray-200 hover:border-coral-primary'
                      }`}
                      onClick={() => toggleFileSelection(file.id)}
                    >
                      <div className="aspect-square bg-gray-100 rounded-t-lg flex items-center justify-center">
                        {file.thumbnail ? (
                          <img 
                            src={file.thumbnail} 
                            alt={file.name}
                            className="w-full h-full object-cover rounded-t-lg"
                          />
                        ) : (
                          <FileIcon className={`w-12 h-12 ${getTypeColor(file.type)}`} />
                        )}
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(file.size)}
                        </p>
                        {file.dimensions && (
                          <p className="text-xs text-gray-400">
                            {file.dimensions.width} × {file.dimensions.height}
                          </p>
                        )}
                      </div>
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex gap-1">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-1 bg-white rounded shadow-sm hover:bg-gray-50"
                          >
                            <Eye className="w-3 h-3 text-gray-600" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-1 bg-white rounded shadow-sm hover:bg-gray-50"
                          >
                            <Download className="w-3 h-3 text-gray-600" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectedFiles.length === filteredFiles.length && filteredFiles.length > 0}
                        onChange={selectedFiles.length === filteredFiles.length ? deselectAllFiles : selectAllFiles}
                        className="rounded border-gray-300 text-coral-primary focus:ring-coral-primary"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      File
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Size
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Uploaded
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredFiles.map((file) => {
                    const FileIcon = getFileIcon(file.type);
                    return (
                      <motion.tr
                        key={file.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedFiles.includes(file.id)}
                            onChange={() => toggleFileSelection(file.id)}
                            className="rounded border-gray-300 text-coral-primary focus:ring-coral-primary"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                              <FileIcon className={`w-5 h-5 ${getTypeColor(file.type)}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {file.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                by {file.uploadedBy}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full bg-gray-100 ${getTypeColor(file.type)}`}>
                            {file.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatFileSize(file.size)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(file.uploadedAt).toLocaleDateString()}
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
                              <Download className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="text-gray-500 hover:text-gray-600"
                            >
                              <Copy className="w-4 h-4" />
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
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowUploadModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Files</h3>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-coral-primary transition-colors cursor-pointer">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm text-gray-600 mb-2">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                Images, Videos, Documents up to 50MB
              </p>
            </div>

            <div className="flex gap-3 mt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowUploadModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-4 py-2 bg-coral-primary text-white rounded-lg hover:bg-coral-secondary transition-colors"
              >
                Upload Files
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AdminLayout>
  );
}
