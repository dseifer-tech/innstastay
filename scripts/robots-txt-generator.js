#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

// Robots.txt Configuration
const BASE_URL = process.env.BASE_URL || 'https://www.innstastay.com';
const OUTPUT_PATH = path.join(process.cwd(), 'public', 'robots.txt');

class RobotsTxtGenerator {
  constructor() {
    this.baseUrl = BASE_URL;
    this.outputPath = OUTPUT_PATH;
  }

  generateRobotsTxt() {
    return `# InnstaStay Robots.txt
# Generated automatically

User-agent: *
Allow: /

# Sitemap
Sitemap: ${this.baseUrl}/sitemap.xml

# Disallow admin and API routes
Disallow: /api/
Disallow: /_next/
Disallow: /admin/

# Allow important pages
Allow: /
Allow: /about
Allow: /contact
Allow: /hotels/
Allow: /search
Allow: /privacy

# Crawl delay (optional - be respectful to search engines)
Crawl-delay: 1

# Specific rules for different user agents
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /

# Block bad bots
User-agent: AhrefsBot
Disallow: /

User-agent: SemrushBot
Disallow: /

User-agent: MJ12bot
Disallow: /

User-agent: DotBot
Disallow: /

# Host directive
Host: ${this.baseUrl}
`;
  }

  async generate() {
    try {
      console.log('🤖 Generating robots.txt...');
      
      const content = this.generateRobotsTxt();
      
      // Ensure public directory exists
      const publicDir = path.dirname(this.outputPath);
      await fs.mkdir(publicDir, { recursive: true });
      
      // Write robots.txt file
      await fs.writeFile(this.outputPath, content, 'utf8');
      
      console.log(`✅ Robots.txt generated successfully!`);
      console.log(`📄 Location: ${this.outputPath}`);
      console.log(`🔗 URL: ${this.baseUrl}/robots.txt`);
      
      return {
        success: true,
        path: this.outputPath,
        url: `${this.baseUrl}/robots.txt`
      };
      
    } catch (error) {
      console.error('❌ Error generating robots.txt:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

async function main() {
  const generator = new RobotsTxtGenerator();
  await generator.generate();
}

if (require.main === module) {
  main();
}

module.exports = RobotsTxtGenerator;
