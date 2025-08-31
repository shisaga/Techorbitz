'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Calendar, Plus, Clock, User, Tag } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'meeting' | 'deadline' | 'publish' | 'review';
  description: string;
  attendees?: string[];
}

export default function CalendarManagement() {
  const [events] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Content Review Meeting',
      date: '2024-12-20',
      time: '10:00 AM',
      type: 'meeting',
      description: 'Weekly content review with the team',
      attendees: ['John Doe', 'Jane Smith', 'Mike Johnson']
    },
    {
      id: '2',
      title: 'Blog Post Deadline',
      date: '2024-12-22',
      time: '5:00 PM',
      type: 'deadline',
      description: 'Submit final draft for AI article'
    },
    {
      id: '3',
      title: 'Publish Tech Trends',
      date: '2024-12-25',
      time: '9:00 AM',
      type: 'publish',
      description: 'Publish the quarterly tech trends report'
    }
  ]);

  const getEventColor = (type: string) => {
    switch (type) {
      case 'meeting': return 'bg-blue-100 text-blue-900 border-blue-200';
      case 'deadline': return 'bg-red-100 text-red-900 border-red-200';
      case 'publish': return 'bg-green-100 text-green-900 border-green-200';
      case 'review': return 'bg-yellow-100 text-yellow-900 border-yellow-200';
      default: return 'bg-gray-100 text-gray-900 border-gray-200';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'meeting': return '👥';
      case 'deadline': return '⏰';
      case 'publish': return '📤';
      case 'review': return '📋';
      default: return '📅';
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            <span className="text-coral-primary">Calendar</span> Management
          </h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-coral-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-coral-secondary transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Event
          </motion.button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar View */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">December 2024</h2>
              <div className="grid grid-cols-7 gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                    {day}
                  </div>
                ))}
                {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                  <div
                    key={day}
                    className="text-center py-2 text-sm border border-gray-100 hover:bg-gray-50 cursor-pointer"
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Events List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Events</h2>
              <div className="space-y-4">
                {events.map((event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg border ${getEventColor(event.type)}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{getEventIcon(event.type)}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{event.title}</h3>
                        <div className="flex items-center gap-2 text-sm mb-2">
                          <Clock className="w-3 h-3" />
                          <span>{event.date} at {event.time}</span>
                        </div>
                        <p className="text-sm opacity-80">{event.description}</p>
                        {event.attendees && (
                          <div className="flex items-center gap-1 mt-2">
                            <User className="w-3 h-3" />
                            <span className="text-xs">{event.attendees.length} attendees</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
