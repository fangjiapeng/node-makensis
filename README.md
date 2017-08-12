# makensis

[![npm](https://img.shields.io/npm/l/makensis.svg?style=flat-square)](https://www.npmjs.org/package/makensis)
[![npm](https://img.shields.io/npm/v/makensis.svg?style=flat-square)](https://www.npmjs.org/package/makensis)
[![Travis](https://img.shields.io/travis/idleberg/node-makensis.svg?style=flat-square)](https://travis-ci.org/idleberg/node-makensis)
[![David](https://img.shields.io/david/idleberg/node-makensis.svg?style=flat-square)](https://david-dm.org/idleberg/node-makensis)
[![David](https://img.shields.io/david/dev/idleberg/node-makensis.svg?style=flat-square)](https://david-dm.org/idleberg/node-makensis?type=dev)

A Node wrapper for `makensis`, the NSIS compiler

## Installation

`yarn add makensis || npm install makensis`

## Usage

Use ES6 imports or `require()` to include the module:

```js
import * as makensis from 'makensis';
const makensis = require('makensis');
```

Example usage in script:

```js
const options = {
    verbose: 2,
    define: {
        'SPECIAL_BUILD': true
    }
}

// Asynchronous
makensis.compile('/path/to/installer.nsi', options)
.then(output => {
    console.log('Exit code: ' + output.status);
    console.log('Standard output:\n' + output.stdout);
    console.log('Standard error:\n' + output.stderr);
}).catch(output => {
    console.error(output.stderr);
});

// Synchronous
let output = makensis.compileSync('/path/to/installer.nsi', options);
```

### Methods

#### `compile(script, [options])` / `compileSync(script, [options])`

Compile specified script with MakeNSIS.

#### `version()` / `versionSync()`

Returns version of MakeNSIS. Equivalent of the `-VERSION` switch.

#### `hdrinfo()` / `hdrinfoSync()`

Returns information about which options were used to compile MakeNSIS. Equivalent of the `-HDRINFO` switch.

#### `help([command])` / `helpSync([command])`

Returns usage information for a specific command, or a list all commands. Equivalent of the `-HELP` switch.

### Options

#### `verbose: <integer>`

Verbosity where x is 4=all,3=no script,2=no info,1=no warnings,0=none. Equivalent of the `-V` switch.

#### `pause: <boolean>`

Pauses after execution. Equivalent of the `-PAUSE` switch.

#### `nocd: <boolean>`

Disables the current directory change to that of the .nsi file. Equivalent of the `-NOCD` switch.

#### `noconfig: <boolean>`

Disables inclusion of `<path to makensis.exe>/nsisconf.nsh`. Equivalent of the `-NOCONFIG` switch.

#### `inputcharset: <string>`

allows you to specify a specific codepage for files without a BOM (`ACP|OEM|CP#|UTF8|UTF16<LE|BE>`). Equivalent of the `-INPUTCHARSET` switch.

#### `outputcharset: <string>`

Allows you to specify the codepage used by stdout when the output is redirected (`ACP|OEM|CP#|UTF8[SIG]|UTF16<LE|BE>[BOM]`). Equivalent of the `-OUTPUTCHARSET` switch.

#### `strict: <boolean>`

Treat warnings as errors. Equivalent of the `-WX` switch.

#### `ppo: <boolean>` / `safeppo: <boolean>`

Will only run the preprocessor and print the result to stdout. The safe version will not execute instructions like [`!appendfile`](https://github.com/NSIS-Dev/Documentation/blob/master/Reference/!appendfile.md) or [`!system`](https://github.com/NSIS-Dev/Documentation/blob/master/Reference/!system.md). [`!packhdr`](https://github.com/NSIS-Dev/Documentation/blob/master/Reference/!packhdr.md) and [`!finalize`](https://github.com/NSIS-Dev/Documentation/blob/master/Reference/!finalize.md) are never executed. Equivalent of the `-PPO` / `SAFEPPO` switches.

#### `define: <Object>`

Defines symbols for the script [to value]. Equivalent of the `-D` switch.

**Example:**

```js
define: {
    "SPECIAL_BUILD": true,
    "LANGUAGE": "English"
}
```

#### `execute: <Array>`

Executes script-commands in the script, parameters are processed by order. Equivalent of the `-X` switch

**Example:**

```js
execute: [
    "SetCompressor lzma",
    "SetCompressorDictSize 16"
]
```

## License

This work is licensed under [The MIT License](https://opensource.org/licenses/MIT)

## Donate

You are welcome support this project using [Flattr](https://flattr.com/submit/auto?user_id=idleberg&url=https://github.com/idleberg/node-makensis) or Bitcoin `17CXJuPsmhuTzFV2k4RKYwpEHVjskJktRd`