export default function StructuredData() {
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "TechXak",
    "alternateName": "TechXak Technologies",
    "url": "https://techxak.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://techxak.com/favicon.ico",
      "width": 200,
      "height": 200
    },
    "description": "Driving the future with AI & software excellence. Leading technology solutions provider specializing in web development, mobile apps, AI/ML, AWS cloud services, IoT solutions, and database expertise. Trusted by Fortune 500 companies including Google, Apple, and McDonald's.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "TechXak Office",
      "addressLocality": "Ahmedabad",
      "addressRegion": "Gujarat",
      "postalCode": "380001",
      "addressCountry": "IN"
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+91-8494090499",
        "contactType": "customer service",
        "email": "hello@techxak.com",
        "availableLanguage": ["English", "Hindi", "Gujarati"]
      },
      {
        "@type": "ContactPoint",
        "telephone": "+1-555-0123",
        "contactType": "sales",
        "email": "sales@techxak.com",
        "availableLanguage": "English"
      }
    ],
    "sameAs": [
      "https://linkedin.com/company/techxak",
      "https://twitter.com/techxak",
      "https://github.com/techxak",
      "https://facebook.com/techxak",
      "https://instagram.com/techxak",
      "https://medium.com/@techxak",
      "https://youtube.com/@techxak",
      "https://dev.to/techxak",
      "https://hashnode.com/@techxak"
    ],
    "socialMedia": [
      {
        "@type": "SocialMediaPosting",
        "url": "https://linkedin.com/company/techxak",
        "name": "LinkedIn",
        "description": "Follow TechXak on LinkedIn for technology insights and company updates"
      },
      {
        "@type": "SocialMediaPosting", 
        "url": "https://twitter.com/techxak",
        "name": "Twitter",
        "description": "Follow @techxak on Twitter for technology news and updates"
      },
      {
        "@type": "SocialMediaPosting",
        "url": "https://github.com/techxak", 
        "name": "GitHub",
        "description": "Explore TechXak's open source projects and contributions on GitHub"
      }
    ],
    "foundingDate": "2014",
    "numberOfEmployees": {
      "@type": "QuantitativeValue",
      "value": "50-100",
      "unitText": "employees"
    },
    "keywords": "web development, mobile apps, AI development, AWS cloud services, IoT solutions, Oracle database, medical software, hiring partner, developer recruitment, Fortune 500, technology consulting",
    "serviceArea": {
      "@type": "Place",
      "name": "Worldwide",
      "description": "Serving clients globally with remote development teams"
    },
    "award": [
      "Fortune 500 Technology Partner",
      "AWS Advanced Consulting Partner",
      "Google Cloud Partner"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Technology Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Web Development",
            "description": "Custom web applications built with modern technologies"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Mobile App Development",
            "description": "Native and cross-platform mobile applications"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "AI & Machine Learning",
            "description": "Artificial intelligence solutions and ML models"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "AWS Cloud Services",
            "description": "Scalable cloud infrastructure and serverless architecture"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "IoT Solutions",
            "description": "Internet of Things development and smart device connectivity"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Database & Oracle AI",
            "description": "Expert database design and Oracle AI integration"
          }
        }
      ]
    }
  };

  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "TechXak - Leading Technology Solutions & Development Partner",
    "alternateName": "TechXak",
    "url": "https://techxak.com",
    "description": "TechXak is driving the future with AI & software excellence. We provide cutting-edge technology solutions including web development, mobile apps, AI/ML, AWS cloud services, IoT solutions, and database expertise.",
    "publisher": {
      "@type": "Organization",
      "name": "TechXak",
      "url": "https://techxak.com"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://techxak.com/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "inLanguage": "en-US",
    "copyrightYear": "2024",
    "dateModified": new Date().toISOString()
  };

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://techxak.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Services",
        "item": "https://techxak.com/services"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Blog",
        "item": "https://techxak.com/blog"
      }
    ]
  };

  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What services does TechXak provide?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "TechXak provides comprehensive technology solutions including web development, mobile app development, AI/ML solutions, AWS cloud services, IoT development, and database expertise. We work with Fortune 500 companies and provide expert hiring services."
        }
      },
      {
        "@type": "Question",
        "name": "Does TechXak work with Fortune 500 companies?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, TechXak is a trusted technology partner for Fortune 500 companies including Google, Apple, McDonald's, and many others. We provide expert development teams and technology solutions."
        }
      },
      {
        "@type": "Question",
        "name": "What technologies does TechXak specialize in?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "TechXak specializes in React, Node.js, Python, AWS, Oracle Database, AI/ML, IoT, mobile development, and modern web technologies. We stay current with the latest technology trends."
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationData)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteData)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbData)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqData)
        }}
      />
    </>
  );
}
