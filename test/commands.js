// Dependencies
import * as makensis from '../dist/makensis';
import { spawnSync } from 'child_process';
import { exists, existsSync } from 'fs';
import { join } from 'path';
import { platform } from 'os';
import test from 'ava';

// Generate script using compiler flags
const nullDevice = (platform() === 'win32') ? 'NUL' : '/dev/null';

const defaultScriptArray = [
  `OutFile ${nullDevice}`,
  `Unicode true`,
  `Section -default`,
  `Nop`,
  `SectionEnd`
];

const defaultScriptString = `
  OutFile ${nullDevice}
  Unicode true
  Section -default
  Nop
  SectionEnd
`;

// Expected values
const cmdHelp = spawnSync('makensis', ['-CMDHELP']).stdout.toString().trim() || spawnSync('makensis', ['-CMDHELP']).stderr.toString().trim();
const hdrInfo = spawnSync('makensis', ['-HDRINFO']).stdout.toString().trim();
const outFile = spawnSync('makensis', ['-CMDHELP', 'OutFile']).stdout.toString().trim() || spawnSync('makensis', ['-CMDHELP', 'OutFile']).stderr.toString().trim();
const license = spawnSync('makensis', ['-LICENSE']).stdout.toString().trim();
const version = spawnSync('makensis', ['-VERSION']).stdout.toString().trim();

// Let's run the tests
test(`MakeNSIS ${version} found in PATH environmental variable`, t => {
  const which = (platform() === 'win32') ? 'where' : 'which';
  const actual = spawnSync(which, ['makensis']).stdout.toString().trim();

  t.not(actual, '');
});

test('Print makensis version', t => {
  const expected = version;
  const actual = makensis.versionSync().stdout;

  t.is(actual, expected);
});

test('Print makensis version as JSON', t => {
  let expected = version;
  let actual = makensis.versionSync({ json: true }).stdout;

  if (expected.startsWith('v')) {
    expected = expected.substr(1);
  }

  actual = JSON.stringify(actual);
  expected = JSON.stringify({ version: expected });

  t.is(actual, expected);
});

test('Print makensis version [async]', async (t) => {
  try {
    const output = await makensis.version();

    const expected = version;
    const actual = output.stdout;

    t.is(actual, expected);
  } catch ({ stderr }) {
    t.fail(stderr);
  }
});

test('Print makensis version as JSON [async]', async (t) => {
  try {
    const output = await makensis.version({ json: true });

    let expected = version;

    if (expected.startsWith('v')) {
      expected = expected.substr(1);
    }

    expected = JSON.stringify({ version: expected });

    let actual = output.stdout;
    actual.version = `${actual.version}`;
    actual = JSON.stringify(actual);

    t.is(actual, expected);

  } catch({ stderr }) {
    t.fail(stderr);
  }
});

test('Print makensis license', t => {
  let expected = license;
  let actual = makensis.licenseSync().stdout;

  t.is(actual, expected);
});

test('Print makensis license as JSON', t => {
  let expected = license;
  let actual = makensis.licenseSync({ json: true }).stdout;

  actual = JSON.stringify(actual);
  expected = JSON.stringify({ license: expected });

  t.is(actual, expected);
});

test('Print makensis license [async]', async (t) => {
  try {
    const output = await makensis.license();

    const expected = license;
    const actual = output.stdout;

    t.is(actual, expected);

  } catch ({ stdout }) {
    // NSIS < 3.03
    t.log('Legacy NSIS');
    const expected = license;
    const actual = stdout;

    t.is(actual, expected);
  }
});

test('Print makensis license as JSON [async]', async (t) => {
  try {
    const output = await makensis.license({ json: true });

    let expected = license;
    expected = JSON.stringify({ license: expected });

    let actual = output.stdout;
    actual.license = `${actual.license}`;
    actual = JSON.stringify(actual);

    t.is(actual, expected);
  } catch (error) {
    // NSIS < 3.03
    t.log('Legacy NSIS');
    let expected = license;
    expected = JSON.stringify({ license: expected });

    let actual = stdout;
    actual.license = `${actual.license}`;
    actual = JSON.stringify(actual);

    t.is(actual, expected);
  }
});

test('Print compiler information', t => {
  const expected = hdrInfo;
  const actual = makensis.hdrInfoSync().stdout;

  t.is(actual, expected);
});

test('Print compiler information as JSON', t => {
  const expected = true;
  const actual = makensis.hdrInfoSync({ json: true }).stdout.defined_symbols.__GLOBAL__;

  t.is(actual, expected);
});

test('Print compiler information [async]', async (t) => {
  try {
    const output = await makensis.hdrInfo();

    const expected = hdrInfo;
    const actual = output.stdout;

    t.is(actual, expected);
  } catch ({ stdout }) {
    // NSIS < 3.03
    t.log('Legacy NSIS');
    const expected = hdrInfo;
    const actual = stdout;

    t.is(actual, expected);
  }
});

test('Print help for all commands', t => {
  const expected = cmdHelp;
  const actual = makensis.cmdHelpSync().stdout;

  t.is(actual, expected);
});

// test('Print help for all commands [async]', async (t) => {
//   return Promise.resolve(makensis.cmdHelp())
//   .then(output => {
//     const expected = cmdHelp;
//     const actual = output.stdout;

//     t.is(actual, expected);
//   })
//   .catch(output => {
//     // NSIS < 3.03
//     t.log('Legacy NSIS');
//     const expected = cmdHelp;
//     const actual = output.stdout;

//     t.is(actual, expected);
//   });
// });

test('Print help for OutFile command', t => {
  const expected = outFile;
  const actual = makensis.cmdHelpSync('OutFile').stdout;

  t.is(actual, expected);
});

test('Print help for OutFile command [async]', async (t) => {
  try {
    const output = await makensis.cmdHelp('OutFile');

    const expected = outFile;
    const actual = output.stdout;

    t.is(actual, expected);
  } catch ({ stdout }) {
    // NSIS < 3.03
    t.log('Legacy NSIS');
    const expected = outFile;
    const actual = stdout;

    t.is(actual, expected);
  }
});

test('Print help for OutFile command as JSON', t => {
  let expected = outFile;
  let actual = makensis.cmdHelpSync('OutFile', { json: true }).stdout;

  actual = JSON.stringify(actual);
  expected = JSON.stringify({'help': expected });

  t.is(actual, expected);
});

test('Compilation from Array', t => {
  const expected = 0;
  const actual = makensis.compileSync(null, { preExecute: defaultScriptArray }).status;

  t.is(actual, expected);
});

test('Compilation from String', t => {
  const expected = 0;
  const actual = makensis.compileSync(null, { preExecute: defaultScriptString }).status;;

  t.is(actual, expected);
});

test('Compilation from Array [async]', async (t) => {
  try {
    const output = await makensis.compile(null, { preExecute: defaultScriptString });

    const expected = 0;
    const actual = output.status;

    t.is(actual, expected);
  } catch ({ stderr }) {
    t.fail(stderr);
  }
});

test('Compilation from String [async]', async (t) => {
  try {
    const output = await makensis.compile(null, { preExecute: defaultScriptString });

    const expected = 0;
    const actual = output.status;

    t.is(actual, expected);
  } catch ({ stderr }) {
    t.fail(stderr);
  }
});

test('Compilation with warning', t => {
  const scriptWithWarning = [...defaultScriptArray, '!warning'];

  const expected = 0;
  const actual = makensis.compileSync(null, { preExecute: scriptWithWarning }).status;

  t.is(actual, expected);
});

test('Compilation with warning as JSON', t => {
  const expected = 1;
  const scriptWithWarning = [...defaultScriptArray, '!warning'];
  const actual = makensis.compileSync(null, { preExecute: scriptWithWarning, json: true }).warnings;

  t.is(actual, expected);
});

test('Compilation with warning [async]', async (t) => {
  const scriptWithWarning = [...defaultScriptArray, '!warning'];

  try {
    const output = await makensis.compile(null, { preExecute: scriptWithWarning });
    const expected = 0;
    const actual = output.status;

    t.is(actual, expected);
  } catch ({ stderr }) {
    t.fail(stderr);
  }
});

test('Compilation with warning as JSON [async]', async (t) => {
  const scriptWithWarning = [...defaultScriptArray, '!warning'];

  try {
    const output = await makensis.compile(null, { preExecute: scriptWithWarning, json: true });

    const expected = 1;
    const actual = output.warnings;

    t.is(actual, expected);
  } catch ({ stderr }) {
    t.fail(stderr);
  }
});

test('Compilation with error', t => {
  const scriptWithError = [...defaultScriptArray, '!error'];

  const expected = 0;
  const actual = makensis.compileSync(null, { preExecute: scriptWithError}).status;

  t.not(actual, expected);
});

test('Compilation with error [async]', async (t) => {
  let scriptWithError = [...defaultScriptArray, '!error'];

  try {
    const output = await makensis.compile(null, { preExecute: scriptWithError});

    const expected = 0;
    const actual = output.status;

    t.not(actual, expected);
  } catch ({ stderr }) {
    t.fail(stderr);
  }
});

test('Strict compilation with warning', t => {
  const scriptWithWarning = [...defaultScriptArray, '!warning'];

  const expected = 0;
  const actual = makensis.compileSync(null, { preExecute: scriptWithWarning, strict: true }).status;

  t.not(actual, expected);
});

test('Strict compilation with warning [async]', async (t) => {
  const scriptWithWarning = [...defaultScriptArray, '!warning'];

  try {
    const output = await makensis.compile(null, { preExecute: scriptWithWarning, strict: true });

    const expected = 0;
    const actual = output.status;

    t.not(actual, expected)
  } catch ({ stderr }) {
    t.fail(stderr);
  }
});

test('Print ${NSISDIR}', t => {
  const nsisDir = makensis.nsisDirSync();
  const nsisCfg = join(nsisDir, 'Include', 'MUI2.nsh');

  const expected = true;
  const actual = existsSync(nsisCfg);

  t.is(actual, expected);
});

test('Print ${NSISDIR} [async]', async (t) => {

  try {
    const nsisDir = await makensis.nsisDir();
    const nsisCfg = join(nsisDir, 'Include', 'MUI2.nsh');

    const expected = true;
    const actual = existsSync(nsisCfg);

    t.is(actual, expected)
  } catch ({ stderr }) {
    t.fail(stderr);
  }


});

test('Print ${NSISDIR} as JSON', t => {
  const nsisDir = makensis.nsisDirSync({ json: true }).nsisdir;
  const nsisCfg = join(nsisDir, 'Include', 'MUI2.nsh');

  const expected = true;
  const actual = existsSync(nsisCfg);

  t.is(actual, expected);
});

test('Print ${NSISDIR} as JSON [async]', async (t) => {
  try {
    const nsisDir = await makensis.nsisDir({ json: true });
    const nsisCfg = join(nsisDir.nsisdir, 'Include', 'MUI2.nsh');

    const expected = true;
    const actual = existsSync(nsisCfg);

    t.is(actual, expected)
  } catch ({ stderr }) {
    t.fail(stderr);
  }
});
