import { mapArguments, spawnMakensis, spawnMakensisSync } from './util';

interface CompilerOptions {
  // makensis
  define?: Object;
  execute?: Array<string>;
  json?: boolean;
  noCD?: boolean;
  noConfig?: boolean;
  inputCharset?: string;
  outputCharset?: string;
  pause?: boolean;
  ppo?: boolean;
  wine?: boolean;
  safePPO?: boolean;
  strict?: boolean;
  verbose?: number;

  // child_process
  cwd?: string;
  detached?: boolean;
  shell?: string;

  // library
  pathToMakensis?: string;
}

/**
 * Returns usage information for a command, or list all commands
 * @param {string} [command] - an NSIS command
 * @param {Object} options - compiler options
 * @returns {string} - usage description
 */
const cmdHelp = (command: string = '', options: CompilerOptions = {}) => {
  Object.assign(options, { verbose: 0 });

  const p = mapArguments(['-CMDHELP'], options);

  if (typeof command !== 'undefined' && typeof command !== 'object' && command !== '') {
    p.args.push(command);
  } else {
    p.opts = options;
  }

  return spawnMakensis(p.cmd, p.args, p.opts);
};

/**
 * Returns usage information for a command, or list all commands
 * @param {string} [command] - an NSIS command
 * @param {Object} options - compiler options
 * @returns {string} - usage description
 */
const cmdHelpSync = (command: string = '', options: CompilerOptions = {}) => {
  Object.assign(options, { verbose: 0 });

  const p = mapArguments(['-CMDHELP'], options);

  if (typeof command !== 'undefined' && typeof command !== 'object' && command !== '') {
    p.args.push(command);
  }

  return spawnMakensisSync(p.cmd, p.args, p.opts);
};

/**
 * Returns information about which options were used to compile MakeNSIS
 * @param {Object} options - compiler options
 * @returns {string} - compiler options
 */
const hdrInfo =  (options: CompilerOptions = {}) => {
  Object.assign(options, { verbose: 0 });

  const p = mapArguments(['-HDRINFO'], options);

  return spawnMakensis(p.cmd, p.args, p.opts);
};

/**
 * Returns information about which options were used to compile MakeNSIS
 * @returns {string} - compiler options
 */
const hdrInfoSync = (options: CompilerOptions = {}) => {
  Object.assign(options, { verbose: 0 });

  let p = mapArguments(['-HDRINFO'], options);

  return spawnMakensisSync(p.cmd, p.args, p.opts);
};

/**
 * Compile specified script with MakeNSIS
 * @param {string} script - path to NSIS script
 * @param {Object} options - compiler options
 */
const compile = (script: string, options: CompilerOptions = {}) => {
  Object.assign(options, {});

  options.verbose = 0;

  const p = mapArguments([], options);

  if (script) {
    if (p.cmd === 'wine') {
      p.args.push('--');
    }
    p.args.push(script);
  }

  return spawnMakensis(p.cmd, p.args, p.opts);
};

/**
 * Compile specified script with MakeNSIS
 * @param {string} script - path to NSIS script
 * @param {Object} options - compiler options
 */
const compileSync = (script: string, options: CompilerOptions = {}) => {
  Object.assign(options, {});

  options.verbose = 0;

  let p = mapArguments([], options);

  if (script) {
    if (p.cmd === 'wine') {
      p.args.push('--');
    }
    p.args.push(script);
  }

  return spawnMakensisSync(p.cmd, p.args, p.opts);
};

/**
 * Returns version of MakeNSIS
 * @param {Object} options - compiler options
 * @returns {string} - compiler version
 */
const version = (options: CompilerOptions = { verbose: 0 }) => {
  Object.assign(options, {});

  options.verbose = 0;

  const p = mapArguments(['-VERSION'], options);

  return spawnMakensis(p.cmd, p.args, p.opts);
};

/**
 * Returns version of MakeNSIS
 * @param {Object} options - compiler options
 * @returns {string} - compiler version
 */
const versionSync = (options: CompilerOptions = { verbose: 0 }) => {
  Object.assign(options, {});

  options.verbose = 0;

  const p = mapArguments(['-VERSION'], options);

  return spawnMakensisSync(p.cmd, p.args, p.opts);
};

 export {
   cmdHelp,
   cmdHelpSync,
   compile,
   compileSync,
   hdrInfo,
   hdrInfoSync,
   version,
   versionSync
 };
