const fs = require('fs');
const path = require('path');

function isValidProjectPath(projectPath) {
  return !!(
    projectPath && fs.existsSync(path.join(path.join(projectPath, 'packages')))
  );
}

module.exports = isValidProjectPath;
