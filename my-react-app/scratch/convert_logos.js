import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const publicDir = 'c:/Users/91755/Desktop/Swaccham/my-react-app/public';

async function convert() {
  try {
    console.log('Starting logo conversion...');

    // 1. Convert logo.svg to logo-transparent.png and logo.png
    const logoSvgPath = path.join(publicDir, 'logo.svg');
    const logoPngPath = path.join(publicDir, 'logo.png');
    const logoTransparentPngPath = path.join(publicDir, 'logo-transparent.png');

    console.log(`Reading logo SVG from: ${logoSvgPath}`);
    const logoSvgBuffer = fs.readFileSync(logoSvgPath);

    // Write transparent PNG
    await sharp(logoSvgBuffer)
      .png()
      .toFile(logoTransparentPngPath);
    console.log(`Created logo-transparent.png at ${logoTransparentPngPath}`);

    // Write logo.png
    await sharp(logoSvgBuffer)
      .png()
      .toFile(logoPngPath);
    console.log(`Created logo.png at ${logoPngPath}`);

    // 2. Convert favicon.svg to app-icon.png (512x512)
    const faviconSvgPath = path.join(publicDir, 'favicon.svg');
    const appIconPngPath = path.join(publicDir, 'app-icon.png');

    console.log(`Reading favicon SVG from: ${faviconSvgPath}`);
    const faviconSvgBuffer = fs.readFileSync(faviconSvgPath);

    await sharp(faviconSvgBuffer)
      .resize(512, 512)
      .png()
      .toFile(appIconPngPath);
    console.log(`Created app-icon.png (512x512) at ${appIconPngPath}`);

    console.log('Logo conversion completed successfully!');
  } catch (error) {
    console.error('Error during logo conversion:', error);
  }
}

convert();
