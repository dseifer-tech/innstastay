#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

// Sitemap Configuration
const BASE_URL = process.env.BASE_URL || 'https://www.innstastay.com';
const OUTPUT_PATH = path.join(process.cwd(), 'public', 'sitemap.xml');

// Hotel slugs from your data
const HOTEL_SLUGS = [
  'pantages-hotel-downtown-toronto',
  'town-inn-suites',
  'one-king-west-hotel-residence',
  'the-omni-king-edward-hotel',
  'chelsea-hotel-toronto',
  'the-anndore-house-jdv',
  'sutton-place-hotel-toronto',
  'ace-hotel-toronto'
];

// Static pages with their priorities and change frequencies
const STATIC_PAGES = [
  { url: '/', priority: '1.0', changefreq: 'daily' },
  { url: '/about', priority: '0.8', changefreq: 'monthly' },
  { url: '/contact', priority: '0.7', changefreq: 'monthly' },
  { url: '/hotels/toronto-downtown', priority: '0.9', changefreq: 'weekly' },
  { url: '/search', priority: '0.8', changefreq: 'daily' },
  { url: '/privacy', priority: '0.3', changefreq: 'yearly' }
];

class SitemapGenerator {
  constructor() {
    this.baseUrl = BASE_URL;
    this.outputPath = OUTPUT_PATH;
    this.lastmod = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  }

  generateSitemapXML() {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Add static pages
    STATIC_PAGES.forEach(page => {
      xml += this.generateURLTag(page.url, page.priority, page.changefreq);
    });

    // Add hotel pages
    HOTEL_SLUGS.forEach(slug => {
      const url = `/hotels/${slug}`;
      xml += this.generateURLTag(url, '0.8', 'weekly');
    });

    xml += '</urlset>';
    return xml;
  }

  generateURLTag(url, priority, changefreq) {
    const fullUrl = `${this.baseUrl}${url}`;
    return `  <url>\n` +
           `    <loc>${fullUrl}</loc>\n` +
           `    <lastmod>${this.lastmod}</lastmod>\n` +
           `    <changefreq>${changefreq}</changefreq>\n` +
           `    <priority>${priority}</priority>\n` +
           `  </url>\n`;
  }

  async generate() {
    try {
      console.log('🗺️  Generating sitemap...');
      
      const xml = this.generateSitemapXML();
      
      // Ensure public directory exists
      const publicDir = path.dirname(this.outputPath);
      await fs.mkdir(publicDir, { recursive: true });
      
      // Write sitemap file
      await fs.writeFile(this.outputPath, xml, 'utf8');
      
      console.log(`✅ Sitemap generated successfully!`);
      console.log(`📄 Location: ${this.outputPath}`);
      console.log(`🔗 URL: ${this.baseUrl}/sitemap.xml`);
      console.log(`📊 Total URLs: ${STATIC_PAGES.length + HOTEL_SLUGS.length}`);
      
      return {
        success: true,
        path: this.outputPath,
        url: `${this.baseUrl}/sitemap.xml`,
        totalUrls: STATIC_PAGES.length + HOTEL_SLUGS.length
      };
      
    } catch (error) {
      console.error('❌ Error generating sitemap:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

async function main() {
  const generator = new SitemapGenerator();
  await generator.generate();
}

if (require.main === module) {
  main();
}

module.exports = SitemapGenerator;
