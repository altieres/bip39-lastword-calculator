## Minimalist last word calculator for bip39 mnemonics

Easy to check: zero dependencies, just needed functions.

For example, run:

```
node calculate.js word1 word2 ... word23
```

And you receive:

```
Last word: word24
```

## How to use on Tails:

Tails already came with git and node installed.

1. Boot with Persistent storage and WiFi enabled
2. Clone this repo inside Persistent folder

```
cd Persistent
git clone https://github.com/altieres/bip39-lastword-calculator.git
```

3. Reboot with Persistent storage enabled, disable Networking
4. Generate the 24st word

```
cd Persistent
node calculate.js word1 word2 ... word23
```

### Inspired by:

https://github.com/merland/seedpicker

### /bip39/ functions copied from (Core reference library):

https://github.com/bitcoinjs/bip39

### /sha.js/ functions copied from:

https://github.com/crypto-browserify/sha.js
