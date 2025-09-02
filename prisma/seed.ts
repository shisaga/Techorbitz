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

  // Create some sample categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'technology' },
      update: {},
      create: {
        name: 'Technology',
        slug: 'technology',
        description: 'Latest technology trends and insights',
        color: '#3B82F6',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'web-development' },
      update: {},
      create: {
        name: 'Web Development',
        slug: 'web-development',
        description: 'Web development tutorials and guides',
        color: '#10B981',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'ai-ml' },
      update: {},
      create: {
        name: 'AI & Machine Learning',
        slug: 'ai-ml',
        description: 'Artificial Intelligence and Machine Learning',
        color: '#8B5CF6',
      },
    }),
  ]);

  console.log('✅ Categories created:', categories.length);

  // Create some sample tags
  const tags = await Promise.all([
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
  ]);

  console.log('✅ Tags created:', tags.length);

  // Create a sample blog post
  const samplePost = await prisma.post.upsert({
    where: { slug: 'welcome-to-techxak' },
    update: {},
    create: {
      title: 'Welcome to TechXak',
      slug: 'welcome-to-techxak',
      excerpt: 'Your gateway to the latest in technology and web development',
      content: `
        <h1>Welcome to TechXak</h1>
        <p>Welcome to our platform where we share insights about technology, web development, and the latest trends in the digital world.</p>
        <h2>What We Cover</h2>
        <ul>
          <li>Web Development</li>
          <li>Technology Trends</li>
          <li>AI & Machine Learning</li>
          <li>Best Practices</li>
        </ul>
        <p>Stay tuned for more exciting content!</p>
      `,
      status: 'PUBLISHED',
      publishedAt: new Date(),
      authorId: adminUser.id,
      categoryIds: [categories[0].id], // Technology category
      tagIds: [tags[0].id, tags[1].id], // JavaScript and React tags
      readingTime: 3,
      seoTitle: 'Welcome to TechXak - Technology Blog',
      seoDescription: 'Your gateway to the latest in technology and web development. Discover insights, tutorials, and trends.',
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
