const { rcFilePath, } = require('./consts');
const isValidProjectPath = require('./isValidProjectPath');

function getProjectPath(path) {
  const { projectPath, } = getConfig(rcFilePath) || {};
  return isValidProjectPath(projectPath) ? projectPath : undefined;
}

function getConfig(filePath) {
  try {
    return require(filePath);
  }
  catch (err) {
    return undefined;
  }
}

module.exports = getProjectPath;
