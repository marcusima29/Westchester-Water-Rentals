const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

// Image optimization configuration
const SIZES = [400, 800, 1200, 1600]; // Different sizes for responsive images
const QUALITY = {
  jpeg: 85,
  webp: 85,
  avif: 80
};

// External image URLs from the website
const EXTERNAL_IMAGES = [
  {
    url: 'https://i.imgur.com/zepyQvg.jpeg',
    name: 'hero-background',
    alt: 'Child jumping into pool background'
  },
  {
    url: 'https://i.imgur.com/ieansQD.jpeg', 
    name: 'logo',
    alt: 'Westchester Water Rentals Logo'
  },
  {
    url: 'https://i.imgur.com/EmMhcTo.jpeg',
    name: 'splash-slide',
    alt: 'Girl on splash slide'
  },
  {
    url: 'https://i.imgur.com/wynfB3d.jpeg',
    name: 'purple-tropical',
    alt: 'HeroKiddo 16\' Purple Tropical water slide'
  }
];

async function downloadImage(url, outputPath) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }
    const buffer = await response.arrayBuffer();
    await fs.writeFile(outputPath, Buffer.from(buffer));
    console.log(`Downloaded: ${url} -> ${outputPath}`);
  } catch (error) {
    console.error(`Error downloading ${url}:`, error.message);
  }
}

async function optimizeImage(inputPath, outputDir, baseName) {
  const input = sharp(inputPath);
  const metadata = await input.metadata();
  
  console.log(`Processing ${baseName}...`);
  console.log(`Original: ${metadata.width}x${metadata.height}, ${Math.round(metadata.size / 1024)}KB`);

  // Create different sizes
  for (const size of SIZES) {
    if (size <= metadata.width) {
      // Generate JPEG
      await input
        .resize(size, null, { withoutEnlargement: true })
        .jpeg({ quality: QUALITY.jpeg, progressive: true })
        .toFile(path.join(outputDir, `${baseName}-${size}.jpg`));

      // Generate WebP
      await input
        .resize(size, null, { withoutEnlargement: true })
        .webp({ quality: QUALITY.webp })
        .toFile(path.join(outputDir, `${baseName}-${size}.webp`));

      // Generate AVIF
      await input
        .resize(size, null, { withoutEnlargement: true })
        .avif({ quality: QUALITY.avif })
        .toFile(path.join(outputDir, `${baseName}-${size}.avif`));
    }
  }

  // Generate original size optimized versions
  await input
    .jpeg({ quality: QUALITY.jpeg, progressive: true })
    .toFile(path.join(outputDir, `${baseName}-original.jpg`));
    
  await input
    .webp({ quality: QUALITY.webp })
    .toFile(path.join(outputDir, `${baseName}-original.webp`));
    
  await input
    .avif({ quality: QUALITY.avif })
    .toFile(path.join(outputDir, `${baseName}-original.avif`));
}

function generatePictureElement(baseName, alt, sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw') {
  const sizeAttributes = SIZES.map(size => `${baseName}-${size}.avif ${size}w`).join(', ');
  const webpSizeAttributes = SIZES.map(size => `${baseName}-${size}.webp ${size}w`).join(', ');
  const jpegSizeAttributes = SIZES.map(size => `${baseName}-${size}.jpg ${size}w`).join(', ');
  
  return `<picture>
  <source srcset="${sizeAttributes}" sizes="${sizes}" type="image/avif">
  <source srcset="${webpSizeAttributes}" sizes="${sizes}" type="image/webp">
  <source srcset="${jpegSizeAttributes}" sizes="${sizes}" type="image/jpeg">
  <img src="${baseName}-800.jpg" alt="${alt}" loading="lazy" decoding="async">
</picture>`;
}

async function main() {
  try {
    // Create directories
    await fs.mkdir('public/images', { recursive: true });
    await fs.mkdir('temp', { recursive: true });

    console.log('Starting image optimization process...\n');

    // Download external images
    for (const img of EXTERNAL_IMAGES) {
      const tempPath = path.join('temp', `${img.name}.jpg`);
      await downloadImage(img.url, tempPath);
      
      // Optimize the downloaded image
      await optimizeImage(tempPath, 'public/images', img.name);
    }

    // Generate HTML snippets for responsive images
    console.log('\n=== Responsive Image HTML Snippets ===\n');
    
    for (const img of EXTERNAL_IMAGES) {
      console.log(`<!-- ${img.name} -->`);
      console.log(generatePictureElement(img.name, img.alt));
      console.log('');
    }

    // Generate CSS for hero image with multiple formats
    console.log('\n=== CSS Background Image Examples ===\n');
    console.log(`/* Hero background with responsive images */
.hero-bg {
  background-image: 
    image-set(
      url('images/hero-background-1200.avif') 1x,
      url('images/hero-background-1600.avif') 2x
    );
  background-image: 
    -webkit-image-set(
      url('images/hero-background-1200.webp') 1x,
      url('images/hero-background-1600.webp') 2x
    );
  background-image: url('images/hero-background-1200.jpg');
  background-size: cover;
  background-position: center;
}

@media (max-width: 768px) {
  .hero-bg {
    background-image: 
      image-set(
        url('images/hero-background-400.avif') 1x,
        url('images/hero-background-800.avif') 2x
      );
    background-image: 
      -webkit-image-set(
        url('images/hero-background-400.webp') 1x,
        url('images/hero-background-800.webp') 2x
      );
    background-image: url('images/hero-background-400.jpg');
  }
}`);

    // Clean up temp directory
    await fs.rm('temp', { recursive: true, force: true });
    
    console.log('\n✅ Image optimization complete!');
    console.log('📁 Optimized images saved to: public/images/');
    console.log('🎯 Use the HTML snippets above to implement responsive images');
    
  } catch (error) {
    console.error('❌ Error during optimization:', error);
  }
}

// Add utility function to calculate potential savings
async function calculateSavings() {
  console.log('\n=== Estimated Performance Improvements ===\n');
  
  const improvements = [
    {
      optimization: 'WebP Format (vs JPEG)',
      savings: '25-35%',
      impact: 'High'
    },
    {
      optimization: 'AVIF Format (vs JPEG)', 
      savings: '50-60%',
      impact: 'Very High'
    },
    {
      optimization: 'Responsive Images',
      savings: '60-80%',
      impact: 'Very High'
    },
    {
      optimization: 'Progressive JPEG',
      savings: '5-10%',
      impact: 'Medium (Perceived Performance)'
    }
  ];

  improvements.forEach(item => {
    console.log(`${item.optimization}:`);
    console.log(`  💾 Size Reduction: ${item.savings}`);
    console.log(`  🚀 Performance Impact: ${item.impact}\n`);
  });
}

if (require.main === module) {
  main().then(() => calculateSavings());
}

module.exports = { optimizeImage, generatePictureElement, downloadImage };