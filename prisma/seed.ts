import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@techxak.com' },
    update: {},
    create: {
      email: 'admin@techxak.com',
      name: 'Admin User',
      role: 'ADMIN',
      isVerified: true,
    },
  });

  console.log('✅ Admin user created:', adminUser.email);

  // Create comprehensive categories for all content types
  const categories = await Promise.all([
    // Core Innovation Categories
    prisma.category.upsert({
      where: { slug: 'innovation-insights' },
      update: {},
      create: {
        name: 'Innovation Insights',
        slug: 'innovation-insights',
        description: 'Cutting-edge innovations and breakthrough technologies',
        color: '#FF6B47', // Coral primary
      },
    }),
    prisma.category.upsert({
      where: { slug: 'digital-transformation' },
      update: {},
      create: {
        name: 'Digital Transformation',
        slug: 'digital-transformation',
        description: 'How technology is reshaping industries and businesses',
        color: '#8B5CF6',
      },
    }),
    
    // News & Current Affairs
    prisma.category.upsert({
      where: { slug: 'breaking-news' },
      update: {},
      create: {
        name: 'Breaking News',
        slug: 'breaking-news',
        description: 'Latest breaking news and current events',
        color: '#EF4444',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'industry-updates' },
      update: {},
      create: {
        name: 'Industry Updates',
        slug: 'industry-updates',
        description: 'Latest updates from various industries and sectors',
        color: '#F59E0B',
      },
    }),
    
    // Development & Engineering
    prisma.category.upsert({
      where: { slug: 'software-engineering' },
      update: {},
      create: {
        name: 'Software Engineering',
        slug: 'software-engineering',
        description: 'Software development, architecture, and engineering practices',
        color: '#10B981',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'web-development' },
      update: {},
      create: {
        name: 'Web Development',
        slug: 'web-development',
        description: 'Frontend, backend, and full-stack web development',
        color: '#06B6D4',
      },
    }),
    
    // AI & Emerging Tech
    prisma.category.upsert({
      where: { slug: 'artificial-intelligence' },
      update: {},
      create: {
        name: 'Artificial Intelligence',
        slug: 'artificial-intelligence',
        description: 'AI, machine learning, and intelligent systems',
        color: '#8B5CF6',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'emerging-technologies' },
      update: {},
      create: {
        name: 'Emerging Technologies',
        slug: 'emerging-technologies',
        description: 'Blockchain, IoT, AR/VR, and other emerging tech',
        color: '#EC4899',
      },
    }),
    
    // Business & Strategy
    prisma.category.upsert({
      where: { slug: 'business-strategy' },
      update: {},
      create: {
        name: 'Business Strategy',
        slug: 'business-strategy',
        description: 'Business insights, strategy, and market analysis',
        color: '#6366F1',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'startup-ecosystem' },
      update: {},
      create: {
        name: 'Startup Ecosystem',
        slug: 'startup-ecosystem',
        description: 'Startup news, funding, and entrepreneurial insights',
        color: '#14B8A6',
      },
    }),
    
    // Research & Analysis
    prisma.category.upsert({
      where: { slug: 'research-analysis' },
      update: {},
      create: {
        name: 'Research & Analysis',
        slug: 'research-analysis',
        description: 'In-depth research, data analysis, and market studies',
        color: '#84CC16',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'case-studies' },
      update: {},
      create: {
        name: 'Case Studies',
        slug: 'case-studies',
        description: 'Real-world case studies and success stories',
        color: '#F97316',
      },
    }),
    
    // Global & Social Impact
    prisma.category.upsert({
      where: { slug: 'global-impact' },
      update: {},
      create: {
        name: 'Global Impact',
        slug: 'global-impact',
        description: 'Technology impact on society and global issues',
        color: '#DC2626',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'sustainability' },
      update: {},
      create: {
        name: 'Sustainability',
        slug: 'sustainability',
        description: 'Green technology and sustainable innovation',
        color: '#059669',
      },
    }),
    
    // Tools & Resources
    prisma.category.upsert({
      where: { slug: 'tools-resources' },
      update: {},
      create: {
        name: 'Tools & Resources',
        slug: 'tools-resources',
        description: 'Productivity tools, resources, and recommendations',
        color: '#7C3AED',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'tutorials-guides' },
      update: {},
      create: {
        name: 'Tutorials & Guides',
        slug: 'tutorials-guides',
        description: 'Step-by-step tutorials and comprehensive guides',
        color: '#0891B2',
      },
    }),
  ]);

  console.log('✅ Categories created:', categories.length);

  // Create comprehensive tags for all content types
  const tags = await Promise.all([
    // Programming & Development
    prisma.tag.upsert({
      where: { slug: 'javascript' },
      update: {},
      create: {
        name: 'JavaScript',
        slug: 'javascript',
        color: '#F59E0B',
      },
    }),
    prisma.tag.upsert({
      where: { slug: 'react' },
      update: {},
      create: {
        name: 'React',
        slug: 'react',
        color: '#06B6D4',
      },
    }),
    prisma.tag.upsert({
      where: { slug: 'nextjs' },
      update: {},
      create: {
        name: 'Next.js',
        slug: 'nextjs',
        color: '#000000',
      },
    }),
    prisma.tag.upsert({
      where: { slug: 'python' },
      update: {},
      create: {
        name: 'Python',
        slug: 'python',
        color: '#3776AB',
      },
    }),
    prisma.tag.upsert({
      where: { slug: 'typescript' },
      update: {},
      create: {
        name: 'TypeScript',
        slug: 'typescript',
        color: '#3178C6',
      },
    }),
    
    // AI & Machine Learning
    prisma.tag.upsert({
      where: { slug: 'artificial-intelligence' },
      update: {},
      create: {
        name: 'Artificial Intelligence',
        slug: 'artificial-intelligence',
        color: '#8B5CF6',
      },
    }),
    prisma.tag.upsert({
      where: { slug: 'machine-learning' },
      update: {},
      create: {
        name: 'Machine Learning',
        slug: 'machine-learning',
        color: '#EC4899',
      },
    }),
    prisma.tag.upsert({
      where: { slug: 'deep-learning' },
      update: {},
      create: {
        name: 'Deep Learning',
        slug: 'deep-learning',
        color: '#7C3AED',
      },
    }),
    
    // Business & Innovation
    prisma.tag.upsert({
      where: { slug: 'innovation' },
      update: {},
      create: {
        name: 'Innovation',
        slug: 'innovation',
        color: '#FF6B47',
      },
    }),
    prisma.tag.upsert({
      where: { slug: 'startup' },
      update: {},
      create: {
        name: 'Startup',
        slug: 'startup',
        color: '#14B8A6',
      },
    }),
    prisma.tag.upsert({
      where: { slug: 'entrepreneurship' },
      update: {},
      create: {
        name: 'Entrepreneurship',
        slug: 'entrepreneurship',
        color: '#6366F1',
      },
    }),
    
    // News & Current Events
    prisma.tag.upsert({
      where: { slug: 'breaking-news' },
      update: {},
      create: {
        name: 'Breaking News',
        slug: 'breaking-news',
        color: '#EF4444',
      },
    }),
    prisma.tag.upsert({
      where: { slug: 'industry-news' },
      update: {},
      create: {
        name: 'Industry News',
        slug: 'industry-news',
        color: '#F59E0B',
      },
    }),
    prisma.tag.upsert({
      where: { slug: 'market-analysis' },
      update: {},
      create: {
        name: 'Market Analysis',
        slug: 'market-analysis',
        color: '#84CC16',
      },
    }),
    
    // Emerging Technologies
    prisma.tag.upsert({
      where: { slug: 'blockchain' },
      update: {},
      create: {
        name: 'Blockchain',
        slug: 'blockchain',
        color: '#F97316',
      },
    }),
    prisma.tag.upsert({
      where: { slug: 'iot' },
      update: {},
      create: {
        name: 'IoT',
        slug: 'iot',
        color: '#059669',
      },
    }),
    prisma.tag.upsert({
      where: { slug: 'ar-vr' },
      update: {},
      create: {
        name: 'AR/VR',
        slug: 'ar-vr',
        color: '#DC2626',
      },
    }),
    
    // Tools & Resources
    prisma.tag.upsert({
      where: { slug: 'productivity' },
      update: {},
      create: {
        name: 'Productivity',
        slug: 'productivity',
        color: '#7C3AED',
      },
    }),
    prisma.tag.upsert({
      where: { slug: 'tutorial' },
      update: {},
      create: {
        name: 'Tutorial',
        slug: 'tutorial',
        color: '#0891B2',
      },
    }),
    prisma.tag.upsert({
      where: { slug: 'case-study' },
      update: {},
      create: {
        name: 'Case Study',
        slug: 'case-study',
        color: '#F97316',
      },
    }),
    
    // Global & Social
    prisma.tag.upsert({
      where: { slug: 'sustainability' },
      update: {},
      create: {
        name: 'Sustainability',
        slug: 'sustainability',
        color: '#059669',
      },
    }),
    prisma.tag.upsert({
      where: { slug: 'social-impact' },
      update: {},
      create: {
        name: 'Social Impact',
        slug: 'social-impact',
        color: '#DC2626',
      },
    }),
    prisma.tag.upsert({
      where: { slug: 'digital-transformation' },
      update: {},
      create: {
        name: 'Digital Transformation',
        slug: 'digital-transformation',
        color: '#8B5CF6',
      },
    }),
  ]);

  console.log('✅ Tags created:', tags.length);

  // Create a sample blog post
  const samplePost = await prisma.post.upsert({
    where: { slug: 'welcome-to-techxak' },
    update: {},
    create: {
      title: 'Welcome to TechXak',
      slug: 'welcome-to-techxak',
      excerpt: 'Your gateway to innovation insights, breaking news, and cutting-edge developments',
      content: `
        <h1>Welcome to TechXak</h1>
        <p>Welcome to our platform where we share insights about innovation, digital transformation, and the latest developments across industries.</p>
        <h2>What We Cover</h2>
        <ul>
          <li>Innovation Insights & Breakthrough Technologies</li>
          <li>Breaking News & Industry Updates</li>
          <li>Artificial Intelligence & Emerging Technologies</li>
          <li>Business Strategy & Startup Ecosystem</li>
          <li>Research & Analysis</li>
          <li>Global Impact & Sustainability</li>
        </ul>
        <p>Stay tuned for more exciting content covering the latest in innovation and industry developments!</p>
      `,
      status: 'PUBLISHED',
      publishedAt: new Date(),
      authorId: adminUser.id,
      categoryIds: [categories[0].id], // Innovation Insights category
      tagIds: [tags[8].id, tags[9].id, tags[10].id], // Innovation, Startup, Entrepreneurship tags
      readingTime: 3,
      seoTitle: 'Welcome to TechXak - Innovation Insights Platform',
      seoDescription: 'Your gateway to innovation insights, breaking news, and cutting-edge developments. Discover the latest in technology, business, and industry trends.',
    },
  });

  console.log('✅ Sample post created:', samplePost.title);

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
