'use client';

import { motion } from 'framer-motion';
import { 
  Clock, Video, User, Mail, Phone, 
  CheckCircle, ArrowLeft, Send, CalendarDays
} from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import InputField from '@/components/ui/InputField';
import CustomSelect from '@/components/ui/CustomSelect';
import Calendar from '@/components/ui/Calendar';
import TimeSlider from '@/components/ui/TimeSlider';


export const formatTime = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
};

export default function ScheduleMeetingPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [meetingType, setMeetingType] = useState('');
  const [contactInfo, setContactInfo] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const timeSlots = [
    { value: '09:00', label: '9:00 AM', emoji: '🌅' },
    { value: '10:00', label: '10:00 AM', emoji: '☀️' },
    { value: '11:00', label: '11:00 AM', emoji: '🌞' },
    { value: '14:00', label: '2:00 PM', emoji: '🌤️' },
    { value: '15:00', label: '3:00 PM', emoji: '🌇' },
    { value: '16:00', label: '4:00 PM', emoji: '🌆' }
  ];

  const meetingTypes = [
    { value: 'consultation', label: 'Free Consultation', emoji: '💬' },
    { value: 'project-discussion', label: 'Project Discussion', emoji: '🚀' },
    { value: 'technical-review', label: 'Technical Review', emoji: '🔧' },
    { value: 'partnership', label: 'Partnership Meeting', emoji: '🤝' }
  ];

  // Generate available dates (next 30 days, excluding weekends)
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Skip weekends
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push(date);
      }
    }
    
    return dates;
  };

  const availableDates = getAvailableDates();



  const handleSchedule = async () => {
    if (!selectedDate || !selectedTime || !contactInfo.email || !contactInfo.name) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/meeting/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: selectedDate.toISOString(),
          time: selectedTime,
          contactInfo,
          meetingType
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsScheduled(true);
        console.log('Meeting scheduled successfully:', data);
      } else {
        throw new Error(data.error || 'Failed to schedule meeting');
      }
    } catch (error) {
      console.error('Error scheduling meeting:', error);
      alert('Failed to schedule meeting. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isScheduled) {
    return (
      <div className="min-h-screen bg-white">
        <Header showBackButton backUrl="/" />
        <div className="pt-32 flex items-center justify-center min-h-[60vh]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md bg-gradient-to-r from-coral-primary to-coral-secondary p-12 rounded-3xl text-white"
          >
            <div className="text-6xl mb-6">🎉</div>
            <h1 className="text-3xl font-bold mb-4">Meeting Scheduled!</h1>
            <p className="text-xl opacity-90 mb-6">
              Your meeting has been confirmed. We've sent you a Google Meet link and calendar invite.
            </p>
            <div className="space-y-2 text-sm opacity-80 mb-8">
              <p>📅 {selectedDate?.toLocaleDateString()}</p>
              <p>🕐 {timeSlots.find(t => t.value === selectedTime)?.label}</p>
              <p>📧 Confirmation sent to {contactInfo.email}</p>
            </div>
            <Link 
              href="/"
              className="inline-flex items-center gap-2 bg-white text-coral-primary px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header showBackButton backUrl="/" />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-coral-light to-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="initial"
            animate="animate"
            variants={stagger}
          >
            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            >
              📅 Schedule Your <span className="text-coral-primary">Expert Consultation</span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
            >
              Book a free consultation with our Fortune 500 technology experts. 
              We'll discuss your project and provide strategic insights.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Scheduling Form */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Calendar Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Calendar */}
              <Calendar
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                disableWeekends={true}
                minDate={new Date()}
              />

              {/* Time Selection */}
              <TimeSlider
                selectedTime={selectedTime}
                onTimeSelect={setSelectedTime}
                disabled={!selectedDate}
                minTime="09:00"
                maxTime="18:00"
                step={30}
              />

              {/* Meeting Type */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Meeting Type</h3>
                <CustomSelect
                  options={meetingTypes}
                  value={meetingType}
                  onChange={setMeetingType}
                  placeholder="Select meeting type"
                  width="w-full"
                />
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              style={{ height: 'fit-content' }}
              className="bg-white p-8 rounded-3xl !h-fit border border-gray-200"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <User className="w-6 h-6 text-coral-primary" />
                Your Information
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <InputField
                    type="text"
                    placeholder="John Doe"
                    value={contactInfo.name}
                    onChange={(e) => setContactInfo(prev => ({ ...prev, name: e.target.value }))}
                    icon={User}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                  <InputField
                    type="email"
                    placeholder="john@company.com"
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value }))}
                    icon={Mail}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <InputField
                    type="tel"
                    placeholder="+91-8494090499"
                    value={contactInfo.phone}
                    onChange={(e) => setContactInfo(prev => ({ ...prev, phone: e.target.value }))}
                    icon={Phone}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company (Optional)</label>
                  <InputField
                    type="text"
                    placeholder="Your Company Name (Optional)"
                    value={contactInfo.company}
                    onChange={(e) => setContactInfo(prev => ({ ...prev, company: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message (Optional)</label>
                  <textarea
                    value={contactInfo.message}
                    onChange={(e) => setContactInfo(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Tell us what you'd like to discuss..."
                    rows={8}
                    className="w-full text-black px-6 py-4 border border-gray-200 rounded-2xl focus:border-coral-primary focus:ring-2 focus:ring-coral-primary/20 outline-none resize-none"
                  />
                </div>

                {/* Meeting Summary */}
                {selectedDate && selectedTime && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-coral-light to-blue-50 p-6 rounded-2xl border border-coral-primary/20 h-fit"
                  >
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-coral-primary" />
                      Meeting Summary
                    </h3>
                    <div className="space-y-2 text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-coral-primary" />
                        <span>{selectedDate.toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-coral-primary" />
                        <span>{selectedTime && formatTime(selectedTime)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4 text-coral-primary" />
                        <span>Google Meet (link will be sent via email)</span>
                      </div>
                      {meetingType && (
                        <div className="flex items-center gap-2">
                          <span className="text-coral-primary">•</span>
                          <span>{meetingTypes.find(t => t.value === meetingType)?.label}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Schedule Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSchedule}
                  disabled={!selectedDate || !selectedTime || !contactInfo.email || !contactInfo.name || isSubmitting}
                  className="w-full bg-coral-primary text-white py-4 rounded-2xl font-semibold text-lg hover:bg-coral-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Scheduling Meeting...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Schedule Meeting
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Benefits Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: <Video className="w-8 h-8" />,
                title: "Google Meet",
                description: "Secure video call with screen sharing",
                color: "text-blue-500"
              },
              {
                icon: <Clock className="w-8 h-8" />,
                title: "30-60 Minutes",
                description: "Focused discussion about your needs",
                color: "text-green-500"
              },
              {
                icon: <CheckCircle className="w-8 h-8" />,
                title: "Free Consultation",
                description: "No cost, no commitment required",
                color: "text-coral-primary"
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="bg-gray-50 p-6 rounded-2xl text-center"
              >
                <div className={`${benefit.color} mb-4 flex justify-center`}>{benefit.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
