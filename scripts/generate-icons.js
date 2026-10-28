const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function generateAll() {
  const sourceImage = path.join(__dirname, '../public/images/mentah-logo-softvesion.png');
  const resDir = path.join(__dirname, '../android/app/src/main/res');
  const bgColor = { r: 12, g: 14, b: 18, alpha: 1 }; // #0C0E12

  // 1. Crop to tight bounding box of the logo mark
  const croppedLogoBuffer = await sharp(sourceImage)
    .extract({ left: 220, top: 300, width: 590, height: 735 })
    .toBuffer();

  console.log('Logo cropped successfully.');

  // Densities for launcher icons
  const densities = [
    { dir: 'mipmap-mdpi', iconSize: 48, fgSize: 108 },
    { dir: 'mipmap-hdpi', iconSize: 72, fgSize: 162 },
    { dir: 'mipmap-xhdpi', iconSize: 96, fgSize: 216 },
    { dir: 'mipmap-xxhdpi', iconSize: 144, fgSize: 324 },
    { dir: 'mipmap-xxxhdpi', iconSize: 192, fgSize: 432 },
  ];

  for (const { dir, iconSize, fgSize } of densities) {
    const targetDir = path.join(resDir, dir);
    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

    // A. Adaptive Foreground (transparent canvas with logo in safe zone ~65%)
    const fgLogoDim = Math.round(fgSize * 0.65);
    const fgLogo = await sharp(croppedLogoBuffer)
      .resize(fgLogoDim, fgLogoDim, { fit: 'inside' })
      .toBuffer();

    await sharp({
      create: {
        width: fgSize,
        height: fgSize,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    })
    .composite([{ input: fgLogo, gravity: 'center' }])
    .png()
    .toFile(path.join(targetDir, 'ic_launcher_foreground.png'));

    // B. Legacy Square Icon
    const sqLogoDim = Math.round(iconSize * 0.72);
    const sqLogo = await sharp(croppedLogoBuffer)
      .resize(sqLogoDim, sqLogoDim, { fit: 'inside' })
      .toBuffer();

    const radius = Math.round(iconSize * 0.15);
    const roundedRectSvg = Buffer.from(
      `<svg><rect x="0" y="0" width="${iconSize}" height="${iconSize}" rx="${radius}" ry="${radius}"/></svg>`
    );

    const baseSq = await sharp({
      create: {
        width: iconSize,
        height: iconSize,
        channels: 4,
        background: bgColor
      }
    })
    .composite([{ input: sqLogo, gravity: 'center' }])
    .png()
    .toBuffer();

    await sharp(baseSq)
      .composite([{ input: roundedRectSvg, blend: 'dest-in' }])
      .png()
      .toFile(path.join(targetDir, 'ic_launcher.png'));

    // C. Legacy Round Icon
    const roundLogoDim = Math.round(iconSize * 0.65);
    const roundLogo = await sharp(croppedLogoBuffer)
      .resize(roundLogoDim, roundLogoDim, { fit: 'inside' })
      .toBuffer();

    const circleSvg = Buffer.from(
      `<svg><circle cx="${iconSize/2}" cy="${iconSize/2}" r="${iconSize/2}"/></svg>`
    );

    const baseRound = await sharp({
      create: {
        width: iconSize,
        height: iconSize,
        channels: 4,
        background: bgColor
      }
    })
    .composite([{ input: roundLogo, gravity: 'center' }])
    .png()
    .toBuffer();

    await sharp(baseRound)
      .composite([{ input: circleSvg, blend: 'dest-in' }])
      .png()
      .toFile(path.join(targetDir, 'ic_launcher_round.png'));

    console.log(`Generated icons for ${dir}`);
  }

  // 2. Generate Splash Screens
  const splashScreens = [
    { file: 'drawable/splash.png', w: 480, h: 320 },
    { file: 'drawable-port-hdpi/splash.png', w: 480, h: 800 },
    { file: 'drawable-port-mdpi/splash.png', w: 320, h: 480 },
    { file: 'drawable-port-xhdpi/splash.png', w: 720, h: 1280 },
    { file: 'drawable-port-xxhdpi/splash.png', w: 960, h: 1600 },
    { file: 'drawable-port-xxxhdpi/splash.png', w: 1280, h: 1920 },
    { file: 'drawable-land-hdpi/splash.png', w: 800, h: 480 },
    { file: 'drawable-land-mdpi/splash.png', w: 480, h: 320 },
    { file: 'drawable-land-xhdpi/splash.png', w: 1280, h: 720 },
    { file: 'drawable-land-xxhdpi/splash.png', w: 1600, h: 960 },
    { file: 'drawable-land-xxxhdpi/splash.png', w: 1920, h: 1280 },
  ];

  for (const { file, w, h } of splashScreens) {
    const targetFile = path.join(resDir, file);
    const parent = path.dirname(targetFile);
    if (!fs.existsSync(parent)) fs.mkdirSync(parent, { recursive: true });

    const minDim = Math.min(w, h);
    const logoDim = Math.round(minDim * 0.42);

    const splashLogo = await sharp(croppedLogoBuffer)
      .resize(logoDim, logoDim, { fit: 'inside' })
      .toBuffer();

    await sharp({
      create: {
        width: w,
        height: h,
        channels: 4,
        background: bgColor
      }
    })
    .composite([{ input: splashLogo, gravity: 'center' }])
    .png()
    .toFile(targetFile);

    console.log(`Generated splash for ${file}`);
  }

  console.log('All icons and splash screens generated successfully!');
}

generateAll().catch(console.error);
