const fs = require('fs');

const buf = fs.readFileSync('scripts/decompressed_blob_c.bin');

class V8Reader {
  constructor(buffer, offset = 0) {
    this.buf = buffer;
    this.pos = offset;
  }

  readVarint() {
    let res = 0;
    let shift = 0;
    while (this.pos < this.buf.length) {
      const b = this.buf[this.pos++];
      res |= (b & 0x7f) << shift;
      if ((b & 0x80) === 0) break;
      shift += 7;
    }
    return res;
  }

  readZigZag() {
    const n = this.readVarint();
    return (n >>> 1) ^ (-(n & 1));
  }

  readString() {
    const len = this.readVarint();
    const str = this.buf.toString('latin1', this.pos, this.pos + len);
    this.pos += len;
    return str;
  }

  readTwoByteString() {
    const lenInBytes = this.readVarint();
    const str = this.buf.toString('utf16le', this.pos, this.pos + lenInBytes);
    this.pos += lenInBytes;
    return str;
  }

  readValue() {
    if (this.pos >= this.buf.length) return null;
    const tag = this.buf[this.pos++];
    switch (tag) {
      case 0x22: // '"' One-byte string
        return this.readString();
      case 0x63: // 'c' Two-byte string
        return this.readTwoByteString();
      case 0x49: // 'I' Int32 zigzag
        return this.readZigZag();
      case 0x4e: // 'N' Float64
        const val = this.buf.readDoubleLE(this.pos);
        this.pos += 8;
        return val;
      case 0x54: // 'T' True
        return true;
      case 0x46: // 'F' False
        return false;
      case 0x30: // '0' Null
        return null;
      case 0x5f: // '_' Undefined
        return undefined;
      case 0x6f: // 'o' Object
        return this.readObject();
      case 0x41: // 'A' Array
        return this.readArray();
      case 0x7b: // '{' End of object
        return undefined;
      default:
        console.warn('Unknown tag 0x' + tag.toString(16) + ' at pos ' + (this.pos - 1));
        return undefined;
    }
  }

  readObject() {
    const obj = {};
    while (this.pos < this.buf.length) {
      const peek = this.buf[this.pos];
      if (peek === 0x7b) { // '{' End of object
        this.pos++;
        break;
      }
      const keyTag = this.buf[this.pos++];
      let key = null;
      if (keyTag === 0x22) {
        key = this.readString();
      } else if (keyTag === 0x63) {
        key = this.readTwoByteString();
      } else if (keyTag === 0x7b) {
        break;
      } else {
        console.warn('Unexpected key tag 0x' + (keyTag ? keyTag.toString(16) : 'null') + ' at pos ' + (this.pos - 1));
        break;
      }
      const val = this.readValue();
      obj[key] = val;
    }
    return obj;
  }

  readArray() {
    const len = this.readVarint();
    const arr = [];
    for (let i = 0; i < len; i++) {
      arr.push(this.readValue());
    }
    return arr;
  }
}

// Find key 'products'
const prodKeyIdx = buf.indexOf(Buffer.from('products'));
console.log('prodKeyIdx:', prodKeyIdx);
const dataIdx = buf.indexOf(Buffer.from('data'), prodKeyIdx);
console.log('dataIdx:', dataIdx);
const arrayTagIdx = dataIdx + 4;
console.log('Tag at arrayTagIdx:', String.fromCharCode(buf[arrayTagIdx]), 'hex:', buf[arrayTagIdx].toString(16));

const reader = new V8Reader(buf, arrayTagIdx);
const products = reader.readValue();
console.log('Parsed products isArray:', Array.isArray(products));
console.log('Total products parsed:', products ? products.length : 0);

if (Array.isArray(products) && products.length > 0) {
  console.log('First product:', JSON.stringify(products[0], null, 2));
  console.log('Sample product 10:', JSON.stringify(products[10], null, 2));
  fs.writeFileSync('scripts/extracted_pwa_products.json', JSON.stringify(products, null, 2));
  console.log('Saved scripts/extracted_pwa_products.json successfully!');
}
