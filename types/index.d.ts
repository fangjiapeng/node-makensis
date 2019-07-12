interface CompilerOptions {
  // makensis
  define?: Object;
  inputCharset?: string;
  json?: boolean;
  noCD?: boolean;
  noConfig?: boolean;
  outputCharset?: string;
  pause?: boolean;
  postExecute?: Array<string>;
  preExecute?: Array<string>;
  priority?: number;
  ppo?: boolean;
  safePPO?: boolean;
  strict?: boolean;
  verbose?: number;
  wine?: boolean;

  // library
  pathToMakensis?: string;
}
