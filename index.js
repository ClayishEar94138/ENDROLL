var Module = void 0 !== Module ? Module : {};

function parseargs() {
    var e = [],
        t = [],
        r = location.search.substr(1).split("&");
    t.push("--save-path"), t.push("Save");
    for (var n, i, o = 0; o < r.length; o++) "project-path" != (e = r[o].split("="))[0] && "save-path" != e[0] && ("game" == e[0] && 1 < e.length && (Module.EASYRPG_GAME = e[1].toLowerCase()), t.push("--" + e[0]), 1 < e.length && 0 < (n = decodeURI(e[1])).length) && ('"' == n.slice(0) && '"' == n.slice(-1) ? t.push(n.slice(1, -1)) : (i = n.split(" "), t = t.concat(i)));
    return t;
}
Module.EASYRPG_GAME = "", Module.arguments = ["easyrpg-player"], Module.arguments = Module.arguments.concat(parseargs());
var key, moduleOverrides = {};
for (key in Module) Module.hasOwnProperty(key) && (moduleOverrides[key] = Module[key]);
var read_, readAsync, readBinary, setWindowTitle, nodeFS, nodePath, arguments_ = [],
    thisProgram = "./this.program",
    quit_ = function(e, t) {
        throw t;
    },
    ENVIRONMENT_IS_WEB = !1,
    ENVIRONMENT_IS_WORKER = !1,
    ENVIRONMENT_IS_NODE = !1,
    ENVIRONMENT_IS_SHELL = !1,
    ENVIRONMENT_IS_WEB = "object" == typeof window,
    ENVIRONMENT_IS_WORKER = "function" == typeof importScripts,
    ENVIRONMENT_IS_NODE = "object" == typeof process && "object" == typeof process.versions && "string" == typeof process.versions.node,
    ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER,
    scriptDirectory = "";

function locateFile(e) {
    return Module.locateFile ? Module.locateFile(e, scriptDirectory) : scriptDirectory + e;
}
ENVIRONMENT_IS_NODE ? (scriptDirectory = ENVIRONMENT_IS_WORKER ? require("path").dirname(scriptDirectory) + "/" : __dirname + "/", read_ = function(e, t) {
    return nodeFS = nodeFS || require("fs"), e = (nodePath = nodePath || require("path")).normalize(e), nodeFS.readFileSync(e, t ? null : "utf8");
}, readBinary = function(e) {
    e = read_(e, !0);
    return assert((e = e.buffer ? e : new Uint8Array(e)).buffer), e;
}, 1 < process.argv.length && (thisProgram = process.argv[1].replace(/\\/g, "/")), arguments_ = process.argv.slice(2), "undefined" != typeof module && (module.exports = Module), process.on("uncaughtException", function(e) {
    if (!(e instanceof ExitStatus)) throw e;
}), process.on("unhandledRejection", abort), quit_ = function(e) {
    process.exit(e);
}, Module.inspect = function() {
    return "[Emscripten Module object]";
}) : ENVIRONMENT_IS_SHELL ? ("undefined" != typeof read && (read_ = function(e) {
    return read(e);
}), readBinary = function(e) {
    return "function" == typeof readbuffer ? new Uint8Array(readbuffer(e)) : (assert("object" == typeof(e = read(e, "binary"))), e);
}, "undefined" != typeof scriptArgs ? arguments_ = scriptArgs : "undefined" != typeof arguments && (arguments_ = arguments), "function" == typeof quit && (quit_ = function(e) {
    quit(e);
}), "undefined" != typeof print && ((console = "undefined" == typeof console ? {} : console).log = print, console.warn = console.error = "undefined" != typeof printErr ? printErr : print)) : (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) && (ENVIRONMENT_IS_WORKER ? scriptDirectory = self.location.href : document.currentScript && (scriptDirectory = document.currentScript.src), scriptDirectory = 0 !== scriptDirectory.indexOf("blob:") ? scriptDirectory.substr(0, scriptDirectory.lastIndexOf("/") + 1) : "", read_ = function(e) {
    var t = new XMLHttpRequest();
    return t.open("GET", e, !1), t.send(null), t.responseText;
}, ENVIRONMENT_IS_WORKER && (readBinary = function(e) {
    var t = new XMLHttpRequest();
    return t.open("GET", e, !1), t.responseType = "arraybuffer", t.send(null), new Uint8Array(t.response);
}), readAsync = function(e, t, r) {
    var n = new XMLHttpRequest();
    n.open("GET", e, !0), n.responseType = "arraybuffer", n.onload = function() {
        200 == n.status || 0 == n.status && n.response ? t(n.response) : r();
    }, n.onerror = r, n.send(null);
}, setWindowTitle = function(e) {
    document.title = e;
});
var out = Module.print || console.log.bind(console),
    err = Module.printErr || console.warn.bind(console);
for (key in moduleOverrides) moduleOverrides.hasOwnProperty(key) && (Module[key] = moduleOverrides[key]);
moduleOverrides = null, Module.arguments && (arguments_ = Module.arguments), Module.thisProgram && (thisProgram = Module.thisProgram), Module.quit && (quit_ = Module.quit);
var STACK_ALIGN = 16;

function dynamicAlloc(e) {
    var t = HEAP32[DYNAMICTOP_PTR >> 2];
    return HEAP32[DYNAMICTOP_PTR >> 2] = t + e + 15 & -16, t;
}

function alignMemory(e, t) {
    return t = t || STACK_ALIGN, Math.ceil(e / t) * t;
}

function getNativeTypeSize(e) {
    switch (e) {
        case "i1":
        case "i8":
            return 1;
        case "i16":
            return 2;
        case "i32":
            return 4;
        case "i64":
            return 8;
        case "float":
            return 4;
        case "double":
            return 8;
        default:
            var t;
            return "*" === e[e.length - 1] ? 4 : "i" === e[0] ? (assert((t = Number(e.substr(1))) % 8 == 0, "getNativeTypeSize invalid bits " + t + ", type " + e), t / 8) : 0;
    }
}

function warnOnce(e) {
    warnOnce.shown || (warnOnce.shown = {}), warnOnce.shown[e] || (warnOnce.shown[e] = 1, err(e));
}

function convertJsFunctionToWasm(e, t) {
    if ("function" == typeof WebAssembly.Function) {
        for (var r = {
                i: "i32",
                j: "i64",
                f: "f32",
                d: "f64"
            }, n = {
                parameters: [],
                results: "v" == t[0] ? [] : [r[t[0]]]
            }, i = 1; i < t.length; ++i) n.parameters.push(r[t[i]]);
        return new WebAssembly.Function(n, e);
    }
    var o = [1, 0, 1, 96],
        a = t.slice(0, 1),
        s = t.slice(1),
        l = {
            i: 127,
            j: 126,
            f: 125,
            d: 124
        };
    o.push(s.length);
    for (i = 0; i < s.length; ++i) o.push(l[s[i]]);
    "v" == a ? o.push(0) : o = o.concat([1, l[a]]), o[1] = o.length - 2;
    a = new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0].concat(o, [2, 7, 1, 1, 101, 1, 102, 0, 0, 7, 5, 1, 1, 102, 0, 0])), a = new WebAssembly.Module(a);
    return new WebAssembly.Instance(a, {
        e: {
            f: e
        }
    }).exports.f;
}
var functionsInTableMap, freeTableIndexes = [];

function addFunctionWasm(t, r) {
    var n, i = wasmTable;
    if (!functionsInTableMap) {
        functionsInTableMap = new WeakMap();
        for (var e = 0; e < i.length; e++) {
            var o = i.get(e);
            o && functionsInTableMap.set(o, e);
        }
    }
    if (functionsInTableMap.has(t)) return functionsInTableMap.get(t);
    if (freeTableIndexes.length) n = freeTableIndexes.pop();
    else {
        n = i.length;
        try {
            i.grow(1);
        } catch (e) {
            if (e instanceof RangeError) throw "Unable to grow wasm table. Set ALLOW_TABLE_GROWTH.";
            throw e;
        }
    }
    try {
        i.set(n, t);
    } catch (e) {
        if (!(e instanceof TypeError)) throw e;
        r = convertJsFunctionToWasm(t, r);
        i.set(n, r);
    }
    return functionsInTableMap.set(t, n), n;
}

function removeFunctionWasm(e) {
    functionsInTableMap.delete(wasmTable.get(e)), freeTableIndexes.push(e);
}
var funcWrappers = {};

function dynCall(e, t, r) {
    return r && r.length ? Module["dynCall_" + e].apply(null, [t].concat(r)) : Module["dynCall_" + e].call(null, t);
}
var wasmBinary, noExitRuntime, wasmMemory, tempRet0 = 0,
    setTempRet0 = function(e) {
        tempRet0 = e;
    },
    getTempRet0 = function() {
        return tempRet0;
    };

function setValue(e, t, r, n) {
    switch (r = "*" === (r = r || "i8").charAt(r.length - 1) ? "i32" : r) {
        case "i1":
        case "i8":
            HEAP8[e >> 0] = t;
            break;
        case "i16":
            HEAP16[e >> 1] = t;
            break;
        case "i32":
            HEAP32[e >> 2] = t;
            break;
        case "i64":
            tempI64 = [t >>> 0, 1 <= +Math_abs(tempDouble = t) ? 0 < tempDouble ? (0 | Math_min(+Math_floor(tempDouble / 4294967296), 4294967295)) >>> 0 : ~~+Math_ceil((tempDouble - (~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0], HEAP32[e >> 2] = tempI64[0], HEAP32[e + 4 >> 2] = tempI64[1];
            break;
        case "float":
            HEAPF32[e >> 2] = t;
            break;
        case "double":
            HEAPF64[e >> 3] = t;
            break;
        default:
            abort("invalid type for setValue: " + r)
    }
}
Module.wasmBinary && (wasmBinary = Module.wasmBinary), Module.noExitRuntime && (noExitRuntime = Module.noExitRuntime), "object" != typeof WebAssembly && abort("no native wasm support detected");
var wasmTable = new WebAssembly.Table({
        initial: 6626,
        maximum: 6626,
        element: "anyfunc"
    }),
    ABORT = !1,
    EXITSTATUS = 0;

function assert(e, t) {
    e || abort("Assertion failed: " + t)
}

function getCFunc(e) {
    var t = Module["_" + e];
    return assert(t, "Cannot call unknown function " + e + ", make sure it is exported"), t
}

function ccall(e, t, r, n, i) {
    var o = {
        string: function(e) {
            var t, r = 0;
            return null != e && 0 !== e && (t = 1 + (e.length << 2), stringToUTF8(e, r = stackAlloc(t), t)), r
        },
        array: function(e) {
            var t = stackAlloc(e.length);
            return writeArrayToMemory(e, t), t
        }
    };

    function a(e) {
        return "string" === t ? UTF8ToString(e) : "boolean" === t ? Boolean(e) : e
    }
    var e = getCFunc(e),
        s = [],
        l = 0;
    if (n)
        for (var c = 0; c < n.length; c++) {
            var u = o[r[c]];
            u ? (0 === l && (l = stackSave()), s[c] = u(n[c])) : s[c] = n[c]
        }
    var e = e.apply(null, s),
        d = (i && i.async, "object" == typeof Asyncify && Asyncify.currData),
        _ = "object" == typeof Asyncify && 0 < Asyncify.asyncFinalizers.length;
    return d && !_ ? new Promise(function(t) {
        Asyncify.asyncFinalizers.push(function(e) {
            0 !== l && stackRestore(l), t(a(e))
        })
    }) : (e = a(e), 0 !== l && stackRestore(l), i && i.async ? Promise.resolve(e) : e)
}
var ALLOC_NORMAL = 0,
    ALLOC_STACK = 1,
    ALLOC_NONE = 3;

function allocate(e, t, r, n) {
    var i, o, a = "number" == typeof e ? (i = !0, e) : (i = !1, e.length),
        s = "string" == typeof t ? t : null,
        l = r == ALLOC_NONE ? n : [_malloc, stackAlloc, dynamicAlloc][r](Math.max(a, s ? 1 : t.length));
    if (i) {
        for (assert(0 == (3 & (n = l))), o = l + (-4 & a); n < o; n += 4) HEAP32[n >> 2] = 0;
        for (o = l + a; n < o;) HEAP8[n++ >> 0] = 0
    } else if ("i8" === s) e.subarray || e.slice ? HEAPU8.set(e, l) : HEAPU8.set(new Uint8Array(e), l);
    else
        for (var c, u, d = 0; d < a;) {
            var _, f = e[d];
            0 === (_ = s || t[d]) ? d++ : (setValue(l + d, f, _ = "i64" == _ ? "i32" : _), u !== _ && (c = getNativeTypeSize(_), u = _), d += c)
        }
    return l
}
var UTF8Decoder = "undefined" != typeof TextDecoder ? new TextDecoder("utf8") : void 0;

function UTF8ArrayToString(e, t, r) {
    for (var n = t + r, i = t; e[i] && !(n <= i);) ++i;
    if (16 < i - t && e.subarray && UTF8Decoder) return UTF8Decoder.decode(e.subarray(t, i));
    for (var o = ""; t < i;) {
        var a, s, l = e[t++];
        128 & l ? (s = 63 & e[t++], 192 == (224 & l) ? o += String.fromCharCode((31 & l) << 6 | s) : (a = 63 & e[t++], (l = 224 == (240 & l) ? (15 & l) << 12 | s << 6 | a : (7 & l) << 18 | s << 12 | a << 6 | 63 & e[t++]) < 65536 ? o += String.fromCharCode(l) : (s = l - 65536, o += String.fromCharCode(55296 | s >> 10, 56320 | 1023 & s)))) : o += String.fromCharCode(l)
    }
    return o
}

function UTF8ToString(e, t) {
    return e ? UTF8ArrayToString(HEAPU8, e, t) : ""
}

function stringToUTF8Array(e, t, r, n) {
    if (!(0 < n)) return 0;
    for (var i = r, o = r + n - 1, a = 0; a < e.length; ++a) {
        var s = e.charCodeAt(a);
        if ((s = 55296 <= s && s <= 57343 ? 65536 + ((1023 & s) << 10) | 1023 & e.charCodeAt(++a) : s) <= 127) {
            if (o <= r) break;
            t[r++] = s
        } else {
            if (s <= 2047) {
                if (o <= r + 1) break;
                t[r++] = 192 | s >> 6
            } else {
                if (s <= 65535) {
                    if (o <= r + 2) break;
                    t[r++] = 224 | s >> 12
                } else {
                    if (o <= r + 3) break;
                    t[r++] = 240 | s >> 18, t[r++] = 128 | s >> 12 & 63
                }
                t[r++] = 128 | s >> 6 & 63
            }
            t[r++] = 128 | 63 & s
        }
    }
    return t[r] = 0, r - i
}

function stringToUTF8(e, t, r) {
    return stringToUTF8Array(e, HEAPU8, t, r)
}

function lengthBytesUTF8(e) {
    for (var t = 0, r = 0; r < e.length; ++r) {
        var n = e.charCodeAt(r);
        (n = 55296 <= n && n <= 57343 ? 65536 + ((1023 & n) << 10) | 1023 & e.charCodeAt(++r) : n) <= 127 ? ++t : t += n <= 2047 ? 2 : n <= 65535 ? 3 : 4
    }
    return t
}
var UTF16Decoder = "undefined" != typeof TextDecoder ? new TextDecoder("utf-16le") : void 0;

function allocateUTF8(e) {
    var t = lengthBytesUTF8(e) + 1,
        r = _malloc(t);
    return r && stringToUTF8Array(e, HEAP8, r, t), r
}

function allocateUTF8OnStack(e) {
    var t = lengthBytesUTF8(e) + 1,
        r = stackAlloc(t);
    return stringToUTF8Array(e, HEAP8, r, t), r
}

function writeArrayToMemory(e, t) {
    HEAP8.set(e, t)
}

function writeAsciiToMemory(e, t, r) {
    for (var n = 0; n < e.length; ++n) HEAP8[t++ >> 0] = e.charCodeAt(n);
    r || (HEAP8[t >> 0] = 0)
}
var buffer, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64, WASM_PAGE_SIZE = 65536;

function alignUp(e, t) {
    return 0 < e % t && (e += t - e % t), e
}

function updateGlobalBufferAndViews(e) {
    buffer = e, Module.HEAP8 = HEAP8 = new Int8Array(e), Module.HEAP16 = HEAP16 = new Int16Array(e), Module.HEAP32 = HEAP32 = new Int32Array(e), Module.HEAPU8 = HEAPU8 = new Uint8Array(e), Module.HEAPU16 = HEAPU16 = new Uint16Array(e), Module.HEAPU32 = HEAPU32 = new Uint32Array(e), Module.HEAPF32 = HEAPF32 = new Float32Array(e), Module.HEAPF64 = HEAPF64 = new Float64Array(e)
}
var STACK_BASE = 8605472,
    DYNAMIC_BASE = 8605472,
    DYNAMICTOP_PTR = 3362432,
    INITIAL_INITIAL_MEMORY = Module.INITIAL_MEMORY || 16777216;

function callRuntimeCallbacks(e) {
    for (; 0 < e.length;) {
        var t, r = e.shift();
        "function" == typeof r ? r(Module) : "number" == typeof(t = r.func) ? void 0 === r.arg ? Module.dynCall_v(t) : Module.dynCall_vi(t, r.arg) : t(void 0 === r.arg ? null : r.arg)
    }
}
wasmMemory = Module.wasmMemory || new WebAssembly.Memory({
    initial: INITIAL_INITIAL_MEMORY / WASM_PAGE_SIZE,
    maximum: 2147483648 / WASM_PAGE_SIZE
}), INITIAL_INITIAL_MEMORY = (buffer = wasmMemory ? wasmMemory.buffer : buffer).byteLength, updateGlobalBufferAndViews(buffer), HEAP32[DYNAMICTOP_PTR >> 2] = DYNAMIC_BASE;
var __ATPRERUN__ = [],
    __ATINIT__ = [],
    __ATMAIN__ = [],
    __ATEXIT__ = [],
    __ATPOSTRUN__ = [],
    runtimeInitialized = !1,
    runtimeExited = !1;

function preRun() {
    if (Module.preRun)
        for ("function" == typeof Module.preRun && (Module.preRun = [Module.preRun]); Module.preRun.length;) addOnPreRun(Module.preRun.shift());
    callRuntimeCallbacks(__ATPRERUN__)
}

function initRuntime() {
    runtimeInitialized = !0, Module.noFSInit || FS.init.initialized || FS.init(), TTY.init(), callRuntimeCallbacks(__ATINIT__)
}

function preMain() {
    FS.ignorePermissions = !1, callRuntimeCallbacks(__ATMAIN__)
}

function exitRuntime() {
    runtimeExited = !0
}

function postRun() {
    if (Module.postRun)
        for ("function" == typeof Module.postRun && (Module.postRun = [Module.postRun]); Module.postRun.length;) addOnPostRun(Module.postRun.shift());
    callRuntimeCallbacks(__ATPOSTRUN__)
}

function addOnPreRun(e) {
    __ATPRERUN__.unshift(e)
}

function addOnPostRun(e) {
    __ATPOSTRUN__.unshift(e)
}
var Math_abs = Math.abs,
    Math_ceil = Math.ceil,
    Math_floor = Math.floor,
    Math_min = Math.min,
    runDependencies = 0,
    runDependencyWatcher = null,
    dependenciesFulfilled = null;

function getUniqueRunDependency(e) {
    return e
}

function addRunDependency(e) {
    runDependencies++, Module.monitorRunDependencies && Module.monitorRunDependencies(runDependencies)
}

function removeRunDependency(e) {
    var t;
    runDependencies--, Module.monitorRunDependencies && Module.monitorRunDependencies(runDependencies), 0 == runDependencies && (null !== runDependencyWatcher && (clearInterval(runDependencyWatcher), runDependencyWatcher = null), dependenciesFulfilled) && (t = dependenciesFulfilled, dependenciesFulfilled = null, t())
}

function abort(e) {
    throw Module.onAbort && Module.onAbort(e), err(e += ""), ABORT = !0, EXITSTATUS = 1, e = "abort(" + e + "). Build with -s ASSERTIONS=1 for more info.", new WebAssembly.RuntimeError(e)
}

function hasPrefix(e, t) {
    return String.prototype.startsWith ? e.startsWith(t) : 0 === e.indexOf(t)
}
Module.preloadedImages = {}, Module.preloadedAudios = {};
var dataURIPrefix = "data:application/octet-stream;base64,";

function isDataURI(e) {
    return hasPrefix(e, dataURIPrefix)
}
var fileURIPrefix = "file://";

function isFileURI(e) {
    return hasPrefix(e, fileURIPrefix)
}
var tempDouble, tempI64, wasmBinaryFile = "index.wasm";

function getBinary() {
    try {
        if (wasmBinary) return new Uint8Array(wasmBinary);
        if (readBinary) return readBinary(wasmBinaryFile);
        throw "both async and sync fetching of the wasm failed"
    } catch (e) {
        abort(e)
    }
}

function getBinaryPromise() {
    return wasmBinary || !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_WORKER || "function" != typeof fetch || isFileURI(wasmBinaryFile) ? Promise.resolve().then(getBinary) : fetch(wasmBinaryFile, {
        credentials: "same-origin"
    }).then(function(e) {
        if (e.ok) return e.arrayBuffer();
        throw "failed to load wasm binary file at '" + wasmBinaryFile + "'"
    }).catch(function() {
        return getBinary()
    })
}

function createWasm() {
    var t = {
        env: asmLibraryArg,
        wasi_snapshot_preview1: asmLibraryArg
    };

    function r(e, t) {
        e = e.exports, e = Asyncify.instrumentWasmExports(e);
        Module.asm = e, removeRunDependency("wasm-instantiate")
    }

    function n(e) {
        r(e.instance)
    }

    function i(e) {
        return getBinaryPromise().then(function(e) {
            return WebAssembly.instantiate(e, t)
        }).then(e, function(e) {
            err("failed to asynchronously prepare wasm: " + e), abort(e)
        })
    }
    if (addRunDependency("wasm-instantiate"), Module.instantiateWasm) try {
        var e = Module.instantiateWasm(t, r);
        return Asyncify.instrumentWasmExports(e)
    } catch (e) {
        return err("Module.instantiateWasm callback failed with error: " + e), !1
    }
    return wasmBinary || "function" != typeof WebAssembly.instantiateStreaming || isDataURI(wasmBinaryFile) || isFileURI(wasmBinaryFile) || "function" != typeof fetch ? i(n) : fetch(wasmBinaryFile, {
        credentials: "same-origin"
    }).then(function(e) {
        return WebAssembly.instantiateStreaming(e, t).then(n, function(e) {
            return err("wasm streaming compile failed: " + e), err("falling back to ArrayBuffer instantiation"), i(n)
        })
    }), {}
}
isDataURI(wasmBinaryFile) || (wasmBinaryFile = locateFile(wasmBinaryFile));
var ASM_CONSTS = {
    1102071: function() {
        ["Backdrop", "Battle", "Battle2", "BattleCharSet", "BattleWeapon", "CharSet", "ChipSet", "FaceSet", "Frame", "GameOver", "Monster", "Movie", "Music", "Panorama", "Picture", "Sound", "System", "System2", "Title", "Save"].forEach(function(e) {
            FS.mkdir(e)
        }), FS.mount(Module.EASYRPG_FS, {}, "Save"), FS.syncfs(!0, function(e) {})
    },
    1217532: function() {
        FS.syncfs(function(e) {})
    },
    1242906: function(e) {
        e = UTF8ToString(e) + "\n\nAbort/Retry/Ignore/AlwaysIgnore? [ariA] :", e = window.prompt(e, "i");
        return allocate(intArrayFromString(e = null === e ? "i" : e), "i8", ALLOC_NORMAL)
    },
    1280488: function(e, t, r) {
        Module.SDL2 || (Module.SDL2 = {});
        var n = Module.SDL2,
            i = (n.ctxCanvas !== Module.canvas && (n.ctx = Module.createContext(Module.canvas, !1, !0), n.ctxCanvas = Module.canvas), n.w === e && n.h === t && n.imageCtx === n.ctx || (n.image = n.ctx.createImageData(e, t), n.w = e, n.h = t, n.imageCtx = n.ctx), n.image.data),
            o = r >> 2,
            a = 0;
        if ("undefined" != typeof CanvasPixelArray && i instanceof CanvasPixelArray)
            for (l = i.length; a < l;) {
                var s = HEAP32[o];
                i[a] = 255 & s, i[a + 1] = s >> 8 & 255, i[a + 2] = s >> 16 & 255, i[a + 3] = 255, o++, a += 4
            } else {
                n.data32Data !== i && (n.data32 = new Int32Array(i.buffer), n.data8 = new Uint8Array(i.buffer));
                var e = n.data32,
                    l = e.length,
                    c = (e.set(HEAP32.subarray(o, o + l)), n.data8),
                    u = 3,
                    d = u + 4 * l;
                if (l % 8 == 0)
                    for (; u < d;) c[u] = 255, c[u = u + 4 | 0] = 255, c[u = u + 4 | 0] = 255, c[u = u + 4 | 0] = 255, c[u = u + 4 | 0] = 255, c[u = u + 4 | 0] = 255, c[u = u + 4 | 0] = 255, c[u = u + 4 | 0] = 255, u = u + 4 | 0;
                else
                    for (; u < d;) c[u] = 255, u = u + 4 | 0
            }
        return n.ctx.putImageData(n.image, 0, 0), 0
    },
    1281967: function(e, t, r, n, i) {
        var o = document.createElement("canvas"),
            a = (o.width = e, o.height = t, o.getContext("2d")),
            e = a.createImageData(e, t),
            s = e.data,
            l = i >> 2,
            c = 0;
        if ("undefined" != typeof CanvasPixelArray && s instanceof CanvasPixelArray)
            for (d = s.length; c < d;) {
                var u = HEAP32[l];
                s[c] = 255 & u, s[c + 1] = u >> 8 & 255, s[c + 2] = u >> 16 & 255, s[c + 3] = u >> 24 & 255, l++, c += 4
            } else {
                var t = new Int32Array(s.buffer),
                    d = t.length;
                t.set(HEAP32.subarray(l, l + d))
            }
        a.putImageData(e, 0, 0);
        i = 0 === r && 0 === n ? "url(" + o.toDataURL() + "), auto" : "url(" + o.toDataURL() + ") " + r + " " + n + ", auto", t = _malloc(i.length + 1);
        return stringToUTF8(i, t, i.length + 1), t
    },
    1282956: function(e) {
        return Module.canvas && (Module.canvas.style.cursor = UTF8ToString(e)), 0
    },
    1283049: function() {
        Module.canvas && (Module.canvas.style.cursor = "none")
    },
    1284278: function() {
        return screen.width
    },
    1284305: function() {
        return screen.height
    },
    1284333: function() {
        return window.innerWidth
    },
    1284365: function() {
        return window.innerHeight
    },
    1284443: function(e) {
        return void 0 !== setWindowTitle && setWindowTitle(UTF8ToString(e)), 0
    },
    1284577: function() {
        return "undefined" != typeof AudioContext || "undefined" != typeof webkitAudioContext ? 1 : 0
    },
    1284743: function() {
        return void 0 !== navigator.mediaDevices && void 0 !== navigator.mediaDevices.getUserMedia || void 0 !== navigator.webkitGetUserMedia ? 1 : 0
    },
    1284969: function(e) {
        void 0 === Module.SDL2 && (Module.SDL2 = {});
        var t = Module.SDL2;
        return e ? t.capture = {} : t.audio = {}, t.audioContext || ("undefined" != typeof AudioContext ? t.audioContext = new AudioContext : "undefined" != typeof webkitAudioContext && (t.audioContext = new webkitAudioContext), t.audioContext && autoResumeAudioContext(t.audioContext)), void 0 === t.audioContext ? -1 : 0
    },
    1285522: function() {
        return Module.SDL2.audioContext.sampleRate
    },
    1285592: function(t, r, n, i) {
        function e(e) {
            void 0 !== a.capture.silenceTimer && (clearTimeout(a.capture.silenceTimer), a.capture.silenceTimer = void 0), a.capture.mediaStreamNode = a.audioContext.createMediaStreamSource(e), a.capture.scriptProcessorNode = a.audioContext.createScriptProcessor(r, t, 1), a.capture.scriptProcessorNode.onaudioprocess = function(e) {
                void 0 !== a && void 0 !== a.capture && (e.outputBuffer.getChannelData(0).fill(0), a.capture.currentCaptureBuffer = e.inputBuffer, dynCall("vi", n, [i]))
            }, a.capture.mediaStreamNode.connect(a.capture.scriptProcessorNode), a.capture.scriptProcessorNode.connect(a.audioContext.destination), a.capture.stream = e
        }

        function o(e) {}
        var a = Module.SDL2;
        a.capture.silenceBuffer = a.audioContext.createBuffer(t, r, a.audioContext.sampleRate), a.capture.silenceBuffer.getChannelData(0).fill(0);
        a.capture.silenceTimer = setTimeout(function() {
            a.capture.currentCaptureBuffer = a.capture.silenceBuffer, dynCall("vi", n, [i])
        }, r / a.audioContext.sampleRate * 1e3), void 0 !== navigator.mediaDevices && void 0 !== navigator.mediaDevices.getUserMedia ? navigator.mediaDevices.getUserMedia({
            audio: !0,
            video: !1
        }).then(e).catch(o) : void 0 !== navigator.webkitGetUserMedia && navigator.webkitGetUserMedia({
            audio: !0,
            video: !1
        }, e, o)
    },
    1287244: function(e, t, r, n) {
        var i = Module.SDL2;
        i.audio.scriptProcessorNode = i.audioContext.createScriptProcessor(t, 0, e), i.audio.scriptProcessorNode.onaudioprocess = function(e) {
            void 0 !== i && void 0 !== i.audio && (i.audio.currentOutputBuffer = e.outputBuffer, dynCall("vi", r, [n]))
        }, i.audio.scriptProcessorNode.connect(i.audioContext.destination)
    },
    1287654: function(e, t) {
        for (var r = Module.SDL2, n = r.capture.currentCaptureBuffer.numberOfChannels, i = 0; i < n; ++i) {
            var o = r.capture.currentCaptureBuffer.getChannelData(i);
            if (o.length != t) throw "Web Audio capture buffer length mismatch! Destination size: " + o.length + " samples vs expected " + t + " samples!";
            if (1 == n)
                for (var a = 0; a < t; ++a) setValue(e + 4 * a, o[a], "float");
            else
                for (a = 0; a < t; ++a) setValue(e + 4 * (a * n + i), o[a], "float")
        }
    },
    1288259: function(e, t) {
        for (var r = Module.SDL2, n = r.audio.currentOutputBuffer.numberOfChannels, i = 0; i < n; ++i) {
            var o = r.audio.currentOutputBuffer.getChannelData(i);
            if (o.length != t) throw "Web Audio output buffer length mismatch! Destination size: " + o.length + " samples vs expected " + t + " samples!";
            for (var a = 0; a < t; ++a) o[a] = HEAPF32[e + (a * n + i << 2) >> 2]
        }
    },
    1288739: function(e) {
        var t = Module.SDL2;
        if (e) {
            if (void 0 !== t.capture.silenceTimer && clearTimeout(t.capture.silenceTimer), void 0 !== t.capture.stream) {
                for (var r = t.capture.stream.getAudioTracks(), n = 0; n < r.length; n++) t.capture.stream.removeTrack(r[n]);
                t.capture.stream = void 0
            }
            void 0 !== t.capture.scriptProcessorNode && (t.capture.scriptProcessorNode.onaudioprocess = function(e) {}, t.capture.scriptProcessorNode.disconnect(), t.capture.scriptProcessorNode = void 0), void 0 !== t.capture.mediaStreamNode && (t.capture.mediaStreamNode.disconnect(), t.capture.mediaStreamNode = void 0), void 0 !== t.capture.silenceBuffer && (t.capture.silenceBuffer = void 0), t.capture = void 0
        } else null != t.audio.scriptProcessorNode && (t.audio.scriptProcessorNode.disconnect(), t.audio.scriptProcessorNode = void 0), t.audio = void 0;
        void 0 !== t.audioContext && void 0 === t.audio && void 0 === t.capture && (t.audioContext.close(), t.audioContext = void 0)
    }
};

function listenOnce(e, t, r) {
    e.addEventListener(t, r, {
        once: !0
    })
}

function autoResumeAudioContext(r, e) {
    e = e || [document, document.getElementById("canvas")], ["keydown", "mousedown", "touchstart"].forEach(function(t) {
        e.forEach(function(e) {
            e && listenOnce(e, t, function() {
                "suspended" === r.state && r.resume()
            })
        })
    })
}

function demangle(e) {
    return e
}

function demangleAll(e) {
    return e.replace(/\b_Z[\w\d_]+/g, function(e) {
        var t = demangle(e);
        return e === t ? e : t + " [" + e + "]"
    })
}

function jsStackTrace() {
    var t = new Error;
    if (!t.stack) {
        try {
            throw new Error
        } catch (e) {
            t = e
        }
        if (!t.stack) return "(no stack trace available)"
    }
    return t.stack.toString()
}

function stackTrace() {
    var e = jsStackTrace();
    return Module.extraStackTrace && (e += "\n" + Module.extraStackTrace()), demangleAll(e)
}

function ___assert_fail(e, t, r, n) {
    abort("Assertion failed: " + UTF8ToString(e) + ", at: " + [t ? UTF8ToString(t) : "unknown filename", r, n ? UTF8ToString(n) : "unknown function"])
}
__ATINIT__.push({
    func: function() {
        ___wasm_call_ctors()
    }
});
var ExceptionInfoAttrs = {
    DESTRUCTOR_OFFSET: 0,
    REFCOUNT_OFFSET: 4,
    TYPE_OFFSET: 8,
    CAUGHT_OFFSET: 12,
    RETHROWN_OFFSET: 13,
    SIZE: 16
};

function ___cxa_allocate_exception(e) {
    return _malloc(e + ExceptionInfoAttrs.SIZE) + ExceptionInfoAttrs.SIZE
}

function _atexit(e, t) {}

function ___cxa_atexit(e, t) {
    return _atexit(e, t)
}

function ExceptionInfo(e) {
    this.excPtr = e, this.ptr = e - ExceptionInfoAttrs.SIZE, this.set_type = function(e) {
        HEAP32[this.ptr + ExceptionInfoAttrs.TYPE_OFFSET >> 2] = e
    }, this.get_type = function() {
        return HEAP32[this.ptr + ExceptionInfoAttrs.TYPE_OFFSET >> 2]
    }, this.set_destructor = function(e) {
        HEAP32[this.ptr + ExceptionInfoAttrs.DESTRUCTOR_OFFSET >> 2] = e
    }, this.get_destructor = function() {
        return HEAP32[this.ptr + ExceptionInfoAttrs.DESTRUCTOR_OFFSET >> 2]
    }, this.set_refcount = function(e) {
        HEAP32[this.ptr + ExceptionInfoAttrs.REFCOUNT_OFFSET >> 2] = e
    }, this.set_caught = function(e) {
        HEAP8[this.ptr + ExceptionInfoAttrs.CAUGHT_OFFSET >> 0] = e = e ? 1 : 0
    }, this.get_caught = function() {
        return 0 != HEAP8[this.ptr + ExceptionInfoAttrs.CAUGHT_OFFSET >> 0]
    }, this.set_rethrown = function(e) {
        HEAP8[this.ptr + ExceptionInfoAttrs.RETHROWN_OFFSET >> 0] = e = e ? 1 : 0
    }, this.get_rethrown = function() {
        return 0 != HEAP8[this.ptr + ExceptionInfoAttrs.RETHROWN_OFFSET >> 0]
    }, this.init = function(e, t) {
        this.set_type(e), this.set_destructor(t), this.set_refcount(0), this.set_caught(!1), this.set_rethrown(!1)
    }, this.add_ref = function() {
        var e = HEAP32[this.ptr + ExceptionInfoAttrs.REFCOUNT_OFFSET >> 2];
        HEAP32[this.ptr + ExceptionInfoAttrs.REFCOUNT_OFFSET >> 2] = e + 1
    }, this.release_ref = function() {
        var e = HEAP32[this.ptr + ExceptionInfoAttrs.REFCOUNT_OFFSET >> 2];
        return HEAP32[this.ptr + ExceptionInfoAttrs.REFCOUNT_OFFSET >> 2] = e - 1, 1 === e
    }
}
var exceptionLast = 0;

function __ZSt18uncaught_exceptionv() {
    return 0 < __ZSt18uncaught_exceptionv.uncaught_exceptions
}

function ___cxa_throw(e, t, r) {
    throw new ExceptionInfo(e).init(t, r), exceptionLast = e, "uncaught_exception" in __ZSt18uncaught_exceptionv ? __ZSt18uncaught_exceptionv.uncaught_exceptions++ : __ZSt18uncaught_exceptionv.uncaught_exceptions = 1, e
}

function setErrNo(e) {
    return HEAP32[___errno_location() >> 2] = e
}

function ___map_file(e, t) {
    return setErrNo(63), -1
}
var PATH = {
        splitPath: function(e) {
            return /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/.exec(e).slice(1)
        },
        normalizeArray: function(e, t) {
            for (var r = 0, n = e.length - 1; 0 <= n; n--) {
                var i = e[n];
                "." === i ? e.splice(n, 1) : ".." === i ? (e.splice(n, 1), r++) : r && (e.splice(n, 1), r--)
            }
            if (t)
                for (; r; r--) e.unshift("..");
            return e
        },
        normalize: function(e) {
            var t = "/" === e.charAt(0),
                r = "/" === e.substr(-1);
            return (e = (e = PATH.normalizeArray(e.split("/").filter(function(e) {
                return !!e
            }), !t).join("/")) || t ? e : ".") && r && (e += "/"), (t ? "/" : "") + e
        },
        dirname: function(e) {
            var e = PATH.splitPath(e),
                t = e[0],
                e = e[1];
            return t || e ? t + (e = e && e.substr(0, e.length - 1)) : "."
        },
        basename: function(e) {
            var t;
            return "/" === e ? "/" : -1 === (t = (e = (e = PATH.normalize(e)).replace(/\/$/, "")).lastIndexOf("/")) ? e : e.substr(t + 1)
        },
        extname: function(e) {
            return PATH.splitPath(e)[3]
        },
        join: function() {
            var e = Array.prototype.slice.call(arguments, 0);
            return PATH.normalize(e.join("/"))
        },
        join2: function(e, t) {
            return PATH.normalize(e + "/" + t)
        }
    },
    PATH_FS = {
        resolve: function() {
            for (var e = "", t = !1, r = arguments.length - 1; - 1 <= r && !t; r--) {
                var n = 0 <= r ? arguments[r] : FS.cwd();
                if ("string" != typeof n) throw new TypeError("Arguments to path.resolve must be strings");
                if (!n) return "";
                e = n + "/" + e, t = "/" === n.charAt(0)
            }
            return (t ? "/" : "") + (e = PATH.normalizeArray(e.split("/").filter(function(e) {
                return !!e
            }), !t).join("/")) || "."
        },
        relative: function(e, t) {
            function r(e) {
                for (var t = 0; t < e.length && "" === e[t]; t++);
                for (var r = e.length - 1; 0 <= r && "" === e[r]; r--);
                return r < t ? [] : e.slice(t, r - t + 1)
            }
            e = PATH_FS.resolve(e).substr(1), t = PATH_FS.resolve(t).substr(1);
            for (var n = r(e.split("/")), i = r(t.split("/")), o = Math.min(n.length, i.length), a = o, s = 0; s < o; s++)
                if (n[s] !== i[s]) {
                    a = s;
                    break
                } for (var l = [], s = a; s < n.length; s++) l.push("..");
            return (l = l.concat(i.slice(a))).join("/")
        }
    },
    TTY = {
        ttys: [],
        init: function() {},
        shutdown: function() {},
        register: function(e, t) {
            TTY.ttys[e] = {
                input: [],
                output: [],
                ops: t
            }, FS.registerDevice(e, TTY.stream_ops)
        },
        stream_ops: {
            open: function(e) {
                var t = TTY.ttys[e.node.rdev];
                if (!t) throw new FS.ErrnoError(43);
                e.tty = t, e.seekable = !1
            },
            close: function(e) {
                e.tty.ops.flush(e.tty)
            },
            flush: function(e) {
                e.tty.ops.flush(e.tty)
            },
            read: function(e, t, r, n, i) {
                if (!e.tty || !e.tty.ops.get_char) throw new FS.ErrnoError(60);
                for (var o, a = 0, s = 0; s < n; s++) {
                    try {
                        o = e.tty.ops.get_char(e.tty)
                    } catch (e) {
                        throw new FS.ErrnoError(29)
                    }
                    if (void 0 === o && 0 === a) throw new FS.ErrnoError(6);
                    if (null == o) break;
                    a++, t[r + s] = o
                }
                return a && (e.node.timestamp = Date.now()), a
            },
            write: function(e, t, r, n, i) {
                if (!e.tty || !e.tty.ops.put_char) throw new FS.ErrnoError(60);
                try {
                    for (var o = 0; o < n; o++) e.tty.ops.put_char(e.tty, t[r + o])
                } catch (e) {
                    throw new FS.ErrnoError(29)
                }
                return n && (e.node.timestamp = Date.now()), o
            }
        },
        default_tty_ops: {
            get_char: function(e) {
                if (!e.input.length) {
                    var t = null;
                    if (ENVIRONMENT_IS_NODE) {
                        var r = Buffer.alloc ? Buffer.alloc(256) : new Buffer(256),
                            n = 0;
                        try {
                            n = nodeFS.readSync(process.stdin.fd, r, 0, 256, null)
                        } catch (e) {
                            if (-1 == e.toString().indexOf("EOF")) throw e;
                            n = 0
                        }
                        t = 0 < n ? r.slice(0, n).toString("utf-8") : null
                    } else "undefined" != typeof window && "function" == typeof window.prompt ? null !== (t = window.prompt("Input: ")) && (t += "\n") : "function" == typeof readline && null !== (t = readline()) && (t += "\n");
                    if (!t) return null;
                    e.input = intArrayFromString(t, !0)
                }
                return e.input.shift()
            },
            put_char: function(e, t) {
                null === t || 10 === t ? (out(UTF8ArrayToString(e.output, 0)), e.output = []) : 0 != t && e.output.push(t)
            },
            flush: function(e) {
                e.output && 0 < e.output.length && (out(UTF8ArrayToString(e.output, 0)), e.output = [])
            }
        },
        default_tty1_ops: {
            put_char: function(e, t) {
                null === t || 10 === t ? (err(UTF8ArrayToString(e.output, 0)), e.output = []) : 0 != t && e.output.push(t)
            },
            flush: function(e) {
                e.output && 0 < e.output.length && (err(UTF8ArrayToString(e.output, 0)), e.output = [])
            }
        }
    },
    MEMFS = {
        ops_table: null,
        mount: function(e) {
            return MEMFS.createNode(null, "/", 16895, 0)
        },
        createNode: function(e, t, r, n) {
            if (FS.isBlkdev(r) || FS.isFIFO(r)) throw new FS.ErrnoError(63);
            MEMFS.ops_table || (MEMFS.ops_table = {
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
                        allocate: MEMFS.stream_ops.allocate,
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
            });
            r = FS.createNode(e, t, r, n);
            return FS.isDir(r.mode) ? (r.node_ops = MEMFS.ops_table.dir.node, r.stream_ops = MEMFS.ops_table.dir.stream, r.contents = {}) : FS.isFile(r.mode) ? (r.node_ops = MEMFS.ops_table.file.node, r.stream_ops = MEMFS.ops_table.file.stream, r.usedBytes = 0, r.contents = null) : FS.isLink(r.mode) ? (r.node_ops = MEMFS.ops_table.link.node, r.stream_ops = MEMFS.ops_table.link.stream) : FS.isChrdev(r.mode) && (r.node_ops = MEMFS.ops_table.chrdev.node, r.stream_ops = MEMFS.ops_table.chrdev.stream), r.timestamp = Date.now(), e && (e.contents[t] = r), r
        },
        getFileDataAsRegularArray: function(e) {
            if (e.contents && e.contents.subarray) {
                for (var t = [], r = 0; r < e.usedBytes; ++r) t.push(e.contents[r]);
                return t
            }
            return e.contents
        },
        getFileDataAsTypedArray: function(e) {
            return e.contents ? e.contents.subarray ? e.contents.subarray(0, e.usedBytes) : new Uint8Array(e.contents) : new Uint8Array(0)
        },
        expandFileStorage: function(e, t) {
            var r = e.contents ? e.contents.length : 0;
            t <= r || (t = Math.max(t, r * (r < 1048576 ? 2 : 1.125) >>> 0), 0 != r && (t = Math.max(t, 256)), r = e.contents, e.contents = new Uint8Array(t), 0 < e.usedBytes && e.contents.set(r.subarray(0, e.usedBytes), 0))
        },
        resizeFileStorage: function(e, t) {
            if (e.usedBytes != t)
                if (0 == t) e.contents = null, e.usedBytes = 0;
                else {
                    var r;
                    if (!e.contents || e.contents.subarray) r = e.contents, e.contents = new Uint8Array(t), r && e.contents.set(r.subarray(0, Math.min(t, e.usedBytes)));
                    else if (e.contents || (e.contents = []), e.contents.length > t) e.contents.length = t;
                    else
                        for (; e.contents.length < t;) e.contents.push(0);
                    e.usedBytes = t
                }
        },
        node_ops: {
            getattr: function(e) {
                var t = {};
                return t.dev = FS.isChrdev(e.mode) ? e.id : 1, t.ino = e.id, t.mode = e.mode, t.nlink = 1, t.uid = 0, t.gid = 0, t.rdev = e.rdev, FS.isDir(e.mode) ? t.size = 4096 : FS.isFile(e.mode) ? t.size = e.usedBytes : FS.isLink(e.mode) ? t.size = e.link.length : t.size = 0, t.atime = new Date(e.timestamp), t.mtime = new Date(e.timestamp), t.ctime = new Date(e.timestamp), t.blksize = 4096, t.blocks = Math.ceil(t.size / t.blksize), t
            },
            setattr: function(e, t) {
                void 0 !== t.mode && (e.mode = t.mode), void 0 !== t.timestamp && (e.timestamp = t.timestamp), void 0 !== t.size && MEMFS.resizeFileStorage(e, t.size)
            },
            lookup: function(e, t) {
                throw FS.genericErrors[44]
            },
            mknod: function(e, t, r, n) {
                return MEMFS.createNode(e, t, r, n)
            },
            rename: function(e, t, r) {
                if (FS.isDir(e.mode)) {
                    var n;
                    try {
                        n = FS.lookupNode(t, r)
                    } catch (e) {}
                    if (n)
                        for (var i in n.contents) throw new FS.ErrnoError(55)
                }
                delete e.parent.contents[e.name], (t.contents[e.name = r] = e).parent = t
            },
            unlink: function(e, t) {
                delete e.contents[t]
            },
            rmdir: function(e, t) {
                for (var r in FS.lookupNode(e, t).contents) throw new FS.ErrnoError(55);
                delete e.contents[t]
            },
            readdir: function(e) {
                var t, r = [".", ".."];
                for (t in e.contents) e.contents.hasOwnProperty(t) && r.push(t);
                return r
            },
            symlink: function(e, t, r) {
                e = MEMFS.createNode(e, t, 41471, 0);
                return e.link = r, e
            },
            readlink: function(e) {
                if (FS.isLink(e.mode)) return e.link;
                throw new FS.ErrnoError(28)
            }
        },
        stream_ops: {
            read: function(e, t, r, n, i) {
                var o = e.node.contents;
                if (i >= e.node.usedBytes) return 0;
                var a = Math.min(e.node.usedBytes - i, n);
                if (8 < a && o.subarray) t.set(o.subarray(i, i + a), r);
                else
                    for (var s = 0; s < a; s++) t[r + s] = o[i + s];
                return a
            },
            write: function(e, t, r, n, i, o) {
                if (t.buffer === HEAP8.buffer && (o = !1), !n) return 0;
                var a = e.node;
                if (a.timestamp = Date.now(), t.subarray && (!a.contents || a.contents.subarray)) {
                    if (o) return a.contents = t.subarray(r, r + n), a.usedBytes = n;
                    if (0 === a.usedBytes && 0 === i) return a.contents = t.slice(r, r + n), a.usedBytes = n;
                    if (i + n <= a.usedBytes) return a.contents.set(t.subarray(r, r + n), i), n
                }
                if (MEMFS.expandFileStorage(a, i + n), a.contents.subarray && t.subarray) a.contents.set(t.subarray(r, r + n), i);
                else
                    for (var s = 0; s < n; s++) a.contents[i + s] = t[r + s];
                return a.usedBytes = Math.max(a.usedBytes, i + n), n
            },
            llseek: function(e, t, r) {
                if (1 === r ? t += e.position : 2 === r && FS.isFile(e.node.mode) && (t += e.node.usedBytes), t < 0) throw new FS.ErrnoError(28);
                return t
            },
            allocate: function(e, t, r) {
                MEMFS.expandFileStorage(e.node, t + r), e.node.usedBytes = Math.max(e.node.usedBytes, t + r)
            },
            mmap: function(e, t, r, n, i, o) {
                if (assert(0 === t), !FS.isFile(e.node.mode)) throw new FS.ErrnoError(43);
                var a, s, t = e.node.contents;
                if (2 & o || t.buffer !== buffer) {
                    if ((0 < n || n + r < t.length) && (t = t.subarray ? t.subarray(n, n + r) : Array.prototype.slice.call(t, n, n + r)), s = !0, !(a = FS.mmapAlloc(r))) throw new FS.ErrnoError(48);
                    HEAP8.set(t, a)
                } else s = !1, a = t.byteOffset;
                return {
                    ptr: a,
                    allocated: s
                }
            },
            msync: function(e, t, r, n, i) {
                if (FS.isFile(e.node.mode)) return 2 & i || MEMFS.stream_ops.write(e, t, 0, n, r, !1), 0;
                throw new FS.ErrnoError(43)
            }
        }
    },
    IDBFS = {
        dbs: {},
        indexedDB: function() {
            var e;
            return "undefined" != typeof indexedDB ? indexedDB : (e = null, assert(e = "object" == typeof window ? window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB : e, "IDBFS used, but indexedDB not supported"), e)
        },
        DB_VERSION: 21,
        DB_STORE_NAME: "FILE_DATA",
        mount: function(e) {
            return MEMFS.mount.apply(null, arguments)
        },
        syncfs: function(t, n, i) {
            IDBFS.getLocalSet(t, function(e, r) {
                if (e) return i(e);
                IDBFS.getRemoteSet(t, function(e, t) {
                    if (e) return i(e);
                    IDBFS.reconcile(n ? t : r, n ? r : t, i)
                })
            })
        },
        getDB: function(e, t) {
            var r, n = IDBFS.dbs[e];
            if (n) return t(null, n);
            try {
                r = IDBFS.indexedDB().open(e, IDBFS.DB_VERSION)
            } catch (e) {
                return t(e)
            }
            if (!r) return t("Unable to connect to IndexedDB");
            r.onupgradeneeded = function(e) {
                var t = e.target.result,
                    e = e.target.transaction,
                    e = t.objectStoreNames.contains(IDBFS.DB_STORE_NAME) ? e.objectStore(IDBFS.DB_STORE_NAME) : t.createObjectStore(IDBFS.DB_STORE_NAME);
                e.indexNames.contains("timestamp") || e.createIndex("timestamp", "timestamp", {
                    unique: !1
                })
            }, r.onsuccess = function() {
                n = r.result, IDBFS.dbs[e] = n, t(null, n)
            }, r.onerror = function(e) {
                t(this.error), e.preventDefault()
            }
        },
        getLocalSet: function(e, t) {
            var r = {};

            function n(e) {
                return "." !== e && ".." !== e
            }

            function i(t) {
                return function(e) {
                    return PATH.join2(t, e)
                }
            }
            for (var o = FS.readdir(e.mountpoint).filter(n).map(i(e.mountpoint)); o.length;) {
                var a, s = o.pop();
                try {
                    a = FS.stat(s)
                } catch (e) {
                    return t(e)
                }
                FS.isDir(a.mode) && o.push.apply(o, FS.readdir(s).filter(n).map(i(s))), r[s] = {
                    timestamp: a.mtime
                }
            }
            return t(null, {
                type: "local",
                entries: r
            })
        },
        getRemoteSet: function(e, n) {
            var i = {};
            IDBFS.getDB(e.mountpoint, function(e, t) {
                if (e) return n(e);
                try {
                    var r = t.transaction([IDBFS.DB_STORE_NAME], "readonly");
                    r.onerror = function(e) {
                        n(this.error), e.preventDefault()
                    }, r.objectStore(IDBFS.DB_STORE_NAME).index("timestamp").openKeyCursor().onsuccess = function(e) {
                        e = e.target.result;
                        if (!e) return n(null, {
                            type: "remote",
                            db: t,
                            entries: i
                        });
                        i[e.primaryKey] = {
                            timestamp: e.key
                        }, e.continue()
                    }
                } catch (e) {
                    return n(e)
                }
            })
        },
        loadLocalEntry: function(e, t) {
            try {
                var r = FS.lookupPath(e).node,
                    n = FS.stat(e)
            } catch (e) {
                return t(e)
            }
            return FS.isDir(n.mode) ? t(null, {
                timestamp: n.mtime,
                mode: n.mode
            }) : FS.isFile(n.mode) ? (r.contents = MEMFS.getFileDataAsTypedArray(r), t(null, {
                timestamp: n.mtime,
                mode: n.mode,
                contents: r.contents
            })) : t(new Error("node type not supported"))
        },
        storeLocalEntry: function(e, t, r) {
            try {
                if (FS.isDir(t.mode)) FS.mkdir(e, t.mode);
                else {
                    if (!FS.isFile(t.mode)) return r(new Error("node type not supported"));
                    FS.writeFile(e, t.contents, {
                        canOwn: !0
                    })
                }
                FS.chmod(e, t.mode), FS.utime(e, t.timestamp, t.timestamp)
            } catch (e) {
                return r(e)
            }
            r(null)
        },
        removeLocalEntry: function(e, t) {
            try {
                FS.lookupPath(e);
                var r = FS.stat(e);
                FS.isDir(r.mode) ? FS.rmdir(e) : FS.isFile(r.mode) && FS.unlink(e)
            } catch (e) {
                return t(e)
            }
            t(null)
        },
        loadRemoteEntry: function(e, t, r) {
            e = e.get(t);
            e.onsuccess = function(e) {
                r(null, e.target.result)
            }, e.onerror = function(e) {
                r(this.error), e.preventDefault()
            }
        },
        storeRemoteEntry: function(e, t, r, n) {
            e = e.put(r, t);
            e.onsuccess = function() {
                n(null)
            }, e.onerror = function(e) {
                n(this.error), e.preventDefault()
            }
        },
        removeRemoteEntry: function(e, t, r) {
            e = e.delete(t);
            e.onsuccess = function() {
                r(null)
            }, e.onerror = function(e) {
                r(this.error), e.preventDefault()
            }
        },
        reconcile: function(n, i, t) {
            var o = 0,
                a = [],
                r = (Object.keys(n.entries).forEach(function(e) {
                    var t = n.entries[e],
                        r = i.entries[e];
                    (!r || t.timestamp > r.timestamp) && (a.push(e), o++)
                }), []);
            if (Object.keys(i.entries).forEach(function(e) {
                    i.entries[e];
                    n.entries[e] || (r.push(e), o++)
                }), !o) return t(null);
            var s = !1,
                e = ("remote" === n.type ? n : i).db.transaction([IDBFS.DB_STORE_NAME], "readwrite"),
                l = e.objectStore(IDBFS.DB_STORE_NAME);

            function c(e) {
                if (e && !s) return s = !0, t(e)
            }
            e.onerror = function(e) {
                c(this.error), e.preventDefault()
            }, e.oncomplete = function(e) {
                s || t(null)
            }, a.sort().forEach(function(r) {
                "local" === i.type ? IDBFS.loadRemoteEntry(l, r, function(e, t) {
                    if (e) return c(e);
                    IDBFS.storeLocalEntry(r, t, c)
                }) : IDBFS.loadLocalEntry(r, function(e, t) {
                    if (e) return c(e);
                    IDBFS.storeRemoteEntry(l, r, t, c)
                })
            }), r.sort().reverse().forEach(function(e) {
                "local" === i.type ? IDBFS.removeLocalEntry(e, c) : IDBFS.removeRemoteEntry(l, e, c)
            })
        }
    },
    FS = {
        root: null,
        mounts: [],
        devices: {},
        streams: [],
        nextInode: 1,
        nameTable: null,
        currentPath: "/",
        initialized: !1,
        ignorePermissions: !0,
        trackingDelegate: {},
        tracking: {
            openFlags: {
                READ: 1,
                WRITE: 2
            }
        },
        ErrnoError: null,
        genericErrors: {},
        filesystems: null,
        syncFSRequests: 0,
        handleFSError: function(e) {
            if (e instanceof FS.ErrnoError) return setErrNo(e.errno);
            throw e + " : " + stackTrace()
        },
        lookupPath: function(e, t) {
            if (t = t || {}, !(e = PATH_FS.resolve(FS.cwd(), e))) return {
                path: "",
                node: null
            };
            var r, n = {
                follow_mount: !0,
                recurse_count: 0
            };
            for (r in n) void 0 === t[r] && (t[r] = n[r]);
            if (8 < t.recurse_count) throw new FS.ErrnoError(32);
            for (var i = PATH.normalizeArray(e.split("/").filter(function(e) {
                    return !!e
                }), !1), o = FS.root, a = "/", s = 0; s < i.length; s++) {
                var l = s === i.length - 1;
                if (l && t.parent) break;
                if (o = FS.lookupNode(o, i[s]), a = PATH.join2(a, i[s]), !FS.isMountpoint(o) || l && !t.follow_mount || (o = o.mounted.root), !l || t.follow)
                    for (var c = 0; FS.isLink(o.mode);) {
                        var u = FS.readlink(a),
                            a = PATH_FS.resolve(PATH.dirname(a), u),
                            o = FS.lookupPath(a, {
                                recurse_count: t.recurse_count
                            }).node;
                        if (40 < c++) throw new FS.ErrnoError(32)
                    }
            }
            return {
                path: a,
                node: o
            }
        },
        getPath: function(e) {
            for (var t, r;;) {
                if (FS.isRoot(e)) return r = e.mount.mountpoint, t ? "/" !== r[r.length - 1] ? r + "/" + t : r + t : r;
                t = t ? e.name + "/" + t : e.name, e = e.parent
            }
        },
        hashName: function(e, t) {
            for (var r = 0, n = 0; n < t.length; n++) r = (r << 5) - r + t.charCodeAt(n) | 0;
            return (e + r >>> 0) % FS.nameTable.length
        },
        hashAddNode: function(e) {
            var t = FS.hashName(e.parent.id, e.name);
            e.name_next = FS.nameTable[t], FS.nameTable[t] = e
        },
        hashRemoveNode: function(e) {
            var t = FS.hashName(e.parent.id, e.name);
            if (FS.nameTable[t] === e) FS.nameTable[t] = e.name_next;
            else
                for (var r = FS.nameTable[t]; r;) {
                    if (r.name_next === e) {
                        r.name_next = e.name_next;
                        break
                    }
                    r = r.name_next
                }
        },
        lookupNode: function(e, t) {
            var r = FS.mayLookup(e);
            if (r) throw new FS.ErrnoError(r, e);
            for (var r = FS.hashName(e.id, t), n = FS.nameTable[r]; n; n = n.name_next) {
                var i = n.name;
                if (n.parent.id === e.id && i === t) return n
            }
            return FS.lookup(e, t)
        },
        createNode: function(e, t, r, n) {
            e = new FS.FSNode(e, t, r, n);
            return FS.hashAddNode(e), e
        },
        destroyNode: function(e) {
            FS.hashRemoveNode(e)
        },
        isRoot: function(e) {
            return e === e.parent
        },
        isMountpoint: function(e) {
            return !!e.mounted
        },
        isFile: function(e) {
            return 32768 == (61440 & e)
        },
        isDir: function(e) {
            return 16384 == (61440 & e)
        },
        isLink: function(e) {
            return 40960 == (61440 & e)
        },
        isChrdev: function(e) {
            return 8192 == (61440 & e)
        },
        isBlkdev: function(e) {
            return 24576 == (61440 & e)
        },
        isFIFO: function(e) {
            return 4096 == (61440 & e)
        },
        isSocket: function(e) {
            return 49152 == (49152 & e)
        },
        flagModes: {
            r: 0,
            rs: 1052672,
            "r+": 2,
            w: 577,
            wx: 705,
            xw: 705,
            "w+": 578,
            "wx+": 706,
            "xw+": 706,
            a: 1089,
            ax: 1217,
            xa: 1217,
            "a+": 1090,
            "ax+": 1218,
            "xa+": 1218
        },
        modeStringToFlags: function(e) {
            var t = FS.flagModes[e];
            if (void 0 === t) throw new Error("Unknown file open mode: " + e);
            return t
        },
        flagsToPermissionString: function(e) {
            var t = ["r", "w", "rw"][3 & e];
            return 512 & e && (t += "w"), t
        },
        nodePermissions: function(e, t) {
            return FS.ignorePermissions || (-1 === t.indexOf("r") || 292 & e.mode) && (-1 === t.indexOf("w") || 146 & e.mode) && (-1 === t.indexOf("x") || 73 & e.mode) ? 0 : 2
        },
        mayLookup: function(e) {
            var t = FS.nodePermissions(e, "x");
            return t || (e.node_ops.lookup ? 0 : 2)
        },
        mayCreate: function(e, t) {
            try {
                FS.lookupNode(e, t);
                return 20
            } catch (e) {}
            return FS.nodePermissions(e, "wx")
        },
        mayDelete: function(e, t, r) {
            var n;
            try {
                n = FS.lookupNode(e, t)
            } catch (e) {
                return e.errno
            }
            t = FS.nodePermissions(e, "wx");
            if (t) return t;
            if (r) {
                if (!FS.isDir(n.mode)) return 54;
                if (FS.isRoot(n) || FS.getPath(n) === FS.cwd()) return 10
            } else if (FS.isDir(n.mode)) return 31;
            return 0
        },
        mayOpen: function(e, t) {
            return e ? FS.isLink(e.mode) ? 32 : FS.isDir(e.mode) && ("r" !== FS.flagsToPermissionString(t) || 512 & t) ? 31 : FS.nodePermissions(e, FS.flagsToPermissionString(t)) : 44
        },
        MAX_OPEN_FDS: 4096,
        nextfd: function(e, t) {
            t = t || FS.MAX_OPEN_FDS;
            for (var r = e = e || 0; r <= t; r++)
                if (!FS.streams[r]) return r;
            throw new FS.ErrnoError(33)
        },
        getStream: function(e) {
            return FS.streams[e]
        },
        createStream: function(e, t, r) {
            FS.FSStream || (FS.FSStream = function() {}, FS.FSStream.prototype = {
                object: {
                    get: function() {
                        return this.node
                    },
                    set: function(e) {
                        this.node = e
                    }
                },
                isRead: {
                    get: function() {
                        return 1 != (2097155 & this.flags)
                    }
                },
                isWrite: {
                    get: function() {
                        return 0 != (2097155 & this.flags)
                    }
                },
                isAppend: {
                    get: function() {
                        return 1024 & this.flags
                    }
                }
            });
            var n, i = new FS.FSStream;
            for (n in e) i[n] = e[n];
            e = i;
            t = FS.nextfd(t, r);
            return e.fd = t, FS.streams[t] = e
        },
        closeStream: function(e) {
            FS.streams[e] = null
        },
        chrdev_stream_ops: {
            open: function(e) {
                var t = FS.getDevice(e.node.rdev);
                e.stream_ops = t.stream_ops, e.stream_ops.open && e.stream_ops.open(e)
            },
            llseek: function() {
                throw new FS.ErrnoError(70)
            }
        },
        major: function(e) {
            return e >> 8
        },
        minor: function(e) {
            return 255 & e
        },
        makedev: function(e, t) {
            return e << 8 | t
        },
        registerDevice: function(e, t) {
            FS.devices[e] = {
                stream_ops: t
            }
        },
        getDevice: function(e) {
            return FS.devices[e]
        },
        getMounts: function(e) {
            for (var t = [], r = [e]; r.length;) {
                var n = r.pop();
                t.push(n), r.push.apply(r, n.mounts)
            }
            return t
        },
        syncfs: function(t, r) {
            "function" == typeof t && (r = t, t = !1), FS.syncFSRequests++, 1 < FS.syncFSRequests && err("warning: " + FS.syncFSRequests + " FS.syncfs operations in flight at once, probably just doing extra work");
            var n = FS.getMounts(FS.root.mount),
                i = 0;

            function o(e) {
                return FS.syncFSRequests--, r(e)
            }

            function a(e) {
                if (e) return a.errored ? void 0 : (a.errored = !0, o(e));
                ++i >= n.length && o(null)
            }
            n.forEach(function(e) {
                if (!e.type.syncfs) return a(null);
                e.type.syncfs(e, t, a)
            })
        },
        mount: function(e, t, r) {
            var n, i = "/" === r,
                o = !r;
            if (i && FS.root) throw new FS.ErrnoError(10);
            if (!i && !o) {
                o = FS.lookupPath(r, {
                    follow_mount: !1
                });
                if (r = o.path, FS.isMountpoint(n = o.node)) throw new FS.ErrnoError(10);
                if (!FS.isDir(n.mode)) throw new FS.ErrnoError(54)
            }
            o = {
                type: e,
                opts: t,
                mountpoint: r,
                mounts: []
            }, t = e.mount(o);
            return (t.mount = o).root = t, i ? FS.root = t : n && (n.mounted = o, n.mount) && n.mount.mounts.push(o), t
        },
        unmount: function(e) {
            e = FS.lookupPath(e, {
                follow_mount: !1
            });
            if (!FS.isMountpoint(e.node)) throw new FS.ErrnoError(28);
            var e = e.node,
                t = e.mounted,
                n = FS.getMounts(t),
                t = (Object.keys(FS.nameTable).forEach(function(e) {
                    for (var t = FS.nameTable[e]; t;) {
                        var r = t.name_next; - 1 !== n.indexOf(t.mount) && FS.destroyNode(t), t = r
                    }
                }), e.mounted = null, e.mount.mounts.indexOf(t));
            e.mount.mounts.splice(t, 1)
        },
        lookup: function(e, t) {
            return e.node_ops.lookup(e, t)
        },
        mknod: function(e, t, r) {
            var n = FS.lookupPath(e, {
                    parent: !0
                }).node,
                e = PATH.basename(e);
            if (!e || "." === e || ".." === e) throw new FS.ErrnoError(28);
            var i = FS.mayCreate(n, e);
            if (i) throw new FS.ErrnoError(i);
            if (n.node_ops.mknod) return n.node_ops.mknod(n, e, t, r);
            throw new FS.ErrnoError(63)
        },
        create: function(e, t) {
            return FS.mknod(e, t = (t = void 0 !== t ? t : 438) & 4095 | 32768, 0)
        },
        mkdir: function(e, t) {
            return FS.mknod(e, t = (t = void 0 !== t ? t : 511) & 1023 | 16384, 0)
        },
        mkdirTree: function(e, t) {
            for (var r = e.split("/"), n = "", i = 0; i < r.length; ++i)
                if (r[i]) {
                    n += "/" + r[i];
                    try {
                        FS.mkdir(n, t)
                    } catch (e) {
                        if (20 != e.errno) throw e
                    }
                }
        },
        mkdev: function(e, t, r) {
            return void 0 === r && (r = t, t = 438), FS.mknod(e, t |= 8192, r)
        },
        symlink: function(e, t) {
            if (!PATH_FS.resolve(e)) throw new FS.ErrnoError(44);
            var r = FS.lookupPath(t, {
                parent: !0
            }).node;
            if (!r) throw new FS.ErrnoError(44);
            var t = PATH.basename(t),
                n = FS.mayCreate(r, t);
            if (n) throw new FS.ErrnoError(n);
            if (r.node_ops.symlink) return r.node_ops.symlink(r, t, e);
            throw new FS.ErrnoError(63)
        },
        rename: function(t, r) {
            var e = PATH.dirname(t),
                n = PATH.dirname(r),
                i = PATH.basename(t),
                o = PATH.basename(r),
                a = FS.lookupPath(t, {
                    parent: !0
                }),
                a = a.node,
                s = FS.lookupPath(r, {
                    parent: !0
                }).node;
            if (!a || !s) throw new FS.ErrnoError(44);
            if (a.mount !== s.mount) throw new FS.ErrnoError(75);
            var l, c = FS.lookupNode(a, i),
                n = PATH_FS.relative(t, n);
            if ("." !== n.charAt(0)) throw new FS.ErrnoError(28);
            if ("." !== (n = PATH_FS.relative(r, e)).charAt(0)) throw new FS.ErrnoError(55);
            try {
                l = FS.lookupNode(s, o)
            } catch (e) {}
            if (c !== l) {
                e = FS.isDir(c.mode), n = FS.mayDelete(a, i, e);
                if (n) throw new FS.ErrnoError(n);
                if (n = l ? FS.mayDelete(s, o, e) : FS.mayCreate(s, o)) throw new FS.ErrnoError(n);
                if (!a.node_ops.rename) throw new FS.ErrnoError(63);
                if (FS.isMountpoint(c) || l && FS.isMountpoint(l)) throw new FS.ErrnoError(10);
                if (s !== a && (n = FS.nodePermissions(a, "w"))) throw new FS.ErrnoError(n);
                try {
                    FS.trackingDelegate.willMovePath && FS.trackingDelegate.willMovePath(t, r)
                } catch (e) {
                    err("FS.trackingDelegate['willMovePath']('" + t + "', '" + r + "') threw an exception: " + e.message)
                }
                FS.hashRemoveNode(c);
                try {
                    a.node_ops.rename(c, s, o)
                } catch (e) {
                    throw e
                } finally {
                    FS.hashAddNode(c)
                }
                try {
                    FS.trackingDelegate.onMovePath && FS.trackingDelegate.onMovePath(t, r)
                } catch (e) {
                    err("FS.trackingDelegate['onMovePath']('" + t + "', '" + r + "') threw an exception: " + e.message)
                }
            }
        },
        rmdir: function(t) {
            var e = FS.lookupPath(t, {
                    parent: !0
                }).node,
                r = PATH.basename(t),
                n = FS.lookupNode(e, r),
                i = FS.mayDelete(e, r, !0);
            if (i) throw new FS.ErrnoError(i);
            if (!e.node_ops.rmdir) throw new FS.ErrnoError(63);
            if (FS.isMountpoint(n)) throw new FS.ErrnoError(10);
            try {
                FS.trackingDelegate.willDeletePath && FS.trackingDelegate.willDeletePath(t)
            } catch (e) {
                err("FS.trackingDelegate['willDeletePath']('" + t + "') threw an exception: " + e.message)
            }
            e.node_ops.rmdir(e, r), FS.destroyNode(n);
            try {
                FS.trackingDelegate.onDeletePath && FS.trackingDelegate.onDeletePath(t)
            } catch (e) {
                err("FS.trackingDelegate['onDeletePath']('" + t + "') threw an exception: " + e.message)
            }
        },
        readdir: function(e) {
            e = FS.lookupPath(e, {
                follow: !0
            }).node;
            if (e.node_ops.readdir) return e.node_ops.readdir(e);
            throw new FS.ErrnoError(54)
        },
        unlink: function(t) {
            var e = FS.lookupPath(t, {
                    parent: !0
                }).node,
                r = PATH.basename(t),
                n = FS.lookupNode(e, r),
                i = FS.mayDelete(e, r, !1);
            if (i) throw new FS.ErrnoError(i);
            if (!e.node_ops.unlink) throw new FS.ErrnoError(63);
            if (FS.isMountpoint(n)) throw new FS.ErrnoError(10);
            try {
                FS.trackingDelegate.willDeletePath && FS.trackingDelegate.willDeletePath(t)
            } catch (e) {
                err("FS.trackingDelegate['willDeletePath']('" + t + "') threw an exception: " + e.message)
            }
            e.node_ops.unlink(e, r), FS.destroyNode(n);
            try {
                FS.trackingDelegate.onDeletePath && FS.trackingDelegate.onDeletePath(t)
            } catch (e) {
                err("FS.trackingDelegate['onDeletePath']('" + t + "') threw an exception: " + e.message)
            }
        },
        readlink: function(e) {
            e = FS.lookupPath(e).node;
            if (!e) throw new FS.ErrnoError(44);
            if (e.node_ops.readlink) return PATH_FS.resolve(FS.getPath(e.parent), e.node_ops.readlink(e));
            throw new FS.ErrnoError(28)
        },
        stat: function(e, t) {
            e = FS.lookupPath(e, {
                follow: !t
            }).node;
            if (!e) throw new FS.ErrnoError(44);
            if (e.node_ops.getattr) return e.node_ops.getattr(e);
            throw new FS.ErrnoError(63)
        },
        lstat: function(e) {
            return FS.stat(e, !0)
        },
        chmod: function(e, t, r) {
            if (!(r = "string" == typeof e ? FS.lookupPath(e, {
                    follow: !r
                }).node : e).node_ops.setattr) throw new FS.ErrnoError(63);
            r.node_ops.setattr(r, {
                mode: 4095 & t | -4096 & r.mode,
                timestamp: Date.now()
            })
        },
        lchmod: function(e, t) {
            FS.chmod(e, t, !0)
        },
        fchmod: function(e, t) {
            e = FS.getStream(e);
            if (!e) throw new FS.ErrnoError(8);
            FS.chmod(e.node, t)
        },
        chown: function(e, t, r, n) {
            if (!(n = "string" == typeof e ? FS.lookupPath(e, {
                    follow: !n
                }).node : e).node_ops.setattr) throw new FS.ErrnoError(63);
            n.node_ops.setattr(n, {
                timestamp: Date.now()
            })
        },
        lchown: function(e, t, r) {
            FS.chown(e, t, r, !0)
        },
        fchown: function(e, t, r) {
            e = FS.getStream(e);
            if (!e) throw new FS.ErrnoError(8);
            FS.chown(e.node, t, r)
        },
        truncate: function(e, t) {
            if (t < 0) throw new FS.ErrnoError(28);
            if (!(e = "string" == typeof e ? FS.lookupPath(e, {
                    follow: !0
                }).node : e).node_ops.setattr) throw new FS.ErrnoError(63);
            if (FS.isDir(e.mode)) throw new FS.ErrnoError(31);
            if (!FS.isFile(e.mode)) throw new FS.ErrnoError(28);
            var r = FS.nodePermissions(e, "w");
            if (r) throw new FS.ErrnoError(r);
            e.node_ops.setattr(e, {
                size: t,
                timestamp: Date.now()
            })
        },
        ftruncate: function(e, t) {
            e = FS.getStream(e);
            if (!e) throw new FS.ErrnoError(8);
            if (0 == (2097155 & e.flags)) throw new FS.ErrnoError(28);
            FS.truncate(e.node, t)
        },
        utime: function(e, t, r) {
            e = FS.lookupPath(e, {
                follow: !0
            }).node;
            e.node_ops.setattr(e, {
                timestamp: Math.max(t, r)
            })
        },
        open: function(t, e, r, n, i) {
            if ("" === t) throw new FS.ErrnoError(44);
            if (r = void 0 === r ? 438 : r, r = 64 & (e = "string" == typeof e ? FS.modeStringToFlags(e) : e) ? 4095 & r | 32768 : 0, "object" == typeof t) o = t;
            else {
                t = PATH.normalize(t);
                try {
                    var o = FS.lookupPath(t, {
                        follow: !(131072 & e)
                    }).node
                } catch (e) {}
            }
            var a = !1;
            if (64 & e)
                if (o) {
                    if (128 & e) throw new FS.ErrnoError(20)
                } else o = FS.mknod(t, r, 0), a = !0;
            if (!o) throw new FS.ErrnoError(44);
            if (FS.isChrdev(o.mode) && (e &= -513), 65536 & e && !FS.isDir(o.mode)) throw new FS.ErrnoError(54);
            if (!a) {
                r = FS.mayOpen(o, e);
                if (r) throw new FS.ErrnoError(r)
            }
            512 & e && FS.truncate(o, 0), e &= -131713;
            var s, a = FS.createStream({
                node: o,
                path: FS.getPath(o),
                flags: e,
                seekable: !0,
                position: 0,
                stream_ops: o.stream_ops,
                ungotten: [],
                error: !1
            }, n, i);
            a.stream_ops.open && a.stream_ops.open(a), !Module.logReadFiles || 1 & e || (FS.readFiles || (FS.readFiles = {}), t in FS.readFiles) || (FS.readFiles[t] = 1, err("FS.trackingDelegate error on read file: " + t));
            try {
                FS.trackingDelegate.onOpenFile && (s = 0, 1 != (2097155 & e) && (s |= FS.tracking.openFlags.READ), 0 != (2097155 & e) && (s |= FS.tracking.openFlags.WRITE), FS.trackingDelegate.onOpenFile(t, s))
            } catch (e) {
                err("FS.trackingDelegate['onOpenFile']('" + t + "', flags) threw an exception: " + e.message)
            }
            return a
        },
        close: function(e) {
            if (FS.isClosed(e)) throw new FS.ErrnoError(8);
            e.getdents && (e.getdents = null);
            try {
                e.stream_ops.close && e.stream_ops.close(e)
            } catch (e) {
                throw e
            } finally {
                FS.closeStream(e.fd)
            }
            e.fd = null
        },
        isClosed: function(e) {
            return null === e.fd
        },
        llseek: function(e, t, r) {
            if (FS.isClosed(e)) throw new FS.ErrnoError(8);
            if (!e.seekable || !e.stream_ops.llseek) throw new FS.ErrnoError(70);
            if (0 != r && 1 != r && 2 != r) throw new FS.ErrnoError(28);
            return e.position = e.stream_ops.llseek(e, t, r), e.ungotten = [], e.position
        },
        read: function(e, t, r, n, i) {
            if (n < 0 || i < 0) throw new FS.ErrnoError(28);
            if (FS.isClosed(e)) throw new FS.ErrnoError(8);
            if (1 == (2097155 & e.flags)) throw new FS.ErrnoError(8);
            if (FS.isDir(e.node.mode)) throw new FS.ErrnoError(31);
            if (!e.stream_ops.read) throw new FS.ErrnoError(28);
            var o = void 0 !== i;
            if (o) {
                if (!e.seekable) throw new FS.ErrnoError(70)
            } else i = e.position;
            t = e.stream_ops.read(e, t, r, n, i);
            return o || (e.position += t), t
        },
        write: function(t, e, r, n, i, o) {
            if (n < 0 || i < 0) throw new FS.ErrnoError(28);
            if (FS.isClosed(t)) throw new FS.ErrnoError(8);
            if (0 == (2097155 & t.flags)) throw new FS.ErrnoError(8);
            if (FS.isDir(t.node.mode)) throw new FS.ErrnoError(31);
            if (!t.stream_ops.write) throw new FS.ErrnoError(28);
            t.seekable && 1024 & t.flags && FS.llseek(t, 0, 2);
            var a = void 0 !== i;
            if (a) {
                if (!t.seekable) throw new FS.ErrnoError(70)
            } else i = t.position;
            e = t.stream_ops.write(t, e, r, n, i, o);
            a || (t.position += e);
            try {
                t.path && FS.trackingDelegate.onWriteToFile && FS.trackingDelegate.onWriteToFile(t.path)
            } catch (e) {
                err("FS.trackingDelegate['onWriteToFile']('" + t.path + "') threw an exception: " + e.message)
            }
            return e
        },
        allocate: function(e, t, r) {
            if (FS.isClosed(e)) throw new FS.ErrnoError(8);
            if (t < 0 || r <= 0) throw new FS.ErrnoError(28);
            if (0 == (2097155 & e.flags)) throw new FS.ErrnoError(8);
            if (!FS.isFile(e.node.mode) && !FS.isDir(e.node.mode)) throw new FS.ErrnoError(43);
            if (!e.stream_ops.allocate) throw new FS.ErrnoError(138);
            e.stream_ops.allocate(e, t, r)
        },
        mmap: function(e, t, r, n, i, o) {
            if (0 != (2 & i) && 0 == (2 & o) && 2 != (2097155 & e.flags)) throw new FS.ErrnoError(2);
            if (1 == (2097155 & e.flags)) throw new FS.ErrnoError(2);
            if (e.stream_ops.mmap) return e.stream_ops.mmap(e, t, r, n, i, o);
            throw new FS.ErrnoError(43)
        },
        msync: function(e, t, r, n, i) {
            return e && e.stream_ops.msync ? e.stream_ops.msync(e, t, r, n, i) : 0
        },
        munmap: function(e) {
            return 0
        },
        ioctl: function(e, t, r) {
            if (e.stream_ops.ioctl) return e.stream_ops.ioctl(e, t, r);
            throw new FS.ErrnoError(59)
        },
        readFile: function(e, t) {
            if ((t = t || {}).flags = t.flags || "r", t.encoding = t.encoding || "binary", "utf8" !== t.encoding && "binary" !== t.encoding) throw new Error('Invalid encoding type "' + t.encoding + '"');
            var r, n = FS.open(e, t.flags),
                e = FS.stat(e).size,
                i = new Uint8Array(e);
            return FS.read(n, i, 0, e, 0), "utf8" === t.encoding ? r = UTF8ArrayToString(i, 0) : "binary" === t.encoding && (r = i), FS.close(n), r
        },
        writeFile: function(e, t, r) {
            (r = r || {}).flags = r.flags || "w";
            e = FS.open(e, r.flags, r.mode);
            if ("string" == typeof t) {
                var n = new Uint8Array(lengthBytesUTF8(t) + 1),
                    i = stringToUTF8Array(t, n, 0, n.length);
                FS.write(e, n, 0, i, void 0, r.canOwn)
            } else {
                if (!ArrayBuffer.isView(t)) throw new Error("Unsupported data type");
                FS.write(e, t, 0, t.byteLength, void 0, r.canOwn)
            }
            FS.close(e)
        },
        cwd: function() {
            return FS.currentPath
        },
        chdir: function(e) {
            e = FS.lookupPath(e, {
                follow: !0
            });
            if (null === e.node) throw new FS.ErrnoError(44);
            if (!FS.isDir(e.node.mode)) throw new FS.ErrnoError(54);
            var t = FS.nodePermissions(e.node, "x");
            if (t) throw new FS.ErrnoError(t);
            FS.currentPath = e.path
        },
        createDefaultDirectories: function() {
            FS.mkdir("/tmp"), FS.mkdir("/home"), FS.mkdir("/home/web_user")
        },
        createDefaultDevices: function() {
            if (FS.mkdir("/dev"), FS.registerDevice(FS.makedev(1, 3), {
                    read: function() {
                        return 0
                    },
                    write: function(e, t, r, n, i) {
                        return n
                    }
                }), FS.mkdev("/dev/null", FS.makedev(1, 3)), TTY.register(FS.makedev(5, 0), TTY.default_tty_ops), TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops), FS.mkdev("/dev/tty", FS.makedev(5, 0)), FS.mkdev("/dev/tty1", FS.makedev(6, 0)), "object" == typeof crypto && "function" == typeof crypto.getRandomValues) var e = new Uint8Array(1),
                t = function() {
                    return crypto.getRandomValues(e), e[0]
                };
            else if (ENVIRONMENT_IS_NODE) try {
                var r = require("crypto");
                t = function() {
                    return r.randomBytes(1)[0]
                }
            } catch (e) {}
            FS.createDevice("/dev", "random", t = t || function() {
                abort("random_device")
            }), FS.createDevice("/dev", "urandom", t), FS.mkdir("/dev/shm"), FS.mkdir("/dev/shm/tmp")
        },
        createSpecialDirectories: function() {
            FS.mkdir("/proc"), FS.mkdir("/proc/self"), FS.mkdir("/proc/self/fd"), FS.mount({
                mount: function() {
                    var e = FS.createNode("/proc/self", "fd", 16895, 73);
                    return e.node_ops = {
                        lookup: function(e, t) {
                            var r = FS.getStream(+t);
                            if (r) return (t = {
                                parent: null,
                                mount: {
                                    mountpoint: "fake"
                                },
                                node_ops: {
                                    readlink: function() {
                                        return r.path
                                    }
                                }
                            }).parent = t;
                            throw new FS.ErrnoError(8)
                        }
                    }, e
                }
            }, {}, "/proc/self/fd")
        },
        createStandardStreams: function() {
            Module.stdin ? FS.createDevice("/dev", "stdin", Module.stdin) : FS.symlink("/dev/tty", "/dev/stdin"), Module.stdout ? FS.createDevice("/dev", "stdout", null, Module.stdout) : FS.symlink("/dev/tty", "/dev/stdout"), Module.stderr ? FS.createDevice("/dev", "stderr", null, Module.stderr) : FS.symlink("/dev/tty1", "/dev/stderr");
            FS.open("/dev/stdin", "r"), FS.open("/dev/stdout", "w"), FS.open("/dev/stderr", "w")
        },
        ensureErrnoError: function() {
            FS.ErrnoError || (FS.ErrnoError = function(e, t) {
                this.node = t, this.setErrno = function(e) {
                    this.errno = e
                }, this.setErrno(e), this.message = "FS error"
            }, FS.ErrnoError.prototype = new Error, FS.ErrnoError.prototype.constructor = FS.ErrnoError, [44].forEach(function(e) {
                FS.genericErrors[e] = new FS.ErrnoError(e), FS.genericErrors[e].stack = "<generic error, no stack>"
            }))
        },
        staticInit: function() {
            FS.ensureErrnoError(), FS.nameTable = new Array(4096), FS.mount(MEMFS, {}, "/"), FS.createDefaultDirectories(), FS.createDefaultDevices(), FS.createSpecialDirectories(), FS.filesystems = {
                MEMFS: MEMFS,
                IDBFS: IDBFS
            }
        },
        init: function(e, t, r) {
            FS.init.initialized = !0, FS.ensureErrnoError(), Module.stdin = e || Module.stdin, Module.stdout = t || Module.stdout, Module.stderr = r || Module.stderr, FS.createStandardStreams()
        },
        quit: function() {
            FS.init.initialized = !1;
            var e = Module._fflush;
            e && e(0);
            for (var t = 0; t < FS.streams.length; t++) {
                var r = FS.streams[t];
                r && FS.close(r)
            }
        },
        getMode: function(e, t) {
            var r = 0;
            return e && (r |= 365), t && (r |= 146), r
        },
        joinPath: function(e, t) {
            e = PATH.join.apply(null, e);
            return e = t && "/" == e[0] ? e.substr(1) : e
        },
        absolutePath: function(e, t) {
            return PATH_FS.resolve(t, e)
        },
        standardizePath: function(e) {
            return PATH.normalize(e)
        },
        findObject: function(e, t) {
            e = FS.analyzePath(e, t);
            return e.exists ? e.object : (setErrNo(e.error), null)
        },
        analyzePath: function(e, t) {
            try {
                e = (n = FS.lookupPath(e, {
                    follow: !t
                })).path
            } catch (e) {}
            var r = {
                isRoot: !1,
                exists: !1,
                error: 0,
                name: null,
                path: null,
                object: null,
                parentExists: !1,
                parentPath: null,
                parentObject: null
            };
            try {
                var n = FS.lookupPath(e, {
                    parent: !0
                });
                r.parentExists = !0, r.parentPath = n.path, r.parentObject = n.node, r.name = PATH.basename(e), n = FS.lookupPath(e, {
                    follow: !t
                }), r.exists = !0, r.path = n.path, r.object = n.node, r.name = n.node.name, r.isRoot = "/" === n.path
            } catch (e) {
                r.error = e.errno
            }
            return r
        },
        createFolder: function(e, t, r, n) {
            e = PATH.join2("string" == typeof e ? e : FS.getPath(e), t), t = FS.getMode(r, n);
            return FS.mkdir(e, t)
        },
        createPath: function(e, t, r, n) {
            e = "string" == typeof e ? e : FS.getPath(e);
            for (var i = t.split("/").reverse(); i.length;) {
                var o = i.pop();
                if (o) {
                    var a = PATH.join2(e, o);
                    try {
                        FS.mkdir(a)
                    } catch (e) {}
                    e = a
                }
            }
            return a
        },
        createFile: function(e, t, r, n, i) {
            e = PATH.join2("string" == typeof e ? e : FS.getPath(e), t), t = FS.getMode(n, i);
            return FS.create(e, t)
        },
        createDataFile: function(e, t, r, n, i, o) {
            t = t ? PATH.join2("string" == typeof e ? e : FS.getPath(e), t) : e, e = FS.getMode(n, i), n = FS.create(t, e);
            if (r) {
                if ("string" == typeof r) {
                    for (var a = new Array(r.length), s = 0, l = r.length; s < l; ++s) a[s] = r.charCodeAt(s);
                    r = a
                }
                FS.chmod(n, 146 | e);
                i = FS.open(n, "w");
                FS.write(i, r, 0, r.length, 0, o), FS.close(i), FS.chmod(n, e)
            }
            return n
        },
        createDevice: function(e, t, l, a) {
            var e = PATH.join2("string" == typeof e ? e : FS.getPath(e), t),
                t = FS.getMode(!!l, !!a),
                r = (FS.createDevice.major || (FS.createDevice.major = 64), FS.makedev(FS.createDevice.major++, 0));
            return FS.registerDevice(r, {
                open: function(e) {
                    e.seekable = !1
                },
                close: function(e) {
                    a && a.buffer && a.buffer.length && a(10)
                },
                read: function(e, t, r, n, i) {
                    for (var o, a = 0, s = 0; s < n; s++) {
                        try {
                            o = l()
                        } catch (e) {
                            throw new FS.ErrnoError(29)
                        }
                        if (void 0 === o && 0 === a) throw new FS.ErrnoError(6);
                        if (null == o) break;
                        a++, t[r + s] = o
                    }
                    return a && (e.node.timestamp = Date.now()), a
                },
                write: function(e, t, r, n, i) {
                    for (var o = 0; o < n; o++) try {
                        a(t[r + o])
                    } catch (e) {
                        throw new FS.ErrnoError(29)
                    }
                    return n && (e.node.timestamp = Date.now()), o
                }
            }), FS.mkdev(e, t, r)
        },
        createLink: function(e, t, r, n, i) {
            e = PATH.join2("string" == typeof e ? e : FS.getPath(e), t);
            return FS.symlink(r, e)
        },
        forceLoadFile: function(e) {
            if (e.isDevice || e.isFolder || e.link || e.contents) return !0;
            var t = !0;
            if ("undefined" != typeof XMLHttpRequest) throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
            if (!read_) throw new Error("Cannot load without read() or XMLHttpRequest.");
            try {
                e.contents = intArrayFromString(read_(e.url), !0), e.usedBytes = e.contents.length
            } catch (e) {
                t = !1
            }
            return t || setErrNo(29), t
        },
        createLazyFile: function(e, t, a, r, n) {
            function i() {
                this.lengthKnown = !1, this.chunks = []
            }
            if (i.prototype.get = function(e) {
                    var t;
                    if (!(e > this.length - 1 || e < 0)) return t = e % this.chunkSize, e = e / this.chunkSize | 0, this.getter(e)[t]
                }, i.prototype.setDataGetter = function(e) {
                    this.getter = e
                }, i.prototype.cacheLength = function() {
                    var e = new XMLHttpRequest;
                    if (e.open("HEAD", a, !1), e.send(null), !(200 <= e.status && e.status < 300 || 304 === e.status)) throw new Error("Couldn't load " + a + ". Status: " + e.status);
                    var t, n = Number(e.getResponseHeader("Content-length")),
                        r = (t = e.getResponseHeader("Accept-Ranges")) && "bytes" === t,
                        e = (t = e.getResponseHeader("Content-Encoding")) && "gzip" === t,
                        i = 1048576,
                        o = (r || (i = n), this);
                    o.setDataGetter(function(e) {
                        var t = e * i,
                            r = (e + 1) * i - 1,
                            r = Math.min(r, n - 1);
                        if (void 0 === o.chunks[e] && (o.chunks[e] = ((e, t) => {
                                if (t < e) throw new Error("invalid range (" + e + ", " + t + ") or no bytes requested!");
                                if (n - 1 < t) throw new Error("only " + n + " bytes available! programmer error!");
                                var r = new XMLHttpRequest;
                                if (r.open("GET", a, !1), n !== i && r.setRequestHeader("Range", "bytes=" + e + "-" + t), "undefined" != typeof Uint8Array && (r.responseType = "arraybuffer"), r.overrideMimeType && r.overrideMimeType("text/plain; charset=x-user-defined"), r.send(null), 200 <= r.status && r.status < 300 || 304 === r.status) return void 0 !== r.response ? new Uint8Array(r.response || []) : intArrayFromString(r.responseText || "", !0);
                                throw new Error("Couldn't load " + a + ". Status: " + r.status)
                            })(t, r)), void 0 === o.chunks[e]) throw new Error("doXHR failed!");
                        return o.chunks[e]
                    }), !e && n || (i = n = 1, n = this.getter(0).length, i = n, out("LazyFiles on gzip forces download of the whole file when length is accessed")), this._length = n, this._chunkSize = i, this.lengthKnown = !0
                }, "undefined" != typeof XMLHttpRequest) {
                if (!ENVIRONMENT_IS_WORKER) throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
                var o = new i,
                    o = (Object.defineProperties(o, {
                        length: {
                            get: function() {
                                return this.lengthKnown || this.cacheLength(), this._length
                            }
                        },
                        chunkSize: {
                            get: function() {
                                return this.lengthKnown || this.cacheLength(), this._chunkSize
                            }
                        }
                    }), {
                        isDevice: !1,
                        contents: o
                    })
            } else o = {
                isDevice: !1,
                url: a
            };
            var l = FS.createFile(e, t, o, r, n),
                s = (o.contents ? l.contents = o.contents : o.url && (l.contents = null, l.url = o.url), Object.defineProperties(l, {
                    usedBytes: {
                        get: function() {
                            return this.contents.length
                        }
                    }
                }), {});
            return Object.keys(l.stream_ops).forEach(function(e) {
                var t = l.stream_ops[e];
                s[e] = function() {
                    if (FS.forceLoadFile(l)) return t.apply(null, arguments);
                    throw new FS.ErrnoError(29)
                }
            }), s.read = function(e, t, r, n, i) {
                if (!FS.forceLoadFile(l)) throw new FS.ErrnoError(29);
                var o = e.node.contents;
                if (i >= o.length) return 0;
                var a = Math.min(o.length - i, n);
                if (o.slice)
                    for (var s = 0; s < a; s++) t[r + s] = o[i + s];
                else
                    for (s = 0; s < a; s++) t[r + s] = o.get(i + s);
                return a
            }, l.stream_ops = s, l
        },
        createPreloadedFile: function(i, o, e, a, s, l, c, u, d, _) {
            Browser.init();
            var f = o ? PATH_FS.resolve(PATH.join2(i, o)) : i,
                m = getUniqueRunDependency("cp " + f);

            function t(t) {
                function r(e) {
                    _ && _(), u || FS.createDataFile(i, o, e, a, s, d), l && l(), removeRunDependency(m)
                }
                var n = !1;
                Module.preloadPlugins.forEach(function(e) {
                    n || e.canHandle(f) && (e.handle(t, f, r, function() {
                        c && c(), removeRunDependency(m)
                    }), n = !0)
                }), n || r(t)
            }
            addRunDependency(m), "string" == typeof e ? Browser.asyncLoad(e, function(e) {
                t(e)
            }, c) : t(e)
        },
        indexedDB: function() {
            return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB
        },
        DB_NAME: function() {
            return "EM_FS_" + window.location.pathname
        },
        DB_VERSION: 20,
        DB_STORE_NAME: "FILE_DATA",
        saveFilesToDB: function(a, s, l) {
            s = s || function() {}, l = l || function() {};
            var e = FS.indexedDB();
            try {
                var c = e.open(FS.DB_NAME(), FS.DB_VERSION)
            } catch (e) {
                return l(e)
            }
            c.onupgradeneeded = function() {
                out("creating db"), c.result.createObjectStore(FS.DB_STORE_NAME)
            }, c.onsuccess = function() {
                var e = c.result.transaction([FS.DB_STORE_NAME], "readwrite"),
                    t = e.objectStore(FS.DB_STORE_NAME),
                    r = 0,
                    n = 0,
                    i = a.length;

                function o() {
                    (0 == n ? s : l)()
                }
                a.forEach(function(e) {
                    e = t.put(FS.analyzePath(e).object.contents, e);
                    e.onsuccess = function() {
                        ++r + n == i && o()
                    }, e.onerror = function() {
                        r + ++n == i && o()
                    }
                }), e.onerror = l
            }, c.onerror = l
        },
        loadFilesFromDB: function(s, l, c) {
            l = l || function() {}, c = c || function() {};
            var e = FS.indexedDB();
            try {
                var u = e.open(FS.DB_NAME(), FS.DB_VERSION)
            } catch (e) {
                return c(e)
            }
            u.onupgradeneeded = c, u.onsuccess = function() {
                var e = u.result;
                try {
                    var t = e.transaction([FS.DB_STORE_NAME], "readonly")
                } catch (e) {
                    return void c(e)
                }
                var r = t.objectStore(FS.DB_STORE_NAME),
                    n = 0,
                    i = 0,
                    o = s.length;

                function a() {
                    (0 == i ? l : c)()
                }
                s.forEach(function(e) {
                    var t = r.get(e);
                    t.onsuccess = function() {
                        FS.analyzePath(e).exists && FS.unlink(e), FS.createDataFile(PATH.dirname(e), PATH.basename(e), t.result, !0, !0, !0), ++n + i == o && a()
                    }, t.onerror = function() {
                        n + ++i == o && a()
                    }
                }), t.onerror = c
            }, u.onerror = c
        },
        mmapAlloc: function(e) {
            for (var t = alignMemory(e, 16384), r = _malloc(t); e < t;) HEAP8[r + e++] = 0;
            return r
        }
    },
    SYSCALLS = {
        mappings: {},
        DEFAULT_POLLMASK: 5,
        umask: 511,
        calculateAt: function(e, t) {
            if ("/" !== t[0]) {
                var r;
                if (-100 === e) r = FS.cwd();
                else {
                    e = FS.getStream(e);
                    if (!e) throw new FS.ErrnoError(8);
                    r = e.path
                }
                t = PATH.join2(r, t)
            }
            return t
        },
        doStat: function(e, t, r) {
            try {
                var n = e(t)
            } catch (e) {
                if (e && e.node && PATH.normalize(t) !== PATH.normalize(FS.getPath(e.node))) return -54;
                throw e
            }
            return HEAP32[r >> 2] = n.dev, HEAP32[r + 4 >> 2] = 0, HEAP32[r + 8 >> 2] = n.ino, HEAP32[r + 12 >> 2] = n.mode, HEAP32[r + 16 >> 2] = n.nlink, HEAP32[r + 20 >> 2] = n.uid, HEAP32[r + 24 >> 2] = n.gid, HEAP32[r + 28 >> 2] = n.rdev, HEAP32[r + 32 >> 2] = 0, tempI64 = [n.size >>> 0, (tempDouble = n.size, 1 <= +Math_abs(tempDouble) ? 0 < tempDouble ? (0 | Math_min(+Math_floor(tempDouble / 4294967296), 4294967295)) >>> 0 : ~~+Math_ceil((tempDouble - (~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[r + 40 >> 2] = tempI64[0], HEAP32[r + 44 >> 2] = tempI64[1], HEAP32[r + 48 >> 2] = 4096, HEAP32[r + 52 >> 2] = n.blocks, HEAP32[r + 56 >> 2] = n.atime.getTime() / 1e3 | 0, HEAP32[r + 60 >> 2] = 0, HEAP32[r + 64 >> 2] = n.mtime.getTime() / 1e3 | 0, HEAP32[r + 68 >> 2] = 0, HEAP32[r + 72 >> 2] = n.ctime.getTime() / 1e3 | 0, HEAP32[r + 76 >> 2] = 0, tempI64 = [n.ino >>> 0, (tempDouble = n.ino, 1 <= +Math_abs(tempDouble) ? 0 < tempDouble ? (0 | Math_min(+Math_floor(tempDouble / 4294967296), 4294967295)) >>> 0 : ~~+Math_ceil((tempDouble - (~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[r + 80 >> 2] = tempI64[0], HEAP32[r + 84 >> 2] = tempI64[1], 0
        },
        doMsync: function(e, t, r, n, i) {
            e = HEAPU8.slice(e, e + r);
            FS.msync(t, e, i, r, n)
        },
        doMkdir: function(e, t) {
            return "/" === (e = PATH.normalize(e))[e.length - 1] && (e = e.substr(0, e.length - 1)), FS.mkdir(e, t, 0), 0
        },
        doMknod: function(e, t, r) {
            switch (61440 & t) {
                case 32768:
                case 8192:
                case 24576:
                case 4096:
                case 49152:
                    break;
                default:
                    return -28
            }
            return FS.mknod(e, t, r), 0
        },
        doReadlink: function(e, t, r) {
            var n, i;
            return r <= 0 ? -28 : (e = FS.readlink(e), n = Math.min(r, lengthBytesUTF8(e)), i = HEAP8[t + n], stringToUTF8(e, t, r + 1), HEAP8[t + n] = i, n)
        },
        doAccess: function(e, t) {
            var r;
            return -8 & t ? -28 : (e = FS.lookupPath(e, {
                follow: !0
            }).node) ? (r = "", 4 & t && (r += "r"), 2 & t && (r += "w"), 1 & t && (r += "x"), r && FS.nodePermissions(e, r) ? -2 : 0) : -44
        },
        doDup: function(e, t, r) {
            var n = FS.getStream(r);
            return n && FS.close(n), FS.open(e, t, 0, r, r).fd
        },
        doReadv: function(e, t, r, n) {
            for (var i = 0, o = 0; o < r; o++) {
                var a = HEAP32[t + 8 * o >> 2],
                    s = HEAP32[t + (8 * o + 4) >> 2],
                    a = FS.read(e, HEAP8, a, s, n);
                if (a < 0) return -1;
                if (i += a, a < s) break
            }
            return i
        },
        doWritev: function(e, t, r, n) {
            for (var i = 0, o = 0; o < r; o++) {
                var a = HEAP32[t + 8 * o >> 2],
                    s = HEAP32[t + (8 * o + 4) >> 2],
                    a = FS.write(e, HEAP8, a, s, n);
                if (a < 0) return -1;
                i += a
            }
            return i
        },
        varargs: void 0,
        get: function() {
            return SYSCALLS.varargs += 4, HEAP32[SYSCALLS.varargs - 4 >> 2]
        },
        getStr: function(e) {
            return UTF8ToString(e)
        },
        getStreamFromFD: function(e) {
            e = FS.getStream(e);
            if (e) return e;
            throw new FS.ErrnoError(8)
        },
        get64: function(e, t) {
            return e
        }
    };

function ___sys_access(e, t) {
    try {
        return e = SYSCALLS.getStr(e), SYSCALLS.doAccess(e, t)
    } catch (e) {
        return void 0 !== FS && e instanceof FS.ErrnoError || abort(e), -e.errno
    }
}

function ___sys_fcntl64(e, t, r) {
    SYSCALLS.varargs = r;
    try {
        var n = SYSCALLS.getStreamFromFD(e);
        switch (t) {
            case 0:
                return (i = SYSCALLS.get()) < 0 ? -28 : FS.open(n.path, n.flags, 0, i).fd;
            case 1:
            case 2:
                return 0;
            case 3:
                return n.flags;
            case 4:
                var i = SYSCALLS.get();
                return n.flags |= i, 0;
            case 12:
                i = SYSCALLS.get();
                return HEAP16[i + 0 >> 1] = 2, 0;
            case 13:
            case 14:
                return 0;
            case 16:
            case 8:
                return -28;
            case 9:
                return setErrNo(28), -1;
            default:
                return -28
        }
    } catch (e) {
        return void 0 !== FS && e instanceof FS.ErrnoError || abort(e), -e.errno
    }
}

function ___sys_fstat64(e, t) {
    try {
        var r = SYSCALLS.getStreamFromFD(e);
        return SYSCALLS.doStat(FS.stat, r.path, t)
    } catch (e) {
        return void 0 !== FS && e instanceof FS.ErrnoError || abort(e), -e.errno
    }
}

function ___sys_ftruncate64(e, t, r, n) {
    try {
        var i = SYSCALLS.get64(r, n);
        return FS.ftruncate(e, i), 0
    } catch (e) {
        return void 0 !== FS && e instanceof FS.ErrnoError || abort(e), -e.errno
    }
}

function ___sys_getdents64(e, t, r) {
    try {
        for (var n = SYSCALLS.getStreamFromFD(e), i = (n.getdents || (n.getdents = FS.readdir(n.path)), 0), o = FS.llseek(n, 0, 1), a = Math.floor(o / 280); a < n.getdents.length && i + 280 <= r;) {
            var s, l, c, u = n.getdents[a];
            c = "." === u[0] ? (l = 1, 4) : (l = (s = FS.lookupNode(n.node, u)).id, FS.isChrdev(s.mode) ? 2 : FS.isDir(s.mode) ? 4 : FS.isLink(s.mode) ? 10 : 8), tempI64 = [l >>> 0, 1 <= +Math_abs(tempDouble = l) ? 0 < tempDouble ? (0 | Math_min(+Math_floor(tempDouble / 4294967296), 4294967295)) >>> 0 : ~~+Math_ceil((tempDouble - (~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0], HEAP32[t + i >> 2] = tempI64[0], HEAP32[t + i + 4 >> 2] = tempI64[1], tempI64 = [280 * (a + 1) >>> 0, 1 <= +Math_abs(tempDouble = 280 * (a + 1)) ? 0 < tempDouble ? (0 | Math_min(+Math_floor(tempDouble / 4294967296), 4294967295)) >>> 0 : ~~+Math_ceil((tempDouble - (~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0], HEAP32[t + i + 8 >> 2] = tempI64[0], HEAP32[t + i + 12 >> 2] = tempI64[1], HEAP16[t + i + 16 >> 1] = 280, HEAP8[t + i + 18 >> 0] = c, stringToUTF8(u, t + i + 19, 256), i += 280, a += 1
        }
        return FS.llseek(n, 280 * a, 0), i
    } catch (e) {
        return void 0 !== FS && e instanceof FS.ErrnoError || abort(e), -e.errno
    }
}

function ___sys_getpid() {
    return 42
}

function ___sys_ioctl(e, t, r) {
    SYSCALLS.varargs = r;
    try {
        var n = SYSCALLS.getStreamFromFD(e);
        switch (t) {
            case 21509:
            case 21505:
                return n.tty ? 0 : -59;
            case 21510:
            case 21511:
            case 21512:
            case 21506:
            case 21507:
            case 21508:
                return n.tty ? 0 : -59;
            case 21519:
                return n.tty ? (i = SYSCALLS.get(), HEAP32[i >> 2] = 0) : -59;
            case 21520:
                return n.tty ? -28 : -59;
            case 21531:
                var i = SYSCALLS.get();
                return FS.ioctl(n, t, i);
            case 21523:
            case 21524:
                return n.tty ? 0 : -59;
            default:
                abort("bad ioctl syscall " + t)
        }
    } catch (e) {
        return void 0 !== FS && e instanceof FS.ErrnoError || abort(e), -e.errno
    }
}

function ___sys_lstat64(e, t) {
    try {
        return e = SYSCALLS.getStr(e), SYSCALLS.doStat(FS.lstat, e, t)
    } catch (e) {
        return void 0 !== FS && e instanceof FS.ErrnoError || abort(e), -e.errno
    }
}

function syscallMmap2(e, t, r, n, i, o) {
    o <<= 12;
    var a = !1;
    if (0 != (16 & n) && e % 16384 != 0) return -28;
    if (0 != (32 & n)) {
        if (!(l = _memalign(16384, t))) return -48;
        _memset(l, 0, t), a = !0
    } else {
        var s = FS.getStream(i);
        if (!s) return -8;
        var s = FS.mmap(s, e, t, o, r, n),
            l = s.ptr,
            a = s.allocated
    }
    return SYSCALLS.mappings[l] = {
        malloc: l,
        len: t,
        allocated: a,
        fd: i,
        prot: r,
        flags: n,
        offset: o
    }, l
}

function ___sys_mmap2(e, t, r, n, i, o) {
    try {
        return syscallMmap2(e, t, r, n, i, o)
    } catch (e) {
        return void 0 !== FS && e instanceof FS.ErrnoError || abort(e), -e.errno
    }
}

function syscallMunmap(e, t) {
    var r, n;
    return -1 == (0 | e) || 0 === t ? -28 : ((r = SYSCALLS.mappings[e]) && t === r.len && (n = FS.getStream(r.fd), 2 & r.prot && SYSCALLS.doMsync(e, n, t, r.flags, r.offset), FS.munmap(n), SYSCALLS.mappings[e] = null, r.allocated) && _free(r.malloc), 0)
}

function ___sys_munmap(e, t) {
    try {
        return syscallMunmap(e, t)
    } catch (e) {
        return void 0 !== FS && e instanceof FS.ErrnoError || abort(e), -e.errno
    }
}

function ___sys_open(e, t, r) {
    SYSCALLS.varargs = r;
    try {
        var n = SYSCALLS.getStr(e),
            i = SYSCALLS.get();
        return FS.open(n, t, i).fd
    } catch (e) {
        return void 0 !== FS && e instanceof FS.ErrnoError || abort(e), -e.errno
    }
}

function ___sys_read(e, t, r) {
    try {
        var n = SYSCALLS.getStreamFromFD(e);
        return FS.read(n, HEAP8, t, r)
    } catch (e) {
        return void 0 !== FS && e instanceof FS.ErrnoError || abort(e), -e.errno
    }
}

function ___sys_rmdir(e) {
    try {
        return e = SYSCALLS.getStr(e), FS.rmdir(e), 0
    } catch (e) {
        return void 0 !== FS && e instanceof FS.ErrnoError || abort(e), -e.errno
    }
}

function ___sys_stat64(e, t) {
    try {
        return e = SYSCALLS.getStr(e), SYSCALLS.doStat(FS.stat, e, t)
    } catch (e) {
        return void 0 !== FS && e instanceof FS.ErrnoError || abort(e), -e.errno
    }
}

function ___sys_unlink(e) {
    try {
        return e = SYSCALLS.getStr(e), FS.unlink(e), 0
    } catch (e) {
        return void 0 !== FS && e instanceof FS.ErrnoError || abort(e), -e.errno
    }
}

function _abort() {
    abort()
}
var _emscripten_get_now = ENVIRONMENT_IS_NODE ? function() {
        var e = process.hrtime();
        return 1e3 * e[0] + e[1] / 1e6
    } : "undefined" != typeof dateNow ? dateNow : function() {
        return performance.now()
    },
    _emscripten_get_now_is_monotonic = !0;

function _clock_gettime(e, t) {
    var r;
    if (0 === e) r = Date.now();
    else {
        if (1 !== e && 4 !== e || !_emscripten_get_now_is_monotonic) return setErrNo(28), -1;
        r = _emscripten_get_now()
    }
    return HEAP32[t >> 2] = r / 1e3 | 0, HEAP32[t + 4 >> 2] = r % 1e3 * 1e3 * 1e3 | 0, 0
}

function _dlclose(e) {
    abort("To use dlopen, you need to use Emscripten's linking support, see https://github.com/emscripten-core/emscripten/wiki/Linking")
}

function _emscripten_set_main_loop_timing(e, t) {
    var r, n;
    return Browser.mainLoop.timingMode = e, Browser.mainLoop.timingValue = t, Browser.mainLoop.func ? (0 == e ? (Browser.mainLoop.scheduler = function() {
        var e = 0 | Math.max(0, Browser.mainLoop.tickStartTime + t - _emscripten_get_now());
        setTimeout(Browser.mainLoop.runner, e)
    }, Browser.mainLoop.method = "timeout") : 1 == e ? (Browser.mainLoop.scheduler = function() {
        Browser.requestAnimationFrame(Browser.mainLoop.runner)
    }, Browser.mainLoop.method = "rAF") : 2 == e && ("undefined" == typeof setImmediate && (r = [], n = "setimmediate", addEventListener("message", function(e) {
        e.data !== n && e.data.target !== n || (e.stopPropagation(), r.shift()())
    }, !0), setImmediate = function(e) {
        r.push(e), ENVIRONMENT_IS_WORKER ? (void 0 === Module.setImmediates && (Module.setImmediates = []), Module.setImmediates.push(e), postMessage({
            target: n
        })) : postMessage(n, "*")
    }), Browser.mainLoop.scheduler = function() {
        setImmediate(Browser.mainLoop.runner)
    }, Browser.mainLoop.method = "immediate"), 0) : 1
}

function _emscripten_set_main_loop(e, t, r, n, i) {
    noExitRuntime = !0, assert(!Browser.mainLoop.func, "emscripten_set_main_loop: there can only be one main loop function at once: call emscripten_cancel_main_loop to cancel the previous one before setting a new one with different parameters."), Browser.mainLoop.func = e, Browser.mainLoop.arg = n, o = void 0 !== n ? function() {
        Module.dynCall_vi(e, n)
    } : function() {
        Module.dynCall_v(e)
    };
    var o, a = Browser.mainLoop.currentlyRunningMainloop;
    if (Browser.mainLoop.runner = function() {
            var e, t, r, n;
            if (!ABORT) return 0 < Browser.mainLoop.queue.length ? (e = Date.now(), (t = Browser.mainLoop.queue.shift()).func(t.arg), Browser.mainLoop.remainingBlockers && (n = (r = Browser.mainLoop.remainingBlockers) % 1 == 0 ? r - 1 : Math.floor(r), t.counted ? Browser.mainLoop.remainingBlockers = n : Browser.mainLoop.remainingBlockers = (8 * r + (n += .5)) / 9), console.log('main loop blocker "' + t.name + '" took ' + (Date.now() - e) + " ms"), Browser.mainLoop.updateStatus(), a < Browser.mainLoop.currentlyRunningMainloop ? void 0 : void setTimeout(Browser.mainLoop.runner, 0)) : void(a < Browser.mainLoop.currentlyRunningMainloop || (Browser.mainLoop.currentFrameNumber = Browser.mainLoop.currentFrameNumber + 1 | 0, 1 == Browser.mainLoop.timingMode && 1 < Browser.mainLoop.timingValue && Browser.mainLoop.currentFrameNumber % Browser.mainLoop.timingValue != 0 ? Browser.mainLoop.scheduler() : (0 == Browser.mainLoop.timingMode && (Browser.mainLoop.tickStartTime = _emscripten_get_now()), Browser.mainLoop.runIter(o), a < Browser.mainLoop.currentlyRunningMainloop || ("object" == typeof SDL && SDL.audio && SDL.audio.queueNewAudioData && SDL.audio.queueNewAudioData(), Browser.mainLoop.scheduler()))))
        }, i || (t && 0 < t ? _emscripten_set_main_loop_timing(0, 1e3 / t) : _emscripten_set_main_loop_timing(1, 1), Browser.mainLoop.scheduler()), r) throw "unwind"
}
var Browser = {
        mainLoop: {
            scheduler: null,
            method: "",
            currentlyRunningMainloop: 0,
            func: null,
            arg: 0,
            timingMode: 0,
            timingValue: 0,
            currentFrameNumber: 0,
            queue: [],
            pause: function() {
                Browser.mainLoop.scheduler = null, Browser.mainLoop.currentlyRunningMainloop++
            },
            resume: function() {
                Browser.mainLoop.currentlyRunningMainloop++;
                var e = Browser.mainLoop.timingMode,
                    t = Browser.mainLoop.timingValue,
                    r = Browser.mainLoop.func;
                Browser.mainLoop.func = null, _emscripten_set_main_loop(r, 0, !1, Browser.mainLoop.arg, !0), _emscripten_set_main_loop_timing(e, t), Browser.mainLoop.scheduler()
            },
            updateStatus: function() {
                var e, t, r;
                Module.setStatus && (e = Module.statusMessage || "Please wait...", t = Browser.mainLoop.remainingBlockers, r = Browser.mainLoop.expectedBlockers, t ? t < r ? Module.setStatus(e + " (" + (r - t) + "/" + r + ")") : Module.setStatus(e) : Module.setStatus(""))
            },
            runIter: function(e) {
                if (!ABORT) {
                    if (Module.preMainLoop)
                        if (!1 === Module.preMainLoop()) return;
                    try {
                        e()
                    } catch (e) {
                        if (e instanceof ExitStatus) return;
                        if ("unwind" == e) return;
                        throw e && "object" == typeof e && e.stack && err("exception thrown: " + [e, e.stack]), e
                    }
                    Module.postMainLoop && Module.postMainLoop()
                }
            }
        },
        isFullscreen: !1,
        pointerLock: !1,
        moduleContextCreatedCallbacks: [],
        workers: [],
        init: function() {
            if (Module.preloadPlugins || (Module.preloadPlugins = []), !Browser.initted) {
                Browser.initted = !0;
                try {
                    new Blob, Browser.hasBlobConstructor = !0
                } catch (e) {
                    Browser.hasBlobConstructor = !1, console.log("warning: no blob constructor, cannot create blobs with mimetypes")
                }
                Browser.BlobBuilder = "undefined" != typeof MozBlobBuilder ? MozBlobBuilder : "undefined" != typeof WebKitBlobBuilder ? WebKitBlobBuilder : Browser.hasBlobConstructor ? null : console.log("warning: no BlobBuilder"), Browser.URLObject = "undefined" != typeof window ? window.URL || window.webkitURL : void 0, Module.noImageDecoding || void 0 !== Browser.URLObject || (console.log("warning: Browser does not support creating object URLs. Built-in browser image decoding will not be available."), Module.noImageDecoding = !0);
                var e = {
                        canHandle: function(e) {
                            return !Module.noImageDecoding && /\.(jpg|jpeg|png|bmp)$/i.test(e)
                        },
                        handle: function(t, r, n, i) {
                            var e, o = null;
                            if (Browser.hasBlobConstructor) try {
                                (o = new Blob([t], {
                                    type: Browser.getMimetype(r)
                                })).size !== t.length && (o = new Blob([new Uint8Array(t).buffer], {
                                    type: Browser.getMimetype(r)
                                }))
                            } catch (e) {
                                warnOnce("Blob constructor present but fails: " + e + "; falling back to blob builder")
                            }
                            o || ((e = new Browser.BlobBuilder).append(new Uint8Array(t).buffer), o = e.getBlob());
                            var a = Browser.URLObject.createObjectURL(o),
                                s = new Image;
                            s.onload = function() {
                                assert(s.complete, "Image " + r + " could not be decoded");
                                var e = document.createElement("canvas");
                                e.width = s.width, e.height = s.height, e.getContext("2d").drawImage(s, 0, 0), Module.preloadedImages[r] = e, Browser.URLObject.revokeObjectURL(a), n && n(t)
                            }, s.onerror = function(e) {
                                console.log("Image " + a + " could not be decoded"), i && i()
                            }, s.src = a
                        }
                    },
                    e = (Module.preloadPlugins.push(e), {
                        canHandle: function(e) {
                            return !Module.noAudioDecoding && e.substr(-4) in {
                                ".ogg": 1,
                                ".wav": 1,
                                ".mp3": 1
                            }
                        }
                    }),
                    e = (e.handle = function(t, r, n, e) {
                        var i = !1;

                        function o(e) {
                            i || (i = !0, Module.preloadedAudios[r] = e, n && n(t))
                        }

                        function a() {
                            i || (i = !0, Module.preloadedAudios[r] = new Audio, e && e())
                        }
                        if (!Browser.hasBlobConstructor) return a();
                        try {
                            var s = new Blob([t], {
                                type: Browser.getMimetype(r)
                            })
                        } catch (e) {
                            return a()
                        }
                        var s = Browser.URLObject.createObjectURL(s),
                            l = new Audio;
                        l.addEventListener("canplaythrough", function() {
                            o(l)
                        }, !1), l.onerror = function(e) {
                            i || (console.log("warning: browser could not fully decode audio " + r + ", trying slower base64 approach"), l.src = "data:audio/x-" + r.substr(-3) + ";base64," + (e => {
                                for (var t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", r = "", n = 0, i = 0, o = 0; o < e.length; o++)
                                    for (n = n << 8 | e[o], i += 8; 6 <= i;) {
                                        var a = n >> i - 6 & 63;
                                        i -= 6, r += t[a]
                                    }
                                return 2 == i ? r = r + t[(3 & n) << 4] + "==" : 4 == i && (r = r + t[(15 & n) << 2] + "="), r
                            })(t), o(l))
                        }, l.src = s, Browser.safeSetTimeout(function() {
                            o(l)
                        }, 1e4)
                    }, Module.preloadPlugins.push(e), Module.canvas);
                e && (e.requestPointerLock = e.requestPointerLock || e.mozRequestPointerLock || e.webkitRequestPointerLock || e.msRequestPointerLock || function() {}, e.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock || document.webkitExitPointerLock || document.msExitPointerLock || function() {}, e.exitPointerLock = e.exitPointerLock.bind(document), document.addEventListener("pointerlockchange", t, !1), document.addEventListener("mozpointerlockchange", t, !1), document.addEventListener("webkitpointerlockchange", t, !1), document.addEventListener("mspointerlockchange", t, !1), Module.elementPointerLock) && e.addEventListener("click", function(e) {
                    !Browser.pointerLock && Module.canvas.requestPointerLock && (Module.canvas.requestPointerLock(), e.preventDefault())
                }, !1)
            }

            function t() {
                Browser.pointerLock = document.pointerLockElement === Module.canvas || document.mozPointerLockElement === Module.canvas || document.webkitPointerLockElement === Module.canvas || document.msPointerLockElement === Module.canvas
            }
        },
        createContext: function(e, t, r, n) {
            if (t && Module.ctx && e == Module.canvas) return Module.ctx;
            var i, o;
            if (t) {
                var a = {
                    antialias: !1,
                    alpha: !1,
                    majorVersion: 1
                };
                if (n)
                    for (var s in n) a[s] = n[s];
                void 0 !== GL && (o = GL.createContext(e, a)) && (i = GL.getContext(o).GLctx)
            } else i = e.getContext("2d");
            return i ? (r && (t || assert(void 0 === GLctx, "cannot set in module if GLctx is used, but we are a non-GL context that would replace it"), Module.ctx = i, t && GL.makeContextCurrent(o), Module.useWebGL = t, Browser.moduleContextCreatedCallbacks.forEach(function(e) {
                e()
            }), Browser.init()), i) : null
        },
        destroyContext: function(e, t, r) {},
        fullscreenHandlersInstalled: !1,
        lockPointer: void 0,
        resizeCanvas: void 0,
        requestFullscreen: function(e, t) {
            Browser.lockPointer = e, Browser.resizeCanvas = t, void 0 === Browser.lockPointer && (Browser.lockPointer = !0), void 0 === Browser.resizeCanvas && (Browser.resizeCanvas = !1);
            var r = Module.canvas;

            function n() {
                Browser.isFullscreen = !1;
                var e = r.parentNode;
                (document.fullscreenElement || document.mozFullScreenElement || document.msFullscreenElement || document.webkitFullscreenElement || document.webkitCurrentFullScreenElement) === e ? (r.exitFullscreen = Browser.exitFullscreen, Browser.lockPointer && r.requestPointerLock(), Browser.isFullscreen = !0, Browser.resizeCanvas ? Browser.setFullscreenCanvasSize() : Browser.updateCanvasDimensions(r)) : (e.parentNode.insertBefore(r, e), e.parentNode.removeChild(e), Browser.resizeCanvas ? Browser.setWindowedCanvasSize() : Browser.updateCanvasDimensions(r)), Module.onFullScreen && Module.onFullScreen(Browser.isFullscreen), Module.onFullscreen && Module.onFullscreen(Browser.isFullscreen)
            }
            Browser.fullscreenHandlersInstalled || (Browser.fullscreenHandlersInstalled = !0, document.addEventListener("fullscreenchange", n, !1), document.addEventListener("mozfullscreenchange", n, !1), document.addEventListener("webkitfullscreenchange", n, !1), document.addEventListener("MSFullscreenChange", n, !1));
            var i = document.createElement("div");
            r.parentNode.insertBefore(i, r), i.appendChild(r), i.requestFullscreen = i.requestFullscreen || i.mozRequestFullScreen || i.msRequestFullscreen || (i.webkitRequestFullscreen ? function() {
                i.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)
            } : null) || (i.webkitRequestFullScreen ? function() {
                i.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT)
            } : null), i.requestFullscreen()
        },
        exitFullscreen: function() {
            return !!Browser.isFullscreen && ((document.exitFullscreen || document.cancelFullScreen || document.mozCancelFullScreen || document.msExitFullscreen || document.webkitCancelFullScreen || function() {}).apply(document, []), !0)
        },
        nextRAF: 0,
        fakeRequestAnimationFrame: function(e) {
            var t = Date.now();
            if (0 === Browser.nextRAF) Browser.nextRAF = t + 1e3 / 60;
            else
                for (; t + 2 >= Browser.nextRAF;) Browser.nextRAF += 1e3 / 60;
            var r = Math.max(Browser.nextRAF - t, 0);
            setTimeout(e, r)
        },
        requestAnimationFrame: function(e) {
            ("function" == typeof requestAnimationFrame ? requestAnimationFrame : Browser.fakeRequestAnimationFrame)(e)
        },
        safeCallback: function(e) {
            return function() {
                if (!ABORT) return e.apply(null, arguments)
            }
        },
        allowAsyncCallbacks: !0,
        queuedAsyncCallbacks: [],
        pauseAsyncCallbacks: function() {
            Browser.allowAsyncCallbacks = !1
        },
        resumeAsyncCallbacks: function() {
            var e;
            Browser.allowAsyncCallbacks = !0, 0 < Browser.queuedAsyncCallbacks.length && (e = Browser.queuedAsyncCallbacks, Browser.queuedAsyncCallbacks = [], e.forEach(function(e) {
                e()
            }))
        },
        safeRequestAnimationFrame: function(e) {
            return Browser.requestAnimationFrame(function() {
                ABORT || (Browser.allowAsyncCallbacks ? e() : Browser.queuedAsyncCallbacks.push(e))
            })
        },
        safeSetTimeout: function(e, t) {
            return noExitRuntime = !0, setTimeout(function() {
                ABORT || (Browser.allowAsyncCallbacks ? e() : Browser.queuedAsyncCallbacks.push(e))
            }, t)
        },
        safeSetInterval: function(e, t) {
            return noExitRuntime = !0, setInterval(function() {
                ABORT || Browser.allowAsyncCallbacks && e()
            }, t)
        },
        getMimetype: function(e) {
            return {
                jpg: "image/jpeg",
                jpeg: "image/jpeg",
                png: "image/png",
                bmp: "image/bmp",
                ogg: "audio/ogg",
                wav: "audio/wav",
                mp3: "audio/mpeg"
            } [e.substr(e.lastIndexOf(".") + 1)]
        },
        getUserMedia: function(e) {
            window.getUserMedia || (window.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia), window.getUserMedia(e)
        },
        getMovementX: function(e) {
            return e.movementX || e.mozMovementX || e.webkitMovementX || 0
        },
        getMovementY: function(e) {
            return e.movementY || e.mozMovementY || e.webkitMovementY || 0
        },
        getMouseWheelDelta: function(e) {
            var t = 0;
            switch (e.type) {
                case "DOMMouseScroll":
                    t = e.detail / 3;
                    break;
                case "mousewheel":
                    t = e.wheelDelta / 120;
                    break;
                case "wheel":
                    switch (t = e.deltaY, e.deltaMode) {
                        case 0:
                            t /= 100;
                            break;
                        case 1:
                            t /= 3;
                            break;
                        case 2:
                            t *= 80;
                            break;
                        default:
                            throw "unrecognized mouse wheel delta mode: " + e.deltaMode
                    }
                    break;
                default:
                    throw "unrecognized mouse wheel event: " + e.type
            }
            return t
        },
        mouseX: 0,
        mouseY: 0,
        mouseMovementX: 0,
        mouseMovementY: 0,
        touches: {},
        lastTouches: {},
        calculateMouseEvent: function(e) {
            if (Browser.pointerLock) "mousemove" != e.type && "mozMovementX" in e ? Browser.mouseMovementX = Browser.mouseMovementY = 0 : (Browser.mouseMovementX = Browser.getMovementX(e), Browser.mouseMovementY = Browser.getMovementY(e)), "undefined" != typeof SDL ? (Browser.mouseX = SDL.mouseX + Browser.mouseMovementX, Browser.mouseY = SDL.mouseY + Browser.mouseMovementY) : (Browser.mouseX += Browser.mouseMovementX, Browser.mouseY += Browser.mouseMovementY);
            else {
                var t, r = Module.canvas.getBoundingClientRect(),
                    n = Module.canvas.width,
                    i = Module.canvas.height,
                    o = void 0 !== window.scrollX ? window.scrollX : window.pageXOffset,
                    a = void 0 !== window.scrollY ? window.scrollY : window.pageYOffset;
                if ("touchstart" === e.type || "touchend" === e.type || "touchmove" === e.type) return void 0 === (l = e.touch) ? void 0 : (t = l.pageX - (o + r.left), s = l.pageY - (a + r.top), t = {
                    x: t *= n / r.width,
                    y: s *= i / r.height
                }, void("touchstart" === e.type ? (Browser.lastTouches[l.identifier] = t, Browser.touches[l.identifier] = t) : "touchend" !== e.type && "touchmove" !== e.type || (s = (s = Browser.touches[l.identifier]) || t, Browser.lastTouches[l.identifier] = s, Browser.touches[l.identifier] = t)));
                var s = e.pageX - (o + r.left),
                    l = e.pageY - (a + r.top);
                l *= i / r.height, Browser.mouseMovementX = (s *= n / r.width) - Browser.mouseX, Browser.mouseMovementY = l - Browser.mouseY, Browser.mouseX = s, Browser.mouseY = l
            }
        },
        asyncLoad: function(t, r, n, e) {
            var i = e ? "" : getUniqueRunDependency("al " + t);
            readAsync(t, function(e) {
                assert(e, 'Loading data file "' + t + '" failed (no arrayBuffer).'), r(new Uint8Array(e)), i && removeRunDependency(i)
            }, function(e) {
                if (!n) throw 'Loading data file "' + t + '" failed.';
                n()
            }), i && addRunDependency(i)
        },
        resizeListeners: [],
        updateResizeListeners: function() {
            var t = Module.canvas;
            Browser.resizeListeners.forEach(function(e) {
                e(t.width, t.height)
            })
        },
        setCanvasSize: function(e, t, r) {
            var n = Module.canvas;
            Browser.updateCanvasDimensions(n, e, t), r || Browser.updateResizeListeners()
        },
        windowedWidth: 0,
        windowedHeight: 0,
        setFullscreenCanvasSize: function() {
            var e;
            "undefined" != typeof SDL && (e = HEAPU32[SDL.screen >> 2], HEAP32[SDL.screen >> 2] = e |= 8388608), Browser.updateCanvasDimensions(Module.canvas), Browser.updateResizeListeners()
        },
        setWindowedCanvasSize: function() {
            var e;
            "undefined" != typeof SDL && (e = HEAPU32[SDL.screen >> 2], HEAP32[SDL.screen >> 2] = e &= -8388609), Browser.updateCanvasDimensions(Module.canvas), Browser.updateResizeListeners()
        },
        updateCanvasDimensions: function(e, t, r) {
            t && r ? (e.widthNative = t, e.heightNative = r) : (t = e.widthNative, r = e.heightNative);
            var n, i = t,
                o = r;
            Module.forcedAspectRatio && 0 < Module.forcedAspectRatio && (i / o < Module.forcedAspectRatio ? i = Math.round(o * Module.forcedAspectRatio) : o = Math.round(i / Module.forcedAspectRatio)), (document.fullscreenElement || document.mozFullScreenElement || document.msFullscreenElement || document.webkitFullscreenElement || document.webkitCurrentFullScreenElement) === e.parentNode && "undefined" != typeof screen && (n = Math.min(screen.width / i, screen.height / o), i = Math.round(i * n), o = Math.round(o * n)), Browser.resizeCanvas ? (e.width != i && (e.width = i), e.height != o && (e.height = o), void 0 !== e.style && (e.style.removeProperty("width"), e.style.removeProperty("height"))) : (e.width != t && (e.width = t), e.height != r && (e.height = r), void 0 !== e.style && (i != t || o != r ? (e.style.setProperty("width", i + "px", "important"), e.style.setProperty("height", o + "px", "important")) : (e.style.removeProperty("width"), e.style.removeProperty("height"))))
        },
        wgetRequests: {},
        nextWgetRequestHandle: 0,
        getNextWgetRequestHandle: function() {
            var e = Browser.nextWgetRequestHandle;
            return Browser.nextWgetRequestHandle++, e
        }
    },
    EGL = {
        errorCode: 12288,
        defaultDisplayInitialized: !1,
        currentContext: 0,
        currentReadSurface: 0,
        currentDrawSurface: 0,
        contextAttributes: {
            alpha: !1,
            depth: !1,
            stencil: !1,
            antialias: !1
        },
        stringCache: {},
        setErrorCode: function(e) {
            EGL.errorCode = e
        },
        chooseConfig: function(e, t, r, n, i) {
            if (62e3 != e) return EGL.setErrorCode(12296), 0;
            if (t)
                for (;;) {
                    var o = HEAP32[t >> 2];
                    if (12321 == o) {
                        var a = HEAP32[t + 4 >> 2];
                        EGL.contextAttributes.alpha = 0 < a
                    } else if (12325 == o) {
                        a = HEAP32[t + 4 >> 2];
                        EGL.contextAttributes.depth = 0 < a
                    } else if (12326 == o) {
                        var s = HEAP32[t + 4 >> 2];
                        EGL.contextAttributes.stencil = 0 < s
                    } else if (12337 == o) {
                        var l = HEAP32[t + 4 >> 2];
                        EGL.contextAttributes.antialias = 0 < l
                    } else if (12338 == o) {
                        l = HEAP32[t + 4 >> 2];
                        EGL.contextAttributes.antialias = 1 == l
                    } else if (12544 == o) {
                        s = HEAP32[t + 4 >> 2];
                        EGL.contextAttributes.lowLatency = 12547 != s
                    } else if (12344 == o) break;
                    t += 8
                }
            return r && n || i ? (i && (HEAP32[i >> 2] = 1), r && 0 < n && (HEAP32[r >> 2] = 62002), EGL.setErrorCode(12288), 1) : (EGL.setErrorCode(12300), 0)
        }
    };

function _eglBindAPI(e) {
    return 12448 == e ? (EGL.setErrorCode(12288), 1) : (EGL.setErrorCode(12300), 0)
}

function _eglChooseConfig(e, t, r, n, i) {
    return EGL.chooseConfig(e, t, r, n, i)
}

function __webgl_enable_ANGLE_instanced_arrays(e) {
    var o = e.getExtension("ANGLE_instanced_arrays");
    if (o) return e.vertexAttribDivisor = function(e, t) {
        o.vertexAttribDivisorANGLE(e, t)
    }, e.drawArraysInstanced = function(e, t, r, n) {
        o.drawArraysInstancedANGLE(e, t, r, n)
    }, e.drawElementsInstanced = function(e, t, r, n, i) {
        o.drawElementsInstancedANGLE(e, t, r, n, i)
    }, 1
}

function __webgl_enable_OES_vertex_array_object(e) {
    var t = e.getExtension("OES_vertex_array_object");
    if (t) return e.createVertexArray = function() {
        return t.createVertexArrayOES()
    }, e.deleteVertexArray = function(e) {
        t.deleteVertexArrayOES(e)
    }, e.bindVertexArray = function(e) {
        t.bindVertexArrayOES(e)
    }, e.isVertexArray = function(e) {
        return t.isVertexArrayOES(e)
    }, 1
}

function __webgl_enable_WEBGL_draw_buffers(e) {
    var r = e.getExtension("WEBGL_draw_buffers");
    if (r) return e.drawBuffers = function(e, t) {
        r.drawBuffersWEBGL(e, t)
    }, 1
}

function __webgl_enable_WEBGL_multi_draw(e) {
    return !!(e.multiDrawWebgl = e.getExtension("WEBGL_multi_draw"))
}
var GL = {
    counter: 1,
    buffers: [],
    programs: [],
    framebuffers: [],
    renderbuffers: [],
    textures: [],
    uniforms: [],
    shaders: [],
    vaos: [],
    contexts: [],
    offscreenCanvases: {},
    timerQueriesEXT: [],
    programInfos: {},
    stringCache: {},
    unpackAlignment: 4,
    recordError: function(e) {
        GL.lastError || (GL.lastError = e)
    },
    getNewId: function(e) {
        for (var t = GL.counter++, r = e.length; r < t; r++) e[r] = null;
        return t
    },
    getSource: function(e, t, r, n) {
        for (var i = "", o = 0; o < t; ++o) {
            var a = n ? HEAP32[n + 4 * o >> 2] : -1;
            i += UTF8ToString(HEAP32[r + 4 * o >> 2], a < 0 ? void 0 : a)
        }
        return i
    },
    createContext: function(e, t) {
        e = e.getContext("webgl", t);
        return e ? GL.registerContext(e, t) : 0
    },
    registerContext: function(e, t) {
        var r = GL.getNewId(GL.contexts),
            n = {
                handle: r,
                attributes: t,
                version: t.majorVersion,
                GLctx: e
            };
        return e.canvas && (e.canvas.GLctxObject = n), GL.contexts[r] = n, void 0 !== t.enableExtensionsByDefault && !t.enableExtensionsByDefault || GL.initExtensions(n), r
    },
    makeContextCurrent: function(e) {
        return GL.currentContext = GL.contexts[e], Module.ctx = GLctx = GL.currentContext && GL.currentContext.GLctx, !(e && !GLctx)
    },
    getContext: function(e) {
        return GL.contexts[e]
    },
    deleteContext: function(e) {
        GL.currentContext === GL.contexts[e] && (GL.currentContext = null), "object" == typeof JSEvents && JSEvents.removeAllHandlersOnTarget(GL.contexts[e].GLctx.canvas), GL.contexts[e] && GL.contexts[e].GLctx.canvas && (GL.contexts[e].GLctx.canvas.GLctxObject = void 0), GL.contexts[e] = null
    },
    initExtensions: function(e) {
        var t, r;
        (e = e || GL.currentContext).initExtensionsDone || (e.initExtensionsDone = !0, __webgl_enable_ANGLE_instanced_arrays(t = e.GLctx), __webgl_enable_OES_vertex_array_object(t), __webgl_enable_WEBGL_draw_buffers(t), t.disjointTimerQueryExt = t.getExtension("EXT_disjoint_timer_query"), __webgl_enable_WEBGL_multi_draw(t), r = ["OES_texture_float", "OES_texture_half_float", "OES_standard_derivatives", "OES_vertex_array_object", "WEBGL_compressed_texture_s3tc", "WEBGL_depth_texture", "OES_element_index_uint", "EXT_texture_filter_anisotropic", "EXT_frag_depth", "WEBGL_draw_buffers", "ANGLE_instanced_arrays", "OES_texture_float_linear", "OES_texture_half_float_linear", "EXT_blend_minmax", "EXT_shader_texture_lod", "EXT_texture_norm16", "WEBGL_compressed_texture_pvrtc", "EXT_color_buffer_half_float", "WEBGL_color_buffer_float", "EXT_sRGB", "WEBGL_compressed_texture_etc1", "EXT_disjoint_timer_query", "WEBGL_compressed_texture_etc", "WEBGL_compressed_texture_astc", "EXT_color_buffer_float", "WEBGL_compressed_texture_s3tc_srgb", "EXT_disjoint_timer_query_webgl2", "WEBKIT_WEBGL_compressed_texture_pvrtc"], (t.getSupportedExtensions() || []).forEach(function(e) {
            -1 != r.indexOf(e) && t.getExtension(e)
        }))
    },
    populateUniformTable: function(e) {
        for (var t = GL.programs[e], r = GL.programInfos[e] = {
                uniforms: {},
                maxUniformLength: 0,
                maxAttributeLength: -1,
                maxUniformBlockNameLength: -1
            }, n = r.uniforms, i = GLctx.getProgramParameter(t, 35718), o = 0; o < i; ++o) {
            var a = GLctx.getActiveUniform(t, o),
                s = a.name;
            if (r.maxUniformLength = Math.max(r.maxUniformLength, s.length + 1), "]" == s.slice(-1) && (s = s.slice(0, s.lastIndexOf("["))), u = GLctx.getUniformLocation(t, s)) {
                var l = GL.getNewId(GL.uniforms);
                n[s] = [a.size, l], GL.uniforms[l] = u;
                for (var c = 1; c < a.size; ++c) {
                    var u = GLctx.getUniformLocation(t, s + "[" + c + "]"),
                        l = GL.getNewId(GL.uniforms);
                    GL.uniforms[l] = u
                }
            }
        }
    }
};

function _eglCreateContext(e, t, r, n) {
    if (62e3 != e) return EGL.setErrorCode(12296), 0;
    for (var i = 1;;) {
        var o = HEAP32[n >> 2];
        if (12440 != o) {
            if (12344 == o) break;
            return EGL.setErrorCode(12292), 0
        }
        i = HEAP32[n + 4 >> 2], n += 8
    }
    return 2 != i ? (EGL.setErrorCode(12293), 0) : (EGL.contextAttributes.majorVersion = i - 1, EGL.contextAttributes.minorVersion = 0, EGL.context = GL.createContext(Module.canvas, EGL.contextAttributes), 0 != EGL.context ? (EGL.setErrorCode(12288), GL.makeContextCurrent(EGL.context), Module.useWebGL = !0, Browser.moduleContextCreatedCallbacks.forEach(function(e) {
        e()
    }), GL.makeContextCurrent(null), 62004) : (EGL.setErrorCode(12297), 0))
}

function _eglCreateWindowSurface(e, t, r, n) {
    return 62e3 != e ? (EGL.setErrorCode(12296), 0) : 62002 != t ? (EGL.setErrorCode(12293), 0) : (EGL.setErrorCode(12288), 62006)
}

function _eglDestroyContext(e, t) {
    return 62e3 != e ? (EGL.setErrorCode(12296), 0) : 62004 != t ? (EGL.setErrorCode(12294), 0) : (GL.deleteContext(EGL.context), EGL.setErrorCode(12288), EGL.currentContext == t && (EGL.currentContext = 0), 1)
}

function _eglDestroySurface(e, t) {
    return 62e3 != e ? (EGL.setErrorCode(12296), 0) : (62006 != t ? EGL.setErrorCode(12301) : (EGL.currentReadSurface == t && (EGL.currentReadSurface = 0), EGL.currentDrawSurface == t && (EGL.currentDrawSurface = 0), EGL.setErrorCode(12288)), 1)
}

function _eglGetConfigAttrib(e, t, r, n) {
    if (62e3 != e) return EGL.setErrorCode(12296), 0;
    if (62002 != t) return EGL.setErrorCode(12293), 0;
    if (!n) return EGL.setErrorCode(12300), 0;
    switch (EGL.setErrorCode(12288), r) {
        case 12320:
            return HEAP32[n >> 2] = EGL.contextAttributes.alpha ? 32 : 24, 1;
        case 12321:
            return HEAP32[n >> 2] = EGL.contextAttributes.alpha ? 8 : 0, 1;
        case 12322:
        case 12323:
        case 12324:
            return HEAP32[n >> 2] = 8, 1;
        case 12325:
            return HEAP32[n >> 2] = EGL.contextAttributes.depth ? 24 : 0, 1;
        case 12326:
            return HEAP32[n >> 2] = EGL.contextAttributes.stencil ? 8 : 0, 1;
        case 12327:
            return HEAP32[n >> 2] = 12344, 1;
        case 12328:
            return HEAP32[n >> 2] = 62002, 1;
        case 12329:
            return HEAP32[n >> 2] = 0, 1;
        case 12330:
            return HEAP32[n >> 2] = 4096, 1;
        case 12331:
            return HEAP32[n >> 2] = 16777216, 1;
        case 12332:
            return HEAP32[n >> 2] = 4096, 1;
        case 12333:
        case 12334:
            return HEAP32[n >> 2] = 0, 1;
        case 12335:
            return HEAP32[n >> 2] = 12344, 1;
        case 12337:
            return HEAP32[n >> 2] = EGL.contextAttributes.antialias ? 4 : 0, 1;
        case 12338:
            return HEAP32[n >> 2] = EGL.contextAttributes.antialias ? 1 : 0, 1;
        case 12339:
            return HEAP32[n >> 2] = 4, 1;
        case 12340:
            return HEAP32[n >> 2] = 12344, 1;
        case 12341:
        case 12342:
        case 12343:
            return HEAP32[n >> 2] = -1, 1;
        case 12345:
        case 12346:
        case 12347:
            return HEAP32[n >> 2] = 0, 1;
        case 12348:
            return HEAP32[n >> 2] = 1;
        case 12349:
        case 12350:
            return HEAP32[n >> 2] = 0, 1;
        case 12351:
            return HEAP32[n >> 2] = 12430, 1;
        case 12352:
            return HEAP32[n >> 2] = 4, 1;
        case 12354:
            return HEAP32[n >> 2] = 0, 1;
        default:
            return EGL.setErrorCode(12292), 0
    }
}

function _eglGetDisplay(e) {
    return EGL.setErrorCode(12288), 62e3
}

function _eglGetError() {
    return EGL.errorCode
}

function _eglGetProcAddress(e) {
    return _emscripten_GetProcAddress(e)
}

function _eglInitialize(e, t, r) {
    return 62e3 == e ? (t && (HEAP32[t >> 2] = 1), r && (HEAP32[r >> 2] = 4), EGL.defaultDisplayInitialized = !0, EGL.setErrorCode(12288), 1) : (EGL.setErrorCode(12296), 0)
}

function _eglMakeCurrent(e, t, r, n) {
    return 62e3 != e ? (EGL.setErrorCode(12296), 0) : 0 != n && 62004 != n ? (EGL.setErrorCode(12294), 0) : 0 != r && 62006 != r || 0 != t && 62006 != t ? (EGL.setErrorCode(12301), 0) : (GL.makeContextCurrent(n ? EGL.context : null), EGL.currentContext = n, EGL.currentDrawSurface = t, EGL.currentReadSurface = r, EGL.setErrorCode(12288), 1)
}

function _eglQueryString(e, t) {
    if (62e3 != e) return EGL.setErrorCode(12296), 0;
    if (EGL.setErrorCode(12288), EGL.stringCache[t]) return EGL.stringCache[t];
    var r;
    switch (t) {
        case 12371:
            r = allocateUTF8("Emscripten");
            break;
        case 12372:
            r = allocateUTF8("1.4 Emscripten EGL");
            break;
        case 12373:
            r = allocateUTF8("");
            break;
        case 12429:
            r = allocateUTF8("OpenGL_ES");
            break;
        default:
            return EGL.setErrorCode(12300), 0
    }
    return EGL.stringCache[t] = r
}

function _eglSwapBuffers() {
    if (EGL.defaultDisplayInitialized)
        if (Module.ctx) {
            if (!Module.ctx.isContextLost()) return EGL.setErrorCode(12288), 1;
            EGL.setErrorCode(12302)
        } else EGL.setErrorCode(12290);
    else EGL.setErrorCode(12289);
    return 0
}

function _eglSwapInterval(e, t) {
    return 62e3 != e ? (EGL.setErrorCode(12296), 0) : (0 == t ? _emscripten_set_main_loop_timing(0, 0) : _emscripten_set_main_loop_timing(1, t), EGL.setErrorCode(12288), 1)
}

function _eglTerminate(e) {
    return 62e3 != e ? (EGL.setErrorCode(12296), 0) : (EGL.currentContext = 0, EGL.currentReadSurface = 0, EGL.currentDrawSurface = 0, EGL.defaultDisplayInitialized = !1, EGL.setErrorCode(12288), 1)
}

function _eglWaitClient() {
    return EGL.setErrorCode(12288), 1
}

function _eglWaitGL() {
    return _eglWaitClient()
}

function _eglWaitNative(e) {
    return EGL.setErrorCode(12288), 1
}

function _emscripten_asm_const_int(e, t, r) {
    t = readAsmConstArgs(t, r);
    return ASM_CONSTS[e].apply(null, t)
}

function _emscripten_async_wget2(e, t, r, n, i, o, a, s) {
    noExitRuntime = !0;
    var e = UTF8ToString(e),
        l = UTF8ToString(t),
        l = PATH_FS.resolve(l),
        t = UTF8ToString(r),
        r = UTF8ToString(n),
        c = l.lastIndexOf("/"),
        u = new XMLHttpRequest,
        d = (u.open(t, e, !0), u.responseType = "arraybuffer", Browser.getNextWgetRequestHandle()),
        _ = PATH.dirname(l);
    return u.onload = function(e) {
        if (200 <= u.status && u.status < 300) {
            try {
                FS.unlink(l)
            } catch (e) {}
            var t;
            FS.mkdirTree(_), FS.createDataFile(l.substr(0, c), l.substr(c + 1), new Uint8Array(u.response), !0, !0, !1), o && (t = stackSave(), dynCall_viii(o, d, i, allocate(intArrayFromString(l), "i8", ALLOC_STACK)), stackRestore(t))
        } else a && dynCall_viii(a, d, i, u.status);
        delete Browser.wgetRequests[d]
    }, u.onerror = function(e) {
        a && dynCall_viii(a, d, i, u.status), delete Browser.wgetRequests[d]
    }, u.onprogress = function(e) {
        (e.lengthComputable || void 0 === e.lengthComputable && 0 != e.total) && (e = e.loaded / e.total * 100, s) && dynCall_viii(s, d, i, e)
    }, u.onabort = function(e) {
        delete Browser.wgetRequests[d]
    }, "POST" == t ? (u.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), u.send(r)) : u.send(null), Browser.wgetRequests[d] = u, d
}
var JSEvents = {
        inEventHandler: 0,
        removeAllEventListeners: function() {
            for (var e = JSEvents.eventHandlers.length - 1; 0 <= e; --e) JSEvents._removeHandler(e);
            JSEvents.eventHandlers = [], JSEvents.deferredCalls = []
        },
        registerRemoveEventListeners: function() {
            JSEvents.removeEventListenersRegistered || (__ATEXIT__.push(JSEvents.removeAllEventListeners), JSEvents.removeEventListenersRegistered = !0)
        },
        deferredCalls: [],
        deferCall: function(e, t, r) {
            for (var n in JSEvents.deferredCalls) {
                n = JSEvents.deferredCalls[n];
                if (n.targetFunction == e && ((e, t) => {
                        if (e.length == t.length) {
                            for (var r in e)
                                if (e[r] != t[r]) return;
                            return 1
                        }
                    })(n.argsList, r)) return
            }
            JSEvents.deferredCalls.push({
                targetFunction: e,
                precedence: t,
                argsList: r
            }), JSEvents.deferredCalls.sort(function(e, t) {
                return e.precedence < t.precedence
            })
        },
        removeDeferredCalls: function(e) {
            for (var t = 0; t < JSEvents.deferredCalls.length; ++t) JSEvents.deferredCalls[t].targetFunction == e && (JSEvents.deferredCalls.splice(t, 1), --t)
        },
        canPerformEventHandlerRequests: function() {
            return JSEvents.inEventHandler && JSEvents.currentEventHandler.allowsDeferredCalls
        },
        runDeferredCalls: function() {
            if (JSEvents.canPerformEventHandlerRequests())
                for (var e = 0; e < JSEvents.deferredCalls.length; ++e) {
                    var t = JSEvents.deferredCalls[e];
                    JSEvents.deferredCalls.splice(e, 1), --e, t.targetFunction.apply(null, t.argsList)
                }
        },
        eventHandlers: [],
        removeAllHandlersOnTarget: function(e, t) {
            for (var r = 0; r < JSEvents.eventHandlers.length; ++r) JSEvents.eventHandlers[r].target != e || t && t != JSEvents.eventHandlers[r].eventTypeString || JSEvents._removeHandler(r--)
        },
        _removeHandler: function(e) {
            var t = JSEvents.eventHandlers[e];
            t.target.removeEventListener(t.eventTypeString, t.eventListenerFunc, t.useCapture), JSEvents.eventHandlers.splice(e, 1)
        },
        registerOrRemoveHandler: function(t) {
            function e(e) {
                ++JSEvents.inEventHandler, JSEvents.currentEventHandler = t, JSEvents.runDeferredCalls(), t.handlerFunc(e), JSEvents.runDeferredCalls(), --JSEvents.inEventHandler
            }
            if (t.callbackfunc) t.eventListenerFunc = e, t.target.addEventListener(t.eventTypeString, e, t.useCapture), JSEvents.eventHandlers.push(t), JSEvents.registerRemoveEventListeners();
            else
                for (var r = 0; r < JSEvents.eventHandlers.length; ++r) JSEvents.eventHandlers[r].target == t.target && JSEvents.eventHandlers[r].eventTypeString == t.eventTypeString && JSEvents._removeHandler(r--)
        },
        getNodeNameForTarget: function(e) {
            return e ? e == window ? "#window" : e == screen ? "#screen" : e && e.nodeName ? e.nodeName : "" : ""
        },
        fullscreenEnabled: function() {
            return document.fullscreenEnabled || document.webkitFullscreenEnabled
        }
    },
    __currentFullscreenStrategy = {};

function maybeCStringToJsString(e) {
    return 2 < e ? UTF8ToString(e) : e
}
var specialHTMLTargets = [0, "undefined" != typeof document ? document : 0, "undefined" != typeof window ? window : 0];

function findEventTarget(e) {
    return e = maybeCStringToJsString(e), specialHTMLTargets[e] || ("undefined" != typeof document ? document.querySelector(e) : void 0)
}

function findCanvasEventTarget(e) {
    return findEventTarget(e)
}

function _emscripten_get_canvas_element_size(e, t, r) {
    e = findCanvasEventTarget(e);
    if (!e) return -4;
    HEAP32[t >> 2] = e.width, HEAP32[r >> 2] = e.height
}

function __get_canvas_element_size(e) {
    var t = stackSave(),
        r = stackAlloc(8),
        n = r + 4,
        i = stackAlloc(e.id.length + 1),
        e = (stringToUTF8(e.id, i, e.id.length + 1), _emscripten_get_canvas_element_size(i, r, n), [HEAP32[r >> 2], HEAP32[n >> 2]]);
    return stackRestore(t), e
}

function _emscripten_set_canvas_element_size(e, t, r) {
    e = findCanvasEventTarget(e);
    return e ? (e.width = t, e.height = r, 0) : -4
}

function __set_canvas_element_size(e, t, r) {
    var n, i;
    e.controlTransferredOffscreen ? (n = stackSave(), i = stackAlloc(e.id.length + 1), stringToUTF8(e.id, i, e.id.length + 1), _emscripten_set_canvas_element_size(i, t, r), stackRestore(n)) : (e.width = t, e.height = r)
}

function __registerRestoreOldStyle(e) {
    var t = __get_canvas_element_size(e),
        r = t[0],
        n = t[1],
        i = e.style.width,
        o = e.style.height,
        a = e.style.backgroundColor,
        s = document.body.style.backgroundColor,
        l = e.style.paddingLeft,
        c = e.style.paddingRight,
        u = e.style.paddingTop,
        d = e.style.paddingBottom,
        _ = e.style.marginLeft,
        f = e.style.marginRight,
        m = e.style.marginTop,
        p = e.style.marginBottom,
        g = document.body.style.margin,
        E = document.documentElement.style.overflow,
        y = document.body.scroll,
        v = e.style.imageRendering;

    function S() {
        document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement || (document.removeEventListener("fullscreenchange", S), document.removeEventListener("webkitfullscreenchange", S), __set_canvas_element_size(e, r, n), e.style.width = i, e.style.height = o, e.style.backgroundColor = a, s || (document.body.style.backgroundColor = "white"), document.body.style.backgroundColor = s, e.style.paddingLeft = l, e.style.paddingRight = c, e.style.paddingTop = u, e.style.paddingBottom = d, e.style.marginLeft = _, e.style.marginRight = f, e.style.marginTop = m, e.style.marginBottom = p, document.body.style.margin = g, document.documentElement.style.overflow = E, document.body.scroll = y, e.style.imageRendering = v, e.GLctxObject && e.GLctxObject.GLctx.viewport(0, 0, r, n), __currentFullscreenStrategy.canvasResizedCallback && dynCall_iiii(__currentFullscreenStrategy.canvasResizedCallback, 37, 0, __currentFullscreenStrategy.canvasResizedCallbackUserData))
    }
    return document.addEventListener("fullscreenchange", S), document.addEventListener("webkitfullscreenchange", S), S
}

function __setLetterbox(e, t, r) {
    e.style.paddingLeft = e.style.paddingRight = r + "px", e.style.paddingTop = e.style.paddingBottom = t + "px"
}

function __getBoundingClientRect(e) {
    return specialHTMLTargets.indexOf(e) < 0 ? e.getBoundingClientRect() : {
        left: 0,
        top: 0
    }
}

function _JSEvents_resizeCanvasForFullscreen(e, t) {
    var r = __registerRestoreOldStyle(e),
        n = t.softFullscreen ? innerWidth : screen.width,
        i = t.softFullscreen ? innerHeight : screen.height,
        o = __getBoundingClientRect(e),
        a = o.width,
        o = o.height,
        s = __get_canvas_element_size(e),
        l = s[0],
        s = s[1],
        a = (3 == t.scaleMode ? (__setLetterbox(e, (i - o) / 2, (n - a) / 2), n = a, i = o) : 2 == t.scaleMode && (n * s < l * i ? (__setLetterbox(e, (i - (a = s * n / l)) / 2, 0), i = a) : (__setLetterbox(e, 0, (n - (o = l * i / s)) / 2), n = o)), e.style.backgroundColor || (e.style.backgroundColor = "black"), document.body.style.backgroundColor || (document.body.style.backgroundColor = "black"), e.style.width = n + "px", e.style.height = i + "px", 1 == t.filteringMode && (e.style.imageRendering = "optimizeSpeed", e.style.imageRendering = "-moz-crisp-edges", e.style.imageRendering = "-o-crisp-edges", e.style.imageRendering = "-webkit-optimize-contrast", e.style.imageRendering = "optimize-contrast", e.style.imageRendering = "crisp-edges", e.style.imageRendering = "pixelated"), 2 == t.canvasResolutionScaleMode ? devicePixelRatio : 1);
    return 0 != t.canvasResolutionScaleMode && (__set_canvas_element_size(e, l = n * a | 0, s = i * a | 0), e.GLctxObject) && e.GLctxObject.GLctx.viewport(0, 0, l, s), r
}

function _JSEvents_requestFullscreen(e, t) {
    if (0 == t.scaleMode && 0 == t.canvasResolutionScaleMode || _JSEvents_resizeCanvasForFullscreen(e, t), e.requestFullscreen) e.requestFullscreen();
    else {
        if (!e.webkitRequestFullscreen) return JSEvents.fullscreenEnabled() ? -3 : -1;
        e.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)
    }
    return (__currentFullscreenStrategy = t).canvasResizedCallback && dynCall_iiii(t.canvasResizedCallback, 37, 0, t.canvasResizedCallbackUserData), 0
}

function _emscripten_exit_fullscreen() {
    if (!JSEvents.fullscreenEnabled()) return -1;
    JSEvents.removeDeferredCalls(_JSEvents_requestFullscreen);
    var e = specialHTMLTargets[1];
    if (e.exitFullscreen) e.fullscreenElement && e.exitFullscreen();
    else {
        if (!e.webkitExitFullscreen) return -1;
        e.webkitFullscreenElement && e.webkitExitFullscreen()
    }
    return 0
}

function __requestPointerLock(e) {
    if (e.requestPointerLock) e.requestPointerLock();
    else {
        if (!e.msRequestPointerLock) return document.body.requestPointerLock || document.body.msRequestPointerLock ? -3 : -1;
        e.msRequestPointerLock()
    }
    return 0
}

function _emscripten_exit_pointerlock() {
    if (JSEvents.removeDeferredCalls(__requestPointerLock), document.exitPointerLock) document.exitPointerLock();
    else {
        if (!document.msExitPointerLock) return -1;
        document.msExitPointerLock()
    }
    return 0
}

function _emscripten_get_device_pixel_ratio() {
    return "number" == typeof devicePixelRatio && devicePixelRatio || 1
}

function _emscripten_get_element_css_size(e, t, r) {
    return (e = findEventTarget(e)) ? (e = __getBoundingClientRect(e), HEAPF64[t >> 3] = e.width, HEAPF64[r >> 3] = e.height, 0) : -4
}

function __fillGamepadEventData(e, t) {
    HEAPF64[e >> 3] = t.timestamp;
    for (var r = 0; r < t.axes.length; ++r) HEAPF64[e + 8 * r + 16 >> 3] = t.axes[r];
    for (r = 0; r < t.buttons.length; ++r) "object" == typeof t.buttons[r] ? HEAPF64[e + 8 * r + 528 >> 3] = t.buttons[r].value : HEAPF64[e + 8 * r + 528 >> 3] = t.buttons[r];
    for (r = 0; r < t.buttons.length; ++r) "object" == typeof t.buttons[r] ? HEAP32[e + 4 * r + 1040 >> 2] = t.buttons[r].pressed : HEAP32[e + 4 * r + 1040 >> 2] = 1 == t.buttons[r];
    HEAP32[e + 1296 >> 2] = t.connected, HEAP32[e + 1300 >> 2] = t.index, HEAP32[e + 8 >> 2] = t.axes.length, HEAP32[e + 12 >> 2] = t.buttons.length, stringToUTF8(t.id, e + 1304, 64), stringToUTF8(t.mapping, e + 1368, 64)
}

function _emscripten_get_gamepad_status(e, t) {
    return e < 0 || e >= JSEvents.lastGamepadState.length ? -5 : JSEvents.lastGamepadState[e] ? (__fillGamepadEventData(t, JSEvents.lastGamepadState[e]), 0) : -7
}

function _emscripten_get_num_gamepads() {
    return JSEvents.lastGamepadState.length
}

function _emscripten_get_sbrk_ptr() {
    return 3362432
}

function _emscripten_glActiveTexture(e) {
    GLctx.activeTexture(e)
}

function _emscripten_glAttachShader(e, t) {
    GLctx.attachShader(GL.programs[e], GL.shaders[t])
}

function _emscripten_glBeginQueryEXT(e, t) {
    GLctx.disjointTimerQueryExt.beginQueryEXT(e, GL.timerQueriesEXT[t])
}

function _emscripten_glBindAttribLocation(e, t, r) {
    GLctx.bindAttribLocation(GL.programs[e], t, UTF8ToString(r))
}

function _emscripten_glBindBuffer(e, t) {
    GLctx.bindBuffer(e, GL.buffers[t])
}

function _emscripten_glBindFramebuffer(e, t) {
    GLctx.bindFramebuffer(e, GL.framebuffers[t])
}

function _emscripten_glBindRenderbuffer(e, t) {
    GLctx.bindRenderbuffer(e, GL.renderbuffers[t])
}

function _emscripten_glBindTexture(e, t) {
    GLctx.bindTexture(e, GL.textures[t])
}

function _emscripten_glBindVertexArrayOES(e) {
    GLctx.bindVertexArray(GL.vaos[e])
}

function _emscripten_glBlendColor(e, t, r, n) {
    GLctx.blendColor(e, t, r, n)
}

function _emscripten_glBlendEquation(e) {
    GLctx.blendEquation(e)
}

function _emscripten_glBlendEquationSeparate(e, t) {
    GLctx.blendEquationSeparate(e, t)
}

function _emscripten_glBlendFunc(e, t) {
    GLctx.blendFunc(e, t)
}

function _emscripten_glBlendFuncSeparate(e, t, r, n) {
    GLctx.blendFuncSeparate(e, t, r, n)
}

function _emscripten_glBufferData(e, t, r, n) {
    GLctx.bufferData(e, r ? HEAPU8.subarray(r, r + t) : t, n)
}

function _emscripten_glBufferSubData(e, t, r, n) {
    GLctx.bufferSubData(e, t, HEAPU8.subarray(n, n + r))
}

function _emscripten_glCheckFramebufferStatus(e) {
    return GLctx.checkFramebufferStatus(e)
}

function _emscripten_glClear(e) {
    GLctx.clear(e)
}

function _emscripten_glClearColor(e, t, r, n) {
    GLctx.clearColor(e, t, r, n)
}

function _emscripten_glClearDepthf(e) {
    GLctx.clearDepth(e)
}

function _emscripten_glClearStencil(e) {
    GLctx.clearStencil(e)
}

function _emscripten_glColorMask(e, t, r, n) {
    GLctx.colorMask(!!e, !!t, !!r, !!n)
}

function _emscripten_glCompileShader(e) {
    GLctx.compileShader(GL.shaders[e])
}

function _emscripten_glCompressedTexImage2D(e, t, r, n, i, o, a, s) {
    GLctx.compressedTexImage2D(e, t, r, n, i, o, s ? HEAPU8.subarray(s, s + a) : null)
}

function _emscripten_glCompressedTexSubImage2D(e, t, r, n, i, o, a, s, l) {
    GLctx.compressedTexSubImage2D(e, t, r, n, i, o, a, l ? HEAPU8.subarray(l, l + s) : null)
}

function _emscripten_glCopyTexImage2D(e, t, r, n, i, o, a, s) {
    GLctx.copyTexImage2D(e, t, r, n, i, o, a, s)
}

function _emscripten_glCopyTexSubImage2D(e, t, r, n, i, o, a, s) {
    GLctx.copyTexSubImage2D(e, t, r, n, i, o, a, s)
}

function _emscripten_glCreateProgram() {
    var e = GL.getNewId(GL.programs),
        t = GLctx.createProgram();
    return t.name = e, GL.programs[e] = t, e
}

function _emscripten_glCreateShader(e) {
    var t = GL.getNewId(GL.shaders);
    return GL.shaders[t] = GLctx.createShader(e), t
}

function _emscripten_glCullFace(e) {
    GLctx.cullFace(e)
}

function _emscripten_glDeleteBuffers(e, t) {
    for (var r = 0; r < e; r++) {
        var n = HEAP32[t + 4 * r >> 2],
            i = GL.buffers[n];
        i && (GLctx.deleteBuffer(i), i.name = 0, GL.buffers[n] = null)
    }
}

function _emscripten_glDeleteFramebuffers(e, t) {
    for (var r = 0; r < e; ++r) {
        var n = HEAP32[t + 4 * r >> 2],
            i = GL.framebuffers[n];
        i && (GLctx.deleteFramebuffer(i), i.name = 0, GL.framebuffers[n] = null)
    }
}

function _emscripten_glDeleteProgram(e) {
    var t;
    e && ((t = GL.programs[e]) ? (GLctx.deleteProgram(t), t.name = 0, GL.programs[e] = null, GL.programInfos[e] = null) : GL.recordError(1281))
}

function _emscripten_glDeleteQueriesEXT(e, t) {
    for (var r = 0; r < e; r++) {
        var n = HEAP32[t + 4 * r >> 2],
            i = GL.timerQueriesEXT[n];
        i && (GLctx.disjointTimerQueryExt.deleteQueryEXT(i), GL.timerQueriesEXT[n] = null)
    }
}

function _emscripten_glDeleteRenderbuffers(e, t) {
    for (var r = 0; r < e; r++) {
        var n = HEAP32[t + 4 * r >> 2],
            i = GL.renderbuffers[n];
        i && (GLctx.deleteRenderbuffer(i), i.name = 0, GL.renderbuffers[n] = null)
    }
}

function _emscripten_glDeleteShader(e) {
    var t;
    e && ((t = GL.shaders[e]) ? (GLctx.deleteShader(t), GL.shaders[e] = null) : GL.recordError(1281))
}

function _emscripten_glDeleteTextures(e, t) {
    for (var r = 0; r < e; r++) {
        var n = HEAP32[t + 4 * r >> 2],
            i = GL.textures[n];
        i && (GLctx.deleteTexture(i), i.name = 0, GL.textures[n] = null)
    }
}

function _emscripten_glDeleteVertexArraysOES(e, t) {
    for (var r = 0; r < e; r++) {
        var n = HEAP32[t + 4 * r >> 2];
        GLctx.deleteVertexArray(GL.vaos[n]), GL.vaos[n] = null
    }
}

function _emscripten_glDepthFunc(e) {
    GLctx.depthFunc(e)
}

function _emscripten_glDepthMask(e) {
    GLctx.depthMask(!!e)
}

function _emscripten_glDepthRangef(e, t) {
    GLctx.depthRange(e, t)
}

function _emscripten_glDetachShader(e, t) {
    GLctx.detachShader(GL.programs[e], GL.shaders[t])
}

function _emscripten_glDisable(e) {
    GLctx.disable(e)
}

function _emscripten_glDisableVertexAttribArray(e) {
    GLctx.disableVertexAttribArray(e)
}

function _emscripten_glDrawArrays(e, t, r) {
    GLctx.drawArrays(e, t, r)
}

function _emscripten_glDrawArraysInstancedANGLE(e, t, r, n) {
    GLctx.drawArraysInstanced(e, t, r, n)
}
var tempFixedLengthArray = [];

function _emscripten_glDrawBuffersWEBGL(e, t) {
    for (var r = tempFixedLengthArray[e], n = 0; n < e; n++) r[n] = HEAP32[t + 4 * n >> 2];
    GLctx.drawBuffers(r)
}

function _emscripten_glDrawElements(e, t, r, n) {
    GLctx.drawElements(e, t, r, n)
}

function _emscripten_glDrawElementsInstancedANGLE(e, t, r, n, i) {
    GLctx.drawElementsInstanced(e, t, r, n, i)
}

function _emscripten_glEnable(e) {
    GLctx.enable(e)
}

function _emscripten_glEnableVertexAttribArray(e) {
    GLctx.enableVertexAttribArray(e)
}

function _emscripten_glEndQueryEXT(e) {
    GLctx.disjointTimerQueryExt.endQueryEXT(e)
}

function _emscripten_glFinish() {
    GLctx.finish()
}

function _emscripten_glFlush() {
    GLctx.flush()
}

function _emscripten_glFramebufferRenderbuffer(e, t, r, n) {
    GLctx.framebufferRenderbuffer(e, t, r, GL.renderbuffers[n])
}

function _emscripten_glFramebufferTexture2D(e, t, r, n, i) {
    GLctx.framebufferTexture2D(e, t, r, GL.textures[n], i)
}

function _emscripten_glFrontFace(e) {
    GLctx.frontFace(e)
}

function __glGenObject(e, t, r, n) {
    for (var i = 0; i < e; i++) {
        var o = GLctx[r](),
            a = o && GL.getNewId(n);
        o ? n[o.name = a] = o : GL.recordError(1282), HEAP32[t + 4 * i >> 2] = a
    }
}

function _emscripten_glGenBuffers(e, t) {
    __glGenObject(e, t, "createBuffer", GL.buffers)
}

function _emscripten_glGenFramebuffers(e, t) {
    __glGenObject(e, t, "createFramebuffer", GL.framebuffers)
}

function _emscripten_glGenQueriesEXT(e, t) {
    for (var r = 0; r < e; r++) {
        var n = GLctx.disjointTimerQueryExt.createQueryEXT();
        if (!n) {
            for (GL.recordError(1282); r < e;) HEAP32[t + 4 * r++ >> 2] = 0;
            return
        }
        var i = GL.getNewId(GL.timerQueriesEXT);
        n.name = i, GL.timerQueriesEXT[i] = n, HEAP32[t + 4 * r >> 2] = i
    }
}

function _emscripten_glGenRenderbuffers(e, t) {
    __glGenObject(e, t, "createRenderbuffer", GL.renderbuffers)
}

function _emscripten_glGenTextures(e, t) {
    __glGenObject(e, t, "createTexture", GL.textures)
}

function _emscripten_glGenVertexArraysOES(e, t) {
    __glGenObject(e, t, "createVertexArray", GL.vaos)
}

function _emscripten_glGenerateMipmap(e) {
    GLctx.generateMipmap(e)
}

function __glGetActiveAttribOrUniform(e, t, r, n, i, o, a, s) {
    t = GL.programs[t];
    e = GLctx[e](t, r);
    e && (t = s && stringToUTF8(e.name, s, n), i && (HEAP32[i >> 2] = t), o && (HEAP32[o >> 2] = e.size), a) && (HEAP32[a >> 2] = e.type)
}

function _emscripten_glGetActiveAttrib(e, t, r, n, i, o, a) {
    __glGetActiveAttribOrUniform("getActiveAttrib", e, t, r, n, i, o, a)
}

function _emscripten_glGetActiveUniform(e, t, r, n, i, o, a) {
    __glGetActiveAttribOrUniform("getActiveUniform", e, t, r, n, i, o, a)
}

function _emscripten_glGetAttachedShaders(e, t, r, n) {
    var i = GLctx.getAttachedShaders(GL.programs[e]),
        o = i.length;
    HEAP32[r >> 2] = o = t < o ? t : o;
    for (var a = 0; a < o; ++a) {
        var s = GL.shaders.indexOf(i[a]);
        HEAP32[n + 4 * a >> 2] = s
    }
}

function _emscripten_glGetAttribLocation(e, t) {
    return GLctx.getAttribLocation(GL.programs[e], UTF8ToString(t))
}

function writeI53ToI64(e, t) {
    HEAPU32[e >> 2] = t, HEAPU32[e + 4 >> 2] = (t - HEAPU32[e >> 2]) / 4294967296
}

function emscriptenWebGLGet(t, e, r) {
    if (e) {
        var n = void 0;
        switch (t) {
            case 36346:
                n = 1;
                break;
            case 36344:
                return void(0 != r && 1 != r && GL.recordError(1280));
            case 36345:
                n = 0;
                break;
            case 34466:
                var i = GLctx.getParameter(34467),
                    n = i ? i.length : 0
        }
        if (void 0 === n) {
            var o = GLctx.getParameter(t);
            switch (typeof o) {
                case "number":
                    n = o;
                    break;
                case "boolean":
                    n = o ? 1 : 0;
                    break;
                case "string":
                    return void GL.recordError(1280);
                case "object":
                    if (null === o) switch (t) {
                        case 34964:
                        case 35725:
                        case 34965:
                        case 36006:
                        case 36007:
                        case 32873:
                        case 34229:
                        case 34068:
                            n = 0;
                            break;
                        default:
                            return void GL.recordError(1280)
                    } else {
                        if (o instanceof Float32Array || o instanceof Uint32Array || o instanceof Int32Array || o instanceof Array) {
                            for (var a = 0; a < o.length; ++a) switch (r) {
                                case 0:
                                    HEAP32[e + 4 * a >> 2] = o[a];
                                    break;
                                case 2:
                                    HEAPF32[e + 4 * a >> 2] = o[a];
                                    break;
                                case 4:
                                    HEAP8[e + a >> 0] = o[a] ? 1 : 0
                            }
                            return
                        }
                        try {
                            n = 0 | o.name
                        } catch (e) {
                            return GL.recordError(1280), void err("GL_INVALID_ENUM in glGet" + r + "v: Unknown object returned from WebGL getParameter(" + t + ")! (error: " + e + ")")
                        }
                    }
                    break;
                default:
                    return GL.recordError(1280), void err("GL_INVALID_ENUM in glGet" + r + "v: Native code calling glGet" + r + "v(" + t + ") and it returns " + o + " of type " + typeof o + "!")
            }
        }
        switch (r) {
            case 1:
                writeI53ToI64(e, n);
                break;
            case 0:
                HEAP32[e >> 2] = n;
                break;
            case 2:
                HEAPF32[e >> 2] = n;
                break;
            case 4:
                HEAP8[e >> 0] = n ? 1 : 0
        }
    } else GL.recordError(1281)
}

function _emscripten_glGetBooleanv(e, t) {
    emscriptenWebGLGet(e, t, 4)
}

function _emscripten_glGetBufferParameteriv(e, t, r) {
    r ? HEAP32[r >> 2] = GLctx.getBufferParameter(e, t) : GL.recordError(1281)
}

function _emscripten_glGetError() {
    var e = GLctx.getError() || GL.lastError;
    return GL.lastError = 0, e
}

function _emscripten_glGetFloatv(e, t) {
    emscriptenWebGLGet(e, t, 2)
}

function _emscripten_glGetFramebufferAttachmentParameteriv(e, t, r, n) {
    e = GLctx.getFramebufferAttachmentParameter(e, t, r);
    (e instanceof WebGLRenderbuffer || e instanceof WebGLTexture) && (e = 0 | e.name), HEAP32[n >> 2] = e
}

function _emscripten_glGetIntegerv(e, t) {
    emscriptenWebGLGet(e, t, 0)
}

function _emscripten_glGetProgramInfoLog(e, t, r, n) {
    e = GLctx.getProgramInfoLog(GL.programs[e]), null === e && (e = "(unknown error)"), e = 0 < t && n ? stringToUTF8(e, n, t) : 0;
    r && (HEAP32[r >> 2] = e)
}

function _emscripten_glGetProgramiv(e, t, r) {
    if (r)
        if (e >= GL.counter) GL.recordError(1281);
        else {
            var n = GL.programInfos[e];
            if (n)
                if (35716 == t) {
                    var i = GLctx.getProgramInfoLog(GL.programs[e]);
                    HEAP32[r >> 2] = (i = null === i ? "(unknown error)" : i).length + 1
                } else if (35719 == t) HEAP32[r >> 2] = n.maxUniformLength;
            else if (35722 == t) {
                if (-1 == n.maxAttributeLength) {
                    e = GL.programs[e];
                    for (var o = GLctx.getProgramParameter(e, 35721), a = n.maxAttributeLength = 0; a < o; ++a) {
                        var s = GLctx.getActiveAttrib(e, a);
                        n.maxAttributeLength = Math.max(n.maxAttributeLength, s.name.length + 1)
                    }
                }
                HEAP32[r >> 2] = n.maxAttributeLength
            } else if (35381 == t) {
                if (-1 == n.maxUniformBlockNameLength) {
                    e = GL.programs[e];
                    for (var l = GLctx.getProgramParameter(e, 35382), a = n.maxUniformBlockNameLength = 0; a < l; ++a) {
                        var c = GLctx.getActiveUniformBlockName(e, a);
                        n.maxUniformBlockNameLength = Math.max(n.maxUniformBlockNameLength, c.length + 1)
                    }
                }
                HEAP32[r >> 2] = n.maxUniformBlockNameLength
            } else HEAP32[r >> 2] = GLctx.getProgramParameter(GL.programs[e], t);
            else GL.recordError(1282)
        }
    else GL.recordError(1281)
}

function _emscripten_glGetQueryObjecti64vEXT(e, t, r) {
    r ? (e = GL.timerQueriesEXT[e], writeI53ToI64(r, "boolean" == typeof(r = GLctx.disjointTimerQueryExt.getQueryObjectEXT(e, t)) ? r ? 1 : 0 : r)) : GL.recordError(1281)
}

function _emscripten_glGetQueryObjectivEXT(e, t, r) {
    r ? (e = GL.timerQueriesEXT[e], e = GLctx.disjointTimerQueryExt.getQueryObjectEXT(e, t), HEAP32[r >> 2] = "boolean" == typeof e ? e ? 1 : 0 : e) : GL.recordError(1281)
}

function _emscripten_glGetQueryObjectui64vEXT(e, t, r) {
    r ? (e = GL.timerQueriesEXT[e], writeI53ToI64(r, "boolean" == typeof(r = GLctx.disjointTimerQueryExt.getQueryObjectEXT(e, t)) ? r ? 1 : 0 : r)) : GL.recordError(1281)
}

function _emscripten_glGetQueryObjectuivEXT(e, t, r) {
    r ? (e = GL.timerQueriesEXT[e], e = GLctx.disjointTimerQueryExt.getQueryObjectEXT(e, t), HEAP32[r >> 2] = "boolean" == typeof e ? e ? 1 : 0 : e) : GL.recordError(1281)
}

function _emscripten_glGetQueryivEXT(e, t, r) {
    r ? HEAP32[r >> 2] = GLctx.disjointTimerQueryExt.getQueryEXT(e, t) : GL.recordError(1281)
}

function _emscripten_glGetRenderbufferParameteriv(e, t, r) {
    r ? HEAP32[r >> 2] = GLctx.getRenderbufferParameter(e, t) : GL.recordError(1281)
}

function _emscripten_glGetShaderInfoLog(e, t, r, n) {
    e = GLctx.getShaderInfoLog(GL.shaders[e]), null === e && (e = "(unknown error)"), e = 0 < t && n ? stringToUTF8(e, n, t) : 0;
    r && (HEAP32[r >> 2] = e)
}

function _emscripten_glGetShaderPrecisionFormat(e, t, r, n) {
    e = GLctx.getShaderPrecisionFormat(e, t);
    HEAP32[r >> 2] = e.rangeMin, HEAP32[r + 4 >> 2] = e.rangeMax, HEAP32[n >> 2] = e.precision
}

function _emscripten_glGetShaderSource(e, t, r, n) {
    var e = GLctx.getShaderSource(GL.shaders[e]);
    e && (e = 0 < t && n ? stringToUTF8(e, n, t) : 0, r) && (HEAP32[r >> 2] = e)
}

function _emscripten_glGetShaderiv(e, t, r) {
    var n;
    r ? 35716 == t ? (n = (n = null === (n = GLctx.getShaderInfoLog(GL.shaders[e])) ? "(unknown error)" : n) ? n.length + 1 : 0, HEAP32[r >> 2] = n) : 35720 == t ? (n = (n = GLctx.getShaderSource(GL.shaders[e])) ? n.length + 1 : 0, HEAP32[r >> 2] = n) : HEAP32[r >> 2] = GLctx.getShaderParameter(GL.shaders[e], t) : GL.recordError(1281)
}

function stringToNewUTF8(e) {
    var t = lengthBytesUTF8(e) + 1,
        r = _malloc(t);
    return stringToUTF8(e, r, t), r
}

function _emscripten_glGetString(e) {
    if (GL.stringCache[e]) return GL.stringCache[e];
    switch (e) {
        case 7939:
            var t = GLctx.getSupportedExtensions() || [],
                r = stringToNewUTF8((t = t.concat(t.map(function(e) {
                    return "GL_" + e
                }))).join(" "));
            break;
        case 7936:
        case 7937:
        case 37445:
        case 37446:
            t = GLctx.getParameter(e);
            t || GL.recordError(1280), r = stringToNewUTF8(t);
            break;
        case 7938:
            r = stringToNewUTF8("OpenGL ES 2.0 (" + GLctx.getParameter(7938) + ")");
            break;
        case 35724:
            var t = GLctx.getParameter(35724),
                n = t.match(/^WebGL GLSL ES ([0-9]\.[0-9][0-9]?)(?:$| .*)/);
            null !== n && (3 == n[1].length && (n[1] = n[1] + "0"), t = "OpenGL ES GLSL ES " + n[1] + " (" + t + ")"), r = stringToNewUTF8(t);
            break;
        default:
            return GL.recordError(1280), 0
    }
    return GL.stringCache[e] = r
}

function _emscripten_glGetTexParameterfv(e, t, r) {
    r ? HEAPF32[r >> 2] = GLctx.getTexParameter(e, t) : GL.recordError(1281)
}

function _emscripten_glGetTexParameteriv(e, t, r) {
    r ? HEAP32[r >> 2] = GLctx.getTexParameter(e, t) : GL.recordError(1281)
}

function jstoi_q(e) {
    return parseInt(e)
}

function _emscripten_glGetUniformLocation(e, t) {
    var r = 0,
        n = ("]" == (t = UTF8ToString(t))[t.length - 1] && (n = t.lastIndexOf("["), r = "]" != t[n + 1] ? jstoi_q(t.slice(n + 1)) : 0, t = t.slice(0, n)), GL.programInfos[e] && GL.programInfos[e].uniforms[t]);
    return n && 0 <= r && r < n[0] ? n[1] + r : -1
}

function emscriptenWebGLGetUniform(e, t, r, n) {
    if (r) {
        var i = GLctx.getUniform(GL.programs[e], GL.uniforms[t]);
        if ("number" == typeof i || "boolean" == typeof i) switch (n) {
            case 0:
                HEAP32[r >> 2] = i;
                break;
            case 2:
                HEAPF32[r >> 2] = i
        } else
            for (var o = 0; o < i.length; o++) switch (n) {
                case 0:
                    HEAP32[r + 4 * o >> 2] = i[o];
                    break;
                case 2:
                    HEAPF32[r + 4 * o >> 2] = i[o]
            }
    } else GL.recordError(1281)
}

function _emscripten_glGetUniformfv(e, t, r) {
    emscriptenWebGLGetUniform(e, t, r, 2)
}

function _emscripten_glGetUniformiv(e, t, r) {
    emscriptenWebGLGetUniform(e, t, r, 0)
}

function _emscripten_glGetVertexAttribPointerv(e, t, r) {
    r ? HEAP32[r >> 2] = GLctx.getVertexAttribOffset(e, t) : GL.recordError(1281)
}

function emscriptenWebGLGetVertexAttrib(e, t, r, n) {
    if (r) {
        var i = GLctx.getVertexAttrib(e, t);
        if (34975 == t) HEAP32[r >> 2] = i && i.name;
        else if ("number" == typeof i || "boolean" == typeof i) switch (n) {
            case 0:
                HEAP32[r >> 2] = i;
                break;
            case 2:
                HEAPF32[r >> 2] = i;
                break;
            case 5:
                HEAP32[r >> 2] = Math.fround(i)
        } else
            for (var o = 0; o < i.length; o++) switch (n) {
                case 0:
                    HEAP32[r + 4 * o >> 2] = i[o];
                    break;
                case 2:
                    HEAPF32[r + 4 * o >> 2] = i[o];
                    break;
                case 5:
                    HEAP32[r + 4 * o >> 2] = Math.fround(i[o])
            }
    } else GL.recordError(1281)
}

function _emscripten_glGetVertexAttribfv(e, t, r) {
    emscriptenWebGLGetVertexAttrib(e, t, r, 2)
}

function _emscripten_glGetVertexAttribiv(e, t, r) {
    emscriptenWebGLGetVertexAttrib(e, t, r, 5)
}

function _emscripten_glHint(e, t) {
    GLctx.hint(e, t)
}

function _emscripten_glIsBuffer(e) {
    e = GL.buffers[e];
    return e ? GLctx.isBuffer(e) : 0
}

function _emscripten_glIsEnabled(e) {
    return GLctx.isEnabled(e)
}

function _emscripten_glIsFramebuffer(e) {
    e = GL.framebuffers[e];
    return e ? GLctx.isFramebuffer(e) : 0
}

function _emscripten_glIsProgram(e) {
    return (e = GL.programs[e]) ? GLctx.isProgram(e) : 0
}

function _emscripten_glIsQueryEXT(e) {
    e = GL.timerQueriesEXT[e];
    return e ? GLctx.disjointTimerQueryExt.isQueryEXT(e) : 0
}

function _emscripten_glIsRenderbuffer(e) {
    e = GL.renderbuffers[e];
    return e ? GLctx.isRenderbuffer(e) : 0
}

function _emscripten_glIsShader(e) {
    e = GL.shaders[e];
    return e ? GLctx.isShader(e) : 0
}

function _emscripten_glIsTexture(e) {
    e = GL.textures[e];
    return e ? GLctx.isTexture(e) : 0
}

function _emscripten_glIsVertexArrayOES(e) {
    e = GL.vaos[e];
    return e ? GLctx.isVertexArray(e) : 0
}

function _emscripten_glLineWidth(e) {
    GLctx.lineWidth(e)
}

function _emscripten_glLinkProgram(e) {
    GLctx.linkProgram(GL.programs[e]), GL.populateUniformTable(e)
}

function _emscripten_glPixelStorei(e, t) {
    3317 == e && (GL.unpackAlignment = t), GLctx.pixelStorei(e, t)
}

function _emscripten_glPolygonOffset(e, t) {
    GLctx.polygonOffset(e, t)
}

function _emscripten_glQueryCounterEXT(e, t) {
    GLctx.disjointTimerQueryExt.queryCounterEXT(GL.timerQueriesEXT[e], t)
}

function computeUnpackAlignedImageSize(e, t, r, n) {
    return t * (e * r + n - 1 & -n)
}

function __colorChannelsInGlTextureFormat(e) {
    return {
        5: 3,
        6: 4,
        8: 2,
        29502: 3,
        29504: 4
    } [e - 6402] || 1
}

function heapObjectForWebGLType(e) {
    return 1 == (e -= 5120) ? HEAPU8 : 4 == e ? HEAP32 : 6 == e ? HEAPF32 : 5 == e || 28922 == e ? HEAPU32 : HEAPU16
}

function heapAccessShiftForWebGLHeap(e) {
    return 31 - Math.clz32(e.BYTES_PER_ELEMENT)
}

function emscriptenWebGLGetTexPixelData(e, t, r, n, i, o) {
    var e = heapObjectForWebGLType(e),
        a = heapAccessShiftForWebGLHeap(e),
        s = 1 << a,
        r = computeUnpackAlignedImageSize(r, n, __colorChannelsInGlTextureFormat(t) * s, GL.unpackAlignment);
    return e.subarray(i >> a, i + r >> a)
}

function _emscripten_glReadPixels(e, t, r, n, i, o, a) {
    a = emscriptenWebGLGetTexPixelData(o, i, r, n, a, i);
    a ? GLctx.readPixels(e, t, r, n, i, o, a) : GL.recordError(1280)
}

function _emscripten_glReleaseShaderCompiler() {}

function _emscripten_glRenderbufferStorage(e, t, r, n) {
    GLctx.renderbufferStorage(e, t, r, n)
}

function _emscripten_glSampleCoverage(e, t) {
    GLctx.sampleCoverage(e, !!t)
}

function _emscripten_glScissor(e, t, r, n) {
    GLctx.scissor(e, t, r, n)
}

function _emscripten_glShaderBinary() {
    GL.recordError(1280)
}

function _emscripten_glShaderSource(e, t, r, n) {
    t = GL.getSource(e, t, r, n);
    GLctx.shaderSource(GL.shaders[e], t)
}

function _emscripten_glStencilFunc(e, t, r) {
    GLctx.stencilFunc(e, t, r)
}

function _emscripten_glStencilFuncSeparate(e, t, r, n) {
    GLctx.stencilFuncSeparate(e, t, r, n)
}

function _emscripten_glStencilMask(e) {
    GLctx.stencilMask(e)
}

function _emscripten_glStencilMaskSeparate(e, t) {
    GLctx.stencilMaskSeparate(e, t)
}

function _emscripten_glStencilOp(e, t, r) {
    GLctx.stencilOp(e, t, r)
}

function _emscripten_glStencilOpSeparate(e, t, r, n) {
    GLctx.stencilOpSeparate(e, t, r, n)
}

function _emscripten_glTexImage2D(e, t, r, n, i, o, a, s, l) {
    GLctx.texImage2D(e, t, r, n, i, o, a, s, l ? emscriptenWebGLGetTexPixelData(s, a, n, i, l, r) : null)
}

function _emscripten_glTexParameterf(e, t, r) {
    GLctx.texParameterf(e, t, r)
}

function _emscripten_glTexParameterfv(e, t, r) {
    r = HEAPF32[r >> 2];
    GLctx.texParameterf(e, t, r)
}

function _emscripten_glTexParameteri(e, t, r) {
    GLctx.texParameteri(e, t, r)
}

function _emscripten_glTexParameteriv(e, t, r) {
    r = HEAP32[r >> 2];
    GLctx.texParameteri(e, t, r)
}

function _emscripten_glTexSubImage2D(e, t, r, n, i, o, a, s, l) {
    var c = null;
    l && (c = emscriptenWebGLGetTexPixelData(s, a, i, o, l, 0)), GLctx.texSubImage2D(e, t, r, n, i, o, a, s, c)
}

function _emscripten_glUniform1f(e, t) {
    GLctx.uniform1f(GL.uniforms[e], t)
}
var miniTempWebGLFloatBuffers = [];

function _emscripten_glUniform1fv(e, t, r) {
    if (t <= 288)
        for (var n = miniTempWebGLFloatBuffers[t - 1], i = 0; i < t; ++i) n[i] = HEAPF32[r + 4 * i >> 2];
    else n = HEAPF32.subarray(r >> 2, r + 4 * t >> 2);
    GLctx.uniform1fv(GL.uniforms[e], n)
}

function _emscripten_glUniform1i(e, t) {
    GLctx.uniform1i(GL.uniforms[e], t)
}
var __miniTempWebGLIntBuffers = [];

function _emscripten_glUniform1iv(e, t, r) {
    if (t <= 288)
        for (var n = __miniTempWebGLIntBuffers[t - 1], i = 0; i < t; ++i) n[i] = HEAP32[r + 4 * i >> 2];
    else n = HEAP32.subarray(r >> 2, r + 4 * t >> 2);
    GLctx.uniform1iv(GL.uniforms[e], n)
}

function _emscripten_glUniform2f(e, t, r) {
    GLctx.uniform2f(GL.uniforms[e], t, r)
}

function _emscripten_glUniform2fv(e, t, r) {
    if (t <= 144)
        for (var n = miniTempWebGLFloatBuffers[2 * t - 1], i = 0; i < 2 * t; i += 2) n[i] = HEAPF32[r + 4 * i >> 2], n[i + 1] = HEAPF32[r + (4 * i + 4) >> 2];
    else n = HEAPF32.subarray(r >> 2, r + 8 * t >> 2);
    GLctx.uniform2fv(GL.uniforms[e], n)
}

function _emscripten_glUniform2i(e, t, r) {
    GLctx.uniform2i(GL.uniforms[e], t, r)
}

function _emscripten_glUniform2iv(e, t, r) {
    if (t <= 144)
        for (var n = __miniTempWebGLIntBuffers[2 * t - 1], i = 0; i < 2 * t; i += 2) n[i] = HEAP32[r + 4 * i >> 2], n[i + 1] = HEAP32[r + (4 * i + 4) >> 2];
    else n = HEAP32.subarray(r >> 2, r + 8 * t >> 2);
    GLctx.uniform2iv(GL.uniforms[e], n)
}

function _emscripten_glUniform3f(e, t, r, n) {
    GLctx.uniform3f(GL.uniforms[e], t, r, n)
}

function _emscripten_glUniform3fv(e, t, r) {
    if (t <= 96)
        for (var n = miniTempWebGLFloatBuffers[3 * t - 1], i = 0; i < 3 * t; i += 3) n[i] = HEAPF32[r + 4 * i >> 2], n[i + 1] = HEAPF32[r + (4 * i + 4) >> 2], n[i + 2] = HEAPF32[r + (4 * i + 8) >> 2];
    else n = HEAPF32.subarray(r >> 2, r + 12 * t >> 2);
    GLctx.uniform3fv(GL.uniforms[e], n)
}

function _emscripten_glUniform3i(e, t, r, n) {
    GLctx.uniform3i(GL.uniforms[e], t, r, n)
}

function _emscripten_glUniform3iv(e, t, r) {
    if (t <= 96)
        for (var n = __miniTempWebGLIntBuffers[3 * t - 1], i = 0; i < 3 * t; i += 3) n[i] = HEAP32[r + 4 * i >> 2], n[i + 1] = HEAP32[r + (4 * i + 4) >> 2], n[i + 2] = HEAP32[r + (4 * i + 8) >> 2];
    else n = HEAP32.subarray(r >> 2, r + 12 * t >> 2);
    GLctx.uniform3iv(GL.uniforms[e], n)
}

function _emscripten_glUniform4f(e, t, r, n, i) {
    GLctx.uniform4f(GL.uniforms[e], t, r, n, i)
}

function _emscripten_glUniform4fv(e, t, r) {
    if (t <= 72) {
        var n = miniTempWebGLFloatBuffers[4 * t - 1],
            i = HEAPF32;
        r >>= 2;
        for (var o = 0; o < 4 * t; o += 4) {
            var a = r + o;
            n[o] = i[a], n[o + 1] = i[a + 1], n[o + 2] = i[a + 2], n[o + 3] = i[a + 3]
        }
    } else n = HEAPF32.subarray(r >> 2, r + 16 * t >> 2);
    GLctx.uniform4fv(GL.uniforms[e], n)
}

function _emscripten_glUniform4i(e, t, r, n, i) {
    GLctx.uniform4i(GL.uniforms[e], t, r, n, i)
}

function _emscripten_glUniform4iv(e, t, r) {
    if (t <= 72)
        for (var n = __miniTempWebGLIntBuffers[4 * t - 1], i = 0; i < 4 * t; i += 4) n[i] = HEAP32[r + 4 * i >> 2], n[i + 1] = HEAP32[r + (4 * i + 4) >> 2], n[i + 2] = HEAP32[r + (4 * i + 8) >> 2], n[i + 3] = HEAP32[r + (4 * i + 12) >> 2];
    else n = HEAP32.subarray(r >> 2, r + 16 * t >> 2);
    GLctx.uniform4iv(GL.uniforms[e], n)
}

function _emscripten_glUniformMatrix2fv(e, t, r, n) {
    if (t <= 72)
        for (var i = miniTempWebGLFloatBuffers[4 * t - 1], o = 0; o < 4 * t; o += 4) i[o] = HEAPF32[n + 4 * o >> 2], i[o + 1] = HEAPF32[n + (4 * o + 4) >> 2], i[o + 2] = HEAPF32[n + (4 * o + 8) >> 2], i[o + 3] = HEAPF32[n + (4 * o + 12) >> 2];
    else i = HEAPF32.subarray(n >> 2, n + 16 * t >> 2);
    GLctx.uniformMatrix2fv(GL.uniforms[e], !!r, i)
}

function _emscripten_glUniformMatrix3fv(e, t, r, n) {
    if (t <= 32)
        for (var i = miniTempWebGLFloatBuffers[9 * t - 1], o = 0; o < 9 * t; o += 9) i[o] = HEAPF32[n + 4 * o >> 2], i[o + 1] = HEAPF32[n + (4 * o + 4) >> 2], i[o + 2] = HEAPF32[n + (4 * o + 8) >> 2], i[o + 3] = HEAPF32[n + (4 * o + 12) >> 2], i[o + 4] = HEAPF32[n + (4 * o + 16) >> 2], i[o + 5] = HEAPF32[n + (4 * o + 20) >> 2], i[o + 6] = HEAPF32[n + (4 * o + 24) >> 2], i[o + 7] = HEAPF32[n + (4 * o + 28) >> 2], i[o + 8] = HEAPF32[n + (4 * o + 32) >> 2];
    else i = HEAPF32.subarray(n >> 2, n + 36 * t >> 2);
    GLctx.uniformMatrix3fv(GL.uniforms[e], !!r, i)
}

function _emscripten_glUniformMatrix4fv(e, t, r, n) {
    if (t <= 18) {
        var i = miniTempWebGLFloatBuffers[16 * t - 1],
            o = HEAPF32;
        n >>= 2;
        for (var a = 0; a < 16 * t; a += 16) {
            var s = n + a;
            i[a] = o[s], i[a + 1] = o[s + 1], i[a + 2] = o[s + 2], i[a + 3] = o[s + 3], i[a + 4] = o[s + 4], i[a + 5] = o[s + 5], i[a + 6] = o[s + 6], i[a + 7] = o[s + 7], i[a + 8] = o[s + 8], i[a + 9] = o[s + 9], i[a + 10] = o[s + 10], i[a + 11] = o[s + 11], i[a + 12] = o[s + 12], i[a + 13] = o[s + 13], i[a + 14] = o[s + 14], i[a + 15] = o[s + 15]
        }
    } else i = HEAPF32.subarray(n >> 2, n + 64 * t >> 2);
    GLctx.uniformMatrix4fv(GL.uniforms[e], !!r, i)
}

function _emscripten_glUseProgram(e) {
    GLctx.useProgram(GL.programs[e])
}

function _emscripten_glValidateProgram(e) {
    GLctx.validateProgram(GL.programs[e])
}

function _emscripten_glVertexAttrib1f(e, t) {
    GLctx.vertexAttrib1f(e, t)
}

function _emscripten_glVertexAttrib1fv(e, t) {
    GLctx.vertexAttrib1f(e, HEAPF32[t >> 2])
}

function _emscripten_glVertexAttrib2f(e, t, r) {
    GLctx.vertexAttrib2f(e, t, r)
}

function _emscripten_glVertexAttrib2fv(e, t) {
    GLctx.vertexAttrib2f(e, HEAPF32[t >> 2], HEAPF32[t + 4 >> 2])
}

function _emscripten_glVertexAttrib3f(e, t, r, n) {
    GLctx.vertexAttrib3f(e, t, r, n)
}

function _emscripten_glVertexAttrib3fv(e, t) {
    GLctx.vertexAttrib3f(e, HEAPF32[t >> 2], HEAPF32[t + 4 >> 2], HEAPF32[t + 8 >> 2])
}

function _emscripten_glVertexAttrib4f(e, t, r, n, i) {
    GLctx.vertexAttrib4f(e, t, r, n, i)
}

function _emscripten_glVertexAttrib4fv(e, t) {
    GLctx.vertexAttrib4f(e, HEAPF32[t >> 2], HEAPF32[t + 4 >> 2], HEAPF32[t + 8 >> 2], HEAPF32[t + 12 >> 2])
}

function _emscripten_glVertexAttribDivisorANGLE(e, t) {
    GLctx.vertexAttribDivisor(e, t)
}

function _emscripten_glVertexAttribPointer(e, t, r, n, i, o) {
    GLctx.vertexAttribPointer(e, t, r, !!n, i, o)
}

function _emscripten_glViewport(e, t, r, n) {
    GLctx.viewport(e, t, r, n)
}

function _emscripten_has_asyncify() {
    return 1
}

function _longjmp(e, t) {
    throw _setThrew(e, t || 1), "longjmp"
}

function _emscripten_longjmp(e, t) {
    _longjmp(e, t)
}

function _emscripten_memcpy_big(e, t, r) {
    HEAPU8.copyWithin(e, t, t + r)
}

function __emscripten_do_request_fullscreen(e, t) {
    return JSEvents.fullscreenEnabled() ? (e = findEventTarget(e)) ? e.requestFullscreen || e.webkitRequestFullscreen ? JSEvents.canPerformEventHandlerRequests() ? _JSEvents_requestFullscreen(e, t) : t.deferUntilInEventHandler ? (JSEvents.deferCall(_JSEvents_requestFullscreen, 1, [e, t]), 1) : -2 : -3 : -4 : -1
}

function _emscripten_request_fullscreen_strategy(e, t, r) {
    return __emscripten_do_request_fullscreen(e, {
        scaleMode: HEAP32[r >> 2],
        canvasResolutionScaleMode: HEAP32[r + 4 >> 2],
        filteringMode: HEAP32[r + 8 >> 2],
        deferUntilInEventHandler: t,
        canvasResizedCallback: HEAP32[r + 12 >> 2],
        canvasResizedCallbackUserData: HEAP32[r + 16 >> 2]
    })
}

function _emscripten_request_pointerlock(e, t) {
    return (e = findEventTarget(e)) ? e.requestPointerLock || e.msRequestPointerLock ? JSEvents.canPerformEventHandlerRequests() ? __requestPointerLock(e) : t ? (JSEvents.deferCall(__requestPointerLock, 2, [e]), 1) : -2 : -1 : -4
}

function _emscripten_get_heap_size() {
    return HEAPU8.length
}

function emscripten_realloc_buffer(e) {
    try {
        return wasmMemory.grow(e - buffer.byteLength + 65535 >>> 16), updateGlobalBufferAndViews(wasmMemory.buffer), 1
    } catch (e) {}
}

function _emscripten_resize_heap(e) {
    e >>>= 0;
    var t = _emscripten_get_heap_size(),
        r = 2147483648;
    if (!(r < e))
        for (var n = 1; n <= 4; n *= 2) {
            var i = t * (1 + .2 / n),
                i = Math.min(i, e + 100663296);
            if (emscripten_realloc_buffer(Math.min(r, alignUp(Math.max(16777216, e, i), 65536)))) return !0
        }
    return !1
}

function _emscripten_sample_gamepad_data() {
    return (JSEvents.lastGamepadState = navigator.getGamepads ? navigator.getGamepads() : navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : null) ? 0 : -1
}

function __registerBeforeUnloadEventCallback(e, r, t, n, i, o) {
    e = {
        target: findEventTarget(e),
        eventTypeString: o,
        callbackfunc: n,
        handlerFunc: function(e) {
            var e = e || event,
                t = dynCall_iiii(n, i, 0, r);
            if (t = t && UTF8ToString(t)) return e.preventDefault(), e.returnValue = t
        },
        useCapture: t
    };
    JSEvents.registerOrRemoveHandler(e)
}

function _emscripten_set_beforeunload_callback_on_thread(e, t, r) {
    return "undefined" == typeof onbeforeunload ? -1 : 1 !== r ? -5 : (__registerBeforeUnloadEventCallback(2, e, !0, t, 28, "beforeunload"), 0)
}

function __registerFocusEventCallback(e, i, t, o, a, r, n) {
    JSEvents.focusEvent || (JSEvents.focusEvent = _malloc(256));
    e = {
        target: findEventTarget(e),
        eventTypeString: r,
        callbackfunc: o,
        handlerFunc: function(e) {
            var e = e || event,
                t = JSEvents.getNodeNameForTarget(e.target),
                r = e.target.id || "",
                n = JSEvents.focusEvent;
            stringToUTF8(t, n + 0, 128), stringToUTF8(r, n + 128, 128), dynCall_iiii(o, a, n, i) && e.preventDefault()
        },
        useCapture: t
    };
    JSEvents.registerOrRemoveHandler(e)
}

function _emscripten_set_blur_callback_on_thread(e, t, r, n, i) {
    return __registerFocusEventCallback(e, t, r, n, 12, "blur", i), 0
}

function _emscripten_set_element_css_size(e, t, r) {
    return (e = findEventTarget(e)) ? (e.style.width = t + "px", e.style.height = r + "px", 0) : -4
}

function _emscripten_set_focus_callback_on_thread(e, t, r, n, i) {
    return __registerFocusEventCallback(e, t, r, n, 13, "focus", i), 0
}

function __fillFullscreenChangeEventData(e) {
    var t = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement,
        r = !!t,
        n = (HEAP32[e >> 2] = r, HEAP32[e + 4 >> 2] = JSEvents.fullscreenEnabled(), r ? t : JSEvents.previousFullscreenElement),
        i = JSEvents.getNodeNameForTarget(n),
        o = n && n.id ? n.id : "";
    stringToUTF8(i, e + 8, 128), stringToUTF8(o, e + 136, 128), HEAP32[e + 264 >> 2] = n ? n.clientWidth : 0, HEAP32[e + 268 >> 2] = n ? n.clientHeight : 0, HEAP32[e + 272 >> 2] = screen.width, HEAP32[e + 276 >> 2] = screen.height, r && (JSEvents.previousFullscreenElement = t)
}

function __registerFullscreenChangeEventCallback(e, r, t, n, i, o, a) {
    JSEvents.fullscreenChangeEvent || (JSEvents.fullscreenChangeEvent = _malloc(280));
    JSEvents.registerOrRemoveHandler({
        target: e,
        eventTypeString: o,
        callbackfunc: n,
        handlerFunc: function(e) {
            var e = e || event,
                t = JSEvents.fullscreenChangeEvent;
            __fillFullscreenChangeEventData(t), dynCall_iiii(n, i, t, r) && e.preventDefault()
        },
        useCapture: t
    })
}

function _emscripten_set_fullscreenchange_callback_on_thread(e, t, r, n, i) {
    return JSEvents.fullscreenEnabled() ? (e = findEventTarget(e)) ? (__registerFullscreenChangeEventCallback(e, t, r, n, 19, "fullscreenchange", i), __registerFullscreenChangeEventCallback(e, t, r, n, 19, "webkitfullscreenchange", i), 0) : -4 : -1
}

function __registerGamepadEventCallback(e, r, t, n, i, o, a) {
    JSEvents.gamepadEvent || (JSEvents.gamepadEvent = _malloc(1432));
    e = {
        target: findEventTarget(e),
        allowsDeferredCalls: !0,
        eventTypeString: o,
        callbackfunc: n,
        handlerFunc: function(e) {
            var e = e || event,
                t = JSEvents.gamepadEvent;
            __fillGamepadEventData(t, e.gamepad), dynCall_iiii(n, i, t, r) && e.preventDefault()
        },
        useCapture: t
    };
    JSEvents.registerOrRemoveHandler(e)
}

function _emscripten_set_gamepadconnected_callback_on_thread(e, t, r, n) {
    return navigator.getGamepads || navigator.webkitGetGamepads ? (__registerGamepadEventCallback(2, e, t, r, 26, "gamepadconnected", n), 0) : -1
}

function _emscripten_set_gamepaddisconnected_callback_on_thread(e, t, r, n) {
    return navigator.getGamepads || navigator.webkitGetGamepads ? (__registerGamepadEventCallback(2, e, t, r, 27, "gamepaddisconnected", n), 0) : -1
}

function __registerKeyEventCallback(e, n, t, i, o, r, a) {
    JSEvents.keyEvent || (JSEvents.keyEvent = _malloc(164));
    e = {
        target: findEventTarget(e),
        allowsDeferredCalls: !0,
        eventTypeString: r,
        callbackfunc: i,
        handlerFunc: function(e) {
            var t = JSEvents.keyEvent,
                r = t >> 2;
            HEAP32[r] = e.location, HEAP32[1 + r] = e.ctrlKey, HEAP32[2 + r] = e.shiftKey, HEAP32[3 + r] = e.altKey, HEAP32[4 + r] = e.metaKey, HEAP32[5 + r] = e.repeat, HEAP32[6 + r] = e.charCode, HEAP32[7 + r] = e.keyCode, HEAP32[8 + r] = e.which, stringToUTF8(e.key || "", t + 36, 32), stringToUTF8(e.code || "", t + 68, 32), stringToUTF8(e.char || "", t + 100, 32), stringToUTF8(e.locale || "", t + 132, 32), dynCall_iiii(i, o, t, n) && e.preventDefault()
        },
        useCapture: t
    };
    JSEvents.registerOrRemoveHandler(e)
}

function _emscripten_set_keydown_callback_on_thread(e, t, r, n, i) {
    return __registerKeyEventCallback(e, t, r, n, 2, "keydown", i), 0
}

function _emscripten_set_keypress_callback_on_thread(e, t, r, n, i) {
    return __registerKeyEventCallback(e, t, r, n, 1, "keypress", i), 0
}

function _emscripten_set_keyup_callback_on_thread(e, t, r, n, i) {
    return __registerKeyEventCallback(e, t, r, n, 3, "keyup", i), 0
}

function __fillMouseEventData(e, t, r) {
    e >>= 2, HEAP32[e] = t.screenX, HEAP32[1 + e] = t.screenY, HEAP32[2 + e] = t.clientX, HEAP32[3 + e] = t.clientY, HEAP32[4 + e] = t.ctrlKey, HEAP32[5 + e] = t.shiftKey, HEAP32[6 + e] = t.altKey, HEAP32[7 + e] = t.metaKey, HEAP16[2 * e + 16] = t.button, HEAP16[2 * e + 17] = t.buttons, HEAP32[9 + e] = t.movementX, HEAP32[10 + e] = t.movementY, r = __getBoundingClientRect(r);
    HEAP32[11 + e] = t.clientX - r.left, HEAP32[12 + e] = t.clientY - r.top
}

function __registerMouseEventCallback(t, r, e, n, i, o, a) {
    JSEvents.mouseEvent || (JSEvents.mouseEvent = _malloc(64));
    o = {
        target: t = findEventTarget(t),
        allowsDeferredCalls: "mousemove" != o && "mouseenter" != o && "mouseleave" != o,
        eventTypeString: o,
        callbackfunc: n,
        handlerFunc: function(e) {
            e = e || event;
            __fillMouseEventData(JSEvents.mouseEvent, e, t), dynCall_iiii(n, i, JSEvents.mouseEvent, r) && e.preventDefault()
        },
        useCapture: e
    };
    JSEvents.registerOrRemoveHandler(o)
}

function _emscripten_set_mousedown_callback_on_thread(e, t, r, n, i) {
    return __registerMouseEventCallback(e, t, r, n, 5, "mousedown", i), 0
}

function _emscripten_set_mouseenter_callback_on_thread(e, t, r, n, i) {
    return __registerMouseEventCallback(e, t, r, n, 33, "mouseenter", i), 0
}

function _emscripten_set_mouseleave_callback_on_thread(e, t, r, n, i) {
    return __registerMouseEventCallback(e, t, r, n, 34, "mouseleave", i), 0
}

function _emscripten_set_mousemove_callback_on_thread(e, t, r, n, i) {
    return __registerMouseEventCallback(e, t, r, n, 8, "mousemove", i), 0
}

function _emscripten_set_mouseup_callback_on_thread(e, t, r, n, i) {
    return __registerMouseEventCallback(e, t, r, n, 6, "mouseup", i), 0
}

function __fillPointerlockChangeEventData(e) {
    var t = document.pointerLockElement || document.mozPointerLockElement || document.webkitPointerLockElement || document.msPointerLockElement,
        r = (HEAP32[e >> 2] = !!t, JSEvents.getNodeNameForTarget(t)),
        t = t && t.id ? t.id : "";
    stringToUTF8(r, e + 4, 128), stringToUTF8(t, e + 132, 128)
}

function __registerPointerlockChangeEventCallback(e, r, t, n, i, o, a) {
    JSEvents.pointerlockChangeEvent || (JSEvents.pointerlockChangeEvent = _malloc(260));
    JSEvents.registerOrRemoveHandler({
        target: e,
        eventTypeString: o,
        callbackfunc: n,
        handlerFunc: function(e) {
            var e = e || event,
                t = JSEvents.pointerlockChangeEvent;
            __fillPointerlockChangeEventData(t), dynCall_iiii(n, i, t, r) && e.preventDefault()
        },
        useCapture: t
    })
}

function _emscripten_set_pointerlockchange_callback_on_thread(e, t, r, n, i) {
    return document && document.body && (document.body.requestPointerLock || document.body.mozRequestPointerLock || document.body.webkitRequestPointerLock || document.body.msRequestPointerLock) ? (e = findEventTarget(e)) ? (__registerPointerlockChangeEventCallback(e, t, r, n, 20, "pointerlockchange", i), __registerPointerlockChangeEventCallback(e, t, r, n, 20, "mozpointerlockchange", i), __registerPointerlockChangeEventCallback(e, t, r, n, 20, "webkitpointerlockchange", i), __registerPointerlockChangeEventCallback(e, t, r, n, 20, "mspointerlockchange", i), 0) : -4 : -1
}

function __registerUiEventCallback(n, i, e, o, a, t, r) {
    JSEvents.uiEvent || (JSEvents.uiEvent = _malloc(36));
    t = {
        target: n = findEventTarget(n),
        eventTypeString: t,
        callbackfunc: o,
        handlerFunc: function(e) {
            var t, r, e = e || event;
            e.target == n && (t = JSEvents.uiEvent, r = document.body, HEAP32[t >> 2] = e.detail, HEAP32[t + 4 >> 2] = r.clientWidth, HEAP32[t + 8 >> 2] = r.clientHeight, HEAP32[t + 12 >> 2] = innerWidth, HEAP32[t + 16 >> 2] = innerHeight, HEAP32[t + 20 >> 2] = outerWidth, HEAP32[t + 24 >> 2] = outerHeight, HEAP32[t + 28 >> 2] = pageXOffset, HEAP32[t + 32 >> 2] = pageYOffset, dynCall_iiii(o, a, t, i)) && e.preventDefault()
        },
        useCapture: e
    };
    JSEvents.registerOrRemoveHandler(t)
}

function _emscripten_set_resize_callback_on_thread(e, t, r, n, i) {
    return __registerUiEventCallback(e, t, r, n, 10, "resize", i), 0
}

function __registerTouchEventCallback(u, d, e, _, f, t, r) {
    JSEvents.touchEvent || (JSEvents.touchEvent = _malloc(1684));
    t = {
        target: u = findEventTarget(u),
        allowsDeferredCalls: "touchstart" == t || "touchend" == t,
        eventTypeString: t,
        callbackfunc: _,
        handlerFunc: function(e) {
            for (var t = {}, r = e.touches, n = 0; n < r.length; ++n) t[(i = r[n]).identifier] = i;
            for (var i, r = e.changedTouches, n = 0; n < r.length; ++n)(i = r[n]).isChanged = 1, t[i.identifier] = i;
            r = e.targetTouches;
            for (n = 0; n < r.length; ++n) t[r[n].identifier].onTarget = 1;
            var o = JSEvents.touchEvent,
                a = o >> 2,
                s = (HEAP32[a + 1] = e.ctrlKey, HEAP32[a + 2] = e.shiftKey, HEAP32[a + 3] = e.altKey, HEAP32[a + 4] = e.metaKey, a += 5, __getBoundingClientRect(u)),
                l = 0;
            for (n in t) {
                var c = t[n];
                if (HEAP32[a + 0] = c.identifier, HEAP32[a + 1] = c.screenX, HEAP32[a + 2] = c.screenY, HEAP32[a + 3] = c.clientX, HEAP32[a + 4] = c.clientY, HEAP32[a + 5] = c.pageX, HEAP32[a + 6] = c.pageY, HEAP32[a + 7] = c.isChanged, HEAP32[a + 8] = c.onTarget, HEAP32[a + 9] = c.clientX - s.left, HEAP32[a + 10] = c.clientY - s.top, a += 13, 31 < ++l) break
            }
            HEAP32[o >> 2] = l, dynCall_iiii(_, f, o, d) && e.preventDefault()
        },
        useCapture: e
    };
    JSEvents.registerOrRemoveHandler(t)
}

function _emscripten_set_touchcancel_callback_on_thread(e, t, r, n, i) {
    return __registerTouchEventCallback(e, t, r, n, 25, "touchcancel", i), 0
}

function _emscripten_set_touchend_callback_on_thread(e, t, r, n, i) {
    return __registerTouchEventCallback(e, t, r, n, 23, "touchend", i), 0
}

function _emscripten_set_touchmove_callback_on_thread(e, t, r, n, i) {
    return __registerTouchEventCallback(e, t, r, n, 24, "touchmove", i), 0
}

function _emscripten_set_touchstart_callback_on_thread(e, t, r, n, i) {
    return __registerTouchEventCallback(e, t, r, n, 22, "touchstart", i), 0
}

function __fillVisibilityChangeEventData(e) {
    var t = ["hidden", "visible", "prerender", "unloaded"].indexOf(document.visibilityState);
    HEAP32[e >> 2] = document.hidden, HEAP32[e + 4 >> 2] = t
}

function __registerVisibilityChangeEventCallback(e, r, t, n, i, o, a) {
    JSEvents.visibilityChangeEvent || (JSEvents.visibilityChangeEvent = _malloc(8));
    JSEvents.registerOrRemoveHandler({
        target: e,
        eventTypeString: o,
        callbackfunc: n,
        handlerFunc: function(e) {
            var e = e || event,
                t = JSEvents.visibilityChangeEvent;
            __fillVisibilityChangeEventData(t), dynCall_iiii(n, i, t, r) && e.preventDefault()
        },
        useCapture: t
    })
}

function _emscripten_set_visibilitychange_callback_on_thread(e, t, r, n) {
    return specialHTMLTargets[1] ? (__registerVisibilityChangeEventCallback(specialHTMLTargets[1], e, t, r, 21, "visibilitychange", n), 0) : -4
}

function __registerWheelEventCallback(r, n, e, i, o, t, a) {
    JSEvents.wheelEvent || (JSEvents.wheelEvent = _malloc(96));
    JSEvents.registerOrRemoveHandler({
        target: r,
        allowsDeferredCalls: !0,
        eventTypeString: t,
        callbackfunc: i,
        handlerFunc: function(e) {
            var e = e || event,
                t = JSEvents.wheelEvent;
            __fillMouseEventData(t, e, r), HEAPF64[t + 64 >> 3] = e.deltaX, HEAPF64[t + 72 >> 3] = e.deltaY, HEAPF64[t + 80 >> 3] = e.deltaZ, HEAP32[t + 88 >> 2] = e.deltaMode, dynCall_iiii(i, o, t, n) && e.preventDefault()
        },
        useCapture: e
    })
}

function _emscripten_set_wheel_callback_on_thread(e, t, r, n, i) {
    return void 0 !== (e = findEventTarget(e)).onwheel ? (__registerWheelEventCallback(e, t, r, n, 9, "wheel", i), 0) : -1
}

function _emscripten_sleep(t) {
    Asyncify.handleSleep(function(e) {
        Browser.safeSetTimeout(e, t)
    })
}
var ENV = {};

function getExecutableName() {
    return thisProgram || "./this.program"
}

function getEnvStrings() {
    if (!getEnvStrings.strings) {
        var e = {
            USER: "web_user",
            LOGNAME: "web_user",
            PATH: "/",
            PWD: "/",
            HOME: "/home/web_user",
            LANG: ("object" == typeof navigator && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8",
            _: getExecutableName()
        };
        for (t in ENV) e[t] = ENV[t];
        var t, r = [];
        for (t in e) r.push(t + "=" + e[t]);
        getEnvStrings.strings = r
    }
    return getEnvStrings.strings
}

function _environ_get(n, i) {
    var o = 0;
    return getEnvStrings().forEach(function(e, t) {
        var r = i + o;
        writeAsciiToMemory(e, HEAP32[n + 4 * t >> 2] = r), o += e.length + 1
    }), 0
}

function _environ_sizes_get(e, t) {
    var r = getEnvStrings(),
        n = (HEAP32[e >> 2] = r.length, 0);
    return r.forEach(function(e) {
        n += e.length + 1
    }), HEAP32[t >> 2] = n, 0
}

function _exit(e) {
    exit(e)
}

function _fd_close(e) {
    try {
        var t = SYSCALLS.getStreamFromFD(e);
        return FS.close(t), 0
    } catch (e) {
        return void 0 !== FS && e instanceof FS.ErrnoError || abort(e), e.errno
    }
}

function _fd_fdstat_get(e, t) {
    try {
        var r = SYSCALLS.getStreamFromFD(e),
            n = r.tty ? 2 : FS.isDir(r.mode) ? 3 : FS.isLink(r.mode) ? 7 : 4;
        return HEAP8[t >> 0] = n, 0
    } catch (e) {
        return void 0 !== FS && e instanceof FS.ErrnoError || abort(e), e.errno
    }
}

function _fd_read(e, t, r, n) {
    try {
        var i = SYSCALLS.getStreamFromFD(e),
            o = SYSCALLS.doReadv(i, t, r);
        return HEAP32[n >> 2] = o, 0
    } catch (e) {
        return void 0 !== FS && e instanceof FS.ErrnoError || abort(e), e.errno
    }
}

function _fd_seek(e, t, r, n, i) {
    try {
        var o = SYSCALLS.getStreamFromFD(e),
            a = 4294967296 * r + (t >>> 0),
            s = 9007199254740992;
        return a <= -s || s <= a ? -61 : (FS.llseek(o, a, n), tempI64 = [o.position >>> 0, (tempDouble = o.position, 1 <= +Math_abs(tempDouble) ? 0 < tempDouble ? (0 | Math_min(+Math_floor(tempDouble / 4294967296), 4294967295)) >>> 0 : ~~+Math_ceil((tempDouble - (~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[i >> 2] = tempI64[0], HEAP32[i + 4 >> 2] = tempI64[1], o.getdents && 0 == a && 0 === n && (o.getdents = null), 0)
    } catch (e) {
        return void 0 !== FS && e instanceof FS.ErrnoError || abort(e), e.errno
    }
}

function _fd_write(e, t, r, n) {
    try {
        var i = SYSCALLS.getStreamFromFD(e),
            o = SYSCALLS.doWritev(i, t, r);
        return HEAP32[n >> 2] = o, 0
    } catch (e) {
        return void 0 !== FS && e instanceof FS.ErrnoError || abort(e), e.errno
    }
}

function _getTempRet0() {
    return 0 | getTempRet0()
}

function _gettimeofday(e) {
    var t = Date.now();
    return HEAP32[e >> 2] = t / 1e3 | 0, HEAP32[e + 4 >> 2] = t % 1e3 * 1e3 | 0, 0
}
stringToUTF8("GMT", 3362496, 4);
var ___tm_timezone = 3362496;

function _gmtime_r(e, t) {
    var e = new Date(1e3 * HEAP32[e >> 2]),
        r = (HEAP32[t >> 2] = e.getUTCSeconds(), HEAP32[t + 4 >> 2] = e.getUTCMinutes(), HEAP32[t + 8 >> 2] = e.getUTCHours(), HEAP32[t + 12 >> 2] = e.getUTCDate(), HEAP32[t + 16 >> 2] = e.getUTCMonth(), HEAP32[t + 20 >> 2] = e.getUTCFullYear() - 1900, HEAP32[t + 24 >> 2] = e.getUTCDay(), HEAP32[t + 36 >> 2] = 0, HEAP32[t + 32 >> 2] = 0, Date.UTC(e.getUTCFullYear(), 0, 1, 0, 0, 0, 0)),
        e = (e.getTime() - r) / 864e5 | 0;
    return HEAP32[t + 28 >> 2] = e, HEAP32[t + 40 >> 2] = ___tm_timezone, t
}

function _usleep(e) {
    for (var t = _emscripten_get_now(); _emscripten_get_now() - t < e / 1e3;);
}

function _nanosleep(e, t) {
    var r;
    return 0 === e || (r = HEAP32[e >> 2], (e = HEAP32[e + 4 >> 2]) < 0) || 999999999 < e || r < 0 ? (setErrNo(28), -1) : (0 !== t && (HEAP32[t >> 2] = 0, HEAP32[t + 4 >> 2] = 0), _usleep(1e6 * r + e / 1e3))
}

function _setTempRet0(e) {
    setTempRet0(0 | e)
}

function _sigaction(e, t, r) {
    return 0
}
var __sigalrm_handler = 0;

function _signal(e, t) {
    return 14 == e && (__sigalrm_handler = t), 0
}

function __isLeapYear(e) {
    return e % 4 == 0 && (e % 100 != 0 || e % 400 == 0)
}

function __arraySum(e, t) {
    for (var r = 0, n = 0; n <= t; r += e[n++]);
    return r
}
var __MONTH_DAYS_LEAP = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    __MONTH_DAYS_REGULAR = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function __addDays(e, t) {
    for (var r = new Date(e.getTime()); 0 < t;) {
        var n = __isLeapYear(r.getFullYear()),
            i = r.getMonth(),
            n = (n ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR)[i];
        if (!(t > n - r.getDate())) return r.setDate(r.getDate() + t), r;
        t -= n - r.getDate() + 1, r.setDate(1), i < 11 ? r.setMonth(i + 1) : (r.setMonth(0), r.setFullYear(r.getFullYear() + 1))
    }
    return r
}

function _strftime(e, t, r, n) {
    var i = HEAP32[n + 40 >> 2],
        o = {
            tm_sec: HEAP32[n >> 2],
            tm_min: HEAP32[n + 4 >> 2],
            tm_hour: HEAP32[n + 8 >> 2],
            tm_mday: HEAP32[n + 12 >> 2],
            tm_mon: HEAP32[n + 16 >> 2],
            tm_year: HEAP32[n + 20 >> 2],
            tm_wday: HEAP32[n + 24 >> 2],
            tm_yday: HEAP32[n + 28 >> 2],
            tm_isdst: HEAP32[n + 32 >> 2],
            tm_gmtoff: HEAP32[n + 36 >> 2],
            tm_zone: i ? UTF8ToString(i) : ""
        },
        a = UTF8ToString(r),
        s = {
            "%c": "%a %b %d %H:%M:%S %Y",
            "%D": "%m/%d/%y",
            "%F": "%Y-%m-%d",
            "%h": "%b",
            "%r": "%I:%M:%S %p",
            "%R": "%H:%M",
            "%T": "%H:%M:%S",
            "%x": "%m/%d/%y",
            "%X": "%H:%M:%S",
            "%Ec": "%c",
            "%EC": "%C",
            "%Ex": "%m/%d/%y",
            "%EX": "%H:%M:%S",
            "%Ey": "%y",
            "%EY": "%Y",
            "%Od": "%d",
            "%Oe": "%e",
            "%OH": "%H",
            "%OI": "%I",
            "%Om": "%m",
            "%OM": "%M",
            "%OS": "%S",
            "%Ou": "%u",
            "%OU": "%U",
            "%OV": "%V",
            "%Ow": "%w",
            "%OW": "%W",
            "%Oy": "%y"
        };
    for (p in s) a = a.replace(new RegExp(p, "g"), s[p]);
    var l = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        c = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    function u(e, t, r) {
        for (var n = "number" == typeof e ? e.toString() : e || ""; n.length < t;) n = r[0] + n;
        return n
    }

    function d(e, t) {
        return u(e, t, "0")
    }

    function _(e, t) {
        function r(e) {
            return e < 0 ? -1 : 0 < e ? 1 : 0
        }
        var n;
        return n = 0 === (n = r(e.getFullYear() - t.getFullYear())) && 0 === (n = r(e.getMonth() - t.getMonth())) ? r(e.getDate() - t.getDate()) : n
    }

    function f(e) {
        switch (e.getDay()) {
            case 0:
                return new Date(e.getFullYear() - 1, 11, 29);
            case 1:
                return e;
            case 2:
                return new Date(e.getFullYear(), 0, 3);
            case 3:
                return new Date(e.getFullYear(), 0, 2);
            case 4:
                return new Date(e.getFullYear(), 0, 1);
            case 5:
                return new Date(e.getFullYear() - 1, 11, 31);
            case 6:
                return new Date(e.getFullYear() - 1, 11, 30)
        }
    }

    function m(e) {
        var e = __addDays(new Date(e.tm_year + 1900, 0, 1), e.tm_yday),
            t = new Date(e.getFullYear(), 0, 4),
            r = new Date(e.getFullYear() + 1, 0, 4),
            t = f(t),
            r = f(r);
        return _(t, e) <= 0 ? _(r, e) <= 0 ? e.getFullYear() + 1 : e.getFullYear() : e.getFullYear() - 1
    }
    var p, g = {
        "%a": function(e) {
            return l[e.tm_wday].substring(0, 3)
        },
        "%A": function(e) {
            return l[e.tm_wday]
        },
        "%b": function(e) {
            return c[e.tm_mon].substring(0, 3)
        },
        "%B": function(e) {
            return c[e.tm_mon]
        },
        "%C": function(e) {
            return d((e.tm_year + 1900) / 100 | 0, 2)
        },
        "%d": function(e) {
            return d(e.tm_mday, 2)
        },
        "%e": function(e) {
            return u(e.tm_mday, 2, " ")
        },
        "%g": function(e) {
            return m(e).toString().substring(2)
        },
        "%G": m,
        "%H": function(e) {
            return d(e.tm_hour, 2)
        },
        "%I": function(e) {
            e = e.tm_hour;
            return 0 == e ? e = 12 : 12 < e && (e -= 12), d(e, 2)
        },
        "%j": function(e) {
            return d(e.tm_mday + __arraySum(__isLeapYear(e.tm_year + 1900) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, e.tm_mon - 1), 3)
        },
        "%m": function(e) {
            return d(e.tm_mon + 1, 2)
        },
        "%M": function(e) {
            return d(e.tm_min, 2)
        },
        "%n": function() {
            return "\n"
        },
        "%p": function(e) {
            return 0 <= e.tm_hour && e.tm_hour < 12 ? "AM" : "PM"
        },
        "%S": function(e) {
            return d(e.tm_sec, 2)
        },
        "%t": function() {
            return "\t"
        },
        "%u": function(e) {
            return e.tm_wday || 7
        },
        "%U": function(e) {
            var t, r = new Date(e.tm_year + 1900, 0, 1),
                n = 0 === r.getDay() ? r : __addDays(r, 7 - r.getDay()),
                e = new Date(e.tm_year + 1900, e.tm_mon, e.tm_mday);
            return _(n, e) < 0 ? (t = __arraySum(__isLeapYear(e.getFullYear()) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, e.getMonth() - 1) - 31, t = 31 - n.getDate() + t + e.getDate(), d(Math.ceil(t / 7), 2)) : 0 === _(n, r) ? "01" : "00"
        },
        "%V": function(e) {
            var t = new Date(e.tm_year + 1900, 0, 4),
                r = new Date(e.tm_year + 1901, 0, 4),
                t = f(t),
                r = f(r),
                n = __addDays(new Date(e.tm_year + 1900, 0, 1), e.tm_yday);
            return _(n, t) < 0 ? "53" : _(r, n) <= 0 ? "01" : (r = t.getFullYear() < e.tm_year + 1900 ? e.tm_yday + 32 - t.getDate() : e.tm_yday + 1 - t.getDate(), d(Math.ceil(r / 7), 2))
        },
        "%w": function(e) {
            return e.tm_wday
        },
        "%W": function(e) {
            var t, r = new Date(e.tm_year, 0, 1),
                n = 1 === r.getDay() ? r : __addDays(r, 0 === r.getDay() ? 1 : 7 - r.getDay() + 1),
                e = new Date(e.tm_year + 1900, e.tm_mon, e.tm_mday);
            return _(n, e) < 0 ? (t = __arraySum(__isLeapYear(e.getFullYear()) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, e.getMonth() - 1) - 31, t = 31 - n.getDate() + t + e.getDate(), d(Math.ceil(t / 7), 2)) : 0 === _(n, r) ? "01" : "00"
        },
        "%y": function(e) {
            return (e.tm_year + 1900).toString().substring(2)
        },
        "%Y": function(e) {
            return e.tm_year + 1900
        },
        "%z": function(e) {
            var t = 0 <= (e = e.tm_gmtoff),
                e = Math.abs(e) / 60;
            return (t ? "+" : "-") + String("0000" + (e / 60 * 100 + e % 60)).slice(-4)
        },
        "%Z": function(e) {
            return e.tm_zone
        },
        "%%": function() {
            return "%"
        }
    };
    for (p in g) 0 <= a.indexOf(p) && (a = a.replace(new RegExp(p, "g"), g[p](o)));
    n = intArrayFromString(a, !1);
    return n.length > t ? 0 : (writeArrayToMemory(n, e), n.length - 1)
}

function _strftime_l(e, t, r, n) {
    return _strftime(e, t, r, n)
}

function _time(e) {
    var t = Date.now() / 1e3 | 0;
    return e && (HEAP32[e >> 2] = t), t
}
var readAsmConstArgsArray = [];

function readAsmConstArgs(e, t) {
    for (readAsmConstArgsArray.length = 0, t >>= 2; r = HEAPU8[e++];) {
        var r = r < 105;
        r && 1 & t && t++, readAsmConstArgsArray.push(r ? HEAPF64[t++ >> 1] : HEAP32[t]), ++t
    }
    return readAsmConstArgsArray
}

function runAndAbortIfError(e) {
    try {
        return e()
    } catch (e) {
        abort(e)
    }
}
var GLctx, Asyncify = {
        State: {
            Normal: 0,
            Unwinding: 1,
            Rewinding: 2
        },
        state: 0,
        StackSize: 4096,
        currData: null,
        handleSleepReturnValue: 0,
        exportCallStack: [],
        callStackNameToId: {},
        callStackIdToFunc: {},
        callStackId: 0,
        afterUnwind: null,
        asyncFinalizers: [],
        sleepCallbacks: [],
        getCallStackId: function(e) {
            var t = Asyncify.callStackNameToId[e];
            return void 0 === t && (t = Asyncify.callStackId++, Asyncify.callStackNameToId[e] = t, Asyncify.callStackIdToFunc[t] = Module.asm[e]), t
        },
        instrumentWasmExports: function(r) {
            var e, n = {};
            for (e in r)(e => {
                var t = r[e];
                n[e] = "function" == typeof t ? function() {
                    Asyncify.exportCallStack.push(e);
                    try {
                        return t.apply(null, arguments)
                    } finally {
                        if (ABORT) return;
                        assert(Asyncify.exportCallStack.pop(e) === e), Asyncify.currData && Asyncify.state === Asyncify.State.Unwinding && 0 === Asyncify.exportCallStack.length && (Asyncify.state = Asyncify.State.Normal, runAndAbortIfError(Module._asyncify_stop_unwind), "undefined" != typeof Fibers && Fibers.trampoline(), Asyncify.afterUnwind) && (Asyncify.afterUnwind(), Asyncify.afterUnwind = null)
                    }
                } : t
            })(e);
            return n
        },
        allocateData: function() {
            var e = _malloc(12 + Asyncify.StackSize);
            return Asyncify.setDataHeader(e, e + 12, Asyncify.StackSize), Asyncify.setDataRewindFunc(e), e
        },
        setDataHeader: function(e, t, r) {
            HEAP32[e >> 2] = t, HEAP32[e + 4 >> 2] = t + r
        },
        setDataRewindFunc: function(e) {
            var t = Asyncify.exportCallStack[0],
                t = Asyncify.getCallStackId(t);
            HEAP32[e + 8 >> 2] = t
        },
        getDataRewindFunc: function(e) {
            e = HEAP32[e + 8 >> 2];
            return Asyncify.callStackIdToFunc[e]
        },
        handleSleep: function(e) {
            var r, n;
            if (!ABORT) return noExitRuntime = !0, Asyncify.state === Asyncify.State.Normal ? (n = r = !1, e(function(e) {
                var t;
                ABORT || (Asyncify.handleSleepReturnValue = e || 0, r = !0, n && (Asyncify.state = Asyncify.State.Rewinding, runAndAbortIfError(function() {
                    Module._asyncify_start_rewind(Asyncify.currData)
                }), Browser.mainLoop.func && Browser.mainLoop.resume(), t = Asyncify.getDataRewindFunc(Asyncify.currData)(), Asyncify.currData || (e = Asyncify.asyncFinalizers, Asyncify.asyncFinalizers = [], e.forEach(function(e) {
                    e(t)
                }))))
            }), n = !0, r || (Asyncify.state = Asyncify.State.Unwinding, Asyncify.currData = Asyncify.allocateData(), runAndAbortIfError(function() {
                Module._asyncify_start_unwind(Asyncify.currData)
            }), Browser.mainLoop.func && Browser.mainLoop.pause())) : Asyncify.state === Asyncify.State.Rewinding ? (Asyncify.state = Asyncify.State.Normal, runAndAbortIfError(Module._asyncify_stop_rewind), _free(Asyncify.currData), Asyncify.currData = null, Asyncify.sleepCallbacks.forEach(function(e) {
                e()
            })) : abort("invalid state: " + Asyncify.state), Asyncify.handleSleepReturnValue
        },
        handleAsync: function(t) {
            return Asyncify.handleSleep(function(e) {
                t().then(e)
            })
        }
    },
    FSNode = function(e, t, r, n) {
        this.parent = e = e || this, this.mount = e.mount, this.mounted = null, this.id = FS.nextInode++, this.name = t, this.mode = r, this.node_ops = {}, this.stream_ops = {}, this.rdev = n
    },
    readMode = 365,
    writeMode = 146;
Object.defineProperties(FSNode.prototype, {
    read: {
        get: function() {
            return (this.mode & readMode) === readMode
        },
        set: function(e) {
            e ? this.mode |= readMode : this.mode &= ~readMode
        }
    },
    write: {
        get: function() {
            return (this.mode & writeMode) === writeMode
        },
        set: function(e) {
            e ? this.mode |= writeMode : this.mode &= ~writeMode
        }
    },
    isFolder: {
        get: function() {
            return FS.isDir(this.mode)
        }
    },
    isDevice: {
        get: function() {
            return FS.isChrdev(this.mode)
        }
    }
}), FS.FSNode = FSNode, FS.staticInit(), Module.requestFullscreen = function(e, t) {
    Browser.requestFullscreen(e, t)
}, Module.requestAnimationFrame = function(e) {
    Browser.requestAnimationFrame(e)
}, Module.setCanvasSize = function(e, t, r) {
    Browser.setCanvasSize(e, t, r)
}, Module.pauseMainLoop = function() {
    Browser.mainLoop.pause()
}, Module.resumeMainLoop = function() {
    Browser.mainLoop.resume()
}, Module.getUserMedia = function() {
    Browser.getUserMedia()
}, Module.createContext = function(e, t, r, n) {
    return Browser.createContext(e, t, r, n)
};
for (var i = 0; i < 32; ++i) tempFixedLengthArray.push(new Array(i));
for (var miniTempWebGLFloatBuffersStorage = new Float32Array(288), i = 0; i < 288; ++i) miniTempWebGLFloatBuffers[i] = miniTempWebGLFloatBuffersStorage.subarray(0, i + 1);
for (var __miniTempWebGLIntBuffersStorage = new Int32Array(288), i = 0; i < 288; ++i) __miniTempWebGLIntBuffers[i] = __miniTempWebGLIntBuffersStorage.subarray(0, i + 1);
var ASSERTIONS = !1;

function intArrayFromString(e, t, r) {
    r = 0 < r ? r : lengthBytesUTF8(e) + 1, r = new Array(r), e = stringToUTF8Array(e, r, 0, r.length);
    return t && (r.length = e), r
}
var calledRun, asmLibraryArg = {
        __assert_fail: ___assert_fail,
        __cxa_allocate_exception: ___cxa_allocate_exception,
        __cxa_atexit: ___cxa_atexit,
        __cxa_throw: ___cxa_throw,
        __map_file: ___map_file,
        __sys_access: ___sys_access,
        __sys_fcntl64: ___sys_fcntl64,
        __sys_fstat64: ___sys_fstat64,
        __sys_ftruncate64: ___sys_ftruncate64,
        __sys_getdents64: ___sys_getdents64,
        __sys_getpid: ___sys_getpid,
        __sys_ioctl: ___sys_ioctl,
        __sys_lstat64: ___sys_lstat64,
        __sys_mmap2: ___sys_mmap2,
        __sys_munmap: ___sys_munmap,
        __sys_open: ___sys_open,
        __sys_read: ___sys_read,
        __sys_rmdir: ___sys_rmdir,
        __sys_stat64: ___sys_stat64,
        __sys_unlink: ___sys_unlink,
        abort: _abort,
        atexit: _atexit,
        clock_gettime: _clock_gettime,
        dlclose: _dlclose,
        eglBindAPI: _eglBindAPI,
        eglChooseConfig: _eglChooseConfig,
        eglCreateContext: _eglCreateContext,
        eglCreateWindowSurface: _eglCreateWindowSurface,
        eglDestroyContext: _eglDestroyContext,
        eglDestroySurface: _eglDestroySurface,
        eglGetConfigAttrib: _eglGetConfigAttrib,
        eglGetDisplay: _eglGetDisplay,
        eglGetError: _eglGetError,
        eglGetProcAddress: _eglGetProcAddress,
        eglInitialize: _eglInitialize,
        eglMakeCurrent: _eglMakeCurrent,
        eglQueryString: _eglQueryString,
        eglSwapBuffers: _eglSwapBuffers,
        eglSwapInterval: _eglSwapInterval,
        eglTerminate: _eglTerminate,
        eglWaitGL: _eglWaitGL,
        eglWaitNative: _eglWaitNative,
        emscripten_asm_const_int: _emscripten_asm_const_int,
        emscripten_async_wget2: _emscripten_async_wget2,
        emscripten_exit_fullscreen: _emscripten_exit_fullscreen,
        emscripten_exit_pointerlock: _emscripten_exit_pointerlock,
        emscripten_get_device_pixel_ratio: _emscripten_get_device_pixel_ratio,
        emscripten_get_element_css_size: _emscripten_get_element_css_size,
        emscripten_get_gamepad_status: _emscripten_get_gamepad_status,
        emscripten_get_num_gamepads: _emscripten_get_num_gamepads,
        emscripten_get_sbrk_ptr: _emscripten_get_sbrk_ptr,
        emscripten_glActiveTexture: _emscripten_glActiveTexture,
        emscripten_glAttachShader: _emscripten_glAttachShader,
        emscripten_glBeginQueryEXT: _emscripten_glBeginQueryEXT,
        emscripten_glBindAttribLocation: _emscripten_glBindAttribLocation,
        emscripten_glBindBuffer: _emscripten_glBindBuffer,
        emscripten_glBindFramebuffer: _emscripten_glBindFramebuffer,
        emscripten_glBindRenderbuffer: _emscripten_glBindRenderbuffer,
        emscripten_glBindTexture: _emscripten_glBindTexture,
        emscripten_glBindVertexArrayOES: _emscripten_glBindVertexArrayOES,
        emscripten_glBlendColor: _emscripten_glBlendColor,
        emscripten_glBlendEquation: _emscripten_glBlendEquation,
        emscripten_glBlendEquationSeparate: _emscripten_glBlendEquationSeparate,
        emscripten_glBlendFunc: _emscripten_glBlendFunc,
        emscripten_glBlendFuncSeparate: _emscripten_glBlendFuncSeparate,
        emscripten_glBufferData: _emscripten_glBufferData,
        emscripten_glBufferSubData: _emscripten_glBufferSubData,
        emscripten_glCheckFramebufferStatus: _emscripten_glCheckFramebufferStatus,
        emscripten_glClear: _emscripten_glClear,
        emscripten_glClearColor: _emscripten_glClearColor,
        emscripten_glClearDepthf: _emscripten_glClearDepthf,
        emscripten_glClearStencil: _emscripten_glClearStencil,
        emscripten_glColorMask: _emscripten_glColorMask,
        emscripten_glCompileShader: _emscripten_glCompileShader,
        emscripten_glCompressedTexImage2D: _emscripten_glCompressedTexImage2D,
        emscripten_glCompressedTexSubImage2D: _emscripten_glCompressedTexSubImage2D,
        emscripten_glCopyTexImage2D: _emscripten_glCopyTexImage2D,
        emscripten_glCopyTexSubImage2D: _emscripten_glCopyTexSubImage2D,
        emscripten_glCreateProgram: _emscripten_glCreateProgram,
        emscripten_glCreateShader: _emscripten_glCreateShader,
        emscripten_glCullFace: _emscripten_glCullFace,
        emscripten_glDeleteBuffers: _emscripten_glDeleteBuffers,
        emscripten_glDeleteFramebuffers: _emscripten_glDeleteFramebuffers,
        emscripten_glDeleteProgram: _emscripten_glDeleteProgram,
        emscripten_glDeleteQueriesEXT: _emscripten_glDeleteQueriesEXT,
        emscripten_glDeleteRenderbuffers: _emscripten_glDeleteRenderbuffers,
        emscripten_glDeleteShader: _emscripten_glDeleteShader,
        emscripten_glDeleteTextures: _emscripten_glDeleteTextures,
        emscripten_glDeleteVertexArraysOES: _emscripten_glDeleteVertexArraysOES,
        emscripten_glDepthFunc: _emscripten_glDepthFunc,
        emscripten_glDepthMask: _emscripten_glDepthMask,
        emscripten_glDepthRangef: _emscripten_glDepthRangef,
        emscripten_glDetachShader: _emscripten_glDetachShader,
        emscripten_glDisable: _emscripten_glDisable,
        emscripten_glDisableVertexAttribArray: _emscripten_glDisableVertexAttribArray,
        emscripten_glDrawArrays: _emscripten_glDrawArrays,
        emscripten_glDrawArraysInstancedANGLE: _emscripten_glDrawArraysInstancedANGLE,
        emscripten_glDrawBuffersWEBGL: _emscripten_glDrawBuffersWEBGL,
        emscripten_glDrawElements: _emscripten_glDrawElements,
        emscripten_glDrawElementsInstancedANGLE: _emscripten_glDrawElementsInstancedANGLE,
        emscripten_glEnable: _emscripten_glEnable,
        emscripten_glEnableVertexAttribArray: _emscripten_glEnableVertexAttribArray,
        emscripten_glEndQueryEXT: _emscripten_glEndQueryEXT,
        emscripten_glFinish: _emscripten_glFinish,
        emscripten_glFlush: _emscripten_glFlush,
        emscripten_glFramebufferRenderbuffer: _emscripten_glFramebufferRenderbuffer,
        emscripten_glFramebufferTexture2D: _emscripten_glFramebufferTexture2D,
        emscripten_glFrontFace: _emscripten_glFrontFace,
        emscripten_glGenBuffers: _emscripten_glGenBuffers,
        emscripten_glGenFramebuffers: _emscripten_glGenFramebuffers,
        emscripten_glGenQueriesEXT: _emscripten_glGenQueriesEXT,
        emscripten_glGenRenderbuffers: _emscripten_glGenRenderbuffers,
        emscripten_glGenTextures: _emscripten_glGenTextures,
        emscripten_glGenVertexArraysOES: _emscripten_glGenVertexArraysOES,
        emscripten_glGenerateMipmap: _emscripten_glGenerateMipmap,
        emscripten_glGetActiveAttrib: _emscripten_glGetActiveAttrib,
        emscripten_glGetActiveUniform: _emscripten_glGetActiveUniform,
        emscripten_glGetAttachedShaders: _emscripten_glGetAttachedShaders,
        emscripten_glGetAttribLocation: _emscripten_glGetAttribLocation,
        emscripten_glGetBooleanv: _emscripten_glGetBooleanv,
        emscripten_glGetBufferParameteriv: _emscripten_glGetBufferParameteriv,
        emscripten_glGetError: _emscripten_glGetError,
        emscripten_glGetFloatv: _emscripten_glGetFloatv,
        emscripten_glGetFramebufferAttachmentParameteriv: _emscripten_glGetFramebufferAttachmentParameteriv,
        emscripten_glGetIntegerv: _emscripten_glGetIntegerv,
        emscripten_glGetProgramInfoLog: _emscripten_glGetProgramInfoLog,
        emscripten_glGetProgramiv: _emscripten_glGetProgramiv,
        emscripten_glGetQueryObjecti64vEXT: _emscripten_glGetQueryObjecti64vEXT,
        emscripten_glGetQueryObjectivEXT: _emscripten_glGetQueryObjectivEXT,
        emscripten_glGetQueryObjectui64vEXT: _emscripten_glGetQueryObjectui64vEXT,
        emscripten_glGetQueryObjectuivEXT: _emscripten_glGetQueryObjectuivEXT,
        emscripten_glGetQueryivEXT: _emscripten_glGetQueryivEXT,
        emscripten_glGetRenderbufferParameteriv: _emscripten_glGetRenderbufferParameteriv,
        emscripten_glGetShaderInfoLog: _emscripten_glGetShaderInfoLog,
        emscripten_glGetShaderPrecisionFormat: _emscripten_glGetShaderPrecisionFormat,
        emscripten_glGetShaderSource: _emscripten_glGetShaderSource,
        emscripten_glGetShaderiv: _emscripten_glGetShaderiv,
        emscripten_glGetString: _emscripten_glGetString,
        emscripten_glGetTexParameterfv: _emscripten_glGetTexParameterfv,
        emscripten_glGetTexParameteriv: _emscripten_glGetTexParameteriv,
        emscripten_glGetUniformLocation: _emscripten_glGetUniformLocation,
        emscripten_glGetUniformfv: _emscripten_glGetUniformfv,
        emscripten_glGetUniformiv: _emscripten_glGetUniformiv,
        emscripten_glGetVertexAttribPointerv: _emscripten_glGetVertexAttribPointerv,
        emscripten_glGetVertexAttribfv: _emscripten_glGetVertexAttribfv,
        emscripten_glGetVertexAttribiv: _emscripten_glGetVertexAttribiv,
        emscripten_glHint: _emscripten_glHint,
        emscripten_glIsBuffer: _emscripten_glIsBuffer,
        emscripten_glIsEnabled: _emscripten_glIsEnabled,
        emscripten_glIsFramebuffer: _emscripten_glIsFramebuffer,
        emscripten_glIsProgram: _emscripten_glIsProgram,
        emscripten_glIsQueryEXT: _emscripten_glIsQueryEXT,
        emscripten_glIsRenderbuffer: _emscripten_glIsRenderbuffer,
        emscripten_glIsShader: _emscripten_glIsShader,
        emscripten_glIsTexture: _emscripten_glIsTexture,
        emscripten_glIsVertexArrayOES: _emscripten_glIsVertexArrayOES,
        emscripten_glLineWidth: _emscripten_glLineWidth,
        emscripten_glLinkProgram: _emscripten_glLinkProgram,
        emscripten_glPixelStorei: _emscripten_glPixelStorei,
        emscripten_glPolygonOffset: _emscripten_glPolygonOffset,
        emscripten_glQueryCounterEXT: _emscripten_glQueryCounterEXT,
        emscripten_glReadPixels: _emscripten_glReadPixels,
        emscripten_glReleaseShaderCompiler: _emscripten_glReleaseShaderCompiler,
        emscripten_glRenderbufferStorage: _emscripten_glRenderbufferStorage,
        emscripten_glSampleCoverage: _emscripten_glSampleCoverage,
        emscripten_glScissor: _emscripten_glScissor,
        emscripten_glShaderBinary: _emscripten_glShaderBinary,
        emscripten_glShaderSource: _emscripten_glShaderSource,
        emscripten_glStencilFunc: _emscripten_glStencilFunc,
        emscripten_glStencilFuncSeparate: _emscripten_glStencilFuncSeparate,
        emscripten_glStencilMask: _emscripten_glStencilMask,
        emscripten_glStencilMaskSeparate: _emscripten_glStencilMaskSeparate,
        emscripten_glStencilOp: _emscripten_glStencilOp,
        emscripten_glStencilOpSeparate: _emscripten_glStencilOpSeparate,
        emscripten_glTexImage2D: _emscripten_glTexImage2D,
        emscripten_glTexParameterf: _emscripten_glTexParameterf,
        emscripten_glTexParameterfv: _emscripten_glTexParameterfv,
        emscripten_glTexParameteri: _emscripten_glTexParameteri,
        emscripten_glTexParameteriv: _emscripten_glTexParameteriv,
        emscripten_glTexSubImage2D: _emscripten_glTexSubImage2D,
        emscripten_glUniform1f: _emscripten_glUniform1f,
        emscripten_glUniform1fv: _emscripten_glUniform1fv,
        emscripten_glUniform1i: _emscripten_glUniform1i,
        emscripten_glUniform1iv: _emscripten_glUniform1iv,
        emscripten_glUniform2f: _emscripten_glUniform2f,
        emscripten_glUniform2fv: _emscripten_glUniform2fv,
        emscripten_glUniform2i: _emscripten_glUniform2i,
        emscripten_glUniform2iv: _emscripten_glUniform2iv,
        emscripten_glUniform3f: _emscripten_glUniform3f,
        emscripten_glUniform3fv: _emscripten_glUniform3fv,
        emscripten_glUniform3i: _emscripten_glUniform3i,
        emscripten_glUniform3iv: _emscripten_glUniform3iv,
        emscripten_glUniform4f: _emscripten_glUniform4f,
        emscripten_glUniform4fv: _emscripten_glUniform4fv,
        emscripten_glUniform4i: _emscripten_glUniform4i,
        emscripten_glUniform4iv: _emscripten_glUniform4iv,
        emscripten_glUniformMatrix2fv: _emscripten_glUniformMatrix2fv,
        emscripten_glUniformMatrix3fv: _emscripten_glUniformMatrix3fv,
        emscripten_glUniformMatrix4fv: _emscripten_glUniformMatrix4fv,
        emscripten_glUseProgram: _emscripten_glUseProgram,
        emscripten_glValidateProgram: _emscripten_glValidateProgram,
        emscripten_glVertexAttrib1f: _emscripten_glVertexAttrib1f,
        emscripten_glVertexAttrib1fv: _emscripten_glVertexAttrib1fv,
        emscripten_glVertexAttrib2f: _emscripten_glVertexAttrib2f,
        emscripten_glVertexAttrib2fv: _emscripten_glVertexAttrib2fv,
        emscripten_glVertexAttrib3f: _emscripten_glVertexAttrib3f,
        emscripten_glVertexAttrib3fv: _emscripten_glVertexAttrib3fv,
        emscripten_glVertexAttrib4f: _emscripten_glVertexAttrib4f,
        emscripten_glVertexAttrib4fv: _emscripten_glVertexAttrib4fv,
        emscripten_glVertexAttribDivisorANGLE: _emscripten_glVertexAttribDivisorANGLE,
        emscripten_glVertexAttribPointer: _emscripten_glVertexAttribPointer,
        emscripten_glViewport: _emscripten_glViewport,
        emscripten_has_asyncify: _emscripten_has_asyncify,
        emscripten_longjmp: _emscripten_longjmp,
        emscripten_memcpy_big: _emscripten_memcpy_big,
        emscripten_request_fullscreen_strategy: _emscripten_request_fullscreen_strategy,
        emscripten_request_pointerlock: _emscripten_request_pointerlock,
        emscripten_resize_heap: _emscripten_resize_heap,
        emscripten_sample_gamepad_data: _emscripten_sample_gamepad_data,
        emscripten_set_beforeunload_callback_on_thread: _emscripten_set_beforeunload_callback_on_thread,
        emscripten_set_blur_callback_on_thread: _emscripten_set_blur_callback_on_thread,
        emscripten_set_canvas_element_size: _emscripten_set_canvas_element_size,
        emscripten_set_element_css_size: _emscripten_set_element_css_size,
        emscripten_set_focus_callback_on_thread: _emscripten_set_focus_callback_on_thread,
        emscripten_set_fullscreenchange_callback_on_thread: _emscripten_set_fullscreenchange_callback_on_thread,
        emscripten_set_gamepadconnected_callback_on_thread: _emscripten_set_gamepadconnected_callback_on_thread,
        emscripten_set_gamepaddisconnected_callback_on_thread: _emscripten_set_gamepaddisconnected_callback_on_thread,
        emscripten_set_keydown_callback_on_thread: _emscripten_set_keydown_callback_on_thread,
        emscripten_set_keypress_callback_on_thread: _emscripten_set_keypress_callback_on_thread,
        emscripten_set_keyup_callback_on_thread: _emscripten_set_keyup_callback_on_thread,
        emscripten_set_mousedown_callback_on_thread: _emscripten_set_mousedown_callback_on_thread,
        emscripten_set_mouseenter_callback_on_thread: _emscripten_set_mouseenter_callback_on_thread,
        emscripten_set_mouseleave_callback_on_thread: _emscripten_set_mouseleave_callback_on_thread,
        emscripten_set_mousemove_callback_on_thread: _emscripten_set_mousemove_callback_on_thread,
        emscripten_set_mouseup_callback_on_thread: _emscripten_set_mouseup_callback_on_thread,
        emscripten_set_pointerlockchange_callback_on_thread: _emscripten_set_pointerlockchange_callback_on_thread,
        emscripten_set_resize_callback_on_thread: _emscripten_set_resize_callback_on_thread,
        emscripten_set_touchcancel_callback_on_thread: _emscripten_set_touchcancel_callback_on_thread,
        emscripten_set_touchend_callback_on_thread: _emscripten_set_touchend_callback_on_thread,
        emscripten_set_touchmove_callback_on_thread: _emscripten_set_touchmove_callback_on_thread,
        emscripten_set_touchstart_callback_on_thread: _emscripten_set_touchstart_callback_on_thread,
        emscripten_set_visibilitychange_callback_on_thread: _emscripten_set_visibilitychange_callback_on_thread,
        emscripten_set_wheel_callback_on_thread: _emscripten_set_wheel_callback_on_thread,
        emscripten_sleep: _emscripten_sleep,
        environ_get: _environ_get,
        environ_sizes_get: _environ_sizes_get,
        exit: _exit,
        fd_close: _fd_close,
        fd_fdstat_get: _fd_fdstat_get,
        fd_read: _fd_read,
        fd_seek: _fd_seek,
        fd_write: _fd_write,
        getTempRet0: _getTempRet0,
        gettimeofday: _gettimeofday,
        gmtime_r: _gmtime_r,
        invoke_ii: invoke_ii,
        invoke_iii: invoke_iii,
        invoke_iiii: invoke_iiii,
        invoke_iiiii: invoke_iiiii,
        invoke_iiiiiiiiii: invoke_iiiiiiiiii,
        invoke_vi: invoke_vi,
        invoke_vii: invoke_vii,
        invoke_viii: invoke_viii,
        invoke_viiii: invoke_viiii,
        invoke_viiiiiiiii: invoke_viiiiiiiii,
        memory: wasmMemory,
        nanosleep: _nanosleep,
        setTempRet0: _setTempRet0,
        sigaction: _sigaction,
        signal: _signal,
        strftime_l: _strftime_l,
        table: wasmTable,
        time: _time
    },
    asm = createWasm(),
    ___wasm_call_ctors = Module.___wasm_call_ctors = function() {
        return (___wasm_call_ctors = Module.___wasm_call_ctors = Module.asm.__wasm_call_ctors).apply(null, arguments)
    },
    _main = Module._main = function() {
        return (_main = Module._main = Module.asm.main).apply(null, arguments)
    },
    _memset = Module._memset = function() {
        return (_memset = Module._memset = Module.asm.memset).apply(null, arguments)
    },
    _memcpy = Module._memcpy = function() {
        return (_memcpy = Module._memcpy = Module.asm.memcpy).apply(null, arguments)
    },
    ___errno_location = Module.___errno_location = function() {
        return (___errno_location = Module.___errno_location = Module.asm.__errno_location).apply(null, arguments)
    },
    _malloc = Module._malloc = function() {
        return (_malloc = Module._malloc = Module.asm.malloc).apply(null, arguments)
    },
    _testSetjmp = Module._testSetjmp = function() {
        return (_testSetjmp = Module._testSetjmp = Module.asm.testSetjmp).apply(null, arguments)
    },
    _saveSetjmp = Module._saveSetjmp = function() {
        return (_saveSetjmp = Module._saveSetjmp = Module.asm.saveSetjmp).apply(null, arguments)
    },
    _free = Module._free = function() {
        return (_free = Module._free = Module.asm.free).apply(null, arguments)
    },
    _realloc = Module._realloc = function() {
        return (_realloc = Module._realloc = Module.asm.realloc).apply(null, arguments)
    },
    _strstr = Module._strstr = function() {
        return (_strstr = Module._strstr = Module.asm.strstr).apply(null, arguments)
    },
    _emscripten_GetProcAddress = Module._emscripten_GetProcAddress = function() {
        return (_emscripten_GetProcAddress = Module._emscripten_GetProcAddress = Module.asm.emscripten_GetProcAddress).apply(null, arguments)
    },
    __get_tzname = Module.__get_tzname = function() {
        return (__get_tzname = Module.__get_tzname = Module.asm._get_tzname).apply(null, arguments)
    },
    __get_daylight = Module.__get_daylight = function() {
        return (__get_daylight = Module.__get_daylight = Module.asm._get_daylight).apply(null, arguments)
    },
    __get_timezone = Module.__get_timezone = function() {
        return (__get_timezone = Module.__get_timezone = Module.asm._get_timezone).apply(null, arguments)
    },
    _setThrew = Module._setThrew = function() {
        return (_setThrew = Module._setThrew = Module.asm.setThrew).apply(null, arguments)
    },
    stackSave = Module.stackSave = function() {
        return (stackSave = Module.stackSave = Module.asm.stackSave).apply(null, arguments)
    },
    stackRestore = Module.stackRestore = function() {
        return (stackRestore = Module.stackRestore = Module.asm.stackRestore).apply(null, arguments)
    },
    stackAlloc = Module.stackAlloc = function() {
        return (stackAlloc = Module.stackAlloc = Module.asm.stackAlloc).apply(null, arguments)
    },
    _memalign = Module._memalign = function() {
        return (_memalign = Module._memalign = Module.asm.memalign).apply(null, arguments)
    },
    dynCall_vi = Module.dynCall_vi = function() {
        return (dynCall_vi = Module.dynCall_vi = Module.asm.dynCall_vi).apply(null, arguments)
    },
    dynCall_vii = Module.dynCall_vii = function() {
        return (dynCall_vii = Module.dynCall_vii = Module.asm.dynCall_vii).apply(null, arguments)
    },
    dynCall_viii = Module.dynCall_viii = function() {
        return (dynCall_viii = Module.dynCall_viii = Module.asm.dynCall_viii).apply(null, arguments)
    },
    dynCall_viiii = Module.dynCall_viiii = function() {
        return (dynCall_viiii = Module.dynCall_viiii = Module.asm.dynCall_viiii).apply(null, arguments)
    },
    dynCall_viiiiiiiii = Module.dynCall_viiiiiiiii = function() {
        return (dynCall_viiiiiiiii = Module.dynCall_viiiiiiiii = Module.asm.dynCall_viiiiiiiii).apply(null, arguments)
    },
    dynCall_ii = Module.dynCall_ii = function() {
        return (dynCall_ii = Module.dynCall_ii = Module.asm.dynCall_ii).apply(null, arguments)
    },
    dynCall_iii = Module.dynCall_iii = function() {
        return (dynCall_iii = Module.dynCall_iii = Module.asm.dynCall_iii).apply(null, arguments)
    },
    dynCall_iiii = Module.dynCall_iiii = function() {
        return (dynCall_iiii = Module.dynCall_iiii = Module.asm.dynCall_iiii).apply(null, arguments)
    },
    dynCall_iiiii = Module.dynCall_iiiii = function() {
        return (dynCall_iiiii = Module.dynCall_iiiii = Module.asm.dynCall_iiiii).apply(null, arguments)
    },
    dynCall_iiiiiiiiii = Module.dynCall_iiiiiiiiii = function() {
        return (dynCall_iiiiiiiiii = Module.dynCall_iiiiiiiiii = Module.asm.dynCall_iiiiiiiiii).apply(null, arguments)
    },
    dynCall_v = Module.dynCall_v = function() {
        return (dynCall_v = Module.dynCall_v = Module.asm.dynCall_v).apply(null, arguments)
    },
    dynCall_viiiii = Module.dynCall_viiiii = function() {
        return (dynCall_viiiii = Module.dynCall_viiiii = Module.asm.dynCall_viiiii).apply(null, arguments)
    },
    dynCall_fi = Module.dynCall_fi = function() {
        return (dynCall_fi = Module.dynCall_fi = Module.asm.dynCall_fi).apply(null, arguments)
    },
    dynCall_viijii = Module.dynCall_viijii = function() {
        return (dynCall_viijii = Module.dynCall_viijii = Module.asm.dynCall_viijii).apply(null, arguments)
    },
    dynCall_iiji = Module.dynCall_iiji = function() {
        return (dynCall_iiji = Module.dynCall_iiji = Module.asm.dynCall_iiji).apply(null, arguments)
    },
    dynCall_ji = Module.dynCall_ji = function() {
        return (dynCall_ji = Module.dynCall_ji = Module.asm.dynCall_ji).apply(null, arguments)
    },
    dynCall_jjii = Module.dynCall_jjii = function() {
        return (dynCall_jjii = Module.dynCall_jjii = Module.asm.dynCall_jjii).apply(null, arguments)
    },
    dynCall_jiji = Module.dynCall_jiji = function() {
        return (dynCall_jiji = Module.dynCall_jiji = Module.asm.dynCall_jiji).apply(null, arguments)
    },
    dynCall_viiiiii = Module.dynCall_viiiiii = function() {
        return (dynCall_viiiiii = Module.dynCall_viiiiii = Module.asm.dynCall_viiiiii).apply(null, arguments)
    },
    dynCall_iiiifii = Module.dynCall_iiiifii = function() {
        return (dynCall_iiiifii = Module.dynCall_iiiifii = Module.asm.dynCall_iiiifii).apply(null, arguments)
    },
    dynCall_vif = Module.dynCall_vif = function() {
        return (dynCall_vif = Module.dynCall_vif = Module.asm.dynCall_vif).apply(null, arguments)
    },
    dynCall_viif = Module.dynCall_viif = function() {
        return (dynCall_viif = Module.dynCall_viif = Module.asm.dynCall_viif).apply(null, arguments)
    },
    dynCall_viff = Module.dynCall_viff = function() {
        return (dynCall_viff = Module.dynCall_viff = Module.asm.dynCall_viff).apply(null, arguments)
    },
    dynCall_iiiiif = Module.dynCall_iiiiif = function() {
        return (dynCall_iiiiif = Module.dynCall_iiiiif = Module.asm.dynCall_iiiiif).apply(null, arguments)
    },
    dynCall_iiiiii = Module.dynCall_iiiiii = function() {
        return (dynCall_iiiiii = Module.dynCall_iiiiii = Module.asm.dynCall_iiiiii).apply(null, arguments)
    },
    dynCall_iiiiiidii = Module.dynCall_iiiiiidii = function() {
        return (dynCall_iiiiiidii = Module.dynCall_iiiiiidii = Module.asm.dynCall_iiiiiidii).apply(null, arguments)
    },
    dynCall_iiiiiiiii = Module.dynCall_iiiiiiiii = function() {
        return (dynCall_iiiiiiiii = Module.dynCall_iiiiiiiii = Module.asm.dynCall_iiiiiiiii).apply(null, arguments)
    },
    dynCall_viiiiiii = Module.dynCall_viiiiiii = function() {
        return (dynCall_viiiiiii = Module.dynCall_viiiiiii = Module.asm.dynCall_viiiiiii).apply(null, arguments)
    },
    dynCall_viiiiiiiiiii = Module.dynCall_viiiiiiiiiii = function() {
        return (dynCall_viiiiiiiiiii = Module.dynCall_viiiiiiiiiii = Module.asm.dynCall_viiiiiiiiiii).apply(null, arguments)
    },
    dynCall_iiiiiiii = Module.dynCall_iiiiiiii = function() {
        return (dynCall_iiiiiiii = Module.dynCall_iiiiiiii = Module.asm.dynCall_iiiiiiii).apply(null, arguments)
    },
    dynCall_i = Module.dynCall_i = function() {
        return (dynCall_i = Module.dynCall_i = Module.asm.dynCall_i).apply(null, arguments)
    },
    dynCall_iiiiiii = Module.dynCall_iiiiiii = function() {
        return (dynCall_iiiiiii = Module.dynCall_iiiiiii = Module.asm.dynCall_iiiiiii).apply(null, arguments)
    },
    dynCall_iiiiiiiiiii = Module.dynCall_iiiiiiiiiii = function() {
        return (dynCall_iiiiiiiiiii = Module.dynCall_iiiiiiiiiii = Module.asm.dynCall_iiiiiiiiiii).apply(null, arguments)
    },
    dynCall_viji = Module.dynCall_viji = function() {
        return (dynCall_viji = Module.dynCall_viji = Module.asm.dynCall_viji).apply(null, arguments)
    },
    dynCall_fii = Module.dynCall_fii = function() {
        return (dynCall_fii = Module.dynCall_fii = Module.asm.dynCall_fii).apply(null, arguments)
    },
    dynCall_jij = Module.dynCall_jij = function() {
        return (dynCall_jij = Module.dynCall_jij = Module.asm.dynCall_jij).apply(null, arguments)
    },
    dynCall_iij = Module.dynCall_iij = function() {
        return (dynCall_iij = Module.dynCall_iij = Module.asm.dynCall_iij).apply(null, arguments)
    },
    dynCall_jiij = Module.dynCall_jiij = function() {
        return (dynCall_jiij = Module.dynCall_jiij = Module.asm.dynCall_jiij).apply(null, arguments)
    },
    dynCall_viiid = Module.dynCall_viiid = function() {
        return (dynCall_viiid = Module.dynCall_viiid = Module.asm.dynCall_viiid).apply(null, arguments)
    },
    dynCall_viiif = Module.dynCall_viiif = function() {
        return (dynCall_viiif = Module.dynCall_viiif = Module.asm.dynCall_viiif).apply(null, arguments)
    },
    dynCall_iiid = Module.dynCall_iiid = function() {
        return (dynCall_iiid = Module.dynCall_iiid = Module.asm.dynCall_iiid).apply(null, arguments)
    },
    dynCall_iidiiii = Module.dynCall_iidiiii = function() {
        return (dynCall_iidiiii = Module.dynCall_iidiiii = Module.asm.dynCall_iidiiii).apply(null, arguments)
    },
    dynCall_iiiiij = Module.dynCall_iiiiij = function() {
        return (dynCall_iiiiij = Module.dynCall_iiiiij = Module.asm.dynCall_iiiiij).apply(null, arguments)
    },
    dynCall_iiiiid = Module.dynCall_iiiiid = function() {
        return (dynCall_iiiiid = Module.dynCall_iiiiid = Module.asm.dynCall_iiiiid).apply(null, arguments)
    },
    dynCall_iiiiijj = Module.dynCall_iiiiijj = function() {
        return (dynCall_iiiiijj = Module.dynCall_iiiiijj = Module.asm.dynCall_iiiiijj).apply(null, arguments)
    },
    dynCall_iiiiiijj = Module.dynCall_iiiiiijj = function() {
        return (dynCall_iiiiiijj = Module.dynCall_iiiiiijj = Module.asm.dynCall_iiiiiijj).apply(null, arguments)
    },
    dynCall_vffff = Module.dynCall_vffff = function() {
        return (dynCall_vffff = Module.dynCall_vffff = Module.asm.dynCall_vffff).apply(null, arguments)
    },
    dynCall_vf = Module.dynCall_vf = function() {
        return (dynCall_vf = Module.dynCall_vf = Module.asm.dynCall_vf).apply(null, arguments)
    },
    dynCall_viiiiiiii = Module.dynCall_viiiiiiii = function() {
        return (dynCall_viiiiiiii = Module.dynCall_viiiiiiii = Module.asm.dynCall_viiiiiiii).apply(null, arguments)
    },
    dynCall_vff = Module.dynCall_vff = function() {
        return (dynCall_vff = Module.dynCall_vff = Module.asm.dynCall_vff).apply(null, arguments)
    },
    dynCall_vfi = Module.dynCall_vfi = function() {
        return (dynCall_vfi = Module.dynCall_vfi = Module.asm.dynCall_vfi).apply(null, arguments)
    },
    dynCall_vifff = Module.dynCall_vifff = function() {
        return (dynCall_vifff = Module.dynCall_vifff = Module.asm.dynCall_vifff).apply(null, arguments)
    },
    dynCall_viffff = Module.dynCall_viffff = function() {
        return (dynCall_viffff = Module.dynCall_viffff = Module.asm.dynCall_viffff).apply(null, arguments)
    },
    __growWasmMemory = Module.__growWasmMemory = function() {
        return (__growWasmMemory = Module.__growWasmMemory = Module.asm.__growWasmMemory).apply(null, arguments)
    },
    _asyncify_start_unwind = Module._asyncify_start_unwind = function() {
        return (_asyncify_start_unwind = Module._asyncify_start_unwind = Module.asm.asyncify_start_unwind).apply(null, arguments)
    },
    _asyncify_stop_unwind = Module._asyncify_stop_unwind = function() {
        return (_asyncify_stop_unwind = Module._asyncify_stop_unwind = Module.asm.asyncify_stop_unwind).apply(null, arguments)
    },
    _asyncify_start_rewind = Module._asyncify_start_rewind = function() {
        return (_asyncify_start_rewind = Module._asyncify_start_rewind = Module.asm.asyncify_start_rewind).apply(null, arguments)
    },
    _asyncify_stop_rewind = Module._asyncify_stop_rewind = function() {
        return (_asyncify_stop_rewind = Module._asyncify_stop_rewind = Module.asm.asyncify_stop_rewind).apply(null, arguments)
    };

function invoke_iiiii(e, t, r, n, i) {
    var o = stackSave();
    try {
        return dynCall_iiiii(e, t, r, n, i)
    } catch (e) {
        if (stackRestore(o), e !== e + 0 && "longjmp" !== e) throw e;
        _setThrew(1, 0)
    }
}

function invoke_viii(e, t, r, n) {
    var i = stackSave();
    try {
        dynCall_viii(e, t, r, n)
    } catch (e) {
        if (stackRestore(i), e !== e + 0 && "longjmp" !== e) throw e;
        _setThrew(1, 0)
    }
}

function invoke_ii(e, t) {
    var r = stackSave();
    try {
        return dynCall_ii(e, t)
    } catch (e) {
        if (stackRestore(r), e !== e + 0 && "longjmp" !== e) throw e;
        _setThrew(1, 0)
    }
}

function invoke_iiii(e, t, r, n) {
    var i = stackSave();
    try {
        return dynCall_iiii(e, t, r, n)
    } catch (e) {
        if (stackRestore(i), e !== e + 0 && "longjmp" !== e) throw e;
        _setThrew(1, 0)
    }
}

function invoke_vi(e, t) {
    var r = stackSave();
    try {
        dynCall_vi(e, t)
    } catch (e) {
        if (stackRestore(r), e !== e + 0 && "longjmp" !== e) throw e;
        _setThrew(1, 0)
    }
}

function invoke_vii(e, t, r) {
    var n = stackSave();
    try {
        dynCall_vii(e, t, r)
    } catch (e) {
        if (stackRestore(n), e !== e + 0 && "longjmp" !== e) throw e;
        _setThrew(1, 0)
    }
}

function invoke_iiiiiiiiii(e, t, r, n, i, o, a, s, l, c) {
    var u = stackSave();
    try {
        return dynCall_iiiiiiiiii(e, t, r, n, i, o, a, s, l, c)
    } catch (e) {
        if (stackRestore(u), e !== e + 0 && "longjmp" !== e) throw e;
        _setThrew(1, 0)
    }
}

function invoke_viiii(e, t, r, n, i) {
    var o = stackSave();
    try {
        dynCall_viiii(e, t, r, n, i)
    } catch (e) {
        if (stackRestore(o), e !== e + 0 && "longjmp" !== e) throw e;
        _setThrew(1, 0)
    }
}

function invoke_viiiiiiiii(e, t, r, n, i, o, a, s, l, c) {
    var u = stackSave();
    try {
        dynCall_viiiiiiiii(e, t, r, n, i, o, a, s, l, c)
    } catch (e) {
        if (stackRestore(u), e !== e + 0 && "longjmp" !== e) throw e;
        _setThrew(1, 0)
    }
}

function invoke_iii(e, t, r) {
    var n = stackSave();
    try {
        return dynCall_iii(e, t, r)
    } catch (e) {
        if (stackRestore(n), e !== e + 0 && "longjmp" !== e) throw e;
        _setThrew(1, 0)
    }
}

function ExitStatus(e) {
    this.name = "ExitStatus", this.message = "Program terminated with exit(" + e + ")", this.status = e
}
var calledMain = !1;

function callMain(e) {
    var t = Module._main,
        r = (e = e || []).length + 1,
        n = stackAlloc(4 * (r + 1));
    HEAP32[n >> 2] = allocateUTF8OnStack(thisProgram);
    for (var i, o = 1; o < r; o++) HEAP32[(n >> 2) + o] = allocateUTF8OnStack(e[o - 1]);
    HEAP32[(n >> 2) + r] = 0;
    try {
        var a = t(r, n);
        noExitRuntime || exit(a, !0)
    } catch (e) {
        e instanceof ExitStatus || ("unwind" == e ? noExitRuntime = !0 : ((i = e) && "object" == typeof e && e.stack && (i = [e, e.stack]), err("exception thrown: " + i), quit_(1, e)))
    } finally {
        calledMain = !0
    }
}

function run(e) {
    function t() {
        calledRun || (calledRun = !0, Module.calledRun = !0, ABORT) || (initRuntime(), preMain(), Module.onRuntimeInitialized && Module.onRuntimeInitialized(), shouldRunNow && callMain(e), postRun())
    }
    e = e || arguments_, 0 < runDependencies || (preRun(), 0 < runDependencies) || (Module.setStatus ? (Module.setStatus("Running..."), setTimeout(function() {
        setTimeout(function() {
            Module.setStatus("")
        }, 1), t()
    }, 1)) : t())
}

function exit(e, t) {
    t && noExitRuntime && 0 === e || (noExitRuntime || (ABORT = !0, EXITSTATUS = e, exitRuntime(), Module.onExit && Module.onExit(e)), quit_(e, new ExitStatus(e)))
}
if (dependenciesFulfilled = function e() {
        calledRun || run(), calledRun || (dependenciesFulfilled = e)
    }, Module.run = run, Module.preInit)
    for ("function" == typeof Module.preInit && (Module.preInit = [Module.preInit]); 0 < Module.preInit.length;) Module.preInit.pop()();
var shouldRunNow = !0;
Module.noInitialRun && (shouldRunNow = !1), noExitRuntime = !0, run(), FS.mkdir("easyrpg"), FS.chdir("easyrpg"), 0 < Module.EASYRPG_GAME.length && (FS.mkdir(Module.EASYRPG_GAME), FS.chdir(Module.EASYRPG_GAME)), void 0 === Module.EASYRPG_FS && (Module.EASYRPG_FS = IDBFS);
