/**
 * @license
 * @builder.io/qwik 0.0.108
 * Copyright Builder.io, Inc. All Rights Reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/BuilderIO/qwik/blob/main/LICENSE
 */
const qDev$1 = globalThis.qDev === true;
const qSerialize = globalThis.qSerialize !== false;
const qDynamicPlatform = globalThis.qDynamicPlatform !== false;
const qTest = globalThis.qTest === true;
const seal = (obj) => {
  if (qDev$1) {
    Object.seal(obj);
  }
};
const EMPTY_ARRAY$1 = [];
const EMPTY_OBJ$1 = {};
if (qDev$1) {
  Object.freeze(EMPTY_ARRAY$1);
  Object.freeze(EMPTY_OBJ$1);
  Error.stackTraceLimit = 9999;
}
function isElement$1(value) {
  return isNode$1(value) && value.nodeType === 1;
}
function isNode$1(value) {
  return value && typeof value.nodeType === "number";
}
function assertDefined(value, text, ...parts) {
  if (qDev$1) {
    if (value != null)
      return;
    throw logErrorAndStop(text, ...parts);
  }
}
function assertEqual(value1, value2, text, ...parts) {
  if (qDev$1) {
    if (value1 === value2)
      return;
    throw logErrorAndStop(text, ...parts);
  }
}
function assertTrue(value1, text, ...parts) {
  if (qDev$1) {
    if (value1 === true)
      return;
    throw logErrorAndStop(text, ...parts);
  }
}
const isSerializableObject = (v) => {
  const proto = Object.getPrototypeOf(v);
  return proto === Object.prototype || proto === null;
};
const isObject = (v) => {
  return v && typeof v === "object";
};
const isArray = (v) => {
  return Array.isArray(v);
};
const isString = (v) => {
  return typeof v === "string";
};
const isFunction = (v) => {
  return typeof v === "function";
};
const OnRenderProp = "q:renderFn";
const ComponentStylesPrefixContent = "\u2B50\uFE0F";
const QSlot = "q:slot";
const QSlotRef = "q:sref";
const QSlotS = "q:s";
const QStyle = "q:style";
const QScopedStyle = "q:sstyle";
const QContainerAttr = "q:container";
const QContainerSelector = "[q\\:container]";
const RenderEvent = "qRender";
const ELEMENT_ID = "q:id";
const ELEMENT_ID_PREFIX = "#";
const getDocument = (node) => {
  if (typeof document !== "undefined") {
    return document;
  }
  if (node.nodeType === 9) {
    return node;
  }
  const doc = node.ownerDocument;
  assertDefined(doc, "doc must be defined");
  return doc;
};
let _context;
const tryGetInvokeContext = () => {
  if (!_context) {
    const context = typeof document !== "undefined" && document && document.__q_context__;
    if (!context) {
      return void 0;
    }
    if (isArray(context)) {
      return document.__q_context__ = newInvokeContextFromTuple(context);
    }
    return context;
  }
  return _context;
};
const getInvokeContext = () => {
  const ctx = tryGetInvokeContext();
  if (!ctx) {
    throw qError(QError_useMethodOutsideContext);
  }
  return ctx;
};
const useInvokeContext = () => {
  const ctx = getInvokeContext();
  if (ctx.$event$ !== RenderEvent) {
    throw qError(QError_useInvokeContext);
  }
  assertDefined(ctx.$hostElement$, `invoke: $hostElement$ must be defined`, ctx);
  assertDefined(ctx.$waitOn$, `invoke: $waitOn$ must be defined`, ctx);
  assertDefined(ctx.$renderCtx$, `invoke: $renderCtx$ must be defined`, ctx);
  assertDefined(ctx.$doc$, `invoke: $doc$ must be defined`, ctx);
  assertDefined(ctx.$subscriber$, `invoke: $subscriber$ must be defined`, ctx);
  return ctx;
};
const invoke = (context, fn, ...args) => {
  const previousContext = _context;
  let returnValue;
  try {
    _context = context;
    returnValue = fn.apply(null, args);
  } finally {
    _context = previousContext;
  }
  return returnValue;
};
const waitAndRun = (ctx, callback) => {
  const previousWait = ctx.$waitOn$.slice();
  ctx.$waitOn$.push(Promise.allSettled(previousWait).then(callback));
};
const newInvokeContextFromTuple = (context) => {
  const element = context[0];
  return newInvokeContext(getDocument(element), void 0, element, context[1], context[2]);
};
const newInvokeContext = (doc, hostElement, element, event, url) => {
  const ctx = {
    $seq$: 0,
    $doc$: doc,
    $hostElement$: hostElement,
    $element$: element,
    $event$: event,
    $url$: url,
    $qrl$: void 0,
    $props$: void 0,
    $renderCtx$: void 0,
    $subscriber$: void 0,
    $waitOn$: void 0
  };
  seal(ctx);
  return ctx;
};
const getWrappingContainer = (el) => {
  return el.closest(QContainerSelector);
};
const isNode = (value) => {
  return value && typeof value.nodeType === "number";
};
const isDocument = (value) => {
  return value && value.nodeType === 9;
};
const isElement = (value) => {
  return value.nodeType === 1;
};
const isQwikElement = (value) => {
  return isNode(value) && (value.nodeType === 1 || value.nodeType === 111);
};
const isVirtualElement = (value) => {
  return value.nodeType === 111;
};
const isText = (value) => {
  return value.nodeType === 3;
};
function assertQwikElement(el) {
  if (qDev$1) {
    if (!isQwikElement(el)) {
      throw new Error("Not a Qwik Element");
    }
  }
}
const isPromise = (value) => {
  return value instanceof Promise;
};
const safeCall = (call, thenFn, rejectFn) => {
  try {
    const promise = call();
    if (isPromise(promise)) {
      return promise.then(thenFn, rejectFn);
    } else {
      return thenFn(promise);
    }
  } catch (e) {
    return rejectFn(e);
  }
};
const then = (promise, thenFn) => {
  return isPromise(promise) ? promise.then(thenFn) : thenFn(promise);
};
const promiseAll = (promises) => {
  const hasPromise = promises.some(isPromise);
  if (hasPromise) {
    return Promise.all(promises);
  }
  return promises;
};
const isNotNullable = (v) => {
  return v != null;
};
const delay = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};
const createPlatform$1 = (doc) => {
  const moduleCache = /* @__PURE__ */ new Map();
  return {
    isServer: false,
    importSymbol(containerEl, url, symbolName) {
      const urlDoc = toUrl$1(doc, containerEl, url).toString();
      const urlCopy = new URL(urlDoc);
      urlCopy.hash = "";
      urlCopy.search = "";
      const importURL = urlCopy.href;
      const mod = moduleCache.get(importURL);
      if (mod) {
        return mod[symbolName];
      }
      return import(
        /* @vite-ignore */
        importURL
      ).then((mod2) => {
        mod2 = findModule(mod2);
        moduleCache.set(importURL, mod2);
        return mod2[symbolName];
      });
    },
    raf: (fn) => {
      return new Promise((resolve) => {
        requestAnimationFrame(() => {
          resolve(fn());
        });
      });
    },
    nextTick: (fn) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(fn());
        });
      });
    },
    chunkForSymbol() {
      return void 0;
    }
  };
};
const findModule = (module) => {
  return Object.values(module).find(isModule) || module;
};
const isModule = (module) => {
  return isObject(module) && module[Symbol.toStringTag] === "Module";
};
const toUrl$1 = (doc, containerEl, url) => {
  var _a2;
  const baseURI = doc.baseURI;
  const base = new URL((_a2 = containerEl.getAttribute("q:base")) != null ? _a2 : baseURI, baseURI);
  return new URL(url, base);
};
const setPlatform = (doc, plt) => doc[DocumentPlatform] = plt;
const getPlatform = (docOrNode) => {
  const doc = getDocument(docOrNode);
  return doc[DocumentPlatform] || (doc[DocumentPlatform] = createPlatform$1(doc));
};
const isServer$1 = (ctx) => {
  var _a2, _b;
  if (qDynamicPlatform) {
    return (_b = (_a2 = ctx.$renderCtx$) == null ? void 0 : _a2.$static$.$containerState$.$platform$.isServer) != null ? _b : getPlatform(ctx.$doc$).isServer;
  }
  return false;
};
const DocumentPlatform = ":platform:";
const directSetAttribute = (el, prop, value) => {
  return el.setAttribute(prop, value);
};
const directGetAttribute = (el, prop) => {
  return el.getAttribute(prop);
};
const ON_PROP_REGEX = /^(on|window:|document:)/;
const isOnProp = (prop) => {
  return ON_PROP_REGEX.test(prop);
};
const addQRLListener = (listenersMap, prop, input) => {
  let existingListeners = listenersMap[prop];
  if (!existingListeners) {
    listenersMap[prop] = existingListeners = [];
  }
  for (const qrl of input) {
    const hash = qrl.$hash$;
    let replaced = false;
    for (let i = 0; i < existingListeners.length; i++) {
      const existing = existingListeners[i];
      if (existing.$hash$ === hash) {
        existingListeners.splice(i, 1, qrl);
        replaced = true;
        break;
      }
    }
    if (!replaced) {
      existingListeners.push(qrl);
    }
  }
  return false;
};
const setEvent = (listenerMap, prop, input) => {
  assertTrue(prop.endsWith("$"), "render: event property does not end with $", prop);
  const qrls = isArray(input) ? input.map(ensureQrl) : [ensureQrl(input)];
  prop = normalizeOnProp(prop.slice(0, -1));
  addQRLListener(listenerMap, prop, qrls);
  return prop;
};
const ensureQrl = (value) => {
  return isQrl$1(value) ? value : $(value);
};
const getDomListeners = (ctx, containerEl) => {
  const attributes = ctx.$element$.attributes;
  const listeners = {};
  for (let i = 0; i < attributes.length; i++) {
    const { name, value } = attributes.item(i);
    if (name.startsWith("on:") || name.startsWith("on-window:") || name.startsWith("on-document:")) {
      let array = listeners[name];
      if (!array) {
        listeners[name] = array = [];
      }
      const urls = value.split("\n");
      for (const url of urls) {
        const qrl = parseQRL(url, containerEl);
        if (qrl.$capture$) {
          inflateQrl(qrl, ctx);
        }
        array.push(qrl);
      }
    }
  }
  return listeners;
};
const useSequentialScope = () => {
  const ctx = useInvokeContext();
  const i = ctx.$seq$;
  const hostElement = ctx.$hostElement$;
  const elCtx = getContext(hostElement);
  const seq = elCtx.$seq$ ? elCtx.$seq$ : elCtx.$seq$ = [];
  ctx.$seq$++;
  const set = (value) => {
    if (qDev$1) {
      verifySerializable(value);
    }
    return seq[i] = value;
  };
  return {
    get: seq[i],
    set,
    i,
    ctx
  };
};
const useOn = (event, eventQrl) => _useOn(`on-${event}`, eventQrl);
const _useOn = (eventName, eventQrl) => {
  const invokeCtx = useInvokeContext();
  const ctx = getContext(invokeCtx.$hostElement$);
  assertQrl(eventQrl);
  addQRLListener(ctx.li, normalizeOnProp(eventName), [eventQrl]);
};
const emitEvent = (el, eventName, detail, bubbles) => {
  if (el && typeof CustomEvent === "function") {
    el.dispatchEvent(new CustomEvent(eventName, {
      detail,
      bubbles,
      composed: bubbles
    }));
  }
};
const jsx = (type, props, key) => {
  if (qDev$1) {
    if (!isString(type) && !isFunction(type)) {
      throw qError(QError_invalidJsxNodeType, type);
    }
  }
  const processed = key == null ? null : String(key);
  return new JSXNodeImpl(type, props, processed);
};
const SKIP_RENDER_TYPE = ":skipRender";
class JSXNodeImpl {
  constructor(type, props, key = null) {
    this.type = type;
    this.props = props;
    this.key = key;
    seal(this);
  }
}
const isJSXNode = (n) => {
  if (qDev$1) {
    if (n instanceof JSXNodeImpl) {
      return true;
    }
    if (isObject(n) && "key" in n && "props" in n && "type" in n) {
      logWarn(`Duplicate implementations of "JSXNode" found`);
      return true;
    }
    return false;
  } else {
    return n instanceof JSXNodeImpl;
  }
};
const Fragment = (props) => props.children;
const QOnce = "qonce";
const SkipRender = Symbol("skip render");
const SSRComment = () => null;
const Virtual = (props) => props.children;
const InternalSSRStream = () => null;
const fromCamelToKebabCase = (text) => {
  return text.replace(/([A-Z])/g, "-$1").toLowerCase();
};
const executeComponent = (rctx, elCtx) => {
  elCtx.$dirty$ = false;
  elCtx.$mounted$ = true;
  elCtx.$slots$ = [];
  const hostElement = elCtx.$element$;
  const onRenderQRL = elCtx.$renderQrl$;
  const staticCtx = rctx.$static$;
  const containerState = staticCtx.$containerState$;
  const props = elCtx.$props$;
  const newCtx = pushRenderContext(rctx, elCtx);
  const invocatinContext = newInvokeContext(staticCtx.$doc$, hostElement, void 0, RenderEvent);
  const waitOn = invocatinContext.$waitOn$ = [];
  assertDefined(onRenderQRL, `render: host element to render must has a $renderQrl$:`, elCtx);
  assertDefined(props, `render: host element to render must has defined props`, elCtx);
  newCtx.$cmpCtx$ = elCtx;
  invocatinContext.$subscriber$ = hostElement;
  invocatinContext.$renderCtx$ = rctx;
  containerState.$hostsStaging$.delete(hostElement);
  containerState.$subsManager$.$clearSub$(hostElement);
  const onRenderFn = onRenderQRL.getFn(invocatinContext);
  return safeCall(() => onRenderFn(props), (jsxNode) => {
    staticCtx.$hostElements$.add(hostElement);
    const waitOnPromise = promiseAll(waitOn);
    return then(waitOnPromise, () => {
      if (isFunction(jsxNode)) {
        elCtx.$dirty$ = false;
        jsxNode = jsxNode();
      } else if (elCtx.$dirty$) {
        return executeComponent(rctx, elCtx);
      }
      elCtx.$attachedListeners$ = false;
      return {
        node: jsxNode,
        rctx: newCtx
      };
    });
  }, (err) => {
    logError(err);
  });
};
const createRenderContext = (doc, containerState) => {
  const ctx = {
    $static$: {
      $doc$: doc,
      $containerState$: containerState,
      $containerEl$: containerState.$containerEl$,
      $hostElements$: /* @__PURE__ */ new Set(),
      $operations$: [],
      $postOperations$: [],
      $roots$: [],
      $addSlots$: [],
      $rmSlots$: []
    },
    $cmpCtx$: void 0,
    $localStack$: []
  };
  seal(ctx);
  seal(ctx.$static$);
  return ctx;
};
const pushRenderContext = (ctx, elCtx) => {
  const newCtx = {
    $static$: ctx.$static$,
    $cmpCtx$: ctx.$cmpCtx$,
    $localStack$: ctx.$localStack$.concat(elCtx)
  };
  return newCtx;
};
const joinClasses = (...input) => {
  const set = /* @__PURE__ */ new Set();
  input.forEach((value) => {
    parseClassAny(value).forEach((v) => set.add(v));
  });
  return Array.from(set).join(" ");
};
const parseClassAny = (obj) => {
  if (isString(obj)) {
    return parseClassList(obj);
  } else if (isObject(obj)) {
    if (isArray(obj)) {
      return obj;
    } else {
      const output = [];
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const value = obj[key];
          if (value) {
            output.push(key);
          }
        }
      }
      return output;
    }
  }
  return [];
};
const parseClassListRegex = /\s/;
const parseClassList = (value) => !value ? EMPTY_ARRAY$1 : value.split(parseClassListRegex);
const stringifyStyle = (obj) => {
  if (obj == null)
    return "";
  if (typeof obj == "object") {
    if (isArray(obj)) {
      throw qError(QError_stringifyClassOrStyle, obj, "style");
    } else {
      const chunks = [];
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const value = obj[key];
          if (value) {
            chunks.push(fromCamelToKebabCase(key) + ":" + value);
          }
        }
      }
      return chunks.join(";");
    }
  }
  return String(obj);
};
const getNextIndex = (ctx) => {
  return intToStr(ctx.$static$.$containerState$.$elementIndex$++);
};
const getQId = (el) => {
  const ctx = tryGetContext(el);
  if (ctx) {
    return ctx.$id$;
  }
  return null;
};
const setQId = (rctx, ctx) => {
  const id = getNextIndex(rctx);
  ctx.$id$ = id;
  if (qSerialize) {
    ctx.$element$.setAttribute(ELEMENT_ID, id);
  }
};
const hasStyle = (containerState, styleId) => {
  return containerState.$styleIds$.has(styleId);
};
const ALLOWS_PROPS = [QSlot];
const SKIPS_PROPS = [QSlot, OnRenderProp, "children"];
const hashCode = (text, hash = 0) => {
  if (text.length === 0)
    return hash;
  for (let i = 0; i < text.length; i++) {
    const chr = text.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return Number(Math.abs(hash)).toString(36);
};
const styleKey = (qStyles, index2) => {
  assertQrl(qStyles);
  return `${hashCode(qStyles.$hash$)}-${index2}`;
};
const styleContent = (styleId) => {
  return ComponentStylesPrefixContent + styleId;
};
const serializeSStyle = (scopeIds) => {
  const value = scopeIds.join(" ");
  if (value.length > 0) {
    return value;
  }
  return void 0;
};
const setAttribute = (ctx, el, prop, value) => {
  if (ctx) {
    ctx.$operations$.push({
      $operation$: _setAttribute,
      $args$: [el, prop, value]
    });
  } else {
    _setAttribute(el, prop, value);
  }
};
const _setAttribute = (el, prop, value) => {
  if (value == null || value === false) {
    el.removeAttribute(prop);
  } else {
    const str = value === true ? "" : String(value);
    directSetAttribute(el, prop, str);
  }
};
const setProperty$1 = (ctx, node, key, value) => {
  if (ctx) {
    ctx.$operations$.push({
      $operation$: _setProperty,
      $args$: [node, key, value]
    });
  } else {
    _setProperty(node, key, value);
  }
};
const _setProperty = (node, key, value) => {
  try {
    node[key] = value;
  } catch (err) {
    logError(codeToText(QError_setProperty), { node, key, value }, err);
  }
};
const createElement = (doc, expectTag, isSvg) => {
  const el = isSvg ? doc.createElementNS(SVG_NS, expectTag) : doc.createElement(expectTag);
  return el;
};
const insertBefore = (ctx, parent, newChild, refChild) => {
  ctx.$operations$.push({
    $operation$: directInsertBefore,
    $args$: [parent, newChild, refChild ? refChild : null]
  });
  return newChild;
};
const appendChild = (ctx, parent, newChild) => {
  ctx.$operations$.push({
    $operation$: directAppendChild,
    $args$: [parent, newChild]
  });
  return newChild;
};
const appendHeadStyle = (ctx, styleTask) => {
  ctx.$containerState$.$styleIds$.add(styleTask.styleId);
  ctx.$postOperations$.push({
    $operation$: _appendHeadStyle,
    $args$: [ctx.$doc$, ctx.$containerEl$, styleTask]
  });
};
const setClasslist = (ctx, elm, toRemove, toAdd) => {
  if (ctx) {
    ctx.$operations$.push({
      $operation$: _setClasslist,
      $args$: [elm, toRemove, toAdd]
    });
  } else {
    _setClasslist(elm, toRemove, toAdd);
  }
};
const _setClasslist = (elm, toRemove, toAdd) => {
  const classList = elm.classList;
  classList.remove(...toRemove);
  classList.add(...toAdd);
};
const _appendHeadStyle = (doc, containerEl, styleTask) => {
  const isDoc = doc.documentElement === containerEl;
  const headEl = doc.head;
  const style = doc.createElement("style");
  if (isDoc && !headEl) {
    logWarn("document.head is undefined");
  }
  directSetAttribute(style, QStyle, styleTask.styleId);
  style.textContent = styleTask.content;
  if (isDoc && headEl) {
    directAppendChild(headEl, style);
  } else {
    directInsertBefore(containerEl, style, containerEl.firstChild);
  }
};
const prepend = (ctx, parent, newChild) => {
  ctx.$operations$.push({
    $operation$: directInsertBefore,
    $args$: [parent, newChild, parent.firstChild]
  });
};
const removeNode = (ctx, el) => {
  ctx.$operations$.push({
    $operation$: _removeNode,
    $args$: [el, ctx]
  });
};
const _removeNode = (el, staticCtx) => {
  const parent = el.parentElement;
  if (parent) {
    if (el.nodeType === 1 || el.nodeType === 111) {
      const subsManager = staticCtx.$containerState$.$subsManager$;
      cleanupTree(el, staticCtx, subsManager, true);
    }
    directRemoveChild(parent, el);
  } else if (qDev$1) {
    logWarn("Trying to remove component already removed", el);
  }
};
const createTemplate = (doc, slotName) => {
  const template = createElement(doc, "q:template", false);
  directSetAttribute(template, QSlot, slotName);
  directSetAttribute(template, "hidden", "");
  directSetAttribute(template, "aria-hidden", "true");
  return template;
};
const executeDOMRender = (ctx) => {
  for (const op of ctx.$operations$) {
    op.$operation$.apply(void 0, op.$args$);
  }
  resolveSlotProjection(ctx);
};
const getKey = (el) => {
  return directGetAttribute(el, "q:key");
};
const setKey = (el, key) => {
  if (key !== null) {
    directSetAttribute(el, "q:key", key);
  }
};
const resolveSlotProjection = (ctx) => {
  const subsManager = ctx.$containerState$.$subsManager$;
  ctx.$rmSlots$.forEach((slotEl) => {
    const key = getKey(slotEl);
    assertDefined(key, "slots must have a key");
    const slotChildren = getChildren(slotEl, "root");
    if (slotChildren.length > 0) {
      const sref = slotEl.getAttribute(QSlotRef);
      const hostCtx = ctx.$roots$.find((r) => r.$id$ === sref);
      if (hostCtx) {
        const template = createTemplate(ctx.$doc$, key);
        const hostElm = hostCtx.$element$;
        for (const child of slotChildren) {
          directAppendChild(template, child);
        }
        directInsertBefore(hostElm, template, hostElm.firstChild);
      } else {
        cleanupTree(slotEl, ctx, subsManager, false);
      }
    }
  });
  ctx.$addSlots$.forEach(([slotEl, hostElm]) => {
    const key = getKey(slotEl);
    assertDefined(key, "slots must have a key");
    const template = Array.from(hostElm.childNodes).find((node) => {
      return isSlotTemplate(node) && node.getAttribute(QSlot) === key;
    });
    if (template) {
      const children = getChildren(template, "root");
      children.forEach((child) => {
        directAppendChild(slotEl, child);
      });
      template.remove();
    }
  });
};
const createTextNode = (doc, text) => {
  return doc.createTextNode(text);
};
const printRenderStats = (ctx) => {
  var _a2;
  if (qDev$1) {
    if (typeof window !== "undefined" && window.document != null) {
      const byOp = {};
      for (const op of ctx.$operations$) {
        byOp[op.$operation$.name] = ((_a2 = byOp[op.$operation$.name]) != null ? _a2 : 0) + 1;
      }
      const stats = {
        byOp,
        roots: ctx.$roots$.map((ctx2) => ctx2.$element$),
        hostElements: Array.from(ctx.$hostElements$),
        operations: ctx.$operations$.map((v) => [v.$operation$.name, ...v.$args$])
      };
      const noOps = ctx.$operations$.length === 0;
      logDebug("Render stats.", noOps ? "No operations" : "", stats);
    }
  }
};
const VIRTUAL_SYMBOL = "__virtual";
const newVirtualElement = (doc) => {
  const open = doc.createComment("qv ");
  const close = doc.createComment("/qv");
  return new VirtualElementImpl(open, close);
};
const parseVirtualAttributes = (str) => {
  if (!str) {
    return /* @__PURE__ */ new Map();
  }
  const attributes = str.split(" ");
  return new Map(attributes.map((attr) => {
    const index2 = attr.indexOf("=");
    if (index2 >= 0) {
      return [attr.slice(0, index2), unescape(attr.slice(index2 + 1))];
    } else {
      return [attr, ""];
    }
  }));
};
const serializeVirtualAttributes = (map) => {
  const attributes = [];
  map.forEach((value, key) => {
    if (!value) {
      attributes.push(`${key}`);
    } else {
      attributes.push(`${key}=${escape$1(value)}`);
    }
  });
  return attributes.join(" ");
};
const SHOW_COMMENT$1 = 128;
const FILTER_ACCEPT$1 = 1;
const FILTER_REJECT$1 = 2;
const walkerVirtualByAttribute = (el, prop, value) => {
  return el.ownerDocument.createTreeWalker(el, SHOW_COMMENT$1, {
    acceptNode(c) {
      const virtual = getVirtualElement(c);
      if (virtual) {
        return directGetAttribute(virtual, prop) === value ? FILTER_ACCEPT$1 : FILTER_REJECT$1;
      }
      return FILTER_REJECT$1;
    }
  });
};
const queryAllVirtualByAttribute = (el, prop, value) => {
  const walker = walkerVirtualByAttribute(el, prop, value);
  const pars = [];
  let currentNode = null;
  while (currentNode = walker.nextNode()) {
    pars.push(getVirtualElement(currentNode));
  }
  return pars;
};
const escape$1 = (s) => {
  return s.replace(/ /g, "+");
};
const unescape = (s) => {
  return s.replace(/\+/g, " ");
};
const VIRTUAL = ":virtual";
class VirtualElementImpl {
  constructor(open, close) {
    this.open = open;
    this.close = close;
    this._qc_ = null;
    this.nodeType = 111;
    this.localName = VIRTUAL;
    this.nodeName = VIRTUAL;
    const doc = this.ownerDocument = open.ownerDocument;
    this.template = createElement(doc, "template", false);
    this.attributes = parseVirtualAttributes(open.data.slice(3));
    assertTrue(open.data.startsWith("qv "), "comment is not a qv");
    open[VIRTUAL_SYMBOL] = this;
    seal(this);
  }
  insertBefore(node, ref) {
    const parent = this.parentElement;
    if (parent) {
      const ref2 = ref ? ref : this.close;
      parent.insertBefore(node, ref2);
    } else {
      this.template.insertBefore(node, ref);
    }
    return node;
  }
  remove() {
    const parent = this.parentElement;
    if (parent) {
      const ch = Array.from(this.childNodes);
      assertEqual(this.template.childElementCount, 0, "children should be empty");
      parent.removeChild(this.open);
      this.template.append(...ch);
      parent.removeChild(this.close);
    }
  }
  appendChild(node) {
    return this.insertBefore(node, null);
  }
  insertBeforeTo(newParent, child) {
    const ch = Array.from(this.childNodes);
    if (this.parentElement) {
      console.warn("already attached");
    }
    newParent.insertBefore(this.open, child);
    for (const c of ch) {
      newParent.insertBefore(c, child);
    }
    newParent.insertBefore(this.close, child);
    assertEqual(this.template.childElementCount, 0, "children should be empty");
  }
  appendTo(newParent) {
    this.insertBeforeTo(newParent, null);
  }
  removeChild(child) {
    if (this.parentElement) {
      this.parentElement.removeChild(child);
    } else {
      this.template.removeChild(child);
    }
  }
  getAttribute(prop) {
    var _a2;
    return (_a2 = this.attributes.get(prop)) != null ? _a2 : null;
  }
  hasAttribute(prop) {
    return this.attributes.has(prop);
  }
  setAttribute(prop, value) {
    this.attributes.set(prop, value);
    if (qSerialize) {
      this.open.data = updateComment(this.attributes);
    }
  }
  removeAttribute(prop) {
    this.attributes.delete(prop);
    if (qSerialize) {
      this.open.data = updateComment(this.attributes);
    }
  }
  matches(_) {
    return false;
  }
  compareDocumentPosition(other) {
    return this.open.compareDocumentPosition(other);
  }
  closest(query) {
    const parent = this.parentElement;
    if (parent) {
      return parent.closest(query);
    }
    return null;
  }
  querySelectorAll(query) {
    const result = [];
    const ch = getChildren(this, "elements");
    ch.forEach((el) => {
      if (isQwikElement(el)) {
        if (el.matches(query)) {
          result.push(el);
        }
        result.concat(Array.from(el.querySelectorAll(query)));
      }
    });
    return result;
  }
  querySelector(query) {
    for (const el of this.childNodes) {
      if (isElement(el)) {
        if (el.matches(query)) {
          return el;
        }
        const v = el.querySelector(query);
        if (v !== null) {
          return v;
        }
      }
    }
    return null;
  }
  get firstChild() {
    if (this.parentElement) {
      const first = this.open.nextSibling;
      if (first === this.close) {
        return null;
      }
      return first;
    } else {
      return this.template.firstChild;
    }
  }
  get nextSibling() {
    return this.close.nextSibling;
  }
  get previousSibling() {
    return this.open.previousSibling;
  }
  get childNodes() {
    if (!this.parentElement) {
      return this.template.childNodes;
    }
    const nodes = [];
    let node = this.open;
    while (node = node.nextSibling) {
      if (node !== this.close) {
        nodes.push(node);
      } else {
        break;
      }
    }
    return nodes;
  }
  get isConnected() {
    return this.open.isConnected;
  }
  get parentElement() {
    return this.open.parentElement;
  }
}
const updateComment = (attributes) => {
  return `qv ${serializeVirtualAttributes(attributes)}`;
};
const processVirtualNodes = (node) => {
  if (node == null) {
    return null;
  }
  if (isComment(node)) {
    const virtual = getVirtualElement(node);
    if (virtual) {
      return virtual;
    }
  }
  return node;
};
const getVirtualElement = (open) => {
  const virtual = open[VIRTUAL_SYMBOL];
  if (virtual) {
    return virtual;
  }
  if (open.data.startsWith("qv ")) {
    const close = findClose(open);
    return new VirtualElementImpl(open, close);
  }
  return null;
};
const findClose = (open) => {
  let node = open.nextSibling;
  let stack = 1;
  while (node) {
    if (isComment(node)) {
      if (node.data.startsWith("qv ")) {
        stack++;
      } else if (node.data === "/qv") {
        stack--;
        if (stack === 0) {
          return node;
        }
      }
    }
    node = node.nextSibling;
  }
  throw new Error("close not found");
};
const isComment = (node) => {
  return node.nodeType === 8;
};
const getRootNode = (node) => {
  if (node == null) {
    return null;
  }
  if (isVirtualElement(node)) {
    return node.open;
  } else {
    return node;
  }
};
const renderComponent = (rctx, ctx, flags) => {
  const justMounted = !ctx.$mounted$;
  return then(executeComponent(rctx, ctx), (res) => {
    if (res) {
      const hostElement = ctx.$element$;
      const newCtx = res.rctx;
      const invocatinContext = newInvokeContext(rctx.$static$.$doc$, hostElement);
      invocatinContext.$subscriber$ = hostElement;
      invocatinContext.$renderCtx$ = newCtx;
      if (justMounted) {
        if (ctx.$appendStyles$) {
          for (const style of ctx.$appendStyles$) {
            appendHeadStyle(rctx.$static$, style);
          }
        }
        if (ctx.$scopeIds$) {
          const value = serializeSStyle(ctx.$scopeIds$);
          if (value) {
            hostElement.setAttribute(QScopedStyle, value);
          }
        }
      }
      const processedJSXNode = processData$1(res.node, invocatinContext);
      return then(processedJSXNode, (processedJSXNode2) => {
        const newVdom = wrapJSX(hostElement, processedJSXNode2);
        const oldVdom = getVdom(ctx);
        ctx.$vdom$ = newVdom;
        return visitJsxNode(newCtx, oldVdom, newVdom, flags);
      });
    }
  });
};
const getVdom = (ctx) => {
  if (!ctx.$vdom$) {
    ctx.$vdom$ = domToVnode(ctx.$element$);
  }
  return ctx.$vdom$;
};
class ProcessedJSXNodeImpl {
  constructor($type$, $props$, $children$, $key$) {
    this.$type$ = $type$;
    this.$props$ = $props$;
    this.$children$ = $children$;
    this.$key$ = $key$;
    this.$elm$ = null;
    this.$text$ = "";
    seal(this);
  }
}
const processNode = (node, invocationContext) => {
  const key = node.key != null ? String(node.key) : null;
  const nodeType = node.type;
  const props = node.props;
  const originalChildren = props.children;
  let textType = "";
  if (isString(nodeType)) {
    textType = nodeType;
  } else if (nodeType === Virtual) {
    textType = VIRTUAL;
  } else if (isFunction(nodeType)) {
    const res = invocationContext ? invoke(invocationContext, () => nodeType(props, node.key)) : nodeType(props, node.key);
    return processData$1(res, invocationContext);
  } else {
    throw qError(QError_invalidJsxNodeType, nodeType);
  }
  let children = EMPTY_ARRAY$1;
  if (originalChildren != null) {
    return then(processData$1(originalChildren, invocationContext), (result) => {
      if (result !== void 0) {
        children = isArray(result) ? result : [result];
      }
      return new ProcessedJSXNodeImpl(textType, props, children, key);
    });
  } else {
    return new ProcessedJSXNodeImpl(textType, props, children, key);
  }
};
const wrapJSX = (element, input) => {
  const children = input === void 0 ? EMPTY_ARRAY$1 : isArray(input) ? input : [input];
  const node = new ProcessedJSXNodeImpl(":virtual", {}, children, null);
  node.$elm$ = element;
  return node;
};
const processData$1 = (node, invocationContext) => {
  if (node == null || typeof node === "boolean") {
    return void 0;
  }
  if (isString(node) || typeof node === "number") {
    const newNode = new ProcessedJSXNodeImpl("#text", EMPTY_OBJ$1, EMPTY_ARRAY$1, null);
    newNode.$text$ = String(node);
    return newNode;
  } else if (isJSXNode(node)) {
    return processNode(node, invocationContext);
  } else if (isArray(node)) {
    const output = promiseAll(node.flatMap((n) => processData$1(n, invocationContext)));
    return then(output, (array) => array.flat(100).filter(isNotNullable));
  } else if (isPromise(node)) {
    return node.then((node2) => processData$1(node2, invocationContext));
  } else if (node === SkipRender) {
    return new ProcessedJSXNodeImpl(SKIP_RENDER_TYPE, EMPTY_OBJ$1, EMPTY_ARRAY$1, null);
  } else {
    logWarn("A unsupported value was passed to the JSX, skipping render. Value:", node);
    return void 0;
  }
};
const SVG_NS = "http://www.w3.org/2000/svg";
const IS_SVG = 1 << 0;
const IS_HEAD$1 = 1 << 1;
const CHILDREN_PLACEHOLDER = [];
const visitJsxNode = (ctx, oldVnode, newVnode, flags) => {
  return smartUpdateChildren(ctx, oldVnode, newVnode, "root", flags);
};
const smartUpdateChildren = (ctx, oldVnode, newVnode, mode, flags) => {
  assertQwikElement(oldVnode.$elm$);
  const ch = newVnode.$children$;
  if (ch.length === 1 && ch[0].$type$ === SKIP_RENDER_TYPE) {
    return;
  }
  const elm = oldVnode.$elm$;
  const needsDOMRead = oldVnode.$children$ === CHILDREN_PLACEHOLDER;
  if (needsDOMRead) {
    const isHead = elm.nodeName === "HEAD";
    if (isHead) {
      mode = "head";
      flags |= IS_HEAD$1;
    }
  }
  const oldCh = getVnodeChildren(oldVnode, mode);
  if (oldCh.length > 0 && ch.length > 0) {
    return updateChildren(ctx, elm, oldCh, ch, flags);
  } else if (ch.length > 0) {
    return addVnodes(ctx, elm, null, ch, 0, ch.length - 1, flags);
  } else if (oldCh.length > 0) {
    return removeVnodes(ctx.$static$, oldCh, 0, oldCh.length - 1);
  }
};
const getVnodeChildren = (vnode, mode) => {
  const oldCh = vnode.$children$;
  const elm = vnode.$elm$;
  if (oldCh === CHILDREN_PLACEHOLDER) {
    return vnode.$children$ = getChildrenVnodes(elm, mode);
  }
  return oldCh;
};
const updateChildren = (ctx, parentElm, oldCh, newCh, flags) => {
  let oldStartIdx = 0;
  let newStartIdx = 0;
  let oldEndIdx = oldCh.length - 1;
  let oldStartVnode = oldCh[0];
  let oldEndVnode = oldCh[oldEndIdx];
  let newEndIdx = newCh.length - 1;
  let newStartVnode = newCh[0];
  let newEndVnode = newCh[newEndIdx];
  let oldKeyToIdx;
  let idxInOld;
  let elmToMove;
  const results = [];
  const staticCtx = ctx.$static$;
  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    if (oldStartVnode == null) {
      oldStartVnode = oldCh[++oldStartIdx];
    } else if (oldEndVnode == null) {
      oldEndVnode = oldCh[--oldEndIdx];
    } else if (newStartVnode == null) {
      newStartVnode = newCh[++newStartIdx];
    } else if (newEndVnode == null) {
      newEndVnode = newCh[--newEndIdx];
    } else if (sameVnode(oldStartVnode, newStartVnode)) {
      results.push(patchVnode(ctx, oldStartVnode, newStartVnode, flags));
      oldStartVnode = oldCh[++oldStartIdx];
      newStartVnode = newCh[++newStartIdx];
    } else if (sameVnode(oldEndVnode, newEndVnode)) {
      results.push(patchVnode(ctx, oldEndVnode, newEndVnode, flags));
      oldEndVnode = oldCh[--oldEndIdx];
      newEndVnode = newCh[--newEndIdx];
    } else if (sameVnode(oldStartVnode, newEndVnode)) {
      assertDefined(oldStartVnode.$elm$, "oldStartVnode $elm$ must be defined");
      assertDefined(oldEndVnode.$elm$, "oldEndVnode $elm$ must be defined");
      results.push(patchVnode(ctx, oldStartVnode, newEndVnode, flags));
      insertBefore(staticCtx, parentElm, oldStartVnode.$elm$, oldEndVnode.$elm$.nextSibling);
      oldStartVnode = oldCh[++oldStartIdx];
      newEndVnode = newCh[--newEndIdx];
    } else if (sameVnode(oldEndVnode, newStartVnode)) {
      assertDefined(oldStartVnode.$elm$, "oldStartVnode $elm$ must be defined");
      assertDefined(oldEndVnode.$elm$, "oldEndVnode $elm$ must be defined");
      results.push(patchVnode(ctx, oldEndVnode, newStartVnode, flags));
      insertBefore(staticCtx, parentElm, oldEndVnode.$elm$, oldStartVnode.$elm$);
      oldEndVnode = oldCh[--oldEndIdx];
      newStartVnode = newCh[++newStartIdx];
    } else {
      if (oldKeyToIdx === void 0) {
        oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
      }
      idxInOld = oldKeyToIdx[newStartVnode.$key$];
      if (idxInOld === void 0) {
        const newElm = createElm(ctx, newStartVnode, flags);
        results.push(then(newElm, (newElm2) => {
          insertBefore(staticCtx, parentElm, newElm2, oldStartVnode.$elm$);
        }));
      } else {
        elmToMove = oldCh[idxInOld];
        if (!isTagName(elmToMove, newStartVnode.$type$)) {
          const newElm = createElm(ctx, newStartVnode, flags);
          results.push(then(newElm, (newElm2) => {
            insertBefore(staticCtx, parentElm, newElm2, oldStartVnode.$elm$);
          }));
        } else {
          results.push(patchVnode(ctx, elmToMove, newStartVnode, flags));
          oldCh[idxInOld] = void 0;
          assertDefined(elmToMove.$elm$, "elmToMove $elm$ must be defined");
          insertBefore(staticCtx, parentElm, elmToMove.$elm$, oldStartVnode.$elm$);
        }
      }
      newStartVnode = newCh[++newStartIdx];
    }
  }
  if (newStartIdx <= newEndIdx) {
    const before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].$elm$;
    results.push(addVnodes(ctx, parentElm, before, newCh, newStartIdx, newEndIdx, flags));
  }
  let wait = promiseAll(results);
  if (oldStartIdx <= oldEndIdx) {
    wait = then(wait, () => {
      removeVnodes(staticCtx, oldCh, oldStartIdx, oldEndIdx);
    });
  }
  return wait;
};
const getCh = (elm, filter) => {
  const end = isVirtualElement(elm) ? elm.close : null;
  const nodes = [];
  let node = elm.firstChild;
  while (node = processVirtualNodes(node)) {
    if (filter(node)) {
      nodes.push(node);
    }
    node = node.nextSibling;
    if (node === end) {
      break;
    }
  }
  return nodes;
};
const getChildren = (elm, mode) => {
  switch (mode) {
    case "root":
      return getCh(elm, isChildComponent);
    case "head":
      return getCh(elm, isHeadChildren);
    case "elements":
      return getCh(elm, isQwikElement);
  }
};
const getChildrenVnodes = (elm, mode) => {
  return getChildren(elm, mode).map(domToVnode);
};
const domToVnode = (node) => {
  if (isQwikElement(node)) {
    const props = isVirtualElement(node) ? EMPTY_OBJ$1 : getProps(node);
    const t = new ProcessedJSXNodeImpl(node.localName, props, CHILDREN_PLACEHOLDER, getKey(node));
    t.$elm$ = node;
    return t;
  } else if (isText(node)) {
    const t = new ProcessedJSXNodeImpl(node.nodeName, {}, CHILDREN_PLACEHOLDER, null);
    t.$text$ = node.data;
    t.$elm$ = node;
    return t;
  }
  throw new Error("invalid node");
};
const getProps = (node) => {
  const props = {};
  const attributes = node.attributes;
  const len = attributes.length;
  for (let i = 0; i < len; i++) {
    const a2 = attributes.item(i);
    assertDefined(a2, "attribute must be defined");
    const name = a2.name;
    if (!name.includes(":")) {
      props[name] = name === "class" ? parseClassAny(a2.value).filter((c) => !c.startsWith(ComponentStylesPrefixContent)) : a2.value;
    }
  }
  return props;
};
const isHeadChildren = (node) => {
  const type = node.nodeType;
  if (type === 1) {
    return node.hasAttribute("q:head");
  }
  return type === 111;
};
const isSlotTemplate = (node) => {
  return node.nodeName === "Q:TEMPLATE";
};
const isChildComponent = (node) => {
  const type = node.nodeType;
  if (type === 3 || type === 111) {
    return true;
  }
  if (type !== 1) {
    return false;
  }
  const nodeName = node.nodeName;
  if (nodeName === "Q:TEMPLATE") {
    return false;
  }
  if (nodeName === "HEAD") {
    return node.hasAttribute("q:head");
  }
  return true;
};
const splitChildren = (input) => {
  var _a2;
  const output = {};
  for (const item of input) {
    const key = getSlotName(item);
    const node = (_a2 = output[key]) != null ? _a2 : output[key] = new ProcessedJSXNodeImpl(VIRTUAL, {
      [QSlotS]: ""
    }, [], key);
    node.$children$.push(item);
  }
  return output;
};
const patchVnode = (rctx, oldVnode, newVnode, flags) => {
  assertEqual(oldVnode.$type$, newVnode.$type$, "old and new vnodes type must be the same");
  const elm = oldVnode.$elm$;
  const tag = newVnode.$type$;
  const staticCtx = rctx.$static$;
  const isVirtual = tag === VIRTUAL;
  newVnode.$elm$ = elm;
  if (tag === "#text") {
    if (oldVnode.$text$ !== newVnode.$text$) {
      setProperty$1(staticCtx, elm, "data", newVnode.$text$);
    }
    return;
  }
  assertQwikElement(elm);
  let isSvg = !!(flags & IS_SVG);
  if (!isSvg && tag === "svg") {
    flags |= IS_SVG;
    isSvg = true;
  }
  const props = newVnode.$props$;
  const isComponent = isVirtual && OnRenderProp in props;
  const elCtx = getContext(elm);
  if (!isComponent) {
    const listenerMap = updateProperties$1(elCtx, staticCtx, oldVnode.$props$, props, isSvg);
    const currentComponent = rctx.$cmpCtx$;
    if (currentComponent && !currentComponent.$attachedListeners$) {
      currentComponent.$attachedListeners$ = true;
      Object.entries(currentComponent.li).forEach(([key, value]) => {
        addQRLListener(listenerMap, key, value);
        addGlobalListener(staticCtx, elm, key);
      });
    }
    if (qSerialize) {
      Object.entries(listenerMap).forEach(([key, value]) => setAttribute(staticCtx, elm, key, serializeQRLs(value, elCtx)));
    }
    if (isSvg && newVnode.$type$ === "foreignObject") {
      flags &= ~IS_SVG;
      isSvg = false;
    }
    const isSlot = isVirtual && QSlotS in props;
    if (isSlot) {
      const currentComponent2 = rctx.$cmpCtx$;
      assertDefined(currentComponent2, "slots can not be rendered outside a component");
      assertDefined(currentComponent2.$slots$, "current component slots must be a defined array");
      currentComponent2.$slots$.push(newVnode);
      return;
    }
    const setsInnerHTML = props[dangerouslySetInnerHTML] !== void 0;
    if (setsInnerHTML) {
      if (qDev$1 && newVnode.$children$.length > 0) {
        logWarn("Node can not have children when innerHTML is set");
      }
      return;
    }
    const isRenderOnce = isVirtual && QOnce in props;
    if (isRenderOnce) {
      return;
    }
    return smartUpdateChildren(rctx, oldVnode, newVnode, "root", flags);
  }
  let needsRender = setComponentProps(elCtx, rctx, props);
  if (!needsRender && !elCtx.$renderQrl$ && !elCtx.$element$.hasAttribute(ELEMENT_ID)) {
    setQId(rctx, elCtx);
    elCtx.$renderQrl$ = props[OnRenderProp];
    assertQrl(elCtx.$renderQrl$);
    needsRender = true;
  }
  if (needsRender) {
    return then(renderComponent(rctx, elCtx, flags), () => renderContentProjection(rctx, elCtx, newVnode, flags));
  }
  return renderContentProjection(rctx, elCtx, newVnode, flags);
};
const renderContentProjection = (rctx, hostCtx, vnode, flags) => {
  const newChildren = vnode.$children$;
  const staticCtx = rctx.$static$;
  const splittedNewChidren = splitChildren(newChildren);
  const slotRctx = pushRenderContext(rctx, hostCtx);
  const slotMaps = getSlotMap(hostCtx);
  Object.entries(slotMaps.slots).forEach(([key, slotEl]) => {
    if (!splittedNewChidren[key]) {
      const oldCh = getChildrenVnodes(slotEl, "root");
      if (oldCh.length > 0) {
        const slotCtx = tryGetContext(slotEl);
        if (slotCtx && slotCtx.$vdom$) {
          slotCtx.$vdom$.$children$ = [];
        }
        removeVnodes(staticCtx, oldCh, 0, oldCh.length - 1);
      }
    }
  });
  Object.entries(slotMaps.templates).forEach(([key, templateEl]) => {
    if (templateEl) {
      if (!splittedNewChidren[key] || slotMaps.slots[key]) {
        removeNode(staticCtx, templateEl);
        slotMaps.templates[key] = void 0;
      }
    }
  });
  return promiseAll(Object.entries(splittedNewChidren).map(([key, newVdom]) => {
    const slotElm = getSlotElement(staticCtx, slotMaps, hostCtx.$element$, key);
    const slotCtx = getContext(slotElm);
    const oldVdom = getVdom(slotCtx);
    slotCtx.$vdom$ = newVdom;
    newVdom.$elm$ = slotElm;
    return smartUpdateChildren(slotRctx, oldVdom, newVdom, "root", flags);
  }));
};
const addVnodes = (ctx, parentElm, before, vnodes, startIdx, endIdx, flags) => {
  const promises = [];
  let hasPromise = false;
  for (; startIdx <= endIdx; ++startIdx) {
    const ch = vnodes[startIdx];
    assertDefined(ch, "render: node must be defined at index", startIdx, vnodes);
    const elm = createElm(ctx, ch, flags);
    promises.push(elm);
    if (isPromise(elm)) {
      hasPromise = true;
    }
  }
  if (hasPromise) {
    return Promise.all(promises).then((children) => insertChildren(ctx.$static$, parentElm, children, before));
  } else {
    insertChildren(ctx.$static$, parentElm, promises, before);
  }
};
const insertChildren = (ctx, parentElm, children, before) => {
  for (const child of children) {
    insertBefore(ctx, parentElm, child, before);
  }
};
const removeVnodes = (ctx, nodes, startIdx, endIdx) => {
  for (; startIdx <= endIdx; ++startIdx) {
    const ch = nodes[startIdx];
    if (ch) {
      assertDefined(ch.$elm$, "vnode elm must be defined");
      removeNode(ctx, ch.$elm$);
    }
  }
};
const getSlotElement = (ctx, slotMaps, parentEl, slotName) => {
  const slotEl = slotMaps.slots[slotName];
  if (slotEl) {
    return slotEl;
  }
  const templateEl = slotMaps.templates[slotName];
  if (templateEl) {
    return templateEl;
  }
  const template = createTemplate(ctx.$doc$, slotName);
  prepend(ctx, parentEl, template);
  slotMaps.templates[slotName] = template;
  return template;
};
const getSlotName = (node) => {
  var _a2;
  return (_a2 = node.$props$[QSlot]) != null ? _a2 : "";
};
const createElm = (rctx, vnode, flags) => {
  const tag = vnode.$type$;
  const doc = rctx.$static$.$doc$;
  if (tag === "#text") {
    return vnode.$elm$ = createTextNode(doc, vnode.$text$);
  }
  let elm;
  let isHead = !!(flags & IS_HEAD$1);
  let isSvg = !!(flags & IS_SVG);
  if (!isSvg && tag === "svg") {
    flags |= IS_SVG;
    isSvg = true;
  }
  const isVirtual = tag === VIRTUAL;
  const props = vnode.$props$;
  const isComponent = OnRenderProp in props;
  const staticCtx = rctx.$static$;
  if (isVirtual) {
    elm = newVirtualElement(doc);
  } else if (tag === "head") {
    elm = doc.head;
    flags |= IS_HEAD$1;
    isHead = true;
  } else {
    elm = createElement(doc, tag, isSvg);
    flags &= ~IS_HEAD$1;
  }
  vnode.$elm$ = elm;
  if (isSvg && tag === "foreignObject") {
    isSvg = false;
    flags &= ~IS_SVG;
  }
  const elCtx = getContext(elm);
  if (isComponent) {
    setKey(elm, vnode.$key$);
    assertTrue(isVirtual, "component must be a virtual element");
    const renderQRL = props[OnRenderProp];
    assertQrl(renderQRL);
    setComponentProps(elCtx, rctx, props);
    setQId(rctx, elCtx);
    elCtx.$renderQrl$ = renderQRL;
    return then(renderComponent(rctx, elCtx, flags), () => {
      let children2 = vnode.$children$;
      if (children2.length === 0) {
        return elm;
      }
      if (children2.length === 1 && children2[0].$type$ === SKIP_RENDER_TYPE) {
        children2 = children2[0].$children$;
      }
      const slotRctx = pushRenderContext(rctx, elCtx);
      const slotMap = getSlotMap(elCtx);
      const elements = children2.map((ch) => createElm(slotRctx, ch, flags));
      return then(promiseAll(elements), () => {
        for (const node of children2) {
          assertDefined(node.$elm$, "vnode elm must be defined");
          appendChild(staticCtx, getSlotElement(staticCtx, slotMap, elm, getSlotName(node)), node.$elm$);
        }
        return elm;
      });
    });
  }
  const currentComponent = rctx.$cmpCtx$;
  const isSlot = isVirtual && QSlotS in props;
  const hasRef = !isVirtual && "ref" in props;
  const listenerMap = setProperties(staticCtx, elCtx, props, isSvg);
  if (currentComponent && !isVirtual) {
    const scopedIds = currentComponent.$scopeIds$;
    if (scopedIds) {
      scopedIds.forEach((styleId) => {
        elm.classList.add(styleId);
      });
    }
    if (!currentComponent.$attachedListeners$) {
      currentComponent.$attachedListeners$ = true;
      Object.entries(currentComponent.li).forEach(([eventName, qrls]) => {
        addQRLListener(listenerMap, eventName, qrls);
      });
    }
  }
  if (isSlot) {
    assertDefined(currentComponent, "slot can only be used inside component");
    assertDefined(currentComponent.$slots$, "current component slots must be a defined array");
    setKey(elm, vnode.$key$);
    directSetAttribute(elm, QSlotRef, currentComponent.$id$);
    currentComponent.$slots$.push(vnode);
    staticCtx.$addSlots$.push([elm, currentComponent.$element$]);
  } else if (qSerialize) {
    setKey(elm, vnode.$key$);
  }
  if (qSerialize) {
    const listeners = Object.entries(listenerMap);
    if (isHead && !isVirtual) {
      directSetAttribute(elm, "q:head", "");
    }
    if (listeners.length > 0 || hasRef) {
      setQId(rctx, elCtx);
    }
    listeners.forEach(([key, qrls]) => {
      setAttribute(staticCtx, elm, key, serializeQRLs(qrls, elCtx));
    });
  }
  const setsInnerHTML = props[dangerouslySetInnerHTML] !== void 0;
  if (setsInnerHTML) {
    if (qDev$1 && vnode.$children$.length > 0) {
      logWarn("Node can not have children when innerHTML is set");
    }
    return elm;
  }
  let children = vnode.$children$;
  if (children.length === 0) {
    return elm;
  }
  if (children.length === 1 && children[0].$type$ === SKIP_RENDER_TYPE) {
    children = children[0].$children$;
  }
  const promises = children.map((ch) => createElm(rctx, ch, flags));
  return then(promiseAll(promises), () => {
    for (const node of children) {
      assertDefined(node.$elm$, "vnode elm must be defined");
      appendChild(rctx.$static$, elm, node.$elm$);
    }
    return elm;
  });
};
const getSlots = (ctx) => {
  const slots = ctx.$slots$;
  if (!slots) {
    const parent = ctx.$element$.parentElement;
    assertDefined(parent, "component should be already attached to the dom");
    return ctx.$slots$ = readDOMSlots(ctx);
  }
  return slots;
};
const getSlotMap = (ctx) => {
  var _a2, _b;
  const slotsArray = getSlots(ctx);
  const slots = {};
  const templates = {};
  const t = Array.from(ctx.$element$.childNodes).filter(isSlotTemplate);
  for (const vnode of slotsArray) {
    assertQwikElement(vnode.$elm$);
    slots[(_a2 = vnode.$key$) != null ? _a2 : ""] = vnode.$elm$;
  }
  for (const elm of t) {
    templates[(_b = directGetAttribute(elm, QSlot)) != null ? _b : ""] = elm;
  }
  return { slots, templates };
};
const readDOMSlots = (ctx) => {
  const parent = ctx.$element$.parentElement;
  assertDefined(parent, "component should be already attached to the dom");
  return queryAllVirtualByAttribute(parent, QSlotRef, ctx.$id$).map(domToVnode);
};
const handleStyle = (ctx, elm, _, newValue) => {
  setProperty$1(ctx, elm.style, "cssText", stringifyStyle(newValue));
  return true;
};
const handleClass = (ctx, elm, _, newValue, oldValue) => {
  const oldClasses = parseClassAny(oldValue);
  const newClasses = parseClassAny(newValue);
  setClasslist(ctx, elm, oldClasses.filter((c) => c && !newClasses.includes(c)), newClasses.filter((c) => c && !oldClasses.includes(c)));
  return true;
};
const checkBeforeAssign = (ctx, elm, prop, newValue) => {
  if (prop in elm) {
    if (elm[prop] !== newValue) {
      setProperty$1(ctx, elm, prop, newValue);
    }
  }
  return true;
};
const dangerouslySetInnerHTML = "dangerouslySetInnerHTML";
const setInnerHTML = (ctx, elm, _, newValue) => {
  if (dangerouslySetInnerHTML in elm) {
    setProperty$1(ctx, elm, dangerouslySetInnerHTML, newValue);
  } else if ("innerHTML" in elm) {
    setProperty$1(ctx, elm, "innerHTML", newValue);
  }
  return true;
};
const noop = () => {
  return true;
};
const PROP_HANDLER_MAP = {
  style: handleStyle,
  class: handleClass,
  className: handleClass,
  value: checkBeforeAssign,
  checked: checkBeforeAssign,
  [dangerouslySetInnerHTML]: setInnerHTML,
  innerHTML: noop
};
const updateProperties$1 = (elCtx, staticCtx, oldProps, newProps, isSvg) => {
  const keys = getKeys(oldProps, newProps);
  const listenersMap = elCtx.li = {};
  if (keys.length === 0) {
    return listenersMap;
  }
  const elm = elCtx.$element$;
  for (const key of keys) {
    if (key === "children") {
      continue;
    }
    const newValue = newProps[key];
    const oldValue = oldProps[key];
    if (oldValue === newValue) {
      continue;
    }
    if (key === "ref") {
      newValue.current = elm;
      continue;
    }
    if (isOnProp(key)) {
      setEvent(listenersMap, key, newValue);
      continue;
    }
    const exception = PROP_HANDLER_MAP[key];
    if (exception) {
      if (exception(staticCtx, elm, key, newValue, oldValue)) {
        continue;
      }
    }
    if (!isSvg && key in elm) {
      setProperty$1(staticCtx, elm, key, newValue);
      continue;
    }
    setAttribute(staticCtx, elm, key, newValue);
  }
  return listenersMap;
};
const getKeys = (oldProps, newProps) => {
  const keys = Object.keys(newProps);
  keys.push(...Object.keys(oldProps).filter((p) => !keys.includes(p)));
  return keys;
};
const addGlobalListener = (staticCtx, elm, prop) => {
  if (!qSerialize && prop.includes(":")) {
    setAttribute(staticCtx, elm, prop, "");
  }
};
const setProperties = (rctx, elCtx, newProps, isSvg) => {
  const elm = elCtx.$element$;
  const keys = Object.keys(newProps);
  const listenerMap = elCtx.li;
  if (keys.length === 0) {
    return listenerMap;
  }
  for (const key of keys) {
    if (key === "children") {
      continue;
    }
    const newValue = newProps[key];
    if (key === "ref") {
      newValue.current = elm;
      continue;
    }
    if (isOnProp(key)) {
      addGlobalListener(rctx, elm, setEvent(listenerMap, key, newValue));
      continue;
    }
    const exception = PROP_HANDLER_MAP[key];
    if (exception) {
      if (exception(rctx, elm, key, newValue, void 0)) {
        continue;
      }
    }
    if (!isSvg && key in elm) {
      setProperty$1(rctx, elm, key, newValue);
      continue;
    }
    setAttribute(rctx, elm, key, newValue);
  }
  return listenerMap;
};
const setComponentProps = (ctx, rctx, expectProps) => {
  const keys = Object.keys(expectProps);
  if (keys.length === 0) {
    return false;
  }
  const qwikProps = getPropsMutator(ctx, rctx.$static$.$containerState$);
  for (const key of keys) {
    if (SKIPS_PROPS.includes(key)) {
      continue;
    }
    qwikProps.set(key, expectProps[key]);
  }
  return ctx.$dirty$;
};
const cleanupTree = (parent, rctx, subsManager, stopSlots) => {
  if (stopSlots && parent.hasAttribute(QSlotS)) {
    rctx.$rmSlots$.push(parent);
    return;
  }
  cleanupElement(parent, subsManager);
  const ch = getChildren(parent, "elements");
  for (const child of ch) {
    cleanupTree(child, rctx, subsManager, stopSlots);
  }
};
const cleanupElement = (el, subsManager) => {
  const ctx = tryGetContext(el);
  if (ctx) {
    cleanupContext(ctx, subsManager);
  }
};
const executeContextWithSlots = ({ $static$: ctx }) => {
  executeDOMRender(ctx);
};
const directAppendChild = (parent, child) => {
  if (isVirtualElement(child)) {
    child.appendTo(parent);
  } else {
    parent.appendChild(child);
  }
};
const directRemoveChild = (parent, child) => {
  if (isVirtualElement(child)) {
    child.remove();
  } else {
    parent.removeChild(child);
  }
};
const directInsertBefore = (parent, child, ref) => {
  if (isVirtualElement(child)) {
    child.insertBeforeTo(parent, getRootNode(ref));
  } else {
    parent.insertBefore(child, getRootNode(ref));
  }
};
const createKeyToOldIdx = (children, beginIdx, endIdx) => {
  const map = {};
  for (let i = beginIdx; i <= endIdx; ++i) {
    const child = children[i];
    const key = child.$key$;
    if (key != null) {
      map[key] = i;
    }
  }
  return map;
};
const sameVnode = (vnode1, vnode2) => {
  if (vnode1.$type$ !== vnode2.$type$) {
    return false;
  }
  return vnode1.$key$ === vnode2.$key$;
};
const isTagName = (elm, tagName) => {
  return elm.$type$ === tagName;
};
const useLexicalScope = () => {
  const context = getInvokeContext();
  let qrl = context.$qrl$;
  if (!qrl) {
    const el = context.$element$;
    assertDefined(el, "invoke: element must be defined inside useLexicalScope()", context);
    const container = getWrappingContainer(el);
    const ctx = getContext(el);
    assertDefined(container, `invoke: cant find parent q:container of`, el);
    qrl = parseQRL(decodeURIComponent(String(context.$url$)), container);
    assertQrl(qrl);
    resumeIfNeeded(container);
    inflateQrl(qrl, ctx);
  } else {
    assertQrl(qrl);
    assertDefined(qrl.$captureRef$, "invoke: qrl $captureRef$ must be defined inside useLexicalScope()", qrl);
  }
  return qrl.$captureRef$;
};
const notifyChange = (subscriber, containerState) => {
  if (isQwikElement(subscriber)) {
    notifyRender(subscriber, containerState);
  } else {
    notifyWatch(subscriber, containerState);
  }
};
const notifyRender = (hostElement, containerState) => {
  const isServer2 = qDynamicPlatform && !qTest && containerState.$platform$.isServer;
  if (!isServer2) {
    resumeIfNeeded(containerState.$containerEl$);
  }
  const ctx = getContext(hostElement);
  assertDefined(ctx.$renderQrl$, `render: notified host element must have a defined $renderQrl$`, ctx);
  if (ctx.$dirty$) {
    return;
  }
  ctx.$dirty$ = true;
  const activeRendering = containerState.$hostsRendering$ !== void 0;
  if (activeRendering) {
    assertDefined(containerState.$renderPromise$, "render: while rendering, $renderPromise$ must be defined", containerState);
    containerState.$hostsStaging$.add(hostElement);
  } else {
    if (isServer2) {
      logWarn("Can not rerender in server platform");
      return void 0;
    }
    containerState.$hostsNext$.add(hostElement);
    scheduleFrame(containerState);
  }
};
const notifyWatch = (watch, containerState) => {
  if (watch.$flags$ & WatchFlagsIsDirty) {
    return;
  }
  watch.$flags$ |= WatchFlagsIsDirty;
  const activeRendering = containerState.$hostsRendering$ !== void 0;
  if (activeRendering) {
    assertDefined(containerState.$renderPromise$, "render: while rendering, $renderPromise$ must be defined", containerState);
    containerState.$watchStaging$.add(watch);
  } else {
    containerState.$watchNext$.add(watch);
    scheduleFrame(containerState);
  }
};
const scheduleFrame = (containerState) => {
  if (containerState.$renderPromise$ === void 0) {
    containerState.$renderPromise$ = containerState.$platform$.nextTick(() => renderMarked(containerState));
  }
  return containerState.$renderPromise$;
};
const _hW = () => {
  const [watch] = useLexicalScope();
  notifyWatch(watch, getContainerState(getWrappingContainer(watch.$el$)));
};
const renderMarked = async (containerState) => {
  const hostsRendering = containerState.$hostsRendering$ = new Set(containerState.$hostsNext$);
  containerState.$hostsNext$.clear();
  await executeWatchesBefore(containerState);
  containerState.$hostsStaging$.forEach((host) => {
    hostsRendering.add(host);
  });
  containerState.$hostsStaging$.clear();
  const doc = getDocument(containerState.$containerEl$);
  const platform = containerState.$platform$;
  const renderingQueue = Array.from(hostsRendering);
  sortNodes(renderingQueue);
  const ctx = createRenderContext(doc, containerState);
  const staticCtx = ctx.$static$;
  for (const el of renderingQueue) {
    if (!staticCtx.$hostElements$.has(el)) {
      const elCtx = getContext(el);
      if (elCtx.$renderQrl$) {
        assertTrue(el.isConnected, "element must be connected to the dom");
        staticCtx.$roots$.push(elCtx);
        try {
          await renderComponent(ctx, elCtx, getFlags(el.parentElement));
        } catch (e) {
          logError(codeToText(QError_errorWhileRendering), e);
        }
      }
    }
  }
  staticCtx.$operations$.push(...staticCtx.$postOperations$);
  if (staticCtx.$operations$.length === 0) {
    printRenderStats(staticCtx);
    postRendering(containerState, staticCtx);
    return ctx;
  }
  return platform.raf(() => {
    executeContextWithSlots(ctx);
    printRenderStats(staticCtx);
    postRendering(containerState, staticCtx);
    return ctx;
  });
};
const getFlags = (el) => {
  let flags = 0;
  if (el) {
    if (el.namespaceURI === SVG_NS) {
      flags |= IS_SVG;
    }
    if (el.tagName === "HEAD") {
      flags |= IS_HEAD$1;
    }
  }
  return flags;
};
const postRendering = async (containerState, ctx) => {
  await executeWatchesAfter(containerState, (watch, stage) => {
    if ((watch.$flags$ & WatchFlagsIsEffect) === 0) {
      return false;
    }
    if (stage) {
      return ctx.$hostElements$.has(watch.$el$);
    }
    return true;
  });
  containerState.$hostsStaging$.forEach((el) => {
    containerState.$hostsNext$.add(el);
  });
  containerState.$hostsStaging$.clear();
  containerState.$hostsRendering$ = void 0;
  containerState.$renderPromise$ = void 0;
  if (containerState.$hostsNext$.size + containerState.$watchNext$.size > 0) {
    scheduleFrame(containerState);
  }
};
const executeWatchesBefore = async (containerState) => {
  const resourcesPromises = [];
  const watchPromises = [];
  const isWatch = (watch) => (watch.$flags$ & WatchFlagsIsWatch) !== 0;
  const isResourceWatch2 = (watch) => (watch.$flags$ & WatchFlagsIsResource) !== 0;
  containerState.$watchNext$.forEach((watch) => {
    if (isWatch(watch)) {
      watchPromises.push(then(watch.$qrl$.$resolveLazy$(), () => watch));
      containerState.$watchNext$.delete(watch);
    }
    if (isResourceWatch2(watch)) {
      resourcesPromises.push(then(watch.$qrl$.$resolveLazy$(), () => watch));
      containerState.$watchNext$.delete(watch);
    }
  });
  do {
    containerState.$watchStaging$.forEach((watch) => {
      if (isWatch(watch)) {
        watchPromises.push(then(watch.$qrl$.$resolveLazy$(), () => watch));
      } else if (isResourceWatch2(watch)) {
        resourcesPromises.push(then(watch.$qrl$.$resolveLazy$(), () => watch));
      } else {
        containerState.$watchNext$.add(watch);
      }
    });
    containerState.$watchStaging$.clear();
    if (watchPromises.length > 0) {
      const watches = await Promise.all(watchPromises);
      sortWatches(watches);
      await Promise.all(watches.map((watch) => {
        return runSubscriber(watch, containerState);
      }));
      watchPromises.length = 0;
    }
  } while (containerState.$watchStaging$.size > 0);
  if (resourcesPromises.length > 0) {
    const resources = await Promise.all(resourcesPromises);
    sortWatches(resources);
    resources.forEach((watch) => runSubscriber(watch, containerState));
  }
};
const executeWatchesAfter = async (containerState, watchPred) => {
  const watchPromises = [];
  containerState.$watchNext$.forEach((watch) => {
    if (watchPred(watch, false)) {
      watchPromises.push(then(watch.$qrl$.$resolveLazy$(), () => watch));
      containerState.$watchNext$.delete(watch);
    }
  });
  do {
    containerState.$watchStaging$.forEach((watch) => {
      if (watchPred(watch, true)) {
        watchPromises.push(then(watch.$qrl$.$resolveLazy$(), () => watch));
      } else {
        containerState.$watchNext$.add(watch);
      }
    });
    containerState.$watchStaging$.clear();
    if (watchPromises.length > 0) {
      const watches = await Promise.all(watchPromises);
      sortWatches(watches);
      await Promise.all(watches.map((watch) => {
        return runSubscriber(watch, containerState);
      }));
      watchPromises.length = 0;
    }
  } while (containerState.$watchStaging$.size > 0);
};
const sortNodes = (elements) => {
  elements.sort((a2, b) => a2.compareDocumentPosition(getRootNode(b)) & 2 ? 1 : -1);
};
const sortWatches = (watches) => {
  watches.sort((a2, b) => {
    if (a2.$el$ === b.$el$) {
      return a2.$index$ < b.$index$ ? -1 : 1;
    }
    return (a2.$el$.compareDocumentPosition(getRootNode(b.$el$)) & 2) !== 0 ? 1 : -1;
  });
};
const CONTAINER_STATE = Symbol("ContainerState");
const getContainerState = (containerEl) => {
  let set = containerEl[CONTAINER_STATE];
  if (!set) {
    containerEl[CONTAINER_STATE] = set = {
      $containerEl$: containerEl,
      $proxyMap$: /* @__PURE__ */ new WeakMap(),
      $subsManager$: null,
      $platform$: getPlatform(containerEl),
      $watchNext$: /* @__PURE__ */ new Set(),
      $watchStaging$: /* @__PURE__ */ new Set(),
      $hostsNext$: /* @__PURE__ */ new Set(),
      $hostsStaging$: /* @__PURE__ */ new Set(),
      $renderPromise$: void 0,
      $hostsRendering$: void 0,
      $envData$: {},
      $elementIndex$: 0,
      $styleIds$: /* @__PURE__ */ new Set(),
      $mutableProps$: false
    };
    seal(set);
    set.$subsManager$ = createSubscriptionManager(set);
  }
  return set;
};
const createSubscriptionManager = (containerState) => {
  const objToSubs = /* @__PURE__ */ new Map();
  const subsToObjs = /* @__PURE__ */ new Map();
  const clearSub = (sub) => {
    const subs = subsToObjs.get(sub);
    if (subs) {
      subs.forEach((s) => {
        s.delete(sub);
      });
      subsToObjs.delete(sub);
      subs.clear();
    }
  };
  const tryGetLocal = (obj) => {
    assertEqual(getProxyTarget(obj), void 0, "object can not be be a proxy", obj);
    return objToSubs.get(obj);
  };
  const trackSubToObj = (subscriber, map) => {
    let set = subsToObjs.get(subscriber);
    if (!set) {
      subsToObjs.set(subscriber, set = /* @__PURE__ */ new Set());
    }
    set.add(map);
  };
  const getLocal = (obj, initialMap) => {
    let local = tryGetLocal(obj);
    if (local) {
      assertEqual(initialMap, void 0, "subscription map can not be set to an existing object", local);
    } else {
      const map = !initialMap ? /* @__PURE__ */ new Map() : initialMap;
      map.forEach((_, key) => {
        trackSubToObj(key, map);
      });
      objToSubs.set(obj, local = {
        $subs$: map,
        $addSub$(subscriber, key) {
          if (key == null) {
            map.set(subscriber, null);
          } else {
            let sub = map.get(subscriber);
            if (sub === void 0) {
              map.set(subscriber, sub = /* @__PURE__ */ new Set());
            }
            if (sub) {
              sub.add(key);
            }
          }
          trackSubToObj(subscriber, map);
        },
        $notifySubs$(key) {
          map.forEach((value, subscriber) => {
            if (value === null || !key || value.has(key)) {
              notifyChange(subscriber, containerState);
            }
          });
        }
      });
      seal(local);
    }
    return local;
  };
  const manager = {
    $tryGetLocal$: tryGetLocal,
    $getLocal$: getLocal,
    $clearSub$: clearSub
  };
  seal(manager);
  return manager;
};
const pauseContainer = async (elmOrDoc, defaultParentJSON) => {
  const doc = getDocument(elmOrDoc);
  const documentElement = doc.documentElement;
  const containerEl = isDocument(elmOrDoc) ? documentElement : elmOrDoc;
  if (directGetAttribute(containerEl, QContainerAttr) === "paused") {
    throw qError(QError_containerAlreadyPaused);
  }
  const parentJSON = defaultParentJSON != null ? defaultParentJSON : containerEl === doc.documentElement ? doc.body : containerEl;
  const data = await pauseFromContainer(containerEl);
  const script = doc.createElement("script");
  directSetAttribute(script, "type", "qwik/json");
  script.textContent = escapeText$1(JSON.stringify(data.state, void 0, qDev$1 ? "  " : void 0));
  parentJSON.appendChild(script);
  directSetAttribute(containerEl, QContainerAttr, "paused");
  return data;
};
const moveStyles = (containerEl, containerState) => {
  const head2 = containerEl.ownerDocument.head;
  containerEl.querySelectorAll("style[q\\:style]").forEach((el) => {
    containerState.$styleIds$.add(directGetAttribute(el, QStyle));
    head2.appendChild(el);
  });
};
const resumeContainer = (containerEl) => {
  if (!isContainer(containerEl)) {
    logWarn("Skipping hydration because parent element is not q:container");
    return;
  }
  const doc = getDocument(containerEl);
  const isDocElement = containerEl === doc.documentElement;
  const parentJSON = isDocElement ? doc.body : containerEl;
  const script = getQwikJSON(parentJSON);
  if (!script) {
    logWarn("Skipping hydration qwik/json metadata was not found.");
    return;
  }
  script.remove();
  const containerState = getContainerState(containerEl);
  moveStyles(containerEl, containerState);
  const meta = JSON.parse(unescapeText(script.textContent || "{}"));
  const elements = /* @__PURE__ */ new Map();
  const getObject = (id) => {
    return getObjectImpl(id, elements, meta.objs, containerState);
  };
  let maxId = 0;
  getNodesInScope(containerEl, hasQId).forEach((el) => {
    const id = directGetAttribute(el, ELEMENT_ID);
    assertDefined(id, `resume: element missed q:id`, el);
    const ctx = getContext(el);
    ctx.$id$ = id;
    ctx.$mounted$ = true;
    elements.set(ELEMENT_ID_PREFIX + id, el);
    maxId = Math.max(maxId, strToInt(id));
  });
  containerState.$elementIndex$ = ++maxId;
  const parser = createParser(getObject, containerState, doc);
  reviveValues(meta.objs, meta.subs, getObject, containerState, parser);
  for (const obj of meta.objs) {
    reviveNestedObjects(obj, getObject, parser);
  }
  Object.entries(meta.ctx).forEach(([elementID, ctxMeta]) => {
    const el = getObject(elementID);
    assertDefined(el, `resume: cant find dom node for id`, elementID);
    const ctx = getContext(el);
    const qobj = ctxMeta.r;
    const seq = ctxMeta.s;
    const host = ctxMeta.h;
    const contexts = ctxMeta.c;
    const watches = ctxMeta.w;
    if (qobj) {
      assertTrue(isElement(el), "el must be an actual DOM element");
      ctx.$refMap$.push(...qobj.split(" ").map(getObject));
      ctx.li = getDomListeners(ctx, containerEl);
    }
    if (seq) {
      ctx.$seq$ = seq.split(" ").map(getObject);
    }
    if (watches) {
      ctx.$watches$ = watches.split(" ").map(getObject);
    }
    if (contexts) {
      contexts.split(" ").map((part) => {
        const [key, value] = part.split("=");
        if (!ctx.$contexts$) {
          ctx.$contexts$ = /* @__PURE__ */ new Map();
        }
        ctx.$contexts$.set(key, getObject(value));
      });
    }
    if (host) {
      const [props, renderQrl] = host.split(" ");
      assertDefined(props, `resume: props missing in host metadata`, host);
      assertDefined(renderQrl, `resume: renderQRL missing in host metadata`, host);
      ctx.$props$ = getObject(props);
      ctx.$renderQrl$ = getObject(renderQrl);
    }
  });
  directSetAttribute(containerEl, QContainerAttr, "resumed");
  logDebug("Container resumed");
  emitEvent(containerEl, "qresume", void 0, true);
};
const pauseFromContainer = async (containerEl) => {
  const containerState = getContainerState(containerEl);
  const contexts = getNodesInScope(containerEl, hasQId).map(tryGetContext);
  return _pauseFromContexts(contexts, containerState);
};
const _pauseFromContexts = async (elements, containerState) => {
  const elementToIndex = /* @__PURE__ */ new Map();
  const collector = createCollector(containerState);
  const listeners = [];
  for (const ctx of elements) {
    const el = ctx.$element$;
    if (isElement(el)) {
      Object.entries(ctx.li).forEach(([key, qrls]) => {
        qrls.forEach((qrl) => {
          listeners.push({
            key,
            qrl,
            el
          });
        });
      });
    }
    if (ctx.$watches$) {
      for (const watch of ctx.$watches$) {
        collector.$watches$.push(watch);
      }
    }
  }
  if (listeners.length === 0) {
    return {
      state: {
        ctx: {},
        objs: [],
        subs: []
      },
      objs: [],
      listeners: [],
      pendingContent: [],
      mode: "static"
    };
  }
  for (const listener of listeners) {
    assertQrl(listener.qrl);
    const captured = listener.qrl.$captureRef$;
    if (captured) {
      for (const obj of captured) {
        await collectValue(obj, collector, true);
      }
    }
    const ctx = tryGetContext(listener.el);
    for (const obj of ctx.$refMap$) {
      await collectValue(obj, collector, true);
    }
  }
  const canRender = collector.$elements$.length > 0;
  if (canRender) {
    for (const ctx of elements) {
      if (isVirtualElement(ctx.$element$)) {
        await collectProps(ctx.$element$, ctx.$props$, collector);
      }
      if (ctx.$contexts$) {
        for (const item of ctx.$contexts$.values()) {
          await collectValue(item, collector, false);
        }
      }
    }
  }
  const objs = Array.from(new Set(collector.$objMap$.values()));
  const objToId = /* @__PURE__ */ new Map();
  const getElementID = (el) => {
    let id = elementToIndex.get(el);
    if (id === void 0) {
      if (el.isConnected) {
        id = getQId(el);
        if (!id) {
          console.warn("Missing ID", el);
        } else {
          id = ELEMENT_ID_PREFIX + id;
        }
      } else {
        id = null;
      }
      elementToIndex.set(el, id);
    }
    return id;
  };
  const getObjId = (obj) => {
    let suffix = "";
    if (isMutable(obj)) {
      obj = obj.v;
      suffix = "%";
    }
    if (isPromise(obj)) {
      const { value, resolved } = getPromiseValue(obj);
      obj = value;
      if (resolved) {
        suffix += "~";
      } else {
        suffix += "_";
      }
    }
    if (isObject(obj)) {
      const target = getProxyTarget(obj);
      if (target) {
        suffix += "!";
        obj = target;
      }
      if (!target && isQwikElement(obj)) {
        const elID = getElementID(obj);
        if (elID) {
          return elID + suffix;
        }
        return null;
      }
    }
    if (collector.$objMap$.has(obj)) {
      const value = collector.$objMap$.get(obj);
      const id = objToId.get(value);
      assertTrue(typeof id === "number", "Can not find ID for object");
      return intToStr(id) + suffix;
    }
    return null;
  };
  const mustGetObjId = (obj) => {
    const key = getObjId(obj);
    if (key === null) {
      throw qError(QError_missingObjectId, obj);
    }
    return key;
  };
  const subsMap = /* @__PURE__ */ new Map();
  objs.forEach((obj) => {
    var _a2;
    const flags = getProxyFlags(containerState.$proxyMap$.get(obj));
    if (flags === void 0) {
      return;
    }
    const subsObj = [];
    if (flags > 0) {
      subsObj.push({
        subscriber: "$",
        data: flags
      });
    }
    const subs2 = (_a2 = containerState.$subsManager$.$tryGetLocal$(obj)) == null ? void 0 : _a2.$subs$;
    if (subs2) {
      subs2.forEach((set, key) => {
        if (isNode(key) && isVirtualElement(key)) {
          if (!collector.$elements$.includes(key)) {
            return;
          }
        }
        subsObj.push({
          subscriber: key,
          data: set ? Array.from(set) : null
        });
      });
    }
    if (subsObj.length > 0) {
      subsMap.set(obj, subsObj);
    }
  });
  objs.sort((a2, b) => {
    const isProxyA = subsMap.has(a2) ? 0 : 1;
    const isProxyB = subsMap.has(b) ? 0 : 1;
    return isProxyA - isProxyB;
  });
  let count = 0;
  for (const obj of objs) {
    objToId.set(obj, count);
    count++;
  }
  const subs = objs.map((obj) => {
    const sub = subsMap.get(obj);
    if (!sub) {
      return null;
    }
    const subsObj = {};
    sub.forEach(({ subscriber, data }) => {
      if (subscriber === "$") {
        subsObj[subscriber] = data;
      } else {
        const id = getObjId(subscriber);
        if (id !== null) {
          subsObj[id] = data;
        }
      }
    });
    return subsObj;
  }).filter(isNotNullable);
  const convertedObjs = objs.map((obj) => {
    if (obj === null) {
      return null;
    }
    const typeObj = typeof obj;
    switch (typeObj) {
      case "undefined":
        return UNDEFINED_PREFIX;
      case "string":
      case "number":
      case "boolean":
        return obj;
      default:
        const value = serializeValue(obj, getObjId, containerState);
        if (value !== void 0) {
          return value;
        }
        if (typeObj === "object") {
          if (isArray(obj)) {
            return obj.map(mustGetObjId);
          }
          if (isSerializableObject(obj)) {
            const output = {};
            Object.entries(obj).forEach(([key, value2]) => {
              output[key] = mustGetObjId(value2);
            });
            return output;
          }
        }
        break;
    }
    throw qError(QError_verifySerializable, obj);
  });
  const meta = {};
  elements.forEach((ctx) => {
    const node = ctx.$element$;
    assertDefined(ctx, `pause: missing context for dom node`, node);
    const ref = ctx.$refMap$;
    const props = ctx.$props$;
    const contexts = ctx.$contexts$;
    const watches = ctx.$watches$;
    const renderQrl = ctx.$renderQrl$;
    const seq = ctx.$seq$;
    const metaValue = {};
    const elementCaptured = isVirtualElement(node) && collector.$elements$.includes(node);
    let add = false;
    if (ref.length > 0) {
      const value = ref.map(mustGetObjId).join(" ");
      if (value) {
        metaValue.r = value;
        add = true;
      }
    }
    if (canRender) {
      if (elementCaptured && props) {
        const objs2 = [props];
        if (renderQrl) {
          objs2.push(renderQrl);
        }
        const value = objs2.map(mustGetObjId).join(" ");
        if (value) {
          metaValue.h = value;
          add = true;
        }
      }
      if (watches && watches.length > 0) {
        const value = watches.map(getObjId).filter(isNotNullable).join(" ");
        if (value) {
          metaValue.w = value;
          add = true;
        }
      }
      if (elementCaptured && seq && seq.length > 0) {
        const value = seq.map(mustGetObjId).join(" ");
        if (value) {
          metaValue.s = value;
          add = true;
        }
      }
      if (contexts) {
        const serializedContexts = [];
        contexts.forEach((value2, key) => {
          serializedContexts.push(`${key}=${mustGetObjId(value2)}`);
        });
        const value = serializedContexts.join(" ");
        if (value) {
          metaValue.c = value;
          add = true;
        }
      }
    }
    if (add) {
      const elementID = getElementID(node);
      assertDefined(elementID, `pause: can not generate ID for dom node`, node);
      meta[elementID] = metaValue;
    }
  });
  const pendingContent = [];
  for (const watch of collector.$watches$) {
    if (qDev$1) {
      if (watch.$flags$ & WatchFlagsIsDirty) {
        logWarn("Serializing dirty watch. Looks like an internal error.");
      }
      if (!isConnected(watch)) {
        logWarn("Serializing disconneted watch. Looks like an internal error.");
      }
    }
    destroyWatch(watch);
  }
  if (qDev$1) {
    elementToIndex.forEach((value, el) => {
      if (!value) {
        logWarn("unconnected element", el.nodeName, "\n");
      }
    });
  }
  return {
    state: {
      ctx: meta,
      objs: convertedObjs,
      subs
    },
    pendingContent,
    objs,
    listeners,
    mode: canRender ? "render" : "listeners"
  };
};
const getQwikJSON = (parentElm) => {
  let child = parentElm.lastElementChild;
  while (child) {
    if (child.tagName === "SCRIPT" && directGetAttribute(child, "type") === "qwik/json") {
      return child;
    }
    child = child.previousElementSibling;
  }
  return void 0;
};
const SHOW_ELEMENT = 1;
const SHOW_COMMENT = 128;
const FILTER_ACCEPT = 1;
const FILTER_REJECT = 2;
const FILTER_SKIP = 3;
const getNodesInScope = (parent, predicate) => {
  if (predicate(parent))
    ;
  const walker = parent.ownerDocument.createTreeWalker(parent, SHOW_ELEMENT | SHOW_COMMENT, {
    acceptNode(node) {
      if (isContainer(node)) {
        return FILTER_REJECT;
      }
      return predicate(node) ? FILTER_ACCEPT : FILTER_SKIP;
    }
  });
  const pars = [];
  let currentNode = null;
  while (currentNode = walker.nextNode()) {
    pars.push(processVirtualNodes(currentNode));
  }
  return pars;
};
const reviveValues = (objs, subs, getObject, containerState, parser) => {
  for (let i = 0; i < objs.length; i++) {
    const value = objs[i];
    if (isString(value)) {
      objs[i] = value === UNDEFINED_PREFIX ? void 0 : parser.prepare(value);
    }
  }
  for (let i = 0; i < subs.length; i++) {
    const value = objs[i];
    const sub = subs[i];
    if (sub) {
      const converted = /* @__PURE__ */ new Map();
      let flags = 0;
      Object.entries(sub).forEach((entry) => {
        if (entry[0] === "$") {
          flags = entry[1];
          return;
        }
        const el = getObject(entry[0]);
        if (!el) {
          logWarn("QWIK can not revive subscriptions because of missing element ID", entry, value);
          return;
        }
        const set = entry[1] === null ? null : new Set(entry[1]);
        converted.set(el, set);
      });
      createProxy(value, containerState, flags, converted);
    }
  }
};
const reviveNestedObjects = (obj, getObject, parser) => {
  if (parser.fill(obj)) {
    return;
  }
  if (obj && typeof obj == "object") {
    if (isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        const value = obj[i];
        if (typeof value == "string") {
          obj[i] = getObject(value);
        } else {
          reviveNestedObjects(value, getObject, parser);
        }
      }
    } else if (isSerializableObject(obj)) {
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const value = obj[key];
          if (typeof value == "string") {
            obj[key] = getObject(value);
          } else {
            reviveNestedObjects(value, getObject, parser);
          }
        }
      }
    }
  }
};
const OBJECT_TRANSFORMS = {
  "!": (obj, containerState) => {
    var _a2;
    return (_a2 = containerState.$proxyMap$.get(obj)) != null ? _a2 : getOrCreateProxy(obj, containerState);
  },
  "%": (obj) => {
    return mutable(obj);
  },
  "~": (obj) => {
    return Promise.resolve(obj);
  },
  _: (obj) => {
    return Promise.reject(obj);
  }
};
const getObjectImpl = (id, elements, objs, containerState) => {
  assertTrue(typeof id === "string" && id.length > 0, "resume: id must be an non-empty string, got:", id);
  if (id.startsWith(ELEMENT_ID_PREFIX)) {
    assertTrue(elements.has(id), `missing element for id:`, id);
    return elements.get(id);
  }
  const index2 = strToInt(id);
  assertTrue(objs.length > index2, "resume: index is out of bounds", id);
  let obj = objs[index2];
  for (let i = id.length - 1; i >= 0; i--) {
    const code = id[i];
    const transform = OBJECT_TRANSFORMS[code];
    if (!transform) {
      break;
    }
    obj = transform(obj, containerState);
  }
  return obj;
};
const collectProps = async (el, props, collector) => {
  var _a2;
  const subs = (_a2 = collector.$containerState$.$subsManager$.$tryGetLocal$(getProxyTarget(props))) == null ? void 0 : _a2.$subs$;
  if (subs && subs.has(el)) {
    await collectElement(el, collector);
  }
};
const createCollector = (containerState) => {
  return {
    $seen$: /* @__PURE__ */ new Set(),
    $seenLeaks$: /* @__PURE__ */ new Set(),
    $objMap$: /* @__PURE__ */ new Map(),
    $elements$: [],
    $watches$: [],
    $containerState$: containerState
  };
};
const collectElement = async (el, collector) => {
  if (collector.$elements$.includes(el)) {
    return;
  }
  const ctx = tryGetContext(el);
  if (ctx) {
    collector.$elements$.push(el);
    if (ctx.$props$) {
      await collectValue(ctx.$props$, collector, false);
    }
    if (ctx.$renderQrl$) {
      await collectValue(ctx.$renderQrl$, collector, false);
    }
    if (ctx.$seq$) {
      for (const obj of ctx.$seq$) {
        await collectValue(obj, collector, false);
      }
    }
    if (ctx.$watches$) {
      for (const obj of ctx.$watches$) {
        await collectValue(obj, collector, false);
      }
    }
    if (ctx.$contexts$) {
      for (const obj of ctx.$contexts$.values()) {
        await collectValue(obj, collector, false);
      }
    }
  }
};
const escapeText$1 = (str) => {
  return str.replace(/<(\/?script)/g, "\\x3C$1");
};
const unescapeText = (str) => {
  return str.replace(/\\x3C(\/?script)/g, "<$1");
};
const collectSubscriptions = async (target, collector) => {
  var _a2;
  const subs = (_a2 = collector.$containerState$.$subsManager$.$tryGetLocal$(target)) == null ? void 0 : _a2.$subs$;
  if (subs) {
    if (collector.$seen$.has(subs)) {
      return;
    }
    collector.$seen$.add(subs);
    for (const key of Array.from(subs.keys())) {
      if (isNode(key) && isVirtualElement(key)) {
        await collectElement(key, collector);
      } else {
        await collectValue(key, collector, true);
      }
    }
  }
};
const PROMISE_VALUE = Symbol();
const resolvePromise = (promise) => {
  return promise.then((value) => {
    const v = {
      resolved: true,
      value
    };
    promise[PROMISE_VALUE] = v;
    return value;
  }, (value) => {
    const v = {
      resolved: false,
      value
    };
    promise[PROMISE_VALUE] = v;
    return value;
  });
};
const getPromiseValue = (promise) => {
  assertTrue(PROMISE_VALUE in promise, "pause: promise was not resolved previously", promise);
  return promise[PROMISE_VALUE];
};
const collectValue = async (obj, collector, leaks) => {
  const input = obj;
  const seen = leaks ? collector.$seenLeaks$ : collector.$seen$;
  if (seen.has(obj)) {
    return;
  }
  seen.add(obj);
  if (!shouldSerialize(obj) || obj === void 0) {
    collector.$objMap$.set(obj, void 0);
    return;
  }
  if (obj != null) {
    if (isQrl$1(obj)) {
      collector.$objMap$.set(obj, obj);
      if (obj.$captureRef$) {
        for (const item of obj.$captureRef$) {
          await collectValue(item, collector, leaks);
        }
      }
      return;
    }
    if (typeof obj === "object") {
      if (isPromise(obj)) {
        const value = await resolvePromise(obj);
        await collectValue(value, collector, leaks);
        return;
      }
      const target = getProxyTarget(obj);
      if (!target && isNode(obj)) {
        if (isDocument(obj)) {
          collector.$objMap$.set(obj, obj);
        } else if (!isQwikElement(obj)) {
          throw qError(QError_verifySerializable, obj);
        }
        return;
      }
      if (target) {
        if (leaks) {
          await collectSubscriptions(target, collector);
        }
        obj = target;
        if (seen.has(obj)) {
          return;
        }
        seen.add(obj);
        if (isResourceReturn(obj)) {
          collector.$objMap$.set(target, target);
          await collectValue(obj.promise, collector, leaks);
          await collectValue(obj.resolved, collector, leaks);
          return;
        }
      }
      collector.$objMap$.set(obj, obj);
      if (isArray(obj)) {
        for (let i = 0; i < obj.length; i++) {
          await collectValue(input[i], collector, leaks);
        }
      } else {
        for (const key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            await collectValue(input[key], collector, leaks);
          }
        }
      }
      return;
    }
  }
  collector.$objMap$.set(obj, obj);
};
const isContainer = (el) => {
  return isElement(el) && el.hasAttribute(QContainerAttr);
};
const hasQId = (el) => {
  const node = processVirtualNodes(el);
  if (isQwikElement(node)) {
    return node.hasAttribute(ELEMENT_ID);
  }
  return false;
};
const intToStr = (nu) => {
  return nu.toString(36);
};
const strToInt = (nu) => {
  return parseInt(nu, 36);
};
const WatchFlagsIsEffect = 1 << 0;
const WatchFlagsIsWatch = 1 << 1;
const WatchFlagsIsDirty = 1 << 2;
const WatchFlagsIsCleanup = 1 << 3;
const WatchFlagsIsResource = 1 << 4;
const useWatchQrl = (qrl, opts) => {
  const { get, set, ctx, i } = useSequentialScope();
  if (get) {
    return;
  }
  assertQrl(qrl);
  const el = ctx.$hostElement$;
  const containerState = ctx.$renderCtx$.$static$.$containerState$;
  const watch = new Watch(WatchFlagsIsDirty | WatchFlagsIsWatch, i, el, qrl, void 0);
  const elCtx = getContext(el);
  set(true);
  qrl.$resolveLazy$();
  if (!elCtx.$watches$) {
    elCtx.$watches$ = [];
  }
  elCtx.$watches$.push(watch);
  waitAndRun(ctx, () => runSubscriber(watch, containerState));
  if (isServer$1(ctx)) {
    useRunWatch(watch, opts == null ? void 0 : opts.eagerness);
  }
};
const useClientEffectQrl = (qrl, opts) => {
  var _a2;
  const { get, set, i, ctx } = useSequentialScope();
  if (get) {
    return;
  }
  assertQrl(qrl);
  const el = ctx.$hostElement$;
  const watch = new Watch(WatchFlagsIsEffect, i, el, qrl, void 0);
  const eagerness = (_a2 = opts == null ? void 0 : opts.eagerness) != null ? _a2 : "visible";
  const elCtx = getContext(el);
  set(true);
  if (!elCtx.$watches$) {
    elCtx.$watches$ = [];
  }
  elCtx.$watches$.push(watch);
  useRunWatch(watch, eagerness);
  if (!isServer$1(ctx)) {
    qrl.$resolveLazy$();
    notifyWatch(watch, ctx.$renderCtx$.$static$.$containerState$);
  }
};
const isResourceWatch = (watch) => {
  return !!watch.$resource$;
};
const runSubscriber = async (watch, containerState) => {
  assertEqual(!!(watch.$flags$ & WatchFlagsIsDirty), true, "Resource is not dirty", watch);
  if (isResourceWatch(watch)) {
    await runResource(watch, containerState);
  } else {
    await runWatch(watch, containerState);
  }
};
const runResource = (watch, containerState, waitOn) => {
  watch.$flags$ &= ~WatchFlagsIsDirty;
  cleanupWatch(watch);
  const el = watch.$el$;
  const doc = getDocument(el);
  const invokationContext = newInvokeContext(doc, el, void 0, "WatchEvent");
  const { $subsManager$: subsManager } = containerState;
  const watchFn = watch.$qrl$.getFn(invokationContext, () => {
    subsManager.$clearSub$(watch);
  });
  const cleanups = [];
  const resource = watch.$resource$;
  assertDefined(resource, 'useResource: when running a resource, "watch.r" must be a defined.', watch);
  const track = (obj, prop) => {
    const target = getProxyTarget(obj);
    if (target) {
      const manager = subsManager.$getLocal$(target);
      manager.$addSub$(watch, prop);
    } else {
      logErrorAndStop(codeToText(QError_trackUseStore), obj);
    }
    if (prop) {
      return obj[prop];
    } else {
      return obj;
    }
  };
  const resourceTarget = unwrapProxy(resource);
  const opts = {
    track,
    cleanup(callback) {
      cleanups.push(callback);
    },
    previous: resourceTarget.resolved
  };
  let resolve;
  let reject;
  let done = false;
  const setState = (resolved, value) => {
    if (!done) {
      done = true;
      if (resolved) {
        done = true;
        resource.state = "resolved";
        resource.resolved = value;
        resource.error = void 0;
        resolve(value);
      } else {
        done = true;
        resource.state = "rejected";
        resource.resolved = void 0;
        resource.error = value;
        reject(value);
      }
      return true;
    }
    return false;
  };
  invoke(invokationContext, () => {
    resource.state = "pending";
    resource.resolved = void 0;
    resource.promise = new Promise((r, re) => {
      resolve = r;
      reject = re;
    });
  });
  watch.$destroy$ = noSerialize(() => {
    cleanups.forEach((fn) => fn());
  });
  const promise = safeCall(() => then(waitOn, () => watchFn(opts)), (value) => {
    setState(true, value);
  }, (reason) => {
    setState(false, reason);
  });
  const timeout = resourceTarget.timeout;
  if (timeout) {
    return Promise.race([
      promise,
      delay(timeout).then(() => {
        if (setState(false, "timeout")) {
          cleanupWatch(watch);
        }
      })
    ]);
  }
  return promise;
};
const runWatch = (watch, containerState) => {
  watch.$flags$ &= ~WatchFlagsIsDirty;
  cleanupWatch(watch);
  const el = watch.$el$;
  const doc = getDocument(el);
  const invokationContext = newInvokeContext(doc, el, void 0, "WatchEvent");
  const { $subsManager$: subsManager } = containerState;
  const watchFn = watch.$qrl$.getFn(invokationContext, () => {
    subsManager.$clearSub$(watch);
  });
  const track = (obj, prop) => {
    const target = getProxyTarget(obj);
    if (target) {
      const manager = subsManager.$getLocal$(target);
      manager.$addSub$(watch, prop);
    } else {
      logErrorAndStop(codeToText(QError_trackUseStore), obj);
    }
    if (prop) {
      return obj[prop];
    } else {
      return obj;
    }
  };
  const cleanups = [];
  watch.$destroy$ = noSerialize(() => {
    cleanups.forEach((fn) => fn());
  });
  const opts = {
    track,
    cleanup(callback) {
      cleanups.push(callback);
    }
  };
  return safeCall(() => watchFn(opts), (returnValue) => {
    if (isFunction(returnValue)) {
      cleanups.push(returnValue);
    }
  }, (reason) => {
    logError(reason);
  });
};
const cleanupWatch = (watch) => {
  const destroy = watch.$destroy$;
  if (destroy) {
    watch.$destroy$ = void 0;
    try {
      destroy();
    } catch (err) {
      logError(err);
    }
  }
};
const destroyWatch = (watch) => {
  if (watch.$flags$ & WatchFlagsIsCleanup) {
    watch.$flags$ &= ~WatchFlagsIsCleanup;
    const cleanup = watch.$qrl$;
    cleanup();
  } else {
    cleanupWatch(watch);
  }
};
const useRunWatch = (watch, eagerness) => {
  if (eagerness === "load") {
    useOn("qinit", getWatchHandlerQrl(watch));
  } else if (eagerness === "visible") {
    useOn("qvisible", getWatchHandlerQrl(watch));
  }
};
const getWatchHandlerQrl = (watch) => {
  const watchQrl = watch.$qrl$;
  const watchHandler = createQRL(watchQrl.$chunk$, "_hW", _hW, null, null, [watch], watchQrl.$symbol$);
  return watchHandler;
};
const isSubscriberDescriptor = (obj) => {
  return isObject(obj) && obj instanceof Watch;
};
const serializeWatch = (watch, getObjId) => {
  let value = `${intToStr(watch.$flags$)} ${intToStr(watch.$index$)} ${getObjId(watch.$qrl$)} ${getObjId(watch.$el$)}`;
  if (isResourceWatch(watch)) {
    value += ` ${getObjId(watch.$resource$)}`;
  }
  return value;
};
const parseWatch = (data) => {
  const [flags, index2, qrl, el, resource] = data.split(" ");
  return new Watch(strToInt(flags), strToInt(index2), el, qrl, resource);
};
class Watch {
  constructor($flags$, $index$, $el$, $qrl$, $resource$) {
    this.$flags$ = $flags$;
    this.$index$ = $index$;
    this.$el$ = $el$;
    this.$qrl$ = $qrl$;
    this.$resource$ = $resource$;
  }
}
const _createResourceReturn = (opts) => {
  const resource = {
    __brand: "resource",
    promise: void 0,
    resolved: void 0,
    error: void 0,
    state: "pending",
    timeout: opts == null ? void 0 : opts.timeout
  };
  return resource;
};
const isResourceReturn = (obj) => {
  return isObject(obj) && obj.__brand === "resource";
};
const serializeResource = (resource, getObjId) => {
  const state = resource.state;
  if (state === "resolved") {
    return `0 ${getObjId(resource.resolved)}`;
  } else if (state === "pending") {
    return `1`;
  } else {
    return `2 ${getObjId(resource.error)}`;
  }
};
const parseResourceReturn = (data) => {
  const [first, id] = data.split(" ");
  const result = _createResourceReturn(void 0);
  result.promise = Promise.resolve();
  if (first === "0") {
    result.state = "resolved";
    result.resolved = id;
  } else if (first === "1") {
    result.state = "pending";
    result.promise = new Promise(() => {
    });
  } else if (first === "2") {
    result.state = "rejected";
    result.error = id;
  }
  return result;
};
const UNDEFINED_PREFIX = "";
const QRLSerializer = {
  prefix: "",
  test: (v) => isQrl$1(v),
  serialize: (obj, getObjId, containerState) => {
    return stringifyQRL(obj, {
      $platform$: containerState.$platform$,
      $getObjId$: getObjId
    });
  },
  prepare: (data, containerState) => {
    return parseQRL(data, containerState.$containerEl$);
  },
  fill: (qrl, getObject) => {
    if (qrl.$capture$ && qrl.$capture$.length > 0) {
      qrl.$captureRef$ = qrl.$capture$.map(getObject);
      qrl.$capture$ = null;
    }
  }
};
const WatchSerializer = {
  prefix: "",
  test: (v) => isSubscriberDescriptor(v),
  serialize: (obj, getObjId) => serializeWatch(obj, getObjId),
  prepare: (data) => parseWatch(data),
  fill: (watch, getObject) => {
    watch.$el$ = getObject(watch.$el$);
    watch.$qrl$ = getObject(watch.$qrl$);
    if (watch.$resource$) {
      watch.$resource$ = getObject(watch.$resource$);
    }
  }
};
const ResourceSerializer = {
  prefix: "",
  test: (v) => isResourceReturn(v),
  serialize: (obj, getObjId) => {
    return serializeResource(obj, getObjId);
  },
  prepare: (data) => {
    return parseResourceReturn(data);
  },
  fill: (resource, getObject) => {
    if (resource.state === "resolved") {
      resource.resolved = getObject(resource.resolved);
      resource.promise = Promise.resolve(resource.resolved);
    } else if (resource.state === "rejected") {
      const p = Promise.reject(resource.error);
      p.catch(() => null);
      resource.error = getObject(resource.error);
      resource.promise = p;
    }
  }
};
const URLSerializer = {
  prefix: "",
  test: (v) => v instanceof URL,
  serialize: (obj) => obj.href,
  prepare: (data) => new URL(data),
  fill: void 0
};
const DateSerializer = {
  prefix: "",
  test: (v) => v instanceof Date,
  serialize: (obj) => obj.toISOString(),
  prepare: (data) => new Date(data),
  fill: void 0
};
const RegexSerializer = {
  prefix: "\x07",
  test: (v) => v instanceof RegExp,
  serialize: (obj) => `${obj.flags} ${obj.source}`,
  prepare: (data) => {
    const space = data.indexOf(" ");
    const source = data.slice(space + 1);
    const flags = data.slice(0, space);
    return new RegExp(source, flags);
  },
  fill: void 0
};
const ErrorSerializer = {
  prefix: "",
  test: (v) => v instanceof Error,
  serialize: (obj) => {
    return obj.message;
  },
  prepare: (text) => {
    const err = new Error(text);
    err.stack = void 0;
    return err;
  },
  fill: void 0
};
const DocumentSerializer = {
  prefix: "",
  test: (v) => isDocument(v),
  serialize: void 0,
  prepare: (_, _c, doc) => {
    return doc;
  },
  fill: void 0
};
const SERIALIZABLE_STATE = Symbol("serializable-data");
const ComponentSerializer = {
  prefix: "",
  test: (obj) => isQwikComponent(obj),
  serialize: (obj, getObjId, containerState) => {
    const [qrl] = obj[SERIALIZABLE_STATE];
    return stringifyQRL(qrl, {
      $platform$: containerState.$platform$,
      $getObjId$: getObjId
    });
  },
  prepare: (data, containerState) => {
    const optionsIndex = data.indexOf("{");
    const qrlString = optionsIndex == -1 ? data : data.slice(0, optionsIndex);
    const qrl = parseQRL(qrlString, containerState.$containerEl$);
    return componentQrl(qrl);
  },
  fill: (component, getObject) => {
    const [qrl] = component[SERIALIZABLE_STATE];
    if (qrl.$capture$ && qrl.$capture$.length > 0) {
      qrl.$captureRef$ = qrl.$capture$.map(getObject);
      qrl.$capture$ = null;
    }
  }
};
const PureFunctionSerializer = {
  prefix: "",
  test: (obj) => typeof obj === "function" && obj.__qwik_serializable__ !== void 0,
  serialize: (obj) => {
    return obj.toString();
  },
  prepare: (data) => {
    const fn = new Function("return " + data)();
    fn.__qwik_serializable__ = true;
    return fn;
  },
  fill: void 0
};
const serializers = [
  QRLSerializer,
  WatchSerializer,
  ResourceSerializer,
  URLSerializer,
  DateSerializer,
  RegexSerializer,
  ErrorSerializer,
  DocumentSerializer,
  ComponentSerializer,
  PureFunctionSerializer
];
const canSerialize = (obj) => {
  for (const s of serializers) {
    if (s.test(obj)) {
      return true;
    }
  }
  return false;
};
const serializeValue = (obj, getObjID, containerState) => {
  for (const s of serializers) {
    if (s.test(obj)) {
      let value = s.prefix;
      if (s.serialize) {
        value += s.serialize(obj, getObjID, containerState);
      }
      return value;
    }
  }
  return void 0;
};
const createParser = (getObject, containerState, doc) => {
  const map = /* @__PURE__ */ new Map();
  return {
    prepare(data) {
      for (const s of serializers) {
        const prefix = s.prefix;
        if (data.startsWith(prefix)) {
          const value = s.prepare(data.slice(prefix.length), containerState, doc);
          if (s.fill) {
            map.set(value, s);
          }
          return value;
        }
      }
      return data;
    },
    fill(obj) {
      const serializer = map.get(obj);
      if (serializer) {
        serializer.fill(obj, getObject, containerState);
        return true;
      }
      return false;
    }
  };
};
const QObjectRecursive = 1 << 0;
const QObjectImmutable = 1 << 1;
const getOrCreateProxy = (target, containerState, flags = 0) => {
  const proxy = containerState.$proxyMap$.get(target);
  if (proxy) {
    return proxy;
  }
  return createProxy(target, containerState, flags, void 0);
};
const createProxy = (target, containerState, flags, subs) => {
  assertEqual(unwrapProxy(target), target, "Unexpected proxy at this location", target);
  assertTrue(!containerState.$proxyMap$.has(target), "Proxy was already created", target);
  if (!isObject(target)) {
    throw qError(QError_onlyObjectWrapped, target);
  }
  if (target.constructor !== Object && !isArray(target)) {
    throw qError(QError_onlyLiteralWrapped, target);
  }
  const manager = containerState.$subsManager$.$getLocal$(target, subs);
  const proxy = new Proxy(target, new ReadWriteProxyHandler(containerState, manager, flags));
  containerState.$proxyMap$.set(target, proxy);
  return proxy;
};
const QOjectTargetSymbol = Symbol();
const QOjectFlagsSymbol = Symbol();
class ReadWriteProxyHandler {
  constructor($containerState$, $manager$, $flags$) {
    this.$containerState$ = $containerState$;
    this.$manager$ = $manager$;
    this.$flags$ = $flags$;
  }
  get(target, prop) {
    if (typeof prop === "symbol") {
      if (prop === QOjectTargetSymbol)
        return target;
      if (prop === QOjectFlagsSymbol)
        return this.$flags$;
      return target[prop];
    }
    let subscriber;
    const invokeCtx = tryGetInvokeContext();
    const recursive = (this.$flags$ & QObjectRecursive) !== 0;
    const immutable = (this.$flags$ & QObjectImmutable) !== 0;
    if (invokeCtx) {
      subscriber = invokeCtx.$subscriber$;
    }
    let value = target[prop];
    if (isMutable(value)) {
      value = value.v;
    } else if (immutable) {
      subscriber = null;
    }
    if (subscriber) {
      const isA = isArray(target);
      this.$manager$.$addSub$(subscriber, isA ? void 0 : prop);
    }
    return recursive ? wrap(value, this.$containerState$) : value;
  }
  set(target, prop, newValue) {
    if (typeof prop === "symbol") {
      target[prop] = newValue;
      return true;
    }
    const immutable = (this.$flags$ & QObjectImmutable) !== 0;
    if (immutable) {
      throw qError(QError_immutableProps);
    }
    const recursive = (this.$flags$ & QObjectRecursive) !== 0;
    const unwrappedNewValue = recursive ? unwrapProxy(newValue) : newValue;
    if (qDev$1) {
      verifySerializable(unwrappedNewValue);
      const invokeCtx = tryGetInvokeContext();
      if (invokeCtx && invokeCtx.$event$ === RenderEvent) {
        logWarn("State mutation inside render function. Move mutation to useWatch(), useClientEffect() or useServerMount()", invokeCtx.$hostElement$, prop);
      }
    }
    const isA = isArray(target);
    if (isA) {
      target[prop] = unwrappedNewValue;
      this.$manager$.$notifySubs$();
      return true;
    }
    const oldValue = target[prop];
    if (oldValue !== unwrappedNewValue) {
      target[prop] = unwrappedNewValue;
      this.$manager$.$notifySubs$(prop);
    }
    return true;
  }
  has(target, property) {
    if (property === QOjectTargetSymbol)
      return true;
    if (property === QOjectFlagsSymbol)
      return true;
    return Object.prototype.hasOwnProperty.call(target, property);
  }
  ownKeys(target) {
    let subscriber = null;
    const invokeCtx = tryGetInvokeContext();
    if (invokeCtx) {
      subscriber = invokeCtx.$subscriber$;
    }
    if (subscriber) {
      this.$manager$.$addSub$(subscriber);
    }
    return Object.getOwnPropertyNames(target);
  }
}
const wrap = (value, containerState) => {
  if (isQrl$1(value)) {
    return value;
  }
  if (isObject(value)) {
    if (Object.isFrozen(value)) {
      return value;
    }
    const nakedValue = unwrapProxy(value);
    if (nakedValue !== value) {
      return value;
    }
    if (isNode(nakedValue)) {
      return value;
    }
    if (!shouldSerialize(nakedValue)) {
      return value;
    }
    if (qDev$1) {
      verifySerializable(value);
    }
    const proxy = containerState.$proxyMap$.get(value);
    return proxy ? proxy : getOrCreateProxy(value, containerState, QObjectRecursive);
  } else {
    return value;
  }
};
const verifySerializable = (value) => {
  const seen = /* @__PURE__ */ new Set();
  return _verifySerializable(value, seen);
};
const _verifySerializable = (value, seen) => {
  const unwrapped = unwrapProxy(value);
  if (unwrapped == null) {
    return value;
  }
  if (shouldSerialize(unwrapped)) {
    if (seen.has(unwrapped)) {
      return value;
    }
    seen.add(unwrapped);
    if (canSerialize(unwrapped)) {
      return value;
    }
    switch (typeof unwrapped) {
      case "object":
        if (isPromise(unwrapped))
          return value;
        if (isQwikElement(unwrapped))
          return value;
        if (isDocument(unwrapped))
          return value;
        if (isArray(unwrapped)) {
          for (const item of unwrapped) {
            _verifySerializable(item, seen);
          }
          return value;
        }
        if (isSerializableObject(unwrapped)) {
          for (const item of Object.values(unwrapped)) {
            _verifySerializable(item, seen);
          }
          return value;
        }
        break;
      case "boolean":
      case "string":
      case "number":
        return value;
    }
    throw qError(QError_verifySerializable, unwrapped);
  }
  return value;
};
const noSerializeSet = /* @__PURE__ */ new WeakSet();
const shouldSerialize = (obj) => {
  if (isObject(obj) || isFunction(obj)) {
    return !noSerializeSet.has(obj);
  }
  return true;
};
const noSerialize = (input) => {
  if (input != null) {
    noSerializeSet.add(input);
  }
  return input;
};
const mutable = (v) => {
  return {
    [MUTABLE]: true,
    v
  };
};
const isConnected = (sub) => {
  if (isQwikElement(sub)) {
    return !!tryGetContext(sub) || sub.isConnected;
  } else {
    return isConnected(sub.$el$);
  }
};
const MUTABLE = Symbol("mutable");
const isMutable = (v) => {
  return isObject(v) && v[MUTABLE] === true;
};
const unwrapProxy = (proxy) => {
  var _a2;
  return (_a2 = getProxyTarget(proxy)) != null ? _a2 : proxy;
};
const getProxyTarget = (obj) => {
  if (isObject(obj)) {
    return obj[QOjectTargetSymbol];
  }
  return void 0;
};
const getProxyFlags = (obj) => {
  if (isObject(obj)) {
    return obj[QOjectFlagsSymbol];
  }
  return void 0;
};
const Q_CTX = "_qc_";
const resumeIfNeeded = (containerEl) => {
  const isResumed = directGetAttribute(containerEl, QContainerAttr);
  if (isResumed === "paused") {
    resumeContainer(containerEl);
    if (qDev$1) {
      appendQwikDevTools(containerEl);
    }
  }
};
const appendQwikDevTools = (containerEl) => {
  containerEl["qwik"] = {
    pause: () => pauseContainer(containerEl),
    state: getContainerState(containerEl)
  };
};
const tryGetContext = (element) => {
  return element[Q_CTX];
};
const getContext = (element) => {
  let ctx = tryGetContext(element);
  if (!ctx) {
    element[Q_CTX] = ctx = {
      $dirty$: false,
      $mounted$: false,
      $attachedListeners$: false,
      $id$: "",
      $element$: element,
      $refMap$: [],
      li: {},
      $watches$: null,
      $seq$: null,
      $slots$: null,
      $scopeIds$: null,
      $appendStyles$: null,
      $props$: null,
      $vdom$: null,
      $renderQrl$: null,
      $contexts$: null
    };
  }
  return ctx;
};
const cleanupContext = (ctx, subsManager) => {
  var _a2;
  const el = ctx.$element$;
  (_a2 = ctx.$watches$) == null ? void 0 : _a2.forEach((watch) => {
    subsManager.$clearSub$(watch);
    destroyWatch(watch);
  });
  if (ctx.$renderQrl$) {
    subsManager.$clearSub$(el);
  }
  ctx.$renderQrl$ = null;
  ctx.$seq$ = null;
  ctx.$watches$ = null;
  ctx.$dirty$ = false;
  el[Q_CTX] = void 0;
};
const PREFIXES = ["on", "window:on", "document:on"];
const SCOPED = ["on", "on-window", "on-document"];
const normalizeOnProp = (prop) => {
  let scope = "on";
  for (let i = 0; i < PREFIXES.length; i++) {
    const prefix = PREFIXES[i];
    if (prop.startsWith(prefix)) {
      scope = SCOPED[i];
      prop = prop.slice(prefix.length);
      break;
    }
  }
  if (prop.startsWith("-")) {
    prop = fromCamelToKebabCase(prop.slice(1));
  } else {
    prop = prop.toLowerCase();
  }
  return scope + ":" + prop;
};
const createProps = (target, containerState) => {
  return createProxy(target, containerState, QObjectImmutable);
};
const getPropsMutator = (ctx, containerState) => {
  let props = ctx.$props$;
  if (!ctx.$props$) {
    ctx.$props$ = props = createProps({}, containerState);
  }
  const target = getProxyTarget(props);
  assertDefined(target, `props have to be a proxy, but it is not`, props);
  const manager = containerState.$subsManager$.$getLocal$(target);
  return {
    set(prop, value) {
      var _a2, _b;
      const didSet = prop in target;
      let oldValue = target[prop];
      let mut = false;
      if (isMutable(oldValue)) {
        oldValue = oldValue.v;
      }
      if (containerState.$mutableProps$) {
        mut = true;
        if (isMutable(value)) {
          value = value.v;
          target[prop] = value;
        } else {
          target[prop] = mutable(value);
        }
      } else {
        target[prop] = value;
        if (isMutable(value)) {
          value = value.v;
          mut = true;
        }
      }
      if (oldValue !== value) {
        if (qDev$1) {
          if (didSet && !mut && !isQrl$1(value)) {
            const displayName = (_b = (_a2 = ctx.$renderQrl$) == null ? void 0 : _a2.getSymbol()) != null ? _b : ctx.$element$.localName;
            logError(codeToText(QError_immutableJsxProps), `If you need to change a value of a passed in prop, please wrap the prop with "mutable()" <${displayName} ${prop}={mutable(...)}>`, "\n - Component:", displayName, "\n - Prop:", prop, "\n - Old value:", oldValue, "\n - New value:", value);
          }
        }
        manager.$notifySubs$(prop);
      }
    }
  };
};
const inflateQrl = (qrl, elCtx) => {
  assertDefined(qrl.$capture$, "invoke: qrl capture must be defined inside useLexicalScope()", qrl);
  return qrl.$captureRef$ = qrl.$capture$.map((idx) => {
    const int = parseInt(idx, 10);
    const obj = elCtx.$refMap$[int];
    assertTrue(elCtx.$refMap$.length > int, "out of bounds inflate access", idx);
    return obj;
  });
};
const STYLE = qDev$1 ? `background: #564CE0; color: white; padding: 2px 3px; border-radius: 2px; font-size: 0.8em;` : "";
const logError = (message, ...optionalParams) => {
  const err = message instanceof Error ? message : new Error(message);
  console.error("%cQWIK ERROR", STYLE, err.message, ...printParams(optionalParams), err.stack);
  return err;
};
const logErrorAndStop = (message, ...optionalParams) => {
  const err = logError(message, ...optionalParams);
  debugger;
  return err;
};
const logWarn = (message, ...optionalParams) => {
  if (qDev$1) {
    console.warn("%cQWIK WARN", STYLE, message, ...printParams(optionalParams));
  }
};
const logDebug = (message, ...optionalParams) => {
  if (qDev$1) {
    console.debug("%cQWIK", STYLE, message, ...printParams(optionalParams));
  }
};
const printParams = (optionalParams) => {
  if (qDev$1) {
    return optionalParams.map((p) => {
      if (isNode$1(p) && isElement(p)) {
        return printElement(p);
      }
      return p;
    });
  }
  return optionalParams;
};
const printElement = (el) => {
  var _a2;
  const ctx = tryGetContext(el);
  const isServer2 = /* @__PURE__ */ (() => typeof process !== "undefined" && !!process.versions && !!process.versions.node)();
  return {
    tagName: el.tagName,
    renderQRL: (_a2 = ctx == null ? void 0 : ctx.$renderQrl$) == null ? void 0 : _a2.getSymbol(),
    element: isServer2 ? void 0 : el,
    ctx: isServer2 ? void 0 : ctx
  };
};
const QError_stringifyClassOrStyle = 0;
const QError_runtimeQrlNoElement = 2;
const QError_verifySerializable = 3;
const QError_errorWhileRendering = 4;
const QError_setProperty = 6;
const QError_onlyObjectWrapped = 8;
const QError_onlyLiteralWrapped = 9;
const QError_qrlIsNotFunction = 10;
const QError_notFoundContext = 13;
const QError_useMethodOutsideContext = 14;
const QError_immutableProps = 17;
const QError_immutableJsxProps = 19;
const QError_useInvokeContext = 20;
const QError_containerAlreadyPaused = 21;
const QError_invalidJsxNodeType = 25;
const QError_trackUseStore = 26;
const QError_missingObjectId = 27;
const QError_invalidContext = 28;
const QError_canNotRenderHTML = 29;
const qError = (code, ...parts) => {
  const text = codeToText(code);
  return logErrorAndStop(text, ...parts);
};
const codeToText = (code) => {
  var _a2;
  if (qDev$1) {
    const MAP = [
      "Error while serializing class attribute",
      "Can not serialize a HTML Node that is not an Element",
      "Rruntime but no instance found on element.",
      "Only primitive and object literals can be serialized",
      "Crash while rendering",
      "You can render over a existing q:container. Skipping render().",
      "Set property",
      "Only function's and 'string's are supported.",
      "Only objects can be wrapped in 'QObject'",
      `Only objects literals can be wrapped in 'QObject'`,
      "QRL is not a function",
      "Dynamic import not found",
      "Unknown type argument",
      "Actual value for useContext() can not be found, make sure some ancestor component has set a value using useContextProvider()",
      "Invoking 'use*()' method outside of invocation context.",
      "Cant access renderCtx for existing context",
      "Cant access document for existing context",
      "props are inmutable",
      "<div> component can only be used at the root of a Qwik component$()",
      "Props are immutable by default.",
      "use- method must be called only at the root level of a component$()",
      "Container is already paused. Skipping",
      'Components using useServerMount() can only be mounted in the server, if you need your component to be mounted in the client, use "useMount$()" instead',
      "When rendering directly on top of Document, the root node must be a <html>",
      "A <html> node must have 2 children. The first one <head> and the second one a <body>",
      "Invalid JSXNode type. It must be either a function or a string. Found:",
      "Tracking value changes can only be done to useStore() objects and component props",
      "Missing Object ID for captured object",
      "The provided Context reference is not a valid context created by createContext()",
      "<html> is the root container, it can not be rendered inside a component"
    ];
    return `Code(${code}): ${(_a2 = MAP[code]) != null ? _a2 : ""}`;
  } else {
    return `Code(${code})`;
  }
};
const isQrl$1 = (value) => {
  return typeof value === "function" && typeof value.getSymbol === "function";
};
const createQRL = (chunk, symbol, symbolRef, symbolFn, capture, captureRef, refSymbol) => {
  if (qDev$1) {
    verifySerializable(captureRef);
  }
  let containerEl;
  const setContainer = (el) => {
    if (!containerEl) {
      containerEl = el;
    }
  };
  const resolve = async () => {
    if (symbolRef) {
      return symbolRef;
    }
    if (symbolFn) {
      return symbolRef = symbolFn().then((module) => symbolRef = module[symbol]);
    } else {
      if (!containerEl) {
        throw new Error(`QRL '${chunk}#${symbol || "default"}' does not have an attached container`);
      }
      const symbol2 = getPlatform(containerEl).importSymbol(containerEl, chunk, symbol);
      return symbolRef = then(symbol2, (ref) => {
        return symbolRef = ref;
      });
    }
  };
  const resolveLazy = () => {
    return isFunction(symbolRef) ? symbolRef : resolve();
  };
  const invokeFn = (currentCtx2, beforeFn) => {
    return (...args) => {
      const fn = resolveLazy();
      return then(fn, (fn2) => {
        if (isFunction(fn2)) {
          if (beforeFn && beforeFn() === false) {
            return;
          }
          const baseContext = createInvokationContext(currentCtx2);
          const context = {
            ...baseContext,
            $qrl$: QRL
          };
          return invoke(context, fn2, ...args);
        }
        throw qError(QError_qrlIsNotFunction);
      });
    };
  };
  const createInvokationContext = (invoke2) => {
    if (invoke2 == null) {
      return newInvokeContext();
    } else if (isArray(invoke2)) {
      return newInvokeContextFromTuple(invoke2);
    } else {
      return invoke2;
    }
  };
  const invokeQRL = async function(...args) {
    const fn = invokeFn();
    const result = await fn(...args);
    return result;
  };
  const resolvedSymbol = refSymbol != null ? refSymbol : symbol;
  const hash = getSymbolHash$1(resolvedSymbol);
  const QRL = invokeQRL;
  const methods = {
    getSymbol: () => resolvedSymbol,
    getHash: () => hash,
    resolve,
    $resolveLazy$: resolveLazy,
    $setContainer$: setContainer,
    $chunk$: chunk,
    $symbol$: symbol,
    $refSymbol$: refSymbol,
    $hash$: hash,
    getFn: invokeFn,
    $capture$: capture,
    $captureRef$: captureRef
  };
  const qrl = Object.assign(invokeQRL, methods);
  seal(qrl);
  return qrl;
};
const getSymbolHash$1 = (symbolName) => {
  const index2 = symbolName.lastIndexOf("_");
  if (index2 > -1) {
    return symbolName.slice(index2 + 1);
  }
  return symbolName;
};
function assertQrl(qrl) {
  if (qDev$1) {
    if (!isQrl$1(qrl)) {
      throw new Error("Not a QRL");
    }
  }
}
let runtimeSymbolId = 0;
const RUNTIME_QRL = "/runtimeQRL";
const INLINED_QRL = "/inlinedQRL";
const runtimeQrl = (symbol, lexicalScopeCapture = EMPTY_ARRAY$1) => {
  return createQRL(RUNTIME_QRL, "s" + runtimeSymbolId++, symbol, null, null, lexicalScopeCapture, null);
};
const inlinedQrl = (symbol, symbolName, lexicalScopeCapture = EMPTY_ARRAY$1) => {
  return createQRL(INLINED_QRL, symbolName, symbol, null, null, lexicalScopeCapture, null);
};
const stringifyQRL = (qrl, opts = {}) => {
  var _a2;
  assertQrl(qrl);
  let symbol = qrl.$symbol$;
  let chunk = qrl.$chunk$;
  const refSymbol = (_a2 = qrl.$refSymbol$) != null ? _a2 : symbol;
  const platform = opts.$platform$;
  const element = opts.$element$;
  if (platform) {
    const result = platform.chunkForSymbol(refSymbol);
    if (result) {
      chunk = result[1];
      if (!qrl.$refSymbol$) {
        symbol = result[0];
      }
    }
  }
  if (chunk.startsWith("./")) {
    chunk = chunk.slice(2);
  }
  const parts = [chunk];
  if (symbol && symbol !== "default") {
    if (chunk === RUNTIME_QRL && qTest) {
      symbol = "_";
    }
    parts.push("#", symbol);
  }
  const capture = qrl.$capture$;
  const captureRef = qrl.$captureRef$;
  if (captureRef && captureRef.length) {
    if (opts.$getObjId$) {
      const capture2 = captureRef.map(opts.$getObjId$);
      parts.push(`[${capture2.join(" ")}]`);
    } else if (opts.$addRefMap$) {
      const capture2 = captureRef.map(opts.$addRefMap$);
      parts.push(`[${capture2.join(" ")}]`);
    }
  } else if (capture && capture.length > 0) {
    parts.push(`[${capture.join(" ")}]`);
  }
  const qrlString = parts.join("");
  if (qrl.$chunk$ === RUNTIME_QRL && element) {
    const qrls = element.__qrls__ || (element.__qrls__ = /* @__PURE__ */ new Set());
    qrls.add(qrl);
  }
  return qrlString;
};
const serializeQRLs = (existingQRLs, elCtx) => {
  assertTrue(isElement$1(elCtx.$element$), "Element must be an actual element");
  const opts = {
    $platform$: getPlatform(elCtx.$element$),
    $element$: elCtx.$element$,
    $addRefMap$: (obj) => addToArray(elCtx.$refMap$, obj)
  };
  return existingQRLs.map((qrl) => stringifyQRL(qrl, opts)).join("\n");
};
const parseQRL = (qrl, containerEl) => {
  const endIdx = qrl.length;
  const hashIdx = indexOf(qrl, 0, "#");
  const captureIdx = indexOf(qrl, hashIdx, "[");
  const chunkEndIdx = Math.min(hashIdx, captureIdx);
  const chunk = qrl.substring(0, chunkEndIdx);
  const symbolStartIdx = hashIdx == endIdx ? hashIdx : hashIdx + 1;
  const symbolEndIdx = captureIdx;
  const symbol = symbolStartIdx == symbolEndIdx ? "default" : qrl.substring(symbolStartIdx, symbolEndIdx);
  const captureStartIdx = captureIdx;
  const captureEndIdx = endIdx;
  const capture = captureStartIdx === captureEndIdx ? EMPTY_ARRAY$1 : qrl.substring(captureStartIdx + 1, captureEndIdx - 1).split(" ");
  if (chunk === RUNTIME_QRL) {
    logError(codeToText(QError_runtimeQrlNoElement), qrl);
  }
  const iQrl = createQRL(chunk, symbol, null, null, capture, null, null);
  if (containerEl) {
    iQrl.$setContainer$(containerEl);
  }
  return iQrl;
};
const indexOf = (text, startIdx, char) => {
  const endIdx = text.length;
  const charIdx = text.indexOf(char, startIdx == endIdx ? 0 : startIdx);
  return charIdx == -1 ? endIdx : charIdx;
};
const addToArray = (array, obj) => {
  const index2 = array.indexOf(obj);
  if (index2 === -1) {
    array.push(obj);
    return array.length - 1;
  }
  return index2;
};
const $ = (expression) => {
  return runtimeQrl(expression);
};
const componentQrl = (onRenderQrl) => {
  function QwikComponent(props, key) {
    assertQrl(onRenderQrl);
    const hash = qTest ? "sX" : onRenderQrl.$hash$;
    const finalKey = hash + ":" + (key ? key : "");
    return jsx(Virtual, { [OnRenderProp]: onRenderQrl, ...props }, finalKey);
  }
  QwikComponent[SERIALIZABLE_STATE] = [onRenderQrl];
  return QwikComponent;
};
const isQwikComponent = (component) => {
  return typeof component == "function" && component[SERIALIZABLE_STATE] !== void 0;
};
const Slot = (props) => {
  var _a2;
  const name = (_a2 = props.name) != null ? _a2 : "";
  return jsx(Virtual, {
    [QSlotS]: ""
  }, name);
};
const version = "0.0.108";
const IS_HEAD = 1 << 0;
const IS_RAW_CONTENT = 1 << 1;
const IS_HTML = 1 << 2;
const renderSSR = async (doc, node, opts) => {
  var _a2;
  const root = opts.containerTagName;
  const containerEl = doc.createElement(root);
  const containerState = getContainerState(containerEl);
  const rctx = createRenderContext(doc, containerState);
  const headNodes = (_a2 = opts.beforeContent) != null ? _a2 : [];
  const ssrCtx = {
    rctx,
    $contexts$: [],
    projectedChildren: void 0,
    projectedContext: void 0,
    hostCtx: void 0,
    invocationContext: void 0,
    headNodes: root === "html" ? headNodes : []
  };
  const containerAttributes = {
    ...opts.containerAttributes,
    "q:container": "paused",
    "q:version": version,
    "q:render": qDev$1 ? "ssr-dev" : "ssr"
  };
  if (opts.base) {
    containerAttributes["q:base"] = opts.base;
  }
  if (opts.url) {
    containerState.$envData$["url"] = opts.url;
  }
  if (opts.envData) {
    Object.assign(containerState.$envData$, opts.envData);
  }
  if (root === "html") {
    node = jsx(root, {
      ...containerAttributes,
      children: [node]
    });
  } else {
    node = jsx(root, {
      ...containerAttributes,
      children: [...headNodes != null ? headNodes : [], node]
    });
  }
  containerState.$hostsRendering$ = /* @__PURE__ */ new Set();
  containerState.$renderPromise$ = Promise.resolve().then(() => renderRoot(node, ssrCtx, opts.stream, containerState, opts));
  await containerState.$renderPromise$;
};
const renderRoot = async (node, ssrCtx, stream, containerState, opts) => {
  const beforeClose = opts.beforeClose;
  await renderNode(node, ssrCtx, stream, 0, (stream2) => {
    const result = beforeClose == null ? void 0 : beforeClose(ssrCtx.$contexts$, containerState);
    if (result) {
      return processData(result, ssrCtx, stream2, 0, void 0);
    }
  });
  if (qDev$1) {
    if (ssrCtx.headNodes.length > 0) {
      logError("Missing <head>. Global styles could not be rendered. Please render a <head> element at the root of the app");
    }
  }
  return ssrCtx.rctx.$static$;
};
const renderNodeFunction = (node, ssrCtx, stream, flags, beforeClose) => {
  var _a2;
  const fn = node.type;
  if (fn === SSRComment) {
    stream.write(`<!--${(_a2 = node.props.data) != null ? _a2 : ""}-->`);
    return;
  }
  if (fn === InternalSSRStream) {
    return renderGenerator(node, ssrCtx, stream, flags);
  }
  if (fn === Virtual) {
    const elCtx = getContext(ssrCtx.rctx.$static$.$doc$.createElement(VIRTUAL));
    return renderNodeVirtual(node, elCtx, void 0, ssrCtx, stream, flags, beforeClose);
  }
  const res = ssrCtx.invocationContext ? invoke(ssrCtx.invocationContext, () => node.type(node.props, node.key)) : node.type(node.props, node.key);
  return processData(res, ssrCtx, stream, flags, beforeClose);
};
const renderGenerator = async (node, ssrCtx, stream, flags) => {
  const generator = node.props.children;
  let value;
  if (isFunction(generator)) {
    const v = generator(stream);
    if (isPromise(v)) {
      return v;
    }
    value = v;
  } else {
    value = generator;
  }
  for await (const chunk of value) {
    await processData(chunk, ssrCtx, stream, flags, void 0);
  }
};
const renderNodeVirtual = (node, elCtx, extraNodes, ssrCtx, stream, flags, beforeClose) => {
  var _a2;
  const props = node.props;
  const renderQrl = props[OnRenderProp];
  if (renderQrl) {
    elCtx.$renderQrl$ = renderQrl;
    return renderSSRComponent(ssrCtx, stream, elCtx, node, flags, beforeClose);
  }
  const { children, ...attributes } = node.props;
  const isSlot = QSlotS in props;
  const key = node.key != null ? String(node.key) : null;
  if (isSlot) {
    assertDefined((_a2 = ssrCtx.hostCtx) == null ? void 0 : _a2.$id$, "hostId must be defined for a slot");
    attributes[QSlotRef] = ssrCtx.hostCtx.$id$;
  }
  if (key != null) {
    attributes["q:key"] = key;
  }
  const url = new Map(Object.entries(attributes));
  stream.write(`<!--qv ${serializeVirtualAttributes(url)}-->`);
  if (extraNodes) {
    for (const node2 of extraNodes) {
      renderNodeElementSync(node2.type, node2.props, stream);
    }
  }
  const promise = processData(props.children, ssrCtx, stream, flags);
  return then(promise, () => {
    var _a3;
    if (!isSlot && !beforeClose) {
      stream.write(CLOSE_VIRTUAL);
      return;
    }
    let promise2;
    if (isSlot) {
      assertDefined(key, "key must be defined for a slot");
      const content = (_a3 = ssrCtx.projectedChildren) == null ? void 0 : _a3[key];
      if (content) {
        ssrCtx.projectedChildren[key] = void 0;
        promise2 = processData(content, ssrCtx.projectedContext, stream, flags);
      }
    }
    if (beforeClose) {
      promise2 = then(promise2, () => beforeClose(stream));
    }
    return then(promise2, () => {
      stream.write(CLOSE_VIRTUAL);
    });
  });
};
const CLOSE_VIRTUAL = `<!--/qv-->`;
const renderNodeElement = (node, extraAttributes, extraNodes, ssrCtx, stream, flags, beforeClose) => {
  const key = node.key != null ? String(node.key) : null;
  const props = node.props;
  const textType = node.type;
  const elCtx = getContext(ssrCtx.rctx.$static$.$doc$.createElement(node.type));
  const hasRef = "ref" in props;
  const attributes = updateProperties(elCtx, props);
  const hostCtx = ssrCtx.hostCtx;
  if (hostCtx) {
    if (textType === "html") {
      throw qError(QError_canNotRenderHTML);
    }
    attributes["class"] = joinClasses(hostCtx.$scopeIds$, attributes["class"]);
    const cmp = hostCtx;
    if (!cmp.$attachedListeners$) {
      cmp.$attachedListeners$ = true;
      Object.entries(hostCtx.li).forEach(([eventName, qrls]) => {
        addQRLListener(elCtx.li, eventName, qrls);
      });
    }
  }
  if (textType === "head") {
    flags |= IS_HEAD;
  }
  const listeners = Object.entries(elCtx.li);
  const isHead = flags & IS_HEAD;
  if (key != null) {
    attributes["q:key"] = key;
  }
  if (hasRef || listeners.length > 0) {
    const newID = getNextIndex(ssrCtx.rctx);
    attributes[ELEMENT_ID] = newID;
    elCtx.$id$ = newID;
    ssrCtx.$contexts$.push(elCtx);
  }
  if (isHead) {
    attributes["q:head"] = "";
  }
  if (extraAttributes) {
    Object.assign(attributes, extraAttributes);
  }
  listeners.forEach(([key2, value]) => {
    attributes[key2] = serializeQRLs(value, elCtx);
  });
  if (renderNodeElementSync(textType, attributes, stream)) {
    return;
  }
  if (textType !== "head") {
    flags &= ~IS_HEAD;
  }
  if (textType === "html") {
    flags |= IS_HTML;
  } else {
    flags &= ~IS_HTML;
  }
  if (hasRawContent[textType]) {
    flags |= IS_RAW_CONTENT;
  } else {
    flags &= ~IS_RAW_CONTENT;
  }
  if (extraNodes) {
    for (const node2 of extraNodes) {
      renderNodeElementSync(node2.type, node2.props, stream);
    }
  }
  const promise = processData(props.children, ssrCtx, stream, flags);
  return then(promise, () => {
    if (textType === "head") {
      ssrCtx.headNodes.forEach((node2) => {
        renderNodeElementSync(node2.type, node2.props, stream);
      });
      ssrCtx.headNodes.length = 0;
    }
    if (!beforeClose) {
      stream.write(`</${textType}>`);
      return;
    }
    return then(beforeClose(stream), () => {
      stream.write(`</${textType}>`);
    });
  });
};
const renderNodeElementSync = (tagName, attributes, stream) => {
  stream.write(`<${tagName}`);
  Object.entries(attributes).forEach(([key, value]) => {
    if (key !== "dangerouslySetInnerHTML" && key !== "children") {
      if (key === "class" && !value) {
        return;
      }
      const chunk = value === "" ? ` ${key}` : ` ${key}="${escapeAttr(value)}"`;
      stream.write(chunk);
    }
  });
  stream.write(`>`);
  const empty = !!emptyElements[tagName];
  if (empty) {
    return true;
  }
  const innerHTML = attributes.dangerouslySetInnerHTML;
  if (innerHTML) {
    stream.write(innerHTML);
    stream.write(`</${tagName}>`);
    return true;
  }
  return false;
};
const renderSSRComponent = (ssrCtx, stream, elCtx, node, flags, beforeClose) => {
  const attributes = updateComponentProperties(ssrCtx.rctx, elCtx, node.props);
  return then(executeComponent(ssrCtx.rctx, elCtx), (res) => {
    if (!res) {
      logError("component was not rendered during SSR");
      return;
    }
    const hostElement = elCtx.$element$;
    const newCtx = res.rctx;
    let children = node.props.children;
    if (children) {
      if (isArray(children)) {
        if (children.filter(isNotNullable).length === 0) {
          children = void 0;
        }
      } else {
        children = [children];
      }
    }
    const invocationContext = newInvokeContext(newCtx.$static$.$doc$, hostElement, void 0);
    invocationContext.$subscriber$ = hostElement;
    invocationContext.$renderCtx$ = newCtx;
    const projectedContext = {
      ...ssrCtx,
      rctx: newCtx
    };
    const newSSrContext = {
      ...ssrCtx,
      projectedChildren: splitProjectedChildren(children, ssrCtx),
      projectedContext,
      rctx: newCtx,
      invocationContext
    };
    const extraNodes = [];
    if (elCtx.$appendStyles$) {
      const isHTML = !!(flags & IS_HTML);
      const array = isHTML ? ssrCtx.headNodes : extraNodes;
      for (const style of elCtx.$appendStyles$) {
        array.push(jsx("style", {
          [QStyle]: style.styleId,
          dangerouslySetInnerHTML: style.content
        }));
      }
    }
    if (elCtx.$scopeIds$) {
      for (const styleId of elCtx.$scopeIds$) {
      }
      const value = serializeSStyle(elCtx.$scopeIds$);
      if (value) {
        attributes[QScopedStyle] = value;
      }
    }
    const newID = getNextIndex(ssrCtx.rctx);
    attributes[ELEMENT_ID] = newID;
    elCtx.$id$ = newID;
    ssrCtx.$contexts$.push(elCtx);
    const processedNode = jsx(node.type, {
      ...attributes,
      children: res.node
    }, node.key);
    newSSrContext.hostCtx = elCtx;
    return renderNodeVirtual(processedNode, elCtx, extraNodes, newSSrContext, stream, flags, (stream2) => {
      return then(renderQTemplates(newSSrContext, stream2), () => {
        return beforeClose == null ? void 0 : beforeClose(stream2);
      });
    });
  });
};
const renderQTemplates = (ssrContext, stream) => {
  const projectedChildren = ssrContext.projectedChildren;
  if (projectedChildren) {
    const nodes = Object.keys(projectedChildren).map((slotName) => {
      const value = projectedChildren[slotName];
      if (value) {
        return jsx("q:template", {
          [QSlot]: slotName,
          hidden: "",
          "aria-hidden": "true",
          children: value
        });
      }
    });
    return processData(nodes, ssrContext, stream, 0, void 0);
  }
};
const splitProjectedChildren = (children, ssrCtx) => {
  var _a2;
  const flatChildren = flatVirtualChildren(children, ssrCtx);
  if (flatChildren === null) {
    return void 0;
  }
  const slotMap = {};
  for (const child of flatChildren) {
    let slotName = "";
    if (isJSXNode(child)) {
      slotName = (_a2 = child.props[QSlot]) != null ? _a2 : "";
    }
    let array = slotMap[slotName];
    if (!array) {
      slotMap[slotName] = array = [];
    }
    array.push(child);
  }
  return slotMap;
};
const renderNode = (node, ssrCtx, stream, flags, beforeClose) => {
  if (typeof node.type === "string") {
    return renderNodeElement(node, void 0, void 0, ssrCtx, stream, flags, beforeClose);
  } else {
    return renderNodeFunction(node, ssrCtx, stream, flags, beforeClose);
  }
};
const processData = (node, ssrCtx, stream, flags, beforeClose) => {
  if (node == null || typeof node === "boolean") {
    return;
  }
  if (isJSXNode(node)) {
    return renderNode(node, ssrCtx, stream, flags, beforeClose);
  } else if (isPromise(node)) {
    return node.then((node2) => processData(node2, ssrCtx, stream, flags, beforeClose));
  } else if (isArray(node)) {
    node = _flatVirtualChildren(node, ssrCtx);
    return walkChildren(node, ssrCtx, stream, flags);
  } else if (isString(node) || typeof node === "number") {
    if ((flags & IS_RAW_CONTENT) !== 0) {
      stream.write(String(node));
    } else {
      stream.write(escape(String(node)));
    }
  } else {
    logWarn("A unsupported value was passed to the JSX, skipping render. Value:", node);
  }
};
function walkChildren(children, ssrContext, stream, flags) {
  if (children == null) {
    return;
  }
  if (!isArray(children)) {
    return processData(children, ssrContext, stream, flags);
  }
  if (children.length === 1) {
    return processData(children[0], ssrContext, stream, flags);
  }
  if (children.length === 0) {
    return;
  }
  let currentIndex = 0;
  const buffers = [];
  return children.reduce((prevPromise, child, index2) => {
    const buffer = [];
    buffers.push(buffer);
    const localStream = {
      write(chunk) {
        if (currentIndex === index2) {
          stream.write(chunk);
        } else {
          buffer.push(chunk);
        }
      }
    };
    return then(processData(child, ssrContext, localStream, flags), () => {
      return then(prevPromise, () => {
        currentIndex++;
        if (buffers.length > currentIndex) {
          buffers[currentIndex].forEach((chunk) => stream.write(chunk));
        }
      });
    });
  }, void 0);
}
const flatVirtualChildren = (children, ssrCtx) => {
  if (children == null) {
    return null;
  }
  const result = _flatVirtualChildren(children, ssrCtx);
  const nodes = isArray(result) ? result : [result];
  if (nodes.length === 0) {
    return null;
  }
  return nodes;
};
const _flatVirtualChildren = (children, ssrCtx) => {
  if (children == null) {
    return null;
  }
  if (isArray(children)) {
    return children.flatMap((c) => _flatVirtualChildren(c, ssrCtx));
  } else if (isJSXNode(children) && isFunction(children.type) && children.type !== SSRComment && children.type !== InternalSSRStream && children.type !== Virtual) {
    const fn = children.type;
    const res = ssrCtx.invocationContext ? invoke(ssrCtx.invocationContext, () => fn(children.props, children.key)) : fn(children.props, children.key);
    return flatVirtualChildren(res, ssrCtx);
  }
  return children;
};
const updateProperties = (ctx, expectProps) => {
  const attributes = {};
  if (!expectProps) {
    return attributes;
  }
  const keys = Object.keys(expectProps);
  if (keys.length === 0) {
    return attributes;
  }
  const elm = ctx.$element$;
  for (const key of keys) {
    if (key === "children" || key === OnRenderProp) {
      continue;
    }
    const newValue = expectProps[key];
    if (key === "ref") {
      newValue.current = elm;
      continue;
    }
    if (key.startsWith("data-") || key.startsWith("aria-")) {
      attributes[key] = newValue;
      continue;
    }
    if (isOnProp(key)) {
      setEvent(ctx.li, key, newValue);
      continue;
    }
    setProperty(attributes, key, newValue);
  }
  return attributes;
};
const updateComponentProperties = (rctx, ctx, expectProps) => {
  const attributes = {};
  if (!expectProps) {
    return attributes;
  }
  const keys = Object.keys(expectProps);
  if (keys.length === 0) {
    return attributes;
  }
  const qwikProps = getPropsMutator(ctx, rctx.$static$.$containerState$);
  for (const key of keys) {
    if (key === "children" || key === OnRenderProp) {
      continue;
    }
    const newValue = expectProps[key];
    const skipProperty = ALLOWS_PROPS.includes(key);
    if (!skipProperty) {
      qwikProps.set(key, newValue);
      continue;
    }
    setProperty(attributes, key, newValue);
  }
  return attributes;
};
function setProperty(attributes, prop, value) {
  if (value != null && value !== false) {
    prop = processPropKey(prop);
    const attrValue = processPropValue(prop, value, attributes[prop]);
    if (attrValue !== null) {
      attributes[prop] = attrValue;
    }
  }
}
function processPropKey(prop) {
  if (prop === "className") {
    return "class";
  }
  return prop;
}
function processPropValue(prop, value, prevValue) {
  if (prop === "class") {
    const str = joinClasses(value, prevValue);
    return str === "" ? null : str;
  }
  if (prop === "style") {
    return stringifyStyle(value);
  }
  if (value === false || value == null) {
    return null;
  }
  if (value === true) {
    return "";
  }
  return String(value);
}
const hasRawContent = {
  style: true,
  script: true
};
const emptyElements = {
  area: true,
  base: true,
  basefont: true,
  bgsound: true,
  br: true,
  col: true,
  embed: true,
  frame: true,
  hr: true,
  img: true,
  input: true,
  keygen: true,
  link: true,
  meta: true,
  param: true,
  source: true,
  track: true,
  wbr: true
};
const escape = (s) => {
  return s.replace(/[&<>\u00A0]/g, (c) => {
    switch (c) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "\xA0":
        return "&nbsp;";
      default:
        return "";
    }
  });
};
const escapeAttr = (s) => {
  const toEscape = /[&"\u00A0]/g;
  if (!toEscape.test(s)) {
    return s;
  } else {
    return s.replace(toEscape, (c) => {
      switch (c) {
        case "&":
          return "&amp;";
        case '"':
          return "&quot;";
        case "\xA0":
          return "&nbsp;";
        default:
          return "";
      }
    });
  }
};
const useStore = (initialState, opts) => {
  var _a2;
  const { get, set, ctx } = useSequentialScope();
  if (get != null) {
    return get;
  }
  const value = isFunction(initialState) ? initialState() : initialState;
  if ((opts == null ? void 0 : opts.reactive) === false) {
    set(value);
    return value;
  } else {
    const containerState = ctx.$renderCtx$.$static$.$containerState$;
    const recursive = (_a2 = opts == null ? void 0 : opts.recursive) != null ? _a2 : false;
    const flags = recursive ? QObjectRecursive : 0;
    const newStore = createProxy(value, containerState, flags, void 0);
    set(newStore);
    return newStore;
  }
};
const createContext = (name) => {
  return Object.freeze({
    id: fromCamelToKebabCase(name)
  });
};
const useContextProvider = (context, newValue) => {
  const { get, set, ctx } = useSequentialScope();
  if (get) {
    return;
  }
  if (qDev$1) {
    validateContext(context);
  }
  const hostElement = ctx.$hostElement$;
  const hostCtx = getContext(hostElement);
  let contexts = hostCtx.$contexts$;
  if (!contexts) {
    hostCtx.$contexts$ = contexts = /* @__PURE__ */ new Map();
  }
  if (qDev$1) {
    verifySerializable(newValue);
  }
  contexts.set(context.id, newValue);
  set(true);
};
const useContext = (context) => {
  const { get, set, ctx } = useSequentialScope();
  if (get) {
    return get;
  }
  if (qDev$1) {
    validateContext(context);
  }
  let hostElement = ctx.$hostElement$;
  const contexts = ctx.$renderCtx$.$localStack$;
  for (let i = contexts.length - 1; i >= 0; i--) {
    const ctx2 = contexts[i];
    hostElement = ctx2.$element$;
    if (ctx2.$contexts$) {
      const found = ctx2.$contexts$.get(context.id);
      if (found) {
        set(found);
        return found;
      }
    }
  }
  if (hostElement.closest) {
    const value = queryContextFromDom(hostElement, context.id);
    if (value !== void 0) {
      set(value);
      return value;
    }
  }
  throw qError(QError_notFoundContext, context.id);
};
const queryContextFromDom = (hostElement, contextId) => {
  var _a2;
  let element = hostElement;
  while (element) {
    let node = element;
    let virtual;
    while (node && (virtual = findVirtual(node))) {
      const contexts = (_a2 = tryGetContext(virtual)) == null ? void 0 : _a2.$contexts$;
      if (contexts) {
        if (contexts.has(contextId)) {
          return contexts.get(contextId);
        }
      }
      node = virtual;
    }
    element = element.parentElement;
  }
  return void 0;
};
const findVirtual = (el) => {
  let node = el;
  let stack = 1;
  while (node = node.previousSibling) {
    if (isComment(node)) {
      if (node.data === "/qv") {
        stack++;
      } else if (node.data.startsWith("qv ")) {
        stack--;
        if (stack === 0) {
          return getVirtualElement(node);
        }
      }
    }
  }
  return null;
};
const validateContext = (context) => {
  if (!isObject(context) || typeof context.id !== "string" || context.id.length === 0) {
    throw qError(QError_invalidContext, context);
  }
};
function useEnvData(key, defaultValue) {
  var _a2;
  const ctx = useInvokeContext();
  return (_a2 = ctx.$renderCtx$.$static$.$containerState$.$envData$[key]) != null ? _a2 : defaultValue;
}
const scopeStylesheet = (css, scopeId) => {
  const end = css.length;
  const out = [];
  const stack = [];
  let idx = 0;
  let lastIdx = idx;
  let mode = rule;
  let lastCh = 0;
  while (idx < end) {
    let ch = css.charCodeAt(idx++);
    if (ch === BACKSLASH) {
      idx++;
      ch = A;
    }
    const arcs = STATE_MACHINE[mode];
    for (let i = 0; i < arcs.length; i++) {
      const arc = arcs[i];
      const [expectLastCh, expectCh, newMode] = arc;
      if (expectLastCh === lastCh || expectLastCh === ANY || expectLastCh === IDENT && isIdent(lastCh) || expectLastCh === WHITESPACE && isWhiteSpace(lastCh)) {
        if (expectCh === ch || expectCh === ANY || expectCh === IDENT && isIdent(ch) || expectCh === NOT_IDENT && !isIdent(ch) && ch !== DOT || expectCh === WHITESPACE && isWhiteSpace(ch)) {
          if (arc.length == 3 || lookAhead(arc)) {
            if (arc.length > 3) {
              ch = css.charCodeAt(idx - 1);
            }
            if (newMode === EXIT || newMode == EXIT_INSERT_SCOPE) {
              if (newMode === EXIT_INSERT_SCOPE) {
                if (mode === starSelector && !shouldNotInsertScoping()) {
                  if (isChainedSelector(ch)) {
                    flush(idx - 2);
                  } else {
                    insertScopingSelector(idx - 2);
                  }
                  lastIdx++;
                } else {
                  if (!isChainedSelector(ch)) {
                    const offset = expectCh == NOT_IDENT ? 1 : expectCh == CLOSE_PARENTHESIS ? 2 : 0;
                    insertScopingSelector(idx - offset);
                  }
                }
              }
              if (expectCh === NOT_IDENT) {
                idx--;
                ch = lastCh;
              }
              do {
                mode = stack.pop() || rule;
                if (mode === pseudoGlobal) {
                  flush(idx - 1);
                  lastIdx++;
                }
              } while (isSelfClosingRule(mode));
            } else {
              stack.push(mode);
              if (mode === pseudoGlobal && newMode === rule) {
                flush(idx - 8);
                lastIdx = idx;
              } else if (newMode === pseudoElement) {
                insertScopingSelector(idx - 2);
              }
              mode = newMode;
            }
            break;
          }
        }
      }
    }
    lastCh = ch;
  }
  flush(idx);
  return out.join("");
  function flush(idx2) {
    out.push(css.substring(lastIdx, idx2));
    lastIdx = idx2;
  }
  function insertScopingSelector(idx2) {
    if (mode === pseudoGlobal || shouldNotInsertScoping())
      return;
    flush(idx2);
    out.push(".", ComponentStylesPrefixContent, scopeId);
  }
  function lookAhead(arc) {
    let prefix = 0;
    if (css.charCodeAt(idx) === DASH) {
      for (let i = 1; i < 10; i++) {
        if (css.charCodeAt(idx + i) === DASH) {
          prefix = i + 1;
          break;
        }
      }
    }
    words:
      for (let arcIndx = 3; arcIndx < arc.length; arcIndx++) {
        const txt = arc[arcIndx];
        for (let i = 0; i < txt.length; i++) {
          if ((css.charCodeAt(idx + i + prefix) | LOWERCASE) !== txt.charCodeAt(i)) {
            continue words;
          }
        }
        idx += txt.length + prefix;
        return true;
      }
    return false;
  }
  function shouldNotInsertScoping() {
    return stack.indexOf(pseudoGlobal) !== -1 || stack.indexOf(atRuleSelector) !== -1;
  }
};
const isIdent = (ch) => {
  return ch >= _0 && ch <= _9 || ch >= A && ch <= Z || ch >= a && ch <= z || ch >= 128 || ch === UNDERSCORE || ch === DASH;
};
const isChainedSelector = (ch) => {
  return ch === COLON || ch === DOT || ch === OPEN_BRACKET || ch === HASH || isIdent(ch);
};
const isSelfClosingRule = (mode) => {
  return mode === atRuleBlock || mode === atRuleSelector || mode === atRuleInert || mode === pseudoGlobal;
};
const isWhiteSpace = (ch) => {
  return ch === SPACE || ch === TAB || ch === NEWLINE || ch === CARRIAGE_RETURN;
};
const rule = 0;
const elementClassIdSelector = 1;
const starSelector = 2;
const pseudoClassWithSelector = 3;
const pseudoClass = 4;
const pseudoGlobal = 5;
const pseudoElement = 6;
const attrSelector = 7;
const inertParenthesis = 8;
const inertBlock = 9;
const atRuleSelector = 10;
const atRuleBlock = 11;
const atRuleInert = 12;
const body = 13;
const stringSingle = 14;
const stringDouble = 15;
const commentMultiline = 16;
const EXIT = 17;
const EXIT_INSERT_SCOPE = 18;
const ANY = 0;
const IDENT = 1;
const NOT_IDENT = 2;
const WHITESPACE = 3;
const TAB = 9;
const NEWLINE = 10;
const CARRIAGE_RETURN = 13;
const SPACE = 32;
const DOUBLE_QUOTE = 34;
const HASH = 35;
const SINGLE_QUOTE = 39;
const OPEN_PARENTHESIS = 40;
const CLOSE_PARENTHESIS = 41;
const STAR = 42;
const DASH = 45;
const DOT = 46;
const FORWARD_SLASH = 47;
const _0 = 48;
const _9 = 57;
const COLON = 58;
const SEMICOLON = 59;
const AT = 64;
const A = 65;
const Z = 90;
const OPEN_BRACKET = 91;
const CLOSE_BRACKET = 93;
const BACKSLASH = 92;
const UNDERSCORE = 95;
const LOWERCASE = 32;
const a = 97;
const z = 122;
const OPEN_BRACE = 123;
const CLOSE_BRACE = 125;
const STRINGS_COMMENTS = (() => [
  [ANY, SINGLE_QUOTE, stringSingle],
  [ANY, DOUBLE_QUOTE, stringDouble],
  [ANY, FORWARD_SLASH, commentMultiline, "*"]
])();
const STATE_MACHINE = (() => [
  [
    [ANY, STAR, starSelector],
    [ANY, OPEN_BRACKET, attrSelector],
    [ANY, COLON, pseudoElement, ":"],
    [ANY, COLON, pseudoGlobal, "global"],
    [
      ANY,
      COLON,
      pseudoClassWithSelector,
      "has",
      "host-context",
      "not",
      "where",
      "is",
      "matches",
      "any"
    ],
    [ANY, COLON, pseudoClass],
    [ANY, IDENT, elementClassIdSelector],
    [ANY, DOT, elementClassIdSelector],
    [ANY, HASH, elementClassIdSelector],
    [ANY, AT, atRuleSelector, "keyframe"],
    [ANY, AT, atRuleBlock, "media", "supports"],
    [ANY, AT, atRuleInert],
    [ANY, OPEN_BRACE, body],
    [FORWARD_SLASH, STAR, commentMultiline],
    [ANY, SEMICOLON, EXIT],
    [ANY, CLOSE_BRACE, EXIT],
    [ANY, CLOSE_PARENTHESIS, EXIT],
    ...STRINGS_COMMENTS
  ],
  [
    [ANY, NOT_IDENT, EXIT_INSERT_SCOPE]
  ],
  [
    [ANY, NOT_IDENT, EXIT_INSERT_SCOPE]
  ],
  [
    [ANY, OPEN_PARENTHESIS, rule],
    [ANY, NOT_IDENT, EXIT_INSERT_SCOPE]
  ],
  [
    [ANY, OPEN_PARENTHESIS, inertParenthesis],
    [ANY, NOT_IDENT, EXIT_INSERT_SCOPE]
  ],
  [
    [ANY, OPEN_PARENTHESIS, rule],
    [ANY, NOT_IDENT, EXIT]
  ],
  [
    [ANY, NOT_IDENT, EXIT]
  ],
  [
    [ANY, CLOSE_BRACKET, EXIT_INSERT_SCOPE],
    [ANY, SINGLE_QUOTE, stringSingle],
    [ANY, DOUBLE_QUOTE, stringDouble]
  ],
  [
    [ANY, CLOSE_PARENTHESIS, EXIT],
    ...STRINGS_COMMENTS
  ],
  [
    [ANY, CLOSE_BRACE, EXIT],
    ...STRINGS_COMMENTS
  ],
  [
    [ANY, CLOSE_BRACE, EXIT],
    [WHITESPACE, IDENT, elementClassIdSelector],
    [ANY, COLON, pseudoGlobal, "global"],
    [ANY, OPEN_BRACE, body],
    ...STRINGS_COMMENTS
  ],
  [
    [ANY, OPEN_BRACE, rule],
    [ANY, SEMICOLON, EXIT],
    ...STRINGS_COMMENTS
  ],
  [
    [ANY, SEMICOLON, EXIT],
    [ANY, OPEN_BRACE, inertBlock],
    ...STRINGS_COMMENTS
  ],
  [
    [ANY, CLOSE_BRACE, EXIT],
    [ANY, OPEN_BRACE, body],
    [ANY, OPEN_PARENTHESIS, inertParenthesis],
    ...STRINGS_COMMENTS
  ],
  [
    [ANY, SINGLE_QUOTE, EXIT]
  ],
  [
    [ANY, DOUBLE_QUOTE, EXIT]
  ],
  [
    [STAR, FORWARD_SLASH, EXIT]
  ]
])();
const useStylesScopedQrl = (styles) => {
  _useStyles(styles, scopeStylesheet, true);
};
const _useStyles = (styleQrl, transform, scoped) => {
  const { get, set, ctx, i } = useSequentialScope();
  if (get) {
    return get;
  }
  const renderCtx = ctx.$renderCtx$;
  const styleId = styleKey(styleQrl, i);
  const hostElement = ctx.$hostElement$;
  const containerState = renderCtx.$static$.$containerState$;
  const elCtx = getContext(ctx.$hostElement$);
  set(styleId);
  if (!elCtx.$appendStyles$) {
    elCtx.$appendStyles$ = [];
  }
  if (!elCtx.$scopeIds$) {
    elCtx.$scopeIds$ = [];
  }
  if (scoped) {
    elCtx.$scopeIds$.push(styleContent(styleId));
  }
  if (!hasStyle(containerState, styleId)) {
    containerState.$styleIds$.add(styleId);
    ctx.$waitOn$.push(styleQrl.resolve(hostElement).then((styleText) => {
      elCtx.$appendStyles$.push({
        styleId,
        content: transform(styleText, styleId)
      });
    }));
  }
  return styleId;
};
const footerStyle = ".footer {\r\n    padding: 0rem;\r\n    position: relative;\r\n    display: flex;\r\n    justify-content: center;\r\n    border-top: solid 1px var(--color-3);\r\n}\r\n\r\nimg {\r\n    height: 30px;\r\n    object-fit: contain;\r\n\r\n}\r\n\r\n.footer div {\r\n    display: flex;\r\n    align-items: center;\r\n    align-self: center;\r\n}\r\n\r\n.footer .section-wrapper-footer {\r\n    padding: 2rem;\r\n    width: 800px;\r\n    max-width: 800px;\r\n    gap: 2rem;\r\n    align-self: center;\r\n    justify-content: center;\r\n    flex-wrap: wrap;\r\n}\r\n\r\n.footer .footer-logo {\r\n    display: flex;\r\n    gap: 2rem;\r\n}";
const Footer = /* @__PURE__ */ componentQrl(inlinedQrl(() => {
  useStylesScopedQrl(inlinedQrl(footerStyle, "s_7RXsVZFEVkQ"));
  return /* @__PURE__ */ jsx("div", {
    className: "footer",
    children: /* @__PURE__ */ jsx("div", {
      className: "section-wrapper-footer",
      children: [
        /* @__PURE__ */ jsx("div", {
          className: "footer-logo",
          children: [
            /* @__PURE__ */ jsx("div", {
              children: /* @__PURE__ */ jsx("img", {
                width: "92px",
                height: "30px",
                src: "/img/visa.svg",
                alt: ""
              })
            }),
            /* @__PURE__ */ jsx("div", {
              children: /* @__PURE__ */ jsx("img", {
                width: "112px",
                height: "30px",
                src: "/img/paypal.svg",
                alt: ""
              })
            })
          ]
        }),
        /* @__PURE__ */ jsx("div", {
          children: "Garant\xEDa de reembolso de 30 d\xEDas"
        })
      ]
    })
  });
}, "s_ZG5NmNv3vZg"));
const menuStyle = ".menu-wrapper {\r\n    border-bottom: solid 1px var(--color-3);\r\n    font-size: 1.6rem;\r\n}\r\n\r\n.menu-wrapper .menu {\r\n    margin: 0;\r\n    padding: 0;\r\n    display: flex;\r\n    list-style: none;\r\n}\r\n\r\n.menu-wrapper .menu li {\r\n    padding: .5rem 1rem;\r\n}\r\n\r\n.menu-wrapper .menu li {\r\n    display: flex;\r\n    gap: .25rem;\r\n    cursor: pointer;\r\n    transition: all ease-in 130ms;\r\n    margin-bottom: -1px;\r\n    border-right: solid 1px var(--color-3);\r\n}\r\n\r\n.menu-wrapper .menu li a {\r\n    display: flex;\r\n    gap: .25rem;\r\n    align-items: center;\r\n    align-content: center;\r\n}\r\n\r\n.menu-wrapper .menu li span {\r\n    display: flex;\r\n    align-items: center;\r\n    align-content: center;\r\n}\r\n\r\n.menu-wrapper .menu li:first {\r\n    border-right-color: transparent;\r\n}\r\n\r\n\r\n.menu-wrapper .menu li:hover {\r\n    background-color: var(--color-3);\r\n}\r\n\r\n.menu-wrapper .menu .logo {\r\n    height: 20px;\r\n    object-fit: contain;\r\n}\r\n\r\n.menu-wrapper .menu-section {\r\n    display: flex;\r\n    justify-content: space-between;\r\n}\r\n\r\n@media screen and (max-width: 520px) {\r\n    .menu-wrapper .menu li {\r\n        font-size: 1rem;\r\n    }\r\n}";
const Menu = /* @__PURE__ */ componentQrl(inlinedQrl(() => {
  useStylesScopedQrl(inlinedQrl(menuStyle, "s_n70Gc0CIChg"));
  const state = useStore({
    items: [
      {
        name: "Backend",
        link: "/node",
        icon: "/img/ts.svg",
        size: {
          w: "20px",
          h: "20px"
        }
      },
      {
        name: "Cloud AWS",
        link: "aws",
        icon: "/img/aws-ec2.svg",
        size: {
          w: "20px",
          h: "20px"
        }
      }
    ],
    cta: {
      name: "\xBFQui\xE9n soy?",
      link: "#section-video"
    }
  });
  const renderLink = state.items.map((item) => /* @__PURE__ */ jsx("li", {
    children: /* @__PURE__ */ jsx("a", {
      href: item.link,
      children: [
        /* @__PURE__ */ jsx("span", {
          children: /* @__PURE__ */ jsx("img", {
            width: item.size.w,
            height: item.size.h,
            className: "logo",
            src: item.icon,
            alt: ""
          })
        }),
        item.name
      ]
    })
  }));
  const renderCta = /* @__PURE__ */ jsx("li", {
    children: /* @__PURE__ */ jsx("a", {
      href: state.cta.link,
      children: state.cta.name
    })
  });
  return /* @__PURE__ */ jsx("div", {
    className: "menu-wrapper",
    children: /* @__PURE__ */ jsx("div", {
      className: "menu-section",
      children: [
        /* @__PURE__ */ jsx("ul", {
          className: "menu",
          children: renderLink
        }),
        /* @__PURE__ */ jsx("ul", {
          className: "menu",
          children: renderCta
        })
      ]
    })
  });
}, "s_8j6XIgveZCc"));
const layout = /* @__PURE__ */ componentQrl(inlinedQrl(() => {
  return /* @__PURE__ */ jsx(Fragment, {
    children: [
      /* @__PURE__ */ jsx(Menu, {}),
      /* @__PURE__ */ jsx(Slot, {}),
      " ",
      /* @__PURE__ */ jsx(Footer, {})
    ]
  });
}, "s_z8saDCzoko8"));
const Layout_ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: layout
}, Symbol.toStringTag, { value: "Module" }));
const onGet = async ({ request, response }) => {
  const { url } = request;
  if (url.includes("node"))
    throw response.redirect("/node");
  if (url.includes("aws")) {
    console.log(url);
    throw response.redirect("/aws");
  }
  throw response.redirect("/node");
};
const index$1 = /* @__PURE__ */ componentQrl(inlinedQrl(() => {
  return /* @__PURE__ */ jsx(Fragment, {});
}, "s_lWjUoUq84ME"));
const Index = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  onGet,
  default: index$1
}, Symbol.toStringTag, { value: "Module" }));
const isServer = true;
const isBrowser = false;
const ContentContext = /* @__PURE__ */ createContext("qc-c");
const ContentInternalContext = /* @__PURE__ */ createContext("qc-ic");
const DocumentHeadContext = /* @__PURE__ */ createContext("qc-h");
const RouteLocationContext = /* @__PURE__ */ createContext("qc-l");
const RouteNavigateContext = /* @__PURE__ */ createContext("qc-n");
const RouterOutlet = /* @__PURE__ */ componentQrl(inlinedQrl(() => {
  const { contents } = useContext(ContentInternalContext);
  if (contents && contents.length > 0) {
    const contentsLen = contents.length;
    let cmp = null;
    for (let i = contentsLen - 1; i >= 0; i--)
      cmp = jsx(contents[i].default, {
        children: cmp
      });
    return cmp;
  }
  return SkipRender;
}, "RouterOutlet_component_nd8yk3KO22c"));
const MODULE_CACHE$1 = /* @__PURE__ */ new WeakMap();
const loadRoute$1 = async (routes2, menus2, cacheModules2, pathname) => {
  if (Array.isArray(routes2))
    for (const route of routes2) {
      const match = route[0].exec(pathname);
      if (match) {
        const loaders = route[1];
        const params = getRouteParams$1(route[2], match);
        const routeBundleNames = route[4];
        const mods = new Array(loaders.length);
        const pendingLoads = [];
        const menuLoader = getMenuLoader$1(menus2, pathname);
        let menu = void 0;
        loaders.forEach((moduleLoader, i) => {
          loadModule$1(moduleLoader, pendingLoads, (routeModule) => mods[i] = routeModule, cacheModules2);
        });
        loadModule$1(menuLoader, pendingLoads, (menuModule) => menu = menuModule == null ? void 0 : menuModule.default, cacheModules2);
        if (pendingLoads.length > 0)
          await Promise.all(pendingLoads);
        return [
          params,
          mods,
          menu,
          routeBundleNames
        ];
      }
    }
  return null;
};
const loadModule$1 = (moduleLoader, pendingLoads, moduleSetter, cacheModules2) => {
  if (typeof moduleLoader === "function") {
    const loadedModule = MODULE_CACHE$1.get(moduleLoader);
    if (loadedModule)
      moduleSetter(loadedModule);
    else {
      const l = moduleLoader();
      if (typeof l.then === "function")
        pendingLoads.push(l.then((loadedModule2) => {
          if (cacheModules2 !== false)
            MODULE_CACHE$1.set(moduleLoader, loadedModule2);
          moduleSetter(loadedModule2);
        }));
      else if (l)
        moduleSetter(l);
    }
  }
};
const getMenuLoader$1 = (menus2, pathname) => {
  if (menus2) {
    const menu = menus2.find((m) => m[0] === pathname || pathname.startsWith(m[0] + (pathname.endsWith("/") ? "" : "/")));
    if (menu)
      return menu[1];
  }
  return void 0;
};
const getRouteParams$1 = (paramNames, match) => {
  const params = {};
  if (paramNames)
    for (let i = 0; i < paramNames.length; i++)
      params[paramNames[i]] = match ? match[i + 1] : "";
  return params;
};
const resolveHead = (endpoint, routeLocation, contentModules) => {
  const head2 = createDocumentHead();
  const headProps = {
    data: endpoint ? endpoint.body : null,
    head: head2,
    ...routeLocation
  };
  for (let i = contentModules.length - 1; i >= 0; i--) {
    const contentModuleHead = contentModules[i] && contentModules[i].head;
    if (contentModuleHead) {
      if (typeof contentModuleHead === "function")
        resolveDocumentHead(head2, contentModuleHead(headProps));
      else if (typeof contentModuleHead === "object")
        resolveDocumentHead(head2, contentModuleHead);
    }
  }
  return headProps.head;
};
const resolveDocumentHead = (resolvedHead, updatedHead) => {
  if (typeof updatedHead.title === "string")
    resolvedHead.title = updatedHead.title;
  mergeArray(resolvedHead.meta, updatedHead.meta);
  mergeArray(resolvedHead.links, updatedHead.links);
  mergeArray(resolvedHead.styles, updatedHead.styles);
};
const mergeArray = (existingArr, newArr) => {
  if (Array.isArray(newArr))
    for (const newItem of newArr) {
      if (typeof newItem.key === "string") {
        const existingIndex = existingArr.findIndex((i) => i.key === newItem.key);
        if (existingIndex > -1) {
          existingArr[existingIndex] = newItem;
          continue;
        }
      }
      existingArr.push(newItem);
    }
};
const createDocumentHead = () => ({
  title: "",
  meta: [],
  links: [],
  styles: []
});
const useLocation = () => useContext(RouteLocationContext);
const useNavigate = () => useContext(RouteNavigateContext);
const useQwikCityEnv = () => noSerialize(useEnvData("qwikcity"));
const toPath = (url) => url.pathname + url.search + url.hash;
const toUrl = (url, baseUrl) => new URL(url, baseUrl.href);
const isSameOrigin = (a2, b) => a2.origin === b.origin;
const isSamePath = (a2, b) => a2.pathname + a2.search === b.pathname + b.search;
const isSamePathname = (a2, b) => a2.pathname === b.pathname;
const isSameOriginDifferentPathname = (a2, b) => isSameOrigin(a2, b) && !isSamePath(a2, b);
const getClientEndpointPath = (pathname) => pathname + (pathname.endsWith("/") ? "" : "/") + "q-data.json";
const getClientNavPath = (props, baseUrl) => {
  const href = props.href;
  if (typeof href === "string" && href.trim() !== "" && typeof props.target !== "string")
    try {
      const linkUrl = toUrl(href, baseUrl);
      const currentUrl = toUrl("", baseUrl);
      if (isSameOrigin(linkUrl, currentUrl))
        return toPath(linkUrl);
    } catch (e) {
      console.error(e);
    }
  return null;
};
const getPrefetchUrl = (props, clientNavPath, currentLoc) => {
  if (props.prefetch && clientNavPath) {
    const prefetchUrl = toUrl(clientNavPath, currentLoc);
    if (!isSamePathname(prefetchUrl, toUrl("", currentLoc)))
      return prefetchUrl + "";
  }
  return null;
};
const clientNavigate = (win, routeNavigate) => {
  const currentUrl = win.location;
  const newUrl = toUrl(routeNavigate.path, currentUrl);
  if (isSameOriginDifferentPathname(currentUrl, newUrl)) {
    handleScroll(win, currentUrl, newUrl);
    win.history.pushState("", "", toPath(newUrl));
  }
  if (!win[CLIENT_HISTORY_INITIALIZED]) {
    win[CLIENT_HISTORY_INITIALIZED] = 1;
    win.addEventListener("popstate", () => {
      const currentUrl2 = win.location;
      const previousUrl = toUrl(routeNavigate.path, currentUrl2);
      if (isSameOriginDifferentPathname(currentUrl2, previousUrl)) {
        handleScroll(win, previousUrl, currentUrl2);
        routeNavigate.path = toPath(currentUrl2);
      }
    });
  }
};
const handleScroll = async (win, previousUrl, newUrl) => {
  const doc = win.document;
  const newHash = newUrl.hash;
  if (isSamePath(previousUrl, newUrl)) {
    if (previousUrl.hash !== newHash) {
      await domWait();
      if (newHash)
        scrollToHashId(doc, newHash);
      else
        win.scrollTo(0, 0);
    }
  } else {
    if (newHash)
      for (let i = 0; i < 24; i++) {
        await domWait();
        if (scrollToHashId(doc, newHash))
          break;
      }
    else {
      await domWait();
      win.scrollTo(0, 0);
    }
  }
};
const domWait = () => new Promise((resolve) => setTimeout(resolve, 12));
const scrollToHashId = (doc, hash) => {
  const elmId = hash.slice(1);
  const elm = doc.getElementById(elmId);
  if (elm)
    elm.scrollIntoView();
  return elm;
};
const dispatchPrefetchEvent = (prefetchData) => dispatchEvent(new CustomEvent("qprefetch", {
  detail: prefetchData
}));
const CLIENT_HISTORY_INITIALIZED = /* @__PURE__ */ Symbol();
const loadClientData = async (href) => {
  const pagePathname = new URL(href).pathname;
  const endpointUrl = getClientEndpointPath(pagePathname);
  const now = Date.now();
  const expiration = 6e5;
  const cachedClientPageIndex = cachedClientPages.findIndex((c) => c.u === endpointUrl);
  let cachedClientPageData = cachedClientPages[cachedClientPageIndex];
  dispatchPrefetchEvent({
    links: [
      pagePathname
    ]
  });
  if (!cachedClientPageData || cachedClientPageData.t + expiration < now) {
    cachedClientPageData = {
      u: endpointUrl,
      t: now,
      c: new Promise((resolve) => {
        fetch(endpointUrl).then((clientResponse) => {
          const contentType = clientResponse.headers.get("content-type") || "";
          if (clientResponse.ok && contentType.includes("json"))
            clientResponse.json().then((clientData) => {
              dispatchPrefetchEvent({
                bundles: clientData.prefetch,
                links: [
                  pagePathname
                ]
              });
              resolve(clientData);
            }, () => resolve(null));
          else
            resolve(null);
        }, () => resolve(null));
      })
    };
    for (let i = cachedClientPages.length - 1; i >= 0; i--)
      if (cachedClientPages[i].t + expiration < now)
        cachedClientPages.splice(i, 1);
    cachedClientPages.push(cachedClientPageData);
  }
  cachedClientPageData.c.catch((e) => console.error(e));
  return cachedClientPageData.c;
};
const cachedClientPages = [];
const QwikCity = /* @__PURE__ */ componentQrl(inlinedQrl(() => {
  const env = useQwikCityEnv();
  if (!(env == null ? void 0 : env.params))
    throw new Error(`Missing Qwik City Env Data`);
  const urlEnv = useEnvData("url");
  if (!urlEnv)
    throw new Error(`Missing Qwik URL Env Data`);
  const url = new URL(urlEnv);
  const routeLocation = useStore({
    href: url.href,
    pathname: url.pathname,
    query: Object.fromEntries(url.searchParams.entries()),
    params: env.params
  });
  const routeNavigate = useStore({
    path: toPath(url)
  });
  const documentHead = useStore(createDocumentHead);
  const content = useStore({
    headings: void 0,
    menu: void 0
  });
  const contentInternal = useStore({
    contents: void 0
  });
  useContextProvider(ContentContext, content);
  useContextProvider(ContentInternalContext, contentInternal);
  useContextProvider(DocumentHeadContext, documentHead);
  useContextProvider(RouteLocationContext, routeLocation);
  useContextProvider(RouteNavigateContext, routeNavigate);
  useWatchQrl(inlinedQrl(async ({ track }) => {
    const [content2, contentInternal2, documentHead2, env2, routeLocation2, routeNavigate2] = useLexicalScope();
    const { routes: routes2, menus: menus2, cacheModules: cacheModules2 } = await Promise.resolve().then(() => _qwikCityPlan);
    const path = track(routeNavigate2, "path");
    const url2 = new URL(path, routeLocation2.href);
    const pathname = url2.pathname;
    const loadRoutePromise = loadRoute$1(routes2, menus2, cacheModules2, pathname);
    const endpointResponse = isServer ? env2.response : loadClientData(url2.href);
    const loadedRoute = await loadRoutePromise;
    if (loadedRoute) {
      const [params, mods, menu] = loadedRoute;
      const contentModules = mods;
      const pageModule = contentModules[contentModules.length - 1];
      routeLocation2.href = url2.href;
      routeLocation2.pathname = pathname;
      routeLocation2.params = {
        ...params
      };
      routeLocation2.query = Object.fromEntries(url2.searchParams.entries());
      content2.headings = pageModule.headings;
      content2.menu = menu;
      contentInternal2.contents = noSerialize(contentModules);
      const clientPageData = await endpointResponse;
      const resolvedHead = resolveHead(clientPageData, routeLocation2, contentModules);
      documentHead2.links = resolvedHead.links;
      documentHead2.meta = resolvedHead.meta;
      documentHead2.styles = resolvedHead.styles;
      documentHead2.title = resolvedHead.title;
      if (isBrowser)
        clientNavigate(window, routeNavigate2);
    }
  }, "QwikCity_component_useWatch_AaAlzKH0KlQ", [
    content,
    contentInternal,
    documentHead,
    env,
    routeLocation,
    routeNavigate
  ]));
  return /* @__PURE__ */ jsx(Slot, {});
}, "QwikCity_component_z1nvHyEppoI"));
/* @__PURE__ */ componentQrl(inlinedQrl((props) => {
  const nav = useNavigate();
  const loc = useLocation();
  const originalHref = props.href;
  const linkProps = {
    ...props
  };
  const clientNavPath = getClientNavPath(linkProps, loc);
  const prefetchUrl = getPrefetchUrl(props, clientNavPath, loc);
  linkProps["preventdefault:click"] = !!clientNavPath;
  linkProps.href = clientNavPath || originalHref;
  return /* @__PURE__ */ jsx("a", {
    ...linkProps,
    onClick$: inlinedQrl(() => {
      const [clientNavPath2, linkProps2, nav2] = useLexicalScope();
      if (clientNavPath2)
        nav2.path = linkProps2.href;
    }, "Link_component_a_onClick_hA9UPaY8sNQ", [
      clientNavPath,
      linkProps,
      nav
    ]),
    onMouseOver$: inlinedQrl(() => {
      const [prefetchUrl2] = useLexicalScope();
      return prefetchLinkResources(prefetchUrl2, false);
    }, "Link_component_a_onMouseOver_skxgNVWVOT8", [
      prefetchUrl
    ]),
    onQVisible$: inlinedQrl(() => {
      const [prefetchUrl2] = useLexicalScope();
      return prefetchLinkResources(prefetchUrl2, true);
    }, "Link_component_a_onQVisible_uVE5iM9H73c", [
      prefetchUrl
    ]),
    children: /* @__PURE__ */ jsx(Slot, {})
  });
}, "Link_component_mYsiJcA4IBc"));
const prefetchLinkResources = (prefetchUrl, isOnVisible) => {
  if (!windowInnerWidth)
    windowInnerWidth = window.innerWidth;
  if (prefetchUrl && (!isOnVisible || isOnVisible && windowInnerWidth < 520))
    loadClientData(prefetchUrl);
};
let windowInnerWidth = 0;
const sectionCtaStyle = "section {\r\n    padding: 0rem;\r\n    position: relative;\r\n    display: flex;\r\n    justify-content: center;\r\n}\r\n\r\nsection .sction-cta-wrapper {\r\n    padding: 2rem 2rem 3rem;\r\n    text-align: center;\r\n}\r\n\r\nsection .link-cta {\r\n    background-color: var(--color-2);\r\n    color: var(--color-1);\r\n    padding: .5rem 1rem;\r\n    font-size: 2rem;\r\n    box-shadow: var(--box-shadow-1)\r\n}\r\n\r\nsection .text-small {\r\n    padding: 1rem 0;\r\n    font-size: 1.2rem;\r\n}\r\n\r\nsection .link-color-a {\r\n    background-color: #e4ff1a;\r\n    color: var(--color-2);\r\n    border: solid 2px var(--color-1);\r\n    outline: dashed 2px var(--color-2);\r\n    transition: all ease 150ms;\r\n}\r\n\r\n\r\nsection .link-color-b {\r\n    background-color: #77ff00;\r\n    color: var(--color-2);\r\n    border: solid 2px var(--color-1);\r\n    outline: dashed 2px var(--color-2);\r\n}\r\n\r\nsection .link-color-a:hover, section .link-color-b:hover {\r\n    background-color: var(--color-2);\r\n    color: var(--color-1);\r\n}";
const SectionCta = /* @__PURE__ */ componentQrl(inlinedQrl(({ text, secondText, link, style = "" }) => {
  useStylesScopedQrl(inlinedQrl(sectionCtaStyle, "s_M0FIA8mDlgA"));
  return /* @__PURE__ */ jsx("section", {
    children: /* @__PURE__ */ jsx("div", {
      className: "sction-cta-wrapper",
      children: /* @__PURE__ */ jsx("div", {
        children: [
          /* @__PURE__ */ jsx("a", {
            target: "_blank",
            className: `link-cta link-` + style,
            href: link,
            children: [
              "Empieza YA! ",
              text ? text : ""
            ]
          }),
          secondText ? /* @__PURE__ */ jsx("div", {
            className: "text-small",
            children: /* @__PURE__ */ jsx("small", {
              children: secondText
            })
          }) : /* @__PURE__ */ jsx(Fragment, {})
        ]
      })
    })
  });
}, "s_mUNWJPoUEcs"));
const cardStyle = ".card {\r\n    background-color: var(--color-1);\r\n    padding: 1rem;\r\n    box-shadow: var(--box-shadow-1);\r\n    font-size: 1.2rem;\r\n}\r\n\r\n.card div {\r\n    display: flex;\r\n    justify-content: flex-start;\r\n    align-items: center;\r\n    gap: .5rem;\r\n}";
const Card = /* @__PURE__ */ componentQrl(inlinedQrl((props) => {
  useStylesScopedQrl(inlinedQrl(cardStyle, "s_Wb3hxYxJwBo"));
  return /* @__PURE__ */ jsx("div", {
    className: "card",
    children: /* @__PURE__ */ jsx("div", {
      children: [
        /* @__PURE__ */ jsx("img", {
          src: "/img/check-circle.svg",
          width: "19px",
          height: "23px",
          alt: "ok"
        }),
        " ",
        props.name
      ]
    })
  });
}, "s_YnxdFAiIhz4"));
const sectionTopic = ".section {\r\n    padding: 0rem;\r\n    position: relative;\r\n    display: flex;\r\n    justify-content: center;\r\n}\r\n\r\n.section .section-wrapper-topic {\r\n    padding: 2rem;\r\n    width: 800px;\r\n    max-width: 800px;\r\n}\r\n\r\n.section h1 {\r\n    padding: 1rem 0;\r\n    font-size: 3.5rem;\r\n}\r\n\r\n.section .continue {\r\n    padding: 1rem 1rem 0;\r\n}\r\n\r\n@media screen and (max-width: 520px) {\r\n    .section .section-wrapper-topic {\r\n        max-width: 400px;\r\n\r\n    }\r\n\r\n}";
const SectionTopic = /* @__PURE__ */ componentQrl(inlinedQrl(() => {
  useStylesScopedQrl(inlinedQrl(sectionTopic, "s_WTpUzqKbtAQ"));
  const state = useContext(currentCtx$1);
  const topic = state.topic || [];
  const renderTopics = topic.map((text) => /* @__PURE__ */ jsx(Card, {
    name: text
  }));
  return /* @__PURE__ */ jsx("section", {
    class: "section",
    children: /* @__PURE__ */ jsx("div", {
      className: "section-wrapper-topic",
      children: [
        /* @__PURE__ */ jsx("h1", {
          children: "\xBFQu\xE9 aprender\xE1s? "
        }),
        renderTopics,
        /* @__PURE__ */ jsx("div", {
          className: "continue",
          children: /* @__PURE__ */ jsx("h3", {
            children: "Y mucho m\xE1s..."
          })
        })
      ]
    })
  });
}, "s_4LbTK0C63JY"));
const authorStyle = ".author-wrapper {\r\n    padding: 1rem;\r\n    display: grid;\r\n    background-color: var(--color-8);\r\n    justify-content: center;\r\n}\r\n\r\n.author {\r\n    max-width: 500px;\r\n    display: flex;\r\n    gap: .5rem;\r\n}\r\n\r\n.author-wrapper .author-image img {\r\n    width: 60px;\r\n    height: 60px;\r\n    border-radius: 100px;\r\n    object-fit: cover;\r\n}\r\n\r\n@media screen and (max-width: 520px) {\r\n    .author {\r\n        max-width: 400px;\r\n        display: flex;\r\n        gap: .5rem;\r\n    }\r\n\r\n}";
const Author = /* @__PURE__ */ componentQrl(inlinedQrl(() => {
  useStylesScopedQrl(inlinedQrl(authorStyle, "s_ckdDfn0i400"));
  return /* @__PURE__ */ jsx("div", {
    className: "author-wrapper",
    children: /* @__PURE__ */ jsx("div", {
      className: "author",
      children: [
        /* @__PURE__ */ jsx("div", {
          className: "author-image",
          children: /* @__PURE__ */ jsx("img", {
            width: "60px",
            height: "60px",
            src: "/img/leifer.png",
            alt: "Leifer Mendez"
          })
        }),
        /* @__PURE__ */ jsx("div", {
          className: "author-detail",
          children: /* @__PURE__ */ jsx("div", {
            children: "Soy Leifer Mendez un ferviente apasionado de la tecnolog\xEDa, ingeniero en inform\xE1tica con m\xE1s de 10 a\xF1os de experiencia en el mundo de la programaci\xF3n."
          })
        })
      ]
    })
  });
}, "s_9OkG00AoShE"));
const sectionStyle$1 = ".section {\r\n    padding: 0rem;\r\n    position: relative;\r\n    display: grid;\r\n    justify-content: center;\r\n}\r\n\r\n.section .section-video-wrapper {\r\n    padding: 2rem;\r\n    position: relative;\r\n    display: flex;\r\n    width: 800px;\r\n    flex-direction: column;\r\n    max-width: 800px;\r\n    background-color: var(--color-8);\r\n}\r\n\r\n.section h1 {\r\n    font-weight: 400;\r\n    font-size: 3.5rem;\r\n}\r\n\r\n.section .video-loading {\r\n    background-color: white;\r\n    display: flex;\r\n    justify-content: center;\r\n    align-content: center;\r\n    align-items: center;\r\n    height: 400px;\r\n\r\n    top: 0;\r\n    width: 100%;\r\n}\r\n\r\n\r\n.section .iframe-video {\r\n    border: solid 4px white;\r\n    box-shadow: var(--box-shadow-1)\r\n}\r\n\r\n@media screen and (max-width: 520px) {\r\n\r\n\r\n    .menu-wrapper .menu li {\r\n        font-size: 1rem;\r\n    }\r\n\r\n    .section .section-video-wrapper {\r\n        width: 320px;\r\n        padding: 0;\r\n        width: 100%;\r\n    }\r\n\r\n    .section .iframe-video {\r\n        border-top: solid 4px white;\r\n        border-bottom: solid 4px white;\r\n        border-left: 0;\r\n        border-right: 0;\r\n    }\r\n\r\n}";
const SectionVideo = /* @__PURE__ */ componentQrl(inlinedQrl(() => {
  useStylesScopedQrl(inlinedQrl(sectionStyle$1, "s_CgEvv1IhB9s"));
  const state = useStore({
    load: false
  });
  useClientEffectQrl(inlinedQrl(() => {
    const [state2] = useLexicalScope();
    state2.load = true;
    const scriptVimeo = document.createElement("script");
    scriptVimeo.src = "https://player.vimeo.com/api/player.js";
    scriptVimeo.async = true;
    document.body.appendChild(scriptVimeo);
    return () => null;
  }, "s_8tRoNT5nsJU", [
    state
  ]));
  const renderVideo = /* @__PURE__ */ jsx("div", {
    style: "padding:56.25% 0 0 0;position:relative;",
    children: /* @__PURE__ */ jsx("iframe", {
      src: "https://player.vimeo.com/video/750715054?h=a8ad677d76&badge=0&autopause=0&player_id=0&app_id=58479",
      frameBorder: "0",
      allow: "autoplay; fullscreen; picture-in-picture",
      allowFullScreen: true,
      style: "position:absolute;top:0;left:0;width:100%;height:100%;",
      title: "cap-0 Introduccion.mp4"
    })
  });
  const renderVideoPrev = /* @__PURE__ */ jsx("div", {
    className: "video-loading",
    children: "Cargando..."
  });
  return /* @__PURE__ */ jsx("section", {
    id: "section-video",
    class: "section",
    children: [
      /* @__PURE__ */ jsx("div", {
        class: "section-video-wrapper",
        children: /* @__PURE__ */ jsx("div", {
          class: "iframe-video",
          children: state.load ? renderVideo : renderVideoPrev
        })
      }),
      /* @__PURE__ */ jsx(Author, {})
    ]
  });
}, "s_Xk3MjqlAJx4"));
const sectionStyle = ".section {\r\n    padding: 0rem;\r\n    position: relative;\r\n    display: grid;\r\n    justify-content: center;\r\n\r\n}\r\n\r\n.section .section-wrapper {\r\n    padding: 2rem;\r\n    position: relative;\r\n    display: flex;\r\n    flex-direction: column;\r\n    max-width: 800px;\r\n    background-color: var(--color-8);\r\n    /* border: dashed 2px var(--color-2); */\r\n    border-radius: var(--border-radius-1);\r\n}\r\n\r\n.section .section-video-wrapper {\r\n    width: 600px;\r\n}\r\n\r\n.section h1 {\r\n    font-weight: 400;\r\n    font-size: 3.5rem;\r\n}\r\n\r\n@media screen and (max-width: 520px) {\r\n    .section h1 {\r\n        font-size: 3rem;\r\n    }\r\n\r\n}";
const Section = /* @__PURE__ */ componentQrl(inlinedQrl(() => {
  useStylesScopedQrl(inlinedQrl(sectionStyle, "s_XTGkpgNab0M"));
  return /* @__PURE__ */ jsx("section", {
    id: "section-main",
    class: "section",
    children: /* @__PURE__ */ jsx("div", {
      className: "section-wrapper",
      children: [
        /* @__PURE__ */ jsx("h1", {
          className: "p-1-v",
          children: /* @__PURE__ */ jsx(Slot, {
            name: "title"
          })
        }),
        /* @__PURE__ */ jsx("h3", {
          className: "p-1-v letter-space",
          children: /* @__PURE__ */ jsx(Slot, {
            name: "text"
          })
        })
      ]
    })
  });
}, "s_KafZPA4KZLA"));
const stateNodeData = {
  v1: {
    title: "Todo lo que necesitas para convertirte en un _Programador _Backend",
    subTitle: "Aprende backend desde cero construyendo una _API _Rest _en _Nodejs _y _express de manera \xE1gil y sencilla, con ejemplos reales que te permitir\xE1n convertirte y trabajar como programador backend.",
    comments: [
      {
        vote: 5,
        author: "Carlos Montoya",
        text: "\u200B\u200BDefinitivamente fue una excelente elecci\xF3n. Vi la intro en YouTube y la forma de explicar es muy clara. Muchas gracias."
      },
      {
        vote: 5,
        author: "Manuel Jesus Sandalio D\xEDaz",
        text: "Muy recomendable, me gusto mucho por que se entiende todo perfectamente y explica de forma que te queda todo muy claro. Era justo lo que necesitaba, adem\xE1s, un punto que valore mucho a la hora de comprar este curso, es que la mayor\xEDa de cursos de NodeJs se enfocan en MongoDB y sin embargo este no solo se enfoca en MongoDB si no que tambi\xE9n se dedica a MySQL. Muy completo y 100% recomendado!"
      },
      {
        vote: 5,
        author: "Santiago Daniel C\xF3rdoba",
        text: "\u200BVengo del curso gratuito de YouTube y la verdad que quer\xEDa tener acceso a todo el curso porque gracias a Leifer logr\xE9 entender un mont\xF3n de conceptos que antes no lograba entender. Est\xE1 todo super bien explicado y los ejemplos pr\xE1cticos son muy completos para poder largarte a crear tu propia API. Super recomendado!"
      }
    ],
    topic: [
      "Entender diferencias entre NodeJs y Express",
      "Aprender\xE1s \xBFC\xF3mo instalar Node?",
      "Es hora de Crear una API REST Node",
      "Crear Controladores, Rutas, Modelos, Servicios",
      "Tambi\xE9n trabajaremos base de datos de MONGO en Atlas",
      "Desplegar\xE1s tu  aplicaci\xF3n en Ubuntu",
      "Realizaremos pruebas de integraci\xF3n con Jest"
    ],
    link: "https://link.codigoencasa.com/utm-node",
    ctaText: "Garant\xEDa de reembolso de 30 d\xEDas",
    price: "12.99 USD"
  },
  v2: {
    title: "La programaci\xF3n es el ahora y el futuro. S\xE9 un _Programador _Backend ya ",
    subTitle: "Aprende backend desde cero construyendo una _API _Rest _en _Nodejs _y _express de manera \xE1gil y sencilla, con ejemplos reales que te permitir\xE1n convertirte y trabajar como programador backend.",
    comments: [
      {
        vote: 5,
        author: "Roman Emmanuel Correo Garc\xEDa",
        text: "\u200BExplica muy bien los conceptos cuando son requeridos y no se extiende con informaci\xF3n innecesaria, es r\xE1pido al hacer los temas pr\xE1cticos (lo cual no es malo) y es directo, bastante pr\xE1ctico y se nota que es un mentor bastante experimentado. Lo recomiendo totalmente."
      },
      {
        vote: 5,
        author: "Jeffrey Felizzola Tapia",
        text: "Jeffrey, muchas gracias por tu valoraci\xF3n al curso y sobre todo por tu comentario la verdad que para mi es un placer saber que puedo aportar al aprendizaje de colegas apasionados por el c\xF3digo, espero que puedas continuar avanzando en tu formaci\xF3n y que te lleves lo mejor de este curso. Un saludo!"
      },
      {
        vote: 5,
        author: "Santiago Daniel C\xF3rdoba",
        text: "\u200BVengo del curso gratuito de YouTube y la verdad que quer\xEDa tener acceso a todo el curso porque gracias a Leifer logr\xE9 entender un mont\xF3n de conceptos que antes no lograba entender. Est\xE1 todo super bien explicado y los ejemplos pr\xE1cticos son muy completos para poder largarte a crear tu propia API. Super recomendado!"
      }
    ],
    topic: [
      "Entender diferencias entre NodeJs y Express",
      "Aprender\xE1s \xBFC\xF3mo instalar Node?",
      "Es hora de Crear una API REST Node",
      "Crear Controladores, Rutas, Modelos, Servicios",
      "Tambi\xE9n trabajaremos base de datos de MONGO en Atlas",
      "Desplegar\xE1s tu  aplicaci\xF3n en Ubuntu",
      "Realizaremos pruebas de integraci\xF3n con Jest"
    ],
    link: "https://link.codigoencasa.com/utm-node",
    ctaText: "Garant\xEDa de reembolso de 30 d\xEDas",
    price: "12.99 USD"
  }
};
const stateAwsData = {
  v1: {
    title: "Primeros pasos para hacer tus _despliegues directamente a la _Nube _con _AWS",
    subTitle: "Aprender\xE1s de manera \xE1gil y sencilla, con ejemplos reales que te permitir\xE1n dar los _primeros _pasos en el mundo del _cloud _computing.",
    comments: [
      {
        text: "Muy buen curso, much\xEDsimas gracias, explicas muy bien, muy buenos ejemplos, ya recomend\xE9 tu curso a algunos amigos, seguir\xE9 al pendiente de tu contenido.",
        author: "Liliana Orozco Torres",
        vote: 5
      },
      {
        text: "Excelente Curso de verdad muy bien explicado todo el paso a paso para un principiante!!! Excelente Leifer!!! 100% recomendado",
        author: "Joan L Gonzalez F",
        vote: 5
      },
      {
        text: "Aprend\xED inclusive un poco de nginx, y a desplegar aplicaciones angular en un servidor ubuntu 20. Es un buen curso b\xE1sico. Me quit\xF3 el miedo a estudiar AWS",
        author: "Erik Omar Montes Castro",
        vote: 5
      }
    ],
    topic: [
      "Aprender\xE1s a crear un servidor desde cero usando EC2",
      "Maneja el servicio de S3 y c\xF3mo configurar un hosting para una p\xE1gina web",
      "Vamos a montar un balanceador de carga con Elastick Beanstalk",
      "Aprende sobre autoescalado para tener una infraestructura con alta disponibilidad",
      "Aprender\xE1s hacer (CD/CI) un despliegue e integraci\xF3n continua directo hasta aws",
      "Desplegar\xE1s tu  aplicaci\xF3n en Ubuntu"
    ],
    link: "https://link.codigoencasa.com/utm-aws",
    ctaText: "Garant\xEDa de reembolso de 30 d\xEDas",
    price: "12.99 USD"
  },
  v2: {
    title: "_Computaci\xF3n en la _Nube el futuro de la programaci\xF3n",
    subTitle: "Nos enfocaremos en todo sobre AWS, el _servicio _de _computaci\xF3n en la nube de _Amazon. El m\xE1s utilizado del mercado y que est\xE1 siendo cada vez m\xE1s demandado por las grandes empresas. ",
    comments: [
      {
        text: "Excelente curso, el maestro conoce muy bien del tema, cada secci\xF3n entra directo al grano, desde el comienzo inicia muy interesante todo, lo recomiendo totalmente si vas iniciando en el tema de los servicios de AWS. Gracias maestro por compartir tus conocimientos y experiencias.",
        author: "Eduardo Hernandez Mendez",
        vote: 5
      },
      {
        text: "Muy buen curso, much\xEDsimas gracias, explicas muy bien, muy buenos ejemplos, ya recomend\xE9 tu curso a algunos amigos, seguir\xE9 al pendiente de tu contenido.",
        author: "Liliana Orozco Torres",
        vote: 5
      },
      {
        text: "El curso hasta el momento (la mitad del curso) ha cumplido mis expectativas. Como indican rese\xF1as anteriores , el profesor es muy pr\xE1ctico y claro a la hora de mostrar los casos. Adem\xE1s de que va explicando conceptos de los servicios a la medida que va efectuando los casos. Tambi\xE9n ha sido interesante la forma en que divide algunos temas en caso tal que se requiera utilizar en un ambiente productivo automatizando algunos procesos , o de una forma m\xE1s artesanal y precisa si lo que necesitas es para un ambiente de pr\xE1ctica.",
        author: "Wilson Perea Turizo",
        vote: 5
      }
    ],
    topic: [
      "Aprender\xE1s a crear un servidor desde cero usando EC2",
      "Maneja el servicio de S3 y c\xF3mo configurar un hosting para una p\xE1gina web",
      "Vamos a montar un balanceador de carga con Elastick Beanstalk",
      "Aprende sobre autoescalado para tener una infraestructura con alta disponibilidad",
      "Aprender\xE1s hacer (CD/CI) un despliegue e integraci\xF3n continua directo hasta aws",
      "Desplegar\xE1s tu  aplicaci\xF3n en Ubuntu"
    ],
    link: "https://link.codigoencasa.com/utm-aws",
    ctaText: "Garant\xEDa de reembolso de 30 d\xEDas",
    price: "12.99 USD"
  }
};
const currentCtx$1 = createContext("node-ctx");
/* @__PURE__ */ componentQrl(inlinedQrl(() => {
  const location = useLocation();
  const { v: versionPage } = {
    v: "v1",
    ...location.query
  };
  const topic = location.params.topic || "node";
  const stateNode = useStore({
    ...stateNodeData
  });
  const stateAws = useStore({
    ...stateAwsData
  });
  const getState = (stateName, version2) => {
    version2 = version2.toLowerCase();
    if (stateName === "aws")
      return stateAws[version2];
    if (stateName === "node")
      return stateNode[version2];
    return stateNode[version2];
  };
  useContextProvider(currentCtx$1, getState(topic, versionPage));
  const getValueFrom = (version2, value, nameState) => {
    version2 = version2.toLowerCase();
    const obj = getState(nameState, version2);
    return obj[value];
  };
  const renderTitle = (text) => {
    const wordsSplit = text.split(" ");
    return wordsSplit.map((word) => {
      if (word.includes("_"))
        return /* @__PURE__ */ jsx("span", {
          className: "hight-light",
          children: [
            " ",
            word.replace("_", ""),
            " "
          ]
        });
      if (!word.includes("_"))
        return ` ${word} `;
    });
  };
  return /* @__PURE__ */ jsx(Fragment, {
    children: [
      " ",
      /* @__PURE__ */ jsx(Section, {
        children: [
          /* @__PURE__ */ jsx("slot", {
            "q:slot": "title",
            children: renderTitle(getValueFrom(versionPage, "title", topic))
          }),
          /* @__PURE__ */ jsx("slot", {
            "q:slot": "text",
            children: renderTitle(getValueFrom(versionPage, "subTitle", topic))
          })
        ]
      }),
      /* @__PURE__ */ jsx(SectionCta, {
        style: "color-a",
        link: getValueFrom(versionPage, "link", topic),
        secondText: "Garant\xEDa de reembolso de 30 d\xEDas"
      }),
      /* @__PURE__ */ jsx(SectionVideo, {}),
      /* @__PURE__ */ jsx(SectionTopic, {}),
      /* @__PURE__ */ jsx(SectionCta, {
        style: "color-b",
        text: getValueFrom(versionPage, "price", topic),
        link: getValueFrom(versionPage, "link", topic),
        secondText: getValueFrom(versionPage, "ctaText", topic)
      }),
      /* @__PURE__ */ jsx(SectionComments, {}),
      /* @__PURE__ */ jsx(SectionCta, {
        style: "color-a",
        link: getValueFrom(versionPage, "link", topic),
        secondText: getValueFrom(versionPage, "ctaText", topic)
      })
    ]
  });
}, "s_iIEFR4Lrsg4"));
const commentStyle = ".comment {\r\n    position: relative;\r\n    min-height: 100px;\r\n}\r\n\r\n\r\n.comment .comment-wrapper {\r\n    padding: 2.5rem 1rem;\r\n    display: flex;\r\n    flex-direction: column;\r\n    gap: .5rem;\r\n}\r\n\r\n\r\n.comment .quote {\r\n    position: absolute;\r\n    width: 50px;\r\n    height: 50px;\r\n    display: block;\r\n    background-image: url('/img/quote.svg');\r\n}\r\n\r\n.comment .comment-text {\r\n    font-size: 1.3rem;\r\n}\r\n\r\n.uis-star {\r\n    color: #ffd500;\r\n}";
const Comment = /* @__PURE__ */ componentQrl(inlinedQrl(({ text, author, vote }) => {
  useStylesScopedQrl(inlinedQrl(commentStyle, "s_SN3aXXYhgG8"));
  const renderStar = (vote2) => {
    return Array.from(Array(vote2).keys()).map(() => /* @__PURE__ */ jsx("span", {
      children: /* @__PURE__ */ jsx("img", {
        width: "16px",
        height: "19px",
        src: "/img/star.svg",
        alt: "Puntuacion 5"
      })
    }));
  };
  return /* @__PURE__ */ jsx("div", {
    className: "comment",
    children: [
      /* @__PURE__ */ jsx("span", {
        class: "quote"
      }),
      /* @__PURE__ */ jsx("div", {
        class: "comment-wrapper",
        children: [
          /* @__PURE__ */ jsx("div", {
            className: "starts",
            children: renderStar(vote)
          }),
          /* @__PURE__ */ jsx("span", {
            className: "comment-text",
            children: text
          }),
          /* @__PURE__ */ jsx("span", {
            children: author
          })
        ]
      })
    ]
  });
}, "s_7gMngGZozZg"));
const sectionComponentStyle = ".section {\r\n    padding: 0rem;\r\n    position: relative;\r\n    display: flex;\r\n    justify-content: center;\r\n}\r\n\r\n.section .section-wrapper {\r\n    padding: 2rem;\r\n    position: relative;\r\n    display: flex;\r\n    flex-direction: column;\r\n    max-width: 800px;\r\n    width: 800px;\r\n    /* border: dashed 2px var(--color-2); */\r\n    border-radius: var(--border-radius-1);\r\n}\r\n\r\n.section h1 {\r\n    padding: 1rem 0;\r\n    font-size: 3.5rem;\r\n}\r\n\r\n@media screen and (max-width: 520px) {\r\n    .section .section-wrapper {\r\n        max-width: 400px;\r\n\r\n    }\r\n\r\n}";
const SectionComments = /* @__PURE__ */ componentQrl(inlinedQrl(() => {
  useStylesScopedQrl(inlinedQrl(sectionComponentStyle, "s_Yi51Li7iOAs"));
  const state = useContext(currentCtx$1);
  const comments = state.comments || [];
  const renderComments = comments.map(({ author, vote, text }) => /* @__PURE__ */ jsx(Comment, {
    author,
    vote,
    text
  }));
  return /* @__PURE__ */ jsx("section", {
    className: "section",
    id: "section-comment",
    children: /* @__PURE__ */ jsx("div", {
      className: "section-wrapper",
      children: [
        /* @__PURE__ */ jsx("h1", {
          children: "Opiniones"
        }),
        /* @__PURE__ */ jsx("div", {
          className: "section-comment",
          children: renderComments
        })
      ]
    })
  });
}, "s_6e5F0RIawGc"));
const currentCtx = createContext("node-ctx");
const index = /* @__PURE__ */ componentQrl(inlinedQrl(() => {
  const location = useLocation();
  const { v: versionPage } = {
    v: "v1",
    ...location.query
  };
  const topic = location.params.topic || "node";
  const stateNode = useStore({
    ...stateNodeData
  });
  const stateAws = useStore({
    ...stateAwsData
  });
  const getState = (stateName, version2) => {
    version2 = version2.toLowerCase();
    if (stateName === "aws")
      return stateAws[version2];
    if (stateName === "node")
      return stateNode[version2];
    return stateNode[version2];
  };
  useContextProvider(currentCtx, getState(topic, versionPage));
  const getValueFrom = (version2, value, nameState) => {
    version2 = version2.toLowerCase();
    const obj = getState(nameState, version2);
    return obj[value];
  };
  const renderTitle = (text) => {
    const wordsSplit = text.split(" ");
    return wordsSplit.map((word) => {
      if (word.includes("_"))
        return /* @__PURE__ */ jsx("span", {
          className: "hight-light",
          children: [
            " ",
            word.replace("_", ""),
            " "
          ]
        });
      if (!word.includes("_"))
        return ` ${word} `;
    });
  };
  return /* @__PURE__ */ jsx(Fragment, {
    children: [
      " ",
      /* @__PURE__ */ jsx(Section, {
        children: [
          /* @__PURE__ */ jsx("slot", {
            "q:slot": "title",
            children: renderTitle(getValueFrom(versionPage, "title", topic))
          }),
          /* @__PURE__ */ jsx("slot", {
            "q:slot": "text",
            children: renderTitle(getValueFrom(versionPage, "subTitle", topic))
          })
        ]
      }),
      /* @__PURE__ */ jsx(SectionCta, {
        style: "color-a",
        link: getValueFrom(versionPage, "link", topic),
        secondText: "Garant\xEDa de reembolso de 30 d\xEDas"
      }),
      /* @__PURE__ */ jsx(SectionVideo, {}),
      /* @__PURE__ */ jsx(SectionTopic, {}),
      /* @__PURE__ */ jsx(SectionCta, {
        style: "color-b",
        text: getValueFrom(versionPage, "price", topic),
        link: getValueFrom(versionPage, "link", topic),
        secondText: getValueFrom(versionPage, "ctaText", topic)
      }),
      /* @__PURE__ */ jsx(SectionComments, {}),
      /* @__PURE__ */ jsx(SectionCta, {
        style: "color-a",
        link: getValueFrom(versionPage, "link", topic),
        secondText: getValueFrom(versionPage, "ctaText", topic)
      })
    ]
  });
}, "s_iIEFR4Lrsg4"));
const Topic = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  currentCtx,
  default: index
}, Symbol.toStringTag, { value: "Module" }));
const Layout = () => Layout_;
const routes = [
  [/^\/$/, [Layout, () => Index], void 0, "/", ["q-e62d0a5c.js", "q-16d0044b.js"]],
  [/^\/([^/]+?)\/?$/, [Layout, () => Topic], ["topic"], "/[topic]", ["q-e62d0a5c.js", "q-a75d7ecb.js", "q-c7bb4051.js"]]
];
const menus = [];
const trailingSlash = false;
const basePathname = "/";
const cacheModules = true;
const _qwikCityPlan = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  routes,
  menus,
  trailingSlash,
  basePathname,
  cacheModules
}, Symbol.toStringTag, { value: "Module" }));
var HEADERS = Symbol("headers");
var _a;
var HeadersPolyfill = class {
  constructor() {
    this[_a] = {};
  }
  [(_a = HEADERS, Symbol.iterator)]() {
    return this.entries();
  }
  *keys() {
    for (const name of Object.keys(this[HEADERS])) {
      yield name;
    }
  }
  *values() {
    for (const value of Object.values(this[HEADERS])) {
      yield value;
    }
  }
  *entries() {
    for (const name of Object.keys(this[HEADERS])) {
      yield [name, this.get(name)];
    }
  }
  get(name) {
    return this[HEADERS][normalizeHeaderName(name)] || null;
  }
  set(name, value) {
    const normalizedName = normalizeHeaderName(name);
    this[HEADERS][normalizedName] = typeof value !== "string" ? String(value) : value;
  }
  append(name, value) {
    const normalizedName = normalizeHeaderName(name);
    const resolvedValue = this.has(normalizedName) ? `${this.get(normalizedName)}, ${value}` : value;
    this.set(name, resolvedValue);
  }
  delete(name) {
    if (!this.has(name)) {
      return;
    }
    const normalizedName = normalizeHeaderName(name);
    delete this[HEADERS][normalizedName];
  }
  all() {
    return this[HEADERS];
  }
  has(name) {
    return this[HEADERS].hasOwnProperty(normalizeHeaderName(name));
  }
  forEach(callback, thisArg) {
    for (const name in this[HEADERS]) {
      if (this[HEADERS].hasOwnProperty(name)) {
        callback.call(thisArg, this[HEADERS][name], name, this);
      }
    }
  }
};
var HEADERS_INVALID_CHARACTERS = /[^a-z0-9\-#$%&'*+.^_`|~]/i;
function normalizeHeaderName(name) {
  if (typeof name !== "string") {
    name = String(name);
  }
  if (HEADERS_INVALID_CHARACTERS.test(name) || name.trim() === "") {
    throw new TypeError("Invalid character in header field name");
  }
  return name.toLowerCase();
}
function createHeaders() {
  return new (typeof Headers === "function" ? Headers : HeadersPolyfill)();
}
var ErrorResponse = class extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
};
function notFoundHandler(requestCtx) {
  return errorResponse(requestCtx, new ErrorResponse(404, "Not Found"));
}
function errorHandler(requestCtx, e) {
  const status = 500;
  let message = "Server Error";
  let stack = void 0;
  if (e != null) {
    if (typeof e === "object") {
      if (typeof e.message === "string") {
        message = e.message;
      }
      if (e.stack != null) {
        stack = String(e.stack);
      }
    } else {
      message = String(e);
    }
  }
  const html = minimalHtmlResponse(status, message, stack);
  const headers = createHeaders();
  headers.set("Content-Type", "text/html; charset=utf-8");
  return requestCtx.response(
    status,
    headers,
    async (stream) => {
      stream.write(html);
    },
    e
  );
}
function errorResponse(requestCtx, errorResponse2) {
  const html = minimalHtmlResponse(
    errorResponse2.status,
    errorResponse2.message,
    errorResponse2.stack
  );
  const headers = createHeaders();
  headers.set("Content-Type", "text/html; charset=utf-8");
  return requestCtx.response(
    errorResponse2.status,
    headers,
    async (stream) => {
      stream.write(html);
    },
    errorResponse2
  );
}
function minimalHtmlResponse(status, message, stack) {
  const width = typeof message === "string" ? "600px" : "300px";
  const color = status >= 500 ? COLOR_500 : COLOR_400;
  if (status < 500) {
    stack = "";
  }
  return `<!DOCTYPE html>
<html data-qwik-city-status="${status}">
<head>
  <meta charset="utf-8">
  <title>${status} ${message}</title>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <style>
    body { color: ${color}; background-color: #fafafa; padding: 30px; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Roboto, sans-serif; }
    p { max-width: ${width}; margin: 60px auto 30px auto; background: white; border-radius: 5px; box-shadow: 0px 0px 50px -20px ${color}; overflow: hidden; }
    strong { display: inline-block; padding: 15px; background: ${color}; color: white; }
    span { display: inline-block; padding: 15px; }
    pre { max-width: 580px; margin: 0 auto; }
  </style>
</head>
<body>
  <p>
    <strong>${status}</strong>
    <span>${message}</span>
  </p>
  ${stack ? `<pre><code>${stack}</code></pre>` : ``}
</body>
</html>
`;
}
var COLOR_400 = "#5249d9";
var COLOR_500 = "#bd16bd";
var MODULE_CACHE = /* @__PURE__ */ new WeakMap();
var loadRoute = async (routes2, menus2, cacheModules2, pathname) => {
  if (Array.isArray(routes2)) {
    for (const route of routes2) {
      const match = route[0].exec(pathname);
      if (match) {
        const loaders = route[1];
        const params = getRouteParams(route[2], match);
        const routeBundleNames = route[4];
        const mods = new Array(loaders.length);
        const pendingLoads = [];
        const menuLoader = getMenuLoader(menus2, pathname);
        let menu = void 0;
        loaders.forEach((moduleLoader, i) => {
          loadModule(
            moduleLoader,
            pendingLoads,
            (routeModule) => mods[i] = routeModule,
            cacheModules2
          );
        });
        loadModule(
          menuLoader,
          pendingLoads,
          (menuModule) => menu = menuModule == null ? void 0 : menuModule.default,
          cacheModules2
        );
        if (pendingLoads.length > 0) {
          await Promise.all(pendingLoads);
        }
        return [params, mods, menu, routeBundleNames];
      }
    }
  }
  return null;
};
var loadModule = (moduleLoader, pendingLoads, moduleSetter, cacheModules2) => {
  if (typeof moduleLoader === "function") {
    const loadedModule = MODULE_CACHE.get(moduleLoader);
    if (loadedModule) {
      moduleSetter(loadedModule);
    } else {
      const l = moduleLoader();
      if (typeof l.then === "function") {
        pendingLoads.push(
          l.then((loadedModule2) => {
            if (cacheModules2 !== false) {
              MODULE_CACHE.set(moduleLoader, loadedModule2);
            }
            moduleSetter(loadedModule2);
          })
        );
      } else if (l) {
        moduleSetter(l);
      }
    }
  }
};
var getMenuLoader = (menus2, pathname) => {
  if (menus2) {
    const menu = menus2.find(
      (m) => m[0] === pathname || pathname.startsWith(m[0] + (pathname.endsWith("/") ? "" : "/"))
    );
    if (menu) {
      return menu[1];
    }
  }
  return void 0;
};
var getRouteParams = (paramNames, match) => {
  const params = {};
  if (paramNames) {
    for (let i = 0; i < paramNames.length; i++) {
      params[paramNames[i]] = match ? match[i + 1] : "";
    }
  }
  return params;
};
var RedirectResponse = class {
  constructor(url, status, headers) {
    this.url = url;
    this.location = url;
    this.status = isRedirectStatus(status) ? status : 307;
    this.headers = headers || createHeaders();
    this.headers.set("Location", this.location);
    this.headers.delete("Cache-Control");
  }
};
function redirectResponse(requestCtx, responseRedirect) {
  return requestCtx.response(responseRedirect.status, responseRedirect.headers, async () => {
  });
}
function isRedirectStatus(status) {
  return typeof status === "number" && status >= 301 && status <= 308;
}
async function loadUserResponse(requestCtx, params, routeModules, platform, trailingSlash2, basePathname2 = "/") {
  if (routeModules.length === 0) {
    throw new ErrorResponse(404, `Not Found`);
  }
  const { request, url } = requestCtx;
  const { pathname } = url;
  const isPageModule = isLastModulePageRoute(routeModules);
  const isPageDataRequest = isPageModule && request.headers.get("Accept") === "application/json";
  const type = isPageDataRequest ? "pagedata" : isPageModule ? "pagehtml" : "endpoint";
  const userResponse = {
    type,
    url,
    params,
    status: 200,
    headers: createHeaders(),
    resolvedBody: void 0,
    pendingBody: void 0
  };
  let hasRequestMethodHandler = false;
  if (isPageModule && pathname !== basePathname2) {
    if (trailingSlash2) {
      if (!pathname.endsWith("/")) {
        throw new RedirectResponse(pathname + "/" + url.search, 307);
      }
    } else {
      if (pathname.endsWith("/")) {
        throw new RedirectResponse(
          pathname.slice(0, pathname.length - 1) + url.search,
          307
        );
      }
    }
  }
  let routeModuleIndex = -1;
  const abort = () => {
    routeModuleIndex = ABORT_INDEX;
  };
  const redirect = (url2, status) => {
    return new RedirectResponse(url2, status, userResponse.headers);
  };
  const error = (status, message) => {
    return new ErrorResponse(status, message);
  };
  const next = async () => {
    routeModuleIndex++;
    while (routeModuleIndex < routeModules.length) {
      const endpointModule = routeModules[routeModuleIndex];
      let reqHandler = void 0;
      switch (request.method) {
        case "GET": {
          reqHandler = endpointModule.onGet;
          break;
        }
        case "POST": {
          reqHandler = endpointModule.onPost;
          break;
        }
        case "PUT": {
          reqHandler = endpointModule.onPut;
          break;
        }
        case "PATCH": {
          reqHandler = endpointModule.onPatch;
          break;
        }
        case "OPTIONS": {
          reqHandler = endpointModule.onOptions;
          break;
        }
        case "HEAD": {
          reqHandler = endpointModule.onHead;
          break;
        }
        case "DELETE": {
          reqHandler = endpointModule.onDelete;
          break;
        }
      }
      reqHandler = reqHandler || endpointModule.onRequest;
      if (typeof reqHandler === "function") {
        hasRequestMethodHandler = true;
        const response = {
          get status() {
            return userResponse.status;
          },
          set status(code) {
            userResponse.status = code;
          },
          get headers() {
            return userResponse.headers;
          },
          redirect,
          error
        };
        const requestEv = {
          request,
          url: new URL(url),
          params: { ...params },
          response,
          platform,
          next,
          abort
        };
        const syncData = reqHandler(requestEv);
        if (typeof syncData === "function") {
          userResponse.pendingBody = createPendingBody(syncData);
        } else if (syncData !== null && typeof syncData === "object" && typeof syncData.then === "function") {
          const asyncResolved = await syncData;
          if (typeof asyncResolved === "function") {
            userResponse.pendingBody = createPendingBody(asyncResolved);
          } else {
            userResponse.resolvedBody = asyncResolved;
          }
        } else {
          userResponse.resolvedBody = syncData;
        }
      }
      routeModuleIndex++;
    }
  };
  await next();
  if (!isPageDataRequest && isRedirectStatus(userResponse.status) && userResponse.headers.has("Location")) {
    throw new RedirectResponse(
      userResponse.headers.get("Location"),
      userResponse.status,
      userResponse.headers
    );
  }
  if (type === "endpoint" && !hasRequestMethodHandler) {
    throw new ErrorResponse(405, `Method Not Allowed`);
  }
  return userResponse;
}
function createPendingBody(cb) {
  return new Promise((resolve, reject) => {
    try {
      const rtn = cb();
      if (rtn !== null && typeof rtn === "object" && typeof rtn.then === "function") {
        rtn.then(resolve, reject);
      } else {
        resolve(rtn);
      }
    } catch (e) {
      reject(e);
    }
  });
}
function isLastModulePageRoute(routeModules) {
  const lastRouteModule = routeModules[routeModules.length - 1];
  return lastRouteModule && typeof lastRouteModule.default === "function";
}
function updateRequestCtx(requestCtx, trailingSlash2) {
  let pathname = requestCtx.url.pathname;
  if (pathname.endsWith(QDATA_JSON)) {
    requestCtx.request.headers.set("Accept", "application/json");
    const trimEnd = pathname.length - QDATA_JSON_LEN + (trailingSlash2 ? 1 : 0);
    pathname = pathname.slice(0, trimEnd);
    if (pathname === "") {
      pathname = "/";
    }
    requestCtx.url.pathname = pathname;
  }
}
var QDATA_JSON = "/q-data.json";
var QDATA_JSON_LEN = QDATA_JSON.length;
var ABORT_INDEX = 999999999;
function endpointHandler(requestCtx, userResponse) {
  const { pendingBody, resolvedBody, status, headers } = userResponse;
  const { response } = requestCtx;
  if (pendingBody === void 0 && resolvedBody === void 0) {
    return response(status, headers, asyncNoop);
  }
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json; charset=utf-8");
  }
  const isJson = headers.get("Content-Type").includes("json");
  return response(status, headers, async ({ write }) => {
    const body2 = pendingBody !== void 0 ? await pendingBody : resolvedBody;
    if (body2 !== void 0) {
      if (isJson) {
        write(JSON.stringify(body2));
      } else {
        const type = typeof body2;
        if (type === "string") {
          write(body2);
        } else if (type === "number" || type === "boolean") {
          write(String(body2));
        } else {
          write(body2);
        }
      }
    }
  });
}
var asyncNoop = async () => {
};
function pageHandler(requestCtx, userResponse, render2, opts, routeBundleNames) {
  const { status, headers } = userResponse;
  const { response } = requestCtx;
  const isPageData = userResponse.type === "pagedata";
  if (isPageData) {
    headers.set("Content-Type", "application/json; charset=utf-8");
  } else if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "text/html; charset=utf-8");
  }
  return response(isPageData ? 200 : status, headers, async (stream) => {
    const result = await render2({
      stream: isPageData ? noopStream : stream,
      envData: getQwikCityEnvData(userResponse),
      ...opts
    });
    if (isPageData) {
      stream.write(JSON.stringify(await getClientPageData(userResponse, result, routeBundleNames)));
    } else {
      if ((typeof result).html === "string") {
        stream.write(result.html);
      }
    }
    if (typeof stream.clientData === "function") {
      stream.clientData(await getClientPageData(userResponse, result, routeBundleNames));
    }
  });
}
async function getClientPageData(userResponse, result, routeBundleNames) {
  const prefetchBundleNames = getPrefetchBundleNames(result, routeBundleNames);
  const clientPage = {
    body: userResponse.pendingBody ? await userResponse.pendingBody : userResponse.resolvedBody,
    status: userResponse.status !== 200 ? userResponse.status : void 0,
    redirect: userResponse.status >= 301 && userResponse.status <= 308 && userResponse.headers.get("location") || void 0,
    prefetch: prefetchBundleNames.length > 0 ? prefetchBundleNames : void 0
  };
  return clientPage;
}
function getPrefetchBundleNames(result, routeBundleNames) {
  const bundleNames = [];
  const addBundle2 = (bundleName) => {
    if (bundleName && !bundleNames.includes(bundleName)) {
      bundleNames.push(bundleName);
    }
  };
  const addPrefetchResource = (prefetchResources) => {
    if (Array.isArray(prefetchResources)) {
      for (const prefetchResource of prefetchResources) {
        const bundleName = prefetchResource.url.split("/").pop();
        if (bundleName && !bundleNames.includes(bundleName)) {
          addBundle2(bundleName);
          addPrefetchResource(prefetchResource.imports);
        }
      }
    }
  };
  addPrefetchResource(result.prefetchResources);
  const manifest2 = result.manifest || result._manifest;
  const renderedSymbols = result._symbols;
  if (manifest2 && renderedSymbols) {
    for (const renderedSymbolName of renderedSymbols) {
      const symbol = manifest2.symbols[renderedSymbolName];
      if (symbol && symbol.ctxName === "component$") {
        addBundle2(manifest2.mapping[renderedSymbolName]);
      }
    }
  }
  if (routeBundleNames) {
    for (const routeBundleName of routeBundleNames) {
      addBundle2(routeBundleName);
    }
  }
  return bundleNames;
}
function getQwikCityEnvData(userResponse) {
  const { url, params, pendingBody, resolvedBody, status } = userResponse;
  return {
    url: url.href,
    qwikcity: {
      params: { ...params },
      response: {
        body: pendingBody || resolvedBody,
        status
      }
    }
  };
}
var noopStream = { write: () => {
} };
async function requestHandler(requestCtx, render2, platform, opts) {
  try {
    updateRequestCtx(requestCtx, trailingSlash);
    const loadedRoute = await loadRoute(routes, menus, cacheModules, requestCtx.url.pathname);
    if (loadedRoute) {
      const [params, mods, _, routeBundleNames] = loadedRoute;
      const userResponse = await loadUserResponse(
        requestCtx,
        params,
        mods,
        platform,
        trailingSlash,
        basePathname
      );
      if (userResponse.type === "endpoint") {
        return endpointHandler(requestCtx, userResponse);
      }
      return pageHandler(requestCtx, userResponse, render2, opts, routeBundleNames);
    }
  } catch (e) {
    if (e instanceof RedirectResponse) {
      return redirectResponse(requestCtx, e);
    }
    if (e instanceof ErrorResponse) {
      return errorResponse(requestCtx, e);
    }
    return errorHandler(requestCtx, e);
  }
  return null;
}
function qwikCity(render2, opts) {
  async function onRequest(request, { next }) {
    try {
      const requestCtx = {
        url: new URL(request.url),
        request,
        response: (status, headers, body2) => {
          return new Promise((resolve) => {
            let flushedHeaders = false;
            const { readable, writable } = new TransformStream();
            const writer = writable.getWriter();
            const response = new Response(readable, { status, headers });
            body2({
              write: (chunk) => {
                if (!flushedHeaders) {
                  flushedHeaders = true;
                  resolve(response);
                }
                if (typeof chunk === "string") {
                  const encoder = new TextEncoder();
                  writer.write(encoder.encode(chunk));
                } else {
                  writer.write(chunk);
                }
              }
            }).finally(() => {
              if (!flushedHeaders) {
                flushedHeaders = true;
                resolve(response);
              }
              writer.close();
            });
          });
        }
      };
      const handledResponse = await requestHandler(requestCtx, render2, {}, opts);
      if (handledResponse) {
        return handledResponse;
      }
      const nextResponse = await next();
      if (nextResponse.status === 404) {
        const handledResponse2 = await requestHandler(requestCtx, render2, {}, opts);
        if (handledResponse2) {
          return handledResponse2;
        }
        const notFoundResponse = await notFoundHandler(requestCtx);
        return notFoundResponse;
      }
      return nextResponse;
    } catch (e) {
      return new Response(String(e || "Error"), {
        status: 500,
        headers: { "Content-Type": "text/plain; charset=utf-8" }
      });
    }
  }
  return onRequest;
}
/**
 * @license
 * @builder.io/qwik/server 0.0.108
 * Copyright Builder.io, Inc. All Rights Reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/BuilderIO/qwik/blob/main/LICENSE
 */
if (typeof global == "undefined") {
  const g = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : "undefined" != typeof self ? self : {};
  g.global = g;
}
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a2, b) => (typeof require !== "undefined" ? require : a2)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw new Error('Dynamic require of "' + x + '" is not supported');
});
function createTimer() {
  if (typeof performance === "undefined") {
    return () => 0;
  }
  const start = performance.now();
  return () => {
    const end = performance.now();
    const delta = end - start;
    return delta / 1e6;
  };
}
function getBuildBase(opts) {
  let base = opts.base;
  if (typeof base === "string") {
    if (!base.endsWith("/")) {
      base += "/";
    }
    return base;
  }
  return "/build/";
}
function createPlatform(document2, opts, mapper) {
  if (!document2 || document2.nodeType !== 9) {
    throw new Error(`Invalid Document implementation`);
  }
  const mapperFn = opts.symbolMapper ? opts.symbolMapper : (symbolName) => {
    if (mapper) {
      const hash = getSymbolHash(symbolName);
      const result = mapper[hash];
      if (!result) {
        console.error("Cannot resolve symbol", symbolName, "in", mapper);
      }
      return result;
    }
  };
  const serverPlatform = {
    isServer: true,
    async importSymbol(_element, qrl, symbolName) {
      let [modulePath] = String(qrl).split("#");
      if (!modulePath.endsWith(".js")) {
        modulePath += ".js";
      }
      const module = __require(modulePath);
      if (!(symbolName in module)) {
        throw new Error(`Q-ERROR: missing symbol '${symbolName}' in module '${modulePath}'.`);
      }
      const symbol = module[symbolName];
      return symbol;
    },
    raf: () => {
      console.error("server can not rerender");
      return Promise.resolve();
    },
    nextTick: (fn) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(fn());
        });
      });
    },
    chunkForSymbol(symbolName) {
      return mapperFn(symbolName, mapper);
    }
  };
  return serverPlatform;
}
async function setServerPlatform(document2, opts, mapper) {
  const platform = createPlatform(document2, opts, mapper);
  setPlatform(document2, platform);
}
var getSymbolHash = (symbolName) => {
  const index2 = symbolName.lastIndexOf("_");
  if (index2 > -1) {
    return symbolName.slice(index2 + 1);
  }
  return symbolName;
};
var QWIK_LOADER_DEFAULT_MINIFIED = '(()=>{function e(e){return"object"==typeof e&&e&&"Module"===e[Symbol.toStringTag]}((t,n)=>{const o="__q_context__",r=(e,n,o)=>{n=n.replace(/([A-Z])/g,(e=>"-"+e.toLowerCase())),t.querySelectorAll("[on"+e+"\\\\:"+n+"]").forEach((t=>c(t,e,n,o)))},s=(e,t,n)=>e.dispatchEvent(new CustomEvent(t,{detail:n,bubbles:!0,composed:!0})),i=e=>{throw Error("QWIK "+e)},a=(e,n)=>(e=e.closest("[q\\\\:container]"),new URL(n,new URL(e?e.getAttribute("q:base"):t.baseURI,t.baseURI))),c=async(n,r,c,u)=>{var d;n.hasAttribute("preventdefault:"+c)&&u.preventDefault();const b="on"+r+":"+c,f=null==(d=n._qc_)?void 0:d.li[b];if(f)return void f.forEach((e=>e.getFn([n,u],(()=>n.isConnected))(u,n)));const v=n.getAttribute(b);if(v)for(const r of v.split("\\n")){const c=a(n,r);if(c){const r=l(c),a=(window[c.pathname]||(p=await import(c.href.split("#")[0]),Object.values(p).find(e)||p))[r]||i(c+" does not export "+r),d=t[o];if(n.isConnected)try{t[o]=[n,u,c],a(u,n)}finally{t[o]=d,s(n,"qsymbol",r)}}}var p},l=e=>e.hash.replace(/^#?([^?[|]*).*$/,"$1")||"default",u=e=>{let t=e.target;for(r("-document",e.type,e);t&&t.getAttribute;)c(t,"",e.type,e),t=e.bubbles?t.parentElement:null},d=e=>{r("-window",e.type,e)},b=()=>{const e=t.readyState;if(!n&&("interactive"==e||"complete"==e)&&(n=1,r("","qinit",new CustomEvent("qinit")),"undefined"!=typeof IntersectionObserver)){const e=new IntersectionObserver((t=>{for(const n of t)n.isIntersecting&&(e.unobserve(n.target),c(n.target,"","qvisible",new CustomEvent("qvisible",{bubbles:!1,detail:n})))}));t.qO=e,t.querySelectorAll("[on\\\\:qvisible]").forEach((t=>e.observe(t)))}},f=e=>{document.addEventListener(e,u,{capture:!0}),window.addEventListener(e,d)};if(!t.qR){t.qR=1;{const e=t.querySelector("script[events]");if(e)e.getAttribute("events").split(/[\\s,;]+/).forEach(f);else for(const e in t)e.startsWith("on")&&f(e.slice(2))}t.addEventListener("readystatechange",b),b()}})(document)})();';
var QWIK_LOADER_DEFAULT_DEBUG = '(() => {\n    function findModule(module) {\n        return Object.values(module).find(isModule) || module;\n    }\n    function isModule(module) {\n        return "object" == typeof module && module && "Module" === module[Symbol.toStringTag];\n    }\n    ((doc, hasInitialized) => {\n        const broadcast = (infix, type, ev) => {\n            type = type.replace(/([A-Z])/g, (a => "-" + a.toLowerCase()));\n            doc.querySelectorAll("[on" + infix + "\\\\:" + type + "]").forEach((target => dispatch(target, infix, type, ev)));\n        };\n        const emitEvent = (el, eventName, detail) => el.dispatchEvent(new CustomEvent(eventName, {\n            detail: detail,\n            bubbles: !0,\n            composed: !0\n        }));\n        const error = msg => {\n            throw new Error("QWIK " + msg);\n        };\n        const qrlResolver = (element, qrl) => {\n            element = element.closest("[q\\\\:container]");\n            return new URL(qrl, new URL(element ? element.getAttribute("q:base") : doc.baseURI, doc.baseURI));\n        };\n        const dispatch = async (element, onPrefix, eventName, ev) => {\n            var _a;\n            element.hasAttribute("preventdefault:" + eventName) && ev.preventDefault();\n            const attrName = "on" + onPrefix + ":" + eventName;\n            const qrls = null == (_a = element._qc_) ? void 0 : _a.li[attrName];\n            if (qrls) {\n                qrls.forEach((q => q.getFn([ element, ev ], (() => element.isConnected))(ev, element)));\n                return;\n            }\n            const attrValue = element.getAttribute(attrName);\n            if (attrValue) {\n                for (const qrl of attrValue.split("\\n")) {\n                    const url = qrlResolver(element, qrl);\n                    if (url) {\n                        const symbolName = getSymbolName(url);\n                        const handler = (window[url.pathname] || findModule(await import(url.href.split("#")[0])))[symbolName] || error(url + " does not export " + symbolName);\n                        const previousCtx = doc.__q_context__;\n                        if (element.isConnected) {\n                            try {\n                                doc.__q_context__ = [ element, ev, url ];\n                                handler(ev, element);\n                            } finally {\n                                doc.__q_context__ = previousCtx;\n                                emitEvent(element, "qsymbol", symbolName);\n                            }\n                        }\n                    }\n                }\n            }\n        };\n        const getSymbolName = url => url.hash.replace(/^#?([^?[|]*).*$/, "$1") || "default";\n        const processDocumentEvent = ev => {\n            let element = ev.target;\n            broadcast("-document", ev.type, ev);\n            while (element && element.getAttribute) {\n                dispatch(element, "", ev.type, ev);\n                element = ev.bubbles ? element.parentElement : null;\n            }\n        };\n        const processWindowEvent = ev => {\n            broadcast("-window", ev.type, ev);\n        };\n        const processReadyStateChange = () => {\n            const readyState = doc.readyState;\n            if (!hasInitialized && ("interactive" == readyState || "complete" == readyState)) {\n                hasInitialized = 1;\n                broadcast("", "qinit", new CustomEvent("qinit"));\n                if ("undefined" != typeof IntersectionObserver) {\n                    const observer = new IntersectionObserver((entries => {\n                        for (const entry of entries) {\n                            if (entry.isIntersecting) {\n                                observer.unobserve(entry.target);\n                                dispatch(entry.target, "", "qvisible", new CustomEvent("qvisible", {\n                                    bubbles: !1,\n                                    detail: entry\n                                }));\n                            }\n                        }\n                    }));\n                    doc.qO = observer;\n                    doc.querySelectorAll("[on\\\\:qvisible]").forEach((el => observer.observe(el)));\n                }\n            }\n        };\n        const addDocEventListener = eventName => {\n            document.addEventListener(eventName, processDocumentEvent, {\n                capture: !0\n            });\n            window.addEventListener(eventName, processWindowEvent);\n        };\n        if (!doc.qR) {\n            doc.qR = 1;\n            {\n                const scriptTag = doc.querySelector("script[events]");\n                if (scriptTag) {\n                    scriptTag.getAttribute("events").split(/[\\s,;]+/).forEach(addDocEventListener);\n                } else {\n                    for (const key in doc) {\n                        key.startsWith("on") && addDocEventListener(key.slice(2));\n                    }\n                }\n            }\n            doc.addEventListener("readystatechange", processReadyStateChange);\n            processReadyStateChange();\n        }\n    })(document);\n})();';
var QWIK_LOADER_OPTIMIZE_MINIFIED = '(()=>{function e(e){return"object"==typeof e&&e&&"Module"===e[Symbol.toStringTag]}((t,n)=>{const o="__q_context__",r=(e,n,o)=>{n=n.replace(/([A-Z])/g,(e=>"-"+e.toLowerCase())),t.querySelectorAll("[on"+e+"\\\\:"+n+"]").forEach((t=>c(t,e,n,o)))},i=(e,t,n)=>e.dispatchEvent(new CustomEvent(t,{detail:n,bubbles:!0,composed:!0})),s=e=>{throw Error("QWIK "+e)},a=(e,n)=>(e=e.closest("[q\\\\:container]"),new URL(n,new URL(e?e.getAttribute("q:base"):t.baseURI,t.baseURI))),c=async(n,r,c,d)=>{var u;n.hasAttribute("preventdefault:"+c)&&d.preventDefault();const b="on"+r+":"+c,f=null==(u=n._qc_)?void 0:u.li[b];if(f)return void f.forEach((e=>e.getFn([n,d],(()=>n.isConnected))(d,n)));const v=n.getAttribute(b);if(v)for(const r of v.split("\\n")){const c=a(n,r);if(c){const r=l(c),a=(window[c.pathname]||(p=await import(c.href.split("#")[0]),Object.values(p).find(e)||p))[r]||s(c+" does not export "+r),u=t[o];if(n.isConnected)try{t[o]=[n,d,c],a(d,n)}finally{t[o]=u,i(n,"qsymbol",r)}}}var p},l=e=>e.hash.replace(/^#?([^?[|]*).*$/,"$1")||"default",d=e=>{let t=e.target;for(r("-document",e.type,e);t&&t.getAttribute;)c(t,"",e.type,e),t=e.bubbles?t.parentElement:null},u=e=>{r("-window",e.type,e)},b=()=>{const e=t.readyState;if(!n&&("interactive"==e||"complete"==e)&&(n=1,r("","qinit",new CustomEvent("qinit")),"undefined"!=typeof IntersectionObserver)){const e=new IntersectionObserver((t=>{for(const n of t)n.isIntersecting&&(e.unobserve(n.target),c(n.target,"","qvisible",new CustomEvent("qvisible",{bubbles:!1,detail:n})))}));t.qO=e,t.querySelectorAll("[on\\\\:qvisible]").forEach((t=>e.observe(t)))}};t.qR||(t.qR=1,window.qEvents.forEach((e=>{document.addEventListener(e,d,{capture:!0}),window.addEventListener(e,u)})),t.addEventListener("readystatechange",b),b())})(document)})();';
var QWIK_LOADER_OPTIMIZE_DEBUG = '(() => {\n    function findModule(module) {\n        return Object.values(module).find(isModule) || module;\n    }\n    function isModule(module) {\n        return "object" == typeof module && module && "Module" === module[Symbol.toStringTag];\n    }\n    ((doc, hasInitialized) => {\n        const broadcast = (infix, type, ev) => {\n            type = type.replace(/([A-Z])/g, (a => "-" + a.toLowerCase()));\n            doc.querySelectorAll("[on" + infix + "\\\\:" + type + "]").forEach((target => dispatch(target, infix, type, ev)));\n        };\n        const emitEvent = (el, eventName, detail) => el.dispatchEvent(new CustomEvent(eventName, {\n            detail: detail,\n            bubbles: !0,\n            composed: !0\n        }));\n        const error = msg => {\n            throw new Error("QWIK " + msg);\n        };\n        const qrlResolver = (element, qrl) => {\n            element = element.closest("[q\\\\:container]");\n            return new URL(qrl, new URL(element ? element.getAttribute("q:base") : doc.baseURI, doc.baseURI));\n        };\n        const dispatch = async (element, onPrefix, eventName, ev) => {\n            var _a;\n            element.hasAttribute("preventdefault:" + eventName) && ev.preventDefault();\n            const attrName = "on" + onPrefix + ":" + eventName;\n            const qrls = null == (_a = element._qc_) ? void 0 : _a.li[attrName];\n            if (qrls) {\n                qrls.forEach((q => q.getFn([ element, ev ], (() => element.isConnected))(ev, element)));\n                return;\n            }\n            const attrValue = element.getAttribute(attrName);\n            if (attrValue) {\n                for (const qrl of attrValue.split("\\n")) {\n                    const url = qrlResolver(element, qrl);\n                    if (url) {\n                        const symbolName = getSymbolName(url);\n                        const handler = (window[url.pathname] || findModule(await import(url.href.split("#")[0])))[symbolName] || error(url + " does not export " + symbolName);\n                        const previousCtx = doc.__q_context__;\n                        if (element.isConnected) {\n                            try {\n                                doc.__q_context__ = [ element, ev, url ];\n                                handler(ev, element);\n                            } finally {\n                                doc.__q_context__ = previousCtx;\n                                emitEvent(element, "qsymbol", symbolName);\n                            }\n                        }\n                    }\n                }\n            }\n        };\n        const getSymbolName = url => url.hash.replace(/^#?([^?[|]*).*$/, "$1") || "default";\n        const processDocumentEvent = ev => {\n            let element = ev.target;\n            broadcast("-document", ev.type, ev);\n            while (element && element.getAttribute) {\n                dispatch(element, "", ev.type, ev);\n                element = ev.bubbles ? element.parentElement : null;\n            }\n        };\n        const processWindowEvent = ev => {\n            broadcast("-window", ev.type, ev);\n        };\n        const processReadyStateChange = () => {\n            const readyState = doc.readyState;\n            if (!hasInitialized && ("interactive" == readyState || "complete" == readyState)) {\n                hasInitialized = 1;\n                broadcast("", "qinit", new CustomEvent("qinit"));\n                if ("undefined" != typeof IntersectionObserver) {\n                    const observer = new IntersectionObserver((entries => {\n                        for (const entry of entries) {\n                            if (entry.isIntersecting) {\n                                observer.unobserve(entry.target);\n                                dispatch(entry.target, "", "qvisible", new CustomEvent("qvisible", {\n                                    bubbles: !1,\n                                    detail: entry\n                                }));\n                            }\n                        }\n                    }));\n                    doc.qO = observer;\n                    doc.querySelectorAll("[on\\\\:qvisible]").forEach((el => observer.observe(el)));\n                }\n            }\n        };\n        const addDocEventListener = eventName => {\n            document.addEventListener(eventName, processDocumentEvent, {\n                capture: !0\n            });\n            window.addEventListener(eventName, processWindowEvent);\n        };\n        if (!doc.qR) {\n            doc.qR = 1;\n            window.qEvents.forEach(addDocEventListener);\n            doc.addEventListener("readystatechange", processReadyStateChange);\n            processReadyStateChange();\n        }\n    })(document);\n})();';
function getQwikLoaderScript(opts = {}) {
  if (Array.isArray(opts.events) && opts.events.length > 0) {
    const loader = opts.debug ? QWIK_LOADER_OPTIMIZE_DEBUG : QWIK_LOADER_OPTIMIZE_MINIFIED;
    return loader.replace("window.qEvents", JSON.stringify(opts.events));
  }
  return opts.debug ? QWIK_LOADER_DEFAULT_DEBUG : QWIK_LOADER_DEFAULT_MINIFIED;
}
function workerFetchScript() {
  const fetch2 = `Promise.all(e.data.map(u=>fetch(u))).finally(()=>{setTimeout(postMessage({}),9999)})`;
  const workerBody = `onmessage=(e)=>{${fetch2}}`;
  const blob = `new Blob(['${workerBody}'],{type:"text/javascript"})`;
  const url = `URL.createObjectURL(${blob})`;
  let s = `const w=new Worker(${url});`;
  s += `w.postMessage(u.map(u=>new URL(u,origin)+''));`;
  s += `w.onmessage=()=>{w.terminate()};`;
  return s;
}
function prefetchUrlsEventScript(prefetchResources) {
  const data = {
    bundles: flattenPrefetchResources(prefetchResources).map((u) => u.split("/").pop())
  };
  return `dispatchEvent(new CustomEvent("qprefetch",{detail:${JSON.stringify(data)}}))`;
}
function flattenPrefetchResources(prefetchResources) {
  const urls = [];
  const addPrefetchResource = (prefetchResources2) => {
    if (Array.isArray(prefetchResources2)) {
      for (const prefetchResource of prefetchResources2) {
        if (!urls.includes(prefetchResource.url)) {
          urls.push(prefetchResource.url);
          addPrefetchResource(prefetchResource.imports);
        }
      }
    }
  };
  addPrefetchResource(prefetchResources);
  return urls;
}
function applyPrefetchImplementation(opts, prefetchResources) {
  const { prefetchStrategy } = opts;
  if (prefetchStrategy !== null) {
    const prefetchImpl = normalizePrefetchImplementation(prefetchStrategy == null ? void 0 : prefetchStrategy.implementation);
    const prefetchNodes = [];
    if (prefetchImpl.prefetchEvent === "always") {
      prefetchUrlsEvent(prefetchNodes, prefetchResources);
    }
    if (prefetchImpl.linkInsert === "html-append") {
      linkHtmlImplementation(prefetchNodes, prefetchResources, prefetchImpl);
    }
    if (prefetchImpl.linkInsert === "js-append") {
      linkJsImplementation(prefetchNodes, prefetchResources, prefetchImpl);
    } else if (prefetchImpl.workerFetchInsert === "always") {
      workerFetchImplementation(prefetchNodes, prefetchResources);
    }
    if (prefetchNodes.length > 0) {
      return jsx(Fragment, { children: prefetchNodes });
    }
  }
  return null;
}
function prefetchUrlsEvent(prefetchNodes, prefetchResources) {
  prefetchNodes.push(
    jsx("script", {
      type: "module",
      dangerouslySetInnerHTML: prefetchUrlsEventScript(prefetchResources)
    })
  );
}
function linkHtmlImplementation(prefetchNodes, prefetchResources, prefetchImpl) {
  const urls = flattenPrefetchResources(prefetchResources);
  const rel = prefetchImpl.linkRel || "prefetch";
  for (const url of urls) {
    const attributes = {};
    attributes["href"] = url;
    attributes["rel"] = rel;
    if (rel === "prefetch" || rel === "preload") {
      if (url.endsWith(".js")) {
        attributes["as"] = "script";
      }
    }
    prefetchNodes.push(jsx("link", attributes, void 0));
  }
}
function linkJsImplementation(prefetchNodes, prefetchResources, prefetchImpl) {
  const rel = prefetchImpl.linkRel || "prefetch";
  let s = ``;
  if (prefetchImpl.workerFetchInsert === "no-link-support") {
    s += `let supportsLinkRel = true;`;
  }
  s += `const u=${JSON.stringify(flattenPrefetchResources(prefetchResources))};`;
  s += `u.map((u,i)=>{`;
  s += `const l=document.createElement('link');`;
  s += `l.setAttribute("href",u);`;
  s += `l.setAttribute("rel","${rel}");`;
  if (prefetchImpl.workerFetchInsert === "no-link-support") {
    s += `if(i===0){`;
    s += `try{`;
    s += `supportsLinkRel=l.relList.supports("${rel}");`;
    s += `}catch(e){}`;
    s += `}`;
  }
  s += `document.body.appendChild(l);`;
  s += `});`;
  if (prefetchImpl.workerFetchInsert === "no-link-support") {
    s += `if(!supportsLinkRel){`;
    s += workerFetchScript();
    s += `}`;
  }
  if (prefetchImpl.workerFetchInsert === "always") {
    s += workerFetchScript();
  }
  prefetchNodes.push(
    jsx("script", {
      type: "module",
      dangerouslySetInnerHTML: s
    })
  );
}
function workerFetchImplementation(prefetchNodes, prefetchResources) {
  let s = `const u=${JSON.stringify(flattenPrefetchResources(prefetchResources))};`;
  s += workerFetchScript();
  prefetchNodes.push(
    jsx("script", {
      type: "module",
      dangerouslySetInnerHTML: s
    })
  );
}
function normalizePrefetchImplementation(input) {
  if (typeof input === "string") {
    switch (input) {
      case "link-prefetch-html": {
        return {
          linkInsert: "html-append",
          linkRel: "prefetch",
          workerFetchInsert: null,
          prefetchEvent: null
        };
      }
      case "link-prefetch": {
        return {
          linkInsert: "js-append",
          linkRel: "prefetch",
          workerFetchInsert: "no-link-support",
          prefetchEvent: null
        };
      }
      case "link-preload-html": {
        return {
          linkInsert: "html-append",
          linkRel: "preload",
          workerFetchInsert: null,
          prefetchEvent: null
        };
      }
      case "link-preload": {
        return {
          linkInsert: "js-append",
          linkRel: "preload",
          workerFetchInsert: "no-link-support",
          prefetchEvent: null
        };
      }
      case "link-modulepreload-html": {
        return {
          linkInsert: "html-append",
          linkRel: "modulepreload",
          workerFetchInsert: null,
          prefetchEvent: null
        };
      }
      case "link-modulepreload": {
        return {
          linkInsert: "js-append",
          linkRel: "modulepreload",
          workerFetchInsert: "no-link-support",
          prefetchEvent: null
        };
      }
    }
    return {
      linkInsert: null,
      linkRel: null,
      workerFetchInsert: "always",
      prefetchEvent: null
    };
  }
  if (input && typeof input === "object") {
    return input;
  }
  const defaultImplementation = {
    linkInsert: null,
    linkRel: null,
    workerFetchInsert: "always",
    prefetchEvent: null
  };
  return defaultImplementation;
}
[
  "click",
  "dblclick",
  "contextmenu",
  "auxclick",
  "pointerdown",
  "pointerup",
  "pointermove",
  "pointerover",
  "pointerenter",
  "pointerleave",
  "pointerout",
  "pointercancel",
  "gotpointercapture",
  "lostpointercapture",
  "touchstart",
  "touchend",
  "touchmove",
  "touchcancel",
  "mousedown",
  "mouseup",
  "mousemove",
  "mouseenter",
  "mouseleave",
  "mouseover",
  "mouseout",
  "wheel",
  "gesturestart",
  "gesturechange",
  "gestureend",
  "keydown",
  "keyup",
  "keypress",
  "input",
  "change",
  "search",
  "invalid",
  "beforeinput",
  "select",
  "focusin",
  "focusout",
  "focus",
  "blur",
  "submit",
  "reset",
  "scroll"
].map((n) => `on${n.toLowerCase()}$`);
[
  "useWatch$",
  "useClientEffect$",
  "useEffect$",
  "component$",
  "useStyles$",
  "useStylesScoped$"
].map((n) => n.toLowerCase());
function getValidManifest(manifest2) {
  if (manifest2 != null && manifest2.mapping != null && typeof manifest2.mapping === "object" && manifest2.symbols != null && typeof manifest2.symbols === "object" && manifest2.bundles != null && typeof manifest2.bundles === "object") {
    return manifest2;
  }
  return void 0;
}
function getPrefetchResources(snapshotResult, opts, mapper) {
  const manifest2 = getValidManifest(opts.manifest);
  if (manifest2 && mapper) {
    const prefetchStrategy = opts.prefetchStrategy;
    const buildBase = getBuildBase(opts);
    if (prefetchStrategy !== null) {
      if (!prefetchStrategy || !prefetchStrategy.symbolsToPrefetch || prefetchStrategy.symbolsToPrefetch === "auto") {
        return getAutoPrefetch(snapshotResult, manifest2, mapper, buildBase);
      }
      if (typeof prefetchStrategy.symbolsToPrefetch === "function") {
        try {
          return prefetchStrategy.symbolsToPrefetch({ manifest: manifest2 });
        } catch (e) {
          console.error("getPrefetchUrls, symbolsToPrefetch()", e);
        }
      }
    }
  }
  return [];
}
function getAutoPrefetch(snapshotResult, manifest2, mapper, buildBase) {
  const prefetchResources = [];
  const listeners = snapshotResult == null ? void 0 : snapshotResult.listeners;
  const stateObjs = snapshotResult == null ? void 0 : snapshotResult.objs;
  const urls = /* @__PURE__ */ new Set();
  if (Array.isArray(listeners)) {
    for (const prioritizedSymbolName in mapper) {
      const hasSymbol = listeners.some((l) => {
        return l.qrl.getHash() === prioritizedSymbolName;
      });
      if (hasSymbol) {
        addBundle(manifest2, urls, prefetchResources, buildBase, mapper[prioritizedSymbolName][1]);
      }
    }
  }
  if (Array.isArray(stateObjs)) {
    for (const obj of stateObjs) {
      if (isQrl(obj)) {
        const qrlSymbolName = obj.getHash();
        const resolvedSymbol = mapper[qrlSymbolName];
        if (resolvedSymbol) {
          addBundle(manifest2, urls, prefetchResources, buildBase, resolvedSymbol[0]);
        }
      }
    }
  }
  return prefetchResources;
}
function addBundle(manifest2, urls, prefetchResources, buildBase, bundleFileName) {
  const url = buildBase + bundleFileName;
  if (!urls.has(url)) {
    urls.add(url);
    const bundle = manifest2.bundles[bundleFileName];
    if (bundle) {
      const prefetchResource = {
        url,
        imports: []
      };
      prefetchResources.push(prefetchResource);
      if (Array.isArray(bundle.imports)) {
        for (const importedFilename of bundle.imports) {
          addBundle(manifest2, urls, prefetchResource.imports, buildBase, importedFilename);
        }
      }
    }
  }
}
var isQrl = (value) => {
  return typeof value === "function" && typeof value.getSymbol === "function";
};
function createEl(tagName, doc) {
  return {
    nodeType: tagName === ":virtual" ? 111 : 1,
    nodeName: tagName.toUpperCase(),
    localName: tagName,
    ownerDocument: doc,
    isConnected: true,
    _qc_: null,
    __virtual: null,
    "q:id": null
  };
}
function createSimpleDocument() {
  const doc = {
    nodeType: 9,
    parentElement: null,
    ownerDocument: null,
    createElement(tagName) {
      return createEl(tagName, doc);
    }
  };
  return doc;
}
var qDev = globalThis.qDev === true;
var EMPTY_ARRAY = [];
var EMPTY_OBJ = {};
if (qDev) {
  Object.freeze(EMPTY_ARRAY);
  Object.freeze(EMPTY_OBJ);
  Error.stackTraceLimit = 9999;
}
var DOCTYPE = "<!DOCTYPE html>";
async function renderToStream(rootNode, opts) {
  var _a2, _b, _c, _d, _e, _f, _g;
  let stream = opts.stream;
  let bufferSize = 0;
  let totalSize = 0;
  let networkFlushes = 0;
  let firstFlushTime = 0;
  const doc = createSimpleDocument();
  const inOrderStreaming = (_b = (_a2 = opts.streaming) == null ? void 0 : _a2.inOrder) != null ? _b : {
    strategy: "auto",
    initialChunkSize: 3e4,
    minimunChunkSize: 1024
  };
  const containerTagName = (_c = opts.containerTagName) != null ? _c : "html";
  const containerAttributes = (_d = opts.containerAttributes) != null ? _d : {};
  const buffer = [];
  const nativeStream = stream;
  const firstFlushTimer = createTimer();
  function flush() {
    buffer.forEach((chunk) => nativeStream.write(chunk));
    buffer.length = 0;
    bufferSize = 0;
    networkFlushes++;
    if (networkFlushes === 1) {
      firstFlushTime = firstFlushTimer();
    }
  }
  function enqueue(chunk) {
    bufferSize += chunk.length;
    totalSize += chunk.length;
    buffer.push(chunk);
  }
  switch (inOrderStreaming.strategy) {
    case "disabled":
      stream = {
        write: enqueue
      };
      break;
    case "auto":
      let count = 0;
      const minimunChunkSize = (_e = inOrderStreaming.minimunChunkSize) != null ? _e : 0;
      const initialChunkSize = (_f = inOrderStreaming.initialChunkSize) != null ? _f : 0;
      stream = {
        write(chunk) {
          enqueue(chunk);
          if (chunk === "<!--qkssr-pu-->") {
            count++;
          } else if (count > 0 && chunk === "<!--qkssr-po-->") {
            count--;
          }
          const chunkSize = networkFlushes === 0 ? initialChunkSize : minimunChunkSize;
          if (count === 0 && bufferSize >= chunkSize) {
            flush();
          }
        }
      };
      break;
  }
  if (containerTagName === "html") {
    stream.write(DOCTYPE);
  } else {
    if (opts.qwikLoader) {
      if (opts.qwikLoader.include === void 0) {
        opts.qwikLoader.include = "never";
      }
      if (opts.qwikLoader.position === void 0) {
        opts.qwikLoader.position = "bottom";
      }
    } else {
      opts.qwikLoader = {
        include: "never"
      };
    }
  }
  if (!opts.manifest) {
    console.warn("Missing client manifest, loading symbols in the client might 404");
  }
  const buildBase = getBuildBase(opts);
  const mapper = computeSymbolMapper(opts.manifest);
  await setServerPlatform(doc, opts, mapper);
  let prefetchResources = [];
  let snapshotResult = null;
  const injections = (_g = opts.manifest) == null ? void 0 : _g.injections;
  const beforeContent = injections ? injections.map((injection) => {
    var _a3;
    return jsx(injection.tag, (_a3 = injection.attributes) != null ? _a3 : EMPTY_OBJ);
  }) : void 0;
  const renderTimer = createTimer();
  let renderTime = 0;
  let snapshotTime = 0;
  const renderSymbols = [];
  await renderSSR(doc, rootNode, {
    stream,
    containerTagName,
    containerAttributes,
    envData: opts.envData,
    base: buildBase,
    beforeContent,
    beforeClose: async (contexts, containerState) => {
      var _a3, _b2, _c2;
      renderTime = renderTimer();
      const snapshotTimer = createTimer();
      snapshotResult = await _pauseFromContexts(contexts, containerState);
      prefetchResources = getPrefetchResources(snapshotResult, opts, mapper);
      const jsonData = JSON.stringify(snapshotResult.state, void 0, qDev ? "  " : void 0);
      const children = [
        jsx("script", {
          type: "qwik/json",
          dangerouslySetInnerHTML: escapeText(jsonData)
        })
      ];
      if (prefetchResources.length > 0) {
        children.push(applyPrefetchImplementation(opts, prefetchResources));
      }
      const needLoader = !snapshotResult || snapshotResult.mode !== "static";
      const includeMode = (_b2 = (_a3 = opts.qwikLoader) == null ? void 0 : _a3.include) != null ? _b2 : "auto";
      const includeLoader = includeMode === "always" || includeMode === "auto" && needLoader;
      if (includeLoader) {
        const qwikLoaderScript = getQwikLoaderScript({
          events: (_c2 = opts.qwikLoader) == null ? void 0 : _c2.events,
          debug: opts.debug
        });
        children.push(
          jsx("script", {
            id: "qwikloader",
            dangerouslySetInnerHTML: qwikLoaderScript
          })
        );
      }
      collectRenderSymbols(renderSymbols, contexts);
      snapshotTime = snapshotTimer();
      return jsx(Fragment, { children });
    }
  });
  flush();
  const result = {
    prefetchResources,
    snapshotResult,
    flushes: networkFlushes,
    manifest: opts.manifest,
    size: totalSize,
    timing: {
      render: renderTime,
      snapshot: snapshotTime,
      firstFlush: firstFlushTime
    },
    _symbols: renderSymbols
  };
  return result;
}
function computeSymbolMapper(manifest2) {
  if (manifest2) {
    const mapper = {};
    Object.entries(manifest2.mapping).forEach(([key, value]) => {
      mapper[getSymbolHash(key)] = [key, value];
    });
    return mapper;
  }
  return void 0;
}
var escapeText = (str) => {
  return str.replace(/<(\/?script)/g, "\\x3C$1");
};
function collectRenderSymbols(renderSymbols, elements) {
  var _a2;
  for (const ctx of elements) {
    const symbol = (_a2 = ctx.$renderQrl$) == null ? void 0 : _a2.getSymbol();
    if (symbol && !renderSymbols.includes(symbol)) {
      renderSymbols.push(symbol);
    }
  }
}
const manifest = { "symbols": { "s_hA9UPaY8sNQ": { "origin": "../node_modules/@builder.io/qwik-city/index.qwik.mjs", "displayName": "Link_component_a_onClick", "canonicalFilename": "s_ha9upay8snq", "hash": "hA9UPaY8sNQ", "ctxKind": "event", "ctxName": "onClick$", "captures": true, "parent": "s_mYsiJcA4IBc" }, "s_skxgNVWVOT8": { "origin": "../node_modules/@builder.io/qwik-city/index.qwik.mjs", "displayName": "Link_component_a_onMouseOver", "canonicalFilename": "s_skxgnvwvot8", "hash": "skxgNVWVOT8", "ctxKind": "event", "ctxName": "onMouseOver$", "captures": true, "parent": "s_mYsiJcA4IBc" }, "s_uVE5iM9H73c": { "origin": "../node_modules/@builder.io/qwik-city/index.qwik.mjs", "displayName": "Link_component_a_onQVisible", "canonicalFilename": "s_uve5im9h73c", "hash": "uVE5iM9H73c", "ctxKind": "event", "ctxName": "onQVisible$", "captures": true, "parent": "s_mYsiJcA4IBc" }, "s_AaAlzKH0KlQ": { "origin": "../node_modules/@builder.io/qwik-city/index.qwik.mjs", "displayName": "QwikCity_component_useWatch", "canonicalFilename": "s_aaalzkh0klq", "hash": "AaAlzKH0KlQ", "ctxKind": "function", "ctxName": "useWatch$", "captures": true, "parent": "s_z1nvHyEppoI" }, "s_8tRoNT5nsJU": { "origin": "components/section-video/section-video.tsx", "displayName": "section_video_component_useClientEffect", "canonicalFilename": "s_8tront5nsju", "hash": "8tRoNT5nsJU", "ctxKind": "function", "ctxName": "useClientEffect$", "captures": true, "parent": "s_Xk3MjqlAJx4" }, "s_4LbTK0C63JY": { "origin": "components/section-topic/section-topic.tsx", "displayName": "section_topic_component", "canonicalFilename": "s_4lbtk0c63jy", "hash": "4LbTK0C63JY", "ctxKind": "function", "ctxName": "component$", "captures": false, "parent": null }, "s_6e5F0RIawGc": { "origin": "components/section-comments/section-comments.tsx", "displayName": "section_comments_component", "canonicalFilename": "s_6e5f0riawgc", "hash": "6e5F0RIawGc", "ctxKind": "function", "ctxName": "component$", "captures": false, "parent": null }, "s_7gMngGZozZg": { "origin": "components/comment/comment.tsx", "displayName": "comment_component", "canonicalFilename": "s_7gmnggzozzg", "hash": "7gMngGZozZg", "ctxKind": "function", "ctxName": "component$", "captures": false, "parent": null }, "s_8j6XIgveZCc": { "origin": "components/menu/menu.tsx", "displayName": "menu_component", "canonicalFilename": "s_8j6xigvezcc", "hash": "8j6XIgveZCc", "ctxKind": "function", "ctxName": "component$", "captures": false, "parent": null }, "s_9OkG00AoShE": { "origin": "components/author/author.tsx", "displayName": "author_component", "canonicalFilename": "s_9okg00aoshe", "hash": "9OkG00AoShE", "ctxKind": "function", "ctxName": "component$", "captures": false, "parent": null }, "s_KafZPA4KZLA": { "origin": "components/section/section.tsx", "displayName": "section_component", "canonicalFilename": "s_kafzpa4kzla", "hash": "KafZPA4KZLA", "ctxKind": "function", "ctxName": "component$", "captures": false, "parent": null }, "s_Xk3MjqlAJx4": { "origin": "components/section-video/section-video.tsx", "displayName": "section_video_component", "canonicalFilename": "s_xk3mjqlajx4", "hash": "Xk3MjqlAJx4", "ctxKind": "function", "ctxName": "component$", "captures": false, "parent": null }, "s_YnxdFAiIhz4": { "origin": "components/card/card.tsx", "displayName": "card_component", "canonicalFilename": "s_ynxdfaiihz4", "hash": "YnxdFAiIhz4", "ctxKind": "function", "ctxName": "component$", "captures": false, "parent": null }, "s_ZG5NmNv3vZg": { "origin": "components/footer/footer.tsx", "displayName": "footer_component", "canonicalFilename": "s_zg5nmnv3vzg", "hash": "ZG5NmNv3vZg", "ctxKind": "function", "ctxName": "component$", "captures": false, "parent": null }, "s_aRWrO5CEhBc": { "origin": "components/head/head.tsx", "displayName": "head_component", "canonicalFilename": "s_arwro5cehbc", "hash": "aRWrO5CEhBc", "ctxKind": "function", "ctxName": "component$", "captures": false, "parent": null }, "s_iIEFR4Lrsg4": { "origin": "routes/[topic]/index.tsx", "displayName": "_topic__component", "canonicalFilename": "s_iiefr4lrsg4", "hash": "iIEFR4Lrsg4", "ctxKind": "function", "ctxName": "component$", "captures": false, "parent": null }, "s_lWjUoUq84ME": { "origin": "routes/index.tsx", "displayName": "routes_component", "canonicalFilename": "s_lwjuouq84me", "hash": "lWjUoUq84ME", "ctxKind": "function", "ctxName": "component$", "captures": false, "parent": null }, "s_mUNWJPoUEcs": { "origin": "components/section-cta/section-cta.tsx", "displayName": "section_cta_component", "canonicalFilename": "s_munwjpouecs", "hash": "mUNWJPoUEcs", "ctxKind": "function", "ctxName": "component$", "captures": false, "parent": null }, "s_mYsiJcA4IBc": { "origin": "../node_modules/@builder.io/qwik-city/index.qwik.mjs", "displayName": "Link_component", "canonicalFilename": "s_mysijca4ibc", "hash": "mYsiJcA4IBc", "ctxKind": "function", "ctxName": "component$", "captures": false, "parent": null }, "s_nd8yk3KO22c": { "origin": "../node_modules/@builder.io/qwik-city/index.qwik.mjs", "displayName": "RouterOutlet_component", "canonicalFilename": "s_nd8yk3ko22c", "hash": "nd8yk3KO22c", "ctxKind": "function", "ctxName": "component$", "captures": false, "parent": null }, "s_z1nvHyEppoI": { "origin": "../node_modules/@builder.io/qwik-city/index.qwik.mjs", "displayName": "QwikCity_component", "canonicalFilename": "s_z1nvhyeppoi", "hash": "z1nvHyEppoI", "ctxKind": "function", "ctxName": "component$", "captures": false, "parent": null }, "s_z8saDCzoko8": { "origin": "routes/layout.tsx", "displayName": "layout_component", "canonicalFilename": "s_z8sadczoko8", "hash": "z8saDCzoko8", "ctxKind": "function", "ctxName": "component$", "captures": false, "parent": null }, "s_7RXsVZFEVkQ": { "origin": "components/footer/footer.tsx", "displayName": "footer_component_useStylesScoped", "canonicalFilename": "s_7rxsvzfevkq", "hash": "7RXsVZFEVkQ", "ctxKind": "function", "ctxName": "useStylesScoped$", "captures": false, "parent": "s_ZG5NmNv3vZg" }, "s_CgEvv1IhB9s": { "origin": "components/section-video/section-video.tsx", "displayName": "section_video_component_useStylesScoped", "canonicalFilename": "s_cgevv1ihb9s", "hash": "CgEvv1IhB9s", "ctxKind": "function", "ctxName": "useStylesScoped$", "captures": false, "parent": "s_Xk3MjqlAJx4" }, "s_M0FIA8mDlgA": { "origin": "components/section-cta/section-cta.tsx", "displayName": "section_cta_component_useStylesScoped", "canonicalFilename": "s_m0fia8mdlga", "hash": "M0FIA8mDlgA", "ctxKind": "function", "ctxName": "useStylesScoped$", "captures": false, "parent": "s_mUNWJPoUEcs" }, "s_SN3aXXYhgG8": { "origin": "components/comment/comment.tsx", "displayName": "comment_component_useStylesScoped", "canonicalFilename": "s_sn3axxyhgg8", "hash": "SN3aXXYhgG8", "ctxKind": "function", "ctxName": "useStylesScoped$", "captures": false, "parent": "s_7gMngGZozZg" }, "s_WTpUzqKbtAQ": { "origin": "components/section-topic/section-topic.tsx", "displayName": "section_topic_component_useStylesScoped", "canonicalFilename": "s_wtpuzqkbtaq", "hash": "WTpUzqKbtAQ", "ctxKind": "function", "ctxName": "useStylesScoped$", "captures": false, "parent": "s_4LbTK0C63JY" }, "s_Wb3hxYxJwBo": { "origin": "components/card/card.tsx", "displayName": "card_component_useStylesScoped", "canonicalFilename": "s_wb3hxyxjwbo", "hash": "Wb3hxYxJwBo", "ctxKind": "function", "ctxName": "useStylesScoped$", "captures": false, "parent": "s_YnxdFAiIhz4" }, "s_XTGkpgNab0M": { "origin": "components/section/section.tsx", "displayName": "section_component_useStylesScoped", "canonicalFilename": "s_xtgkpgnab0m", "hash": "XTGkpgNab0M", "ctxKind": "function", "ctxName": "useStylesScoped$", "captures": false, "parent": "s_KafZPA4KZLA" }, "s_Yi51Li7iOAs": { "origin": "components/section-comments/section-comments.tsx", "displayName": "section_comments_component_useStylesScoped", "canonicalFilename": "s_yi51li7ioas", "hash": "Yi51Li7iOAs", "ctxKind": "function", "ctxName": "useStylesScoped$", "captures": false, "parent": "s_6e5F0RIawGc" }, "s_ckdDfn0i400": { "origin": "components/author/author.tsx", "displayName": "author_component_useStylesScoped", "canonicalFilename": "s_ckddfn0i400", "hash": "ckdDfn0i400", "ctxKind": "function", "ctxName": "useStylesScoped$", "captures": false, "parent": "s_9OkG00AoShE" }, "s_n70Gc0CIChg": { "origin": "components/menu/menu.tsx", "displayName": "menu_component_useStylesScoped", "canonicalFilename": "s_n70gc0cichg", "hash": "n70Gc0CIChg", "ctxKind": "function", "ctxName": "useStylesScoped$", "captures": false, "parent": "s_8j6XIgveZCc" } }, "mapping": { "s_hA9UPaY8sNQ": "q-3ecd6695.js", "s_skxgNVWVOT8": "q-3ecd6695.js", "s_uVE5iM9H73c": "q-3ecd6695.js", "s_AaAlzKH0KlQ": "q-88aa0d7f.js", "s_8tRoNT5nsJU": "q-5b2a2e82.js", "s_4LbTK0C63JY": "q-60dba0ed.js", "s_6e5F0RIawGc": "q-8edadf03.js", "s_7gMngGZozZg": "q-d5181ad2.js", "s_8j6XIgveZCc": "q-317a3acd.js", "s_9OkG00AoShE": "q-37a15c46.js", "s_KafZPA4KZLA": "q-a9c836c4.js", "s_Xk3MjqlAJx4": "q-5b2a2e82.js", "s_YnxdFAiIhz4": "q-c257a29b.js", "s_ZG5NmNv3vZg": "q-c2d580a8.js", "s_aRWrO5CEhBc": "q-7fd04080.js", "s_iIEFR4Lrsg4": "q-e6ab7e8e.js", "s_lWjUoUq84ME": "q-aef6c4be.js", "s_mUNWJPoUEcs": "q-c6f4465c.js", "s_mYsiJcA4IBc": "q-3ecd6695.js", "s_nd8yk3KO22c": "q-f1758af0.js", "s_z1nvHyEppoI": "q-88aa0d7f.js", "s_z8saDCzoko8": "q-a6848e0d.js", "s_7RXsVZFEVkQ": "q-c2d580a8.js", "s_CgEvv1IhB9s": "q-5b2a2e82.js", "s_M0FIA8mDlgA": "q-c6f4465c.js", "s_SN3aXXYhgG8": "q-d5181ad2.js", "s_WTpUzqKbtAQ": "q-60dba0ed.js", "s_Wb3hxYxJwBo": "q-c257a29b.js", "s_XTGkpgNab0M": "q-a9c836c4.js", "s_Yi51Li7iOAs": "q-8edadf03.js", "s_ckdDfn0i400": "q-37a15c46.js", "s_n70Gc0CIChg": "q-317a3acd.js" }, "bundles": { "q-1291ee88.js": { "size": 371, "imports": ["q-52f46922.js"], "dynamicImports": ["q-16d0044b.js", "q-a75d7ecb.js", "q-e62d0a5c.js"], "origins": ["@qwik-city-plan"] }, "q-16d0044b.js": { "size": 171, "imports": ["q-52f46922.js"], "dynamicImports": ["q-aef6c4be.js"], "origins": ["src/routes/index.js"] }, "q-317a3acd.js": { "size": 1806, "imports": ["q-52f46922.js"], "origins": ["src/components/menu/menu.css?used", "src/entry_menu.js", "src/s_8j6xigvezcc.js", "src/s_n70gc0cichg.js"], "symbols": ["s_8j6XIgveZCc", "s_n70Gc0CIChg"] }, "q-37a15c46.js": { "size": 1105, "imports": ["q-52f46922.js"], "origins": ["src/components/author/author.css?used&inline", "src/entry_author.js", "src/s_9okg00aoshe.js", "src/s_ckddfn0i400.js"], "symbols": ["s_9OkG00AoShE", "s_ckdDfn0i400"] }, "q-3ecd6695.js": { "size": 893, "imports": ["q-52f46922.js"], "origins": ["src/entry_Link.js", "src/s_ha9upay8snq.js", "src/s_mysijca4ibc.js", "src/s_skxgnvwvot8.js", "src/s_uve5im9h73c.js"], "symbols": ["s_hA9UPaY8sNQ", "s_mYsiJcA4IBc", "s_skxgNVWVOT8", "s_uVE5iM9H73c"] }, "q-52f46922.js": { "size": 39244, "dynamicImports": ["q-3ecd6695.js", "q-7fd04080.js", "q-88aa0d7f.js", "q-f1758af0.js"], "origins": ["\0vite/preload-helper", "node_modules/@builder.io/qwik-city/index.qwik.mjs", "node_modules/@builder.io/qwik/core.min.mjs", "src/components/head/head.css", "src/components/head/head.js", "src/global.css", "src/root.js"] }, "q-5b2a2e82.js": { "size": 2189, "imports": ["q-52f46922.js"], "dynamicImports": ["q-37a15c46.js"], "origins": ["src/components/author/author.js", "src/components/section-video/section-video.css?used&inline", "src/entry_section_video.js", "src/s_8tront5nsju.js", "src/s_cgevv1ihb9s.js", "src/s_xk3mjqlajx4.js"], "symbols": ["s_8tRoNT5nsJU", "s_CgEvv1IhB9s", "s_Xk3MjqlAJx4"] }, "q-60dba0ed.js": { "size": 1063, "imports": ["q-52f46922.js", "q-c7bb4051.js"], "dynamicImports": ["q-c257a29b.js"], "origins": ["src/components/card/card.js", "src/components/section-topic/section-topic.css?used&inline", "src/entry_section_topic.js", "src/s_4lbtk0c63jy.js", "src/s_wtpuzqkbtaq.js"], "symbols": ["s_4LbTK0C63JY", "s_WTpUzqKbtAQ"] }, "q-7fd04080.js": { "size": 1979, "imports": ["q-52f46922.js"], "origins": ["src/components/head/social.js", "src/entry_head.js", "src/s_arwro5cehbc.js"], "symbols": ["s_aRWrO5CEhBc"] }, "q-88aa0d7f.js": { "size": 1460, "imports": ["q-52f46922.js"], "dynamicImports": ["q-1291ee88.js"], "origins": ["@builder.io/qwik/build", "src/entry_QwikCity.js", "src/s_aaalzkh0klq.js", "src/s_z1nvhyeppoi.js"], "symbols": ["s_AaAlzKH0KlQ", "s_z1nvHyEppoI"] }, "q-8edadf03.js": { "size": 1116, "imports": ["q-52f46922.js", "q-c7bb4051.js"], "dynamicImports": ["q-d5181ad2.js"], "origins": ["src/components/comment/comment.js", "src/components/section-comments/section-comments.css?used&inline", "src/entry_section_comments.js", "src/s_6e5f0riawgc.js", "src/s_yi51li7ioas.js"], "symbols": ["s_6e5F0RIawGc", "s_Yi51Li7iOAs"] }, "q-a6848e0d.js": { "size": 317, "imports": ["q-52f46922.js"], "dynamicImports": ["q-317a3acd.js", "q-c2d580a8.js"], "origins": ["src/components/footer/footer.js", "src/components/menu/menu.js", "src/entry_layout.js", "src/s_z8sadczoko8.js"], "symbols": ["s_z8saDCzoko8"] }, "q-a75d7ecb.js": { "size": 197, "imports": ["q-52f46922.js"], "dynamicImports": ["q-e6ab7e8e.js"], "origins": ["src/routes/[topic]/index.js"] }, "q-a9c836c4.js": { "size": 983, "imports": ["q-52f46922.js"], "origins": ["src/components/section/section.css?used&inline", "src/entry_section.js", "src/s_kafzpa4kzla.js", "src/s_xtgkpgnab0m.js"], "symbols": ["s_KafZPA4KZLA", "s_XTGkpgNab0M"] }, "q-aef6c4be.js": { "size": 91, "imports": ["q-52f46922.js"], "origins": ["src/entry_routes.js", "src/s_lwjuouq84me.js"], "symbols": ["s_lWjUoUq84ME"] }, "q-ba96c4ef.js": { "size": 58, "imports": ["q-52f46922.js"] }, "q-c257a29b.js": { "size": 657, "imports": ["q-52f46922.js"], "origins": ["src/components/card/card.css?used&inline", "src/entry_card.js", "src/s_wb3hxyxjwbo.js", "src/s_ynxdfaiihz4.js"], "symbols": ["s_Wb3hxYxJwBo", "s_YnxdFAiIhz4"] }, "q-c2d580a8.js": { "size": 1100, "imports": ["q-52f46922.js"], "origins": ["src/components/footer/footer.css?used&inline", "src/entry_footer.js", "src/s_7rxsvzfevkq.js", "src/s_zg5nmnv3vzg.js"], "symbols": ["s_7RXsVZFEVkQ", "s_ZG5NmNv3vZg"] }, "q-c6f4465c.js": { "size": 1379, "imports": ["q-52f46922.js"], "origins": ["src/components/section-cta/section-cta.css?used", "src/entry_section_cta.js", "src/s_m0fia8mdlga.js", "src/s_munwjpouecs.js"], "symbols": ["s_M0FIA8mDlgA", "s_mUNWJPoUEcs"] }, "q-c7bb4051.js": { "size": 165, "imports": ["q-52f46922.js"], "dynamicImports": ["q-e6ab7e8e.js"], "origins": ["src/routes/[topic]/index.tsx"] }, "q-d5181ad2.js": { "size": 1033, "imports": ["q-52f46922.js"], "origins": ["src/components/comment/comment.css?used&inline", "src/entry_comment.js", "src/s_7gmnggzozzg.js", "src/s_sn3axxyhgg8.js"], "symbols": ["s_7gMngGZozZg", "s_SN3aXXYhgG8"] }, "q-e62d0a5c.js": { "size": 158, "imports": ["q-52f46922.js"], "dynamicImports": ["q-a6848e0d.js"], "origins": ["src/routes/layout.js"] }, "q-e6ab7e8e.js": { "size": 8358, "imports": ["q-52f46922.js", "q-a75d7ecb.js"], "dynamicImports": ["q-5b2a2e82.js", "q-60dba0ed.js", "q-8edadf03.js", "q-a9c836c4.js", "q-c6f4465c.js"], "origins": ["src/components/section-comments/section-comments.js", "src/components/section-cta/section-cta.js", "src/components/section-topic/section-topic.js", "src/components/section-video/section-video.js", "src/components/section/section.js", "src/context/store.js", "src/entry__topic_.js", "src/s_iiefr4lrsg4.js"], "symbols": ["s_iIEFR4Lrsg4"] }, "q-f1758af0.js": { "size": 240, "imports": ["q-52f46922.js"], "origins": ["src/entry_RouterOutlet.js", "src/s_nd8yk3ko22c.js"], "symbols": ["s_nd8yk3KO22c"] } }, "injections": [{ "tag": "link", "location": "head", "attributes": { "rel": "stylesheet", "href": "/build/q-cc263384.css" } }, { "tag": "link", "location": "head", "attributes": { "rel": "stylesheet", "href": "/build/q-385cde7f.css" } }, { "tag": "link", "location": "head", "attributes": { "rel": "stylesheet", "href": "/build/q-e95fe3e8.css" } }], "version": "1", "options": { "target": "client", "buildMode": "production", "forceFullBuild": true, "entryStrategy": { "type": "smart" } }, "platform": { "qwik": "0.0.108", "vite": "", "rollup": "2.77.3", "env": "node", "os": "win32", "node": "16.15.1" } };
const Social = () => {
  return /* @__PURE__ */ jsx(Fragment, {
    children: [
      /* @__PURE__ */ jsx("meta", {
        property: "og:site_name",
        content: "Aprende programaci\xF3n ahora"
      }),
      /* @__PURE__ */ jsx("meta", {
        name: "twitter:card",
        content: "summary_large_image"
      }),
      /* @__PURE__ */ jsx("meta", {
        name: "twitter:site",
        content: "@LeiferMendez"
      }),
      /* @__PURE__ */ jsx("meta", {
        name: "twitter:title",
        content: "LeiferMendez"
      }),
      /* @__PURE__ */ jsx("meta", {
        name: "twitter:image",
        content: "https://i.imgur.com/M21denU.png"
      }),
      /* @__PURE__ */ jsx("meta", {
        name: "description",
        content: "Todo lo que necesitas para convertirte en un Programador Backend"
      }),
      /* @__PURE__ */ jsx("meta", {
        property: "og:type",
        content: "website"
      }),
      /* @__PURE__ */ jsx("meta", {
        name: "keywords",
        content: "cursos programacion, cursos backend, curso de aws, curso de cloud computing, curso de node, curso de typescript, curso de api rest con node, curso de api rest con mongo, curso de api rest con aws"
      }),
      /* @__PURE__ */ jsx("meta", {
        property: "og:title",
        content: "Todo lo que necesitas para convertirte en un Programador Backend"
      }),
      /* @__PURE__ */ jsx("meta", {
        property: "og:description",
        content: "Todo lo que necesitas para convertirte en un Programador Backend"
      }),
      /* @__PURE__ */ jsx("meta", {
        property: "og:type",
        content: "article"
      }),
      /* @__PURE__ */ jsx("meta", {
        property: "og:locale",
        content: "es_ES"
      }),
      /* @__PURE__ */ jsx("meta", {
        property: "og:url",
        content: "https://campaign.codigoencasa.com"
      }),
      /* @__PURE__ */ jsx("meta", {
        property: "og:site_name",
        content: "campaign.codigoencasa.com"
      }),
      /* @__PURE__ */ jsx("meta", {
        property: "og:image",
        content: "https://i.imgur.com/M21denU.png"
      }),
      /* @__PURE__ */ jsx("meta", {
        property: "og:image:secure_url",
        content: "https://i.imgur.com/M21denU.png"
      }),
      /* @__PURE__ */ jsx("meta", {
        property: "og:image:type",
        content: "image/png"
      }),
      /* @__PURE__ */ jsx("meta", {
        property: "og:image:width",
        content: "1200"
      }),
      /* @__PURE__ */ jsx("meta", {
        property: "og:image:height",
        content: "630"
      })
    ]
  });
};
const head = "";
const Head = /* @__PURE__ */ componentQrl(inlinedQrl(() => {
  const loc = useLocation();
  return /* @__PURE__ */ jsx("head", {
    lang: "es",
    children: [
      /* @__PURE__ */ jsx("meta", {
        name: "google",
        content: "notranslate"
      }),
      /* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }),
      /* @__PURE__ */ jsx("title", {
        children: "La programaci\xF3n es el ahora y el futuro"
      }),
      /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1.0"
      }),
      /* @__PURE__ */ jsx("link", {
        rel: "canonical",
        href: loc.href
      }),
      /* @__PURE__ */ jsx("meta", {
        name: "theme-color",
        content: "#1a1a1a"
      }),
      /* @__PURE__ */ jsx(Social, {})
    ]
  });
}, "s_aRWrO5CEhBc"));
const global$1 = "";
const Root = () => {
  return /* @__PURE__ */ jsx(QwikCity, {
    children: [
      /* @__PURE__ */ jsx(Head, {}),
      /* @__PURE__ */ jsx("body", {
        lang: "es",
        children: /* @__PURE__ */ jsx(RouterOutlet, {})
      })
    ]
  });
};
function render(opts) {
  return renderToStream(/* @__PURE__ */ jsx(Root, {}), {
    manifest,
    ...opts
  });
}
const qwikCityHandler = qwikCity(render);
export {
  qwikCityHandler as default
};
