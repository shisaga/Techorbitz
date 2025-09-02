// Site configuration for Google search optimization and knowledge panel
export const siteConfig = {
  // Company Information
  company: {
    name: "TechOnigx",
    fullName: "TechOnigx: Fortune 500 Technology Consulting & AI Solutions",
    description: "TechOnigx is a trusted technology consulting company that is deeply dedicated to the long-term growth and success of Fortune 500 clients. We specialize in AI/ML development, cloud architecture, and digital transformation solutions.",
    tagline: "Empowering Fortune 500 Companies with Cutting-Edge Technology Solutions",
    
    // Company Details
    founded: "2024",
    industry: "Technology Consulting",
    category: "Software Company",
    type: "Private Company",
    
    // Contact Information
    email: "contact@techonigx.com",
    salesEmail: "sales@techonigx.com",
    phone: "+91-8494090499",
    phoneFormatted: "+91 8494097956",
    
    // Address
    address: {
      street: "503 Pump, Sola",
      city: "Ahmedabad",
      state: "Gujarat",
      country: "India",
      postalCode: "380060",
      full: "503 Pump, Sola, Ahmedabad, Gujarat 380060, India"
    },
    
    // Business Hours
    hours: {
      monday: "9:00 AM - 6:00 PM",
      tuesday: "9:00 AM - 6:00 PM",
      wednesday: "9:00 AM - 6:00 PM",
      thursday: "9:00 AM - 6:00 PM",
      friday: "9:00 AM - 6:00 PM",
      saturday: "10:00 AM - 4:00 PM",
      sunday: "Closed"
    },
    
    // Social Media
    social: {
      linkedin: "https://www.linkedin.com/company/techonigx",
      twitter: "https://twitter.com/techonigx",
      github: "https://github.com/techonigx",
      facebook: "https://facebook.com/techonigx",
      instagram: "https://instagram.com/techonigx"
    },
    
    // Website
    url: "https://techonigx.com",
    logo: "https://techonigx.com/logo.png",
    favicon: "https://techonigx.com/favicon.ico",
    
    // Services
    services: [
      "AI/ML Development",
      "Cloud Architecture",
      "Digital Transformation",
      "Fortune 500 Consulting",
      "Web Development",
      "Mobile App Development",
      "IoT Solutions",
      "Database Optimization"
    ],
    
    // Technologies
    technologies: [
      "Artificial Intelligence",
      "Machine Learning",
      "Cloud Computing",
      "AWS",
      "Azure",
      "Google Cloud",
      "React",
      "Node.js",
      "Python",
      "TensorFlow",
      "Kubernetes",
      "Docker"
    ],
    
    // Industries Served
    industries: [
      "Fortune 500",
      "Healthcare",
      "Finance",
      "Manufacturing",
      "Retail",
      "Technology",
      "Energy",
      "Transportation"
    ]
  },
  
  // Team Information
  team: {
    founder: {
      name: "Shiv Sagar",
      title: "Co-founder & CEO",
      bio: "Technology futurist and Fortune 500 consultant with expertise in AI, cloud computing, and digital transformation. Passionate about driving business innovation through cutting-edge technology solutions.",
      linkedin: "https://www.linkedin.com/in/shivsagar",
      twitter: "https://twitter.com/shivsagar",
      expertise: ["AI/ML", "Cloud Architecture", "Digital Transformation", "Fortune 500 Consulting"]
    },
    
    coFounder: {
      name: "Tech Expert",
      title: "Co-founder & CTO",
      bio: "Seasoned technology leader specializing in scalable architecture, AI implementation, and enterprise solutions. Committed to delivering innovative technology solutions that drive business success.",
      linkedin: "https://www.linkedin.com/in/tech-expert",
      expertise: ["System Architecture", "AI Implementation", "Enterprise Solutions", "Scalability"]
    }
  },
  
  // Company Metrics
  metrics: {
    rating: 4.8,
    reviewCount: 150,
    clientCount: 50,
    projectCount: 200,
    teamSize: 25,
    experience: "5+ years",
    successRate: "98%",
    clientRetention: "95%"
  },
  
  // Awards & Recognition
  awards: [
    "Top Technology Consultant 2024",
    "AI Innovation Award",
    "Fortune 500 Trusted Partner",
    "Excellence in Digital Transformation"
  ],
  
  // Certifications
  certifications: [
    "AWS Advanced Consulting Partner",
    "Microsoft Gold Partner",
    "Google Cloud Partner",
    "ISO 27001 Certified",
    "CMMI Level 5"
  ],
  
  // Client Testimonials
  testimonials: [
    {
      client: "Fortune 500 Tech Company",
      quote: "TechOnigx transformed our digital infrastructure and helped us achieve 300% ROI on our technology investments.",
      author: "CTO",
      rating: 5
    },
    {
      client: "Global Manufacturing Leader",
      quote: "Their AI solutions revolutionized our production processes and increased efficiency by 40%.",
      author: "VP of Operations",
      rating: 5
    },
    {
      client: "Healthcare Innovation Company",
      quote: "TechOnigx's expertise in AI/ML helped us develop breakthrough medical diagnostic tools.",
      author: "Chief Innovation Officer",
      rating: 5
    }
  ],
  
  // Blog & Content
  blog: {
    title: "TechOnigx Tech Blog",
    description: "Latest insights on technology and innovation from Fortune 500 technology experts",
    category: "Technology Blog",
    frequency: "Weekly",
    topics: [
      "AI & Machine Learning",
      "Cloud Computing",
      "Digital Transformation",
      "Fortune 500 Insights",
      "Technology Trends",
      "Innovation Strategies"
    ]
  },
  
  // SEO Configuration
  seo: {
    title: "TechOnigx - Fortune 500 Technology Consulting & AI Solutions",
    description: "Leading technology consulting company specializing in AI/ML development, cloud architecture, and digital transformation for Fortune 500 companies. Expert Fortune 500 consultants.",
    keywords: [
      "Technology Consulting",
      "AI Development",
      "Machine Learning",
      "Cloud Architecture",
      "Digital Transformation",
      "Fortune 500 Consulting",
      "Technology Solutions",
      "AI/ML Development",
      "Cloud Computing",
      "Enterprise Solutions"
    ],
    author: "TechOnigx Team",
    language: "en-US",
    locale: "en_US"
  }
};

// Export individual sections for easy access
export const { company, team, metrics, awards, certifications, testimonials, blog, seo } = siteConfig;

// Default export
export default siteConfig;
