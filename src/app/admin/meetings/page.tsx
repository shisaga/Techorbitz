'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Filter, Calendar, Clock, User, Mail, Phone, 
  Video, MessageSquare, Edit, Trash2, Eye, CheckCircle, 
  XCircle, AlertCircle, MoreVertical, Download
} from 'lucide-react';

interface Meeting {
  id: string;
  meetingId: string;
  title: string;
  description?: string;
  meetingType: string;
  scheduledDate: string;
  scheduledTime: string;
  duration: number;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  message?: string;
  googleMeetLink?: string;
  meetingCode?: string;
  status: string;
  isCompleted: boolean;
  notes?: string;
  emailSentToClient: boolean;
  emailSentToAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

interface MeetingStats {
  total: number;
  SCHEDULED?: number;
  CONFIRMED?: number;
  IN_PROGRESS?: number;
  COMPLETED?: number;
  CANCELLED?: number;
  NO_SHOW?: number;
}

interface Pagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [stats, setStats] = useState<MeetingStats>({ total: 0 });
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingNotes, setEditingNotes] = useState('');

  const statusColors = {
    SCHEDULED: 'bg-blue-100 text-blue-800',
    CONFIRMED: 'bg-green-100 text-green-800',
    IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
    COMPLETED: 'bg-emerald-100 text-emerald-800',
    CANCELLED: 'bg-red-100 text-red-800',
    NO_SHOW: 'bg-gray-100 text-gray-800',
  };

  const statusIcons = {
    SCHEDULED: Clock,
    CONFIRMED: CheckCircle,
    IN_PROGRESS: AlertCircle,
    COMPLETED: CheckCircle,
    CANCELLED: XCircle,
    NO_SHOW: XCircle,
  };

  useEffect(() => {
    fetchMeetings();
  }, [pagination.page, statusFilter, search, sortBy, sortOrder]);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        status: statusFilter,
        search: search,
        sortBy: sortBy,
        sortOrder: sortOrder,
      });

      const response = await fetch(`/api/admin/meetings?${params}`);
      const data = await response.json();

      if (data.success) {
        setMeetings(data.data.meetings);
        setStats(data.data.stats);
        setPagination(data.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching meetings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (meetingId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/admin/meetings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: meetingId, status: newStatus }),
      });

      if (response.ok) {
        fetchMeetings();
      }
    } catch (error) {
      console.error('Error updating meeting status:', error);
    }
  };

  const handleNotesUpdate = async () => {
    if (!selectedMeeting) return;

    try {
      const response = await fetch('/api/admin/meetings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedMeeting.id, notes: editingNotes }),
      });

      if (response.ok) {
        setShowModal(false);
        setSelectedMeeting(null);
        setEditingNotes('');
        fetchMeetings();
      }
    } catch (error) {
      console.error('Error updating notes:', error);
    }
  };

  const handleDeleteMeeting = async (meetingId: string) => {
    if (!confirm('Are you sure you want to delete this meeting?')) return;

    try {
      const response = await fetch(`/api/admin/meetings?id=${meetingId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchMeetings();
      }
    } catch (error) {
      console.error('Error deleting meeting:', error);
    }
  };

  const openMeetingModal = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setEditingNotes(meeting.notes || '');
    setShowModal(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meeting Reports</h1>
          <p className="text-gray-600">Manage and track all scheduled meetings</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-coral-primary text-white rounded-lg hover:bg-coral-primary/90 transition-colors">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(stats).map(([key, value]) => {
          if (key === 'total') return null;
          const StatusIcon = statusIcons[key as keyof typeof statusIcons];
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-4 rounded-lg border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 capitalize">{key.replace('_', ' ')}</p>
                  <p className="text-2xl font-bold text-gray-900">{value || 0}</p>
                </div>
                <StatusIcon className="w-8 h-8 text-gray-400" />
              </div>
            </motion.div>
          );
        })}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-4 rounded-lg border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Meetings</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search meetings..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-primary focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-primary focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="confirmed">Confirmed</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="no_show">No Show</option>
          </select>
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field);
              setSortOrder(order);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-primary focus:border-transparent"
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="scheduledDate-asc">Date (Earliest)</option>
            <option value="scheduledDate-desc">Date (Latest)</option>
            <option value="contactName-asc">Name (A-Z)</option>
            <option value="contactName-desc">Name (Z-A)</option>
          </select>
        </div>
      </div>

      {/* Meetings Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Meeting Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Schedule
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    Loading meetings...
                  </td>
                </tr>
              ) : meetings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No meetings found
                  </td>
                </tr>
              ) : (
                meetings.map((meeting) => {
                  const StatusIcon = statusIcons[meeting.status as keyof typeof statusIcons];
                  return (
                    <motion.tr
                      key={meeting.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-coral-primary flex items-center justify-center">
                              <User className="w-5 h-5 text-white" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {meeting.contactName}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {meeting.contactEmail}
                            </div>
                            {meeting.contactPhone && (
                              <div className="text-sm text-gray-500 flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {meeting.contactPhone}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{meeting.title}</div>
                        <div className="text-sm text-gray-500 capitalize">
                          {meeting.meetingType}
                        </div>
                        {meeting.googleMeetLink && (
                          <div className="text-sm text-blue-600 flex items-center gap-1 mt-1">
                            <Video className="w-3 h-3" />
                            <a href={meeting.googleMeetLink} target="_blank" rel="noopener noreferrer">
                              Join Meeting
                            </a>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(meeting.scheduledDate)}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTime(meeting.scheduledTime)} ({meeting.duration}min)
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[meeting.status as keyof typeof statusColors]}`}>
                          <StatusIcon className="w-3 h-3" />
                          {meeting.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openMeetingModal(meeting)}
                            className="text-coral-primary hover:text-coral-primary/80"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <select
                            value={meeting.status}
                            onChange={(e) => handleStatusUpdate(meeting.id, e.target.value)}
                            className="text-xs border border-gray-300 rounded px-2 py-1"
                          >
                            <option value="SCHEDULED">Scheduled</option>
                            <option value="CONFIRMED">Confirmed</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="CANCELLED">Cancelled</option>
                            <option value="NO_SHOW">No Show</option>
                          </select>
                          <button
                            onClick={() => handleDeleteMeeting(meeting.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={!pagination.hasPrevPage}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={!pagination.hasNextPage}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{' '}
                  <span className="font-medium">
                    {(pagination.page - 1) * pagination.limit + 1}
                  </span>{' '}
                  to{' '}
                  <span className="font-medium">
                    {Math.min(pagination.page * pagination.limit, pagination.totalCount)}
                  </span>{' '}
                  of{' '}
                  <span className="font-medium">{pagination.totalCount}</span>{' '}
                  results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={!pagination.hasPrevPage}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={!pagination.hasNextPage}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Meeting Details Modal */}
      {showModal && selectedMeeting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Meeting Details</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Contact Name</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedMeeting.contactName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedMeeting.contactEmail}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedMeeting.contactPhone || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Meeting Type</label>
                  <p className="mt-1 text-sm text-gray-900 capitalize">{selectedMeeting.meetingType}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Scheduled Date</label>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(selectedMeeting.scheduledDate)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Time</label>
                  <p className="mt-1 text-sm text-gray-900">{formatTime(selectedMeeting.scheduledTime)}</p>
                </div>
              </div>

              {selectedMeeting.message && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Message</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedMeeting.message}</p>
                </div>
              )}

              {selectedMeeting.googleMeetLink && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Google Meet Link</label>
                  <a
                    href={selectedMeeting.googleMeetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <Video className="w-4 h-4" />
                    Join Meeting
                  </a>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Admin Notes</label>
                <textarea
                  value={editingNotes}
                  onChange={(e) => setEditingNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-coral-primary focus:border-transparent"
                  placeholder="Add notes about this meeting..."
                />
              </div>

              <div className="flex items-center gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email Status</label>
                  <div className="mt-1 flex items-center gap-4">
                    <span className={`text-sm ${selectedMeeting.emailSentToClient ? 'text-green-600' : 'text-red-600'}`}>
                      Client: {selectedMeeting.emailSentToClient ? 'Sent' : 'Not Sent'}
                    </span>
                    <span className={`text-sm ${selectedMeeting.emailSentToAdmin ? 'text-green-600' : 'text-red-600'}`}>
                      Admin: {selectedMeeting.emailSentToAdmin ? 'Sent' : 'Not Sent'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleNotesUpdate}
                className="px-4 py-2 text-sm font-medium text-white bg-coral-primary rounded-md hover:bg-coral-primary/90"
              >
                Save Notes
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
