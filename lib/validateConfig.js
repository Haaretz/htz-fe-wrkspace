const { rcFilePath, } = require('./consts');
const getProjectPath = require('./getProjectPath');
const createRcFile = require('./createRcFile');

async function validateConfig() {
  const projectPath = getProjectPath();

  if (projectPath) return projectPath;

  await createRcFile(true);
  return require(rcFilePath).projectPath;
}

module.exports = validateConfig;
