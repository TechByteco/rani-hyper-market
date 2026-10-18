const fs = require('fs');

const blob = fs.readFileSync('C:\\Users\\saali\\AppData\\Local\\Google\\Chrome\\User Data\\Profile 8\\IndexedDB\\https_rani-hyper-market.vercel.app_0.indexeddb.blob\\1\\00\\8');

// Find start of Array (0x41) after "data"
const dataStrPos = blob.indexOf(Buffer.from('data\x41'));
if (dataStrPos === -1) {
  console.error('Could not find data array start');
  process.exit(1);
}

let offset = dataStrPos + 4; // points to 0x41
console.log('Array start byte:', blob[offset].toString(16)); // should be 41
offset++; // skip 41

function readVarint() {
  let res = 0;
  let shift = 0;
  while (offset < blob.length) {
    const b = blob[offset++];
    res |= (b & 0x7f) << shift;
    if ((b & 0x80) === 0) break;
    shift += 7;
  }
  return res;
}

function readZigzag() {
  const n = readVarint();
  return (n >>> 1) ^ (-(n & 1));
}

const arrayLen = readVarint();
console.log('Array length decoded:', arrayLen);

// String / Object reference table
const objectTable = [];

function readString(tag) {
  if (tag === 0x22) { // kOneByteString
    const len = readVarint();
    const str = blob.slice(offset, offset + len).toString('latin1');
    offset += len;
    objectTable.push(str);
    return str;
  } else if (tag === 0x63) { // kTwoByteString
    const byteLen = readVarint() * 2;
    const str = blob.slice(offset, offset + byteLen).toString('utf16le');
    offset += byteLen;
    objectTable.push(str);
    return str;
  } else if (tag === 0x3e) { // kConsString
    // ConsString has two parts
    const left = readValue();
    const right = readValue();
    const str = String(left) + String(right);
    objectTable.push(str);
    return str;
  }
  throw new Error('Unknown string tag: 0x' + tag.toString(16));
}

function readValue() {
  if (offset >= blob.length) return null;
  const tag = blob[offset++];

  if (tag === 0x22 || tag === 0x63 || tag === 0x3e) {
    return readString(tag);
  } else if (tag === 0x49) { // kInt32 (zigzag)
    return readZigzag();
  } else if (tag === 0x55) { // kUint32
    return readVarint();
  } else if (tag === 0x4e) { // kDouble
    const val = blob.readDoubleLE(offset);
    offset += 8;
    return val;
  } else if (tag === 0x54) { // kTrue
    return true;
  } else if (tag === 0x46) { // kFalse
    return false;
  } else if (tag === 0x30) { // kNull
    return null;
  } else if (tag === 0x5f) { // kUndefined
    return undefined;
  } else if (tag === 0x6f) { // kBeginJSObject
    const obj = {};
    const objIdx = objectTable.length;
    objectTable.push(obj);

    while (offset < blob.length) {
      if (blob[offset] === 0x7b) { // kEndJSObject
        offset++;
        const numProps = readVarint();
        break;
      }
      const key = readValue();
      const val = readValue();
      obj[key] = val;
    }
    return obj;
  } else if (tag === 0x5e || tag === 0xfe || tag === 0x52) { // Reference
    // In V8, object reference index is a varint
    const refIdx = readVarint();
    return objectTable[refIdx] !== undefined ? objectTable[refIdx] : `[REF_${refIdx}]`;
  } else {
    // If we encounter a tag we don't know, log and return tag
    // console.log('Unknown tag: 0x' + tag.toString(16), 'at offset', offset - 1);
    return null;
  }
}

const products = [];
for (let i = 0; i < arrayLen && offset < blob.length; i++) {
  try {
    const item = readValue();
    if (item && typeof item === 'object') {
      products.push(item);
    }
  } catch(e) {
    console.error('Error reading item #' + i, e.message);
    break;
  }
}

console.log(`Successfully parsed ${products.length} products!`);
if (products.length > 0) {
  console.log('Sample item #0:', products[0]);
  console.log('Sample item #1:', products[1]);
  console.log('Sample item #2:', products[2]);
  
  fs.writeFileSync('scripts/parsed_blob8_products.json', JSON.stringify(products, null, 2));
  console.log('Wrote scripts/parsed_blob8_products.json');
}
