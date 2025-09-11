const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function optimizeHeroImage(inputPath, outputPath) {
  try {
    console.log('🖼️  Optimizing hero image...');
    console.log(`📁 Input: ${inputPath}`);
    console.log(`📁 Output: ${outputPath}`);
    
    // Get original image info
    const originalInfo = await sharp(inputPath).metadata();
    console.log(`📏 Original dimensions: ${originalInfo.width}x${originalInfo.height}`);
    console.log(`💾 Original size: ${(fs.statSync(inputPath).size / 1024).toFixed(1)}KB`);
    
    // Create optimized version
    // For 1280x1280 square image, we'll create a 1920x800 crop
    // This maintains high quality while fitting the hero perfectly
    const optimized = await sharp(inputPath)
      .resize({
        width: 1920,
        height: 800,
        fit: 'cover',
        position: 'center'
      })
      .jpeg({
        quality: 85,
        progressive: true,
        mozjpeg: true
      })
      .toBuffer();
    
    // Save the optimized image
    await fs.promises.writeFile(outputPath, optimized);
    
    // Get new file info
    const newSize = optimized.length;
    console.log(`✅ Optimized dimensions: 1920x800`);
    console.log(`💾 New size: ${(newSize / 1024).toFixed(1)}KB`);
    console.log(`📉 Size reduction: ${((fs.statSync(inputPath).size - newSize) / fs.statSync(inputPath).size * 100).toFixed(1)}%`);
    console.log('🎉 Hero image optimized successfully!');
    
  } catch (error) {
    console.error('❌ Error optimizing image:', error.message);
    process.exit(1);
  }
}

// Run the optimization
const inputImage = process.argv[2] || 'public/hero/homepage.jpg';
const outputImage = process.argv[3] || 'public/hero/homepage-optimized.jpg';

if (!fs.existsSync(inputImage)) {
  console.error(`❌ Input image not found: ${inputImage}`);
  console.log('💡 Usage: node scripts/optimize-hero-image.js <input-path> [output-path]');
  process.exit(1);
}

optimizeHeroImage(inputImage, outputImage);
