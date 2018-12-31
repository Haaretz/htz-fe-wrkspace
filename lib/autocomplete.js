const fs = require('fs-extra');
const path = require('path');
const omelette = require('omelette');
const readdirSync = require('readdir-enhanced').sync;
const createRcFile = require('./createRcFile');
const getProjectPath = require('./getProjectPath');
const getShellInitFile = require('./getShellInitFile');

async function autocomplete() {
  // eslint-disable-next-line quotes
  const completion = omelette(`htz <1st> <2nd> <3rd> <4th>`);

  completion.on('1st', ({ reply, }) => {
    const projectPath = getProjectPath();
    return reply([
      'cwd',
      ...(projectPath
        ? [
          ...getPackagesInPath(projectPath),
          'add',
          'remove',
          'run',
          'reconfigure',
        ]
        : [ '--setup', ]),
    ]);
  });

  completion.on('2nd', ({ reply, line, }) => {
    // Using line to implement before because of
    // https://github.com/f/omelette/issues/10
    const before = line.split(' ')[1];
    const projectPath = getProjectPath();
    if (before === 'cwd') {
      return reply([
        ...getPackagesInPath(process.cwd()),
        'add',
        'remove',
        'run',
      ]);
    }

    const packages = getPackages(projectPath);
    if (before in packages) {
      return reply([
        ...(packages[before].scripts || []),
        'add',
        'remove',
        'run',
      ]);
    }

    return undefined;
  });

  completion.on('3rd', ({ reply, line, }) => {
    // Using line to implement before because of
    // https://github.com/f/omelette/issues/10
    const [ , firstArg, before, ] = line.split(' ');
    if (firstArg === 'cwd') {
      const pkgs = getPackages(process.cwd());
      if (before in pkgs) {
        return reply([ ...(pkgs[before].scripts || []), 'add', 'remove', 'run', ]);
      }

      return undefined;
    }

    if (before === 'remove') {
      const projectPath = getProjectPath();
      const pkgs = getPackages(projectPath);
      const pkg = firstArg;
      return reply(pkgs[pkg].dependencies);
    }

    return undefined;
  });

  completion.on('4th', ({ reply, line, }) => {
    // Using line to implement before because of
    // https://github.com/f/omelette/issues/10
    const [ , firstArg, pkg, before, ] = line.split(' ');
    if (before === 'remove' && firstArg === 'cwd') {
      const pkgs = getPackages(process.cwd());
      return reply(pkgs[pkg].dependencies);
    }

    return undefined;
  });

  completion.init();

  if (process.argv[2] === '--setup') {
    try {
      const shellInitFile = getShellInitFile();
      const hasCompletions = fs
        .readFileSync(shellInitFile, { encoding: 'utf8', })
        .includes('# begin htz completion');

      if (!hasCompletions) completion.setupShellInitFile();

      await createRcFile(true);
    }
    catch (err) {
      console.error('Could not install completions');
      console.error(err);
      process.exitCode = 1;
    }
  }
}

module.exports = autocomplete;

// /////////////////////////////////////////////////////////////////////
//                               UTILS                                //
// /////////////////////////////////////////////////////////////////////

function getPackages(projectPath) {
  return getPackagePaths(projectPath).reduce(pkgInfoReducer);
}

function getPackagePaths(projectPath) {
  const isPathExists = fs.existsSync(projectPath);
  if (!isPathExists) {
    console.error(`${projectPath} does not exist`);
    process.exitCode = 1;
  }

  const isValidPath = fs.existsSync(path.join(projectPath, 'packages'));
  if (!isValidPath) {
    console.error(`${projectPath} does not have a "packages" dir`);
    process.exitCode = 1;
  }

  if (projectPath !== process.cwd()) process.chdir(projectPath);
  return (
    readdirSync('packages', { deep: 1, })
      // Filter out only package (second level) dirs
      .filter(dir => dir.includes(path.sep))
  );
}

function getPackageNamesFromPaths(pkgPaths) {
  return pkgPaths.map(getPackageNameFromPath);
}

function getPackagesInPath(pkgsPath) {
  return getPackageNamesFromPaths(getPackagePaths(pkgsPath));
}

function getPackageNameFromPath(pkgPath) {
  return pkgPath.slice(pkgPath.indexOf(path.sep) + 1);
}

function pkgInfoReducer(map, pkgPath) {
  const pkgJsonPath = path.join(
    process.cwd(),
    'packages',
    pkgPath,
    'package.json'
  );
  const hasPkgJson = fs.existsSync(pkgJsonPath);
  const {
    scripts = {},
    dependencies = {},
    devDependncies = {},
    peerDependencies = {},
  } = hasPkgJson ? require(require.resolve(pkgJsonPath)) : {};

  const pkgName = getPackageNameFromPath(pkgPath);
  const keys = Object.keys;

  return {
    ...map,
    [pkgName]: {
      scripts: Object.keys(scripts),
      dependencies: [
        ...keys(peerDependencies),
        ...keys(devDependncies),
        ...keys(dependencies),
      ],
      path: pkgPath,
      pkgWithScope: `@haaretz/${pkgName}`,
    },
  };
}
