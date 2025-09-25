'use client';

import { useEffect } from 'react';

interface SocialMediaOptimizationProps {
  title: string;
  description: string;
  url: string;
  image?: string;
  type?: 'article' | 'website';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

export default function SocialMediaOptimization({
  title,
  description,
  url,
  image = '/og-image.jpg',
  type = 'website',
  author = 'TechXak Team',
  publishedTime,
  modifiedTime,
  section = 'Technology',
  tags = []
}: SocialMediaOptimizationProps) {
  
  useEffect(() => {
    // Add social media meta tags dynamically
    const addMetaTag = (property: string, content: string) => {
      const existingTag = document.querySelector(`meta[property="${property}"]`);
      if (existingTag) {
        existingTag.setAttribute('content', content);
      } else {
        const meta = document.createElement('meta');
        meta.setAttribute('property', property);
        meta.setAttribute('content', content);
        document.head.appendChild(meta);
      }
    };

    const addTwitterMeta = (name: string, content: string) => {
      const existingTag = document.querySelector(`meta[name="${name}"]`);
      if (existingTag) {
        existingTag.setAttribute('content', content);
      } else {
        const meta = document.createElement('meta');
        meta.setAttribute('name', name);
        meta.setAttribute('content', content);
        document.head.appendChild(meta);
      }
    };

    // Open Graph tags
    addMetaTag('og:title', title);
    addMetaTag('og:description', description);
    addMetaTag('og:url', url);
    addMetaTag('og:image', image);
    addMetaTag('og:type', type);
    addMetaTag('og:site_name', 'TechXak');
    addMetaTag('og:locale', 'en_US');

    // Article specific tags
    if (type === 'article') {
      if (author) addMetaTag('article:author', author);
      if (publishedTime) addMetaTag('article:published_time', publishedTime);
      if (modifiedTime) addMetaTag('article:modified_time', modifiedTime);
      if (section) addMetaTag('article:section', section);
      tags.forEach(tag => {
        const meta = document.createElement('meta');
        meta.setAttribute('property', 'article:tag');
        meta.setAttribute('content', tag);
        document.head.appendChild(meta);
      });
    }

    // Twitter Card tags
    addTwitterMeta('twitter:card', 'summary_large_image');
    addTwitterMeta('twitter:site', '@techxak');
    addTwitterMeta('twitter:creator', '@techxak');
    addTwitterMeta('twitter:title', title);
    addTwitterMeta('twitter:description', description);
    addTwitterMeta('twitter:image', image);

    // Additional social media tags
    addMetaTag('fb:app_id', 'your-facebook-app-id');
    addMetaTag('fb:pages', 'your-facebook-page-id');
    
    // LinkedIn specific tags
    addMetaTag('linkedin:owner', 'your-linkedin-company-id');
    
    // Pinterest specific tags
    addMetaTag('pinterest:title', title);
    addMetaTag('pinterest:description', description);
    addMetaTag('pinterest:image', image);

    // WhatsApp specific tags
    addMetaTag('whatsapp:title', title);
    addMetaTag('whatsapp:description', description);
    addMetaTag('whatsapp:image', image);

  }, [title, description, url, image, type, author, publishedTime, modifiedTime, section, tags]);

  return null; // This component doesn't render anything
}

// Social Media Analytics Component
export function SocialMediaAnalytics() {
  useEffect(() => {
    // Facebook Pixel
    if (typeof window !== 'undefined' && !window.fbq) {
      (function(f,b,e,v,n,t,s) {
        if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)
      })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      
      window.fbq('init', 'your-facebook-pixel-id');
      window.fbq('track', 'PageView');
    }

    // LinkedIn Insight Tag
    if (typeof window !== 'undefined' && !window.lintrk) {
      (function(l) {
        if (l) {
          window.lintrk = l;
          l = function() { l.q.push(arguments) };
          l.q = [];
        }
      })(window.lintrk);
      
      const script = document.createElement('script');
      script.src = 'https://snap.licdn.com/li.lms-analytics/insight.min.js';
      script.async = true;
      document.head.appendChild(script);
    }

    // Twitter Universal Website Tag
    if (typeof window !== 'undefined' && !window.twq) {
      (function(t,e,n,o,a,s,c) {
        t.TwitterAnalyticsObject=o;t[o]=t[o]||function(){(t[o].q=t[o].q||[]).push(arguments)};
        t[o].l=1*new Date();a=e.createElement(n);a.async=1;a.src=s;c=e.getElementsByTagName(n)[0];c.parentNode.insertBefore(a,c)
      })(window,document,'script','twq','https://static.ads-twitter.com/uwt.js');
      
      window.twq('init', 'your-twitter-pixel-id');
      window.twq('track', 'PageView');
    }

  }, []);

  return null;
}

// Social Media Follow Buttons Component
export function SocialMediaFollow() {
  const socialLinks = {
    linkedin: 'https://linkedin.com/company/techxak',
    twitter: 'https://twitter.com/techxak',
    facebook: 'https://facebook.com/techxak',
    github: 'https://github.com/techxak',
    medium: 'https://medium.com/@techxak',
    youtube: 'https://youtube.com/@techxak'
  };

  return (
    <div className="social-media-follow">
      <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
      <div className="flex flex-wrap gap-3">
        {Object.entries(socialLinks).map(([platform, url]) => (
          <a
            key={platform}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              platform === 'linkedin' ? 'bg-blue-700 text-white hover:bg-blue-800' :
              platform === 'twitter' ? 'bg-sky-500 text-white hover:bg-sky-600' :
              platform === 'facebook' ? 'bg-blue-600 text-white hover:bg-blue-700' :
              platform === 'github' ? 'bg-gray-800 text-white hover:bg-gray-900' :
              platform === 'medium' ? 'bg-gray-700 text-white hover:bg-gray-800' :
              platform === 'youtube' ? 'bg-red-600 text-white hover:bg-red-700' :
              'bg-gray-500 text-white hover:bg-gray-600'
            }`}
            aria-label={`Follow us on ${platform}`}
          >
            <span className="capitalize">{platform}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
