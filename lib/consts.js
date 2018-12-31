const path = require('path');
const os = require('os');

const configDir = path.join(os.homedir(), '.config', 'htz');
const rcFilePath = path.join(configDir, '.htzrc.js');

module.exports = {
  configDir,
  rcFilePath,
};
