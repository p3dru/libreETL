// A fast, synchronous one-way hashing utility for data masking (LGPD)
// This uses a simple combination of FNV-1a and Murmur-like shifting to generate a 64-character hex string,
// simulating a SHA-256 hash output visually and providing basic one-way anonymization without needing async Web Crypto.

export function syncHash(str: string): string {
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  
  // Convert to hex and pad to make it look like a longer hash
  const part1 = (h1 >>> 0).toString(16).padStart(8, '0');
  const part2 = (h2 >>> 0).toString(16).padStart(8, '0');
  const combined = part1 + part2;
  
  // Repeat and mix to simulate a 64-char (256-bit) hash length
  let finalHash = '';
  for(let i = 0; i < 4; i++) {
     finalHash += combined.split('').reverse().join('');
  }
  return finalHash.substring(0, 64);
}
