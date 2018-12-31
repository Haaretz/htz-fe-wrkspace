const fs = require('fs-extra');
const os = require('os');
const chalk = require('chalk');
const inquirer = require('inquirer');
const directory = require('inquirer-select-directory');
const getProjectPath = require('./getProjectPath');
const isValidProjectPath = require('./isValidProjectPath');
const { configDir, rcFilePath, } = require('./consts');

inquirer.registerPrompt('directory', directory);

const asciiLogo = chalk`{cyan.bold

                      :DNMMMMMMMMN$.
              . =NMMMMMMMMMMMMMMMMMMMMD.
            .DMMMMMMMMMMMMMMMMMMMMMMMMMMMN..
          ,MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMD.
        .NMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM8
        NMMMMMMMMNNMMMMMMMMMMMMMNNNNNNNNNNMMMMMMN.
      .NMMMMMMMMM  ..NNMMMMMMMMM.      ..MMMMMMMMM~
      MMMMMMMMMMMN     ,MMMMMMMM~      .:MMMMMMMMMM.
    DMMMMMMMMMMMN        DMMMMMN        MMMMMMMMMMM..
    .MMMMMMMMMMMM7           DMM. 8NNNNNNNMMMMMMMMMMN.
    DMMMMMMMMMMMM.  .            NMMMMMMMMMMMMMMMMMMM
    NMMMMMMMMMMMM   MMM,..        $MMMMMMMMMMMMMMMMMM.
  .NMMMMMMMMMMMM  NMMMMMM~          +MMMMMMMMMMMMMMM.
    DMMMMMMMMMMMMN NMMMMMMMNM..       . DMMMMMMMMMMMM.
    .MMMMMMMMMMMMN .MMMMMMMMMMMN.        .MMMMMMMMMMN
    NMMMMMMMMMMMD   ...  MMMMMMMMN      IMMMMMMMMMM.
    .NMMMMMMMMMM~        MMMMMMMMMMMZ   .MMMMMMMMM$
      .MMMMMMMMMM.        NMMMMMMMMMMMMM, NMMMMMMMD
        NMMMMMMMI..........MMMMMMMMMMMMMMMMMMMMMNI
        8NMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMN.
        . DMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMN..
            .NNMMMMMMMMMMMMMMMMMMMMMMMMMMMN
              ..NMMMMMMMMMMMMMMMMMMMMMM8
                    .INMMMMMMMMMMMND

            H T Z - F R O N T E N D  C L I
}`;

async function createRcFile(overwrite) {
  const hasRcFile = fs.existsSync(rcFilePath);
  const projectPath = hasRcFile && getProjectPath();

  console.log(asciiLogo);

  if (hasRcFile && projectPath && !overwrite) {
    console.log("Looks like you're all configured and ready to go!");
    console.log(
      chalk`To reconfigure "htz", try using {cyan "htz reconfigure"}\n`
    );
    return projectPath;
  }

  if (!hasRcFile) {
    console.log(
      chalk` {cyan.bold HELLO!} Looks like this is the first time you use "htz"\n`,
      "It depends on knowing where your project directory is. Let's configure that.\n",
      chalk`Alternatively, you can use {cyan.bold "htz cwd <command>"} to run commands in the CWD.\n`
    );
  }

  const message = hasRcFile && !projectPath
    ? chalk`{yellow Looks like your config doesn't point to a valid project.\n}`
        + chalk`  {cyan Do you want to overwrite your old config?\n}`
    : hasRcFile && overwrite
      ? chalk`{yellow We are about to overwrite your old config.\n}`
        + chalk`  {cyan Would you like to continue?}`
      : chalk`{yellow We are about to ${
        hasRcFile ? 'overwrite the' : 'create a new'
      } config file in ${rcFilePath}.}\n`
        // consider rephrasing...
        + chalk`  {cyan Would you like to continue?}`;

  const { writeConfigFile, dir, } = await inquirer.prompt([
    {
      type: 'confirm',
      message,
      name: 'writeConfigFile',
      default: true,
    },
    {
      // eslint-disable-next-line no-shadow
      when: ({ writeConfigFile, }) => writeConfigFile,
      type: 'directory',
      name: 'dir',
      message: 'Please select the path to your htz-frontend prject directory',
      basePath: os.homedir(),
    },
  ]);

  if (!writeConfigFile) {
    process.exitCode = 1;
    return undefined;
  }

  if (!isValidProjectPath(dir)) {
    console.clear();
    console.error(
      chalk`\n\n\n\n\n\n  {red.bold O O P S . . .}\n\n  {red The "${dir}" directory doesn't seem to be an {cyan htz-fronend} project}\n`
    );
    process.exit(1);
  }

  try {
    fs.ensureDirSync(configDir);
  }
  catch (err) {
    console.error(`Failed to create ${configDir}\n`);
    throw new Error(err);
  }

  try {
    fs.writeFileSync(rcFilePath, `module.exports = { projectPath: '${dir}', }`);
  }
  catch (err) {
    console.error(`Failed to write the config file to  ${rcFilePath}\n`);
    throw new Error(err);
  }

  console.clear();
  console.log(
    chalk`\n\nA configuration file was written to {cyan "${rcFilePath}"}`
  );
  console.log(
    chalk`You can run {cyan "htz reconfigure"} at any time to run this wizard again`
  );

  return dir;
}

module.exports = createRcFile;
