const fs = require('fs-extra');
const os = require('os');
const path = require('path');

const SHELL = process.env.SHELL;
const shellName = SHELL.slice(SHELL.lastIndexOf(path.sep) + 1);
const homedir = os.homedir();

const initFiles = { bash: '.bash_profile', fish: 'config.fish', zsh: '.zshrc', };

function getShellInitFile() {
  const file = initFiles[shellName];
  const isFish = shellName === 'fish';
  const configDir = getConfDir(shellName);
  const hasConfigDir = fs.existsSync(configDir);

  if (isFish && !hasConfigDir) fs.ensureDir(configDir);

  const atConfig = path.join(configDir, file);
  const atHome = path.join(homedir, file);

  return hasConfigDir ? atConfig : atHome;
}

module.exports = getShellInitFile;

function getConfDir(shell) {
  return path.join(homedir, '.config', shell);
}
