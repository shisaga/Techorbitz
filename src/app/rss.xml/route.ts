import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const baseUrl = 'https://techxak.com';
  
  try {
    const posts = await prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
        publishedAt: { lte: new Date() }
      },
      include: {
        author: {
          select: { name: true }
        }
      },
      orderBy: { publishedAt: 'desc' },
      take: 50 // Latest 50 posts
    });

    const rssItems = posts.map((post) => `
      <item>
        <title><![CDATA[${post.title}]]></title>
        <description><![CDATA[${post.excerpt || post.seoDescription || ''}]]></description>
        <link>${baseUrl}/blog/${post.slug}</link>
        <guid>${baseUrl}/blog/${post.slug}</guid>
        <pubDate>${post.publishedAt?.toUTCString()}</pubDate>
        <author>hello@techxak.com (${post.author.name})</author>
        <category><![CDATA[Technology]]></category>
      </item>
    `).join('');

    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
      <channel>
            <title>TechXak Tech Blog</title>
    <description>Latest insights on technology, development, AI, cloud computing, and innovation from TechXak experts.</description>
        <link>${baseUrl}/blog</link>
        <language>en-us</language>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
            <managingEditor>hello@techxak.com (TechXak Team)</managingEditor>
    <webMaster>hello@techxak.com (TechXak Team)</webMaster>
        <category>Technology</category>
        <category>Web Development</category>
        <category>AI & Machine Learning</category>
        <category>Cloud Computing</category>
        <category>IoT</category>
        <category>Database</category>
        <category>Healthcare Technology</category>
        <category>Video Production</category>
        <category>Graphic Design</category>
        ${rssItems}
      </channel>
    </rss>`;

    return new NextResponse(rssXml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate'
      }
    });

  } catch (error) {
    console.error('Error generating RSS feed:', error);
    
    // Return basic RSS feed on error
    const basicRss = `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0">
      <channel>
        <title>TechXak Tech Blog</title>
        <description>Latest insights on technology and innovation</description>
        <link>${baseUrl}/blog</link>
        <language>en-us</language>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
      </channel>
    </rss>`;

    return new NextResponse(basicRss, {
      headers: {
        'Content-Type': 'application/xml'
      }
    });
  }
}
