const fs = require('fs');

function decompressSnappy(buf) {
  let pos = 0;
  // Read varint uncompressed length
  let uncompressedLen = 0;
  let shift = 0;
  while (pos < buf.length) {
    const b = buf[pos++];
    uncompressedLen |= (b & 0x7f) << shift;
    if ((b & 0x80) === 0) break;
    shift += 7;
  }

  const out = Buffer.alloc(uncompressedLen);
  let outPos = 0;

  while (pos < buf.length && outPos < uncompressedLen) {
    const tag = buf[pos++];
    const element = tag & 0x03;
    if (element === 0) {
      // Literal
      let len = tag >> 2;
      if (len < 60) {
        len += 1;
      } else if (len === 60) {
        len = buf[pos++] + 1;
      } else if (len === 61) {
        len = buf.readUInt16LE(pos) + 1;
        pos += 2;
      } else if (len === 62) {
        len = buf.readUIntLE(pos, 3) + 1;
        pos += 3;
      } else if (len === 63) {
        len = buf.readUInt32LE(pos) + 1;
        pos += 4;
      }
      buf.copy(out, outPos, pos, pos + len);
      pos += len;
      outPos += len;
    } else if (element === 1) {
      // Copy 1-byte offset
      const len = ((tag >> 2) & 0x07) + 4;
      const offset = ((tag >> 5) << 8) | buf[pos++];
      for (let i = 0; i < len; i++) {
        out[outPos] = out[outPos - offset];
        outPos++;
      }
    } else if (element === 2) {
      // Copy 2-byte offset
      const len = (tag >> 2) + 1;
      const offset = buf.readUInt16LE(pos);
      pos += 2;
      for (let i = 0; i < len; i++) {
        out[outPos] = out[outPos - offset];
        outPos++;
      }
    } else if (element === 3) {
      // Copy 4-byte offset
      const len = (tag >> 2) + 1;
      const offset = buf.readUInt32LE(pos);
      pos += 4;
      for (let i = 0; i < len; i++) {
        out[outPos] = out[outPos - offset];
        outPos++;
      }
    }
  }
  return out.slice(0, outPos);
}

// In LevelDB SSTable format (.ldb):
// File is divided into blocks (usually 4KB).
// Each block ends with 1-byte compression type (0 = none, 1 = snappy) + 4-byte CRC32.
function scanLdbFile(filePath) {
  const b = fs.readFileSync(filePath);
  console.log('Scanning', filePath, 'size:', b.length);
  
  // Try decompressing at various positions where snappy headers might exist
  let foundStrings = [];
  for (let i = 0; i < b.length - 20; i++) {
    // If snappy block starts here:
    try {
      const dec = decompressSnappy(b.slice(i));
      if (dec.length > 50) {
        const s = dec.toString('latin1');
        if (s.includes('nsn_custom_images') || s.includes('rani') || s.includes('image_url')) {
          foundStrings.push({ offset: i, decLen: dec.length, text: s });
          i += 200; // skip ahead
        }
      }
    } catch(e) {}
  }
  return foundStrings;
}

const res = scanLdbFile('C:\\Users\\saali\\AppData\\Local\\Google\\Chrome\\User Data\\Profile 8\\Local Storage\\leveldb\\001004.ldb');
console.log('Found decompressed blocks with targets:', res.length);
res.forEach(r => {
  console.log('--- Block at offset', r.offset, 'decompressed len:', r.decLen, '---');
  console.log(r.text.slice(0, 500));
});
