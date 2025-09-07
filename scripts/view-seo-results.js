#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

async function viewResults() {
  try {
    const reportPath = path.join(process.cwd(), 'seo-report.json');
    const report = JSON.parse(await fs.readFile(reportPath, 'utf8'));
    
    console.log('🚀 InnstaStay SEO Test Results\n');
    console.log('='.repeat(50));
    
    // Summary
    const { summary, lighthouse } = report;
    console.log(`📊 Overall Results:`);
    console.log(`   ✅ Passed: ${summary.passed}`);
    console.log(`   ❌ Failed: ${summary.failed}`);
    console.log(`   ⚠️  Warnings: ${summary.warnings}`);
    console.log(`   📈 Success Rate: ${((summary.passed / summary.total) * 100).toFixed(1)}%\n`);
    
    // Lighthouse Scores
    if (lighthouse) {
      console.log('🏆 Lighthouse Scores:');
      console.log(`   Performance: ${lighthouse.performance}/100`);
      console.log(`   Accessibility: ${lighthouse.accessibility}/100`);
      console.log(`   Best Practices: ${lighthouse.bestPractices}/100`);
      console.log(`   SEO: ${lighthouse.seo}/100\n`);
    }
    
    // Page Results
    console.log('📄 Page-by-Page Results:');
    console.log('='.repeat(50));
    
    Object.entries(report.pages).forEach(([page, data]) => {
      if (data.error) {
        console.log(`❌ ${page}: ${data.error}`);
        return;
      }
      
      const tests = data.tests;
      const totalTests = Object.values(tests).reduce((sum, test) => 
        sum + test.passed + test.failed + test.warnings, 0);
      const passedTests = Object.values(tests).reduce((sum, test) => 
        sum + test.passed, 0);
      
      console.log(`\n🔍 ${page}:`);
      console.log(`   📊 ${passedTests}/${totalTests} tests passed`);
      
      // Show failed tests
      Object.entries(tests).forEach(([testName, test]) => {
        if (test.failed > 0) {
          console.log(`   ❌ ${testName}: ${test.failed} failures`);
        }
      });
    });
    
    console.log('\n📄 Full detailed report: seo-report.json');
    console.log('🗺️  Sitemap: public/sitemap.xml');
    console.log('🤖 Robots.txt: public/robots.txt');
    
  } catch (error) {
    console.error('❌ Error reading SEO report:', error.message);
    console.log('💡 Run "npm run seo:test" first to generate results');
  }
}

if (require.main === module) {
  viewResults();
}

module.exports = { viewResults };
