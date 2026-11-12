// This code implements the `-sMODULARIZE` settings by taking the generated
// JS program code (INNER_JS_CODE) and wrapping it in a factory function.

// Single threaded MINIMAL_RUNTIME programs do not need access to
// document.currentScript, so a simple export declaration is enough.
var Cof = (() => {
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
// NOTE: This is also used as the process return code code in shell environments
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
var /** @type {!Int8Array} */ HEAP8, /** @type {!Uint8Array} */ HEAPU8, /** @type {!Int16Array} */ HEAP16, /** @type {!Uint16Array} */ HEAPU16, /** @type {!Int32Array} */ HEAP32, /** @type {!Uint32Array} */ HEAPU32, /** @type {!Float32Array} */ HEAPF32, /** @type {!Float64Array} */ HEAPF64;

// BigInt64Array type is not correctly defined in closure
var /** not-@type {!BigInt64Array} */ HEAP64, /* BigUint64Array type is not correctly defined in closure
/** not-@type {!BigUint64Array} */ HEAPU64;

var runtimeInitialized = false;

function updateMemoryViews() {
  var b = wasmMemory.buffer;
  HEAP8 = new Int8Array(b);
  HEAP16 = new Int16Array(b);
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

/** @param {string|number=} what */ function abort(what) {
  Module["onAbort"]?.(what);
  what = "Aborted(" + what + ")";
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
  /** @suppress {checkTypes} */ var e = new WebAssembly.RuntimeError(what);
  readyPromiseReject?.(e);
  // Throw the error whether or not MODULARIZE is set because abort is used
  // in code paths apart from instantiation where an exception is expected
  // to be thrown when abort is called.
  throw e;
}

var wasmBinaryFile;

function findWasmBinary() {
  return locateFile("cof.wasm");
}

function getBinarySync(file) {
  if (file == wasmBinaryFile && wasmBinary) {
    return new Uint8Array(wasmBinary);
  }
  if (readBinary) {
    return readBinary(file);
  }
  // Throwing a plain string here, even though it not normally adviables since
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
  if (!binary) {
    try {
      var response = fetch(binaryFile, {
        credentials: "same-origin"
      });
      var instantiationResult = await WebAssembly.instantiateStreaming(response, imports);
      return instantiationResult;
    } catch (reason) {
      // We expect the most common failure cause to be a bad MIME type for the binary,
      // in which case falling back to ArrayBuffer instantiation should work.
      err(`wasm streaming compile failed: ${reason}`);
      err("falling back to ArrayBuffer instantiation");
    }
  }
  return instantiateArrayBuffer(binaryFile, imports);
}

function getWasmImports() {
  // instrumenting imports is used in asyncify in two ways: to add assertions
  // that check for proper import use, and for ASYNCIFY=2 we use them to set up
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

var initRandomFill = () => view => crypto.getRandomValues(view);

var randomFill = view => {
  // Lazily init on the first invocation.
  (randomFill = initRandomFill())(view);
};

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
      // no supported
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
      node.usedBytes = 0;
      // The actual number of bytes used in the typed array, as opposed to contents.length which gives the whole capacity.
      // When the byte data of the file is populated, this will point to either a typed array, or a normal JS array. Typed arrays are preferred
      // for performance, and used by default. However, typed arrays are not resizable like normal JS arrays are, so there is a small disk size
      // penalty involved for appending file writes that continuously grow a file similar to std::vector capacity vs used -scheme.
      node.contents = null;
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
    if (!node.contents) return new Uint8Array(0);
    if (node.contents.subarray) return node.contents.subarray(0, node.usedBytes);
    // Make sure to not return excess unused bytes.
    return new Uint8Array(node.contents);
  },
  expandFileStorage(node, newCapacity) {
    var prevCapacity = node.contents ? node.contents.length : 0;
    if (prevCapacity >= newCapacity) return;
    // No need to expand, the storage was already large enough.
    // Don't expand strictly to the given requested limit if it's only a very small increase, but instead geometrically grow capacity.
    // For small filesizes (<1MB), perform size*2 geometric increase, but for large sizes, do a much more conservative size*1.125 increase to
    // avoid overshooting the allocation cap by a very large margin.
    var CAPACITY_DOUBLING_MAX = 1024 * 1024;
    newCapacity = Math.max(newCapacity, (prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2 : 1.125)) >>> 0);
    if (prevCapacity != 0) newCapacity = Math.max(newCapacity, 256);
    // At minimum allocate 256b for each file when expanding.
    var oldContents = node.contents;
    node.contents = new Uint8Array(newCapacity);
    // Allocate new storage.
    if (node.usedBytes > 0) node.contents.set(oldContents.subarray(0, node.usedBytes), 0);
  },
  resizeFileStorage(node, newSize) {
    if (node.usedBytes == newSize) return;
    if (newSize == 0) {
      node.contents = null;
      // Fully decommit when requesting a resize to zero.
      node.usedBytes = 0;
    } else {
      var oldContents = node.contents;
      node.contents = new Uint8Array(newSize);
      // Allocate new storage.
      if (oldContents) {
        node.contents.set(oldContents.subarray(0, Math.min(newSize, node.usedBytes)));
      }
      node.usedBytes = newSize;
    }
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
      if (size > 8 && contents.subarray) {
        // non-trivial, and typed array
        buffer.set(contents.subarray(position, position + size), offset);
      } else {
        for (var i = 0; i < size; i++) buffer[offset + i] = contents[position + i];
      }
      return size;
    },
    write(stream, buffer, offset, length, position, canOwn) {
      // If the buffer is located in main memory (HEAP), and if
      // memory can grow, we can't hold on to references of the
      // memory buffer, as they may get invalidated. That means we
      // need to do copy its contents.
      if (buffer.buffer === HEAP8.buffer) {
        canOwn = false;
      }
      if (!length) return 0;
      var node = stream.node;
      node.mtime = node.ctime = Date.now();
      if (buffer.subarray && (!node.contents || node.contents.subarray)) {
        // This write is from a typed array to a typed array?
        if (canOwn) {
          node.contents = buffer.subarray(offset, offset + length);
          node.usedBytes = length;
          return length;
        } else if (node.usedBytes === 0 && position === 0) {
          // If this is a simple first write to an empty file, do a fast set since we don't need to care about old data.
          node.contents = buffer.slice(offset, offset + length);
          node.usedBytes = length;
          return length;
        } else if (position + length <= node.usedBytes) {
          // Writing to an already allocated and used subrange of the file?
          node.contents.set(buffer.subarray(offset, offset + length), position);
          return length;
        }
      }
      // Appending to an existing file and we need to reallocate, or source data did not come as a typed array.
      MEMFS.expandFileStorage(node, position + length);
      if (node.contents.subarray && buffer.subarray) {
        // Use typed array write which is available.
        node.contents.set(buffer.subarray(offset, offset + length), position);
      } else {
        for (var i = 0; i < length; i++) {
          node.contents[position + i] = buffer[offset + i];
        }
      }
      node.usedBytes = Math.max(node.usedBytes, position + length);
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
      if (!(flags & 2) && contents && contents.buffer === HEAP8.buffer) {
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
  // In no plugin handled this file then return the original/unmodified
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
  readFiles: {},
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
    // limit max consecutive symlinks to 40 (SYMLOOP_MAX).
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
    } else if (perms.includes("w") && !(node.mode & 146)) {
      return 2;
    } else if (perms.includes("x") && !(node.mode & 73)) {
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
    } else {
      if (FS.isDir(node.mode)) {
        return 31;
      }
    }
    return 0;
  },
  mayOpen(node, flags) {
    if (!node) {
      return 44;
    }
    if (FS.isLink(node.mode)) {
      return 32;
    } else if (FS.isDir(node.mode)) {
      if (FS.flagsToPermissionString(flags) !== "r" || (flags & (512 | 64))) {
        // TODO: check for O_SEARCH? (== search for dir only)
        return 31;
      }
    }
    return FS.nodePermissions(node, FS.flagsToPermissionString(flags));
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
    setattr(arg, attr);
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
    flags = typeof flags == "string" ? FS_modeStringToFlags(flags) : flags;
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
        // file below. We use chmod below the apply the permissions once the
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
    if (Module["logReadFiles"] && !(flags & 1)) {
      if (!(path in FS.readFiles)) {
        FS.readFiles[path] = 1;
      }
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
    if (typeof data == "string") {
      data = new Uint8Array(intArrayFromString(data, true));
    }
    if (ArrayBuffer.isView(data)) {
      FS.write(stream, data, 0, data.byteLength, undefined, opts.canOwn);
    } else {
      abort("Unsupported data type");
    }
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
      if (typeof data == "string") {
        var arr = new Array(data.length);
        for (var i = 0, len = data.length; i < len; ++i) arr[i] = data.charCodeAt(i);
        data = arr;
      }
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

var SYSCALLS = {
  DEFAULT_POLLMASK: 5,
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

var INT53_MAX = 9007199254740992;

var INT53_MIN = -9007199254740992;

var bigintToI53Checked = num => (num < INT53_MIN || num > INT53_MAX) ? NaN : Number(num);

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
        stream.flags |= arg;
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

function ___syscall_openat(dirfd, path, flags, varargs) {
  path >>>= 0;
  varargs >>>= 0;
  SYSCALLS.varargs = varargs;
  try {
    path = SYSCALLS.getStr(path);
    path = SYSCALLS.calculateAt(dirfd, path);
    var mode = varargs ? syscallGetVarargI() : 0;
    return FS.open(path, flags, mode).fd;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

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

var isLeapYear = year => year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);

var MONTH_DAYS_LEAP_CUMULATIVE = [ 0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335 ];

var MONTH_DAYS_REGULAR_CUMULATIVE = [ 0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334 ];

var ydayFromDate = date => {
  var leap = isLeapYear(date.getFullYear());
  var monthDaysCumulative = (leap ? MONTH_DAYS_LEAP_CUMULATIVE : MONTH_DAYS_REGULAR_CUMULATIVE);
  var yday = monthDaysCumulative[date.getMonth()] + date.getDate() - 1;
  // -1 since it's days since Jan 1
  return yday;
};

function __localtime_js(time, tmPtr) {
  time = bigintToI53Checked(time);
  tmPtr >>>= 0;
  var date = new Date(time * 1e3);
  HEAP32[((tmPtr) >>> 2) >>> 0] = date.getSeconds();
  HEAP32[(((tmPtr) + (4)) >>> 2) >>> 0] = date.getMinutes();
  HEAP32[(((tmPtr) + (8)) >>> 2) >>> 0] = date.getHours();
  HEAP32[(((tmPtr) + (12)) >>> 2) >>> 0] = date.getDate();
  HEAP32[(((tmPtr) + (16)) >>> 2) >>> 0] = date.getMonth();
  HEAP32[(((tmPtr) + (20)) >>> 2) >>> 0] = date.getFullYear() - 1900;
  HEAP32[(((tmPtr) + (24)) >>> 2) >>> 0] = date.getDay();
  var yday = ydayFromDate(date) | 0;
  HEAP32[(((tmPtr) + (28)) >>> 2) >>> 0] = yday;
  HEAP32[(((tmPtr) + (36)) >>> 2) >>> 0] = -(date.getTimezoneOffset() * 60);
  // Attention: DST is in December in South, and some regions don't have DST at all.
  var start = new Date(date.getFullYear(), 0, 1);
  var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
  var winterOffset = start.getTimezoneOffset();
  var dst = (summerOffset != winterOffset && date.getTimezoneOffset() == Math.min(winterOffset, summerOffset)) | 0;
  HEAP32[(((tmPtr) + (32)) >>> 2) >>> 0] = dst;
}

var __timegm_js = function(tmPtr) {
  tmPtr >>>= 0;
  var ret = (() => {
    var time = Date.UTC(HEAP32[(((tmPtr) + (20)) >>> 2) >>> 0] + 1900, HEAP32[(((tmPtr) + (16)) >>> 2) >>> 0], HEAP32[(((tmPtr) + (12)) >>> 2) >>> 0], HEAP32[(((tmPtr) + (8)) >>> 2) >>> 0], HEAP32[(((tmPtr) + (4)) >>> 2) >>> 0], HEAP32[((tmPtr) >>> 2) >>> 0], 0);
    var date = new Date(time);
    HEAP32[(((tmPtr) + (24)) >>> 2) >>> 0] = date.getUTCDay();
    var start = Date.UTC(date.getUTCFullYear(), 0, 1, 0, 0, 0, 0);
    var yday = ((date.getTime() - start) / (1e3 * 60 * 60 * 24)) | 0;
    HEAP32[(((tmPtr) + (28)) >>> 2) >>> 0] = yday;
    return date.getTime() / 1e3;
  })();
  return BigInt(ret);
};

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

var COFAttribStack = {
  frames: [],
  clone: function(v) {
    return Array.isArray(v) ? v.map(COFAttribStack.clone) : ArrayBuffer.isView(v) ? new v.constructor(v) : v;
  },
  fields: function(names) {
    var out = {};
    for (var name of names) out[name] = COFAttribStack.clone(GLEmulation[name]);
    return out;
  },
  restoreFields: function(fields) {
    if (fields) for (var name in fields) GLEmulation[name] = fields[name];
  },
  fog: [ "fogStart", "fogEnd", "fogDensity", "fogColor", "fogMode", "fogEnabled" ],
  lighting: [ "lightingEnabled", "lightModelAmbient", "lightModelLocalViewer", "lightModelTwoSide", "materialAmbient", "materialDiffuse", "materialSpecular", "materialShininess", "materialEmission", "lightEnabled", "lightAmbient", "lightDiffuse", "lightSpecular", "lightPosition" ],
  enables: [ "fogEnabled", "lightingEnabled", "alphaTestEnabled", "clipPlaneEnabled", "lightEnabled" ],
  caps: [ [ 2884, 8 ], [ 3042, 16384 ], [ 3024, 16384 ], [ 2960, 1024 ], [ 2929, 256 ], [ 3089, 524288 ], [ 32823, 8 ], [ 32926, 536870912 ], [ 32928, 536870912 ] ],
  parameters: [ 10240, 10241, 10242, 10243, 32882, 33082, 33083, 33084, 33085, 34892, 34893 ]
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

var maybeExit = () => {
  if (!keepRuntimeAlive()) {
    try {
      _exit(EXITSTATUS);
    } catch (e) {
      handleException(e);
    }
  }
};

var callUserCallback = func => {
  if (ABORT) {
    return;
  }
  try {
    func();
    maybeExit();
  } catch (e) {
    handleException(e);
  }
};

function getFullscreenElement() {
  return document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.webkitCurrentFullScreenElement || document.msFullscreenElement;
}

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
    imagePlugin["canHandle"] = function imagePlugin_canHandle(name) {
      return !Module["noImageDecoding"] && /\.(jpg|jpeg|png|bmp|webp)$/i.test(name);
    };
    imagePlugin["handle"] = async function imagePlugin_handle(byteArray, name) {
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
    audioPlugin["canHandle"] = function audioPlugin_canHandle(name) {
      return !Module["noAudioDecoding"] && name.slice(-4) in {
        ".ogg": 1,
        ".wav": 1,
        ".mp3": 1
      };
    };
    audioPlugin["handle"] = async function audioPlugin_handle(byteArray, name) {
      return new Promise((resolve, reject) => {
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
        audio.onerror = function audio_onerror(event) {
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
    };
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
    // Neither .scrollX or .pageXOffset are defined in a spec, but
    // we prefer .scrollX because it is currently in a spec draft.
    // (see: http://www.w3.org/TR/2013/WD-cssom-view-20131217/)
    var scrollX = ((typeof window.scrollX != "undefined") ? window.scrollX : window.pageXOffset);
    var scrollY = ((typeof window.scrollY != "undefined") ? window.scrollY : window.pageYOffset);
    var adjustedX = pageX - (scrollX + rect.left);
    var adjustedY = pageY - (scrollY + rect.top);
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
    // Let's see if we need to enable the standard derivatives extension
    var type = GLctx.getShaderParameter(GL.shaders[shader], 35663);
    if (type == 35632) {
      if (GLEmulation.findToken(source, "dFdx") || GLEmulation.findToken(source, "dFdy") || GLEmulation.findToken(source, "fwidth")) {
        source = "#extension GL_OES_standard_derivatives : enable\n" + source;
        var extension = GLctx.getExtension("OES_standard_derivatives");
      }
    }
    return source;
  },
  createContext: (/** @type {HTMLCanvasElement} */ canvas, webGLContextAttributes) => {
    // In proxied operation mode, rAF()/setTimeout() functions do not delimit
    // frame boundaries, so can't have WebGL implementation try to detect when
    // it's ok to discard contents of the rendered backbuffer.
    if (webGLContextAttributes.renderViaOffscreenBackBuffer) webGLContextAttributes["preserveDrawingBuffer"] = true;
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
  enableOffscreenFramebufferAttributes: webGLContextAttributes => {
    webGLContextAttributes.renderViaOffscreenBackBuffer = true;
    webGLContextAttributes.preserveDrawingBuffer = true;
  },
  createOffscreenFramebuffer: context => {
    var gl = context.GLctx;
    // Create FBO
    var fbo = gl.createFramebuffer();
    gl.bindFramebuffer(36160, fbo);
    context.defaultFbo = fbo;
    context.defaultFboForbidBlitFramebuffer = false;
    if (gl.getContextAttributes().antialias) {
      context.defaultFboForbidBlitFramebuffer = true;
    }
    // Create render targets to the FBO
    context.defaultColorTarget = gl.createTexture();
    context.defaultDepthTarget = gl.createRenderbuffer();
    // Size them up correctly (use the same mechanism when resizing on demand)
    GL.resizeOffscreenFramebuffer(context);
    gl.bindTexture(3553, context.defaultColorTarget);
    gl.texParameteri(3553, 10241, 9728);
    gl.texParameteri(3553, 10240, 9728);
    gl.texParameteri(3553, 10242, 33071);
    gl.texParameteri(3553, 10243, 33071);
    gl.texImage2D(3553, 0, 6408, gl.canvas.width, gl.canvas.height, 0, 6408, 5121, null);
    gl.framebufferTexture2D(36160, 36064, 3553, context.defaultColorTarget, 0);
    gl.bindTexture(3553, null);
    // Create depth render target to the FBO
    var depthTarget = gl.createRenderbuffer();
    gl.bindRenderbuffer(36161, context.defaultDepthTarget);
    gl.renderbufferStorage(36161, 33189, gl.canvas.width, gl.canvas.height);
    gl.framebufferRenderbuffer(36160, 36096, 36161, context.defaultDepthTarget);
    gl.bindRenderbuffer(36161, null);
    // Create blitter
    var vertices = [ -1, -1, -1, 1, 1, -1, 1, 1 ];
    var vb = gl.createBuffer();
    gl.bindBuffer(34962, vb);
    gl.bufferData(34962, new Float32Array(vertices), 35044);
    gl.bindBuffer(34962, null);
    context.blitVB = vb;
    var vsCode = "attribute vec2 pos;" + "varying lowp vec2 tex;" + "void main() { tex = pos * 0.5 + vec2(0.5,0.5); gl_Position = vec4(pos, 0.0, 1.0); }";
    var vs = gl.createShader(35633);
    gl.shaderSource(vs, vsCode);
    gl.compileShader(vs);
    var fsCode = "varying lowp vec2 tex;" + "uniform sampler2D sampler;" + "void main() { gl_FragColor = texture2D(sampler, tex); }";
    var fs = gl.createShader(35632);
    gl.shaderSource(fs, fsCode);
    gl.compileShader(fs);
    var blitProgram = gl.createProgram();
    gl.attachShader(blitProgram, vs);
    gl.attachShader(blitProgram, fs);
    gl.linkProgram(blitProgram);
    context.blitProgram = blitProgram;
    context.blitPosLoc = gl.getAttribLocation(blitProgram, "pos");
    gl.useProgram(blitProgram);
    gl.uniform1i(gl.getUniformLocation(blitProgram, "sampler"), 0);
    gl.useProgram(null);
    if (gl.createVertexArray) {
      context.defaultVao = gl.createVertexArray();
      gl.bindVertexArray(context.defaultVao);
      gl.enableVertexAttribArray(context.blitPosLoc);
      gl.bindVertexArray(null);
    }
  },
  resizeOffscreenFramebuffer: context => {
    var gl = context.GLctx;
    // Resize color buffer
    if (context.defaultColorTarget) {
      var prevTextureBinding = gl.getParameter(32873);
      gl.bindTexture(3553, context.defaultColorTarget);
      gl.texImage2D(3553, 0, 6408, gl.drawingBufferWidth, gl.drawingBufferHeight, 0, 6408, 5121, null);
      gl.bindTexture(3553, prevTextureBinding);
    }
    // Resize depth buffer
    if (context.defaultDepthTarget) {
      var prevRenderBufferBinding = gl.getParameter(36007);
      gl.bindRenderbuffer(36161, context.defaultDepthTarget);
      gl.renderbufferStorage(36161, 33189, gl.drawingBufferWidth, gl.drawingBufferHeight);
      // TODO: Read context creation parameters for what type of depth and stencil to use
      gl.bindRenderbuffer(36161, prevRenderBufferBinding);
    }
  },
  blitOffscreenFramebuffer: context => {
    var gl = context.GLctx;
    var prevScissorTest = gl.getParameter(3089);
    if (prevScissorTest) gl.disable(3089);
    var prevFbo = gl.getParameter(36006);
    if (gl.blitFramebuffer && !context.defaultFboForbidBlitFramebuffer) {
      gl.bindFramebuffer(36008, context.defaultFbo);
      gl.bindFramebuffer(36009, null);
      gl.blitFramebuffer(0, 0, gl.canvas.width, gl.canvas.height, 0, 0, gl.canvas.width, gl.canvas.height, 16384, 9728);
    } else {
      gl.bindFramebuffer(36160, null);
      var prevProgram = gl.getParameter(35725);
      gl.useProgram(context.blitProgram);
      // If prevProgram was already marked for deletion, then, since it was
      // still bound, it was not *actually* deleted. Binding a new program
      // just now, thus, deleted the old one. This makes it impossible to
      // restore. Hopefully the application didn't actually need it!
      if (!gl.isProgram(prevProgram)) prevProgram = null;
      var prevVB = gl.getParameter(34964);
      gl.bindBuffer(34962, context.blitVB);
      var prevActiveTexture = gl.getParameter(34016);
      gl.activeTexture(33984);
      var prevTextureBinding = gl.getParameter(32873);
      gl.bindTexture(3553, context.defaultColorTarget);
      var prevBlend = gl.getParameter(3042);
      if (prevBlend) gl.disable(3042);
      var prevCullFace = gl.getParameter(2884);
      if (prevCullFace) gl.disable(2884);
      var prevDepthTest = gl.getParameter(2929);
      if (prevDepthTest) gl.disable(2929);
      var prevStencilTest = gl.getParameter(2960);
      if (prevStencilTest) gl.disable(2960);
      function draw() {
        gl.vertexAttribPointer(context.blitPosLoc, 2, 5126, false, 0, 0);
        gl.drawArrays(5, 0, 4);
      }
      if (context.defaultVao) {
        // WebGL 2 or OES_vertex_array_object
        var prevVAO = gl.getParameter(34229);
        gl.bindVertexArray(context.defaultVao);
        draw();
        gl.bindVertexArray(prevVAO);
      } else {
        var prevVertexAttribPointer = {
          buffer: gl.getVertexAttrib(context.blitPosLoc, 34975),
          size: gl.getVertexAttrib(context.blitPosLoc, 34339),
          stride: gl.getVertexAttrib(context.blitPosLoc, 34340),
          type: gl.getVertexAttrib(context.blitPosLoc, 34341),
          normalized: gl.getVertexAttrib(context.blitPosLoc, 34922),
          pointer: gl.getVertexAttribOffset(context.blitPosLoc, 34373)
        };
        var maxVertexAttribs = gl.getParameter(34921);
        var prevVertexAttribEnables = [];
        for (var i = 0; i < maxVertexAttribs; ++i) {
          var prevEnabled = gl.getVertexAttrib(i, 34338);
          var wantEnabled = i == context.blitPosLoc;
          if (prevEnabled && !wantEnabled) {
            gl.disableVertexAttribArray(i);
          }
          if (!prevEnabled && wantEnabled) {
            gl.enableVertexAttribArray(i);
          }
          prevVertexAttribEnables[i] = prevEnabled;
        }
        draw();
        for (var i = 0; i < maxVertexAttribs; ++i) {
          var prevEnabled = prevVertexAttribEnables[i];
          var nowEnabled = i == context.blitPosLoc;
          if (prevEnabled && !nowEnabled) {
            gl.enableVertexAttribArray(i);
          }
          if (!prevEnabled && nowEnabled) {
            gl.disableVertexAttribArray(i);
          }
        }
        gl.bindBuffer(34962, prevVertexAttribPointer.buffer);
        gl.vertexAttribPointer(context.blitPosLoc, prevVertexAttribPointer.size, prevVertexAttribPointer.type, prevVertexAttribPointer.normalized, prevVertexAttribPointer.stride, prevVertexAttribPointer.offset);
      }
      if (prevStencilTest) gl.enable(2960);
      if (prevDepthTest) gl.enable(2929);
      if (prevCullFace) gl.enable(2884);
      if (prevBlend) gl.enable(3042);
      gl.bindTexture(3553, prevTextureBinding);
      gl.activeTexture(prevActiveTexture);
      gl.bindBuffer(34962, prevVB);
      gl.useProgram(prevProgram);
    }
    gl.bindFramebuffer(36160, prevFbo);
    if (prevScissorTest) gl.enable(3089);
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
    if (webGLContextAttributes.renderViaOffscreenBackBuffer) GL.createOffscreenFramebuffer(context);
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
    // Detect the presence of a few extensions manually, ction GL interop
    // layer itself will need to know if they exist.
    context.compressionExt = GLctx.getExtension("WEBGL_compressed_texture_s3tc");
    context.anisotropicExt = GLctx.getExtension("EXT_texture_filter_anisotropic");
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

var GLImmediateSetup = {};

var _emscripten_glEnable = x0 => GLctx.enable(x0);

var _glEnable = _emscripten_glEnable;

var _emscripten_glDisable = x0 => GLctx.disable(x0);

var _glDisable = _emscripten_glDisable;

var _emscripten_glIsEnabled = x0 => GLctx.isEnabled(x0);

var _glIsEnabled = _emscripten_glIsEnabled;

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
    // code get the length.
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

var _glGetBooleanv = _emscripten_glGetBooleanv;

function _emscripten_glGetIntegerv(name_, p) {
  p >>>= 0;
  return emscriptenWebGLGet(name_, p, 0);
}

var _glGetIntegerv = _emscripten_glGetIntegerv;

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

var _glGetString = _emscripten_glGetString;

var _emscripten_glCreateShader = shaderType => {
  var id = GL.getNewId(GL.shaders);
  GL.shaders[id] = GLctx.createShader(shaderType);
  return id;
};

var _glCreateShader = _emscripten_glCreateShader;

function _emscripten_glShaderSource(shader, count, string, length) {
  string >>>= 0;
  length >>>= 0;
  var source = GL.getSource(shader, count, string, length);
  GLctx.shaderSource(GL.shaders[shader], source);
}

var _glShaderSource = _emscripten_glShaderSource;

var _emscripten_glCompileShader = shader => {
  GLctx.compileShader(GL.shaders[shader]);
};

var _glCompileShader = _emscripten_glCompileShader;

var _emscripten_glAttachShader = (program, shader) => {
  GLctx.attachShader(GL.programs[program], GL.shaders[shader]);
};

var _glAttachShader = _emscripten_glAttachShader;

var _emscripten_glDetachShader = (program, shader) => {
  GLctx.detachShader(GL.programs[program], GL.shaders[shader]);
};

var _glDetachShader = _emscripten_glDetachShader;

var _emscripten_glUseProgram = program => {
  program = GL.programs[program];
  GLctx.useProgram(program);
  // Record the currently active program so that we can access the uniform
  // mapping table of that program.
  GLctx.currentProgram = program;
};

var _glUseProgram = _emscripten_glUseProgram;

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

var _glDeleteProgram = _emscripten_glDeleteProgram;

function _emscripten_glBindAttribLocation(program, index, name) {
  name >>>= 0;
  GLctx.bindAttribLocation(GL.programs[program], index, UTF8ToString(name));
}

var _glBindAttribLocation = _emscripten_glBindAttribLocation;

var _emscripten_glLinkProgram = program => {
  program = GL.programs[program];
  GLctx.linkProgram(program);
  // Invalidate earlier computed uniform->ID mappings, those have now become stale
  program.uniformLocsById = 0;
  // Mark as null-like so that glGetUniformLocation() knows to populate this again.
  program.uniformSizeAndIdsByName = {};
};

var _glLinkProgram = _emscripten_glLinkProgram;

var _emscripten_glBindBuffer = (target, buffer) => {
  if (target == 34962) {
    GLctx.currentArrayBufferBinding = buffer;
    GLImmediate.lastArrayBuffer = buffer;
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

var _glBindBuffer = _emscripten_glBindBuffer;

function _emscripten_glGetFloatv(name_, p) {
  p >>>= 0;
  return emscriptenWebGLGet(name_, p, 2);
}

var _glGetFloatv = _emscripten_glGetFloatv;

var _emscripten_glHint = (x0, x1) => GLctx.hint(x0, x1);

var _glHint = _emscripten_glHint;

var _emscripten_glEnableVertexAttribArray = index => {
  GLctx.enableVertexAttribArray(index);
};

var _glEnableVertexAttribArray = _emscripten_glEnableVertexAttribArray;

var _emscripten_glDisableVertexAttribArray = index => {
  GLctx.disableVertexAttribArray(index);
};

var _glDisableVertexAttribArray = _emscripten_glDisableVertexAttribArray;

function _emscripten_glVertexAttribPointer(index, size, type, normalized, stride, ptr) {
  ptr >>>= 0;
  GLctx.vertexAttribPointer(index, size, type, !!normalized, stride, ptr);
}

var _glVertexAttribPointer = _emscripten_glVertexAttribPointer;

var _emscripten_glActiveTexture = x0 => GLctx.activeTexture(x0);

var _glActiveTexture = _emscripten_glActiveTexture;

var ptrToString = ptr => {
  // Convert to 32-bit unsigned value
  ptr >>>= 0;
  return "0x" + ptr.toString(16).padStart(8, "0");
};

var GLEmulation = {
  fogStart: 0,
  fogEnd: 1,
  fogDensity: 1,
  fogColor: null,
  fogMode: 2048,
  fogEnabled: false,
  MAX_CLIP_PLANES: 6,
  clipPlaneEnabled: [ false, false, false, false, false, false ],
  clipPlaneEquation: [],
  lightingEnabled: false,
  lightModelAmbient: null,
  lightModelLocalViewer: false,
  lightModelTwoSide: false,
  materialAmbient: null,
  materialDiffuse: null,
  materialSpecular: null,
  materialShininess: null,
  materialEmission: null,
  MAX_LIGHTS: 8,
  lightEnabled: [ false, false, false, false, false, false, false, false ],
  lightAmbient: [],
  lightDiffuse: [],
  lightSpecular: [],
  lightPosition: [],
  alphaTestEnabled: false,
  alphaTestFunc: 519,
  alphaTestRef: 0,
  pointSize: 1,
  vaos: [],
  currentVao: null,
  enabledVertexAttribArrays: {},
  hasRunInit: false,
  findToken(source, token) {
    function isIdentChar(ch) {
      if (ch >= 48 && ch <= 57) // 0-9
      return true;
      if (ch >= 65 && ch <= 90) // A-Z
      return true;
      if (ch >= 97 && ch <= 122) // a-z
      return true;
      return false;
    }
    var i = -1;
    do {
      i = source.indexOf(token, i + 1);
      if (i < 0) {
        break;
      }
      if (i > 0 && isIdentChar(source[i - 1])) {
        continue;
      }
      i += token.length;
      if (i < source.length - 1 && isIdentChar(source[i + 1])) {
        continue;
      }
      return true;
    } while (true);
    return false;
  },
  init() {
    // Do not activate immediate/emulation code (e.g. replace glDrawElements)
    // when in FULL_ES2 mode.  We do not need full emulation, we instead
    // emulate client-side arrays etc. in FULL_ES2 code in a straightforward
    // manner, and avoid not having a bound buffer be ambiguous between es2
    // emulation code and legacy gl emulation code.
    if (GLEmulation.hasRunInit) {
      return;
    }
    GLEmulation.hasRunInit = true;
    GLEmulation.fogColor = new Float32Array(4);
    for (var clipPlaneId = 0; clipPlaneId < GLEmulation.MAX_CLIP_PLANES; clipPlaneId++) {
      GLEmulation.clipPlaneEquation[clipPlaneId] = new Float32Array(4);
    }
    // set defaults for GL_LIGHTING
    GLEmulation.lightModelAmbient = new Float32Array([ .2, .2, .2, 1 ]);
    GLEmulation.materialAmbient = new Float32Array([ .2, .2, .2, 1 ]);
    GLEmulation.materialDiffuse = new Float32Array([ .8, .8, .8, 1 ]);
    GLEmulation.materialSpecular = new Float32Array([ 0, 0, 0, 1 ]);
    GLEmulation.materialShininess = new Float32Array([ 0 ]);
    GLEmulation.materialEmission = new Float32Array([ 0, 0, 0, 1 ]);
    for (var lightId = 0; lightId < GLEmulation.MAX_LIGHTS; lightId++) {
      GLEmulation.lightAmbient[lightId] = new Float32Array([ 0, 0, 0, 1 ]);
      GLEmulation.lightDiffuse[lightId] = lightId ? new Float32Array([ 0, 0, 0, 1 ]) : new Float32Array([ 1, 1, 1, 1 ]);
      GLEmulation.lightSpecular[lightId] = lightId ? new Float32Array([ 0, 0, 0, 1 ]) : new Float32Array([ 1, 1, 1, 1 ]);
      GLEmulation.lightPosition[lightId] = new Float32Array([ 0, 0, 1, 0 ]);
    }
    // Add some emulation workarounds
    err("WARNING: using emscripten GL emulation. This is a collection of limited workarounds, do not expect it to work.");
    err("WARNING: using emscripten GL emulation unsafe opts. If weirdness happens, try -sGL_UNSAFE_OPTS=0");
    // XXX some of the capabilities we don't support may lead to incorrect rendering, if we do not emulate them in shaders
    var validCapabilities = {
      2884: 1,
      // GL_CULL_FACE
      3042: 1,
      // GL_BLEND
      3024: 1,
      // GL_DITHER,
      2960: 1,
      // GL_STENCIL_TEST
      2929: 1,
      // GL_DEPTH_TEST
      3089: 1,
      // GL_SCISSOR_TEST
      32823: 1,
      // GL_POLYGON_OFFSET_FILL
      32926: 1,
      // GL_SAMPLE_ALPHA_TO_COVERAGE
      32928: 1
    };
    var orig_glEnable = _glEnable;
    _glEnable = _emscripten_glEnable = cap => {
      // Clean up the renderer on any change to the rendering state. The optimization of
      // skipping renderer setup is aimed at the case of multiple glDraw* right after each other
      GLImmediate.lastRenderer?.cleanup();
      if (cap == 2912) {
        if (GLEmulation.fogEnabled != true) {
          GLImmediate.currentRenderer = null;
          // Fog parameter is part of the FFP shader state, we must re-lookup the renderer to use.
          GLEmulation.fogEnabled = true;
        }
        return;
      } else if ((cap >= 12288) && (cap < 12294)) {
        var clipPlaneId = cap - 12288;
        if (GLEmulation.clipPlaneEnabled[clipPlaneId] != true) {
          GLImmediate.currentRenderer = null;
          // clip plane parameter is part of the FFP shader state, we must re-lookup the renderer to use.
          GLEmulation.clipPlaneEnabled[clipPlaneId] = true;
        }
        return;
      } else if ((cap >= 16384) && (cap < 16392)) {
        var lightId = cap - 16384;
        if (GLEmulation.lightEnabled[lightId] != true) {
          GLImmediate.currentRenderer = null;
          // light parameter is part of the FFP shader state, we must re-lookup the renderer to use.
          GLEmulation.lightEnabled[lightId] = true;
        }
        return;
      } else if (cap == 2896) {
        if (GLEmulation.lightingEnabled != true) {
          GLImmediate.currentRenderer = null;
          // light parameter is part of the FFP shader state, we must re-lookup the renderer to use.
          GLEmulation.lightingEnabled = true;
        }
        return;
      } else if (cap == 3008) {
        if (GLEmulation.alphaTestEnabled != true) {
          GLImmediate.currentRenderer = null;
          // alpha testing is part of the FFP shader state, we must re-lookup the renderer to use.
          GLEmulation.alphaTestEnabled = true;
        }
        return;
      } else if (cap == 3553) {
        // XXX not according to spec, and not in desktop GL, but works in some GLES1.x apparently, so support
        // it by forwarding to glEnableClientState
        /* Actually, let's not, for now. (This sounds exceedingly broken)
             * This is in gl_ps_workaround2.c.
            _glEnableClientState(cap);
            */ return;
      } else if (!(cap in validCapabilities)) {
        return;
      }
      orig_glEnable(cap);
    };
    var orig_glDisable = _glDisable;
    _glDisable = _emscripten_glDisable = cap => {
      GLImmediate.lastRenderer?.cleanup();
      if (cap == 2912) {
        if (GLEmulation.fogEnabled != false) {
          GLImmediate.currentRenderer = null;
          // Fog parameter is part of the FFP shader state, we must re-lookup the renderer to use.
          GLEmulation.fogEnabled = false;
        }
        return;
      } else if ((cap >= 12288) && (cap < 12294)) {
        var clipPlaneId = cap - 12288;
        if (GLEmulation.clipPlaneEnabled[clipPlaneId] != false) {
          GLImmediate.currentRenderer = null;
          // clip plane parameter is part of the FFP shader state, we must re-lookup the renderer to use.
          GLEmulation.clipPlaneEnabled[clipPlaneId] = false;
        }
        return;
      } else if ((cap >= 16384) && (cap < 16392)) {
        var lightId = cap - 16384;
        if (GLEmulation.lightEnabled[lightId] != false) {
          GLImmediate.currentRenderer = null;
          // light parameter is part of the FFP shader state, we must re-lookup the renderer to use.
          GLEmulation.lightEnabled[lightId] = false;
        }
        return;
      } else if (cap == 2896) {
        if (GLEmulation.lightingEnabled != false) {
          GLImmediate.currentRenderer = null;
          // light parameter is part of the FFP shader state, we must re-lookup the renderer to use.
          GLEmulation.lightingEnabled = false;
        }
        return;
      } else if (cap == 3008) {
        if (GLEmulation.alphaTestEnabled != false) {
          GLImmediate.currentRenderer = null;
          // alpha testing is part of the FFP shader state, we must re-lookup the renderer to use.
          GLEmulation.alphaTestEnabled = false;
        }
        return;
      } else if (cap == 3553) {
        // XXX not according to spec, and not in desktop GL, but works in some GLES1.x apparently, so support
        // it by forwarding to glDisableClientState
        /* Actually, let's not, for now. (This sounds exceedingly broken)
             * This is in gl_ps_workaround2.c.
            _glDisableClientState(cap);
            */ return;
      } else if (!(cap in validCapabilities)) {
        return;
      }
      orig_glDisable(cap);
    };
    var orig_glIsEnabled = _glIsEnabled;
    _glIsEnabled = _emscripten_glIsEnabled = cap => {
      if (cap == 2912) {
        return GLEmulation.fogEnabled ? 1 : 0;
      } else if ((cap >= 12288) && (cap < 12294)) {
        var clipPlaneId = cap - 12288;
        return GLEmulation.clipPlaneEnabled[clipPlaneId] ? 1 : 0;
      } else if ((cap >= 16384) && (cap < 16392)) {
        var lightId = cap - 16384;
        return GLEmulation.lightEnabled[lightId] ? 1 : 0;
      } else if (cap == 2896) {
        return GLEmulation.lightingEnabled ? 1 : 0;
      } else if (cap == 3008) {
        return GLEmulation.alphaTestEnabled ? 1 : 0;
      } else if (!(cap in validCapabilities)) {
        return 0;
      }
      return GLctx.isEnabled(cap);
    };
    var orig_glGetBooleanv = _glGetBooleanv;
    _glGetBooleanv = _emscripten_glGetBooleanv = (pname, p) => {
      var attrib = GLEmulation.getAttributeFromCapability(pname);
      if (attrib !== null) {
        p >>>= 0;
        var result = GLImmediate.enabledClientAttributes[attrib];
        HEAP8[p >>> 0] = result === true ? 1 : 0;
        return;
      }
      orig_glGetBooleanv(pname, p);
    };
    var orig_glGetIntegerv = _glGetIntegerv;
    _glGetIntegerv = _emscripten_glGetIntegerv = (pname, params) => {
      params >>>= 0;
      switch (pname) {
       case 34018:
        pname = GLctx.MAX_TEXTURE_IMAGE_UNITS;
        break;

       // GL_MAX_TEXTURE_UNITS
        case 35658:
        {
          // GL_MAX_VERTEX_UNIFORM_COMPONENTS_ARB
          var result = GLctx.getParameter(GLctx.MAX_VERTEX_UNIFORM_VECTORS);
          HEAP32[((params) >>> 2) >>> 0] = result * 4;
          // GLES gives num of 4-element vectors, GL wants individual components, so multiply
          return;
        }

       case 35657:
        {
          // GL_MAX_FRAGMENT_UNIFORM_COMPONENTS_ARB
          var result = GLctx.getParameter(GLctx.MAX_FRAGMENT_UNIFORM_VECTORS);
          HEAP32[((params) >>> 2) >>> 0] = result * 4;
          // GLES gives num of 4-element vectors, GL wants individual components, so multiply
          return;
        }

       case 35659:
        {
          // GL_MAX_VARYING_FLOATS_ARB
          var result = GLctx.getParameter(GLctx.MAX_VARYING_VECTORS);
          HEAP32[((params) >>> 2) >>> 0] = result * 4;
          // GLES gives num of 4-element vectors, GL wants individual components, so multiply
          return;
        }

       case 34929:
        pname = GLctx.MAX_COMBINED_TEXTURE_IMAGE_UNITS;
        break;

       // GL_MAX_TEXTURE_COORDS
        case 32890:
        {
          // GL_VERTEX_ARRAY_SIZE
          var attribute = GLImmediate.clientAttributes[GLImmediate.VERTEX];
          HEAP32[((params) >>> 2) >>> 0] = attribute ? attribute.size : 0;
          return;
        }

       case 32891:
        {
          // GL_VERTEX_ARRAY_TYPE
          var attribute = GLImmediate.clientAttributes[GLImmediate.VERTEX];
          HEAP32[((params) >>> 2) >>> 0] = attribute ? attribute.type : 0;
          return;
        }

       case 32892:
        {
          // GL_VERTEX_ARRAY_STRIDE
          var attribute = GLImmediate.clientAttributes[GLImmediate.VERTEX];
          HEAP32[((params) >>> 2) >>> 0] = attribute ? attribute.stride : 0;
          return;
        }

       case 32897:
        {
          // GL_COLOR_ARRAY_SIZE
          var attribute = GLImmediate.clientAttributes[GLImmediate.COLOR];
          HEAP32[((params) >>> 2) >>> 0] = attribute ? attribute.size : 0;
          return;
        }

       case 32898:
        {
          // GL_COLOR_ARRAY_TYPE
          var attribute = GLImmediate.clientAttributes[GLImmediate.COLOR];
          HEAP32[((params) >>> 2) >>> 0] = attribute ? attribute.type : 0;
          return;
        }

       case 32899:
        {
          // GL_COLOR_ARRAY_STRIDE
          var attribute = GLImmediate.clientAttributes[GLImmediate.COLOR];
          HEAP32[((params) >>> 2) >>> 0] = attribute ? attribute.stride : 0;
          return;
        }

       case 32904:
        {
          // GL_TEXTURE_COORD_ARRAY_SIZE
          var attribute = GLImmediate.clientAttributes[GLImmediate.TEXTURE0 + GLImmediate.clientActiveTexture];
          HEAP32[((params) >>> 2) >>> 0] = attribute ? attribute.size : 0;
          return;
        }

       case 32905:
        {
          // GL_TEXTURE_COORD_ARRAY_TYPE
          var attribute = GLImmediate.clientAttributes[GLImmediate.TEXTURE0 + GLImmediate.clientActiveTexture];
          HEAP32[((params) >>> 2) >>> 0] = attribute ? attribute.type : 0;
          return;
        }

       case 32906:
        {
          // GL_TEXTURE_COORD_ARRAY_STRIDE
          var attribute = GLImmediate.clientAttributes[GLImmediate.TEXTURE0 + GLImmediate.clientActiveTexture];
          HEAP32[((params) >>> 2) >>> 0] = attribute ? attribute.stride : 0;
          return;
        }

       case 3378:
        {
          // GL_MAX_CLIP_PLANES
          HEAP32[((params) >>> 2) >>> 0] = GLEmulation.MAX_CLIP_PLANES;
          // all implementations need to support atleast 6
          return;
        }

       case 2976:
        {
          // GL_MATRIX_MODE
          HEAP32[((params) >>> 2) >>> 0] = GLImmediate.currentMatrix + 5888;
          return;
        }

       case 3009:
        {
          // GL_ALPHA_TEST_FUNC
          HEAP32[((params) >>> 2) >>> 0] = GLEmulation.alphaTestFunc;
          return;
        }
      }
      orig_glGetIntegerv(pname, params);
    };
    var orig_glGetString = _glGetString;
    _glGetString = _emscripten_glGetString = name_ => {
      if (GL.stringCache[name_]) return GL.stringCache[name_];
      switch (name_) {
       case 7939:
        // Add various extensions that we can support
        var ret = stringToNewUTF8(getEmscriptenSupportedExtensions(GLctx).join(" ") + " GL_ARB_texture_env_combine GL_ARB_texture_env_dot3 GL_EXT_texture_env_combine GL_ARB_texture_env_crossbar GL_ATI_texture_env_combine3 GL_NV_texture_env_combine4 GL_EXT_texture_env_dot3 GL_ARB_multitexture GL_ARB_vertex_buffer_object GL_EXT_framebuffer_object GL_ARB_vertex_program GL_ARB_fragment_program GL_ARB_shading_language_100 GL_ARB_shader_objects GL_ARB_vertex_shader GL_ARB_fragment_shader GL_ARB_texture_cube_map GL_EXT_draw_range_elements" + (GL.currentContext.compressionExt ? " GL_ARB_texture_compression GL_EXT_texture_compression_s3tc" : "") + (GL.currentContext.anisotropicExt ? " GL_EXT_texture_filter_anisotropic" : ""));
        return GL.stringCache[name_] = ret;
      }
      return orig_glGetString(name_);
    };
    // Do some automatic rewriting to work around GLSL differences. Note that this must be done in
    // tandem with the rest of the program, by itself it cannot suffice.
    // Note that we need to remember shader types for this rewriting, saving sources makes it easier to debug.
    GL.shaderInfos = {};
    var orig_glCreateShader = _glCreateShader;
    _glCreateShader = _emscripten_glCreateShader = shaderType => {
      var id = orig_glCreateShader(shaderType);
      GL.shaderInfos[id] = {
        type: shaderType,
        ftransform: false
      };
      return id;
    };
    function ensurePrecision(source) {
      if (!/precision +(low|medium|high)p +float *;/.test(source)) {
        source = "#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\n" + source;
      }
      return source;
    }
    var orig_glShaderSource = _glShaderSource;
    _glShaderSource = _emscripten_glShaderSource = (shader, count, string, length) => {
      string >>>= 0;
      length >>>= 0;
      var source = GL.getSource(shader, count, string, length);
      // XXX We add attributes and uniforms to shaders. The program can ask for the # of them, and see the
      // ones we generated, potentially confusing it? Perhaps we should hide them.
      if (GL.shaderInfos[shader].type == GLctx.VERTEX_SHADER) {
        // Replace ftransform() with explicit project/modelview transforms, and add position and matrix info.
        var has_pm = source.search(/u_projection/) >= 0;
        var has_mm = source.search(/u_modelView/) >= 0;
        var has_pv = source.search(/a_position/) >= 0;
        var need_pm = 0, need_mm = 0, need_pv = 0;
        var old = source;
        source = source.replace(/ftransform\(\)/g, "(u_projection * u_modelView * a_position)");
        if (old != source) need_pm = need_mm = need_pv = 1;
        old = source;
        source = source.replace(/gl_ProjectionMatrix/g, "u_projection");
        if (old != source) need_pm = 1;
        old = source;
        source = source.replace(/gl_ModelViewMatrixTranspose\[2\]/g, "vec4(u_modelView[0][2], u_modelView[1][2], u_modelView[2][2], u_modelView[3][2])");
        // XXX extremely inefficient
        if (old != source) need_mm = 1;
        old = source;
        source = source.replace(/gl_ModelViewMatrix/g, "u_modelView");
        if (old != source) need_mm = 1;
        old = source;
        source = source.replace(/gl_Vertex/g, "a_position");
        if (old != source) need_pv = 1;
        old = source;
        source = source.replace(/gl_ModelViewProjectionMatrix/g, "(u_projection * u_modelView)");
        if (old != source) need_pm = need_mm = 1;
        if (need_pv && !has_pv) source = "attribute vec4 a_position; \n" + source;
        if (need_mm && !has_mm) source = "uniform mat4 u_modelView; \n" + source;
        if (need_pm && !has_pm) source = "uniform mat4 u_projection; \n" + source;
        GL.shaderInfos[shader].ftransform = need_pm || need_mm || need_pv;
        // we will need to provide the fixed function stuff as attributes and uniforms
        for (var i = 0; i < GLImmediate.MAX_TEXTURES; i++) {
          // XXX To handle both regular texture mapping and cube mapping, we use vec4 for tex coordinates.
          old = source;
          var need_vtc = source.search(`v_texCoord${i}`) == -1;
          source = source.replace(new RegExp(`gl_TexCoord\\[${i}\\]`, "g"), `v_texCoord${i}`).replace(new RegExp(`gl_MultiTexCoord${i}`, "g"), `a_texCoord${i}`);
          if (source != old) {
            source = `attribute vec4 a_texCoord${i}; \n${source}`;
            if (need_vtc) {
              source = `varying vec4 v_texCoord${i};   \n${source}`;
            }
          }
          old = source;
          source = source.replace(new RegExp(`gl_TextureMatrix\\[${i}\\]`, "g"), `u_textureMatrix${i}`);
          if (source != old) {
            source = `uniform mat4 u_textureMatrix${i}; \n${source}`;
          }
        }
        if (source.includes("gl_FrontColor")) {
          source = "varying vec4 v_color; \n" + source.replace(/gl_FrontColor/g, "v_color");
        }
        if (source.includes("gl_Color")) {
          source = "attribute vec4 a_color; \n" + source.replace(/gl_Color/g, "a_color");
        }
        if (source.includes("gl_Normal")) {
          source = "attribute vec3 a_normal; \n" + source.replace(/gl_Normal/g, "a_normal");
        }
        // fog
        if (source.includes("gl_FogFragCoord")) {
          source = "varying float v_fogFragCoord;   \n" + source.replace(/gl_FogFragCoord/g, "v_fogFragCoord");
        }
      } else {
        // Fragment shader
        for (i = 0; i < GLImmediate.MAX_TEXTURES; i++) {
          old = source;
          source = source.replace(new RegExp(`gl_TexCoord\\[${i}\\]`, "g"), `v_texCoord${i}`);
          if (source != old) {
            source = "varying vec4 v_texCoord" + i + ";   \n" + source;
          }
        }
        if (source.includes("gl_Color")) {
          source = "varying vec4 v_color; \n" + source.replace(/gl_Color/g, "v_color");
        }
        if (source.includes("gl_Fog.color")) {
          source = "uniform vec4 u_fogColor;   \n" + source.replace(/gl_Fog.color/g, "u_fogColor");
        }
        if (source.includes("gl_Fog.end")) {
          source = "uniform float u_fogEnd;   \n" + source.replace(/gl_Fog.end/g, "u_fogEnd");
        }
        if (source.includes("gl_Fog.scale")) {
          source = "uniform float u_fogScale;   \n" + source.replace(/gl_Fog.scale/g, "u_fogScale");
        }
        if (source.includes("gl_Fog.density")) {
          source = "uniform float u_fogDensity;   \n" + source.replace(/gl_Fog.density/g, "u_fogDensity");
        }
        if (source.includes("gl_FogFragCoord")) {
          source = "varying float v_fogFragCoord;   \n" + source.replace(/gl_FogFragCoord/g, "v_fogFragCoord");
        }
        source = ensurePrecision(source);
      }
      GLctx.shaderSource(GL.shaders[shader], source);
    };
    var orig_glCompileShader = _glCompileShader;
    _glCompileShader = _emscripten_glCompileShader = shader => {
      GLctx.compileShader(GL.shaders[shader]);
    };
    GL.programShaders = {};
    var orig_glAttachShader = _glAttachShader;
    _glAttachShader = _emscripten_glAttachShader = (program, shader) => {
      GL.programShaders[program] ||= [];
      GL.programShaders[program].push(shader);
      orig_glAttachShader(program, shader);
    };
    var orig_glDetachShader = _glDetachShader;
    _glDetachShader = _emscripten_glDetachShader = (program, shader) => {
      var programShader = GL.programShaders[program];
      if (!programShader) {
        err(`WARNING: _glDetachShader received invalid program: ${program}`);
        return;
      }
      var index = programShader.indexOf(shader);
      programShader.splice(index, 1);
      orig_glDetachShader(program, shader);
    };
    var orig_glUseProgram = _glUseProgram;
    _glUseProgram = _emscripten_glUseProgram = program => {
      if (GL.currProgram != program) {
        GLImmediate.currentRenderer = null;
        // This changes the FFP emulation shader program, need to recompute that.
        GL.currProgram = program;
        GLImmediate.fixedFunctionProgram = 0;
        orig_glUseProgram(program);
      }
    };
    var orig_glDeleteProgram = _glDeleteProgram;
    _glDeleteProgram = _emscripten_glDeleteProgram = program => {
      orig_glDeleteProgram(program);
      if (program == GL.currProgram) {
        GLImmediate.currentRenderer = null;
        // This changes the FFP emulation shader program, need to recompute that.
        GL.currProgram = 0;
      }
    };
    // If attribute 0 was not bound, bind it to 0 for WebGL performance reasons. Track if 0 is free for that.
    var zeroUsedPrograms = {};
    var orig_glBindAttribLocation = _glBindAttribLocation;
    _glBindAttribLocation = _emscripten_glBindAttribLocation = (program, index, name) => {
      if (index == 0) zeroUsedPrograms[program] = true;
      orig_glBindAttribLocation(program, index, name);
    };
    var orig_glLinkProgram = _glLinkProgram;
    _glLinkProgram = _emscripten_glLinkProgram = program => {
      if (!(program in zeroUsedPrograms)) {
        GLctx.bindAttribLocation(GL.programs[program], 0, "a_position");
      }
      orig_glLinkProgram(program);
    };
    var orig_glBindBuffer = _glBindBuffer;
    _glBindBuffer = _emscripten_glBindBuffer = (target, buffer) => {
      orig_glBindBuffer(target, buffer);
      if (target == GLctx.ARRAY_BUFFER) {
        if (GLEmulation.currentVao) {
          GLEmulation.currentVao.arrayBuffer = buffer;
        }
      } else if (target == GLctx.ELEMENT_ARRAY_BUFFER) {
        if (GLEmulation.currentVao) GLEmulation.currentVao.elementArrayBuffer = buffer;
      }
    };
    var orig_glGetFloatv = _glGetFloatv;
    _glGetFloatv = _emscripten_glGetFloatv = (pname, params) => {
      params >>>= 0;
      if (pname == 2982) {
        // GL_MODELVIEW_MATRIX
        HEAPF32.set(GLImmediate.matrix[0], ((params) >>> 2) >>> 0);
      } else if (pname == 2983) {
        // GL_PROJECTION_MATRIX
        HEAPF32.set(GLImmediate.matrix[1], ((params) >>> 2) >>> 0);
      } else if (pname == 2984) {
        // GL_TEXTURE_MATRIX
        HEAPF32.set(GLImmediate.matrix[2 + GLImmediate.clientActiveTexture], ((params) >>> 2) >>> 0);
      } else if (pname == 2918) {
        // GL_FOG_COLOR
        HEAPF32.set(GLEmulation.fogColor, ((params) >>> 2) >>> 0);
      } else if (pname == 2915) {
        // GL_FOG_START
        HEAPF32[((params) >>> 2) >>> 0] = GLEmulation.fogStart;
      } else if (pname == 2916) {
        // GL_FOG_END
        HEAPF32[((params) >>> 2) >>> 0] = GLEmulation.fogEnd;
      } else if (pname == 2914) {
        // GL_FOG_DENSITY
        HEAPF32[((params) >>> 2) >>> 0] = GLEmulation.fogDensity;
      } else if (pname == 2917) {
        // GL_FOG_MODE
        HEAPF32[((params) >>> 2) >>> 0] = GLEmulation.fogMode;
      } else if (pname == 2899) {
        // GL_LIGHT_MODEL_AMBIENT
        HEAPF32[((params) >>> 2) >>> 0] = GLEmulation.lightModelAmbient[0];
        HEAPF32[(((params) + (4)) >>> 2) >>> 0] = GLEmulation.lightModelAmbient[1];
        HEAPF32[(((params) + (8)) >>> 2) >>> 0] = GLEmulation.lightModelAmbient[2];
        HEAPF32[(((params) + (12)) >>> 2) >>> 0] = GLEmulation.lightModelAmbient[3];
      } else if (pname == 3010) {
        // GL_ALPHA_TEST_REF
        HEAPF32[((params) >>> 2) >>> 0] = GLEmulation.alphaTestRef;
      } else {
        orig_glGetFloatv(pname, params);
      }
    };
    var orig_glHint = _glHint;
    _glHint = _emscripten_glHint = (target, mode) => {
      if (target == 34031) {
        // GL_TEXTURE_COMPRESSION_HINT
        return;
      }
      orig_glHint(target, mode);
    };
    var orig_glEnableVertexAttribArray = _glEnableVertexAttribArray;
    _glEnableVertexAttribArray = _emscripten_glEnableVertexAttribArray = index => {
      orig_glEnableVertexAttribArray(index);
      GLEmulation.enabledVertexAttribArrays[index] = 1;
      if (GLEmulation.currentVao) GLEmulation.currentVao.enabledVertexAttribArrays[index] = 1;
    };
    var orig_glDisableVertexAttribArray = _glDisableVertexAttribArray;
    _glDisableVertexAttribArray = _emscripten_glDisableVertexAttribArray = index => {
      orig_glDisableVertexAttribArray(index);
      delete GLEmulation.enabledVertexAttribArrays[index];
      if (GLEmulation.currentVao) delete GLEmulation.currentVao.enabledVertexAttribArrays[index];
    };
    var orig_glVertexAttribPointer = _glVertexAttribPointer;
    _glVertexAttribPointer = _emscripten_glVertexAttribPointer = (index, size, type, normalized, stride, pointer) => {
      orig_glVertexAttribPointer(index, size, type, normalized, stride, pointer);
      if (GLEmulation.currentVao) {
        // TODO: avoid object creation here? likely not hot though
        GLEmulation.currentVao.vertexAttribPointers[index] = [ index, size, type, normalized, stride, pointer ];
      }
    };
  },
  getAttributeFromCapability(cap) {
    var attrib = null;
    switch (cap) {
     case 3553:
     // GL_TEXTURE_2D - XXX not according to spec, and not in desktop GL, but works in some GLES1.x apparently, so support it
      // Fall through:
      case 32888:
      // GL_TEXTURE_COORD_ARRAY
      attrib = GLImmediate.TEXTURE0 + GLImmediate.clientActiveTexture;
      break;

     case 32884:
      // GL_VERTEX_ARRAY
      attrib = GLImmediate.VERTEX;
      break;

     case 32885:
      // GL_NORMAL_ARRAY
      attrib = GLImmediate.NORMAL;
      break;

     case 32886:
      // GL_COLOR_ARRAY
      attrib = GLImmediate.COLOR;
      break;
    }
    return attrib;
  }
};

var GLImmediate = {
  MapTreeLib: null,
  spawnMapTreeLib: () => {
    /**
         * A naive implementation of a map backed by an array, and accessed by
         * naive iteration along the array. (hashmap with only one bucket)
         * @constructor
         */ function CNaiveListMap() {
      var list = [];
      this.insert = function CNaiveListMap_insert(key, val) {
        if (this.contains(key | 0)) return false;
        list.push([ key, val ]);
        return true;
      };
      var __contains_i;
      this.contains = function CNaiveListMap_contains(key) {
        for (__contains_i = 0; __contains_i < list.length; ++__contains_i) {
          if (list[__contains_i][0] === key) return true;
        }
        return false;
      };
      var __get_i;
      this.get = function CNaiveListMap_get(key) {
        for (__get_i = 0; __get_i < list.length; ++__get_i) {
          if (list[__get_i][0] === key) return list[__get_i][1];
        }
        return undefined;
      };
    }
    /**
         * A tree of map nodes.
         * Uses `KeyView`s to allow descending the tree without garbage.
         * Example: {
         *   // Create our map object.
         *   var map = new ObjTreeMap();
         *
         *   // Grab the static keyView for the map.
         *   var keyView = map.GetStaticKeyView();
         *
         *   // Let's make a map for:
         *   // root: <undefined>
         *   //   1: <undefined>
         *   //     2: <undefined>
         *   //       5: "Three, sir!"
         *   //       3: "Three!"
         *
         *   // Note how we can chain together `Reset` and `Next` to
         *   // easily descend based on multiple key fragments.
         *   keyView.Reset().Next(1).Next(2).Next(5).Set("Three, sir!");
         *   keyView.Reset().Next(1).Next(2).Next(3).Set("Three!");
         * }
         * @constructor
         */ function CMapTree() {
      /** @constructor */ function CNLNode() {
        var map = new CNaiveListMap;
        this.child = function CNLNode_child(keyFrag) {
          if (!map.contains(keyFrag | 0)) {
            map.insert(keyFrag | 0, new CNLNode);
          }
          return map.get(keyFrag | 0);
        };
        this.value = undefined;
        this.get = function CNLNode_get() {
          return this.value;
        };
        this.set = function CNLNode_set(val) {
          this.value = val;
        };
      }
      /** @constructor */ function CKeyView(root) {
        var cur;
        this.reset = function CKeyView_reset() {
          cur = root;
          return this;
        };
        this.reset();
        this.next = function CKeyView_next(keyFrag) {
          cur = cur.child(keyFrag);
          return this;
        };
        this.get = function CKeyView_get() {
          return cur.get();
        };
        this.set = function CKeyView_set(val) {
          cur.set(val);
        };
      }
      var root;
      var staticKeyView;
      this.createKeyView = function CNLNode_createKeyView() {
        return new CKeyView(root);
      };
      this.clear = function CNLNode_clear() {
        root = new CNLNode;
        staticKeyView = this.createKeyView();
      };
      this.clear();
      this.getStaticKeyView = function CNLNode_getStaticKeyView() {
        staticKeyView.reset();
        return staticKeyView;
      };
    }
    // Exports:
    return {
      create: () => new CMapTree
    };
  },
  TexEnvJIT: null,
  spawnTexEnvJIT: () => {
    // GL defs:
    var GL_TEXTURE0 = 33984;
    var GL_TEXTURE_1D = 3552;
    var GL_TEXTURE_2D = 3553;
    var GL_TEXTURE_3D = 32879;
    var GL_TEXTURE_CUBE_MAP = 34067;
    var GL_TEXTURE_ENV = 8960;
    var GL_TEXTURE_ENV_MODE = 8704;
    var GL_TEXTURE_ENV_COLOR = 8705;
    var GL_TEXTURE_CUBE_MAP_POSITIVE_X = 34069;
    var GL_TEXTURE_CUBE_MAP_NEGATIVE_X = 34070;
    var GL_TEXTURE_CUBE_MAP_POSITIVE_Y = 34071;
    var GL_TEXTURE_CUBE_MAP_NEGATIVE_Y = 34072;
    var GL_TEXTURE_CUBE_MAP_POSITIVE_Z = 34073;
    var GL_TEXTURE_CUBE_MAP_NEGATIVE_Z = 34074;
    var GL_SRC0_RGB = 34176;
    var GL_SRC1_RGB = 34177;
    var GL_SRC2_RGB = 34178;
    var GL_SRC0_ALPHA = 34184;
    var GL_SRC1_ALPHA = 34185;
    var GL_SRC2_ALPHA = 34186;
    var GL_OPERAND0_RGB = 34192;
    var GL_OPERAND1_RGB = 34193;
    var GL_OPERAND2_RGB = 34194;
    var GL_OPERAND0_ALPHA = 34200;
    var GL_OPERAND1_ALPHA = 34201;
    var GL_OPERAND2_ALPHA = 34202;
    var GL_COMBINE_RGB = 34161;
    var GL_COMBINE_ALPHA = 34162;
    var GL_RGB_SCALE = 34163;
    var GL_ALPHA_SCALE = 3356;
    // env.mode
    var GL_ADD = 260;
    var GL_BLEND = 3042;
    var GL_REPLACE = 7681;
    var GL_MODULATE = 8448;
    var GL_DECAL = 8449;
    var GL_COMBINE = 34160;
    // env.color/alphaCombiner
    //var GL_ADD         = 0x104;
    //var GL_REPLACE     = 0x1E01;
    //var GL_MODULATE    = 0x2100;
    var GL_SUBTRACT = 34023;
    var GL_INTERPOLATE = 34165;
    // env.color/alphaSrc
    var GL_TEXTURE = 5890;
    var GL_CONSTANT = 34166;
    var GL_PRIMARY_COLOR = 34167;
    var GL_PREVIOUS = 34168;
    // env.color/alphaOp
    var GL_SRC_COLOR = 768;
    var GL_ONE_MINUS_SRC_COLOR = 769;
    var GL_SRC_ALPHA = 770;
    var GL_ONE_MINUS_SRC_ALPHA = 771;
    var GL_RGB = 6407;
    var GL_RGBA = 6408;
    // Our defs:
    var TEXENVJIT_NAMESPACE_PREFIX = "tej_";
    // Not actually constant, as they can be changed between JIT passes:
    var TEX_UNIT_UNIFORM_PREFIX = "uTexUnit";
    var TEX_COORD_VARYING_PREFIX = "vTexCoord";
    var PRIM_COLOR_VARYING = "vPrimColor";
    var TEX_MATRIX_UNIFORM_PREFIX = "uTexMatrix";
    // Static vars:
    var s_texUnits = null;
    //[];
    var s_activeTexture = 0;
    var s_requiredTexUnitsForPass = [];
    // Static funcs:
    function abort_noSupport(info) {
      abort("[TexEnvJIT] ABORT: No support: " + info);
    }
    function abort_sanity(info) {
      abort("[TexEnvJIT] ABORT: Sanity failure: " + info);
    }
    function genTexUnitSampleExpr(texUnitID) {
      var texUnit = s_texUnits[texUnitID];
      var texType = texUnit.getTexType();
      var func = null;
      switch (texType) {
       case GL_TEXTURE_1D:
        func = "texture2D";
        break;

       case GL_TEXTURE_2D:
        func = "texture2D";
        break;

       case GL_TEXTURE_3D:
        return abort_noSupport("No support for 3D textures.");

       case GL_TEXTURE_CUBE_MAP:
        func = "textureCube";
        break;

       default:
        return abort_sanity(`Unknown texType: ${ptrToString(texType)}`);
      }
      var texCoordExpr = TEX_COORD_VARYING_PREFIX + texUnitID;
      if (TEX_MATRIX_UNIFORM_PREFIX != null) {
        texCoordExpr = `(${TEX_MATRIX_UNIFORM_PREFIX}${texUnitID} * ${texCoordExpr})`;
      }
      return texType === GL_TEXTURE_CUBE_MAP ? `${func}(${TEX_UNIT_UNIFORM_PREFIX}${texUnitID}, ${texCoordExpr}.xyz)` : `texture2DProj(${TEX_UNIT_UNIFORM_PREFIX}${texUnitID}, ${texCoordExpr})`;
    }
    function getTypeFromCombineOp(op) {
      switch (op) {
       case GL_SRC_COLOR:
       case GL_ONE_MINUS_SRC_COLOR:
        return "vec3";

       case GL_SRC_ALPHA:
       case GL_ONE_MINUS_SRC_ALPHA:
        return "float";
      }
      return abort_noSupport("Unsupported combiner op: " + ptrToString(op));
    }
    function getCurTexUnit() {
      return s_texUnits[s_activeTexture];
    }
    function genCombinerSourceExpr(texUnitID, constantExpr, previousVar, src, op) {
      var srcExpr = null;
      switch (src) {
       case GL_TEXTURE:
        srcExpr = genTexUnitSampleExpr(texUnitID);
        break;

       case GL_CONSTANT:
        srcExpr = constantExpr;
        break;

       case GL_PRIMARY_COLOR:
        srcExpr = PRIM_COLOR_VARYING;
        break;

       case GL_PREVIOUS:
        srcExpr = previousVar;
        break;

       default:
        return abort_noSupport("Unsupported combiner src: " + ptrToString(src));
      }
      var expr = null;
      switch (op) {
       case GL_SRC_COLOR:
        expr = srcExpr + ".rgb";
        break;

       case GL_ONE_MINUS_SRC_COLOR:
        expr = "(vec3(1.0) - " + srcExpr + ".rgb)";
        break;

       case GL_SRC_ALPHA:
        expr = srcExpr + ".a";
        break;

       case GL_ONE_MINUS_SRC_ALPHA:
        expr = "(1.0 - " + srcExpr + ".a)";
        break;

       default:
        return abort_noSupport("Unsupported combiner op: " + ptrToString(op));
      }
      return expr;
    }
    function valToFloatLiteral(val) {
      if (val == Math.round(val)) return val + ".0";
      return val;
    }
    // Classes:
    /** @constructor */ function CTexEnv() {
      this.mode = GL_MODULATE;
      this.colorCombiner = GL_MODULATE;
      this.alphaCombiner = GL_MODULATE;
      this.colorScale = 1;
      this.alphaScale = 1;
      this.envColor = [ 0, 0, 0, 0 ];
      this.colorSrc = [ GL_TEXTURE, GL_PREVIOUS, GL_CONSTANT ];
      this.alphaSrc = [ GL_TEXTURE, GL_PREVIOUS, GL_CONSTANT ];
      this.colorOp = [ GL_SRC_COLOR, GL_SRC_COLOR, GL_SRC_ALPHA ];
      this.alphaOp = [ GL_SRC_ALPHA, GL_SRC_ALPHA, GL_SRC_ALPHA ];
      // Map GLenums to small values to efficiently pack the enums to bits for tighter access.
      this.traverseKey = {
        // mode
        7681: 0,
        8448: 1,
        260: 2,
        3042: 3,
        8449: 4,
        34160: 5,
        // additional color and alpha combiners
        34023: 3,
        34165: 4,
        34164: 5,
        34478: 6,
        34479: 7,
        // color and alpha src
        5890: 0,
        34166: 1,
        34167: 2,
        34168: 3,
        // color and alpha op
        768: 0,
        769: 1,
        770: 2,
        771: 3
      };
      // The tuple (key0,key1,key2) uniquely identifies the state of the variables in CTexEnv.
      // -1 on key0 denotes 'the whole cached key is dirty'
      this.key0 = -1;
      this.key1 = 0;
      this.key2 = 0;
      this.computeKey0 = function() {
        var k = this.traverseKey;
        var key = k[this.mode] * 3145728;
        // 6 distinct values.
        key += k[this.colorCombiner] * 393216;
        // 5 distinct values.
        key += k[this.alphaCombiner] * 65536;
        // 5 distinct values.
        // The above three fields have 6*5*5=150 distinct values -> 8 bits.
        key += (this.colorScale - 1) * 16384;
        // 10 bits used.
        key += (this.alphaScale - 1) * 4096;
        // 12 bits used.
        key += k[this.colorSrc[0]] * 1024;
        // 14
        key += k[this.colorSrc[1]] * 256;
        // 16
        key += k[this.colorSrc[2]] * 64;
        // 18
        key += k[this.alphaSrc[0]] * 16;
        // 20
        key += k[this.alphaSrc[1]] * 4;
        // 22
        key += k[this.alphaSrc[2]];
        // 24 bits used total.
        return key;
      };
      this.computeKey1 = function() {
        var k = this.traverseKey;
        var key = k[this.colorOp[0]] * 4096;
        key += k[this.colorOp[1]] * 1024;
        key += k[this.colorOp[2]] * 256;
        key += k[this.alphaOp[0]] * 16;
        key += k[this.alphaOp[1]] * 4;
        key += k[this.alphaOp[2]];
        return key;
      };
      // TODO: remove this. The color should not be part of the key!
      this.computeKey2 = function() {
        return this.envColor[0] * 16777216 + this.envColor[1] * 65536 + this.envColor[2] * 256 + 1 + this.envColor[3];
      };
      this.recomputeKey = function() {
        this.key0 = this.computeKey0();
        this.key1 = this.computeKey1();
        this.key2 = this.computeKey2();
      };
      this.invalidateKey = function() {
        this.key0 = -1;
        // The key of this texture unit must be recomputed when rendering the next time.
        GLImmediate.currentRenderer = null;
      };
    }
    /** @constructor */ function CTexUnit() {
      this.env = new CTexEnv;
      this.enabled_tex1D = false;
      this.enabled_tex2D = false;
      this.enabled_tex3D = false;
      this.enabled_texCube = false;
      this.texTypesEnabled = 0;
      // A bitfield combination of the four flags above, used for fast access to operations.
      this.traverseState = function CTexUnit_traverseState(keyView) {
        if (this.texTypesEnabled) {
          if (this.env.key0 == -1) {
            this.env.recomputeKey();
          }
          keyView.next(this.texTypesEnabled | (this.env.key0 << 4));
          keyView.next(this.env.key1);
          keyView.next(this.env.key2);
        } else {
          // For correctness, must traverse a zero value, theoretically a subsequent integer key could collide with this value otherwise.
          keyView.next(0);
        }
      };
    }
    // Class impls:
    CTexUnit.prototype.enabled = function CTexUnit_enabled() {
      return this.texTypesEnabled;
    };
    CTexUnit.prototype.genPassLines = function CTexUnit_genPassLines(passOutputVar, passInputVar, texUnitID) {
      if (!this.enabled()) {
        return [ "vec4 " + passOutputVar + " = " + passInputVar + ";" ];
      }
      var lines = this.env.genPassLines(passOutputVar, passInputVar, texUnitID).join("\n");
      var texLoadLines = "";
      var texLoadRegex = /(texture.*?\(.*?\))/g;
      var loadCounter = 0;
      var load;
      // As an optimization, merge duplicate identical texture loads to one var.
      while (false) {
        var texLoadExpr = load[1];
        var secondOccurrence = lines.slice(load.index + 1).indexOf(texLoadExpr);
        if (secondOccurrence != -1) {
          // And also has a second occurrence of same load expression..
          // Create new var to store the common load.
          var prefix = TEXENVJIT_NAMESPACE_PREFIX + "env" + texUnitID + "_";
          var texLoadVar = prefix + "texload" + loadCounter++;
          var texLoadLine = "vec4 " + texLoadVar + " = " + texLoadExpr + ";\n";
          texLoadLines += texLoadLine + "\n";
          // Store the generated texture load statements in a temp string to not confuse regex search in progress.
          lines = lines.split(texLoadExpr).join(texLoadVar);
          // Reset regex search, since we modified the string.
          texLoadRegex = /(texture.*\(.*\))/g;
        }
      }
      return [ texLoadLines + lines ];
    };
    CTexUnit.prototype.getTexType = function CTexUnit_getTexType() {
      if (this.enabled_texCube) {
        return GL_TEXTURE_CUBE_MAP;
      } else if (this.enabled_tex3D) {
        return GL_TEXTURE_3D;
      } else if (this.enabled_tex2D) {
        return GL_TEXTURE_2D;
      } else if (this.enabled_tex1D) {
        return GL_TEXTURE_1D;
      }
      return 0;
    };
    CTexEnv.prototype.genPassLines = function CTexEnv_genPassLines(passOutputVar, passInputVar, texUnitID) {
      switch (this.mode) {
       case GL_REPLACE:
        {
          /* RGB:
               * Cv = Cs
               * Av = Ap // Note how this is different, and that we'll
               *            need to track the bound texture internalFormat
               *            to get this right.
               *
               * RGBA:
               * Cv = Cs
               * Av = As
               */ return [ "vec4 " + passOutputVar + " = " + genTexUnitSampleExpr(texUnitID) + ";" ];
        }

       case GL_ADD:
        {
          /* RGBA:
               * Cv = Cp + Cs
               * Av = ApAs
               */ var prefix = TEXENVJIT_NAMESPACE_PREFIX + "env" + texUnitID + "_";
          var texVar = prefix + "tex";
          var colorVar = prefix + "color";
          var alphaVar = prefix + "alpha";
          return [ "vec4 " + texVar + " = " + genTexUnitSampleExpr(texUnitID) + ";", "vec3 " + colorVar + " = " + passInputVar + ".rgb + " + texVar + ".rgb;", "float " + alphaVar + " = " + passInputVar + ".a * " + texVar + ".a;", "vec4 " + passOutputVar + " = vec4(" + colorVar + ", " + alphaVar + ");" ];
        }

       case GL_MODULATE:
        {
          /* RGBA:
               * Cv = CpCs
               * Av = ApAs
               */ var line = [ "vec4 " + passOutputVar, " = ", passInputVar, " * ", genTexUnitSampleExpr(texUnitID), ";" ];
          return [ line.join("") ];
        }

       case GL_DECAL:
        {
          /* RGBA:
               * Cv = Cp(1 - As) + CsAs
               * Av = Ap
               */ var prefix = TEXENVJIT_NAMESPACE_PREFIX + "env" + texUnitID + "_";
          var texVar = prefix + "tex";
          var colorVar = prefix + "color";
          var alphaVar = prefix + "alpha";
          return [ "vec4 " + texVar + " = " + genTexUnitSampleExpr(texUnitID) + ";", [ "vec3 " + colorVar + " = ", passInputVar + ".rgb * (1.0 - " + texVar + ".a)", " + ", texVar + ".rgb * " + texVar + ".a", ";" ].join(""), "float " + alphaVar + " = " + passInputVar + ".a;", "vec4 " + passOutputVar + " = vec4(" + colorVar + ", " + alphaVar + ");" ];
        }

       case GL_BLEND:
        {
          /* RGBA:
               * Cv = Cp(1 - Cs) + CcCs
               * Av = As
               */ var prefix = TEXENVJIT_NAMESPACE_PREFIX + "env" + texUnitID + "_";
          var texVar = prefix + "tex";
          var colorVar = prefix + "color";
          var alphaVar = prefix + "alpha";
          return [ "vec4 " + texVar + " = " + genTexUnitSampleExpr(texUnitID) + ";", [ "vec3 " + colorVar + " = ", passInputVar + ".rgb * (1.0 - " + texVar + ".rgb)", " + ", PRIM_COLOR_VARYING + ".rgb * " + texVar + ".rgb", ";" ].join(""), "float " + alphaVar + " = " + texVar + ".a;", "vec4 " + passOutputVar + " = vec4(" + colorVar + ", " + alphaVar + ");" ];
        }

       case GL_COMBINE:
        {
          var prefix = TEXENVJIT_NAMESPACE_PREFIX + "env" + texUnitID + "_";
          var colorVar = prefix + "color";
          var alphaVar = prefix + "alpha";
          var colorLines = this.genCombinerLines(true, colorVar, passInputVar, texUnitID, this.colorCombiner, this.colorSrc, this.colorOp);
          var alphaLines = this.genCombinerLines(false, alphaVar, passInputVar, texUnitID, this.alphaCombiner, this.alphaSrc, this.alphaOp);
          // Generate scale, but avoid generating an identity op that multiplies by one.
          var scaledColor = (this.colorScale == 1) ? colorVar : (colorVar + " * " + valToFloatLiteral(this.colorScale));
          var scaledAlpha = (this.alphaScale == 1) ? alphaVar : (alphaVar + " * " + valToFloatLiteral(this.alphaScale));
          if (this.colorCombiner === 34479) scaledAlpha = "(" + scaledColor + ").r";
          var line = [ "vec4 " + passOutputVar, " = ", "clamp(vec4(", scaledColor, ", ", scaledAlpha, "), 0.0, 1.0)", ";" ].join("");
          return [].concat(colorLines, alphaLines, [ line ]);
        }
      }
      return abort_noSupport("Unsupported TexEnv mode: " + ptrToString(this.mode));
    };
    CTexEnv.prototype.genCombinerLines = function CTexEnv_getCombinerLines(isColor, outputVar, passInputVar, texUnitID, combiner, srcArr, opArr) {
      var argsNeeded = null;
      switch (combiner) {
       case GL_REPLACE:
        argsNeeded = 1;
        break;

       case GL_MODULATE:
       case GL_ADD:
       case GL_SUBTRACT:
       case 34164:
       // ADD_SIGNED
        case 34478:
       // DOT3_RGB
        case 34479:
        // DOT3_RGBA
        argsNeeded = 2;
        break;

       case GL_INTERPOLATE:
        argsNeeded = 3;
        break;

       default:
        return abort_noSupport("Unsupported combiner: " + ptrToString(combiner));
      }
      var constantExpr = [ "vec4(", valToFloatLiteral(this.envColor[0]), ", ", valToFloatLiteral(this.envColor[1]), ", ", valToFloatLiteral(this.envColor[2]), ", ", valToFloatLiteral(this.envColor[3]), ")" ].join("");
      var src0Expr = (argsNeeded >= 1) ? genCombinerSourceExpr(texUnitID, constantExpr, passInputVar, srcArr[0], opArr[0]) : null;
      var src1Expr = (argsNeeded >= 2) ? genCombinerSourceExpr(texUnitID, constantExpr, passInputVar, srcArr[1], opArr[1]) : null;
      var src2Expr = (argsNeeded >= 3) ? genCombinerSourceExpr(texUnitID, constantExpr, passInputVar, srcArr[2], opArr[2]) : null;
      var outputType = isColor ? "vec3" : "float";
      var lines = null;
      switch (combiner) {
       case GL_REPLACE:
        {
          lines = [ `${outputType} ${outputVar} = ${src0Expr};` ];
          break;
        }

       case GL_MODULATE:
        {
          lines = [ `${outputType} ${outputVar} = ${src0Expr} * ${src1Expr};` ];
          break;
        }

       case GL_ADD:
        {
          lines = [ `${outputType} ${outputVar} = ${src0Expr} + ${src1Expr};` ];
          break;
        }

       case 34164:
        {
          lines = [ `${outputType} ${outputVar} = ${src0Expr} + ${src1Expr} - 0.5;` ];
          break;
        }

       case 34478:
       case 34479:
        {
          lines = [ `vec3 ${outputVar} = vec3(clamp(4.0 * dot(vec3(${src0Expr}) - vec3(0.5), vec3(${src1Expr}) - vec3(0.5)), 0.0, 1.0));` ];
          break;
        }

       case GL_SUBTRACT:
        {
          lines = [ `${outputType} ${outputVar} = ${src0Expr} - ${src1Expr};` ];
          break;
        }

       case GL_INTERPOLATE:
        {
          var prefix = `${TEXENVJIT_NAMESPACE_PREFIX}env${texUnitID}_`;
          var arg2Var = `${prefix}colorSrc2`;
          var arg2Type = getTypeFromCombineOp(this.colorOp[2]);
          lines = [ `${arg2Type} ${arg2Var} = ${src2Expr};`, `${outputType} ${outputVar} = ${src0Expr} * ${arg2Var} + ${src1Expr} * (1.0 - ${arg2Var});` ];
          break;
        }

       default:
        return abort_sanity("Unmatched TexEnv.colorCombiner?");
      }
      return lines;
    };
    return {
      // Exports:
      cofCaptureUnits: () => JSON.parse(JSON.stringify(s_texUnits)),
      cofRestoreUnits: (saved, textures, enables) => {
        for (var i = 0; i < s_texUnits.length; i++) {
          var unit = s_texUnits[i], state = saved[i];
          if (textures) {
            var env = Object.assign(new CTexEnv, state.env);
            Object.assign(unit, state);
            unit.env = env;
          } else if (enables) for (var key of [ "enabled_tex1D", "enabled_tex2D", "enabled_tex3D", "enabled_texCube", "texTypesEnabled" ]) unit[key] = state[key];
        }
        GLImmediate.currentRenderer = null;
      },
      cofIsEnabled: cap => {
        var unit = getCurTexUnit();
        return cap === GL_TEXTURE_2D ? unit.enabled_tex2D : cap === GL_TEXTURE_CUBE_MAP ? unit.enabled_texCube : cap === GL_TEXTURE_1D ? unit.enabled_tex1D : cap === GL_TEXTURE_3D ? unit.enabled_tex3D : null;
      },
      init: (gl, specifiedMaxTextureImageUnits) => {
        var maxTexUnits = 0;
        if (specifiedMaxTextureImageUnits) {
          maxTexUnits = specifiedMaxTextureImageUnits;
        } else if (gl) {
          maxTexUnits = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
        }
        s_texUnits = [];
        for (var i = 0; i < maxTexUnits; i++) {
          s_texUnits.push(new CTexUnit);
        }
      },
      setGLSLVars: (uTexUnitPrefix, vTexCoordPrefix, vPrimColor, uTexMatrixPrefix) => {
        TEX_UNIT_UNIFORM_PREFIX = uTexUnitPrefix;
        TEX_COORD_VARYING_PREFIX = vTexCoordPrefix;
        PRIM_COLOR_VARYING = vPrimColor;
        TEX_MATRIX_UNIFORM_PREFIX = uTexMatrixPrefix;
      },
      genAllPassLines: (resultDest, indentSize = 0) => {
        s_requiredTexUnitsForPass.length = 0;
        // Clear the list.
        var lines = [];
        var lastPassVar = PRIM_COLOR_VARYING;
        for (var i = 0; i < s_texUnits.length; i++) {
          if (!s_texUnits[i].enabled()) continue;
          s_requiredTexUnitsForPass.push(i);
          var prefix = TEXENVJIT_NAMESPACE_PREFIX + "env" + i + "_";
          var passOutputVar = prefix + "result";
          var newLines = s_texUnits[i].genPassLines(passOutputVar, lastPassVar, i);
          lines = lines.concat(newLines, [ "" ]);
          lastPassVar = passOutputVar;
        }
        lines.push(resultDest + " = " + lastPassVar + ";");
        var indent = "";
        for (var i = 0; i < indentSize; i++) indent += " ";
        var output = indent + lines.join("\n" + indent);
        return output;
      },
      getUsedTexUnitList: () => s_requiredTexUnitsForPass,
      getActiveTexture: () => s_activeTexture,
      traverseState: keyView => {
        for (var texUnit of s_texUnits) {
          texUnit.traverseState(keyView);
        }
      },
      getTexUnitType: texUnitID => s_texUnits[texUnitID].getTexType(),
      // Hooks:
      hook_activeTexture: texture => {
        s_activeTexture = texture - GL_TEXTURE0;
        // Check if the current matrix mode is GL_TEXTURE.
        if (GLImmediate.currentMatrix >= 2) {
          // Switch to the corresponding texture matrix stack.
          GLImmediate.currentMatrix = 2 + s_activeTexture;
        }
      },
      hook_enable: cap => {
        var cur = getCurTexUnit();
        switch (cap) {
         case GL_TEXTURE_1D:
          if (!cur.enabled_tex1D) {
            GLImmediate.currentRenderer = null;
            // Renderer state changed, and must be recreated or looked up again.
            cur.enabled_tex1D = true;
            cur.texTypesEnabled |= 1;
          }
          break;

         case GL_TEXTURE_2D:
          if (!cur.enabled_tex2D) {
            GLImmediate.currentRenderer = null;
            cur.enabled_tex2D = true;
            cur.texTypesEnabled |= 2;
          }
          break;

         case GL_TEXTURE_3D:
          if (!cur.enabled_tex3D) {
            GLImmediate.currentRenderer = null;
            cur.enabled_tex3D = true;
            cur.texTypesEnabled |= 4;
          }
          break;

         case GL_TEXTURE_CUBE_MAP:
          if (!cur.enabled_texCube) {
            GLImmediate.currentRenderer = null;
            cur.enabled_texCube = true;
            cur.texTypesEnabled |= 8;
          }
          break;
        }
      },
      hook_disable: cap => {
        var cur = getCurTexUnit();
        switch (cap) {
         case GL_TEXTURE_1D:
          if (cur.enabled_tex1D) {
            GLImmediate.currentRenderer = null;
            // Renderer state changed, and must be recreated or looked up again.
            cur.enabled_tex1D = false;
            cur.texTypesEnabled &= ~1;
          }
          break;

         case GL_TEXTURE_2D:
          if (cur.enabled_tex2D) {
            GLImmediate.currentRenderer = null;
            cur.enabled_tex2D = false;
            cur.texTypesEnabled &= ~2;
          }
          break;

         case GL_TEXTURE_3D:
          if (cur.enabled_tex3D) {
            GLImmediate.currentRenderer = null;
            cur.enabled_tex3D = false;
            cur.texTypesEnabled &= ~4;
          }
          break;

         case GL_TEXTURE_CUBE_MAP:
          if (cur.enabled_texCube) {
            GLImmediate.currentRenderer = null;
            cur.enabled_texCube = false;
            cur.texTypesEnabled &= ~8;
          }
          break;
        }
      },
      hook_texEnvf(target, pname, param) {
        if (target != GL_TEXTURE_ENV) return;
        var env = getCurTexUnit().env;
        switch (pname) {
         case GL_RGB_SCALE:
          if (env.colorScale != param) {
            env.invalidateKey();
            // We changed FFP emulation renderer state.
            env.colorScale = param;
          }
          break;

         case GL_ALPHA_SCALE:
          if (env.alphaScale != param) {
            env.invalidateKey();
            env.alphaScale = param;
          }
          break;

         default:
          err("WARNING: Unhandled `pname` in call to `glTexEnvf`.");
        }
      },
      hook_texEnvi(target, pname, param) {
        if (target != GL_TEXTURE_ENV) return;
        var env = getCurTexUnit().env;
        switch (pname) {
         case GL_TEXTURE_ENV_MODE:
          if (env.mode != param) {
            env.invalidateKey();
            // We changed FFP emulation renderer state.
            env.mode = param;
          }
          break;

         case GL_COMBINE_RGB:
          if (env.colorCombiner != param) {
            env.invalidateKey();
            env.colorCombiner = param;
          }
          break;

         case GL_COMBINE_ALPHA:
          if (env.alphaCombiner != param) {
            env.invalidateKey();
            env.alphaCombiner = param;
          }
          break;

         case GL_SRC0_RGB:
          if (env.colorSrc[0] != param) {
            env.invalidateKey();
            env.colorSrc[0] = param;
          }
          break;

         case GL_SRC1_RGB:
          if (env.colorSrc[1] != param) {
            env.invalidateKey();
            env.colorSrc[1] = param;
          }
          break;

         case GL_SRC2_RGB:
          if (env.colorSrc[2] != param) {
            env.invalidateKey();
            env.colorSrc[2] = param;
          }
          break;

         case GL_SRC0_ALPHA:
          if (env.alphaSrc[0] != param) {
            env.invalidateKey();
            env.alphaSrc[0] = param;
          }
          break;

         case GL_SRC1_ALPHA:
          if (env.alphaSrc[1] != param) {
            env.invalidateKey();
            env.alphaSrc[1] = param;
          }
          break;

         case GL_SRC2_ALPHA:
          if (env.alphaSrc[2] != param) {
            env.invalidateKey();
            env.alphaSrc[2] = param;
          }
          break;

         case GL_OPERAND0_RGB:
          if (env.colorOp[0] != param) {
            env.invalidateKey();
            env.colorOp[0] = param;
          }
          break;

         case GL_OPERAND1_RGB:
          if (env.colorOp[1] != param) {
            env.invalidateKey();
            env.colorOp[1] = param;
          }
          break;

         case GL_OPERAND2_RGB:
          if (env.colorOp[2] != param) {
            env.invalidateKey();
            env.colorOp[2] = param;
          }
          break;

         case GL_OPERAND0_ALPHA:
          if (env.alphaOp[0] != param) {
            env.invalidateKey();
            env.alphaOp[0] = param;
          }
          break;

         case GL_OPERAND1_ALPHA:
          if (env.alphaOp[1] != param) {
            env.invalidateKey();
            env.alphaOp[1] = param;
          }
          break;

         case GL_OPERAND2_ALPHA:
          if (env.alphaOp[2] != param) {
            env.invalidateKey();
            env.alphaOp[2] = param;
          }
          break;

         case GL_RGB_SCALE:
          if (env.colorScale != param) {
            env.invalidateKey();
            env.colorScale = param;
          }
          break;

         case GL_ALPHA_SCALE:
          if (env.alphaScale != param) {
            env.invalidateKey();
            env.alphaScale = param;
          }
          break;

         default:
          err("WARNING: Unhandled `pname` in call to `glTexEnvi`.");
        }
      },
      hook_texEnvfv(target, pname, params) {
        if (target != GL_TEXTURE_ENV) return;
        var env = getCurTexUnit().env;
        switch (pname) {
         case GL_TEXTURE_ENV_COLOR:
          {
            for (var i = 0; i < 4; i++) {
              var param = HEAPF32[(((params) + (i * 4)) >>> 2) >>> 0];
              if (env.envColor[i] != param) {
                env.invalidateKey();
                // We changed FFP emulation renderer state.
                env.envColor[i] = param;
              }
            }
            break;
          }

         default:
          err("WARNING: Unhandled `pname` in call to `glTexEnvfv`.");
        }
      },
      hook_getTexEnviv(target, pname, param) {
        if (target != GL_TEXTURE_ENV) return;
        var env = getCurTexUnit().env;
        switch (pname) {
         case GL_TEXTURE_ENV_MODE:
          HEAP32[((param) >>> 2) >>> 0] = env.mode;
          return;

         case GL_TEXTURE_ENV_COLOR:
          HEAP32[((param) >>> 2) >>> 0] = Math.max(Math.min(env.envColor[0] * 255, 255, -255));
          HEAP32[(((param) + (1)) >>> 2) >>> 0] = Math.max(Math.min(env.envColor[1] * 255, 255, -255));
          HEAP32[(((param) + (2)) >>> 2) >>> 0] = Math.max(Math.min(env.envColor[2] * 255, 255, -255));
          HEAP32[(((param) + (3)) >>> 2) >>> 0] = Math.max(Math.min(env.envColor[3] * 255, 255, -255));
          return;

         case GL_COMBINE_RGB:
          HEAP32[((param) >>> 2) >>> 0] = env.colorCombiner;
          return;

         case GL_COMBINE_ALPHA:
          HEAP32[((param) >>> 2) >>> 0] = env.alphaCombiner;
          return;

         case GL_SRC0_RGB:
          HEAP32[((param) >>> 2) >>> 0] = env.colorSrc[0];
          return;

         case GL_SRC1_RGB:
          HEAP32[((param) >>> 2) >>> 0] = env.colorSrc[1];
          return;

         case GL_SRC2_RGB:
          HEAP32[((param) >>> 2) >>> 0] = env.colorSrc[2];
          return;

         case GL_SRC0_ALPHA:
          HEAP32[((param) >>> 2) >>> 0] = env.alphaSrc[0];
          return;

         case GL_SRC1_ALPHA:
          HEAP32[((param) >>> 2) >>> 0] = env.alphaSrc[1];
          return;

         case GL_SRC2_ALPHA:
          HEAP32[((param) >>> 2) >>> 0] = env.alphaSrc[2];
          return;

         case GL_OPERAND0_RGB:
          HEAP32[((param) >>> 2) >>> 0] = env.colorOp[0];
          return;

         case GL_OPERAND1_RGB:
          HEAP32[((param) >>> 2) >>> 0] = env.colorOp[1];
          return;

         case GL_OPERAND2_RGB:
          HEAP32[((param) >>> 2) >>> 0] = env.colorOp[2];
          return;

         case GL_OPERAND0_ALPHA:
          HEAP32[((param) >>> 2) >>> 0] = env.alphaOp[0];
          return;

         case GL_OPERAND1_ALPHA:
          HEAP32[((param) >>> 2) >>> 0] = env.alphaOp[1];
          return;

         case GL_OPERAND2_ALPHA:
          HEAP32[((param) >>> 2) >>> 0] = env.alphaOp[2];
          return;

         case GL_RGB_SCALE:
          HEAP32[((param) >>> 2) >>> 0] = env.colorScale;
          return;

         case GL_ALPHA_SCALE:
          HEAP32[((param) >>> 2) >>> 0] = env.alphaScale;
          return;

         default:
          err("WARNING: Unhandled `pname` in call to `glGetTexEnvi`.");
        }
      },
      hook_getTexEnvfv: (target, pname, param) => {
        if (target != GL_TEXTURE_ENV) return;
        var env = getCurTexUnit().env;
        switch (pname) {
         case GL_TEXTURE_ENV_COLOR:
          HEAPF32[((param) >>> 2) >>> 0] = env.envColor[0];
          HEAPF32[(((param) + (4)) >>> 2) >>> 0] = env.envColor[1];
          HEAPF32[(((param) + (8)) >>> 2) >>> 0] = env.envColor[2];
          HEAPF32[(((param) + (12)) >>> 2) >>> 0] = env.envColor[3];
          return;
        }
      }
    };
  },
  vertexData: null,
  vertexDataU8: null,
  tempData: null,
  indexData: null,
  vertexCounter: 0,
  mode: -1,
  rendererCache: null,
  rendererComponents: [],
  rendererComponentPointer: 0,
  lastRenderer: null,
  lastArrayBuffer: null,
  lastProgram: null,
  lastStride: -1,
  matrix: [],
  matrixStack: [],
  currentMatrix: 0,
  tempMatrix: null,
  matricesModified: false,
  useTextureMatrix: false,
  VERTEX: 0,
  NORMAL: 1,
  COLOR: 2,
  TEXTURE0: 3,
  NUM_ATTRIBUTES: -1,
  MAX_TEXTURES: -1,
  totalEnabledClientAttributes: 0,
  enabledClientAttributes: [ 0, 0 ],
  clientAttributes: [],
  liveClientAttributes: [],
  currentRenderer: null,
  modifiedClientAttributes: false,
  clientActiveTexture: 0,
  clientColor: null,
  usedTexUnitList: [],
  fixedFunctionProgram: null,
  setClientAttribute(name, size, type, stride, pointer) {
    var attrib = GLImmediate.clientAttributes[name];
    if (!attrib) {
      for (var i = 0; i <= name; i++) {
        // keep flat
        GLImmediate.clientAttributes[i] ||= {
          name,
          size,
          type,
          stride,
          pointer,
          offset: 0
        };
      }
    } else {
      attrib.name = name;
      attrib.size = size;
      attrib.type = type;
      attrib.stride = stride;
      attrib.pointer = pointer;
      attrib.offset = 0;
    }
    GLImmediate.modifiedClientAttributes = true;
  },
  addRendererComponent(name, size, type) {
    if (!GLImmediate.rendererComponents[name]) {
      GLImmediate.rendererComponents[name] = 1;
      GLImmediate.enabledClientAttributes[name] = true;
      GLImmediate.setClientAttribute(name, size, type, 0, GLImmediate.rendererComponentPointer);
      GLImmediate.rendererComponentPointer += size * GL.byteSizeByType[type - GL.byteSizeByTypeRoot];
    } else {
      GLImmediate.rendererComponents[name]++;
    }
  },
  disableBeginEndClientAttributes() {
    for (var i = 0; i < GLImmediate.NUM_ATTRIBUTES; i++) {
      if (GLImmediate.rendererComponents[i]) GLImmediate.enabledClientAttributes[i] = false;
    }
  },
  getRenderer() {
    // If no FFP state has changed that would have forced to re-evaluate which FFP emulation shader to use,
    // we have the currently used renderer in cache, and can immediately return that.
    if (GLImmediate.currentRenderer) {
      return GLImmediate.currentRenderer;
    }
    // return a renderer object given the liveClientAttributes
    // we maintain a cache of renderers, optimized to not generate garbage
    var attributes = GLImmediate.liveClientAttributes;
    var cacheMap = GLImmediate.rendererCache;
    var keyView = cacheMap.getStaticKeyView().reset();
    // By attrib state:
    var enabledAttributesKey = 0;
    for (var attr of attributes) {
      enabledAttributesKey |= 1 << attr.name;
    }
    // To prevent using more than 31 bits add another level to the maptree
    // and reset the enabledAttributesKey for the next glemulation state bits
    keyView.next(enabledAttributesKey);
    enabledAttributesKey = 0;
    // By fog state:
    var fogParam = 0;
    if (GLEmulation.fogEnabled) {
      switch (GLEmulation.fogMode) {
       case 2049:
        // GL_EXP2
        fogParam = 1;
        break;

       case 9729:
        // GL_LINEAR
        fogParam = 2;
        break;

       default:
        // default to GL_EXP
        fogParam = 3;
        break;
      }
    }
    enabledAttributesKey = (enabledAttributesKey << 2) | fogParam;
    // By clip plane mode
    for (var clipPlaneId = 0; clipPlaneId < GLEmulation.MAX_CLIP_PLANES; clipPlaneId++) {
      enabledAttributesKey = (enabledAttributesKey << 1) | GLEmulation.clipPlaneEnabled[clipPlaneId];
    }
    // By lighting mode and enabled lights
    enabledAttributesKey = (enabledAttributesKey << 1) | GLEmulation.lightingEnabled;
    for (var lightId = 0; lightId < GLEmulation.MAX_LIGHTS; lightId++) {
      enabledAttributesKey = (enabledAttributesKey << 1) | (GLEmulation.lightingEnabled ? GLEmulation.lightEnabled[lightId] : 0);
    }
    // By alpha testing mode
    enabledAttributesKey = (enabledAttributesKey << 3) | (GLEmulation.alphaTestEnabled ? (GLEmulation.alphaTestFunc - 512) : 7);
    // By drawing mode:
    enabledAttributesKey = (enabledAttributesKey << 1) | (GLImmediate.mode == GLctx.POINTS ? 1 : 0);
    keyView.next(enabledAttributesKey);
    // By cur program:
    keyView.next(GL.currProgram);
    if (!GL.currProgram) {
      GLImmediate.TexEnvJIT.traverseState(keyView);
    }
    // If we don't already have it, create it.
    var renderer = keyView.get();
    if (!renderer) {
      renderer = GLImmediate.createRenderer();
      GLImmediate.currentRenderer = renderer;
      keyView.set(renderer);
      return renderer;
    }
    GLImmediate.currentRenderer = renderer;
    // Cache the currently used renderer, so later lookups without state changes can get this fast.
    return renderer;
  },
  createRenderer(renderer) {
    var useCurrProgram = !!GL.currProgram;
    var hasTextures = false;
    for (var i = 0; i < GLImmediate.MAX_TEXTURES; i++) {
      var texAttribName = GLImmediate.TEXTURE0 + i;
      if (!GLImmediate.enabledClientAttributes[texAttribName]) continue;
      hasTextures = true;
    }
    /** @constructor */ function Renderer() {
      this.init = function() {
        // For fixed-function shader generation.
        var uTexUnitPrefix = "u_texUnit";
        var aTexCoordPrefix = "a_texCoord";
        var vTexCoordPrefix = "v_texCoord";
        var vPrimColor = "v_color";
        var uTexMatrixPrefix = GLImmediate.useTextureMatrix ? "u_textureMatrix" : null;
        if (useCurrProgram) {
          if (GL.shaderInfos[GL.programShaders[GL.currProgram][0]].type == GLctx.VERTEX_SHADER) {
            this.vertexShader = GL.shaders[GL.programShaders[GL.currProgram][0]];
            this.fragmentShader = GL.shaders[GL.programShaders[GL.currProgram][1]];
          } else {
            this.vertexShader = GL.shaders[GL.programShaders[GL.currProgram][1]];
            this.fragmentShader = GL.shaders[GL.programShaders[GL.currProgram][0]];
          }
          this.program = GL.programs[GL.currProgram];
          this.usedTexUnitList = [];
        } else {
          // IMPORTANT NOTE: If you parameterize the shader source based on any runtime values
          // in order to create the least expensive shader possible based on the features being
          // used, you should also update the code in the beginning of getRenderer to make sure
          // that you cache the renderer based on the said parameters.
          if (GLEmulation.fogEnabled) {
            switch (GLEmulation.fogMode) {
             case 2049:
              // GL_EXP2
              // fog = exp(-(gl_Fog.density * gl_FogFragCoord)^2)
              var fogFormula = "  float fog = exp(-u_fogDensity * u_fogDensity * ecDistance * ecDistance); \n";
              break;

             case 9729:
              // GL_LINEAR
              // fog = (gl_Fog.end - gl_FogFragCoord) * gl_fog.scale
              var fogFormula = "  float fog = (u_fogEnd - ecDistance) * u_fogScale; \n";
              break;

             default:
              // default to GL_EXP
              // fog = exp(-gl_Fog.density * gl_FogFragCoord)
              var fogFormula = "  float fog = exp(-u_fogDensity * ecDistance); \n";
              break;
            }
          }
          GLImmediate.TexEnvJIT.setGLSLVars(uTexUnitPrefix, vTexCoordPrefix, vPrimColor, uTexMatrixPrefix);
          var fsTexEnvPass = GLImmediate.TexEnvJIT.genAllPassLines("gl_FragColor", 2);
          var texUnitAttribList = "";
          var texUnitVaryingList = "";
          var texUnitUniformList = "";
          var vsTexCoordInits = "";
          this.usedTexUnitList = GLImmediate.TexEnvJIT.getUsedTexUnitList();
          for (var texUnit of this.usedTexUnitList) {
            texUnitAttribList += "attribute vec4 " + aTexCoordPrefix + texUnit + ";\n";
            texUnitVaryingList += "varying vec4 " + vTexCoordPrefix + texUnit + ";\n";
            texUnitUniformList += "uniform " + (GLImmediate.TexEnvJIT.getTexUnitType(texUnit) === 34067 ? "samplerCube " : "sampler2D ") + uTexUnitPrefix + texUnit + ";\n";
            vsTexCoordInits += "  " + vTexCoordPrefix + texUnit + " = " + aTexCoordPrefix + texUnit + ";\n";
            if (GLImmediate.useTextureMatrix) {
              texUnitUniformList += "uniform mat4 " + uTexMatrixPrefix + texUnit + ";\n";
            }
          }
          var vsFogVaryingInit = null;
          if (GLEmulation.fogEnabled) {
            vsFogVaryingInit = "  v_fogFragCoord = abs(ecPosition.z);\n";
          }
          var vsPointSizeDefs = null;
          var vsPointSizeInit = null;
          if (GLImmediate.mode == GLctx.POINTS) {
            vsPointSizeDefs = "uniform float u_pointSize;\n";
            vsPointSizeInit = "  gl_PointSize = u_pointSize;\n";
          }
          var vsClipPlaneDefs = "";
          var vsClipPlaneInit = "";
          var fsClipPlaneDefs = "";
          var fsClipPlanePass = "";
          for (var clipPlaneId = 0; clipPlaneId < GLEmulation.MAX_CLIP_PLANES; clipPlaneId++) {
            if (GLEmulation.clipPlaneEnabled[clipPlaneId]) {
              vsClipPlaneDefs += "uniform vec4 u_clipPlaneEquation" + clipPlaneId + ";";
              vsClipPlaneDefs += "varying float v_clipDistance" + clipPlaneId + ";";
              vsClipPlaneInit += "  v_clipDistance" + clipPlaneId + " = dot(ecPosition, u_clipPlaneEquation" + clipPlaneId + ");";
              fsClipPlaneDefs += "varying float v_clipDistance" + clipPlaneId + ";";
              fsClipPlanePass += "  if (v_clipDistance" + clipPlaneId + " < 0.0) discard;";
            }
          }
          var vsLightingDefs = "";
          var vsLightingPass = "";
          if (GLEmulation.lightingEnabled) {
            vsLightingDefs += "attribute vec3 a_normal;";
            vsLightingDefs += "uniform mat3 u_normalMatrix;";
            vsLightingDefs += "uniform vec4 u_lightModelAmbient;";
            vsLightingDefs += "uniform vec4 u_materialAmbient;";
            vsLightingDefs += "uniform vec4 u_materialDiffuse;";
            vsLightingDefs += "uniform vec4 u_materialSpecular;";
            vsLightingDefs += "uniform float u_materialShininess;";
            vsLightingDefs += "uniform vec4 u_materialEmission;";
            vsLightingPass += "  vec3 ecNormal = normalize(u_normalMatrix * a_normal);";
            vsLightingPass += "  v_color.w = u_materialDiffuse.w;";
            vsLightingPass += "  v_color.xyz = u_materialEmission.xyz;";
            vsLightingPass += "  v_color.xyz += u_lightModelAmbient.xyz * u_materialAmbient.xyz;";
            for (var lightId = 0; lightId < GLEmulation.MAX_LIGHTS; lightId++) {
              if (GLEmulation.lightEnabled[lightId]) {
                vsLightingDefs += "uniform vec4 u_lightAmbient" + lightId + ";";
                vsLightingDefs += "uniform vec4 u_lightDiffuse" + lightId + ";";
                vsLightingDefs += "uniform vec4 u_lightSpecular" + lightId + ";";
                vsLightingDefs += "uniform vec4 u_lightPosition" + lightId + ";";
                vsLightingPass += "  {";
                vsLightingPass += "    vec3 lightDirection = normalize(u_lightPosition" + lightId + ").xyz;";
                vsLightingPass += "    vec3 halfVector = normalize(lightDirection + vec3(0,0,1));";
                vsLightingPass += "    vec3 ambient = u_lightAmbient" + lightId + ".xyz * u_materialAmbient.xyz;";
                vsLightingPass += "    float diffuseI = max(dot(ecNormal, lightDirection), 0.0);";
                vsLightingPass += "    float specularI = max(dot(ecNormal, halfVector), 0.0);";
                vsLightingPass += "    vec3 diffuse = diffuseI * u_lightDiffuse" + lightId + ".xyz * u_materialDiffuse.xyz;";
                vsLightingPass += "    specularI = (diffuseI > 0.0 && specularI > 0.0) ? exp(u_materialShininess * log(specularI)) : 0.0;";
                vsLightingPass += "    vec3 specular = specularI * u_lightSpecular" + lightId + ".xyz * u_materialSpecular.xyz;";
                vsLightingPass += "    v_color.xyz += ambient + diffuse + specular;";
                vsLightingPass += "  }";
              }
            }
            vsLightingPass += "  v_color = clamp(v_color, 0.0, 1.0);";
          }
          var vsSource = [ "attribute vec4 a_position;", "attribute vec4 a_color;", "varying vec4 v_color;", texUnitAttribList, texUnitVaryingList, (GLEmulation.fogEnabled ? "varying float v_fogFragCoord;" : null), "uniform mat4 u_modelView;", "uniform mat4 u_projection;", vsPointSizeDefs, vsClipPlaneDefs, vsLightingDefs, "void main()", "{", "  vec4 ecPosition = u_modelView * a_position;", // eye-coordinate position
          "  gl_Position = u_projection * ecPosition;", "  v_color = a_color;", vsTexCoordInits, vsFogVaryingInit, vsPointSizeInit, vsClipPlaneInit, vsLightingPass, "}", "" ].join("\n").replace(/\n\n+/g, "\n");
          this.vertexShader = GLctx.createShader(GLctx.VERTEX_SHADER);
          GLctx.shaderSource(this.vertexShader, vsSource);
          GLctx.compileShader(this.vertexShader);
          var fogHeaderIfNeeded = null;
          if (GLEmulation.fogEnabled) {
            fogHeaderIfNeeded = [ "", "varying float v_fogFragCoord; ", "uniform vec4 u_fogColor;      ", "uniform float u_fogEnd;       ", "uniform float u_fogScale;     ", "uniform float u_fogDensity;   ", "float ffog(in float ecDistance) { ", fogFormula, "  fog = clamp(fog, 0.0, 1.0); ", "  return fog;                 ", "}", "" ].join("\n");
          }
          var fogPass = null;
          if (GLEmulation.fogEnabled) {
            fogPass = "gl_FragColor = vec4(mix(u_fogColor.rgb, gl_FragColor.rgb, ffog(v_fogFragCoord)), gl_FragColor.a);\n";
          }
          var fsAlphaTestDefs = "";
          var fsAlphaTestPass = "";
          if (GLEmulation.alphaTestEnabled) {
            fsAlphaTestDefs = "uniform float u_alphaTestRef;";
            switch (GLEmulation.alphaTestFunc) {
             case 512:
              // GL_NEVER
              fsAlphaTestPass = "discard;";
              break;

             case 513:
              // GL_LESS
              fsAlphaTestPass = "if (!(gl_FragColor.a < u_alphaTestRef)) { discard; }";
              break;

             case 514:
              // GL_EQUAL
              fsAlphaTestPass = "if (!(gl_FragColor.a == u_alphaTestRef)) { discard; }";
              break;

             case 515:
              // GL_LEQUAL
              fsAlphaTestPass = "if (!(gl_FragColor.a <= u_alphaTestRef)) { discard; }";
              break;

             case 516:
              // GL_GREATER
              fsAlphaTestPass = "if (!(gl_FragColor.a > u_alphaTestRef)) { discard; }";
              break;

             case 517:
              // GL_NOTEQUAL
              fsAlphaTestPass = "if (!(gl_FragColor.a != u_alphaTestRef)) { discard; }";
              break;

             case 518:
              // GL_GEQUAL
              fsAlphaTestPass = "if (!(gl_FragColor.a >= u_alphaTestRef)) { discard; }";
              break;

             case 519:
              // GL_ALWAYS
              fsAlphaTestPass = "";
              break;
            }
          }
          var fsSource = [ "precision mediump float;", texUnitVaryingList, texUnitUniformList, "varying vec4 v_color;", fogHeaderIfNeeded, fsClipPlaneDefs, fsAlphaTestDefs, "void main()", "{", fsClipPlanePass, fsTexEnvPass, fogPass, fsAlphaTestPass, "}", "" ].join("\n").replace(/\n\n+/g, "\n");
          this.fragmentShader = GLctx.createShader(GLctx.FRAGMENT_SHADER);
          GLctx.shaderSource(this.fragmentShader, fsSource);
          GLctx.compileShader(this.fragmentShader);
          this.program = GLctx.createProgram();
          GLctx.attachShader(this.program, this.vertexShader);
          GLctx.attachShader(this.program, this.fragmentShader);
          // As optimization, bind all attributes to prespecified locations, so that the FFP emulation
          // code can submit attributes to any generated FFP shader without having to examine each shader in turn.
          // These prespecified locations are only assumed if GL_FFP_ONLY is specified, since user could also create their
          // own shaders that didn't have attributes in the same locations.
          GLctx.bindAttribLocation(this.program, GLImmediate.VERTEX, "a_position");
          GLctx.bindAttribLocation(this.program, GLImmediate.COLOR, "a_color");
          GLctx.bindAttribLocation(this.program, GLImmediate.NORMAL, "a_normal");
          var maxVertexAttribs = GLctx.getParameter(GLctx.MAX_VERTEX_ATTRIBS);
          for (var i = 0; i < GLImmediate.MAX_TEXTURES && GLImmediate.TEXTURE0 + i < maxVertexAttribs; i++) {
            GLctx.bindAttribLocation(this.program, GLImmediate.TEXTURE0 + i, "a_texCoord" + i);
            GLctx.bindAttribLocation(this.program, GLImmediate.TEXTURE0 + i, aTexCoordPrefix + i);
          }
          GLctx.linkProgram(this.program);
        }
        // Stores an array that remembers which matrix uniforms are up-to-date in this FFP renderer, so they don't need to be resubmitted
        // each time we render with this program.
        this.textureMatrixVersion = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
        this.positionLocation = GLctx.getAttribLocation(this.program, "a_position");
        this.texCoordLocations = [];
        for (var i = 0; i < GLImmediate.MAX_TEXTURES; i++) {
          if (!GLImmediate.enabledClientAttributes[GLImmediate.TEXTURE0 + i]) {
            this.texCoordLocations[i] = -1;
            continue;
          }
          if (useCurrProgram) {
            this.texCoordLocations[i] = GLctx.getAttribLocation(this.program, `a_texCoord${i}`);
          } else {
            this.texCoordLocations[i] = GLctx.getAttribLocation(this.program, aTexCoordPrefix + i);
          }
        }
        this.colorLocation = GLctx.getAttribLocation(this.program, "a_color");
        if (!useCurrProgram) {
          // Temporarily switch to the program so we can set our sampler uniforms early.
          var prevBoundProg = GLctx.getParameter(GLctx.CURRENT_PROGRAM);
          GLctx.useProgram(this.program);
          {
            for (var i = 0; i < this.usedTexUnitList.length; i++) {
              var texUnitID = this.usedTexUnitList[i];
              var texSamplerLoc = GLctx.getUniformLocation(this.program, uTexUnitPrefix + texUnitID);
              GLctx.uniform1i(texSamplerLoc, texUnitID);
            }
          }
          // The default color attribute value is not the same as the default for all other attribute streams (0,0,0,1) but (1,1,1,1),
          // so explicitly set it right at start.
          GLctx.vertexAttrib4fv(this.colorLocation, [ 1, 1, 1, 1 ]);
          GLctx.useProgram(prevBoundProg);
        }
        this.textureMatrixLocations = [];
        for (var i = 0; i < GLImmediate.MAX_TEXTURES; i++) {
          this.textureMatrixLocations[i] = GLctx.getUniformLocation(this.program, `u_textureMatrix${i}`);
        }
        this.normalLocation = GLctx.getAttribLocation(this.program, "a_normal");
        this.modelViewLocation = GLctx.getUniformLocation(this.program, "u_modelView");
        this.projectionLocation = GLctx.getUniformLocation(this.program, "u_projection");
        this.normalMatrixLocation = GLctx.getUniformLocation(this.program, "u_normalMatrix");
        this.hasTextures = hasTextures;
        this.hasNormal = GLImmediate.enabledClientAttributes[GLImmediate.NORMAL] && GLImmediate.clientAttributes[GLImmediate.NORMAL].size > 0 && this.normalLocation >= 0;
        this.hasColor = (this.colorLocation === 0) || this.colorLocation > 0;
        this.floatType = GLctx.FLOAT;
        // minor optimization
        this.fogColorLocation = GLctx.getUniformLocation(this.program, "u_fogColor");
        this.fogEndLocation = GLctx.getUniformLocation(this.program, "u_fogEnd");
        this.fogScaleLocation = GLctx.getUniformLocation(this.program, "u_fogScale");
        this.fogDensityLocation = GLctx.getUniformLocation(this.program, "u_fogDensity");
        this.hasFog = !!(this.fogColorLocation || this.fogEndLocation || this.fogScaleLocation || this.fogDensityLocation);
        this.pointSizeLocation = GLctx.getUniformLocation(this.program, "u_pointSize");
        this.hasClipPlane = false;
        this.clipPlaneEquationLocation = [];
        for (var clipPlaneId = 0; clipPlaneId < GLEmulation.MAX_CLIP_PLANES; clipPlaneId++) {
          this.clipPlaneEquationLocation[clipPlaneId] = GLctx.getUniformLocation(this.program, `u_clipPlaneEquation${clipPlaneId}`);
          this.hasClipPlane = (this.hasClipPlane || this.clipPlaneEquationLocation[clipPlaneId]);
        }
        this.hasLighting = GLEmulation.lightingEnabled;
        this.lightModelAmbientLocation = GLctx.getUniformLocation(this.program, "u_lightModelAmbient");
        this.materialAmbientLocation = GLctx.getUniformLocation(this.program, "u_materialAmbient");
        this.materialDiffuseLocation = GLctx.getUniformLocation(this.program, "u_materialDiffuse");
        this.materialSpecularLocation = GLctx.getUniformLocation(this.program, "u_materialSpecular");
        this.materialShininessLocation = GLctx.getUniformLocation(this.program, "u_materialShininess");
        this.materialEmissionLocation = GLctx.getUniformLocation(this.program, "u_materialEmission");
        this.lightAmbientLocation = [];
        this.lightDiffuseLocation = [];
        this.lightSpecularLocation = [];
        this.lightPositionLocation = [];
        for (var lightId = 0; lightId < GLEmulation.MAX_LIGHTS; lightId++) {
          this.lightAmbientLocation[lightId] = GLctx.getUniformLocation(this.program, `u_lightAmbient${lightId}`);
          this.lightDiffuseLocation[lightId] = GLctx.getUniformLocation(this.program, `u_lightDiffuse${lightId}`);
          this.lightSpecularLocation[lightId] = GLctx.getUniformLocation(this.program, `u_lightSpecular${lightId}`);
          this.lightPositionLocation[lightId] = GLctx.getUniformLocation(this.program, `u_lightPosition${lightId}`);
        }
        this.hasAlphaTest = GLEmulation.alphaTestEnabled;
        this.alphaTestRefLocation = GLctx.getUniformLocation(this.program, "u_alphaTestRef");
      };
      this.prepare = function() {
        // Calculate the array buffer
        var arrayBuffer;
        if (!GLctx.currentArrayBufferBinding) {
          var start = GLImmediate.firstVertex * GLImmediate.stride;
          var end = GLImmediate.lastVertex * GLImmediate.stride;
          arrayBuffer = GL.getTempVertexBuffer(end);
        } else {
          arrayBuffer = GLctx.currentArrayBufferBinding;
        }
        // If the array buffer is unchanged and the renderer as well, then we can avoid all the work here
        // XXX We use some heuristics here, and this may not work in all cases. Try disabling GL_UNSAFE_OPTS if you
        // have odd glitches
        var lastRenderer = GLImmediate.lastRenderer;
        var canSkip = this == lastRenderer && arrayBuffer == GLImmediate.lastArrayBuffer && (GL.currProgram || this.program) == GLImmediate.lastProgram && GLImmediate.stride == GLImmediate.lastStride && !GLImmediate.matricesModified;
        if (!canSkip && lastRenderer) lastRenderer.cleanup();
        if (!GLctx.currentArrayBufferBinding) {
          // Bind the array buffer and upload data after cleaning up the previous renderer
          if (arrayBuffer != GLImmediate.lastArrayBuffer) {
            GLctx.bindBuffer(GLctx.ARRAY_BUFFER, arrayBuffer);
            GLImmediate.lastArrayBuffer = arrayBuffer;
          }
          GLctx.bufferSubData(GLctx.ARRAY_BUFFER, start, GLImmediate.vertexData.subarray(start >> 2, end >> 2));
        }
        if (canSkip) return;
        GLImmediate.lastRenderer = this;
        GLImmediate.lastProgram = GL.currProgram || this.program;
        GLImmediate.lastStride = GLImmediate.stride;
        GLImmediate.matricesModified = false;
        if (!GL.currProgram) {
          if (GLImmediate.fixedFunctionProgram != this.program) {
            GLctx.useProgram(this.program);
            GLImmediate.fixedFunctionProgram = this.program;
          }
        }
        if (this.modelViewLocation && this.modelViewMatrixVersion != GLImmediate.matrixVersion[0]) {
          this.modelViewMatrixVersion = GLImmediate.matrixVersion[0];
          GLctx.uniformMatrix4fv(this.modelViewLocation, false, GLImmediate.matrix[0]);
          // set normal matrix to the upper 3x3 of the inverse transposed current modelview matrix
          if (GLEmulation.lightEnabled) {
            var tmpMVinv = GLImmediate.matrixLib.mat4.create(GLImmediate.matrix[0]);
            GLImmediate.matrixLib.mat4.inverse(tmpMVinv);
            GLImmediate.matrixLib.mat4.transpose(tmpMVinv);
            GLctx.uniformMatrix3fv(this.normalMatrixLocation, false, GLImmediate.matrixLib.mat4.toMat3(tmpMVinv));
          }
        }
        if (this.projectionLocation && this.projectionMatrixVersion != GLImmediate.matrixVersion[1]) {
          this.projectionMatrixVersion = GLImmediate.matrixVersion[1];
          GLctx.uniformMatrix4fv(this.projectionLocation, false, GLImmediate.matrix[1]);
        }
        var clientAttributes = GLImmediate.clientAttributes;
        var posAttr = clientAttributes[GLImmediate.VERTEX];
        GLctx.vertexAttribPointer(this.positionLocation, posAttr.size, posAttr.type, false, GLImmediate.stride, posAttr.offset);
        GLctx.enableVertexAttribArray(this.positionLocation);
        if (this.hasNormal) {
          var normalAttr = clientAttributes[GLImmediate.NORMAL];
          GLctx.vertexAttribPointer(this.normalLocation, normalAttr.size, normalAttr.type, true, GLImmediate.stride, normalAttr.offset);
          GLctx.enableVertexAttribArray(this.normalLocation);
        }
        if (this.hasTextures) {
          for (var i = 0; i < GLImmediate.MAX_TEXTURES; i++) {
            var attribLoc = this.texCoordLocations[i];
            if (attribLoc === undefined || attribLoc < 0) continue;
            var texAttr = clientAttributes[GLImmediate.TEXTURE0 + i];
            if (texAttr.size) {
              GLctx.vertexAttribPointer(attribLoc, texAttr.size, texAttr.type, false, GLImmediate.stride, texAttr.offset);
              GLctx.enableVertexAttribArray(attribLoc);
            } else {
              // These two might be dangerous, but let's try them.
              GLctx.vertexAttrib4f(attribLoc, 0, 0, 0, 1);
              GLctx.disableVertexAttribArray(attribLoc);
            }
            var t = 2 + i;
            if (this.textureMatrixLocations[i] && this.textureMatrixVersion[t] != GLImmediate.matrixVersion[t]) {
              // XXX might we need this even without the condition we are currently in?
              this.textureMatrixVersion[t] = GLImmediate.matrixVersion[t];
              GLctx.uniformMatrix4fv(this.textureMatrixLocations[i], false, GLImmediate.matrix[t]);
            }
          }
        }
        if (GLImmediate.enabledClientAttributes[GLImmediate.COLOR]) {
          var colorAttr = clientAttributes[GLImmediate.COLOR];
          GLctx.vertexAttribPointer(this.colorLocation, colorAttr.size, colorAttr.type, true, GLImmediate.stride, colorAttr.offset);
          GLctx.enableVertexAttribArray(this.colorLocation);
        } else if (this.hasColor) {
          GLctx.disableVertexAttribArray(this.colorLocation);
          GLctx.vertexAttrib4fv(this.colorLocation, GLImmediate.clientColor);
        }
        if (this.hasFog) {
          if (this.fogColorLocation) GLctx.uniform4fv(this.fogColorLocation, GLEmulation.fogColor);
          if (this.fogEndLocation) GLctx.uniform1f(this.fogEndLocation, GLEmulation.fogEnd);
          if (this.fogScaleLocation) GLctx.uniform1f(this.fogScaleLocation, 1 / (GLEmulation.fogEnd - GLEmulation.fogStart));
          if (this.fogDensityLocation) GLctx.uniform1f(this.fogDensityLocation, GLEmulation.fogDensity);
        }
        if (this.hasClipPlane) {
          for (var clipPlaneId = 0; clipPlaneId < GLEmulation.MAX_CLIP_PLANES; clipPlaneId++) {
            if (this.clipPlaneEquationLocation[clipPlaneId]) GLctx.uniform4fv(this.clipPlaneEquationLocation[clipPlaneId], GLEmulation.clipPlaneEquation[clipPlaneId]);
          }
        }
        if (this.hasLighting) {
          if (this.lightModelAmbientLocation) GLctx.uniform4fv(this.lightModelAmbientLocation, GLEmulation.lightModelAmbient);
          if (this.materialAmbientLocation) GLctx.uniform4fv(this.materialAmbientLocation, GLEmulation.materialAmbient);
          if (this.materialDiffuseLocation) GLctx.uniform4fv(this.materialDiffuseLocation, GLEmulation.materialDiffuse);
          if (this.materialSpecularLocation) GLctx.uniform4fv(this.materialSpecularLocation, GLEmulation.materialSpecular);
          if (this.materialShininessLocation) GLctx.uniform1f(this.materialShininessLocation, GLEmulation.materialShininess[0]);
          if (this.materialEmissionLocation) GLctx.uniform4fv(this.materialEmissionLocation, GLEmulation.materialEmission);
          for (var lightId = 0; lightId < GLEmulation.MAX_LIGHTS; lightId++) {
            if (this.lightAmbientLocation[lightId]) GLctx.uniform4fv(this.lightAmbientLocation[lightId], GLEmulation.lightAmbient[lightId]);
            if (this.lightDiffuseLocation[lightId]) GLctx.uniform4fv(this.lightDiffuseLocation[lightId], GLEmulation.lightDiffuse[lightId]);
            if (this.lightSpecularLocation[lightId]) GLctx.uniform4fv(this.lightSpecularLocation[lightId], GLEmulation.lightSpecular[lightId]);
            if (this.lightPositionLocation[lightId]) GLctx.uniform4fv(this.lightPositionLocation[lightId], GLEmulation.lightPosition[lightId]);
          }
        }
        if (this.hasAlphaTest) {
          if (this.alphaTestRefLocation) GLctx.uniform1f(this.alphaTestRefLocation, GLEmulation.alphaTestRef);
        }
        if (GLImmediate.mode == GLctx.POINTS) {
          if (this.pointSizeLocation) {
            GLctx.uniform1f(this.pointSizeLocation, GLEmulation.pointSize);
          }
        }
      };
      this.cleanup = function() {
        GLctx.disableVertexAttribArray(this.positionLocation);
        if (this.hasTextures) {
          for (var i = 0; i < GLImmediate.MAX_TEXTURES; i++) {
            if (GLImmediate.enabledClientAttributes[GLImmediate.TEXTURE0 + i] && this.texCoordLocations[i] >= 0) {
              GLctx.disableVertexAttribArray(this.texCoordLocations[i]);
            }
          }
        }
        if (this.hasColor) {
          GLctx.disableVertexAttribArray(this.colorLocation);
        }
        if (this.hasNormal) {
          GLctx.disableVertexAttribArray(this.normalLocation);
        }
        if (!GL.currProgram) {
          GLctx.useProgram(null);
          GLImmediate.fixedFunctionProgram = 0;
        }
        if (!GLctx.currentArrayBufferBinding) {
          GLctx.bindBuffer(GLctx.ARRAY_BUFFER, null);
          GLImmediate.lastArrayBuffer = null;
        }
        GLImmediate.lastRenderer = null;
        GLImmediate.lastProgram = null;
        GLImmediate.matricesModified = true;
      };
      this.init();
    }
    return new Renderer;
  },
  setupFuncs() {
    // TexEnv stuff needs to be prepared early, so do it here.
    // init() is too late for -O2, since it freezes the GL functions
    // by that point.
    GLImmediate.MapTreeLib = GLImmediate.spawnMapTreeLib();
    GLImmediate.spawnMapTreeLib = null;
    GLImmediate.TexEnvJIT = GLImmediate.spawnTexEnvJIT();
    GLImmediate.spawnTexEnvJIT = null;
    GLImmediate.setupHooks();
  },
  setupHooks() {
    if (!GLEmulation.hasRunInit) {
      GLEmulation.init();
    }
    var glActiveTexture = _glActiveTexture;
    _glActiveTexture = _emscripten_glActiveTexture = texture => {
      GLImmediate.TexEnvJIT.hook_activeTexture(texture);
      glActiveTexture(texture);
    };
    var glEnable = _glEnable;
    _glEnable = _emscripten_glEnable = cap => {
      GLImmediate.TexEnvJIT.hook_enable(cap);
      glEnable(cap);
    };
    var glDisable = _glDisable;
    _glDisable = _emscripten_glDisable = cap => {
      GLImmediate.TexEnvJIT.hook_disable(cap);
      glDisable(cap);
    };
    var glTexEnvf = (typeof _glTexEnvf != "undefined") ? _glTexEnvf : () => {};
    /** @suppress {checkTypes} */ _glTexEnvf = _emscripten_glTexEnvf = (target, pname, param) => {
      GLImmediate.TexEnvJIT.hook_texEnvf(target, pname, param);
    };
    var glTexEnvi = (typeof _glTexEnvi != "undefined") ? _glTexEnvi : () => {};
    /** @suppress {checkTypes} */ _glTexEnvi = _emscripten_glTexEnvi = (target, pname, param) => {
      param >>>= 0;
      GLImmediate.TexEnvJIT.hook_texEnvi(target, pname, param);
    };
    var glTexEnvfv = (typeof _glTexEnvfv != "undefined") ? _glTexEnvfv : () => {};
    /** @suppress {checkTypes} */ _glTexEnvfv = _emscripten_glTexEnvfv = (target, pname, param) => {
      param >>>= 0;
      GLImmediate.TexEnvJIT.hook_texEnvfv(target, pname, param);
    };
    _glGetTexEnviv = (target, pname, param) => {
      param >>>= 0;
      GLImmediate.TexEnvJIT.hook_getTexEnviv(target, pname, param);
    };
    _glGetTexEnvfv = (target, pname, param) => {
      param >>>= 0;
      GLImmediate.TexEnvJIT.hook_getTexEnvfv(target, pname, param);
    };
    var glGetIntegerv = _glGetIntegerv;
    _glGetIntegerv = _emscripten_glGetIntegerv = (pname, params) => {
      switch (pname) {
       case 35725:
        {
          // GL_CURRENT_PROGRAM
          // Just query directly so we're working with WebGL objects.
          var cur = GLctx.getParameter(GLctx.CURRENT_PROGRAM);
          if (cur == GLImmediate.fixedFunctionProgram) {
            // Pretend we're not using a program.
            HEAP32[((params) >>> 2) >>> 0] = 0;
            return;
          }
          break;
        }
      }
      glGetIntegerv(pname, params);
    };
  },
  initted: false,
  init() {
    err("WARNING: using emscripten GL immediate mode emulation. This is very limited in what it supports");
    GLImmediate.initted = true;
    if (!Browser.useWebGL) return;
    // a 2D canvas may be currently used TODO: make sure we are actually called in that case
    // User can override the maximum number of texture units that we emulate. Using fewer texture units increases runtime performance
    // slightly, so it is advantageous to choose as small value as needed.
    // Limit to a maximum of 28 to not overflow the state bits used for renderer caching (31 bits = 3 attributes + 28 texture units).
    GLImmediate.MAX_TEXTURES = Math.min(Module["GL_MAX_TEXTURE_IMAGE_UNITS"] || GLctx.getParameter(GLctx.MAX_TEXTURE_IMAGE_UNITS), 28);
    GLImmediate.TexEnvJIT.init(GLctx, GLImmediate.MAX_TEXTURES);
    GLImmediate.NUM_ATTRIBUTES = 3 + GLImmediate.MAX_TEXTURES;
    GLImmediate.clientAttributes = [];
    GLEmulation.enabledClientAttribIndices = [];
    for (var i = 0; i < GLImmediate.NUM_ATTRIBUTES; i++) {
      GLImmediate.clientAttributes.push({});
      GLEmulation.enabledClientAttribIndices.push(false);
    }
    // Initialize matrix library
    // When user sets a matrix, increment a 'version number' on the new data, and when rendering, submit
    // the matrices to the shader program only if they have an old version of the data.
    GLImmediate.matrix = [];
    GLImmediate.matrixStack = [];
    GLImmediate.matrixVersion = [];
    for (var i = 0; i < 2 + GLImmediate.MAX_TEXTURES; i++) {
      // Modelview, Projection, plus one matrix for each texture coordinate.
      GLImmediate.matrixStack.push([]);
      GLImmediate.matrixVersion.push(0);
      GLImmediate.matrix.push(GLImmediate.matrixLib.mat4.create());
      GLImmediate.matrixLib.mat4.identity(GLImmediate.matrix[i]);
    }
    // Renderer cache
    GLImmediate.rendererCache = GLImmediate.MapTreeLib.create();
    // Buffers for data
    GLImmediate.tempData = new Float32Array(GL.MAX_TEMP_BUFFER_SIZE >> 2);
    GLImmediate.indexData = new Uint16Array(GL.MAX_TEMP_BUFFER_SIZE >> 1);
    GLImmediate.vertexDataU8 = new Uint8Array(GLImmediate.tempData.buffer);
    GL.generateTempBuffers(true, GL.currentContext);
    GLImmediate.clientColor = new Float32Array([ 1, 1, 1, 1 ]);
  },
  prepareClientAttributes(count, beginEnd, first = 0) {
    // If no client attributes were modified since we were last called, do
    // nothing. Note that this does not work for glBegin/End, where we
    // generate renderer components dynamically and then disable them
    // ourselves, but it does help with glDrawElements/Arrays.
    if (!GLImmediate.modifiedClientAttributes && (GLctx.currentArrayBufferBinding || beginEnd)) {
      GLImmediate.vertexCounter = (GLImmediate.stride * count) / 4;
      // XXX assuming float
      return;
    }
    GLImmediate.modifiedClientAttributes = false;
    // The role of prepareClientAttributes is to examine the set of
    // client-side vertex attribute buffers that user code has submitted, and
    // to prepare them to be uploaded to a VBO in GPU memory (since WebGL does
    // not support client-side rendering, i.e. rendering from vertex data in
    // CPU memory). User can submit vertex data generally in three different
    // configurations:
    // 1. Fully planar: all attributes are in their own separate
    //                  tightly-packed arrays in CPU memory.
    // 2. Fully interleaved: all attributes share a single array where data is
    //                       interleaved something like (pos,uv,normal),
    //                       (pos,uv,normal), ...
    // 3. Complex hybrid: Multiple separate arrays that either are sparsely
    //                    strided, and/or partially interleaves vertex
    //                    attributes.
    // For simplicity, we support the case (2) as the fast case. For (1) and
    // (3), we do a memory copy of the vertex data here to prepare a
    // relayouted buffer that is of the structure in case (2). The reason
    // for this is that it allows the emulation code to get away with using
    // just one VBO buffer for rendering, and not have to maintain multiple
    // ones. Therefore cases (1) and (3) will be very slow, and case (2) is
    // fast.
    // Detect which case we are in by using a quick heuristic by examining the
    // strides of the buffers. If all the buffers have identical stride, we
    // assume we have case (2), otherwise we have something more complex.
    var clientStartPointer = 4294967295;
    var bytes = 0;
    // Total number of bytes taken up by a single vertex.
    var minStride = 4294967295;
    var maxStride = 0;
    var attributes = GLImmediate.liveClientAttributes;
    attributes.length = 0;
    for (var i = 0; i < 3 + GLImmediate.MAX_TEXTURES; i++) {
      if (GLImmediate.enabledClientAttributes[i]) {
        var attr = GLImmediate.clientAttributes[i];
        attributes.push(attr);
        clientStartPointer = Math.min(clientStartPointer, attr.pointer);
        attr.sizeBytes = attr.size * GL.byteSizeByType[attr.type - GL.byteSizeByTypeRoot];
        bytes += attr.sizeBytes;
        minStride = Math.min(minStride, attr.stride);
        maxStride = Math.max(maxStride, attr.stride);
      }
    }
    if ((minStride != maxStride || maxStride < bytes) && !beginEnd) {
      // We are in cases (1) or (3): slow path, shuffle the data around into a
      // single interleaved vertex buffer.
      // The immediate-mode glBegin()/glEnd() vertex submission gets
      // automatically generated in appropriate layout, so never need to come
      // down this path if that was used.
      bytes = 0;
      // calculate restrided offsets and total size
      for (var attr of attributes) {
        var size = attr.sizeBytes;
        if (size % 4 != 0) size += 4 - (size % 4);
        // align everything
        attr.offset = bytes;
        bytes += size;
      }
      var needed = count * bytes;
      if (!GLImmediate.restrideBuffer || needed > (GLImmediate.cofRestrideCapacity || 0)) {
        var capacity = Math.max(needed, GL.MAX_TEMP_BUFFER_SIZE), allocation = _malloc(capacity);
        if (!allocation) {
          GL.recordError(1285);
          GLImmediate.vertexCounter = 0;
          return false;
        }
        if (GLImmediate.restrideBuffer) _free(GLImmediate.restrideBuffer);
        GLImmediate.restrideBuffer = allocation;
        GLImmediate.cofRestrideCapacity = capacity;
      }
      var start = GLImmediate.restrideBuffer;
      // Relayout only the requested range of the original client arrays.
      for (var attr of attributes) {
        var srcStride = Math.max(attr.sizeBytes, attr.stride);
        if ((srcStride & 3) == 0 && (attr.sizeBytes & 3) == 0) {
          for (var j = 0; j < count; j++) {
            for (var k = 0; k < attr.sizeBytes; k += 4) {
              // copy in chunks of 4 bytes, our alignment makes this possible
              var val = HEAP32[(((attr.pointer) + ((first + j) * srcStride + k)) >>> 2) >>> 0];
              HEAP32[(((start + attr.offset) + (bytes * j + k)) >>> 2) >>> 0] = val;
            }
          }
        } else {
          for (var j = 0; j < count; j++) {
            for (var k = 0; k < attr.sizeBytes; k++) {
              // source data was not aligned to multiples of 4, must copy byte by byte.
              HEAP8[start + attr.offset + bytes * j + k >>> 0] = HEAP8[attr.pointer + (first + j) * srcStride + k >>> 0];
            }
          }
        }
      }
      GLImmediate.stride = bytes;
      GLImmediate.vertexPointer = start;
    } else {
      // case (2): fast path, all data is interleaved to a single vertex array so we can get away with a single VBO upload.
      if (GLctx.currentArrayBufferBinding) {
        GLImmediate.vertexPointer = 0;
      } else {
        GLImmediate.vertexPointer = clientStartPointer;
      }
      for (var attr of attributes) {
        attr.offset = attr.pointer - GLImmediate.vertexPointer;
      }
      GLImmediate.stride = Math.max(maxStride, bytes);
      if (!beginEnd && !GLctx.currentArrayBufferBinding) GLImmediate.vertexPointer += first * GLImmediate.stride;
    }
    if (!beginEnd) {
      GLImmediate.vertexCounter = (GLImmediate.stride * count) / 4;
    }
  },
  flush(numProvidedIndexes, startIndex = 0, ptr = 0) {
    if (GLImmediate.mode === 9) GLImmediate.mode = 6;
    // POLYGON -> TRIANGLE_FAN
    var renderer = GLImmediate.getRenderer();
    // Generate index data in a format suitable for GLES 2.0/WebGL
    var numVertices = 4 * GLImmediate.vertexCounter / GLImmediate.stride;
    if (!numVertices) return;
    var emulatedElementArrayBuffer = false;
    var numIndexes = 0, cofIndexType = GLctx.UNSIGNED_SHORT;
    if (GLImmediate.mode === 7 || GLImmediate.mode === 8) {
      var count = numProvidedIndexes || numVertices, sourceIndexes = null;
      if (numProvidedIndexes) {
        if (GLctx.currentElementArrayBufferBinding) {
          sourceIndexes = new Uint16Array(count);
          GLctx.getBufferSubData(GLctx.ELEMENT_ARRAY_BUFFER, ptr, sourceIndexes);
        } else sourceIndexes = HEAPU16.subarray(ptr >>> 1 >>> 0, (ptr >>> 1) + count >>> 0);
      }
      var index = i => sourceIndexes ? sourceIndexes[i] : startIndex + i, values = [];
      if (GLImmediate.mode === 7) {
        for (var i = 0; i + 3 < count; i += 4) {
          var a = index(i), b = index(i + 1), c = index(i + 2), d = index(i + 3);
          values.push(a, b, c, a, c, d);
        }
      } else {
        for (var i = 0; i + 3 < count; i += 2) {
          var a = index(i), b = index(i + 1), c = index(i + 2), d = index(i + 3);
          values.push(a, b, d, a, d, c);
        }
      }
      if (!values.length) return;
      var min = values[0], max = min;
      for (var v of values) {
        if (v < min) min = v;
        if (v > max) max = v;
      }
      GLImmediate.firstVertex = Math.min(GLImmediate.firstVertex, min);
      GLImmediate.lastVertex = Math.max(GLImmediate.lastVertex, max + 1);
      var converted = max > 65535 ? new Uint32Array(values) : new Uint16Array(values);
      cofIndexType = max > 65535 ? GLctx.UNSIGNED_INT : GLctx.UNSIGNED_SHORT;
      GLctx.bindBuffer(GLctx.ELEMENT_ARRAY_BUFFER, GL.getTempIndexBuffer(converted.byteLength));
      GLctx.bufferSubData(GLctx.ELEMENT_ARRAY_BUFFER, 0, converted);
      numIndexes = converted.length;
      ptr = 0;
      emulatedElementArrayBuffer = true;
      GLImmediate.mode = GLctx.TRIANGLES;
    } else {
      if (numProvidedIndexes) {
        numIndexes = numProvidedIndexes;
        if (!GLctx.currentArrayBufferBinding && GLImmediate.firstVertex > GLImmediate.lastVertex) {
          // Figure out the first and last vertex from the index data
          for (var i = 0; i < numProvidedIndexes; i++) {
            var currIndex = HEAPU16[(((ptr) + (i * 2)) >>> 1) >>> 0];
            GLImmediate.firstVertex = Math.min(GLImmediate.firstVertex, currIndex);
            GLImmediate.lastVertex = Math.max(GLImmediate.lastVertex, currIndex + 1);
          }
        }
        if (!GLctx.currentElementArrayBufferBinding) {
          // If no element array buffer is bound, then indices is a literal pointer to clientside data
          var indexBuffer = GL.getTempIndexBuffer(numProvidedIndexes << 1);
          GLctx.bindBuffer(GLctx.ELEMENT_ARRAY_BUFFER, indexBuffer);
          GLctx.bufferSubData(GLctx.ELEMENT_ARRAY_BUFFER, 0, HEAPU16.subarray((((ptr) >>> 1)) >>> 0, ((ptr + (numProvidedIndexes << 1)) >>> 1) >>> 0));
          ptr = 0;
          emulatedElementArrayBuffer = true;
        }
      } else if (GLImmediate.mode > 6) {
        // above GL_TRIANGLE_FAN are the non-GL ES modes
        if (GLImmediate.mode != 7) abort("unsupported immediate mode " + GLImmediate.mode);
        // GL_QUADS
        // GLImmediate.firstVertex is the first vertex we want. Quad indexes are
        // in the pattern 0 1 2, 0 2 3, 4 5 6, 4 6 7, so we need to look at
        // index firstVertex * 1.5 to see it.  Then since indexes are 2 bytes
        // each, that means 3
        ptr = GLImmediate.firstVertex * 3;
        var numQuads = numVertices / 4;
        numIndexes = numQuads * 6;
        // 0 1 2, 0 2 3 pattern
        GLctx.bindBuffer(GLctx.ELEMENT_ARRAY_BUFFER, GL.currentContext.tempQuadIndexBuffer);
        emulatedElementArrayBuffer = true;
        GLImmediate.mode = GLctx.TRIANGLES;
      }
    }
    renderer.prepare();
    if (numIndexes) {
      GLctx.drawElements(GLImmediate.mode, numIndexes, cofIndexType, ptr);
    } else {
      GLctx.drawArrays(GLImmediate.mode, startIndex, numVertices);
    }
    if (emulatedElementArrayBuffer) {
      GLctx.bindBuffer(GLctx.ELEMENT_ARRAY_BUFFER, GL.buffers[GLctx.currentElementArrayBufferBinding] || null);
    }
  }
};

function _cof_gl_attrib_query(pname, out) {
  var value = pname === 2992 ? COFAttribStack.frames.length : pname === 3381 ? 16 : pname === 34016 ? 33984 + GLImmediate.TexEnvJIT.getActiveTexture() : pname === 34017 ? 33984 + GLImmediate.clientActiveTexture : pname === 2976 ? (GLImmediate.currentMatrix < 2 ? 5888 + GLImmediate.currentMatrix : 5890) : null;
  if (value === null) return 0;
  HEAP32[out >>> 2 >>> 0] = value;
  return 1;
}

var COFLegacyState = {
  color: [ 1, 1, 1, 1 ],
  normal: [ 0, 0, 1 ],
  coords: [ [ 0, 0, 0, 1 ] ]
};

var _emscripten_glColor4f = (r, g, b, a) => {
  r = Math.max(Math.min(r, 1), 0);
  g = Math.max(Math.min(g, 1), 0);
  b = Math.max(Math.min(b, 1), 0);
  a = Math.max(Math.min(a, 1), 0);
  // TODO: make ub the default, not f, save a few mathops
  if (GLImmediate.mode >= 0) {
    var start = GLImmediate.vertexCounter << 2;
    GLImmediate.vertexDataU8[start + 0] = r * 255;
    GLImmediate.vertexDataU8[start + 1] = g * 255;
    GLImmediate.vertexDataU8[start + 2] = b * 255;
    GLImmediate.vertexDataU8[start + 3] = a * 255;
    GLImmediate.vertexCounter++;
    GLImmediate.addRendererComponent(GLImmediate.COLOR, 4, GLctx.UNSIGNED_BYTE);
  } else {
    GLImmediate.clientColor[0] = r;
    GLImmediate.clientColor[1] = g;
    GLImmediate.clientColor[2] = b;
    GLImmediate.clientColor[3] = a;
  }
};

var _glColor4f = _emscripten_glColor4f;

var _cof_gl_color4f = function(r, g, b, a) {
  COFLegacyState.color = [ r, g, b, a ].map(v => Math.max(0, Math.min(1, v)));
  if (GLImmediate.mode < 0) _glColor4f(r, g, b, a);
};

function _cof_gl_current_attribute(pname, out) {
  var value = pname === 2816 ? COFLegacyState.color : pname === 2818 ? COFLegacyState.normal : pname === 2819 ? (COFLegacyState.coords[GLImmediate.TexEnvJIT.getActiveTexture()] || [ 0, 0, 0, 1 ]) : pname === 2984 ? GLImmediate.matrix[2 + GLImmediate.TexEnvJIT.getActiveTexture()] : null;
  if (!value) return 0;
  HEAPF32.set(value, (out >>> 0) >>> 2 >>> 0);
  return 1;
}

var _emscripten_glEnd = () => {
  GLImmediate.prepareClientAttributes(GLImmediate.rendererComponents[GLImmediate.VERTEX], true);
  GLImmediate.firstVertex = 0;
  GLImmediate.lastVertex = GLImmediate.vertexCounter / (GLImmediate.stride >> 2);
  GLImmediate.flush();
  GLImmediate.disableBeginEndClientAttributes();
  GLImmediate.mode = -1;
  // Pop the old state:
  GLImmediate.enabledClientAttributes = GLImmediate.enabledClientAttributes_preBegin;
  GLImmediate.clientAttributes = GLImmediate.clientAttributes_preBegin;
  GLImmediate.currentRenderer = null;
  // The set of active client attributes changed, we must re-lookup the renderer to use.
  GLImmediate.modifiedClientAttributes = true;
};

var _glEnd = _emscripten_glEnd;

function _cof_gl_end() {
  _glEnd();
  _glColor4f(...COFLegacyState.color);
}

function _cof_gl_error(code) {
  GL.recordError(code);
}

var COFTexGen = {
  units: [],
  version: -1,
  inverse: null,
  get: function(unit) {
    while (this.units.length <= unit) this.units.push(Array.from({
      length: 4
    }, (_, j) => {
      var p = [ 0, 0, 0, 0 ];
      if (j < 2) p[j] = 1;
      return {
        enabled: false,
        mode: 9216,
        object: p.slice(),
        eye: p.slice()
      };
    }));
    return this.units[unit];
  },
  inv: function() {
    var version = GLImmediate.matrixVersion[0];
    if (this.inverse && this.version === version) return this.inverse;
    var m = GLImmediate.matrix[0], a = Array.from({
      length: 4
    }, (_, r) => Array.from({
      length: 8
    }, (_, c) => c < 4 ? m[c * 4 + r] : +(r === c - 4)));
    for (var c = 0; c < 4; c++) {
      var pivot = c;
      for (var r = c + 1; r < 4; r++) if (Math.abs(a[r][c]) > Math.abs(a[pivot][c])) pivot = r;
      if (Math.abs(a[pivot][c]) < 1e-30) return [ 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1 ];
      var tmp = a[c];
      a[c] = a[pivot];
      a[pivot] = tmp;
      var divisor = a[c][c];
      for (var k = 0; k < 8; k++) a[c][k] /= divisor;
      for (var r = 0; r < 4; r++) if (r !== c) {
        var factor = a[r][c];
        for (var k = 0; k < 8; k++) a[r][k] -= factor * a[c][k];
      }
    }
    this.version = version;
    this.inverse = Array.from({
      length: 16
    }, (_, i) => a[i % 4][4 + (i >> 2)]);
    return this.inverse;
  },
  revision: 0,
  prepared: [],
  defaultCoord: [ 0, 0, 0, 1 ],
  prepare: function(unit) {
    var records = this.get(unit), mv = GLImmediate.matrixVersion[0], cached = this.prepared[unit];
    if (cached && cached.revision === this.revision && cached.mv === mv && cached.records === records) return cached;
    var state = cached || {
      planes: new Float64Array(16)
    };
    state.records = records;
    state.mv = mv;
    state.revision = this.revision;
    state.mask = 0;
    state.special = false;
    var m = GLImmediate.matrix[0];
    for (var j = 0; j < 4; j++) if (records[j].enabled) {
      var g = records[j], offset = j * 4;
      state.mask |= 1 << j;
      if (g.mode === 9217) {
        for (var k = 0; k < 4; k++) state.planes[offset + k] = g.object[k];
      } else if (g.mode === 9216) {
        for (var k = 0; k < 4; k++) state.planes[offset + k] = g.eye[0] * m[k * 4] + g.eye[1] * m[k * 4 + 1] + g.eye[2] * m[k * 4 + 2] + g.eye[3] * m[k * 4 + 3];
      } else state.special = true;
    }
    this.prepared[unit] = state;
    return state;
  },
  write: function(unit, p, n, current, out, offset) {
    var state = this.prepare(unit);
    if (state.special) {
      var values = this.generate(unit, p, n, current);
      for (var j = 0; j < 4; j++) out[offset + j] = values[j];
      return;
    }
    var plane = state.planes;
    for (var j = 0; j < 4; j++) {
      var at = j * 4;
      out[offset + j] = (state.mask & (1 << j)) ? plane[at] * p[0] + plane[at + 1] * p[1] + plane[at + 2] * p[2] + plane[at + 3] * p[3] : current[j];
    }
  },
  generate: function(unit, position, normal, current) {
    var records = this.get(unit);
    if (!records.some(r => r.enabled)) return current;
    var out = current.slice(), m = GLImmediate.matrix[0], eye = Array.from({
      length: 4
    }, (_, r) => m[r] * position[0] + m[4 + r] * position[1] + m[8 + r] * position[2] + m[12 + r] * position[3]);
    var dot = (a, b) => a.reduce((sum, v, i) => sum + v * b[i], 0), reflection = null, n = null;
    for (var j = 0; j < 4; j++) if (records[j].enabled) {
      var g = records[j];
      if (g.mode === 9217) out[j] = dot(position, g.object); else if (g.mode === 9216) out[j] = dot(eye, g.eye); else {
        if (!n) {
          var inverse = this.inv();
          n = Array.from({
            length: 3
          }, (_, r) => inverse[r * 4] * normal[0] + inverse[r * 4 + 1] * normal[1] + inverse[r * 4 + 2] * normal[2]);
          var length = Math.hypot(...n) || 1;
          n = n.map(v => v / length);
        }
        if (g.mode === 34065) out[j] = n[j]; else {
          if (!reflection) {
            var length = Math.hypot(...eye.slice(0, 3)) || 1, u = eye.slice(0, 3).map(v => v / length), projection = dot(n, u);
            reflection = u.map((v, i) => v - 2 * n[i] * projection);
          }
          if (g.mode === 34066) out[j] = reflection[j]; else {
            var scale = 2 * Math.hypot(reflection[0], reflection[1], reflection[2] + 1);
            out[j] = scale ? reflection[j] / scale + .5 : .5;
          }
        }
      }
    }
    return out;
  }
};

function _cof_gl_get_tex_gen(coord, pname, ptr, kind) {
  var j = coord - 8192;
  if (j < 0 || j > 3) {
    GL.recordError(1280);
    return;
  }
  var g = COFTexGen.get(GLImmediate.TexEnvJIT.getActiveTexture())[j], values = pname === 9472 ? [ g.mode ] : pname === 9473 ? g.object : pname === 9474 ? g.eye : null;
  if (!values) {
    GL.recordError(1280);
    return;
  }
  for (var i = 0; i < values.length; i++) {
    if (kind === 2) HEAPF64[(ptr >>> 3) + i >>> 0] = values[i]; else if (kind === 1) HEAP32[(ptr >>> 2) + i >>> 0] = values[i]; else HEAPF32[(ptr >>> 2) + i >>> 0] = values[i];
  }
}

function _cof_gl_init_legacy() {
  // GoldSrc bitmap font strips can exceed 7000 texels. Fragment mediump
  // coordinates lose individual texels near the far side of such an atlas.
  // WebGL2 guarantees highp; match desktop fixed-function interpolation.
  if (!GLctx.cofLegacyPrecision) {
    GLctx.cofLegacyPrecision = true;
    var shaderSource = GLctx.shaderSource;
    GLctx.shaderSource = function(shader, source) {
      if (source.indexOf("varying vec4 v_color;") >= 0) source = source.replace("precision mediump float;", "precision highp float;").replace(/texture2D\((u_texUnit\d+),\s*(\([^()\n]+\)|v_texCoord\d+)\.xy\)/g, "texture2DProj($1, $2)");
      return shaderSource.call(this, shader, source);
    };
  }
  if (!GL.cofDynamicTempBuffers) {
    GL.cofDynamicTempBuffers = true;
    var originalVertex = GL.getTempVertexBuffer, originalIndex = GL.getTempIndexBuffer, originalFrame = GL.newRenderingFrameStarted;
    GL.getTempVertexBuffer = function(size) {
      var index = GL.log2ceilLookup(size), context = GL.currentContext;
      for (var i = context.tempVertexBuffers1.length; i <= index; i++) {
        context.tempVertexBuffers1[i] = new Array(GL.numTempVertexBuffersPerSize).fill(null);
        context.tempVertexBuffers2[i] = new Array(GL.numTempVertexBuffersPerSize).fill(null);
        context.tempVertexBufferCounters1[i] = context.tempVertexBufferCounters2[i] = 0;
      }
      return originalVertex(size);
    };
    GL.getTempIndexBuffer = function(size) {
      var index = GL.log2ceilLookup(size);
      while (GL.currentContext.tempIndexBuffers.length <= index) GL.currentContext.tempIndexBuffers.push(null);
      return originalIndex(size);
    };
    GL.newRenderingFrameStarted = function() {
      originalFrame();
      if (GL.currentContext) GL.currentContext.tempVertexBufferCounters1.fill(0);
    };
  }
  if (!GLImmediate.initted) {
    Browser.useWebGL = true;
    Module["GL_MAX_TEXTURE_IMAGE_UNITS"] = Module["GL_MAX_TEXTURE_IMAGE_UNITS"] || 4;
    GLImmediate.init();
  }
}

function _cof_gl_is_enabled(cap) {
  if (cap >= 3168 && cap <= 3171) return +COFTexGen.get(GLImmediate.TexEnvJIT.getActiveTexture())[cap - 3168].enabled;
  var value = GLImmediate.TexEnvJIT.cofIsEnabled(cap);
  return value === null ? _glIsEnabled(cap) : +!!value;
}

function _cof_gl_legacy_max_units() {
  return GLImmediate.MAX_TEXTURES;
}

function _cof_gl_legacy_target(unit) {
  return GLImmediate.TexEnvJIT.getTexUnitType(unit);
}

function _cof_gl_normal3f(x, y, z) {
  COFLegacyState.normal = [ x, y, z ];
}

var _emscripten_glMatrixMode = mode => {
  if (mode == 5888) {
    GLImmediate.currentMatrix = 0;
  } else if (mode == 5889) {
    GLImmediate.currentMatrix = 1;
  } else if (mode == 5890) {
    // GL_TEXTURE
    GLImmediate.useTextureMatrix = true;
    GLImmediate.currentMatrix = 2 + GLImmediate.TexEnvJIT.getActiveTexture();
  } else {
    throw `Wrong mode ${mode} passed to glMatrixMode`;
  }
};

var _glMatrixMode = _emscripten_glMatrixMode;

function _cof_gl_pop_attrib() {
  var stack = COFAttribStack, gl = GLctx;
  if (GLImmediate.mode >= 0) {
    GL.recordError(1282);
    return 0;
  }
  if (!stack.frames.length) {
    GL.recordError(1284);
    return 0;
  }
  GLImmediate.lastRenderer?.cleanup();
  var f = stack.frames.pop();
  if (f.current) {
    Object.assign(COFLegacyState, f.current);
    _glColor4f(...f.current.color);
  }
  if (f.point !== undefined) GLEmulation.pointSize = f.point;
  if (f.line !== undefined) gl.lineWidth(f.line);
  if (f.polygon) {
    gl.cullFace(f.polygon[0]);
    gl.frontFace(f.polygon[1]);
    gl.polygonOffset(f.polygon[2], f.polygon[3]);
  }
  stack.restoreFields(f.lighting);
  stack.restoreFields(f.fog);
  stack.restoreFields(f.clip);
  stack.restoreFields(f.alpha);
  stack.restoreFields(f.enables);
  if (f.depth) {
    gl.depthFunc(f.depth[0]);
    gl.depthMask(f.depth[1]);
    gl.clearDepth(f.depth[2]);
  }
  if (f.stencil) {
    gl.clearStencil(f.stencil[0]);
    for (var values of f.stencil.slice(1)) {
      gl.stencilFuncSeparate(...values.slice(0, 4));
      gl.stencilMaskSeparate(values[0], values[4]);
      gl.stencilOpSeparate(values[0], ...values.slice(5));
    }
  }
  if (f.viewport) {
    gl.viewport(...f.viewport[0]);
    gl.depthRange(...f.viewport[1]);
  }
  if (f.color) {
    var c = f.color;
    gl.blendFuncSeparate(...c.slice(0, 4));
    gl.blendEquationSeparate(c[4], c[5]);
    gl.blendColor(...c[6]);
    gl.colorMask(...c[7]);
    gl.clearColor(...c[8]);
  }
  if (f.hint !== undefined) gl.hint(gl.GENERATE_MIPMAP_HINT, f.hint);
  if (f.scissor) gl.scissor(...f.scissor);
  if (f.sample) gl.sampleCoverage(...f.sample);
  for (var cap of f.caps) (cap[1] ? gl.enable : gl.disable).call(gl, cap[0]);
  if (f.texgen) {
    COFTexGen.revision++;
    if (f.mask & 262144) COFTexGen.units = f.texgen; else for (var i = 0; i < 4; i++) for (var j = 0; j < 4; j++) COFTexGen.get(i)[j].enabled = f.texgen[i][j].enabled;
  }
  if (f.units) GLImmediate.TexEnvJIT.cofRestoreUnits(f.units, !!(f.mask & 262144), !!(f.mask & 8192));
  if (f.textures) {
    for (var unit = 0; unit < f.textures.length; unit++) {
      gl.activeTexture(gl.TEXTURE0 + unit);
      for (var tex of f.textures[unit]) {
        gl.bindTexture(tex.target, tex.object);
        if (tex.object) for (var value of tex.parameters) gl.texParameterf(tex.target, value[0], value[1]);
      }
    }
    gl.activeTexture(gl.TEXTURE0 + f.active);
    GLImmediate.TexEnvJIT.hook_activeTexture(gl.TEXTURE0 + f.active);
  }
  if (f.matrix !== undefined) _glMatrixMode(f.matrix);
  GLImmediate.currentRenderer = null;
  return 1;
}

function _cof_gl_push_attrib(mask) {
  var stack = COFAttribStack, gl = GLctx;
  if (GLImmediate.mode >= 0) {
    GL.recordError(1282);
    return 0;
  }
  if (mask & ~537919487) {
    GL.recordError(1281);
    return 0;
  }
  if (stack.frames.length === 16) {
    GL.recordError(1283);
    return 0;
  }
  GLImmediate.lastRenderer?.cleanup();
  var get = p => {
    var v = gl.getParameter(p);
    return ArrayBuffer.isView(v) ? Array.from(v) : v;
  };
  var frame = {
    mask,
    caps: [],
    active: GLImmediate.TexEnvJIT.getActiveTexture()
  };
  for (var cap of stack.caps) if (mask & (8192 | cap[1])) frame.caps.push([ cap[0], gl.isEnabled(cap[0]) ]);
  if (mask & 1) frame.current = {
    color: COFLegacyState.color.slice(),
    normal: COFLegacyState.normal.slice(),
    coords: COFLegacyState.coords.map(v => v.slice())
  };
  if (mask & 2) frame.point = GLEmulation.pointSize;
  if (mask & 4) frame.line = get(gl.LINE_WIDTH);
  if (mask & 8) frame.polygon = [ get(gl.CULL_FACE_MODE), get(gl.FRONT_FACE), get(gl.POLYGON_OFFSET_FACTOR), get(gl.POLYGON_OFFSET_UNITS) ];
  if (mask & 64) frame.lighting = stack.fields(stack.lighting);
  if (mask & 128) frame.fog = stack.fields(stack.fog);
  if (mask & 256) frame.depth = [ get(gl.DEPTH_FUNC), get(gl.DEPTH_WRITEMASK), get(gl.DEPTH_CLEAR_VALUE) ];
  if (mask & 1024) {
    frame.stencil = [ get(gl.STENCIL_CLEAR_VALUE) ];
    for (var face of [ gl.FRONT, gl.BACK ]) {
      var back = face === gl.BACK;
      frame.stencil.push([ face, get(back ? gl.STENCIL_BACK_FUNC : gl.STENCIL_FUNC), get(back ? gl.STENCIL_BACK_REF : gl.STENCIL_REF), get(back ? gl.STENCIL_BACK_VALUE_MASK : gl.STENCIL_VALUE_MASK), get(back ? gl.STENCIL_BACK_WRITEMASK : gl.STENCIL_WRITEMASK), get(back ? gl.STENCIL_BACK_FAIL : gl.STENCIL_FAIL), get(back ? gl.STENCIL_BACK_PASS_DEPTH_FAIL : gl.STENCIL_PASS_DEPTH_FAIL), get(back ? gl.STENCIL_BACK_PASS_DEPTH_PASS : gl.STENCIL_PASS_DEPTH_PASS) ]);
    }
  }
  if (mask & 2048) frame.viewport = [ get(gl.VIEWPORT), get(gl.DEPTH_RANGE) ];
  if (mask & 4096) {
    frame.matrix = GLImmediate.currentMatrix < 2 ? GLImmediate.currentMatrix + 5888 : 5890;
    frame.clip = stack.fields([ "clipPlaneEnabled", "clipPlaneEquation" ]);
  }
  if (mask & 8192) frame.enables = stack.fields(stack.enables);
  if (mask & 16384) {
    frame.color = [ get(gl.BLEND_SRC_RGB), get(gl.BLEND_DST_RGB), get(gl.BLEND_SRC_ALPHA), get(gl.BLEND_DST_ALPHA), get(gl.BLEND_EQUATION_RGB), get(gl.BLEND_EQUATION_ALPHA), get(gl.BLEND_COLOR), get(gl.COLOR_WRITEMASK), get(gl.COLOR_CLEAR_VALUE) ];
    frame.alpha = stack.fields([ "alphaTestEnabled", "alphaTestFunc", "alphaTestRef" ]);
  }
  if (mask & 32768) frame.hint = get(gl.GENERATE_MIPMAP_HINT);
  if (mask & 524288) frame.scissor = get(gl.SCISSOR_BOX);
  if (mask & 536870912) frame.sample = [ get(gl.SAMPLE_COVERAGE_VALUE), get(gl.SAMPLE_COVERAGE_INVERT) ];
  if (mask & (262144 | 8192)) {
    frame.units = GLImmediate.TexEnvJIT.cofCaptureUnits();
    frame.texgen = Array.from({
      length: 4
    }, (_, i) => JSON.parse(JSON.stringify(COFTexGen.get(i))));
  }
  if (mask & 262144) {
    frame.textures = [];
    for (var unit = 0; unit < GLImmediate.MAX_TEXTURES; unit++) {
      gl.activeTexture(gl.TEXTURE0 + unit);
      var pair = [];
      for (var target of [ gl.TEXTURE_2D, gl.TEXTURE_CUBE_MAP ]) {
        var object = get(target === gl.TEXTURE_2D ? gl.TEXTURE_BINDING_2D : gl.TEXTURE_BINDING_CUBE_MAP), parameters = [];
        if (object) for (var param of stack.parameters) parameters.push([ param, gl.getTexParameter(target, param) ]);
        pair.push({
          target,
          object,
          parameters
        });
      }
      frame.textures.push(pair);
    }
    gl.activeTexture(gl.TEXTURE0 + frame.active);
  }
  stack.frames.push(frame);
  return 1;
}

function _cof_gl_read_buffer(mode) {
  if (mode === 1028 || mode === 1029) mode = GLctx.getParameter(GLctx.READ_FRAMEBUFFER_BINDING) ? GLctx.COLOR_ATTACHMENT0 : GLctx.BACK;
  GLctx.readBuffer(mode);
}

function _cof_gl_tex_gen_scalar(coord, pname, value) {
  var j = coord - 8192;
  if (j < 0 || j > 3 || pname !== 9472) {
    GL.recordError(1280);
    return;
  }
  if (![ 9216, 9217, 9218, 34065, 34066 ].includes(value) || (value === 9218 && j > 1) || ((value === 34065 || value === 34066) && j > 2)) {
    GL.recordError(1280);
    return;
  }
  COFTexGen.get(GLImmediate.TexEnvJIT.getActiveTexture())[j].mode = value;
  COFTexGen.revision++;
}

function _cof_gl_tex_gen(coord, pname, ptr, kind) {
  var j = coord - 8192;
  if (j < 0 || j > 3) {
    GL.recordError(1280);
    return;
  }
  var values = Array.from({
    length: pname === 9472 ? 1 : 4
  }, (_, i) => kind === 2 ? HEAPF64[(ptr >>> 3) + i >>> 0] : kind === 1 ? HEAP32[(ptr >>> 2) + i >>> 0] : HEAPF32[(ptr >>> 2) + i >>> 0]);
  if (pname === 9472) {
    _cof_gl_tex_gen_scalar(coord, pname, values[0]);
    return;
  }
  var g = COFTexGen.get(GLImmediate.TexEnvJIT.getActiveTexture())[j];
  COFTexGen.revision++;
  if (pname === 9473) g.object = values; else if (pname === 9474) {
    var inv = COFTexGen.inv();
    g.eye = Array.from({
      length: 4
    }, (_, j) => values.reduce((sum, v, i) => sum + v * inv[j * 4 + i], 0));
  } else GL.recordError(1280);
}

function _cof_gl_texcoord4f(target, s, t, r, q) {
  var unit = target - 33984;
  if (unit < 0 || unit >= GLImmediate.MAX_TEXTURES) throw new Error("Texture coordinate unit exceeds legacy context limit");
  while (COFLegacyState.coords.length <= unit) COFLegacyState.coords.push([ 0, 0, 0, 1 ]);
  COFLegacyState.coords[unit] = [ s, t, r, q ];
}

function _cof_gl_texgen_enable(cap, enable) {
  if (cap < 3168 || cap > 3171) return 0;
  var g = COFTexGen.get(GLImmediate.TexEnvJIT.getActiveTexture())[cap - 3168];
  if (g.enabled !== !!enable) {
    g.enabled = !!enable;
    COFTexGen.revision++;
  }
  return 1;
}

var _emscripten_glNormal3f = (x, y, z) => {
  GLImmediate.vertexData[GLImmediate.vertexCounter++] = x;
  GLImmediate.vertexData[GLImmediate.vertexCounter++] = y;
  GLImmediate.vertexData[GLImmediate.vertexCounter++] = z;
  GLImmediate.addRendererComponent(GLImmediate.NORMAL, 3, GLctx.FLOAT);
};

var _glNormal3f = _emscripten_glNormal3f;

var _emscripten_glVertex4f = (x, y, z, w) => {
  GLImmediate.vertexData[GLImmediate.vertexCounter++] = x;
  GLImmediate.vertexData[GLImmediate.vertexCounter++] = y;
  GLImmediate.vertexData[GLImmediate.vertexCounter++] = z;
  GLImmediate.vertexData[GLImmediate.vertexCounter++] = w;
  GLImmediate.addRendererComponent(GLImmediate.VERTEX, 4, GLctx.FLOAT);
};

var _glVertex4f = _emscripten_glVertex4f;

function _cof_gl_vertex4f(x, y, z, w) {
  var state = COFLegacyState;
  _glColor4f(...state.color);
  _glNormal3f(...state.normal);
  var position = COFTexGen.vertexPosition || (COFTexGen.vertexPosition = [ 0, 0, 0, 1 ]);
  position[0] = x;
  position[1] = y;
  position[2] = z;
  position[3] = w;
  for (var unit = 0; unit < GLImmediate.MAX_TEXTURES; unit++) {
    COFTexGen.write(unit, position, state.normal, state.coords[unit] || COFTexGen.defaultCoord, GLImmediate.vertexData, GLImmediate.vertexCounter);
    GLImmediate.vertexCounter += 4;
    GLImmediate.addRendererComponent(GLImmediate.TEXTURE0 + unit, 4, GLctx.FLOAT);
  }
  _glVertex4f(x, y, z, w);
}

var COF = {
  manifest: null,
  dirs: null,
  files: [],
  nextFd: 3,
  cache: new Map,
  cacheBytes: 0,
  cacheLimit: 536870912,
  overlay: new Map,
  mkdirs: new Set,
  tot: {
    fetches: 0,
    fetchKB: 0,
    fetchMs: 0
  },
  status: s => {
    if (Module["onStatus"]) Module["onStatus"](s); else {
      const el = document.getElementById("status");
      if (el) el.textContent = s;
    }
  },
  log: s => {
    console.log(s);
    if (Module["onLog"]) Module["onLog"](s);
  },
  norm: p => p.replace(/\//g, "\\").toLowerCase(),
  rel: p => {
    p = COF.norm(p);
    return p.startsWith("c:\\game\\") ? p.slice(8) : (p === "c:\\game" ? "" : null);
  },
  idb: null,
  persistable: key => key.startsWith("c:\\users\\"),
  async loadOverlay() {
    if (typeof indexedDB === "undefined") return;
    try {
      COF.idb = await new Promise((res, rej) => {
        const r = indexedDB.open(COF.idbName || "cof", 1);
        r.onupgradeneeded = () => r.result.createObjectStore("files");
        r.onsuccess = () => res(r.result);
        r.onerror = () => rej(r.error);
      });
      const tx = COF.idb.transaction("files", "readonly"), req = tx.objectStore("files").openCursor();
      let n = 0;
      await new Promise(done => {
        req.onsuccess = () => {
          const c = req.result;
          if (!c) return done();
          COF.overlay.set(c.key, {
            data: new Uint8Array(c.value),
            size: c.value.byteLength
          });
          n++;
          c.continue();
        };
        req.onerror = done;
      });
      if (!n) n = await COF.migrateSaves();
      if (n) console.log("[web] restored " + n + " saved files from IndexedDB");
    } catch (e) {
      console.warn("[web] IndexedDB unavailable, saves will not persist:", e);
      COF.idb = null;
    }
  },
  async migrateSaves() {
    if (!indexedDB.databases || !(await indexedDB.databases()).some(d => d.name === "sawasm")) return 0;
    const old = await new Promise((res, rej) => {
      const r = indexedDB.open("sawasm");
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    });
    let n = 0;
    if (old.objectStoreNames.contains("files")) {
      const req = old.transaction("files", "readonly").objectStore("files").openCursor();
      await new Promise(done => {
        req.onsuccess = () => {
          const c = req.result;
          if (!c) return done();
          COF.overlay.set(c.key, {
            data: new Uint8Array(c.value),
            size: c.value.byteLength
          });
          n++;
          c.continue();
        };
        req.onerror = done;
      });
      const st = COF.idb.transaction("files", "readwrite").objectStore("files");
      for (const [k, ov] of COF.overlay) st.put(ov.data.slice(0, ov.size).buffer, k);
    }
    old.close();
    indexedDB.deleteDatabase("sawasm");
    return n;
  },
  persist(key) {
    if (!COF.idb || !COF.persistable(key)) return;
    try {
      const ov = COF.overlay.get(key), st = COF.idb.transaction("files", "readwrite").objectStore("files");
      if (ov) st.put(ov.data.slice(0, ov.size).buffer, key); else st.delete(key);
    } catch (e) {
      console.warn("[web] persist failed", key, e);
    }
  },
  async ensureManifest() {
    if (COF.manifest) return;
    if (COF.manifestP) return COF.manifestP;
    COF.manifestP = (async () => {
      await COF.loadOverlay();
      COF.base = Module["gameBase"] || "";
      let m = await COF.openData();
      if (!m) m = await (await fetch(COF.base + "manifest.json")).json();
      COF.dirs = new Map;
      for (const k of Object.keys(m)) {
        let d = k;
        for (;;) {
          const i = d.lastIndexOf("\\");
          const parent = i < 0 ? "" : d.slice(0, i), name = i < 0 ? d : d.slice(i + 1);
          if (!COF.dirs.has(parent)) COF.dirs.set(parent, new Set);
          const had = COF.dirs.get(parent).has(name);
          COF.dirs.get(parent).add(name);
          if (i < 0 || had) break;
          d = parent;
        }
      }
      COF.manifest = m;
      globalThis.__hcrReadFile = path => {
        const ov = COF.overlay.get(COF.norm(path));
        return ov ? (new TextDecoder).decode(ov.data.subarray(0, ov.size)) : null;
      };
    })();
    return COF.manifestP;
  },
  async openData() {
    const url = COF.base + "cof.data";
    let r = await fetch(url, {
      headers: {
        Range: "bytes=0-262143"
      }
    });
    if (r.status === 404) return null;
    if (!r.ok) throw new Error("cof.data: HTTP " + r.status);
    let head;
    if (r.status === 206) {
      // Range works: blocks on demand
      COF.dataUrl = url;
      COF.dataSize = +r.headers.get("Content-Range").split("/")[1];
      head = new Uint8Array(await r.arrayBuffer());
    } else {
      // the whole file (no Range support): into memory once
      const total = +r.headers.get("Content-Length") || 0, reader = r.body.getReader(), parts = [];
      let got = 0, last = 0;
      for (;;) {
        const {done, value} = await reader.read();
        if (done) break;
        parts.push(value);
        got += value.length;
        if (got - last > (4 << 20)) {
          last = got;
          COF.status(`downloading the game data ${(got / 1048576) | 0}${total ? " / " + ((total / 1048576) | 0) : ""} MB`);
        }
      }
      head = COF.data = new Uint8Array(got);
      let o = 0;
      for (const p of parts) {
        head.set(p, o);
        o += p.length;
      }
    }
    if ((new TextDecoder).decode(head.subarray(0, 8)) !== "COFDATA1") throw new Error("cof.data: not a game data file");
    const len = new DataView(head.buffer, head.byteOffset).getUint32(8, true);
    if (12 + len > head.length) head = new Uint8Array(await (await fetch(url, {
      headers: {
        Range: `bytes=0-${11 + len}`
      }
    })).arrayBuffer());
    const files = JSON.parse((new TextDecoder).decode(head.subarray(12, 12 + len))).files, m = {};
    COF.offs = {};
    for (const k in files) {
      COF.offs[k] = files[k][0];
      m[k] = files[k][1];
    }
    return m;
  },
  BLOCK: 1048576,
  capCache() {
    if (COF.capped) return;
    COF.capped = 1;
    const mb = +(new URLSearchParams(location.search).get("filecache") || Module["fileCacheMB"] || 0);
    if (mb > 0) COF.cacheLimit = mb << 20;
    console.log("[web] block cache limit: " + (COF.cacheLimit >> 20) + " MB");
  },
  fetchBlock(rel, b) {
    COF.capCache();
    const key = rel + "#" + b, v = COF.cache.get(key);
    if (v) {
      if (!(v instanceof Promise)) {
        COF.cache.delete(key);
        COF.cache.set(key, v);
      }
      return v;
    }
    // LRU touch
    const size = rel ? COF.manifest[rel] : COF.dataSize, start = b * COF.BLOCK, end = Math.min(size, start + COF.BLOCK) - 1;
    const url = rel ? COF.base + "game/" + rel.split("\\").map(encodeURIComponent).join("/") : COF.dataUrl;
    const p = (async () => {
      let r, blk;
      for (let attempt = 0; ;attempt++) {
        try {
          r = await fetch(url, {
            headers: {
              Range: `bytes=${start}-${end}`
            },
            cache: attempt ? "no-store" : "default"
          });
          if (!r.ok && r.status !== 206) throw new Error("HTTP " + r.status);
          blk = new Uint8Array(await r.arrayBuffer());
          break;
        } catch (e) {
          if (attempt === 0 || attempt % 10 === 9) console.warn(`[web] fetch ${rel} block ${b} failed (${e && e.message || e}), retrying`);
          await new Promise(res => setTimeout(res, Math.min(2e3, 50 * (1 << Math.min(attempt, 6)))));
        }
      }
      if (r.status === 200 && blk.length > end - start + 1) blk = blk.subarray(start, end + 1);
      // server ignored Range
      COF.cache.set(key, blk);
      COF.cacheBytes += blk.length;
      COF.tot.fetches++;
      COF.tot.fetchKB += blk.length >> 10;
      if (COF.cacheBytes > COF.cacheLimit) COF.evict();
      return blk;
    })();
    COF.cache.set(key, p);
    p.catch(() => COF.cache.delete(key));
    return p;
  },
  evict() {
    for (const [k, v] of COF.cache) {
      if (v instanceof Promise) continue;
      COF.cache.delete(k);
      COF.cacheBytes -= v.length;
      if (COF.cacheBytes < COF.cacheLimit * .7) break;
    }
  },
  readRange(rel, off, n) {
    const size = COF.manifest[rel];
    if (off >= size) return new Uint8Array(0);
    if (off + n > size) n = size - off;
    if (!COF.offs) return COF.readBlocks(rel, off, n, size);
    const at = COF.offs[rel] + off;
    return COF.data ? COF.data.subarray(at, at + n) : COF.readBlocks("", at, n, COF.dataSize);
  },
  readBlocks(rel, off, n, size) {
    const B = COF.BLOCK, b0 = Math.floor(off / B), b1 = Math.floor((off + n - 1) / B);
    const parts = [];
    let pending = false;
    for (let b = b0; b <= b1; b++) {
      const v = COF.fetchBlock(rel, b);
      if (v instanceof Promise) pending = true;
      parts.push(v);
    }
    if (b1 + 1 < Math.ceil(size / B) && !COF.cache.has(rel + "#" + (b1 + 1))) COF.fetchBlock(rel, b1 + 1).catch(() => {});
    // sequential read-ahead
    const assemble = blks => {
      if (b0 === b1) return blks[0].subarray(off - b0 * B, off - b0 * B + n);
      const out = new Uint8Array(n);
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
      COF.tot.fetchMs += performance.now() - tf;
      return assemble(blks);
    });
  },
  hop(f) {
    if (!COF.hopq) {
      COF.hopq = [];
      COF.hopc = new MessageChannel;
      COF.hopc.port1.onmessage = () => {
        const q = COF.hopq;
        COF.hopq = [];
        COF.lastMacro = performance.now();
        for (const g of q) g();
      };
    }
    COF.hopq.push(f);
    if (COF.hopq.length === 1) COF.hopc.port2.postMessage(0);
  },
  lastMacro: 0
};

var COFSettings = {
  registry: {},
  cvars: {},
  restored: new Set,
  dirty: false,
  path: function(kind) {
    return "c:\\users\\player\\appdata\\local\\cof\\settings\\" + kind + ".json";
  },
  load: function() {
    for (var kind of [ "registry", "cvars" ]) try {
      var file = COF.overlay.get(this.path(kind));
      if (file) this[kind] = JSON.parse((new TextDecoder).decode(file.data.subarray(0, file.size)));
    } catch (error) {
      if (Module.printErr) Module.printErr("[storage] Settings restore failed: " + error);
    }
  },
  save: function(kind) {
    var data = (new TextEncoder).encode(JSON.stringify(this[kind])), path = this.path(kind);
    COF.overlay.set(path, {
      data,
      size: data.length
    });
    COF.persist(path);
  }
};

var _cof_goldsrc_vfs_init = async function(id) {
  COF.idbName = "cof-goldsrc-" + UTF8ToString(id >>> 0);
  COF.persistable = key => key.startsWith("c:\\game\\") || key.startsWith("c:\\users\\");
  COF.migrateSaves = async () => {
    var legacy = String.fromCharCode(114, 101, 120, 99, 111, 109, 112), name = legacy + "-goldsrc-" + UTF8ToString(id >>> 0);
    if (name === COF.idbName) return 0;
    if (indexedDB.databases && !(await indexedDB.databases()).some(d => d.name === name)) return 0;
    var old = await new Promise(resolve => {
      var request = indexedDB.open(name);
      request.onupgradeneeded = () => {
        request.transaction.abort();
        resolve(null);
      };
      request.onerror = () => resolve(null);
      request.onsuccess = () => resolve(request.result);
    });
    if (!old || !old.objectStoreNames.contains("files")) {
      if (old) old.close();
      return 0;
    }
    var count = 0, entries = [], cursor = old.transaction("files", "readonly").objectStore("files").openCursor();
    await new Promise(resolve => {
      cursor.onsuccess = () => {
        var item = cursor.result;
        if (!item) {
          resolve();
          return;
        }
        var key = item.key.replace("\\" + legacy + "\\settings\\", "\\cof\\settings\\"), data = new Uint8Array(item.value);
        COF.overlay.set(key, {
          data,
          size: data.length
        });
        entries.push([ key, data ]);
        count++;
        item.continue();
      };
      cursor.onerror = resolve;
    });
    old.close();
    if (entries.length) await new Promise(resolve => {
      var tx = COF.idb.transaction("files", "readwrite"), store = tx.objectStore("files");
      for (var entry of entries) store.put(entry[1].buffer, entry[0]);
      tx.oncomplete = resolve;
      tx.onerror = resolve;
    });
    return count;
  };
  var load = COF.loadOverlay.bind(COF);
  COF.loadOverlay = () => COF.overlayLoaded || (COF.overlayLoaded = load());
  await COF.loadOverlay();
  COFSettings.load();
};

_cof_goldsrc_vfs_init.isAsync = true;

var COFA = {
  node: null
};

function _cof_js_audio_init(rate) {
  COFA.node = Module["audioNode"] || null;
  const ctx = Module["audioContext"];
  if (ctx && ctx.sampleRate !== rate) console.warn(`[audio] mixer renders ${rate} Hz, AudioContext runs at ${ctx.sampleRate} Hz (the worklet resamples)`);
  return COFA.node ? 1 : 0;
}

function _cof_js_audio_push(ptr, frames) {
  ptr >>>= 0;
  if (!COFA.node) return;
  const buf = HEAPF32.slice(ptr >> 2, (ptr >> 2) + frames * 2);
  COFA.node.port.postMessage(buf, [ buf.buffer ]);
}

function _cof_js_canvas_size(wp, hp) {
  const c = document.getElementById("canvas");
  HEAP32[(wp >>> 0) >>> 2 >>> 0] = Module["canvasW"] || c.width;
  HEAP32[(hp >>> 0) >>> 2 >>> 0] = Module["canvasH"] || c.height;
}

function _cof_js_cursor(v) {
  const c = document.getElementById("canvas");
  if (c) c.style.cursor = v ? "default" : "none";
  Module["cursorVisible"] = !!v;
  if (Module["onCursorVisibility"]) Module["onCursorVisibility"](!!v);
}

function _cof_js_file_close(fd) {
  const f = COF.files[fd];
  if (f && f.dirty) COF.persist(f.key);
  delete COF.files[fd];
  return 1;
}

async function _cof_js_file_list(dirp) {
  await COF.ensureManifest();
  const dir = UTF8ToString(dirp >>> 0), key = COF.norm(dir).replace(/\\+$/, ""), rel = COF.rel(key);
  const names = new Set;
  if (rel !== null && COF.dirs.has(rel)) for (const n of COF.dirs.get(rel)) names.add(n);
  for (const k of COF.overlay.keys()) if (k.startsWith(key + "\\")) names.add(k.slice(key.length + 1).split("\\")[0]);
  for (const k of COF.mkdirs) if (k.startsWith(key + "\\")) names.add(k.slice(key.length + 1).split("\\")[0]);
  if (!names.size) return 0;
  const s = [ ...names ].join("\n");
  const n = lengthBytesUTF8(s) + 1;
  const p = _malloc(n);
  stringToUTF8(s, p, n);
  return p;
}

_cof_js_file_list.isAsync = true;

function _cof_js_file_mkdir(pathp) {
  const k = COF.norm(UTF8ToString(pathp >>> 0));
  if (COF.mkdirs.has(k)) return 0;
  COF.mkdirs.add(k);
  return 1;
}

async function _cof_js_file_open(pathp, write, create, truncate) {
  await COF.ensureManifest();
  const path = UTF8ToString(pathp >>> 0), key = COF.norm(path), rel = COF.rel(path);
  let ov = COF.overlay.get(key);
  const inGame = rel !== null && rel in COF.manifest;
  if (!ov && !inGame && !create) return -1;
  if (truncate && ov) {
    ov.data = new Uint8Array(0);
    ov.size = 0;
  }
  if (!ov && (create || write)) {
    ov = {
      data: new Uint8Array(0),
      size: 0
    };
    if (inGame && !truncate) {
      ov.data = (await COF.readRange(rel, 0, COF.manifest[rel])).slice();
      ov.size = ov.data.length;
    }
    COF.overlay.set(key, ov);
  }
  const fd = COF.nextFd++;
  COF.files[fd] = {
    key,
    rel: inGame ? rel : null,
    ov
  };
  return fd;
}

_cof_js_file_open.isAsync = true;

function _cof_js_file_read_nb(fd, bufp, off, n, donep, resultp) {
  bufp >>>= 0;
  donep >>>= 0;
  resultp >>>= 0;
  const f = COF.files[fd];
  if (!f) return -1;
  if (f.ov) {
    const end = Math.min(f.ov.size, off + n);
    if (off >= end) return 0;
    HEAPU8.set(f.ov.data.subarray(off, end), bufp >>> 0);
    return end - off;
  }
  const d = COF.readRange(f.rel, off, n);
  if (!(d instanceof Promise)) {
    HEAPU8.set(d, bufp >>> 0);
    return d.length;
  }
  d.then(data => {
    HEAPU8.set(data, bufp >>> 0);
    HEAP32[resultp >>> 2 >>> 0] = data.length;
    HEAP32[donep >>> 2 >>> 0] = 1;
  }, () => {
    HEAP32[resultp >>> 2 >>> 0] = -1;
    HEAP32[donep >>> 2 >>> 0] = 1;
  });
  return -2;
}

function _cof_js_file_size(fd) {
  const f = COF.files[fd];
  if (!f) return 0;
  return f.ov ? f.ov.size : COF.manifest[f.rel];
}

async function _cof_js_file_stat(pathp, sizep, isdirp) {
  pathp >>>= 0;
  sizep >>>= 0;
  isdirp >>>= 0;
  await COF.ensureManifest();
  const path = UTF8ToString(pathp), key = COF.norm(path).replace(/\\+$/, ""), rel = COF.rel(key);
  const ov = COF.overlay.get(key);
  if (ov) {
    HEAPF64[sizep >>> 3 >>> 0] = ov.size;
    HEAP32[isdirp >>> 2 >>> 0] = 0;
    return 1;
  }
  if (rel !== null) {
    if (rel in COF.manifest) {
      HEAPF64[sizep >>> 3 >>> 0] = COF.manifest[rel];
      HEAP32[isdirp >>> 2 >>> 0] = 0;
      return 1;
    }
    if (rel === "" || COF.dirs.has(rel)) {
      HEAPF64[sizep >>> 3 >>> 0] = 0;
      HEAP32[isdirp >>> 2 >>> 0] = 1;
      return 1;
    }
  }
  for (const k of COF.overlay.keys()) if (k.startsWith(key + "\\")) {
    HEAPF64[sizep >>> 3 >>> 0] = 0;
    HEAP32[isdirp >>> 2 >>> 0] = 1;
    return 1;
  }
  if (COF.mkdirs.has(key)) {
    HEAPF64[sizep >>> 3 >>> 0] = 0;
    HEAP32[isdirp >>> 2 >>> 0] = 1;
    return 1;
  }
  if (/^c:(\\(users(\\player(\\documents)?)?|windows))?$/.test(key)) {
    HEAPF64[sizep >>> 3 >>> 0] = 0;
    HEAP32[isdirp >>> 2 >>> 0] = 1;
    return 1;
  }
  return 0;
}

_cof_js_file_stat.isAsync = true;

function _cof_js_file_unlink(pathp) {
  const k = COF.norm(UTF8ToString(pathp >>> 0));
  const ok = COF.overlay.delete(k);
  if (ok) COF.persist(k);
  return ok ? 1 : 0;
}

function _cof_js_file_write(fd, bufp, off, n) {
  bufp >>>= 0;
  const f = COF.files[fd];
  if (!f) return -1;
  f.dirty = true;
  if (!f.ov) {
    f.ov = {
      data: new Uint8Array(0),
      size: 0
    };
    COF.overlay.set(f.key, f.ov);
  }
  const need = off + n;
  if (need > f.ov.data.length) {
    const nd = new Uint8Array(Math.max(need, f.ov.data.length * 2, 4096));
    nd.set(f.ov.data);
    f.ov.data = nd;
  }
  f.ov.data.set(HEAPU8.subarray(bufp >>> 0, bufp + n >>> 0), off);
  if (need > f.ov.size) f.ov.size = need;
  return n;
}

async function _cof_js_load_image(dest, size) {
  dest >>>= 0;
  try {
    const r = await fetch("image.bin");
    if (!r.ok) return 0;
    const reader = r.body.getReader();
    let off = 0, last = 0;
    for (;;) {
      const {done, value} = await reader.read();
      if (done) break;
      if (off + value.length > size) return 0;
      HEAPU8.set(value, dest + off >>> 0);
      off += value.length;
      if (off - last > (4 << 20)) {
        last = off;
        COF.status(`downloading the game code ${(off / 1048576) | 0} / ${(size / 1048576) | 0} MB`);
      }
    }
    return off === size ? 1 : 0;
  } catch (e) {
    console.error(e);
    return 0;
  }
}

_cof_js_load_image.isAsync = true;

function _cof_js_log(p) {
  COF.log(UTF8ToString(p >>> 0));
}

function _cof_js_note_program(p) {
  const k = UTF8ToString(p >>> 0);
  try {
    const cur = localStorage.getItem("cofProgs") || "";
    if (!cur.includes(k) && cur.length < 2e6) localStorage.setItem("cofProgs", cur + k + "\n");
  } catch (e) {}
}

function _cof_js_now() {
  return performance.now();
}

function _cof_js_open_url(p) {
  const url = UTF8ToString(p >>> 0);
  try {
    if (document.pointerLockElement) document.exitPointerLock();
  } catch (e) {}
  window.open(url, "_blank");
}

function _cof_js_present(frames, w, h, progs, texkb, bufkb, glns) {
  if (Module["gameW"] !== w || Module["gameH"] !== h) {
    Module["gameW"] = w;
    Module["gameH"] = h;
    if (Module["onGameSize"]) Module["onGameSize"](w, h);
  }
  const now = performance.now(), st = COF.fst || (COF.fst = {
    t0: now,
    n: 0,
    last: now,
    prev: null
  });
  st.n++;
  if (now - st.t0 >= 1e3) {
    globalThis.__hcrFps = st.n * 1e3 / (now - st.t0);
    globalThis.__hcrGlMs = (glns - (st.gl0 || 0)) / 1e6 / st.n;
    st.gl0 = glns;
    st.t0 = now;
    st.n = 0;
    if (Module["onFps"]) Module["onFps"](globalThis.__hcrFps);
  }
  // frame times + hitch attribution (anything over 40 ms, with what happened during it)
  const dt = now - st.last, t = COF.tot, p = st.prev || {
    progs,
    texkb,
    bufkb,
    fetches: t.fetches,
    fetchKB: t.fetchKB,
    fetchMs: t.fetchMs
  };
  const ft = globalThis.__hcrFrameTimes || (globalThis.__hcrFrameTimes = []);
  ft.push(dt);
  if (ft.length > 2e4) ft.splice(0, 1e4);
  if (dt > 40 && COF.presented) {
    const h = {
      t: +(now / 1e3).toFixed(2),
      ms: +dt.toFixed(1),
      progs: progs - p.progs,
      texKB: texkb - p.texkb,
      bufKB: bufkb - p.bufkb,
      fetches: t.fetches - p.fetches,
      fetchKB: t.fetchKB - p.fetchKB,
      fetchWaitMs: +(t.fetchMs - p.fetchMs).toFixed(1)
    };
    (globalThis.__hcrHitches || (globalThis.__hcrHitches = [])).push(h);
    if (globalThis.__hcrHitches.length > 500) globalThis.__hcrHitches.shift();
  }
  st.prev = {
    progs,
    texkb,
    bufkb,
    fetches: t.fetches,
    fetchKB: t.fetchKB,
    fetchMs: t.fetchMs
  };
  st.last = now;
  if (!COF.presented) {
    COF.presented = true;
    if (Module["onFirstFrame"]) Module["onFirstFrame"]();
  }
}

function _cof_js_program_list() {
  const t = Module["programList"] || "";
  if (!t) return 0;
  const n = lengthBytesUTF8(t) + 1, p = _malloc(n);
  stringToUTF8(t, p, n);
  return p;
}

function _cof_js_set_title(p) {
  document.title = UTF8ToString(p >>> 0);
}

var _cof_js_sleep = function(ms) {
  const done = r => () => {
    COF.lastMacro = performance.now();
    r();
  };
  if (ms < 1) return new Promise(r => COF.hop(done(r)));
  if (globalThis.scheduler && scheduler.postTask) return new Promise(r => scheduler.postTask(done(r), {
    delay: ms,
    priority: "user-blocking"
  }));
  return new Promise(r => setTimeout(done(r), ms));
};

_cof_js_sleep.isAsync = true;

function _cof_js_status(p) {
  COF.status(UTF8ToString(p >>> 0));
}

async function _cof_js_tex_png(tex, p, n) {
  p >>>= 0;
  try {
    const bmp = await createImageBitmap(new Blob([ HEAPU8.slice(p, p + n) ], {
      type: "image/png"
    }), {
      premultiplyAlpha: "none",
      colorSpaceConversion: "none"
    });
    const g = GLctx, unit = g.getParameter(g.ACTIVE_TEXTURE);
    g.activeTexture(g.TEXTURE0);
    const prev = g.getParameter(g.TEXTURE_BINDING_2D);
    g.bindTexture(g.TEXTURE_2D, GL.textures[tex]);
    g.pixelStorei(g.UNPACK_FLIP_Y_WEBGL, false);
    g.pixelStorei(g.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    g.texImage2D(g.TEXTURE_2D, 0, g.RGBA, g.RGBA, g.UNSIGNED_BYTE, bmp);
    g.generateMipmap(g.TEXTURE_2D);
    g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.LINEAR_MIPMAP_LINEAR);
    g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, g.LINEAR);
    g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE);
    g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE);
    g.bindTexture(g.TEXTURE_2D, prev);
    g.activeTexture(unit);
    return 1;
  } catch (e) {
    console.error("[credits]", e);
    return 0;
  }
}

_cof_js_tex_png.isAsync = true;

var COFT = {
  th: []
};

var stackRestore = val => __emscripten_stack_restore(val);

function _cof_js_thread_switch(from, to, newStackTop) {
  const f = COFT.th[from] || (COFT.th[from] = {});
  const suspended = new Promise(res => {
    f.resume = res;
  });
  const later = fn => (performance.now() - COF.lastMacro > 16 ? COF.hop : queueMicrotask)(fn);
  if (newStackTop) {
    later(() => {
      stackRestore(newStackTop);
      const p = Module["_cof_thread_start"](to);
      if (p && p.catch) p.catch(e => {
        console.error("guest thread " + to + " died:", e);
        const m = e && e.message || (e && e.type) || (typeof e === "object" ? JSON.stringify(e, Object.getOwnPropertyNames(e)) : String(e));
        COF.status("guest thread " + to + " crashed: " + m);
      });
    });
  } else {
    const t = COFT.th[to];
    if (!t || !t.resume) {
      console.error("cof_js_thread_switch: thread " + to + " is not suspended");
      return suspended;
    }
    const r = t.resume;
    t.resume = null;
    if (performance.now() - COF.lastMacro > 16) COF.hop(r); else r();
  }
  return suspended;
}

_cof_js_thread_switch.isAsync = true;

var _cof_js_yield = function() {
  if (COF.vsync === undefined) COF.vsync = new URLSearchParams(location.search).has("vsync") || !!Module["vsync"];
  if (!COF.vsync) return new Promise(r => COF.hop(r));
  return new Promise(r => {
    let done = false;
    const go = () => {
      if (!done) {
        done = true;
        COF.lastMacro = performance.now();
        r();
      }
    };
    requestAnimationFrame(go);
    setTimeout(go, 100);
  });
};

_cof_js_yield.isAsync = true;

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

var _emscripten_date_now = () => Date.now();

var __emscripten_runtime_keepalive_clear = () => {
  noExitRuntime = false;
  runtimeKeepaliveCounter = 0;
};

var _emscripten_force_exit = status => {
  __emscripten_runtime_keepalive_clear();
  _exit(status);
};

var getHeapMax = () => // Stay one Wasm page short of 4GB: while e.g. Chrome is able to allocate
// full 4GB Wasm memories, the size will wrap back to 0 bytes in Wasm side
// for any code that deals with heap sizes, which would require special
// casing all heap size related code to treat 0 specially.
4294901760;

function _emscripten_get_heap_max() {
  return getHeapMax();
}

var _emscripten_get_now = () => performance.now();

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

/** @returns {number} */ var convertFrameToPC = frame => {
  var match;
  if (match = /\bwasm-function\[\d+\]:(0x[0-9a-f]+)/.exec(frame)) {
    // Wasm engines give the binary offset directly, so we use that as return address
    return +match[1];
  } else if (match = /:(\d+):\d+(?:\)|$)/.exec(frame)) {
    // If we are in js, we can use the js line number as the "return address".
    // This should work for wasm2js.  We tag the high bit to distinguish this
    // from wasm addresses.
    return 2147483648 | +match[1];
  }
  // return 0 if we can't find any
  return 0;
};

var jsStackTrace = () => (new Error).stack.toString();

function _emscripten_return_address(level) {
  var callstack = jsStackTrace().split("\n");
  if (callstack[0] == "Error") {
    callstack.shift();
  }
  // skip this function and the caller to get caller's return address
  var caller = callstack[level + 3];
  return convertFrameToPC(caller);
}

var _emscripten_webgl_do_commit_frame = () => {
  if (!GL.currentContext || !GL.currentContext.GLctx) {
    return -3;
  }
  if (GL.currentContext.defaultFbo) {
    GL.blitOffscreenFramebuffer(GL.currentContext);
    return 0;
  }
  if (!GL.currentContext.attributes.explicitSwapControl) {
    return -3;
  }
  // We would do GL.currentContext.GLctx.commit(); here, but the current implementation
  // in browsers has removed it - swap is implicit, so this function is a no-op for now
  // (until/unless the spec changes).
  return 0;
};

var _emscripten_webgl_commit_frame = _emscripten_webgl_do_commit_frame;

var webglPowerPreferences = [ "default", "low-power", "high-performance" ];

var maybeCStringToJsString = cString => cString > 2 ? UTF8ToString(cString) : cString;

/** @type {Object} */ var specialHTMLTargets = [ 0, document, window ];

var findEventTarget = target => {
  target = maybeCStringToJsString(target);
  var domElement = specialHTMLTargets[target] || document.querySelector(target);
  return domElement;
};

var findCanvasEventTarget = findEventTarget;

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
  if (contextAttributes.explicitSwapControl && !contextAttributes.renderViaOffscreenBackBuffer) {
    contextAttributes.renderViaOffscreenBackBuffer = true;
  }
  var contextHandle = GL.createContext(canvas, contextAttributes);
  return contextHandle;
}

var _emscripten_webgl_create_context = _emscripten_webgl_do_create_context;

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

function _emscripten_webgl_get_drawing_buffer_size(contextHandle, width, height) {
  contextHandle >>>= 0;
  width >>>= 0;
  height >>>= 0;
  var GLContext = GL.getContext(contextHandle);
  if (!GLContext || !GLContext.GLctx || !width || !height) {
    return -5;
  }
  HEAP32[((width) >>> 2) >>> 0] = GLContext.GLctx.drawingBufferWidth;
  HEAP32[((height) >>> 2) >>> 0] = GLContext.GLctx.drawingBufferHeight;
  return 0;
}

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
    // Browser language detection #8751
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
    if (isNaN(offset)) return 61;
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

var _emscripten_glAlphaFunc = (func, ref) => {
  switch (func) {
   case 512:
   // GL_NEVER
    case 513:
   // GL_LESS
    case 514:
   // GL_EQUAL
    case 515:
   // GL_LEQUAL
    case 516:
   // GL_GREATER
    case 517:
   // GL_NOTEQUAL
    case 518:
   // GL_GEQUAL
    case 519:
    // GL_ALWAYS
    GLEmulation.alphaTestRef = ref;
    if (GLEmulation.alphaTestFunc != func) {
      GLEmulation.alphaTestFunc = func;
      GLImmediate.currentRenderer = null;
    }
    break;

   default:
    // invalid value provided
    break;
  }
};

var _glAlphaFunc = _emscripten_glAlphaFunc;

var _emscripten_glBegin = mode => {
  // Push the old state:
  GLImmediate.enabledClientAttributes_preBegin = GLImmediate.enabledClientAttributes;
  GLImmediate.enabledClientAttributes = [];
  GLImmediate.clientAttributes_preBegin = GLImmediate.clientAttributes;
  GLImmediate.clientAttributes = [];
  for (var i = 0; i < GLImmediate.clientAttributes_preBegin.length; i++) {
    GLImmediate.clientAttributes.push({});
  }
  GLImmediate.mode = mode;
  GLImmediate.vertexCounter = 0;
  var components = GLImmediate.rendererComponents = [];
  for (var i = 0; i < GLImmediate.NUM_ATTRIBUTES; i++) {
    components[i] = 0;
  }
  GLImmediate.rendererComponentPointer = 0;
  GLImmediate.vertexData = GLImmediate.tempData;
};

var _glBegin = _emscripten_glBegin;

var _emscripten_glBeginQuery = (target, id) => {
  GLctx.beginQuery(target, GL.queries[id]);
};

var _glBeginQuery = _emscripten_glBeginQuery;

var _emscripten_glBindFramebuffer = (target, framebuffer) => {
  // defaultFbo may not be present if 'renderViaOffscreenBackBuffer' was not enabled during context creation time,
  // i.e. setting -sOFFSCREEN_FRAMEBUFFER at compilation time does not yet mandate that offscreen back buffer
  // is being used, but that is ultimately decided at context creation time.
  GLctx.bindFramebuffer(target, framebuffer ? GL.framebuffers[framebuffer] : GL.currentContext.defaultFbo);
};

var _glBindFramebuffer = _emscripten_glBindFramebuffer;

var _emscripten_glBindRenderbuffer = (target, renderbuffer) => {
  GLctx.bindRenderbuffer(target, GL.renderbuffers[renderbuffer]);
};

var _glBindRenderbuffer = _emscripten_glBindRenderbuffer;

var _emscripten_glBindSampler = (unit, sampler) => {
  GLctx.bindSampler(unit, GL.samplers[sampler]);
};

var _glBindSampler = _emscripten_glBindSampler;

var _emscripten_glBindTexture = (target, texture) => {
  GLctx.bindTexture(target, GL.textures[texture]);
};

var _glBindTexture = _emscripten_glBindTexture;

var _emscripten_glEnableClientState = cap => {
  var attrib = GLEmulation.getAttributeFromCapability(cap);
  if (attrib === null) {
    return;
  }
  if (!GLImmediate.enabledClientAttributes[attrib]) {
    GLImmediate.enabledClientAttributes[attrib] = true;
    GLImmediate.totalEnabledClientAttributes++;
    GLImmediate.currentRenderer = null;
    // Will need to change current renderer, since the set of active vertex pointers changed.
    if (GLEmulation.currentVao) GLEmulation.currentVao.enabledClientStates[cap] = 1;
    GLImmediate.modifiedClientAttributes = true;
  }
};

var _glEnableClientState = _emscripten_glEnableClientState;

var emulGlBindVertexArray = vao => {
  // undo vao-related things, wipe the slate clean, both for vao of 0 or an actual vao
  GLEmulation.currentVao = null;
  // make sure the commands we run here are not recorded
  GLImmediate.lastRenderer?.cleanup();
  _glBindBuffer(GLctx.ARRAY_BUFFER, 0);
  // XXX if one was there before we were bound?
  _glBindBuffer(GLctx.ELEMENT_ARRAY_BUFFER, 0);
  for (var vaa in GLEmulation.enabledVertexAttribArrays) {
    GLctx.disableVertexAttribArray(vaa);
  }
  GLEmulation.enabledVertexAttribArrays = {};
  GLImmediate.enabledClientAttributes = [ 0, 0 ];
  GLImmediate.totalEnabledClientAttributes = 0;
  GLImmediate.modifiedClientAttributes = true;
  if (vao) {
    // replay vao
    var info = GLEmulation.vaos[vao];
    _glBindBuffer(GLctx.ARRAY_BUFFER, info.arrayBuffer);
    // XXX overwrite current binding?
    _glBindBuffer(GLctx.ELEMENT_ARRAY_BUFFER, info.elementArrayBuffer);
    for (var vaa in info.enabledVertexAttribArrays) {
      _glEnableVertexAttribArray(vaa);
    }
    for (var vaa in info.vertexAttribPointers) {
      _glVertexAttribPointer(...info.vertexAttribPointers[vaa]);
    }
    for (var attrib in info.enabledClientStates) {
      _glEnableClientState(attrib | 0);
    }
    GLEmulation.currentVao = info;
  }
};

var _emscripten_glBindVertexArray = vao => {
  emulGlBindVertexArray(vao);
  var ibo = GLctx.getParameter(34965);
  GLctx.currentElementArrayBufferBinding = ibo ? (ibo.name | 0) : 0;
};

var _glBindVertexArray = _emscripten_glBindVertexArray;

var _emscripten_glBlendColor = (x0, x1, x2, x3) => GLctx.blendColor(x0, x1, x2, x3);

var _glBlendColor = _emscripten_glBlendColor;

var _emscripten_glBlendEquationSeparate = (x0, x1) => GLctx.blendEquationSeparate(x0, x1);

var _glBlendEquationSeparate = _emscripten_glBlendEquationSeparate;

var _emscripten_glBlendFunc = (x0, x1) => GLctx.blendFunc(x0, x1);

var _glBlendFunc = _emscripten_glBlendFunc;

var _emscripten_glBlendFuncSeparate = (x0, x1, x2, x3) => GLctx.blendFuncSeparate(x0, x1, x2, x3);

var _glBlendFuncSeparate = _emscripten_glBlendFuncSeparate;

var _emscripten_glBlitFramebuffer = (x0, x1, x2, x3, x4, x5, x6, x7, x8, x9) => GLctx.blitFramebuffer(x0, x1, x2, x3, x4, x5, x6, x7, x8, x9);

var _glBlitFramebuffer = _emscripten_glBlitFramebuffer;

function _emscripten_glBufferData(target, size, data, usage) {
  size >>>= 0;
  data >>>= 0;
  switch (usage) {
   // fix usages, WebGL 1 only has *_DRAW
    case 35041:
   // GL_STREAM_READ
    case 35042:
    // GL_STREAM_COPY
    usage = 35040;
    // GL_STREAM_DRAW
    break;

   case 35045:
   // GL_STATIC_READ
    case 35046:
    // GL_STATIC_COPY
    usage = 35044;
    // GL_STATIC_DRAW
    break;

   case 35049:
   // GL_DYNAMIC_READ
    case 35050:
    // GL_DYNAMIC_COPY
    usage = 35048;
    // GL_DYNAMIC_DRAW
    break;
  }
  // N.b. here first form specifies a heap subarray, second form an integer
  // size, so the ?: code here is polymorphic. It is advised to avoid
  // randomly mixing both uses in calling code, to avoid any potential JS
  // engine JIT issues.
  GLctx.bufferData(target, data ? HEAPU8.subarray(data >>> 0, data + size >>> 0) : size, usage);
}

var _glBufferData = _emscripten_glBufferData;

function _emscripten_glBufferSubData(target, offset, size, data) {
  offset >>>= 0;
  size >>>= 0;
  data >>>= 0;
  GLctx.bufferSubData(target, offset, HEAPU8.subarray(data >>> 0, data + size >>> 0));
}

var _glBufferSubData = _emscripten_glBufferSubData;

var _emscripten_glCheckFramebufferStatus = x0 => GLctx.checkFramebufferStatus(x0);

var _glCheckFramebufferStatus = _emscripten_glCheckFramebufferStatus;

var _emscripten_glClear = x0 => GLctx.clear(x0);

var _glClear = _emscripten_glClear;

var _emscripten_glClearColor = (x0, x1, x2, x3) => GLctx.clearColor(x0, x1, x2, x3);

var _glClearColor = _emscripten_glClearColor;

var _emscripten_glClearDepth = x0 => GLctx.clearDepth(x0);

var _glClearDepth = _emscripten_glClearDepth;

var _emscripten_glClearDepthf = x0 => GLctx.clearDepth(x0);

var _glClearDepthf = _emscripten_glClearDepthf;

var _emscripten_glClearStencil = x0 => GLctx.clearStencil(x0);

var _glClearStencil = _emscripten_glClearStencil;

var _emscripten_glClientActiveTexture = texture => {
  GLImmediate.clientActiveTexture = texture - 33984;
};

var _glClientActiveTexture = _emscripten_glClientActiveTexture;

function _emscripten_glClipPlane(pname, param) {
  param >>>= 0;
  if ((pname >= 12288) && (pname < 12294)) {
    var clipPlaneId = pname - 12288;
    GLEmulation.clipPlaneEquation[clipPlaneId][0] = HEAPF64[((param) >>> 3) >>> 0];
    GLEmulation.clipPlaneEquation[clipPlaneId][1] = HEAPF64[(((param) + (8)) >>> 3) >>> 0];
    GLEmulation.clipPlaneEquation[clipPlaneId][2] = HEAPF64[(((param) + (16)) >>> 3) >>> 0];
    GLEmulation.clipPlaneEquation[clipPlaneId][3] = HEAPF64[(((param) + (24)) >>> 3) >>> 0];
    // apply inverse transposed current modelview matrix when setting clip plane
    var tmpMV = GLImmediate.matrixLib.mat4.create(GLImmediate.matrix[0]);
    GLImmediate.matrixLib.mat4.inverse(tmpMV);
    GLImmediate.matrixLib.mat4.transpose(tmpMV);
    GLImmediate.matrixLib.mat4.multiplyVec4(tmpMV, GLEmulation.clipPlaneEquation[clipPlaneId]);
  }
}

var _glClipPlane = _emscripten_glClipPlane;

var _emscripten_glColorMask = (red, green, blue, alpha) => {
  GLctx.colorMask(!!red, !!green, !!blue, !!alpha);
};

var _glColorMask = _emscripten_glColorMask;

function _emscripten_glColorPointer(size, type, stride, pointer) {
  pointer >>>= 0;
  GLImmediate.setClientAttribute(GLImmediate.COLOR, size, type, stride, pointer);
}

var _glColorPointer = _emscripten_glColorPointer;

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

var _glCompressedTexSubImage2D = _emscripten_glCompressedTexSubImage2D;

var _emscripten_glCopyTexImage2D = (x0, x1, x2, x3, x4, x5, x6, x7) => GLctx.copyTexImage2D(x0, x1, x2, x3, x4, x5, x6, x7);

var _glCopyTexImage2D = _emscripten_glCopyTexImage2D;

var _emscripten_glCopyTexSubImage2D = (x0, x1, x2, x3, x4, x5, x6, x7) => GLctx.copyTexSubImage2D(x0, x1, x2, x3, x4, x5, x6, x7);

var _glCopyTexSubImage2D = _emscripten_glCopyTexSubImage2D;

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

var _glCreateProgram = _emscripten_glCreateProgram;

var _emscripten_glCullFace = x0 => GLctx.cullFace(x0);

var _glCullFace = _emscripten_glCullFace;

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

var _glDeleteBuffers = _emscripten_glDeleteBuffers;

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

var _glDeleteFramebuffers = _emscripten_glDeleteFramebuffers;

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

var _glDeleteQueries = _emscripten_glDeleteQueries;

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

var _glDeleteRenderbuffers = _emscripten_glDeleteRenderbuffers;

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

var _glDeleteShader = _emscripten_glDeleteShader;

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

var _glDeleteTextures = _emscripten_glDeleteTextures;

var emulGlDeleteVertexArrays = (n, vaos) => {
  for (var i = 0; i < n; i++) {
    var id = HEAP32[(((vaos) + (i * 4)) >>> 2) >>> 0];
    GLEmulation.vaos[id] = null;
    if (GLEmulation.currentVao?.id == id) GLEmulation.currentVao = null;
  }
};

function _emscripten_glDeleteVertexArrays(n, vaos) {
  vaos >>>= 0;
  emulGlDeleteVertexArrays(n, vaos);
}

var _glDeleteVertexArrays = _emscripten_glDeleteVertexArrays;

var _emscripten_glDepthFunc = x0 => GLctx.depthFunc(x0);

var _glDepthFunc = _emscripten_glDepthFunc;

var _emscripten_glDepthMask = flag => {
  GLctx.depthMask(!!flag);
};

var _glDepthMask = _emscripten_glDepthMask;

var _emscripten_glDepthRange = (x0, x1) => GLctx.depthRange(x0, x1);

var _glDepthRange = _emscripten_glDepthRange;

var _emscripten_glDepthRangef = (x0, x1) => GLctx.depthRange(x0, x1);

var _glDepthRangef = _emscripten_glDepthRangef;

var _emscripten_glDisableClientState = cap => {
  var attrib = GLEmulation.getAttributeFromCapability(cap);
  if (attrib === null) {
    return;
  }
  if (GLImmediate.enabledClientAttributes[attrib]) {
    GLImmediate.enabledClientAttributes[attrib] = false;
    GLImmediate.totalEnabledClientAttributes--;
    GLImmediate.currentRenderer = null;
    // Will need to change current renderer, since the set of active vertex pointers changed.
    if (GLEmulation.currentVao) delete GLEmulation.currentVao.enabledClientStates[cap];
    GLImmediate.modifiedClientAttributes = true;
  }
};

var _glDisableClientState = _emscripten_glDisableClientState;

var _cof_gl_array_texgen = function(first, count, indices) {
  if (COFTexGen.expandedElements) return null;
  if (count <= 0 || GLctx.currentArrayBufferBinding) return null;
  var units = [];
  for (var unit = 0; unit < GLImmediate.MAX_TEXTURES; unit++) if (GLImmediate.TexEnvJIT.getTexUnitType(unit) && COFTexGen.get(unit).some(g => g.enabled)) units.push(unit);
  if (!units.length) return null;
  var old = {
    attributes: GLImmediate.clientAttributes,
    enabled: GLImmediate.enabledClientAttributes,
    total: GLImmediate.totalEnabledClientAttributes
  };
  var sizeOf = t => t === 5120 || t === 5121 ? 1 : t === 5122 || t === 5123 ? 2 : t === 5130 ? 8 : 4;
  var scalar = (address, type) => {
    switch (type) {
     case 5120:
      return HEAP8[address >>> 0];

     case 5121:
      return HEAPU8[address >>> 0];

     case 5122:
      return HEAP16[address >>> 1 >>> 0];

     case 5123:
      return HEAPU16[address >>> 1 >>> 0];

     case 5124:
      return HEAP32[address >>> 2 >>> 0];

     case 5125:
      return HEAPU32[address >>> 2 >>> 0];

     case 5130:
      return HEAPF64[address >>> 3 >>> 0];

     case 5132:
      return HEAP32[address >>> 2 >>> 0] / 65536;

     default:
      return HEAPF32[address >>> 2 >>> 0];
    }
  };
  var read = (attribute, index, fallback, normal, result) => {
    for (var j = 0; j < result.length; j++) result[j] = fallback[j];
    if (!attribute?.size) return result;
    var bytes = sizeOf(attribute.type), stride = attribute.stride || attribute.size * bytes;
    for (var j = 0; j < attribute.size && j < result.length; j++) {
      var v = scalar(attribute.pointer + index * stride + j * bytes, attribute.type);
      if (normal) {
        var divisor = attribute.type === 5120 ? 127 : attribute.type === 5122 ? 32767 : attribute.type === 5124 ? 2147483647 : 1;
        v = Math.max(-1, v / divisor);
      }
      result[j] = v;
    }
    return result;
  };
  var position = old.enabled[GLImmediate.VERTEX] ? old.attributes[GLImmediate.VERTEX] : null;
  if (!position?.size) return null;
  var normal = old.enabled[GLImmediate.NORMAL] ? old.attributes[GLImmediate.NORMAL] : null;
  var attributes = old.attributes.map(a => ({
    ...a
  })), enabled = old.enabled.slice();
  for (var i = 0; i < attributes.length; i++) if (enabled[i]) {
    var attr = attributes[i];
    attr.pointer += first * (attr.stride || attr.size * sizeOf(attr.type));
  }
  // Indexed client geometry needs every enabled attribute gathered in index
  // order, including color and pre-existing lightmap coordinates.
  if (indices) {
    COFTexGen.attributeBuffers ||= [];
    for (var i = 0; i < attributes.length; i++) if (enabled[i]) {
      var source = old.attributes[i], bytes = source.size * sizeOf(source.type), stride = source.stride || bytes, needed = count * bytes;
      var buffer = COFTexGen.attributeBuffers[i];
      if (!buffer || buffer.capacity < needed) {
        var capacity = Math.max(4096, needed, buffer ? buffer.capacity * 2 : 0), pointer = _malloc(capacity);
        if (!pointer) {
          GL.recordError(1285);
          return null;
        }
        if (buffer) _free(buffer.pointer);
        buffer = COFTexGen.attributeBuffers[i] = {
          pointer,
          capacity
        };
      }
      for (var vertex = 0; vertex < count; vertex++) {
        var begin = source.pointer + indices[vertex] * stride;
        var destination = buffer.pointer + vertex * bytes;
        if (((begin | destination | bytes) & 3) === 0) {
          for (var k = 0; k < bytes; k += 4) HEAP32[(destination + k) >>> 2 >>> 0] = HEAP32[(begin + k) >>> 2 >>> 0];
        } else for (var k = 0; k < bytes; k++) HEAPU8[destination + k >>> 0] = HEAPU8[begin + k >>> 0];
      }
      attributes[i] = {
        ...source,
        pointer: buffer.pointer,
        stride: bytes
      };
    }
  }
  COFTexGen.arrayBuffers ||= [];
  for (var unit of units) {
    var buffer = COFTexGen.arrayBuffers[unit], needed = count * 16;
    if (!buffer || buffer.capacity < needed) {
      var capacity = Math.max(4096, needed, buffer ? buffer.capacity * 2 : 0), pointer = _malloc(capacity);
      if (!pointer) {
        GL.recordError(1285);
        return null;
      }
      if (buffer) _free(buffer.pointer);
      buffer = COFTexGen.arrayBuffers[unit] = {
        pointer,
        capacity
      };
    }
    var slot = GLImmediate.TEXTURE0 + unit, source = old.enabled[slot] ? old.attributes[slot] : null;
    var p = [ 0, 0, 0, 1 ], n = [ 0, 0, 1 ], coord = [ 0, 0, 0, 1 ], defaultPosition = [ 0, 0, 0, 1 ], defaultCoord = COFLegacyState.coords[unit] || defaultPosition, needsNormal = COFTexGen.prepare(unit).special;
    for (var vertex = 0; vertex < count; vertex++) {
      var at = indices ? indices[vertex] : first + vertex;
      read(position, at, defaultPosition, false, p);
      if (needsNormal) read(normal, at, COFLegacyState.normal, true, n);
      read(source, at, defaultCoord, false, coord);
      COFTexGen.write(unit, p, n, coord, HEAPF32, (buffer.pointer >>> 2) + vertex * 4);
    }
    attributes[slot] = {
      size: 4,
      type: 5126,
      stride: 16,
      pointer: buffer.pointer
    };
    enabled[slot] = true;
  }
  GLImmediate.clientAttributes = attributes;
  GLImmediate.enabledClientAttributes = enabled;
  GLImmediate.totalEnabledClientAttributes = enabled.filter(Boolean).length;
  GLImmediate.modifiedClientAttributes = true;
  return old;
};

function _cof_gl_restore_array_texgen(old) {
  if (!old) return;
  GLImmediate.clientAttributes = old.attributes;
  GLImmediate.enabledClientAttributes = old.enabled;
  GLImmediate.totalEnabledClientAttributes = old.total;
  GLImmediate.modifiedClientAttributes = true;
}

var _emscripten_glDrawArrays = (mode, first, count) => {
  var cofArrays = _cof_gl_array_texgen(first, count);
  if (cofArrays) first = 0;
  try {
    if (first < 0 || count < 0) {
      GL.recordError(1281);
      return;
    }
    if (!count) return;
    if (GLImmediate.totalEnabledClientAttributes == 0 && mode <= 6) {
      GLctx.drawArrays(mode, first, count);
      return;
    }
    if (GLImmediate.prepareClientAttributes(count, false, first) === false) return;
    GLImmediate.mode = mode;
    if (!GLctx.currentArrayBufferBinding) {
      GLImmediate.vertexData = HEAPF32.subarray((((GLImmediate.vertexPointer) >>> 2)) >>> 0, ((GLImmediate.vertexPointer + count * GLImmediate.stride) >>> 2) >>> 0);
      // XXX assuming float
      GLImmediate.firstVertex = 0;
      GLImmediate.lastVertex = count;
    }
    GLImmediate.flush(null, GLctx.currentArrayBufferBinding ? first : 0);
    GLImmediate.mode = -1;
  } finally {
    _cof_gl_restore_array_texgen(cofArrays);
  }
};

var _glDrawArrays = _emscripten_glDrawArrays;

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

var _cof_gl_elements_texgen = function(count, type, pointer) {
  if (count <= 0 || GLctx.currentArrayBufferBinding || GLctx.currentElementArrayBufferBinding) return null;
  var active = false;
  for (var unit = 0; unit < GLImmediate.MAX_TEXTURES; unit++) if (GLImmediate.TexEnvJIT.getTexUnitType(unit) && COFTexGen.get(unit).some(g => g.enabled)) {
    active = true;
    break;
  }
  if (!active) return null;
  var source = type === 5121 ? HEAPU8 : type === 5123 ? HEAPU16 : type === 5125 ? HEAPU32 : null;
  if (!source) {
    GL.recordError(1280);
    return null;
  }
  var start = pointer / source.BYTES_PER_ELEMENT;
  // Copy before _malloc can grow WebAssembly.Memory and detach heap views.
  var indices = source.slice(start, start + count);
  return _cof_gl_array_texgen(0, count, indices);
};

function _emscripten_glDrawElements(mode, count, type, indices, start, end) {
  indices >>>= 0;
  if (count < 0) {
    GL.recordError(1281);
    return;
  }
  if (!count) return;
  var cofElements = _cof_gl_elements_texgen(count, type, indices);
  if (cofElements) {
    COFTexGen.expandedElements = true;
    try {
      _glDrawArrays(mode, 0, count);
    } finally {
      COFTexGen.expandedElements = false;
      _cof_gl_restore_array_texgen(cofElements);
    }
    return;
  }
  if (GLImmediate.totalEnabledClientAttributes == 0 && mode <= 6 && GLctx.currentElementArrayBufferBinding) {
    GLctx.drawElements(mode, count, type, indices);
    return;
  }
  GLImmediate.prepareClientAttributes(count, false);
  GLImmediate.mode = mode;
  if (!GLctx.currentArrayBufferBinding) {
    GLImmediate.firstVertex = end ? start : HEAP8.length;
    // if we don't know the start, set an invalid value and we will calculate it later from the indices
    GLImmediate.lastVertex = end ? end + 1 : 0;
    start = GLImmediate.vertexPointer;
    // TODO(sbc): Combine these two subarray calls back into a single one if
    // we ever fix https://github.com/emscripten-core/emscripten/issues/21250.
    if (end) {
      end = GLImmediate.vertexPointer + (end + 1) * GLImmediate.stride;
      GLImmediate.vertexData = HEAPF32.subarray(((start) >>> 2) >>> 0, ((end) >>> 2) >>> 0);
    } else {
      GLImmediate.vertexData = HEAPF32.subarray(((start) >>> 2) >>> 0);
    }
  }
  GLImmediate.flush(count, 0, indices);
  GLImmediate.mode = -1;
}

var _glDrawElements = _emscripten_glDrawElements;

function _emscripten_glDrawElementsInstanced(mode, count, type, indices, primcount) {
  indices >>>= 0;
  GLctx.drawElementsInstanced(mode, count, type, indices, primcount);
}

var _glDrawElementsInstanced = _emscripten_glDrawElementsInstanced;

var _emscripten_glEndQuery = x0 => GLctx.endQuery(x0);

var _glEndQuery = _emscripten_glEndQuery;

var _emscripten_glFinish = () => GLctx.finish();

var _glFinish = _emscripten_glFinish;

var _emscripten_glFlush = () => GLctx.flush();

var _glFlush = _emscripten_glFlush;

var _emscripten_glFogf = (pname, param) => {
  // partial support, TODO
  switch (pname) {
   case 2915:
    // GL_FOG_START
    GLEmulation.fogStart = param;
    break;

   case 2916:
    // GL_FOG_END
    GLEmulation.fogEnd = param;
    break;

   case 2914:
    // GL_FOG_DENSITY
    GLEmulation.fogDensity = param;
    break;

   case 2917:
    // GL_FOG_MODE
    switch (param) {
     case 2049:
     // GL_EXP2
      case 9729:
      // GL_LINEAR
      if (GLEmulation.fogMode != param) {
        GLImmediate.currentRenderer = null;
        // Fog mode is part of the FFP shader state, we must re-lookup the renderer to use.
        GLEmulation.fogMode = param;
      }
      break;

     default:
      // default to GL_EXP
      if (GLEmulation.fogMode != 2048) {
        GLImmediate.currentRenderer = null;
        // Fog mode is part of the FFP shader state, we must re-lookup the renderer to use.
        GLEmulation.fogMode = 2048;
      }
      break;
    }
    break;
  }
};

var _glFogf = _emscripten_glFogf;

function _emscripten_glFogfv(pname, param) {
  param >>>= 0;
  // partial support, TODO
  switch (pname) {
   case 2918:
    // GL_FOG_COLOR
    GLEmulation.fogColor[0] = HEAPF32[((param) >>> 2) >>> 0];
    GLEmulation.fogColor[1] = HEAPF32[(((param) + (4)) >>> 2) >>> 0];
    GLEmulation.fogColor[2] = HEAPF32[(((param) + (8)) >>> 2) >>> 0];
    GLEmulation.fogColor[3] = HEAPF32[(((param) + (12)) >>> 2) >>> 0];
    break;

   case 2915:
   // GL_FOG_START
    case 2916:
    // GL_FOG_END
    _glFogf(pname, HEAPF32[((param) >>> 2) >>> 0]);
    break;
  }
}

var _glFogfv = _emscripten_glFogfv;

var _emscripten_glFogi = (pname, param) => _glFogf(pname, param);

var _glFogi = _emscripten_glFogi;

function _emscripten_glFogiv(pname, param) {
  param >>>= 0;
  switch (pname) {
   case 2918:
    // GL_FOG_COLOR
    GLEmulation.fogColor[0] = (HEAP32[((param) >>> 2) >>> 0] / 2147483647) / 2 + .5;
    GLEmulation.fogColor[1] = (HEAP32[(((param) + (4)) >>> 2) >>> 0] / 2147483647) / 2 + .5;
    GLEmulation.fogColor[2] = (HEAP32[(((param) + (8)) >>> 2) >>> 0] / 2147483647) / 2 + .5;
    GLEmulation.fogColor[3] = (HEAP32[(((param) + (12)) >>> 2) >>> 0] / 2147483647) / 2 + .5;
    break;

   default:
    _glFogf(pname, HEAP32[((param) >>> 2) >>> 0]);
    break;
  }
}

var _glFogiv = _emscripten_glFogiv;

var _emscripten_glFramebufferRenderbuffer = (target, attachment, renderbuffertarget, renderbuffer) => {
  GLctx.framebufferRenderbuffer(target, attachment, renderbuffertarget, GL.renderbuffers[renderbuffer]);
};

var _glFramebufferRenderbuffer = _emscripten_glFramebufferRenderbuffer;

var _emscripten_glFramebufferTexture2D = (target, attachment, textarget, texture, level) => {
  GLctx.framebufferTexture2D(target, attachment, textarget, GL.textures[texture], level);
};

var _glFramebufferTexture2D = _emscripten_glFramebufferTexture2D;

var _emscripten_glFrontFace = x0 => GLctx.frontFace(x0);

var _glFrontFace = _emscripten_glFrontFace;

var _emscripten_glFrustum = (left, right, bottom, top_, nearVal, farVal) => {
  GLImmediate.matricesModified = true;
  GLImmediate.matrixVersion[GLImmediate.currentMatrix] = (GLImmediate.matrixVersion[GLImmediate.currentMatrix] + 1) | 0;
  GLImmediate.matrixLib.mat4.multiply(GLImmediate.matrix[GLImmediate.currentMatrix], GLImmediate.matrixLib.mat4.frustum(left, right, bottom, top_, nearVal, farVal));
};

var _glFrustum = _emscripten_glFrustum;

function _emscripten_glGenBuffers(n, buffers) {
  buffers >>>= 0;
  GL.genObject(n, buffers, "createBuffer", GL.buffers);
}

var _glGenBuffers = _emscripten_glGenBuffers;

function _emscripten_glGenFramebuffers(n, ids) {
  ids >>>= 0;
  GL.genObject(n, ids, "createFramebuffer", GL.framebuffers);
}

var _glGenFramebuffers = _emscripten_glGenFramebuffers;

function _emscripten_glGenQueries(n, ids) {
  ids >>>= 0;
  GL.genObject(n, ids, "createQuery", GL.queries);
}

var _glGenQueries = _emscripten_glGenQueries;

function _emscripten_glGenRenderbuffers(n, renderbuffers) {
  renderbuffers >>>= 0;
  GL.genObject(n, renderbuffers, "createRenderbuffer", GL.renderbuffers);
}

var _glGenRenderbuffers = _emscripten_glGenRenderbuffers;

function _emscripten_glGenSamplers(n, samplers) {
  samplers >>>= 0;
  GL.genObject(n, samplers, "createSampler", GL.samplers);
}

var _glGenSamplers = _emscripten_glGenSamplers;

function _emscripten_glGenTextures(n, textures) {
  textures >>>= 0;
  GL.genObject(n, textures, "createTexture", GL.textures);
}

var _glGenTextures = _emscripten_glGenTextures;

var emulGlGenVertexArrays = (n, vaos) => {
  for (var i = 0; i < n; i++) {
    var id = GL.getNewId(GLEmulation.vaos);
    GLEmulation.vaos[id] = {
      id,
      arrayBuffer: 0,
      elementArrayBuffer: 0,
      enabledVertexAttribArrays: {},
      vertexAttribPointers: {},
      enabledClientStates: {}
    };
    HEAP32[(((vaos) + (i * 4)) >>> 2) >>> 0] = id;
  }
};

function _emscripten_glGenVertexArrays(n, arrays) {
  arrays >>>= 0;
  emulGlGenVertexArrays(n, arrays);
}

var _glGenVertexArrays = _emscripten_glGenVertexArrays;

var _emscripten_glGenerateMipmap = x0 => GLctx.generateMipmap(x0);

var _glGenerateMipmap = _emscripten_glGenerateMipmap;

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

function _emscripten_glGetActiveUniform(program, index, bufSize, length, size, type, name) {
  length >>>= 0;
  size >>>= 0;
  type >>>= 0;
  name >>>= 0;
  return __glGetActiveAttribOrUniform("getActiveUniform", program, index, bufSize, length, size, type, name);
}

var _glGetActiveUniform = _emscripten_glGetActiveUniform;

function _emscripten_glGetAttribLocation(program, name) {
  name >>>= 0;
  return GLctx.getAttribLocation(GL.programs[program], UTF8ToString(name));
}

var _glGetAttribLocation = _emscripten_glGetAttribLocation;

var _emscripten_glGetError = () => {
  var error = GLctx.getError() || GL.lastError;
  GL.lastError = 0;
  return error;
};

var _glGetError = _emscripten_glGetError;

function _emscripten_glGetPointerv(name, p) {
  p >>>= 0;
  var attribute;
  switch (name) {
   case 32910:
    // GL_VERTEX_ARRAY_POINTER
    attribute = GLImmediate.clientAttributes[GLImmediate.VERTEX];
    break;

   case 32912:
    // GL_COLOR_ARRAY_POINTER
    attribute = GLImmediate.clientAttributes[GLImmediate.COLOR];
    break;

   case 32914:
    // GL_TEXTURE_COORD_ARRAY_POINTER
    attribute = GLImmediate.clientAttributes[GLImmediate.TEXTURE0 + GLImmediate.clientActiveTexture];
    break;

   default:
    GL.recordError(1280);
    return;
  }
  HEAP32[((p) >>> 2) >>> 0] = attribute ? attribute.pointer : 0;
}

var _glGetPointerv = _emscripten_glGetPointerv;

function _emscripten_glGetProgramInfoLog(program, maxLength, length, infoLog) {
  length >>>= 0;
  infoLog >>>= 0;
  var log = GLctx.getProgramInfoLog(GL.programs[program]);
  if (log === null) log = "(unknown error)";
  var numBytesWrittenExclNull = (maxLength > 0 && infoLog) ? stringToUTF8(log, infoLog, maxLength) : 0;
  if (length) HEAP32[((length) >>> 2) >>> 0] = numBytesWrittenExclNull;
}

var _glGetProgramInfoLog = _emscripten_glGetProgramInfoLog;

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

var _glGetProgramiv = _emscripten_glGetProgramiv;

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

var _glGetQueryObjectuiv = _emscripten_glGetQueryObjectuiv;

function _emscripten_glGetShaderInfoLog(shader, maxLength, length, infoLog) {
  length >>>= 0;
  infoLog >>>= 0;
  var log = GLctx.getShaderInfoLog(GL.shaders[shader]);
  if (log === null) log = "(unknown error)";
  var numBytesWrittenExclNull = (maxLength > 0 && infoLog) ? stringToUTF8(log, infoLog, maxLength) : 0;
  if (length) HEAP32[((length) >>> 2) >>> 0] = numBytesWrittenExclNull;
}

var _glGetShaderInfoLog = _emscripten_glGetShaderInfoLog;

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

var _glGetShaderiv = _emscripten_glGetShaderiv;

function _emscripten_glGetTexEnvfv(target, pname, param) {
  param >>>= 0;
  return abort("GL emulation not initialized!");
}

var _glGetTexEnvfv = _emscripten_glGetTexEnvfv;

function _emscripten_glGetTexEnviv(target, pname, param) {
  param >>>= 0;
  return abort("GL emulation not initialized!");
}

var _glGetTexEnviv = _emscripten_glGetTexEnviv;

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

var _glGetTexParameterfv = _emscripten_glGetTexParameterfv;

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

var _glGetTexParameteriv = _emscripten_glGetTexParameteriv;

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
    // If an uniform with this name exists, and if its index is within the
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

var _glGetUniformLocation = _emscripten_glGetUniformLocation;

var _emscripten_glIsTexture = id => {
  var texture = GL.textures[id];
  if (!texture) return 0;
  return GLctx.isTexture(texture);
};

var _glIsTexture = _emscripten_glIsTexture;

var _emscripten_glLightModelf = (pname, param) => {
  if (pname == 2898) {
    // GL_LIGHT_MODEL_TWO_SIDE
    GLEmulation.lightModelTwoSide = (param != 0) ? true : false;
  } else {
    abort("glLightModelf: TODO: " + pname);
  }
};

var _glLightModelf = _emscripten_glLightModelf;

function _emscripten_glLightModelfv(pname, param) {
  param >>>= 0;
  // TODO: GL_LIGHT_MODEL_LOCAL_VIEWER
  if (pname == 2899) {
    // GL_LIGHT_MODEL_AMBIENT
    GLEmulation.lightModelAmbient[0] = HEAPF32[((param) >>> 2) >>> 0];
    GLEmulation.lightModelAmbient[1] = HEAPF32[(((param) + (4)) >>> 2) >>> 0];
    GLEmulation.lightModelAmbient[2] = HEAPF32[(((param) + (8)) >>> 2) >>> 0];
    GLEmulation.lightModelAmbient[3] = HEAPF32[(((param) + (12)) >>> 2) >>> 0];
  } else {
    abort("glLightModelfv: TODO: " + pname);
  }
}

var _glLightModelfv = _emscripten_glLightModelfv;

function _emscripten_glLightfv(light, pname, param) {
  param >>>= 0;
  if ((light >= 16384) && (light < 16392)) {
    var lightId = light - 16384;
    if (pname == 4608) {
      // GL_AMBIENT
      GLEmulation.lightAmbient[lightId][0] = HEAPF32[((param) >>> 2) >>> 0];
      GLEmulation.lightAmbient[lightId][1] = HEAPF32[(((param) + (4)) >>> 2) >>> 0];
      GLEmulation.lightAmbient[lightId][2] = HEAPF32[(((param) + (8)) >>> 2) >>> 0];
      GLEmulation.lightAmbient[lightId][3] = HEAPF32[(((param) + (12)) >>> 2) >>> 0];
    } else if (pname == 4609) {
      // GL_DIFFUSE
      GLEmulation.lightDiffuse[lightId][0] = HEAPF32[((param) >>> 2) >>> 0];
      GLEmulation.lightDiffuse[lightId][1] = HEAPF32[(((param) + (4)) >>> 2) >>> 0];
      GLEmulation.lightDiffuse[lightId][2] = HEAPF32[(((param) + (8)) >>> 2) >>> 0];
      GLEmulation.lightDiffuse[lightId][3] = HEAPF32[(((param) + (12)) >>> 2) >>> 0];
    } else if (pname == 4610) {
      // GL_SPECULAR
      GLEmulation.lightSpecular[lightId][0] = HEAPF32[((param) >>> 2) >>> 0];
      GLEmulation.lightSpecular[lightId][1] = HEAPF32[(((param) + (4)) >>> 2) >>> 0];
      GLEmulation.lightSpecular[lightId][2] = HEAPF32[(((param) + (8)) >>> 2) >>> 0];
      GLEmulation.lightSpecular[lightId][3] = HEAPF32[(((param) + (12)) >>> 2) >>> 0];
    } else if (pname == 4611) {
      // GL_POSITION
      GLEmulation.lightPosition[lightId][0] = HEAPF32[((param) >>> 2) >>> 0];
      GLEmulation.lightPosition[lightId][1] = HEAPF32[(((param) + (4)) >>> 2) >>> 0];
      GLEmulation.lightPosition[lightId][2] = HEAPF32[(((param) + (8)) >>> 2) >>> 0];
      GLEmulation.lightPosition[lightId][3] = HEAPF32[(((param) + (12)) >>> 2) >>> 0];
      // multiply position with current modelviewmatrix
      GLImmediate.matrixLib.mat4.multiplyVec4(GLImmediate.matrix[0], GLEmulation.lightPosition[lightId]);
    } else {
      abort("glLightfv: TODO: " + pname);
    }
  }
}

var _glLightfv = _emscripten_glLightfv;

var _emscripten_glLineWidth = x0 => GLctx.lineWidth(x0);

var _glLineWidth = _emscripten_glLineWidth;

var _emscripten_glLoadIdentity = () => {
  GLImmediate.matricesModified = true;
  GLImmediate.matrixVersion[GLImmediate.currentMatrix] = (GLImmediate.matrixVersion[GLImmediate.currentMatrix] + 1) | 0;
  GLImmediate.matrixLib.mat4.identity(GLImmediate.matrix[GLImmediate.currentMatrix]);
};

var _glLoadIdentity = _emscripten_glLoadIdentity;

function _emscripten_glLoadMatrixd(matrix) {
  matrix >>>= 0;
  GLImmediate.matricesModified = true;
  GLImmediate.matrixVersion[GLImmediate.currentMatrix] = (GLImmediate.matrixVersion[GLImmediate.currentMatrix] + 1) | 0;
  GLImmediate.matrixLib.mat4.set(HEAPF64.subarray((((matrix) >>> 3)) >>> 0, ((matrix + 128) >>> 3) >>> 0), GLImmediate.matrix[GLImmediate.currentMatrix]);
}

var _glLoadMatrixd = _emscripten_glLoadMatrixd;

function _emscripten_glLoadMatrixf(matrix) {
  matrix >>>= 0;
  GLImmediate.matricesModified = true;
  GLImmediate.matrixVersion[GLImmediate.currentMatrix] = (GLImmediate.matrixVersion[GLImmediate.currentMatrix] + 1) | 0;
  GLImmediate.matrixLib.mat4.set(HEAPF32.subarray((((matrix) >>> 2)) >>> 0, ((matrix + 64) >>> 2) >>> 0), GLImmediate.matrix[GLImmediate.currentMatrix]);
}

var _glLoadMatrixf = _emscripten_glLoadMatrixf;

function _emscripten_glMaterialfv(face, pname, param) {
  param >>>= 0;
  if ((face != 1028) && (face != 1032)) {
    abort("glMaterialfv: TODO" + face);
  }
  // only GL_FRONT and GL_FRONT_AND_BACK supported
  if (pname == 4608) {
    // GL_AMBIENT
    GLEmulation.materialAmbient[0] = HEAPF32[((param) >>> 2) >>> 0];
    GLEmulation.materialAmbient[1] = HEAPF32[(((param) + (4)) >>> 2) >>> 0];
    GLEmulation.materialAmbient[2] = HEAPF32[(((param) + (8)) >>> 2) >>> 0];
    GLEmulation.materialAmbient[3] = HEAPF32[(((param) + (12)) >>> 2) >>> 0];
  } else if (pname == 4609) {
    // GL_DIFFUSE
    GLEmulation.materialDiffuse[0] = HEAPF32[((param) >>> 2) >>> 0];
    GLEmulation.materialDiffuse[1] = HEAPF32[(((param) + (4)) >>> 2) >>> 0];
    GLEmulation.materialDiffuse[2] = HEAPF32[(((param) + (8)) >>> 2) >>> 0];
    GLEmulation.materialDiffuse[3] = HEAPF32[(((param) + (12)) >>> 2) >>> 0];
  } else if (pname == 4610) {
    // GL_SPECULAR
    GLEmulation.materialSpecular[0] = HEAPF32[((param) >>> 2) >>> 0];
    GLEmulation.materialSpecular[1] = HEAPF32[(((param) + (4)) >>> 2) >>> 0];
    GLEmulation.materialSpecular[2] = HEAPF32[(((param) + (8)) >>> 2) >>> 0];
    GLEmulation.materialSpecular[3] = HEAPF32[(((param) + (12)) >>> 2) >>> 0];
  } else if (pname == 5633) {
    // GL_SHININESS
    GLEmulation.materialShininess[0] = HEAPF32[((param) >>> 2) >>> 0];
  } else {
    abort("glMaterialfv: TODO: " + pname);
  }
}

var _glMaterialfv = _emscripten_glMaterialfv;

function _emscripten_glMultMatrixd(matrix) {
  matrix >>>= 0;
  GLImmediate.matricesModified = true;
  GLImmediate.matrixVersion[GLImmediate.currentMatrix] = (GLImmediate.matrixVersion[GLImmediate.currentMatrix] + 1) | 0;
  GLImmediate.matrixLib.mat4.multiply(GLImmediate.matrix[GLImmediate.currentMatrix], HEAPF64.subarray((((matrix) >>> 3)) >>> 0, ((matrix + 128) >>> 3) >>> 0));
}

var _glMultMatrixd = _emscripten_glMultMatrixd;

function _emscripten_glMultMatrixf(matrix) {
  matrix >>>= 0;
  GLImmediate.matricesModified = true;
  GLImmediate.matrixVersion[GLImmediate.currentMatrix] = (GLImmediate.matrixVersion[GLImmediate.currentMatrix] + 1) | 0;
  GLImmediate.matrixLib.mat4.multiply(GLImmediate.matrix[GLImmediate.currentMatrix], HEAPF32.subarray((((matrix) >>> 2)) >>> 0, ((matrix + 64) >>> 2) >>> 0));
}

var _glMultMatrixf = _emscripten_glMultMatrixf;

function _emscripten_glNormalPointer(type, stride, pointer) {
  pointer >>>= 0;
  GLImmediate.setClientAttribute(GLImmediate.NORMAL, 3, type, stride, pointer);
}

var _glNormalPointer = _emscripten_glNormalPointer;

var _emscripten_glOrtho = (left, right, bottom, top_, nearVal, farVal) => {
  GLImmediate.matricesModified = true;
  GLImmediate.matrixVersion[GLImmediate.currentMatrix] = (GLImmediate.matrixVersion[GLImmediate.currentMatrix] + 1) | 0;
  GLImmediate.matrixLib.mat4.multiply(GLImmediate.matrix[GLImmediate.currentMatrix], GLImmediate.matrixLib.mat4.ortho(left, right, bottom, top_, nearVal, farVal));
};

var _glOrtho = _emscripten_glOrtho;

var _emscripten_glPixelStorei = (pname, param) => {
  if (pname == 3317) {
    GL.unpackAlignment = param;
  } else if (pname == 3314) {
    GL.unpackRowLength = param;
  }
  GLctx.pixelStorei(pname, param);
};

var _glPixelStorei = _emscripten_glPixelStorei;

var _emscripten_glPointSize = size => {
  GLEmulation.pointSize = size;
};

var _glPointSize = _emscripten_glPointSize;

var _emscripten_glPolygonMode = () => {};

var _glPolygonMode = _emscripten_glPolygonMode;

var _emscripten_glPolygonOffset = (x0, x1) => GLctx.polygonOffset(x0, x1);

var _glPolygonOffset = _emscripten_glPolygonOffset;

var _emscripten_glPopMatrix = () => {
  if (GLImmediate.matrixStack[GLImmediate.currentMatrix].length == 0) {
    GL.recordError(1284);
    return;
  }
  GLImmediate.matricesModified = true;
  GLImmediate.matrixVersion[GLImmediate.currentMatrix] = (GLImmediate.matrixVersion[GLImmediate.currentMatrix] + 1) | 0;
  GLImmediate.matrix[GLImmediate.currentMatrix] = GLImmediate.matrixStack[GLImmediate.currentMatrix].pop();
};

var _glPopMatrix = _emscripten_glPopMatrix;

var _emscripten_glPushMatrix = () => {
  GLImmediate.matricesModified = true;
  GLImmediate.matrixVersion[GLImmediate.currentMatrix] = (GLImmediate.matrixVersion[GLImmediate.currentMatrix] + 1) | 0;
  GLImmediate.matrixStack[GLImmediate.currentMatrix].push(Array.prototype.slice.call(GLImmediate.matrix[GLImmediate.currentMatrix]));
};

var _glPushMatrix = _emscripten_glPushMatrix;

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

var _glReadPixels = _emscripten_glReadPixels;

var _emscripten_glRenderbufferStorage = (x0, x1, x2, x3) => GLctx.renderbufferStorage(x0, x1, x2, x3);

var _glRenderbufferStorage = _emscripten_glRenderbufferStorage;

var _emscripten_glRotated = (angle, x, y, z) => {
  GLImmediate.matricesModified = true;
  GLImmediate.matrixVersion[GLImmediate.currentMatrix] = (GLImmediate.matrixVersion[GLImmediate.currentMatrix] + 1) | 0;
  GLImmediate.matrixLib.mat4.rotate(GLImmediate.matrix[GLImmediate.currentMatrix], angle * Math.PI / 180, [ x, y, z ]);
};

var _glRotated = _emscripten_glRotated;

var _glRotatef = _emscripten_glRotated;

var _emscripten_glSamplerParameterf = (sampler, pname, param) => {
  GLctx.samplerParameterf(GL.samplers[sampler], pname, param);
};

var _glSamplerParameterf = _emscripten_glSamplerParameterf;

var _emscripten_glSamplerParameteri = (sampler, pname, param) => {
  GLctx.samplerParameteri(GL.samplers[sampler], pname, param);
};

var _glSamplerParameteri = _emscripten_glSamplerParameteri;

var _emscripten_glScaled = (x, y, z) => {
  GLImmediate.matricesModified = true;
  GLImmediate.matrixVersion[GLImmediate.currentMatrix] = (GLImmediate.matrixVersion[GLImmediate.currentMatrix] + 1) | 0;
  GLImmediate.matrixLib.mat4.scale(GLImmediate.matrix[GLImmediate.currentMatrix], [ x, y, z ]);
};

var _glScaled = _emscripten_glScaled;

var _glScalef = _emscripten_glScaled;

var _emscripten_glScissor = (x0, x1, x2, x3) => GLctx.scissor(x0, x1, x2, x3);

var _glScissor = _emscripten_glScissor;

var _emscripten_glShadeModel = () => warnOnce("TODO: glShadeModel");

var _glShadeModel = _emscripten_glShadeModel;

var _emscripten_glStencilFunc = (x0, x1, x2) => GLctx.stencilFunc(x0, x1, x2);

var _glStencilFunc = _emscripten_glStencilFunc;

var _emscripten_glStencilFuncSeparate = (x0, x1, x2, x3) => GLctx.stencilFuncSeparate(x0, x1, x2, x3);

var _glStencilFuncSeparate = _emscripten_glStencilFuncSeparate;

var _emscripten_glStencilMask = x0 => GLctx.stencilMask(x0);

var _glStencilMask = _emscripten_glStencilMask;

var _emscripten_glStencilMaskSeparate = (x0, x1) => GLctx.stencilMaskSeparate(x0, x1);

var _glStencilMaskSeparate = _emscripten_glStencilMaskSeparate;

var _emscripten_glStencilOp = (x0, x1, x2) => GLctx.stencilOp(x0, x1, x2);

var _glStencilOp = _emscripten_glStencilOp;

var _emscripten_glStencilOpSeparate = (x0, x1, x2, x3) => GLctx.stencilOpSeparate(x0, x1, x2, x3);

var _glStencilOpSeparate = _emscripten_glStencilOpSeparate;

function _emscripten_glTexCoordPointer(size, type, stride, pointer) {
  pointer >>>= 0;
  GLImmediate.setClientAttribute(GLImmediate.TEXTURE0 + GLImmediate.clientActiveTexture, size, type, stride, pointer);
}

var _glTexCoordPointer = _emscripten_glTexCoordPointer;

var _emscripten_glTexEnvf = (target, pname, params) => warnOnce("glTexEnvf: TODO");

var _glTexEnvf = _emscripten_glTexEnvf;

function _emscripten_glTexEnvfv(target, pname, params) {
  params >>>= 0;
  return warnOnce("glTexEnvfv: TODO");
}

var _glTexEnvfv = _emscripten_glTexEnvfv;

var _emscripten_glTexEnvi = (target, pname, params) => warnOnce("glTexEnvi: TODO");

var _glTexEnvi = _emscripten_glTexEnvi;

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

var _glTexImage2D = _emscripten_glTexImage2D;

var _emscripten_glTexParameterf = (x0, x1, x2) => GLctx.texParameterf(x0, x1, x2);

var _glTexParameterf = _emscripten_glTexParameterf;

function _emscripten_glTexParameterfv(target, pname, params) {
  params >>>= 0;
  var param = HEAPF32[((params) >>> 2) >>> 0];
  GLctx.texParameterf(target, pname, param);
}

var _glTexParameterfv = _emscripten_glTexParameterfv;

var _emscripten_glTexParameteri = (x0, x1, x2) => GLctx.texParameteri(x0, x1, x2);

var _glTexParameteri = _emscripten_glTexParameteri;

function _emscripten_glTexParameteriv(target, pname, params) {
  params >>>= 0;
  var param = HEAP32[((params) >>> 2) >>> 0];
  GLctx.texParameteri(target, pname, param);
}

var _glTexParameteriv = _emscripten_glTexParameteriv;

var _emscripten_glTexStorage2D = (x0, x1, x2, x3, x4) => GLctx.texStorage2D(x0, x1, x2, x3, x4);

var _glTexStorage2D = _emscripten_glTexStorage2D;

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

var _glTexSubImage2D = _emscripten_glTexSubImage2D;

var _emscripten_glTranslated = (x, y, z) => {
  GLImmediate.matricesModified = true;
  GLImmediate.matrixVersion[GLImmediate.currentMatrix] = (GLImmediate.matrixVersion[GLImmediate.currentMatrix] + 1) | 0;
  GLImmediate.matrixLib.mat4.translate(GLImmediate.matrix[GLImmediate.currentMatrix], [ x, y, z ]);
};

var _glTranslated = _emscripten_glTranslated;

var _glTranslatef = _emscripten_glTranslated;

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

var _emscripten_glUniform1f = (location, v0) => {
  GLctx.uniform1f(webglGetUniformLocation(location), v0);
};

var _glUniform1f = _emscripten_glUniform1f;

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

var _glUniform1fv = _emscripten_glUniform1fv;

var _emscripten_glUniform1i = (location, v0) => {
  GLctx.uniform1i(webglGetUniformLocation(location), v0);
};

var _glUniform1i = _emscripten_glUniform1i;

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

var _glUniform1iv = _emscripten_glUniform1iv;

var _emscripten_glUniform2f = (location, v0, v1) => {
  GLctx.uniform2f(webglGetUniformLocation(location), v0, v1);
};

var _glUniform2f = _emscripten_glUniform2f;

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

var _glUniform2fv = _emscripten_glUniform2fv;

var _emscripten_glUniform2i = (location, v0, v1) => {
  GLctx.uniform2i(webglGetUniformLocation(location), v0, v1);
};

var _glUniform2i = _emscripten_glUniform2i;

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

var _glUniform2iv = _emscripten_glUniform2iv;

var _emscripten_glUniform3f = (location, v0, v1, v2) => {
  GLctx.uniform3f(webglGetUniformLocation(location), v0, v1, v2);
};

var _glUniform3f = _emscripten_glUniform3f;

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

var _glUniform3fv = _emscripten_glUniform3fv;

var _emscripten_glUniform3i = (location, v0, v1, v2) => {
  GLctx.uniform3i(webglGetUniformLocation(location), v0, v1, v2);
};

var _glUniform3i = _emscripten_glUniform3i;

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

var _glUniform3iv = _emscripten_glUniform3iv;

var _emscripten_glUniform4f = (location, v0, v1, v2, v3) => {
  GLctx.uniform4f(webglGetUniformLocation(location), v0, v1, v2, v3);
};

var _glUniform4f = _emscripten_glUniform4f;

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

var _glUniform4fv = _emscripten_glUniform4fv;

var _emscripten_glUniform4i = (location, v0, v1, v2, v3) => {
  GLctx.uniform4i(webglGetUniformLocation(location), v0, v1, v2, v3);
};

var _glUniform4i = _emscripten_glUniform4i;

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

var _glUniform4iv = _emscripten_glUniform4iv;

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

var _glUniformMatrix2fv = _emscripten_glUniformMatrix2fv;

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

var _glUniformMatrix3fv = _emscripten_glUniformMatrix3fv;

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

var _glUniformMatrix4fv = _emscripten_glUniformMatrix4fv;

var _emscripten_glVertexAttrib4f = (x0, x1, x2, x3, x4) => GLctx.vertexAttrib4f(x0, x1, x2, x3, x4);

var _glVertexAttrib4f = _emscripten_glVertexAttrib4f;

var _emscripten_glVertexAttribDivisor = (index, divisor) => {
  GLctx.vertexAttribDivisor(index, divisor);
};

var _glVertexAttribDivisor = _emscripten_glVertexAttribDivisor;

function _emscripten_glVertexPointer(size, type, stride, pointer) {
  pointer >>>= 0;
  GLImmediate.setClientAttribute(GLImmediate.VERTEX, size, type, stride, pointer);
}

var _glVertexPointer = _emscripten_glVertexPointer;

var _emscripten_glViewport = (x0, x1, x2, x3) => GLctx.viewport(x0, x1, x2, x3);

var _glViewport = _emscripten_glViewport;

function _goldsrc_commit_cvars() {
  if (COFSettings.dirty) {
    COFSettings.dirty = false;
    COFSettings.save("cvars");
  }
}

function _goldsrc_record_cvar(name, value) {
  var key = UTF8ToString(name), text = UTF8ToString(value);
  if (COFSettings.cvars[key] !== text) {
    COFSettings.cvars[key] = text;
    COFSettings.dirty = true;
  }
}

function _goldsrc_registry_changed(path, name, type, data, size) {
  var p = UTF8ToString(path), n = UTF8ToString(name);
  COFSettings.registry[p + "|" + n.toLowerCase()] = {
    path: p,
    name: n,
    type,
    data: Array.from(HEAPU8.subarray(data >>> 0, data + size >>> 0))
  };
  COFSettings.save("registry");
}

function _goldsrc_registry_restore_entry(index, path, name, type, data, capacity) {
  if (!COFSettings.entries) COFSettings.entries = Object.entries(COFSettings.registry);
  var pair = COFSettings.entries[index];
  if (!pair) return -1;
  var record = pair[1];
  if (!record || !Array.isArray(record.data) || record.data.length > capacity) return -2;
  stringToUTF8(record.path, path, 256);
  stringToUTF8(record.name, name, 64);
  HEAPU32[type >>> 2 >>> 0] = record.type;
  HEAPU8.set(record.data, data >>> 0);
  return record.data.length;
}

function _goldsrc_saved_cvar(name, out, capacity) {
  var key = UTF8ToString(name);
  if (COFSettings.restored.has(key)) return 0;
  COFSettings.restored.add(key);
  if (!Object.hasOwn(COFSettings.cvars, key)) return 0;
  stringToUTF8(String(COFSettings.cvars[key]), out, capacity);
  return 1;
}

var stackAlloc = sz => __emscripten_stack_alloc(sz);

var stringToUTF8OnStack = str => {
  var size = lengthBytesUTF8(str) + 1;
  var ret = stackAlloc(size);
  stringToUTF8(str, ret, size);
  return ret;
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
  instrumentFunction(original) {
    var wrapper = (...args) => original(...args);
    return wrapper;
  },
  instrumentWasmExports(exports) {
    var exportPattern = /^(main|cof_thread_start|main|__main_argc_argv)$/;
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
        var wrapper = Asyncify.instrumentFunction(original);
        ret[x] = wrapper;
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

FS.createPreloadedFile = FS_createPreloadedFile;

FS.preloadFile = FS_preloadFile;

FS.staticInit();

GLImmediate.setupFuncs();

Browser.moduleContextCreatedCallbacks.push(() => GLImmediate.init());

// Signal GL rendering layer that processing of a new frame is about to
// start. This helps it optimize VBO double-buffering and reduce GPU stalls.
registerPreMainLoop(() => GL.newRenderingFrameStarted());

/**@suppress {duplicate, undefinedVars}*/ var _emscripten_glDrawArrays;

/**@suppress {duplicate, undefinedVars}*/ var _emscripten_glDrawElements;

/**@suppress {duplicate, undefinedVars}*/ var _emscripten_glActiveTexture;

/**@suppress {duplicate, undefinedVars}*/ var _emscripten_glEnable;

/**@suppress {duplicate, undefinedVars}*/ var _emscripten_glDisable;

/**@suppress {duplicate, undefinedVars}*/ var _emscripten_glTexEnvf;

/**@suppress {duplicate, undefinedVars}*/ var _emscripten_glTexEnvi;

/**@suppress {duplicate, undefinedVars}*/ var _emscripten_glTexEnvfv;

/**@suppress {duplicate, undefinedVars}*/ var _emscripten_glGetIntegerv;

/**@suppress {duplicate, undefinedVars}*/ var _emscripten_glIsEnabled;

/**@suppress {duplicate, undefinedVars}*/ var _emscripten_glGetBooleanv;

/**@suppress {duplicate, undefinedVars}*/ var _emscripten_glGetString;

/**@suppress {duplicate, undefinedVars}*/ var _emscripten_glCreateShader;

/**@suppress {duplicate, undefinedVars}*/ var _emscripten_glShaderSource;

/**@suppress {duplicate, undefinedVars}*/ var _emscripten_glCompileShader;

/**@suppress {duplicate, undefinedVars}*/ var _emscripten_glAttachShader;

/**@suppress {duplicate, undefinedVars}*/ var _emscripten_glDetachShader;

/**@suppress {duplicate, undefinedVars}*/ var _emscripten_glUseProgram;

/**@suppress {duplicate, undefinedVars}*/ var _emscripten_glDeleteProgram;

/**@suppress {duplicate, undefinedVars}*/ var _emscripten_glBindAttribLocation;

/**@suppress {duplicate, undefinedVars}*/ var _emscripten_glLinkProgram;

/**@suppress {duplicate, undefinedVars}*/ var _emscripten_glBindBuffer;

/**@suppress {duplicate, undefinedVars}*/ var _emscripten_glGetFloatv;

/**@suppress {duplicate, undefinedVars}*/ var _emscripten_glHint;

/**@suppress {duplicate, undefinedVars}*/ var _emscripten_glEnableVertexAttribArray;

/**@suppress {duplicate, undefinedVars}*/ var _emscripten_glDisableVertexAttribArray;

/**@suppress {duplicate, undefinedVars}*/ var _emscripten_glVertexAttribPointer;

/**@suppress {duplicate, undefinedVars}*/ var _glTexEnvf;

/**@suppress {duplicate, undefinedVars}*/ var _glTexEnvi;

/**@suppress {duplicate, undefinedVars}*/ var _glTexEnvfv;

/**@suppress {duplicate, undefinedVars}*/ var _glGetTexEnviv;

/**@suppress {duplicate, undefinedVars}*/ var _glGetTexEnvfv;

GLEmulation.init();

GLImmediate.matrixLib = (() => {
  /**
   * @fileoverview gl-matrix - High performance matrix and vector operations for WebGL
   * @author Brandon Jones
   * @version 1.2.4
   */ // Modified for emscripten:
  // - Global scoping etc.
  // - Disabled some non-closure-compatible javadoc comments.
  /*
   * Copyright (c) 2011 Brandon Jones
   *
   * This software is provided 'as-is', without any express or implied
   * warranty. In no event will the authors be held liable for any damages
   * arising from the use of this software.
   *
   * Permission is granted to anyone to use this software for any purpose,
   * including commercial applications, and to alter it and redistribute it
   * freely, subject to the following restrictions:
   *
   *    1. The origin of this software must not be misrepresented; you must not
   *    claim that you wrote the original software. If you use this software
   *    in a product, an acknowledgment in the product documentation would be
   *    appreciated but is not required.
   *
   *    2. Altered source versions must be plainly marked as such, and must not
   *    be misrepresented as being the original software.
   *
   *    3. This notice may not be removed or altered from any source
   *    distribution.
   */ /**
   * @class 3 Dimensional Vector
   * @name vec3
   */ var vec3 = {};
  /**
   * @class 3x3 Matrix
   * @name mat3
   */ var mat3 = {};
  /**
   * @class 4x4 Matrix
   * @name mat4
   */ var mat4 = {};
  /**
   * @class Quaternion
   * @name quat4
   */ var quat4 = {};
  var MatrixArray = Float32Array;
  /*
   * vec3
   */ /**
   * Creates a new instance of a vec3 using the default array type
   * Any javascript array-like objects containing at least 3 numeric elements can serve as a vec3
   *
   * _param {vec3} [vec] vec3 containing values to initialize with
   *
   * _returns {vec3} New vec3
   */ vec3.create = function(vec) {
    var dest = new MatrixArray(3);
    if (vec) {
      dest[0] = vec[0];
      dest[1] = vec[1];
      dest[2] = vec[2];
    } else {
      dest[0] = dest[1] = dest[2] = 0;
    }
    return dest;
  };
  /**
   * Copies the values of one vec3 to another
   *
   * _param {vec3} vec vec3 containing values to copy
   * _param {vec3} dest vec3 receiving copied values
   *
   * _returns {vec3} dest
   */ vec3.set = function(vec, dest) {
    dest[0] = vec[0];
    dest[1] = vec[1];
    dest[2] = vec[2];
    return dest;
  };
  /**
   * Performs a vector addition
   *
   * _param {vec3} vec First operand
   * _param {vec3} vec2 Second operand
   * _param {vec3} [dest] vec3 receiving operation result. If not specified result is written to vec
   *
   * _returns {vec3} dest if specified, vec otherwise
   */ vec3.add = function(vec, vec2, dest) {
    if (!dest || vec === dest) {
      vec[0] += vec2[0];
      vec[1] += vec2[1];
      vec[2] += vec2[2];
      return vec;
    }
    dest[0] = vec[0] + vec2[0];
    dest[1] = vec[1] + vec2[1];
    dest[2] = vec[2] + vec2[2];
    return dest;
  };
  /**
   * Performs a vector subtraction
   *
   * _param {vec3} vec First operand
   * _param {vec3} vec2 Second operand
   * _param {vec3} [dest] vec3 receiving operation result. If not specified result is written to vec
   *
   * _returns {vec3} dest if specified, vec otherwise
   */ vec3.subtract = function(vec, vec2, dest) {
    if (!dest || vec === dest) {
      vec[0] -= vec2[0];
      vec[1] -= vec2[1];
      vec[2] -= vec2[2];
      return vec;
    }
    dest[0] = vec[0] - vec2[0];
    dest[1] = vec[1] - vec2[1];
    dest[2] = vec[2] - vec2[2];
    return dest;
  };
  /**
   * Performs a vector multiplication
   *
   * _param {vec3} vec First operand
   * _param {vec3} vec2 Second operand
   * _param {vec3} [dest] vec3 receiving operation result. If not specified result is written to vec
   *
   * _returns {vec3} dest if specified, vec otherwise
   */ vec3.multiply = function(vec, vec2, dest) {
    if (!dest || vec === dest) {
      vec[0] *= vec2[0];
      vec[1] *= vec2[1];
      vec[2] *= vec2[2];
      return vec;
    }
    dest[0] = vec[0] * vec2[0];
    dest[1] = vec[1] * vec2[1];
    dest[2] = vec[2] * vec2[2];
    return dest;
  };
  /**
   * Negates the components of a vec3
   *
   * _param {vec3} vec vec3 to negate
   * _param {vec3} [dest] vec3 receiving operation result. If not specified result is written to vec
   *
   * _returns {vec3} dest if specified, vec otherwise
   */ vec3.negate = function(vec, dest) {
    if (!dest) {
      dest = vec;
    }
    dest[0] = -vec[0];
    dest[1] = -vec[1];
    dest[2] = -vec[2];
    return dest;
  };
  /**
   * Multiplies the components of a vec3 by a scalar value
   *
   * _param {vec3} vec vec3 to scale
   * _param {number} val Value to scale by
   * _param {vec3} [dest] vec3 receiving operation result. If not specified result is written to vec
   *
   * _returns {vec3} dest if specified, vec otherwise
   */ vec3.scale = function(vec, val, dest) {
    if (!dest || vec === dest) {
      vec[0] *= val;
      vec[1] *= val;
      vec[2] *= val;
      return vec;
    }
    dest[0] = vec[0] * val;
    dest[1] = vec[1] * val;
    dest[2] = vec[2] * val;
    return dest;
  };
  /**
   * Generates a unit vector of the same direction as the provided vec3
   * If vector length is 0, returns [0, 0, 0]
   *
   * _param {vec3} vec vec3 to normalize
   * _param {vec3} [dest] vec3 receiving operation result. If not specified result is written to vec
   *
   * _returns {vec3} dest if specified, vec otherwise
   */ vec3.normalize = function(vec, dest) {
    if (!dest) {
      dest = vec;
    }
    var x = vec[0], y = vec[1], z = vec[2], len = Math.sqrt(x * x + y * y + z * z);
    if (!len) {
      dest[0] = 0;
      dest[1] = 0;
      dest[2] = 0;
      return dest;
    } else if (len === 1) {
      dest[0] = x;
      dest[1] = y;
      dest[2] = z;
      return dest;
    }
    len = 1 / len;
    dest[0] = x * len;
    dest[1] = y * len;
    dest[2] = z * len;
    return dest;
  };
  /**
   * Generates the cross product of two vec3s
   *
   * _param {vec3} vec First operand
   * _param {vec3} vec2 Second operand
   * _param {vec3} [dest] vec3 receiving operation result. If not specified result is written to vec
   *
   * _returns {vec3} dest if specified, vec otherwise
   */ vec3.cross = function(vec, vec2, dest) {
    if (!dest) {
      dest = vec;
    }
    var x = vec[0], y = vec[1], z = vec[2], x2 = vec2[0], y2 = vec2[1], z2 = vec2[2];
    dest[0] = y * z2 - z * y2;
    dest[1] = z * x2 - x * z2;
    dest[2] = x * y2 - y * x2;
    return dest;
  };
  /**
   * Calculates the length of a vec3
   *
   * _param {vec3} vec vec3 to calculate length of
   *
   * _returns {number} Length of vec
   */ vec3.length = function(vec) {
    var x = vec[0], y = vec[1], z = vec[2];
    return Math.sqrt(x * x + y * y + z * z);
  };
  /**
   * Calculates the dot product of two vec3s
   *
   * _param {vec3} vec First operand
   * _param {vec3} vec2 Second operand
   *
   * _returns {number} Dot product of vec and vec2
   */ vec3.dot = function(vec, vec2) {
    return vec[0] * vec2[0] + vec[1] * vec2[1] + vec[2] * vec2[2];
  };
  /**
   * Generates a unit vector pointing from one vector to another
   *
   * _param {vec3} vec Origin vec3
   * _param {vec3} vec2 vec3 to point to
   * _param {vec3} [dest] vec3 receiving operation result. If not specified result is written to vec
   *
   * _returns {vec3} dest if specified, vec otherwise
   */ vec3.direction = function(vec, vec2, dest) {
    if (!dest) {
      dest = vec;
    }
    var x = vec[0] - vec2[0], y = vec[1] - vec2[1], z = vec[2] - vec2[2], len = Math.sqrt(x * x + y * y + z * z);
    if (!len) {
      dest[0] = 0;
      dest[1] = 0;
      dest[2] = 0;
      return dest;
    }
    len = 1 / len;
    dest[0] = x * len;
    dest[1] = y * len;
    dest[2] = z * len;
    return dest;
  };
  /**
   * Performs a linear interpolation between two vec3
   *
   * _param {vec3} vec First vector
   * _param {vec3} vec2 Second vector
   * _param {number} lerp Interpolation amount between the two inputs
   * _param {vec3} [dest] vec3 receiving operation result. If not specified result is written to vec
   *
   * _returns {vec3} dest if specified, vec otherwise
   */ vec3.lerp = function(vec, vec2, lerp, dest) {
    if (!dest) {
      dest = vec;
    }
    dest[0] = vec[0] + lerp * (vec2[0] - vec[0]);
    dest[1] = vec[1] + lerp * (vec2[1] - vec[1]);
    dest[2] = vec[2] + lerp * (vec2[2] - vec[2]);
    return dest;
  };
  /**
   * Calculates the euclidean distance between two vec3
   *
   * Params:
   * _param {vec3} vec First vector
   * _param {vec3} vec2 Second vector
   *
   * _returns {number} Distance between vec and vec2
   */ vec3.dist = function(vec, vec2) {
    var x = vec2[0] - vec[0], y = vec2[1] - vec[1], z = vec2[2] - vec[2];
    return Math.sqrt(x * x + y * y + z * z);
  };
  /**
   * Projects the specified vec3 from screen space into object space
   * Based on the <a href="http://webcvs.freedesktop.org/mesa/Mesa/src/glu/mesa/project.c?revision=1.4&view=markup">Mesa gluUnProject implementation</a>
   *
   * _param {vec3} vec Screen-space vector to project
   * _param {mat4} view View matrix
   * _param {mat4} proj Projection matrix
   * _param {vec4} viewport Viewport as given to gl.viewport [x, y, width, height]
   * _param {vec3} [dest] vec3 receiving unprojected result. If not specified result is written to vec
   *
   * _returns {vec3} dest if specified, vec otherwise
   */ vec3.unproject = function(vec, view, proj, viewport, dest) {
    if (!dest) {
      dest = vec;
    }
    var m = mat4.create();
    var v = new MatrixArray(4);
    v[0] = (vec[0] - viewport[0]) * 2 / viewport[2] - 1;
    v[1] = (vec[1] - viewport[1]) * 2 / viewport[3] - 1;
    v[2] = 2 * vec[2] - 1;
    v[3] = 1;
    mat4.multiply(proj, view, m);
    if (!mat4.inverse(m)) {
      return null;
    }
    mat4.multiplyVec4(m, v);
    if (v[3] === 0) {
      return null;
    }
    dest[0] = v[0] / v[3];
    dest[1] = v[1] / v[3];
    dest[2] = v[2] / v[3];
    return dest;
  };
  /**
   * Returns a string representation of a vector
   *
   * _param {vec3} vec Vector to represent as a string
   *
   * _returns {string} String representation of vec
   */ vec3.str = function(vec) {
    return "[" + vec[0] + ", " + vec[1] + ", " + vec[2] + "]";
  };
  /*
   * mat3
   */ /**
   * Creates a new instance of a mat3 using the default array type
   * Any javascript array-like object containing at least 9 numeric elements can serve as a mat3
   *
   * _param {mat3} [mat] mat3 containing values to initialize with
   *
   * _returns {mat3} New mat3
   *
   * @param {Object=} mat
   */ mat3.create = function(mat) {
    var dest = new MatrixArray(9);
    if (mat) {
      dest[0] = mat[0];
      dest[1] = mat[1];
      dest[2] = mat[2];
      dest[3] = mat[3];
      dest[4] = mat[4];
      dest[5] = mat[5];
      dest[6] = mat[6];
      dest[7] = mat[7];
      dest[8] = mat[8];
    }
    return dest;
  };
  /**
   * Copies the values of one mat3 to another
   *
   * _param {mat3} mat mat3 containing values to copy
   * _param {mat3} dest mat3 receiving copied values
   *
   * _returns {mat3} dest
   */ mat3.set = function(mat, dest) {
    dest[0] = mat[0];
    dest[1] = mat[1];
    dest[2] = mat[2];
    dest[3] = mat[3];
    dest[4] = mat[4];
    dest[5] = mat[5];
    dest[6] = mat[6];
    dest[7] = mat[7];
    dest[8] = mat[8];
    return dest;
  };
  /**
   * Sets a mat3 to an identity matrix
   *
   * _param {mat3} dest mat3 to set
   *
   * _returns dest if specified, otherwise a new mat3
   */ mat3.identity = function(dest) {
    if (!dest) {
      dest = mat3.create();
    }
    dest[0] = 1;
    dest[1] = 0;
    dest[2] = 0;
    dest[3] = 0;
    dest[4] = 1;
    dest[5] = 0;
    dest[6] = 0;
    dest[7] = 0;
    dest[8] = 1;
    return dest;
  };
  /**
   * Transposes a mat3 (flips the values over the diagonal)
   *
   * Params:
   * _param {mat3} mat mat3 to transpose
   * _param {mat3} [dest] mat3 receiving transposed values. If not specified result is written to mat
   */ mat3.transpose = function(mat, dest) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (!dest || mat === dest) {
      var a01 = mat[1], a02 = mat[2], a12 = mat[5];
      mat[1] = mat[3];
      mat[2] = mat[6];
      mat[3] = a01;
      mat[5] = mat[7];
      mat[6] = a02;
      mat[7] = a12;
      return mat;
    }
    dest[0] = mat[0];
    dest[1] = mat[3];
    dest[2] = mat[6];
    dest[3] = mat[1];
    dest[4] = mat[4];
    dest[5] = mat[7];
    dest[6] = mat[2];
    dest[7] = mat[5];
    dest[8] = mat[8];
    return dest;
  };
  /**
   * Copies the elements of a mat3 into the upper 3x3 elements of a mat4
   *
   * _param {mat3} mat mat3 containing values to copy
   * _param {mat4} [dest] mat4 receiving copied values
   *
   * _returns {mat4} dest if specified, a new mat4 otherwise
   */ mat3.toMat4 = function(mat, dest) {
    if (!dest) {
      dest = mat4.create();
    }
    dest[15] = 1;
    dest[14] = 0;
    dest[13] = 0;
    dest[12] = 0;
    dest[11] = 0;
    dest[10] = mat[8];
    dest[9] = mat[7];
    dest[8] = mat[6];
    dest[7] = 0;
    dest[6] = mat[5];
    dest[5] = mat[4];
    dest[4] = mat[3];
    dest[3] = 0;
    dest[2] = mat[2];
    dest[1] = mat[1];
    dest[0] = mat[0];
    return dest;
  };
  /**
   * Returns a string representation of a mat3
   *
   * _param {mat3} mat mat3 to represent as a string
   *
   * _param {string} String representation of mat
   */ mat3.str = function(mat) {
    return "[" + mat[0] + ", " + mat[1] + ", " + mat[2] + ", " + mat[3] + ", " + mat[4] + ", " + mat[5] + ", " + mat[6] + ", " + mat[7] + ", " + mat[8] + "]";
  };
  /*
   * mat4
   */ /**
   * Creates a new instance of a mat4 using the default array type
   * Any javascript array-like object containing at least 16 numeric elements can serve as a mat4
   *
   * _param {mat4} [mat] mat4 containing values to initialize with
   *
   * _returns {mat4} New mat4
   *
   * @param {Object=} mat
   */ mat4.create = function(mat) {
    var dest = new MatrixArray(16);
    if (mat) {
      dest[0] = mat[0];
      dest[1] = mat[1];
      dest[2] = mat[2];
      dest[3] = mat[3];
      dest[4] = mat[4];
      dest[5] = mat[5];
      dest[6] = mat[6];
      dest[7] = mat[7];
      dest[8] = mat[8];
      dest[9] = mat[9];
      dest[10] = mat[10];
      dest[11] = mat[11];
      dest[12] = mat[12];
      dest[13] = mat[13];
      dest[14] = mat[14];
      dest[15] = mat[15];
    }
    return dest;
  };
  /**
   * Copies the values of one mat4 to another
   *
   * _param {mat4} mat mat4 containing values to copy
   * _param {mat4} dest mat4 receiving copied values
   *
   * _returns {mat4} dest
   */ mat4.set = function(mat, dest) {
    dest[0] = mat[0];
    dest[1] = mat[1];
    dest[2] = mat[2];
    dest[3] = mat[3];
    dest[4] = mat[4];
    dest[5] = mat[5];
    dest[6] = mat[6];
    dest[7] = mat[7];
    dest[8] = mat[8];
    dest[9] = mat[9];
    dest[10] = mat[10];
    dest[11] = mat[11];
    dest[12] = mat[12];
    dest[13] = mat[13];
    dest[14] = mat[14];
    dest[15] = mat[15];
    return dest;
  };
  /**
   * Sets a mat4 to an identity matrix
   *
   * _param {mat4} dest mat4 to set
   *
   * _returns {mat4} dest
   */ mat4.identity = function(dest) {
    if (!dest) {
      dest = mat4.create();
    }
    dest[0] = 1;
    dest[1] = 0;
    dest[2] = 0;
    dest[3] = 0;
    dest[4] = 0;
    dest[5] = 1;
    dest[6] = 0;
    dest[7] = 0;
    dest[8] = 0;
    dest[9] = 0;
    dest[10] = 1;
    dest[11] = 0;
    dest[12] = 0;
    dest[13] = 0;
    dest[14] = 0;
    dest[15] = 1;
    return dest;
  };
  /**
   * Transposes a mat4 (flips the values over the diagonal)
   *
   * _param {mat4} mat mat4 to transpose
   * _param {mat4} [dest] mat4 receiving transposed values. If not specified result is written to mat
   */ mat4.transpose = function(mat, dest) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (!dest || mat === dest) {
      var a01 = mat[1], a02 = mat[2], a03 = mat[3], a12 = mat[6], a13 = mat[7], a23 = mat[11];
      mat[1] = mat[4];
      mat[2] = mat[8];
      mat[3] = mat[12];
      mat[4] = a01;
      mat[6] = mat[9];
      mat[7] = mat[13];
      mat[8] = a02;
      mat[9] = a12;
      mat[11] = mat[14];
      mat[12] = a03;
      mat[13] = a13;
      mat[14] = a23;
      return mat;
    }
    dest[0] = mat[0];
    dest[1] = mat[4];
    dest[2] = mat[8];
    dest[3] = mat[12];
    dest[4] = mat[1];
    dest[5] = mat[5];
    dest[6] = mat[9];
    dest[7] = mat[13];
    dest[8] = mat[2];
    dest[9] = mat[6];
    dest[10] = mat[10];
    dest[11] = mat[14];
    dest[12] = mat[3];
    dest[13] = mat[7];
    dest[14] = mat[11];
    dest[15] = mat[15];
    return dest;
  };
  /**
   * Calculates the determinant of a mat4
   *
   * _param {mat4} mat mat4 to calculate determinant of
   *
   * _returns {number} determinant of mat
   */ mat4.determinant = function(mat) {
    // Cache the matrix values (makes for huge speed increases!)
    var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3], a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7], a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11], a30 = mat[12], a31 = mat[13], a32 = mat[14], a33 = mat[15];
    return (a30 * a21 * a12 * a03 - a20 * a31 * a12 * a03 - a30 * a11 * a22 * a03 + a10 * a31 * a22 * a03 + a20 * a11 * a32 * a03 - a10 * a21 * a32 * a03 - a30 * a21 * a02 * a13 + a20 * a31 * a02 * a13 + a30 * a01 * a22 * a13 - a00 * a31 * a22 * a13 - a20 * a01 * a32 * a13 + a00 * a21 * a32 * a13 + a30 * a11 * a02 * a23 - a10 * a31 * a02 * a23 - a30 * a01 * a12 * a23 + a00 * a31 * a12 * a23 + a10 * a01 * a32 * a23 - a00 * a11 * a32 * a23 - a20 * a11 * a02 * a33 + a10 * a21 * a02 * a33 + a20 * a01 * a12 * a33 - a00 * a21 * a12 * a33 - a10 * a01 * a22 * a33 + a00 * a11 * a22 * a33);
  };
  /**
   * Calculates the inverse matrix of a mat4
   *
   * _param {mat4} mat mat4 to calculate inverse of
   * _param {mat4} [dest] mat4 receiving inverse matrix. If not specified result is written to mat, null if matrix cannot be inverted
   *
   * @param {Object=} dest
   */ mat4.inverse = function(mat, dest) {
    if (!dest) {
      dest = mat;
    }
    // Cache the matrix values (makes for huge speed increases!)
    var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3], a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7], a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11], a30 = mat[12], a31 = mat[13], a32 = mat[14], a33 = mat[15], b00 = a00 * a11 - a01 * a10, b01 = a00 * a12 - a02 * a10, b02 = a00 * a13 - a03 * a10, b03 = a01 * a12 - a02 * a11, b04 = a01 * a13 - a03 * a11, b05 = a02 * a13 - a03 * a12, b06 = a20 * a31 - a21 * a30, b07 = a20 * a32 - a22 * a30, b08 = a20 * a33 - a23 * a30, b09 = a21 * a32 - a22 * a31, b10 = a21 * a33 - a23 * a31, b11 = a22 * a33 - a23 * a32, d = (b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06), invDet;
    // Calculate the determinant
    if (!d) {
      return null;
    }
    invDet = 1 / d;
    dest[0] = (a11 * b11 - a12 * b10 + a13 * b09) * invDet;
    dest[1] = (-a01 * b11 + a02 * b10 - a03 * b09) * invDet;
    dest[2] = (a31 * b05 - a32 * b04 + a33 * b03) * invDet;
    dest[3] = (-a21 * b05 + a22 * b04 - a23 * b03) * invDet;
    dest[4] = (-a10 * b11 + a12 * b08 - a13 * b07) * invDet;
    dest[5] = (a00 * b11 - a02 * b08 + a03 * b07) * invDet;
    dest[6] = (-a30 * b05 + a32 * b02 - a33 * b01) * invDet;
    dest[7] = (a20 * b05 - a22 * b02 + a23 * b01) * invDet;
    dest[8] = (a10 * b10 - a11 * b08 + a13 * b06) * invDet;
    dest[9] = (-a00 * b10 + a01 * b08 - a03 * b06) * invDet;
    dest[10] = (a30 * b04 - a31 * b02 + a33 * b00) * invDet;
    dest[11] = (-a20 * b04 + a21 * b02 - a23 * b00) * invDet;
    dest[12] = (-a10 * b09 + a11 * b07 - a12 * b06) * invDet;
    dest[13] = (a00 * b09 - a01 * b07 + a02 * b06) * invDet;
    dest[14] = (-a30 * b03 + a31 * b01 - a32 * b00) * invDet;
    dest[15] = (a20 * b03 - a21 * b01 + a22 * b00) * invDet;
    return dest;
  };
  /**
   * Copies the upper 3x3 elements of a mat4 into another mat4
   *
   * _param {mat4} mat mat4 containing values to copy
   * _param {mat4} [dest] mat4 receiving copied values
   *
   * _returns {mat4} dest is specified, a new mat4 otherwise
   */ mat4.toRotationMat = function(mat, dest) {
    if (!dest) {
      dest = mat4.create();
    }
    dest[0] = mat[0];
    dest[1] = mat[1];
    dest[2] = mat[2];
    dest[3] = mat[3];
    dest[4] = mat[4];
    dest[5] = mat[5];
    dest[6] = mat[6];
    dest[7] = mat[7];
    dest[8] = mat[8];
    dest[9] = mat[9];
    dest[10] = mat[10];
    dest[11] = mat[11];
    dest[12] = 0;
    dest[13] = 0;
    dest[14] = 0;
    dest[15] = 1;
    return dest;
  };
  /**
   * Copies the upper 3x3 elements of a mat4 into a mat3
   *
   * _param {mat4} mat mat4 containing values to copy
   * _param {mat3} [dest] mat3 receiving copied values
   *
   * _returns {mat3} dest is specified, a new mat3 otherwise
   */ mat4.toMat3 = function(mat, dest) {
    if (!dest) {
      dest = mat3.create();
    }
    dest[0] = mat[0];
    dest[1] = mat[1];
    dest[2] = mat[2];
    dest[3] = mat[4];
    dest[4] = mat[5];
    dest[5] = mat[6];
    dest[6] = mat[8];
    dest[7] = mat[9];
    dest[8] = mat[10];
    return dest;
  };
  /**
   * Calculates the inverse of the upper 3x3 elements of a mat4 and copies the result into a mat3
   * The resulting matrix is useful for calculating transformed normals
   *
   * Params:
   * _param {mat4} mat mat4 containing values to invert and copy
   * _param {mat3} [dest] mat3 receiving values
   *
   * _returns {mat3} dest is specified, a new mat3 otherwise, null if the matrix cannot be inverted
   */ mat4.toInverseMat3 = function(mat, dest) {
    // Cache the matrix values (makes for huge speed increases!)
    var a00 = mat[0], a01 = mat[1], a02 = mat[2], a10 = mat[4], a11 = mat[5], a12 = mat[6], a20 = mat[8], a21 = mat[9], a22 = mat[10], b01 = a22 * a11 - a12 * a21, b11 = -a22 * a10 + a12 * a20, b21 = a21 * a10 - a11 * a20, d = a00 * b01 + a01 * b11 + a02 * b21, id;
    if (!d) {
      return null;
    }
    id = 1 / d;
    if (!dest) {
      dest = mat3.create();
    }
    dest[0] = b01 * id;
    dest[1] = (-a22 * a01 + a02 * a21) * id;
    dest[2] = (a12 * a01 - a02 * a11) * id;
    dest[3] = b11 * id;
    dest[4] = (a22 * a00 - a02 * a20) * id;
    dest[5] = (-a12 * a00 + a02 * a10) * id;
    dest[6] = b21 * id;
    dest[7] = (-a21 * a00 + a01 * a20) * id;
    dest[8] = (a11 * a00 - a01 * a10) * id;
    return dest;
  };
  /**
   * Performs a matrix multiplication
   *
   * _param {mat4} mat First operand
   * _param {mat4} mat2 Second operand
   * _param {mat4} [dest] mat4 receiving operation result. If not specified result is written to mat
   */ mat4.multiply = function(mat, mat2, dest) {
    if (!dest) {
      dest = mat;
    }
    // Cache the matrix values (makes for huge speed increases!)
    var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3], a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7], a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11], a30 = mat[12], a31 = mat[13], a32 = mat[14], a33 = mat[15], b00 = mat2[0], b01 = mat2[1], b02 = mat2[2], b03 = mat2[3], b10 = mat2[4], b11 = mat2[5], b12 = mat2[6], b13 = mat2[7], b20 = mat2[8], b21 = mat2[9], b22 = mat2[10], b23 = mat2[11], b30 = mat2[12], b31 = mat2[13], b32 = mat2[14], b33 = mat2[15];
    dest[0] = b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30;
    dest[1] = b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31;
    dest[2] = b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32;
    dest[3] = b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33;
    dest[4] = b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30;
    dest[5] = b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31;
    dest[6] = b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32;
    dest[7] = b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33;
    dest[8] = b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30;
    dest[9] = b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31;
    dest[10] = b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32;
    dest[11] = b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33;
    dest[12] = b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30;
    dest[13] = b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31;
    dest[14] = b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32;
    dest[15] = b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33;
    return dest;
  };
  /**
   * Transforms a vec3 with the given matrix
   * 4th vector component is implicitly '1'
   *
   * _param {mat4} mat mat4 to transform the vector with
   * _param {vec3} vec vec3 to transform
   * _param {vec3} [dest] vec3 receiving operation result. If not specified result is written to vec
   *
   * _returns {vec3} dest if specified, vec otherwise
   */ mat4.multiplyVec3 = function(mat, vec, dest) {
    if (!dest) {
      dest = vec;
    }
    var x = vec[0], y = vec[1], z = vec[2];
    dest[0] = mat[0] * x + mat[4] * y + mat[8] * z + mat[12];
    dest[1] = mat[1] * x + mat[5] * y + mat[9] * z + mat[13];
    dest[2] = mat[2] * x + mat[6] * y + mat[10] * z + mat[14];
    return dest;
  };
  /**
   * Transforms a vec4 with the given matrix
   *
   * _param {mat4} mat mat4 to transform the vector with
   * _param {vec4} vec vec4 to transform
   * _param {vec4} [dest] vec4 receiving operation result. If not specified result is written to vec
   *
   * _returns {vec4} dest if specified, vec otherwise
   *
   * @param {Object=} dest
   */ mat4.multiplyVec4 = function(mat, vec, dest) {
    if (!dest) {
      dest = vec;
    }
    var x = vec[0], y = vec[1], z = vec[2], w = vec[3];
    dest[0] = mat[0] * x + mat[4] * y + mat[8] * z + mat[12] * w;
    dest[1] = mat[1] * x + mat[5] * y + mat[9] * z + mat[13] * w;
    dest[2] = mat[2] * x + mat[6] * y + mat[10] * z + mat[14] * w;
    dest[3] = mat[3] * x + mat[7] * y + mat[11] * z + mat[15] * w;
    return dest;
  };
  /**
   * Translates a matrix by the given vector
   *
   * _param {mat4} mat mat4 to translate
   * _param {vec3} vec vec3 specifying the translation
   * _param {mat4} [dest] mat4 receiving operation result. If not specified result is written to mat
   */ mat4.translate = function(mat, vec, dest) {
    var x = vec[0], y = vec[1], z = vec[2], a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23;
    if (!dest || mat === dest) {
      mat[12] = mat[0] * x + mat[4] * y + mat[8] * z + mat[12];
      mat[13] = mat[1] * x + mat[5] * y + mat[9] * z + mat[13];
      mat[14] = mat[2] * x + mat[6] * y + mat[10] * z + mat[14];
      mat[15] = mat[3] * x + mat[7] * y + mat[11] * z + mat[15];
      return mat;
    }
    a00 = mat[0];
    a01 = mat[1];
    a02 = mat[2];
    a03 = mat[3];
    a10 = mat[4];
    a11 = mat[5];
    a12 = mat[6];
    a13 = mat[7];
    a20 = mat[8];
    a21 = mat[9];
    a22 = mat[10];
    a23 = mat[11];
    dest[0] = a00;
    dest[1] = a01;
    dest[2] = a02;
    dest[3] = a03;
    dest[4] = a10;
    dest[5] = a11;
    dest[6] = a12;
    dest[7] = a13;
    dest[8] = a20;
    dest[9] = a21;
    dest[10] = a22;
    dest[11] = a23;
    dest[12] = a00 * x + a10 * y + a20 * z + mat[12];
    dest[13] = a01 * x + a11 * y + a21 * z + mat[13];
    dest[14] = a02 * x + a12 * y + a22 * z + mat[14];
    dest[15] = a03 * x + a13 * y + a23 * z + mat[15];
    return dest;
  };
  /**
   * Scales a matrix by the given vector
   *
   * _param {mat4} mat mat4 to scale
   * _param {vec3} vec vec3 specifying the scale for each axis
   * _param {mat4} [dest] mat4 receiving operation result. If not specified result is written to mat
   */ mat4.scale = function(mat, vec, dest) {
    var x = vec[0], y = vec[1], z = vec[2];
    if (!dest || mat === dest) {
      mat[0] *= x;
      mat[1] *= x;
      mat[2] *= x;
      mat[3] *= x;
      mat[4] *= y;
      mat[5] *= y;
      mat[6] *= y;
      mat[7] *= y;
      mat[8] *= z;
      mat[9] *= z;
      mat[10] *= z;
      mat[11] *= z;
      return mat;
    }
    dest[0] = mat[0] * x;
    dest[1] = mat[1] * x;
    dest[2] = mat[2] * x;
    dest[3] = mat[3] * x;
    dest[4] = mat[4] * y;
    dest[5] = mat[5] * y;
    dest[6] = mat[6] * y;
    dest[7] = mat[7] * y;
    dest[8] = mat[8] * z;
    dest[9] = mat[9] * z;
    dest[10] = mat[10] * z;
    dest[11] = mat[11] * z;
    dest[12] = mat[12];
    dest[13] = mat[13];
    dest[14] = mat[14];
    dest[15] = mat[15];
    return dest;
  };
  /**
   * Rotates a matrix by the given angle around the specified axis
   * If rotating around a primary axis (X,Y,Z) one of the specialized rotation functions should be used instead for performance
   *
   * _param {mat4} mat mat4 to rotate
   * _param {number} angle Angle (in radians) to rotate
   * _param {vec3} axis vec3 representing the axis to rotate around
   * _param {mat4} [dest] mat4 receiving operation result. If not specified result is written to mat
   */ mat4.rotate = function(mat, angle, axis, dest) {
    var x = axis[0], y = axis[1], z = axis[2], len = Math.sqrt(x * x + y * y + z * z), s, c, t, a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, b00, b01, b02, b10, b11, b12, b20, b21, b22;
    if (!len) {
      return null;
    }
    if (len !== 1) {
      len = 1 / len;
      x *= len;
      y *= len;
      z *= len;
    }
    s = Math.sin(angle);
    c = Math.cos(angle);
    t = 1 - c;
    a00 = mat[0];
    a01 = mat[1];
    a02 = mat[2];
    a03 = mat[3];
    a10 = mat[4];
    a11 = mat[5];
    a12 = mat[6];
    a13 = mat[7];
    a20 = mat[8];
    a21 = mat[9];
    a22 = mat[10];
    a23 = mat[11];
    // Construct the elements of the rotation matrix
    b00 = x * x * t + c;
    b01 = y * x * t + z * s;
    b02 = z * x * t - y * s;
    b10 = x * y * t - z * s;
    b11 = y * y * t + c;
    b12 = z * y * t + x * s;
    b20 = x * z * t + y * s;
    b21 = y * z * t - x * s;
    b22 = z * z * t + c;
    if (!dest) {
      dest = mat;
    } else if (mat !== dest) {
      // If the source and destination differ, copy the unchanged last row
      dest[12] = mat[12];
      dest[13] = mat[13];
      dest[14] = mat[14];
      dest[15] = mat[15];
    }
    // Perform rotation-specific matrix multiplication
    dest[0] = a00 * b00 + a10 * b01 + a20 * b02;
    dest[1] = a01 * b00 + a11 * b01 + a21 * b02;
    dest[2] = a02 * b00 + a12 * b01 + a22 * b02;
    dest[3] = a03 * b00 + a13 * b01 + a23 * b02;
    dest[4] = a00 * b10 + a10 * b11 + a20 * b12;
    dest[5] = a01 * b10 + a11 * b11 + a21 * b12;
    dest[6] = a02 * b10 + a12 * b11 + a22 * b12;
    dest[7] = a03 * b10 + a13 * b11 + a23 * b12;
    dest[8] = a00 * b20 + a10 * b21 + a20 * b22;
    dest[9] = a01 * b20 + a11 * b21 + a21 * b22;
    dest[10] = a02 * b20 + a12 * b21 + a22 * b22;
    dest[11] = a03 * b20 + a13 * b21 + a23 * b22;
    return dest;
  };
  /**
   * Rotates a matrix by the given angle around the X axis
   *
   * _param {mat4} mat mat4 to rotate
   * _param {number} angle Angle (in radians) to rotate
   * _param {mat4} [dest] mat4 receiving operation result. If not specified result is written to mat
   */ mat4.rotateX = function(mat, angle, dest) {
    var s = Math.sin(angle), c = Math.cos(angle), a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7], a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11];
    if (!dest) {
      dest = mat;
    } else if (mat !== dest) {
      // If the source and destination differ, copy the unchanged rows
      dest[0] = mat[0];
      dest[1] = mat[1];
      dest[2] = mat[2];
      dest[3] = mat[3];
      dest[12] = mat[12];
      dest[13] = mat[13];
      dest[14] = mat[14];
      dest[15] = mat[15];
    }
    // Perform axis-specific matrix multiplication
    dest[4] = a10 * c + a20 * s;
    dest[5] = a11 * c + a21 * s;
    dest[6] = a12 * c + a22 * s;
    dest[7] = a13 * c + a23 * s;
    dest[8] = a10 * -s + a20 * c;
    dest[9] = a11 * -s + a21 * c;
    dest[10] = a12 * -s + a22 * c;
    dest[11] = a13 * -s + a23 * c;
    return dest;
  };
  /**
   * Rotates a matrix by the given angle around the Y axis
   *
   * _param {mat4} mat mat4 to rotate
   * _param {number} angle Angle (in radians) to rotate
   * _param {mat4} [dest] mat4 receiving operation result. If not specified result is written to mat
   */ mat4.rotateY = function(mat, angle, dest) {
    var s = Math.sin(angle), c = Math.cos(angle), a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3], a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11];
    if (!dest) {
      dest = mat;
    } else if (mat !== dest) {
      // If the source and destination differ, copy the unchanged rows
      dest[4] = mat[4];
      dest[5] = mat[5];
      dest[6] = mat[6];
      dest[7] = mat[7];
      dest[12] = mat[12];
      dest[13] = mat[13];
      dest[14] = mat[14];
      dest[15] = mat[15];
    }
    // Perform axis-specific matrix multiplication
    dest[0] = a00 * c + a20 * -s;
    dest[1] = a01 * c + a21 * -s;
    dest[2] = a02 * c + a22 * -s;
    dest[3] = a03 * c + a23 * -s;
    dest[8] = a00 * s + a20 * c;
    dest[9] = a01 * s + a21 * c;
    dest[10] = a02 * s + a22 * c;
    dest[11] = a03 * s + a23 * c;
    return dest;
  };
  /**
   * Rotates a matrix by the given angle around the Z axis
   *
   * _param {mat4} mat mat4 to rotate
   * _param {number} angle Angle (in radians) to rotate
   * _param {mat4} [dest] mat4 receiving operation result. If not specified result is written to mat
   */ mat4.rotateZ = function(mat, angle, dest) {
    var s = Math.sin(angle), c = Math.cos(angle), a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3], a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7];
    if (!dest) {
      dest = mat;
    } else if (mat !== dest) {
      // If the source and destination differ, copy the unchanged last row
      dest[8] = mat[8];
      dest[9] = mat[9];
      dest[10] = mat[10];
      dest[11] = mat[11];
      dest[12] = mat[12];
      dest[13] = mat[13];
      dest[14] = mat[14];
      dest[15] = mat[15];
    }
    // Perform axis-specific matrix multiplication
    dest[0] = a00 * c + a10 * s;
    dest[1] = a01 * c + a11 * s;
    dest[2] = a02 * c + a12 * s;
    dest[3] = a03 * c + a13 * s;
    dest[4] = a00 * -s + a10 * c;
    dest[5] = a01 * -s + a11 * c;
    dest[6] = a02 * -s + a12 * c;
    dest[7] = a03 * -s + a13 * c;
    return dest;
  };
  /**
   * Generates a frustum matrix with the given bounds
   *
   * _param {number} left Left bound of the frustum
   * _param {number} right Right bound of the frustum
   * _param {number} bottom Bottom bound of the frustum
   * _param {number} top Top bound of the frustum
   * _param {number} near Near bound of the frustum
   * _param {number} far Far bound of the frustum
   * _param {mat4} [dest] mat4 frustum matrix will be written into
   *
   * _returns {mat4} dest if specified, a new mat4 otherwise
   */ mat4.frustum = function(left, right, bottom, top, near, far, dest) {
    if (!dest) {
      dest = mat4.create();
    }
    var rl = (right - left), tb = (top - bottom), fn = (far - near);
    dest[0] = (near * 2) / rl;
    dest[1] = 0;
    dest[2] = 0;
    dest[3] = 0;
    dest[4] = 0;
    dest[5] = (near * 2) / tb;
    dest[6] = 0;
    dest[7] = 0;
    dest[8] = (right + left) / rl;
    dest[9] = (top + bottom) / tb;
    dest[10] = -(far + near) / fn;
    dest[11] = -1;
    dest[12] = 0;
    dest[13] = 0;
    dest[14] = -(far * near * 2) / fn;
    dest[15] = 0;
    return dest;
  };
  /**
   * Generates a perspective projection matrix with the given bounds
   *
   * _param {number} fovy Vertical field of view
   * _param {number} aspect Aspect ratio. typically viewport width/height
   * _param {number} near Near bound of the frustum
   * _param {number} far Far bound of the frustum
   * _param {mat4} [dest] mat4 frustum matrix will be written into
   *
   * _returns {mat4} dest if specified, a new mat4 otherwise
   */ mat4.perspective = function(fovy, aspect, near, far, dest) {
    var top = near * Math.tan(fovy * Math.PI / 360), right = top * aspect;
    return mat4.frustum(-right, right, -top, top, near, far, dest);
  };
  /**
   * Generates a orthogonal projection matrix with the given bounds
   *
   * _param {number} left Left bound of the frustum
   * _param {number} right Right bound of the frustum
   * _param {number} bottom Bottom bound of the frustum
   * _param {number} top Top bound of the frustum
   * _param {number} near Near bound of the frustum
   * _param {number} far Far bound of the frustum
   * _param {mat4} [dest] mat4 frustum matrix will be written into
   *
   * _returns {mat4} dest if specified, a new mat4 otherwise
   */ mat4.ortho = function(left, right, bottom, top, near, far, dest) {
    if (!dest) {
      dest = mat4.create();
    }
    var rl = (right - left), tb = (top - bottom), fn = (far - near);
    dest[0] = 2 / rl;
    dest[1] = 0;
    dest[2] = 0;
    dest[3] = 0;
    dest[4] = 0;
    dest[5] = 2 / tb;
    dest[6] = 0;
    dest[7] = 0;
    dest[8] = 0;
    dest[9] = 0;
    dest[10] = -2 / fn;
    dest[11] = 0;
    dest[12] = -(left + right) / rl;
    dest[13] = -(top + bottom) / tb;
    dest[14] = -(far + near) / fn;
    dest[15] = 1;
    return dest;
  };
  /**
   * Generates a look-at matrix with the given eye position, focal point, and up axis
   *
   * _param {vec3} eye Position of the viewer
   * _param {vec3} center Point the viewer is looking at
   * _param {vec3} up vec3 pointing "up"
   * _param {mat4} [dest] mat4 frustum matrix will be written into
   *
   * _returns {mat4} dest if specified, a new mat4 otherwise
   */ mat4.lookAt = function(eye, center, up, dest) {
    if (!dest) {
      dest = mat4.create();
    }
    var x0, x1, x2, y0, y1, y2, z0, z1, z2, len, eyex = eye[0], eyey = eye[1], eyez = eye[2], upx = up[0], upy = up[1], upz = up[2], centerx = center[0], centery = center[1], centerz = center[2];
    if (eyex === centerx && eyey === centery && eyez === centerz) {
      return mat4.identity(dest);
    }
    //vec3.direction(eye, center, z);
    z0 = eyex - centerx;
    z1 = eyey - centery;
    z2 = eyez - centerz;
    // normalize (no check needed for 0 because of early return)
    len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
    z0 *= len;
    z1 *= len;
    z2 *= len;
    //vec3.normalize(vec3.cross(up, z, x));
    x0 = upy * z2 - upz * z1;
    x1 = upz * z0 - upx * z2;
    x2 = upx * z1 - upy * z0;
    len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
    if (!len) {
      x0 = 0;
      x1 = 0;
      x2 = 0;
    } else {
      len = 1 / len;
      x0 *= len;
      x1 *= len;
      x2 *= len;
    }
    //vec3.normalize(vec3.cross(z, x, y));
    y0 = z1 * x2 - z2 * x1;
    y1 = z2 * x0 - z0 * x2;
    y2 = z0 * x1 - z1 * x0;
    len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
    if (!len) {
      y0 = 0;
      y1 = 0;
      y2 = 0;
    } else {
      len = 1 / len;
      y0 *= len;
      y1 *= len;
      y2 *= len;
    }
    dest[0] = x0;
    dest[1] = y0;
    dest[2] = z0;
    dest[3] = 0;
    dest[4] = x1;
    dest[5] = y1;
    dest[6] = z1;
    dest[7] = 0;
    dest[8] = x2;
    dest[9] = y2;
    dest[10] = z2;
    dest[11] = 0;
    dest[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
    dest[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
    dest[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
    dest[15] = 1;
    return dest;
  };
  /**
   * Creates a matrix from a quaternion rotation and vector translation
   * This is equivalent to (but much faster than):
   *
   *     mat4.identity(dest);
   *     mat4.translate(dest, vec);
   *     var quatMat = mat4.create();
   *     quat4.toMat4(quat, quatMat);
   *     mat4.multiply(dest, quatMat);
   *
   * _param {quat4} quat Rotation quaternion
   * _param {vec3} vec Translation vector
   * _param {mat4} [dest] mat4 receiving operation result. If not specified result is written to a new mat4
   *
   * _returns {mat4} dest if specified, a new mat4 otherwise
   */ mat4.fromRotationTranslation = function(quat, vec, dest) {
    if (!dest) {
      dest = mat4.create();
    }
    // Quaternion math
    var x = quat[0], y = quat[1], z = quat[2], w = quat[3], x2 = x + x, y2 = y + y, z2 = z + z, xx = x * x2, xy = x * y2, xz = x * z2, yy = y * y2, yz = y * z2, zz = z * z2, wx = w * x2, wy = w * y2, wz = w * z2;
    dest[0] = 1 - (yy + zz);
    dest[1] = xy + wz;
    dest[2] = xz - wy;
    dest[3] = 0;
    dest[4] = xy - wz;
    dest[5] = 1 - (xx + zz);
    dest[6] = yz + wx;
    dest[7] = 0;
    dest[8] = xz + wy;
    dest[9] = yz - wx;
    dest[10] = 1 - (xx + yy);
    dest[11] = 0;
    dest[12] = vec[0];
    dest[13] = vec[1];
    dest[14] = vec[2];
    dest[15] = 1;
    return dest;
  };
  /**
   * Returns a string representation of a mat4
   *
   * _param {mat4} mat mat4 to represent as a string
   *
   * _returns {string} String representation of mat
   */ mat4.str = function(mat) {
    return "[" + mat[0] + ", " + mat[1] + ", " + mat[2] + ", " + mat[3] + ", " + mat[4] + ", " + mat[5] + ", " + mat[6] + ", " + mat[7] + ", " + mat[8] + ", " + mat[9] + ", " + mat[10] + ", " + mat[11] + ", " + mat[12] + ", " + mat[13] + ", " + mat[14] + ", " + mat[15] + "]";
  };
  /*
   * quat4
   */ /**
   * Creates a new instance of a quat4 using the default array type
   * Any javascript array containing at least 4 numeric elements can serve as a quat4
   *
   * _param {quat4} [quat] quat4 containing values to initialize with
   *
   * _returns {quat4} New quat4
   */ quat4.create = function(quat) {
    var dest = new MatrixArray(4);
    if (quat) {
      dest[0] = quat[0];
      dest[1] = quat[1];
      dest[2] = quat[2];
      dest[3] = quat[3];
    }
    return dest;
  };
  /**
   * Copies the values of one quat4 to another
   *
   * _param {quat4} quat quat4 containing values to copy
   * _param {quat4} dest quat4 receiving copied values
   *
   * _returns {quat4} dest
   */ quat4.set = function(quat, dest) {
    dest[0] = quat[0];
    dest[1] = quat[1];
    dest[2] = quat[2];
    dest[3] = quat[3];
    return dest;
  };
  /**
   * Calculates the W component of a quat4 from the X, Y, and Z components.
   * Assumes that quaternion is 1 unit in length.
   * Any existing W component will be ignored.
   *
   * _param {quat4} quat quat4 to calculate W component of
   * _param {quat4} [dest] quat4 receiving calculated values. If not specified result is written to quat
   *
   * _returns {quat4} dest if specified, quat otherwise
   */ quat4.calculateW = function(quat, dest) {
    var x = quat[0], y = quat[1], z = quat[2];
    if (!dest || quat === dest) {
      quat[3] = -Math.sqrt(Math.abs(1 - x * x - y * y - z * z));
      return quat;
    }
    dest[0] = x;
    dest[1] = y;
    dest[2] = z;
    dest[3] = -Math.sqrt(Math.abs(1 - x * x - y * y - z * z));
    return dest;
  };
  /**
   * Calculates the dot product of two quaternions
   *
   * _param {quat4} quat First operand
   * _param {quat4} quat2 Second operand
   *
   * @return {number} Dot product of quat and quat2
   */ quat4.dot = function(quat, quat2) {
    return quat[0] * quat2[0] + quat[1] * quat2[1] + quat[2] * quat2[2] + quat[3] * quat2[3];
  };
  /**
   * Calculates the inverse of a quat4
   *
   * _param {quat4} quat quat4 to calculate inverse of
   * _param {quat4} [dest] quat4 receiving inverse values. If not specified result is written to quat
   *
   * _returns {quat4} dest if specified, quat otherwise
   */ quat4.inverse = function(quat, dest) {
    var q0 = quat[0], q1 = quat[1], q2 = quat[2], q3 = quat[3], dot = q0 * q0 + q1 * q1 + q2 * q2 + q3 * q3, invDot = dot ? 1 / dot : 0;
    // TODO: Would be faster to return [0,0,0,0] immediately if dot == 0
    if (!dest || quat === dest) {
      quat[0] *= -invDot;
      quat[1] *= -invDot;
      quat[2] *= -invDot;
      quat[3] *= invDot;
      return quat;
    }
    dest[0] = -quat[0] * invDot;
    dest[1] = -quat[1] * invDot;
    dest[2] = -quat[2] * invDot;
    dest[3] = quat[3] * invDot;
    return dest;
  };
  /**
   * Calculates the conjugate of a quat4
   * If the quaternion is normalized, this function is faster than quat4.inverse and produces the same result.
   *
   * _param {quat4} quat quat4 to calculate conjugate of
   * _param {quat4} [dest] quat4 receiving conjugate values. If not specified result is written to quat
   *
   * _returns {quat4} dest if specified, quat otherwise
   */ quat4.conjugate = function(quat, dest) {
    if (!dest || quat === dest) {
      quat[0] *= -1;
      quat[1] *= -1;
      quat[2] *= -1;
      return quat;
    }
    dest[0] = -quat[0];
    dest[1] = -quat[1];
    dest[2] = -quat[2];
    dest[3] = quat[3];
    return dest;
  };
  /**
   * Calculates the length of a quat4
   *
   * Params:
   * _param {quat4} quat quat4 to calculate length of
   *
   * _returns Length of quat
   */ quat4.length = function(quat) {
    var x = quat[0], y = quat[1], z = quat[2], w = quat[3];
    return Math.sqrt(x * x + y * y + z * z + w * w);
  };
  /**
   * Generates a unit quaternion of the same direction as the provided quat4
   * If quaternion length is 0, returns [0, 0, 0, 0]
   *
   * _param {quat4} quat quat4 to normalize
   * _param {quat4} [dest] quat4 receiving operation result. If not specified result is written to quat
   *
   * _returns {quat4} dest if specified, quat otherwise
   */ quat4.normalize = function(quat, dest) {
    if (!dest) {
      dest = quat;
    }
    var x = quat[0], y = quat[1], z = quat[2], w = quat[3], len = Math.sqrt(x * x + y * y + z * z + w * w);
    if (len === 0) {
      dest[0] = 0;
      dest[1] = 0;
      dest[2] = 0;
      dest[3] = 0;
      return dest;
    }
    len = 1 / len;
    dest[0] = x * len;
    dest[1] = y * len;
    dest[2] = z * len;
    dest[3] = w * len;
    return dest;
  };
  /**
   * Performs quaternion addition
   *
   * _param {quat4} quat First operand
   * _param {quat4} quat2 Second operand
   * _param {quat4} [dest] quat4 receiving operation result. If not specified result is written to quat
   *
   * _returns {quat4} dest if specified, quat otherwise
   */ quat4.add = function(quat, quat2, dest) {
    if (!dest || quat === dest) {
      quat[0] += quat2[0];
      quat[1] += quat2[1];
      quat[2] += quat2[2];
      quat[3] += quat2[3];
      return quat;
    }
    dest[0] = quat[0] + quat2[0];
    dest[1] = quat[1] + quat2[1];
    dest[2] = quat[2] + quat2[2];
    dest[3] = quat[3] + quat2[3];
    return dest;
  };
  /**
   * Performs a quaternion multiplication
   *
   * _param {quat4} quat First operand
   * _param {quat4} quat2 Second operand
   * _param {quat4} [dest] quat4 receiving operation result. If not specified result is written to quat
   *
   * _returns {quat4} dest if specified, quat otherwise
   */ quat4.multiply = function(quat, quat2, dest) {
    if (!dest) {
      dest = quat;
    }
    var qax = quat[0], qay = quat[1], qaz = quat[2], qaw = quat[3], qbx = quat2[0], qby = quat2[1], qbz = quat2[2], qbw = quat2[3];
    dest[0] = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
    dest[1] = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
    dest[2] = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
    dest[3] = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;
    return dest;
  };
  /**
   * Transforms a vec3 with the given quaternion
   *
   * _param {quat4} quat quat4 to transform the vector with
   * _param {vec3} vec vec3 to transform
   * _param {vec3} [dest] vec3 receiving operation result. If not specified result is written to vec
   *
   * _returns dest if specified, vec otherwise
   */ quat4.multiplyVec3 = function(quat, vec, dest) {
    if (!dest) {
      dest = vec;
    }
    var x = vec[0], y = vec[1], z = vec[2], qx = quat[0], qy = quat[1], qz = quat[2], qw = quat[3], // calculate quat * vec
    ix = qw * x + qy * z - qz * y, iy = qw * y + qz * x - qx * z, iz = qw * z + qx * y - qy * x, iw = -qx * x - qy * y - qz * z;
    // calculate result * inverse quat
    dest[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    dest[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    dest[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
    return dest;
  };
  /**
   * Multiplies the components of a quaternion by a scalar value
   *
   * _param {quat4} quat to scale
   * _param {number} val Value to scale by
   * _param {quat4} [dest] quat4 receiving operation result. If not specified result is written to quat
   *
   * _returns {quat4} dest if specified, quat otherwise
   */ quat4.scale = function(quat, val, dest) {
    if (!dest || quat === dest) {
      quat[0] *= val;
      quat[1] *= val;
      quat[2] *= val;
      quat[3] *= val;
      return quat;
    }
    dest[0] = quat[0] * val;
    dest[1] = quat[1] * val;
    dest[2] = quat[2] * val;
    dest[3] = quat[3] * val;
    return dest;
  };
  /**
   * Calculates a 3x3 matrix from the given quat4
   *
   * _param {quat4} quat quat4 to create matrix from
   * _param {mat3} [dest] mat3 receiving operation result
   *
   * _returns {mat3} dest if specified, a new mat3 otherwise
   */ quat4.toMat3 = function(quat, dest) {
    if (!dest) {
      dest = mat3.create();
    }
    var x = quat[0], y = quat[1], z = quat[2], w = quat[3], x2 = x + x, y2 = y + y, z2 = z + z, xx = x * x2, xy = x * y2, xz = x * z2, yy = y * y2, yz = y * z2, zz = z * z2, wx = w * x2, wy = w * y2, wz = w * z2;
    dest[0] = 1 - (yy + zz);
    dest[1] = xy + wz;
    dest[2] = xz - wy;
    dest[3] = xy - wz;
    dest[4] = 1 - (xx + zz);
    dest[5] = yz + wx;
    dest[6] = xz + wy;
    dest[7] = yz - wx;
    dest[8] = 1 - (xx + yy);
    return dest;
  };
  /**
   * Calculates a 4x4 matrix from the given quat4
   *
   * _param {quat4} quat quat4 to create matrix from
   * _param {mat4} [dest] mat4 receiving operation result
   *
   * _returns {mat4} dest if specified, a new mat4 otherwise
   */ quat4.toMat4 = function(quat, dest) {
    if (!dest) {
      dest = mat4.create();
    }
    var x = quat[0], y = quat[1], z = quat[2], w = quat[3], x2 = x + x, y2 = y + y, z2 = z + z, xx = x * x2, xy = x * y2, xz = x * z2, yy = y * y2, yz = y * z2, zz = z * z2, wx = w * x2, wy = w * y2, wz = w * z2;
    dest[0] = 1 - (yy + zz);
    dest[1] = xy + wz;
    dest[2] = xz - wy;
    dest[3] = 0;
    dest[4] = xy - wz;
    dest[5] = 1 - (xx + zz);
    dest[6] = yz + wx;
    dest[7] = 0;
    dest[8] = xz + wy;
    dest[9] = yz - wx;
    dest[10] = 1 - (xx + yy);
    dest[11] = 0;
    dest[12] = 0;
    dest[13] = 0;
    dest[14] = 0;
    dest[15] = 1;
    return dest;
  };
  /**
   * Performs a spherical linear interpolation between two quat4
   *
   * _param {quat4} quat First quaternion
   * _param {quat4} quat2 Second quaternion
   * _param {number} slerp Interpolation amount between the two inputs
   * _param {quat4} [dest] quat4 receiving operation result. If not specified result is written to quat
   *
   * _returns {quat4} dest if specified, quat otherwise
   */ quat4.slerp = function(quat, quat2, slerp, dest) {
    if (!dest) {
      dest = quat;
    }
    var cosHalfTheta = quat[0] * quat2[0] + quat[1] * quat2[1] + quat[2] * quat2[2] + quat[3] * quat2[3], halfTheta, sinHalfTheta, ratioA, ratioB;
    if (Math.abs(cosHalfTheta) >= 1) {
      if (dest !== quat) {
        dest[0] = quat[0];
        dest[1] = quat[1];
        dest[2] = quat[2];
        dest[3] = quat[3];
      }
      return dest;
    }
    halfTheta = Math.acos(cosHalfTheta);
    sinHalfTheta = Math.sqrt(1 - cosHalfTheta * cosHalfTheta);
    if (Math.abs(sinHalfTheta) < .001) {
      dest[0] = (quat[0] * .5 + quat2[0] * .5);
      dest[1] = (quat[1] * .5 + quat2[1] * .5);
      dest[2] = (quat[2] * .5 + quat2[2] * .5);
      dest[3] = (quat[3] * .5 + quat2[3] * .5);
      return dest;
    }
    ratioA = Math.sin((1 - slerp) * halfTheta) / sinHalfTheta;
    ratioB = Math.sin(slerp * halfTheta) / sinHalfTheta;
    dest[0] = (quat[0] * ratioA + quat2[0] * ratioB);
    dest[1] = (quat[1] * ratioA + quat2[1] * ratioB);
    dest[2] = (quat[2] * ratioA + quat2[2] * ratioB);
    dest[3] = (quat[3] * ratioA + quat2[3] * ratioB);
    return dest;
  };
  /**
   * Returns a string representation of a quaternion
   *
   * _param {quat4} quat quat4 to represent as a string
   *
   * _returns {string} String representation of quat
   */ quat4.str = function(quat) {
    return "[" + quat[0] + ", " + quat[1] + ", " + quat[2] + ", " + quat[3] + "]";
  };
  return {
    vec3,
    mat3,
    mat4,
    quat4
  };
})();

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

Module["UTF8ToString"] = UTF8ToString;

Module["stringToUTF8"] = stringToUTF8;

Module["lengthBytesUTF8"] = lengthBytesUTF8;

// End runtime exports
// Begin JS library exports
// End JS library exports
// end include: postlibrary.js
var ASM_CONSTS = {
  1611798432: () => new URLSearchParams(location.search).has("preserve") ? 1 : 0
};

function client_mouse_capture(active) {
  Module["mouseCaptureRequested"] = !!active;
  if (Module["onMouseCapture"]) Module["onMouseCapture"](!!active);
}

client_mouse_capture.sig = "vi";

function canvas_font_height(face, pixels, weight, italic, cell) {
  const g = new OffscreenCanvas(1, 1).getContext("2d");
  g.font = (italic ? "italic " : "") + weight + " " + pixels + "px " + JSON.stringify(UTF8ToString(face));
  const m = g.measureText("Hg"), h = (m.fontBoundingBoxAscent || m.actualBoundingBoxAscent) + (m.fontBoundingBoxDescent || m.actualBoundingBoxDescent);
  return cell ? Math.max(1, Math.ceil(h)) : Math.max(1, Math.round(pixels * pixels / h));
}

canvas_font_height.sig = "iiiiii";

function canvas_width(face, height, weight, italic, text, count, wide) {
  face >>>= 0;
  text >>>= 0;
  var canvas = new OffscreenCanvas(1, 1), g = canvas.getContext("2d");
  g.font = (italic ? "italic " : "") + weight + " " + height + "px " + JSON.stringify(UTF8ToString(face));
  var value = wide === 2 ? String.fromCodePoint(text) : new TextDecoder(wide ? "utf-16le" : "windows-1252").decode(HEAPU8.subarray(text >>> 0, text + count * (wide ? 2 : 1) >>> 0));
  return g.measureText(value).width;
}

canvas_width.sig = "diiiiiii";

function canvas_glyph(face, height, weight, italic, ch, wide, format, metrics, buffer, capacity, abc) {
  face >>>= 0;
  metrics >>>= 0;
  buffer >>>= 0;
  abc >>>= 0;
  const cv = new OffscreenCanvas(1, 1), g = cv.getContext("2d");
  const font = (italic ? "italic " : "") + weight + " " + height + "px " + JSON.stringify(UTF8ToString(face));
  g.font = font;
  const text = wide ? String.fromCodePoint(ch) : new TextDecoder("windows-1252").decode(new Uint8Array([ ch & 255 ]));
  const m = g.measureText(text), left = Math.ceil(m.actualBoundingBoxLeft), right = Math.ceil(m.actualBoundingBoxRight);
  const ascent = Math.ceil(m.actualBoundingBoxAscent), descent = Math.ceil(m.actualBoundingBoxDescent);
  const w = Math.max(0, left + right), h = Math.max(0, ascent + descent), advance = Math.round(m.width);
  if (abc) {
    HEAP32[abc >>> 2 >>> 0] = -left;
    HEAPU32[(abc + 4) >>> 2 >>> 0] = w;
    HEAP32[(abc + 8) >>> 2 >>> 0] = advance + left - w;
    return 0;
  }
  if (metrics) {
    HEAPU32[metrics >>> 2 >>> 0] = w;
    HEAPU32[(metrics + 4) >>> 2 >>> 0] = h;
    HEAP32[(metrics + 8) >>> 2 >>> 0] = -left;
    HEAP32[(metrics + 12) >>> 2 >>> 0] = ascent;
    HEAP16[(metrics + 16) >>> 1 >>> 0] = advance;
    HEAP16[(metrics + 18) >>> 1 >>> 0] = 0;
  }
  format &= 127;
  if (format === 0) return 0;
  if (![ 1, 4, 5, 6 ].includes(format)) return -1;
  const stride = format === 1 ? ((w + 31) >>> 5) * 4 : ((w + 3) >>> 2) * 4, required = stride * h;
  if (!buffer || !capacity) return required;
  if (capacity < required) return -1;
  HEAPU8.fill(0, buffer, buffer + required);
  if (!w || !h) return required;
  cv.width = w;
  cv.height = h;
  g.font = font;
  g.textBaseline = "alphabetic";
  g.fillStyle = "white";
  g.fillText(text, left, ascent);
  const pixels = g.getImageData(0, 0, w, h).data, maximum = format === 4 ? 4 : format === 5 ? 16 : 64;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const a = pixels[(y * w + x) * 4 + 3];
    if (format === 1) {
      if (a >= 128) HEAPU8[buffer + y * stride + (x >>> 3) >>> 0] |= 128 >>> (x & 7);
    } else HEAPU8[buffer + y * stride + x >>> 0] = Math.round(a * maximum / 255);
  }
  return required;
}

canvas_glyph.sig = "iiiiiiiiiiii";

function canvas_draw(bits, w, h, stride, bpp, top, face, height, weight, italic, underline, text, count, wide, x, y, fg, bg, mode, align, rect, options) {
  bits >>>= 0;
  face >>>= 0;
  text >>>= 0;
  rect >>>= 0;
  var cv = new OffscreenCanvas(w, h), g = cv.getContext("2d"), image = g.createImageData(w, h), p = image.data;
  for (var yy = 0; yy < h; yy++) for (var xx = 0; xx < w; xx++) {
    var source = bits + (top ? yy : h - 1 - yy) * stride + xx * (bpp / 8), out = (yy * w + xx) * 4;
    p[out] = HEAPU8[source + 2 >>> 0];
    p[out + 1] = HEAPU8[source + 1 >>> 0];
    p[out + 2] = HEAPU8[source >>> 0];
    p[out + 3] = 255;
  }
  g.putImageData(image, 0, 0);
  g.font = (italic ? "italic " : "") + weight + " " + height + "px " + JSON.stringify(UTF8ToString(face));
  var value = new TextDecoder(wide ? "utf-16le" : "windows-1252").decode(HEAPU8.subarray(text >>> 0, text + count * (wide ? 2 : 1) >>> 0));
  var color = n => "rgb(" + (n & 255) + "," + ((n >> 8) & 255) + "," + ((n >> 16) & 255) + ")";
  var width = g.measureText(value).width;
  g.textAlign = (align & 6) === 6 ? "center" : (align & 2) ? "right" : "left";
  g.textBaseline = (align & 24) === 24 ? "alphabetic" : (align & 8) ? "bottom" : "top";
  g.fillStyle = color(bg);
  if (options & 2 && rect) {
    var a = HEAP32[rect >>> 2], b = HEAP32[(rect + 4) >>> 2], c = HEAP32[(rect + 8) >>> 2], d = HEAP32[(rect + 12) >>> 2];
    g.fillRect(a, b, c - a, d - b);
  } else if (mode === 2) {
    var left = (align & 6) === 6 ? x - width / 2 : (align & 2) ? x - width : x;
    var upper = (align & 24) === 24 ? y - height * .8 : (align & 8) ? y - height : y;
    g.fillRect(left, upper, width, height);
  }
  g.fillStyle = color(fg);
  g.fillText(value, x, y);
  if (underline) g.fillRect(x, y + height - 2, width, 1);
  p = g.getImageData(0, 0, w, h).data;
  for (var yy = 0; yy < h; yy++) for (var xx = 0; xx < w; xx++) {
    var out = bits + (top ? yy : h - 1 - yy) * stride + xx * (bpp / 8), source = (yy * w + xx) * 4;
    HEAPU8[out >>> 0] = p[source + 2];
    HEAPU8[out + 1 >>> 0] = p[source + 1];
    HEAPU8[out + 2 >>> 0] = p[source];
    if (bpp === 32) HEAPU8[out + 3 >>> 0] = 0;
  }
}

canvas_draw.sig = "viiiiiiiiiiiiiiiiiiiiii";

// Imports from the Wasm binary.
var _malloc, _free, _cof_dsound_debug, __emscripten_stack_restore, _cof_thread_start, _cof_ev_mouse, _cof_ev_mouse_raw, _cof_ev_key, _cof_ev_fps, _cof_ev_dump, _cof_ev_opt, _cof_ev_touch, _cof_ev_char, _cof_ev_focus, _main, __emscripten_stack_alloc, memory, __indirect_function_table, wasmMemory;

function assignWasmExports(wasmExports) {
  _malloc = Module["_malloc"] = wasmExports["malloc"];
  _free = Module["_free"] = wasmExports["free"];
  _cof_dsound_debug = Module["_cof_dsound_debug"] = wasmExports["cof_dsound_debug"];
  __emscripten_stack_restore = wasmExports["_emscripten_stack_restore"];
  _cof_thread_start = Module["_cof_thread_start"] = wasmExports["cof_thread_start"];
  _cof_ev_mouse = Module["_cof_ev_mouse"] = wasmExports["cof_ev_mouse"];
  _cof_ev_mouse_raw = Module["_cof_ev_mouse_raw"] = wasmExports["cof_ev_mouse_raw"];
  _cof_ev_key = Module["_cof_ev_key"] = wasmExports["cof_ev_key"];
  _cof_ev_fps = Module["_cof_ev_fps"] = wasmExports["cof_ev_fps"];
  _cof_ev_dump = Module["_cof_ev_dump"] = wasmExports["cof_ev_dump"];
  _cof_ev_opt = Module["_cof_ev_opt"] = wasmExports["cof_ev_opt"];
  _cof_ev_touch = Module["_cof_ev_touch"] = wasmExports["cof_ev_touch"];
  _cof_ev_char = Module["_cof_ev_char"] = wasmExports["cof_ev_char"];
  _cof_ev_focus = Module["_cof_ev_focus"] = wasmExports["cof_ev_focus"];
  _main = Module["_main"] = wasmExports["__main_argc_argv"];
  __emscripten_stack_alloc = wasmExports["_emscripten_stack_alloc"];
  memory = wasmMemory = wasmExports["memory"];
  __indirect_function_table = wasmExports["__indirect_function_table"];
}

var wasmImports = {
  /** @export */ __syscall_fcntl64: ___syscall_fcntl64,
  /** @export */ __syscall_ioctl: ___syscall_ioctl,
  /** @export */ __syscall_openat: ___syscall_openat,
  /** @export */ _abort_js: __abort_js,
  /** @export */ _gmtime_js: __gmtime_js,
  /** @export */ _localtime_js: __localtime_js,
  /** @export */ _timegm_js: __timegm_js,
  /** @export */ _tzset_js: __tzset_js,
  /** @export */ canvas_draw,
  /** @export */ canvas_font_height,
  /** @export */ canvas_glyph,
  /** @export */ canvas_width,
  /** @export */ client_mouse_capture,
  /** @export */ cof_gl_attrib_query: _cof_gl_attrib_query,
  /** @export */ cof_gl_color4f: _cof_gl_color4f,
  /** @export */ cof_gl_current_attribute: _cof_gl_current_attribute,
  /** @export */ cof_gl_end: _cof_gl_end,
  /** @export */ cof_gl_error: _cof_gl_error,
  /** @export */ cof_gl_get_tex_gen: _cof_gl_get_tex_gen,
  /** @export */ cof_gl_init_legacy: _cof_gl_init_legacy,
  /** @export */ cof_gl_is_enabled: _cof_gl_is_enabled,
  /** @export */ cof_gl_legacy_max_units: _cof_gl_legacy_max_units,
  /** @export */ cof_gl_legacy_target: _cof_gl_legacy_target,
  /** @export */ cof_gl_normal3f: _cof_gl_normal3f,
  /** @export */ cof_gl_pop_attrib: _cof_gl_pop_attrib,
  /** @export */ cof_gl_push_attrib: _cof_gl_push_attrib,
  /** @export */ cof_gl_read_buffer: _cof_gl_read_buffer,
  /** @export */ cof_gl_tex_gen: _cof_gl_tex_gen,
  /** @export */ cof_gl_tex_gen_scalar: _cof_gl_tex_gen_scalar,
  /** @export */ cof_gl_texcoord4f: _cof_gl_texcoord4f,
  /** @export */ cof_gl_texgen_enable: _cof_gl_texgen_enable,
  /** @export */ cof_gl_vertex4f: _cof_gl_vertex4f,
  /** @export */ cof_goldsrc_vfs_init: _cof_goldsrc_vfs_init,
  /** @export */ cof_js_audio_init: _cof_js_audio_init,
  /** @export */ cof_js_audio_push: _cof_js_audio_push,
  /** @export */ cof_js_canvas_size: _cof_js_canvas_size,
  /** @export */ cof_js_cursor: _cof_js_cursor,
  /** @export */ cof_js_file_close: _cof_js_file_close,
  /** @export */ cof_js_file_list: _cof_js_file_list,
  /** @export */ cof_js_file_mkdir: _cof_js_file_mkdir,
  /** @export */ cof_js_file_open: _cof_js_file_open,
  /** @export */ cof_js_file_read_nb: _cof_js_file_read_nb,
  /** @export */ cof_js_file_size: _cof_js_file_size,
  /** @export */ cof_js_file_stat: _cof_js_file_stat,
  /** @export */ cof_js_file_unlink: _cof_js_file_unlink,
  /** @export */ cof_js_file_write: _cof_js_file_write,
  /** @export */ cof_js_load_image: _cof_js_load_image,
  /** @export */ cof_js_log: _cof_js_log,
  /** @export */ cof_js_note_program: _cof_js_note_program,
  /** @export */ cof_js_now: _cof_js_now,
  /** @export */ cof_js_open_url: _cof_js_open_url,
  /** @export */ cof_js_present: _cof_js_present,
  /** @export */ cof_js_program_list: _cof_js_program_list,
  /** @export */ cof_js_set_title: _cof_js_set_title,
  /** @export */ cof_js_sleep: _cof_js_sleep,
  /** @export */ cof_js_status: _cof_js_status,
  /** @export */ cof_js_tex_png: _cof_js_tex_png,
  /** @export */ cof_js_thread_switch: _cof_js_thread_switch,
  /** @export */ cof_js_yield: _cof_js_yield,
  /** @export */ emscripten_asm_const_int: _emscripten_asm_const_int,
  /** @export */ emscripten_date_now: _emscripten_date_now,
  /** @export */ emscripten_force_exit: _emscripten_force_exit,
  /** @export */ emscripten_get_heap_max: _emscripten_get_heap_max,
  /** @export */ emscripten_get_now: _emscripten_get_now,
  /** @export */ emscripten_resize_heap: _emscripten_resize_heap,
  /** @export */ emscripten_return_address: _emscripten_return_address,
  /** @export */ emscripten_webgl_commit_frame: _emscripten_webgl_commit_frame,
  /** @export */ emscripten_webgl_create_context: _emscripten_webgl_create_context,
  /** @export */ emscripten_webgl_enable_extension: _emscripten_webgl_enable_extension,
  /** @export */ emscripten_webgl_get_current_context: _emscripten_webgl_get_current_context,
  /** @export */ emscripten_webgl_get_drawing_buffer_size: _emscripten_webgl_get_drawing_buffer_size,
  /** @export */ emscripten_webgl_make_context_current: _emscripten_webgl_make_context_current,
  /** @export */ environ_get: _environ_get,
  /** @export */ environ_sizes_get: _environ_sizes_get,
  /** @export */ fd_close: _fd_close,
  /** @export */ fd_read: _fd_read,
  /** @export */ fd_seek: _fd_seek,
  /** @export */ fd_write: _fd_write,
  /** @export */ glActiveTexture: _glActiveTexture,
  /** @export */ glAlphaFunc: _glAlphaFunc,
  /** @export */ glAttachShader: _glAttachShader,
  /** @export */ glBegin: _glBegin,
  /** @export */ glBeginQuery: _glBeginQuery,
  /** @export */ glBindAttribLocation: _glBindAttribLocation,
  /** @export */ glBindBuffer: _glBindBuffer,
  /** @export */ glBindFramebuffer: _glBindFramebuffer,
  /** @export */ glBindRenderbuffer: _glBindRenderbuffer,
  /** @export */ glBindSampler: _glBindSampler,
  /** @export */ glBindTexture: _glBindTexture,
  /** @export */ glBindVertexArray: _glBindVertexArray,
  /** @export */ glBlendColor: _glBlendColor,
  /** @export */ glBlendEquationSeparate: _glBlendEquationSeparate,
  /** @export */ glBlendFunc: _glBlendFunc,
  /** @export */ glBlendFuncSeparate: _glBlendFuncSeparate,
  /** @export */ glBlitFramebuffer: _glBlitFramebuffer,
  /** @export */ glBufferData: _glBufferData,
  /** @export */ glBufferSubData: _glBufferSubData,
  /** @export */ glCheckFramebufferStatus: _glCheckFramebufferStatus,
  /** @export */ glClear: _glClear,
  /** @export */ glClearColor: _glClearColor,
  /** @export */ glClearDepth: _glClearDepth,
  /** @export */ glClearDepthf: _glClearDepthf,
  /** @export */ glClearStencil: _glClearStencil,
  /** @export */ glClientActiveTexture: _glClientActiveTexture,
  /** @export */ glClipPlane: _glClipPlane,
  /** @export */ glColorMask: _glColorMask,
  /** @export */ glColorPointer: _glColorPointer,
  /** @export */ glCompileShader: _glCompileShader,
  /** @export */ glCompressedTexSubImage2D: _glCompressedTexSubImage2D,
  /** @export */ glCopyTexImage2D: _glCopyTexImage2D,
  /** @export */ glCopyTexSubImage2D: _glCopyTexSubImage2D,
  /** @export */ glCreateProgram: _glCreateProgram,
  /** @export */ glCreateShader: _glCreateShader,
  /** @export */ glCullFace: _glCullFace,
  /** @export */ glDeleteBuffers: _glDeleteBuffers,
  /** @export */ glDeleteFramebuffers: _glDeleteFramebuffers,
  /** @export */ glDeleteProgram: _glDeleteProgram,
  /** @export */ glDeleteQueries: _glDeleteQueries,
  /** @export */ glDeleteRenderbuffers: _glDeleteRenderbuffers,
  /** @export */ glDeleteShader: _glDeleteShader,
  /** @export */ glDeleteTextures: _glDeleteTextures,
  /** @export */ glDeleteVertexArrays: _glDeleteVertexArrays,
  /** @export */ glDepthFunc: _glDepthFunc,
  /** @export */ glDepthMask: _glDepthMask,
  /** @export */ glDepthRange: _glDepthRange,
  /** @export */ glDepthRangef: _glDepthRangef,
  /** @export */ glDisable: _glDisable,
  /** @export */ glDisableClientState: _glDisableClientState,
  /** @export */ glDisableVertexAttribArray: _glDisableVertexAttribArray,
  /** @export */ glDrawArrays: _glDrawArrays,
  /** @export */ glDrawBuffers: _glDrawBuffers,
  /** @export */ glDrawElements: _glDrawElements,
  /** @export */ glDrawElementsInstanced: _glDrawElementsInstanced,
  /** @export */ glEnable: _glEnable,
  /** @export */ glEnableClientState: _glEnableClientState,
  /** @export */ glEnableVertexAttribArray: _glEnableVertexAttribArray,
  /** @export */ glEndQuery: _glEndQuery,
  /** @export */ glFinish: _glFinish,
  /** @export */ glFlush: _glFlush,
  /** @export */ glFogf: _glFogf,
  /** @export */ glFogfv: _glFogfv,
  /** @export */ glFogi: _glFogi,
  /** @export */ glFogiv: _glFogiv,
  /** @export */ glFramebufferRenderbuffer: _glFramebufferRenderbuffer,
  /** @export */ glFramebufferTexture2D: _glFramebufferTexture2D,
  /** @export */ glFrontFace: _glFrontFace,
  /** @export */ glFrustum: _glFrustum,
  /** @export */ glGenBuffers: _glGenBuffers,
  /** @export */ glGenFramebuffers: _glGenFramebuffers,
  /** @export */ glGenQueries: _glGenQueries,
  /** @export */ glGenRenderbuffers: _glGenRenderbuffers,
  /** @export */ glGenSamplers: _glGenSamplers,
  /** @export */ glGenTextures: _glGenTextures,
  /** @export */ glGenVertexArrays: _glGenVertexArrays,
  /** @export */ glGenerateMipmap: _glGenerateMipmap,
  /** @export */ glGetActiveUniform: _glGetActiveUniform,
  /** @export */ glGetAttribLocation: _glGetAttribLocation,
  /** @export */ glGetBooleanv: _glGetBooleanv,
  /** @export */ glGetError: _glGetError,
  /** @export */ glGetFloatv: _glGetFloatv,
  /** @export */ glGetIntegerv: _glGetIntegerv,
  /** @export */ glGetPointerv: _glGetPointerv,
  /** @export */ glGetProgramInfoLog: _glGetProgramInfoLog,
  /** @export */ glGetProgramiv: _glGetProgramiv,
  /** @export */ glGetQueryObjectuiv: _glGetQueryObjectuiv,
  /** @export */ glGetShaderInfoLog: _glGetShaderInfoLog,
  /** @export */ glGetShaderiv: _glGetShaderiv,
  /** @export */ glGetString: _glGetString,
  /** @export */ glGetTexEnvfv: _glGetTexEnvfv,
  /** @export */ glGetTexEnviv: _glGetTexEnviv,
  /** @export */ glGetTexParameterfv: _glGetTexParameterfv,
  /** @export */ glGetTexParameteriv: _glGetTexParameteriv,
  /** @export */ glGetUniformLocation: _glGetUniformLocation,
  /** @export */ glHint: _glHint,
  /** @export */ glIsTexture: _glIsTexture,
  /** @export */ glLightModelf: _glLightModelf,
  /** @export */ glLightModelfv: _glLightModelfv,
  /** @export */ glLightfv: _glLightfv,
  /** @export */ glLineWidth: _glLineWidth,
  /** @export */ glLinkProgram: _glLinkProgram,
  /** @export */ glLoadIdentity: _glLoadIdentity,
  /** @export */ glLoadMatrixd: _glLoadMatrixd,
  /** @export */ glLoadMatrixf: _glLoadMatrixf,
  /** @export */ glMaterialfv: _glMaterialfv,
  /** @export */ glMatrixMode: _glMatrixMode,
  /** @export */ glMultMatrixd: _glMultMatrixd,
  /** @export */ glMultMatrixf: _glMultMatrixf,
  /** @export */ glNormalPointer: _glNormalPointer,
  /** @export */ glOrtho: _glOrtho,
  /** @export */ glPixelStorei: _glPixelStorei,
  /** @export */ glPointSize: _glPointSize,
  /** @export */ glPolygonMode: _glPolygonMode,
  /** @export */ glPolygonOffset: _glPolygonOffset,
  /** @export */ glPopMatrix: _glPopMatrix,
  /** @export */ glPushMatrix: _glPushMatrix,
  /** @export */ glReadPixels: _glReadPixels,
  /** @export */ glRenderbufferStorage: _glRenderbufferStorage,
  /** @export */ glRotated: _glRotated,
  /** @export */ glRotatef: _glRotatef,
  /** @export */ glSamplerParameterf: _glSamplerParameterf,
  /** @export */ glSamplerParameteri: _glSamplerParameteri,
  /** @export */ glScaled: _glScaled,
  /** @export */ glScalef: _glScalef,
  /** @export */ glScissor: _glScissor,
  /** @export */ glShadeModel: _glShadeModel,
  /** @export */ glShaderSource: _glShaderSource,
  /** @export */ glStencilFunc: _glStencilFunc,
  /** @export */ glStencilFuncSeparate: _glStencilFuncSeparate,
  /** @export */ glStencilMask: _glStencilMask,
  /** @export */ glStencilMaskSeparate: _glStencilMaskSeparate,
  /** @export */ glStencilOp: _glStencilOp,
  /** @export */ glStencilOpSeparate: _glStencilOpSeparate,
  /** @export */ glTexCoordPointer: _glTexCoordPointer,
  /** @export */ glTexEnvf: _glTexEnvf,
  /** @export */ glTexEnvfv: _glTexEnvfv,
  /** @export */ glTexEnvi: _glTexEnvi,
  /** @export */ glTexImage2D: _glTexImage2D,
  /** @export */ glTexParameterf: _glTexParameterf,
  /** @export */ glTexParameterfv: _glTexParameterfv,
  /** @export */ glTexParameteri: _glTexParameteri,
  /** @export */ glTexParameteriv: _glTexParameteriv,
  /** @export */ glTexStorage2D: _glTexStorage2D,
  /** @export */ glTexSubImage2D: _glTexSubImage2D,
  /** @export */ glTranslated: _glTranslated,
  /** @export */ glTranslatef: _glTranslatef,
  /** @export */ glUniform1f: _glUniform1f,
  /** @export */ glUniform1fv: _glUniform1fv,
  /** @export */ glUniform1i: _glUniform1i,
  /** @export */ glUniform1iv: _glUniform1iv,
  /** @export */ glUniform2f: _glUniform2f,
  /** @export */ glUniform2fv: _glUniform2fv,
  /** @export */ glUniform2i: _glUniform2i,
  /** @export */ glUniform2iv: _glUniform2iv,
  /** @export */ glUniform3f: _glUniform3f,
  /** @export */ glUniform3fv: _glUniform3fv,
  /** @export */ glUniform3i: _glUniform3i,
  /** @export */ glUniform3iv: _glUniform3iv,
  /** @export */ glUniform4f: _glUniform4f,
  /** @export */ glUniform4fv: _glUniform4fv,
  /** @export */ glUniform4i: _glUniform4i,
  /** @export */ glUniform4iv: _glUniform4iv,
  /** @export */ glUniformMatrix2fv: _glUniformMatrix2fv,
  /** @export */ glUniformMatrix3fv: _glUniformMatrix3fv,
  /** @export */ glUniformMatrix4fv: _glUniformMatrix4fv,
  /** @export */ glUseProgram: _glUseProgram,
  /** @export */ glVertexAttrib4f: _glVertexAttrib4f,
  /** @export */ glVertexAttribDivisor: _glVertexAttribDivisor,
  /** @export */ glVertexAttribPointer: _glVertexAttribPointer,
  /** @export */ glVertexPointer: _glVertexPointer,
  /** @export */ glViewport: _glViewport,
  /** @export */ goldsrc_commit_cvars: _goldsrc_commit_cvars,
  /** @export */ goldsrc_record_cvar: _goldsrc_record_cvar,
  /** @export */ goldsrc_registry_changed: _goldsrc_registry_changed,
  /** @export */ goldsrc_registry_restore_entry: _goldsrc_registry_restore_entry,
  /** @export */ goldsrc_saved_cvar: _goldsrc_saved_cvar
};

// Argument name here must shadow the `wasmExports` global so
// that it is recognised by metadce and minify-import-export-names
// passes.
function applySignatureConversions(wasmExports) {
  // First, make a copy of the incoming exports object
  wasmExports = Object.assign({}, wasmExports);
  var makeWrapper_pp = f => a0 => f(a0) >>> 0;
  wasmExports["malloc"] = makeWrapper_pp(wasmExports["malloc"]);
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
// this as and extern so it won't get minified.
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
  module.exports = Cof;
  // This default export looks redundant, but it allows TS to import this
  // commonjs style module.
  module.exports.default = Cof;
} else if (typeof define === 'function' && define['amd'])
  define([], () => Cof);

