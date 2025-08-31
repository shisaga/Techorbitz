'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Sun, Moon, Sunrise, Sunset } from 'lucide-react';
import { formatTime } from '@/app/schedule-meeting/page';

interface TimeSliderProps {
  selectedTime?: string;
  onTimeSelect: (time: string) => void;
  disabled?: boolean;
  className?: string;
  minTime?: string; // Format: "09:00"
  maxTime?: string; // Format: "18:00"
  step?: number; // Minutes step (default: 30)
}

export default function TimeSlider({
  selectedTime,
  onTimeSelect,
  disabled = false,
  className = '',
  minTime = '09:00',
  maxTime = '18:00',
  step = 30
}: TimeSliderProps) {
  const [sliderValue, setSliderValue] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Generate time slots based on min/max time and step
  const generateTimeSlots = () => {
    const slots = [];
    const [minHour, minMinute] = minTime.split(':').map(Number);
    const [maxHour, maxMinute] = maxTime.split(':').map(Number);
    
    const startMinutes = minHour * 60 + minMinute;
    const endMinutes = maxHour * 60 + maxMinute;
    
    for (let minutes = startMinutes; minutes <= endMinutes; minutes += step) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      const timeString = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
      const displayTime = formatTime(timeString);
      
      slots.push({
        value: timeString,
        label: displayTime,
        minutes: minutes
      });
    }
    
    return slots;
  };

  const timeSlots = generateTimeSlots();

  

  const getTimeIcon = (time: string) => {
    const hour = parseInt(time.split(':')[0]);
    if (hour >= 6 && hour < 9) return <Sunrise className="w-4 h-4" />;
    if (hour >= 9 && hour < 17) return <Sun className="w-4 h-4" />;
    if (hour >= 17 && hour < 20) return <Sunset className="w-4 h-4" />;
    return <Moon className="w-4 h-4" />;
  };

  const getTimeColor = (time: string) => {
    const hour = parseInt(time.split(':')[0]);
    if (hour >= 6 && hour < 9) return 'text-orange-500';
    if (hour >= 9 && hour < 17) return 'text-yellow-500';
    if (hour >= 17 && hour < 20) return 'text-orange-600';
    return 'text-blue-500';
  };

  // Update slider when selectedTime changes
  useEffect(() => {
    if (selectedTime) {
      const index = timeSlots.findIndex(slot => slot.value === selectedTime);
      if (index !== -1) {
        setSliderValue(index);
      }
    }
  }, [selectedTime, timeSlots]);

  const handleSliderChange = (value: number) => {
    setSliderValue(value);
    const selectedSlot = timeSlots[value];
    if (selectedSlot) {
      onTimeSelect(selectedSlot.value);
    }
  };

  const currentTimeSlot = timeSlots[sliderValue];

  return (
    <div className={`${className} ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Clock className="w-5 h-5 text-coral-primary" />
          <h3 className="text-lg font-semibold text-gray-900">Select Time</h3>
        </div>

        {/* Current Time Display */}
        {currentTimeSlot && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className={`${getTimeColor(currentTimeSlot.value)}`}>
                {getTimeIcon(currentTimeSlot.value)}
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {currentTimeSlot.label}
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {currentTimeSlot.value} • {
                parseInt(currentTimeSlot.value.split(':')[0]) < 12 ? 'Morning' :
                parseInt(currentTimeSlot.value.split(':')[0]) < 17 ? 'Afternoon' : 'Evening'
              }
            </div>
          </motion.div>
        )}

        {/* Time Slider */}
        <div className="relative mb-8">
          <div className="relative">
            {/* Slider Track */}
            <div className="w-full h-2 bg-gray-200 rounded-full relative overflow-hidden">
              {/* Progress Track */}
              <motion.div
                className="h-full bg-gradient-to-r from-coral-primary to-coral-secondary rounded-full"
                style={{ width: `${(sliderValue / (timeSlots.length - 1)) * 100}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>

            {/* Slider Handle */}
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white border-4 border-coral-primary rounded-full shadow-lg cursor-pointer"
              style={{ left: `calc(${(sliderValue / (timeSlots.length - 1)) * 100}% - 12px)` }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onMouseDown={() => setIsDragging(true)}
              onMouseUp={() => setIsDragging(false)}
            />

            {/* Slider Input */}
            <input
              type="range"
              min={0}
              max={timeSlots.length - 1}
              value={sliderValue}
              onChange={(e) => handleSliderChange(parseInt(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={disabled}
            />
          </div>

          {/* Time Markers */}
          <div className="flex justify-between mt-4 px-1">
            {timeSlots.filter((_, index) => index % 4 === 0).map((slot, index) => (
              <div key={slot.value} className="text-xs text-gray-400 text-center">
                {slot.label.split(' ')[0]}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Time Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { time: '09:00', label: 'Morning', icon: <Sunrise className="w-4 h-4" />, color: 'text-orange-500' },
            { time: '12:00', label: 'Lunch', icon: <Sun className="w-4 h-4" />, color: 'text-yellow-500' },
            { time: '15:00', label: 'Afternoon', icon: <Sun className="w-4 h-4" />, color: 'text-yellow-600' },
            { time: '17:00', label: 'Evening', icon: <Sunset className="w-4 h-4" />, color: 'text-orange-600' }
          ].filter(preset => {
            const presetMinutes = parseInt(preset.time.split(':')[0]) * 60 + parseInt(preset.time.split(':')[1]);
            const minMinutes = parseInt(minTime.split(':')[0]) * 60 + parseInt(minTime.split(':')[1]);
            const maxMinutes = parseInt(maxTime.split(':')[0]) * 60 + parseInt(maxTime.split(':')[1]);
            return presetMinutes >= minMinutes && presetMinutes <= maxMinutes;
          }).map((preset) => {
            const isSelected = selectedTime === preset.time;
            return (
              <motion.button
                key={preset.time}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  const index = timeSlots.findIndex(slot => slot.value === preset.time);
                  if (index !== -1) {
                    handleSliderChange(index);
                  }
                }}
                className={`p-3 rounded-xl border-2 transition-all duration-200 text-center ${
                  isSelected
                    ? 'border-coral-primary bg-coral-light text-coral-primary'
                    : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-coral-primary/50 hover:bg-coral-light/30'
                }`}
              >
                <div className={`${preset.color} mb-1 flex justify-center`}>
                  {preset.icon}
                </div>
                <div className="text-xs font-medium">{preset.label}</div>
                <div className="text-xs text-gray-500">{formatTime(preset.time)}</div>
              </motion.button>
            );
          })}
        </div>

        {/* Available Times Grid */}
        <div className="mt-6">
          <div className="text-sm font-medium text-gray-700 mb-3">All Available Times</div>
          <div className="grid grid-cols-4 md:grid-cols-6 gap-2 max-h-32 overflow-x-hidden px-1 overflow-y-auto">
            {timeSlots.map((slot) => {
              const isSelected = selectedTime === slot.value;
              return (
                <motion.button
                  key={slot.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const index = timeSlots.findIndex(s => s.value === slot.value);
                    handleSliderChange(index);
                  }}
                  className={`p-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                    isSelected
                      ? 'bg-coral-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-coral-light hover:text-coral-primary'
                  }`}
                >
                  {slot.label}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Selected Time Summary */}
        {currentTimeSlot && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-gradient-to-r from-coral-light to-blue-50 rounded-xl border border-coral-primary/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-coral-primary">Selected Time</div>
                <div className="text-lg font-semibold text-gray-900">{currentTimeSlot.label}</div>
              </div>
              <div className={`${getTimeColor(currentTimeSlot.value)}`}>
                {getTimeIcon(currentTimeSlot.value)}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
