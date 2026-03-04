const sharp = require('sharp');
const path = require('path');

const input = path.join(__dirname, '..', 'public', 'Rouki.png');
const out192 = path.join(__dirname, '..', 'public', 'icon-192.png');
const out512 = path.join(__dirname, '..', 'public', 'icon-512.png');
const outApple = path.join(__dirname, '..', 'public', 'apple-touch-icon.png');

async function run() {
  try {
    await sharp(input).resize(192, 192, { fit: 'cover' }).png().toFile(out192);
    await sharp(input).resize(512, 512, { fit: 'cover' }).png().toFile(out512);
    await sharp(input).resize(180, 180, { fit: 'cover' }).png().toFile(outApple);
    console.log('Icons written:', out192, out512, outApple);
  } catch (err) {
    console.error('Error resizing icons:', err);
    process.exit(1);
  }
}

run();
