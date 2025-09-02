export default function StructuredData() {
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "TechXak",
    "url": "https://techxak.com",
    "logo": "https://techxak.com/logo.png",
    "description": "Leading technology solutions provider specializing in web development, mobile apps, AI/ML, AWS cloud services, IoT solutions, and database expertise.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "San Francisco",
      "addressRegion": "CA",
      "addressCountry": "US"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-555-123-4567",
      "contactType": "customer service",
      "email": "hello@techxak.com"
    },
    "sameAs": [
      "https://linkedin.com/company/techXak",
      "https://twitter.com/techXak",
      "https://github.com/techXak"
    ],
    "foundingDate": "2014",
    "numberOfEmployees": {
      "@type": "QuantitativeValue",
      "value": "50-100"
    },
    "keywords": "web development, mobile apps, AI development, AWS cloud services, IoT solutions, Oracle database, medical software, hiring partner, developer recruitment",
    "serviceArea": {
      "@type": "Place",
      "name": "Worldwide"
    },
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
    "name": "TechXak",
    "url": "https://techxak.com",
    "description": "Leading technology solutions provider for Fortune 500 companies",
    "publisher": {
      "@type": "Organization",
      "name": "TechXak"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://techxak.com/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
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
    </>
  );
}
