'use client';

import { motion } from 'framer-motion';
import { 
  Clock, Video, User, Mail, Phone, 
  CheckCircle, ArrowLeft, Send, CalendarDays,
  Building2, MessageSquare, Calendar, MapPin,
  Star, Shield, Zap
} from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import InputField from '@/components/ui/InputField';
import CustomSelect from '@/components/ui/CustomSelect';

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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <Header showBackButton backUrl="/" />
        <div className="pt-32 flex items-center justify-center min-h-[60vh] px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md bg-white p-12 rounded-3xl shadow-2xl border border-gray-100"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-coral-primary to-coral-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Meeting Scheduled!</h1>
            <p className="text-lg text-gray-600 mb-6">
              Your meeting has been confirmed. We've sent you a Google Meet link and calendar invite.
            </p>
            <div className="space-y-3 text-sm text-gray-500 mb-8 bg-gray-50 p-4 rounded-xl">
              <div className="flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4 text-coral-primary" />
                <span>{selectedDate?.toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Clock className="w-4 h-4 text-coral-primary" />
                <span>{timeSlots.find(t => t.value === selectedTime)?.label}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Mail className="w-4 h-4 text-coral-primary" />
                <span>Confirmation sent to {contactInfo.email}</span>
              </div>
            </div>
            <Link 
              href="/"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-coral-primary to-coral-secondary text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header showBackButton backUrl="/" />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="initial"
            animate="animate"
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 bg-coral-light text-coral-primary px-4 py-2 rounded-full text-sm font-medium mb-6"
            >
              <Star className="w-4 h-4" />
              Fortune 500 Technology Partner
            </motion.div>
            <motion.h1
              variants={fadeInUp}
              className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
            >
              Schedule Your <span className="bg-gradient-to-r from-coral-primary to-coral-secondary bg-clip-text text-transparent">Expert Consultation</span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
            >
              Book a free consultation with our Fortune 500 technology experts. 
              We'll discuss your project and provide strategic insights to accelerate your success.
            </motion.p>
          </motion.div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Meeting Details */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 space-y-8"
            >
              {/* Meeting Type Selection */}
              <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-coral-primary rounded-xl flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Meeting Type</h2>
                </div>
                <CustomSelect
                  options={meetingTypes}
                  value={meetingType}
                  onChange={setMeetingType}
                  placeholder="Select meeting type"
                  width="w-full"
                />
              </div>

              {/* Date Selection */}
              <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-coral-primary rounded-xl flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Select Date</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {availableDates.slice(0, 15).map((date, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedDate(date)}
                      className={`p-4 rounded-2xl border-2 transition-all duration-300 text-center ${
                        selectedDate?.toDateString() === date.toDateString()
                          ? 'border-coral-primary bg-coral-light text-coral-primary'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-coral-primary/50 hover:bg-coral-light/30'
                      }`}
                    >
                      <div className="text-sm font-medium">
                        {date.toLocaleDateString('en-US', { weekday: 'short' })}
                      </div>
                      <div className="text-lg font-bold">
                        {date.getDate()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {date.toLocaleDateString('en-US', { month: 'short' })}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Time Selection */}
              <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-coral-primary rounded-xl flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Select Time</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {timeSlots.map((slot) => (
                    <motion.button
                      key={slot.value}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedTime(slot.value)}
                      disabled={!selectedDate}
                      className={`p-4 rounded-2xl border-2 transition-all duration-300 text-center flex items-center justify-center gap-2 ${
                        selectedTime === slot.value
                          ? 'border-coral-primary bg-coral-light text-coral-primary'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-coral-primary/50 hover:bg-coral-light/30'
                      } ${!selectedDate ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <span className="text-lg">{slot.emoji}</span>
                      <span className="font-medium">{slot.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right Column - Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              {/* Contact Information */}
              <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 sticky top-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-coral-primary rounded-xl flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Your Information</h2>
                </div>

                <div className="space-y-6">
                  <InputField
                    label="Full Name"
                    type="text"
                    placeholder="John Doe"
                    value={contactInfo.name}
                    onChange={(e) => setContactInfo(prev => ({ ...prev, name: e.target.value }))}
                    icon={User}
                    required
                    size="lg"
                  />

                  <InputField
                    label="Email Address"
                    type="email"
                    placeholder="john@company.com"
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value }))}
                    icon={Mail}
                    required
                    size="lg"
                  />

                  <InputField
                    label="Phone Number"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={contactInfo.phone}
                    onChange={(e) => setContactInfo(prev => ({ ...prev, phone: e.target.value }))}
                    icon={Phone}
                    size="lg"
                  />

                  <InputField
                    label="Company (Optional)"
                    type="text"
                    placeholder="Your Company Name"
                    value={contactInfo.company}
                    onChange={(e) => setContactInfo(prev => ({ ...prev, company: e.target.value }))}
                    icon={Building2}
                    size="lg"
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message (Optional)
                    </label>
                    <textarea
                      value={contactInfo.message}
                      onChange={(e) => setContactInfo(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Tell us what you'd like to discuss..."
                      rows={4}
                      className="w-full px-6 py-4 text-lg border border-gray-200 rounded-2xl focus:border-coral-primary focus:ring-2 focus:ring-coral-primary/20 outline-none resize-none transition-all duration-300 placeholder-gray-400 text-gray-900 font-medium"
                    />
                  </div>

                  {/* Meeting Summary */}
                  {selectedDate && selectedTime && meetingType && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-r from-coral-light to-blue-50 p-6 rounded-2xl border border-coral-primary/20"
                    >
                      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-coral-primary" />
                        Meeting Summary
                      </h3>
                      <div className="space-y-3 text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-coral-primary" />
                          <span>{selectedDate.toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-coral-primary" />
                          <span>{timeSlots.find(t => t.value === selectedTime)?.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Video className="w-4 h-4 text-coral-primary" />
                          <span>Google Meet (link will be sent via email)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-coral-primary" />
                          <span>{meetingTypes.find(t => t.value === meetingType)?.label}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Schedule Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSchedule}
                    disabled={!selectedDate || !selectedTime || !contactInfo.email || !contactInfo.name || isSubmitting}
                    className="w-full bg-gradient-to-r from-coral-primary to-coral-secondary text-white py-4 rounded-2xl font-semibold text-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
              </div>
            </motion.div>
          </div>

          {/* Benefits Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: <Video className="w-8 h-8" />,
                title: "Google Meet Integration",
                description: "Secure video call with screen sharing and recording capabilities",
                color: "text-blue-500"
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Fortune 500 Expertise",
                description: "Consult with experts who work with Google, Apple, and McDonald's",
                color: "text-green-500"
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Free Consultation",
                description: "No cost, no commitment required. Get expert insights immediately",
                color: "text-coral-primary"
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 text-center hover:shadow-xl transition-all duration-300"
              >
                <div className={`${benefit.color} mb-4 flex justify-center`}>{benefit.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}