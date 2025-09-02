// Performance optimization hooks
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

// Debounce hook for performance
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Throttle hook for scroll events
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastRun = useRef(Date.now());

  return useCallback(
    (...args: Parameters<T>) => {
      if (Date.now() - lastRun.current >= delay) {
        callback(...args);
        lastRun.current = Date.now();
      }
    },
    [callback, delay]
  ) as T;
}

// Intersection Observer hook for lazy loading
export function useIntersectionObserver(
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [ref, setRef] = useState<Element | null>(null);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(ref);

    return () => {
      observer.disconnect();
    };
  }, [ref, options]);

  return [setRef, isIntersecting] as const;
}

// Memoized avatar component hook
export function useMemoizedAvatar(name: string, size: number = 40) {
  return useMemo(() => 
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'TechOnigx')}&background=ff6b47&color=fff&size=${size}`,
    [name, size]
  );
}

// Performance monitoring hook
export function usePerformanceMonitor() {
  const metrics = useRef<Map<string, number[]>>(new Map());

  const startTimer = useCallback((name: string) => {
    if (typeof window !== 'undefined') {
      performance.mark(`${name}-start`);
    }
  }, []);

  const endTimer = useCallback((name: string): number => {
    if (typeof window !== 'undefined') {
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);
      
      const measure = performance.getEntriesByName(name)[0];
      const duration = measure.duration;
      
      // Store metric
      if (!metrics.current.has(name)) {
        metrics.current.set(name, []);
      }
      metrics.current.get(name)!.push(duration);
      
      // Log if performance is poor
      if (duration > 1000) {
        console.warn(`Performance warning: ${name} took ${duration.toFixed(2)}ms`);
      }
      
      return duration;
    }
    return 0;
  }, []);

  const getAverageTime = useCallback((name: string): number => {
    const times = metrics.current.get(name) || [];
    if (times.length === 0) return 0;
    return times.reduce((a, b) => a + b, 0) / times.length;
  }, []);

  const reportMetrics = useCallback(() => {
    console.log('Performance Metrics:', Object.fromEntries(metrics.current));
  }, []);

  return {
    startTimer,
    endTimer,
    getAverageTime,
    reportMetrics
  };
}
