'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  MessageSquare, Check, X, Flag, Reply, 
  Search, Filter, MoreVertical, User, Clock,
  ThumbsUp, ThumbsDown, AlertTriangle
} from 'lucide-react';
import InputField from '@/components/ui/InputField';
import CustomSelect from '@/components/ui/CustomSelect';
import AdminLayout from '@/components/admin/AdminLayout';

interface Comment {
  id: string;
  content: string;
  author: {
    name: string;
    email: string;
    avatar?: string;
  };
  post: {
    title: string;
    slug: string;
  };
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SPAM';
  createdAt: string;
  updatedAt: string;
  likes: number;
  dislikes: number;
  isReply: boolean;
  parentComment?: string;
  flagged: boolean;
  flaggedReason?: string;
}

export default function CommentsManagement() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedComments, setSelectedComments] = useState<string[]>([]);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [replyContent, setReplyContent] = useState('');

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

  // Fetch comments from API
  const fetchComments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: '1',
        limit: '10',
        ...(statusFilter !== 'ALL' && { status: statusFilter }),
        ...(searchTerm && { search: searchTerm })
      });

      const response = await fetch(`/api/admin/comments?${params}`);
      if (!response.ok) throw new Error('Failed to fetch comments');
      
      const data = await response.json();
      setComments(data.comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle bulk actions
  const handleBulkAction = async (action: 'approve' | 'reject' | 'delete') => {
    if (selectedComments.length === 0) return;
    
    if (action === 'delete') {
      if (!confirm(`Are you sure you want to permanently delete ${selectedComments.length} comment(s)? This action cannot be undone.`)) {
        return;
      }
    }
    
    try {
      if (action === 'delete') {
        // Handle bulk delete
        const deletePromises = selectedComments.map(commentId =>
          fetch(`/api/admin/comments/${commentId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
          })
        );
        
        await Promise.all(deletePromises);
        setComments(prev => prev.filter(comment => !selectedComments.includes(comment.id)));
      } else {
        // Handle approve/reject
        const response = await fetch('/api/admin/comments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            commentIds: selectedComments,
            action
          }),
        });

        if (!response.ok) throw new Error(`Failed to ${action} comments`);
        fetchComments();
      }
      
      setSelectedComments([]);
    } catch (error) {
      console.error(`Error ${action}ing comments:`, error);
      alert(`Failed to ${action} comments`);
    }
  };

  // Handle individual comment actions
  const handleApproveComment = async (commentId: string) => {
    try {
      const response = await fetch('/api/admin/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          commentIds: [commentId],
          action: 'approve'
        }),
      });

      if (!response.ok) throw new Error('Failed to approve comment');
      
      fetchComments();
    } catch (error) {
      console.error('Error approving comment:', error);
      alert('Failed to approve comment');
    }
  };

  const handleRejectComment = async (commentId: string) => {
    try {
      const response = await fetch('/api/admin/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          commentIds: [commentId],
          action: 'reject'
        }),
      });

      if (!response.ok) throw new Error('Failed to reject comment');
      
      fetchComments();
    } catch (error) {
      console.error('Error rejecting comment:', error);
      alert('Failed to reject comment');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Are you sure you want to permanently delete this comment? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to delete comment');
      
      // Remove comment from local state
      setComments(prev => prev.filter(comment => comment.id !== commentId));
      alert('Comment deleted successfully!');
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment');
    }
  };

  useEffect(() => {
    fetchComments();
  }, [statusFilter, searchTerm]);

  const filteredComments = comments;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-900';
      case 'PENDING': return 'bg-yellow-100 text-yellow-900';
      case 'REJECTED': return 'bg-red-100 text-red-900';
      case 'SPAM': return 'bg-gray-100 text-gray-900';
      default: return 'bg-gray-100 text-gray-900';
    }
  };

  const approveComment = handleApproveComment;
  const rejectComment = handleRejectComment;
  const markAsSpam = handleRejectComment; // Treat spam as rejection for now

  const toggleCommentSelection = (commentId: string) => {
    setSelectedComments(prev => 
      prev.includes(commentId) 
        ? prev.filter(id => id !== commentId)
        : [...prev, commentId]
    );
  };

  const selectAllComments = () => {
    setSelectedComments(filteredComments.map(comment => comment.id));
  };

  const deselectAllComments = () => {
    setSelectedComments([]);
  };

  const bulkApprove = () => handleBulkAction('approve');
  const bulkReject = () => handleBulkAction('reject');
  const bulkDelete = () => handleBulkAction('delete');

  return (
    <AdminLayout title="Comments Management" subtitle="Moderate and manage blog comments">
      <div className="max-w-7xl mx-auto">
        
        {/* Stats Cards */}
        <motion.div 
          initial="initial"
          animate="animate"
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          {[
            { label: 'Total Comments', value: comments.length.toString(), icon: MessageSquare, color: 'text-blue-900' },
            { label: 'Pending Review', value: comments.filter(c => c.status === 'PENDING').length.toString(), icon: Clock, color: 'text-yellow-900' },
            { label: 'Approved', value: comments.filter(c => c.status === 'APPROVED').length.toString(), icon: Check, color: 'text-green-900' },
            { label: 'Flagged', value: comments.filter(c => c.flagged).length.toString(), icon: Flag, color: 'text-red-900' }
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
                placeholder="Search comments..."
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
                  { value: 'ALL', label: 'All Status', emoji: '📊' },
                  { value: 'PENDING', label: 'Pending', emoji: '⏳' },
                  { value: 'APPROVED', label: 'Approved', emoji: '✅' },
                  { value: 'REJECTED', label: 'Rejected', emoji: '❌' },
                  { value: 'SPAM', label: 'Spam', emoji: '🚫' }
                ]}
                value={statusFilter}
                onChange={setStatusFilter}
                placeholder="Filter by Status"
                width="w-full"
              />
            </div>
          </div>
        </motion.div>

        {/* Bulk Actions */}
        {selectedComments.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-coral-light border border-coral-primary rounded-lg p-4 mb-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-coral-primary">
                  {selectedComments.length} comment(s) selected
                </span>
                <button
                  onClick={deselectAllComments}
                  className="text-sm text-coral-primary hover:text-coral-secondary"
                >
                  Deselect All
                </button>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={bulkApprove}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Approve Selected
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={bulkReject}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Reject Selected
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={bulkDelete}
                  className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete Selected
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Comments List */}
        <motion.div 
          variants={fadeInUp}
          className="bg-white rounded-xl shadow-sm overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Comments</h3>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedComments.length === filteredComments.length && filteredComments.length > 0}
                  onChange={selectedComments.length === filteredComments.length ? deselectAllComments : selectAllComments}
                  className="rounded border-gray-300 text-coral-primary focus:ring-coral-primary"
                />
                <span className="text-sm text-gray-600">Select All</span>
              </div>
            </div>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coral-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading comments...</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredComments.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`p-6 hover:bg-gray-50 transition-colors ${
                    comment.flagged ? 'bg-red-50 border-l-4 border-red-500' : ''
                  }`}
                >
                  <div className="flex gap-4">
                    <input
                      type="checkbox"
                      checked={selectedComments.includes(comment.id)}
                      onChange={() => toggleCommentSelection(comment.id)}
                      className="mt-1 rounded border-gray-300 text-coral-primary focus:ring-coral-primary"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-coral-light rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-coral-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{comment.author.name}</p>
                            <p className="text-sm text-gray-500">{comment.author.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(comment.status)}`}>
                            {comment.status}
                          </span>
                          {comment.flagged && (
                            <Flag className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                      </div>

                      <div className="mb-3">
                        <p className="text-sm text-gray-600 mb-2">
                          On: <span className="font-medium text-gray-900">{comment.post.title}</span>
                        </p>
                        <p className="text-gray-900">{comment.content}</p>
                        {comment.flaggedReason && (
                          <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                            <AlertTriangle className="w-4 h-4" />
                            {comment.flaggedReason}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="w-4 h-4" />
                            {comment.likes}
                          </div>
                          <div className="flex items-center gap-1">
                            <ThumbsDown className="w-4 h-4" />
                            {comment.dislikes}
                          </div>
                          {comment.isReply && (
                            <span className="text-blue-500">Reply</span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {comment.status === 'PENDING' && (
                            <>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => approveComment(comment.id)}
                                className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                              >
                                <Check className="w-4 h-4" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => rejectComment(comment.id)}
                                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </motion.button>
                            </>
                          )}
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setSelectedComment(comment);
                              setShowReplyModal(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          >
                            <Reply className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => markAsSpam(comment.id)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Flag className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDeleteComment(comment.id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            title="Delete comment permanently"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Reply Modal */}
      {showReplyModal && selectedComment && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowReplyModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reply to Comment</h3>
            
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Original comment:</p>
              <p className="text-sm text-gray-900">{selectedComment.content}</p>
            </div>
            
            <textarea
              rows={4}
              placeholder="Write your reply..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-primary focus:border-transparent outline-none resize-none text-gray-900"
            />

            <div className="flex gap-3 mt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowReplyModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-4 py-2 bg-coral-primary text-white rounded-lg hover:bg-coral-secondary transition-colors"
              >
                Send Reply
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AdminLayout>
  );
}
