import { spawn, spawnSync } from 'child_process';
import { platform } from 'os';

const mapArguments = (args, options) => {
  let cmd: string = (typeof options.pathToMakensis !== 'undefined' && options.pathToMakensis !== '') ? options.pathToMakensis : 'makensis';

  let p = {
    cmd: cmd,
    args: args,
    opts: options
  };

  if (platform() !== 'win32' && options.wine === true) {
    p.cmd = 'wine';
    p.args.unshift(cmd);
  }

  if (typeof options.cwd !== 'undefined' && options.cwd !== '') {
    p.opts.cwd = options.cwd;
  }

  if (typeof options.detached !== 'undefined') {
    p.opts.detached = options.detached;
  }

  if (typeof options.shell !== 'undefined' && options.shell !== '') {
    p.opts.shell = options.shell;
  }

  // return unless compile command
  if (args.length > 1 || args[0] === '-CMDHELP') {
    return p;
  }

  if (typeof options.define !== 'undefined') {
    Object.keys(options.define).forEach((key) => {
      p.args.push(`-D${key}=${options.define[key]}`);
    });
  }

  if (typeof options.execute !== 'undefined') {
    options.execute.forEach((key) => {
      p.args.push(`-X${key}`);
    });
  }

  if (options.nocd === true || options.noCD === true) {
    p.args.push('-NOCD');
  }

  if (options.noconfig === true || options.noConfig === true) {
    p.args.push('-NOCONFIG');
  }

  if (options.pause === true) {
    p.args.push('-PAUSE');
  }

  if (options.strict === true || options.wx === true) {
    p.args.push('-WX');
  }

  if ((typeof options.inputcharset !== 'undefined' && options.inputcharset !== '') || (typeof options.inputCharset !== 'undefined' && options.inputCharset !== '')) {
    p.args.push('-INPUTCHARSET', options.inputcharset);
  }

  if ((typeof options.outputcharset !== 'undefined' && options.outputcharset !== '') || (typeof options.outputCharset !== 'undefined' && options.outputCharset !== '')) {
    p.args.push('-OUTPUTCHARSET', options.outputcharset);
  }

  if (options.ppo === true || options.PPO === true) {
    p.args.push('-PPO');
  }

  if (options.safeppo === true || options.safePPO === true) {
    p.args.push('-SAFEPPO');
  }

  if (Number.isInteger(options.verbose) && options.verbose >= 0 && options.verbose <= 4) {
    p.args.push('-V' + options.verbose);
  }

  return p;
};

const stringify = (data) => {
  return data.toString().trim();
};

const isInteger = (x) => {
  return x % 2 === 0;
};

const objectify = (input, key = null) => {
  let output = {};

  if (key === 'version' && input.startsWith('v')) {
    input = input.substr(1);
  }

  if (key === null) {
    output = input;
  } else {
    output[key] = input;
  }

  return output;
};

const objectifyFlags = (input: string): any => {
  let lines = input.split('\n');

  let filteredLines = lines.filter((line) => {
    if (line !== '') {
      return line;
    }
  });

  let output = {};
  let tableSizes = {};
  let tableSymbols = {};
  let symbols;

  // Split sizes
  filteredLines.forEach((line) => {
    let obj = {};

    if (line.startsWith('Size of ')) {
      let pair = line.split(' is ');

      pair[0] = pair[0].replace('Size of ', '');
      pair[0] = pair[0].replace(' ', '_');
      pair[1] = pair[1].slice(0, -1);

      tableSizes[pair[0]] = pair[1];
    } else if (line.startsWith('Defined symbols: ')) {
      symbols = line.replace('Defined symbols: ', '').split(',');
    }
  });

  let objSizes = {};
  output['sizes'] = tableSizes;

  // Split symbols
  symbols.forEach((symbol) => {
    let pair = symbol.split('=');
    let obj = {};

    if (pair.length > 1 && pair[0] !== 'undefined') {
      if (isInteger(pair[1]) === true) {
        pair[1] = parseInt(pair[1], 10);
      }

      tableSymbols[pair[0]] = pair[1];
    } else {
      tableSymbols[symbol] = true;
    }
  });

  output['defined_symbols'] = tableSymbols;

  return output;
};

const spawnMakensis = (cmd: string, args: Array<string>, opts: Object) => {
  return new Promise<Object>((resolve, reject) => {
    let stdOut: any = '';
    let stdErr: string = '';

    const child: any = spawn(cmd, args, opts);

    child.stdout.on('data', (data) => {
      stdOut += stringify(data);
    });

    child.stderr.on('data', (data) => {
      stdErr += stringify(data);
    });

    child.on('close', (code) => {
      if (opts.json === true) {
        switch (args[0]) {
          case '-HDRINFO':
            stdOut = objectifyFlags(stdOut);
            break;
          case '-VERSION':
            stdOut = objectify(stdOut, 'version');
            break;
        }
      }

      let output: Object = {
        'status': code,
        'stdout': stdOut,
        'stderr': stdErr
      };

      if (code === 0) {
        resolve(output);
      } else {
        reject(output);
      }
    });
  });
};

const spawnMakensisSync = (cmd: string, args: Array<string>, opts: Object) => {
  const child: any = spawnSync(cmd, args, opts);

  let output: Object = {
    'status': child.status,
    'stdout': stringify(child.stdout),
    'stderr': stringify(child.stderr)
  };

  return output;
};

export { mapArguments, spawnMakensis, spawnMakensisSync };
