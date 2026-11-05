// This code implements the `-sMODULARIZE` settings by taking the generated
// JS program code (INNER_JS_CODE) and wrapping it in a factory function.

// Single threaded MINIMAL_RUNTIME programs do not need access to
// document.currentScript, so a simple export declaration is enough.
var Rexcomp = (() => {
  // When MODULARIZE this JS may be executed later,
  // after document.currentScript is gone, so we save it.
  // In EXPORT_ES6 mode we can just use 'import.meta.url'.
  var _scriptName = globalThis.document?.currentScript?.src;
  return async function(moduleArg = {}) {
    var moduleRtn;

// include: shell.js
// include: minimum_runtime_check.js
// end include: minimum_runtime_check.js
// The Module object: Our interface to the outside world. We import
// and export values on it. There are various ways Module can be used:
// 1. Not defined. We create it here
// 2. A function parameter, function(moduleArg) => Promise<Module>
// 3. pre-run appended it, var Module = {}; ..generated code..
// 4. External script tag defines var Module.
// We need to check if Module already exists (e.g. case 3 above).
// Substitution will be replaced with actual code on later stage of the build,
// this way Closure Compiler will not mangle it (e.g. case 4. above).
// Note that if you want to run closure, and also to use Module
// after the generated code, you will need to define   var Module = {};
// before the code. Then that object will be used in the code, and you
// can continue to use Module afterwards as well.
var Module = moduleArg;

// Determine the runtime environment we are in. You can customize this by
// setting the ENVIRONMENT setting at compile time (see settings.js).
var ENVIRONMENT_IS_WEB = true;

var ENVIRONMENT_IS_WORKER = false;

var ENVIRONMENT_IS_NODE = false;

var ENVIRONMENT_IS_SHELL = false;

// --pre-jses are emitted after the Module integration code, so that they can
// refer to Module (if they choose; they can also define Module)
var arguments_ = [];

var thisProgram = "./this.program";

var quit_ = (status, toThrow) => {
  throw toThrow;
};

// `/` should be present at the end if `scriptDirectory` is not empty
var scriptDirectory = "";

function locateFile(path) {
  if (Module["locateFile"]) {
    return Module["locateFile"](path, scriptDirectory);
  }
  return scriptDirectory + path;
}

// Hooks that are implemented differently in different runtime environments.
var readAsync, readBinary;

// Note that this includes Node.js workers when relevant (pthreads is enabled).
// Node.js workers are detected as a combination of ENVIRONMENT_IS_WORKER and
// ENVIRONMENT_IS_NODE.
if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
  try {
    scriptDirectory = new URL(".", _scriptName).href;
  } catch {}
  {
    // include: web_or_worker_shell_read.js
    readAsync = async url => {
      var response = await fetch(url, {
        credentials: "same-origin"
      });
      if (response.ok) {
        return response.arrayBuffer();
      }
      throw new Error(response.status + " : " + response.url);
    };
  }
} else {}

var out = console.log.bind(console);

var err = console.error.bind(console);

// end include: shell.js
// include: preamble.js
// === Preamble library stuff ===
// Documentation for the public APIs defined in this file must be updated in:
//    site/source/docs/api_reference/preamble.js.rst
// A prebuilt local version of the documentation is available at:
//    site/build/text/docs/api_reference/preamble.js.txt
// You can also build docs locally as HTML or other formats in site/
// An online HTML version (which may be of a different version of Emscripten)
//    is up at http://kripken.github.io/emscripten-site/docs/api_reference/preamble.js.html
var wasmBinary;

// Wasm globals
//========================================
// Runtime essentials
//========================================
// whether we are quitting the application. no code should run after this.
// set in exit() and abort()
var ABORT = false;

// set by exit() and abort().  Passed to 'onExit' handler.
// NOTE: This is also used as the process return code in shell environments
// but only when noExitRuntime is false.
var EXITSTATUS;

// In STRICT mode, we only define assert() when ASSERTIONS is set.  i.e. we
// don't define it at all in release modes.  This matches the behaviour of
// MINIMAL_RUNTIME.
// TODO(sbc): Make this the default even without STRICT enabled.
/** @type {function(*, string=)} */ function assert(condition, text) {
  if (!condition) {
    // This build was created without ASSERTIONS defined.  `assert()` should not
    // ever be called in this configuration but in case there are callers in
    // the wild leave this simple abort() implementation here for now.
    abort(text);
  }
}

/**
 * Indicates whether filename is delivered via file protocol (as opposed to http/https)
 * @noinline
 */ var isFileURI = filename => filename.startsWith("file://");

// include: runtime_common.js
// include: runtime_stack_check.js
// end include: runtime_stack_check.js
// include: runtime_exceptions.js
// end include: runtime_exceptions.js
// include: runtime_debug.js
// end include: runtime_debug.js
var readyPromiseResolve, readyPromiseReject;

// Memory management
var runtimeInitialized = false;

function updateMemoryViews() {
  var b = wasmMemory.buffer;
  HEAP8 = new Int8Array(b);
  Module["HEAP16"] = HEAP16 = new Int16Array(b);
  Module["HEAPU8"] = HEAPU8 = new Uint8Array(b);
  HEAPU16 = new Uint16Array(b);
  Module["HEAP32"] = HEAP32 = new Int32Array(b);
  HEAPU32 = new Uint32Array(b);
  Module["HEAPF32"] = HEAPF32 = new Float32Array(b);
  Module["HEAPF64"] = HEAPF64 = new Float64Array(b);
  HEAP64 = new BigInt64Array(b);
  HEAPU64 = new BigUint64Array(b);
}

// include: memoryprofiler.js
// end include: memoryprofiler.js
// end include: runtime_common.js
function preRun() {
  if (Module["preRun"]) {
    if (typeof Module["preRun"] == "function") Module["preRun"] = [ Module["preRun"] ];
    while (Module["preRun"].length) {
      addOnPreRun(Module["preRun"].shift());
    }
  }
  // Begin ATPRERUNS hooks
  callRuntimeCallbacks(onPreRuns);
}

function initRuntime() {
  runtimeInitialized = true;
  // Begin ATINITS hooks
  if (!Module["noFSInit"] && !FS.initialized) FS.init();
  TTY.init();
  // End ATINITS hooks
  wasmExports["__wasm_call_ctors"]();
  // Begin ATPOSTCTORS hooks
  FS.ignorePermissions = false;
}

function preMain() {}

function postRun() {
  // PThreads reuse the runtime from the main thread.
  if (Module["postRun"]) {
    if (typeof Module["postRun"] == "function") Module["postRun"] = [ Module["postRun"] ];
    while (Module["postRun"].length) {
      addOnPostRun(Module["postRun"].shift());
    }
  }
  // Begin ATPOSTRUNS hooks
  callRuntimeCallbacks(onPostRuns);
}

/**
 * @param {string|number=} what
 */ function abort(what) {
  Module["onAbort"]?.(what);
  what = `Aborted(${what})`;
  // TODO(sbc): Should we remove printing and leave it up to whoever
  // catches the exception?
  err(what);
  ABORT = true;
  what += ". Build with -sASSERTIONS for more info.";
  // Use a wasm runtime error, because a JS error might be seen as a foreign
  // exception, which means we'd run destructors on it. We need the error to
  // simply make the program stop.
  // FIXME This approach does not work in Wasm EH because it currently does not assume
  // all RuntimeErrors are from traps; it decides whether a RuntimeError is from
  // a trap or not based on a hidden field within the object. So at the moment
  // we don't have a way of throwing a wasm trap from JS. TODO Make a JS API that
  // allows this in the wasm spec.
  // Suppress closure compiler warning here. Closure compiler's builtin extern
  // definition for WebAssembly.RuntimeError claims it takes no arguments even
  // though it can.
  // TODO(https://github.com/google/closure-compiler/pull/3913): Remove if/when upstream closure gets fixed.
  // See above, in the meantime, we resort to wasm code for trapping.
  // In case abort() is called before the module is initialized, wasmExports
  // and its exported '__trap' function is not available, in which case we throw
  // a RuntimeError.
  // We trap instead of throwing RuntimeError to prevent infinite-looping in
  // Wasm EH code (because RuntimeError is considered as a foreign exception and
  // caught by 'catch_all'), but in case throwing RuntimeError is fine because
  // the module has not even been instantiated, even less running.
  if (runtimeInitialized) {
    ___trap();
  }
  /** @suppress {checkTypes} */ var e = new WebAssembly.RuntimeError(what);
  readyPromiseReject?.(e);
  // Throw the error whether or not MODULARIZE is set because abort is used
  // in code paths apart from instantiation where an exception is expected
  // to be thrown when abort is called.
  throw e;
}

var wasmBinaryFile;

function findWasmBinary() {
  return locateFile("gbb.wasm");
}

function getBinarySync(file) {
  if (file == wasmBinaryFile && wasmBinary) {
    return new Uint8Array(wasmBinary);
  }
  if (readBinary) {
    return readBinary(file);
  }
  // Throwing a plain string here, even though it not normally advisable since
  // this gets turning into an `abort` in instantiateArrayBuffer.
  throw "both async and sync fetching of the wasm failed";
}

async function getWasmBinary(binaryFile) {
  // If we don't have the binary yet, load it asynchronously using readAsync.
  if (!wasmBinary) {
    // Fetch the binary using readAsync
    try {
      var response = await readAsync(binaryFile);
      return new Uint8Array(response);
    } catch {}
  }
  // Otherwise, getBinarySync should be able to get it synchronously
  return getBinarySync(binaryFile);
}

async function instantiateArrayBuffer(binaryFile, imports) {
  try {
    var binary = await getWasmBinary(binaryFile);
    var instance = await WebAssembly.instantiate(binary, imports);
    return instance;
  } catch (reason) {
    err(`failed to asynchronously prepare wasm: ${reason}`);
    abort(reason);
  }
}

async function instantiateAsync(binary, binaryFile, imports) {
  if (binary) return instantiateArrayBuffer(binaryFile, imports);
  const response = await fetch(binaryFile, { credentials: "same-origin" });
  if (!response.ok) throw new Error("An error occurred.");
  const mime = (response.headers.get("Content-Type") || "").split(";")[0].trim().toLowerCase();
  if (mime === "application/wasm" && WebAssembly.instantiateStreaming) {
    return WebAssembly.instantiateStreaming(response, imports);
  }
  return WebAssembly.instantiate(await response.arrayBuffer(), imports);
}

function getWasmImports() {
  // instrumenting imports is used in asyncify in two ways: to add assertions
  // that check for proper import use, and for JSPI we use them to set up
  // the Promise API on the import side.
  Asyncify.instrumentWasmImports(wasmImports);
  // prepare imports
  var imports = {
    "env": wasmImports,
    "wasi_snapshot_preview1": wasmImports
  };
  return imports;
}

// Create the wasm instance.
// Receives the wasm imports, returns the exports.
async function createWasm() {
  // Load the wasm module and create an instance of using native support in the JS engine.
  // handle a generated wasm instance, receiving its exports and
  // performing other necessary setup
  /** @param {WebAssembly.Module=} module*/ function receiveInstance(instance, module) {
    wasmExports = instance.exports;
    wasmExports = Asyncify.instrumentWasmExports(wasmExports);
    wasmExports = applySignatureConversions(wasmExports);
    assignWasmExports(wasmExports);
    updateMemoryViews();
    return wasmExports;
  }
  // Prefer streaming instantiation if available.
  function receiveInstantiationResult(result) {
    // 'result' is a ResultObject object which has both the module and instance.
    // receiveInstance() will swap in the exports (to Module.asm) so they can be called
    // TODO: Due to Closure regression https://github.com/google/closure-compiler/issues/3193, the above line no longer optimizes out down to the following line.
    // When the regression is fixed, can restore the above PTHREADS-enabled path.
    return receiveInstance(result["instance"]);
  }
  var info = getWasmImports();
  // User shell pages can write their own Module.instantiateWasm = function(imports, successCallback) callback
  // to manually instantiate the Wasm module themselves. This allows pages to
  // run the instantiation parallel to any other async startup actions they are
  // performing.
  // Also pthreads and wasm workers initialize the wasm instance through this
  // path.
  if (Module["instantiateWasm"]) {
    return new Promise((resolve, reject) => {
      Module["instantiateWasm"](info, (inst, mod) => {
        resolve(receiveInstance(inst, mod));
      });
    });
  }
  wasmBinaryFile ??= findWasmBinary();
  var result = await instantiateAsync(wasmBinary, wasmBinaryFile, info);
  var exports = receiveInstantiationResult(result);
  return exports;
}

// end include: preamble.js
// Begin JS library code
class ExitStatus {
  name="ExitStatus";
  constructor(status) {
    this.message = `Program terminated with exit(${status})`;
    this.status = status;
  }
}

/** @type {!Int16Array} */ var HEAP16;

/** @type {!Int32Array} */ var HEAP32;

/** not-@type {!BigInt64Array} */ var HEAP64;

/** @type {!Int8Array} */ var HEAP8;

/** @type {!Float32Array} */ var HEAPF32;

/** @type {!Float64Array} */ var HEAPF64;

/** @type {!Uint16Array} */ var HEAPU16;

/** @type {!Uint32Array} */ var HEAPU32;

/** not-@type {!BigUint64Array} */ var HEAPU64;

/** @type {!Uint8Array} */ var HEAPU8;

var callRuntimeCallbacks = callbacks => {
  while (callbacks.length > 0) {
    // Pass the module as the first argument.
    callbacks.shift()(Module);
  }
};

var onPostRuns = [];

var addOnPostRun = cb => onPostRuns.push(cb);

var onPreRuns = [];

var addOnPreRun = cb => onPreRuns.push(cb);

/**
   * @param {number} ptr
   * @param {string} type
   */ function getValue(ptr, type = "i8") {
  if (type.endsWith("*")) type = "*";
  switch (type) {
   case "i1":
    return HEAP8[ptr >>> 0];

   case "i8":
    return HEAP8[ptr >>> 0];

   case "i16":
    return HEAP16[((ptr) >>> 1) >>> 0];

   case "i32":
    return HEAP32[((ptr) >>> 2) >>> 0];

   case "i64":
    return HEAP64[((ptr) >>> 3) >>> 0];

   case "float":
    return HEAPF32[((ptr) >>> 2) >>> 0];

   case "double":
    return HEAPF64[((ptr) >>> 3) >>> 0];

   case "*":
    return HEAPU32[((ptr) >>> 2) >>> 0];

   default:
    abort(`invalid type for getValue: ${type}`);
  }
}

var noExitRuntime = true;

/**
   * @param {number} ptr
   * @param {number} value
   * @param {string} type
   */ function setValue(ptr, value, type = "i8") {
  if (type.endsWith("*")) type = "*";
  switch (type) {
   case "i1":
    HEAP8[ptr >>> 0] = value;
    break;

   case "i8":
    HEAP8[ptr >>> 0] = value;
    break;

   case "i16":
    HEAP16[((ptr) >>> 1) >>> 0] = value;
    break;

   case "i32":
    HEAP32[((ptr) >>> 2) >>> 0] = value;
    break;

   case "i64":
    HEAP64[((ptr) >>> 3) >>> 0] = BigInt(value);
    break;

   case "float":
    HEAPF32[((ptr) >>> 2) >>> 0] = value;
    break;

   case "double":
    HEAPF64[((ptr) >>> 3) >>> 0] = value;
    break;

   case "*":
    HEAPU32[((ptr) >>> 2) >>> 0] = value;
    break;

   default:
    abort(`invalid type for setValue: ${type}`);
  }
}

var INT53_MAX = 9007199254740992;

var INT53_MIN = -9007199254740992;

var bigintToI53Checked = num => (num < INT53_MIN || num > INT53_MAX) ? NaN : Number(num);

var UTF8Decoder = globalThis.TextDecoder && new TextDecoder;

var findStringEnd = (heapOrArray, idx, maxBytesToRead, ignoreNul) => {
  var maxIdx = idx + maxBytesToRead;
  if (ignoreNul) return maxIdx;
  // TextDecoder needs to know the byte length in advance, it doesn't stop on
  // null terminator by itself.
  // As a tiny code save trick, compare idx against maxIdx using a negation,
  // so that maxBytesToRead=undefined/NaN means Infinity.
  while (heapOrArray[idx] && !(idx >= maxIdx)) ++idx;
  return idx;
};

/**
   * Given a pointer 'idx' to a null-terminated UTF8-encoded string in the given
   * array that contains uint8 values, returns a copy of that string as a
   * Javascript String object.
   * heapOrArray is either a regular array, or a JavaScript typed array view.
   * @param {number=} idx
   * @param {number=} maxBytesToRead
   * @param {boolean=} ignoreNul - If true, the function will not stop on a NUL character.
   * @return {string}
   */ var UTF8ArrayToString = (heapOrArray, idx = 0, maxBytesToRead, ignoreNul) => {
  idx >>>= 0;
  var endPtr = findStringEnd(heapOrArray, idx, maxBytesToRead, ignoreNul);
  // When using conditional TextDecoder, skip it for short strings as the overhead of the native call is not worth it.
  if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
    return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr));
  }
  var str = "";
  while (idx < endPtr) {
    // For UTF8 byte structure, see:
    // http://en.wikipedia.org/wiki/UTF-8#Description
    // https://www.ietf.org/rfc/rfc2279.txt
    // https://tools.ietf.org/html/rfc3629
    var u0 = heapOrArray[idx++];
    if (!(u0 & 128)) {
      str += String.fromCharCode(u0);
      continue;
    }
    var u1 = heapOrArray[idx++] & 63;
    if ((u0 & 224) == 192) {
      str += String.fromCharCode(((u0 & 31) << 6) | u1);
      continue;
    }
    var u2 = heapOrArray[idx++] & 63;
    if ((u0 & 240) == 224) {
      u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
    } else {
      u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | (heapOrArray[idx++] & 63);
    }
    if (u0 < 65536) {
      str += String.fromCharCode(u0);
    } else {
      var ch = u0 - 65536;
      str += String.fromCharCode(55296 | (ch >> 10), 56320 | (ch & 1023));
    }
  }
  return str;
};

/**
   * Given a pointer 'ptr' to a null-terminated UTF8-encoded string in the
   * emscripten HEAP, returns a copy of that string as a Javascript String object.
   *
   * @param {number} ptr
   * @param {number=} maxBytesToRead - An optional length that specifies the
   *   maximum number of bytes to read. You can omit this parameter to scan the
   *   string until the first 0 byte. If maxBytesToRead is passed, and the string
   *   at [ptr, ptr+maxBytesToReadr[ contains a null byte in the middle, then the
   *   string will cut short at that byte index.
   * @param {boolean=} ignoreNul - If true, the function will not stop on a NUL character.
   * @return {string}
   */ var UTF8ToString = (ptr, maxBytesToRead, ignoreNul) => {
  ptr >>>= 0;
  return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead, ignoreNul) : "";
};

function ___assert_fail(condition, filename, line, func) {
  condition >>>= 0;
  filename >>>= 0;
  func >>>= 0;
  return abort(`Assertion failed: ${UTF8ToString(condition)}, at: ` + [ filename ? UTF8ToString(filename) : "unknown filename", line, func ? UTF8ToString(func) : "unknown function" ]);
}

var syscallGetVarargI = () => {
  // the `+` prepended here is necessary to convince the JSCompiler that varargs is indeed a number.
  var ret = HEAP32[((+SYSCALLS.varargs) >>> 2) >>> 0];
  SYSCALLS.varargs += 4;
  return ret;
};

var syscallGetVarargP = syscallGetVarargI;

var PATH = {
  isAbs: path => path.charAt(0) === "/",
  splitPath: filename => {
    var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
    return splitPathRe.exec(filename).slice(1);
  },
  normalizeArray: (parts, allowAboveRoot) => {
    // if the path tries to go above the root, `up` ends up > 0
    var up = 0;
    for (var i = parts.length - 1; i >= 0; i--) {
      var last = parts[i];
      if (last === ".") {
        parts.splice(i, 1);
      } else if (last === "..") {
        parts.splice(i, 1);
        up++;
      } else if (up) {
        parts.splice(i, 1);
        up--;
      }
    }
    // if the path is allowed to go above the root, restore leading ..s
    if (allowAboveRoot) {
      for (;up; up--) {
        parts.unshift("..");
      }
    }
    return parts;
  },
  normalize: path => {
    var isAbsolute = PATH.isAbs(path), trailingSlash = path.slice(-1) === "/";
    // Normalize the path
    path = PATH.normalizeArray(path.split("/").filter(p => !!p), !isAbsolute).join("/");
    if (!path && !isAbsolute) {
      path = ".";
    }
    if (path && trailingSlash) {
      path += "/";
    }
    return (isAbsolute ? "/" : "") + path;
  },
  dirname: path => {
    var result = PATH.splitPath(path), root = result[0], dir = result[1];
    if (!root && !dir) {
      // No dirname whatsoever
      return ".";
    }
    if (dir) {
      // It has a dirname, strip trailing slash
      dir = dir.slice(0, -1);
    }
    return root + dir;
  },
  basename: path => path && path.match(/([^\/]+|\/)\/*$/)[1],
  join: (...paths) => PATH.normalize(paths.join("/")),
  join2: (l, r) => PATH.normalize(l + "/" + r)
};

var initRandomFill = () => view => (crypto.getRandomValues(view), 0);

var randomFill = view => (randomFill = initRandomFill())(view);

var PATH_FS = {
  resolve: (...args) => {
    var resolvedPath = "", resolvedAbsolute = false;
    for (var i = args.length - 1; i >= -1 && !resolvedAbsolute; i--) {
      var path = (i >= 0) ? args[i] : FS.cwd();
      // Skip empty and invalid entries
      if (typeof path != "string") {
        throw new TypeError("Arguments to path.resolve must be strings");
      } else if (!path) {
        return "";
      }
      resolvedPath = path + "/" + resolvedPath;
      resolvedAbsolute = PATH.isAbs(path);
    }
    // At this point the path should be resolved to a full absolute path, but
    // handle relative paths to be safe (might happen when process.cwd() fails)
    resolvedPath = PATH.normalizeArray(resolvedPath.split("/").filter(p => !!p), !resolvedAbsolute).join("/");
    return ((resolvedAbsolute ? "/" : "") + resolvedPath) || ".";
  },
  relative: (from, to) => {
    from = PATH_FS.resolve(from).slice(1);
    to = PATH_FS.resolve(to).slice(1);
    function trim(arr) {
      var start = 0;
      for (;start < arr.length; start++) {
        if (arr[start] !== "") break;
      }
      var end = arr.length - 1;
      for (;end >= 0; end--) {
        if (arr[end] !== "") break;
      }
      if (start > end) return [];
      return arr.slice(start, end - start + 1);
    }
    var fromParts = trim(from.split("/"));
    var toParts = trim(to.split("/"));
    var length = Math.min(fromParts.length, toParts.length);
    var samePartsLength = length;
    for (var i = 0; i < length; i++) {
      if (fromParts[i] !== toParts[i]) {
        samePartsLength = i;
        break;
      }
    }
    var outputParts = [];
    for (var i = samePartsLength; i < fromParts.length; i++) {
      outputParts.push("..");
    }
    outputParts = outputParts.concat(toParts.slice(samePartsLength));
    return outputParts.join("/");
  }
};

var FS_stdin_getChar_buffer = [];

var lengthBytesUTF8 = str => {
  var len = 0;
  for (var i = 0; i < str.length; ++i) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code
    // unit, not a Unicode code point of the character! So decode
    // UTF16->UTF32->UTF8.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    var c = str.charCodeAt(i);
    // possibly a lead surrogate
    if (c <= 127) {
      len++;
    } else if (c <= 2047) {
      len += 2;
    } else if (c >= 55296 && c <= 57343) {
      len += 4;
      ++i;
    } else {
      len += 3;
    }
  }
  return len;
};

var stringToUTF8Array = (str, heap, outIdx, maxBytesToWrite) => {
  outIdx >>>= 0;
  // Parameter maxBytesToWrite is not optional. Negative values, 0, null,
  // undefined and false each don't write out any bytes.
  if (!(maxBytesToWrite > 0)) return 0;
  var startIdx = outIdx;
  var endIdx = outIdx + maxBytesToWrite - 1;
  // -1 for string null terminator.
  for (var i = 0; i < str.length; ++i) {
    // For UTF8 byte structure, see http://en.wikipedia.org/wiki/UTF-8#Description
    // and https://www.ietf.org/rfc/rfc2279.txt
    // and https://tools.ietf.org/html/rfc3629
    var u = str.codePointAt(i);
    if (u <= 127) {
      if (outIdx >= endIdx) break;
      heap[outIdx++ >>> 0] = u;
    } else if (u <= 2047) {
      if (outIdx + 1 >= endIdx) break;
      heap[outIdx++ >>> 0] = 192 | (u >> 6);
      heap[outIdx++ >>> 0] = 128 | (u & 63);
    } else if (u <= 65535) {
      if (outIdx + 2 >= endIdx) break;
      heap[outIdx++ >>> 0] = 224 | (u >> 12);
      heap[outIdx++ >>> 0] = 128 | ((u >> 6) & 63);
      heap[outIdx++ >>> 0] = 128 | (u & 63);
    } else {
      if (outIdx + 3 >= endIdx) break;
      heap[outIdx++ >>> 0] = 240 | (u >> 18);
      heap[outIdx++ >>> 0] = 128 | ((u >> 12) & 63);
      heap[outIdx++ >>> 0] = 128 | ((u >> 6) & 63);
      heap[outIdx++ >>> 0] = 128 | (u & 63);
      // Gotcha: if codePoint is over 0xFFFF, it is represented as a surrogate pair in UTF-16.
      // We need to manually skip over the second code unit for correct iteration.
      i++;
    }
  }
  // Null-terminate the pointer to the buffer.
  heap[outIdx >>> 0] = 0;
  return outIdx - startIdx;
};

/** @type {function(string, boolean=, number=)} */ var intArrayFromString = (stringy, dontAddNull, length) => {
  var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1;
  var u8array = new Array(len);
  var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
  if (dontAddNull) u8array.length = numBytesWritten;
  return u8array;
};

var FS_stdin_getChar = () => {
  if (!FS_stdin_getChar_buffer.length) {
    var result = null;
    if (globalThis.window?.prompt) {
      // Browser.
      result = window.prompt("Input: ");
      // returns null on cancel
      if (result !== null) {
        result += "\n";
      }
    } else {}
    if (!result) {
      return null;
    }
    FS_stdin_getChar_buffer = intArrayFromString(result, true);
  }
  return FS_stdin_getChar_buffer.shift();
};

var TTY = {
  ttys: [],
  init() {},
  shutdown() {},
  register(dev, ops) {
    TTY.ttys[dev] = {
      input: [],
      output: [],
      ops
    };
    FS.registerDevice(dev, TTY.stream_ops);
  },
  stream_ops: {
    open(stream) {
      var tty = TTY.ttys[stream.node.rdev];
      if (!tty) {
        throw new FS.ErrnoError(43);
      }
      stream.tty = tty;
      stream.seekable = false;
    },
    close(stream) {
      // flush any pending line data
      stream.tty.ops.fsync(stream.tty);
    },
    fsync(stream) {
      stream.tty.ops.fsync(stream.tty);
    },
    read(stream, buffer, offset, length, pos) {
      if (!stream.tty || !stream.tty.ops.get_char) {
        throw new FS.ErrnoError(60);
      }
      var bytesRead = 0;
      for (var i = 0; i < length; i++) {
        var result;
        try {
          result = stream.tty.ops.get_char(stream.tty);
        } catch (e) {
          throw new FS.ErrnoError(29);
        }
        if (result === undefined && bytesRead === 0) {
          throw new FS.ErrnoError(6);
        }
        if (result === null || result === undefined) break;
        bytesRead++;
        buffer[offset + i] = result;
      }
      if (bytesRead) {
        stream.node.atime = Date.now();
      }
      return bytesRead;
    },
    write(stream, buffer, offset, length, pos) {
      if (!stream.tty || !stream.tty.ops.put_char) {
        throw new FS.ErrnoError(60);
      }
      try {
        for (var i = 0; i < length; i++) {
          stream.tty.ops.put_char(stream.tty, buffer[offset + i]);
        }
      } catch (e) {
        throw new FS.ErrnoError(29);
      }
      if (length) {
        stream.node.mtime = stream.node.ctime = Date.now();
      }
      return i;
    }
  },
  default_tty_ops: {
    get_char(tty) {
      return FS_stdin_getChar();
    },
    put_char(tty, val) {
      if (val === null || val === 10) {
        out(UTF8ArrayToString(tty.output));
        tty.output = [];
      } else {
        if (val != 0) tty.output.push(val);
      }
    },
    fsync(tty) {
      if (tty.output?.length > 0) {
        out(UTF8ArrayToString(tty.output));
        tty.output = [];
      }
    },
    ioctl_tcgets(tty) {
      // typical setting
      return {
        c_iflag: 25856,
        c_oflag: 5,
        c_cflag: 191,
        c_lflag: 35387,
        c_cc: [ 3, 28, 127, 21, 4, 0, 1, 0, 17, 19, 26, 0, 18, 15, 23, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
      };
    },
    ioctl_tcsets(tty, optional_actions, data) {
      // currently just ignore
      return 0;
    },
    ioctl_tiocgwinsz(tty) {
      return [ 24, 80 ];
    }
  },
  default_tty1_ops: {
    put_char(tty, val) {
      if (val === null || val === 10) {
        err(UTF8ArrayToString(tty.output));
        tty.output = [];
      } else {
        if (val != 0) tty.output.push(val);
      }
    },
    fsync(tty) {
      if (tty.output?.length > 0) {
        err(UTF8ArrayToString(tty.output));
        tty.output = [];
      }
    }
  }
};

var mmapAlloc = size => {
  abort();
};

var MEMFS = {
  ops_table: null,
  mount(mount) {
    return MEMFS.createNode(null, "/", 16895, 0);
  },
  createNode(parent, name, mode, dev) {
    if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
      // not supported
      throw new FS.ErrnoError(63);
    }
    MEMFS.ops_table ||= {
      dir: {
        node: {
          getattr: MEMFS.node_ops.getattr,
          setattr: MEMFS.node_ops.setattr,
          lookup: MEMFS.node_ops.lookup,
          mknod: MEMFS.node_ops.mknod,
          rename: MEMFS.node_ops.rename,
          unlink: MEMFS.node_ops.unlink,
          rmdir: MEMFS.node_ops.rmdir,
          readdir: MEMFS.node_ops.readdir,
          symlink: MEMFS.node_ops.symlink
        },
        stream: {
          llseek: MEMFS.stream_ops.llseek
        }
      },
      file: {
        node: {
          getattr: MEMFS.node_ops.getattr,
          setattr: MEMFS.node_ops.setattr
        },
        stream: {
          llseek: MEMFS.stream_ops.llseek,
          read: MEMFS.stream_ops.read,
          write: MEMFS.stream_ops.write,
          mmap: MEMFS.stream_ops.mmap,
          msync: MEMFS.stream_ops.msync
        }
      },
      link: {
        node: {
          getattr: MEMFS.node_ops.getattr,
          setattr: MEMFS.node_ops.setattr,
          readlink: MEMFS.node_ops.readlink
        },
        stream: {}
      },
      chrdev: {
        node: {
          getattr: MEMFS.node_ops.getattr,
          setattr: MEMFS.node_ops.setattr
        },
        stream: FS.chrdev_stream_ops
      }
    };
    var node = FS.createNode(parent, name, mode, dev);
    if (FS.isDir(node.mode)) {
      node.node_ops = MEMFS.ops_table.dir.node;
      node.stream_ops = MEMFS.ops_table.dir.stream;
      node.contents = {};
    } else if (FS.isFile(node.mode)) {
      node.node_ops = MEMFS.ops_table.file.node;
      node.stream_ops = MEMFS.ops_table.file.stream;
      // The actual number of bytes used in the typed array, as opposed to
      // contents.length which gives the whole capacity.
      node.usedBytes = 0;
      // The byte data of the file is stored in a typed array.
      // Note: typed arrays are not resizable like normal JS arrays are, so
      // there is a small penalty involved for appending file writes that
      // continuously grow a file similar to std::vector capacity vs used.
      node.contents = MEMFS.emptyFileContents ??= new Uint8Array(0);
    } else if (FS.isLink(node.mode)) {
      node.node_ops = MEMFS.ops_table.link.node;
      node.stream_ops = MEMFS.ops_table.link.stream;
    } else if (FS.isChrdev(node.mode)) {
      node.node_ops = MEMFS.ops_table.chrdev.node;
      node.stream_ops = MEMFS.ops_table.chrdev.stream;
    }
    node.atime = node.mtime = node.ctime = Date.now();
    // add the new node to the parent
    if (parent) {
      parent.contents[name] = node;
      parent.atime = parent.mtime = parent.ctime = node.atime;
    }
    return node;
  },
  getFileDataAsTypedArray(node) {
    return node.contents.subarray(0, node.usedBytes);
  },
  expandFileStorage(node, newCapacity) {
    var prevCapacity = node.contents.length;
    if (prevCapacity >= newCapacity) return;
    // No need to expand, the storage was already large enough.
    // Don't expand strictly to the given requested limit if it's only a very
    // small increase, but instead geometrically grow capacity.
    // For small filesizes (<1MB), perform size*2 geometric increase, but for
    // large sizes, do a much more conservative size*1.125 increase to avoid
    // overshooting the allocation cap by a very large margin.
    var CAPACITY_DOUBLING_MAX = 1024 * 1024;
    newCapacity = Math.max(newCapacity, (prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2 : 1.125)) >>> 0);
    if (prevCapacity) newCapacity = Math.max(newCapacity, 256);
    // At minimum allocate 256b for each file when expanding.
    var oldContents = MEMFS.getFileDataAsTypedArray(node);
    node.contents = new Uint8Array(newCapacity);
    // Allocate new storage.
    node.contents.set(oldContents);
  },
  resizeFileStorage(node, newSize) {
    if (node.usedBytes == newSize) return;
    var oldContents = node.contents;
    node.contents = new Uint8Array(newSize);
    // Allocate new storage.
    node.contents.set(oldContents.subarray(0, Math.min(newSize, node.usedBytes)));
    // Copy old data over to the new storage.
    node.usedBytes = newSize;
  },
  node_ops: {
    getattr(node) {
      var attr = {};
      // device numbers reuse inode numbers.
      attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
      attr.ino = node.id;
      attr.mode = node.mode;
      attr.nlink = 1;
      attr.uid = 0;
      attr.gid = 0;
      attr.rdev = node.rdev;
      if (FS.isDir(node.mode)) {
        attr.size = 4096;
      } else if (FS.isFile(node.mode)) {
        attr.size = node.usedBytes;
      } else if (FS.isLink(node.mode)) {
        attr.size = node.link.length;
      } else {
        attr.size = 0;
      }
      attr.atime = new Date(node.atime);
      attr.mtime = new Date(node.mtime);
      attr.ctime = new Date(node.ctime);
      // NOTE: In our implementation, st_blocks = Math.ceil(st_size/st_blksize),
      //       but this is not required by the standard.
      attr.blksize = 4096;
      attr.blocks = Math.ceil(attr.size / attr.blksize);
      return attr;
    },
    setattr(node, attr) {
      for (const key of [ "mode", "atime", "mtime", "ctime" ]) {
        if (attr[key] != null) {
          node[key] = attr[key];
        }
      }
      if (attr.size !== undefined) {
        MEMFS.resizeFileStorage(node, attr.size);
      }
    },
    lookup(parent, name) {
      // This error may happen quite a bit. To avoid overhead we reuse it (and
      // suffer a lack of stack info).
      if (!MEMFS.doesNotExistError) {
        MEMFS.doesNotExistError = new FS.ErrnoError(44);
        /** @suppress {checkTypes} */ MEMFS.doesNotExistError.stack = "<generic error, no stack>";
      }
      throw MEMFS.doesNotExistError;
    },
    mknod(parent, name, mode, dev) {
      return MEMFS.createNode(parent, name, mode, dev);
    },
    rename(old_node, new_dir, new_name) {
      var new_node;
      try {
        new_node = FS.lookupNode(new_dir, new_name);
      } catch (e) {}
      if (new_node) {
        if (FS.isDir(old_node.mode)) {
          // if we're overwriting a directory at new_name, make sure it's empty.
          for (var i in new_node.contents) {
            throw new FS.ErrnoError(55);
          }
        }
        FS.hashRemoveNode(new_node);
      }
      // do the internal rewiring
      delete old_node.parent.contents[old_node.name];
      new_dir.contents[new_name] = old_node;
      old_node.name = new_name;
      new_dir.ctime = new_dir.mtime = old_node.parent.ctime = old_node.parent.mtime = Date.now();
    },
    unlink(parent, name) {
      delete parent.contents[name];
      parent.ctime = parent.mtime = Date.now();
    },
    rmdir(parent, name) {
      var node = FS.lookupNode(parent, name);
      for (var i in node.contents) {
        throw new FS.ErrnoError(55);
      }
      delete parent.contents[name];
      parent.ctime = parent.mtime = Date.now();
    },
    readdir(node) {
      return [ ".", "..", ...Object.keys(node.contents) ];
    },
    symlink(parent, newname, oldpath) {
      var node = MEMFS.createNode(parent, newname, 511 | 40960, 0);
      node.link = oldpath;
      return node;
    },
    readlink(node) {
      if (!FS.isLink(node.mode)) {
        throw new FS.ErrnoError(28);
      }
      return node.link;
    }
  },
  stream_ops: {
    read(stream, buffer, offset, length, position) {
      var contents = stream.node.contents;
      if (position >= stream.node.usedBytes) return 0;
      var size = Math.min(stream.node.usedBytes - position, length);
      buffer.set(contents.subarray(position, position + size), offset);
      return size;
    },
    write(stream, buffer, offset, length, position, canOwn) {
      // If the buffer is located in main memory (HEAP), and if
      // memory can grow, we can't hold on to references of the
      // memory buffer, as they may get invalidated. That means we
      // need to copy its contents.
      if (buffer.buffer === HEAP8.buffer) {
        canOwn = false;
      }
      if (!length) return 0;
      var node = stream.node;
      node.mtime = node.ctime = Date.now();
      if (canOwn) {
        node.contents = buffer.subarray(offset, offset + length);
        node.usedBytes = length;
      } else if (node.usedBytes === 0 && position === 0) {
        // If this is a simple first write to an empty file, do a fast set since we don't need to care about old data.
        node.contents = buffer.slice(offset, offset + length);
        node.usedBytes = length;
      } else {
        MEMFS.expandFileStorage(node, position + length);
        // Use typed array write which is available.
        node.contents.set(buffer.subarray(offset, offset + length), position);
        node.usedBytes = Math.max(node.usedBytes, position + length);
      }
      return length;
    },
    llseek(stream, offset, whence) {
      var position = offset;
      if (whence === 1) {
        position += stream.position;
      } else if (whence === 2) {
        if (FS.isFile(stream.node.mode)) {
          position += stream.node.usedBytes;
        }
      }
      if (position < 0) {
        throw new FS.ErrnoError(28);
      }
      return position;
    },
    mmap(stream, length, position, prot, flags) {
      if (!FS.isFile(stream.node.mode)) {
        throw new FS.ErrnoError(43);
      }
      var ptr;
      var allocated;
      var contents = stream.node.contents;
      // Only make a new copy when MAP_PRIVATE is specified.
      if (!(flags & 2) && contents.buffer === HEAP8.buffer) {
        // We can't emulate MAP_SHARED when the file is not backed by the
        // buffer we're mapping to (e.g. the HEAP buffer).
        allocated = false;
        ptr = contents.byteOffset;
      } else {
        allocated = true;
        ptr = mmapAlloc(length);
        if (!ptr) {
          throw new FS.ErrnoError(48);
        }
        if (contents) {
          // Try to avoid unnecessary slices.
          if (position > 0 || position + length < contents.length) {
            if (contents.subarray) {
              contents = contents.subarray(position, position + length);
            } else {
              contents = Array.prototype.slice.call(contents, position, position + length);
            }
          }
          HEAP8.set(contents, ptr >>> 0);
        }
      }
      return {
        ptr,
        allocated
      };
    },
    msync(stream, buffer, offset, length, mmapFlags) {
      MEMFS.stream_ops.write(stream, buffer, 0, length, offset, false);
      // should we check if bytesWritten and length are the same?
      return 0;
    }
  }
};

var FS_modeStringToFlags = str => {
  if (typeof str != "string") return str;
  var flagModes = {
    "r": 0,
    "r+": 2,
    "w": 512 | 64 | 1,
    "w+": 512 | 64 | 2,
    "a": 1024 | 64 | 1,
    "a+": 1024 | 64 | 2
  };
  var flags = flagModes[str];
  if (typeof flags == "undefined") {
    throw new Error(`Unknown file open mode: ${str}`);
  }
  return flags;
};

var FS_fileDataToTypedArray = data => {
  if (typeof data == "string") {
    data = intArrayFromString(data, true);
  }
  if (!data.subarray) {
    data = new Uint8Array(data);
  }
  return data;
};

var FS_getMode = (canRead, canWrite) => {
  var mode = 0;
  if (canRead) mode |= 292 | 73;
  if (canWrite) mode |= 146;
  return mode;
};

var asyncLoad = async url => {
  var arrayBuffer = await readAsync(url);
  return new Uint8Array(arrayBuffer);
};

var FS_createDataFile = (...args) => FS.createDataFile(...args);

var getUniqueRunDependency = id => id;

var runDependencies = 0;

var dependenciesFulfilled = null;

var removeRunDependency = id => {
  runDependencies--;
  Module["monitorRunDependencies"]?.(runDependencies);
  if (runDependencies == 0) {
    if (dependenciesFulfilled) {
      var callback = dependenciesFulfilled;
      dependenciesFulfilled = null;
      callback();
    }
  }
};

var addRunDependency = id => {
  runDependencies++;
  Module["monitorRunDependencies"]?.(runDependencies);
};

var preloadPlugins = [];

var FS_handledByPreloadPlugin = async (byteArray, fullname) => {
  // Ensure plugins are ready.
  if (typeof Browser != "undefined") Browser.init();
  for (var plugin of preloadPlugins) {
    if (plugin["canHandle"](fullname)) {
      return plugin["handle"](byteArray, fullname);
    }
  }
  // If no plugin handled this file then return the original/unmodified
  // byteArray.
  return byteArray;
};

var FS_preloadFile = async (parent, name, url, canRead, canWrite, dontCreateFile, canOwn, preFinish) => {
  // TODO we should allow people to just pass in a complete filename instead
  // of parent and name being that we just join them anyways
  var fullname = name ? PATH_FS.resolve(PATH.join2(parent, name)) : parent;
  var dep = getUniqueRunDependency(`cp ${fullname}`);
  // might have several active requests for the same fullname
  addRunDependency(dep);
  try {
    var byteArray = url;
    if (typeof url == "string") {
      byteArray = await asyncLoad(url);
    }
    byteArray = await FS_handledByPreloadPlugin(byteArray, fullname);
    preFinish?.();
    if (!dontCreateFile) {
      FS_createDataFile(parent, name, byteArray, canRead, canWrite, canOwn);
    }
  } finally {
    removeRunDependency(dep);
  }
};

var FS_createPreloadedFile = (parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn, preFinish) => {
  FS_preloadFile(parent, name, url, canRead, canWrite, dontCreateFile, canOwn, preFinish).then(onload).catch(onerror);
};

var FS = {
  root: null,
  mounts: [],
  devices: {},
  streams: [],
  nextInode: 1,
  nameTable: null,
  currentPath: "/",
  initialized: false,
  ignorePermissions: true,
  filesystems: null,
  syncFSRequests: 0,
  ErrnoError: class {
    name="ErrnoError";
    // We set the `name` property to be able to identify `FS.ErrnoError`
    // - the `name` is a standard ECMA-262 property of error objects. Kind of good to have it anyway.
    // - when using PROXYFS, an error can come from an underlying FS
    // as different FS objects have their own FS.ErrnoError each,
    // the test `err instanceof FS.ErrnoError` won't detect an error coming from another filesystem, causing bugs.
    // we'll use the reliable test `err.name == "ErrnoError"` instead
    constructor(errno) {
      this.errno = errno;
    }
  },
  FSStream: class {
    shared={};
    get object() {
      return this.node;
    }
    set object(val) {
      this.node = val;
    }
    get isRead() {
      return (this.flags & 2097155) !== 1;
    }
    get isWrite() {
      return (this.flags & 2097155) !== 0;
    }
    get isAppend() {
      return (this.flags & 1024);
    }
    get flags() {
      return this.shared.flags;
    }
    set flags(val) {
      this.shared.flags = val;
    }
    get position() {
      return this.shared.position;
    }
    set position(val) {
      this.shared.position = val;
    }
  },
  FSNode: class {
    node_ops={};
    stream_ops={};
    readMode=292 | 73;
    writeMode=146;
    mounted=null;
    constructor(parent, name, mode, rdev) {
      if (!parent) {
        parent = this;
      }
      this.parent = parent;
      this.mount = parent.mount;
      this.id = FS.nextInode++;
      this.name = name;
      this.mode = mode;
      this.rdev = rdev;
      this.atime = this.mtime = this.ctime = Date.now();
    }
    get read() {
      return (this.mode & this.readMode) === this.readMode;
    }
    set read(val) {
      val ? this.mode |= this.readMode : this.mode &= ~this.readMode;
    }
    get write() {
      return (this.mode & this.writeMode) === this.writeMode;
    }
    set write(val) {
      val ? this.mode |= this.writeMode : this.mode &= ~this.writeMode;
    }
    get isFolder() {
      return FS.isDir(this.mode);
    }
    get isDevice() {
      return FS.isChrdev(this.mode);
    }
  },
  lookupPath(path, opts = {}) {
    if (!path) {
      throw new FS.ErrnoError(44);
    }
    opts.follow_mount ??= true;
    if (!PATH.isAbs(path)) {
      path = FS.cwd() + "/" + path;
    }
    // limit max consecutive symlinks to SYMLOOP_MAX.
    linkloop: for (var nlinks = 0; nlinks < 40; nlinks++) {
      // split the absolute path
      var parts = path.split("/").filter(p => !!p);
      // start at the root
      var current = FS.root;
      var current_path = "/";
      for (var i = 0; i < parts.length; i++) {
        var islast = (i === parts.length - 1);
        if (islast && opts.parent) {
          // stop resolving
          break;
        }
        if (parts[i] === ".") {
          continue;
        }
        if (parts[i] === "..") {
          current_path = PATH.dirname(current_path);
          if (FS.isRoot(current)) {
            path = current_path + "/" + parts.slice(i + 1).join("/");
            // We're making progress here, don't let many consecutive ..'s
            // lead to ELOOP
            nlinks--;
            continue linkloop;
          } else {
            current = current.parent;
          }
          continue;
        }
        current_path = PATH.join2(current_path, parts[i]);
        try {
          current = FS.lookupNode(current, parts[i]);
        } catch (e) {
          // if noent_okay is true, suppress a ENOENT in the last component
          // and return an object with an undefined node. This is needed for
          // resolving symlinks in the path when creating a file.
          if ((e?.errno === 44) && islast && opts.noent_okay) {
            return {
              path: current_path
            };
          }
          throw e;
        }
        // jump to the mount's root node if this is a mountpoint
        if (FS.isMountpoint(current) && (!islast || opts.follow_mount)) {
          current = current.mounted.root;
        }
        // by default, lookupPath will not follow a symlink if it is the final path component.
        // setting opts.follow = true will override this behavior.
        if (FS.isLink(current.mode) && (!islast || opts.follow)) {
          if (!current.node_ops.readlink) {
            throw new FS.ErrnoError(52);
          }
          var link = current.node_ops.readlink(current);
          if (!PATH.isAbs(link)) {
            link = PATH.dirname(current_path) + "/" + link;
          }
          path = link + "/" + parts.slice(i + 1).join("/");
          continue linkloop;
        }
      }
      return {
        path: current_path,
        node: current
      };
    }
    throw new FS.ErrnoError(32);
  },
  getPath(node) {
    var path;
    while (true) {
      if (FS.isRoot(node)) {
        var mount = node.mount.mountpoint;
        if (!path) return mount;
        return mount[mount.length - 1] !== "/" ? `${mount}/${path}` : mount + path;
      }
      path = path ? `${node.name}/${path}` : node.name;
      node = node.parent;
    }
  },
  hashName(parentid, name) {
    var hash = 0;
    for (var i = 0; i < name.length; i++) {
      hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
    }
    return ((parentid + hash) >>> 0) % FS.nameTable.length;
  },
  hashAddNode(node) {
    var hash = FS.hashName(node.parent.id, node.name);
    node.name_next = FS.nameTable[hash];
    FS.nameTable[hash] = node;
  },
  hashRemoveNode(node) {
    var hash = FS.hashName(node.parent.id, node.name);
    if (FS.nameTable[hash] === node) {
      FS.nameTable[hash] = node.name_next;
    } else {
      var current = FS.nameTable[hash];
      while (current) {
        if (current.name_next === node) {
          current.name_next = node.name_next;
          break;
        }
        current = current.name_next;
      }
    }
  },
  lookupNode(parent, name) {
    var errCode = FS.mayLookup(parent);
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    var hash = FS.hashName(parent.id, name);
    for (var node = FS.nameTable[hash]; node; node = node.name_next) {
      var nodeName = node.name;
      if (node.parent.id === parent.id && nodeName === name) {
        return node;
      }
    }
    // if we failed to find it in the cache, call into the VFS
    return FS.lookup(parent, name);
  },
  createNode(parent, name, mode, rdev) {
    var node = new FS.FSNode(parent, name, mode, rdev);
    FS.hashAddNode(node);
    return node;
  },
  destroyNode(node) {
    FS.hashRemoveNode(node);
  },
  isRoot(node) {
    return node === node.parent;
  },
  isMountpoint(node) {
    return !!node.mounted;
  },
  isFile(mode) {
    return (mode & 61440) === 32768;
  },
  isDir(mode) {
    return (mode & 61440) === 16384;
  },
  isLink(mode) {
    return (mode & 61440) === 40960;
  },
  isChrdev(mode) {
    return (mode & 61440) === 8192;
  },
  isBlkdev(mode) {
    return (mode & 61440) === 24576;
  },
  isFIFO(mode) {
    return (mode & 61440) === 4096;
  },
  isSocket(mode) {
    return (mode & 49152) === 49152;
  },
  flagsToPermissionString(flag) {
    var perms = [ "r", "w", "rw" ][flag & 3];
    if ((flag & 512)) {
      perms += "w";
    }
    return perms;
  },
  nodePermissions(node, perms) {
    if (FS.ignorePermissions) {
      return 0;
    }
    // return 0 if any user, group or owner bits are set.
    if (perms.includes("r") && !(node.mode & 292)) {
      return 2;
    }
    if (perms.includes("w") && !(node.mode & 146)) {
      return 2;
    }
    if (perms.includes("x") && !(node.mode & 73)) {
      return 2;
    }
    return 0;
  },
  mayLookup(dir) {
    if (!FS.isDir(dir.mode)) return 54;
    var errCode = FS.nodePermissions(dir, "x");
    if (errCode) return errCode;
    if (!dir.node_ops.lookup) return 2;
    return 0;
  },
  mayCreate(dir, name) {
    if (!FS.isDir(dir.mode)) {
      return 54;
    }
    try {
      var node = FS.lookupNode(dir, name);
      return 20;
    } catch (e) {}
    return FS.nodePermissions(dir, "wx");
  },
  mayDelete(dir, name, isdir) {
    var node;
    try {
      node = FS.lookupNode(dir, name);
    } catch (e) {
      return e.errno;
    }
    var errCode = FS.nodePermissions(dir, "wx");
    if (errCode) {
      return errCode;
    }
    if (isdir) {
      if (!FS.isDir(node.mode)) {
        return 54;
      }
      if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
        return 10;
      }
    } else if (FS.isDir(node.mode)) {
      return 31;
    }
    return 0;
  },
  mayOpen(node, flags) {
    if (!node) {
      return 44;
    }
    if (FS.isLink(node.mode)) {
      return 32;
    }
    var mode = FS.flagsToPermissionString(flags);
    if (FS.isDir(node.mode)) {
      // opening for write
      // TODO: check for O_SEARCH? (== search for dir only)
      if (mode !== "r" || (flags & (512 | 64))) {
        return 31;
      }
    }
    return FS.nodePermissions(node, mode);
  },
  checkOpExists(op, err) {
    if (!op) {
      throw new FS.ErrnoError(err);
    }
    return op;
  },
  MAX_OPEN_FDS: 4096,
  nextfd() {
    for (var fd = 0; fd <= FS.MAX_OPEN_FDS; fd++) {
      if (!FS.streams[fd]) {
        return fd;
      }
    }
    throw new FS.ErrnoError(33);
  },
  getStreamChecked(fd) {
    var stream = FS.getStream(fd);
    if (!stream) {
      throw new FS.ErrnoError(8);
    }
    return stream;
  },
  getStream: fd => FS.streams[fd],
  createStream(stream, fd = -1) {
    // clone it, so we can return an instance of FSStream
    stream = Object.assign(new FS.FSStream, stream);
    if (fd == -1) {
      fd = FS.nextfd();
    }
    stream.fd = fd;
    FS.streams[fd] = stream;
    return stream;
  },
  closeStream(fd) {
    FS.streams[fd] = null;
  },
  dupStream(origStream, fd = -1) {
    var stream = FS.createStream(origStream, fd);
    stream.stream_ops?.dup?.(stream);
    return stream;
  },
  doSetAttr(stream, node, attr) {
    var setattr = stream?.stream_ops.setattr;
    var arg = setattr ? stream : node;
    setattr ??= node.node_ops.setattr;
    FS.checkOpExists(setattr, 63);
    try {
      setattr(arg, attr);
    } catch (e) {
      if (e instanceof RangeError) {
        throw new FS.ErrnoError(22);
      }
      throw e;
    }
  },
  chrdev_stream_ops: {
    open(stream) {
      var device = FS.getDevice(stream.node.rdev);
      // override node's stream ops with the device's
      stream.stream_ops = device.stream_ops;
      // forward the open call
      stream.stream_ops.open?.(stream);
    },
    llseek() {
      throw new FS.ErrnoError(70);
    }
  },
  major: dev => ((dev) >> 8),
  minor: dev => ((dev) & 255),
  makedev: (ma, mi) => ((ma) << 8 | (mi)),
  registerDevice(dev, ops) {
    FS.devices[dev] = {
      stream_ops: ops
    };
  },
  getDevice: dev => FS.devices[dev],
  getMounts(mount) {
    var mounts = [];
    var check = [ mount ];
    while (check.length) {
      var m = check.pop();
      mounts.push(m);
      check.push(...m.mounts);
    }
    return mounts;
  },
  syncfs(populate, callback) {
    if (typeof populate == "function") {
      callback = populate;
      populate = false;
    }
    FS.syncFSRequests++;
    if (FS.syncFSRequests > 1) {
      err(`warning: ${FS.syncFSRequests} FS.syncfs operations in flight at once, probably just doing extra work`);
    }
    var mounts = FS.getMounts(FS.root.mount);
    var completed = 0;
    function doCallback(errCode) {
      FS.syncFSRequests--;
      return callback(errCode);
    }
    function done(errCode) {
      if (errCode) {
        if (!done.errored) {
          done.errored = true;
          return doCallback(errCode);
        }
        return;
      }
      if (++completed >= mounts.length) {
        doCallback(null);
      }
    }
    // sync all mounts
    for (var mount of mounts) {
      if (mount.type.syncfs) {
        mount.type.syncfs(mount, populate, done);
      } else {
        done(null);
      }
    }
  },
  mount(type, opts, mountpoint) {
    var root = mountpoint === "/";
    var pseudo = !mountpoint;
    var node;
    if (root && FS.root) {
      throw new FS.ErrnoError(10);
    } else if (!root && !pseudo) {
      var lookup = FS.lookupPath(mountpoint, {
        follow_mount: false
      });
      mountpoint = lookup.path;
      // use the absolute path
      node = lookup.node;
      if (FS.isMountpoint(node)) {
        throw new FS.ErrnoError(10);
      }
      if (!FS.isDir(node.mode)) {
        throw new FS.ErrnoError(54);
      }
    }
    var mount = {
      type,
      opts,
      mountpoint,
      mounts: []
    };
    // create a root node for the fs
    var mountRoot = type.mount(mount);
    mountRoot.mount = mount;
    mount.root = mountRoot;
    if (root) {
      FS.root = mountRoot;
    } else if (node) {
      // set as a mountpoint
      node.mounted = mount;
      // add the new mount to the current mount's children
      if (node.mount) {
        node.mount.mounts.push(mount);
      }
    }
    return mountRoot;
  },
  unmount(mountpoint) {
    var lookup = FS.lookupPath(mountpoint, {
      follow_mount: false
    });
    if (!FS.isMountpoint(lookup.node)) {
      throw new FS.ErrnoError(28);
    }
    // destroy the nodes for this mount, and all its child mounts
    var node = lookup.node;
    var mount = node.mounted;
    var mounts = FS.getMounts(mount);
    for (var [hash, current] of Object.entries(FS.nameTable)) {
      while (current) {
        var next = current.name_next;
        if (mounts.includes(current.mount)) {
          FS.destroyNode(current);
        }
        current = next;
      }
    }
    // no longer a mountpoint
    node.mounted = null;
    // remove this mount from the child mounts
    var idx = node.mount.mounts.indexOf(mount);
    node.mount.mounts.splice(idx, 1);
  },
  lookup(parent, name) {
    return parent.node_ops.lookup(parent, name);
  },
  mknod(path, mode, dev) {
    var lookup = FS.lookupPath(path, {
      parent: true
    });
    var parent = lookup.node;
    var name = PATH.basename(path);
    if (!name) {
      throw new FS.ErrnoError(28);
    }
    if (name === "." || name === "..") {
      throw new FS.ErrnoError(20);
    }
    var errCode = FS.mayCreate(parent, name);
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    if (!parent.node_ops.mknod) {
      throw new FS.ErrnoError(63);
    }
    return parent.node_ops.mknod(parent, name, mode, dev);
  },
  statfs(path) {
    return FS.statfsNode(FS.lookupPath(path, {
      follow: true
    }).node);
  },
  statfsStream(stream) {
    // We keep a separate statfsStream function because noderawfs overrides
    // it. In noderawfs, stream.node is sometimes null. Instead, we need to
    // look at stream.path.
    return FS.statfsNode(stream.node);
  },
  statfsNode(node) {
    // NOTE: None of the defaults here are true. We're just returning safe and
    //       sane values. Currently nodefs and rawfs replace these defaults,
    //       other file systems leave them alone.
    var rtn = {
      bsize: 4096,
      frsize: 4096,
      blocks: 1e6,
      bfree: 5e5,
      bavail: 5e5,
      files: FS.nextInode,
      ffree: FS.nextInode - 1,
      fsid: 42,
      flags: 2,
      namelen: 255
    };
    if (node.node_ops.statfs) {
      Object.assign(rtn, node.node_ops.statfs(node.mount.opts.root));
    }
    return rtn;
  },
  create(path, mode = 438) {
    mode &= 4095;
    mode |= 32768;
    return FS.mknod(path, mode, 0);
  },
  mkdir(path, mode = 511) {
    mode &= 511 | 512;
    mode |= 16384;
    return FS.mknod(path, mode, 0);
  },
  mkdirTree(path, mode) {
    var dirs = path.split("/");
    var d = "";
    for (var dir of dirs) {
      if (!dir) continue;
      if (d || PATH.isAbs(path)) d += "/";
      d += dir;
      try {
        FS.mkdir(d, mode);
      } catch (e) {
        if (e.errno != 20) throw e;
      }
    }
  },
  mkdev(path, mode, dev) {
    if (typeof dev == "undefined") {
      dev = mode;
      mode = 438;
    }
    mode |= 8192;
    return FS.mknod(path, mode, dev);
  },
  symlink(oldpath, newpath) {
    if (!PATH_FS.resolve(oldpath)) {
      throw new FS.ErrnoError(44);
    }
    var lookup = FS.lookupPath(newpath, {
      parent: true
    });
    var parent = lookup.node;
    if (!parent) {
      throw new FS.ErrnoError(44);
    }
    var newname = PATH.basename(newpath);
    var errCode = FS.mayCreate(parent, newname);
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    if (!parent.node_ops.symlink) {
      throw new FS.ErrnoError(63);
    }
    return parent.node_ops.symlink(parent, newname, oldpath);
  },
  rename(old_path, new_path) {
    var old_dirname = PATH.dirname(old_path);
    var new_dirname = PATH.dirname(new_path);
    var old_name = PATH.basename(old_path);
    var new_name = PATH.basename(new_path);
    // parents must exist
    var lookup, old_dir, new_dir;
    // let the errors from non existent directories percolate up
    lookup = FS.lookupPath(old_path, {
      parent: true
    });
    old_dir = lookup.node;
    lookup = FS.lookupPath(new_path, {
      parent: true
    });
    new_dir = lookup.node;
    if (!old_dir || !new_dir) throw new FS.ErrnoError(44);
    // need to be part of the same mount
    if (old_dir.mount !== new_dir.mount) {
      throw new FS.ErrnoError(75);
    }
    // source must exist
    var old_node = FS.lookupNode(old_dir, old_name);
    // old path should not be an ancestor of the new path
    var relative = PATH_FS.relative(old_path, new_dirname);
    if (relative.charAt(0) !== ".") {
      throw new FS.ErrnoError(28);
    }
    // new path should not be an ancestor of the old path
    relative = PATH_FS.relative(new_path, old_dirname);
    if (relative.charAt(0) !== ".") {
      throw new FS.ErrnoError(55);
    }
    // see if the new path already exists
    var new_node;
    try {
      new_node = FS.lookupNode(new_dir, new_name);
    } catch (e) {}
    // early out if nothing needs to change
    if (old_node === new_node) {
      return;
    }
    // we'll need to delete the old entry
    var isdir = FS.isDir(old_node.mode);
    var errCode = FS.mayDelete(old_dir, old_name, isdir);
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    // need delete permissions if we'll be overwriting.
    // need create permissions if new doesn't already exist.
    errCode = new_node ? FS.mayDelete(new_dir, new_name, isdir) : FS.mayCreate(new_dir, new_name);
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    if (!old_dir.node_ops.rename) {
      throw new FS.ErrnoError(63);
    }
    if (FS.isMountpoint(old_node) || (new_node && FS.isMountpoint(new_node))) {
      throw new FS.ErrnoError(10);
    }
    // if we are going to change the parent, check write permissions
    if (new_dir !== old_dir) {
      errCode = FS.nodePermissions(old_dir, "w");
      if (errCode) {
        throw new FS.ErrnoError(errCode);
      }
    }
    // remove the node from the lookup hash
    FS.hashRemoveNode(old_node);
    // do the underlying fs rename
    try {
      old_dir.node_ops.rename(old_node, new_dir, new_name);
      // update old node (we do this here to avoid each backend
      // needing to)
      old_node.parent = new_dir;
    } catch (e) {
      throw e;
    } finally {
      // add the node back to the hash (in case node_ops.rename
      // changed its name)
      FS.hashAddNode(old_node);
    }
  },
  rmdir(path) {
    var lookup = FS.lookupPath(path, {
      parent: true
    });
    var parent = lookup.node;
    var name = PATH.basename(path);
    var node = FS.lookupNode(parent, name);
    var errCode = FS.mayDelete(parent, name, true);
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    if (!parent.node_ops.rmdir) {
      throw new FS.ErrnoError(63);
    }
    if (FS.isMountpoint(node)) {
      throw new FS.ErrnoError(10);
    }
    parent.node_ops.rmdir(parent, name);
    FS.destroyNode(node);
  },
  readdir(path) {
    var lookup = FS.lookupPath(path, {
      follow: true
    });
    var node = lookup.node;
    var readdir = FS.checkOpExists(node.node_ops.readdir, 54);
    return readdir(node);
  },
  unlink(path) {
    var lookup = FS.lookupPath(path, {
      parent: true
    });
    var parent = lookup.node;
    if (!parent) {
      throw new FS.ErrnoError(44);
    }
    var name = PATH.basename(path);
    var node = FS.lookupNode(parent, name);
    var errCode = FS.mayDelete(parent, name, false);
    if (errCode) {
      // According to POSIX, we should map EISDIR to EPERM, but
      // we instead do what Linux does (and we must, as we use
      // the musl linux libc).
      throw new FS.ErrnoError(errCode);
    }
    if (!parent.node_ops.unlink) {
      throw new FS.ErrnoError(63);
    }
    if (FS.isMountpoint(node)) {
      throw new FS.ErrnoError(10);
    }
    parent.node_ops.unlink(parent, name);
    FS.destroyNode(node);
  },
  readlink(path) {
    var lookup = FS.lookupPath(path);
    var link = lookup.node;
    if (!link) {
      throw new FS.ErrnoError(44);
    }
    if (!link.node_ops.readlink) {
      throw new FS.ErrnoError(28);
    }
    return link.node_ops.readlink(link);
  },
  stat(path, dontFollow) {
    var lookup = FS.lookupPath(path, {
      follow: !dontFollow
    });
    var node = lookup.node;
    var getattr = FS.checkOpExists(node.node_ops.getattr, 63);
    return getattr(node);
  },
  fstat(fd) {
    var stream = FS.getStreamChecked(fd);
    var node = stream.node;
    var getattr = stream.stream_ops.getattr;
    var arg = getattr ? stream : node;
    getattr ??= node.node_ops.getattr;
    FS.checkOpExists(getattr, 63);
    return getattr(arg);
  },
  lstat(path) {
    return FS.stat(path, true);
  },
  doChmod(stream, node, mode, dontFollow) {
    FS.doSetAttr(stream, node, {
      mode: (mode & 4095) | (node.mode & ~4095),
      ctime: Date.now(),
      dontFollow
    });
  },
  chmod(path, mode, dontFollow) {
    var node;
    if (typeof path == "string") {
      var lookup = FS.lookupPath(path, {
        follow: !dontFollow
      });
      node = lookup.node;
    } else {
      node = path;
    }
    FS.doChmod(null, node, mode, dontFollow);
  },
  lchmod(path, mode) {
    FS.chmod(path, mode, true);
  },
  fchmod(fd, mode) {
    var stream = FS.getStreamChecked(fd);
    FS.doChmod(stream, stream.node, mode, false);
  },
  doChown(stream, node, dontFollow) {
    FS.doSetAttr(stream, node, {
      timestamp: Date.now(),
      dontFollow
    });
  },
  chown(path, uid, gid, dontFollow) {
    var node;
    if (typeof path == "string") {
      var lookup = FS.lookupPath(path, {
        follow: !dontFollow
      });
      node = lookup.node;
    } else {
      node = path;
    }
    FS.doChown(null, node, dontFollow);
  },
  lchown(path, uid, gid) {
    FS.chown(path, uid, gid, true);
  },
  fchown(fd, uid, gid) {
    var stream = FS.getStreamChecked(fd);
    FS.doChown(stream, stream.node, false);
  },
  doTruncate(stream, node, len) {
    if (FS.isDir(node.mode)) {
      throw new FS.ErrnoError(31);
    }
    if (!FS.isFile(node.mode)) {
      throw new FS.ErrnoError(28);
    }
    var errCode = FS.nodePermissions(node, "w");
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    FS.doSetAttr(stream, node, {
      size: len,
      timestamp: Date.now()
    });
  },
  truncate(path, len) {
    if (len < 0) {
      throw new FS.ErrnoError(28);
    }
    var node;
    if (typeof path == "string") {
      var lookup = FS.lookupPath(path, {
        follow: true
      });
      node = lookup.node;
    } else {
      node = path;
    }
    FS.doTruncate(null, node, len);
  },
  ftruncate(fd, len) {
    var stream = FS.getStreamChecked(fd);
    if (len < 0 || (stream.flags & 2097155) === 0) {
      throw new FS.ErrnoError(28);
    }
    FS.doTruncate(stream, stream.node, len);
  },
  utime(path, atime, mtime) {
    var lookup = FS.lookupPath(path, {
      follow: true
    });
    var node = lookup.node;
    var setattr = FS.checkOpExists(node.node_ops.setattr, 63);
    setattr(node, {
      atime,
      mtime
    });
  },
  open(path, flags, mode = 438) {
    if (path === "") {
      throw new FS.ErrnoError(44);
    }
    flags = FS_modeStringToFlags(flags);
    if ((flags & 64)) {
      mode = (mode & 4095) | 32768;
    } else {
      mode = 0;
    }
    var node;
    var isDirPath;
    if (typeof path == "object") {
      node = path;
    } else {
      isDirPath = path.endsWith("/");
      // noent_okay makes it so that if the final component of the path
      // doesn't exist, lookupPath returns `node: undefined`. `path` will be
      // updated to point to the target of all symlinks.
      var lookup = FS.lookupPath(path, {
        follow: !(flags & 131072),
        noent_okay: true
      });
      node = lookup.node;
      path = lookup.path;
    }
    // perhaps we need to create the node
    var created = false;
    if ((flags & 64)) {
      if (node) {
        // if O_CREAT and O_EXCL are set, error out if the node already exists
        if ((flags & 128)) {
          throw new FS.ErrnoError(20);
        }
      } else if (isDirPath) {
        throw new FS.ErrnoError(31);
      } else {
        // node doesn't exist, try to create it
        // Ignore the permission bits here to ensure we can `open` this new
        // file below. We use chmod below to apply the permissions once the
        // file is open.
        node = FS.mknod(path, mode | 511, 0);
        created = true;
      }
    }
    if (!node) {
      throw new FS.ErrnoError(44);
    }
    // can't truncate a device
    if (FS.isChrdev(node.mode)) {
      flags &= ~512;
    }
    // if asked only for a directory, then this must be one
    if ((flags & 65536) && !FS.isDir(node.mode)) {
      throw new FS.ErrnoError(54);
    }
    // check permissions, if this is not a file we just created now (it is ok to
    // create and write to a file with read-only permissions; it is read-only
    // for later use)
    if (!created) {
      var errCode = FS.mayOpen(node, flags);
      if (errCode) {
        throw new FS.ErrnoError(errCode);
      }
    }
    // do truncation if necessary
    if ((flags & 512) && !created) {
      FS.truncate(node, 0);
    }
    // we've already handled these, don't pass down to the underlying vfs
    flags &= ~(128 | 512 | 131072);
    // register the stream with the filesystem
    var stream = FS.createStream({
      node,
      path: FS.getPath(node),
      // we want the absolute path to the node
      flags,
      seekable: true,
      position: 0,
      stream_ops: node.stream_ops,
      // used by the file family libc calls (fopen, fwrite, ferror, etc.)
      ungotten: [],
      error: false
    });
    // call the new stream's open function
    if (stream.stream_ops.open) {
      stream.stream_ops.open(stream);
    }
    if (created) {
      FS.chmod(node, mode & 511);
    }
    return stream;
  },
  close(stream) {
    if (FS.isClosed(stream)) {
      throw new FS.ErrnoError(8);
    }
    if (stream.getdents) stream.getdents = null;
    // free readdir state
    try {
      if (stream.stream_ops.close) {
        stream.stream_ops.close(stream);
      }
    } catch (e) {
      throw e;
    } finally {
      FS.closeStream(stream.fd);
    }
    stream.fd = null;
  },
  isClosed(stream) {
    return stream.fd === null;
  },
  llseek(stream, offset, whence) {
    if (FS.isClosed(stream)) {
      throw new FS.ErrnoError(8);
    }
    if (!stream.seekable || !stream.stream_ops.llseek) {
      throw new FS.ErrnoError(70);
    }
    if (whence != 0 && whence != 1 && whence != 2) {
      throw new FS.ErrnoError(28);
    }
    stream.position = stream.stream_ops.llseek(stream, offset, whence);
    stream.ungotten = [];
    return stream.position;
  },
  read(stream, buffer, offset, length, position) {
    if (length < 0 || position < 0) {
      throw new FS.ErrnoError(28);
    }
    if (FS.isClosed(stream)) {
      throw new FS.ErrnoError(8);
    }
    if ((stream.flags & 2097155) === 1) {
      throw new FS.ErrnoError(8);
    }
    if (FS.isDir(stream.node.mode)) {
      throw new FS.ErrnoError(31);
    }
    if (!stream.stream_ops.read) {
      throw new FS.ErrnoError(28);
    }
    var seeking = typeof position != "undefined";
    if (!seeking) {
      position = stream.position;
    } else if (!stream.seekable) {
      throw new FS.ErrnoError(70);
    }
    var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
    if (!seeking) stream.position += bytesRead;
    return bytesRead;
  },
  write(stream, buffer, offset, length, position, canOwn) {
    if (length < 0 || position < 0) {
      throw new FS.ErrnoError(28);
    }
    if (FS.isClosed(stream)) {
      throw new FS.ErrnoError(8);
    }
    if ((stream.flags & 2097155) === 0) {
      throw new FS.ErrnoError(8);
    }
    if (FS.isDir(stream.node.mode)) {
      throw new FS.ErrnoError(31);
    }
    if (!stream.stream_ops.write) {
      throw new FS.ErrnoError(28);
    }
    if (stream.seekable && stream.flags & 1024) {
      // seek to the end before writing in append mode
      FS.llseek(stream, 0, 2);
    }
    var seeking = typeof position != "undefined";
    if (!seeking) {
      position = stream.position;
    } else if (!stream.seekable) {
      throw new FS.ErrnoError(70);
    }
    var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
    if (!seeking) stream.position += bytesWritten;
    return bytesWritten;
  },
  mmap(stream, length, position, prot, flags) {
    // User requests writing to file (prot & PROT_WRITE != 0).
    // Checking if we have permissions to write to the file unless
    // MAP_PRIVATE flag is set. According to POSIX spec it is possible
    // to write to file opened in read-only mode with MAP_PRIVATE flag,
    // as all modifications will be visible only in the memory of
    // the current process.
    if ((prot & 2) !== 0 && (flags & 2) === 0 && (stream.flags & 2097155) !== 2) {
      throw new FS.ErrnoError(2);
    }
    if ((stream.flags & 2097155) === 1) {
      throw new FS.ErrnoError(2);
    }
    if (!stream.stream_ops.mmap) {
      throw new FS.ErrnoError(43);
    }
    if (!length) {
      throw new FS.ErrnoError(28);
    }
    return stream.stream_ops.mmap(stream, length, position, prot, flags);
  },
  msync(stream, buffer, offset, length, mmapFlags) {
    if (!stream.stream_ops.msync) {
      return 0;
    }
    return stream.stream_ops.msync(stream, buffer, offset, length, mmapFlags);
  },
  ioctl(stream, cmd, arg) {
    if (!stream.stream_ops.ioctl) {
      throw new FS.ErrnoError(59);
    }
    return stream.stream_ops.ioctl(stream, cmd, arg);
  },
  readFile(path, opts = {}) {
    opts.flags = opts.flags || 0;
    opts.encoding = opts.encoding || "binary";
    if (opts.encoding !== "utf8" && opts.encoding !== "binary") {
      abort(`Invalid encoding type "${opts.encoding}"`);
    }
    var stream = FS.open(path, opts.flags);
    var stat = FS.stat(path);
    var length = stat.size;
    var buf = new Uint8Array(length);
    FS.read(stream, buf, 0, length, 0);
    if (opts.encoding === "utf8") {
      buf = UTF8ArrayToString(buf);
    }
    FS.close(stream);
    return buf;
  },
  writeFile(path, data, opts = {}) {
    opts.flags = opts.flags || 577;
    var stream = FS.open(path, opts.flags, opts.mode);
    data = FS_fileDataToTypedArray(data);
    FS.write(stream, data, 0, data.byteLength, undefined, opts.canOwn);
    FS.close(stream);
  },
  cwd: () => FS.currentPath,
  chdir(path) {
    var lookup = FS.lookupPath(path, {
      follow: true
    });
    if (lookup.node === null) {
      throw new FS.ErrnoError(44);
    }
    if (!FS.isDir(lookup.node.mode)) {
      throw new FS.ErrnoError(54);
    }
    var errCode = FS.nodePermissions(lookup.node, "x");
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    FS.currentPath = lookup.path;
  },
  createDefaultDirectories() {
    FS.mkdir("/tmp");
    FS.mkdir("/home");
    FS.mkdir("/home/web_user");
  },
  createDefaultDevices() {
    // create /dev
    FS.mkdir("/dev");
    // setup /dev/null
    FS.registerDevice(FS.makedev(1, 3), {
      read: () => 0,
      write: (stream, buffer, offset, length, pos) => length,
      llseek: () => 0
    });
    FS.mkdev("/dev/null", FS.makedev(1, 3));
    // setup /dev/tty and /dev/tty1
    // stderr needs to print output using err() rather than out()
    // so we register a second tty just for it.
    TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
    TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
    FS.mkdev("/dev/tty", FS.makedev(5, 0));
    FS.mkdev("/dev/tty1", FS.makedev(6, 0));
    // setup /dev/[u]random
    // use a buffer to avoid overhead of individual crypto calls per byte
    var randomBuffer = new Uint8Array(1024), randomLeft = 0;
    var randomByte = () => {
      if (randomLeft === 0) {
        randomFill(randomBuffer);
        randomLeft = randomBuffer.byteLength;
      }
      return randomBuffer[--randomLeft];
    };
    FS.createDevice("/dev", "random", randomByte);
    FS.createDevice("/dev", "urandom", randomByte);
    // we're not going to emulate the actual shm device,
    // just create the tmp dirs that reside in it commonly
    FS.mkdir("/dev/shm");
    FS.mkdir("/dev/shm/tmp");
  },
  createSpecialDirectories() {
    // create /proc/self/fd which allows /proc/self/fd/6 => readlink gives the
    // name of the stream for fd 6 (see test_unistd_ttyname)
    FS.mkdir("/proc");
    var proc_self = FS.mkdir("/proc/self");
    FS.mkdir("/proc/self/fd");
    FS.mount({
      mount() {
        var node = FS.createNode(proc_self, "fd", 16895, 73);
        node.stream_ops = {
          llseek: MEMFS.stream_ops.llseek
        };
        node.node_ops = {
          lookup(parent, name) {
            var fd = +name;
            var stream = FS.getStreamChecked(fd);
            var ret = {
              parent: null,
              mount: {
                mountpoint: "fake"
              },
              node_ops: {
                readlink: () => stream.path
              },
              id: fd + 1
            };
            ret.parent = ret;
            // make it look like a simple root node
            return ret;
          },
          readdir() {
            return Array.from(FS.streams.entries()).filter(([k, v]) => v).map(([k, v]) => k.toString());
          }
        };
        return node;
      }
    }, {}, "/proc/self/fd");
  },
  createStandardStreams(input, output, error) {
    // TODO deprecate the old functionality of a single
    // input / output callback and that utilizes FS.createDevice
    // and instead require a unique set of stream ops
    // by default, we symlink the standard streams to the
    // default tty devices. however, if the standard streams
    // have been overwritten we create a unique device for
    // them instead.
    if (input) {
      FS.createDevice("/dev", "stdin", input);
    } else {
      FS.symlink("/dev/tty", "/dev/stdin");
    }
    if (output) {
      FS.createDevice("/dev", "stdout", null, output);
    } else {
      FS.symlink("/dev/tty", "/dev/stdout");
    }
    if (error) {
      FS.createDevice("/dev", "stderr", null, error);
    } else {
      FS.symlink("/dev/tty1", "/dev/stderr");
    }
    // open default streams for the stdin, stdout and stderr devices
    var stdin = FS.open("/dev/stdin", 0);
    var stdout = FS.open("/dev/stdout", 1);
    var stderr = FS.open("/dev/stderr", 1);
  },
  staticInit() {
    FS.nameTable = new Array(4096);
    FS.mount(MEMFS, {}, "/");
    FS.createDefaultDirectories();
    FS.createDefaultDevices();
    FS.createSpecialDirectories();
    FS.filesystems = {
      "MEMFS": MEMFS
    };
  },
  init(input, output, error) {
    FS.initialized = true;
    // Allow Module.stdin etc. to provide defaults, if none explicitly passed to us here
    input ??= Module["stdin"];
    output ??= Module["stdout"];
    error ??= Module["stderr"];
    FS.createStandardStreams(input, output, error);
  },
  quit() {
    FS.initialized = false;
    // force-flush all streams, so we get musl std streams printed out
    // close all of our streams
    for (var stream of FS.streams) {
      if (stream) {
        FS.close(stream);
      }
    }
  },
  findObject(path, dontResolveLastLink) {
    var ret = FS.analyzePath(path, dontResolveLastLink);
    if (!ret.exists) {
      return null;
    }
    return ret.object;
  },
  analyzePath(path, dontResolveLastLink) {
    // operate from within the context of the symlink's target
    try {
      var lookup = FS.lookupPath(path, {
        follow: !dontResolveLastLink
      });
      path = lookup.path;
    } catch (e) {}
    var ret = {
      isRoot: false,
      exists: false,
      error: 0,
      name: null,
      path: null,
      object: null,
      parentExists: false,
      parentPath: null,
      parentObject: null
    };
    try {
      var lookup = FS.lookupPath(path, {
        parent: true
      });
      ret.parentExists = true;
      ret.parentPath = lookup.path;
      ret.parentObject = lookup.node;
      ret.name = PATH.basename(path);
      lookup = FS.lookupPath(path, {
        follow: !dontResolveLastLink
      });
      ret.exists = true;
      ret.path = lookup.path;
      ret.object = lookup.node;
      ret.name = lookup.node.name;
      ret.isRoot = lookup.path === "/";
    } catch (e) {
      ret.error = e.errno;
    }
    return ret;
  },
  createPath(parent, path, canRead, canWrite) {
    parent = typeof parent == "string" ? parent : FS.getPath(parent);
    var parts = path.split("/").reverse();
    while (parts.length) {
      var part = parts.pop();
      if (!part) continue;
      var current = PATH.join2(parent, part);
      try {
        FS.mkdir(current);
      } catch (e) {
        if (e.errno != 20) throw e;
      }
      parent = current;
    }
    return current;
  },
  createFile(parent, name, properties, canRead, canWrite) {
    var path = PATH.join2(typeof parent == "string" ? parent : FS.getPath(parent), name);
    var mode = FS_getMode(canRead, canWrite);
    return FS.create(path, mode);
  },
  createDataFile(parent, name, data, canRead, canWrite, canOwn) {
    var path = name;
    if (parent) {
      parent = typeof parent == "string" ? parent : FS.getPath(parent);
      path = name ? PATH.join2(parent, name) : parent;
    }
    var mode = FS_getMode(canRead, canWrite);
    var node = FS.create(path, mode);
    if (data) {
      data = FS_fileDataToTypedArray(data);
      // make sure we can write to the file
      FS.chmod(node, mode | 146);
      var stream = FS.open(node, 577);
      FS.write(stream, data, 0, data.length, 0, canOwn);
      FS.close(stream);
      FS.chmod(node, mode);
    }
  },
  createDevice(parent, name, input, output) {
    var path = PATH.join2(typeof parent == "string" ? parent : FS.getPath(parent), name);
    var mode = FS_getMode(!!input, !!output);
    FS.createDevice.major ??= 64;
    var dev = FS.makedev(FS.createDevice.major++, 0);
    // Create a fake device that a set of stream ops to emulate
    // the old behavior.
    FS.registerDevice(dev, {
      open(stream) {
        stream.seekable = false;
      },
      close(stream) {
        // flush any pending line data
        if (output?.buffer?.length) {
          output(10);
        }
      },
      read(stream, buffer, offset, length, pos) {
        var bytesRead = 0;
        for (var i = 0; i < length; i++) {
          var result;
          try {
            result = input();
          } catch (e) {
            throw new FS.ErrnoError(29);
          }
          if (result === undefined && bytesRead === 0) {
            throw new FS.ErrnoError(6);
          }
          if (result === null || result === undefined) break;
          bytesRead++;
          buffer[offset + i] = result;
        }
        if (bytesRead) {
          stream.node.atime = Date.now();
        }
        return bytesRead;
      },
      write(stream, buffer, offset, length, pos) {
        for (var i = 0; i < length; i++) {
          try {
            output(buffer[offset + i]);
          } catch (e) {
            throw new FS.ErrnoError(29);
          }
        }
        if (length) {
          stream.node.mtime = stream.node.ctime = Date.now();
        }
        return i;
      }
    });
    return FS.mkdev(path, mode, dev);
  },
  forceLoadFile(obj) {
    if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
    if (globalThis.XMLHttpRequest) {
      abort("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
    } else {
      // Command-line.
      try {
        obj.contents = readBinary(obj.url);
      } catch (e) {
        throw new FS.ErrnoError(29);
      }
    }
  },
  createLazyFile(parent, name, url, canRead, canWrite) {
    // Lazy chunked Uint8Array (implements get and length from Uint8Array).
    // Actual getting is abstracted away for eventual reuse.
    class LazyUint8Array {
      lengthKnown=false;
      chunks=[];
      // Loaded chunks. Index is the chunk number
      get(idx) {
        if (idx > this.length - 1 || idx < 0) {
          return undefined;
        }
        var chunkOffset = idx % this.chunkSize;
        var chunkNum = (idx / this.chunkSize) | 0;
        return this.getter(chunkNum)[chunkOffset];
      }
      setDataGetter(getter) {
        this.getter = getter;
      }
      cacheLength() {
        // Find length
        var xhr = new XMLHttpRequest;
        xhr.open("HEAD", url, false);
        xhr.send(null);
        if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) abort("Couldn't load " + url + ". Status: " + xhr.status);
        var datalength = Number(xhr.getResponseHeader("Content-length"));
        var header;
        var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
        var usesGzip = (header = xhr.getResponseHeader("Content-Encoding")) && header === "gzip";
        var chunkSize = 1024 * 1024;
        // Chunk size in bytes
        if (!hasByteServing) chunkSize = datalength;
        // Function to get a range from the remote URL.
        var doXHR = (from, to) => {
          if (from > to) abort("invalid range (" + from + ", " + to + ") or no bytes requested!");
          if (to > datalength - 1) abort("only " + datalength + " bytes available! programmer error!");
          // TODO: Use mozResponseArrayBuffer, responseStream, etc. if available.
          var xhr = new XMLHttpRequest;
          xhr.open("GET", url, false);
          if (datalength !== chunkSize) xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
          // Some hints to the browser that we want binary data.
          xhr.responseType = "arraybuffer";
          if (xhr.overrideMimeType) {
            xhr.overrideMimeType("text/plain; charset=x-user-defined");
          }
          xhr.send(null);
          if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) abort("Couldn't load " + url + ". Status: " + xhr.status);
          if (xhr.response !== undefined) {
            return new Uint8Array(/** @type{Array<number>} */ (xhr.response || []));
          }
          return intArrayFromString(xhr.responseText || "", true);
        };
        var lazyArray = this;
        lazyArray.setDataGetter(chunkNum => {
          var start = chunkNum * chunkSize;
          var end = (chunkNum + 1) * chunkSize - 1;
          // including this byte
          end = Math.min(end, datalength - 1);
          // if datalength-1 is selected, this is the last block
          if (typeof lazyArray.chunks[chunkNum] == "undefined") {
            lazyArray.chunks[chunkNum] = doXHR(start, end);
          }
          if (typeof lazyArray.chunks[chunkNum] == "undefined") abort("doXHR failed!");
          return lazyArray.chunks[chunkNum];
        });
        if (usesGzip || !datalength) {
          // if the server uses gzip or doesn't supply the length, we have to download the whole file to get the (uncompressed) length
          chunkSize = datalength = 1;
          // this will force getter(0)/doXHR do download the whole file
          datalength = this.getter(0).length;
          chunkSize = datalength;
          out("LazyFiles on gzip forces download of the whole file when length is accessed");
        }
        this._length = datalength;
        this._chunkSize = chunkSize;
        this.lengthKnown = true;
      }
      get length() {
        if (!this.lengthKnown) {
          this.cacheLength();
        }
        return this._length;
      }
      get chunkSize() {
        if (!this.lengthKnown) {
          this.cacheLength();
        }
        return this._chunkSize;
      }
    }
    if (globalThis.XMLHttpRequest) {
      if (!ENVIRONMENT_IS_WORKER) abort("Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc");
      var lazyArray = new LazyUint8Array;
      var properties = {
        isDevice: false,
        contents: lazyArray
      };
    } else {
      var properties = {
        isDevice: false,
        url
      };
    }
    var node = FS.createFile(parent, name, properties, canRead, canWrite);
    // This is a total hack, but I want to get this lazy file code out of the
    // core of MEMFS. If we want to keep this lazy file concept I feel it should
    // be its own thin LAZYFS proxying calls to MEMFS.
    if (properties.contents) {
      node.contents = properties.contents;
    } else if (properties.url) {
      node.contents = null;
      node.url = properties.url;
    }
    // Add a function that defers querying the file size until it is asked the first time.
    Object.defineProperties(node, {
      usedBytes: {
        get: function() {
          return this.contents.length;
        }
      }
    });
    // override each stream op with one that tries to force load the lazy file first
    var stream_ops = {};
    for (const [key, fn] of Object.entries(node.stream_ops)) {
      stream_ops[key] = (...args) => {
        FS.forceLoadFile(node);
        return fn(...args);
      };
    }
    function writeChunks(stream, buffer, offset, length, position) {
      var contents = stream.node.contents;
      if (position >= contents.length) return 0;
      var size = Math.min(contents.length - position, length);
      if (contents.slice) {
        // normal array
        for (var i = 0; i < size; i++) {
          buffer[offset + i] = contents[position + i];
        }
      } else {
        for (var i = 0; i < size; i++) {
          // LazyUint8Array from sync binary XHR
          buffer[offset + i] = contents.get(position + i);
        }
      }
      return size;
    }
    // use a custom read function
    stream_ops.read = (stream, buffer, offset, length, position) => {
      FS.forceLoadFile(node);
      return writeChunks(stream, buffer, offset, length, position);
    };
    // use a custom mmap function
    stream_ops.mmap = (stream, length, position, prot, flags) => {
      FS.forceLoadFile(node);
      var ptr = mmapAlloc(length);
      if (!ptr) {
        throw new FS.ErrnoError(48);
      }
      writeChunks(stream, HEAP8, ptr, length, position);
      return {
        ptr,
        allocated: true
      };
    };
    node.stream_ops = stream_ops;
    return node;
  }
};

var SYSCALLS = {
  currentUmask: 18,
  calculateAt(dirfd, path, allowEmpty) {
    if (PATH.isAbs(path)) {
      return path;
    }
    // relative path
    var dir;
    if (dirfd === -100) {
      dir = FS.cwd();
    } else {
      var dirstream = SYSCALLS.getStreamFromFD(dirfd);
      dir = dirstream.path;
    }
    if (path.length == 0) {
      if (!allowEmpty) {
        throw new FS.ErrnoError(44);
      }
      return dir;
    }
    return dir + "/" + path;
  },
  writeStat(buf, stat) {
    HEAPU32[((buf) >>> 2) >>> 0] = stat.dev;
    HEAPU32[(((buf) + (4)) >>> 2) >>> 0] = stat.mode;
    HEAPU32[(((buf) + (8)) >>> 2) >>> 0] = stat.nlink;
    HEAPU32[(((buf) + (12)) >>> 2) >>> 0] = stat.uid;
    HEAPU32[(((buf) + (16)) >>> 2) >>> 0] = stat.gid;
    HEAPU32[(((buf) + (20)) >>> 2) >>> 0] = stat.rdev;
    HEAP64[(((buf) + (24)) >>> 3) >>> 0] = BigInt(stat.size);
    HEAP32[(((buf) + (32)) >>> 2) >>> 0] = 4096;
    HEAP32[(((buf) + (36)) >>> 2) >>> 0] = stat.blocks;
    var atime = stat.atime.getTime();
    var mtime = stat.mtime.getTime();
    var ctime = stat.ctime.getTime();
    HEAP64[(((buf) + (40)) >>> 3) >>> 0] = BigInt(Math.floor(atime / 1e3));
    HEAPU32[(((buf) + (48)) >>> 2) >>> 0] = (atime % 1e3) * 1e3 * 1e3;
    HEAP64[(((buf) + (56)) >>> 3) >>> 0] = BigInt(Math.floor(mtime / 1e3));
    HEAPU32[(((buf) + (64)) >>> 2) >>> 0] = (mtime % 1e3) * 1e3 * 1e3;
    HEAP64[(((buf) + (72)) >>> 3) >>> 0] = BigInt(Math.floor(ctime / 1e3));
    HEAPU32[(((buf) + (80)) >>> 2) >>> 0] = (ctime % 1e3) * 1e3 * 1e3;
    HEAP64[(((buf) + (88)) >>> 3) >>> 0] = BigInt(stat.ino);
    return 0;
  },
  writeStatFs(buf, stats) {
    HEAPU32[(((buf) + (4)) >>> 2) >>> 0] = stats.bsize;
    HEAPU32[(((buf) + (60)) >>> 2) >>> 0] = stats.bsize;
    HEAP64[(((buf) + (8)) >>> 3) >>> 0] = BigInt(stats.blocks);
    HEAP64[(((buf) + (16)) >>> 3) >>> 0] = BigInt(stats.bfree);
    HEAP64[(((buf) + (24)) >>> 3) >>> 0] = BigInt(stats.bavail);
    HEAP64[(((buf) + (32)) >>> 3) >>> 0] = BigInt(stats.files);
    HEAP64[(((buf) + (40)) >>> 3) >>> 0] = BigInt(stats.ffree);
    HEAPU32[(((buf) + (48)) >>> 2) >>> 0] = stats.fsid;
    HEAPU32[(((buf) + (64)) >>> 2) >>> 0] = stats.flags;
    // ST_NOSUID
    HEAPU32[(((buf) + (56)) >>> 2) >>> 0] = stats.namelen;
  },
  doMsync(addr, stream, len, flags, offset) {
    if (!FS.isFile(stream.node.mode)) {
      throw new FS.ErrnoError(43);
    }
    if (flags & 2) {
      // MAP_PRIVATE calls need not to be synced back to underlying fs
      return 0;
    }
    var buffer = HEAPU8.slice(addr, addr + len);
    FS.msync(stream, buffer, offset, len, flags);
  },
  getStreamFromFD(fd) {
    var stream = FS.getStreamChecked(fd);
    return stream;
  },
  varargs: undefined,
  getStr(ptr) {
    var ret = UTF8ToString(ptr);
    return ret;
  }
};

function ___syscall_fcntl64(fd, cmd, varargs) {
  varargs >>>= 0;
  SYSCALLS.varargs = varargs;
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    switch (cmd) {
     case 0:
      {
        var arg = syscallGetVarargI();
        if (arg < 0) {
          return -28;
        }
        while (FS.streams[arg]) {
          arg++;
        }
        var newStream;
        newStream = FS.dupStream(stream, arg);
        return newStream.fd;
      }

     case 1:
     case 2:
      return 0;

     // FD_CLOEXEC makes no sense for a single process.
      case 3:
      return stream.flags;

     case 4:
      {
        var arg = syscallGetVarargI();
        var mask = 289792;
        stream.flags = (stream.flags & ~mask) | (arg & mask);
        return 0;
      }

     case 12:
      {
        var arg = syscallGetVarargP();
        var offset = 0;
        // We're always unlocked.
        HEAP16[(((arg) + (offset)) >>> 1) >>> 0] = 2;
        return 0;
      }

     case 13:
     case 14:
      // Pretend that the locking is successful. These are process-level locks,
      // and Emscripten programs are a single process. If we supported linking a
      // filesystem between programs, we'd need to do more here.
      // See https://github.com/emscripten-core/emscripten/issues/23697
      return 0;
    }
    return -28;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

function ___syscall_fdatasync(fd) {
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    return 0;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

function ___syscall_fstat64(fd, buf) {
  buf >>>= 0;
  try {
    return SYSCALLS.writeStat(buf, FS.fstat(fd));
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

function ___syscall_ioctl(fd, op, varargs) {
  varargs >>>= 0;
  SYSCALLS.varargs = varargs;
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    switch (op) {
     case 21509:
      {
        if (!stream.tty) return -59;
        return 0;
      }

     case 21505:
      {
        if (!stream.tty) return -59;
        if (stream.tty.ops.ioctl_tcgets) {
          var termios = stream.tty.ops.ioctl_tcgets(stream);
          var argp = syscallGetVarargP();
          HEAP32[((argp) >>> 2) >>> 0] = termios.c_iflag || 0;
          HEAP32[(((argp) + (4)) >>> 2) >>> 0] = termios.c_oflag || 0;
          HEAP32[(((argp) + (8)) >>> 2) >>> 0] = termios.c_cflag || 0;
          HEAP32[(((argp) + (12)) >>> 2) >>> 0] = termios.c_lflag || 0;
          for (var i = 0; i < 32; i++) {
            HEAP8[(argp + i) + (17) >>> 0] = termios.c_cc[i] || 0;
          }
          return 0;
        }
        return 0;
      }

     case 21510:
     case 21511:
     case 21512:
      {
        if (!stream.tty) return -59;
        return 0;
      }

     case 21506:
     case 21507:
     case 21508:
      {
        if (!stream.tty) return -59;
        if (stream.tty.ops.ioctl_tcsets) {
          var argp = syscallGetVarargP();
          var c_iflag = HEAP32[((argp) >>> 2) >>> 0];
          var c_oflag = HEAP32[(((argp) + (4)) >>> 2) >>> 0];
          var c_cflag = HEAP32[(((argp) + (8)) >>> 2) >>> 0];
          var c_lflag = HEAP32[(((argp) + (12)) >>> 2) >>> 0];
          var c_cc = [];
          for (var i = 0; i < 32; i++) {
            c_cc.push(HEAP8[(argp + i) + (17) >>> 0]);
          }
          return stream.tty.ops.ioctl_tcsets(stream.tty, op, {
            c_iflag,
            c_oflag,
            c_cflag,
            c_lflag,
            c_cc
          });
        }
        return 0;
      }

     case 21519:
      {
        if (!stream.tty) return -59;
        var argp = syscallGetVarargP();
        HEAP32[((argp) >>> 2) >>> 0] = 0;
        return 0;
      }

     case 21520:
      {
        if (!stream.tty) return -59;
        return -28;
      }

     case 21537:
     case 21531:
      {
        var argp = syscallGetVarargP();
        return FS.ioctl(stream, op, argp);
      }

     case 21523:
      {
        // TODO: in theory we should write to the winsize struct that gets
        // passed in, but for now musl doesn't read anything on it
        if (!stream.tty) return -59;
        if (stream.tty.ops.ioctl_tiocgwinsz) {
          var winsize = stream.tty.ops.ioctl_tiocgwinsz(stream.tty);
          var argp = syscallGetVarargP();
          HEAP16[((argp) >>> 1) >>> 0] = winsize[0];
          HEAP16[(((argp) + (2)) >>> 1) >>> 0] = winsize[1];
        }
        return 0;
      }

     case 21524:
      {
        // TODO: technically, this ioctl call should change the window size.
        // but, since emscripten doesn't have any concept of a terminal window
        // yet, we'll just silently throw it away as we do TIOCGWINSZ
        if (!stream.tty) return -59;
        return 0;
      }

     case 21515:
      {
        if (!stream.tty) return -59;
        return 0;
      }

     default:
      return -28;
    }
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

function ___syscall_lstat64(path, buf) {
  path >>>= 0;
  buf >>>= 0;
  try {
    path = SYSCALLS.getStr(path);
    return SYSCALLS.writeStat(buf, FS.lstat(path));
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

function ___syscall_mkdirat(dirfd, path, mode) {
  path >>>= 0;
  try {
    path = SYSCALLS.getStr(path);
    path = SYSCALLS.calculateAt(dirfd, path);
    mode &= ~SYSCALLS.currentUmask;
    FS.mkdir(path, mode, 0);
    return 0;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

function ___syscall_newfstatat(dirfd, path, buf, flags) {
  path >>>= 0;
  buf >>>= 0;
  try {
    path = SYSCALLS.getStr(path);
    var nofollow = flags & 256;
    var allowEmpty = flags & 4096;
    flags = flags & (~6400);
    path = SYSCALLS.calculateAt(dirfd, path, allowEmpty);
    return SYSCALLS.writeStat(buf, nofollow ? FS.lstat(path) : FS.stat(path));
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

function ___syscall_openat(dirfd, path, flags, varargs) {
  path >>>= 0;
  varargs >>>= 0;
  SYSCALLS.varargs = varargs;
  try {
    path = SYSCALLS.getStr(path);
    path = SYSCALLS.calculateAt(dirfd, path);
    var mode = varargs ? syscallGetVarargI() : 0;
    if (flags & 64) {
      mode &= ~SYSCALLS.currentUmask;
    }
    return FS.open(path, flags, mode).fd;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

function ___syscall_rmdir(path) {
  path >>>= 0;
  try {
    path = SYSCALLS.getStr(path);
    FS.rmdir(path);
    return 0;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

function ___syscall_stat64(path, buf) {
  path >>>= 0;
  buf >>>= 0;
  try {
    path = SYSCALLS.getStr(path);
    return SYSCALLS.writeStat(buf, FS.stat(path));
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

function ___syscall_unlinkat(dirfd, path, flags) {
  path >>>= 0;
  try {
    path = SYSCALLS.getStr(path);
    path = SYSCALLS.calculateAt(dirfd, path);
    if (!flags) {
      FS.unlink(path);
    } else if (flags === 512) {
      FS.rmdir(path);
    } else {
      return -28;
    }
    return 0;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

var getCppExceptionTag = () => ___cpp_exception;

var getCppExceptionThrownObjectFromWebAssemblyException = ex => {
  // In Wasm EH, the value extracted from WebAssembly.Exception is a pointer
  // to the unwind header. Convert it to the actual thrown value.
  var unwind_header = ex.getArg(getCppExceptionTag(), 0);
  return ___thrown_object_from_unwind_exception(unwind_header);
};

var stackSave = () => _emscripten_stack_get_current();

var stackRestore = val => __emscripten_stack_restore(val);

var stackAlloc = sz => __emscripten_stack_alloc(sz);

var getExceptionMessageCommon = ptr => {
  var sp = stackSave();
  var type_addr_addr = stackAlloc(4);
  var message_addr_addr = stackAlloc(4);
  ___get_exception_message(ptr, type_addr_addr, message_addr_addr);
  var type_addr = HEAPU32[((type_addr_addr) >>> 2) >>> 0];
  var message_addr = HEAPU32[((message_addr_addr) >>> 2) >>> 0];
  var type = UTF8ToString(type_addr);
  _free(type_addr);
  var message;
  if (message_addr) {
    message = UTF8ToString(message_addr);
    _free(message_addr);
  }
  stackRestore(sp);
  return [ type, message ];
};

var getExceptionMessage = ex => {
  var ptr = getCppExceptionThrownObjectFromWebAssemblyException(ex);
  return getExceptionMessageCommon(ptr);
};

var decrementExceptionRefcount = ex => {
  var ptr = getCppExceptionThrownObjectFromWebAssemblyException(ex);
  ___cxa_decrement_exception_refcount(ptr);
};

var incrementExceptionRefcount = ex => {
  var ptr = getCppExceptionThrownObjectFromWebAssemblyException(ex);
  ___cxa_increment_exception_refcount(ptr);
};

var ___throw_exception_with_stack_trace = ex => {
  var e = new WebAssembly.Exception(getCppExceptionTag(), [ ex ], {
    traceStack: true
  });
  e.message = getExceptionMessage(e);
  throw e;
};

var __abort_js = () => abort("");

function __gmtime_js(time, tmPtr) {
  time = bigintToI53Checked(time);
  tmPtr >>>= 0;
  var date = new Date(time * 1e3);
  HEAP32[((tmPtr) >>> 2) >>> 0] = date.getUTCSeconds();
  HEAP32[(((tmPtr) + (4)) >>> 2) >>> 0] = date.getUTCMinutes();
  HEAP32[(((tmPtr) + (8)) >>> 2) >>> 0] = date.getUTCHours();
  HEAP32[(((tmPtr) + (12)) >>> 2) >>> 0] = date.getUTCDate();
  HEAP32[(((tmPtr) + (16)) >>> 2) >>> 0] = date.getUTCMonth();
  HEAP32[(((tmPtr) + (20)) >>> 2) >>> 0] = date.getUTCFullYear() - 1900;
  HEAP32[(((tmPtr) + (24)) >>> 2) >>> 0] = date.getUTCDay();
  var start = Date.UTC(date.getUTCFullYear(), 0, 1, 0, 0, 0, 0);
  var yday = ((date.getTime() - start) / (1e3 * 60 * 60 * 24)) | 0;
  HEAP32[(((tmPtr) + (28)) >>> 2) >>> 0] = yday;
}

var stringToUTF8 = (str, outPtr, maxBytesToWrite) => stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);

var __tzset_js = function(timezone, daylight, std_name, dst_name) {
  timezone >>>= 0;
  daylight >>>= 0;
  std_name >>>= 0;
  dst_name >>>= 0;
  // TODO: Use (malleable) environment variables instead of system settings.
  var currentYear = (new Date).getFullYear();
  var winter = new Date(currentYear, 0, 1);
  var summer = new Date(currentYear, 6, 1);
  var winterOffset = winter.getTimezoneOffset();
  var summerOffset = summer.getTimezoneOffset();
  // Local standard timezone offset. Local standard time is not adjusted for
  // daylight savings.  This code uses the fact that getTimezoneOffset returns
  // a greater value during Standard Time versus Daylight Saving Time (DST).
  // Thus it determines the expected output during Standard Time, and it
  // compares whether the output of the given date the same (Standard) or less
  // (DST).
  var stdTimezoneOffset = Math.max(winterOffset, summerOffset);
  // timezone is specified as seconds west of UTC ("The external variable
  // `timezone` shall be set to the difference, in seconds, between
  // Coordinated Universal Time (UTC) and local standard time."), the same
  // as returned by stdTimezoneOffset.
  // See http://pubs.opengroup.org/onlinepubs/009695399/functions/tzset.html
  HEAPU32[((timezone) >>> 2) >>> 0] = stdTimezoneOffset * 60;
  HEAP32[((daylight) >>> 2) >>> 0] = Number(winterOffset != summerOffset);
  var extractZone = timezoneOffset => {
    // Why inverse sign?
    // Read here https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTimezoneOffset
    var sign = timezoneOffset >= 0 ? "-" : "+";
    var absOffset = Math.abs(timezoneOffset);
    var hours = String(Math.floor(absOffset / 60)).padStart(2, "0");
    var minutes = String(absOffset % 60).padStart(2, "0");
    return `UTC${sign}${hours}${minutes}`;
  };
  var winterName = extractZone(winterOffset);
  var summerName = extractZone(summerOffset);
  if (summerOffset < winterOffset) {
    // Northern hemisphere
    stringToUTF8(winterName, std_name, 17);
    stringToUTF8(summerName, dst_name, 17);
  } else {
    stringToUTF8(winterName, dst_name, 17);
    stringToUTF8(summerName, std_name, 17);
  }
};

var _emscripten_get_now = () => performance.now();

var _emscripten_date_now = () => Date.now();

var nowIsMonotonic = 1;

var checkWasiClock = clock_id => clock_id >= 0 && clock_id <= 3;

function _clock_time_get(clk_id, ignored_precision, ptime) {
  ignored_precision = bigintToI53Checked(ignored_precision);
  ptime >>>= 0;
  if (!checkWasiClock(clk_id)) {
    return 28;
  }
  var now;
  // all wasi clocks but realtime are monotonic
  if (clk_id === 0) {
    now = _emscripten_date_now();
  } else if (nowIsMonotonic) {
    now = _emscripten_get_now();
  } else {
    return 52;
  }
  // "now" is in ms, and wasi times are in ns.
  var nsec = Math.round(now * 1e3 * 1e3);
  HEAP64[((ptime) >>> 3) >>> 0] = BigInt(nsec);
  return 0;
}

var readEmAsmArgsArray = [];

var readEmAsmArgs = (sigPtr, buf) => {
  readEmAsmArgsArray.length = 0;
  var ch;
  // Most arguments are i32s, so shift the buffer pointer so it is a plain
  // index into HEAP32.
  while (ch = HEAPU8[sigPtr++ >>> 0]) {
    // Floats are always passed as doubles, so all types except for 'i'
    // are 8 bytes and require alignment.
    var wide = (ch != 105);
    wide &= (ch != 112);
    buf += wide && (buf % 8) ? 4 : 0;
    readEmAsmArgsArray.push(// Special case for pointers under wasm64 or CAN_ADDRESS_2GB mode.
    ch == 112 ? HEAPU32[((buf) >>> 2) >>> 0] : ch == 106 ? HEAP64[((buf) >>> 3) >>> 0] : ch == 105 ? HEAP32[((buf) >>> 2) >>> 0] : HEAPF64[((buf) >>> 3) >>> 0]);
    buf += wide ? 8 : 4;
  }
  return readEmAsmArgsArray;
};

var runMainThreadEmAsm = (emAsmAddr, sigPtr, argbuf, sync) => {
  var args = readEmAsmArgs(sigPtr, argbuf);
  return ASM_CONSTS[emAsmAddr](...args);
};

function _emscripten_asm_const_int_sync_on_main_thread(emAsmAddr, sigPtr, argbuf) {
  emAsmAddr >>>= 0;
  sigPtr >>>= 0;
  argbuf >>>= 0;
  return runMainThreadEmAsm(emAsmAddr, sigPtr, argbuf, 1);
}

function _emscripten_asm_const_double_sync_on_main_thread(a1, a2, a3) {
  a1 >>>= 0;
  a2 >>>= 0;
  a3 >>>= 0;
  return _emscripten_asm_const_int_sync_on_main_thread(a1, a2, a3);
}

var runEmAsmFunction = (code, sigPtr, argbuf) => {
  var args = readEmAsmArgs(sigPtr, argbuf);
  return ASM_CONSTS[code](...args);
};

function _emscripten_asm_const_int(code, sigPtr, argbuf) {
  code >>>= 0;
  sigPtr >>>= 0;
  argbuf >>>= 0;
  return runEmAsmFunction(code, sigPtr, argbuf);
}

function _emscripten_asm_const_ptr_sync_on_main_thread(emAsmAddr, sigPtr, argbuf) {
  emAsmAddr >>>= 0;
  sigPtr >>>= 0;
  argbuf >>>= 0;
  return runMainThreadEmAsm(emAsmAddr, sigPtr, argbuf, 1);
}

var onExits = [];

var addOnExit = cb => onExits.push(cb);

var JSEvents = {
  removeAllEventListeners() {
    while (JSEvents.eventHandlers.length) {
      JSEvents._removeHandler(JSEvents.eventHandlers.length - 1);
    }
    JSEvents.deferredCalls = [];
  },
  inEventHandler: 0,
  deferredCalls: [],
  deferCall(targetFunction, precedence, argsList) {
    function arraysHaveEqualContent(arrA, arrB) {
      if (arrA.length != arrB.length) return false;
      for (var i in arrA) {
        if (arrA[i] != arrB[i]) return false;
      }
      return true;
    }
    // Test if the given call was already queued, and if so, don't add it again.
    for (var call of JSEvents.deferredCalls) {
      if (call.targetFunction == targetFunction && arraysHaveEqualContent(call.argsList, argsList)) {
        return;
      }
    }
    JSEvents.deferredCalls.push({
      targetFunction,
      precedence,
      argsList
    });
    JSEvents.deferredCalls.sort((x, y) => x.precedence - y.precedence);
  },
  removeDeferredCalls(targetFunction) {
    JSEvents.deferredCalls = JSEvents.deferredCalls.filter(call => call.targetFunction != targetFunction);
  },
  canPerformEventHandlerRequests() {
    if (navigator.userActivation) {
      // Verify against transient activation status from UserActivation API
      // whether it is possible to perform a request here without needing to defer. See
      // https://developer.mozilla.org/en-US/docs/Web/Security/User_activation#transient_activation
      // and https://caniuse.com/mdn-api_useractivation
      // At the time of writing, Firefox does not support this API: https://bugzil.la/1791079
      return navigator.userActivation.isActive;
    }
    return JSEvents.inEventHandler && JSEvents.currentEventHandler.allowsDeferredCalls;
  },
  runDeferredCalls() {
    if (!JSEvents.canPerformEventHandlerRequests()) {
      return;
    }
    var deferredCalls = JSEvents.deferredCalls;
    JSEvents.deferredCalls = [];
    for (var call of deferredCalls) {
      call.targetFunction(...call.argsList);
    }
  },
  eventHandlers: [],
  removeAllHandlersOnTarget: (target, eventTypeString) => {
    for (var i = 0; i < JSEvents.eventHandlers.length; ++i) {
      if (JSEvents.eventHandlers[i].target == target && (!eventTypeString || eventTypeString == JSEvents.eventHandlers[i].eventTypeString)) {
        JSEvents._removeHandler(i--);
      }
    }
  },
  _removeHandler(i) {
    var h = JSEvents.eventHandlers[i];
    h.target.removeEventListener(h.eventTypeString, h.eventListenerFunc, h.useCapture);
    JSEvents.eventHandlers.splice(i, 1);
  },
  registerOrRemoveHandler(eventHandler) {
    if (!eventHandler.target) {
      return -4;
    }
    if (eventHandler.callbackfunc) {
      eventHandler.eventListenerFunc = function(event) {
        // Increment nesting count for the event handler.
        ++JSEvents.inEventHandler;
        JSEvents.currentEventHandler = eventHandler;
        // Process any old deferred calls the user has placed.
        JSEvents.runDeferredCalls();
        // Process the actual event, calls back to user C code handler.
        eventHandler.handlerFunc(event);
        // Process any new deferred calls that were placed right now from this event handler.
        JSEvents.runDeferredCalls();
        // Out of event handler - restore nesting count.
        --JSEvents.inEventHandler;
      };
      eventHandler.target.addEventListener(eventHandler.eventTypeString, eventHandler.eventListenerFunc, eventHandler.useCapture);
      JSEvents.eventHandlers.push(eventHandler);
    } else {
      for (var i = 0; i < JSEvents.eventHandlers.length; ++i) {
        if (JSEvents.eventHandlers[i].target == eventHandler.target && JSEvents.eventHandlers[i].eventTypeString == eventHandler.eventTypeString) {
          JSEvents._removeHandler(i--);
        }
      }
    }
    return 0;
  },
  removeSingleHandler(eventHandler) {
    let success = false;
    for (let i = 0; i < JSEvents.eventHandlers.length; ++i) {
      const handler = JSEvents.eventHandlers[i];
      if (handler.target === eventHandler.target && handler.eventTypeId === eventHandler.eventTypeId && handler.callbackfunc === eventHandler.callbackfunc && handler.userData === eventHandler.userData) {
        // in some very rare cases (ex: Safari / fullscreen events), there is more than 1 handler (eventTypeString is different)
        JSEvents._removeHandler(i--);
        success = true;
      }
    }
    return success ? 0 : -5;
  },
  getNodeNameForTarget(target) {
    if (!target) return "";
    if (target == window) return "#window";
    if (target == screen) return "#screen";
    return target?.nodeName || "";
  },
  fullscreenEnabled() {
    return document.fullscreenEnabled || document.webkitFullscreenEnabled;
  }
};

/** @type {Object} */ var specialHTMLTargets = [ 0, document, window ];

var maybeCStringToJsString = cString => cString > 2 ? UTF8ToString(cString) : cString;

var findEventTarget = target => {
  target = maybeCStringToJsString(target);
  var domElement = specialHTMLTargets[target] || document.querySelector(target);
  return domElement;
};

var findCanvasEventTarget = findEventTarget;

function _emscripten_get_canvas_element_size(target, width, height) {
  target >>>= 0;
  width >>>= 0;
  height >>>= 0;
  var canvas = findCanvasEventTarget(target);
  if (!canvas) return -4;
  HEAP32[((width) >>> 2) >>> 0] = canvas.width;
  HEAP32[((height) >>> 2) >>> 0] = canvas.height;
}

var stringToUTF8OnStack = str => {
  var size = lengthBytesUTF8(str) + 1;
  var ret = stackAlloc(size);
  stringToUTF8(str, ret, size);
  return ret;
};

var getCanvasElementSize = target => {
  var sp = stackSave();
  var w = stackAlloc(8);
  var h = w + 4;
  var targetInt = stringToUTF8OnStack(target.id);
  var ret = _emscripten_get_canvas_element_size(targetInt, w, h);
  var size = [ HEAP32[((w) >>> 2) >>> 0], HEAP32[((h) >>> 2) >>> 0] ];
  stackRestore(sp);
  return size;
};

function _emscripten_set_canvas_element_size(target, width, height) {
  target >>>= 0;
  var canvas = findCanvasEventTarget(target);
  if (!canvas) return -4;
  canvas.width = width;
  canvas.height = height;
  return 0;
}

var setCanvasElementSize = (target, width, height) => {
  if (!target.controlTransferredOffscreen) {
    target.width = width;
    target.height = height;
  } else {
    // This function is being called from high-level JavaScript code instead of asm.js/Wasm,
    // and it needs to synchronously proxy over to another thread, so marshal the string onto the heap to do the call.
    var sp = stackSave();
    var targetInt = stringToUTF8OnStack(target.id);
    _emscripten_set_canvas_element_size(targetInt, width, height);
    stackRestore(sp);
  }
};

var currentFullscreenStrategy = {};

var wasmTableMirror = [];

var getWasmTableEntry = funcPtr => {
  var func = wasmTableMirror[funcPtr];
  if (!func) {
    /** @suppress {checkTypes} */ wasmTableMirror[funcPtr] = func = wasmTable.get(funcPtr);
    if (Asyncify.isAsyncExport(func)) {
      wasmTableMirror[funcPtr] = func = Asyncify.makeAsyncFunction(func);
    }
  }
  return func;
};

var registerRestoreOldStyle = canvas => {
  var canvasSize = getCanvasElementSize(canvas);
  var oldWidth = canvasSize[0];
  var oldHeight = canvasSize[1];
  var oldCssWidth = canvas.style.width;
  var oldCssHeight = canvas.style.height;
  var oldBackgroundColor = canvas.style.backgroundColor;
  // Chrome reads color from here.
  var oldDocumentBackgroundColor = document.body.style.backgroundColor;
  // IE11 reads color from here.
  // Firefox always has black background color.
  var oldPaddingLeft = canvas.style.paddingLeft;
  // Chrome, FF, Safari
  var oldPaddingRight = canvas.style.paddingRight;
  var oldPaddingTop = canvas.style.paddingTop;
  var oldPaddingBottom = canvas.style.paddingBottom;
  var oldMarginLeft = canvas.style.marginLeft;
  // IE11
  var oldMarginRight = canvas.style.marginRight;
  var oldMarginTop = canvas.style.marginTop;
  var oldMarginBottom = canvas.style.marginBottom;
  var oldDocumentBodyMargin = document.body.style.margin;
  var oldDocumentOverflow = document.documentElement.style.overflow;
  // Chrome, Firefox
  var oldDocumentScroll = document.body.scroll;
  // IE
  var oldImageRendering = canvas.style.imageRendering;
  function restoreOldStyle() {
    if (!getFullscreenElement()) {
      document.removeEventListener("fullscreenchange", restoreOldStyle);
      // As of Safari 13.0.3 on macOS Catalina 10.15.1 still ships with prefixed webkitfullscreenchange. TODO: revisit this check once Safari ships unprefixed version.
      document.removeEventListener("webkitfullscreenchange", restoreOldStyle);
      setCanvasElementSize(canvas, oldWidth, oldHeight);
      canvas.style.width = oldCssWidth;
      canvas.style.height = oldCssHeight;
      canvas.style.backgroundColor = oldBackgroundColor;
      // Chrome
      // IE11 hack: assigning 'undefined' or an empty string to document.body.style.backgroundColor has no effect, so first assign back the default color
      // before setting the undefined value. Setting undefined value is also important, or otherwise we would later treat that as something that the user
      // had explicitly set so subsequent fullscreen transitions would not set background color properly.
      if (!oldDocumentBackgroundColor) document.body.style.backgroundColor = "white";
      document.body.style.backgroundColor = oldDocumentBackgroundColor;
      // IE11
      canvas.style.paddingLeft = oldPaddingLeft;
      // Chrome, FF, Safari
      canvas.style.paddingRight = oldPaddingRight;
      canvas.style.paddingTop = oldPaddingTop;
      canvas.style.paddingBottom = oldPaddingBottom;
      canvas.style.marginLeft = oldMarginLeft;
      // IE11
      canvas.style.marginRight = oldMarginRight;
      canvas.style.marginTop = oldMarginTop;
      canvas.style.marginBottom = oldMarginBottom;
      document.body.style.margin = oldDocumentBodyMargin;
      document.documentElement.style.overflow = oldDocumentOverflow;
      // Chrome, Firefox
      document.body.scroll = oldDocumentScroll;
      // IE
      canvas.style.imageRendering = oldImageRendering;
      if (canvas.GLctxObject) canvas.GLctxObject.GLctx.viewport(0, 0, oldWidth, oldHeight);
      if (currentFullscreenStrategy.canvasResizedCallback) {
        getWasmTableEntry(currentFullscreenStrategy.canvasResizedCallback)(37, 0, currentFullscreenStrategy.canvasResizedCallbackUserData);
      }
    }
  }
  document.addEventListener("fullscreenchange", restoreOldStyle);
  // As of Safari 13.0.3 on macOS Catalina 10.15.1 still ships with prefixed webkitfullscreenchange. TODO: revisit this check once Safari ships unprefixed version.
  document.addEventListener("webkitfullscreenchange", restoreOldStyle);
  return restoreOldStyle;
};

var setLetterbox = (element, topBottom, leftRight) => {
  // Cannot use margin to specify letterboxes in FF or Chrome, since those ignore margins in fullscreen mode.
  element.style.paddingLeft = element.style.paddingRight = leftRight + "px";
  element.style.paddingTop = element.style.paddingBottom = topBottom + "px";
};

var getBoundingClientRect = e => specialHTMLTargets.indexOf(e) < 0 ? e.getBoundingClientRect() : {
  "left": 0,
  "top": 0
};

var JSEvents_resizeCanvasForFullscreen = (target, strategy) => {
  var restoreOldStyle = registerRestoreOldStyle(target);
  var cssWidth = strategy.softFullscreen ? innerWidth : screen.width;
  var cssHeight = strategy.softFullscreen ? innerHeight : screen.height;
  var rect = getBoundingClientRect(target);
  var windowedCssWidth = rect.width;
  var windowedCssHeight = rect.height;
  var canvasSize = getCanvasElementSize(target);
  var windowedRttWidth = canvasSize[0];
  var windowedRttHeight = canvasSize[1];
  if (strategy.scaleMode == 3) {
    setLetterbox(target, (cssHeight - windowedCssHeight) / 2, (cssWidth - windowedCssWidth) / 2);
    cssWidth = windowedCssWidth;
    cssHeight = windowedCssHeight;
  } else if (strategy.scaleMode == 2) {
    if (cssWidth * windowedRttHeight < windowedRttWidth * cssHeight) {
      var desiredCssHeight = windowedRttHeight * cssWidth / windowedRttWidth;
      setLetterbox(target, (cssHeight - desiredCssHeight) / 2, 0);
      cssHeight = desiredCssHeight;
    } else {
      var desiredCssWidth = windowedRttWidth * cssHeight / windowedRttHeight;
      setLetterbox(target, 0, (cssWidth - desiredCssWidth) / 2);
      cssWidth = desiredCssWidth;
    }
  }
  // If we are adding padding, must choose a background color or otherwise Chrome will give the
  // padding a default white color. Do it only if user has not customized their own background color.
  target.style.backgroundColor ||= "black";
  // IE11 does the same, but requires the color to be set in the document body.
  document.body.style.backgroundColor ||= "black";
  // IE11
  // Firefox always shows black letterboxes independent of style color.
  target.style.width = cssWidth + "px";
  target.style.height = cssHeight + "px";
  if (strategy.filteringMode == 1) {
    target.style.imageRendering = "optimizeSpeed";
    target.style.imageRendering = "-moz-crisp-edges";
    target.style.imageRendering = "-o-crisp-edges";
    target.style.imageRendering = "-webkit-optimize-contrast";
    target.style.imageRendering = "optimize-contrast";
    target.style.imageRendering = "crisp-edges";
    target.style.imageRendering = "pixelated";
  }
  var dpiScale = (strategy.canvasResolutionScaleMode == 2) ? devicePixelRatio : 1;
  if (strategy.canvasResolutionScaleMode != 0) {
    var newWidth = (cssWidth * dpiScale) | 0;
    var newHeight = (cssHeight * dpiScale) | 0;
    setCanvasElementSize(target, newWidth, newHeight);
    if (target.GLctxObject) target.GLctxObject.GLctx.viewport(0, 0, newWidth, newHeight);
  }
  return restoreOldStyle;
};

var JSEvents_requestFullscreen = (target, strategy) => {
  // EMSCRIPTEN_FULLSCREEN_SCALE_DEFAULT + EMSCRIPTEN_FULLSCREEN_CANVAS_SCALE_NONE is a mode where no extra logic is performed to the DOM elements.
  if (strategy.scaleMode != 0 || strategy.canvasResolutionScaleMode != 0) {
    JSEvents_resizeCanvasForFullscreen(target, strategy);
  }
  if (target.requestFullscreen) {
    target.requestFullscreen();
  } else if (target.webkitRequestFullscreen) {
    target.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
  } else {
    return JSEvents.fullscreenEnabled() ? -3 : -1;
  }
  currentFullscreenStrategy = strategy;
  if (strategy.canvasResizedCallback) {
    getWasmTableEntry(strategy.canvasResizedCallback)(37, 0, strategy.canvasResizedCallbackUserData);
  }
  return 0;
};

var _emscripten_exit_fullscreen = () => {
  if (!JSEvents.fullscreenEnabled()) return -1;
  // Make sure no queued up calls will fire after this.
  JSEvents.removeDeferredCalls(JSEvents_requestFullscreen);
  var d = specialHTMLTargets[1];
  if (d.exitFullscreen) {
    d.fullscreenElement && d.exitFullscreen();
  } else if (d.webkitExitFullscreen) {
    d.webkitFullscreenElement && d.webkitExitFullscreen();
  } else {
    return -1;
  }
  return 0;
};

var requestPointerLock = target => {
  if (target.requestPointerLock) {
    target.requestPointerLock();
  } else {
    // document.body is known to accept pointer lock, so use that to differentiate if the user passed a bad element,
    // or if the whole browser just doesn't support the feature.
    if (document.body.requestPointerLock) {
      return -3;
    }
    return -1;
  }
  return 0;
};

var _emscripten_exit_pointerlock = () => {
  // Make sure no queued up calls will fire after this.
  JSEvents.removeDeferredCalls(requestPointerLock);
  if (!document.exitPointerLock) return -1;
  document.exitPointerLock();
  return 0;
};

var runtimeKeepaliveCounter = 0;

var keepRuntimeAlive = () => noExitRuntime || runtimeKeepaliveCounter > 0;

var _proc_exit = code => {
  EXITSTATUS = code;
  if (!keepRuntimeAlive()) {
    Module["onExit"]?.(code);
    ABORT = true;
  }
  quit_(code, new ExitStatus(code));
};

/** @param {boolean|number=} implicit */ var exitJS = (status, implicit) => {
  EXITSTATUS = status;
  _proc_exit(status);
};

var _exit = exitJS;

var __emscripten_runtime_keepalive_clear = () => {
  noExitRuntime = false;
  runtimeKeepaliveCounter = 0;
};

var _emscripten_force_exit = status => {
  __emscripten_runtime_keepalive_clear();
  _exit(status);
};

var fillBatteryEventData = (eventStruct, battery) => {
  HEAPF64[((eventStruct) >>> 3) >>> 0] = battery.chargingTime;
  HEAPF64[(((eventStruct) + (8)) >>> 3) >>> 0] = battery.dischargingTime;
  HEAPF64[(((eventStruct) + (16)) >>> 3) >>> 0] = battery.level;
  HEAP8[(eventStruct) + (24) >>> 0] = battery.charging;
};

var hasBatteryAPI = () => globalThis.navigator?.getBattery;

var batteryManager;

var _emscripten_get_battery_status = function(batteryState) {
  batteryState >>>= 0;
  if (!hasBatteryAPI()) return -1;
  if (!batteryManager) {
    navigator.getBattery().then(b => {
      batteryManager = b;
    });
    return -7;
  }
  fillBatteryEventData(batteryState, batteryManager);
  return 0;
};

var _emscripten_get_device_pixel_ratio = () => devicePixelRatio;

function _emscripten_get_element_css_size(target, width, height) {
  target >>>= 0;
  width >>>= 0;
  height >>>= 0;
  target = findEventTarget(target);
  if (!target) return -4;
  var rect = getBoundingClientRect(target);
  HEAPF64[((width) >>> 3) >>> 0] = rect.width;
  HEAPF64[((height) >>> 3) >>> 0] = rect.height;
  return 0;
}

function getFullscreenElement() {
  return document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.webkitCurrentFullScreenElement || document.msFullscreenElement;
}

var fillFullscreenChangeEventData = eventStruct => {
  var fullscreenElement = getFullscreenElement();
  var isFullscreen = !!fullscreenElement;
  // Assigning a boolean to HEAP32 with expected type coercion.
  /** @suppress{checkTypes} */ HEAP8[eventStruct >>> 0] = isFullscreen;
  HEAP8[(eventStruct) + (1) >>> 0] = JSEvents.fullscreenEnabled();
  // If transitioning to fullscreen, report info about the element that is now fullscreen.
  // If transitioning to windowed mode, report info about the element that just was fullscreen.
  var reportedElement = isFullscreen ? fullscreenElement : JSEvents.previousFullscreenElement;
  var nodeName = JSEvents.getNodeNameForTarget(reportedElement);
  var id = reportedElement?.id || "";
  stringToUTF8(nodeName, eventStruct + 2, 128);
  stringToUTF8(id, eventStruct + 130, 128);
  HEAP32[(((eventStruct) + (260)) >>> 2) >>> 0] = reportedElement ? reportedElement.clientWidth : 0;
  HEAP32[(((eventStruct) + (264)) >>> 2) >>> 0] = reportedElement ? reportedElement.clientHeight : 0;
  HEAP32[(((eventStruct) + (268)) >>> 2) >>> 0] = screen.width;
  HEAP32[(((eventStruct) + (272)) >>> 2) >>> 0] = screen.height;
  if (isFullscreen) {
    JSEvents.previousFullscreenElement = fullscreenElement;
  }
};

function _emscripten_get_fullscreen_status(fullscreenStatus) {
  fullscreenStatus >>>= 0;
  if (!JSEvents.fullscreenEnabled()) return -1;
  fillFullscreenChangeEventData(fullscreenStatus);
  return 0;
}

var fillGamepadEventData = (eventStruct, e) => {
  HEAPF64[((eventStruct) >>> 3) >>> 0] = e.timestamp;
  for (var i = 0; i < e.axes.length; ++i) {
    HEAPF64[(((eventStruct + i * 8) + (16)) >>> 3) >>> 0] = e.axes[i];
  }
  for (var i = 0; i < e.buttons.length; ++i) {
    if (typeof e.buttons[i] == "object") {
      HEAPF64[(((eventStruct + i * 8) + (528)) >>> 3) >>> 0] = e.buttons[i].value;
    } else {
      HEAPF64[(((eventStruct + i * 8) + (528)) >>> 3) >>> 0] = e.buttons[i];
    }
  }
  for (var i = 0; i < e.buttons.length; ++i) {
    if (typeof e.buttons[i] == "object") {
      HEAP8[(eventStruct + i) + (1040) >>> 0] = e.buttons[i].pressed;
    } else {
      // Assigning a boolean to HEAP32, that's ok, but Closure would like to warn about it:
      /** @suppress {checkTypes} */ HEAP8[(eventStruct + i) + (1040) >>> 0] = e.buttons[i] == 1;
    }
  }
  HEAP8[(eventStruct) + (1104) >>> 0] = e.connected;
  HEAP32[(((eventStruct) + (1108)) >>> 2) >>> 0] = e.index;
  HEAP32[(((eventStruct) + (8)) >>> 2) >>> 0] = e.axes.length;
  HEAP32[(((eventStruct) + (12)) >>> 2) >>> 0] = e.buttons.length;
  stringToUTF8(e.id, eventStruct + 1112, 64);
  stringToUTF8(e.mapping, eventStruct + 1176, 64);
};

function _emscripten_get_gamepad_status(index, gamepadState) {
  gamepadState >>>= 0;
  // INVALID_PARAM is returned on a Gamepad index that never was there.
  if (index < 0 || index >= JSEvents.lastGamepadState.length) return -5;
  // NO_DATA is returned on a Gamepad index that was removed.
  // For previously disconnected gamepads there should be an empty slot (null/undefined/false) at the index.
  // This is because gamepads must keep their original position in the array.
  // For example, removing the first of two gamepads produces [null/undefined/false, gamepad].
  if (!JSEvents.lastGamepadState[index]) return -7;
  fillGamepadEventData(gamepadState, JSEvents.lastGamepadState[index]);
  return 0;
}

var _emscripten_set_main_loop_timing = (mode, value) => {
  MainLoop.timingMode = mode;
  MainLoop.timingValue = value;
  if (!MainLoop.func) {
    return 1;
  }
  if (!MainLoop.running) {
    MainLoop.running = true;
  }
  if (mode == 0) {
    MainLoop.scheduler = function MainLoop_scheduler_setTimeout() {
      var timeUntilNextTick = Math.max(0, MainLoop.tickStartTime + value - _emscripten_get_now()) | 0;
      setTimeout(MainLoop.runner, timeUntilNextTick);
    };
  } else if (mode == 1) {
    MainLoop.scheduler = function MainLoop_scheduler_rAF() {
      MainLoop.requestAnimationFrame(MainLoop.runner);
    };
  } else {
    if (!MainLoop.setImmediate) {
      if (globalThis.setImmediate) {
        MainLoop.setImmediate = setImmediate;
      } else {
        // Emulate setImmediate. (note: not a complete polyfill, we don't emulate clearImmediate() to keep code size to minimum, since not needed)
        var setImmediates = [];
        var emscriptenMainLoopMessageId = "setimmediate";
        /** @param {Event} event */ var MainLoop_setImmediate_messageHandler = event => {
          // When called in current thread or Worker, the main loop ID is structured slightly different to accommodate for --proxy-to-worker runtime listening to Worker events,
          // so check for both cases.
          if (event.data === emscriptenMainLoopMessageId || event.data.target === emscriptenMainLoopMessageId) {
            event.stopPropagation();
            setImmediates.shift()();
          }
        };
        addEventListener("message", MainLoop_setImmediate_messageHandler, true);
        MainLoop.setImmediate = /** @type{function(function(): ?, ...?): number} */ (func => {
          setImmediates.push(func);
          if (ENVIRONMENT_IS_WORKER) {
            Module["setImmediates"] ??= [];
            Module["setImmediates"].push(func);
            postMessage({
              target: emscriptenMainLoopMessageId
            });
          } else postMessage(emscriptenMainLoopMessageId, "*");
        });
      }
    }
    MainLoop.scheduler = function MainLoop_scheduler_setImmediate() {
      MainLoop.setImmediate(MainLoop.runner);
    };
  }
  return 0;
};

var handleException = e => {
  // Certain exception types we do not treat as errors since they are used for
  // internal control flow.
  // 1. ExitStatus, which is thrown by exit()
  // 2. "unwind", which is thrown by emscripten_unwind_to_js_event_loop() and others
  //    that wish to return to JS event loop.
  if (e instanceof ExitStatus || e == "unwind") {
    return EXITSTATUS;
  }
  quit_(1, e);
};

var maybeExit = () => {
  if (!keepRuntimeAlive()) {
    try {
      _exit(EXITSTATUS);
    } catch (e) {
      handleException(e);
    }
  }
};

/**
   * @param {number=} arg
   * @param {boolean=} noSetTiming
   */ var setMainLoop = (iterFunc, fps, simulateInfiniteLoop, arg, noSetTiming) => {
  MainLoop.func = iterFunc;
  MainLoop.arg = arg;
  var thisMainLoopId = MainLoop.currentlyRunningMainloop;
  function checkIsRunning() {
    if (thisMainLoopId < MainLoop.currentlyRunningMainloop) {
      maybeExit();
      return false;
    }
    return true;
  }
  // We create the loop runner here but it is not actually running until
  // _emscripten_set_main_loop_timing is called (which might happen at a
  // later time).  This member signifies that the current runner has not
  // yet been started so that we can call runtimeKeepalivePush when it
  // gets its timing set for the first time.
  MainLoop.running = false;
  MainLoop.runner = function MainLoop_runner() {
    if (ABORT) return;
    if (MainLoop.queue.length > 0) {
      var start = Date.now();
      var blocker = MainLoop.queue.shift();
      blocker.func(blocker.arg);
      if (MainLoop.remainingBlockers) {
        var remaining = MainLoop.remainingBlockers;
        var next = remaining % 1 == 0 ? remaining - 1 : Math.floor(remaining);
        if (blocker.counted) {
          MainLoop.remainingBlockers = next;
        } else {
          // not counted, but move the progress along a tiny bit
          next = next + .5;
          // do not steal all the next one's progress
          MainLoop.remainingBlockers = (8 * remaining + next) / 9;
        }
      }
      MainLoop.updateStatus();
      // catches pause/resume main loop from blocker execution
      if (!checkIsRunning()) return;
      setTimeout(MainLoop.runner, 0);
      return;
    }
    // catch pauses from non-main loop sources
    if (!checkIsRunning()) return;
    // Implement very basic swap interval control
    MainLoop.currentFrameNumber = MainLoop.currentFrameNumber + 1 | 0;
    if (MainLoop.timingMode == 1 && MainLoop.timingValue > 1 && MainLoop.currentFrameNumber % MainLoop.timingValue != 0) {
      // Not the scheduled time to render this frame - skip.
      MainLoop.scheduler();
      return;
    } else if (MainLoop.timingMode == 0) {
      MainLoop.tickStartTime = _emscripten_get_now();
    }
    MainLoop.runIter(iterFunc);
    // catch pauses from the main loop itself
    if (!checkIsRunning()) return;
    MainLoop.scheduler();
  };
  if (!noSetTiming) {
    if (fps > 0) {
      _emscripten_set_main_loop_timing(0, 1e3 / fps);
    } else {
      // Do rAF by rendering each frame (no decimating)
      _emscripten_set_main_loop_timing(1, 1);
    }
    MainLoop.scheduler();
  }
  if (simulateInfiniteLoop) {
    throw "unwind";
  }
};

var callUserCallback = func => {
  if (ABORT) {
    return;
  }
  try {
    return func();
  } catch (e) {
    handleException(e);
  } finally {
    maybeExit();
  }
};

var MainLoop = {
  running: false,
  scheduler: null,
  currentlyRunningMainloop: 0,
  func: null,
  arg: 0,
  timingMode: 0,
  timingValue: 0,
  currentFrameNumber: 0,
  queue: [],
  preMainLoop: [],
  postMainLoop: [],
  pause() {
    MainLoop.scheduler = null;
    // Incrementing this signals the previous main loop that it's now become old, and it must return.
    MainLoop.currentlyRunningMainloop++;
  },
  resume() {
    MainLoop.currentlyRunningMainloop++;
    var timingMode = MainLoop.timingMode;
    var timingValue = MainLoop.timingValue;
    var func = MainLoop.func;
    MainLoop.func = null;
    // do not set timing and call scheduler, we will do it on the next lines
    setMainLoop(func, 0, false, MainLoop.arg, true);
    _emscripten_set_main_loop_timing(timingMode, timingValue);
    MainLoop.scheduler();
  },
  updateStatus() {
    if (Module["setStatus"]) {
      var message = Module["statusMessage"] || "Please wait...";
      var remaining = MainLoop.remainingBlockers ?? 0;
      var expected = MainLoop.expectedBlockers ?? 0;
      if (remaining) {
        if (remaining < expected) {
          Module["setStatus"](`{message} ({expected - remaining}/{expected})`);
        } else {
          Module["setStatus"](message);
        }
      } else {
        Module["setStatus"]("");
      }
    }
  },
  init() {
    Module["preMainLoop"] && MainLoop.preMainLoop.push(Module["preMainLoop"]);
    Module["postMainLoop"] && MainLoop.postMainLoop.push(Module["postMainLoop"]);
  },
  runIter(func) {
    if (ABORT) return;
    for (var pre of MainLoop.preMainLoop) {
      if (pre() === false) {
        return;
      }
    }
    callUserCallback(func);
    for (var post of MainLoop.postMainLoop) {
      post();
    }
  },
  nextRAF: 0,
  fakeRequestAnimationFrame(func) {
    // try to keep 60fps between calls to here
    var now = Date.now();
    if (MainLoop.nextRAF === 0) {
      MainLoop.nextRAF = now + 1e3 / 60;
    } else {
      while (now + 2 >= MainLoop.nextRAF) {
        // fudge a little, to avoid timer jitter causing us to do lots of delay:0
        MainLoop.nextRAF += 1e3 / 60;
      }
    }
    var delay = Math.max(MainLoop.nextRAF - now, 0);
    setTimeout(func, delay);
  },
  requestAnimationFrame(func) {
    if (globalThis.requestAnimationFrame) {
      requestAnimationFrame(func);
    } else {
      MainLoop.fakeRequestAnimationFrame(func);
    }
  }
};

function _emscripten_get_main_loop_timing(mode, value) {
  mode >>>= 0;
  value >>>= 0;
  if (mode) HEAP32[((mode) >>> 2) >>> 0] = MainLoop.timingMode;
  if (value) HEAP32[((value) >>> 2) >>> 0] = MainLoop.timingValue;
}

var _emscripten_get_num_gamepads = () => JSEvents.lastGamepadState.length;

/** @param {number=} timeout */ var safeSetTimeout = (func, timeout) => setTimeout(() => {
  callUserCallback(func);
}, timeout);

var warnOnce = text => {
  warnOnce.shown ||= {};
  if (!warnOnce.shown[text]) {
    warnOnce.shown[text] = 1;
    err(text);
  }
};

var Browser = {
  useWebGL: false,
  isFullscreen: false,
  pointerLock: false,
  moduleContextCreatedCallbacks: [],
  workers: [],
  preloadedImages: {},
  preloadedAudios: {},
  getCanvas: () => Module["canvas"],
  init() {
    if (Browser.initted) return;
    Browser.initted = true;
    // Support for plugins that can process preloaded files. You can add more of these to
    // your app by creating and appending to preloadPlugins.
    // Each plugin is asked if it can handle a file based on the file's name. If it can,
    // it is given the file's raw data. When it is done, it calls a callback with the file's
    // (possibly modified) data. For example, a plugin might decompress a file, or it
    // might create some side data structure for use later (like an Image element, etc.).
    var imagePlugin = {};
    imagePlugin["canHandle"] = name => !Module["noImageDecoding"] && /\.(jpg|jpeg|png|bmp|webp)$/i.test(name);
    imagePlugin["handle"] = async (byteArray, name) => {
      var b = new Blob([ byteArray ], {
        type: Browser.getMimetype(name)
      });
      if (b.size !== byteArray.length) {
        // Safari bug #118630
        // Safari's Blob can only take an ArrayBuffer
        b = new Blob([ (new Uint8Array(byteArray)).buffer ], {
          type: Browser.getMimetype(name)
        });
      }
      var url = URL.createObjectURL(b);
      return new Promise((resolve, reject) => {
        var img = new Image;
        img.onload = () => {
          var canvas = /** @type {!HTMLCanvasElement} */ (document.createElement("canvas"));
          canvas.width = img.width;
          canvas.height = img.height;
          var ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          Browser.preloadedImages[name] = canvas;
          URL.revokeObjectURL(url);
          resolve(byteArray);
        };
        img.onerror = event => {
          err(`Image ${url} could not be decoded`);
          reject();
        };
        img.src = url;
      });
    };
    preloadPlugins.push(imagePlugin);
    var audioPlugin = {};
    audioPlugin["canHandle"] = name => !Module["noAudioDecoding"] && name.slice(-4) in {
      ".ogg": 1,
      ".wav": 1,
      ".mp3": 1
    };
    audioPlugin["handle"] = async (byteArray, name) => new Promise((resolve, reject) => {
      var done = false;
      function finish(audio) {
        if (done) return;
        done = true;
        Browser.preloadedAudios[name] = audio;
        resolve(byteArray);
      }
      var b = new Blob([ byteArray ], {
        type: Browser.getMimetype(name)
      });
      var url = URL.createObjectURL(b);
      // XXX we never revoke this!
      var audio = new Audio;
      audio.addEventListener("canplaythrough", () => finish(audio), false);
      // use addEventListener due to chromium bug 124926
      audio.onerror = event => {
        if (done) return;
        err(`warning: browser could not fully decode audio ${name}, trying slower base64 approach`);
        function encode64(data) {
          var BASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
          var PAD = "=";
          var ret = "";
          var leftchar = 0;
          var leftbits = 0;
          for (var i = 0; i < data.length; i++) {
            leftchar = (leftchar << 8) | data[i];
            leftbits += 8;
            while (leftbits >= 6) {
              var curr = (leftchar >> (leftbits - 6)) & 63;
              leftbits -= 6;
              ret += BASE[curr];
            }
          }
          if (leftbits == 2) {
            ret += BASE[(leftchar & 3) << 4];
            ret += PAD + PAD;
          } else if (leftbits == 4) {
            ret += BASE[(leftchar & 15) << 2];
            ret += PAD;
          }
          return ret;
        }
        audio.src = "data:audio/x-" + name.slice(-3) + ";base64," + encode64(byteArray);
        finish(audio);
      };
      audio.src = url;
      // workaround for chrome bug 124926 - we do not always get oncanplaythrough or onerror
      safeSetTimeout(() => {
        finish(audio);
      }, 1e4);
    });
    preloadPlugins.push(audioPlugin);
    // Canvas event setup
    function pointerLockChange() {
      var canvas = Browser.getCanvas();
      Browser.pointerLock = document.pointerLockElement === canvas;
    }
    var canvas = Browser.getCanvas();
    if (canvas) {
      // forced aspect ratio can be enabled by defining 'forcedAspectRatio' on Module
      // Module['forcedAspectRatio'] = 4 / 3;
      document.addEventListener("pointerlockchange", pointerLockChange, false);
      if (Module["elementPointerLock"]) {
        canvas.addEventListener("click", ev => {
          if (!Browser.pointerLock && Browser.getCanvas().requestPointerLock) {
            Browser.getCanvas().requestPointerLock();
            ev.preventDefault();
          }
        }, false);
      }
    }
  },
  createContext(/** @type {HTMLCanvasElement} */ canvas, useWebGL, setInModule, webGLContextAttributes) {
    if (useWebGL && Module["ctx"] && canvas == Browser.getCanvas()) return Module["ctx"];
    // no need to recreate GL context if it's already been created for this canvas.
    var ctx;
    var contextHandle;
    if (useWebGL) {
      // For GLES2/desktop GL compatibility, adjust a few defaults to be different to WebGL defaults, so that they align better with the desktop defaults.
      var contextAttributes = {
        antialias: false,
        alpha: false,
        majorVersion: 2
      };
      if (webGLContextAttributes) {
        for (var attribute in webGLContextAttributes) {
          contextAttributes[attribute] = webGLContextAttributes[attribute];
        }
      }
      // This check of existence of GL is here to satisfy Closure compiler, which yells if variable GL is referenced below but GL object is not
      // actually compiled in because application is not doing any GL operations. TODO: Ideally if GL is not being used, this function
      // Browser.createContext() should not even be emitted.
      if (typeof GL != "undefined") {
        contextHandle = GL.createContext(canvas, contextAttributes);
        if (contextHandle) {
          ctx = GL.getContext(contextHandle).GLctx;
        }
      }
    } else {
      ctx = canvas.getContext("2d");
    }
    if (!ctx) return null;
    if (setInModule) {
      Module["ctx"] = ctx;
      if (useWebGL) GL.makeContextCurrent(contextHandle);
      Browser.useWebGL = useWebGL;
      Browser.moduleContextCreatedCallbacks.forEach(callback => callback());
      Browser.init();
    }
    return ctx;
  },
  fullscreenHandlersInstalled: false,
  lockPointer: undefined,
  resizeCanvas: undefined,
  requestFullscreen(lockPointer, resizeCanvas) {
    Browser.lockPointer = lockPointer;
    Browser.resizeCanvas = resizeCanvas;
    if (typeof Browser.lockPointer == "undefined") Browser.lockPointer = true;
    if (typeof Browser.resizeCanvas == "undefined") Browser.resizeCanvas = false;
    var canvas = Browser.getCanvas();
    function fullscreenChange() {
      Browser.isFullscreen = false;
      var canvasContainer = canvas.parentNode;
      if (getFullscreenElement() === canvasContainer) {
        canvas.exitFullscreen = Browser.exitFullscreen;
        if (Browser.lockPointer) canvas.requestPointerLock();
        Browser.isFullscreen = true;
        if (Browser.resizeCanvas) {
          Browser.setFullscreenCanvasSize();
        } else {
          Browser.updateCanvasDimensions(canvas);
        }
      } else {
        // remove the full screen specific parent of the canvas again to restore the HTML structure from before going full screen
        canvasContainer.parentNode.insertBefore(canvas, canvasContainer);
        canvasContainer.parentNode.removeChild(canvasContainer);
        if (Browser.resizeCanvas) {
          Browser.setWindowedCanvasSize();
        } else {
          Browser.updateCanvasDimensions(canvas);
        }
      }
      Module["onFullScreen"]?.(Browser.isFullscreen);
      Module["onFullscreen"]?.(Browser.isFullscreen);
    }
    if (!Browser.fullscreenHandlersInstalled) {
      Browser.fullscreenHandlersInstalled = true;
      document.addEventListener("fullscreenchange", fullscreenChange, false);
      document.addEventListener("mozfullscreenchange", fullscreenChange, false);
      document.addEventListener("webkitfullscreenchange", fullscreenChange, false);
      document.addEventListener("MSFullscreenChange", fullscreenChange, false);
    }
    // create a new parent to ensure the canvas has no siblings. this allows browsers to optimize full screen performance when its parent is the full screen root
    var canvasContainer = document.createElement("div");
    canvas.parentNode.insertBefore(canvasContainer, canvas);
    canvasContainer.appendChild(canvas);
    // use parent of canvas as full screen root to allow aspect ratio correction (Firefox stretches the root to screen size)
    canvasContainer.requestFullscreen = canvasContainer["requestFullscreen"] || canvasContainer["mozRequestFullScreen"] || canvasContainer["msRequestFullscreen"] || (canvasContainer["webkitRequestFullscreen"] ? () => canvasContainer["webkitRequestFullscreen"](Element["ALLOW_KEYBOARD_INPUT"]) : null) || (canvasContainer["webkitRequestFullScreen"] ? () => canvasContainer["webkitRequestFullScreen"](Element["ALLOW_KEYBOARD_INPUT"]) : null);
    canvasContainer.requestFullscreen();
  },
  exitFullscreen() {
    // This is workaround for chrome. Trying to exit from fullscreen
    // not in fullscreen state will cause "TypeError: Document not active"
    // in chrome. See https://github.com/emscripten-core/emscripten/pull/8236
    if (!Browser.isFullscreen) {
      return false;
    }
    var CFS = document["exitFullscreen"] || document["cancelFullScreen"] || document["mozCancelFullScreen"] || document["msExitFullscreen"] || document["webkitCancelFullScreen"] || (() => {});
    CFS.apply(document, []);
    return true;
  },
  safeSetTimeout(func, timeout) {
    // Legacy function, this is used by the SDL2 port so we need to keep it
    // around at least until that is updated.
    // See https://github.com/libsdl-org/SDL/pull/6304
    return safeSetTimeout(func, timeout);
  },
  getMimetype(name) {
    return {
      "jpg": "image/jpeg",
      "jpeg": "image/jpeg",
      "png": "image/png",
      "bmp": "image/bmp",
      "ogg": "audio/ogg",
      "wav": "audio/wav",
      "mp3": "audio/mpeg"
    }[name.slice(name.lastIndexOf(".") + 1)];
  },
  getUserMedia(func) {
    window.getUserMedia ||= navigator["getUserMedia"] || navigator["mozGetUserMedia"];
    window.getUserMedia(func);
  },
  getMovementX(event) {
    return event["movementX"] || event["mozMovementX"] || event["webkitMovementX"] || 0;
  },
  getMovementY(event) {
    return event["movementY"] || event["mozMovementY"] || event["webkitMovementY"] || 0;
  },
  getMouseWheelDelta(event) {
    var delta = 0;
    switch (event.type) {
     case "DOMMouseScroll":
      // 3 lines make up a step
      delta = event.detail / 3;
      break;

     case "mousewheel":
      // 120 units make up a step
      delta = event.wheelDelta / 120;
      break;

     case "wheel":
      delta = event.deltaY;
      switch (event.deltaMode) {
       case 0:
        // DOM_DELTA_PIXEL: 100 pixels make up a step
        delta /= 100;
        break;

       case 1:
        // DOM_DELTA_LINE: 3 lines make up a step
        delta /= 3;
        break;

       case 2:
        // DOM_DELTA_PAGE: A page makes up 80 steps
        delta *= 80;
        break;

       default:
        abort("unrecognized mouse wheel delta mode: " + event.deltaMode);
      }
      break;

     default:
      abort("unrecognized mouse wheel event: " + event.type);
    }
    return delta;
  },
  mouseX: 0,
  mouseY: 0,
  mouseMovementX: 0,
  mouseMovementY: 0,
  touches: {},
  lastTouches: {},
  calculateMouseCoords(pageX, pageY) {
    // Calculate the movement based on the changes
    // in the coordinates.
    var canvas = Browser.getCanvas();
    var rect = canvas.getBoundingClientRect();
    var adjustedX = pageX - (window.scrollX + rect.left);
    var adjustedY = pageY - (window.scrollY + rect.top);
    // the canvas might be CSS-scaled compared to its backbuffer;
    // SDL-using content will want mouse coordinates in terms
    // of backbuffer units.
    adjustedX = adjustedX * (canvas.width / rect.width);
    adjustedY = adjustedY * (canvas.height / rect.height);
    return {
      x: adjustedX,
      y: adjustedY
    };
  },
  setMouseCoords(pageX, pageY) {
    const {x, y} = Browser.calculateMouseCoords(pageX, pageY);
    Browser.mouseMovementX = x - Browser.mouseX;
    Browser.mouseMovementY = y - Browser.mouseY;
    Browser.mouseX = x;
    Browser.mouseY = y;
  },
  calculateMouseEvent(event) {
    // event should be mousemove, mousedown or mouseup
    if (Browser.pointerLock) {
      // When the pointer is locked, calculate the coordinates
      // based on the movement of the mouse.
      // Workaround for Firefox bug 764498
      if (event.type != "mousemove" && ("mozMovementX" in event)) {
        Browser.mouseMovementX = Browser.mouseMovementY = 0;
      } else {
        Browser.mouseMovementX = Browser.getMovementX(event);
        Browser.mouseMovementY = Browser.getMovementY(event);
      }
      // add the mouse delta to the current absolute mouse position
      Browser.mouseX += Browser.mouseMovementX;
      Browser.mouseY += Browser.mouseMovementY;
    } else {
      if (event.type === "touchstart" || event.type === "touchend" || event.type === "touchmove") {
        var touch = event.touch;
        if (touch === undefined) {
          return;
        }
        var coords = Browser.calculateMouseCoords(touch.pageX, touch.pageY);
        if (event.type === "touchstart") {
          Browser.lastTouches[touch.identifier] = coords;
          Browser.touches[touch.identifier] = coords;
        } else if (event.type === "touchend" || event.type === "touchmove") {
          var last = Browser.touches[touch.identifier];
          last ||= coords;
          Browser.lastTouches[touch.identifier] = last;
          Browser.touches[touch.identifier] = coords;
        }
        return;
      }
      Browser.setMouseCoords(event.pageX, event.pageY);
    }
  },
  resizeListeners: [],
  updateResizeListeners() {
    var canvas = Browser.getCanvas();
    Browser.resizeListeners.forEach(listener => listener(canvas.width, canvas.height));
  },
  setCanvasSize(width, height, noUpdates) {
    var canvas = Browser.getCanvas();
    Browser.updateCanvasDimensions(canvas, width, height);
    if (!noUpdates) Browser.updateResizeListeners();
  },
  windowedWidth: 0,
  windowedHeight: 0,
  setFullscreenCanvasSize() {
    // check if SDL is available
    if (typeof SDL != "undefined") {
      var flags = HEAPU32[((SDL.screen) >>> 2) >>> 0];
      flags = flags | 8388608;
      // set SDL_FULLSCREEN flag
      HEAP32[((SDL.screen) >>> 2) >>> 0] = flags;
    }
    Browser.updateCanvasDimensions(Browser.getCanvas());
    Browser.updateResizeListeners();
  },
  setWindowedCanvasSize() {
    // check if SDL is available
    if (typeof SDL != "undefined") {
      var flags = HEAPU32[((SDL.screen) >>> 2) >>> 0];
      flags = flags & ~8388608;
      // clear SDL_FULLSCREEN flag
      HEAP32[((SDL.screen) >>> 2) >>> 0] = flags;
    }
    Browser.updateCanvasDimensions(Browser.getCanvas());
    Browser.updateResizeListeners();
  },
  updateCanvasDimensions(canvas, wNative, hNative) {
    if (wNative && hNative) {
      canvas.widthNative = wNative;
      canvas.heightNative = hNative;
    } else {
      wNative = canvas.widthNative;
      hNative = canvas.heightNative;
    }
    var w = wNative;
    var h = hNative;
    if (Module["forcedAspectRatio"] > 0) {
      if (w / h < Module["forcedAspectRatio"]) {
        w = Math.round(h * Module["forcedAspectRatio"]);
      } else {
        h = Math.round(w / Module["forcedAspectRatio"]);
      }
    }
    if ((getFullscreenElement() === canvas.parentNode) && (typeof screen != "undefined")) {
      var factor = Math.min(screen.width / w, screen.height / h);
      w = Math.round(w * factor);
      h = Math.round(h * factor);
    }
    if (Browser.resizeCanvas) {
      if (canvas.width != w) canvas.width = w;
      if (canvas.height != h) canvas.height = h;
      if (typeof canvas.style != "undefined") {
        canvas.style.removeProperty("width");
        canvas.style.removeProperty("height");
      }
    } else {
      if (canvas.width != wNative) canvas.width = wNative;
      if (canvas.height != hNative) canvas.height = hNative;
      if (typeof canvas.style != "undefined") {
        if (w != wNative || h != hNative) {
          canvas.style.setProperty("width", w + "px", "important");
          canvas.style.setProperty("height", h + "px", "important");
        } else {
          canvas.style.removeProperty("width");
          canvas.style.removeProperty("height");
        }
      }
    }
  }
};

function _emscripten_get_screen_size(width, height) {
  width >>>= 0;
  height >>>= 0;
  HEAP32[((width) >>> 2) >>> 0] = screen.width;
  HEAP32[((height) >>> 2) >>> 0] = screen.height;
}

var GLctx;

var webgl_enable_WEBGL_draw_instanced_base_vertex_base_instance = ctx => // Closure is expected to be allowed to minify the '.dibvbi' property, so not accessing it quoted.
!!(ctx.dibvbi = ctx.getExtension("WEBGL_draw_instanced_base_vertex_base_instance"));

var webgl_enable_WEBGL_multi_draw_instanced_base_vertex_base_instance = ctx => !!(ctx.mdibvbi = ctx.getExtension("WEBGL_multi_draw_instanced_base_vertex_base_instance"));

var webgl_enable_EXT_polygon_offset_clamp = ctx => !!(ctx.extPolygonOffsetClamp = ctx.getExtension("EXT_polygon_offset_clamp"));

var webgl_enable_EXT_clip_control = ctx => !!(ctx.extClipControl = ctx.getExtension("EXT_clip_control"));

var webgl_enable_WEBGL_polygon_mode = ctx => !!(ctx.webglPolygonMode = ctx.getExtension("WEBGL_polygon_mode"));

var webgl_enable_WEBGL_multi_draw = ctx => // Closure is expected to be allowed to minify the '.multiDrawWebgl' property, so not accessing it quoted.
!!(ctx.multiDrawWebgl = ctx.getExtension("WEBGL_multi_draw"));

var getEmscriptenSupportedExtensions = ctx => {
  // Restrict the list of advertised extensions to those that we actually
  // support.
  var supportedExtensions = [ // WebGL 2 extensions
  "EXT_color_buffer_float", "EXT_conservative_depth", "EXT_disjoint_timer_query_webgl2", "EXT_texture_norm16", "NV_shader_noperspective_interpolation", "WEBGL_clip_cull_distance", // WebGL 1 and WebGL 2 extensions
  "EXT_clip_control", "EXT_color_buffer_half_float", "EXT_depth_clamp", "EXT_float_blend", "EXT_polygon_offset_clamp", "EXT_texture_compression_bptc", "EXT_texture_compression_rgtc", "EXT_texture_filter_anisotropic", "KHR_parallel_shader_compile", "OES_texture_float_linear", "WEBGL_blend_func_extended", "WEBGL_compressed_texture_astc", "WEBGL_compressed_texture_etc", "WEBGL_compressed_texture_etc1", "WEBGL_compressed_texture_s3tc", "WEBGL_compressed_texture_s3tc_srgb", "WEBGL_debug_renderer_info", "WEBGL_debug_shaders", "WEBGL_lose_context", "WEBGL_multi_draw", "WEBGL_polygon_mode" ];
  // .getSupportedExtensions() can return null if context is lost, so coerce to empty array.
  return (ctx.getSupportedExtensions() || []).filter(ext => supportedExtensions.includes(ext));
};

var registerPreMainLoop = f => {
  // Does nothing unless $MainLoop is included/used.
  typeof MainLoop != "undefined" && MainLoop.preMainLoop.push(f);
};

var GL = {
  counter: 1,
  buffers: [],
  mappedBuffers: {},
  programs: [],
  framebuffers: [],
  renderbuffers: [],
  textures: [],
  shaders: [],
  vaos: [],
  contexts: [],
  offscreenCanvases: {},
  queries: [],
  samplers: [],
  transformFeedbacks: [],
  syncs: [],
  byteSizeByTypeRoot: 5120,
  byteSizeByType: [ 1, 1, 2, 2, 4, 4, 4, 2, 3, 4, 8 ],
  stringCache: {},
  stringiCache: {},
  unpackAlignment: 4,
  unpackRowLength: 0,
  recordError: errorCode => {
    if (!GL.lastError) {
      GL.lastError = errorCode;
    }
  },
  getNewId: table => {
    var ret = GL.counter++;
    for (var i = table.length; i < ret; i++) {
      table[i] = null;
    }
    // Skip over any non-null elements that might have been created by
    // glBindBuffer.
    while (table[ret]) {
      ret = GL.counter++;
    }
    return ret;
  },
  genObject: (n, buffers, createFunction, objectTable) => {
    for (var i = 0; i < n; i++) {
      var buffer = GLctx[createFunction]();
      var id = buffer && GL.getNewId(objectTable);
      if (buffer) {
        buffer.name = id;
        objectTable[id] = buffer;
      } else {
        GL.recordError(1282);
      }
      HEAP32[(((buffers) + (i * 4)) >>> 2) >>> 0] = id;
    }
  },
  MAX_TEMP_BUFFER_SIZE: 2097152,
  numTempVertexBuffersPerSize: 64,
  log2ceilLookup: i => 32 - Math.clz32(i === 0 ? 0 : i - 1),
  generateTempBuffers: (quads, context) => {
    var largestIndex = GL.log2ceilLookup(GL.MAX_TEMP_BUFFER_SIZE);
    context.tempVertexBufferCounters1 = [];
    context.tempVertexBufferCounters2 = [];
    context.tempVertexBufferCounters1.length = context.tempVertexBufferCounters2.length = largestIndex + 1;
    context.tempVertexBuffers1 = [];
    context.tempVertexBuffers2 = [];
    context.tempVertexBuffers1.length = context.tempVertexBuffers2.length = largestIndex + 1;
    context.tempIndexBuffers = [];
    context.tempIndexBuffers.length = largestIndex + 1;
    for (var i = 0; i <= largestIndex; ++i) {
      context.tempIndexBuffers[i] = null;
      // Created on-demand
      context.tempVertexBufferCounters1[i] = context.tempVertexBufferCounters2[i] = 0;
      var ringbufferLength = GL.numTempVertexBuffersPerSize;
      context.tempVertexBuffers1[i] = [];
      context.tempVertexBuffers2[i] = [];
      var ringbuffer1 = context.tempVertexBuffers1[i];
      var ringbuffer2 = context.tempVertexBuffers2[i];
      ringbuffer1.length = ringbuffer2.length = ringbufferLength;
      for (var j = 0; j < ringbufferLength; ++j) {
        ringbuffer1[j] = ringbuffer2[j] = null;
      }
    }
    if (quads) {
      // GL_QUAD indexes can be precalculated
      context.tempQuadIndexBuffer = GLctx.createBuffer();
      context.GLctx.bindBuffer(34963, context.tempQuadIndexBuffer);
      var numIndexes = GL.MAX_TEMP_BUFFER_SIZE >> 1;
      var quadIndexes = new Uint16Array(numIndexes);
      var i = 0, v = 0;
      while (1) {
        quadIndexes[i++] = v;
        if (i >= numIndexes) break;
        quadIndexes[i++] = v + 1;
        if (i >= numIndexes) break;
        quadIndexes[i++] = v + 2;
        if (i >= numIndexes) break;
        quadIndexes[i++] = v;
        if (i >= numIndexes) break;
        quadIndexes[i++] = v + 2;
        if (i >= numIndexes) break;
        quadIndexes[i++] = v + 3;
        if (i >= numIndexes) break;
        v += 4;
      }
      context.GLctx.bufferData(34963, quadIndexes, 35044);
      context.GLctx.bindBuffer(34963, null);
    }
  },
  getTempVertexBuffer: sizeBytes => {
    var idx = GL.log2ceilLookup(sizeBytes);
    var ringbuffer = GL.currentContext.tempVertexBuffers1[idx];
    var nextFreeBufferIndex = GL.currentContext.tempVertexBufferCounters1[idx];
    GL.currentContext.tempVertexBufferCounters1[idx] = (GL.currentContext.tempVertexBufferCounters1[idx] + 1) & (GL.numTempVertexBuffersPerSize - 1);
    var vbo = ringbuffer[nextFreeBufferIndex];
    if (vbo) {
      return vbo;
    }
    var prevVBO = GLctx.getParameter(34964);
    ringbuffer[nextFreeBufferIndex] = GLctx.createBuffer();
    GLctx.bindBuffer(34962, ringbuffer[nextFreeBufferIndex]);
    GLctx.bufferData(34962, 1 << idx, 35048);
    GLctx.bindBuffer(34962, prevVBO);
    return ringbuffer[nextFreeBufferIndex];
  },
  getTempIndexBuffer: sizeBytes => {
    var idx = GL.log2ceilLookup(sizeBytes);
    var ibo = GL.currentContext.tempIndexBuffers[idx];
    if (ibo) {
      return ibo;
    }
    var prevIBO = GLctx.getParameter(34965);
    GL.currentContext.tempIndexBuffers[idx] = GLctx.createBuffer();
    GLctx.bindBuffer(34963, GL.currentContext.tempIndexBuffers[idx]);
    GLctx.bufferData(34963, 1 << idx, 35048);
    GLctx.bindBuffer(34963, prevIBO);
    return GL.currentContext.tempIndexBuffers[idx];
  },
  newRenderingFrameStarted: () => {
    if (!GL.currentContext) {
      return;
    }
    var vb = GL.currentContext.tempVertexBuffers1;
    GL.currentContext.tempVertexBuffers1 = GL.currentContext.tempVertexBuffers2;
    GL.currentContext.tempVertexBuffers2 = vb;
    vb = GL.currentContext.tempVertexBufferCounters1;
    GL.currentContext.tempVertexBufferCounters1 = GL.currentContext.tempVertexBufferCounters2;
    GL.currentContext.tempVertexBufferCounters2 = vb;
    var largestIndex = GL.log2ceilLookup(GL.MAX_TEMP_BUFFER_SIZE);
    for (var i = 0; i <= largestIndex; ++i) {
      GL.currentContext.tempVertexBufferCounters1[i] = 0;
    }
  },
  getSource: (shader, count, string, length) => {
    var source = "";
    for (var i = 0; i < count; ++i) {
      var len = length ? HEAPU32[(((length) + (i * 4)) >>> 2) >>> 0] : undefined;
      source += UTF8ToString(HEAPU32[(((string) + (i * 4)) >>> 2) >>> 0], len);
    }
    return source;
  },
  calcBufLength: (size, type, stride, count) => {
    if (stride > 0) {
      return count * stride;
    }
    var typeSize = GL.byteSizeByType[type - GL.byteSizeByTypeRoot];
    return size * typeSize * count;
  },
  usedTempBuffers: [],
  preDrawHandleClientVertexAttribBindings: count => {
    GL.resetBufferBinding = false;
    // TODO: initial pass to detect ranges we need to upload, might not need
    // an upload per attrib
    for (var i = 0; i < GL.currentContext.maxVertexAttribs; ++i) {
      var cb = GL.currentContext.clientBuffers[i];
      if (!cb.clientside || !cb.enabled) continue;
      GL.resetBufferBinding = true;
      var size = GL.calcBufLength(cb.size, cb.type, cb.stride, count);
      var buf = GL.getTempVertexBuffer(size);
      GLctx.bindBuffer(34962, buf);
      GLctx.bufferSubData(34962, 0, HEAPU8.subarray(cb.ptr >>> 0, cb.ptr + size >>> 0));
      cb.vertexAttribPointerAdaptor.call(GLctx, i, cb.size, cb.type, cb.normalized, cb.stride, 0);
    }
  },
  postDrawHandleClientVertexAttribBindings: () => {
    if (GL.resetBufferBinding) {
      GLctx.bindBuffer(34962, GL.buffers[GLctx.currentArrayBufferBinding]);
    }
  },
  createContext: (/** @type {HTMLCanvasElement} */ canvas, webGLContextAttributes) => {
    // BUG: Workaround Safari WebGL issue: After successfully acquiring WebGL
    // context on a canvas, calling .getContext() will always return that
    // context independent of which 'webgl' or 'webgl2'
    // context version was passed. See:
    //   https://webkit.org/b/222758
    // and:
    //   https://github.com/emscripten-core/emscripten/issues/13295.
    // TODO: Once the bug is fixed and shipped in Safari, adjust the Safari
    // version field in above check.
    if (!canvas.getContextSafariWebGL2Fixed) {
      canvas.getContextSafariWebGL2Fixed = canvas.getContext;
      /** @type {function(this:HTMLCanvasElement, string, (Object|null)=): (Object|null)} */ function fixedGetContext(ver, attrs) {
        var gl = canvas.getContextSafariWebGL2Fixed(ver, attrs);
        return ((ver == "webgl") == (gl instanceof WebGLRenderingContext)) ? gl : null;
      }
      canvas.getContext = fixedGetContext;
    }
    var ctx = canvas.getContext("webgl2", webGLContextAttributes);
    if (!ctx) return 0;
    var handle = GL.registerContext(ctx, webGLContextAttributes);
    return handle;
  },
  registerContext: (ctx, webGLContextAttributes) => {
    // without pthreads a context is just an integer ID
    var handle = GL.getNewId(GL.contexts);
    var context = {
      handle,
      attributes: webGLContextAttributes,
      version: webGLContextAttributes.majorVersion,
      GLctx: ctx
    };
    // Store the created context object so that we can access the context
    // given a canvas without having to pass the parameters again.
    if (ctx.canvas) ctx.canvas.GLctxObject = context;
    GL.contexts[handle] = context;
    if (typeof webGLContextAttributes.enableExtensionsByDefault == "undefined" || webGLContextAttributes.enableExtensionsByDefault) {
      GL.initExtensions(context);
    }
    context.maxVertexAttribs = context.GLctx.getParameter(34921);
    context.clientBuffers = [];
    for (var i = 0; i < context.maxVertexAttribs; i++) {
      context.clientBuffers[i] = {
        enabled: false,
        clientside: false,
        size: 0,
        type: 0,
        normalized: 0,
        stride: 0,
        ptr: 0,
        vertexAttribPointerAdaptor: null
      };
    }
    GL.generateTempBuffers(false, context);
    return handle;
  },
  makeContextCurrent: contextHandle => {
    // Active Emscripten GL layer context object.
    GL.currentContext = GL.contexts[contextHandle];
    // Active WebGL context object.
    Module["ctx"] = GLctx = GL.currentContext?.GLctx;
    return !(contextHandle && !GLctx);
  },
  getContext: contextHandle => GL.contexts[contextHandle],
  deleteContext: contextHandle => {
    if (GL.currentContext === GL.contexts[contextHandle]) {
      GL.currentContext = null;
    }
    if (typeof JSEvents == "object") {
      // Release all JS event handlers on the DOM element that the GL context is
      // associated with since the context is now deleted.
      JSEvents.removeAllHandlersOnTarget(GL.contexts[contextHandle].GLctx.canvas);
    }
    // Make sure the canvas object no longer refers to the context object so
    // there are no GC surprises.
    if (GL.contexts[contextHandle]?.GLctx.canvas) {
      GL.contexts[contextHandle].GLctx.canvas.GLctxObject = undefined;
    }
    GL.contexts[contextHandle] = null;
  },
  initExtensions: context => {
    // If this function is called without a specific context object, init the
    // extensions of the currently active context.
    context ||= GL.currentContext;
    if (context.initExtensionsDone) return;
    context.initExtensionsDone = true;
    var GLctx = context.GLctx;
    // Detect the presence of a few extensions manually, since the GL interop
    // layer itself will need to know if they exist.
    // Extensions that are available in both WebGL 1 and WebGL 2
    webgl_enable_WEBGL_multi_draw(GLctx);
    webgl_enable_EXT_polygon_offset_clamp(GLctx);
    webgl_enable_EXT_clip_control(GLctx);
    webgl_enable_WEBGL_polygon_mode(GLctx);
    // Extensions that are available from WebGL >= 2 (no-op if called on a WebGL 1 context active)
    webgl_enable_WEBGL_draw_instanced_base_vertex_base_instance(GLctx);
    webgl_enable_WEBGL_multi_draw_instanced_base_vertex_base_instance(GLctx);
    // On WebGL 2, EXT_disjoint_timer_query is replaced with an alternative
    // that's based on core APIs, and exposes only the queryCounterEXT()
    // entrypoint.
    if (context.version >= 2) {
      GLctx.disjointTimerQueryExt = GLctx.getExtension("EXT_disjoint_timer_query_webgl2");
    }
    // However, Firefox exposes the WebGL 1 version on WebGL 2 as well and
    // thus we look for the WebGL 1 version again if the WebGL 2 version
    // isn't present. https://bugzil.la/1328882
    if (context.version < 2 || !GLctx.disjointTimerQueryExt) {
      GLctx.disjointTimerQueryExt = GLctx.getExtension("EXT_disjoint_timer_query");
    }
    for (var ext of getEmscriptenSupportedExtensions(GLctx)) {
      // WEBGL_lose_context, WEBGL_debug_renderer_info and WEBGL_debug_shaders
      // are not enabled by default.
      if (!ext.includes("lose_context") && !ext.includes("debug")) {
        // Call .getExtension() to enable that extension permanently.
        GLctx.getExtension(ext);
      }
    }
  }
};

var _emscripten_glActiveTexture = x0 => GLctx.activeTexture(x0);

var _emscripten_glAttachShader = (program, shader) => {
  GLctx.attachShader(GL.programs[program], GL.shaders[shader]);
};

var _emscripten_glBeginQuery = (target, id) => {
  GLctx.beginQuery(target, GL.queries[id]);
};

var _emscripten_glBeginQueryEXT = (target, id) => {
  GLctx.disjointTimerQueryExt["beginQueryEXT"](target, GL.queries[id]);
};

var _emscripten_glBeginTransformFeedback = x0 => GLctx.beginTransformFeedback(x0);

function _emscripten_glBindAttribLocation(program, index, name) {
  name >>>= 0;
  GLctx.bindAttribLocation(GL.programs[program], index, UTF8ToString(name));
}

var _emscripten_glBindBuffer = (target, buffer) => {
  // Calling glBindBuffer with an unknown buffer will implicitly create a
  // new one.  Here we bypass `GL.counter` and directly using the ID passed
  // in.
  if (buffer && !GL.buffers[buffer]) {
    var b = GLctx.createBuffer();
    b.name = buffer;
    GL.buffers[buffer] = b;
  }
  if (target == 34962) {
    GLctx.currentArrayBufferBinding = buffer;
  } else if (target == 34963) {
    GLctx.currentElementArrayBufferBinding = buffer;
  }
  if (target == 35051) {
    // In WebGL 2 glReadPixels entry point, we need to use a different WebGL 2
    // API function call when a buffer is bound to
    // GL_PIXEL_PACK_BUFFER_BINDING point, so must keep track whether that
    // binding point is non-null to know what is the proper API function to
    // call.
    GLctx.currentPixelPackBufferBinding = buffer;
  } else if (target == 35052) {
    // In WebGL 2 gl(Compressed)Tex(Sub)Image[23]D entry points, we need to
    // use a different WebGL 2 API function call when a buffer is bound to
    // GL_PIXEL_UNPACK_BUFFER_BINDING point, so must keep track whether that
    // binding point is non-null to know what is the proper API function to
    // call.
    GLctx.currentPixelUnpackBufferBinding = buffer;
  }
  GLctx.bindBuffer(target, GL.buffers[buffer]);
};

var _emscripten_glBindBufferBase = (target, index, buffer) => {
  GLctx.bindBufferBase(target, index, GL.buffers[buffer]);
};

function _emscripten_glBindBufferRange(target, index, buffer, offset, ptrsize) {
  offset >>>= 0;
  ptrsize >>>= 0;
  GLctx.bindBufferRange(target, index, GL.buffers[buffer], offset, ptrsize);
}

var _emscripten_glBindFramebuffer = (target, framebuffer) => {
  GLctx.bindFramebuffer(target, GL.framebuffers[framebuffer]);
};

var _emscripten_glBindRenderbuffer = (target, renderbuffer) => {
  GLctx.bindRenderbuffer(target, GL.renderbuffers[renderbuffer]);
};

var _emscripten_glBindSampler = (unit, sampler) => {
  GLctx.bindSampler(unit, GL.samplers[sampler]);
};

var _emscripten_glBindTexture = (target, texture) => {
  GLctx.bindTexture(target, GL.textures[texture]);
};

var _emscripten_glBindTransformFeedback = (target, id) => {
  GLctx.bindTransformFeedback(target, GL.transformFeedbacks[id]);
};

var _emscripten_glBindVertexArray = vao => {
  GLctx.bindVertexArray(GL.vaos[vao]);
  var ibo = GLctx.getParameter(34965);
  GLctx.currentElementArrayBufferBinding = ibo ? (ibo.name | 0) : 0;
};

var _glBindVertexArray = _emscripten_glBindVertexArray;

var _emscripten_glBindVertexArrayOES = _glBindVertexArray;

var _emscripten_glBlendColor = (x0, x1, x2, x3) => GLctx.blendColor(x0, x1, x2, x3);

var _emscripten_glBlendEquation = x0 => GLctx.blendEquation(x0);

var _emscripten_glBlendEquationSeparate = (x0, x1) => GLctx.blendEquationSeparate(x0, x1);

var _emscripten_glBlendFunc = (x0, x1) => GLctx.blendFunc(x0, x1);

var _emscripten_glBlendFuncSeparate = (x0, x1, x2, x3) => GLctx.blendFuncSeparate(x0, x1, x2, x3);

var _emscripten_glBlitFramebuffer = (x0, x1, x2, x3, x4, x5, x6, x7, x8, x9) => GLctx.blitFramebuffer(x0, x1, x2, x3, x4, x5, x6, x7, x8, x9);

function _emscripten_glBufferData(target, size, data, usage) {
  size >>>= 0;
  data >>>= 0;
  // N.b. here first form specifies a heap subarray, second form an integer
  // size, so the ?: code here is polymorphic. It is advised to avoid
  // randomly mixing both uses in calling code, to avoid any potential JS
  // engine JIT issues.
  GLctx.bufferData(target, data ? HEAPU8.subarray(data >>> 0, data + size >>> 0) : size, usage);
}

function _emscripten_glBufferSubData(target, offset, size, data) {
  offset >>>= 0;
  size >>>= 0;
  data >>>= 0;
  GLctx.bufferSubData(target, offset, HEAPU8.subarray(data >>> 0, data + size >>> 0));
}

var _emscripten_glCheckFramebufferStatus = x0 => GLctx.checkFramebufferStatus(x0);

var _emscripten_glClear = x0 => GLctx.clear(x0);

var _emscripten_glClearBufferfi = (x0, x1, x2, x3) => GLctx.clearBufferfi(x0, x1, x2, x3);

function _emscripten_glClearBufferfv(buffer, drawbuffer, value) {
  value >>>= 0;
  GLctx.clearBufferfv(buffer, drawbuffer, HEAPF32, ((value) >>> 2));
}

function _emscripten_glClearBufferiv(buffer, drawbuffer, value) {
  value >>>= 0;
  GLctx.clearBufferiv(buffer, drawbuffer, HEAP32, ((value) >>> 2));
}

function _emscripten_glClearBufferuiv(buffer, drawbuffer, value) {
  value >>>= 0;
  GLctx.clearBufferuiv(buffer, drawbuffer, HEAPU32, ((value) >>> 2));
}

var _emscripten_glClearColor = (x0, x1, x2, x3) => GLctx.clearColor(x0, x1, x2, x3);

var _emscripten_glClearDepthf = x0 => GLctx.clearDepth(x0);

var _emscripten_glClearStencil = x0 => GLctx.clearStencil(x0);

function _emscripten_glClientWaitSync(sync, flags, timeout) {
  sync >>>= 0;
  // WebGL2 vs GLES3 differences: in GLES3, the timeout parameter is a uint64, where 0xFFFFFFFFFFFFFFFFULL means GL_TIMEOUT_IGNORED.
  // In JS, there's no 64-bit value types, so instead timeout is taken to be signed, and GL_TIMEOUT_IGNORED is given value -1.
  // Inherently the value accepted in the timeout is lossy, and can't take in arbitrary u64 bit pattern (but most likely doesn't matter)
  // See https://www.khronos.org/registry/webgl/specs/latest/2.0/#5.15
  timeout = Number(timeout);
  return GLctx.clientWaitSync(GL.syncs[sync], flags, timeout);
}

var _emscripten_glClipControlEXT = (origin, depth) => {
  GLctx.extClipControl["clipControlEXT"](origin, depth);
};

var _emscripten_glColorMask = (red, green, blue, alpha) => {
  GLctx.colorMask(!!red, !!green, !!blue, !!alpha);
};

var _emscripten_glCompileShader = shader => {
  GLctx.compileShader(GL.shaders[shader]);
};

function _emscripten_glCompressedTexImage2D(target, level, internalFormat, width, height, border, imageSize, data) {
  data >>>= 0;
  // `data` may be null here, which means "allocate uninitialized space but
  // don't upload" in GLES parlance, but `compressedTexImage2D` requires the
  // final data parameter, so we simply pass a heap view starting at zero
  // effectively uploading whatever happens to be near address zero.  See
  // https://github.com/emscripten-core/emscripten/issues/19300.
  if (true) {
    if (GLctx.currentPixelUnpackBufferBinding || !imageSize) {
      GLctx.compressedTexImage2D(target, level, internalFormat, width, height, border, imageSize, data);
      return;
    }
  }
  GLctx.compressedTexImage2D(target, level, internalFormat, width, height, border, HEAPU8.subarray((data) >>> 0, data + imageSize >>> 0));
}

function _emscripten_glCompressedTexImage3D(target, level, internalFormat, width, height, depth, border, imageSize, data) {
  data >>>= 0;
  if (GLctx.currentPixelUnpackBufferBinding) {
    GLctx.compressedTexImage3D(target, level, internalFormat, width, height, depth, border, imageSize, data);
  } else {
    GLctx.compressedTexImage3D(target, level, internalFormat, width, height, depth, border, HEAPU8, data, imageSize);
  }
}

function _emscripten_glCompressedTexSubImage2D(target, level, xoffset, yoffset, width, height, format, imageSize, data) {
  data >>>= 0;
  if (true) {
    if (GLctx.currentPixelUnpackBufferBinding || !imageSize) {
      GLctx.compressedTexSubImage2D(target, level, xoffset, yoffset, width, height, format, imageSize, data);
      return;
    }
  }
  GLctx.compressedTexSubImage2D(target, level, xoffset, yoffset, width, height, format, HEAPU8.subarray((data) >>> 0, data + imageSize >>> 0));
}

function _emscripten_glCompressedTexSubImage3D(target, level, xoffset, yoffset, zoffset, width, height, depth, format, imageSize, data) {
  data >>>= 0;
  if (GLctx.currentPixelUnpackBufferBinding) {
    GLctx.compressedTexSubImage3D(target, level, xoffset, yoffset, zoffset, width, height, depth, format, imageSize, data);
  } else {
    GLctx.compressedTexSubImage3D(target, level, xoffset, yoffset, zoffset, width, height, depth, format, HEAPU8, data, imageSize);
  }
}

function _emscripten_glCopyBufferSubData(x0, x1, x2, x3, x4) {
  x2 >>>= 0;
  x3 >>>= 0;
  x4 >>>= 0;
  return GLctx.copyBufferSubData(x0, x1, x2, x3, x4);
}

var _emscripten_glCopyTexImage2D = (x0, x1, x2, x3, x4, x5, x6, x7) => GLctx.copyTexImage2D(x0, x1, x2, x3, x4, x5, x6, x7);

var _emscripten_glCopyTexSubImage2D = (x0, x1, x2, x3, x4, x5, x6, x7) => GLctx.copyTexSubImage2D(x0, x1, x2, x3, x4, x5, x6, x7);

var _emscripten_glCopyTexSubImage3D = (x0, x1, x2, x3, x4, x5, x6, x7, x8) => GLctx.copyTexSubImage3D(x0, x1, x2, x3, x4, x5, x6, x7, x8);

var _emscripten_glCreateProgram = () => {
  var id = GL.getNewId(GL.programs);
  var program = GLctx.createProgram();
  // Store additional information needed for each shader program:
  program.name = id;
  // Lazy cache results of
  // glGetProgramiv(GL_ACTIVE_UNIFORM_MAX_LENGTH/GL_ACTIVE_ATTRIBUTE_MAX_LENGTH/GL_ACTIVE_UNIFORM_BLOCK_MAX_NAME_LENGTH)
  program.maxUniformLength = program.maxAttributeLength = program.maxUniformBlockNameLength = 0;
  program.uniformIdCounter = 1;
  GL.programs[id] = program;
  return id;
};

var _emscripten_glCreateShader = shaderType => {
  var id = GL.getNewId(GL.shaders);
  GL.shaders[id] = GLctx.createShader(shaderType);
  return id;
};

var _emscripten_glCullFace = x0 => GLctx.cullFace(x0);

function _emscripten_glDeleteBuffers(n, buffers) {
  buffers >>>= 0;
  for (var i = 0; i < n; i++) {
    var id = HEAP32[(((buffers) + (i * 4)) >>> 2) >>> 0];
    var buffer = GL.buffers[id];
    // From spec: "glDeleteBuffers silently ignores 0's and names that do not
    // correspond to existing buffer objects."
    if (!buffer) continue;
    GLctx.deleteBuffer(buffer);
    buffer.name = 0;
    GL.buffers[id] = null;
    if (id == GLctx.currentArrayBufferBinding) GLctx.currentArrayBufferBinding = 0;
    if (id == GLctx.currentElementArrayBufferBinding) GLctx.currentElementArrayBufferBinding = 0;
    if (id == GLctx.currentPixelPackBufferBinding) GLctx.currentPixelPackBufferBinding = 0;
    if (id == GLctx.currentPixelUnpackBufferBinding) GLctx.currentPixelUnpackBufferBinding = 0;
  }
}

function _emscripten_glDeleteFramebuffers(n, framebuffers) {
  framebuffers >>>= 0;
  for (var i = 0; i < n; ++i) {
    var id = HEAP32[(((framebuffers) + (i * 4)) >>> 2) >>> 0];
    var framebuffer = GL.framebuffers[id];
    if (!framebuffer) continue;
    // GL spec: "glDeleteFramebuffers silently ignores 0s and names that do not correspond to existing framebuffer objects".
    GLctx.deleteFramebuffer(framebuffer);
    framebuffer.name = 0;
    GL.framebuffers[id] = null;
  }
}

var _emscripten_glDeleteProgram = id => {
  if (!id) return;
  var program = GL.programs[id];
  if (!program) {
    // glDeleteProgram actually signals an error when deleting a nonexisting
    // object, unlike some other GL delete functions.
    GL.recordError(1281);
    return;
  }
  GLctx.deleteProgram(program);
  program.name = 0;
  GL.programs[id] = null;
};

function _emscripten_glDeleteQueries(n, ids) {
  ids >>>= 0;
  for (var i = 0; i < n; i++) {
    var id = HEAP32[(((ids) + (i * 4)) >>> 2) >>> 0];
    var query = GL.queries[id];
    if (!query) continue;
    // GL spec: "unused names in ids are ignored, as is the name zero."
    GLctx.deleteQuery(query);
    GL.queries[id] = null;
  }
}

function _emscripten_glDeleteQueriesEXT(n, ids) {
  ids >>>= 0;
  for (var i = 0; i < n; i++) {
    var id = HEAP32[(((ids) + (i * 4)) >>> 2) >>> 0];
    var query = GL.queries[id];
    if (!query) continue;
    // GL spec: "unused names in ids are ignored, as is the name zero."
    GLctx.disjointTimerQueryExt["deleteQueryEXT"](query);
    GL.queries[id] = null;
  }
}

function _emscripten_glDeleteRenderbuffers(n, renderbuffers) {
  renderbuffers >>>= 0;
  for (var i = 0; i < n; i++) {
    var id = HEAP32[(((renderbuffers) + (i * 4)) >>> 2) >>> 0];
    var renderbuffer = GL.renderbuffers[id];
    if (!renderbuffer) continue;
    // GL spec: "glDeleteRenderbuffers silently ignores 0s and names that do not correspond to existing renderbuffer objects".
    GLctx.deleteRenderbuffer(renderbuffer);
    renderbuffer.name = 0;
    GL.renderbuffers[id] = null;
  }
}

function _emscripten_glDeleteSamplers(n, samplers) {
  samplers >>>= 0;
  for (var i = 0; i < n; i++) {
    var id = HEAP32[(((samplers) + (i * 4)) >>> 2) >>> 0];
    var sampler = GL.samplers[id];
    if (!sampler) continue;
    GLctx.deleteSampler(sampler);
    sampler.name = 0;
    GL.samplers[id] = null;
  }
}

var _emscripten_glDeleteShader = id => {
  if (!id) return;
  var shader = GL.shaders[id];
  if (!shader) {
    // glDeleteShader actually signals an error when deleting a nonexisting
    // object, unlike some other GL delete functions.
    GL.recordError(1281);
    return;
  }
  GLctx.deleteShader(shader);
  GL.shaders[id] = null;
};

function _emscripten_glDeleteSync(id) {
  id >>>= 0;
  if (!id) return;
  var sync = GL.syncs[id];
  if (!sync) {
    // glDeleteSync signals an error when deleting a nonexisting object, unlike some other GL delete functions.
    GL.recordError(1281);
    return;
  }
  GLctx.deleteSync(sync);
  sync.name = 0;
  GL.syncs[id] = null;
}

function _emscripten_glDeleteTextures(n, textures) {
  textures >>>= 0;
  for (var i = 0; i < n; i++) {
    var id = HEAP32[(((textures) + (i * 4)) >>> 2) >>> 0];
    var texture = GL.textures[id];
    // GL spec: "glDeleteTextures silently ignores 0s and names that do not
    // correspond to existing textures".
    if (!texture) continue;
    GLctx.deleteTexture(texture);
    texture.name = 0;
    GL.textures[id] = null;
  }
}

function _emscripten_glDeleteTransformFeedbacks(n, ids) {
  ids >>>= 0;
  for (var i = 0; i < n; i++) {
    var id = HEAP32[(((ids) + (i * 4)) >>> 2) >>> 0];
    var transformFeedback = GL.transformFeedbacks[id];
    if (!transformFeedback) continue;
    // GL spec: "unused names in ids are ignored, as is the name zero."
    GLctx.deleteTransformFeedback(transformFeedback);
    transformFeedback.name = 0;
    GL.transformFeedbacks[id] = null;
  }
}

function _emscripten_glDeleteVertexArrays(n, vaos) {
  vaos >>>= 0;
  for (var i = 0; i < n; i++) {
    var id = HEAP32[(((vaos) + (i * 4)) >>> 2) >>> 0];
    GLctx.deleteVertexArray(GL.vaos[id]);
    GL.vaos[id] = null;
  }
}

var _glDeleteVertexArrays = _emscripten_glDeleteVertexArrays;

var _emscripten_glDeleteVertexArraysOES = _glDeleteVertexArrays;

var _emscripten_glDepthFunc = x0 => GLctx.depthFunc(x0);

var _emscripten_glDepthMask = flag => {
  GLctx.depthMask(!!flag);
};

var _emscripten_glDepthRangef = (x0, x1) => GLctx.depthRange(x0, x1);

var _emscripten_glDetachShader = (program, shader) => {
  GLctx.detachShader(GL.programs[program], GL.shaders[shader]);
};

var _emscripten_glDisable = x0 => GLctx.disable(x0);

var _emscripten_glDisableVertexAttribArray = index => {
  var cb = GL.currentContext.clientBuffers[index];
  cb.enabled = false;
  GLctx.disableVertexAttribArray(index);
};

var _emscripten_glDrawArrays = (mode, first, count) => {
  // bind any client-side buffers
  GL.preDrawHandleClientVertexAttribBindings(first + count);
  GLctx.drawArrays(mode, first, count);
  GL.postDrawHandleClientVertexAttribBindings();
};

var _emscripten_glDrawArraysInstanced = (mode, first, count, primcount) => {
  GLctx.drawArraysInstanced(mode, first, count, primcount);
};

var _glDrawArraysInstanced = _emscripten_glDrawArraysInstanced;

var _emscripten_glDrawArraysInstancedANGLE = _glDrawArraysInstanced;

var _emscripten_glDrawArraysInstancedARB = _glDrawArraysInstanced;

var _emscripten_glDrawArraysInstancedEXT = _glDrawArraysInstanced;

var _emscripten_glDrawArraysInstancedNV = _glDrawArraysInstanced;

var tempFixedLengthArray = [];

function _emscripten_glDrawBuffers(n, bufs) {
  bufs >>>= 0;
  var bufArray = tempFixedLengthArray[n];
  for (var i = 0; i < n; i++) {
    bufArray[i] = HEAP32[(((bufs) + (i * 4)) >>> 2) >>> 0];
  }
  GLctx.drawBuffers(bufArray);
}

var _glDrawBuffers = _emscripten_glDrawBuffers;

var _emscripten_glDrawBuffersEXT = _glDrawBuffers;

var _emscripten_glDrawBuffersWEBGL = _glDrawBuffers;

function _emscripten_glDrawElements(mode, count, type, indices) {
  indices >>>= 0;
  var buf;
  var vertexes = 0;
  if (!GLctx.currentElementArrayBufferBinding) {
    var size = GL.calcBufLength(1, type, 0, count);
    buf = GL.getTempIndexBuffer(size);
    GLctx.bindBuffer(34963, buf);
    GLctx.bufferSubData(34963, 0, HEAPU8.subarray(indices >>> 0, indices + size >>> 0));
    // Calculating vertex count if shader's attribute data is on client side
    if (count > 0) {
      for (var i = 0; i < GL.currentContext.maxVertexAttribs; ++i) {
        var cb = GL.currentContext.clientBuffers[i];
        if (cb.clientside && cb.enabled) {
          let arrayClass;
          switch (type) {
           case 5121:
            arrayClass = Uint8Array;
            break;

           case 5123:
            arrayClass = Uint16Array;
            break;

           case 5125:
            arrayClass = Uint32Array;
            break;

           default:
            GL.recordError(1282);
            return;
          }
          vertexes = new arrayClass(HEAPU8.buffer, indices, count).reduce((max, current) => Math.max(max, current)) + 1;
          break;
        }
      }
    }
    // the index is now 0
    indices = 0;
  }
  // bind any client-side buffers
  GL.preDrawHandleClientVertexAttribBindings(vertexes);
  GLctx.drawElements(mode, count, type, indices);
  GL.postDrawHandleClientVertexAttribBindings(count);
  if (!GLctx.currentElementArrayBufferBinding) {
    GLctx.bindBuffer(34963, null);
  }
}

function _emscripten_glDrawElementsInstanced(mode, count, type, indices, primcount) {
  indices >>>= 0;
  GLctx.drawElementsInstanced(mode, count, type, indices, primcount);
}

var _glDrawElementsInstanced = _emscripten_glDrawElementsInstanced;

var _emscripten_glDrawElementsInstancedANGLE = _glDrawElementsInstanced;

var _emscripten_glDrawElementsInstancedARB = _glDrawElementsInstanced;

var _emscripten_glDrawElementsInstancedEXT = _glDrawElementsInstanced;

var _emscripten_glDrawElementsInstancedNV = _glDrawElementsInstanced;

var _glDrawElements = _emscripten_glDrawElements;

function _emscripten_glDrawRangeElements(mode, start, end, count, type, indices) {
  indices >>>= 0;
  // TODO: This should be a trivial pass-through function registered at the bottom of this page as
  // glFuncs[6][1] += ' drawRangeElements';
  // but due to https://bugzil.la/1202427,
  // we work around by ignoring the range.
  _glDrawElements(mode, count, type, indices);
}

var _emscripten_glEnable = x0 => GLctx.enable(x0);

var _emscripten_glEnableVertexAttribArray = index => {
  var cb = GL.currentContext.clientBuffers[index];
  cb.enabled = true;
  GLctx.enableVertexAttribArray(index);
};

var _emscripten_glEndQuery = x0 => GLctx.endQuery(x0);

var _emscripten_glEndQueryEXT = target => {
  GLctx.disjointTimerQueryExt["endQueryEXT"](target);
};

var _emscripten_glEndTransformFeedback = () => GLctx.endTransformFeedback();

function _emscripten_glFenceSync(condition, flags) {
  var sync = GLctx.fenceSync(condition, flags);
  if (sync) {
    var id = GL.getNewId(GL.syncs);
    sync.name = id;
    GL.syncs[id] = sync;
    return id;
  }
  return 0;
}

var _emscripten_glFinish = () => GLctx.finish();

var _emscripten_glFlush = () => GLctx.flush();

var emscriptenWebGLGetBufferBinding = target => {
  switch (target) {
   case 34962:
    target = 34964;
    break;

   case 34963:
    target = 34965;
    break;

   case 35051:
    target = 35053;
    break;

   case 35052:
    target = 35055;
    break;

   case 35982:
    target = 35983;
    break;

   case 36662:
    target = 36662;
    break;

   case 36663:
    target = 36663;
    break;

   case 35345:
    target = 35368;
    break;
  }
  var buffer = GLctx.getParameter(target);
  if (buffer) return buffer.name | 0; else return 0;
};

var emscriptenWebGLValidateMapBufferTarget = target => {
  switch (target) {
   case 34962:
   // GL_ARRAY_BUFFER
    case 34963:
   // GL_ELEMENT_ARRAY_BUFFER
    case 36662:
   // GL_COPY_READ_BUFFER
    case 36663:
   // GL_COPY_WRITE_BUFFER
    case 35051:
   // GL_PIXEL_PACK_BUFFER
    case 35052:
   // GL_PIXEL_UNPACK_BUFFER
    case 35882:
   // GL_TEXTURE_BUFFER
    case 35982:
   // GL_TRANSFORM_FEEDBACK_BUFFER
    case 35345:
    // GL_UNIFORM_BUFFER
    return true;

   default:
    return false;
  }
};

function _emscripten_glFlushMappedBufferRange(target, offset, length) {
  offset >>>= 0;
  length >>>= 0;
  if (!emscriptenWebGLValidateMapBufferTarget(target)) {
    GL.recordError(1280);
    err("GL_INVALID_ENUM in glFlushMappedBufferRange");
    return;
  }
  var mapping = GL.mappedBuffers[emscriptenWebGLGetBufferBinding(target)];
  if (!mapping) {
    GL.recordError(1282);
    err("buffer was never mapped in glFlushMappedBufferRange");
    return;
  }
  if (!(mapping.access & 16)) {
    GL.recordError(1282);
    err("buffer was not mapped with GL_MAP_FLUSH_EXPLICIT_BIT in glFlushMappedBufferRange");
    return;
  }
  if (offset < 0 || length < 0 || offset + length > mapping.length) {
    GL.recordError(1281);
    err("invalid range in glFlushMappedBufferRange");
    return;
  }
  GLctx.bufferSubData(target, mapping.offset, HEAPU8.subarray(mapping.mem + offset >>> 0, mapping.mem + offset + length >>> 0));
}

var _emscripten_glFramebufferRenderbuffer = (target, attachment, renderbuffertarget, renderbuffer) => {
  GLctx.framebufferRenderbuffer(target, attachment, renderbuffertarget, GL.renderbuffers[renderbuffer]);
};

var _emscripten_glFramebufferTexture2D = (target, attachment, textarget, texture, level) => {
  GLctx.framebufferTexture2D(target, attachment, textarget, GL.textures[texture], level);
};

var _emscripten_glFramebufferTextureLayer = (target, attachment, texture, level, layer) => {
  GLctx.framebufferTextureLayer(target, attachment, GL.textures[texture], level, layer);
};

var _emscripten_glFrontFace = x0 => GLctx.frontFace(x0);

function _emscripten_glGenBuffers(n, buffers) {
  buffers >>>= 0;
  GL.genObject(n, buffers, "createBuffer", GL.buffers);
}

function _emscripten_glGenFramebuffers(n, ids) {
  ids >>>= 0;
  GL.genObject(n, ids, "createFramebuffer", GL.framebuffers);
}

function _emscripten_glGenQueries(n, ids) {
  ids >>>= 0;
  GL.genObject(n, ids, "createQuery", GL.queries);
}

function _emscripten_glGenQueriesEXT(n, ids) {
  ids >>>= 0;
  for (var i = 0; i < n; i++) {
    var query = GLctx.disjointTimerQueryExt["createQueryEXT"]();
    if (!query) {
      GL.recordError(1282);
      while (i < n) HEAP32[(((ids) + (i++ * 4)) >>> 2) >>> 0] = 0;
      return;
    }
    var id = GL.getNewId(GL.queries);
    query.name = id;
    GL.queries[id] = query;
    HEAP32[(((ids) + (i * 4)) >>> 2) >>> 0] = id;
  }
}

function _emscripten_glGenRenderbuffers(n, renderbuffers) {
  renderbuffers >>>= 0;
  GL.genObject(n, renderbuffers, "createRenderbuffer", GL.renderbuffers);
}

function _emscripten_glGenSamplers(n, samplers) {
  samplers >>>= 0;
  GL.genObject(n, samplers, "createSampler", GL.samplers);
}

function _emscripten_glGenTextures(n, textures) {
  textures >>>= 0;
  GL.genObject(n, textures, "createTexture", GL.textures);
}

function _emscripten_glGenTransformFeedbacks(n, ids) {
  ids >>>= 0;
  GL.genObject(n, ids, "createTransformFeedback", GL.transformFeedbacks);
}

function _emscripten_glGenVertexArrays(n, arrays) {
  arrays >>>= 0;
  GL.genObject(n, arrays, "createVertexArray", GL.vaos);
}

var _glGenVertexArrays = _emscripten_glGenVertexArrays;

var _emscripten_glGenVertexArraysOES = _glGenVertexArrays;

var _emscripten_glGenerateMipmap = x0 => GLctx.generateMipmap(x0);

var __glGetActiveAttribOrUniform = (funcName, program, index, bufSize, length, size, type, name) => {
  program = GL.programs[program];
  var info = GLctx[funcName](program, index);
  if (info) {
    // If an error occurs, nothing will be written to length, size and type and name.
    var numBytesWrittenExclNull = name && stringToUTF8(info.name, name, bufSize);
    if (length) HEAP32[((length) >>> 2) >>> 0] = numBytesWrittenExclNull;
    if (size) HEAP32[((size) >>> 2) >>> 0] = info.size;
    if (type) HEAP32[((type) >>> 2) >>> 0] = info.type;
  }
};

function _emscripten_glGetActiveAttrib(program, index, bufSize, length, size, type, name) {
  length >>>= 0;
  size >>>= 0;
  type >>>= 0;
  name >>>= 0;
  return __glGetActiveAttribOrUniform("getActiveAttrib", program, index, bufSize, length, size, type, name);
}

function _emscripten_glGetActiveUniform(program, index, bufSize, length, size, type, name) {
  length >>>= 0;
  size >>>= 0;
  type >>>= 0;
  name >>>= 0;
  return __glGetActiveAttribOrUniform("getActiveUniform", program, index, bufSize, length, size, type, name);
}

function _emscripten_glGetActiveUniformBlockName(program, uniformBlockIndex, bufSize, length, uniformBlockName) {
  length >>>= 0;
  uniformBlockName >>>= 0;
  program = GL.programs[program];
  var result = GLctx.getActiveUniformBlockName(program, uniformBlockIndex);
  if (!result) return;
  // If an error occurs, nothing will be written to uniformBlockName or length.
  if (uniformBlockName && bufSize > 0) {
    var numBytesWrittenExclNull = stringToUTF8(result, uniformBlockName, bufSize);
    if (length) HEAP32[((length) >>> 2) >>> 0] = numBytesWrittenExclNull;
  } else {
    if (length) HEAP32[((length) >>> 2) >>> 0] = 0;
  }
}

function _emscripten_glGetActiveUniformBlockiv(program, uniformBlockIndex, pname, params) {
  params >>>= 0;
  if (!params) {
    // GLES2 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
    // if params == null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  program = GL.programs[program];
  if (pname == 35393) {
    var name = GLctx.getActiveUniformBlockName(program, uniformBlockIndex);
    HEAP32[((params) >>> 2) >>> 0] = name.length + 1;
    return;
  }
  var result = GLctx.getActiveUniformBlockParameter(program, uniformBlockIndex, pname);
  if (result === null) return;
  // If an error occurs, nothing should be written to params.
  if (pname == 35395) {
    for (var i = 0; i < result.length; i++) {
      HEAP32[(((params) + (i * 4)) >>> 2) >>> 0] = result[i];
    }
  } else {
    HEAP32[((params) >>> 2) >>> 0] = result;
  }
}

function _emscripten_glGetActiveUniformsiv(program, uniformCount, uniformIndices, pname, params) {
  uniformIndices >>>= 0;
  params >>>= 0;
  if (!params) {
    // GLES2 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
    // if params == null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  if (uniformCount > 0 && uniformIndices == 0) {
    GL.recordError(1281);
    return;
  }
  program = GL.programs[program];
  var ids = [];
  for (var i = 0; i < uniformCount; i++) {
    ids.push(HEAP32[(((uniformIndices) + (i * 4)) >>> 2) >>> 0]);
  }
  var result = GLctx.getActiveUniforms(program, ids, pname);
  if (!result) return;
  // GL spec: If an error is generated, nothing is written out to params.
  var len = result.length;
  for (var i = 0; i < len; i++) {
    HEAP32[(((params) + (i * 4)) >>> 2) >>> 0] = result[i];
  }
}

function _emscripten_glGetAttachedShaders(program, maxCount, count, shaders) {
  count >>>= 0;
  shaders >>>= 0;
  var result = GLctx.getAttachedShaders(GL.programs[program]);
  var len = result.length;
  if (len > maxCount) {
    len = maxCount;
  }
  HEAP32[((count) >>> 2) >>> 0] = len;
  for (var i = 0; i < len; ++i) {
    var id = GL.shaders.indexOf(result[i]);
    HEAP32[(((shaders) + (i * 4)) >>> 2) >>> 0] = id;
  }
}

function _emscripten_glGetAttribLocation(program, name) {
  name >>>= 0;
  return GLctx.getAttribLocation(GL.programs[program], UTF8ToString(name));
}

var writeI53ToI64 = (ptr, num) => {
  HEAPU32[((ptr) >>> 2) >>> 0] = num;
  var lower = HEAPU32[((ptr) >>> 2) >>> 0];
  HEAPU32[(((ptr) + (4)) >>> 2) >>> 0] = (num - lower) / 4294967296;
};

var webglGetExtensions = () => {
  var exts = getEmscriptenSupportedExtensions(GLctx);
  exts = exts.concat(exts.map(e => "GL_" + e));
  return exts;
};

var emscriptenWebGLGet = (name_, p, type) => {
  // Guard against user passing a null pointer.
  // Note that GLES2 spec does not say anything about how passing a null
  // pointer should be treated.  Testing on desktop core GL 3, the application
  // crashes on glGetIntegerv to a null pointer, but better to report an error
  // instead of doing anything random.
  if (!p) {
    GL.recordError(1281);
    return;
  }
  var ret = undefined;
  switch (name_) {
   // Handle a few trivial GLES values
    case 36346:
    // GL_SHADER_COMPILER
    ret = 1;
    break;

   case 36344:
    // GL_SHADER_BINARY_FORMATS
    if (type != 0 && type != 1) {
      GL.recordError(1280);
    }
    // Do not write anything to the out pointer, since no binary formats are
    // supported.
    return;

   case 34814:
   // GL_NUM_PROGRAM_BINARY_FORMATS
    case 36345:
    // GL_NUM_SHADER_BINARY_FORMATS
    ret = 0;
    break;

   case 34466:
    // GL_NUM_COMPRESSED_TEXTURE_FORMATS
    // WebGL doesn't have GL_NUM_COMPRESSED_TEXTURE_FORMATS (it's obsolete
    // since GL_COMPRESSED_TEXTURE_FORMATS returns a JS array that can be
    // queried for length), so implement it ourselves to allow C++ GLES2
    // code to get the length.
    var formats = GLctx.getParameter(34467);
    ret = formats ? formats.length : 0;
    break;

   case 33309:
    // GL_NUM_EXTENSIONS
    if (GL.currentContext.version < 2) {
      // Calling GLES3/WebGL2 function with a GLES2/WebGL1 context
      GL.recordError(1282);
      return;
    }
    ret = webglGetExtensions().length;
    break;

   case 33307:
   // GL_MAJOR_VERSION
    case 33308:
    // GL_MINOR_VERSION
    if (GL.currentContext.version < 2) {
      GL.recordError(1280);
      // GL_INVALID_ENUM
      return;
    }
    ret = name_ == 33307 ? 3 : 0;
    // return version 3.0
    break;
  }
  if (ret === undefined) {
    var result = GLctx.getParameter(name_);
    switch (typeof result) {
     case "number":
      ret = result;
      break;

     case "boolean":
      ret = result ? 1 : 0;
      break;

     case "string":
      GL.recordError(1280);
      // GL_INVALID_ENUM
      return;

     case "object":
      if (result === null) {
        // null is a valid result for some (e.g., which buffer is bound -
        // perhaps nothing is bound), but otherwise can mean an invalid
        // name_, which we need to report as an error
        switch (name_) {
         case 34964:
         // ARRAY_BUFFER_BINDING
          case 35725:
         // CURRENT_PROGRAM
          case 34965:
         // ELEMENT_ARRAY_BUFFER_BINDING
          case 36006:
         // FRAMEBUFFER_BINDING or DRAW_FRAMEBUFFER_BINDING
          case 36007:
         // RENDERBUFFER_BINDING
          case 32873:
         // TEXTURE_BINDING_2D
          case 34229:
         // WebGL 2 GL_VERTEX_ARRAY_BINDING, or WebGL 1 extension OES_vertex_array_object GL_VERTEX_ARRAY_BINDING_OES
          case 36662:
         // COPY_READ_BUFFER_BINDING or COPY_READ_BUFFER
          case 36663:
         // COPY_WRITE_BUFFER_BINDING or COPY_WRITE_BUFFER
          case 35053:
         // PIXEL_PACK_BUFFER_BINDING
          case 35055:
         // PIXEL_UNPACK_BUFFER_BINDING
          case 36010:
         // READ_FRAMEBUFFER_BINDING
          case 35097:
         // SAMPLER_BINDING
          case 35869:
         // TEXTURE_BINDING_2D_ARRAY
          case 32874:
         // TEXTURE_BINDING_3D
          case 36389:
         // TRANSFORM_FEEDBACK_BINDING
          case 35983:
         // TRANSFORM_FEEDBACK_BUFFER_BINDING
          case 35368:
         // UNIFORM_BUFFER_BINDING
          case 34068:
          {
            // TEXTURE_BINDING_CUBE_MAP
            ret = 0;
            break;
          }

         default:
          {
            GL.recordError(1280);
            // GL_INVALID_ENUM
            return;
          }
        }
      } else if (result instanceof Float32Array || result instanceof Uint32Array || result instanceof Int32Array || result instanceof Array) {
        for (var i = 0; i < result.length; ++i) {
          switch (type) {
           case 0:
            HEAP32[(((p) + (i * 4)) >>> 2) >>> 0] = result[i];
            break;

           case 2:
            HEAPF32[(((p) + (i * 4)) >>> 2) >>> 0] = result[i];
            break;

           case 4:
            HEAP8[(p) + (i) >>> 0] = result[i] ? 1 : 0;
            break;
          }
        }
        return;
      } else {
        try {
          ret = result.name | 0;
        } catch (e) {
          GL.recordError(1280);
          // GL_INVALID_ENUM
          err(`GL_INVALID_ENUM in glGet${type}v: Unknown object returned from WebGL getParameter(${name_})! (error: ${e})`);
          return;
        }
      }
      break;

     default:
      GL.recordError(1280);
      // GL_INVALID_ENUM
      err(`GL_INVALID_ENUM in glGet${type}v: Native code calling glGet${type}v(${name_}) and it returns ${result} of type ${typeof (result)}!`);
      return;
    }
  }
  switch (type) {
   case 1:
    writeI53ToI64(p, ret);
    break;

   case 0:
    HEAP32[((p) >>> 2) >>> 0] = ret;
    break;

   case 2:
    HEAPF32[((p) >>> 2) >>> 0] = ret;
    break;

   case 4:
    HEAP8[p >>> 0] = ret ? 1 : 0;
    break;
  }
};

function _emscripten_glGetBooleanv(name_, p) {
  p >>>= 0;
  return emscriptenWebGLGet(name_, p, 4);
}

function _emscripten_glGetBufferParameteri64v(target, value, data) {
  data >>>= 0;
  if (!data) {
    // GLES2 specification does not specify how to behave if data is a null pointer. Since calling this function does not make sense
    // if data == null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  writeI53ToI64(data, GLctx.getBufferParameter(target, value));
}

function _emscripten_glGetBufferParameteriv(target, value, data) {
  data >>>= 0;
  if (!data) {
    // GLES2 specification does not specify how to behave if data is a null
    // pointer. Since calling this function does not make sense if data ==
    // null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  HEAP32[((data) >>> 2) >>> 0] = GLctx.getBufferParameter(target, value);
}

function _emscripten_glGetBufferPointerv(target, pname, params) {
  params >>>= 0;
  if (pname == 35005) {
    var ptr = 0;
    var mappedBuffer = GL.mappedBuffers[emscriptenWebGLGetBufferBinding(target)];
    if (mappedBuffer) {
      ptr = mappedBuffer.mem;
    }
    HEAP32[((params) >>> 2) >>> 0] = ptr;
  } else {
    GL.recordError(1280);
    err("GL_INVALID_ENUM in glGetBufferPointerv");
  }
}

var _emscripten_glGetError = () => {
  var error = GLctx.getError() || GL.lastError;
  GL.lastError = 0;
  return error;
};

function _emscripten_glGetFloatv(name_, p) {
  p >>>= 0;
  return emscriptenWebGLGet(name_, p, 2);
}

function _emscripten_glGetFragDataLocation(program, name) {
  name >>>= 0;
  return GLctx.getFragDataLocation(GL.programs[program], UTF8ToString(name));
}

function _emscripten_glGetFramebufferAttachmentParameteriv(target, attachment, pname, params) {
  params >>>= 0;
  var result = GLctx.getFramebufferAttachmentParameter(target, attachment, pname);
  if (result instanceof WebGLRenderbuffer || result instanceof WebGLTexture) {
    result = result.name | 0;
  }
  HEAP32[((params) >>> 2) >>> 0] = result;
}

var emscriptenWebGLGetIndexed = (target, index, data, type) => {
  if (!data) {
    // GLES2 specification does not specify how to behave if data is a null pointer. Since calling this function does not make sense
    // if data == null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  var result = GLctx.getIndexedParameter(target, index);
  var ret;
  switch (typeof result) {
   case "boolean":
    ret = result ? 1 : 0;
    break;

   case "number":
    ret = result;
    break;

   case "object":
    if (result === null) {
      switch (target) {
       case 35983:
       // TRANSFORM_FEEDBACK_BUFFER_BINDING
        case 35368:
        // UNIFORM_BUFFER_BINDING
        ret = 0;
        break;

       default:
        {
          GL.recordError(1280);
          // GL_INVALID_ENUM
          return;
        }
      }
    } else if (result instanceof WebGLBuffer) {
      ret = result.name | 0;
    } else {
      GL.recordError(1280);
      // GL_INVALID_ENUM
      return;
    }
    break;

   default:
    GL.recordError(1280);
    // GL_INVALID_ENUM
    return;
  }
  switch (type) {
   case 1:
    writeI53ToI64(data, ret);
    break;

   case 0:
    HEAP32[((data) >>> 2) >>> 0] = ret;
    break;

   case 2:
    HEAPF32[((data) >>> 2) >>> 0] = ret;
    break;

   case 4:
    HEAP8[data >>> 0] = ret ? 1 : 0;
    break;

   default:
    abort("internal emscriptenWebGLGetIndexed() error, bad type: " + type);
  }
};

function _emscripten_glGetInteger64i_v(target, index, data) {
  data >>>= 0;
  return emscriptenWebGLGetIndexed(target, index, data, 1);
}

function _emscripten_glGetInteger64v(name_, p) {
  p >>>= 0;
  emscriptenWebGLGet(name_, p, 1);
}

function _emscripten_glGetIntegeri_v(target, index, data) {
  data >>>= 0;
  return emscriptenWebGLGetIndexed(target, index, data, 0);
}

function _emscripten_glGetIntegerv(name_, p) {
  p >>>= 0;
  return emscriptenWebGLGet(name_, p, 0);
}

function _emscripten_glGetInternalformativ(target, internalformat, pname, bufSize, params) {
  params >>>= 0;
  if (bufSize < 0) {
    GL.recordError(1281);
    return;
  }
  if (!params) {
    // GLES3 specification does not specify how to behave if values is a null pointer. Since calling this function does not make sense
    // if values == null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  var ret = GLctx.getInternalformatParameter(target, internalformat, pname);
  if (ret === null) return;
  for (var i = 0; i < ret.length && i < bufSize; ++i) {
    HEAP32[(((params) + (i * 4)) >>> 2) >>> 0] = ret[i];
  }
}

function _emscripten_glGetProgramBinary(program, bufSize, length, binaryFormat, binary) {
  length >>>= 0;
  binaryFormat >>>= 0;
  binary >>>= 0;
  GL.recordError(1282);
}

function _emscripten_glGetProgramInfoLog(program, maxLength, length, infoLog) {
  length >>>= 0;
  infoLog >>>= 0;
  var log = GLctx.getProgramInfoLog(GL.programs[program]);
  if (log === null) log = "(unknown error)";
  var numBytesWrittenExclNull = (maxLength > 0 && infoLog) ? stringToUTF8(log, infoLog, maxLength) : 0;
  if (length) HEAP32[((length) >>> 2) >>> 0] = numBytesWrittenExclNull;
}

function _emscripten_glGetProgramiv(program, pname, p) {
  p >>>= 0;
  if (!p) {
    // GLES2 specification does not specify how to behave if p is a null
    // pointer. Since calling this function does not make sense if p == null,
    // issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  if (program >= GL.counter) {
    GL.recordError(1281);
    return;
  }
  program = GL.programs[program];
  if (pname == 35716) {
    // GL_INFO_LOG_LENGTH
    var log = GLctx.getProgramInfoLog(program);
    if (log === null) log = "(unknown error)";
    HEAP32[((p) >>> 2) >>> 0] = log.length + 1;
  } else if (pname == 35719) {
    if (!program.maxUniformLength) {
      var numActiveUniforms = GLctx.getProgramParameter(program, 35718);
      for (var i = 0; i < numActiveUniforms; ++i) {
        program.maxUniformLength = Math.max(program.maxUniformLength, GLctx.getActiveUniform(program, i).name.length + 1);
      }
    }
    HEAP32[((p) >>> 2) >>> 0] = program.maxUniformLength;
  } else if (pname == 35722) {
    if (!program.maxAttributeLength) {
      var numActiveAttributes = GLctx.getProgramParameter(program, 35721);
      for (var i = 0; i < numActiveAttributes; ++i) {
        program.maxAttributeLength = Math.max(program.maxAttributeLength, GLctx.getActiveAttrib(program, i).name.length + 1);
      }
    }
    HEAP32[((p) >>> 2) >>> 0] = program.maxAttributeLength;
  } else if (pname == 35381) {
    if (!program.maxUniformBlockNameLength) {
      var numActiveUniformBlocks = GLctx.getProgramParameter(program, 35382);
      for (var i = 0; i < numActiveUniformBlocks; ++i) {
        program.maxUniformBlockNameLength = Math.max(program.maxUniformBlockNameLength, GLctx.getActiveUniformBlockName(program, i).length + 1);
      }
    }
    HEAP32[((p) >>> 2) >>> 0] = program.maxUniformBlockNameLength;
  } else {
    HEAP32[((p) >>> 2) >>> 0] = GLctx.getProgramParameter(program, pname);
  }
}

function _emscripten_glGetQueryObjecti64vEXT(id, pname, params) {
  params >>>= 0;
  if (!params) {
    // GLES2 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
    // if p == null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  var query = GL.queries[id];
  var param;
  if (GL.currentContext.version < 2) {
    param = GLctx.disjointTimerQueryExt["getQueryObjectEXT"](query, pname);
  } else {
    param = GLctx.getQueryParameter(query, pname);
  }
  var ret;
  if (typeof param == "boolean") {
    ret = param ? 1 : 0;
  } else {
    ret = param;
  }
  writeI53ToI64(params, ret);
}

function _emscripten_glGetQueryObjectivEXT(id, pname, params) {
  params >>>= 0;
  if (!params) {
    // GLES2 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
    // if p == null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  var query = GL.queries[id];
  var param = GLctx.disjointTimerQueryExt["getQueryObjectEXT"](query, pname);
  var ret;
  if (typeof param == "boolean") {
    ret = param ? 1 : 0;
  } else {
    ret = param;
  }
  HEAP32[((params) >>> 2) >>> 0] = ret;
}

var _glGetQueryObjecti64vEXT = _emscripten_glGetQueryObjecti64vEXT;

var _emscripten_glGetQueryObjectui64vEXT = _glGetQueryObjecti64vEXT;

function _emscripten_glGetQueryObjectuiv(id, pname, params) {
  params >>>= 0;
  if (!params) {
    // GLES2 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
    // if p == null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  var query = GL.queries[id];
  var param = GLctx.getQueryParameter(query, pname);
  var ret;
  if (typeof param == "boolean") {
    ret = param ? 1 : 0;
  } else {
    ret = param;
  }
  HEAP32[((params) >>> 2) >>> 0] = ret;
}

var _glGetQueryObjectivEXT = _emscripten_glGetQueryObjectivEXT;

var _emscripten_glGetQueryObjectuivEXT = _glGetQueryObjectivEXT;

function _emscripten_glGetQueryiv(target, pname, params) {
  params >>>= 0;
  if (!params) {
    // GLES2 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
    // if p == null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  HEAP32[((params) >>> 2) >>> 0] = GLctx.getQuery(target, pname);
}

function _emscripten_glGetQueryivEXT(target, pname, params) {
  params >>>= 0;
  if (!params) {
    // GLES2 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
    // if p == null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  HEAP32[((params) >>> 2) >>> 0] = GLctx.disjointTimerQueryExt["getQueryEXT"](target, pname);
}

function _emscripten_glGetRenderbufferParameteriv(target, pname, params) {
  params >>>= 0;
  if (!params) {
    // GLES2 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
    // if params == null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  HEAP32[((params) >>> 2) >>> 0] = GLctx.getRenderbufferParameter(target, pname);
}

function _emscripten_glGetSamplerParameterfv(sampler, pname, params) {
  params >>>= 0;
  if (!params) {
    // GLES3 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
    // if p == null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  HEAPF32[((params) >>> 2) >>> 0] = GLctx.getSamplerParameter(GL.samplers[sampler], pname);
}

function _emscripten_glGetSamplerParameteriv(sampler, pname, params) {
  params >>>= 0;
  if (!params) {
    // GLES3 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
    // if p == null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  HEAP32[((params) >>> 2) >>> 0] = GLctx.getSamplerParameter(GL.samplers[sampler], pname);
}

function _emscripten_glGetShaderInfoLog(shader, maxLength, length, infoLog) {
  length >>>= 0;
  infoLog >>>= 0;
  var log = GLctx.getShaderInfoLog(GL.shaders[shader]);
  if (log === null) log = "(unknown error)";
  var numBytesWrittenExclNull = (maxLength > 0 && infoLog) ? stringToUTF8(log, infoLog, maxLength) : 0;
  if (length) HEAP32[((length) >>> 2) >>> 0] = numBytesWrittenExclNull;
}

function _emscripten_glGetShaderPrecisionFormat(shaderType, precisionType, range, precision) {
  range >>>= 0;
  precision >>>= 0;
  var result = GLctx.getShaderPrecisionFormat(shaderType, precisionType);
  HEAP32[((range) >>> 2) >>> 0] = result.rangeMin;
  HEAP32[(((range) + (4)) >>> 2) >>> 0] = result.rangeMax;
  HEAP32[((precision) >>> 2) >>> 0] = result.precision;
}

function _emscripten_glGetShaderSource(shader, bufSize, length, source) {
  length >>>= 0;
  source >>>= 0;
  var result = GLctx.getShaderSource(GL.shaders[shader]);
  if (!result) return;
  // If an error occurs, nothing will be written to length or source.
  var numBytesWrittenExclNull = (bufSize > 0 && source) ? stringToUTF8(result, source, bufSize) : 0;
  if (length) HEAP32[((length) >>> 2) >>> 0] = numBytesWrittenExclNull;
}

function _emscripten_glGetShaderiv(shader, pname, p) {
  p >>>= 0;
  if (!p) {
    // GLES2 specification does not specify how to behave if p is a null
    // pointer. Since calling this function does not make sense if p == null,
    // issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  if (pname == 35716) {
    // GL_INFO_LOG_LENGTH
    var log = GLctx.getShaderInfoLog(GL.shaders[shader]);
    if (log === null) log = "(unknown error)";
    // The GLES2 specification says that if the shader has an empty info log,
    // a value of 0 is returned. Otherwise the log has a null char appended.
    // (An empty string is falsey, so we can just check that instead of
    // looking at log.length.)
    var logLength = log ? log.length + 1 : 0;
    HEAP32[((p) >>> 2) >>> 0] = logLength;
  } else if (pname == 35720) {
    // GL_SHADER_SOURCE_LENGTH
    var source = GLctx.getShaderSource(GL.shaders[shader]);
    // source may be a null, or the empty string, both of which are falsey
    // values that we report a 0 length for.
    var sourceLength = source ? source.length + 1 : 0;
    HEAP32[((p) >>> 2) >>> 0] = sourceLength;
  } else {
    HEAP32[((p) >>> 2) >>> 0] = GLctx.getShaderParameter(GL.shaders[shader], pname);
  }
}

var stringToNewUTF8 = str => {
  var size = lengthBytesUTF8(str) + 1;
  var ret = _malloc(size);
  if (ret) stringToUTF8(str, ret, size);
  return ret;
};

function _emscripten_glGetString(name_) {
  var ret = GL.stringCache[name_];
  if (!ret) {
    switch (name_) {
     case 7939:
      ret = stringToNewUTF8(webglGetExtensions().join(" "));
      break;

     case 7936:
     case 7937:
     case 37445:
     case 37446:
      var s = GLctx.getParameter(name_);
      if (!s) {
        GL.recordError(1280);
      }
      ret = s ? stringToNewUTF8(s) : 0;
      break;

     case 7938:
      var webGLVersion = GLctx.getParameter(7938);
      // return GLES version string corresponding to the version of the WebGL context
      var glVersion = `OpenGL ES 2.0 (${webGLVersion})`;
      if (true) glVersion = `OpenGL ES 3.0 (${webGLVersion})`;
      ret = stringToNewUTF8(glVersion);
      break;

     case 35724:
      var glslVersion = GLctx.getParameter(35724);
      // extract the version number 'N.M' from the string 'WebGL GLSL ES N.M ...'
      var ver_re = /^WebGL GLSL ES ([0-9]\.[0-9][0-9]?)(?:$| .*)/;
      var ver_num = glslVersion.match(ver_re);
      if (ver_num !== null) {
        if (ver_num[1].length == 3) ver_num[1] = ver_num[1] + "0";
        // ensure minor version has 2 digits
        glslVersion = `OpenGL ES GLSL ES ${ver_num[1]} (${glslVersion})`;
      }
      ret = stringToNewUTF8(glslVersion);
      break;

     default:
      GL.recordError(1280);
    }
    GL.stringCache[name_] = ret;
  }
  return ret;
}

function _emscripten_glGetStringi(name, index) {
  if (GL.currentContext.version < 2) {
    GL.recordError(1282);
    // Calling GLES3/WebGL2 function with a GLES2/WebGL1 context
    return 0;
  }
  var stringiCache = GL.stringiCache[name];
  if (stringiCache) {
    if (index < 0 || index >= stringiCache.length) {
      GL.recordError(1281);
      return 0;
    }
    return stringiCache[index];
  }
  switch (name) {
   case 7939:
    var exts = webglGetExtensions().map(stringToNewUTF8);
    stringiCache = GL.stringiCache[name] = exts;
    if (index < 0 || index >= stringiCache.length) {
      GL.recordError(1281);
      return 0;
    }
    return stringiCache[index];

   default:
    GL.recordError(1280);
    return 0;
  }
}

function _emscripten_glGetSynciv(sync, pname, bufSize, length, values) {
  sync >>>= 0;
  length >>>= 0;
  values >>>= 0;
  if (bufSize < 0) {
    // GLES3 specification does not specify how to behave if bufSize < 0, however in the spec wording for glGetInternalformativ, it does say that GL_INVALID_VALUE should be raised,
    // so raise GL_INVALID_VALUE here as well.
    GL.recordError(1281);
    return;
  }
  if (!values) {
    // GLES3 specification does not specify how to behave if values is a null pointer. Since calling this function does not make sense
    // if values == null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  var ret = GLctx.getSyncParameter(GL.syncs[sync], pname);
  if (ret !== null) {
    HEAP32[((values) >>> 2) >>> 0] = ret;
    if (length) HEAP32[((length) >>> 2) >>> 0] = 1;
  }
}

function _emscripten_glGetTexParameterfv(target, pname, params) {
  params >>>= 0;
  if (!params) {
    // GLES2 specification does not specify how to behave if params is a null
    // pointer. Since calling this function does not make sense if p == null,
    // issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  HEAPF32[((params) >>> 2) >>> 0] = GLctx.getTexParameter(target, pname);
}

function _emscripten_glGetTexParameteriv(target, pname, params) {
  params >>>= 0;
  if (!params) {
    // GLES2 specification does not specify how to behave if params is a null
    // pointer. Since calling this function does not make sense if p == null,
    // issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  HEAP32[((params) >>> 2) >>> 0] = GLctx.getTexParameter(target, pname);
}

function _emscripten_glGetTransformFeedbackVarying(program, index, bufSize, length, size, type, name) {
  length >>>= 0;
  size >>>= 0;
  type >>>= 0;
  name >>>= 0;
  program = GL.programs[program];
  var info = GLctx.getTransformFeedbackVarying(program, index);
  if (!info) return;
  // If an error occurred, the return parameters length, size, type and name will be unmodified.
  if (name && bufSize > 0) {
    var numBytesWrittenExclNull = stringToUTF8(info.name, name, bufSize);
    if (length) HEAP32[((length) >>> 2) >>> 0] = numBytesWrittenExclNull;
  } else {
    if (length) HEAP32[((length) >>> 2) >>> 0] = 0;
  }
  if (size) HEAP32[((size) >>> 2) >>> 0] = info.size;
  if (type) HEAP32[((type) >>> 2) >>> 0] = info.type;
}

function _emscripten_glGetUniformBlockIndex(program, uniformBlockName) {
  uniformBlockName >>>= 0;
  return GLctx.getUniformBlockIndex(GL.programs[program], UTF8ToString(uniformBlockName));
}

function _emscripten_glGetUniformIndices(program, uniformCount, uniformNames, uniformIndices) {
  uniformNames >>>= 0;
  uniformIndices >>>= 0;
  if (!uniformIndices) {
    // GLES2 specification does not specify how to behave if uniformIndices is a null pointer. Since calling this function does not make sense
    // if uniformIndices == null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  if (uniformCount > 0 && (uniformNames == 0 || uniformIndices == 0)) {
    GL.recordError(1281);
    return;
  }
  program = GL.programs[program];
  var names = [];
  for (var i = 0; i < uniformCount; i++) names.push(UTF8ToString(HEAPU32[(((uniformNames) + (i * 4)) >>> 2) >>> 0]));
  var result = GLctx.getUniformIndices(program, names);
  if (!result) return;
  // GL spec: If an error is generated, nothing is written out to uniformIndices.
  var len = result.length;
  for (var i = 0; i < len; i++) {
    HEAP32[(((uniformIndices) + (i * 4)) >>> 2) >>> 0] = result[i];
  }
}

/** @suppress {checkTypes} */ var jstoi_q = str => parseInt(str);

/** @noinline */ var webglGetLeftBracePos = name => name.slice(-1) == "]" && name.lastIndexOf("[");

var webglPrepareUniformLocationsBeforeFirstUse = program => {
  var uniformLocsById = program.uniformLocsById, // Maps GLuint -> WebGLUniformLocation
  uniformSizeAndIdsByName = program.uniformSizeAndIdsByName, // Maps name -> [uniform array length, GLuint]
  i, j;
  // On the first time invocation of glGetUniformLocation on this shader program:
  // initialize cache data structures and discover which uniforms are arrays.
  if (!uniformLocsById) {
    // maps GLint integer locations to WebGLUniformLocations
    program.uniformLocsById = uniformLocsById = {};
    // maps integer locations back to uniform name strings, so that we can lazily fetch uniform array locations
    program.uniformArrayNamesById = {};
    var numActiveUniforms = GLctx.getProgramParameter(program, 35718);
    for (i = 0; i < numActiveUniforms; ++i) {
      var u = GLctx.getActiveUniform(program, i);
      var nm = u.name;
      var sz = u.size;
      var lb = webglGetLeftBracePos(nm);
      var arrayName = lb > 0 ? nm.slice(0, lb) : nm;
      // Assign a new location.
      var id = program.uniformIdCounter;
      program.uniformIdCounter += sz;
      // Eagerly get the location of the uniformArray[0] base element.
      // The remaining indices >0 will be left for lazy evaluation to
      // improve performance. Those may never be needed to fetch, if the
      // application fills arrays always in full starting from the first
      // element of the array.
      uniformSizeAndIdsByName[arrayName] = [ sz, id ];
      // Store placeholder integers in place that highlight that these
      // >0 index locations are array indices pending population.
      for (j = 0; j < sz; ++j) {
        uniformLocsById[id] = j;
        program.uniformArrayNamesById[id++] = arrayName;
      }
    }
  }
};

function _emscripten_glGetUniformLocation(program, name) {
  name >>>= 0;
  name = UTF8ToString(name);
  if (program = GL.programs[program]) {
    webglPrepareUniformLocationsBeforeFirstUse(program);
    var uniformLocsById = program.uniformLocsById;
    // Maps GLuint -> WebGLUniformLocation
    var arrayIndex = 0;
    var uniformBaseName = name;
    // Invariant: when populating integer IDs for uniform locations, we must
    // maintain the precondition that arrays reside in contiguous addresses,
    // i.e. for a 'vec4 colors[10];', colors[4] must be at location
    // colors[0]+4.  However, user might call glGetUniformLocation(program,
    // "colors") for an array, so we cannot discover based on the user input
    // arguments whether the uniform we are dealing with is an array. The only
    // way to discover which uniforms are arrays is to enumerate over all the
    // active uniforms in the program.
    var leftBrace = webglGetLeftBracePos(name);
    // If user passed an array accessor "[index]", parse the array index off the accessor.
    if (leftBrace > 0) {
      arrayIndex = jstoi_q(name.slice(leftBrace + 1)) >>> 0;
      // "index]", coerce parseInt(']') with >>>0 to treat "foo[]" as "foo[0]" and foo[-1] as unsigned out-of-bounds.
      uniformBaseName = name.slice(0, leftBrace);
    }
    // Have we cached the location of this uniform before?
    // A pair [array length, GLint of the uniform location]
    var sizeAndId = program.uniformSizeAndIdsByName[uniformBaseName];
    // If a uniform with this name exists, and if its index is within the
    // array limits (if it's even an array), query the WebGLlocation, or
    // return an existing cached location.
    if (sizeAndId && arrayIndex < sizeAndId[0]) {
      arrayIndex += sizeAndId[1];
      // Add the base location of the uniform to the array index offset.
      if ((uniformLocsById[arrayIndex] = uniformLocsById[arrayIndex] || GLctx.getUniformLocation(program, name))) {
        return arrayIndex;
      }
    }
  } else {
    // N.b. we are currently unable to distinguish between GL program IDs that
    // never existed vs GL program IDs that have been deleted, so report
    // GL_INVALID_VALUE in both cases.
    GL.recordError(1281);
  }
  return -1;
}

var webglGetUniformLocation = location => {
  var p = GLctx.currentProgram;
  if (p) {
    var webglLoc = p.uniformLocsById[location];
    // p.uniformLocsById[location] stores either an integer, or a
    // WebGLUniformLocation.
    // If an integer, we have not yet bound the location, so do it now. The
    // integer value specifies the array index we should bind to.
    if (typeof webglLoc == "number") {
      p.uniformLocsById[location] = webglLoc = GLctx.getUniformLocation(p, p.uniformArrayNamesById[location] + (webglLoc > 0 ? `[${webglLoc}]` : ""));
    }
    // Else an already cached WebGLUniformLocation, return it.
    return webglLoc;
  } else {
    GL.recordError(1282);
  }
};

/** @suppress{checkTypes} */ var emscriptenWebGLGetUniform = (program, location, params, type) => {
  if (!params) {
    // GLES2 specification does not specify how to behave if params is a null
    // pointer. Since calling this function does not make sense if params ==
    // null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  program = GL.programs[program];
  webglPrepareUniformLocationsBeforeFirstUse(program);
  var data = GLctx.getUniform(program, webglGetUniformLocation(location));
  if (typeof data == "number" || typeof data == "boolean") {
    switch (type) {
     case 0:
      HEAP32[((params) >>> 2) >>> 0] = data;
      break;

     case 2:
      HEAPF32[((params) >>> 2) >>> 0] = data;
      break;
    }
  } else {
    for (var i = 0; i < data.length; i++) {
      switch (type) {
       case 0:
        HEAP32[(((params) + (i * 4)) >>> 2) >>> 0] = data[i];
        break;

       case 2:
        HEAPF32[(((params) + (i * 4)) >>> 2) >>> 0] = data[i];
        break;
      }
    }
  }
};

function _emscripten_glGetUniformfv(program, location, params) {
  params >>>= 0;
  emscriptenWebGLGetUniform(program, location, params, 2);
}

function _emscripten_glGetUniformiv(program, location, params) {
  params >>>= 0;
  emscriptenWebGLGetUniform(program, location, params, 0);
}

function _emscripten_glGetUniformuiv(program, location, params) {
  params >>>= 0;
  return emscriptenWebGLGetUniform(program, location, params, 0);
}

/** @suppress{checkTypes} */ var emscriptenWebGLGetVertexAttrib = (index, pname, params, type) => {
  if (!params) {
    // GLES2 specification does not specify how to behave if params is a null
    // pointer. Since calling this function does not make sense if params ==
    // null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  if (GL.currentContext.clientBuffers[index].enabled) {
    err("glGetVertexAttrib*v on client-side array: not supported, bad data returned");
  }
  var data = GLctx.getVertexAttrib(index, pname);
  if (pname == 34975) {
    HEAP32[((params) >>> 2) >>> 0] = data && data["name"];
  } else if (typeof data == "number" || typeof data == "boolean") {
    switch (type) {
     case 0:
      HEAP32[((params) >>> 2) >>> 0] = data;
      break;

     case 2:
      HEAPF32[((params) >>> 2) >>> 0] = data;
      break;

     case 5:
      HEAP32[((params) >>> 2) >>> 0] = Math.fround(data);
      break;
    }
  } else {
    for (var i = 0; i < data.length; i++) {
      switch (type) {
       case 0:
        HEAP32[(((params) + (i * 4)) >>> 2) >>> 0] = data[i];
        break;

       case 2:
        HEAPF32[(((params) + (i * 4)) >>> 2) >>> 0] = data[i];
        break;

       case 5:
        HEAP32[(((params) + (i * 4)) >>> 2) >>> 0] = Math.fround(data[i]);
        break;
      }
    }
  }
};

function _emscripten_glGetVertexAttribIiv(index, pname, params) {
  params >>>= 0;
  // N.B. This function may only be called if the vertex attribute was specified using the function glVertexAttribI4iv(),
  // otherwise the results are undefined. (GLES3 spec 6.1.12)
  emscriptenWebGLGetVertexAttrib(index, pname, params, 0);
}

var _glGetVertexAttribIiv = _emscripten_glGetVertexAttribIiv;

var _emscripten_glGetVertexAttribIuiv = _glGetVertexAttribIiv;

function _emscripten_glGetVertexAttribPointerv(index, pname, pointer) {
  pointer >>>= 0;
  if (!pointer) {
    // GLES2 specification does not specify how to behave if pointer is a null
    // pointer. Since calling this function does not make sense if pointer ==
    // null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  if (GL.currentContext.clientBuffers[index].enabled) {
    err("glGetVertexAttribPointer on client-side array: not supported, bad data returned");
  }
  HEAP32[((pointer) >>> 2) >>> 0] = GLctx.getVertexAttribOffset(index, pname);
}

function _emscripten_glGetVertexAttribfv(index, pname, params) {
  params >>>= 0;
  // N.B. This function may only be called if the vertex attribute was
  // specified using the function glVertexAttrib*f(), otherwise the results
  // are undefined. (GLES3 spec 6.1.12)
  emscriptenWebGLGetVertexAttrib(index, pname, params, 2);
}

function _emscripten_glGetVertexAttribiv(index, pname, params) {
  params >>>= 0;
  // N.B. This function may only be called if the vertex attribute was
  // specified using the function glVertexAttrib*f(), otherwise the results
  // are undefined. (GLES3 spec 6.1.12)
  emscriptenWebGLGetVertexAttrib(index, pname, params, 5);
}

var _emscripten_glHint = (x0, x1) => GLctx.hint(x0, x1);

function _emscripten_glInvalidateFramebuffer(target, numAttachments, attachments) {
  attachments >>>= 0;
  var list = tempFixedLengthArray[numAttachments];
  for (var i = 0; i < numAttachments; i++) {
    list[i] = HEAP32[(((attachments) + (i * 4)) >>> 2) >>> 0];
  }
  GLctx.invalidateFramebuffer(target, list);
}

function _emscripten_glInvalidateSubFramebuffer(target, numAttachments, attachments, x, y, width, height) {
  attachments >>>= 0;
  var list = tempFixedLengthArray[numAttachments];
  for (var i = 0; i < numAttachments; i++) {
    list[i] = HEAP32[(((attachments) + (i * 4)) >>> 2) >>> 0];
  }
  GLctx.invalidateSubFramebuffer(target, list, x, y, width, height);
}

var _emscripten_glIsBuffer = buffer => {
  var b = GL.buffers[buffer];
  if (!b) return 0;
  return GLctx.isBuffer(b);
};

var _emscripten_glIsEnabled = x0 => GLctx.isEnabled(x0);

var _emscripten_glIsFramebuffer = framebuffer => {
  var fb = GL.framebuffers[framebuffer];
  if (!fb) return 0;
  return GLctx.isFramebuffer(fb);
};

var _emscripten_glIsProgram = program => {
  program = GL.programs[program];
  if (!program) return 0;
  return GLctx.isProgram(program);
};

var _emscripten_glIsQuery = id => {
  var query = GL.queries[id];
  if (!query) return 0;
  return GLctx.isQuery(query);
};

var _emscripten_glIsQueryEXT = id => {
  var query = GL.queries[id];
  if (!query) return 0;
  return GLctx.disjointTimerQueryExt["isQueryEXT"](query);
};

var _emscripten_glIsRenderbuffer = renderbuffer => {
  var rb = GL.renderbuffers[renderbuffer];
  if (!rb) return 0;
  return GLctx.isRenderbuffer(rb);
};

var _emscripten_glIsSampler = id => {
  var sampler = GL.samplers[id];
  if (!sampler) return 0;
  return GLctx.isSampler(sampler);
};

var _emscripten_glIsShader = shader => {
  var s = GL.shaders[shader];
  if (!s) return 0;
  return GLctx.isShader(s);
};

function _emscripten_glIsSync(sync) {
  sync >>>= 0;
  return GLctx.isSync(GL.syncs[sync]);
}

var _emscripten_glIsTexture = id => {
  var texture = GL.textures[id];
  if (!texture) return 0;
  return GLctx.isTexture(texture);
};

var _emscripten_glIsTransformFeedback = id => GLctx.isTransformFeedback(GL.transformFeedbacks[id]);

var _emscripten_glIsVertexArray = array => {
  var vao = GL.vaos[array];
  if (!vao) return 0;
  return GLctx.isVertexArray(vao);
};

var _glIsVertexArray = _emscripten_glIsVertexArray;

var _emscripten_glIsVertexArrayOES = _glIsVertexArray;

var _emscripten_glLineWidth = x0 => GLctx.lineWidth(x0);

var _emscripten_glLinkProgram = program => {
  program = GL.programs[program];
  GLctx.linkProgram(program);
  // Invalidate earlier computed uniform->ID mappings, those have now become stale
  program.uniformLocsById = 0;
  // Mark as null-like so that glGetUniformLocation() knows to populate this again.
  program.uniformSizeAndIdsByName = {};
};

function _emscripten_glMapBufferRange(target, offset, length, access) {
  offset >>>= 0;
  length >>>= 0;
  if ((access & (1 | 32)) != 0) {
    err("glMapBufferRange access does not support MAP_READ or MAP_UNSYNCHRONIZED");
    return 0;
  }
  if ((access & 2) == 0) {
    err("glMapBufferRange access must include MAP_WRITE");
    return 0;
  }
  if ((access & (4 | 8)) == 0) {
    err("glMapBufferRange access must include INVALIDATE_BUFFER or INVALIDATE_RANGE");
    return 0;
  }
  if (!emscriptenWebGLValidateMapBufferTarget(target)) {
    GL.recordError(1280);
    err("GL_INVALID_ENUM in glMapBufferRange");
    return 0;
  }
  var mem = _malloc(length), binding = emscriptenWebGLGetBufferBinding(target);
  if (!mem) return 0;
  binding = GL.mappedBuffers[binding] ??= {};
  binding.offset = offset;
  binding.length = length;
  binding.mem = mem;
  binding.access = access;
  return mem;
}

var _emscripten_glPauseTransformFeedback = () => GLctx.pauseTransformFeedback();

var _emscripten_glPixelStorei = (pname, param) => {
  if (pname == 3317) {
    GL.unpackAlignment = param;
  } else if (pname == 3314) {
    GL.unpackRowLength = param;
  }
  GLctx.pixelStorei(pname, param);
};

var _emscripten_glPolygonModeWEBGL = (face, mode) => {
  GLctx.webglPolygonMode["polygonModeWEBGL"](face, mode);
};

var _emscripten_glPolygonOffset = (x0, x1) => GLctx.polygonOffset(x0, x1);

var _emscripten_glPolygonOffsetClampEXT = (factor, units, clamp) => {
  GLctx.extPolygonOffsetClamp["polygonOffsetClampEXT"](factor, units, clamp);
};

function _emscripten_glProgramBinary(program, binaryFormat, binary, length) {
  binary >>>= 0;
  GL.recordError(1280);
}

var _emscripten_glProgramParameteri = (program, pname, value) => {
  GL.recordError(1280);
};

var _emscripten_glQueryCounterEXT = (id, target) => {
  GLctx.disjointTimerQueryExt["queryCounterEXT"](GL.queries[id], target);
};

var _emscripten_glReadBuffer = x0 => GLctx.readBuffer(x0);

var computeUnpackAlignedImageSize = (width, height, sizePerPixel) => {
  function roundedToNextMultipleOf(x, y) {
    return (x + y - 1) & -y;
  }
  var plainRowSize = (GL.unpackRowLength || width) * sizePerPixel;
  var alignedRowSize = roundedToNextMultipleOf(plainRowSize, GL.unpackAlignment);
  return height * alignedRowSize;
};

var colorChannelsInGlTextureFormat = format => {
  // Micro-optimizations for size: map format to size by subtracting smallest
  // enum value (0x1902) from all values first.  Also omit the most common
  // size value (1) from the list, which is assumed by formats not on the
  // list.
  var colorChannels = {
    // 0x1902 /* GL_DEPTH_COMPONENT */ - 0x1902: 1,
    // 0x1906 /* GL_ALPHA */ - 0x1902: 1,
    5: 3,
    6: 4,
    // 0x1909 /* GL_LUMINANCE */ - 0x1902: 1,
    8: 2,
    29502: 3,
    29504: 4,
    // 0x1903 /* GL_RED */ - 0x1902: 1,
    26917: 2,
    26918: 2,
    // 0x8D94 /* GL_RED_INTEGER */ - 0x1902: 1,
    29846: 3,
    29847: 4
  };
  return colorChannels[format - 6402] || 1;
};

var heapObjectForWebGLType = type => {
  // Micro-optimization for size: Subtract lowest GL enum number (0x1400/* GL_BYTE */) from type to compare
  // smaller values for the heap, for shorter generated code size.
  // Also the type HEAPU16 is not tested for explicitly, but any unrecognized type will return out HEAPU16.
  // (since most types are HEAPU16)
  type -= 5120;
  if (type == 0) return HEAP8;
  if (type == 1) return HEAPU8;
  if (type == 2) return HEAP16;
  if (type == 4) return HEAP32;
  if (type == 6) return HEAPF32;
  if (type == 5 || type == 28922 || type == 28520 || type == 30779 || type == 30782) return HEAPU32;
  return HEAPU16;
};

var toTypedArrayIndex = (pointer, heap) => pointer >>> (31 - Math.clz32(heap.BYTES_PER_ELEMENT));

var emscriptenWebGLGetTexPixelData = (type, format, width, height, pixels, internalFormat) => {
  var heap = heapObjectForWebGLType(type);
  var sizePerPixel = colorChannelsInGlTextureFormat(format) * heap.BYTES_PER_ELEMENT;
  var bytes = computeUnpackAlignedImageSize(width, height, sizePerPixel);
  return heap.subarray(toTypedArrayIndex(pixels, heap) >>> 0, toTypedArrayIndex(pixels + bytes, heap) >>> 0);
};

function _emscripten_glReadPixels(x, y, width, height, format, type, pixels) {
  pixels >>>= 0;
  if (true) {
    if (GLctx.currentPixelPackBufferBinding) {
      GLctx.readPixels(x, y, width, height, format, type, pixels);
      return;
    }
  }
  var pixelData = emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, format);
  if (!pixelData) {
    GL.recordError(1280);
    return;
  }
  GLctx.readPixels(x, y, width, height, format, type, pixelData);
}

var _emscripten_glReleaseShaderCompiler = () => {};

var _emscripten_glRenderbufferStorage = (x0, x1, x2, x3) => GLctx.renderbufferStorage(x0, x1, x2, x3);

var _emscripten_glRenderbufferStorageMultisample = (x0, x1, x2, x3, x4) => GLctx.renderbufferStorageMultisample(x0, x1, x2, x3, x4);

var _emscripten_glResumeTransformFeedback = () => GLctx.resumeTransformFeedback();

var _emscripten_glSampleCoverage = (value, invert) => {
  GLctx.sampleCoverage(value, !!invert);
};

var _emscripten_glSamplerParameterf = (sampler, pname, param) => {
  GLctx.samplerParameterf(GL.samplers[sampler], pname, param);
};

function _emscripten_glSamplerParameterfv(sampler, pname, params) {
  params >>>= 0;
  var param = HEAPF32[((params) >>> 2) >>> 0];
  GLctx.samplerParameterf(GL.samplers[sampler], pname, param);
}

var _emscripten_glSamplerParameteri = (sampler, pname, param) => {
  GLctx.samplerParameteri(GL.samplers[sampler], pname, param);
};

function _emscripten_glSamplerParameteriv(sampler, pname, params) {
  params >>>= 0;
  var param = HEAP32[((params) >>> 2) >>> 0];
  GLctx.samplerParameteri(GL.samplers[sampler], pname, param);
}

var _emscripten_glScissor = (x0, x1, x2, x3) => GLctx.scissor(x0, x1, x2, x3);

function _emscripten_glShaderBinary(count, shaders, binaryformat, binary, length) {
  shaders >>>= 0;
  binary >>>= 0;
  GL.recordError(1280);
}

function _emscripten_glShaderSource(shader, count, string, length) {
  string >>>= 0;
  length >>>= 0;
  var source = GL.getSource(shader, count, string, length);
  GLctx.shaderSource(GL.shaders[shader], source);
}

var _emscripten_glStencilFunc = (x0, x1, x2) => GLctx.stencilFunc(x0, x1, x2);

var _emscripten_glStencilFuncSeparate = (x0, x1, x2, x3) => GLctx.stencilFuncSeparate(x0, x1, x2, x3);

var _emscripten_glStencilMask = x0 => GLctx.stencilMask(x0);

var _emscripten_glStencilMaskSeparate = (x0, x1) => GLctx.stencilMaskSeparate(x0, x1);

var _emscripten_glStencilOp = (x0, x1, x2) => GLctx.stencilOp(x0, x1, x2);

var _emscripten_glStencilOpSeparate = (x0, x1, x2, x3) => GLctx.stencilOpSeparate(x0, x1, x2, x3);

function _emscripten_glTexImage2D(target, level, internalFormat, width, height, border, format, type, pixels) {
  pixels >>>= 0;
  if (true) {
    if (GLctx.currentPixelUnpackBufferBinding) {
      GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type, pixels);
      return;
    }
  }
  var pixelData = pixels ? emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, internalFormat) : null;
  GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type, pixelData);
}

function _emscripten_glTexImage3D(target, level, internalFormat, width, height, depth, border, format, type, pixels) {
  pixels >>>= 0;
  if (GLctx.currentPixelUnpackBufferBinding) {
    GLctx.texImage3D(target, level, internalFormat, width, height, depth, border, format, type, pixels);
  } else if (pixels) {
    var heap = heapObjectForWebGLType(type);
    var pixelData = emscriptenWebGLGetTexPixelData(type, format, width, height * depth, pixels, internalFormat);
    GLctx.texImage3D(target, level, internalFormat, width, height, depth, border, format, type, pixelData);
  } else {
    GLctx.texImage3D(target, level, internalFormat, width, height, depth, border, format, type, null);
  }
}

var _emscripten_glTexParameterf = (x0, x1, x2) => GLctx.texParameterf(x0, x1, x2);

function _emscripten_glTexParameterfv(target, pname, params) {
  params >>>= 0;
  var param = HEAPF32[((params) >>> 2) >>> 0];
  GLctx.texParameterf(target, pname, param);
}

var _emscripten_glTexParameteri = (x0, x1, x2) => GLctx.texParameteri(x0, x1, x2);

function _emscripten_glTexParameteriv(target, pname, params) {
  params >>>= 0;
  var param = HEAP32[((params) >>> 2) >>> 0];
  GLctx.texParameteri(target, pname, param);
}

var _emscripten_glTexStorage2D = (x0, x1, x2, x3, x4) => GLctx.texStorage2D(x0, x1, x2, x3, x4);

var _emscripten_glTexStorage3D = (x0, x1, x2, x3, x4, x5) => GLctx.texStorage3D(x0, x1, x2, x3, x4, x5);

function _emscripten_glTexSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixels) {
  pixels >>>= 0;
  if (true) {
    if (GLctx.currentPixelUnpackBufferBinding) {
      GLctx.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixels);
      return;
    }
  }
  var pixelData = pixels ? emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, 0) : null;
  GLctx.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixelData);
}

function _emscripten_glTexSubImage3D(target, level, xoffset, yoffset, zoffset, width, height, depth, format, type, pixels) {
  pixels >>>= 0;
  if (GLctx.currentPixelUnpackBufferBinding) {
    GLctx.texSubImage3D(target, level, xoffset, yoffset, zoffset, width, height, depth, format, type, pixels);
  } else if (pixels) {
    var heap = heapObjectForWebGLType(type);
    GLctx.texSubImage3D(target, level, xoffset, yoffset, zoffset, width, height, depth, format, type, heap, toTypedArrayIndex(pixels, heap));
  } else {
    GLctx.texSubImage3D(target, level, xoffset, yoffset, zoffset, width, height, depth, format, type, null);
  }
}

function _emscripten_glTransformFeedbackVaryings(program, count, varyings, bufferMode) {
  varyings >>>= 0;
  program = GL.programs[program];
  var vars = [];
  for (var i = 0; i < count; i++) vars.push(UTF8ToString(HEAPU32[(((varyings) + (i * 4)) >>> 2) >>> 0]));
  GLctx.transformFeedbackVaryings(program, vars, bufferMode);
}

var _emscripten_glUniform1f = (location, v0) => {
  GLctx.uniform1f(webglGetUniformLocation(location), v0);
};

var miniTempWebGLFloatBuffers = [];

function _emscripten_glUniform1fv(location, count, value) {
  value >>>= 0;
  if (count <= 288) {
    // avoid allocation when uploading few enough uniforms
    var view = miniTempWebGLFloatBuffers[count];
    for (var i = 0; i < count; ++i) {
      view[i] = HEAPF32[(((value) + (4 * i)) >>> 2) >>> 0];
    }
  } else {
    var view = HEAPF32.subarray((((value) >>> 2)) >>> 0, ((value + count * 4) >>> 2) >>> 0);
  }
  GLctx.uniform1fv(webglGetUniformLocation(location), view);
}

var _emscripten_glUniform1i = (location, v0) => {
  GLctx.uniform1i(webglGetUniformLocation(location), v0);
};

var miniTempWebGLIntBuffers = [];

function _emscripten_glUniform1iv(location, count, value) {
  value >>>= 0;
  if (count <= 288) {
    // avoid allocation when uploading few enough uniforms
    var view = miniTempWebGLIntBuffers[count];
    for (var i = 0; i < count; ++i) {
      view[i] = HEAP32[(((value) + (4 * i)) >>> 2) >>> 0];
    }
  } else {
    var view = HEAP32.subarray((((value) >>> 2)) >>> 0, ((value + count * 4) >>> 2) >>> 0);
  }
  GLctx.uniform1iv(webglGetUniformLocation(location), view);
}

var _emscripten_glUniform1ui = (location, v0) => {
  GLctx.uniform1ui(webglGetUniformLocation(location), v0);
};

function _emscripten_glUniform1uiv(location, count, value) {
  value >>>= 0;
  count && GLctx.uniform1uiv(webglGetUniformLocation(location), HEAPU32, ((value) >>> 2), count);
}

var _emscripten_glUniform2f = (location, v0, v1) => {
  GLctx.uniform2f(webglGetUniformLocation(location), v0, v1);
};

function _emscripten_glUniform2fv(location, count, value) {
  value >>>= 0;
  if (count <= 144) {
    // avoid allocation when uploading few enough uniforms
    count *= 2;
    var view = miniTempWebGLFloatBuffers[count];
    for (var i = 0; i < count; i += 2) {
      view[i] = HEAPF32[(((value) + (4 * i)) >>> 2) >>> 0];
      view[i + 1] = HEAPF32[(((value) + (4 * i + 4)) >>> 2) >>> 0];
    }
  } else {
    var view = HEAPF32.subarray((((value) >>> 2)) >>> 0, ((value + count * 8) >>> 2) >>> 0);
  }
  GLctx.uniform2fv(webglGetUniformLocation(location), view);
}

var _emscripten_glUniform2i = (location, v0, v1) => {
  GLctx.uniform2i(webglGetUniformLocation(location), v0, v1);
};

function _emscripten_glUniform2iv(location, count, value) {
  value >>>= 0;
  if (count <= 144) {
    // avoid allocation when uploading few enough uniforms
    count *= 2;
    var view = miniTempWebGLIntBuffers[count];
    for (var i = 0; i < count; i += 2) {
      view[i] = HEAP32[(((value) + (4 * i)) >>> 2) >>> 0];
      view[i + 1] = HEAP32[(((value) + (4 * i + 4)) >>> 2) >>> 0];
    }
  } else {
    var view = HEAP32.subarray((((value) >>> 2)) >>> 0, ((value + count * 8) >>> 2) >>> 0);
  }
  GLctx.uniform2iv(webglGetUniformLocation(location), view);
}

var _emscripten_glUniform2ui = (location, v0, v1) => {
  GLctx.uniform2ui(webglGetUniformLocation(location), v0, v1);
};

function _emscripten_glUniform2uiv(location, count, value) {
  value >>>= 0;
  count && GLctx.uniform2uiv(webglGetUniformLocation(location), HEAPU32, ((value) >>> 2), count * 2);
}

var _emscripten_glUniform3f = (location, v0, v1, v2) => {
  GLctx.uniform3f(webglGetUniformLocation(location), v0, v1, v2);
};

function _emscripten_glUniform3fv(location, count, value) {
  value >>>= 0;
  if (count <= 96) {
    // avoid allocation when uploading few enough uniforms
    count *= 3;
    var view = miniTempWebGLFloatBuffers[count];
    for (var i = 0; i < count; i += 3) {
      view[i] = HEAPF32[(((value) + (4 * i)) >>> 2) >>> 0];
      view[i + 1] = HEAPF32[(((value) + (4 * i + 4)) >>> 2) >>> 0];
      view[i + 2] = HEAPF32[(((value) + (4 * i + 8)) >>> 2) >>> 0];
    }
  } else {
    var view = HEAPF32.subarray((((value) >>> 2)) >>> 0, ((value + count * 12) >>> 2) >>> 0);
  }
  GLctx.uniform3fv(webglGetUniformLocation(location), view);
}

var _emscripten_glUniform3i = (location, v0, v1, v2) => {
  GLctx.uniform3i(webglGetUniformLocation(location), v0, v1, v2);
};

function _emscripten_glUniform3iv(location, count, value) {
  value >>>= 0;
  if (count <= 96) {
    // avoid allocation when uploading few enough uniforms
    count *= 3;
    var view = miniTempWebGLIntBuffers[count];
    for (var i = 0; i < count; i += 3) {
      view[i] = HEAP32[(((value) + (4 * i)) >>> 2) >>> 0];
      view[i + 1] = HEAP32[(((value) + (4 * i + 4)) >>> 2) >>> 0];
      view[i + 2] = HEAP32[(((value) + (4 * i + 8)) >>> 2) >>> 0];
    }
  } else {
    var view = HEAP32.subarray((((value) >>> 2)) >>> 0, ((value + count * 12) >>> 2) >>> 0);
  }
  GLctx.uniform3iv(webglGetUniformLocation(location), view);
}

var _emscripten_glUniform3ui = (location, v0, v1, v2) => {
  GLctx.uniform3ui(webglGetUniformLocation(location), v0, v1, v2);
};

function _emscripten_glUniform3uiv(location, count, value) {
  value >>>= 0;
  count && GLctx.uniform3uiv(webglGetUniformLocation(location), HEAPU32, ((value) >>> 2), count * 3);
}

var _emscripten_glUniform4f = (location, v0, v1, v2, v3) => {
  GLctx.uniform4f(webglGetUniformLocation(location), v0, v1, v2, v3);
};

function _emscripten_glUniform4fv(location, count, value) {
  value >>>= 0;
  if (count <= 72) {
    // avoid allocation when uploading few enough uniforms
    var view = miniTempWebGLFloatBuffers[4 * count];
    // hoist the heap out of the loop for size and for pthreads+growth.
    var heap = HEAPF32;
    value = ((value) >>> 2);
    count *= 4;
    for (var i = 0; i < count; i += 4) {
      var dst = value + i;
      view[i] = heap[dst >>> 0];
      view[i + 1] = heap[dst + 1 >>> 0];
      view[i + 2] = heap[dst + 2 >>> 0];
      view[i + 3] = heap[dst + 3 >>> 0];
    }
  } else {
    var view = HEAPF32.subarray((((value) >>> 2)) >>> 0, ((value + count * 16) >>> 2) >>> 0);
  }
  GLctx.uniform4fv(webglGetUniformLocation(location), view);
}

var _emscripten_glUniform4i = (location, v0, v1, v2, v3) => {
  GLctx.uniform4i(webglGetUniformLocation(location), v0, v1, v2, v3);
};

function _emscripten_glUniform4iv(location, count, value) {
  value >>>= 0;
  if (count <= 72) {
    // avoid allocation when uploading few enough uniforms
    count *= 4;
    var view = miniTempWebGLIntBuffers[count];
    for (var i = 0; i < count; i += 4) {
      view[i] = HEAP32[(((value) + (4 * i)) >>> 2) >>> 0];
      view[i + 1] = HEAP32[(((value) + (4 * i + 4)) >>> 2) >>> 0];
      view[i + 2] = HEAP32[(((value) + (4 * i + 8)) >>> 2) >>> 0];
      view[i + 3] = HEAP32[(((value) + (4 * i + 12)) >>> 2) >>> 0];
    }
  } else {
    var view = HEAP32.subarray((((value) >>> 2)) >>> 0, ((value + count * 16) >>> 2) >>> 0);
  }
  GLctx.uniform4iv(webglGetUniformLocation(location), view);
}

var _emscripten_glUniform4ui = (location, v0, v1, v2, v3) => {
  GLctx.uniform4ui(webglGetUniformLocation(location), v0, v1, v2, v3);
};

function _emscripten_glUniform4uiv(location, count, value) {
  value >>>= 0;
  count && GLctx.uniform4uiv(webglGetUniformLocation(location), HEAPU32, ((value) >>> 2), count * 4);
}

var _emscripten_glUniformBlockBinding = (program, uniformBlockIndex, uniformBlockBinding) => {
  program = GL.programs[program];
  GLctx.uniformBlockBinding(program, uniformBlockIndex, uniformBlockBinding);
};

function _emscripten_glUniformMatrix2fv(location, count, transpose, value) {
  value >>>= 0;
  if (count <= 72) {
    // avoid allocation when uploading few enough uniforms
    count *= 4;
    var view = miniTempWebGLFloatBuffers[count];
    for (var i = 0; i < count; i += 4) {
      view[i] = HEAPF32[(((value) + (4 * i)) >>> 2) >>> 0];
      view[i + 1] = HEAPF32[(((value) + (4 * i + 4)) >>> 2) >>> 0];
      view[i + 2] = HEAPF32[(((value) + (4 * i + 8)) >>> 2) >>> 0];
      view[i + 3] = HEAPF32[(((value) + (4 * i + 12)) >>> 2) >>> 0];
    }
  } else {
    var view = HEAPF32.subarray((((value) >>> 2)) >>> 0, ((value + count * 16) >>> 2) >>> 0);
  }
  GLctx.uniformMatrix2fv(webglGetUniformLocation(location), !!transpose, view);
}

function _emscripten_glUniformMatrix2x3fv(location, count, transpose, value) {
  value >>>= 0;
  count && GLctx.uniformMatrix2x3fv(webglGetUniformLocation(location), !!transpose, HEAPF32, ((value) >>> 2), count * 6);
}

function _emscripten_glUniformMatrix2x4fv(location, count, transpose, value) {
  value >>>= 0;
  count && GLctx.uniformMatrix2x4fv(webglGetUniformLocation(location), !!transpose, HEAPF32, ((value) >>> 2), count * 8);
}

function _emscripten_glUniformMatrix3fv(location, count, transpose, value) {
  value >>>= 0;
  if (count <= 32) {
    // avoid allocation when uploading few enough uniforms
    count *= 9;
    var view = miniTempWebGLFloatBuffers[count];
    for (var i = 0; i < count; i += 9) {
      view[i] = HEAPF32[(((value) + (4 * i)) >>> 2) >>> 0];
      view[i + 1] = HEAPF32[(((value) + (4 * i + 4)) >>> 2) >>> 0];
      view[i + 2] = HEAPF32[(((value) + (4 * i + 8)) >>> 2) >>> 0];
      view[i + 3] = HEAPF32[(((value) + (4 * i + 12)) >>> 2) >>> 0];
      view[i + 4] = HEAPF32[(((value) + (4 * i + 16)) >>> 2) >>> 0];
      view[i + 5] = HEAPF32[(((value) + (4 * i + 20)) >>> 2) >>> 0];
      view[i + 6] = HEAPF32[(((value) + (4 * i + 24)) >>> 2) >>> 0];
      view[i + 7] = HEAPF32[(((value) + (4 * i + 28)) >>> 2) >>> 0];
      view[i + 8] = HEAPF32[(((value) + (4 * i + 32)) >>> 2) >>> 0];
    }
  } else {
    var view = HEAPF32.subarray((((value) >>> 2)) >>> 0, ((value + count * 36) >>> 2) >>> 0);
  }
  GLctx.uniformMatrix3fv(webglGetUniformLocation(location), !!transpose, view);
}

function _emscripten_glUniformMatrix3x2fv(location, count, transpose, value) {
  value >>>= 0;
  count && GLctx.uniformMatrix3x2fv(webglGetUniformLocation(location), !!transpose, HEAPF32, ((value) >>> 2), count * 6);
}

function _emscripten_glUniformMatrix3x4fv(location, count, transpose, value) {
  value >>>= 0;
  count && GLctx.uniformMatrix3x4fv(webglGetUniformLocation(location), !!transpose, HEAPF32, ((value) >>> 2), count * 12);
}

function _emscripten_glUniformMatrix4fv(location, count, transpose, value) {
  value >>>= 0;
  if (count <= 18) {
    // avoid allocation when uploading few enough uniforms
    var view = miniTempWebGLFloatBuffers[16 * count];
    // hoist the heap out of the loop for size and for pthreads+growth.
    var heap = HEAPF32;
    value = ((value) >>> 2);
    count *= 16;
    for (var i = 0; i < count; i += 16) {
      var dst = value + i;
      view[i] = heap[dst >>> 0];
      view[i + 1] = heap[dst + 1 >>> 0];
      view[i + 2] = heap[dst + 2 >>> 0];
      view[i + 3] = heap[dst + 3 >>> 0];
      view[i + 4] = heap[dst + 4 >>> 0];
      view[i + 5] = heap[dst + 5 >>> 0];
      view[i + 6] = heap[dst + 6 >>> 0];
      view[i + 7] = heap[dst + 7 >>> 0];
      view[i + 8] = heap[dst + 8 >>> 0];
      view[i + 9] = heap[dst + 9 >>> 0];
      view[i + 10] = heap[dst + 10 >>> 0];
      view[i + 11] = heap[dst + 11 >>> 0];
      view[i + 12] = heap[dst + 12 >>> 0];
      view[i + 13] = heap[dst + 13 >>> 0];
      view[i + 14] = heap[dst + 14 >>> 0];
      view[i + 15] = heap[dst + 15 >>> 0];
    }
  } else {
    var view = HEAPF32.subarray((((value) >>> 2)) >>> 0, ((value + count * 64) >>> 2) >>> 0);
  }
  GLctx.uniformMatrix4fv(webglGetUniformLocation(location), !!transpose, view);
}

function _emscripten_glUniformMatrix4x2fv(location, count, transpose, value) {
  value >>>= 0;
  count && GLctx.uniformMatrix4x2fv(webglGetUniformLocation(location), !!transpose, HEAPF32, ((value) >>> 2), count * 8);
}

function _emscripten_glUniformMatrix4x3fv(location, count, transpose, value) {
  value >>>= 0;
  count && GLctx.uniformMatrix4x3fv(webglGetUniformLocation(location), !!transpose, HEAPF32, ((value) >>> 2), count * 12);
}

var _emscripten_glUnmapBuffer = target => {
  if (!emscriptenWebGLValidateMapBufferTarget(target)) {
    GL.recordError(1280);
    err("GL_INVALID_ENUM in glUnmapBuffer");
    return 0;
  }
  var buffer = emscriptenWebGLGetBufferBinding(target);
  var mapping = GL.mappedBuffers[buffer];
  if (!mapping || !mapping.mem) {
    GL.recordError(1282);
    err("buffer was never mapped in glUnmapBuffer");
    return 0;
  }
  if (!(mapping.access & 16)) {
    /* GL_MAP_FLUSH_EXPLICIT_BIT */ GLctx.bufferSubData(target, mapping.offset, HEAPU8.subarray(mapping.mem >>> 0, mapping.mem + mapping.length >>> 0));
  }
  _free(mapping.mem);
  mapping.mem = 0;
  return 1;
};

var _emscripten_glUseProgram = program => {
  program = GL.programs[program];
  GLctx.useProgram(program);
  // Record the currently active program so that we can access the uniform
  // mapping table of that program.
  GLctx.currentProgram = program;
};

var _emscripten_glValidateProgram = program => {
  GLctx.validateProgram(GL.programs[program]);
};

var _emscripten_glVertexAttrib1f = (x0, x1) => GLctx.vertexAttrib1f(x0, x1);

function _emscripten_glVertexAttrib1fv(index, v) {
  v >>>= 0;
  GLctx.vertexAttrib1f(index, HEAPF32[v >>> 2]);
}

var _emscripten_glVertexAttrib2f = (x0, x1, x2) => GLctx.vertexAttrib2f(x0, x1, x2);

function _emscripten_glVertexAttrib2fv(index, v) {
  v >>>= 0;
  GLctx.vertexAttrib2f(index, HEAPF32[v >>> 2], HEAPF32[v + 4 >>> 2]);
}

var _emscripten_glVertexAttrib3f = (x0, x1, x2, x3) => GLctx.vertexAttrib3f(x0, x1, x2, x3);

function _emscripten_glVertexAttrib3fv(index, v) {
  v >>>= 0;
  GLctx.vertexAttrib3f(index, HEAPF32[v >>> 2], HEAPF32[v + 4 >>> 2], HEAPF32[v + 8 >>> 2]);
}

var _emscripten_glVertexAttrib4f = (x0, x1, x2, x3, x4) => GLctx.vertexAttrib4f(x0, x1, x2, x3, x4);

function _emscripten_glVertexAttrib4fv(index, v) {
  v >>>= 0;
  GLctx.vertexAttrib4f(index, HEAPF32[v >>> 2], HEAPF32[v + 4 >>> 2], HEAPF32[v + 8 >>> 2], HEAPF32[v + 12 >>> 2]);
}

var _emscripten_glVertexAttribDivisor = (index, divisor) => {
  GLctx.vertexAttribDivisor(index, divisor);
};

var _glVertexAttribDivisor = _emscripten_glVertexAttribDivisor;

var _emscripten_glVertexAttribDivisorANGLE = _glVertexAttribDivisor;

var _emscripten_glVertexAttribDivisorARB = _glVertexAttribDivisor;

var _emscripten_glVertexAttribDivisorEXT = _glVertexAttribDivisor;

var _emscripten_glVertexAttribDivisorNV = _glVertexAttribDivisor;

var _emscripten_glVertexAttribI4i = (x0, x1, x2, x3, x4) => GLctx.vertexAttribI4i(x0, x1, x2, x3, x4);

function _emscripten_glVertexAttribI4iv(index, v) {
  v >>>= 0;
  GLctx.vertexAttribI4i(index, HEAP32[v >>> 2], HEAP32[v + 4 >>> 2], HEAP32[v + 8 >>> 2], HEAP32[v + 12 >>> 2]);
}

var _emscripten_glVertexAttribI4ui = (x0, x1, x2, x3, x4) => GLctx.vertexAttribI4ui(x0, x1, x2, x3, x4);

function _emscripten_glVertexAttribI4uiv(index, v) {
  v >>>= 0;
  GLctx.vertexAttribI4ui(index, HEAPU32[v >>> 2], HEAPU32[v + 4 >>> 2], HEAPU32[v + 8 >>> 2], HEAPU32[v + 12 >>> 2]);
}

function _emscripten_glVertexAttribIPointer(index, size, type, stride, ptr) {
  ptr >>>= 0;
  var cb = GL.currentContext.clientBuffers[index];
  if (!GLctx.currentArrayBufferBinding) {
    cb.size = size;
    cb.type = type;
    cb.normalized = false;
    cb.stride = stride;
    cb.ptr = ptr;
    cb.clientside = true;
    cb.vertexAttribPointerAdaptor = function(index, size, type, normalized, stride, ptr) {
      this.vertexAttribIPointer(index, size, type, stride, ptr);
    };
    return;
  }
  cb.clientside = false;
  GLctx.vertexAttribIPointer(index, size, type, stride, ptr);
}

function _emscripten_glVertexAttribPointer(index, size, type, normalized, stride, ptr) {
  ptr >>>= 0;
  var cb = GL.currentContext.clientBuffers[index];
  if (!GLctx.currentArrayBufferBinding) {
    cb.size = size;
    cb.type = type;
    cb.normalized = normalized;
    cb.stride = stride;
    cb.ptr = ptr;
    cb.clientside = true;
    cb.vertexAttribPointerAdaptor = function(index, size, type, normalized, stride, ptr) {
      this.vertexAttribPointer(index, size, type, normalized, stride, ptr);
    };
    return;
  }
  cb.clientside = false;
  GLctx.vertexAttribPointer(index, size, type, !!normalized, stride, ptr);
}

var _emscripten_glViewport = (x0, x1, x2, x3) => GLctx.viewport(x0, x1, x2, x3);

function _emscripten_glWaitSync(sync, flags, timeout) {
  sync >>>= 0;
  // See WebGL2 vs GLES3 difference on GL_TIMEOUT_IGNORED above (https://www.khronos.org/registry/webgl/specs/latest/2.0/#5.15)
  timeout = Number(timeout);
  GLctx.waitSync(GL.syncs[sync], flags, timeout);
}

var _emscripten_has_asyncify = () => 2;

var doRequestFullscreen = (target, strategy) => {
  if (!JSEvents.fullscreenEnabled()) return -1;
  target = findEventTarget(target);
  if (!target) return -4;
  if (!target.requestFullscreen && !target.webkitRequestFullscreen) {
    return -3;
  }
  // Queue this function call if we're not currently in an event handler and
  // the user saw it appropriate to do so.
  if (!JSEvents.canPerformEventHandlerRequests()) {
    if (strategy.deferUntilInEventHandler) {
      JSEvents.deferCall(JSEvents_requestFullscreen, 1, [ target, strategy ]);
      return 1;
    }
    return -2;
  }
  return JSEvents_requestFullscreen(target, strategy);
};

function _emscripten_request_fullscreen_strategy(target, deferUntilInEventHandler, fullscreenStrategy) {
  target >>>= 0;
  fullscreenStrategy >>>= 0;
  var strategy = {
    scaleMode: HEAP32[((fullscreenStrategy) >>> 2) >>> 0],
    canvasResolutionScaleMode: HEAP32[(((fullscreenStrategy) + (4)) >>> 2) >>> 0],
    filteringMode: HEAP32[(((fullscreenStrategy) + (8)) >>> 2) >>> 0],
    deferUntilInEventHandler,
    canvasResizedCallback: HEAP32[(((fullscreenStrategy) + (12)) >>> 2) >>> 0],
    canvasResizedCallbackUserData: HEAP32[(((fullscreenStrategy) + (16)) >>> 2) >>> 0]
  };
  return doRequestFullscreen(target, strategy);
}

function _emscripten_request_pointerlock(target, deferUntilInEventHandler) {
  target >>>= 0;
  target = findEventTarget(target);
  if (!target) return -4;
  if (!target.requestPointerLock) {
    return -1;
  }
  // Queue this function call if we're not currently in an event handler and
  // the user saw it appropriate to do so.
  if (!JSEvents.canPerformEventHandlerRequests()) {
    if (deferUntilInEventHandler) {
      JSEvents.deferCall(requestPointerLock, 2, [ target ]);
      return 1;
    }
    return -2;
  }
  return requestPointerLock(target);
}

var getHeapMax = () => // Stay one Wasm page short of 4GB: while e.g. Chrome is able to allocate
// full 4GB Wasm memories, the size will wrap back to 0 bytes in Wasm side
// for any code that deals with heap sizes, which would require special
// casing all heap size related code to treat 0 specially.
4294901760;

var alignMemory = (size, alignment) => Math.ceil(size / alignment) * alignment;

var growMemory = size => {
  var oldHeapSize = wasmMemory.buffer.byteLength;
  var pages = ((size - oldHeapSize + 65535) / 65536) | 0;
  try {
    // round size grow request up to wasm page size (fixed 64KB per spec)
    wasmMemory.grow(pages);
    // .grow() takes a delta compared to the previous size
    updateMemoryViews();
    return 1;
  } catch (e) {}
};

function _emscripten_resize_heap(requestedSize) {
  requestedSize >>>= 0;
  var oldSize = HEAPU8.length;
  // With multithreaded builds, races can happen (another thread might increase the size
  // in between), so return a failure, and let the caller retry.
  // Memory resize rules:
  // 1.  Always increase heap size to at least the requested size, rounded up
  //     to next page multiple.
  // 2a. If MEMORY_GROWTH_LINEAR_STEP == -1, excessively resize the heap
  //     geometrically: increase the heap size according to
  //     MEMORY_GROWTH_GEOMETRIC_STEP factor (default +20%), At most
  //     overreserve by MEMORY_GROWTH_GEOMETRIC_CAP bytes (default 96MB).
  // 2b. If MEMORY_GROWTH_LINEAR_STEP != -1, excessively resize the heap
  //     linearly: increase the heap size by at least
  //     MEMORY_GROWTH_LINEAR_STEP bytes.
  // 3.  Max size for the heap is capped at 2048MB-WASM_PAGE_SIZE, or by
  //     MAXIMUM_MEMORY, or by ASAN limit, depending on which is smallest
  // 4.  If we were unable to allocate as much memory, it may be due to
  //     over-eager decision to excessively reserve due to (3) above.
  //     Hence if an allocation fails, cut down on the amount of excess
  //     growth, in an attempt to succeed to perform a smaller allocation.
  // A limit is set for how much we can grow. We should not exceed that
  // (the wasm binary specifies it, so if we tried, we'd fail anyhow).
  var maxHeapSize = getHeapMax();
  if (requestedSize > maxHeapSize) {
    return false;
  }
  // Loop through potential heap size increases. If we attempt a too eager
  // reservation that fails, cut down on the attempted size and reserve a
  // smaller bump instead. (max 3 times, chosen somewhat arbitrarily)
  for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
    var overGrownHeapSize = oldSize * (1 + .2 / cutDown);
    // ensure geometric growth
    // but limit overreserving (default to capping at +96MB overgrowth at most)
    overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
    var newSize = Math.min(maxHeapSize, alignMemory(Math.max(requestedSize, overGrownHeapSize), 65536));
    var replacement = growMemory(newSize);
    if (replacement) {
      return true;
    }
  }
  return false;
}

/** @suppress {checkTypes} */ var _emscripten_sample_gamepad_data = () => {
  try {
    if (navigator.getGamepads) return (JSEvents.lastGamepadState = navigator.getGamepads()) ? 0 : -1;
  } catch (e) {
    navigator.getGamepads = null;
  }
  return -1;
};

var registerBeforeUnloadEventCallback = (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) => {
  var beforeUnloadEventHandlerFunc = e => {
    // Note: This is always called on the main browser thread, since it needs synchronously return a value!
    var confirmationMessage = getWasmTableEntry(callbackfunc)(eventTypeId, 0, userData);
    if (confirmationMessage) {
      confirmationMessage = UTF8ToString(confirmationMessage);
    }
    if (confirmationMessage) {
      e.preventDefault();
      e.returnValue = confirmationMessage;
      return confirmationMessage;
    }
  };
  var eventHandler = {
    target: findEventTarget(target),
    eventTypeString,
    eventTypeId,
    userData,
    callbackfunc,
    handlerFunc: beforeUnloadEventHandlerFunc,
    useCapture
  };
  return JSEvents.registerOrRemoveHandler(eventHandler);
};

function _emscripten_set_beforeunload_callback_on_thread(userData, callbackfunc, targetThread) {
  userData >>>= 0;
  callbackfunc >>>= 0;
  targetThread >>>= 0;
  if (typeof onbeforeunload == "undefined") return -1;
  // beforeunload callback can only be registered on the main browser thread, because the page will go away immediately after returning from the handler,
  // and there is no time to start proxying it anywhere.
  if (targetThread !== 1) return -5;
  return registerBeforeUnloadEventCallback(2, userData, true, callbackfunc, 28, "beforeunload");
}

var registerFocusEventCallback = (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) => {
  var eventSize = 256;
  JSEvents.focusEvent ||= _malloc(eventSize);
  var focusEventHandlerFunc = e => {
    var nodeName = JSEvents.getNodeNameForTarget(e.target);
    var id = e.target.id ? e.target.id : "";
    var focusEvent = JSEvents.focusEvent;
    stringToUTF8(nodeName, focusEvent + 0, 128);
    stringToUTF8(id, focusEvent + 128, 128);
    if (getWasmTableEntry(callbackfunc)(eventTypeId, focusEvent, userData)) e.preventDefault();
  };
  var eventHandler = {
    target: findEventTarget(target),
    eventTypeString,
    eventTypeId,
    userData,
    callbackfunc,
    handlerFunc: focusEventHandlerFunc,
    useCapture
  };
  return JSEvents.registerOrRemoveHandler(eventHandler);
};

function _emscripten_set_blur_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
  target >>>= 0;
  userData >>>= 0;
  callbackfunc >>>= 0;
  targetThread >>>= 0;
  return registerFocusEventCallback(target, userData, useCapture, callbackfunc, 12, "blur", targetThread);
}

function _emscripten_set_element_css_size(target, width, height) {
  target >>>= 0;
  target = findEventTarget(target);
  if (!target) return -4;
  target.style.width = width + "px";
  target.style.height = height + "px";
  return 0;
}

function _emscripten_set_focus_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
  target >>>= 0;
  userData >>>= 0;
  callbackfunc >>>= 0;
  targetThread >>>= 0;
  return registerFocusEventCallback(target, userData, useCapture, callbackfunc, 13, "focus", targetThread);
}

var registerFullscreenChangeEventCallback = (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) => {
  var eventSize = 276;
  JSEvents.fullscreenChangeEvent ||= _malloc(eventSize);
  var fullscreenChangeEventHandlerFunc = e => {
    var fullscreenChangeEvent = JSEvents.fullscreenChangeEvent;
    fillFullscreenChangeEventData(fullscreenChangeEvent);
    if (getWasmTableEntry(callbackfunc)(eventTypeId, fullscreenChangeEvent, userData)) e.preventDefault();
  };
  var eventHandler = {
    target,
    eventTypeString,
    eventTypeId,
    userData,
    callbackfunc,
    handlerFunc: fullscreenChangeEventHandlerFunc,
    useCapture
  };
  return JSEvents.registerOrRemoveHandler(eventHandler);
};

function _emscripten_set_fullscreenchange_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
  target >>>= 0;
  userData >>>= 0;
  callbackfunc >>>= 0;
  targetThread >>>= 0;
  if (!JSEvents.fullscreenEnabled()) return -1;
  target = findEventTarget(target);
  if (!target) return -4;
  // As of Safari 13.0.3 on macOS Catalina 10.15.1 still ships with prefixed webkitfullscreenchange. TODO: revisit this check once Safari ships unprefixed version.
  // TODO: When this block is removed, also change test/test_html5_remove_event_listener.c test expectation on emscripten_set_fullscreenchange_callback().
  registerFullscreenChangeEventCallback(target, userData, useCapture, callbackfunc, 19, "webkitfullscreenchange", targetThread);
  return registerFullscreenChangeEventCallback(target, userData, useCapture, callbackfunc, 19, "fullscreenchange", targetThread);
}

var registerGamepadEventCallback = (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) => {
  var eventSize = 1240;
  JSEvents.gamepadEvent ||= _malloc(eventSize);
  var gamepadEventHandlerFunc = e => {
    var gamepadEvent = JSEvents.gamepadEvent;
    fillGamepadEventData(gamepadEvent, e["gamepad"]);
    if (getWasmTableEntry(callbackfunc)(eventTypeId, gamepadEvent, userData)) e.preventDefault();
  };
  var eventHandler = {
    target: findEventTarget(target),
    allowsDeferredCalls: true,
    eventTypeString,
    eventTypeId,
    userData,
    callbackfunc,
    handlerFunc: gamepadEventHandlerFunc,
    useCapture
  };
  return JSEvents.registerOrRemoveHandler(eventHandler);
};

function _emscripten_set_gamepadconnected_callback_on_thread(userData, useCapture, callbackfunc, targetThread) {
  userData >>>= 0;
  callbackfunc >>>= 0;
  targetThread >>>= 0;
  if (_emscripten_sample_gamepad_data()) return -1;
  return registerGamepadEventCallback(2, userData, useCapture, callbackfunc, 26, "gamepadconnected", targetThread);
}

function _emscripten_set_gamepaddisconnected_callback_on_thread(userData, useCapture, callbackfunc, targetThread) {
  userData >>>= 0;
  callbackfunc >>>= 0;
  targetThread >>>= 0;
  if (_emscripten_sample_gamepad_data()) return -1;
  return registerGamepadEventCallback(2, userData, useCapture, callbackfunc, 27, "gamepaddisconnected", targetThread);
}

var registerKeyEventCallback = (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) => {
  var eventSize = 160;
  JSEvents.keyEvent ||= _malloc(eventSize);
  var keyEventHandlerFunc = e => {
    var keyEventData = JSEvents.keyEvent;
    HEAPF64[((keyEventData) >>> 3) >>> 0] = e.timeStamp;
    var idx = ((keyEventData) >>> 2);
    HEAP32[idx + 2 >>> 0] = e.location;
    HEAP8[keyEventData + 12 >>> 0] = e.ctrlKey;
    HEAP8[keyEventData + 13 >>> 0] = e.shiftKey;
    HEAP8[keyEventData + 14 >>> 0] = e.altKey;
    HEAP8[keyEventData + 15 >>> 0] = e.metaKey;
    HEAP8[keyEventData + 16 >>> 0] = e.repeat;
    HEAP32[idx + 5 >>> 0] = e.charCode;
    HEAP32[idx + 6 >>> 0] = e.keyCode;
    HEAP32[idx + 7 >>> 0] = e.which;
    stringToUTF8(e.key || "", keyEventData + 32, 32);
    stringToUTF8(e.code || "", keyEventData + 64, 32);
    stringToUTF8(e.char || "", keyEventData + 96, 32);
    stringToUTF8(e.locale || "", keyEventData + 128, 32);
    if (getWasmTableEntry(callbackfunc)(eventTypeId, keyEventData, userData)) e.preventDefault();
  };
  var eventHandler = {
    target: findEventTarget(target),
    eventTypeString,
    eventTypeId,
    userData,
    callbackfunc,
    handlerFunc: keyEventHandlerFunc,
    useCapture
  };
  return JSEvents.registerOrRemoveHandler(eventHandler);
};

function _emscripten_set_keydown_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
  target >>>= 0;
  userData >>>= 0;
  callbackfunc >>>= 0;
  targetThread >>>= 0;
  return registerKeyEventCallback(target, userData, useCapture, callbackfunc, 2, "keydown", targetThread);
}

function _emscripten_set_keypress_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
  target >>>= 0;
  userData >>>= 0;
  callbackfunc >>>= 0;
  targetThread >>>= 0;
  return registerKeyEventCallback(target, userData, useCapture, callbackfunc, 1, "keypress", targetThread);
}

function _emscripten_set_keyup_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
  target >>>= 0;
  userData >>>= 0;
  callbackfunc >>>= 0;
  targetThread >>>= 0;
  return registerKeyEventCallback(target, userData, useCapture, callbackfunc, 3, "keyup", targetThread);
}

var screenOrientation = () => {
  if (!window.screen) return undefined;
  return screen.orientation || screen["mozOrientation"] || screen["webkitOrientation"];
};

var fillOrientationChangeEventData = eventStruct => {
  // OrientationType enum
  var orientationsType1 = [ "portrait-primary", "portrait-secondary", "landscape-primary", "landscape-secondary" ];
  // alternative selection from OrientationLockType enum
  var orientationsType2 = [ "portrait", "portrait", "landscape", "landscape" ];
  var orientationIndex = 0;
  var orientationAngle = 0;
  var screenOrientObj = screenOrientation();
  if (typeof screenOrientObj === "object") {
    orientationIndex = orientationsType1.indexOf(screenOrientObj.type);
    if (orientationIndex < 0) {
      orientationIndex = orientationsType2.indexOf(screenOrientObj.type);
    }
    if (orientationIndex >= 0) {
      orientationIndex = 1 << orientationIndex;
    }
    orientationAngle = screenOrientObj.angle;
  } else {
    // fallback for Safari earlier than 16.4 (March 2023)
    orientationAngle = window.orientation;
  }
  HEAP32[((eventStruct) >>> 2) >>> 0] = orientationIndex;
  HEAP32[(((eventStruct) + (4)) >>> 2) >>> 0] = orientationAngle;
};

var registerOrientationChangeEventCallback = (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) => {
  var eventSize = 8;
  JSEvents.orientationChangeEvent ||= _malloc(eventSize);
  var orientationChangeEventHandlerFunc = e => {
    var orientationChangeEvent = JSEvents.orientationChangeEvent;
    fillOrientationChangeEventData(orientationChangeEvent);
    if (getWasmTableEntry(callbackfunc)(eventTypeId, orientationChangeEvent, userData)) e.preventDefault();
  };
  var eventHandler = {
    target,
    eventTypeString,
    eventTypeId,
    userData,
    callbackfunc,
    handlerFunc: orientationChangeEventHandlerFunc,
    useCapture
  };
  return JSEvents.registerOrRemoveHandler(eventHandler);
};

function _emscripten_set_orientationchange_callback_on_thread(userData, useCapture, callbackfunc, targetThread) {
  userData >>>= 0;
  callbackfunc >>>= 0;
  targetThread >>>= 0;
  if (!window.screen || !screen.orientation) return -1;
  return registerOrientationChangeEventCallback(screen.orientation, userData, useCapture, callbackfunc, 18, "change", targetThread);
}

var fillPointerlockChangeEventData = eventStruct => {
  var pointerLockElement = document.pointerLockElement;
  var isPointerlocked = !!pointerLockElement;
  // Assigning a boolean to HEAP32 with expected type coercion.
  /** @suppress{checkTypes} */ HEAP8[eventStruct >>> 0] = isPointerlocked;
  var nodeName = JSEvents.getNodeNameForTarget(pointerLockElement);
  var id = pointerLockElement?.id || "";
  stringToUTF8(nodeName, eventStruct + 1, 128);
  stringToUTF8(id, eventStruct + 129, 128);
};

var registerPointerlockChangeEventCallback = (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) => {
  var eventSize = 257;
  JSEvents.pointerlockChangeEvent ||= _malloc(eventSize);
  var pointerlockChangeEventHandlerFunc = e => {
    var pointerlockChangeEvent = JSEvents.pointerlockChangeEvent;
    fillPointerlockChangeEventData(pointerlockChangeEvent);
    if (getWasmTableEntry(callbackfunc)(eventTypeId, pointerlockChangeEvent, userData)) e.preventDefault();
  };
  var eventHandler = {
    target,
    eventTypeString,
    eventTypeId,
    userData,
    callbackfunc,
    handlerFunc: pointerlockChangeEventHandlerFunc,
    useCapture
  };
  return JSEvents.registerOrRemoveHandler(eventHandler);
};

function _emscripten_set_pointerlockchange_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
  target >>>= 0;
  userData >>>= 0;
  callbackfunc >>>= 0;
  targetThread >>>= 0;
  if (!document.body?.requestPointerLock) {
    return -1;
  }
  target = findEventTarget(target);
  if (!target) return -4;
  return registerPointerlockChangeEventCallback(target, userData, useCapture, callbackfunc, 20, "pointerlockchange", targetThread);
}

var registerUiEventCallback = (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) => {
  var eventSize = 36;
  JSEvents.uiEvent ||= _malloc(eventSize);
  target = findEventTarget(target);
  var uiEventHandlerFunc = e => {
    if (e.target != target) {
      // Never take ui events such as scroll via a 'bubbled' route, but always from the direct element that
      // was targeted. Otherwise e.g. if app logs a message in response to a page scroll, the Emscripten log
      // message box could cause to scroll, generating a new (bubbled) scroll message, causing a new log print,
      // causing a new scroll, etc..
      return;
    }
    var b = document.body;
    // Take document.body to a variable, Closure compiler does not outline access to it on its own.
    if (!b) {
      // During a page unload 'body' can be null, with "Cannot read property 'clientWidth' of null" being thrown
      return;
    }
    var uiEvent = JSEvents.uiEvent;
    HEAP32[((uiEvent) >>> 2) >>> 0] = 0;
    // always zero for resize and scroll
    HEAP32[(((uiEvent) + (4)) >>> 2) >>> 0] = b.clientWidth;
    HEAP32[(((uiEvent) + (8)) >>> 2) >>> 0] = b.clientHeight;
    HEAP32[(((uiEvent) + (12)) >>> 2) >>> 0] = innerWidth;
    HEAP32[(((uiEvent) + (16)) >>> 2) >>> 0] = innerHeight;
    HEAP32[(((uiEvent) + (20)) >>> 2) >>> 0] = outerWidth;
    HEAP32[(((uiEvent) + (24)) >>> 2) >>> 0] = outerHeight;
    HEAP32[(((uiEvent) + (28)) >>> 2) >>> 0] = pageXOffset | 0;
    // scroll offsets are float
    HEAP32[(((uiEvent) + (32)) >>> 2) >>> 0] = pageYOffset | 0;
    if (getWasmTableEntry(callbackfunc)(eventTypeId, uiEvent, userData)) e.preventDefault();
  };
  var eventHandler = {
    target,
    eventTypeString,
    eventTypeId,
    userData,
    callbackfunc,
    handlerFunc: uiEventHandlerFunc,
    useCapture
  };
  return JSEvents.registerOrRemoveHandler(eventHandler);
};

function _emscripten_set_resize_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
  target >>>= 0;
  userData >>>= 0;
  callbackfunc >>>= 0;
  targetThread >>>= 0;
  return registerUiEventCallback(target, userData, useCapture, callbackfunc, 10, "resize", targetThread);
}

var fillVisibilityChangeEventData = eventStruct => {
  var visibilityStates = [ "hidden", "visible", "prerender", "unloaded" ];
  var visibilityState = visibilityStates.indexOf(document.visibilityState);
  // Assigning a boolean to HEAP32 with expected type coercion.
  /** @suppress{checkTypes} */ HEAP8[eventStruct >>> 0] = document.hidden;
  HEAP32[(((eventStruct) + (4)) >>> 2) >>> 0] = visibilityState;
};

var registerVisibilityChangeEventCallback = (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) => {
  var eventSize = 8;
  JSEvents.visibilityChangeEvent ||= _malloc(eventSize);
  var visibilityChangeEventHandlerFunc = e => {
    var visibilityChangeEvent = JSEvents.visibilityChangeEvent;
    fillVisibilityChangeEventData(visibilityChangeEvent);
    if (getWasmTableEntry(callbackfunc)(eventTypeId, visibilityChangeEvent, userData)) e.preventDefault();
  };
  var eventHandler = {
    target,
    eventTypeString,
    eventTypeId,
    userData,
    callbackfunc,
    handlerFunc: visibilityChangeEventHandlerFunc,
    useCapture
  };
  return JSEvents.registerOrRemoveHandler(eventHandler);
};

function _emscripten_set_visibilitychange_callback_on_thread(userData, useCapture, callbackfunc, targetThread) {
  userData >>>= 0;
  callbackfunc >>>= 0;
  targetThread >>>= 0;
  return registerVisibilityChangeEventCallback(specialHTMLTargets[1], userData, useCapture, callbackfunc, 21, "visibilitychange", targetThread);
}

var fillMouseEventData = (eventStruct, e, target) => {
  HEAPF64[((eventStruct) >>> 3) >>> 0] = e.timeStamp;
  var idx = ((eventStruct) >>> 2);
  HEAP32[idx + 2 >>> 0] = e.screenX;
  HEAP32[idx + 3 >>> 0] = e.screenY;
  HEAP32[idx + 4 >>> 0] = e.clientX;
  HEAP32[idx + 5 >>> 0] = e.clientY;
  HEAP8[eventStruct + 24 >>> 0] = e.ctrlKey;
  HEAP8[eventStruct + 25 >>> 0] = e.shiftKey;
  HEAP8[eventStruct + 26 >>> 0] = e.altKey;
  HEAP8[eventStruct + 27 >>> 0] = e.metaKey;
  HEAP16[idx * 2 + 14 >>> 0] = e.button;
  HEAP16[idx * 2 + 15 >>> 0] = e.buttons;
  HEAP32[idx + 8 >>> 0] = e["movementX"];
  HEAP32[idx + 9 >>> 0] = e["movementY"];
  // Note: rect contains doubles (truncated to placate SAFE_HEAP, which is the same behaviour when writing to HEAP32 anyway)
  var rect = getBoundingClientRect(target);
  HEAP32[idx + 10 >>> 0] = e.clientX - (rect.left | 0);
  HEAP32[idx + 11 >>> 0] = e.clientY - (rect.top | 0);
};

var registerWheelEventCallback = (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) => {
  var eventSize = 96;
  JSEvents.wheelEvent ||= _malloc(eventSize);
  // The DOM Level 3 events spec event 'wheel'
  var wheelHandlerFunc = e => {
    var wheelEvent = JSEvents.wheelEvent;
    fillMouseEventData(wheelEvent, e, target);
    HEAPF64[(((wheelEvent) + (64)) >>> 3) >>> 0] = e["deltaX"];
    HEAPF64[(((wheelEvent) + (72)) >>> 3) >>> 0] = e["deltaY"];
    HEAPF64[(((wheelEvent) + (80)) >>> 3) >>> 0] = e["deltaZ"];
    HEAP32[(((wheelEvent) + (88)) >>> 2) >>> 0] = e["deltaMode"];
    if (getWasmTableEntry(callbackfunc)(eventTypeId, wheelEvent, userData)) e.preventDefault();
  };
  var eventHandler = {
    target,
    allowsDeferredCalls: true,
    eventTypeString,
    eventTypeId,
    userData,
    callbackfunc,
    handlerFunc: wheelHandlerFunc,
    useCapture
  };
  return JSEvents.registerOrRemoveHandler(eventHandler);
};

function _emscripten_set_wheel_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
  target >>>= 0;
  userData >>>= 0;
  callbackfunc >>>= 0;
  targetThread >>>= 0;
  target = findEventTarget(target);
  if (!target) return -4;
  if (typeof target.onwheel != "undefined") {
    return registerWheelEventCallback(target, userData, useCapture, callbackfunc, 9, "wheel", targetThread);
  } else {
    return -1;
  }
}

function _emscripten_set_window_title(title) {
  title >>>= 0;
  return document.title = UTF8ToString(title);
}

var _emscripten_sleep = function(ms) {
  let innerFunc = () => new Promise(resolve => setTimeout(resolve, ms));
  return Asyncify.handleAsync(innerFunc);
};

_emscripten_sleep.isAsync = true;

var webglPowerPreferences = [ "default", "low-power", "high-performance" ];

function _emscripten_webgl_do_create_context(target, attributes) {
  target >>>= 0;
  attributes >>>= 0;
  var attr32 = ((attributes) >>> 2);
  var powerPreference = HEAP32[attr32 + (8 >> 2) >>> 0];
  var contextAttributes = {
    "alpha": !!HEAP8[attributes + 0 >>> 0],
    "depth": !!HEAP8[attributes + 1 >>> 0],
    "stencil": !!HEAP8[attributes + 2 >>> 0],
    "antialias": !!HEAP8[attributes + 3 >>> 0],
    "premultipliedAlpha": !!HEAP8[attributes + 4 >>> 0],
    "preserveDrawingBuffer": !!HEAP8[attributes + 5 >>> 0],
    "powerPreference": webglPowerPreferences[powerPreference],
    "failIfMajorPerformanceCaveat": !!HEAP8[attributes + 12 >>> 0],
    // The following are not predefined WebGL context attributes in the WebGL specification, so the property names can be minified by Closure.
    majorVersion: HEAP32[attr32 + (16 >> 2) >>> 0],
    minorVersion: HEAP32[attr32 + (20 >> 2) >>> 0],
    enableExtensionsByDefault: HEAP8[attributes + 24 >>> 0],
    explicitSwapControl: HEAP8[attributes + 25 >>> 0],
    proxyContextToMainThread: HEAP32[attr32 + (28 >> 2) >>> 0],
    renderViaOffscreenBackBuffer: HEAP8[attributes + 32 >>> 0]
  };
  var canvas = findCanvasEventTarget(target);
  if (!canvas) {
    return 0;
  }
  if (contextAttributes.explicitSwapControl) {
    return 0;
  }
  var contextHandle = GL.createContext(canvas, contextAttributes);
  return contextHandle;
}

var _emscripten_webgl_create_context = _emscripten_webgl_do_create_context;

function _emscripten_webgl_destroy_context(contextHandle) {
  contextHandle >>>= 0;
  if (GL.currentContext == contextHandle) GL.currentContext = 0;
  GL.deleteContext(contextHandle);
}

function _emscripten_webgl_enable_extension(contextHandle, extension) {
  contextHandle >>>= 0;
  extension >>>= 0;
  var context = GL.getContext(contextHandle);
  var extString = UTF8ToString(extension);
  if (extString.startsWith("GL_")) extString = extString.slice(3);
  // Allow enabling extensions both with "GL_" prefix and without.
  // Switch-board that pulls in code for all GL extensions, even if those are not used :/
  // Build with -sGL_SUPPORT_SIMPLE_ENABLE_EXTENSIONS=0 to avoid this.
  if (extString == "WEBGL_draw_instanced_base_vertex_base_instance") webgl_enable_WEBGL_draw_instanced_base_vertex_base_instance(GLctx);
  if (extString == "WEBGL_multi_draw_instanced_base_vertex_base_instance") webgl_enable_WEBGL_multi_draw_instanced_base_vertex_base_instance(GLctx);
  if (extString == "WEBGL_multi_draw") webgl_enable_WEBGL_multi_draw(GLctx);
  if (extString == "EXT_polygon_offset_clamp") webgl_enable_EXT_polygon_offset_clamp(GLctx);
  if (extString == "EXT_clip_control") webgl_enable_EXT_clip_control(GLctx);
  if (extString == "WEBGL_polygon_mode") webgl_enable_WEBGL_polygon_mode(GLctx);
  var ext = context.GLctx.getExtension(extString);
  return !!ext;
}

function _emscripten_webgl_do_get_current_context() {
  return GL.currentContext ? GL.currentContext.handle : 0;
}

var _emscripten_webgl_get_current_context = _emscripten_webgl_do_get_current_context;

function _emscripten_webgl_make_context_current(contextHandle) {
  contextHandle >>>= 0;
  var success = GL.makeContextCurrent(contextHandle);
  return success ? 0 : -5;
}

var ENV = {};

var getExecutableName = () => thisProgram || "./this.program";

var getEnvStrings = () => {
  if (!getEnvStrings.strings) {
    // Default values.
    var lang = (globalThis.navigator?.language ?? "C").replace("-", "_") + ".UTF-8";
    var env = {
      "USER": "web_user",
      "LOGNAME": "web_user",
      "PATH": "/",
      "PWD": "/",
      "HOME": "/home/web_user",
      "LANG": lang,
      "_": getExecutableName()
    };
    // Apply the user-provided values, if any.
    for (var x in ENV) {
      // x is a key in ENV; if ENV[x] is undefined, that means it was
      // explicitly set to be so. We allow user code to do that to
      // force variables with default values to remain unset.
      if (ENV[x] === undefined) delete env[x]; else env[x] = ENV[x];
    }
    var strings = [];
    for (var x in env) {
      strings.push(`${x}=${env[x]}`);
    }
    getEnvStrings.strings = strings;
  }
  return getEnvStrings.strings;
};

function _environ_get(__environ, environ_buf) {
  __environ >>>= 0;
  environ_buf >>>= 0;
  var bufSize = 0;
  var envp = 0;
  for (var string of getEnvStrings()) {
    var ptr = environ_buf + bufSize;
    HEAPU32[(((__environ) + (envp)) >>> 2) >>> 0] = ptr;
    bufSize += stringToUTF8(string, ptr, Infinity) + 1;
    envp += 4;
  }
  return 0;
}

function _environ_sizes_get(penviron_count, penviron_buf_size) {
  penviron_count >>>= 0;
  penviron_buf_size >>>= 0;
  var strings = getEnvStrings();
  HEAPU32[((penviron_count) >>> 2) >>> 0] = strings.length;
  var bufSize = 0;
  for (var string of strings) {
    bufSize += lengthBytesUTF8(string) + 1;
  }
  HEAPU32[((penviron_buf_size) >>> 2) >>> 0] = bufSize;
  return 0;
}

function _fd_close(fd) {
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    FS.close(stream);
    return 0;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return e.errno;
  }
}

/** @param {number=} offset */ var doReadv = (stream, iov, iovcnt, offset) => {
  var ret = 0;
  for (var i = 0; i < iovcnt; i++) {
    var ptr = HEAPU32[((iov) >>> 2) >>> 0];
    var len = HEAPU32[(((iov) + (4)) >>> 2) >>> 0];
    iov += 8;
    var curr = FS.read(stream, HEAP8, ptr, len, offset);
    if (curr < 0) return -1;
    ret += curr;
    if (curr < len) break;
    // nothing more to read
    if (typeof offset != "undefined") {
      offset += curr;
    }
  }
  return ret;
};

function _fd_read(fd, iov, iovcnt, pnum) {
  iov >>>= 0;
  iovcnt >>>= 0;
  pnum >>>= 0;
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    var num = doReadv(stream, iov, iovcnt);
    HEAPU32[((pnum) >>> 2) >>> 0] = num;
    return 0;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return e.errno;
  }
}

function _fd_seek(fd, offset, whence, newOffset) {
  offset = bigintToI53Checked(offset);
  newOffset >>>= 0;
  try {
    if (isNaN(offset)) return 22;
    var stream = SYSCALLS.getStreamFromFD(fd);
    FS.llseek(stream, offset, whence);
    HEAP64[((newOffset) >>> 3) >>> 0] = BigInt(stream.position);
    if (stream.getdents && offset === 0 && whence === 0) stream.getdents = null;
    // reset readdir state
    return 0;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return e.errno;
  }
}

/** @param {number=} offset */ var doWritev = (stream, iov, iovcnt, offset) => {
  var ret = 0;
  for (var i = 0; i < iovcnt; i++) {
    var ptr = HEAPU32[((iov) >>> 2) >>> 0];
    var len = HEAPU32[(((iov) + (4)) >>> 2) >>> 0];
    iov += 8;
    var curr = FS.write(stream, HEAP8, ptr, len, offset);
    if (curr < 0) return -1;
    ret += curr;
    if (curr < len) {
      // No more space to write.
      break;
    }
    if (typeof offset != "undefined") {
      offset += curr;
    }
  }
  return ret;
};

function _fd_write(fd, iov, iovcnt, pnum) {
  iov >>>= 0;
  iovcnt >>>= 0;
  pnum >>>= 0;
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    var num = doWritev(stream, iov, iovcnt);
    HEAPU32[((pnum) >>> 2) >>> 0] = num;
    return 0;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return e.errno;
  }
}

var _glActiveTexture = _emscripten_glActiveTexture;

var _glAttachShader = _emscripten_glAttachShader;

var _glBeginQuery = _emscripten_glBeginQuery;

var _glBeginTransformFeedback = _emscripten_glBeginTransformFeedback;

var _glBindBuffer = _emscripten_glBindBuffer;

var _glBindBufferBase = _emscripten_glBindBufferBase;

var _glBindBufferRange = _emscripten_glBindBufferRange;

var _glBindFramebuffer = _emscripten_glBindFramebuffer;

var _glBindRenderbuffer = _emscripten_glBindRenderbuffer;

var _glBindSampler = _emscripten_glBindSampler;

var _glBindTexture = _emscripten_glBindTexture;

var _glBlendColor = _emscripten_glBlendColor;

var _glBlendEquationSeparate = _emscripten_glBlendEquationSeparate;

var _glBlendFuncSeparate = _emscripten_glBlendFuncSeparate;

var _glBlitFramebuffer = _emscripten_glBlitFramebuffer;

var _glBufferData = _emscripten_glBufferData;

var _glBufferSubData = _emscripten_glBufferSubData;

var _glCheckFramebufferStatus = _emscripten_glCheckFramebufferStatus;

var _glClear = _emscripten_glClear;

var _glClearBufferfv = _emscripten_glClearBufferfv;

var _glClearBufferiv = _emscripten_glClearBufferiv;

var _glClearBufferuiv = _emscripten_glClearBufferuiv;

var _glClearColor = _emscripten_glClearColor;

var _glClearDepthf = _emscripten_glClearDepthf;

var _glClearStencil = _emscripten_glClearStencil;

var _glColorMask = _emscripten_glColorMask;

var _glCompileShader = _emscripten_glCompileShader;

var _glCompressedTexSubImage2D = _emscripten_glCompressedTexSubImage2D;

var _glCompressedTexSubImage3D = _emscripten_glCompressedTexSubImage3D;

var _glCopyBufferSubData = _emscripten_glCopyBufferSubData;

var _glCopyTexSubImage2D = _emscripten_glCopyTexSubImage2D;

var _glCopyTexSubImage3D = _emscripten_glCopyTexSubImage3D;

var _glCreateProgram = _emscripten_glCreateProgram;

var _glCreateShader = _emscripten_glCreateShader;

var _glCullFace = _emscripten_glCullFace;

var _glDeleteBuffers = _emscripten_glDeleteBuffers;

var _glDeleteFramebuffers = _emscripten_glDeleteFramebuffers;

var _glDeleteProgram = _emscripten_glDeleteProgram;

var _glDeleteQueries = _emscripten_glDeleteQueries;

var _glDeleteRenderbuffers = _emscripten_glDeleteRenderbuffers;

var _glDeleteSamplers = _emscripten_glDeleteSamplers;

var _glDeleteShader = _emscripten_glDeleteShader;

var _glDeleteSync = _emscripten_glDeleteSync;

var _glDeleteTextures = _emscripten_glDeleteTextures;

var _glDepthFunc = _emscripten_glDepthFunc;

var _glDepthMask = _emscripten_glDepthMask;

var _glDepthRangef = _emscripten_glDepthRangef;

var _glDisable = _emscripten_glDisable;

var _glDisableVertexAttribArray = _emscripten_glDisableVertexAttribArray;

var _glDrawArrays = _emscripten_glDrawArrays;

var _glEnable = _emscripten_glEnable;

var _glEnableVertexAttribArray = _emscripten_glEnableVertexAttribArray;

var _glEndQuery = _emscripten_glEndQuery;

var _glEndTransformFeedback = _emscripten_glEndTransformFeedback;

var _glFenceSync = _emscripten_glFenceSync;

var _glFinish = _emscripten_glFinish;

var _glFlush = _emscripten_glFlush;

var _glFramebufferRenderbuffer = _emscripten_glFramebufferRenderbuffer;

var _glFramebufferTexture2D = _emscripten_glFramebufferTexture2D;

var _glFramebufferTextureLayer = _emscripten_glFramebufferTextureLayer;

var _glFrontFace = _emscripten_glFrontFace;

var _glGenBuffers = _emscripten_glGenBuffers;

var _glGenFramebuffers = _emscripten_glGenFramebuffers;

var _glGenQueries = _emscripten_glGenQueries;

var _glGenRenderbuffers = _emscripten_glGenRenderbuffers;

var _glGenSamplers = _emscripten_glGenSamplers;

var _glGenTextures = _emscripten_glGenTextures;

var _glGenerateMipmap = _emscripten_glGenerateMipmap;

var _glGetActiveAttrib = _emscripten_glGetActiveAttrib;

var _glGetAttribLocation = _emscripten_glGetAttribLocation;

function _emscripten_glGetBufferSubData(target, offset, size, data) {
  offset >>>= 0;
  size >>>= 0;
  data >>>= 0;
  if (!data) {
    // GLES2 specification does not specify how to behave if data is a null pointer. Since calling this function does not make sense
    // if data == null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  size && GLctx.getBufferSubData(target, offset, HEAPU8.subarray(data >>> 0, data + size >>> 0));
}

var _glGetBufferSubData = _emscripten_glGetBufferSubData;

var _glGetError = _emscripten_glGetError;

var _glGetFramebufferAttachmentParameteriv = _emscripten_glGetFramebufferAttachmentParameteriv;

var _glGetIntegerv = _emscripten_glGetIntegerv;

var _glGetProgramInfoLog = _emscripten_glGetProgramInfoLog;

var _glGetProgramiv = _emscripten_glGetProgramiv;

var _glGetQueryObjectuiv = _emscripten_glGetQueryObjectuiv;

var _glGetSamplerParameteriv = _emscripten_glGetSamplerParameteriv;

var _glGetShaderInfoLog = _emscripten_glGetShaderInfoLog;

var _glGetShaderiv = _emscripten_glGetShaderiv;

var _glGetUniformBlockIndex = _emscripten_glGetUniformBlockIndex;

var _glGetUniformLocation = _emscripten_glGetUniformLocation;

var _glGetUniformfv = _emscripten_glGetUniformfv;

var _glLinkProgram = _emscripten_glLinkProgram;

var _glPixelStorei = _emscripten_glPixelStorei;

var _glPolygonOffset = _emscripten_glPolygonOffset;

var _glReadBuffer = _emscripten_glReadBuffer;

var _glReadPixels = _emscripten_glReadPixels;

var _glRenderbufferStorageMultisample = _emscripten_glRenderbufferStorageMultisample;

var _glSamplerParameterf = _emscripten_glSamplerParameterf;

var _glSamplerParameteri = _emscripten_glSamplerParameteri;

var _glScissor = _emscripten_glScissor;

var _glShaderSource = _emscripten_glShaderSource;

var _glStencilFuncSeparate = _emscripten_glStencilFuncSeparate;

var _glStencilMaskSeparate = _emscripten_glStencilMaskSeparate;

var _glStencilOpSeparate = _emscripten_glStencilOpSeparate;

var _glTexImage2D = _emscripten_glTexImage2D;

var _glTexParameteri = _emscripten_glTexParameteri;

var _glTexStorage2D = _emscripten_glTexStorage2D;

var _glTexStorage3D = _emscripten_glTexStorage3D;

var _glTexSubImage2D = _emscripten_glTexSubImage2D;

var _glTexSubImage3D = _emscripten_glTexSubImage3D;

var _glTransformFeedbackVaryings = _emscripten_glTransformFeedbackVaryings;

var _glUniform1f = _emscripten_glUniform1f;

var _glUniform1i = _emscripten_glUniform1i;

var _glUniform1ui = _emscripten_glUniform1ui;

var _glUniform2f = _emscripten_glUniform2f;

var _glUniform2i = _emscripten_glUniform2i;

var _glUniform2ui = _emscripten_glUniform2ui;

var _glUniform3iv = _emscripten_glUniform3iv;

var _glUniform3ui = _emscripten_glUniform3ui;

var _glUniform4fv = _emscripten_glUniform4fv;

var _glUniform4iv = _emscripten_glUniform4iv;

var _glUniform4ui = _emscripten_glUniform4ui;

var _glUniform4uiv = _emscripten_glUniform4uiv;

var _glUniformBlockBinding = _emscripten_glUniformBlockBinding;

var _glUseProgram = _emscripten_glUseProgram;

var _glVertexAttrib4f = _emscripten_glVertexAttrib4f;

var _glVertexAttribI4i = _emscripten_glVertexAttribI4i;

var _glVertexAttribI4ui = _emscripten_glVertexAttribI4ui;

var _glVertexAttribIPointer = _emscripten_glVertexAttribIPointer;

var _glVertexAttribPointer = _emscripten_glVertexAttribPointer;

var _glViewport = _emscripten_glViewport;

function _random_get(buffer, size) {
  buffer >>>= 0;
  size >>>= 0;
  return randomFill(HEAPU8.subarray(buffer >>> 0, buffer + size >>> 0));
}

var RXCA = {
  node: null,
  channels: 2
};

function _rxc_js_audio_init(rate, channels) {
  RXCA.node = Module["audioNode"] || null;
  RXCA.channels = channels;
  const ctx = Module["audioContext"];
  if (ctx && ctx.sampleRate !== rate) console.warn(`[audio] game renders at ${rate} Hz, AudioContext runs at ${ctx.sampleRate} Hz`);
  return RXCA.node ? 1 : 0;
}

function _rxc_js_audio_submit(ptr, frames) {
  ptr >>>= 0;
  if (!RXCA.node) return;
  const o = ptr >>> 2;
  // (unsigned: the staging buffer sits above the guest's 2 GB, '>> 2' would go negative)
  const buf = HEAPF32.slice(o, o + frames * RXCA.channels);
  if (Module.__arec) Module.__arec.push(buf.slice());
  // debug capture (tools: set rexcomp.__arec = [] from the console)
  RXCA.node.port.postMessage(buf, [ buf.buffer ]);
}

function _rxc_js_canvas_note(w, h) {
  Module["canvasW"] = w;
  Module["canvasH"] = h;
}

function _rxc_js_canvas_size(wp, hp) {
  wp >>>= 0;
  hp >>>= 0;
  const c = document.getElementById("view");
  HEAP32[wp >>> 2 >>> 0] = c.width;
  HEAP32[hp >>> 2 >>> 0] = c.height;
}

function _rxc_js_cursor(v) {
  const c = document.getElementById("canvas");
  if (c) c.style.cursor = v ? "default" : "none";
}

function _rxc_js_external_url(p) {
  const url = UTF8ToString(p >>> 0);
  if (!/^https?:\/\//i.test(url)) return 0;
  let opened = null;
  try {
    opened = window.open(url, "_blank");
    if (opened) opened.opener = null;
  } catch (_) {}
  if (!opened) window.location.assign(url);
  return 1;
}

var RXC = {
  cnt: {
    reads: 0,
    fetches: 0,
    fetchKB: 0,
    fetchMs: 0,
    switches: 0,
    sleeps: 0,
    sleepMs: 0,
    yieldMs: 0
  },
  tot: {
    fetches: 0,
    fetchKB: 0,
    fetchMs: 0
  },
  pausedMs: 0,
  manifest: null,
  dirs: null,
  files: [],
  nextFd: 3,
  cache: new Map,
  cacheBytes: 0,
  cacheLimit: 805306368,
  overlay: new Map,
  hidden: new Set,
  status: s => {
    if (Module["onStatus"]) Module["onStatus"](s); else if (typeof document !== "undefined") {
      const el = document.getElementById("status");
      if (el) el.textContent = s;
    }
  },
  log: s => {
    console.log(s);
    if (globalThis.__rxcSink) globalThis.__rxcSink.push(s);
    if (typeof document === "undefined") return;
    const el = document.getElementById("log");
    if (el) {
      el.textContent += s + "\n";
      if (el.textContent.length > 2e5) el.textContent = el.textContent.slice(-1e5);
      el.scrollTop = el.scrollHeight;
    }
  },
  noteProgram: k => {
    if (!RXC.progSeen) {
      RXC.progSeen = new Set;
      RXC.progList = [];
      globalThis.__rxcPrograms = RXC.progList;
    }
    if (!RXC.progSeen.has(k)) {
      RXC.progSeen.add(k);
      RXC.progList.push(k);
    }
  },
  norm: p => p.replace(/\//g, "\\").toLowerCase(),
  px: r => (typeof PThread !== "undefined" && PThread.currentProxiedOperationCallerThread && !(r instanceof Promise)) ? Promise.resolve(r) : r,
  rel: p => {
    p = RXC.norm(p);
    if (p === "c:\\game" || p === "c:\\game\\") return "";
    return p.startsWith("c:\\game\\") ? p.slice(8) : null;
  },
  base: "",
  chunked: false,
  idb: null,
  persistable: key => key.startsWith("c:\\users\\") && !key.includes("\\crashreportclient\\") && !key.endsWith(".log"),
  async loadOverlay() {
    if (typeof indexedDB === "undefined") return;
    try {
      RXC.idb = await new Promise((res, rej) => {
        const r = indexedDB.open("rexcomp", 1);
        r.onupgradeneeded = () => r.result.createObjectStore("files");
        r.onsuccess = () => res(r.result);
        r.onerror = () => rej(r.error);
      });
      const tx = RXC.idb.transaction("files", "readonly"), req = tx.objectStore("files").openCursor();
      let n = 0;
      await new Promise(done => {
        req.onsuccess = () => {
          const c = req.result;
          if (!c) return done();
          RXC.overlay.set(c.key, {
            data: new Uint8Array(c.value),
            size: c.value.byteLength
          });
          n++;
          c.continue();
        };
        req.onerror = done;
      });
      if (n) console.log("[web] restored " + n + " saved files from IndexedDB");
    } catch (e) {
      console.warn("[web] IndexedDB unavailable, saves will not persist:", e);
      RXC.idb = null;
    }
  },
  keepDirs(key) {
    if (!RXC.mkdirs) RXC.mkdirs = new Set;
    for (let i = key.lastIndexOf("\\"); i > 2; i = key.lastIndexOf("\\", i - 1)) RXC.mkdirs.add(key.slice(0, i));
    RXC.fsVer++;
  },
  fsVer: 0,
  listCache: new Map,
  capOk() {
    return (RXC.tlate || 0) < 5;
  },
  ioT: 0,
  ioB: 0,
  ioHot: 0,
  noteIO(n) {
    const t = performance.now();
    if (t - RXC.ioT > 250) {
      RXC.ioT = t;
      RXC.ioB = 0;
    }
    RXC.ioB += n;
    if (RXC.ioB > (1 << 20)) RXC.ioHot = t + 500;
  },
  statSync(pathp, sizep, isdirp) {
    const path = UTF8ToString(pathp), key = RXC.norm(path), rel = RXC.rel(path);
    const ov = RXC.overlay.get(key);
    if (ov) {
      HEAPF64[sizep >>> 3 >>> 0] = ov.size;
      HEAP32[isdirp >>> 2 >>> 0] = 0;
      return 1;
    }
    if (RXC.hidden.has(key)) return 0;
    if (rel !== null) {
      if (rel in RXC.manifest) {
        HEAPF64[sizep >>> 3 >>> 0] = RXC.manifest[rel];
        HEAP32[isdirp >>> 2 >>> 0] = 0;
        return 1;
      }
      if (rel === "" || RXC.dirs.has(rel)) {
        HEAPF64[sizep >>> 3 >>> 0] = 0;
        HEAP32[isdirp >>> 2 >>> 0] = 1;
        return 1;
      }
    }
    for (const k of RXC.overlay.keys()) if (k.startsWith(key + "\\")) {
      HEAPF64[sizep >>> 3 >>> 0] = 0;
      HEAP32[isdirp >>> 2 >>> 0] = 1;
      return 1;
    }
    if (RXC.mkdirs && RXC.mkdirs.has(key)) {
      HEAPF64[sizep >>> 3 >>> 0] = 0;
      HEAP32[isdirp >>> 2 >>> 0] = 1;
      return 1;
    }
    if (/^c:(\\|\\users(\\player(\\appdata(\\local|\\roaming)?|\\documents)?)?|\\windows|\\programdata)?$/.test(key)) {
      HEAPF64[sizep >>> 3 >>> 0] = 0;
      HEAP32[isdirp >>> 2 >>> 0] = 1;
      return 1;
    }
    return 0;
  },
  listSync(dirp) {
    const dir = UTF8ToString(dirp), key = RXC.norm(dir);
    let c = RXC.listCache.get(key);
    if (!c || c.ver !== RXC.fsVer || c.osize !== RXC.overlay.size) {
      const rel = RXC.rel(dir), names = new Set;
      if (rel !== null && RXC.dirs.has(rel)) for (const n of RXC.dirs.get(rel)) names.add(n);
      if (key === "c:" || key === "c:\\") {
        names.add("game");
        names.add("users");
      }
      for (const k of RXC.overlay.keys()) if (k.startsWith(key + "\\")) {
        const rest = k.slice(key.length + 1);
        names.add(rest.split("\\")[0]);
      }
      if (RXC.mkdirs) for (const k of RXC.mkdirs) if (k.startsWith(key + "\\")) {
        const rest = k.slice(key.length + 1);
        names.add(rest.split("\\")[0]);
      }
      for (const h of RXC.hidden) if (h.startsWith(key + "\\")) {
        const rest = h.slice(key.length + 1);
        if (!rest.includes("\\")) names.delete(rest);
      }
      const enc = names.size ? (new TextEncoder).encode([ ...names ].join("\n") + "\0") : null;
      c = {
        ver: RXC.fsVer,
        osize: RXC.overlay.size,
        enc
      };
      RXC.listCache.set(key, c);
    }
    if (!c.enc) return 0;
    const p = _malloc(c.enc.length) >>> 0;
    HEAPU8.set(c.enc, p >>> 0);
    return p;
  },
  persist(keys) {
    keys = (Array.isArray(keys) ? keys : [ keys ]).filter(RXC.persistable);
    if (!keys.length) return Promise.resolve(true);
    if (!RXC.idb) {
      console.warn("[web] cannot persist files: browser storage unavailable");
      return Promise.resolve(false);
    }
    return new Promise(resolve => {
      try {
        const tx = RXC.idb.transaction("files", "readwrite"), st = tx.objectStore("files");
        tx.oncomplete = () => resolve(true);
        tx.onabort = tx.onerror = () => {
          console.warn("[web] persist failed", keys, tx.error);
          resolve(false);
        };
        for (const key of keys) {
          const ov = RXC.overlay.get(key);
          if (ov) st.put(ov.data.slice(0, ov.size).buffer, key); else st.delete(key);
        }
      } catch (e) {
        console.warn("[web] persist failed", keys, e);
        resolve(false);
      }
    });
  },
  flushFile(fd) {
    const f = RXC.files[fd];
    if (!f) return RXC.px(0);
    if (!f.dirty || RXC.overlay.get(f.key) !== f.ov) return RXC.px(1);
    const version = f.version;
    return RXC.persist(f.key).then(ok => {
      if (ok && f.version === version) f.dirty = false;
      return ok ? 1 : 0;
    });
  },
  seedIni(list) {
    for (const s of list || []) {
      const key = RXC.norm(s.file), ov = RXC.overlay.get(key);
      const lines = ov ? (new TextDecoder).decode(ov.data.subarray(0, ov.size)).split(/\r?\n/) : [];
      let at = lines.findIndex(l => l.trim().toLowerCase() === "[" + s.section.toLowerCase() + "]");
      if (at < 0) {
        if (lines.length && lines[lines.length - 1] !== "") lines.push("");
        lines.push("[" + s.section + "]");
        at = lines.length - 1;
      }
      let end = at + 1;
      while (end < lines.length && !lines[end].trim().startsWith("[")) end++;
      while (end > at + 1 && lines[end - 1].trim() === "") end--;
      for (const [k, v] of Object.entries(s.values)) {
        const i = lines.slice(at + 1, end).findIndex(l => l.split("=")[0].trim().toLowerCase() === k.toLowerCase());
        if (v === null) {
          if (i >= 0) {
            lines.splice(at + 1 + i, 1);
            end--;
          }
        } else if (i >= 0) lines[at + 1 + i] = k + "=" + v; else lines.splice(end++, 0, k + "=" + v);
      }
      const data = (new TextEncoder).encode(lines.join("\r\n"));
      RXC.overlay.set(key, {
        data,
        size: data.length
      });
      RXC.keepDirs(key);
    }
  },
  ensureManifest() {
    return RXC.ready || (RXC.ready = RXC.setupManifest());
  },
  async setupManifest() {
    await RXC.loadOverlay();
    const cacheMB = Number((Module["ENV"] || {}).REXCOMP_FILE_CACHE_MB);
    if (Number.isFinite(cacheMB) && cacheMB >= 0) RXC.cacheLimit = cacheMB * 1048576;
    RXC.seedIni(Module["iniSeed"]);
    RXC.base = Module["gameBase"] || "";
    if (RXC.base && !RXC.base.endsWith("/")) RXC.base += "/";
    // manifest.json: {path: size} for Range requests (tools/serve_web.py), or {chunk, files} from `build.py pack`: every
    // file split into game/<path>.<n> chunks of `chunk` bytes, for plain static servers and CDNs (no Range support)
    let m = null;
    for (let attempt = 0; !m; attempt++) {
      try {
        const r = await fetch(RXC.base + "manifest.json", {
          cache: "no-cache"
        });
        if (!r.ok) throw new Error("HTTP " + r.status);
        m = await r.json();
      } catch (e) {
        if (attempt >= 5) {
          RXC.status("Cannot load the game data manifest: " + e);
          throw e;
        }
        await new Promise(res => setTimeout(res, 500 * (attempt + 1)));
      }
    }
    // vers: a version per file (build.py pack: the source's mtime) in its chunk URLs, so a re-packed file (the ZCTT
    // archives) is never assembled from chunks the browser cached for the previous version; the manifest is revalidated
    if (m.files) {
      RXC.chunked = true;
      RXC.BLOCK = m.chunk;
      RXC.vers = m.vers || null;
      m = m.files;
    }
    RXC.manifest = m;
    RXC.loadPreload();
    globalThis.__rxcAccess = RXC.access;
    // recorded block order (tools/record_preload.py)
    // debugging: read a file the game wrote, e.g. __rxcReadFile('C:/Users/Player/AppData/Local/HelloNeighbor/Saved/Logs/HelloNeighbor.log')
    globalThis.__rxcReadFile = path => {
      const ov = RXC.overlay.get(RXC.norm(path));
      return ov ? (new TextDecoder).decode(ov.data.subarray(0, ov.size)) : null;
    };
    await RXC.loadPrograms();
    // small; needed before the first shaders are created
    /* Containers are supplied directly by the game tree. */
    // patched game assets (tools/patch_assets.py) shadow the originals
    await RXC.loadSeed();
    RXC.dirs = new Map;
    RXC.dirs.set("", new Set);
    for (const k of Object.keys(m)) RXC.dirs.get("").add(k.split("\\")[0]);
    for (const k of Object.keys(m)) {
      let d = k;
      while (true) {
        const i = d.lastIndexOf("\\");
        if (i < 0) break;
        const parent = d.slice(0, i), name = d.slice(i + 1);
        if (!RXC.dirs.has(parent)) RXC.dirs.set(parent, new Set);
        RXC.dirs.get(parent).add(name);
        d = parent;
        if (RXC.dirs.has(d) && RXC.dirs.get(d).size > 1) break;
      }
    }
  },
  hop(f) {
    if (!RXC.hopq) {
      RXC.hopq = [];
      RXC.hopc = new MessageChannel;
      RXC.hopc.port1.onmessage = () => {
        const q = RXC.hopq;
        RXC.hopq = [];
        for (const g of q) g();
      };
    }
    RXC.hopq.push(f);
    if (RXC.hopq.length === 1) RXC.hopc.port2.postMessage(0);
  },
  BLOCK: 1048576,
  capCache() {
    if (RXC.capped) return;
    RXC.capped = 1;
    const mb = +(new URLSearchParams(location.search).get("filecache") || Module["fileCacheMB"] || 0);
    if (mb > 0) RXC.cacheLimit = mb << 20;
    // the prefetch lookahead has to fit the cache: a block fetched further ahead than the cache holds is evicted
    // before the game reads it, and then refetched - the prefetch would only double the traffic
    RXC.preAhead = Math.max(8, Math.min(320, RXC.cacheLimit >> 21));
    console.log("[web] block cache limit: " + (RXC.cacheLimit >> 20) + " MB, prefetch lookahead " + RXC.preAhead + " blocks");
  },
  demand: 0,
  async fetchRange(rel, b, count, prefetch) {
    const size = RXC.manifest[rel], start = b * RXC.BLOCK, end = Math.min(size, start + count * RXC.BLOCK) - 1;
    const url = RXC.base + "game/" + rel.split("\\").map(encodeURIComponent).join("/") + (RXC.chunked ? "." + b : "") + (RXC.vers && RXC.vers[rel] ? "?v=" + RXC.vers[rel] : "");
    // a failed read would kill the guest thread: retry forever with backoff.
    // Retry transient reads with backoff. Chrome's HTTP cache can reject a Range request that races another one
    // for the same file (net::ERR_CACHE_OPERATION_NOT_SUPPORTED), so retries bypass it. A server ignoring Range is permanent.
    for (let attempt = 0; ;attempt++) {
      try {
        const r = await fetch(url, RXC.chunked ? {
          priority: prefetch ? "low" : "high",
          cache: attempt ? "no-store" : "default"
        } : {
          priority: prefetch ? "low" : "high",
          headers: {
            Range: `bytes=${start}-${end}`
          },
          cache: attempt ? "no-store" : "default"
        });
        if (!r.ok && r.status !== 206) { const e = new Error("An error occurred."); e.permanent = true; if (Module["onPackageError"]) Module["onPackageError"](); throw e; }
        if (!RXC.chunked && (size > RXC.BLOCK || count > 1) && r.status !== 206) {
          if (r.body) r.body.cancel().catch(() => {});
          const e = new Error(`server ignored HTTP Range for ${rel}; serve game files with Range support or use chunked packaging`);
          e.permanent = true;
          throw e;
        }
        const bytes = new Uint8Array(await r.arrayBuffer());
        if (bytes.length !== end - start + 1) {
          const e = new Error(`wrong block size for ${rel} block ${b}: ${bytes.length}`);
          e.permanent = true;
          throw e;
        }
        RXC.tot.fetches++;
        RXC.tot.fetchKB += bytes.length >> 10;
        return bytes;
      } catch (e) {
        if (e.permanent) throw e;
        if (attempt === 0 || attempt % 10 === 9) console.warn(`[web] fetch ${rel} block ${b} failed (${e && e.message || e}), retrying`);
        await new Promise(res => setTimeout(res, Math.min(2e3, 50 * (1 << Math.min(attempt, 6)))));
      }
    }
  },
  fetchBlock(rel, b, prefetch) {
    RXC.capCache();
    const key = rel + "#" + b, v = RXC.cache.get(key);
    if (v) {
      if (!(v instanceof Promise)) {
        RXC.cache.delete(key);
        RXC.cache.set(key, v);
      }
      return v;
    }
    const size = RXC.manifest[rel], start = b * RXC.BLOCK, end = Math.min(size, start + RXC.BLOCK) - 1;
    RXC.cnt.fetches++;
    RXC.cnt.fetchKB += (end - start + 1) >> 10;
    if (!prefetch) RXC.demand++;
    const p = RXC.fetchRange(rel, b, 1, prefetch).then(blk => {
      RXC.cache.set(key, blk);
      RXC.cacheBytes += blk.length;
      if (RXC.cacheBytes > RXC.cacheLimit) RXC.evict();
      return blk;
    });
    RXC.cache.set(key, p);
    p.catch(() => RXC.cache.delete(key));
    if (!prefetch) {
      const done = () => {
        RXC.demand--;
        RXC.pump();
      };
      p.then(done, done);
    }
    return p;
  },
  fetchSpan(rel, b, count, prefetch) {
    RXC.capCache();
    const size = RXC.manifest[rel], end = Math.min(size, (b + count) * RXC.BLOCK);
    RXC.cnt.fetches++;
    RXC.cnt.fetchKB += (end - b * RXC.BLOCK) >> 10;
    if (!prefetch) RXC.demand++;
    const run = async () => {
      if (RXC.batchFlight >= 8) await new Promise(resolve => (RXC.batchQueue ||= []).push(resolve)); else RXC.batchFlight = (RXC.batchFlight || 0) + 1;
      try {
        return await RXC.fetchRange(rel, b, count, !!prefetch);
      } finally {
        const next = RXC.batchQueue?.shift();
        if (next) next(); else RXC.batchFlight--;
      }
    };
    const range = run(), blocks = [];
    for (let i = 0; i < count; i++) {
      const key = rel + "#" + (b + i), start = i * RXC.BLOCK, length = Math.min(RXC.BLOCK, size - (b + i) * RXC.BLOCK);
      let p;
      p = range.then(bytes => {
        const blk = new Uint8Array(bytes.subarray(start, start + length));
        if (RXC.cache.get(key) === p) {
          RXC.cache.delete(key);
          RXC.cache.set(key, blk);
          RXC.cacheBytes += blk.length;
          if (RXC.cacheBytes > RXC.cacheLimit) RXC.evict();
        }
        return blk;
      });
      RXC.cache.set(key, p);
      p.catch(() => {
        if (RXC.cache.get(key) === p) RXC.cache.delete(key);
      });
      blocks.push(p);
    }
    if (!prefetch) {
      const done = () => {
        RXC.demand--;
        RXC.pump();
      };
      range.then(done, done);
    }
    return blocks;
  },
  evict(keep) {
    for (const [k, v] of RXC.cache) {
      if (v instanceof Promise) continue;
      RXC.cache.delete(k);
      RXC.cacheBytes -= v.length;
      if (RXC.cacheBytes < RXC.cacheLimit * (keep || .7)) break;
    }
  },
  pre: null,
  preIdx: null,
  pi: 0,
  consumed: -1,
  inflight: 0,
  seen: new Set,
  access: [],
  preAhead: 320,
  note(rel, b) {
    const key = rel + "#" + b;
    if (!RXC.seen.has(key)) {
      RXC.seen.add(key);
      RXC.access.push(key);
    }
    if (RXC.preIdx) {
      const i = RXC.preIdx.get(key);
      if (i !== undefined && i > RXC.consumed) {
        RXC.consumed = i;
        RXC.pump();
      }
    }
  },
  pump() {
    RXC.capCache();
    // Active reads take the available connections before speculative requests refill the lookahead window.
    if (RXC.demand) return;
    // A resumed or branched read sequence can skip recorded entries. Fetch only ahead of the observed position.
    RXC.pi = Math.max(RXC.pi, RXC.consumed + 1);
    const batch = RXC.chunked ? 1 : Math.max(1, Math.min(8, (typeof Module !== "undefined" && Module["filePrefetchBatchBlocks"]) | 0));
    while (RXC.pre && RXC.inflight < (batch > 1 ? 4 : 12) && RXC.pi < RXC.pre.length && RXC.pi <= RXC.consumed + RXC.preAhead) {
      const key = RXC.pre[RXC.pi++], h = key.lastIndexOf("#"), rel = key.slice(0, h), b = +key.slice(h + 1);
      if (!(rel in RXC.manifest) || RXC.cache.has(key)) continue;
      if (batch > 1) {
        let count = 1;
        while (count < batch && RXC.pi < RXC.pre.length && RXC.pi <= RXC.consumed + RXC.preAhead && RXC.pre[RXC.pi] === rel + "#" + (b + count) && !RXC.cache.has(rel + "#" + (b + count))) {
          RXC.pi++;
          count++;
        }
        if (count > 1) {
          RXC.inflight++;
          Promise.all(RXC.fetchSpan(rel, b, count, true)).catch(() => {}).finally(() => {
            RXC.inflight--;
            RXC.pump();
          });
          continue;
        }
      }
      RXC.inflight++;
      RXC.fetchBlock(rel, b, true).catch(() => {}).finally(() => {
        RXC.inflight--;
        RXC.pump();
      });
    }
  },
  async loadPrograms() {
    if (Module["prelinkShaders"] === false || new URLSearchParams(location.search).has("noprelink")) return;
    try {
      const r = await fetch("programs.json");
      if (!r.ok) return;
      const list = await r.json();
      RXC.pairs = new Map;
      const add = (k, v) => {
        let a = RXC.pairs.get(k);
        if (!a) RXC.pairs.set(k, a = []);
        a.push(v);
      };
      for (const e of list) {
        const [v, p] = e.split(":");
        add("v" + v, p);
        if (p !== "-") add("p" + p, v);
      }
      console.log("[web] pre-link list: " + list.length + " programs");
    } catch (e) {}
  },
  async loadPatches() {
    try {
      const r = await fetch("patches.json", {
        cache: "no-store"
      });
      if (!r.ok) return;
      const list = await r.json();
      await Promise.all(Object.entries(list).map(async ([rel, url]) => {
        const f = await fetch(url, {
          cache: "no-store"
        });
        if (!f.ok) throw new Error(url + " " + f.status);
        const d = new Uint8Array(await f.arrayBuffer());
        RXC.overlay.set("c:\\game\\" + rel, {
          data: d,
          size: d.length
        });
      }));
      console.log("[web] " + Object.keys(list).length + " patched game file(s)");
    } catch (e) {
      console.warn("[web] patches unavailable:", e);
    }
  },
  async loadSeed() {
    try {
      const r = await fetch("seed.json", {
        cache: "no-cache"
      });
      if (!r.ok) return;
      const list = await r.json();
      let n = 0, bytes = 0;
      await Promise.all(Object.entries(list).map(async ([key, e]) => {
        if (RXC.overlay.has(key)) return;
        if (e.hidden) {
          RXC.hidden.add(key);
          return;
        }
        try {
          const f = await fetch(e.url, {
            cache: "no-cache"
          });
          if (!f.ok) throw new Error(e.url + " " + f.status);
          const d = new Uint8Array(await f.arrayBuffer());
          if (d.length !== e.size) console.warn("[web] seed size mismatch: " + key + " " + d.length + " != " + e.size);
          if (RXC.overlay.has(key)) return;
          RXC.overlay.set(key, {
            data: d,
            size: d.length
          });
          n++;
          bytes += d.length;
        } catch (err) {
          console.warn("[web] seed file unavailable: " + key, err);
        }
      }));
      console.log("[web] seeded " + n + " file(s), " + bytes + " bytes");
    } catch (e) {
      console.warn("[web] seed unavailable:", e);
    }
  },
  async loadPreload() {
    if (new URLSearchParams(location.search).has("nopreload")) return;
    try {
      const r = await fetch("preload.json");
      if (!r.ok) return;
      RXC.pre = await r.json();
      RXC.preIdx = new Map(RXC.pre.map((k, i) => [ k, i ]));
      for (const key of RXC.seen) {
        const i = RXC.preIdx.get(key);
        if (i !== undefined && i > RXC.consumed) RXC.consumed = i;
      }
      console.log("[web] prefetch list: " + RXC.pre.length + " blocks");
      RXC.pump();
    } catch (e) {}
  },
  readRange(rel, off, n) {
    const size = RXC.manifest[rel];
    if (off >= size) return new Uint8Array(0);
    if (off + n > size) n = size - off;
    const B = RXC.BLOCK, b0 = Math.floor(off / B), b1 = Math.floor((off + n - 1) / B);
    const parts = [];
    let pending = false;
    for (let b = b0; b <= b1; b++) {
      const v = RXC.fetchBlock(rel, b);
      if (v instanceof Promise) pending = true;
      parts.push(v);
    }
    for (let b = b0; b <= b1; b++) RXC.note(rel, b);
    const assemble = blks => {
      if (b0 === b1) return blks[0].subarray(off - b0 * B, off - b0 * B + n);
      let out;
      try {
        out = new Uint8Array(n);
      } catch (e) {
        RXC.evict(.3);
        out = new Uint8Array(n);
      }
      let done = 0;
      for (let i = 0; i < blks.length && done < n; i++) {
        const s = i === 0 ? off - b0 * B : 0, take = Math.min(n - done, blks[i].length - s);
        if (take <= 0) break;
        out.set(blks[i].subarray(s, s + take), done);
        done += take;
      }
      return done === n ? out : out.subarray(0, done);
    };
    if (!pending) return assemble(parts);
    const tf = performance.now();
    return Promise.all(parts).then(blks => {
      const dt = performance.now() - tf;
      RXC.cnt.fetchMs += dt;
      RXC.tot.fetchMs += dt;
      return assemble(blks);
    });
  },
  readRangeInto(rel, off, n, dest) {
    dest >>>= 0;
    const size = RXC.manifest[rel];
    if (off >= size || n <= 0) return 0;
    if (off + n > size) n = size - off;
    const B = RXC.BLOCK, b0 = Math.floor(off / B), b1 = Math.floor((off + n - 1) / B);
    const batch = RXC.chunked ? 1 : Math.max(1, Math.min(16, Module["fileReadBatchBlocks"] | 0));
    const pending = [];
    let copied = 0;
    for (let b = b0; b <= b1; b++) {
      if (batch > 1 && !RXC.cache.has(rel + "#" + b)) {
        let count = 1;
        while (count < batch && b + count <= b1 && !RXC.cache.has(rel + "#" + (b + count))) count++;
        if (count > 1) RXC.fetchSpan(rel, b, count);
      }
      const start = b === b0 ? off - b * B : 0, take = Math.min(n - copied, B - start);
      const at = dest + copied, block = RXC.fetchBlock(rel, b);
      const copy = data => {
        HEAPU8.set(data.subarray(start, start + take), at >>> 0);
      };
      if (block instanceof Promise) pending.push(block.then(copy)); else copy(block);
      RXC.note(rel, b);
      copied += take;
    }
    if (!pending.length) return n;
    const tf = performance.now();
    return Promise.all(pending).then(() => {
      const dt = performance.now() - tf;
      RXC.cnt.fetchMs += dt;
      RXC.tot.fetchMs += dt;
      return n;
    });
  }
};

function _rxc_js_file_close(fd) {
  const result = RXC.flushFile(fd);
  delete RXC.files[fd];
  return result;
}

_rxc_js_file_close.isAsync = true;

function _rxc_js_file_flush(fd) {
  return RXC.flushFile(fd);
}

_rxc_js_file_flush.isAsync = true;

var _rxc_js_file_list = function(dirp) {
  dirp >>>= 0;
  RXC.cnt.lists = (RXC.cnt.lists || 0) + 1;
  RXC.tot.lists = (RXC.tot.lists || 0) + 1;
  if (!RXC.dirs) return RXC.ensureManifest().then(() => RXC.listSync(dirp));
  return RXC.px(RXC.listSync(dirp));
};

_rxc_js_file_list.isAsync = true;

function _rxc_js_file_mkdir(pathp) {
  if (!RXC.mkdirs) RXC.mkdirs = new Set;
  const k = RXC.norm(UTF8ToString(pathp >>> 0));
  if (RXC.mkdirs.has(k)) return 0;
  RXC.mkdirs.add(k);
  RXC.fsVer++;
  return 1;
}

var _rxc_js_file_open = function(pathp, write, create, truncate) {
  pathp >>>= 0;
  const open = () => {
    const path = UTF8ToString(pathp), key = RXC.norm(path), rel = RXC.rel(path);
    let ov = RXC.overlay.get(key);
    if (write || create) RXC.hidden.delete(key);
    const inGame = rel !== null && rel in RXC.manifest && !RXC.hidden.has(key);
    if (!ov && !inGame && !create) return -1;
    if (truncate && ov) {
      ov.data = new Uint8Array(0);
      ov.size = 0;
    }
    const dirty = !!truncate || (!ov && !!create);
    const finish = () => {
      const fd = RXC.nextFd++;
      RXC.files[fd] = {
        key,
        rel: inGame ? rel : null,
        ov,
        dirty,
        version: 0
      };
      return fd;
    };
    if (!ov && (create || write)) {
      ov = {
        data: new Uint8Array(0),
        size: 0
      };
      if (inGame && !truncate) return (async () => {
        ov.data = (await RXC.readRange(rel, 0, RXC.manifest[rel])).slice();
        ov.size = ov.data.length;
        RXC.overlay.set(key, ov);
        return finish();
      })();
      RXC.overlay.set(key, ov);
    }
    return finish();
  };
  if (!RXC.dirs) return RXC.ensureManifest().then(open);
  return RXC.px(open());
};

_rxc_js_file_open.isAsync = true;

function _rxc_js_file_read(fd, bufp, off, n) {
  bufp >>>= 0;
  // heap > 2 GB: pointers arrive as signed i32
  const f = RXC.files[fd];
  if (!f) return RXC.px(-1);
  RXC.cnt.reads++;
  RXC.noteIO(n);
  if (f.ov) {
    const end = Math.min(f.ov.size, off + n);
    if (off >= end) return RXC.px(0);
    HEAPU8.set(f.ov.data.subarray(off, end), bufp >>> 0);
    return RXC.px(end - off);
  }
  return RXC.px(RXC.readRangeInto(f.rel, off, n, bufp));
}

_rxc_js_file_read.isAsync = true;

function _rxc_js_file_read_nb(fd, bufp, off, n, donep, resultp) {
  bufp >>>= 0;
  donep >>>= 0;
  resultp >>>= 0;
  const f = RXC.files[fd];
  if (!f) return -1;
  RXC.cnt.reads++;
  RXC.noteIO(n);
  if (f.ov) {
    const end = Math.min(f.ov.size, off + n);
    if (off >= end) return 0;
    HEAPU8.set(f.ov.data.subarray(off, end), bufp >>> 0);
    return end - off;
  }
  const d = RXC.readRangeInto(f.rel, off, n, bufp);
  if (!(d instanceof Promise)) return d;
  const wake = () => {
    if (Module["_rxc_mt_signal"]) Module["_rxc_mt_signal"]();
  };
  d.then(count => {
    HEAP32[resultp >>> 2 >>> 0] = count;
    HEAP32[donep >>> 2 >>> 0] = 1;
    wake();
  }, () => {
    HEAP32[resultp >>> 2 >>> 0] = -1;
    HEAP32[donep >>> 2 >>> 0] = 1;
    wake();
  });
  return -2;
}

var _rxc_js_file_rename = function(ap, bp) {
  const a = RXC.norm(UTF8ToString(ap >>> 0)), b = RXC.norm(UTF8ToString(bp >>> 0)), ov = RXC.overlay.get(a);
  if (!ov) return RXC.px(0);
  const replaced = RXC.overlay.get(b), moved = RXC.files.filter(f => f && f.key === a);
  RXC.keepDirs(a);
  RXC.keepDirs(b);
  RXC.overlay.delete(a);
  RXC.overlay.set(b, ov);
  RXC.hidden.delete(b);
  for (const f of moved) f.key = b;
  return RXC.persist([ a, b ]).then(ok => {
    if (!ok && !RXC.overlay.has(a) && RXC.overlay.get(b) === ov) {
      RXC.overlay.set(a, ov);
      if (replaced) RXC.overlay.set(b, replaced); else RXC.overlay.delete(b);
      for (const f of moved) if (f.key === b) f.key = a;
    }
    return ok ? 1 : 0;
  });
};

_rxc_js_file_rename.isAsync = true;

var _rxc_js_file_stat = function(pathp, sizep, isdirp) {
  pathp >>>= 0;
  sizep >>>= 0;
  isdirp >>>= 0;
  RXC.cnt.stats = (RXC.cnt.stats || 0) + 1;
  RXC.tot.stats = (RXC.tot.stats || 0) + 1;
  if (!RXC.dirs) return RXC.ensureManifest().then(() => RXC.statSync(pathp, sizep, isdirp));
  return RXC.px(RXC.statSync(pathp, sizep, isdirp));
};

_rxc_js_file_stat.isAsync = true;

function _rxc_js_file_truncate(fd, size) {
  const f = RXC.files[fd];
  if (!f || !f.ov || !Number.isSafeInteger(size) || size < 0) return 0;
  if (size > f.ov.data.length) {
    const data = new Uint8Array(size);
    data.set(f.ov.data.subarray(0, f.ov.size));
    f.ov.data = data;
  } else if (size > f.ov.size) f.ov.data.fill(0, f.ov.size, size);
  f.ov.size = size;
  f.dirty = true;
  f.version++;
  return 1;
}

var _rxc_js_file_unlink = function(pathp) {
  const k = RXC.norm(UTF8ToString(pathp >>> 0)), ov = RXC.overlay.get(k);
  if (!ov) return RXC.px(0);
  RXC.keepDirs(k);
  RXC.overlay.delete(k);
  return RXC.persist(k).then(ok => {
    if (!ok && !RXC.overlay.has(k)) RXC.overlay.set(k, ov);
    return ok ? 1 : 0;
  });
};

_rxc_js_file_unlink.isAsync = true;

function _rxc_js_file_write(fd, bufp, off, n) {
  bufp >>>= 0;
  const f = RXC.files[fd];
  if (!f) return -1;
  f.dirty = true;
  f.version++;
  if (!f.ov) {
    f.ov = {
      data: new Uint8Array(0),
      size: 0
    };
    RXC.overlay.set(f.key, f.ov);
  }
  const need = off + n;
  if (need > f.ov.data.length) {
    const nd = new Uint8Array(Math.max(need, f.ov.data.length * 2, 4096));
    nd.set(f.ov.data);
    f.ov.data = nd;
  }
  f.ov.data.set(HEAPU8.subarray(bufp >>> 0, bufp + n >>> 0), off);
  if (need > f.ov.size) f.ov.size = need;
  if (f.key.endsWith("console.log")) {
    const g = RXC.gcl || (RXC.gcl = {
      t: 0,
      n: 0,
      drop: 0
    }), now = performance.now();
    if (now - g.t > 1e3) {
      if (g.drop) console.log(`[game] (${g.drop} more console lines in the last second)`);
      g.t = now;
      g.n = 0;
      g.drop = 0;
    }
    for (const line of (new TextDecoder).decode(HEAPU8.slice(bufp, bufp + n)).split("\n")) if (line.trim()) {
      if (g.n++ < 100) console.log("[game] " + line.trimEnd()); else g.drop++;
    }
  }
  return n;
}

function _rxc_js_frame_due() {
  const st = RXC.stats, mode = RXC.yieldMode || Module["yieldMode"] || "mc", now = performance.now();
  if (!st || mode !== "cap" || !RXC.framePending || now <= RXC.ioHot || (document.hidden && !RXC.bgRun) || Module["capRunOthers"] === false || !RXC.capOk()) return -1;
  const iv = 1e3 / (+Module["fpsCap"] || 60);
  if (!RXC.capDue) {
    let due = (st.due || now) + iv;
    if (now > due + iv / 2) due = now;
    RXC.capDue = due;
  }
  return RXC.capDue - now;
}

var _rxc_js_gamepad = function(index, ptr) {
  const pad = navigator.getGamepads && navigator.getGamepads()[index];
  if (!pad || !pad.connected) return 0;
  const buttons = pad.buttons || [], axes = pad.axes || [];
  const down = i => !!buttons[i] && (buttons[i].pressed || buttons[i].value > .5);
  const mapping = [ [ 0, 4096 ], [ 1, 8192 ], [ 2, 16384 ], [ 3, 32768 ], [ 4, 256 ], [ 5, 512 ], [ 8, 32 ], [ 9, 16 ], [ 10, 64 ], [ 11, 128 ], [ 12, 1 ], [ 13, 2 ], [ 14, 4 ], [ 15, 8 ] ];
  let mask = 0;
  for (const [i, bit] of mapping) if (down(i)) mask |= bit;
  const trigger = i => Math.round(255 * Math.max(0, Math.min(1, buttons[i]?.value || 0)));
  const axis = (i, flip) => Math.round(32767 * Math.max(-1, Math.min(1, (axes[i] || 0) * flip)));
  const values = [ mask, trigger(6), trigger(7), axis(0, 1), axis(1, -1), axis(2, 1), axis(3, -1) ];
  const cache = globalThis.__rxcPadState || (globalThis.__rxcPadState = []);
  const signature = values.join(",");
  let prev = cache[index];
  if (!prev || prev.signature !== signature) prev = cache[index] = {
    signature,
    packet: ((prev?.packet || 0) + 1) >>> 0
  };
  const view = new DataView(HEAPU8.buffer, ptr >>> 0, 16);
  view.setUint32(0, prev.packet, true);
  view.setUint16(4, values[0], true);
  view.setUint8(6, values[1]);
  view.setUint8(7, values[2]);
  for (let i = 0; i < 4; i++) view.setInt16(8 + i * 2, values[3 + i], true);
  return 1;
};

var RXCG = {
  w: null,
  seq: 0,
  qseq: 0,
  done: 0,
  links: 0,
  combos: 0,
  rbDone: 0,
  rbSet: new Set,
  waiters: [],
  fif: 2,
  dead: false,
  qp: 0,
  qcap: 0,
  pool: null,
  wake() {
    if (!RXCG.waiters.length) return;
    const keep = [];
    for (const x of RXCG.waiters) {
      if (x.ok()) x.r(0); else keep.push(x);
    }
    RXCG.waiters = keep;
  },
  take(n) {
    const pool = RXCG.pool || (RXCG.pool = new Map), cap = Math.max(65536, 2 ** Math.ceil(Math.log2(Math.max(n, 1)))), l = pool.get(cap);
    return l && l.length ? l.pop() : new ArrayBuffer(cap);
  },
  give(b) {
    const pool = RXCG.pool || (RXCG.pool = new Map), l = pool.get(b.byteLength);
    if (!l) pool.set(b.byteLength, [ b ]); else if (l.length < 4) l.push(b);
  },
  onmsg(d) {
    if (d.ret) {
      RXCG.give(d.ret);
      return;
    }
    if (d.log !== undefined) RXC.log(d.log);
    if (d.wstat) globalThis.__rxcWorker = d.wstat;
    if (d.rb !== undefined) {
      if (d.data.length) HEAPU8.set(d.data, d.addr >>> 0 >>> 0);
      if (d.rb > RXCG.rbDone) {
        RXCG.rbSet.add(d.rb);
        while (RXCG.rbSet.delete(RXCG.rbDone + 1)) RXCG.rbDone++;
      }
    }
    if (d.q) {
      // occlusion results (id, seq, visible) - with a frame ack or on their own
      const n = d.q.length / 3, bytes = d.q.length * 4;
      if (bytes > RXCG.qcap) {
        if (RXCG.qp) _free(RXCG.qp);
        RXCG.qcap = Math.max(bytes * 2, 64 << 10);
        RXCG.qp = _malloc(RXCG.qcap) >>> 0;
      }
      if (n) HEAPU32.set(d.q, RXCG.qp >>> 2 >>> 0);
      for (let i = 1; i < d.q.length; i += 3) if (d.q[i] > RXCG.qseq) RXCG.qseq = d.q[i];
      if (n || d.done !== undefined) Module["_gfxr_results"](RXCG.qp, n, d.done !== undefined ? d.links : RXCG.links, d.done !== undefined ? d.combos : RXCG.combos);
    }
    if (d.done !== undefined) {
      if (d.done > RXCG.done) RXCG.done = d.done;
      RXCG.links = d.links;
      RXCG.combos = d.combos;
    }
    if (d.progs) for (const k of d.progs) RXC.noteProgram(k);
    if (d.lost) {
      window.__rxcLost = true;
      RXC.log("[gfx] the WebGL context was lost (GPU process reset)");
      RXC.status("The graphics context was lost (GPU reset). Reload the page to continue.");
    }
    if (d.fatal) {
      console.error("[gfx worker] " + d.fatal);
      RXCG.dead = true;
      RXC.status("graphics worker crashed: " + d.fatal.split("\n")[0]);
    }
    RXCG.wake();
  }
};

function _rxc_js_gfx_fif() {
  return RXCG.fif;
}

function _rxc_js_gfx_mode() {
  const w = Module["gfxWorker"];
  if (!w) return 0;
  RXCG.w = w;
  RXCG.fif = Math.max(1, +(new URLSearchParams(location.search).get("fif") || 1));
  Module["__gfxmsg"] = RXCG.onmsg;
  const early = Module["__gfxEarly"] || [];
  Module["__gfxEarly"] = [];
  for (const d of early) RXCG.onmsg(d);
  return 1;
}

function _rxc_js_gfx_submit(p, n, frameEnd) {
  p >>>= 0;
  /* heap > 2 GB: pointers arrive signed */ const buf = RXCG.take(n);
  new Uint8Array(buf, 0, n).set(HEAPU8.subarray(p >>> 0, p + n >>> 0));
  RXCG.w.postMessage({
    cmds: buf,
    len: n,
    seq: ++RXCG.seq,
    t: performance.timeOrigin + performance.now()
  }, [ buf ]);
}

function _rxc_js_gfx_submit_tail(p, n, tp, tn) {
  p >>>= 0;
  tp >>>= 0;
  const len = n + ((tn + 3) & ~3), buf = RXCG.take(len), b = new Uint8Array(buf, 0, len);
  b.set(HEAPU8.subarray(p >>> 0, p + n >>> 0), 0);
  b.set(HEAPU8.subarray(tp >>> 0, tp + tn >>> 0), n);
  b.fill(0, n + tn, len);
  RXCG.w.postMessage({
    cmds: buf,
    len,
    seq: ++RXCG.seq,
    t: performance.timeOrigin + performance.now()
  }, [ buf ]);
}

var _rxc_js_gfx_wait = function(kind, v, ms) {
  const ok = () => RXCG.dead || (kind === 2 ? RXCG.qseq >= v : kind ? RXCG.rbDone >= v || RXCG.rbSet.has(v) : RXCG.done >= v);
  if (ok()) return 1;
  // time the engine thread waits on the worker, by kind (0 frame backpressure, 1 readback, 2 occlusion query): perf()
  const W = RXC.waits || (RXC.waits = {
    ms: [ 0, 0, 0 ],
    n: [ 0, 0, 0 ]
  }), t0 = performance.now();
  W.n[kind]++;
  return new Promise(r0 => {
    const r = x => {
      W.ms[kind] += performance.now() - t0;
      r0(x);
    };
    const x = {
      ok,
      r: () => r(1)
    };
    RXCG.waiters.push(x);
    if (ms >= 0) {
      const out = () => {
        const i = RXCG.waiters.indexOf(x);
        if (i >= 0) {
          RXCG.waiters.splice(i, 1);
          r(ok() ? 1 : 0);
        }
      };
      // (scheduler.postTask delays are not clamped to 4 ms like nested timeouts)
      if (globalThis.scheduler && scheduler.postTask) scheduler.postTask(out, {
        delay: ms,
        priority: "user-blocking"
      }); else setTimeout(out, ms);
    }
  });
};

_rxc_js_gfx_wait.isAsync = true;

var _rxc_js_load_image = async function(dest, size) {
  dest >>>= 0;
  try {
    const r = await fetch("image.bin");
    if (!r.ok) return 0;
    const reader = r.body.getReader();
    let off = 0, last = -1;
    const progress = () => {
      const percent = Math.floor(off * 100 / size);
      if (percent === last) return;
      last = percent;
      if (Module["onDownloadProgress"]) Module["onDownloadProgress"](off, size); else RXC.status(`downloading image.bin ${percent}%`);
    };
    progress();
    for (;;) {
      const {done, value} = await reader.read();
      if (done) break;
      if (off + value.length > size) return 0;
      for (let i = 0; i < value.length; ) {
        const a = dest + off + i, end = Math.min(value.length, i + 4096 - (a & 4095));
        let j = i;
        while (j < end && value[j] === 0) j++;
        if (j < end) HEAPU8.set(value.subarray(i, end), a >>> 0);
        i = end;
      }
      off += value.length;
      progress();
    }
    progress();
    return off === size ? 1 : 0;
  } catch (e) {
    console.error(e);
    return 0;
  }
};

_rxc_js_load_image.isAsync = true;

function _rxc_js_lock(v) {
  window.dispatchEvent(new CustomEvent("rxclock", {
    detail: !!v
  }));
}

function _rxc_js_log(p) {
  RXC.log(UTF8ToString(p));
}

var RXCMF = {
  list: new Map,
  next: 1,
  capReady: null,
  hooked: false,
  worker: null,
  ensureWorker() {
    if (RXCMF.worker !== null) return RXCMF.worker;
    RXCMF.worker = false;
    if (typeof VideoFrame === "undefined" || typeof Worker === "undefined") return false;
    const code = `const ctxs = new Map();\n        function rgba(vf, w, h) { const k = w + 'x' + h; let c = ctxs.get(k); if (!c) { c = new OffscreenCanvas(w, h).getContext('2d', { willReadFrequently: true, alpha: false }); ctxs.set(k, c); } c.drawImage(vf, 0, 0, w, h); return c.getImageData(0, 0, w, h).data; }\n        function yuv(px, w, h, nv12) {\n          const cw = (w + 1) >> 1, ch = (h + 1) >> 1, o = new Uint8Array(w * h + 2 * cw * ch), ob = w * h;\n          for (let i = 0, n = w * h; i < n; i++) { const r = px[4 * i], g = px[4 * i + 1], b = px[4 * i + 2]; o[i] = ((47 * r + 157 * g + 16 * b + 128) >> 8) + 16; }\n          for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) {\n            const x0 = 2 * x, x1 = Math.min(x0 + 1, w - 1), y0 = 2 * y, y1 = Math.min(y0 + 1, h - 1), a = 4 * (y0 * w + x0), b2 = 4 * (y0 * w + x1), c2 = 4 * (y1 * w + x0), d = 4 * (y1 * w + x1);\n            const r = (px[a] + px[b2] + px[c2] + px[d] + 2) >> 2, g = (px[a + 1] + px[b2 + 1] + px[c2 + 1] + px[d + 1] + 2) >> 2, bl = (px[a + 2] + px[b2 + 2] + px[c2 + 2] + px[d + 2] + 2) >> 2;\n            const u = ((-26 * r - 87 * g + 112 * bl + 128) >> 8) + 128, v = ((112 * r - 102 * g - 10 * bl + 128) >> 8) + 128;\n            if (nv12) { o[ob + y * 2 * cw + 2 * x] = u; o[ob + y * 2 * cw + 2 * x + 1] = v; } else { o[ob + y * cw + x] = u; o[ob + cw * ch + y * cw + x] = v; }\n          }\n          return o;\n        }\n        onmessage = async e => {\n          const { id, seq, frame, w, h, fmt, t } = e.data; let out = null, err = null;\n          try {\n            const src = frame.format, vr = frame.visibleRect;\n            if (fmt !== 0 && (src === 'I420' || src === 'NV12' || src === 'I420A') && vr && vr.width === w && vr.height === h) {\n              const tmp = new Uint8Array(frame.allocationSize({ rect: vr })), lay = await frame.copyTo(tmp, { rect: vr });\n              const cw = (w + 1) >> 1, ch = (h + 1) >> 1, ob = w * h; out = new Uint8Array(ob + 2 * cw * ch);\n              for (let y = 0; y < h; y++) out.set(tmp.subarray(lay[0].offset + y * lay[0].stride, lay[0].offset + y * lay[0].stride + w), y * w);\n              if (src === 'NV12') {\n                for (let y = 0; y < ch; y++) { const row = tmp.subarray(lay[1].offset + y * lay[1].stride, lay[1].offset + y * lay[1].stride + 2 * cw);\n                  if (fmt === 1) out.set(row, ob + y * 2 * cw); else for (let x = 0; x < cw; x++) { out[ob + y * cw + x] = row[2 * x]; out[ob + cw * ch + y * cw + x] = row[2 * x + 1]; } }\n              } else {\n                for (let y = 0; y < ch; y++) { const u = tmp.subarray(lay[1].offset + y * lay[1].stride, lay[1].offset + y * lay[1].stride + cw), v = tmp.subarray(lay[2].offset + y * lay[2].stride, lay[2].offset + y * lay[2].stride + cw);\n                  if (fmt === 2) { out.set(u, ob + y * cw); out.set(v, ob + cw * ch + y * cw); } else for (let x = 0; x < cw; x++) { out[ob + y * 2 * cw + 2 * x] = u[x]; out[ob + y * 2 * cw + 2 * x + 1] = v[x]; } }\n              }\n            } else { const px = rgba(frame, w, h); out = fmt === 0 ? new Uint8Array(px.buffer) : yuv(px, w, h, fmt === 1); }\n          } catch (x) { err = String(x && x.message || x); }\n          frame.close();\n          if (out) postMessage({ id, seq, buf: out.buffer, w, h, fmt, t }, [out.buffer]); else postMessage({ id, seq, err });\n        };`;
    try {
      const w = new Worker(URL.createObjectURL(new Blob([ code ], {
        type: "application/javascript"
      })));
      w.onmessage = e => {
        const d = e.data, st = RXCMF.list.get(d.id);
        if (!st) return;
        st.inflight = false;
        if (d.err) {
          if (!st.warned) {
            st.warned = true;
            RXC.log("[mf] frame copy failed: " + d.err);
          }
          return;
        }
        if (d.seq >= st.readySeq) {
          st.ready = d;
          st.readySeq = d.seq;
        }
      };
      RXCMF.worker = w;
    } catch (e) {
      RXC.log("[mf] no frame worker: " + e);
    }
    return RXCMF.worker;
  },
  grab(s, t) {
    if (!s.wantW || s.inflight || s.closed || s.seeking || s.v.readyState < 2) return;
    const w = RXCMF.ensureWorker();
    if (!w) return;
    let vf;
    try {
      vf = new VideoFrame(s.v, {
        timestamp: Math.round(t * 1e6)
      });
    } catch (e) {
      return;
    }
    s.inflight = true;
    s.grabbed = s.frameNo;
    w.postMessage({
      id: s.id,
      seq: ++s.seq,
      frame: vf,
      w: s.wantW,
      h: s.wantH,
      fmt: s.wantFmt,
      t
    }, [ vf ]);
  },
  hook() {
    if (RXCMF.hooked) return;
    RXCMF.hooked = true;
    document.addEventListener("visibilitychange", () => {
      if (new URLSearchParams(location.search).has("bgrun")) return;
      for (const s of RXCMF.list.values()) {
        if (document.hidden) {
          if (!s.v.paused) s.v.pause();
        } else if (s.want) s.v.play().catch(() => {});
      }
    });
  },
  capture(s) {
    const ctx = Module["audioContext"];
    if (!ctx || s.src) return !!s.src;
    if (!RXCMF.capReady) {
      const code = `class RexcompCapture extends AudioWorkletProcessor { constructor() { super(); this.b = new Float32Array(2048); this.n = 0; }\n          process(inputs) { const i = inputs[0]; if (i && i.length) { const L = i[0], R = i[1] || i[0]; for (let k = 0; k < L.length; k++) { this.b[2 * this.n] = L[k]; this.b[2 * this.n + 1] = R[k]; if (++this.n === 1024) { this.port.postMessage(this.b.slice(0)); this.n = 0; } } } return true; } }\n          registerProcessor('rexcomp-capture', RexcompCapture);`;
      RXCMF.capReady = ctx.audioWorklet.addModule(URL.createObjectURL(new Blob([ code ], {
        type: "application/javascript"
      }))).then(() => true, () => false);
    }
    s.src = ctx.createMediaElementSource(s.v);
    s.gain = ctx.createGain();
    s.out = ctx.createGain();
    s.out.gain.value = 0;
    s.src.connect(s.gain);
    RXCMF.capReady.then(ok => {
      if (!ok || s.closed) return;
      s.cap = new AudioWorkletNode(ctx, "rexcomp-capture", {
        numberOfInputs: 1,
        numberOfOutputs: 1,
        outputChannelCount: [ 2 ]
      });
      s.cap.port.onmessage = e => {
        if (s.mode !== 1) return;
        s.pcm.push(e.data);
        s.pcmFrames += e.data.length / 2;
        while (s.pcmFrames > ctx.sampleRate * 2 && s.pcm.length > 1) s.pcmFrames -= s.pcm.shift().length / 2;
      };
      s.gain.connect(s.cap);
      s.cap.connect(s.out);
      s.out.connect(ctx.destination);
    });
    return true;
  },
  async open(pathp, bytesp, len, infop) {
    if (typeof document === "undefined") return 0;
    RXCMF.hook();
    let url = null, blobUrl = null, cross = false, what = "media data";
    if (bytesp) blobUrl = URL.createObjectURL(new Blob([ HEAPU8.slice(bytesp, bytesp + len) ])); else {
      if (!RXC.dirs) await RXC.ensureManifest();
      const path = UTF8ToString(pathp), key = RXC.norm(path), rel = RXC.rel(path), ov = RXC.overlay.get(key);
      what = path;
      if (ov) blobUrl = URL.createObjectURL(new Blob([ ov.data.subarray(0, ov.size) ])); else if (rel !== null && rel in RXC.manifest) {
        if (RXC.chunked) blobUrl = URL.createObjectURL(new Blob([ await RXC.readRange(rel, 0, RXC.manifest[rel]) ])); else {
          url = RXC.base + "game/" + rel.split("\\").map(encodeURIComponent).join("/") + (RXC.vers && RXC.vers[rel] ? "?v=" + RXC.vers[rel] : "");
          cross = new URL(url, location.href).origin !== location.origin;
        }
      } else {
        RXC.log("[mf] not in the game data: " + path);
        return 0;
      }
    }
    const v = document.createElement("video");
    v.preload = "auto";
    v.playsInline = true;
    v.muted = true;
    if (cross) v.crossOrigin = "anonymous";
    v.style.cssText = "position:fixed;left:50%;top:50%;width:64px;height:36px;margin:-18px 0 0 -32px;pointer-events:none;z-index:-1";
    document.body.appendChild(v);
    v.src = blobUrl || url;
    const ok = await new Promise(res => {
      v.onloadedmetadata = () => res(true);
      v.onerror = () => res(false);
      setTimeout(() => res(false), 2e4);
    });
    if (!ok) {
      RXC.log("[mf] the browser cannot play " + what + (v.error ? " (" + v.error.message + ")" : " (no metadata after 20 s)"));
      v.removeAttribute("src");
      v.load();
      v.remove();
      if (blobUrl) URL.revokeObjectURL(blobUrl);
      return 0;
    }
    const s = {
      v,
      blobUrl,
      frameNo: 0,
      frameTime: -1,
      grabbedT: -1,
      seeking: false,
      ended: false,
      error: false,
      want: false,
      pcm: [],
      pcmFrames: 0,
      mode: 0,
      closed: false,
      seq: 0,
      readySeq: 0,
      ready: null,
      inflight: false,
      grabbed: -1,
      wantW: 0,
      wantH: 0,
      wantFmt: 0
    };
    if (v.requestVideoFrameCallback) {
      const tick = (now, meta) => {
        s.frameNo++;
        s.frameTime = meta.mediaTime;
        RXCMF.grab(s, meta.mediaTime);
        if (!s.closed) v.requestVideoFrameCallback(tick);
      };
      v.requestVideoFrameCallback(tick);
    }
    v.onseeking = () => {
      s.seeking = true;
    };
    v.onseeked = () => {
      s.seeking = false;
      s.ended = false;
      if (v.paused) {
        s.frameNo++;
        s.frameTime = v.currentTime;
      }
    };
    v.onended = () => {
      s.ended = true;
    };
    v.onerror = () => {
      s.error = true;
    };
    const id = RXCMF.next++;
    s.id = id;
    RXCMF.list.set(id, s);
    HEAP32[infop >>> 2 >>> 0] = v.videoWidth | 0;
    HEAP32[(infop + 4) >>> 2 >>> 0] = v.videoHeight | 0;
    HEAPF64[(infop + 8) >>> 3 >>> 0] = isFinite(v.duration) ? v.duration : 0;
    return id;
  },
  route(s) {
    const ctx = Module["audioContext"];
    if (s.mode === 0) {
      s.v.muted = true;
      return;
    }
    if (s.mode === 1) {
      if (RXCMF.capture(s)) {
        s.v.muted = false;
        try {
          s.gain.disconnect(ctx.destination);
        } catch (e) {}
      } else s.v.muted = true;
      return;
    }
    if (s.src) {
      s.v.muted = false;
      try {
        s.gain.connect(ctx.destination);
      } catch (e) {}
    } else s.v.muted = false;
  }
};

function _rxc_js_mf_audio(id, dst, max) {
  dst >>>= 0;
  const s = RXCMF.list.get(id);
  if (!s || s.mode !== 1 || !s.cap) return -1;
  let n = 0;
  while (s.pcm.length && n < max) {
    const b = s.pcm[0], frames = b.length / 2, take = Math.min(frames, max - n);
    HEAPF32.set(take === frames ? b : b.subarray(0, take * 2), (dst >>> 2) + n * 2 >>> 0);
    n += take;
    s.pcmFrames -= take;
    if (take === frames) s.pcm.shift(); else s.pcm[0] = b.subarray(take * 2);
  }
  return n;
}

function _rxc_js_mf_audio_rate() {
  const ctx = Module["audioContext"];
  return ctx ? ctx.sampleRate | 0 : 48e3;
}

var _rxc_js_mf_control = function(id, op, arg) {
  const s = RXCMF.list.get(id);
  if (!s) return;
  const v = s.v;
  switch (op) {
   case 1:
    s.want = true;
    v.playbackRate = arg > 0 ? arg : 1;
    s.ended = false;
    if (!document.hidden || new URLSearchParams(location.search).has("bgrun")) v.play().catch(e => {
      if (!v.muted && e && e.name === "NotAllowedError") {
        v.muted = true;
        v.play().catch(() => {});
      }
    });
    break;

   case 2:
    s.want = false;
    v.pause();
    break;

   case 3:
    s.ended = false;
    s.seeking = true;
    s.pcm = [];
    s.pcmFrames = 0;
    v.currentTime = Math.max(0, arg);
    break;

   case 4:
    if (arg > 0) v.playbackRate = arg;
    break;

   case 5:
    v.volume = Math.max(0, Math.min(1, arg));
    break;

   case 6:
    s.closed = true;
    s.want = false;
    v.pause();
    try {
      if (s.src) s.src.disconnect();
      if (s.cap) s.cap.disconnect();
      if (s.out) s.out.disconnect();
    } catch (e) {}
    v.removeAttribute("src");
    v.load();
    v.remove();
    if (s.blobUrl) URL.revokeObjectURL(s.blobUrl);
    RXCMF.list.delete(id);
    break;

   case 7:
    s.mode = arg | 0;
    RXCMF.route(s);
    break;
  }
};

function _rxc_js_mf_frame(id, dst, w, h, fmt) {
  dst >>>= 0;
  const s = RXCMF.list.get(id);
  if (!s || s.seeking || !w || !h) return -1;
  if (s.wantW !== w || s.wantH !== h || s.wantFmt !== fmt) {
    s.wantW = w;
    s.wantH = h;
    s.wantFmt = fmt;
    s.ready = null;
  }
  const r = s.ready;
  if (!r) {
    if (s.grabbed !== s.frameNo || !s.v.requestVideoFrameCallback) RXCMF.grab(s, s.frameTime >= 0 ? s.frameTime : s.v.currentTime);
    return -1;
  }
  s.ready = null;
  if (r.w !== w || r.h !== h || r.fmt !== fmt) return -1;
  HEAPU8.set(new Uint8Array(r.buf), dst >>> 0);
  return r.t;
}

async function _rxc_js_mf_open(pathp, bytesp, len, infop) {
  try {
    return await RXCMF.open(pathp >>> 0, bytesp >>> 0, len, infop >>> 0);
  } catch (e) {
    RXC.log("[mf] opening media failed: " + (e && e.stack || e));
    return 0;
  }
}

_rxc_js_mf_open.isAsync = true;

function _rxc_js_mf_time(id, flagsp) {
  flagsp >>>= 0;
  const s = RXCMF.list.get(id);
  if (!s) {
    if (flagsp) HEAP32[flagsp >>> 2 >>> 0] = 2;
    return 0;
  }
  const v = s.v, seeking = s.seeking || v.seeking;
  if (flagsp) HEAP32[flagsp >>> 2 >>> 0] = (s.ended && !seeking ? 1 : 0) | (s.error ? 2 : 0) | (!v.paused ? 4 : 0) | (seeking ? 8 : 0);
  return v.currentTime;
}

function _rxc_js_note_program(vsp, psp) {
  RXC.noteProgram(UTF8ToString(vsp) + ":" + UTF8ToString(psp));
}

function _rxc_js_now() {
  return performance.timeOrigin + performance.now() - RXC.pausedMs;
}

function _rxc_js_prelink(hashp, isVs, outp, cap) {
  if (!RXC.pairs) return 0;
  const l = RXC.pairs.get((isVs ? "v" : "p") + UTF8ToString(hashp));
  if (!l || !l.length) return 0;
  const txt = l.join("\n");
  if (lengthBytesUTF8(txt) + 1 > cap) return 0;
  stringToUTF8(txt, outp, cap);
  return l.length;
}

function _rxc_js_present(draws, links, combos, frame, tp) {
  Module["__frame"] = frame;
  const now = tp ? tp - performance.timeOrigin : performance.now(), last = Module["__lastPresent"], t = RXC.tot, p = RXC.stallPrev || {};
  // frame-time ring (Module.perf() summarises it) + what happened in every frame over 50 ms
  if (last && Module["__presented"]) {
    const P = RXC.perf || (RXC.perf = {
      ft: new Float32Array(8192),
      n: 0,
      slow: []
    });
    const dt = now - last;
    P.ft[P.n++ & 8191] = dt;
    const W = RXC.waits || (RXC.waits = {
      ms: [ 0, 0, 0 ],
      n: [ 0, 0, 0 ]
    }), pw = P.pw || [ 0, 0, 0, 0 ];
    if (dt > 50 && P.slow.length < 2e3) P.slow.push({
      t: Math.round(now),
      ms: Math.round(dt),
      draws: draws - (p.draws || 0),
      links: links - (p.links || 0),
      combos: combos - (p.combos || 0),
      fetches: t.fetches - (p.fetches || 0),
      fetchMs: Math.round(t.fetchMs - (p.fetchMs || 0)),
      wFrame: Math.round(W.ms[0] - pw[0]),
      wQuery: Math.round(W.ms[2] - pw[2]),
      nQuery: W.n[2] - pw[3]
    });
    P.pw = [ W.ms[0], W.ms[1], W.ms[2], W.n[2] ];
    if (!Module["perf"]) Module["perf"] = reset => {
      const Q = RXC.perf, n = Math.min(Q.n, 8192), a = Array.from(Q.ft.subarray(0, n)).sort((x, y) => x - y), q = f => a[Math.min(n - 1, Math.floor(f * n))];
      const r = {
        frames: n,
        avgFps: n ? 1e3 / (a.reduce((s, x) => s + x, 0) / n) : 0,
        p50: q(.5),
        p90: q(.9),
        p99: q(.99),
        max: a[n - 1],
        over33: a.filter(x => x > 33.4).length,
        over50: a.filter(x => x > 50).length,
        over100: a.filter(x => x > 100).length,
        slow: Q.slow.slice(-60)
      };
      if (reset) {
        Q.n = 0;
        Q.slow = [];
      }
      return r;
    };
  }
  if (last && now - last > 150 && Module["__presented"]) {
    const h = RXC.hitches || (RXC.hitches = {
      count: 0,
      max: 0,
      logged: 0
    });
    h.count++;
    h.max = Math.max(h.max, now - last);
    if (now - h.logged > 5e3) {
      console.log(`[hitch] ${h.count} frames over 150 ms, max ${(h.max / 1e3).toFixed(2)} s; latest: ${draws - (p.draws || 0)} draws, +${links - (p.links || 0)} programs linked, +${combos - (p.combos || 0)} new shader variants, +${t.fetches - (p.fetches || 0)} fetches (${((t.fetchKB - (p.fetchKB || 0)) / 1024).toFixed(0)} MB, waited ${((t.fetchMs - (p.fetchMs || 0)) / 1e3).toFixed(1)} s)`);
      h.count = 0;
      h.max = 0;
      h.logged = now;
    }
  }
  RXC.stallPrev = {
    draws,
    links,
    combos,
    fetches: t.fetches,
    fetchKB: t.fetchKB,
    fetchMs: t.fetchMs
  };
  RXC.framePending = 1;
  if (tp) {
    const st = RXC.stats || (RXC.stats = {
      t0: now,
      frames: 0,
      busy: 0,
      last: now,
      fstart: now
    });
    st.frames++;
    RXC.framePending = 0;
    if (now - st.t0 > 1e3) {
      RXC.fps = st.frames * 1e3 / (now - st.t0);
      st.t0 = now;
      st.frames = 0;
      globalThis.__rxcStats = {
        fps: RXC.fps,
        busy: RXC.busy,
        cacheMB: RXC.cacheBytes >> 20,
        c: RXC.cnt
      };
    }
  }
  Module["__lastPresent"] = now;
  if (!Module["__presented"]) {
    Module["__presented"] = 1;
    if (Module["onFirstFrame"]) Module["onFirstFrame"]();
  }
}

var RXCR = {
  ws: null,
  state: -1,
  q: []
};

function _rxc_js_relay_open(urlp) {
  urlp >>>= 0;
  let url = urlp ? UTF8ToString(urlp) : "";
  if (!url) {
    const l = location;
    url = (l.protocol === "https:" ? "wss://" : "ws://") + l.host + l.pathname.replace(/[^\/]*$/, "") + "relay";
  }
  try {
    if (RXCR.ws) RXCR.ws.close();
  } catch (e) {}
  RXCR.q = [];
  RXCR.state = 0;
  let ws;
  try {
    ws = new WebSocket(url);
  } catch (e) {
    console.error("[relay] " + e);
    RXCR.state = -1;
    return -1;
  }
  ws.binaryType = "arraybuffer";
  RXCR.ws = ws;
  ws.onopen = () => {
    if (RXCR.ws === ws) {
      RXCR.state = 1;
      console.log("[relay] connected to " + url);
    }
  };
  ws.onclose = () => {
    if (RXCR.ws === ws) {
      RXCR.state = -1;
      RXCR.ws = null;
    }
  };
  ws.onerror = () => {};
  ws.onmessage = ev => {
    if (RXCR.ws === ws && ev.data instanceof ArrayBuffer) RXCR.q.push(new Uint8Array(ev.data));
  };
  return 0;
}

function _rxc_js_relay_recv(p, cap) {
  // the next message's length (copied when it fits in cap), -1 = none
  p >>>= 0;
  const m = RXCR.q[0];
  if (!m) return -1;
  if (m.length > cap) return m.length;
  HEAPU8.set(m, p >>> 0);
  RXCR.q.shift();
  return m.length;
}

function _rxc_js_relay_send(p, n) {
  p >>>= 0;
  const ws = RXCR.ws;
  if (!ws || RXCR.state !== 1) return -1;
  try {
    ws.send(HEAPU8.slice(p, p + n));
  } catch (e) {
    return -1;
  }
  return 0;
}

function _rxc_js_relay_state() {
  return RXCR.state;
}

function _rxc_js_set_title(p) {
  document.title = UTF8ToString(p);
}

var RXCT = {
  th: [],
  lastMacro: 0,
  chan: null,
  q: [],
  macro(fn) {
    if (!RXCT.chan) {
      RXCT.chan = new MessageChannel;
      RXCT.chan.port1.onmessage = () => {
        RXCT.lastMacro = performance.now();
        const q = RXCT.q;
        RXCT.q = [];
        for (const f of q) f();
      };
    }
    RXCT.q.push(fn);
    RXCT.chan.port2.postMessage(0);
  }
};

function _rxc_js_sleep(ms) {
  RXC.cnt.sleeps++;
  RXC.cnt.sleepMs += ms;
  const t0 = performance.now();
  if (RXC.sleepTimer === undefined) {
    const m = new URLSearchParams(location.search).get("sleep");
    RXC.sleepTimer = m === "timer";
    RXC.sleepHop = m === "hop";
  }
  if (RXC.sleepHop && ms < 3) return new Promise(r => RXC.hop(() => {
    RXCT.lastMacro = performance.now();
    RXC.cnt.sleepAct = (RXC.cnt.sleepAct || 0) + RXCT.lastMacro - t0;
    r();
  }));
  const done = r => () => {
    RXCT.lastMacro = performance.now();
    const k = ms < 1 ? "hopAct" : "sleepAct";
    RXC.cnt[k] = (RXC.cnt[k] || 0) + RXCT.lastMacro - t0;
    if (ms < 1) RXC.cnt.hops = (RXC.cnt.hops || 0) + 1;
    r();
  };
  if (document.hidden && new URLSearchParams(location.search).has("bgrun")) {
    const due = performance.now() + ms;
    return new Promise(r => {
      const spin = () => {
        if (performance.now() < due) RXC.hop(spin); else done(r)();
      };
      RXC.hop(spin);
    });
  }
  if (RXC.sleepTimer) return new Promise(r => setTimeout(done(r), ms > 0 ? ms : 0));
  if (ms < 1) return new Promise(r => RXC.hop(done(r)));
  const due = t0 + ms;
  return new Promise(r => {
    const fin = done(r), spin = () => {
      if (performance.now() < due) RXC.hop(spin); else fin();
    };
    RXC.slate = Math.min((RXC.slate === undefined ? 2 : RXC.slate) * .99, 20);
    const s = ms - RXC.slate - .25;
    if (s < 1) {
      RXC.hop(spin);
      return;
    }
    const want = t0 + s, wake = () => {
      const o = performance.now() - want;
      if (o > RXC.slate) RXC.slate = o;
      spin();
    };
    // scheduler.postTask delays are not subject to the nested-setTimeout 4 ms clamp
    if (globalThis.scheduler && scheduler.postTask) scheduler.postTask(wake, {
      delay: s,
      priority: "user-blocking"
    }); else setTimeout(wake, s);
  });
}

_rxc_js_sleep.isAsync = true;

var _rxc_js_stack = function() {
  const s = (new Error).stack.split("\n").filter(l => /f_[0-9a-f]+/.test(l)).map(l => (/f_[0-9a-f]+(_body)?/.exec(l) || [ "" ])[0]);
  console.error("[hang] lifted stack: " + s.slice(0, 40).join(" "));
};

function _rxc_js_status(p) {
  RXC.status(UTF8ToString(p));
}

function _rxc_js_thread_switch(from, to, newStackTop) {
  RXC.cnt.switches++;
  const f = RXCT.th[from] || (RXCT.th[from] = {});
  const suspended = new Promise(res => {
    f.resume = res;
  });
  if (newStackTop) {
    // first switch into this thread: start it on a fresh wasm stack once the current one has suspended
    (performance.now() - RXCT.lastMacro > 16 ? RXCT.macro : queueMicrotask)(() => {
      stackRestore(newStackTop);
      const p = Module["_rxc_thread_start"](to);
      if (p && p.catch) p.catch(e => {
        console.error("guest thread " + to + " died:", e);
        const m = e && e.message || (e && e.type) || (typeof e === "object" ? JSON.stringify(e, Object.getOwnPropertyNames(e)) : String(e));
        RXC.status("guest thread " + to + " crashed: " + m);
        RXC.log("[web] guest thread " + to + " crashed: " + (e && e.stack ? e.stack : e));
      });
    });
  } else {
    const t = RXCT.th[to];
    if (!t || !t.resume) {
      console.error("rxc_js_thread_switch: thread " + to + " is not suspended");
      return suspended;
    }
    const r = t.resume;
    t.resume = null;
    // resolve straight away: the reaction is a microtask, so it runs after this thread has suspended (one hop less
    // than queueMicrotask(r), and the handoff is ~5% of a frame at ~20 switches)
    if (performance.now() - RXCT.lastMacro > 16) RXCT.macro(r); else r();
  }
  return suspended;
}

_rxc_js_thread_switch.isAsync = true;

function _rxc_js_turn_age() {
  return performance.now() - RXCT.lastMacro;
}

function _rxc_js_upload(name, p, n) {
  p >>>= 0;
  fetch("/upload/" + UTF8ToString(name), {
    method: "POST",
    body: HEAPU8.slice(p, p + n)
  }).catch(() => {});
}

var RXCV = {
  next: 1,
  map: {}
};

function _rxc_js_vnet_begin(host, port, req, len) {
  host >>>= 0;
  req >>>= 0;
  const id = RXCV.next++, e = RXCV.map[id] = {
    done: false,
    fail: false,
    data: null
  };
  const body = HEAPU8.slice(req, req + len);
  fetch("vnet", {
    method: "POST",
    headers: {
      "X-Vnet-Host": UTF8ToString(host),
      "X-Vnet-Port": String(port)
    },
    body
  }).then(r => r.ok ? r.arrayBuffer() : Promise.reject(new Error("HTTP " + r.status))).then(b => {
    e.data = new Uint8Array(b);
    e.done = true;
  }).catch(err => {
    console.error("[vnet] " + err);
    e.fail = true;
    e.done = true;
  });
  return id;
}

function _rxc_js_vnet_poll(id, outPtr, outLen) {
  outPtr >>>= 0;
  outLen >>>= 0;
  const e = RXCV.map[id];
  if (!e) return -1;
  if (!e.done) return 0;
  delete RXCV.map[id];
  if (e.fail) return -1;
  const p = _malloc(e.data.length || 1) >>> 0;
  HEAPU8.set(e.data, p >>> 0);
  HEAPU32[outPtr >>> 2 >>> 0] = p;
  HEAPU32[outLen >>> 2 >>> 0] = e.data.length;
  return 1;
}

function _rxc_js_yield() {
  // frame statistics for the page: frames, time spent running wasm vs. waiting
  const now = performance.now(), st = RXC.stats || (RXC.stats = {
    t0: now,
    frames: 0,
    busy: 0,
    last: now,
    fstart: now
  });
  const frame = RXC.framePending;
  RXC.framePending = 0;
  st.busy += now - st.last;
  if (frame) st.frames++;
  if (now - st.t0 > 1e3) {
    RXC.fps = st.frames * 1e3 / (now - st.t0);
    RXC.busy = st.busy / (now - st.t0);
    st.t0 = now;
    st.frames = 0;
    st.busy = 0;
    globalThis.__rxcStats = {
      fps: RXC.fps,
      busy: RXC.busy,
      cacheMB: RXC.cacheBytes >> 20,
      c: RXC.cnt
    };
    RXC.cnt = {
      reads: 0,
      fetches: 0,
      fetchKB: 0,
      fetchMs: 0,
      switches: 0,
      sleeps: 0,
      sleepMs: 0,
      yieldMs: 0
    };
    globalThis.__rxcTot = RXC.tot;
  }
  // ?yield=mc: uncapped - hand the event loop one turn through a MessageChannel (not throttled like timers, keeps
  // running in hidden tabs); ?yield=raf: always vsync through rAF (100 ms fallback); default 'auto': rAF only when the
  // frame's work fit in ~3/4 of a 60 Hz interval - waiting for the next vsync after a 25 ms frame would round it up to
  // 33 ms (30 fps). UE's own frame limiter keeps the uncapped path from running faster than it wants.
  if (RXC.yieldMode === undefined) RXC.yieldMode = new URLSearchParams(location.search).get("yield") || "";
  // ?yield wins (benchmarks), then the page's Vsync button (Module.yieldMode), then uncapped
  const mode = document.hidden && RXC.bgRun ? "mc" : RXC.yieldMode || Module["yieldMode"] || "mc";
  const work = now - st.fstart;
  // hidden tab: pause at this frame boundary until visible again (Chrome throttles hidden timers to ~1/s, so the
  // engine's threads would fall behind and pile up work for the return); the paused span is cut out of the game clock
  if (document.hidden && !RXC.bgRun) {
    if (RXC.bgRun === undefined) {
      RXC.bgRun = new URLSearchParams(location.search).has("bgrun");
      if (RXC.bgRun) return Promise.resolve();
    }
    return new Promise(r => {
      const t0 = performance.now(), ctx = Module["audioContext"], audioNode = Module["audioNode"];
      console.log("[web] tab hidden: game paused");
      if (audioNode) audioNode.port.postMessage({
        reset: true
      });
      const onVis = () => {
        if (document.hidden) return;
        document.removeEventListener("visibilitychange", onVis);
        RXC.pausedMs += performance.now() - t0;
        if (Module["_rxc_set_paused"]) Module["_rxc_set_paused"](RXC.pausedMs);
        console.log("[web] tab visible: resumed after " + ((performance.now() - t0) / 1e3).toFixed(1) + " s");
        if (audioNode) audioNode.port.postMessage({
          reset: true
        });
        if (ctx && ctx.state !== "running" && Module["soundOn"] !== false) ctx.resume().catch(() => {});
        st.last = st.fstart = RXCT.lastMacro = performance.now();
        st.due = 0;
        r();
      };
      document.addEventListener("visibilitychange", onVis);
    });
  }
  if (frame && mode === "cap" && !RXC.capOk()) RXC.tlate *= .99;
  if (mode === "cap" && frame && now > RXC.ioHot && RXC.capOk()) {
    const iv = 1e3 / (+Module["fpsCap"] || 60);
    let due = RXC.capDue || (st.due || now) + iv;
    if (!RXC.capDue && now > due + iv / 2) due = now;
    RXC.capDue = 0;
    st.due = due;
    const L = RXC.capLog || (RXC.capLog = Module["__capLog"] = {
      a: new Float64Array(6 * 1024),
      n: 0
    }), li = (L.n++ & 1023) * 6;
    L.a[li] = now;
    L.a[li + 1] = due;
    L.a[li + 2] = L.a[li + 3] = L.a[li + 4] = 0;
    L.a[li + 5] = RXC.tlate || 0;
    if (due - now > .3) return new Promise(r => {
      const t0 = performance.now();
      const spin = () => {
        if (performance.now() < due - .2) {
          RXC.hop(spin);
          return;
        }
        const t = performance.now();
        L.a[li + 4] = t;
        RXC.cnt.yieldMs += t - t0;
        st.last = st.fstart = RXCT.lastMacro = t;
        r();
      };
      RXC.tlate = Math.min((RXC.tlate || 1) * .995, iv);
      const sleep = due - now - .5 - RXC.tlate;
      L.a[li + 2] = sleep;
      if (sleep < 1) {
        RXC.hop(spin);
        return;
      }
      const want = now + sleep;
      RXC.hop(() => setTimeout(() => {
        const f = performance.now(), o = f - want;
        L.a[li + 3] = f;
        if (o > RXC.tlate) RXC.tlate = o;
        spin();
      }, sleep));
    });
  }
  if (frame) RXC.capDue = 0;
  if (!frame || mode === "mc" || mode === "cap" || (mode === "auto" && work > 12)) {
    if (!RXC.mc) {
      RXC.mc = new MessageChannel;
      RXC.mcq = [];
      RXC.mc.port1.onmessage = () => {
        const q = RXC.mcq;
        RXC.mcq = [];
        for (const f of q) f();
      };
    }
    const t0 = performance.now();
    return new Promise(r => {
      RXC.mcq.push(() => {
        const t = performance.now();
        RXC.cnt.yieldMs += t - t0;
        st.last = RXCT.lastMacro = t;
        if (frame) st.fstart = t;
        r();
      });
      RXC.mc.port2.postMessage(0);
    });
  }
  return new Promise(r => {
    let done = false;
    const go = () => {
      if (!done) {
        done = true;
        st.last = st.fstart = RXCT.lastMacro = performance.now();
        r();
      }
    };
    requestAnimationFrame(go);
    setTimeout(go, 100);
  });
}

_rxc_js_yield.isAsync = true;

var autoResumeAudioContext = ctx => {
  for (var event of [ "keydown", "mousedown", "touchstart" ]) {
    for (var element of [ document, document.getElementById("canvas") ]) {
      element?.addEventListener(event, () => {
        if (ctx.state === "suspended") ctx.resume();
      }, {
        "once": true
      });
    }
  }
};

var dynCall = (sig, ptr, args = [], promising = false) => {
  var func = getWasmTableEntry(ptr);
  if (promising) {
    func = WebAssembly.promising(func);
  }
  var rtn = func(...args);
  function convert(rtn) {
    return sig[0] == "p" ? rtn >>> 0 : rtn;
  }
  if (promising) {
    return rtn.then(convert);
  }
  return convert(rtn);
};

var writeArrayToMemory = (array, buffer) => {
  HEAP8.set(array, buffer >>> 0);
};

var runAndAbortIfError = func => {
  try {
    return func();
  } catch (e) {
    abort(e);
  }
};

var runtimeKeepalivePush = () => {
  runtimeKeepaliveCounter += 1;
};

var runtimeKeepalivePop = () => {
  runtimeKeepaliveCounter -= 1;
};

var Asyncify = {
  instrumentWasmImports(imports) {
    var importPattern = /^(invoke_.*|__asyncjs__.*)$/;
    for (let [x, original] of Object.entries(imports)) {
      if (typeof original == "function") {
        let isAsyncifyImport = original.isAsync || importPattern.test(x);
        // Wrap async imports with a suspending WebAssembly function.
        if (isAsyncifyImport) {
          imports[x] = original = new WebAssembly.Suspending(original);
        }
      }
    }
  },
  instrumentWasmExports(exports) {
    var exportPattern = /^(main|rxc_thread_start|main|__main_argc_argv)$/;
    Asyncify.asyncExports = new Set;
    var ret = {};
    for (let [x, original] of Object.entries(exports)) {
      if (typeof original == "function") {
        // Wrap all exports with a promising WebAssembly function.
        let isAsyncifyExport = exportPattern.test(x);
        if (isAsyncifyExport) {
          Asyncify.asyncExports.add(original);
          original = Asyncify.makeAsyncFunction(original);
        }
        ret[x] = original;
      } else {
        ret[x] = original;
      }
    }
    return ret;
  },
  asyncExports: null,
  isAsyncExport(func) {
    return Asyncify.asyncExports?.has(func);
  },
  handleAsync: async startAsync => {
    try {
      return await startAsync();
    } finally {}
  },
  handleSleep: startAsync => Asyncify.handleAsync(() => new Promise(startAsync)),
  makeAsyncFunction(original) {
    return WebAssembly.promising(original);
  }
};

var getCFunc = ident => {
  var func = Module["_" + ident];
  // closure exported function
  return func;
};

/**
   * @param {string|null=} returnType
   * @param {Array=} argTypes
   * @param {Array=} args
   * @param {Object=} opts
   */ var ccall = (ident, returnType, argTypes, args, opts) => {
  // For fast lookup of conversion functions
  var toC = {
    "string": str => {
      var ret = 0;
      if (str !== null && str !== undefined && str !== 0) {
        // null string
        ret = stringToUTF8OnStack(str);
      }
      return ret;
    },
    "array": arr => {
      var ret = stackAlloc(arr.length);
      writeArrayToMemory(arr, ret);
      return ret;
    }
  };
  function convertReturnValue(ret) {
    if (returnType === "string") {
      return UTF8ToString(ret);
    }
    if (returnType === "pointer") return ret >>> 0;
    if (returnType === "boolean") return Boolean(ret);
    return ret;
  }
  var func = getCFunc(ident);
  var cArgs = [];
  var stack = 0;
  if (args) {
    for (var i = 0; i < args.length; i++) {
      var converter = toC[argTypes[i]];
      if (converter) {
        if (stack === 0) stack = stackSave();
        cArgs[i] = converter(args[i]);
      } else {
        cArgs[i] = args[i];
      }
    }
  }
  var ret = func(...cArgs);
  function onDone(ret) {
    if (stack !== 0) stackRestore(stack);
    return convertReturnValue(ret);
  }
  var asyncMode = opts?.async;
  if (asyncMode) return ret.then(onDone);
  ret = onDone(ret);
  return ret;
};

FS.createPreloadedFile = FS_createPreloadedFile;

FS.preloadFile = FS_preloadFile;

FS.staticInit();

Module["requestAnimationFrame"] = MainLoop.requestAnimationFrame;

Module["pauseMainLoop"] = MainLoop.pause;

Module["resumeMainLoop"] = MainLoop.resume;

MainLoop.init();

// Signal GL rendering layer that processing of a new frame is about to
// start. This helps it optimize VBO double-buffering and reduce GPU stalls.
registerPreMainLoop(() => GL.newRenderingFrameStarted());

for (let i = 0; i < 32; ++i) tempFixedLengthArray.push(new Array(i));

var miniTempWebGLFloatBuffersStorage = new Float32Array(288);

// Create GL_POOL_TEMP_BUFFERS_SIZE+1 temporary buffers, for uploads of size 0 through GL_POOL_TEMP_BUFFERS_SIZE inclusive
for (/**@suppress{duplicate}*/ var i = 0; i <= 288; ++i) {
  miniTempWebGLFloatBuffers[i] = miniTempWebGLFloatBuffersStorage.subarray(0, i);
}

var miniTempWebGLIntBuffersStorage = new Int32Array(288);

// Create GL_POOL_TEMP_BUFFERS_SIZE+1 temporary buffers, for uploads of size 0 through GL_POOL_TEMP_BUFFERS_SIZE inclusive
for (/**@suppress{duplicate}*/ var i = 0; i <= 288; ++i) {
  miniTempWebGLIntBuffers[i] = miniTempWebGLIntBuffersStorage.subarray(0, i);
}

// End JS library code
// include: postlibrary.js
// This file is included after the automatically-generated JS library code
// but before the wasm module is created.
{
  // Begin ATMODULES hooks
  if (Module["noExitRuntime"]) noExitRuntime = Module["noExitRuntime"];
  if (Module["preloadPlugins"]) preloadPlugins = Module["preloadPlugins"];
  if (Module["print"]) out = Module["print"];
  if (Module["printErr"]) err = Module["printErr"];
  if (Module["wasmBinary"]) wasmBinary = Module["wasmBinary"];
  // End ATMODULES hooks
  if (Module["arguments"]) arguments_ = Module["arguments"];
  if (Module["thisProgram"]) thisProgram = Module["thisProgram"];
  if (Module["preInit"]) {
    if (typeof Module["preInit"] == "function") Module["preInit"] = [ Module["preInit"] ];
    while (Module["preInit"].length > 0) {
      Module["preInit"].shift()();
    }
  }
}

// Begin runtime exports
Module["ENV"] = ENV;

Module["ccall"] = ccall;

Module["UTF8ToString"] = UTF8ToString;

Module["stringToUTF8"] = stringToUTF8;

Module["lengthBytesUTF8"] = lengthBytesUTF8;

Module["getExceptionMessage"] = getExceptionMessage;

// End runtime exports
// Begin JS library exports
// End JS library exports
// end include: postlibrary.js
var ASM_CONSTS = {
  2958256464: () => {
    const e = GLctx.getExtension("WEBGL_provoking_vertex");
    if (e) e.provokingVertexWEBGL(e.FIRST_VERTEX_CONVENTION_WEBGL);
  },
  2958256588: () => /Firefox/.test(navigator.userAgent) ? 1 : 0,
  2958256644: () => {
    try {
      const e = GLctx.getExtension("WEBGL_debug_renderer_info");
      const r = e ? String(GLctx.getParameter(e.UNMASKED_RENDERER_WEBGL)) : "";
      return r ? (/Direct3D|D3D1[01]/i.test(r) ? 1 : 0) : 2;
    } catch (x) {
      return 2;
    }
  },
  2958256868: $0 => {
    const n = Module["__passlogReq"] | 0;
    Module["__passlogReq"] = 0;
    Module["__frame"] = $0;
    return n;
  },
  2958256972: () => {
    const e = GLctx.getExtension("KHR_parallel_shader_compile");
    if (e && e.maxShaderCompilerThreadsKHR) e.maxShaderCompilerThreadsKHR(4294967295);
  },
  2958257120: () => GLctx.getParameter(35376) | 0,
  2958257163: () => {
    const n = Module["__passlog"] | 0;
    if (n > 0) {
      Module["__passlog"] = n - 1;
      return 1;
    }
    return 0;
  },
  2958257266: () => {
    const n = Module["__gputime"] | 0;
    Module["__gputime"] = 0;
    return n;
  },
  2958257340: () => {
    if (Module["onPackageError"]) Module["onPackageError"]();
  },
  2958257400: ($0, $1) => {
    if (Module["onPackageProgress"]) Module["onPackageProgress"]($0, $1);
  },
  2958257471: () => {
    if (typeof (Module["SDL3"]) === "undefined") {
      Module["SDL3"] = {};
    }
    var SDL3 = Module["SDL3"];
    if (typeof (SDL3.JSVarToCPtr) === "undefined") {
      SDL3.JSVarToCPtr = function(v) {
        return v;
      };
    }
    if (typeof (SDL3.CPtrToHeap32Index) === "undefined") {
      SDL3.CPtrToHeap32Index = function(ptr) {
        return ptr >>> 2;
      };
    }
  },
  2958257785: $0 => {
    var str = UTF8ToString($0) + "\n\n" + "Abort/Retry/Ignore/AlwaysIgnore? [ariA] :";
    var reply = window.prompt(str, "i");
    if (reply === null) {
      reply = "i";
    }
    return reply.length === 1 ? reply.charCodeAt(0) : -1;
  },
  2958258e3: () => {
    Module["SDL3"].camera = {};
  },
  2958258032: () => (navigator.mediaDevices === undefined) ? 0 : 1,
  2958258091: ($0, $1, $2, $3, $4) => {
    const device = $0;
    const w = $1;
    const h = $2;
    const framerate_numerator = $3;
    const framerate_denominator = $4;
    const outcome = Module._SDLEmscriptenCameraPermissionOutcome;
    const iterate = Module._SDLEmscriptenThreadIterate;
    const constraints = {};
    if ((w <= 0) || (h <= 0)) {
      constraints.video = true;
    } else {
      constraints.video = {};
      constraints.video.width = w;
      constraints.video.height = h;
    }
    if ((framerate_numerator > 0) && (framerate_denominator > 0)) {
      var fps = framerate_numerator / framerate_denominator;
      constraints.video.frameRate = {
        ideal: fps
      };
    }
    function grabNextCameraFrame() {
      const SDL3 = Module["SDL3"];
      if ((typeof (SDL3) === "undefined") || (typeof (SDL3.camera) === "undefined") || (typeof (SDL3.camera.stream) === "undefined")) {
        return;
      }
      const nextframems = SDL3.camera.next_frame_time;
      const now = performance.now();
      if (now >= nextframems) {
        iterate(device);
        while (SDL3.camera.next_frame_time < now) {
          SDL3.camera.next_frame_time += SDL3.camera.fpsincrms;
        }
      }
      requestAnimationFrame(grabNextCameraFrame);
    }
    navigator.mediaDevices.getUserMedia(constraints).then(stream => {
      const settings = stream.getVideoTracks()[0].getSettings();
      const actualw = settings.width;
      const actualh = settings.height;
      const actualfps = settings.frameRate;
      console.log("Camera is opened! Actual spec: (" + actualw + "x" + actualh + "), fps=" + actualfps);
      if (outcome(device, 1, actualw, actualh, actualfps)) {
        const video = document.createElement("video");
        video.width = actualw;
        video.height = actualh;
        video.style.display = "none";
        video.srcObject = stream;
        const canvas = document.createElement("canvas");
        canvas.width = actualw;
        canvas.height = actualh;
        canvas.style.display = "none";
        const ctx2d = canvas.getContext("2d");
        const SDL3 = Module["SDL3"];
        SDL3.camera.width = actualw;
        SDL3.camera.height = actualh;
        SDL3.camera.fps = actualfps;
        SDL3.camera.fpsincrms = 1e3 / actualfps;
        SDL3.camera.stream = stream;
        SDL3.camera.video = video;
        SDL3.camera.canvas = canvas;
        SDL3.camera.ctx2d = ctx2d;
        SDL3.camera.next_frame_time = performance.now();
        video.play();
        video.addEventListener("loadedmetadata", () => {
          grabNextCameraFrame();
        });
      }
    }).catch(err => {
      console.error("Tried to open camera but it threw an error! " + err.name + ": " + err.message);
      outcome(device, 0, 0, 0, 0);
    });
  },
  2958260397: () => {
    const SDL3 = Module["SDL3"];
    if ((typeof (SDL3) === "undefined") || (typeof (SDL3.camera) === "undefined") || (typeof (SDL3.camera.stream) === "undefined")) {
      return;
    }
    SDL3.camera.stream.getTracks().forEach(track => track.stop());
    SDL3.camera = {};
  },
  2958260648: ($0, $1, $2) => {
    const w = $0;
    const h = $1;
    const rgba = $2;
    const SDL3 = Module["SDL3"];
    if ((typeof (SDL3) === "undefined") || (typeof (SDL3.camera) === "undefined") || (typeof (SDL3.camera.ctx2d) === "undefined")) {
      return 0;
    }
    SDL3.camera.ctx2d.drawImage(SDL3.camera.video, 0, 0, w, h);
    const imgrgba = SDL3.camera.ctx2d.getImageData(0, 0, w, h).data;
    HEAPU8.set(imgrgba, rgba >>> 0);
    return 1;
  },
  2958261026: () => {
    if (typeof (Module["SDL3"]) !== "undefined") {
      Module["SDL3"].camera = undefined;
    }
  },
  2958261113: () => {
    Module["SDL3"].dummy_audio = {};
    Module["SDL3"].dummy_audio.timers = [];
    Module["SDL3"].dummy_audio.timers[0] = undefined;
    Module["SDL3"].dummy_audio.timers[1] = undefined;
  },
  2958261290: ($0, $1, $2, $3, $4) => {
    var a = Module["SDL3"].dummy_audio;
    if (a.timers[$0] !== undefined) {
      clearInterval(a.timers[$0]);
    }
    a.timers[$0] = setInterval(function() {
      dynCall("vi", $3, [ $4 ]);
    }, ($1 / $2) * 1e3);
  },
  2958261482: $0 => {
    var a = Module["SDL3"].dummy_audio;
    if (a.timers[$0] !== undefined) {
      clearInterval(a.timers[$0]);
    }
    a.timers[$0] = undefined;
  },
  2958261613: () => {
    if (typeof (AudioContext) !== "undefined") {
      return true;
    } else if (typeof (webkitAudioContext) !== "undefined") {
      return true;
    }
    return false;
  },
  2958261760: () => {
    if ((typeof (navigator.mediaDevices) !== "undefined") && (typeof (navigator.mediaDevices.getUserMedia) !== "undefined")) {
      return true;
    } else if (typeof (navigator.webkitGetUserMedia) !== "undefined") {
      return true;
    }
    return false;
  },
  2958261994: () => {
    var SDL3 = Module["SDL3"];
    if (typeof (SDL3.audio_playback) === "undefined") {
      SDL3.audio_playback = {};
    }
    if (typeof (SDL3.audio_recording) === "undefined") {
      SDL3.audio_recording = {};
    }
    if (!SDL3.audioContext) {
      if (typeof (AudioContext) !== "undefined") {
        SDL3.audioContext = new AudioContext;
      } else if (typeof (webkitAudioContext) !== "undefined") {
        SDL3.audioContext = new webkitAudioContext;
      }
      if (SDL3.audioContext) {
        if ((typeof navigator.userActivation) === "undefined") {
          autoResumeAudioContext(SDL3.audioContext);
        }
      }
    }
    return (SDL3.audioContext !== undefined);
  },
  2958262573: () => Module["SDL3"].audioContext.sampleRate,
  2958262624: ($0, $1, $2, $3) => {
    var SDL3 = Module["SDL3"];
    var have_microphone = function(stream) {
      if (SDL3.audio_recording.silenceTimer !== undefined) {
        clearInterval(SDL3.audio_recording.silenceTimer);
        SDL3.audio_recording.silenceTimer = undefined;
        SDL3.audio_recording.silenceBuffer = undefined;
      }
      SDL3.audio_recording.mediaStreamNode = SDL3.audioContext.createMediaStreamSource(stream);
      SDL3.audio_recording.scriptProcessorNode = SDL3.audioContext.createScriptProcessor($1, $0, 1);
      SDL3.audio_recording.scriptProcessorNode.onaudioprocess = function(audioProcessingEvent) {
        if ((SDL3 === undefined) || (SDL3.audio_recording === undefined)) {
          return;
        }
        audioProcessingEvent.outputBuffer.getChannelData(0).fill(0);
        SDL3.audio_recording.currentRecordingBuffer = audioProcessingEvent.inputBuffer;
        dynCall("ip", $2, [ $3 ]);
      };
      SDL3.audio_recording.mediaStreamNode.connect(SDL3.audio_recording.scriptProcessorNode);
      SDL3.audio_recording.scriptProcessorNode.connect(SDL3.audioContext.destination);
      SDL3.audio_recording.stream = stream;
    };
    var no_microphone = function(error) {};
    SDL3.audio_recording.silenceBuffer = SDL3.audioContext.createBuffer($0, $1, SDL3.audioContext.sampleRate);
    SDL3.audio_recording.silenceBuffer.getChannelData(0).fill(0);
    var silence_callback = function() {
      SDL3.audio_recording.currentRecordingBuffer = SDL3.audio_recording.silenceBuffer;
      dynCall("ip", $2, [ $3 ]);
    };
    SDL3.audio_recording.silenceTimer = setInterval(silence_callback, ($1 / SDL3.audioContext.sampleRate) * 1e3);
    if ((navigator.mediaDevices !== undefined) && (navigator.mediaDevices.getUserMedia !== undefined)) {
      navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false
      }).then(have_microphone).catch(no_microphone);
    } else if (navigator.webkitGetUserMedia !== undefined) {
      navigator.webkitGetUserMedia({
        audio: true,
        video: false
      }, have_microphone, no_microphone);
    }
  },
  2958264465: ($0, $1, $2, $3) => {
    var SDL3 = Module["SDL3"];
    SDL3.audio_playback.scriptProcessorNode = SDL3.audioContext["createScriptProcessor"]($1, 0, $0);
    SDL3.audio_playback.scriptProcessorNode["onaudioprocess"] = function(e) {
      if ((SDL3 === undefined) || (SDL3.audio_playback === undefined)) {
        return;
      }
      if (SDL3.audio_playback.silenceTimer !== undefined) {
        clearInterval(SDL3.audio_playback.silenceTimer);
        SDL3.audio_playback.silenceTimer = undefined;
        SDL3.audio_playback.silenceBuffer = undefined;
      }
      SDL3.audio_playback.currentPlaybackBuffer = e["outputBuffer"];
      dynCall("ip", $2, [ $3 ]);
    };
    SDL3.audio_playback.scriptProcessorNode["connect"](SDL3.audioContext["destination"]);
    if (SDL3.audioContext.state === "suspended") {
      SDL3.audio_playback.silenceBuffer = SDL3.audioContext.createBuffer($0, $1, SDL3.audioContext.sampleRate);
      SDL3.audio_playback.silenceBuffer.getChannelData(0).fill(0);
      var silence_callback = function() {
        if ((typeof navigator.userActivation) !== "undefined") {
          if (navigator.userActivation.hasBeenActive) {
            SDL3.audioContext.resume();
          }
        }
        SDL3.audio_playback.currentPlaybackBuffer = SDL3.audio_playback.silenceBuffer;
        dynCall("ip", $2, [ $3 ]);
        SDL3.audio_playback.currentPlaybackBuffer = undefined;
      };
      SDL3.audio_playback.silenceTimer = setInterval(silence_callback, ($1 / SDL3.audioContext.sampleRate) * 1e3);
    }
  },
  2958265781: $0 => {
    var SDL3 = Module["SDL3"];
    if ($0) {
      if (SDL3.audio_recording.silenceTimer !== undefined) {
        clearInterval(SDL3.audio_recording.silenceTimer);
      }
      if (SDL3.audio_recording.stream !== undefined) {
        var tracks = SDL3.audio_recording.stream.getAudioTracks();
        for (var i = 0; i < tracks.length; i++) {
          SDL3.audio_recording.stream.removeTrack(tracks[i]);
        }
      }
      if (SDL3.audio_recording.scriptProcessorNode !== undefined) {
        SDL3.audio_recording.scriptProcessorNode.onaudioprocess = function(audioProcessingEvent) {};
        SDL3.audio_recording.scriptProcessorNode.disconnect();
      }
      if (SDL3.audio_recording.mediaStreamNode !== undefined) {
        SDL3.audio_recording.mediaStreamNode.disconnect();
      }
      SDL3.audio_recording = undefined;
    } else {
      if (SDL3.audio_playback.scriptProcessorNode != undefined) {
        SDL3.audio_playback.scriptProcessorNode.disconnect();
      }
      if (SDL3.audio_playback.silenceTimer !== undefined) {
        clearInterval(SDL3.audio_playback.silenceTimer);
      }
      SDL3.audio_playback = undefined;
    }
    if ((SDL3.audioContext !== undefined) && (SDL3.audio_playback === undefined) && (SDL3.audio_recording === undefined)) {
      SDL3.audioContext.close();
      SDL3.audioContext = undefined;
    }
  },
  2958266937: ($0, $1) => {
    var SDL3 = Module["SDL3"];
    var buf = SDL3.CPtrToHeap32Index($0);
    var numChannels = SDL3.audio_playback.currentPlaybackBuffer["numberOfChannels"];
    for (var c = 0; c < numChannels; ++c) {
      var channelData = SDL3.audio_playback.currentPlaybackBuffer["getChannelData"](c);
      if (channelData.length != $1) {
        throw "Web Audio playback buffer length mismatch! Destination size: " + channelData.length + " samples vs expected " + $1 + " samples!";
      }
      for (var j = 0; j < $1; ++j) {
        channelData[j] = HEAPF32[buf + (j * numChannels + c) >>> 0];
      }
    }
  },
  2958267470: ($0, $1) => {
    var SDL3 = Module["SDL3"];
    var numChannels = SDL3.audio_recording.currentRecordingBuffer.numberOfChannels;
    for (var c = 0; c < numChannels; ++c) {
      var channelData = SDL3.audio_recording.currentRecordingBuffer.getChannelData(c);
      if (channelData.length != $1) {
        throw "Web Audio recording buffer length mismatch! Destination size: " + channelData.length + " samples vs expected " + $1 + " samples!";
      }
      if (numChannels == 1) {
        for (var j = 0; j < $1; ++j) {
          setValue($0 + (j * 4), channelData[j], "float");
        }
      } else {
        for (var j = 0; j < $1; ++j) {
          setValue($0 + (((j * numChannels) + c) * 4), channelData[j], "float");
        }
      }
    }
  },
  2958268097: $0 => {
    let gamepads = navigator["getGamepads"]();
    if (!gamepads) {
      return 0;
    }
    let gamepad = gamepads[$0];
    if (!gamepad || !gamepad["vibrationActuator"]) {
      return 0;
    }
    return 1;
  },
  2958268272: ($0, $1, $2) => {
    let gamepads = navigator["getGamepads"]();
    if (!gamepads) {
      return 0;
    }
    let gamepad = gamepads[$0];
    if (!gamepad || !gamepad["vibrationActuator"]) {
      return 0;
    }
    gamepad["vibrationActuator"]["playEffect"]("dual-rumble", {
      "startDelay": 0,
      "duration": 3e3,
      "weakMagnitude": $2 / 65535,
      "strongMagnitude": $1 / 65535
    });
    return 1;
  },
  2958268608: $0 => {
    window.open(UTF8ToString($0), "_blank");
  },
  2958268648: ($0, $1, $2, $3) => {
    var w = $0;
    var h = $1;
    var pixels = $2;
    var canvasId = UTF8ToString($3);
    var canvas = document.querySelector(canvasId);
    var SDL3 = Module["SDL3"];
    if (SDL3.ctxCanvas !== canvas) {
      SDL3.ctx = Browser.createContext(canvas, false, true);
      if (!SDL3.ctx) {
        return false;
      }
      SDL3.ctxCanvas = canvas;
    }
    if (SDL3.w !== w || SDL3.h !== h || SDL3.imageCtx !== SDL3.ctx) {
      SDL3.image = SDL3.ctx.createImageData(w, h);
      SDL3.w = w;
      SDL3.h = h;
      SDL3.imageCtx = SDL3.ctx;
    }
    var data = SDL3.image.data;
    var src = pixels / 4;
    if (SDL3.data32Data !== data) {
      SDL3.data32 = new Int32Array(data.buffer);
      SDL3.data32Data = data;
    }
    var data32 = SDL3.data32;
    data32.set(HEAP32.subarray(src >>> 0, src + data32.length >>> 0));
    SDL3.ctx.putImageData(SDL3.image, 0, 0);
    return true;
  },
  2958269397: () => {
    var SDL3 = Module["SDL3"];
    SDL3["mouse_x"] = 0;
    SDL3["mouse_y"] = 0;
    SDL3["mouse_buttons"] = [];
    for (var i = 0; i < 5; ++i) {
      SDL3["mouse_buttons"][i] = false;
    }
    document.addEventListener("mousemove", function(e) {
      var SDL3 = Module["SDL3"];
      SDL3["mouse_x"] = e.clientX;
      SDL3["mouse_y"] = e.clientY;
    });
    document.addEventListener("mousedown", function(e) {
      var SDL3 = Module["SDL3"];
      if (0 <= e.button && e.button < SDL3["mouse_buttons"].length) {
        SDL3["mouse_buttons"][e.button] = true;
      }
    });
    document.addEventListener("mouseup", function(e) {
      var SDL3 = Module["SDL3"];
      if (0 <= e.button && e.button < SDL3["mouse_buttons"].length) {
        SDL3["mouse_buttons"][e.button] = false;
      }
    });
  },
  2958270085: ($0, $1, $2, $3, $4) => {
    var w = $0;
    var h = $1;
    var hot_x = $2;
    var hot_y = $3;
    var pixels = $4;
    var canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    var ctx = canvas.getContext("2d");
    var image = ctx.createImageData(w, h);
    var data = image.data;
    var src = pixels / 4;
    var data32 = new Int32Array(data.buffer);
    data32.set(HEAP32.subarray(src >>> 0, src + data32.length >>> 0));
    ctx.putImageData(image, 0, 0);
    var url = hot_x === 0 && hot_y === 0 ? "url(" + canvas.toDataURL() + "), auto" : "url(" + canvas.toDataURL() + ") " + hot_x + " " + hot_y + ", auto";
    var urlBuf = _SDL_malloc(url.length + 1);
    stringToUTF8(url, urlBuf, url.length + 1);
    return urlBuf;
  },
  2958270743: $0 => {
    if (Module["canvas"]) {
      Module["canvas"].style["cursor"] = UTF8ToString($0);
    }
  },
  2958270826: () => {
    if (Module["canvas"]) {
      Module["canvas"].style["cursor"] = "none";
    }
  },
  2958270895: () => Module["SDL3"]["mouse_x"],
  2958270933: () => Module["SDL3"]["mouse_y"],
  2958270971: $0 => Module["SDL3"]["mouse_buttons"][$0],
  2958271019: $0 => {
    var data = $0;
    document.sdlEventHandlerLockKeysCheck = function(event) {
      if ((event.key != "CapsLock") && (event.key != "NumLock") && (event.key != "ScrollLock")) {
        _Emscripten_HandleLockKeysCheck(Module["SDL3"].JSVarToCPtr(data), event.getModifierState("CapsLock"), event.getModifierState("NumLock"), event.getModifierState("ScrollLock"));
      }
    };
    document.addEventListener("keydown", document.sdlEventHandlerLockKeysCheck);
  },
  2958271446: () => {
    document.removeEventListener("keydown", document.sdlEventHandlerLockKeysCheck);
  },
  2958271530: $0 => {
    var target = document;
    if (target) {
      target.sdlEventHandlerMouseButtonUpGlobal = function(event) {
        var SDL3 = Module["SDL3"];
        var d = SDL3.makePointerEventCStruct(0, 0, event);
        if (d != 0) {
          _Emscripten_HandleMouseButtonUpGlobal(SDL3.JSVarToCPtr($0), d);
          _SDL_free(d);
        }
      };
      target.addEventListener("pointerup", target.sdlEventHandlerMouseButtonUpGlobal);
    }
  },
  2958271891: $0 => {
    var SDL3 = Module["SDL3"];
    if (SDL3.makePointerEventCStruct === undefined) {
      SDL3.makePointerEventCStruct = function(left, top, event) {
        var ptrtype = 0;
        if (event.pointerType == "mouse") {
          ptrtype = 1;
        } else if (event.pointerType == "touch") {
          ptrtype = 2;
        } else if (event.pointerType == "pen") {
          ptrtype = 3;
        } else {
          return 0;
        }
        var ptr = _SDL_malloc($0);
        if (ptr != 0) {
          var idx = SDL3.CPtrToHeap32Index(ptr);
          HEAP32[idx++ >>> 0] = ptrtype;
          HEAP32[idx++ >>> 0] = event.pointerId;
          HEAP32[idx++ >>> 0] = (typeof (event.button) !== "undefined") ? event.button : -1;
          HEAP32[idx++ >>> 0] = event.buttons;
          HEAP32[idx++ >>> 0] = (event.type == "pointerdown") ? 1 : 0;
          HEAPF32[idx++ >>> 0] = event.movementX;
          HEAPF32[idx++ >>> 0] = event.movementY;
          HEAPF32[idx++ >>> 0] = event.clientX - left;
          HEAPF32[idx++ >>> 0] = event.clientY - top;
          if (ptrtype == 3) {
            HEAPF32[idx++ >>> 0] = event.pressure;
            HEAPF32[idx++ >>> 0] = event.tangentialPressure;
            HEAPF32[idx++ >>> 0] = event.tiltX;
            HEAPF32[idx++ >>> 0] = event.tiltY;
            HEAPF32[idx++ >>> 0] = event.twist;
          }
        }
        return ptr;
      };
    }
  },
  2958272883: $0 => {
    var id = UTF8ToString($0);
    try {
      var canvas = document.querySelector(id);
      if (canvas) {
        return canvas === document.activeElement;
      }
    } catch (e) {}
    return false;
  },
  2958273049: () => document.hasFocus(),
  2958273081: () => {
    var target = document;
    if (target) {
      target.removeEventListener("pointerup", target.sdlEventHandlerMouseButtonUpGlobal);
      target.sdlEventHandlerMouseButtonUpGlobal = undefined;
    }
  },
  2958273263: () => document.body.clientWidth,
  2958273301: () => document.body.clientHeight,
  2958273340: () => window.innerWidth,
  2958273370: () => window.innerHeight,
  2958273401: () => window.outerWidth,
  2958273431: () => window.outerHeight,
  2958273462: () => window.pageXOffset,
  2958273493: () => window.pageYOffset,
  2958273524: ($0, $1) => {
    var target = document.querySelector(UTF8ToString($1));
    if (target) {
      var SDL3 = Module["SDL3"];
      var data = $0;
      target.sdlEventHandlerPointerEnter = function(event) {
        var rect = target.getBoundingClientRect();
        var d = SDL3.makePointerEventCStruct(rect.left, rect.top, event);
        if (d != 0) {
          _Emscripten_HandlePointerEnter(SDL3.JSVarToCPtr(data), d);
          _SDL_free(d);
        }
      };
      target.sdlEventHandlerPointerLeave = function(event) {
        var rect = target.getBoundingClientRect();
        var d = SDL3.makePointerEventCStruct(rect.left, rect.top, event);
        if (d != 0) {
          _Emscripten_HandlePointerLeave(SDL3.JSVarToCPtr(data), d);
          _SDL_free(d);
        }
      };
      target.sdlEventHandlerPointerGeneric = function(event) {
        var rect = target.getBoundingClientRect();
        var d = SDL3.makePointerEventCStruct(rect.left, rect.top, event);
        if (d != 0) {
          _Emscripten_HandlePointerGeneric(SDL3.JSVarToCPtr(data), d);
          _SDL_free(d);
        }
      };
      target.style.touchAction = "none";
      target.addEventListener("pointerenter", target.sdlEventHandlerPointerEnter);
      target.addEventListener("pointerleave", target.sdlEventHandlerPointerLeave);
      target.addEventListener("pointercancel", target.sdlEventHandlerPointerLeave);
      target.addEventListener("pointerdown", target.sdlEventHandlerPointerGeneric);
      target.addEventListener("pointermove", target.sdlEventHandlerPointerGeneric);
      target.addEventListener("pointerup", target.sdlEventHandlerPointerGeneric);
    }
  },
  2958274912: ($0, $1, $2) => {
    var target = document.querySelector(UTF8ToString($1));
    if (target) {
      var data = $0;
      var SDL3 = Module["SDL3"];
      var makeDropEventCStruct = function(event) {
        var ptr = 0;
        ptr = _SDL_malloc($2);
        if (ptr != 0) {
          var idx = ptr >> 2;
          var rect = target.getBoundingClientRect();
          HEAP32[idx++ >>> 0] = event.clientX - rect.left;
          HEAP32[idx++ >>> 0] = event.clientY - rect.top;
        }
        return ptr;
      };
      SDL3.eventHandlerDropDragover = function(event) {
        event.preventDefault();
        var d = makeDropEventCStruct(event);
        if (d != 0) {
          _Emscripten_SendDragEvent(data, d);
          _SDL_free(d);
        }
      };
      target.addEventListener("dragover", SDL3.eventHandlerDropDragover);
      SDL3.drop_count = 0;
      try {
        FS.mkdir("/tmp/filedrop");
      } catch (e) {}
      SDL3.eventHandlerDropDrop = function(event) {
        event.preventDefault();
        if (event.dataTransfer.types.includes("text/plain")) {
          let plain_text = stringToNewUTF8(event.dataTransfer.getData("text/plain"));
          _Emscripten_SendDragTextEvent(data, plain_text);
          _Emscripten_force_free(plain_text);
        } else if (event.dataTransfer.types.includes("Files")) {
          let files_read = 0;
          const files_to_read = event.dataTransfer.files.length;
          for (let i = 0; i < files_to_read; i++) {
            const file = event.dataTransfer.files.item(i);
            const file_reader = new FileReader;
            file_reader.readAsArrayBuffer(file);
            file_reader.onload = function(event) {
              const fs_dropdir = `/tmp/filedrop/${SDL3.drop_count}`;
              SDL3.drop_count += 1;
              const fs_filepath = `${fs_dropdir}/${file.name}`;
              const c_fs_filepath = stringToNewUTF8(fs_filepath);
              const contents_array8 = new Uint8Array(event.target.result);
              try {
                FS.mkdir(fs_dropdir);
                var stream = FS.open(fs_filepath, "w");
                FS.write(stream, contents_array8, 0, contents_array8.length, 0);
                FS.close(stream);
                _Emscripten_SendDragFileEvent(data, c_fs_filepath);
              } catch (e) {}
              _Emscripten_force_free(c_fs_filepath);
              onFileRead();
            };
            file_reader.onerror = function(event) {
              onFileRead();
            };
          }
          function onFileRead() {
            ++files_read;
            if (files_read === files_to_read) {
              _Emscripten_SendDragCompleteEvent(data);
            }
          }
        }
        _Emscripten_SendDragCompleteEvent(data);
      };
      target.addEventListener("drop", SDL3.eventHandlerDropDrop);
      SDL3.eventHandlerDropDragend = function(event) {
        event.preventDefault();
        _Emscripten_SendDragCompleteEvent(data);
      };
      target.addEventListener("dragend", SDL3.eventHandlerDropDragend);
      target.addEventListener("dragleave", SDL3.eventHandlerDropDragend);
    }
  },
  2958277279: $0 => {
    var target = document.querySelector(UTF8ToString($0));
    if (target) {
      var SDL3 = Module["SDL3"];
      target.removeEventListener("dragleave", SDL3.eventHandlerDropDragend);
      target.removeEventListener("dragend", SDL3.eventHandlerDropDragend);
      target.removeEventListener("drop", SDL3.eventHandlerDropDrop);
      SDL3.drop_count = undefined;
      function recursive_remove(dirpath) {
        FS.readdir(dirpath).forEach(filename => {
          const p = `${dirpath}/${filename}`;
          const p_s = FS.stat(p);
          if (FS.isFile(p_s.mode)) {
            FS.unlink(p);
          } else if (FS.isDir(p)) {
            recursive_remove(p);
          }
        });
        FS.rmdir(dirpath);
      }
      ("/tmp/filedrop");
      FS.rmdir("/tmp/filedrop");
      target.removeEventListener("dragover", SDL3.eventHandlerDropDragover);
      SDL3.eventHandlerDropDragover = undefined;
      SDL3.eventHandlerDropDrop = undefined;
      SDL3.eventHandlerDropDragend = undefined;
    }
  },
  2958278109: $0 => {
    var target = document.querySelector(UTF8ToString($0));
    if (target) {
      target.removeEventListener("pointerenter", target.sdlEventHandlerPointerEnter);
      target.removeEventListener("pointerleave", target.sdlEventHandlerPointerLeave);
      target.removeEventListener("pointercancel", target.sdlEventHandlerPointerLeave);
      target.removeEventListener("pointerdown", target.sdlEventHandlerPointerGeneric);
      target.removeEventListener("pointermove", target.sdlEventHandlerPointerGeneric);
      target.removeEventListener("pointerup", target.sdlEventHandlerPointerGeneric);
      target.style.touchAction = "";
      target.sdlEventHandlerPointerEnter = undefined;
      target.sdlEventHandlerPointerLeave = undefined;
      target.sdlEventHandlerPointerGeneric = undefined;
    }
  },
  2958278843: () => {
    if (!window.matchMedia) {
      return -1;
    }
    if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      return 0;
    }
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return 1;
    }
    return -1;
  },
  2958279052: () => {
    if (typeof (Module["SDL3"]) !== "undefined") {
      var SDL3 = Module["SDL3"];
      SDL3.themeChangedMatchMedia.removeEventListener("change", SDL3.eventHandlerThemeChanged);
      SDL3.themeChangedMatchMedia = undefined;
      SDL3.eventHandlerThemeChanged = undefined;
    }
  },
  2958279305: () => window.innerWidth,
  2958279335: () => window.innerHeight,
  2958279366: $0 => {
    Module["requestFullscreen"] = function(lockPointer, resizeCanvas) {
      _requestFullscreenThroughSDL($0);
    };
  },
  2958279475: ($0, $1) => {
    var pngData = HEAPU8.buffer instanceof ArrayBuffer ? HEAPU8.subarray($0 >>> 0, $0 + $1 >>> 0) : HEAPU8.slice($0, $0 + $1);
    var blob = new Blob([ pngData ], {
      type: "image/png"
    });
    var url = URL.createObjectURL(blob);
    var link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      link.type = "image/png";
      document.head.appendChild(link);
    }
    if (link.href && link.href.startsWith("blob:")) {
      URL.revokeObjectURL(link.href);
    }
    link.href = url;
  },
  2958279968: () => {
    Module["requestFullscreen"] = function(lockPointer, resizeCanvas) {};
  },
  2958280042: () => window.innerWidth,
  2958280072: () => window.innerHeight,
  2958280103: $0 => {
    var canvas = document.querySelector(UTF8ToString($0));
    canvas.SDL3_original_position = canvas.style.position;
    canvas.SDL3_original_top = canvas.style.top;
    canvas.SDL3_original_left = canvas.style.left;
    var div = document.createElement("div");
    div.id = "SDL3_fill_document_background_elements";
    div.SDL3_canvas = canvas;
    div.SDL3_canvas_parent = canvas.parentNode;
    div.SDL3_canvas_nextsib = canvas.nextSibling;
    var children = Array.from(document.body.children);
    for (var child of children) {
      div.appendChild(child);
    }
    document.body.appendChild(div);
    div.style.display = "none";
    document.body.appendChild(canvas);
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
  },
  2958280801: () => {
    var div = document.getElementById("SDL3_fill_document_background_elements");
    if (div) {
      if (div.SDL3_canvas_nextsib) {
        div.SDL3_canvas_parent.insertBefore(div.SDL3_canvas, div.SDL3_canvas_nextsib);
      } else {
        div.SDL3_canvas_parent.appendChild(div.SDL3_canvas);
      }
      while (div.firstChild) {
        document.body.insertBefore(div.firstChild, div);
      }
      div.SDL3_canvas.style.position = div.SDL3_canvas.SDL3_original_position;
      div.SDL3_canvas.style.top = div.SDL3_canvas.SDL3_original_top;
      div.SDL3_canvas.style.left = div.SDL3_canvas.SDL3_original_left;
      div.remove();
    }
  },
  2958281360: () => {
    if (window.matchMedia) {
      var SDL3 = Module["SDL3"];
      SDL3.eventHandlerThemeChanged = function(event) {
        _Emscripten_SendSystemThemeChangedEvent();
      };
      SDL3.themeChangedMatchMedia = window.matchMedia("(prefers-color-scheme: dark)");
      SDL3.themeChangedMatchMedia.addEventListener("change", SDL3.eventHandlerThemeChanged);
    }
  },
  2958281682: ($0, $1, $2, $3, $4) => {
    var title = UTF8ToString($0);
    var message = UTF8ToString($1);
    var background = UTF8ToString($2);
    var color = UTF8ToString($3);
    var id = UTF8ToString($4);
    var dialog = document.createElement("dialog");
    dialog.classList.add("SDL3_messagebox");
    dialog.id = id;
    dialog.style.color = color;
    dialog.style.backgroundColor = background;
    document.body.append(dialog);
    var h1 = document.createElement("h1");
    h1.innerText = title;
    dialog.append(h1);
    var p = document.createElement("p");
    p.innerText = message;
    dialog.append(p);
    dialog.showModal();
  },
  2958282223: ($0, $1, $2, $3, $4, $5, $6, $7) => {
    var dialog_id = UTF8ToString($0);
    var text = UTF8ToString($1);
    var responseId = $2;
    var clickOnReturn = $3;
    var clickOnEscape = $4;
    var border = UTF8ToString($5);
    var background = UTF8ToString($6);
    var hovered = UTF8ToString($7);
    var dialog = document.getElementById(dialog_id);
    if (!dialog) {
      return false;
    }
    var button = document.createElement("button");
    button.innerText = text;
    button.style.borderColor = border;
    button.style.backgroundColor = background;
    dialog.addEventListener("keydown", function(e) {
      if (clickOnReturn && e.key === "Enter") {
        e.preventDefault();
        button.click();
      } else if (clickOnEscape && e.key === "Escape") {
        e.preventDefault();
        button.click();
      }
    });
    dialog.addEventListener("cancel", function(e) {
      e.preventDefault();
    });
    button.onmouseenter = function(e) {
      button.style.backgroundColor = hovered;
    };
    button.onmouseleave = function(e) {
      button.style.backgroundColor = background;
    };
    button.onclick = function(e) {
      dialog.close(responseId);
    };
    dialog.append(button);
    return true;
  },
  2958283232: $0 => {
    var dialog_id = UTF8ToString($0);
    var dialog = document.getElementById(dialog_id);
    if (!dialog) {
      return false;
    }
    return dialog.open;
  },
  2958283370: $0 => {
    var dialog_id = UTF8ToString($0);
    var dialog = document.getElementById(dialog_id);
    if (!dialog) {
      return 0;
    }
    try {
      return parseInt(dialog.returnValue);
    } catch (e) {
      return 0;
    }
  },
  2958283552: ($0, $1) => {
    alert(UTF8ToString($0) + "\n\n" + UTF8ToString($1));
  }
};

function SDL_GetEmscriptenJoystickVendor(device_index) {
  let gamepad = navigator["getGamepads"]()[device_index];
  let vendor_str = "Vendor: ";
  if (gamepad["id"]["indexOf"](vendor_str) > 0) {
    let vendor_str_index = gamepad["id"]["indexOf"](vendor_str) + vendor_str["length"];
    return parseInt(gamepad["id"]["substr"](vendor_str_index, 4), 16);
  }
  let id_split = gamepad["id"]["split"]("-");
  if (id_split["length"] > 1 && !isNaN(parseInt(id_split[0], 16))) {
    return parseInt(id_split[0], 16);
  }
  return 0;
}

SDL_GetEmscriptenJoystickVendor.sig = "ii";

function SDL_GetEmscriptenJoystickProduct(device_index) {
  let gamepad = navigator["getGamepads"]()[device_index];
  let product_str = "Product: ";
  if (gamepad["id"]["indexOf"](product_str) > 0) {
    let product_str_index = gamepad["id"]["indexOf"](product_str) + product_str["length"];
    return parseInt(gamepad["id"]["substr"](product_str_index, 4), 16);
  }
  let id_split = gamepad["id"]["split"]("-");
  if (id_split["length"] > 1 && !isNaN(parseInt(id_split[1], 16))) {
    return parseInt(id_split[1], 16);
  }
  return 0;
}

SDL_GetEmscriptenJoystickProduct.sig = "ii";

function SDL_IsEmscriptenJoystickXInput(device_index) {
  let gamepad = navigator["getGamepads"]()[device_index];
  return gamepad["id"]["toLowerCase"]()["indexOf"]("xinput") >= 0;
}

SDL_IsEmscriptenJoystickXInput.sig = "ii";

// Imports from the Wasm binary.
var _free, _malloc, _rxc_mic_write_ptr, _rxc_mic_write_room, _rxc_mic_commit, _emscripten_stack_get_current, __emscripten_stack_restore, _rxc_thread_start, _gfxr_results, _SDL_free, _rxc_ev_mouse, _rxc_ev_key, _rxc_ev_mouse_raw, _rxc_raw_mouse_wanted, _rxc_dbg_thrdump, _rxc_ev_char, _rxc_ev_focus, _rxc_ev_resize, _main, _SDL_malloc, _SDL_calloc, _SDL_realloc, _SDLEmscriptenCameraPermissionOutcome, _SDLEmscriptenThreadIterate, _Emscripten_HandlePointerEnter, _Emscripten_HandlePointerLeave, _Emscripten_HandlePointerGeneric, _Emscripten_HandleMouseButtonUpGlobal, _Emscripten_SendDragEvent, _Emscripten_SendDragCompleteEvent, _Emscripten_SendDragTextEvent, _Emscripten_SendDragFileEvent, _Emscripten_HandleLockKeysCheck, _Emscripten_SendSystemThemeChangedEvent, _requestFullscreenThroughSDL, _Emscripten_force_free, ___trap, __emscripten_stack_alloc, ___cxa_decrement_exception_refcount, ___cxa_increment_exception_refcount, ___thrown_object_from_unwind_exception, ___get_exception_message, memory, __indirect_function_table, ___cpp_exception, wasmMemory, wasmTable;

function assignWasmExports(wasmExports) {
  _free = Module["_free"] = wasmExports["free"];
  _malloc = Module["_malloc"] = wasmExports["malloc"];
  _rxc_mic_write_ptr = Module["_rxc_mic_write_ptr"] = wasmExports["rxc_mic_write_ptr"];
  _rxc_mic_write_room = Module["_rxc_mic_write_room"] = wasmExports["rxc_mic_write_room"];
  _rxc_mic_commit = Module["_rxc_mic_commit"] = wasmExports["rxc_mic_commit"];
  _emscripten_stack_get_current = wasmExports["emscripten_stack_get_current"];
  __emscripten_stack_restore = wasmExports["_emscripten_stack_restore"];
  _rxc_thread_start = Module["_rxc_thread_start"] = wasmExports["rxc_thread_start"];
  _gfxr_results = Module["_gfxr_results"] = wasmExports["gfxr_results"];
  _SDL_free = Module["_SDL_free"] = wasmExports["SDL_free"];
  _rxc_ev_mouse = Module["_rxc_ev_mouse"] = wasmExports["rxc_ev_mouse"];
  _rxc_ev_key = Module["_rxc_ev_key"] = wasmExports["rxc_ev_key"];
  _rxc_ev_mouse_raw = Module["_rxc_ev_mouse_raw"] = wasmExports["rxc_ev_mouse_raw"];
  _rxc_raw_mouse_wanted = Module["_rxc_raw_mouse_wanted"] = wasmExports["rxc_raw_mouse_wanted"];
  _rxc_dbg_thrdump = Module["_rxc_dbg_thrdump"] = wasmExports["rxc_dbg_thrdump"];
  _rxc_ev_char = Module["_rxc_ev_char"] = wasmExports["rxc_ev_char"];
  _rxc_ev_focus = Module["_rxc_ev_focus"] = wasmExports["rxc_ev_focus"];
  _rxc_ev_resize = Module["_rxc_ev_resize"] = wasmExports["rxc_ev_resize"];
  _main = Module["_main"] = wasmExports["__main_argc_argv"];
  _SDL_malloc = Module["_SDL_malloc"] = wasmExports["SDL_malloc"];
  _SDL_calloc = Module["_SDL_calloc"] = wasmExports["SDL_calloc"];
  _SDL_realloc = Module["_SDL_realloc"] = wasmExports["SDL_realloc"];
  _SDLEmscriptenCameraPermissionOutcome = Module["_SDLEmscriptenCameraPermissionOutcome"] = wasmExports["SDLEmscriptenCameraPermissionOutcome"];
  _SDLEmscriptenThreadIterate = Module["_SDLEmscriptenThreadIterate"] = wasmExports["SDLEmscriptenThreadIterate"];
  _Emscripten_HandlePointerEnter = Module["_Emscripten_HandlePointerEnter"] = wasmExports["Emscripten_HandlePointerEnter"];
  _Emscripten_HandlePointerLeave = Module["_Emscripten_HandlePointerLeave"] = wasmExports["Emscripten_HandlePointerLeave"];
  _Emscripten_HandlePointerGeneric = Module["_Emscripten_HandlePointerGeneric"] = wasmExports["Emscripten_HandlePointerGeneric"];
  _Emscripten_HandleMouseButtonUpGlobal = Module["_Emscripten_HandleMouseButtonUpGlobal"] = wasmExports["Emscripten_HandleMouseButtonUpGlobal"];
  _Emscripten_SendDragEvent = Module["_Emscripten_SendDragEvent"] = wasmExports["Emscripten_SendDragEvent"];
  _Emscripten_SendDragCompleteEvent = Module["_Emscripten_SendDragCompleteEvent"] = wasmExports["Emscripten_SendDragCompleteEvent"];
  _Emscripten_SendDragTextEvent = Module["_Emscripten_SendDragTextEvent"] = wasmExports["Emscripten_SendDragTextEvent"];
  _Emscripten_SendDragFileEvent = Module["_Emscripten_SendDragFileEvent"] = wasmExports["Emscripten_SendDragFileEvent"];
  _Emscripten_HandleLockKeysCheck = Module["_Emscripten_HandleLockKeysCheck"] = wasmExports["Emscripten_HandleLockKeysCheck"];
  _Emscripten_SendSystemThemeChangedEvent = Module["_Emscripten_SendSystemThemeChangedEvent"] = wasmExports["Emscripten_SendSystemThemeChangedEvent"];
  _requestFullscreenThroughSDL = Module["_requestFullscreenThroughSDL"] = wasmExports["requestFullscreenThroughSDL"];
  _Emscripten_force_free = Module["_Emscripten_force_free"] = wasmExports["Emscripten_force_free"];
  ___trap = wasmExports["__trap"];
  __emscripten_stack_alloc = wasmExports["_emscripten_stack_alloc"];
  ___cxa_decrement_exception_refcount = wasmExports["__cxa_decrement_exception_refcount"];
  ___cxa_increment_exception_refcount = wasmExports["__cxa_increment_exception_refcount"];
  ___thrown_object_from_unwind_exception = wasmExports["__thrown_object_from_unwind_exception"];
  ___get_exception_message = wasmExports["__get_exception_message"];
  memory = wasmMemory = wasmExports["memory"];
  __indirect_function_table = wasmTable = wasmExports["__indirect_function_table"];
  ___cpp_exception = wasmExports["__cpp_exception"];
}

var wasmImports = {
  /** @export */ SDL_GetEmscriptenJoystickProduct,
  /** @export */ SDL_GetEmscriptenJoystickVendor,
  /** @export */ SDL_IsEmscriptenJoystickXInput,
  /** @export */ __assert_fail: ___assert_fail,
  /** @export */ __syscall_fcntl64: ___syscall_fcntl64,
  /** @export */ __syscall_fdatasync: ___syscall_fdatasync,
  /** @export */ __syscall_fstat64: ___syscall_fstat64,
  /** @export */ __syscall_ioctl: ___syscall_ioctl,
  /** @export */ __syscall_lstat64: ___syscall_lstat64,
  /** @export */ __syscall_mkdirat: ___syscall_mkdirat,
  /** @export */ __syscall_newfstatat: ___syscall_newfstatat,
  /** @export */ __syscall_openat: ___syscall_openat,
  /** @export */ __syscall_rmdir: ___syscall_rmdir,
  /** @export */ __syscall_stat64: ___syscall_stat64,
  /** @export */ __syscall_unlinkat: ___syscall_unlinkat,
  /** @export */ __throw_exception_with_stack_trace: ___throw_exception_with_stack_trace,
  /** @export */ _abort_js: __abort_js,
  /** @export */ _gmtime_js: __gmtime_js,
  /** @export */ _tzset_js: __tzset_js,
  /** @export */ clock_time_get: _clock_time_get,
  /** @export */ emscripten_asm_const_double_sync_on_main_thread: _emscripten_asm_const_double_sync_on_main_thread,
  /** @export */ emscripten_asm_const_int: _emscripten_asm_const_int,
  /** @export */ emscripten_asm_const_int_sync_on_main_thread: _emscripten_asm_const_int_sync_on_main_thread,
  /** @export */ emscripten_asm_const_ptr_sync_on_main_thread: _emscripten_asm_const_ptr_sync_on_main_thread,
  /** @export */ emscripten_date_now: _emscripten_date_now,
  /** @export */ emscripten_exit_fullscreen: _emscripten_exit_fullscreen,
  /** @export */ emscripten_exit_pointerlock: _emscripten_exit_pointerlock,
  /** @export */ emscripten_force_exit: _emscripten_force_exit,
  /** @export */ emscripten_get_battery_status: _emscripten_get_battery_status,
  /** @export */ emscripten_get_device_pixel_ratio: _emscripten_get_device_pixel_ratio,
  /** @export */ emscripten_get_element_css_size: _emscripten_get_element_css_size,
  /** @export */ emscripten_get_fullscreen_status: _emscripten_get_fullscreen_status,
  /** @export */ emscripten_get_gamepad_status: _emscripten_get_gamepad_status,
  /** @export */ emscripten_get_main_loop_timing: _emscripten_get_main_loop_timing,
  /** @export */ emscripten_get_now: _emscripten_get_now,
  /** @export */ emscripten_get_num_gamepads: _emscripten_get_num_gamepads,
  /** @export */ emscripten_get_screen_size: _emscripten_get_screen_size,
  /** @export */ emscripten_glActiveTexture: _emscripten_glActiveTexture,
  /** @export */ emscripten_glAttachShader: _emscripten_glAttachShader,
  /** @export */ emscripten_glBeginQuery: _emscripten_glBeginQuery,
  /** @export */ emscripten_glBeginQueryEXT: _emscripten_glBeginQueryEXT,
  /** @export */ emscripten_glBeginTransformFeedback: _emscripten_glBeginTransformFeedback,
  /** @export */ emscripten_glBindAttribLocation: _emscripten_glBindAttribLocation,
  /** @export */ emscripten_glBindBuffer: _emscripten_glBindBuffer,
  /** @export */ emscripten_glBindBufferBase: _emscripten_glBindBufferBase,
  /** @export */ emscripten_glBindBufferRange: _emscripten_glBindBufferRange,
  /** @export */ emscripten_glBindFramebuffer: _emscripten_glBindFramebuffer,
  /** @export */ emscripten_glBindRenderbuffer: _emscripten_glBindRenderbuffer,
  /** @export */ emscripten_glBindSampler: _emscripten_glBindSampler,
  /** @export */ emscripten_glBindTexture: _emscripten_glBindTexture,
  /** @export */ emscripten_glBindTransformFeedback: _emscripten_glBindTransformFeedback,
  /** @export */ emscripten_glBindVertexArray: _emscripten_glBindVertexArray,
  /** @export */ emscripten_glBindVertexArrayOES: _emscripten_glBindVertexArrayOES,
  /** @export */ emscripten_glBlendColor: _emscripten_glBlendColor,
  /** @export */ emscripten_glBlendEquation: _emscripten_glBlendEquation,
  /** @export */ emscripten_glBlendEquationSeparate: _emscripten_glBlendEquationSeparate,
  /** @export */ emscripten_glBlendFunc: _emscripten_glBlendFunc,
  /** @export */ emscripten_glBlendFuncSeparate: _emscripten_glBlendFuncSeparate,
  /** @export */ emscripten_glBlitFramebuffer: _emscripten_glBlitFramebuffer,
  /** @export */ emscripten_glBufferData: _emscripten_glBufferData,
  /** @export */ emscripten_glBufferSubData: _emscripten_glBufferSubData,
  /** @export */ emscripten_glCheckFramebufferStatus: _emscripten_glCheckFramebufferStatus,
  /** @export */ emscripten_glClear: _emscripten_glClear,
  /** @export */ emscripten_glClearBufferfi: _emscripten_glClearBufferfi,
  /** @export */ emscripten_glClearBufferfv: _emscripten_glClearBufferfv,
  /** @export */ emscripten_glClearBufferiv: _emscripten_glClearBufferiv,
  /** @export */ emscripten_glClearBufferuiv: _emscripten_glClearBufferuiv,
  /** @export */ emscripten_glClearColor: _emscripten_glClearColor,
  /** @export */ emscripten_glClearDepthf: _emscripten_glClearDepthf,
  /** @export */ emscripten_glClearStencil: _emscripten_glClearStencil,
  /** @export */ emscripten_glClientWaitSync: _emscripten_glClientWaitSync,
  /** @export */ emscripten_glClipControlEXT: _emscripten_glClipControlEXT,
  /** @export */ emscripten_glColorMask: _emscripten_glColorMask,
  /** @export */ emscripten_glCompileShader: _emscripten_glCompileShader,
  /** @export */ emscripten_glCompressedTexImage2D: _emscripten_glCompressedTexImage2D,
  /** @export */ emscripten_glCompressedTexImage3D: _emscripten_glCompressedTexImage3D,
  /** @export */ emscripten_glCompressedTexSubImage2D: _emscripten_glCompressedTexSubImage2D,
  /** @export */ emscripten_glCompressedTexSubImage3D: _emscripten_glCompressedTexSubImage3D,
  /** @export */ emscripten_glCopyBufferSubData: _emscripten_glCopyBufferSubData,
  /** @export */ emscripten_glCopyTexImage2D: _emscripten_glCopyTexImage2D,
  /** @export */ emscripten_glCopyTexSubImage2D: _emscripten_glCopyTexSubImage2D,
  /** @export */ emscripten_glCopyTexSubImage3D: _emscripten_glCopyTexSubImage3D,
  /** @export */ emscripten_glCreateProgram: _emscripten_glCreateProgram,
  /** @export */ emscripten_glCreateShader: _emscripten_glCreateShader,
  /** @export */ emscripten_glCullFace: _emscripten_glCullFace,
  /** @export */ emscripten_glDeleteBuffers: _emscripten_glDeleteBuffers,
  /** @export */ emscripten_glDeleteFramebuffers: _emscripten_glDeleteFramebuffers,
  /** @export */ emscripten_glDeleteProgram: _emscripten_glDeleteProgram,
  /** @export */ emscripten_glDeleteQueries: _emscripten_glDeleteQueries,
  /** @export */ emscripten_glDeleteQueriesEXT: _emscripten_glDeleteQueriesEXT,
  /** @export */ emscripten_glDeleteRenderbuffers: _emscripten_glDeleteRenderbuffers,
  /** @export */ emscripten_glDeleteSamplers: _emscripten_glDeleteSamplers,
  /** @export */ emscripten_glDeleteShader: _emscripten_glDeleteShader,
  /** @export */ emscripten_glDeleteSync: _emscripten_glDeleteSync,
  /** @export */ emscripten_glDeleteTextures: _emscripten_glDeleteTextures,
  /** @export */ emscripten_glDeleteTransformFeedbacks: _emscripten_glDeleteTransformFeedbacks,
  /** @export */ emscripten_glDeleteVertexArrays: _emscripten_glDeleteVertexArrays,
  /** @export */ emscripten_glDeleteVertexArraysOES: _emscripten_glDeleteVertexArraysOES,
  /** @export */ emscripten_glDepthFunc: _emscripten_glDepthFunc,
  /** @export */ emscripten_glDepthMask: _emscripten_glDepthMask,
  /** @export */ emscripten_glDepthRangef: _emscripten_glDepthRangef,
  /** @export */ emscripten_glDetachShader: _emscripten_glDetachShader,
  /** @export */ emscripten_glDisable: _emscripten_glDisable,
  /** @export */ emscripten_glDisableVertexAttribArray: _emscripten_glDisableVertexAttribArray,
  /** @export */ emscripten_glDrawArrays: _emscripten_glDrawArrays,
  /** @export */ emscripten_glDrawArraysInstanced: _emscripten_glDrawArraysInstanced,
  /** @export */ emscripten_glDrawArraysInstancedANGLE: _emscripten_glDrawArraysInstancedANGLE,
  /** @export */ emscripten_glDrawArraysInstancedARB: _emscripten_glDrawArraysInstancedARB,
  /** @export */ emscripten_glDrawArraysInstancedEXT: _emscripten_glDrawArraysInstancedEXT,
  /** @export */ emscripten_glDrawArraysInstancedNV: _emscripten_glDrawArraysInstancedNV,
  /** @export */ emscripten_glDrawBuffers: _emscripten_glDrawBuffers,
  /** @export */ emscripten_glDrawBuffersEXT: _emscripten_glDrawBuffersEXT,
  /** @export */ emscripten_glDrawBuffersWEBGL: _emscripten_glDrawBuffersWEBGL,
  /** @export */ emscripten_glDrawElements: _emscripten_glDrawElements,
  /** @export */ emscripten_glDrawElementsInstanced: _emscripten_glDrawElementsInstanced,
  /** @export */ emscripten_glDrawElementsInstancedANGLE: _emscripten_glDrawElementsInstancedANGLE,
  /** @export */ emscripten_glDrawElementsInstancedARB: _emscripten_glDrawElementsInstancedARB,
  /** @export */ emscripten_glDrawElementsInstancedEXT: _emscripten_glDrawElementsInstancedEXT,
  /** @export */ emscripten_glDrawElementsInstancedNV: _emscripten_glDrawElementsInstancedNV,
  /** @export */ emscripten_glDrawRangeElements: _emscripten_glDrawRangeElements,
  /** @export */ emscripten_glEnable: _emscripten_glEnable,
  /** @export */ emscripten_glEnableVertexAttribArray: _emscripten_glEnableVertexAttribArray,
  /** @export */ emscripten_glEndQuery: _emscripten_glEndQuery,
  /** @export */ emscripten_glEndQueryEXT: _emscripten_glEndQueryEXT,
  /** @export */ emscripten_glEndTransformFeedback: _emscripten_glEndTransformFeedback,
  /** @export */ emscripten_glFenceSync: _emscripten_glFenceSync,
  /** @export */ emscripten_glFinish: _emscripten_glFinish,
  /** @export */ emscripten_glFlush: _emscripten_glFlush,
  /** @export */ emscripten_glFlushMappedBufferRange: _emscripten_glFlushMappedBufferRange,
  /** @export */ emscripten_glFramebufferRenderbuffer: _emscripten_glFramebufferRenderbuffer,
  /** @export */ emscripten_glFramebufferTexture2D: _emscripten_glFramebufferTexture2D,
  /** @export */ emscripten_glFramebufferTextureLayer: _emscripten_glFramebufferTextureLayer,
  /** @export */ emscripten_glFrontFace: _emscripten_glFrontFace,
  /** @export */ emscripten_glGenBuffers: _emscripten_glGenBuffers,
  /** @export */ emscripten_glGenFramebuffers: _emscripten_glGenFramebuffers,
  /** @export */ emscripten_glGenQueries: _emscripten_glGenQueries,
  /** @export */ emscripten_glGenQueriesEXT: _emscripten_glGenQueriesEXT,
  /** @export */ emscripten_glGenRenderbuffers: _emscripten_glGenRenderbuffers,
  /** @export */ emscripten_glGenSamplers: _emscripten_glGenSamplers,
  /** @export */ emscripten_glGenTextures: _emscripten_glGenTextures,
  /** @export */ emscripten_glGenTransformFeedbacks: _emscripten_glGenTransformFeedbacks,
  /** @export */ emscripten_glGenVertexArrays: _emscripten_glGenVertexArrays,
  /** @export */ emscripten_glGenVertexArraysOES: _emscripten_glGenVertexArraysOES,
  /** @export */ emscripten_glGenerateMipmap: _emscripten_glGenerateMipmap,
  /** @export */ emscripten_glGetActiveAttrib: _emscripten_glGetActiveAttrib,
  /** @export */ emscripten_glGetActiveUniform: _emscripten_glGetActiveUniform,
  /** @export */ emscripten_glGetActiveUniformBlockName: _emscripten_glGetActiveUniformBlockName,
  /** @export */ emscripten_glGetActiveUniformBlockiv: _emscripten_glGetActiveUniformBlockiv,
  /** @export */ emscripten_glGetActiveUniformsiv: _emscripten_glGetActiveUniformsiv,
  /** @export */ emscripten_glGetAttachedShaders: _emscripten_glGetAttachedShaders,
  /** @export */ emscripten_glGetAttribLocation: _emscripten_glGetAttribLocation,
  /** @export */ emscripten_glGetBooleanv: _emscripten_glGetBooleanv,
  /** @export */ emscripten_glGetBufferParameteri64v: _emscripten_glGetBufferParameteri64v,
  /** @export */ emscripten_glGetBufferParameteriv: _emscripten_glGetBufferParameteriv,
  /** @export */ emscripten_glGetBufferPointerv: _emscripten_glGetBufferPointerv,
  /** @export */ emscripten_glGetError: _emscripten_glGetError,
  /** @export */ emscripten_glGetFloatv: _emscripten_glGetFloatv,
  /** @export */ emscripten_glGetFragDataLocation: _emscripten_glGetFragDataLocation,
  /** @export */ emscripten_glGetFramebufferAttachmentParameteriv: _emscripten_glGetFramebufferAttachmentParameteriv,
  /** @export */ emscripten_glGetInteger64i_v: _emscripten_glGetInteger64i_v,
  /** @export */ emscripten_glGetInteger64v: _emscripten_glGetInteger64v,
  /** @export */ emscripten_glGetIntegeri_v: _emscripten_glGetIntegeri_v,
  /** @export */ emscripten_glGetIntegerv: _emscripten_glGetIntegerv,
  /** @export */ emscripten_glGetInternalformativ: _emscripten_glGetInternalformativ,
  /** @export */ emscripten_glGetProgramBinary: _emscripten_glGetProgramBinary,
  /** @export */ emscripten_glGetProgramInfoLog: _emscripten_glGetProgramInfoLog,
  /** @export */ emscripten_glGetProgramiv: _emscripten_glGetProgramiv,
  /** @export */ emscripten_glGetQueryObjecti64vEXT: _emscripten_glGetQueryObjecti64vEXT,
  /** @export */ emscripten_glGetQueryObjectivEXT: _emscripten_glGetQueryObjectivEXT,
  /** @export */ emscripten_glGetQueryObjectui64vEXT: _emscripten_glGetQueryObjectui64vEXT,
  /** @export */ emscripten_glGetQueryObjectuiv: _emscripten_glGetQueryObjectuiv,
  /** @export */ emscripten_glGetQueryObjectuivEXT: _emscripten_glGetQueryObjectuivEXT,
  /** @export */ emscripten_glGetQueryiv: _emscripten_glGetQueryiv,
  /** @export */ emscripten_glGetQueryivEXT: _emscripten_glGetQueryivEXT,
  /** @export */ emscripten_glGetRenderbufferParameteriv: _emscripten_glGetRenderbufferParameteriv,
  /** @export */ emscripten_glGetSamplerParameterfv: _emscripten_glGetSamplerParameterfv,
  /** @export */ emscripten_glGetSamplerParameteriv: _emscripten_glGetSamplerParameteriv,
  /** @export */ emscripten_glGetShaderInfoLog: _emscripten_glGetShaderInfoLog,
  /** @export */ emscripten_glGetShaderPrecisionFormat: _emscripten_glGetShaderPrecisionFormat,
  /** @export */ emscripten_glGetShaderSource: _emscripten_glGetShaderSource,
  /** @export */ emscripten_glGetShaderiv: _emscripten_glGetShaderiv,
  /** @export */ emscripten_glGetString: _emscripten_glGetString,
  /** @export */ emscripten_glGetStringi: _emscripten_glGetStringi,
  /** @export */ emscripten_glGetSynciv: _emscripten_glGetSynciv,
  /** @export */ emscripten_glGetTexParameterfv: _emscripten_glGetTexParameterfv,
  /** @export */ emscripten_glGetTexParameteriv: _emscripten_glGetTexParameteriv,
  /** @export */ emscripten_glGetTransformFeedbackVarying: _emscripten_glGetTransformFeedbackVarying,
  /** @export */ emscripten_glGetUniformBlockIndex: _emscripten_glGetUniformBlockIndex,
  /** @export */ emscripten_glGetUniformIndices: _emscripten_glGetUniformIndices,
  /** @export */ emscripten_glGetUniformLocation: _emscripten_glGetUniformLocation,
  /** @export */ emscripten_glGetUniformfv: _emscripten_glGetUniformfv,
  /** @export */ emscripten_glGetUniformiv: _emscripten_glGetUniformiv,
  /** @export */ emscripten_glGetUniformuiv: _emscripten_glGetUniformuiv,
  /** @export */ emscripten_glGetVertexAttribIiv: _emscripten_glGetVertexAttribIiv,
  /** @export */ emscripten_glGetVertexAttribIuiv: _emscripten_glGetVertexAttribIuiv,
  /** @export */ emscripten_glGetVertexAttribPointerv: _emscripten_glGetVertexAttribPointerv,
  /** @export */ emscripten_glGetVertexAttribfv: _emscripten_glGetVertexAttribfv,
  /** @export */ emscripten_glGetVertexAttribiv: _emscripten_glGetVertexAttribiv,
  /** @export */ emscripten_glHint: _emscripten_glHint,
  /** @export */ emscripten_glInvalidateFramebuffer: _emscripten_glInvalidateFramebuffer,
  /** @export */ emscripten_glInvalidateSubFramebuffer: _emscripten_glInvalidateSubFramebuffer,
  /** @export */ emscripten_glIsBuffer: _emscripten_glIsBuffer,
  /** @export */ emscripten_glIsEnabled: _emscripten_glIsEnabled,
  /** @export */ emscripten_glIsFramebuffer: _emscripten_glIsFramebuffer,
  /** @export */ emscripten_glIsProgram: _emscripten_glIsProgram,
  /** @export */ emscripten_glIsQuery: _emscripten_glIsQuery,
  /** @export */ emscripten_glIsQueryEXT: _emscripten_glIsQueryEXT,
  /** @export */ emscripten_glIsRenderbuffer: _emscripten_glIsRenderbuffer,
  /** @export */ emscripten_glIsSampler: _emscripten_glIsSampler,
  /** @export */ emscripten_glIsShader: _emscripten_glIsShader,
  /** @export */ emscripten_glIsSync: _emscripten_glIsSync,
  /** @export */ emscripten_glIsTexture: _emscripten_glIsTexture,
  /** @export */ emscripten_glIsTransformFeedback: _emscripten_glIsTransformFeedback,
  /** @export */ emscripten_glIsVertexArray: _emscripten_glIsVertexArray,
  /** @export */ emscripten_glIsVertexArrayOES: _emscripten_glIsVertexArrayOES,
  /** @export */ emscripten_glLineWidth: _emscripten_glLineWidth,
  /** @export */ emscripten_glLinkProgram: _emscripten_glLinkProgram,
  /** @export */ emscripten_glMapBufferRange: _emscripten_glMapBufferRange,
  /** @export */ emscripten_glPauseTransformFeedback: _emscripten_glPauseTransformFeedback,
  /** @export */ emscripten_glPixelStorei: _emscripten_glPixelStorei,
  /** @export */ emscripten_glPolygonModeWEBGL: _emscripten_glPolygonModeWEBGL,
  /** @export */ emscripten_glPolygonOffset: _emscripten_glPolygonOffset,
  /** @export */ emscripten_glPolygonOffsetClampEXT: _emscripten_glPolygonOffsetClampEXT,
  /** @export */ emscripten_glProgramBinary: _emscripten_glProgramBinary,
  /** @export */ emscripten_glProgramParameteri: _emscripten_glProgramParameteri,
  /** @export */ emscripten_glQueryCounterEXT: _emscripten_glQueryCounterEXT,
  /** @export */ emscripten_glReadBuffer: _emscripten_glReadBuffer,
  /** @export */ emscripten_glReadPixels: _emscripten_glReadPixels,
  /** @export */ emscripten_glReleaseShaderCompiler: _emscripten_glReleaseShaderCompiler,
  /** @export */ emscripten_glRenderbufferStorage: _emscripten_glRenderbufferStorage,
  /** @export */ emscripten_glRenderbufferStorageMultisample: _emscripten_glRenderbufferStorageMultisample,
  /** @export */ emscripten_glResumeTransformFeedback: _emscripten_glResumeTransformFeedback,
  /** @export */ emscripten_glSampleCoverage: _emscripten_glSampleCoverage,
  /** @export */ emscripten_glSamplerParameterf: _emscripten_glSamplerParameterf,
  /** @export */ emscripten_glSamplerParameterfv: _emscripten_glSamplerParameterfv,
  /** @export */ emscripten_glSamplerParameteri: _emscripten_glSamplerParameteri,
  /** @export */ emscripten_glSamplerParameteriv: _emscripten_glSamplerParameteriv,
  /** @export */ emscripten_glScissor: _emscripten_glScissor,
  /** @export */ emscripten_glShaderBinary: _emscripten_glShaderBinary,
  /** @export */ emscripten_glShaderSource: _emscripten_glShaderSource,
  /** @export */ emscripten_glStencilFunc: _emscripten_glStencilFunc,
  /** @export */ emscripten_glStencilFuncSeparate: _emscripten_glStencilFuncSeparate,
  /** @export */ emscripten_glStencilMask: _emscripten_glStencilMask,
  /** @export */ emscripten_glStencilMaskSeparate: _emscripten_glStencilMaskSeparate,
  /** @export */ emscripten_glStencilOp: _emscripten_glStencilOp,
  /** @export */ emscripten_glStencilOpSeparate: _emscripten_glStencilOpSeparate,
  /** @export */ emscripten_glTexImage2D: _emscripten_glTexImage2D,
  /** @export */ emscripten_glTexImage3D: _emscripten_glTexImage3D,
  /** @export */ emscripten_glTexParameterf: _emscripten_glTexParameterf,
  /** @export */ emscripten_glTexParameterfv: _emscripten_glTexParameterfv,
  /** @export */ emscripten_glTexParameteri: _emscripten_glTexParameteri,
  /** @export */ emscripten_glTexParameteriv: _emscripten_glTexParameteriv,
  /** @export */ emscripten_glTexStorage2D: _emscripten_glTexStorage2D,
  /** @export */ emscripten_glTexStorage3D: _emscripten_glTexStorage3D,
  /** @export */ emscripten_glTexSubImage2D: _emscripten_glTexSubImage2D,
  /** @export */ emscripten_glTexSubImage3D: _emscripten_glTexSubImage3D,
  /** @export */ emscripten_glTransformFeedbackVaryings: _emscripten_glTransformFeedbackVaryings,
  /** @export */ emscripten_glUniform1f: _emscripten_glUniform1f,
  /** @export */ emscripten_glUniform1fv: _emscripten_glUniform1fv,
  /** @export */ emscripten_glUniform1i: _emscripten_glUniform1i,
  /** @export */ emscripten_glUniform1iv: _emscripten_glUniform1iv,
  /** @export */ emscripten_glUniform1ui: _emscripten_glUniform1ui,
  /** @export */ emscripten_glUniform1uiv: _emscripten_glUniform1uiv,
  /** @export */ emscripten_glUniform2f: _emscripten_glUniform2f,
  /** @export */ emscripten_glUniform2fv: _emscripten_glUniform2fv,
  /** @export */ emscripten_glUniform2i: _emscripten_glUniform2i,
  /** @export */ emscripten_glUniform2iv: _emscripten_glUniform2iv,
  /** @export */ emscripten_glUniform2ui: _emscripten_glUniform2ui,
  /** @export */ emscripten_glUniform2uiv: _emscripten_glUniform2uiv,
  /** @export */ emscripten_glUniform3f: _emscripten_glUniform3f,
  /** @export */ emscripten_glUniform3fv: _emscripten_glUniform3fv,
  /** @export */ emscripten_glUniform3i: _emscripten_glUniform3i,
  /** @export */ emscripten_glUniform3iv: _emscripten_glUniform3iv,
  /** @export */ emscripten_glUniform3ui: _emscripten_glUniform3ui,
  /** @export */ emscripten_glUniform3uiv: _emscripten_glUniform3uiv,
  /** @export */ emscripten_glUniform4f: _emscripten_glUniform4f,
  /** @export */ emscripten_glUniform4fv: _emscripten_glUniform4fv,
  /** @export */ emscripten_glUniform4i: _emscripten_glUniform4i,
  /** @export */ emscripten_glUniform4iv: _emscripten_glUniform4iv,
  /** @export */ emscripten_glUniform4ui: _emscripten_glUniform4ui,
  /** @export */ emscripten_glUniform4uiv: _emscripten_glUniform4uiv,
  /** @export */ emscripten_glUniformBlockBinding: _emscripten_glUniformBlockBinding,
  /** @export */ emscripten_glUniformMatrix2fv: _emscripten_glUniformMatrix2fv,
  /** @export */ emscripten_glUniformMatrix2x3fv: _emscripten_glUniformMatrix2x3fv,
  /** @export */ emscripten_glUniformMatrix2x4fv: _emscripten_glUniformMatrix2x4fv,
  /** @export */ emscripten_glUniformMatrix3fv: _emscripten_glUniformMatrix3fv,
  /** @export */ emscripten_glUniformMatrix3x2fv: _emscripten_glUniformMatrix3x2fv,
  /** @export */ emscripten_glUniformMatrix3x4fv: _emscripten_glUniformMatrix3x4fv,
  /** @export */ emscripten_glUniformMatrix4fv: _emscripten_glUniformMatrix4fv,
  /** @export */ emscripten_glUniformMatrix4x2fv: _emscripten_glUniformMatrix4x2fv,
  /** @export */ emscripten_glUniformMatrix4x3fv: _emscripten_glUniformMatrix4x3fv,
  /** @export */ emscripten_glUnmapBuffer: _emscripten_glUnmapBuffer,
  /** @export */ emscripten_glUseProgram: _emscripten_glUseProgram,
  /** @export */ emscripten_glValidateProgram: _emscripten_glValidateProgram,
  /** @export */ emscripten_glVertexAttrib1f: _emscripten_glVertexAttrib1f,
  /** @export */ emscripten_glVertexAttrib1fv: _emscripten_glVertexAttrib1fv,
  /** @export */ emscripten_glVertexAttrib2f: _emscripten_glVertexAttrib2f,
  /** @export */ emscripten_glVertexAttrib2fv: _emscripten_glVertexAttrib2fv,
  /** @export */ emscripten_glVertexAttrib3f: _emscripten_glVertexAttrib3f,
  /** @export */ emscripten_glVertexAttrib3fv: _emscripten_glVertexAttrib3fv,
  /** @export */ emscripten_glVertexAttrib4f: _emscripten_glVertexAttrib4f,
  /** @export */ emscripten_glVertexAttrib4fv: _emscripten_glVertexAttrib4fv,
  /** @export */ emscripten_glVertexAttribDivisor: _emscripten_glVertexAttribDivisor,
  /** @export */ emscripten_glVertexAttribDivisorANGLE: _emscripten_glVertexAttribDivisorANGLE,
  /** @export */ emscripten_glVertexAttribDivisorARB: _emscripten_glVertexAttribDivisorARB,
  /** @export */ emscripten_glVertexAttribDivisorEXT: _emscripten_glVertexAttribDivisorEXT,
  /** @export */ emscripten_glVertexAttribDivisorNV: _emscripten_glVertexAttribDivisorNV,
  /** @export */ emscripten_glVertexAttribI4i: _emscripten_glVertexAttribI4i,
  /** @export */ emscripten_glVertexAttribI4iv: _emscripten_glVertexAttribI4iv,
  /** @export */ emscripten_glVertexAttribI4ui: _emscripten_glVertexAttribI4ui,
  /** @export */ emscripten_glVertexAttribI4uiv: _emscripten_glVertexAttribI4uiv,
  /** @export */ emscripten_glVertexAttribIPointer: _emscripten_glVertexAttribIPointer,
  /** @export */ emscripten_glVertexAttribPointer: _emscripten_glVertexAttribPointer,
  /** @export */ emscripten_glViewport: _emscripten_glViewport,
  /** @export */ emscripten_glWaitSync: _emscripten_glWaitSync,
  /** @export */ emscripten_has_asyncify: _emscripten_has_asyncify,
  /** @export */ emscripten_request_fullscreen_strategy: _emscripten_request_fullscreen_strategy,
  /** @export */ emscripten_request_pointerlock: _emscripten_request_pointerlock,
  /** @export */ emscripten_resize_heap: _emscripten_resize_heap,
  /** @export */ emscripten_sample_gamepad_data: _emscripten_sample_gamepad_data,
  /** @export */ emscripten_set_beforeunload_callback_on_thread: _emscripten_set_beforeunload_callback_on_thread,
  /** @export */ emscripten_set_blur_callback_on_thread: _emscripten_set_blur_callback_on_thread,
  /** @export */ emscripten_set_canvas_element_size: _emscripten_set_canvas_element_size,
  /** @export */ emscripten_set_element_css_size: _emscripten_set_element_css_size,
  /** @export */ emscripten_set_focus_callback_on_thread: _emscripten_set_focus_callback_on_thread,
  /** @export */ emscripten_set_fullscreenchange_callback_on_thread: _emscripten_set_fullscreenchange_callback_on_thread,
  /** @export */ emscripten_set_gamepadconnected_callback_on_thread: _emscripten_set_gamepadconnected_callback_on_thread,
  /** @export */ emscripten_set_gamepaddisconnected_callback_on_thread: _emscripten_set_gamepaddisconnected_callback_on_thread,
  /** @export */ emscripten_set_keydown_callback_on_thread: _emscripten_set_keydown_callback_on_thread,
  /** @export */ emscripten_set_keypress_callback_on_thread: _emscripten_set_keypress_callback_on_thread,
  /** @export */ emscripten_set_keyup_callback_on_thread: _emscripten_set_keyup_callback_on_thread,
  /** @export */ emscripten_set_main_loop_timing: _emscripten_set_main_loop_timing,
  /** @export */ emscripten_set_orientationchange_callback_on_thread: _emscripten_set_orientationchange_callback_on_thread,
  /** @export */ emscripten_set_pointerlockchange_callback_on_thread: _emscripten_set_pointerlockchange_callback_on_thread,
  /** @export */ emscripten_set_resize_callback_on_thread: _emscripten_set_resize_callback_on_thread,
  /** @export */ emscripten_set_visibilitychange_callback_on_thread: _emscripten_set_visibilitychange_callback_on_thread,
  /** @export */ emscripten_set_wheel_callback_on_thread: _emscripten_set_wheel_callback_on_thread,
  /** @export */ emscripten_set_window_title: _emscripten_set_window_title,
  /** @export */ emscripten_sleep: _emscripten_sleep,
  /** @export */ emscripten_webgl_create_context: _emscripten_webgl_create_context,
  /** @export */ emscripten_webgl_destroy_context: _emscripten_webgl_destroy_context,
  /** @export */ emscripten_webgl_enable_extension: _emscripten_webgl_enable_extension,
  /** @export */ emscripten_webgl_get_current_context: _emscripten_webgl_get_current_context,
  /** @export */ emscripten_webgl_make_context_current: _emscripten_webgl_make_context_current,
  /** @export */ environ_get: _environ_get,
  /** @export */ environ_sizes_get: _environ_sizes_get,
  /** @export */ fd_close: _fd_close,
  /** @export */ fd_read: _fd_read,
  /** @export */ fd_seek: _fd_seek,
  /** @export */ fd_write: _fd_write,
  /** @export */ glActiveTexture: _glActiveTexture,
  /** @export */ glAttachShader: _glAttachShader,
  /** @export */ glBeginQuery: _glBeginQuery,
  /** @export */ glBeginTransformFeedback: _glBeginTransformFeedback,
  /** @export */ glBindBuffer: _glBindBuffer,
  /** @export */ glBindBufferBase: _glBindBufferBase,
  /** @export */ glBindBufferRange: _glBindBufferRange,
  /** @export */ glBindFramebuffer: _glBindFramebuffer,
  /** @export */ glBindRenderbuffer: _glBindRenderbuffer,
  /** @export */ glBindSampler: _glBindSampler,
  /** @export */ glBindTexture: _glBindTexture,
  /** @export */ glBindVertexArray: _glBindVertexArray,
  /** @export */ glBlendColor: _glBlendColor,
  /** @export */ glBlendEquationSeparate: _glBlendEquationSeparate,
  /** @export */ glBlendFuncSeparate: _glBlendFuncSeparate,
  /** @export */ glBlitFramebuffer: _glBlitFramebuffer,
  /** @export */ glBufferData: _glBufferData,
  /** @export */ glBufferSubData: _glBufferSubData,
  /** @export */ glCheckFramebufferStatus: _glCheckFramebufferStatus,
  /** @export */ glClear: _glClear,
  /** @export */ glClearBufferfv: _glClearBufferfv,
  /** @export */ glClearBufferiv: _glClearBufferiv,
  /** @export */ glClearBufferuiv: _glClearBufferuiv,
  /** @export */ glClearColor: _glClearColor,
  /** @export */ glClearDepthf: _glClearDepthf,
  /** @export */ glClearStencil: _glClearStencil,
  /** @export */ glColorMask: _glColorMask,
  /** @export */ glCompileShader: _glCompileShader,
  /** @export */ glCompressedTexSubImage2D: _glCompressedTexSubImage2D,
  /** @export */ glCompressedTexSubImage3D: _glCompressedTexSubImage3D,
  /** @export */ glCopyBufferSubData: _glCopyBufferSubData,
  /** @export */ glCopyTexSubImage2D: _glCopyTexSubImage2D,
  /** @export */ glCopyTexSubImage3D: _glCopyTexSubImage3D,
  /** @export */ glCreateProgram: _glCreateProgram,
  /** @export */ glCreateShader: _glCreateShader,
  /** @export */ glCullFace: _glCullFace,
  /** @export */ glDeleteBuffers: _glDeleteBuffers,
  /** @export */ glDeleteFramebuffers: _glDeleteFramebuffers,
  /** @export */ glDeleteProgram: _glDeleteProgram,
  /** @export */ glDeleteQueries: _glDeleteQueries,
  /** @export */ glDeleteRenderbuffers: _glDeleteRenderbuffers,
  /** @export */ glDeleteSamplers: _glDeleteSamplers,
  /** @export */ glDeleteShader: _glDeleteShader,
  /** @export */ glDeleteSync: _glDeleteSync,
  /** @export */ glDeleteTextures: _glDeleteTextures,
  /** @export */ glDepthFunc: _glDepthFunc,
  /** @export */ glDepthMask: _glDepthMask,
  /** @export */ glDepthRangef: _glDepthRangef,
  /** @export */ glDisable: _glDisable,
  /** @export */ glDisableVertexAttribArray: _glDisableVertexAttribArray,
  /** @export */ glDrawArrays: _glDrawArrays,
  /** @export */ glDrawArraysInstanced: _glDrawArraysInstanced,
  /** @export */ glDrawBuffers: _glDrawBuffers,
  /** @export */ glDrawElements: _glDrawElements,
  /** @export */ glDrawElementsInstanced: _glDrawElementsInstanced,
  /** @export */ glEnable: _glEnable,
  /** @export */ glEnableVertexAttribArray: _glEnableVertexAttribArray,
  /** @export */ glEndQuery: _glEndQuery,
  /** @export */ glEndTransformFeedback: _glEndTransformFeedback,
  /** @export */ glFenceSync: _glFenceSync,
  /** @export */ glFinish: _glFinish,
  /** @export */ glFlush: _glFlush,
  /** @export */ glFramebufferRenderbuffer: _glFramebufferRenderbuffer,
  /** @export */ glFramebufferTexture2D: _glFramebufferTexture2D,
  /** @export */ glFramebufferTextureLayer: _glFramebufferTextureLayer,
  /** @export */ glFrontFace: _glFrontFace,
  /** @export */ glGenBuffers: _glGenBuffers,
  /** @export */ glGenFramebuffers: _glGenFramebuffers,
  /** @export */ glGenQueries: _glGenQueries,
  /** @export */ glGenRenderbuffers: _glGenRenderbuffers,
  /** @export */ glGenSamplers: _glGenSamplers,
  /** @export */ glGenTextures: _glGenTextures,
  /** @export */ glGenVertexArrays: _glGenVertexArrays,
  /** @export */ glGenerateMipmap: _glGenerateMipmap,
  /** @export */ glGetActiveAttrib: _glGetActiveAttrib,
  /** @export */ glGetAttribLocation: _glGetAttribLocation,
  /** @export */ glGetBufferSubData: _glGetBufferSubData,
  /** @export */ glGetError: _glGetError,
  /** @export */ glGetFramebufferAttachmentParameteriv: _glGetFramebufferAttachmentParameteriv,
  /** @export */ glGetIntegerv: _glGetIntegerv,
  /** @export */ glGetProgramInfoLog: _glGetProgramInfoLog,
  /** @export */ glGetProgramiv: _glGetProgramiv,
  /** @export */ glGetQueryObjectuiv: _glGetQueryObjectuiv,
  /** @export */ glGetSamplerParameteriv: _glGetSamplerParameteriv,
  /** @export */ glGetShaderInfoLog: _glGetShaderInfoLog,
  /** @export */ glGetShaderiv: _glGetShaderiv,
  /** @export */ glGetUniformBlockIndex: _glGetUniformBlockIndex,
  /** @export */ glGetUniformLocation: _glGetUniformLocation,
  /** @export */ glGetUniformfv: _glGetUniformfv,
  /** @export */ glLinkProgram: _glLinkProgram,
  /** @export */ glPixelStorei: _glPixelStorei,
  /** @export */ glPolygonOffset: _glPolygonOffset,
  /** @export */ glReadBuffer: _glReadBuffer,
  /** @export */ glReadPixels: _glReadPixels,
  /** @export */ glRenderbufferStorageMultisample: _glRenderbufferStorageMultisample,
  /** @export */ glSamplerParameterf: _glSamplerParameterf,
  /** @export */ glSamplerParameteri: _glSamplerParameteri,
  /** @export */ glScissor: _glScissor,
  /** @export */ glShaderSource: _glShaderSource,
  /** @export */ glStencilFuncSeparate: _glStencilFuncSeparate,
  /** @export */ glStencilMaskSeparate: _glStencilMaskSeparate,
  /** @export */ glStencilOpSeparate: _glStencilOpSeparate,
  /** @export */ glTexImage2D: _glTexImage2D,
  /** @export */ glTexParameteri: _glTexParameteri,
  /** @export */ glTexStorage2D: _glTexStorage2D,
  /** @export */ glTexStorage3D: _glTexStorage3D,
  /** @export */ glTexSubImage2D: _glTexSubImage2D,
  /** @export */ glTexSubImage3D: _glTexSubImage3D,
  /** @export */ glTransformFeedbackVaryings: _glTransformFeedbackVaryings,
  /** @export */ glUniform1f: _glUniform1f,
  /** @export */ glUniform1i: _glUniform1i,
  /** @export */ glUniform1ui: _glUniform1ui,
  /** @export */ glUniform2f: _glUniform2f,
  /** @export */ glUniform2i: _glUniform2i,
  /** @export */ glUniform2ui: _glUniform2ui,
  /** @export */ glUniform3iv: _glUniform3iv,
  /** @export */ glUniform3ui: _glUniform3ui,
  /** @export */ glUniform4fv: _glUniform4fv,
  /** @export */ glUniform4iv: _glUniform4iv,
  /** @export */ glUniform4ui: _glUniform4ui,
  /** @export */ glUniform4uiv: _glUniform4uiv,
  /** @export */ glUniformBlockBinding: _glUniformBlockBinding,
  /** @export */ glUseProgram: _glUseProgram,
  /** @export */ glVertexAttrib4f: _glVertexAttrib4f,
  /** @export */ glVertexAttribDivisor: _glVertexAttribDivisor,
  /** @export */ glVertexAttribI4i: _glVertexAttribI4i,
  /** @export */ glVertexAttribI4ui: _glVertexAttribI4ui,
  /** @export */ glVertexAttribIPointer: _glVertexAttribIPointer,
  /** @export */ glVertexAttribPointer: _glVertexAttribPointer,
  /** @export */ glViewport: _glViewport,
  /** @export */ random_get: _random_get,
  /** @export */ rxc_js_audio_init: _rxc_js_audio_init,
  /** @export */ rxc_js_audio_submit: _rxc_js_audio_submit,
  /** @export */ rxc_js_canvas_note: _rxc_js_canvas_note,
  /** @export */ rxc_js_canvas_size: _rxc_js_canvas_size,
  /** @export */ rxc_js_cursor: _rxc_js_cursor,
  /** @export */ rxc_js_external_url: _rxc_js_external_url,
  /** @export */ rxc_js_file_close: _rxc_js_file_close,
  /** @export */ rxc_js_file_flush: _rxc_js_file_flush,
  /** @export */ rxc_js_file_list: _rxc_js_file_list,
  /** @export */ rxc_js_file_mkdir: _rxc_js_file_mkdir,
  /** @export */ rxc_js_file_open: _rxc_js_file_open,
  /** @export */ rxc_js_file_read: _rxc_js_file_read,
  /** @export */ rxc_js_file_read_nb: _rxc_js_file_read_nb,
  /** @export */ rxc_js_file_rename: _rxc_js_file_rename,
  /** @export */ rxc_js_file_stat: _rxc_js_file_stat,
  /** @export */ rxc_js_file_truncate: _rxc_js_file_truncate,
  /** @export */ rxc_js_file_unlink: _rxc_js_file_unlink,
  /** @export */ rxc_js_file_write: _rxc_js_file_write,
  /** @export */ rxc_js_frame_due: _rxc_js_frame_due,
  /** @export */ rxc_js_gamepad: _rxc_js_gamepad,
  /** @export */ rxc_js_gfx_fif: _rxc_js_gfx_fif,
  /** @export */ rxc_js_gfx_mode: _rxc_js_gfx_mode,
  /** @export */ rxc_js_gfx_submit: _rxc_js_gfx_submit,
  /** @export */ rxc_js_gfx_submit_tail: _rxc_js_gfx_submit_tail,
  /** @export */ rxc_js_gfx_wait: _rxc_js_gfx_wait,
  /** @export */ rxc_js_load_image: _rxc_js_load_image,
  /** @export */ rxc_js_lock: _rxc_js_lock,
  /** @export */ rxc_js_log: _rxc_js_log,
  /** @export */ rxc_js_mf_audio: _rxc_js_mf_audio,
  /** @export */ rxc_js_mf_audio_rate: _rxc_js_mf_audio_rate,
  /** @export */ rxc_js_mf_control: _rxc_js_mf_control,
  /** @export */ rxc_js_mf_frame: _rxc_js_mf_frame,
  /** @export */ rxc_js_mf_open: _rxc_js_mf_open,
  /** @export */ rxc_js_mf_time: _rxc_js_mf_time,
  /** @export */ rxc_js_note_program: _rxc_js_note_program,
  /** @export */ rxc_js_now: _rxc_js_now,
  /** @export */ rxc_js_prelink: _rxc_js_prelink,
  /** @export */ rxc_js_present: _rxc_js_present,
  /** @export */ rxc_js_relay_open: _rxc_js_relay_open,
  /** @export */ rxc_js_relay_recv: _rxc_js_relay_recv,
  /** @export */ rxc_js_relay_send: _rxc_js_relay_send,
  /** @export */ rxc_js_relay_state: _rxc_js_relay_state,
  /** @export */ rxc_js_set_title: _rxc_js_set_title,
  /** @export */ rxc_js_sleep: _rxc_js_sleep,
  /** @export */ rxc_js_stack: _rxc_js_stack,
  /** @export */ rxc_js_status: _rxc_js_status,
  /** @export */ rxc_js_thread_switch: _rxc_js_thread_switch,
  /** @export */ rxc_js_turn_age: _rxc_js_turn_age,
  /** @export */ rxc_js_upload: _rxc_js_upload,
  /** @export */ rxc_js_vnet_begin: _rxc_js_vnet_begin,
  /** @export */ rxc_js_vnet_poll: _rxc_js_vnet_poll,
  /** @export */ rxc_js_yield: _rxc_js_yield
};

// Argument name here must shadow the `wasmExports` global so
// that it is recognised by metadce and minify-import-export-names
// passes.
function applySignatureConversions(wasmExports) {
  // First, make a copy of the incoming exports object
  wasmExports = Object.assign({}, wasmExports);
  var makeWrapper_pp = f => a0 => f(a0) >>> 0;
  var makeWrapper_p = f => () => f() >>> 0;
  wasmExports["malloc"] = makeWrapper_pp(wasmExports["malloc"]);
  wasmExports["emscripten_stack_get_current"] = makeWrapper_p(wasmExports["emscripten_stack_get_current"]);
  wasmExports["_emscripten_stack_alloc"] = makeWrapper_pp(wasmExports["_emscripten_stack_alloc"]);
  return wasmExports;
}

// include: postamble.js
// === Auto-generated postamble setup entry stuff ===
async function callMain(args = []) {
  var entryFunction = _main;
  args.unshift(thisProgram);
  var argc = args.length;
  var argv = stackAlloc((argc + 1) * 4);
  var argv_ptr = argv;
  for (var arg of args) {
    HEAPU32[((argv_ptr) >>> 2) >>> 0] = stringToUTF8OnStack(arg);
    argv_ptr += 4;
  }
  HEAPU32[((argv_ptr) >>> 2) >>> 0] = 0;
  try {
    var ret = entryFunction(argc, argv);
    // The current spec of JSPI returns a promise only if the function suspends
    // and a plain value otherwise. This will likely change:
    // https://github.com/WebAssembly/js-promise-integration/issues/11
    ret = await ret;
    // if we're not running an evented main loop, it's time to exit
    exitJS(ret, /* implicit = */ true);
    return ret;
  } catch (e) {
    return handleException(e);
  }
}

function run(args = arguments_) {
  if (runDependencies > 0) {
    dependenciesFulfilled = run;
    return;
  }
  preRun();
  // a preRun added a dependency, run will be called later
  if (runDependencies > 0) {
    dependenciesFulfilled = run;
    return;
  }
  async function doRun() {
    // run may have just been called through dependencies being fulfilled just in this very frame,
    // or while the async setStatus time below was happening
    Module["calledRun"] = true;
    if (ABORT) return;
    initRuntime();
    preMain();
    readyPromiseResolve?.(Module);
    Module["onRuntimeInitialized"]?.();
    var noInitialRun = Module["noInitialRun"] || false;
    if (!noInitialRun) await callMain(args);
    postRun();
  }
  if (Module["setStatus"]) {
    Module["setStatus"]("Running...");
    setTimeout(() => {
      setTimeout(() => Module["setStatus"](""), 1);
      doRun();
    }, 1);
  } else {
    doRun();
  }
}

var wasmExports;

// In modularize mode the generated code is within a factory function so we
// can use await here (since it's not top-level-await).
wasmExports = await (createWasm());

run();

// end include: postamble.js
// include: postamble_modularize.js
// In MODULARIZE mode we wrap the generated code in a factory function
// and return either the Module itself, or a promise of the module.
// We assign to the `moduleRtn` global here and configure closure to see
// this as an extern so it won't get minified.
if (runtimeInitialized) {
  moduleRtn = Module;
} else {
  // Set up the promise that indicates the Module is initialized
  moduleRtn = new Promise((resolve, reject) => {
    readyPromiseResolve = resolve;
    readyPromiseReject = reject;
  });
}


    return moduleRtn;
  };
})();

// Export using a UMD style export, or ES6 exports if selected
if (typeof exports === 'object' && typeof module === 'object') {
  module.exports = Rexcomp;
  // This default export looks redundant, but it allows TS to import this
  // commonjs style module.
  module.exports.default = Rexcomp;
} else if (typeof define === 'function' && define['amd'])
  define([], () => Rexcomp);

