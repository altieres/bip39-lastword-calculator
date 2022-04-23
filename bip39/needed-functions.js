const sha256 = require('../sha.js/sha256')

const INVALID_MNEMONIC = 'Invalid mnemonic';
const INVALID_ENTROPY = 'Invalid entropy';
const INVALID_CHECKSUM = 'Invalid mnemonic checksum';
const WORDLIST_REQUIRED = 'A wordlist is required but a default could not be found.\n' +
    'Please pass a 2048 word array explicitly.';

function mnemonicToEntropy(mnemonic, wordlist) {
  wordlist = wordlist || DEFAULT_WORDLIST;
  if (!wordlist) {
      throw new Error(WORDLIST_REQUIRED);
  }
  const words = normalize(mnemonic).split(' ');
  if (words.length % 3 !== 0) {
      throw new Error(INVALID_MNEMONIC);
  }
  // convert word indices to 11 bit binary strings
  const bits = words
      .map((word) => {
      const index = wordlist.indexOf(word);
      if (index === -1) {
          throw new Error(INVALID_MNEMONIC);
      }
      return lpad(index.toString(2), '0', 11);
  })
      .join('');
  // split the binary string into ENT/CS
  const dividerIndex = Math.floor(bits.length / 33) * 32;
  const entropyBits = bits.slice(0, dividerIndex);
  const checksumBits = bits.slice(dividerIndex);
  // calculate the checksum and compare
  const entropyBytes = entropyBits.match(/(.{1,8})/g).map(binaryToByte);
  if (entropyBytes.length < 16) {
      throw new Error(INVALID_ENTROPY);
  }
  if (entropyBytes.length > 32) {
      throw new Error(INVALID_ENTROPY);
  }
  if (entropyBytes.length % 4 !== 0) {
      throw new Error(INVALID_ENTROPY);
  }
  const entropy = Buffer.from(entropyBytes);
  const newChecksum = deriveChecksumBits(entropy);
  if (newChecksum !== checksumBits) {
      throw new Error(INVALID_CHECKSUM);
  }
  return entropy.toString('hex');
}

function normalize(str) {
  return (str || '').normalize('NFKD');
}

function lpad(str, padString, length) {
  while (str.length < length) {
      str = padString + str;
  }
  return str;
}

function binaryToByte(bin) {
  return parseInt(bin, 2);
}

function deriveChecksumBits(entropyBuffer) {
  const ENT = entropyBuffer.length * 8;
  const CS = ENT / 32;
  const hash = (new sha256())
      .update(entropyBuffer)
      .digest();
  return bytesToBinary(Array.from(hash)).slice(0, CS);
}

function bytesToBinary(bytes) {
  return bytes.map((x) => lpad(x.toString(2), '0', 8)).join('');
}

module.exports = mnemonicToEntropy
