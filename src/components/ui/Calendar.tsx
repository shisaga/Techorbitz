'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

interface CalendarProps {
  selectedDate?: Date | null;
  onDateSelect: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  disableWeekends?: boolean;
  className?: string;
}

export default function Calendar({
  selectedDate,
  onDateSelect,
  minDate,
  maxDate,
  disableWeekends = true,
  className = ''
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1; // Convert Sunday (0) to be last (6)
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (date < today) return true;
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    if (disableWeekends && (date.getDay() === 0 || date.getDay() === 6)) return true;
    
    return false;
  };

  const isDateSelected = (date: Date) => {
    if (!selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(currentDate.getMonth() - 1);
    } else {
      newDate.setMonth(currentDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    if (!isDateDisabled(clickedDate)) {
      onDateSelect(clickedDate);
    }
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayOfMonth = getFirstDayOfMonth(currentDate);
    const daysInPrevMonth = getDaysInMonth(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    
    const days = [];

    // Previous month's trailing days
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      days.push(
        <button
          key={`prev-${day}`}
          className="w-12 h-12 text-gray-300 hover:bg-gray-100 rounded-lg transition-colors text-sm"
          disabled
        >
          {day}
        </button>
      );
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const disabled = isDateDisabled(date);
      const selected = isDateSelected(date);

      days.push(
        <motion.button
          key={day}
          whileHover={!disabled ? { scale: 1.05 } : {}}
          whileTap={!disabled ? { scale: 0.95 } : {}}
          onClick={() => handleDateClick(day)}
          disabled={disabled}
          className={`
            w-12 h-12 rounded-lg text-sm font-medium transition-all duration-200
            ${selected 
              ? 'bg-coral-primary text-white shadow-lg' 
              : disabled 
                ? 'text-gray-300 cursor-not-allowed' 
                : 'text-gray-700 hover:bg-coral-light hover:text-coral-primary'
            }
          `}
        >
          {day}
        </motion.button>
      );
    }

    // Next month's leading days
    const totalCells = Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7;
    const remainingCells = totalCells - (firstDayOfMonth + daysInMonth);
    
    for (let day = 1; day <= remainingCells; day++) {
      days.push(
        <button
          key={`next-${day}`}
          className="w-12 h-12 text-gray-300 hover:bg-gray-100 rounded-lg transition-colors text-sm"
          disabled
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const renderMonthPicker = () => {
    if (!showMonthPicker) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="absolute top-16 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg z-10 p-4"
      >
        <div className="grid grid-cols-3 gap-2">
          {months.map((month, index) => (
            <button
              key={month}
              onClick={() => {
                const newDate = new Date(currentDate);
                newDate.setMonth(index);
                setCurrentDate(newDate);
                setShowMonthPicker(false);
              }}
              className={`
                p-2 rounded-lg text-sm font-medium transition-colors
                ${currentDate.getMonth() === index
                  ? 'bg-coral-primary text-white'
                  : 'text-gray-700 hover:bg-coral-light hover:text-coral-primary'
                }
              `}
            >
              {month}
            </button>
          ))}
        </div>
      </motion.div>
    );
  };

  const renderYearPicker = () => {
    if (!showYearPicker) return null;

    const currentYear = currentDate.getFullYear();
    const years = [];
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
      years.push(i);
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="absolute top-16 right-0 bg-white border border-gray-200 rounded-xl shadow-lg z-10 p-4"
      >
        <div className="grid grid-cols-2 gap-2">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => {
                const newDate = new Date(currentDate);
                newDate.setFullYear(year);
                setCurrentDate(newDate);
                setShowYearPicker(false);
              }}
              className={`
                p-2 rounded-lg text-sm font-medium transition-colors
                ${currentDate.getFullYear() === year
                  ? 'bg-coral-primary text-white'
                  : 'text-gray-700 hover:bg-coral-light hover:text-coral-primary'
                }
              `}
            >
              {year}
            </button>
          ))}
        </div>
      </motion.div>
    );
  };

  return (
    <div className={`bg-white rounded-2xl border border-gray-200 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Select Date</h3>
      </div>

      {/* Month/Year Navigation */}
      <div className="relative mb-6">
        <div className="flex items-center justify-between bg-gray-100 rounded-xl p-3">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-1 hover:bg-white rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          
          <div className="text-lg font-semibold text-gray-900">
            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </div>
          
          <button
            onClick={() => navigateMonth('next')}
            className="p-1 hover:bg-white rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Month/Year Dropdowns */}
        <div className="flex gap-4 mt-4">
          <div className="relative flex-1">
            <button
              onClick={() => {
                setShowMonthPicker(!showMonthPicker);
                setShowYearPicker(false);
              }}
              className="w-full flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <span className="text-gray-700 font-medium">{months[currentDate.getMonth()]}</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>
            {renderMonthPicker()}
          </div>
          
          <div className="relative flex-1">
            <button
              onClick={() => {
                setShowYearPicker(!showYearPicker);
                setShowMonthPicker(false);
              }}
              className="w-full flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <span className="text-gray-700 font-medium">{currentDate.getFullYear()}</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>
            {renderYearPicker()}
          </div>
        </div>
      </div>

      {/* Week Days Header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="h-10 flex items-center justify-center">
            <span className="text-xs font-medium text-gray-500">{day}</span>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {renderCalendarDays()}
      </div>

      {/* Selected Date Info */}
      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-coral-light rounded-xl border border-coral-primary/20"
        >
          <div className="text-sm text-coral-primary font-medium">Selected Date</div>
          <div className="text-lg font-semibold text-gray-900">
            {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
