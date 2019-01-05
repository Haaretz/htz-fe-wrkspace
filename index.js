#!/usr/bin/env node

const spawn = require('cross-spawn');
// const path = require('path');
const chalk = require('chalk');

const validateConfig = require('./lib/validateConfig');
const createRcFile = require('./lib/createRcFile');
const getProjectPath = require('./lib/getProjectPath');
const autocomplete = require('./lib/autocomplete');

htz();

async function htz() {
  await autocomplete();

  const args = process.argv.slice(2);
  const command = args[0];

  if (!command) {
    const projectPath = await validateConfig();
    process.exitCode = 0;
    return projectPath;
  }
  if (command === '--setup') {
    return undefined;
  }
  // if (command === 'create-config') {
  //   const projectPath = await createRcFile(true);
  //   process.exitCode = 0;
  //   return projectPath;
  // }
  if (command === 'reconfigure') {
    const projectPath = await createRcFile(true);
    process.exitCode = 0;
    return projectPath;
  }
  if (command === 'cwd') {
    const [ , action, ...restArgs ] = args;
    return runTask(action, restArgs, process.cwd());
  }

  const projectPath = getProjectPath();
  if (!projectPath) {
    console.error(
      chalk`{red "htz" requires the project dir to be configured in ~/.config/.htzrc.js}\n`,
      'Alternatively, you can use "htz cwd <command>" to run commands in the CWD.'
    );
    process.exitCode = 1;
  }

  const [ action, ...restArgs ] = args;
  runTask(action, restArgs, projectPath);

  return undefined;
}

function runTask(action, args, cwd) {
  const isGlobalAction = [ 'add', 'remove', 'run', ].includes(action);
  const yarnCmd = isGlobalAction ? 'workspaces' : 'workspace';
  const cmd = isGlobalAction ? action : `@haaretz/${action}`;
  const isWin = process.platform === 'win32';

  const spawnArgs = isWin
    ? [ 'cross-env', [ 'yarn', yarnCmd, cmd, ...args, ], ]
    : [ 'yarn', [ yarnCmd, cmd, ...args, ], ];

  const yarnWorkspace = spawn(...spawnArgs, {
    cwd,
    stdio: 'inherit',
  });

  yarnWorkspace.on('close', code => {
    process.exitCode = code;
  });
}
