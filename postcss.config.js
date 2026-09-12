const path = require('node:path');

module.exports = {
  plugins: {
    '@tailwindcss/postcss': {
      base: path.join(__dirname, 'app'),
    },
  },
};
