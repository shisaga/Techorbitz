'use client';

import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import CustomSelect from '@/components/ui/CustomSelect';
import InputField from '@/components/ui/InputField';

interface BlogFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
  debouncedSearchTerm: string;
}

export default function BlogFilters({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedTag,
  setSelectedTag,
  debouncedSearchTerm
}: BlogFiltersProps) {
  const categoryOptions = [
    { value: '', label: 'All Articles', emoji: '📚' },
    { value: 'ai-technology', label: 'AI & Technology', emoji: '🤖' },
    { value: 'cloud-infrastructure', label: 'Cloud & DevOps', emoji: '☁️' },
    { value: 'database', label: 'Data Engineering', emoji: '🗄️' },
    { value: 'healthcare-iot', label: 'AI and ML', emoji: '🧠' },
    { value: 'web-development', label: 'Digital & Experience Engineering', emoji: '💻' },
    { value: 'video-marketing', label: 'News & Insights', emoji: '📰' }
  ];

  const tagOptions = [
    { value: '', label: 'All Categories', emoji: '📂' },
    { value: 'ai', label: 'AI & Machine Learning', emoji: '🤖' },
    { value: 'aws', label: 'Cloud Computing', emoji: '☁️' },
    { value: 'iot', label: 'IoT & Hardware', emoji: '📡' },
    { value: 'healthcare', label: 'Healthcare Tech', emoji: '🏥' },
    { value: 'database', label: 'Database & Analytics', emoji: '🗄️' }
  ];

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedTag('');
  };

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Category Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-2 justify-center">
            {categoryOptions.map((category) => (
              <motion.button
                key={category.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category.value
                    ? 'bg-coral-primary text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-coral-light hover:text-coral-primary'
                }`}
              >
                {category.emoji} {category.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Search Bar and Custom Dropdown */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col lg:flex-row gap-4"
        >
          {/* Real-time Search Bar */}
          <InputField
            type="search"
            placeholder="Search ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={Search}
            loading={searchTerm !== debouncedSearchTerm}
            variant="search"
            size="md"
            className="flex-1"
          />

          {/* Custom Select Component */}
          <CustomSelect
            options={tagOptions}
            value={selectedTag}
            onChange={setSelectedTag}
            placeholder="Select Category"
            width="w-[240px]"
          />
        </motion.div>

        {/* Applied Filters Row */}
        {(searchTerm || selectedCategory || selectedTag) && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 flex flex-wrap items-center gap-3"
          >
            <span className="text-sm text-gray-600">Filtering by:</span>
            
            {searchTerm && (
              <motion.span 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-coral-primary text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                🔍 "{searchTerm}"
                <button 
                  onClick={() => setSearchTerm('')}
                  className="hover:bg-white/20 rounded-full w-4 h-4 flex items-center justify-center"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.span>
            )}
            
            {selectedCategory && (
              <motion.span 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-coral-primary text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                📁 {selectedCategory.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                <button 
                  onClick={() => setSelectedCategory('')}
                  className="hover:bg-white/20 rounded-full w-4 h-4 flex items-center justify-center"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.span>
            )}
            
            {selectedTag && (
              <motion.span 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-coral-primary text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                🏷️ {selectedTag.toUpperCase()}
                <button 
                  onClick={() => setSelectedTag('')}
                  className="hover:bg-white/20 rounded-full w-4 h-4 flex items-center justify-center"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.span>
            )}
            
            <button 
              onClick={clearAllFilters}
              className="text-coral-primary hover:text-coral-secondary text-sm font-medium"
            >
              Clear all
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
