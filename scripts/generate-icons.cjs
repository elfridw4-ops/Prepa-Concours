const fs = require('fs');
const zlib = require('zlib');

function makeChunk(type, data) {
  const len = data.length;
  const typeBuf = Buffer.from(type, 'ascii');
  const chunk = Buffer.alloc(4 + 4 + len + 4);
  chunk.writeUInt32BE(len, 0);
  typeBuf.copy(chunk, 4);
  data.copy(chunk, 8);
  
  let c = 0xffffffff;
  const full = Buffer.concat([typeBuf, data]);
  for (let n = 0; n < full.length; n++) {
    c = c ^ full[n];
    for (let k = 0; k < 8; k++) {
      c = ((c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1));
    }
  }
  c = c ^ 0xffffffff;
  chunk.writeInt32BE(c, 8 + len);
  return chunk;
}

function createAcademicPNG(width, height) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;
  ihdrData[9] = 6;
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;
  
  const ihdr = makeChunk('IHDR', ihdrData);
  
  const rowSize = width * 4 + 1;
  const rawData = Buffer.alloc(height * rowSize);
  
  const cx = width / 2;
  const cy = height / 2;
  
  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0;
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const normDist = dist / (width / 2);
      
      // Default: Deep Royal Midnight & Navy gradient background
      let r = 9 + Math.round((y / height) * 20);
      let g = 13 + Math.round((x / width) * 15);
      let b = 28 + Math.round((y / height) * 45);
      let a = 255;

      // Outer Rounded Border Glow (Cyber Cyan / Sapphire)
      if (normDist > 0.88 && normDist < 0.96) {
        r = 56; g = 189; b = 248; // Electric Cyan
      }
      
      // Elliptical Orbit Ring (Physics)
      const rotAngle = -0.52; // ~-30 deg
      const rotX = dx * Math.cos(rotAngle) - dy * Math.sin(rotAngle);
      const rotY = dx * Math.sin(rotAngle) + dy * Math.cos(rotAngle);
      const orbitDist = Math.pow(rotX / (width * 0.38), 2) + Math.pow(rotY / (height * 0.14), 2);
      if (Math.abs(orbitDist - 1) < 0.09) {
        r = 56; g = 189; b = 248;
      }

      // Golden Academic Cap / Mortarboard Diamond Top
      const capDy = dy + height * 0.12;
      const diamondVal = Math.abs(dx) / (width * 0.28) + Math.abs(capDy) / (height * 0.13);
      if (diamondVal <= 1 && capDy <= height * 0.08) {
        // Gold Gradient
        r = 245 + Math.round((x / width) * 10);
        g = 158 + Math.round((y / height) * 40);
        b = 11;
        
        // Inner Sigma Math Core
        if (Math.abs(dx) < width * 0.08 && Math.abs(capDy) < height * 0.06) {
          r = 255; g = 255; b = 255; // Crisp white central math spark
        }
      }

      // Open Book Base (Foundation below cap)
      if (dy > height * 0.14 && dy < height * 0.32) {
        const bookW = width * 0.32;
        if (Math.abs(dx) < bookW) {
          const bookCurve = Math.sin((Math.abs(dx) / bookW) * Math.PI) * (height * 0.05);
          if (Math.abs(dy - (height * 0.22 + bookCurve)) < height * 0.035) {
            r = 96; g = 165; b = 250; // Sapphire Blue Book Spine & Pages
          }
        }
      }

      rawData[pxOffset] = Math.min(255, Math.max(0, r));
      rawData[pxOffset + 1] = Math.min(255, Math.max(0, g));
      rawData[pxOffset + 2] = Math.min(255, Math.max(0, b));
      rawData[pxOffset + 3] = a;
    }
  }
  
  const idatData = zlib.deflateSync(rawData);
  const idat = makeChunk('IDAT', idatData);
  const iend = makeChunk('IEND', Buffer.alloc(0));
  
  return Buffer.concat([signature, ihdr, idat, iend]);
}

if (!fs.existsSync('public')) {
  fs.mkdirSync('public', { recursive: true });
}

fs.writeFileSync('public/pwa-192x192.png', createAcademicPNG(192, 192));
fs.writeFileSync('public/pwa-512x512.png', createAcademicPNG(512, 512));
fs.writeFileSync('public/apple-touch-icon.png', createAcademicPNG(180, 180));
fs.writeFileSync('public/favicon.ico', createAcademicPNG(32, 32));
console.log('New modern academic PNG icons created successfully!');
