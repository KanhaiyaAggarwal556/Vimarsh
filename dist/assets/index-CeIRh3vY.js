function Gd(e, t) {
  for (var n = 0; n < t.length; n++) {
    const r = t[n];
    if (typeof r != "string" && !Array.isArray(r)) {
      for (const s in r)
        if (s !== "default" && !(s in e)) {
          const i = Object.getOwnPropertyDescriptor(r, s);
          i &&
            Object.defineProperty(
              e,
              s,
              i.get ? i : { enumerable: !0, get: () => r[s] }
            );
        }
    }
  }
  return Object.freeze(
    Object.defineProperty(e, Symbol.toStringTag, { value: "Module" })
  );
}
(function () {
  const t = document.createElement("link").relList;
  if (t && t.supports && t.supports("modulepreload")) return;
  for (const s of document.querySelectorAll('link[rel="modulepreload"]')) r(s);
  new MutationObserver((s) => {
    for (const i of s)
      if (i.type === "childList")
        for (const o of i.addedNodes)
          o.tagName === "LINK" && o.rel === "modulepreload" && r(o);
  }).observe(document, { childList: !0, subtree: !0 });
  function n(s) {
    const i = {};
    return (
      s.integrity && (i.integrity = s.integrity),
      s.referrerPolicy && (i.referrerPolicy = s.referrerPolicy),
      s.crossOrigin === "use-credentials"
        ? (i.credentials = "include")
        : s.crossOrigin === "anonymous"
        ? (i.credentials = "omit")
        : (i.credentials = "same-origin"),
      i
    );
  }
  function r(s) {
    if (s.ep) return;
    s.ep = !0;
    const i = n(s);
    fetch(s.href, i);
  }
})();
function tu(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default")
    ? e.default
    : e;
}
var nu = { exports: {} },
  zs = {},
  ru = { exports: {} },
  U = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var wr = Symbol.for("react.element"),
  Yd = Symbol.for("react.portal"),
  Xd = Symbol.for("react.fragment"),
  Jd = Symbol.for("react.strict_mode"),
  Zd = Symbol.for("react.profiler"),
  ef = Symbol.for("react.provider"),
  tf = Symbol.for("react.context"),
  nf = Symbol.for("react.forward_ref"),
  rf = Symbol.for("react.suspense"),
  sf = Symbol.for("react.memo"),
  lf = Symbol.for("react.lazy"),
  Oo = Symbol.iterator;
function of(e) {
  return e === null || typeof e != "object"
    ? null
    : ((e = (Oo && e[Oo]) || e["@@iterator"]),
      typeof e == "function" ? e : null);
}
var su = {
    isMounted: function () {
      return !1;
    },
    enqueueForceUpdate: function () {},
    enqueueReplaceState: function () {},
    enqueueSetState: function () {},
  },
  lu = Object.assign,
  iu = {};
function Rn(e, t, n) {
  (this.props = e),
    (this.context = t),
    (this.refs = iu),
    (this.updater = n || su);
}
Rn.prototype.isReactComponent = {};
Rn.prototype.setState = function (e, t) {
  if (typeof e != "object" && typeof e != "function" && e != null)
    throw Error(
      "setState(...): takes an object of state variables to update or a function which returns an object of state variables."
    );
  this.updater.enqueueSetState(this, e, t, "setState");
};
Rn.prototype.forceUpdate = function (e) {
  this.updater.enqueueForceUpdate(this, e, "forceUpdate");
};
function ou() {}
ou.prototype = Rn.prototype;
function Si(e, t, n) {
  (this.props = e),
    (this.context = t),
    (this.refs = iu),
    (this.updater = n || su);
}
var Ci = (Si.prototype = new ou());
Ci.constructor = Si;
lu(Ci, Rn.prototype);
Ci.isPureReactComponent = !0;
var Do = Array.isArray,
  au = Object.prototype.hasOwnProperty,
  Ei = { current: null },
  uu = { key: !0, ref: !0, __self: !0, __source: !0 };
function cu(e, t, n) {
  var r,
    s = {},
    i = null,
    o = null;
  if (t != null)
    for (r in (t.ref !== void 0 && (o = t.ref),
    t.key !== void 0 && (i = "" + t.key),
    t))
      au.call(t, r) && !uu.hasOwnProperty(r) && (s[r] = t[r]);
  var a = arguments.length - 2;
  if (a === 1) s.children = n;
  else if (1 < a) {
    for (var u = Array(a), c = 0; c < a; c++) u[c] = arguments[c + 2];
    s.children = u;
  }
  if (e && e.defaultProps)
    for (r in ((a = e.defaultProps), a)) s[r] === void 0 && (s[r] = a[r]);
  return {
    $$typeof: wr,
    type: e,
    key: i,
    ref: o,
    props: s,
    _owner: Ei.current,
  };
}
function af(e, t) {
  return {
    $$typeof: wr,
    type: e.type,
    key: t,
    ref: e.ref,
    props: e.props,
    _owner: e._owner,
  };
}
function Pi(e) {
  return typeof e == "object" && e !== null && e.$$typeof === wr;
}
function uf(e) {
  var t = { "=": "=0", ":": "=2" };
  return (
    "$" +
    e.replace(/[=:]/g, function (n) {
      return t[n];
    })
  );
}
var bo = /\/+/g;
function el(e, t) {
  return typeof e == "object" && e !== null && e.key != null
    ? uf("" + e.key)
    : t.toString(36);
}
function Qr(e, t, n, r, s) {
  var i = typeof e;
  (i === "undefined" || i === "boolean") && (e = null);
  var o = !1;
  if (e === null) o = !0;
  else
    switch (i) {
      case "string":
      case "number":
        o = !0;
        break;
      case "object":
        switch (e.$$typeof) {
          case wr:
          case Yd:
            o = !0;
        }
    }
  if (o)
    return (
      (o = e),
      (s = s(o)),
      (e = r === "" ? "." + el(o, 0) : r),
      Do(s)
        ? ((n = ""),
          e != null && (n = e.replace(bo, "$&/") + "/"),
          Qr(s, t, n, "", function (c) {
            return c;
          }))
        : s != null &&
          (Pi(s) &&
            (s = af(
              s,
              n +
                (!s.key || (o && o.key === s.key)
                  ? ""
                  : ("" + s.key).replace(bo, "$&/") + "/") +
                e
            )),
          t.push(s)),
      1
    );
  if (((o = 0), (r = r === "" ? "." : r + ":"), Do(e)))
    for (var a = 0; a < e.length; a++) {
      i = e[a];
      var u = r + el(i, a);
      o += Qr(i, t, n, u, s);
    }
  else if (((u = of(e)), typeof u == "function"))
    for (e = u.call(e), a = 0; !(i = e.next()).done; )
      (i = i.value), (u = r + el(i, a++)), (o += Qr(i, t, n, u, s));
  else if (i === "object")
    throw (
      ((t = String(e)),
      Error(
        "Objects are not valid as a React child (found: " +
          (t === "[object Object]"
            ? "object with keys {" + Object.keys(e).join(", ") + "}"
            : t) +
          "). If you meant to render a collection of children, use an array instead."
      ))
    );
  return o;
}
function Rr(e, t, n) {
  if (e == null) return e;
  var r = [],
    s = 0;
  return (
    Qr(e, r, "", "", function (i) {
      return t.call(n, i, s++);
    }),
    r
  );
}
function cf(e) {
  if (e._status === -1) {
    var t = e._result;
    (t = t()),
      t.then(
        function (n) {
          (e._status === 0 || e._status === -1) &&
            ((e._status = 1), (e._result = n));
        },
        function (n) {
          (e._status === 0 || e._status === -1) &&
            ((e._status = 2), (e._result = n));
        }
      ),
      e._status === -1 && ((e._status = 0), (e._result = t));
  }
  if (e._status === 1) return e._result.default;
  throw e._result;
}
var xe = { current: null },
  Kr = { transition: null },
  df = {
    ReactCurrentDispatcher: xe,
    ReactCurrentBatchConfig: Kr,
    ReactCurrentOwner: Ei,
  };
function du() {
  throw Error("act(...) is not supported in production builds of React.");
}
U.Children = {
  map: Rr,
  forEach: function (e, t, n) {
    Rr(
      e,
      function () {
        t.apply(this, arguments);
      },
      n
    );
  },
  count: function (e) {
    var t = 0;
    return (
      Rr(e, function () {
        t++;
      }),
      t
    );
  },
  toArray: function (e) {
    return (
      Rr(e, function (t) {
        return t;
      }) || []
    );
  },
  only: function (e) {
    if (!Pi(e))
      throw Error(
        "React.Children.only expected to receive a single React element child."
      );
    return e;
  },
};
U.Component = Rn;
U.Fragment = Xd;
U.Profiler = Zd;
U.PureComponent = Si;
U.StrictMode = Jd;
U.Suspense = rf;
U.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = df;
U.act = du;
U.cloneElement = function (e, t, n) {
  if (e == null)
    throw Error(
      "React.cloneElement(...): The argument must be a React element, but you passed " +
        e +
        "."
    );
  var r = lu({}, e.props),
    s = e.key,
    i = e.ref,
    o = e._owner;
  if (t != null) {
    if (
      (t.ref !== void 0 && ((i = t.ref), (o = Ei.current)),
      t.key !== void 0 && (s = "" + t.key),
      e.type && e.type.defaultProps)
    )
      var a = e.type.defaultProps;
    for (u in t)
      au.call(t, u) &&
        !uu.hasOwnProperty(u) &&
        (r[u] = t[u] === void 0 && a !== void 0 ? a[u] : t[u]);
  }
  var u = arguments.length - 2;
  if (u === 1) r.children = n;
  else if (1 < u) {
    a = Array(u);
    for (var c = 0; c < u; c++) a[c] = arguments[c + 2];
    r.children = a;
  }
  return { $$typeof: wr, type: e.type, key: s, ref: i, props: r, _owner: o };
};
U.createContext = function (e) {
  return (
    (e = {
      $$typeof: tf,
      _currentValue: e,
      _currentValue2: e,
      _threadCount: 0,
      Provider: null,
      Consumer: null,
      _defaultValue: null,
      _globalName: null,
    }),
    (e.Provider = { $$typeof: ef, _context: e }),
    (e.Consumer = e)
  );
};
U.createElement = cu;
U.createFactory = function (e) {
  var t = cu.bind(null, e);
  return (t.type = e), t;
};
U.createRef = function () {
  return { current: null };
};
U.forwardRef = function (e) {
  return { $$typeof: nf, render: e };
};
U.isValidElement = Pi;
U.lazy = function (e) {
  return { $$typeof: lf, _payload: { _status: -1, _result: e }, _init: cf };
};
U.memo = function (e, t) {
  return { $$typeof: sf, type: e, compare: t === void 0 ? null : t };
};
U.startTransition = function (e) {
  var t = Kr.transition;
  Kr.transition = {};
  try {
    e();
  } finally {
    Kr.transition = t;
  }
};
U.unstable_act = du;
U.useCallback = function (e, t) {
  return xe.current.useCallback(e, t);
};
U.useContext = function (e) {
  return xe.current.useContext(e);
};
U.useDebugValue = function () {};
U.useDeferredValue = function (e) {
  return xe.current.useDeferredValue(e);
};
U.useEffect = function (e, t) {
  return xe.current.useEffect(e, t);
};
U.useId = function () {
  return xe.current.useId();
};
U.useImperativeHandle = function (e, t, n) {
  return xe.current.useImperativeHandle(e, t, n);
};
U.useInsertionEffect = function (e, t) {
  return xe.current.useInsertionEffect(e, t);
};
U.useLayoutEffect = function (e, t) {
  return xe.current.useLayoutEffect(e, t);
};
U.useMemo = function (e, t) {
  return xe.current.useMemo(e, t);
};
U.useReducer = function (e, t, n) {
  return xe.current.useReducer(e, t, n);
};
U.useRef = function (e) {
  return xe.current.useRef(e);
};
U.useState = function (e) {
  return xe.current.useState(e);
};
U.useSyncExternalStore = function (e, t, n) {
  return xe.current.useSyncExternalStore(e, t, n);
};
U.useTransition = function () {
  return xe.current.useTransition();
};
U.version = "18.3.1";
ru.exports = U;
var y = ru.exports;
const wt = tu(y),
  ff = Gd({ __proto__: null, default: wt }, [y]);
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var pf = y,
  hf = Symbol.for("react.element"),
  mf = Symbol.for("react.fragment"),
  gf = Object.prototype.hasOwnProperty,
  vf = pf.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,
  yf = { key: !0, ref: !0, __self: !0, __source: !0 };
function fu(e, t, n) {
  var r,
    s = {},
    i = null,
    o = null;
  n !== void 0 && (i = "" + n),
    t.key !== void 0 && (i = "" + t.key),
    t.ref !== void 0 && (o = t.ref);
  for (r in t) gf.call(t, r) && !yf.hasOwnProperty(r) && (s[r] = t[r]);
  if (e && e.defaultProps)
    for (r in ((t = e.defaultProps), t)) s[r] === void 0 && (s[r] = t[r]);
  return {
    $$typeof: hf,
    type: e,
    key: i,
    ref: o,
    props: s,
    _owner: vf.current,
  };
}
zs.Fragment = mf;
zs.jsx = fu;
zs.jsxs = fu;
nu.exports = zs;
var l = nu.exports,
  pu = { exports: {} },
  Me = {},
  hu = { exports: {} },
  mu = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ (function (e) {
  function t(_, M) {
    var z = _.length;
    _.push(M);
    e: for (; 0 < z; ) {
      var F = (z - 1) >>> 1,
        K = _[F];
      if (0 < s(K, M)) (_[F] = M), (_[z] = K), (z = F);
      else break e;
    }
  }
  function n(_) {
    return _.length === 0 ? null : _[0];
  }
  function r(_) {
    if (_.length === 0) return null;
    var M = _[0],
      z = _.pop();
    if (z !== M) {
      _[0] = z;
      e: for (var F = 0, K = _.length, nt = K >>> 1; F < nt; ) {
        var Oe = 2 * (F + 1) - 1,
          De = _[Oe],
          B = Oe + 1,
          _e = _[B];
        if (0 > s(De, z))
          B < K && 0 > s(_e, De)
            ? ((_[F] = _e), (_[B] = z), (F = B))
            : ((_[F] = De), (_[Oe] = z), (F = Oe));
        else if (B < K && 0 > s(_e, z)) (_[F] = _e), (_[B] = z), (F = B);
        else break e;
      }
    }
    return M;
  }
  function s(_, M) {
    var z = _.sortIndex - M.sortIndex;
    return z !== 0 ? z : _.id - M.id;
  }
  if (typeof performance == "object" && typeof performance.now == "function") {
    var i = performance;
    e.unstable_now = function () {
      return i.now();
    };
  } else {
    var o = Date,
      a = o.now();
    e.unstable_now = function () {
      return o.now() - a;
    };
  }
  var u = [],
    c = [],
    d = 1,
    h = null,
    g = 3,
    w = !1,
    k = !1,
    x = !1,
    C = typeof setTimeout == "function" ? setTimeout : null,
    m = typeof clearTimeout == "function" ? clearTimeout : null,
    p = typeof setImmediate < "u" ? setImmediate : null;
  typeof navigator < "u" &&
    navigator.scheduling !== void 0 &&
    navigator.scheduling.isInputPending !== void 0 &&
    navigator.scheduling.isInputPending.bind(navigator.scheduling);
  function f(_) {
    for (var M = n(c); M !== null; ) {
      if (M.callback === null) r(c);
      else if (M.startTime <= _)
        r(c), (M.sortIndex = M.expirationTime), t(u, M);
      else break;
      M = n(c);
    }
  }
  function j(_) {
    if (((x = !1), f(_), !k))
      if (n(u) !== null) (k = !0), V(S);
      else {
        var M = n(c);
        M !== null && te(j, M.startTime - _);
      }
  }
  function S(_, M) {
    (k = !1), x && ((x = !1), m(P), (P = -1)), (w = !0);
    var z = g;
    try {
      for (
        f(M), h = n(u);
        h !== null && (!(h.expirationTime > M) || (_ && !D()));

      ) {
        var F = h.callback;
        if (typeof F == "function") {
          (h.callback = null), (g = h.priorityLevel);
          var K = F(h.expirationTime <= M);
          (M = e.unstable_now()),
            typeof K == "function" ? (h.callback = K) : h === n(u) && r(u),
            f(M);
        } else r(u);
        h = n(u);
      }
      if (h !== null) var nt = !0;
      else {
        var Oe = n(c);
        Oe !== null && te(j, Oe.startTime - M), (nt = !1);
      }
      return nt;
    } finally {
      (h = null), (g = z), (w = !1);
    }
  }
  var R = !1,
    N = null,
    P = -1,
    $ = 5,
    T = -1;
  function D() {
    return !(e.unstable_now() - T < $);
  }
  function W() {
    if (N !== null) {
      var _ = e.unstable_now();
      T = _;
      var M = !0;
      try {
        M = N(!0, _);
      } finally {
        M ? Pe() : ((R = !1), (N = null));
      }
    } else R = !1;
  }
  var Pe;
  if (typeof p == "function")
    Pe = function () {
      p(W);
    };
  else if (typeof MessageChannel < "u") {
    var I = new MessageChannel(),
      O = I.port2;
    (I.port1.onmessage = W),
      (Pe = function () {
        O.postMessage(null);
      });
  } else
    Pe = function () {
      C(W, 0);
    };
  function V(_) {
    (N = _), R || ((R = !0), Pe());
  }
  function te(_, M) {
    P = C(function () {
      _(e.unstable_now());
    }, M);
  }
  (e.unstable_IdlePriority = 5),
    (e.unstable_ImmediatePriority = 1),
    (e.unstable_LowPriority = 4),
    (e.unstable_NormalPriority = 3),
    (e.unstable_Profiling = null),
    (e.unstable_UserBlockingPriority = 2),
    (e.unstable_cancelCallback = function (_) {
      _.callback = null;
    }),
    (e.unstable_continueExecution = function () {
      k || w || ((k = !0), V(S));
    }),
    (e.unstable_forceFrameRate = function (_) {
      0 > _ || 125 < _
        ? console.error(
            "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
          )
        : ($ = 0 < _ ? Math.floor(1e3 / _) : 5);
    }),
    (e.unstable_getCurrentPriorityLevel = function () {
      return g;
    }),
    (e.unstable_getFirstCallbackNode = function () {
      return n(u);
    }),
    (e.unstable_next = function (_) {
      switch (g) {
        case 1:
        case 2:
        case 3:
          var M = 3;
          break;
        default:
          M = g;
      }
      var z = g;
      g = M;
      try {
        return _();
      } finally {
        g = z;
      }
    }),
    (e.unstable_pauseExecution = function () {}),
    (e.unstable_requestPaint = function () {}),
    (e.unstable_runWithPriority = function (_, M) {
      switch (_) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          _ = 3;
      }
      var z = g;
      g = _;
      try {
        return M();
      } finally {
        g = z;
      }
    }),
    (e.unstable_scheduleCallback = function (_, M, z) {
      var F = e.unstable_now();
      switch (
        (typeof z == "object" && z !== null
          ? ((z = z.delay), (z = typeof z == "number" && 0 < z ? F + z : F))
          : (z = F),
        _)
      ) {
        case 1:
          var K = -1;
          break;
        case 2:
          K = 250;
          break;
        case 5:
          K = 1073741823;
          break;
        case 4:
          K = 1e4;
          break;
        default:
          K = 5e3;
      }
      return (
        (K = z + K),
        (_ = {
          id: d++,
          callback: M,
          priorityLevel: _,
          startTime: z,
          expirationTime: K,
          sortIndex: -1,
        }),
        z > F
          ? ((_.sortIndex = z),
            t(c, _),
            n(u) === null &&
              _ === n(c) &&
              (x ? (m(P), (P = -1)) : (x = !0), te(j, z - F)))
          : ((_.sortIndex = K), t(u, _), k || w || ((k = !0), V(S))),
        _
      );
    }),
    (e.unstable_shouldYield = D),
    (e.unstable_wrapCallback = function (_) {
      var M = g;
      return function () {
        var z = g;
        g = M;
        try {
          return _.apply(this, arguments);
        } finally {
          g = z;
        }
      };
    });
})(mu);
hu.exports = mu;
var xf = hu.exports;
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var jf = y,
  Ie = xf;
function E(e) {
  for (
    var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, n = 1;
    n < arguments.length;
    n++
  )
    t += "&args[]=" + encodeURIComponent(arguments[n]);
  return (
    "Minified React error #" +
    e +
    "; visit " +
    t +
    " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
  );
}
var gu = new Set(),
  nr = {};
function Xt(e, t) {
  kn(e, t), kn(e + "Capture", t);
}
function kn(e, t) {
  for (nr[e] = t, e = 0; e < t.length; e++) gu.add(t[e]);
}
var at = !(
    typeof window > "u" ||
    typeof window.document > "u" ||
    typeof window.document.createElement > "u"
  ),
  Rl = Object.prototype.hasOwnProperty,
  wf =
    /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,
  Uo = {},
  $o = {};
function kf(e) {
  return Rl.call($o, e)
    ? !0
    : Rl.call(Uo, e)
    ? !1
    : wf.test(e)
    ? ($o[e] = !0)
    : ((Uo[e] = !0), !1);
}
function Nf(e, t, n, r) {
  if (n !== null && n.type === 0) return !1;
  switch (typeof t) {
    case "function":
    case "symbol":
      return !0;
    case "boolean":
      return r
        ? !1
        : n !== null
        ? !n.acceptsBooleans
        : ((e = e.toLowerCase().slice(0, 5)), e !== "data-" && e !== "aria-");
    default:
      return !1;
  }
}
function Sf(e, t, n, r) {
  if (t === null || typeof t > "u" || Nf(e, t, n, r)) return !0;
  if (r) return !1;
  if (n !== null)
    switch (n.type) {
      case 3:
        return !t;
      case 4:
        return t === !1;
      case 5:
        return isNaN(t);
      case 6:
        return isNaN(t) || 1 > t;
    }
  return !1;
}
function je(e, t, n, r, s, i, o) {
  (this.acceptsBooleans = t === 2 || t === 3 || t === 4),
    (this.attributeName = r),
    (this.attributeNamespace = s),
    (this.mustUseProperty = n),
    (this.propertyName = e),
    (this.type = t),
    (this.sanitizeURL = i),
    (this.removeEmptyString = o);
}
var fe = {};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style"
  .split(" ")
  .forEach(function (e) {
    fe[e] = new je(e, 0, !1, e, null, !1, !1);
  });
[
  ["acceptCharset", "accept-charset"],
  ["className", "class"],
  ["htmlFor", "for"],
  ["httpEquiv", "http-equiv"],
].forEach(function (e) {
  var t = e[0];
  fe[t] = new je(t, 1, !1, e[1], null, !1, !1);
});
["contentEditable", "draggable", "spellCheck", "value"].forEach(function (e) {
  fe[e] = new je(e, 2, !1, e.toLowerCase(), null, !1, !1);
});
[
  "autoReverse",
  "externalResourcesRequired",
  "focusable",
  "preserveAlpha",
].forEach(function (e) {
  fe[e] = new je(e, 2, !1, e, null, !1, !1);
});
"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope"
  .split(" ")
  .forEach(function (e) {
    fe[e] = new je(e, 3, !1, e.toLowerCase(), null, !1, !1);
  });
["checked", "multiple", "muted", "selected"].forEach(function (e) {
  fe[e] = new je(e, 3, !0, e, null, !1, !1);
});
["capture", "download"].forEach(function (e) {
  fe[e] = new je(e, 4, !1, e, null, !1, !1);
});
["cols", "rows", "size", "span"].forEach(function (e) {
  fe[e] = new je(e, 6, !1, e, null, !1, !1);
});
["rowSpan", "start"].forEach(function (e) {
  fe[e] = new je(e, 5, !1, e.toLowerCase(), null, !1, !1);
});
var _i = /[\-:]([a-z])/g;
function Ri(e) {
  return e[1].toUpperCase();
}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height"
  .split(" ")
  .forEach(function (e) {
    var t = e.replace(_i, Ri);
    fe[t] = new je(t, 1, !1, e, null, !1, !1);
  });
"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type"
  .split(" ")
  .forEach(function (e) {
    var t = e.replace(_i, Ri);
    fe[t] = new je(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
  });
["xml:base", "xml:lang", "xml:space"].forEach(function (e) {
  var t = e.replace(_i, Ri);
  fe[t] = new je(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
});
["tabIndex", "crossOrigin"].forEach(function (e) {
  fe[e] = new je(e, 1, !1, e.toLowerCase(), null, !1, !1);
});
fe.xlinkHref = new je(
  "xlinkHref",
  1,
  !1,
  "xlink:href",
  "http://www.w3.org/1999/xlink",
  !0,
  !1
);
["src", "href", "action", "formAction"].forEach(function (e) {
  fe[e] = new je(e, 1, !1, e.toLowerCase(), null, !0, !0);
});
function Ti(e, t, n, r) {
  var s = fe.hasOwnProperty(t) ? fe[t] : null;
  (s !== null
    ? s.type !== 0
    : r ||
      !(2 < t.length) ||
      (t[0] !== "o" && t[0] !== "O") ||
      (t[1] !== "n" && t[1] !== "N")) &&
    (Sf(t, n, s, r) && (n = null),
    r || s === null
      ? kf(t) && (n === null ? e.removeAttribute(t) : e.setAttribute(t, "" + n))
      : s.mustUseProperty
      ? (e[s.propertyName] = n === null ? (s.type === 3 ? !1 : "") : n)
      : ((t = s.attributeName),
        (r = s.attributeNamespace),
        n === null
          ? e.removeAttribute(t)
          : ((s = s.type),
            (n = s === 3 || (s === 4 && n === !0) ? "" : "" + n),
            r ? e.setAttributeNS(r, t, n) : e.setAttribute(t, n))));
}
var ft = jf.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
  Tr = Symbol.for("react.element"),
  nn = Symbol.for("react.portal"),
  rn = Symbol.for("react.fragment"),
  Li = Symbol.for("react.strict_mode"),
  Tl = Symbol.for("react.profiler"),
  vu = Symbol.for("react.provider"),
  yu = Symbol.for("react.context"),
  Ii = Symbol.for("react.forward_ref"),
  Ll = Symbol.for("react.suspense"),
  Il = Symbol.for("react.suspense_list"),
  Mi = Symbol.for("react.memo"),
  ht = Symbol.for("react.lazy"),
  xu = Symbol.for("react.offscreen"),
  Ao = Symbol.iterator;
function zn(e) {
  return e === null || typeof e != "object"
    ? null
    : ((e = (Ao && e[Ao]) || e["@@iterator"]),
      typeof e == "function" ? e : null);
}
var ee = Object.assign,
  tl;
function Bn(e) {
  if (tl === void 0)
    try {
      throw Error();
    } catch (n) {
      var t = n.stack.trim().match(/\n( *(at )?)/);
      tl = (t && t[1]) || "";
    }
  return (
    `
` +
    tl +
    e
  );
}
var nl = !1;
function rl(e, t) {
  if (!e || nl) return "";
  nl = !0;
  var n = Error.prepareStackTrace;
  Error.prepareStackTrace = void 0;
  try {
    if (t)
      if (
        ((t = function () {
          throw Error();
        }),
        Object.defineProperty(t.prototype, "props", {
          set: function () {
            throw Error();
          },
        }),
        typeof Reflect == "object" && Reflect.construct)
      ) {
        try {
          Reflect.construct(t, []);
        } catch (c) {
          var r = c;
        }
        Reflect.construct(e, [], t);
      } else {
        try {
          t.call();
        } catch (c) {
          r = c;
        }
        e.call(t.prototype);
      }
    else {
      try {
        throw Error();
      } catch (c) {
        r = c;
      }
      e();
    }
  } catch (c) {
    if (c && r && typeof c.stack == "string") {
      for (
        var s = c.stack.split(`
`),
          i = r.stack.split(`
`),
          o = s.length - 1,
          a = i.length - 1;
        1 <= o && 0 <= a && s[o] !== i[a];

      )
        a--;
      for (; 1 <= o && 0 <= a; o--, a--)
        if (s[o] !== i[a]) {
          if (o !== 1 || a !== 1)
            do
              if ((o--, a--, 0 > a || s[o] !== i[a])) {
                var u =
                  `
` + s[o].replace(" at new ", " at ");
                return (
                  e.displayName &&
                    u.includes("<anonymous>") &&
                    (u = u.replace("<anonymous>", e.displayName)),
                  u
                );
              }
            while (1 <= o && 0 <= a);
          break;
        }
    }
  } finally {
    (nl = !1), (Error.prepareStackTrace = n);
  }
  return (e = e ? e.displayName || e.name : "") ? Bn(e) : "";
}
function Cf(e) {
  switch (e.tag) {
    case 5:
      return Bn(e.type);
    case 16:
      return Bn("Lazy");
    case 13:
      return Bn("Suspense");
    case 19:
      return Bn("SuspenseList");
    case 0:
    case 2:
    case 15:
      return (e = rl(e.type, !1)), e;
    case 11:
      return (e = rl(e.type.render, !1)), e;
    case 1:
      return (e = rl(e.type, !0)), e;
    default:
      return "";
  }
}
function Ml(e) {
  if (e == null) return null;
  if (typeof e == "function") return e.displayName || e.name || null;
  if (typeof e == "string") return e;
  switch (e) {
    case rn:
      return "Fragment";
    case nn:
      return "Portal";
    case Tl:
      return "Profiler";
    case Li:
      return "StrictMode";
    case Ll:
      return "Suspense";
    case Il:
      return "SuspenseList";
  }
  if (typeof e == "object")
    switch (e.$$typeof) {
      case yu:
        return (e.displayName || "Context") + ".Consumer";
      case vu:
        return (e._context.displayName || "Context") + ".Provider";
      case Ii:
        var t = e.render;
        return (
          (e = e.displayName),
          e ||
            ((e = t.displayName || t.name || ""),
            (e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef")),
          e
        );
      case Mi:
        return (
          (t = e.displayName || null), t !== null ? t : Ml(e.type) || "Memo"
        );
      case ht:
        (t = e._payload), (e = e._init);
        try {
          return Ml(e(t));
        } catch {}
    }
  return null;
}
function Ef(e) {
  var t = e.type;
  switch (e.tag) {
    case 24:
      return "Cache";
    case 9:
      return (t.displayName || "Context") + ".Consumer";
    case 10:
      return (t._context.displayName || "Context") + ".Provider";
    case 18:
      return "DehydratedFragment";
    case 11:
      return (
        (e = t.render),
        (e = e.displayName || e.name || ""),
        t.displayName || (e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef")
      );
    case 7:
      return "Fragment";
    case 5:
      return t;
    case 4:
      return "Portal";
    case 3:
      return "Root";
    case 6:
      return "Text";
    case 16:
      return Ml(t);
    case 8:
      return t === Li ? "StrictMode" : "Mode";
    case 22:
      return "Offscreen";
    case 12:
      return "Profiler";
    case 21:
      return "Scope";
    case 13:
      return "Suspense";
    case 19:
      return "SuspenseList";
    case 25:
      return "TracingMarker";
    case 1:
    case 0:
    case 17:
    case 2:
    case 14:
    case 15:
      if (typeof t == "function") return t.displayName || t.name || null;
      if (typeof t == "string") return t;
  }
  return null;
}
function Lt(e) {
  switch (typeof e) {
    case "boolean":
    case "number":
    case "string":
    case "undefined":
      return e;
    case "object":
      return e;
    default:
      return "";
  }
}
function ju(e) {
  var t = e.type;
  return (
    (e = e.nodeName) &&
    e.toLowerCase() === "input" &&
    (t === "checkbox" || t === "radio")
  );
}
function Pf(e) {
  var t = ju(e) ? "checked" : "value",
    n = Object.getOwnPropertyDescriptor(e.constructor.prototype, t),
    r = "" + e[t];
  if (
    !e.hasOwnProperty(t) &&
    typeof n < "u" &&
    typeof n.get == "function" &&
    typeof n.set == "function"
  ) {
    var s = n.get,
      i = n.set;
    return (
      Object.defineProperty(e, t, {
        configurable: !0,
        get: function () {
          return s.call(this);
        },
        set: function (o) {
          (r = "" + o), i.call(this, o);
        },
      }),
      Object.defineProperty(e, t, { enumerable: n.enumerable }),
      {
        getValue: function () {
          return r;
        },
        setValue: function (o) {
          r = "" + o;
        },
        stopTracking: function () {
          (e._valueTracker = null), delete e[t];
        },
      }
    );
  }
}
function Lr(e) {
  e._valueTracker || (e._valueTracker = Pf(e));
}
function wu(e) {
  if (!e) return !1;
  var t = e._valueTracker;
  if (!t) return !0;
  var n = t.getValue(),
    r = "";
  return (
    e && (r = ju(e) ? (e.checked ? "true" : "false") : e.value),
    (e = r),
    e !== n ? (t.setValue(e), !0) : !1
  );
}
function ls(e) {
  if (((e = e || (typeof document < "u" ? document : void 0)), typeof e > "u"))
    return null;
  try {
    return e.activeElement || e.body;
  } catch {
    return e.body;
  }
}
function zl(e, t) {
  var n = t.checked;
  return ee({}, t, {
    defaultChecked: void 0,
    defaultValue: void 0,
    value: void 0,
    checked: n ?? e._wrapperState.initialChecked,
  });
}
function Fo(e, t) {
  var n = t.defaultValue == null ? "" : t.defaultValue,
    r = t.checked != null ? t.checked : t.defaultChecked;
  (n = Lt(t.value != null ? t.value : n)),
    (e._wrapperState = {
      initialChecked: r,
      initialValue: n,
      controlled:
        t.type === "checkbox" || t.type === "radio"
          ? t.checked != null
          : t.value != null,
    });
}
function ku(e, t) {
  (t = t.checked), t != null && Ti(e, "checked", t, !1);
}
function Ol(e, t) {
  ku(e, t);
  var n = Lt(t.value),
    r = t.type;
  if (n != null)
    r === "number"
      ? ((n === 0 && e.value === "") || e.value != n) && (e.value = "" + n)
      : e.value !== "" + n && (e.value = "" + n);
  else if (r === "submit" || r === "reset") {
    e.removeAttribute("value");
    return;
  }
  t.hasOwnProperty("value")
    ? Dl(e, t.type, n)
    : t.hasOwnProperty("defaultValue") && Dl(e, t.type, Lt(t.defaultValue)),
    t.checked == null &&
      t.defaultChecked != null &&
      (e.defaultChecked = !!t.defaultChecked);
}
function Bo(e, t, n) {
  if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
    var r = t.type;
    if (
      !(
        (r !== "submit" && r !== "reset") ||
        (t.value !== void 0 && t.value !== null)
      )
    )
      return;
    (t = "" + e._wrapperState.initialValue),
      n || t === e.value || (e.value = t),
      (e.defaultValue = t);
  }
  (n = e.name),
    n !== "" && (e.name = ""),
    (e.defaultChecked = !!e._wrapperState.initialChecked),
    n !== "" && (e.name = n);
}
function Dl(e, t, n) {
  (t !== "number" || ls(e.ownerDocument) !== e) &&
    (n == null
      ? (e.defaultValue = "" + e._wrapperState.initialValue)
      : e.defaultValue !== "" + n && (e.defaultValue = "" + n));
}
var Vn = Array.isArray;
function gn(e, t, n, r) {
  if (((e = e.options), t)) {
    t = {};
    for (var s = 0; s < n.length; s++) t["$" + n[s]] = !0;
    for (n = 0; n < e.length; n++)
      (s = t.hasOwnProperty("$" + e[n].value)),
        e[n].selected !== s && (e[n].selected = s),
        s && r && (e[n].defaultSelected = !0);
  } else {
    for (n = "" + Lt(n), t = null, s = 0; s < e.length; s++) {
      if (e[s].value === n) {
        (e[s].selected = !0), r && (e[s].defaultSelected = !0);
        return;
      }
      t !== null || e[s].disabled || (t = e[s]);
    }
    t !== null && (t.selected = !0);
  }
}
function bl(e, t) {
  if (t.dangerouslySetInnerHTML != null) throw Error(E(91));
  return ee({}, t, {
    value: void 0,
    defaultValue: void 0,
    children: "" + e._wrapperState.initialValue,
  });
}
function Vo(e, t) {
  var n = t.value;
  if (n == null) {
    if (((n = t.children), (t = t.defaultValue), n != null)) {
      if (t != null) throw Error(E(92));
      if (Vn(n)) {
        if (1 < n.length) throw Error(E(93));
        n = n[0];
      }
      t = n;
    }
    t == null && (t = ""), (n = t);
  }
  e._wrapperState = { initialValue: Lt(n) };
}
function Nu(e, t) {
  var n = Lt(t.value),
    r = Lt(t.defaultValue);
  n != null &&
    ((n = "" + n),
    n !== e.value && (e.value = n),
    t.defaultValue == null && e.defaultValue !== n && (e.defaultValue = n)),
    r != null && (e.defaultValue = "" + r);
}
function Ho(e) {
  var t = e.textContent;
  t === e._wrapperState.initialValue && t !== "" && t !== null && (e.value = t);
}
function Su(e) {
  switch (e) {
    case "svg":
      return "http://www.w3.org/2000/svg";
    case "math":
      return "http://www.w3.org/1998/Math/MathML";
    default:
      return "http://www.w3.org/1999/xhtml";
  }
}
function Ul(e, t) {
  return e == null || e === "http://www.w3.org/1999/xhtml"
    ? Su(t)
    : e === "http://www.w3.org/2000/svg" && t === "foreignObject"
    ? "http://www.w3.org/1999/xhtml"
    : e;
}
var Ir,
  Cu = (function (e) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction
      ? function (t, n, r, s) {
          MSApp.execUnsafeLocalFunction(function () {
            return e(t, n, r, s);
          });
        }
      : e;
  })(function (e, t) {
    if (e.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in e)
      e.innerHTML = t;
    else {
      for (
        Ir = Ir || document.createElement("div"),
          Ir.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>",
          t = Ir.firstChild;
        e.firstChild;

      )
        e.removeChild(e.firstChild);
      for (; t.firstChild; ) e.appendChild(t.firstChild);
    }
  });
function rr(e, t) {
  if (t) {
    var n = e.firstChild;
    if (n && n === e.lastChild && n.nodeType === 3) {
      n.nodeValue = t;
      return;
    }
  }
  e.textContent = t;
}
var qn = {
    animationIterationCount: !0,
    aspectRatio: !0,
    borderImageOutset: !0,
    borderImageSlice: !0,
    borderImageWidth: !0,
    boxFlex: !0,
    boxFlexGroup: !0,
    boxOrdinalGroup: !0,
    columnCount: !0,
    columns: !0,
    flex: !0,
    flexGrow: !0,
    flexPositive: !0,
    flexShrink: !0,
    flexNegative: !0,
    flexOrder: !0,
    gridArea: !0,
    gridRow: !0,
    gridRowEnd: !0,
    gridRowSpan: !0,
    gridRowStart: !0,
    gridColumn: !0,
    gridColumnEnd: !0,
    gridColumnSpan: !0,
    gridColumnStart: !0,
    fontWeight: !0,
    lineClamp: !0,
    lineHeight: !0,
    opacity: !0,
    order: !0,
    orphans: !0,
    tabSize: !0,
    widows: !0,
    zIndex: !0,
    zoom: !0,
    fillOpacity: !0,
    floodOpacity: !0,
    stopOpacity: !0,
    strokeDasharray: !0,
    strokeDashoffset: !0,
    strokeMiterlimit: !0,
    strokeOpacity: !0,
    strokeWidth: !0,
  },
  _f = ["Webkit", "ms", "Moz", "O"];
Object.keys(qn).forEach(function (e) {
  _f.forEach(function (t) {
    (t = t + e.charAt(0).toUpperCase() + e.substring(1)), (qn[t] = qn[e]);
  });
});
function Eu(e, t, n) {
  return t == null || typeof t == "boolean" || t === ""
    ? ""
    : n || typeof t != "number" || t === 0 || (qn.hasOwnProperty(e) && qn[e])
    ? ("" + t).trim()
    : t + "px";
}
function Pu(e, t) {
  e = e.style;
  for (var n in t)
    if (t.hasOwnProperty(n)) {
      var r = n.indexOf("--") === 0,
        s = Eu(n, t[n], r);
      n === "float" && (n = "cssFloat"), r ? e.setProperty(n, s) : (e[n] = s);
    }
}
var Rf = ee(
  { menuitem: !0 },
  {
    area: !0,
    base: !0,
    br: !0,
    col: !0,
    embed: !0,
    hr: !0,
    img: !0,
    input: !0,
    keygen: !0,
    link: !0,
    meta: !0,
    param: !0,
    source: !0,
    track: !0,
    wbr: !0,
  }
);
function $l(e, t) {
  if (t) {
    if (Rf[e] && (t.children != null || t.dangerouslySetInnerHTML != null))
      throw Error(E(137, e));
    if (t.dangerouslySetInnerHTML != null) {
      if (t.children != null) throw Error(E(60));
      if (
        typeof t.dangerouslySetInnerHTML != "object" ||
        !("__html" in t.dangerouslySetInnerHTML)
      )
        throw Error(E(61));
    }
    if (t.style != null && typeof t.style != "object") throw Error(E(62));
  }
}
function Al(e, t) {
  if (e.indexOf("-") === -1) return typeof t.is == "string";
  switch (e) {
    case "annotation-xml":
    case "color-profile":
    case "font-face":
    case "font-face-src":
    case "font-face-uri":
    case "font-face-format":
    case "font-face-name":
    case "missing-glyph":
      return !1;
    default:
      return !0;
  }
}
var Fl = null;
function zi(e) {
  return (
    (e = e.target || e.srcElement || window),
    e.correspondingUseElement && (e = e.correspondingUseElement),
    e.nodeType === 3 ? e.parentNode : e
  );
}
var Bl = null,
  vn = null,
  yn = null;
function Wo(e) {
  if ((e = Sr(e))) {
    if (typeof Bl != "function") throw Error(E(280));
    var t = e.stateNode;
    t && ((t = $s(t)), Bl(e.stateNode, e.type, t));
  }
}
function _u(e) {
  vn ? (yn ? yn.push(e) : (yn = [e])) : (vn = e);
}
function Ru() {
  if (vn) {
    var e = vn,
      t = yn;
    if (((yn = vn = null), Wo(e), t)) for (e = 0; e < t.length; e++) Wo(t[e]);
  }
}
function Tu(e, t) {
  return e(t);
}
function Lu() {}
var sl = !1;
function Iu(e, t, n) {
  if (sl) return e(t, n);
  sl = !0;
  try {
    return Tu(e, t, n);
  } finally {
    (sl = !1), (vn !== null || yn !== null) && (Lu(), Ru());
  }
}
function sr(e, t) {
  var n = e.stateNode;
  if (n === null) return null;
  var r = $s(n);
  if (r === null) return null;
  n = r[t];
  e: switch (t) {
    case "onClick":
    case "onClickCapture":
    case "onDoubleClick":
    case "onDoubleClickCapture":
    case "onMouseDown":
    case "onMouseDownCapture":
    case "onMouseMove":
    case "onMouseMoveCapture":
    case "onMouseUp":
    case "onMouseUpCapture":
    case "onMouseEnter":
      (r = !r.disabled) ||
        ((e = e.type),
        (r = !(
          e === "button" ||
          e === "input" ||
          e === "select" ||
          e === "textarea"
        ))),
        (e = !r);
      break e;
    default:
      e = !1;
  }
  if (e) return null;
  if (n && typeof n != "function") throw Error(E(231, t, typeof n));
  return n;
}
var Vl = !1;
if (at)
  try {
    var On = {};
    Object.defineProperty(On, "passive", {
      get: function () {
        Vl = !0;
      },
    }),
      window.addEventListener("test", On, On),
      window.removeEventListener("test", On, On);
  } catch {
    Vl = !1;
  }
function Tf(e, t, n, r, s, i, o, a, u) {
  var c = Array.prototype.slice.call(arguments, 3);
  try {
    t.apply(n, c);
  } catch (d) {
    this.onError(d);
  }
}
var Qn = !1,
  is = null,
  os = !1,
  Hl = null,
  Lf = {
    onError: function (e) {
      (Qn = !0), (is = e);
    },
  };
function If(e, t, n, r, s, i, o, a, u) {
  (Qn = !1), (is = null), Tf.apply(Lf, arguments);
}
function Mf(e, t, n, r, s, i, o, a, u) {
  if ((If.apply(this, arguments), Qn)) {
    if (Qn) {
      var c = is;
      (Qn = !1), (is = null);
    } else throw Error(E(198));
    os || ((os = !0), (Hl = c));
  }
}
function Jt(e) {
  var t = e,
    n = e;
  if (e.alternate) for (; t.return; ) t = t.return;
  else {
    e = t;
    do (t = e), t.flags & 4098 && (n = t.return), (e = t.return);
    while (e);
  }
  return t.tag === 3 ? n : null;
}
function Mu(e) {
  if (e.tag === 13) {
    var t = e.memoizedState;
    if (
      (t === null && ((e = e.alternate), e !== null && (t = e.memoizedState)),
      t !== null)
    )
      return t.dehydrated;
  }
  return null;
}
function qo(e) {
  if (Jt(e) !== e) throw Error(E(188));
}
function zf(e) {
  var t = e.alternate;
  if (!t) {
    if (((t = Jt(e)), t === null)) throw Error(E(188));
    return t !== e ? null : e;
  }
  for (var n = e, r = t; ; ) {
    var s = n.return;
    if (s === null) break;
    var i = s.alternate;
    if (i === null) {
      if (((r = s.return), r !== null)) {
        n = r;
        continue;
      }
      break;
    }
    if (s.child === i.child) {
      for (i = s.child; i; ) {
        if (i === n) return qo(s), e;
        if (i === r) return qo(s), t;
        i = i.sibling;
      }
      throw Error(E(188));
    }
    if (n.return !== r.return) (n = s), (r = i);
    else {
      for (var o = !1, a = s.child; a; ) {
        if (a === n) {
          (o = !0), (n = s), (r = i);
          break;
        }
        if (a === r) {
          (o = !0), (r = s), (n = i);
          break;
        }
        a = a.sibling;
      }
      if (!o) {
        for (a = i.child; a; ) {
          if (a === n) {
            (o = !0), (n = i), (r = s);
            break;
          }
          if (a === r) {
            (o = !0), (r = i), (n = s);
            break;
          }
          a = a.sibling;
        }
        if (!o) throw Error(E(189));
      }
    }
    if (n.alternate !== r) throw Error(E(190));
  }
  if (n.tag !== 3) throw Error(E(188));
  return n.stateNode.current === n ? e : t;
}
function zu(e) {
  return (e = zf(e)), e !== null ? Ou(e) : null;
}
function Ou(e) {
  if (e.tag === 5 || e.tag === 6) return e;
  for (e = e.child; e !== null; ) {
    var t = Ou(e);
    if (t !== null) return t;
    e = e.sibling;
  }
  return null;
}
var Du = Ie.unstable_scheduleCallback,
  Qo = Ie.unstable_cancelCallback,
  Of = Ie.unstable_shouldYield,
  Df = Ie.unstable_requestPaint,
  re = Ie.unstable_now,
  bf = Ie.unstable_getCurrentPriorityLevel,
  Oi = Ie.unstable_ImmediatePriority,
  bu = Ie.unstable_UserBlockingPriority,
  as = Ie.unstable_NormalPriority,
  Uf = Ie.unstable_LowPriority,
  Uu = Ie.unstable_IdlePriority,
  Os = null,
  Ze = null;
function $f(e) {
  if (Ze && typeof Ze.onCommitFiberRoot == "function")
    try {
      Ze.onCommitFiberRoot(Os, e, void 0, (e.current.flags & 128) === 128);
    } catch {}
}
var Qe = Math.clz32 ? Math.clz32 : Bf,
  Af = Math.log,
  Ff = Math.LN2;
function Bf(e) {
  return (e >>>= 0), e === 0 ? 32 : (31 - ((Af(e) / Ff) | 0)) | 0;
}
var Mr = 64,
  zr = 4194304;
function Hn(e) {
  switch (e & -e) {
    case 1:
      return 1;
    case 2:
      return 2;
    case 4:
      return 4;
    case 8:
      return 8;
    case 16:
      return 16;
    case 32:
      return 32;
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return e & 4194240;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return e & 130023424;
    case 134217728:
      return 134217728;
    case 268435456:
      return 268435456;
    case 536870912:
      return 536870912;
    case 1073741824:
      return 1073741824;
    default:
      return e;
  }
}
function us(e, t) {
  var n = e.pendingLanes;
  if (n === 0) return 0;
  var r = 0,
    s = e.suspendedLanes,
    i = e.pingedLanes,
    o = n & 268435455;
  if (o !== 0) {
    var a = o & ~s;
    a !== 0 ? (r = Hn(a)) : ((i &= o), i !== 0 && (r = Hn(i)));
  } else (o = n & ~s), o !== 0 ? (r = Hn(o)) : i !== 0 && (r = Hn(i));
  if (r === 0) return 0;
  if (
    t !== 0 &&
    t !== r &&
    !(t & s) &&
    ((s = r & -r), (i = t & -t), s >= i || (s === 16 && (i & 4194240) !== 0))
  )
    return t;
  if ((r & 4 && (r |= n & 16), (t = e.entangledLanes), t !== 0))
    for (e = e.entanglements, t &= r; 0 < t; )
      (n = 31 - Qe(t)), (s = 1 << n), (r |= e[n]), (t &= ~s);
  return r;
}
function Vf(e, t) {
  switch (e) {
    case 1:
    case 2:
    case 4:
      return t + 250;
    case 8:
    case 16:
    case 32:
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return t + 5e3;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return -1;
    case 134217728:
    case 268435456:
    case 536870912:
    case 1073741824:
      return -1;
    default:
      return -1;
  }
}
function Hf(e, t) {
  for (
    var n = e.suspendedLanes,
      r = e.pingedLanes,
      s = e.expirationTimes,
      i = e.pendingLanes;
    0 < i;

  ) {
    var o = 31 - Qe(i),
      a = 1 << o,
      u = s[o];
    u === -1
      ? (!(a & n) || a & r) && (s[o] = Vf(a, t))
      : u <= t && (e.expiredLanes |= a),
      (i &= ~a);
  }
}
function Wl(e) {
  return (
    (e = e.pendingLanes & -1073741825),
    e !== 0 ? e : e & 1073741824 ? 1073741824 : 0
  );
}
function $u() {
  var e = Mr;
  return (Mr <<= 1), !(Mr & 4194240) && (Mr = 64), e;
}
function ll(e) {
  for (var t = [], n = 0; 31 > n; n++) t.push(e);
  return t;
}
function kr(e, t, n) {
  (e.pendingLanes |= t),
    t !== 536870912 && ((e.suspendedLanes = 0), (e.pingedLanes = 0)),
    (e = e.eventTimes),
    (t = 31 - Qe(t)),
    (e[t] = n);
}
function Wf(e, t) {
  var n = e.pendingLanes & ~t;
  (e.pendingLanes = t),
    (e.suspendedLanes = 0),
    (e.pingedLanes = 0),
    (e.expiredLanes &= t),
    (e.mutableReadLanes &= t),
    (e.entangledLanes &= t),
    (t = e.entanglements);
  var r = e.eventTimes;
  for (e = e.expirationTimes; 0 < n; ) {
    var s = 31 - Qe(n),
      i = 1 << s;
    (t[s] = 0), (r[s] = -1), (e[s] = -1), (n &= ~i);
  }
}
function Di(e, t) {
  var n = (e.entangledLanes |= t);
  for (e = e.entanglements; n; ) {
    var r = 31 - Qe(n),
      s = 1 << r;
    (s & t) | (e[r] & t) && (e[r] |= t), (n &= ~s);
  }
}
var H = 0;
function Au(e) {
  return (e &= -e), 1 < e ? (4 < e ? (e & 268435455 ? 16 : 536870912) : 4) : 1;
}
var Fu,
  bi,
  Bu,
  Vu,
  Hu,
  ql = !1,
  Or = [],
  kt = null,
  Nt = null,
  St = null,
  lr = new Map(),
  ir = new Map(),
  gt = [],
  qf =
    "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(
      " "
    );
function Ko(e, t) {
  switch (e) {
    case "focusin":
    case "focusout":
      kt = null;
      break;
    case "dragenter":
    case "dragleave":
      Nt = null;
      break;
    case "mouseover":
    case "mouseout":
      St = null;
      break;
    case "pointerover":
    case "pointerout":
      lr.delete(t.pointerId);
      break;
    case "gotpointercapture":
    case "lostpointercapture":
      ir.delete(t.pointerId);
  }
}
function Dn(e, t, n, r, s, i) {
  return e === null || e.nativeEvent !== i
    ? ((e = {
        blockedOn: t,
        domEventName: n,
        eventSystemFlags: r,
        nativeEvent: i,
        targetContainers: [s],
      }),
      t !== null && ((t = Sr(t)), t !== null && bi(t)),
      e)
    : ((e.eventSystemFlags |= r),
      (t = e.targetContainers),
      s !== null && t.indexOf(s) === -1 && t.push(s),
      e);
}
function Qf(e, t, n, r, s) {
  switch (t) {
    case "focusin":
      return (kt = Dn(kt, e, t, n, r, s)), !0;
    case "dragenter":
      return (Nt = Dn(Nt, e, t, n, r, s)), !0;
    case "mouseover":
      return (St = Dn(St, e, t, n, r, s)), !0;
    case "pointerover":
      var i = s.pointerId;
      return lr.set(i, Dn(lr.get(i) || null, e, t, n, r, s)), !0;
    case "gotpointercapture":
      return (
        (i = s.pointerId), ir.set(i, Dn(ir.get(i) || null, e, t, n, r, s)), !0
      );
  }
  return !1;
}
function Wu(e) {
  var t = At(e.target);
  if (t !== null) {
    var n = Jt(t);
    if (n !== null) {
      if (((t = n.tag), t === 13)) {
        if (((t = Mu(n)), t !== null)) {
          (e.blockedOn = t),
            Hu(e.priority, function () {
              Bu(n);
            });
          return;
        }
      } else if (t === 3 && n.stateNode.current.memoizedState.isDehydrated) {
        e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
        return;
      }
    }
  }
  e.blockedOn = null;
}
function Gr(e) {
  if (e.blockedOn !== null) return !1;
  for (var t = e.targetContainers; 0 < t.length; ) {
    var n = Ql(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
    if (n === null) {
      n = e.nativeEvent;
      var r = new n.constructor(n.type, n);
      (Fl = r), n.target.dispatchEvent(r), (Fl = null);
    } else return (t = Sr(n)), t !== null && bi(t), (e.blockedOn = n), !1;
    t.shift();
  }
  return !0;
}
function Go(e, t, n) {
  Gr(e) && n.delete(t);
}
function Kf() {
  (ql = !1),
    kt !== null && Gr(kt) && (kt = null),
    Nt !== null && Gr(Nt) && (Nt = null),
    St !== null && Gr(St) && (St = null),
    lr.forEach(Go),
    ir.forEach(Go);
}
function bn(e, t) {
  e.blockedOn === t &&
    ((e.blockedOn = null),
    ql ||
      ((ql = !0),
      Ie.unstable_scheduleCallback(Ie.unstable_NormalPriority, Kf)));
}
function or(e) {
  function t(s) {
    return bn(s, e);
  }
  if (0 < Or.length) {
    bn(Or[0], e);
    for (var n = 1; n < Or.length; n++) {
      var r = Or[n];
      r.blockedOn === e && (r.blockedOn = null);
    }
  }
  for (
    kt !== null && bn(kt, e),
      Nt !== null && bn(Nt, e),
      St !== null && bn(St, e),
      lr.forEach(t),
      ir.forEach(t),
      n = 0;
    n < gt.length;
    n++
  )
    (r = gt[n]), r.blockedOn === e && (r.blockedOn = null);
  for (; 0 < gt.length && ((n = gt[0]), n.blockedOn === null); )
    Wu(n), n.blockedOn === null && gt.shift();
}
var xn = ft.ReactCurrentBatchConfig,
  cs = !0;
function Gf(e, t, n, r) {
  var s = H,
    i = xn.transition;
  xn.transition = null;
  try {
    (H = 1), Ui(e, t, n, r);
  } finally {
    (H = s), (xn.transition = i);
  }
}
function Yf(e, t, n, r) {
  var s = H,
    i = xn.transition;
  xn.transition = null;
  try {
    (H = 4), Ui(e, t, n, r);
  } finally {
    (H = s), (xn.transition = i);
  }
}
function Ui(e, t, n, r) {
  if (cs) {
    var s = Ql(e, t, n, r);
    if (s === null) ml(e, t, r, ds, n), Ko(e, r);
    else if (Qf(s, e, t, n, r)) r.stopPropagation();
    else if ((Ko(e, r), t & 4 && -1 < qf.indexOf(e))) {
      for (; s !== null; ) {
        var i = Sr(s);
        if (
          (i !== null && Fu(i),
          (i = Ql(e, t, n, r)),
          i === null && ml(e, t, r, ds, n),
          i === s)
        )
          break;
        s = i;
      }
      s !== null && r.stopPropagation();
    } else ml(e, t, r, null, n);
  }
}
var ds = null;
function Ql(e, t, n, r) {
  if (((ds = null), (e = zi(r)), (e = At(e)), e !== null))
    if (((t = Jt(e)), t === null)) e = null;
    else if (((n = t.tag), n === 13)) {
      if (((e = Mu(t)), e !== null)) return e;
      e = null;
    } else if (n === 3) {
      if (t.stateNode.current.memoizedState.isDehydrated)
        return t.tag === 3 ? t.stateNode.containerInfo : null;
      e = null;
    } else t !== e && (e = null);
  return (ds = e), null;
}
function qu(e) {
  switch (e) {
    case "cancel":
    case "click":
    case "close":
    case "contextmenu":
    case "copy":
    case "cut":
    case "auxclick":
    case "dblclick":
    case "dragend":
    case "dragstart":
    case "drop":
    case "focusin":
    case "focusout":
    case "input":
    case "invalid":
    case "keydown":
    case "keypress":
    case "keyup":
    case "mousedown":
    case "mouseup":
    case "paste":
    case "pause":
    case "play":
    case "pointercancel":
    case "pointerdown":
    case "pointerup":
    case "ratechange":
    case "reset":
    case "resize":
    case "seeked":
    case "submit":
    case "touchcancel":
    case "touchend":
    case "touchstart":
    case "volumechange":
    case "change":
    case "selectionchange":
    case "textInput":
    case "compositionstart":
    case "compositionend":
    case "compositionupdate":
    case "beforeblur":
    case "afterblur":
    case "beforeinput":
    case "blur":
    case "fullscreenchange":
    case "focus":
    case "hashchange":
    case "popstate":
    case "select":
    case "selectstart":
      return 1;
    case "drag":
    case "dragenter":
    case "dragexit":
    case "dragleave":
    case "dragover":
    case "mousemove":
    case "mouseout":
    case "mouseover":
    case "pointermove":
    case "pointerout":
    case "pointerover":
    case "scroll":
    case "toggle":
    case "touchmove":
    case "wheel":
    case "mouseenter":
    case "mouseleave":
    case "pointerenter":
    case "pointerleave":
      return 4;
    case "message":
      switch (bf()) {
        case Oi:
          return 1;
        case bu:
          return 4;
        case as:
        case Uf:
          return 16;
        case Uu:
          return 536870912;
        default:
          return 16;
      }
    default:
      return 16;
  }
}
var yt = null,
  $i = null,
  Yr = null;
function Qu() {
  if (Yr) return Yr;
  var e,
    t = $i,
    n = t.length,
    r,
    s = "value" in yt ? yt.value : yt.textContent,
    i = s.length;
  for (e = 0; e < n && t[e] === s[e]; e++);
  var o = n - e;
  for (r = 1; r <= o && t[n - r] === s[i - r]; r++);
  return (Yr = s.slice(e, 1 < r ? 1 - r : void 0));
}
function Xr(e) {
  var t = e.keyCode;
  return (
    "charCode" in e
      ? ((e = e.charCode), e === 0 && t === 13 && (e = 13))
      : (e = t),
    e === 10 && (e = 13),
    32 <= e || e === 13 ? e : 0
  );
}
function Dr() {
  return !0;
}
function Yo() {
  return !1;
}
function ze(e) {
  function t(n, r, s, i, o) {
    (this._reactName = n),
      (this._targetInst = s),
      (this.type = r),
      (this.nativeEvent = i),
      (this.target = o),
      (this.currentTarget = null);
    for (var a in e)
      e.hasOwnProperty(a) && ((n = e[a]), (this[a] = n ? n(i) : i[a]));
    return (
      (this.isDefaultPrevented = (
        i.defaultPrevented != null ? i.defaultPrevented : i.returnValue === !1
      )
        ? Dr
        : Yo),
      (this.isPropagationStopped = Yo),
      this
    );
  }
  return (
    ee(t.prototype, {
      preventDefault: function () {
        this.defaultPrevented = !0;
        var n = this.nativeEvent;
        n &&
          (n.preventDefault
            ? n.preventDefault()
            : typeof n.returnValue != "unknown" && (n.returnValue = !1),
          (this.isDefaultPrevented = Dr));
      },
      stopPropagation: function () {
        var n = this.nativeEvent;
        n &&
          (n.stopPropagation
            ? n.stopPropagation()
            : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0),
          (this.isPropagationStopped = Dr));
      },
      persist: function () {},
      isPersistent: Dr,
    }),
    t
  );
}
var Tn = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function (e) {
      return e.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0,
  },
  Ai = ze(Tn),
  Nr = ee({}, Tn, { view: 0, detail: 0 }),
  Xf = ze(Nr),
  il,
  ol,
  Un,
  Ds = ee({}, Nr, {
    screenX: 0,
    screenY: 0,
    clientX: 0,
    clientY: 0,
    pageX: 0,
    pageY: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    getModifierState: Fi,
    button: 0,
    buttons: 0,
    relatedTarget: function (e) {
      return e.relatedTarget === void 0
        ? e.fromElement === e.srcElement
          ? e.toElement
          : e.fromElement
        : e.relatedTarget;
    },
    movementX: function (e) {
      return "movementX" in e
        ? e.movementX
        : (e !== Un &&
            (Un && e.type === "mousemove"
              ? ((il = e.screenX - Un.screenX), (ol = e.screenY - Un.screenY))
              : (ol = il = 0),
            (Un = e)),
          il);
    },
    movementY: function (e) {
      return "movementY" in e ? e.movementY : ol;
    },
  }),
  Xo = ze(Ds),
  Jf = ee({}, Ds, { dataTransfer: 0 }),
  Zf = ze(Jf),
  ep = ee({}, Nr, { relatedTarget: 0 }),
  al = ze(ep),
  tp = ee({}, Tn, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
  np = ze(tp),
  rp = ee({}, Tn, {
    clipboardData: function (e) {
      return "clipboardData" in e ? e.clipboardData : window.clipboardData;
    },
  }),
  sp = ze(rp),
  lp = ee({}, Tn, { data: 0 }),
  Jo = ze(lp),
  ip = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified",
  },
  op = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta",
  },
  ap = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey",
  };
function up(e) {
  var t = this.nativeEvent;
  return t.getModifierState ? t.getModifierState(e) : (e = ap[e]) ? !!t[e] : !1;
}
function Fi() {
  return up;
}
var cp = ee({}, Nr, {
    key: function (e) {
      if (e.key) {
        var t = ip[e.key] || e.key;
        if (t !== "Unidentified") return t;
      }
      return e.type === "keypress"
        ? ((e = Xr(e)), e === 13 ? "Enter" : String.fromCharCode(e))
        : e.type === "keydown" || e.type === "keyup"
        ? op[e.keyCode] || "Unidentified"
        : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: Fi,
    charCode: function (e) {
      return e.type === "keypress" ? Xr(e) : 0;
    },
    keyCode: function (e) {
      return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    },
    which: function (e) {
      return e.type === "keypress"
        ? Xr(e)
        : e.type === "keydown" || e.type === "keyup"
        ? e.keyCode
        : 0;
    },
  }),
  dp = ze(cp),
  fp = ee({}, Ds, {
    pointerId: 0,
    width: 0,
    height: 0,
    pressure: 0,
    tangentialPressure: 0,
    tiltX: 0,
    tiltY: 0,
    twist: 0,
    pointerType: 0,
    isPrimary: 0,
  }),
  Zo = ze(fp),
  pp = ee({}, Nr, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: Fi,
  }),
  hp = ze(pp),
  mp = ee({}, Tn, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }),
  gp = ze(mp),
  vp = ee({}, Ds, {
    deltaX: function (e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function (e) {
      return "deltaY" in e
        ? e.deltaY
        : "wheelDeltaY" in e
        ? -e.wheelDeltaY
        : "wheelDelta" in e
        ? -e.wheelDelta
        : 0;
    },
    deltaZ: 0,
    deltaMode: 0,
  }),
  yp = ze(vp),
  xp = [9, 13, 27, 32],
  Bi = at && "CompositionEvent" in window,
  Kn = null;
at && "documentMode" in document && (Kn = document.documentMode);
var jp = at && "TextEvent" in window && !Kn,
  Ku = at && (!Bi || (Kn && 8 < Kn && 11 >= Kn)),
  ea = " ",
  ta = !1;
function Gu(e, t) {
  switch (e) {
    case "keyup":
      return xp.indexOf(t.keyCode) !== -1;
    case "keydown":
      return t.keyCode !== 229;
    case "keypress":
    case "mousedown":
    case "focusout":
      return !0;
    default:
      return !1;
  }
}
function Yu(e) {
  return (e = e.detail), typeof e == "object" && "data" in e ? e.data : null;
}
var sn = !1;
function wp(e, t) {
  switch (e) {
    case "compositionend":
      return Yu(t);
    case "keypress":
      return t.which !== 32 ? null : ((ta = !0), ea);
    case "textInput":
      return (e = t.data), e === ea && ta ? null : e;
    default:
      return null;
  }
}
function kp(e, t) {
  if (sn)
    return e === "compositionend" || (!Bi && Gu(e, t))
      ? ((e = Qu()), (Yr = $i = yt = null), (sn = !1), e)
      : null;
  switch (e) {
    case "paste":
      return null;
    case "keypress":
      if (!(t.ctrlKey || t.altKey || t.metaKey) || (t.ctrlKey && t.altKey)) {
        if (t.char && 1 < t.char.length) return t.char;
        if (t.which) return String.fromCharCode(t.which);
      }
      return null;
    case "compositionend":
      return Ku && t.locale !== "ko" ? null : t.data;
    default:
      return null;
  }
}
var Np = {
  color: !0,
  date: !0,
  datetime: !0,
  "datetime-local": !0,
  email: !0,
  month: !0,
  number: !0,
  password: !0,
  range: !0,
  search: !0,
  tel: !0,
  text: !0,
  time: !0,
  url: !0,
  week: !0,
};
function na(e) {
  var t = e && e.nodeName && e.nodeName.toLowerCase();
  return t === "input" ? !!Np[e.type] : t === "textarea";
}
function Xu(e, t, n, r) {
  _u(r),
    (t = fs(t, "onChange")),
    0 < t.length &&
      ((n = new Ai("onChange", "change", null, n, r)),
      e.push({ event: n, listeners: t }));
}
var Gn = null,
  ar = null;
function Sp(e) {
  ac(e, 0);
}
function bs(e) {
  var t = an(e);
  if (wu(t)) return e;
}
function Cp(e, t) {
  if (e === "change") return t;
}
var Ju = !1;
if (at) {
  var ul;
  if (at) {
    var cl = "oninput" in document;
    if (!cl) {
      var ra = document.createElement("div");
      ra.setAttribute("oninput", "return;"),
        (cl = typeof ra.oninput == "function");
    }
    ul = cl;
  } else ul = !1;
  Ju = ul && (!document.documentMode || 9 < document.documentMode);
}
function sa() {
  Gn && (Gn.detachEvent("onpropertychange", Zu), (ar = Gn = null));
}
function Zu(e) {
  if (e.propertyName === "value" && bs(ar)) {
    var t = [];
    Xu(t, ar, e, zi(e)), Iu(Sp, t);
  }
}
function Ep(e, t, n) {
  e === "focusin"
    ? (sa(), (Gn = t), (ar = n), Gn.attachEvent("onpropertychange", Zu))
    : e === "focusout" && sa();
}
function Pp(e) {
  if (e === "selectionchange" || e === "keyup" || e === "keydown")
    return bs(ar);
}
function _p(e, t) {
  if (e === "click") return bs(t);
}
function Rp(e, t) {
  if (e === "input" || e === "change") return bs(t);
}
function Tp(e, t) {
  return (e === t && (e !== 0 || 1 / e === 1 / t)) || (e !== e && t !== t);
}
var Ge = typeof Object.is == "function" ? Object.is : Tp;
function ur(e, t) {
  if (Ge(e, t)) return !0;
  if (typeof e != "object" || e === null || typeof t != "object" || t === null)
    return !1;
  var n = Object.keys(e),
    r = Object.keys(t);
  if (n.length !== r.length) return !1;
  for (r = 0; r < n.length; r++) {
    var s = n[r];
    if (!Rl.call(t, s) || !Ge(e[s], t[s])) return !1;
  }
  return !0;
}
function la(e) {
  for (; e && e.firstChild; ) e = e.firstChild;
  return e;
}
function ia(e, t) {
  var n = la(e);
  e = 0;
  for (var r; n; ) {
    if (n.nodeType === 3) {
      if (((r = e + n.textContent.length), e <= t && r >= t))
        return { node: n, offset: t - e };
      e = r;
    }
    e: {
      for (; n; ) {
        if (n.nextSibling) {
          n = n.nextSibling;
          break e;
        }
        n = n.parentNode;
      }
      n = void 0;
    }
    n = la(n);
  }
}
function ec(e, t) {
  return e && t
    ? e === t
      ? !0
      : e && e.nodeType === 3
      ? !1
      : t && t.nodeType === 3
      ? ec(e, t.parentNode)
      : "contains" in e
      ? e.contains(t)
      : e.compareDocumentPosition
      ? !!(e.compareDocumentPosition(t) & 16)
      : !1
    : !1;
}
function tc() {
  for (var e = window, t = ls(); t instanceof e.HTMLIFrameElement; ) {
    try {
      var n = typeof t.contentWindow.location.href == "string";
    } catch {
      n = !1;
    }
    if (n) e = t.contentWindow;
    else break;
    t = ls(e.document);
  }
  return t;
}
function Vi(e) {
  var t = e && e.nodeName && e.nodeName.toLowerCase();
  return (
    t &&
    ((t === "input" &&
      (e.type === "text" ||
        e.type === "search" ||
        e.type === "tel" ||
        e.type === "url" ||
        e.type === "password")) ||
      t === "textarea" ||
      e.contentEditable === "true")
  );
}
function Lp(e) {
  var t = tc(),
    n = e.focusedElem,
    r = e.selectionRange;
  if (
    t !== n &&
    n &&
    n.ownerDocument &&
    ec(n.ownerDocument.documentElement, n)
  ) {
    if (r !== null && Vi(n)) {
      if (
        ((t = r.start),
        (e = r.end),
        e === void 0 && (e = t),
        "selectionStart" in n)
      )
        (n.selectionStart = t), (n.selectionEnd = Math.min(e, n.value.length));
      else if (
        ((e = ((t = n.ownerDocument || document) && t.defaultView) || window),
        e.getSelection)
      ) {
        e = e.getSelection();
        var s = n.textContent.length,
          i = Math.min(r.start, s);
        (r = r.end === void 0 ? i : Math.min(r.end, s)),
          !e.extend && i > r && ((s = r), (r = i), (i = s)),
          (s = ia(n, i));
        var o = ia(n, r);
        s &&
          o &&
          (e.rangeCount !== 1 ||
            e.anchorNode !== s.node ||
            e.anchorOffset !== s.offset ||
            e.focusNode !== o.node ||
            e.focusOffset !== o.offset) &&
          ((t = t.createRange()),
          t.setStart(s.node, s.offset),
          e.removeAllRanges(),
          i > r
            ? (e.addRange(t), e.extend(o.node, o.offset))
            : (t.setEnd(o.node, o.offset), e.addRange(t)));
      }
    }
    for (t = [], e = n; (e = e.parentNode); )
      e.nodeType === 1 &&
        t.push({ element: e, left: e.scrollLeft, top: e.scrollTop });
    for (typeof n.focus == "function" && n.focus(), n = 0; n < t.length; n++)
      (e = t[n]),
        (e.element.scrollLeft = e.left),
        (e.element.scrollTop = e.top);
  }
}
var Ip = at && "documentMode" in document && 11 >= document.documentMode,
  ln = null,
  Kl = null,
  Yn = null,
  Gl = !1;
function oa(e, t, n) {
  var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
  Gl ||
    ln == null ||
    ln !== ls(r) ||
    ((r = ln),
    "selectionStart" in r && Vi(r)
      ? (r = { start: r.selectionStart, end: r.selectionEnd })
      : ((r = (
          (r.ownerDocument && r.ownerDocument.defaultView) ||
          window
        ).getSelection()),
        (r = {
          anchorNode: r.anchorNode,
          anchorOffset: r.anchorOffset,
          focusNode: r.focusNode,
          focusOffset: r.focusOffset,
        })),
    (Yn && ur(Yn, r)) ||
      ((Yn = r),
      (r = fs(Kl, "onSelect")),
      0 < r.length &&
        ((t = new Ai("onSelect", "select", null, t, n)),
        e.push({ event: t, listeners: r }),
        (t.target = ln))));
}
function br(e, t) {
  var n = {};
  return (
    (n[e.toLowerCase()] = t.toLowerCase()),
    (n["Webkit" + e] = "webkit" + t),
    (n["Moz" + e] = "moz" + t),
    n
  );
}
var on = {
    animationend: br("Animation", "AnimationEnd"),
    animationiteration: br("Animation", "AnimationIteration"),
    animationstart: br("Animation", "AnimationStart"),
    transitionend: br("Transition", "TransitionEnd"),
  },
  dl = {},
  nc = {};
at &&
  ((nc = document.createElement("div").style),
  "AnimationEvent" in window ||
    (delete on.animationend.animation,
    delete on.animationiteration.animation,
    delete on.animationstart.animation),
  "TransitionEvent" in window || delete on.transitionend.transition);
function Us(e) {
  if (dl[e]) return dl[e];
  if (!on[e]) return e;
  var t = on[e],
    n;
  for (n in t) if (t.hasOwnProperty(n) && n in nc) return (dl[e] = t[n]);
  return e;
}
var rc = Us("animationend"),
  sc = Us("animationiteration"),
  lc = Us("animationstart"),
  ic = Us("transitionend"),
  oc = new Map(),
  aa =
    "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
      " "
    );
function Mt(e, t) {
  oc.set(e, t), Xt(t, [e]);
}
for (var fl = 0; fl < aa.length; fl++) {
  var pl = aa[fl],
    Mp = pl.toLowerCase(),
    zp = pl[0].toUpperCase() + pl.slice(1);
  Mt(Mp, "on" + zp);
}
Mt(rc, "onAnimationEnd");
Mt(sc, "onAnimationIteration");
Mt(lc, "onAnimationStart");
Mt("dblclick", "onDoubleClick");
Mt("focusin", "onFocus");
Mt("focusout", "onBlur");
Mt(ic, "onTransitionEnd");
kn("onMouseEnter", ["mouseout", "mouseover"]);
kn("onMouseLeave", ["mouseout", "mouseover"]);
kn("onPointerEnter", ["pointerout", "pointerover"]);
kn("onPointerLeave", ["pointerout", "pointerover"]);
Xt(
  "onChange",
  "change click focusin focusout input keydown keyup selectionchange".split(" ")
);
Xt(
  "onSelect",
  "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
    " "
  )
);
Xt("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
Xt(
  "onCompositionEnd",
  "compositionend focusout keydown keypress keyup mousedown".split(" ")
);
Xt(
  "onCompositionStart",
  "compositionstart focusout keydown keypress keyup mousedown".split(" ")
);
Xt(
  "onCompositionUpdate",
  "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
);
var Wn =
    "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
      " "
    ),
  Op = new Set("cancel close invalid load scroll toggle".split(" ").concat(Wn));
function ua(e, t, n) {
  var r = e.type || "unknown-event";
  (e.currentTarget = n), Mf(r, t, void 0, e), (e.currentTarget = null);
}
function ac(e, t) {
  t = (t & 4) !== 0;
  for (var n = 0; n < e.length; n++) {
    var r = e[n],
      s = r.event;
    r = r.listeners;
    e: {
      var i = void 0;
      if (t)
        for (var o = r.length - 1; 0 <= o; o--) {
          var a = r[o],
            u = a.instance,
            c = a.currentTarget;
          if (((a = a.listener), u !== i && s.isPropagationStopped())) break e;
          ua(s, a, c), (i = u);
        }
      else
        for (o = 0; o < r.length; o++) {
          if (
            ((a = r[o]),
            (u = a.instance),
            (c = a.currentTarget),
            (a = a.listener),
            u !== i && s.isPropagationStopped())
          )
            break e;
          ua(s, a, c), (i = u);
        }
    }
  }
  if (os) throw ((e = Hl), (os = !1), (Hl = null), e);
}
function G(e, t) {
  var n = t[ei];
  n === void 0 && (n = t[ei] = new Set());
  var r = e + "__bubble";
  n.has(r) || (uc(t, e, 2, !1), n.add(r));
}
function hl(e, t, n) {
  var r = 0;
  t && (r |= 4), uc(n, e, r, t);
}
var Ur = "_reactListening" + Math.random().toString(36).slice(2);
function cr(e) {
  if (!e[Ur]) {
    (e[Ur] = !0),
      gu.forEach(function (n) {
        n !== "selectionchange" && (Op.has(n) || hl(n, !1, e), hl(n, !0, e));
      });
    var t = e.nodeType === 9 ? e : e.ownerDocument;
    t === null || t[Ur] || ((t[Ur] = !0), hl("selectionchange", !1, t));
  }
}
function uc(e, t, n, r) {
  switch (qu(t)) {
    case 1:
      var s = Gf;
      break;
    case 4:
      s = Yf;
      break;
    default:
      s = Ui;
  }
  (n = s.bind(null, t, n, e)),
    (s = void 0),
    !Vl ||
      (t !== "touchstart" && t !== "touchmove" && t !== "wheel") ||
      (s = !0),
    r
      ? s !== void 0
        ? e.addEventListener(t, n, { capture: !0, passive: s })
        : e.addEventListener(t, n, !0)
      : s !== void 0
      ? e.addEventListener(t, n, { passive: s })
      : e.addEventListener(t, n, !1);
}
function ml(e, t, n, r, s) {
  var i = r;
  if (!(t & 1) && !(t & 2) && r !== null)
    e: for (;;) {
      if (r === null) return;
      var o = r.tag;
      if (o === 3 || o === 4) {
        var a = r.stateNode.containerInfo;
        if (a === s || (a.nodeType === 8 && a.parentNode === s)) break;
        if (o === 4)
          for (o = r.return; o !== null; ) {
            var u = o.tag;
            if (
              (u === 3 || u === 4) &&
              ((u = o.stateNode.containerInfo),
              u === s || (u.nodeType === 8 && u.parentNode === s))
            )
              return;
            o = o.return;
          }
        for (; a !== null; ) {
          if (((o = At(a)), o === null)) return;
          if (((u = o.tag), u === 5 || u === 6)) {
            r = i = o;
            continue e;
          }
          a = a.parentNode;
        }
      }
      r = r.return;
    }
  Iu(function () {
    var c = i,
      d = zi(n),
      h = [];
    e: {
      var g = oc.get(e);
      if (g !== void 0) {
        var w = Ai,
          k = e;
        switch (e) {
          case "keypress":
            if (Xr(n) === 0) break e;
          case "keydown":
          case "keyup":
            w = dp;
            break;
          case "focusin":
            (k = "focus"), (w = al);
            break;
          case "focusout":
            (k = "blur"), (w = al);
            break;
          case "beforeblur":
          case "afterblur":
            w = al;
            break;
          case "click":
            if (n.button === 2) break e;
          case "auxclick":
          case "dblclick":
          case "mousedown":
          case "mousemove":
          case "mouseup":
          case "mouseout":
          case "mouseover":
          case "contextmenu":
            w = Xo;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            w = Zf;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            w = hp;
            break;
          case rc:
          case sc:
          case lc:
            w = np;
            break;
          case ic:
            w = gp;
            break;
          case "scroll":
            w = Xf;
            break;
          case "wheel":
            w = yp;
            break;
          case "copy":
          case "cut":
          case "paste":
            w = sp;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            w = Zo;
        }
        var x = (t & 4) !== 0,
          C = !x && e === "scroll",
          m = x ? (g !== null ? g + "Capture" : null) : g;
        x = [];
        for (var p = c, f; p !== null; ) {
          f = p;
          var j = f.stateNode;
          if (
            (f.tag === 5 &&
              j !== null &&
              ((f = j),
              m !== null && ((j = sr(p, m)), j != null && x.push(dr(p, j, f)))),
            C)
          )
            break;
          p = p.return;
        }
        0 < x.length &&
          ((g = new w(g, k, null, n, d)), h.push({ event: g, listeners: x }));
      }
    }
    if (!(t & 7)) {
      e: {
        if (
          ((g = e === "mouseover" || e === "pointerover"),
          (w = e === "mouseout" || e === "pointerout"),
          g &&
            n !== Fl &&
            (k = n.relatedTarget || n.fromElement) &&
            (At(k) || k[ut]))
        )
          break e;
        if (
          (w || g) &&
          ((g =
            d.window === d
              ? d
              : (g = d.ownerDocument)
              ? g.defaultView || g.parentWindow
              : window),
          w
            ? ((k = n.relatedTarget || n.toElement),
              (w = c),
              (k = k ? At(k) : null),
              k !== null &&
                ((C = Jt(k)), k !== C || (k.tag !== 5 && k.tag !== 6)) &&
                (k = null))
            : ((w = null), (k = c)),
          w !== k)
        ) {
          if (
            ((x = Xo),
            (j = "onMouseLeave"),
            (m = "onMouseEnter"),
            (p = "mouse"),
            (e === "pointerout" || e === "pointerover") &&
              ((x = Zo),
              (j = "onPointerLeave"),
              (m = "onPointerEnter"),
              (p = "pointer")),
            (C = w == null ? g : an(w)),
            (f = k == null ? g : an(k)),
            (g = new x(j, p + "leave", w, n, d)),
            (g.target = C),
            (g.relatedTarget = f),
            (j = null),
            At(d) === c &&
              ((x = new x(m, p + "enter", k, n, d)),
              (x.target = f),
              (x.relatedTarget = C),
              (j = x)),
            (C = j),
            w && k)
          )
            t: {
              for (x = w, m = k, p = 0, f = x; f; f = tn(f)) p++;
              for (f = 0, j = m; j; j = tn(j)) f++;
              for (; 0 < p - f; ) (x = tn(x)), p--;
              for (; 0 < f - p; ) (m = tn(m)), f--;
              for (; p--; ) {
                if (x === m || (m !== null && x === m.alternate)) break t;
                (x = tn(x)), (m = tn(m));
              }
              x = null;
            }
          else x = null;
          w !== null && ca(h, g, w, x, !1),
            k !== null && C !== null && ca(h, C, k, x, !0);
        }
      }
      e: {
        if (
          ((g = c ? an(c) : window),
          (w = g.nodeName && g.nodeName.toLowerCase()),
          w === "select" || (w === "input" && g.type === "file"))
        )
          var S = Cp;
        else if (na(g))
          if (Ju) S = Rp;
          else {
            S = Pp;
            var R = Ep;
          }
        else
          (w = g.nodeName) &&
            w.toLowerCase() === "input" &&
            (g.type === "checkbox" || g.type === "radio") &&
            (S = _p);
        if (S && (S = S(e, c))) {
          Xu(h, S, n, d);
          break e;
        }
        R && R(e, g, c),
          e === "focusout" &&
            (R = g._wrapperState) &&
            R.controlled &&
            g.type === "number" &&
            Dl(g, "number", g.value);
      }
      switch (((R = c ? an(c) : window), e)) {
        case "focusin":
          (na(R) || R.contentEditable === "true") &&
            ((ln = R), (Kl = c), (Yn = null));
          break;
        case "focusout":
          Yn = Kl = ln = null;
          break;
        case "mousedown":
          Gl = !0;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          (Gl = !1), oa(h, n, d);
          break;
        case "selectionchange":
          if (Ip) break;
        case "keydown":
        case "keyup":
          oa(h, n, d);
      }
      var N;
      if (Bi)
        e: {
          switch (e) {
            case "compositionstart":
              var P = "onCompositionStart";
              break e;
            case "compositionend":
              P = "onCompositionEnd";
              break e;
            case "compositionupdate":
              P = "onCompositionUpdate";
              break e;
          }
          P = void 0;
        }
      else
        sn
          ? Gu(e, n) && (P = "onCompositionEnd")
          : e === "keydown" && n.keyCode === 229 && (P = "onCompositionStart");
      P &&
        (Ku &&
          n.locale !== "ko" &&
          (sn || P !== "onCompositionStart"
            ? P === "onCompositionEnd" && sn && (N = Qu())
            : ((yt = d),
              ($i = "value" in yt ? yt.value : yt.textContent),
              (sn = !0))),
        (R = fs(c, P)),
        0 < R.length &&
          ((P = new Jo(P, e, null, n, d)),
          h.push({ event: P, listeners: R }),
          N ? (P.data = N) : ((N = Yu(n)), N !== null && (P.data = N)))),
        (N = jp ? wp(e, n) : kp(e, n)) &&
          ((c = fs(c, "onBeforeInput")),
          0 < c.length &&
            ((d = new Jo("onBeforeInput", "beforeinput", null, n, d)),
            h.push({ event: d, listeners: c }),
            (d.data = N)));
    }
    ac(h, t);
  });
}
function dr(e, t, n) {
  return { instance: e, listener: t, currentTarget: n };
}
function fs(e, t) {
  for (var n = t + "Capture", r = []; e !== null; ) {
    var s = e,
      i = s.stateNode;
    s.tag === 5 &&
      i !== null &&
      ((s = i),
      (i = sr(e, n)),
      i != null && r.unshift(dr(e, i, s)),
      (i = sr(e, t)),
      i != null && r.push(dr(e, i, s))),
      (e = e.return);
  }
  return r;
}
function tn(e) {
  if (e === null) return null;
  do e = e.return;
  while (e && e.tag !== 5);
  return e || null;
}
function ca(e, t, n, r, s) {
  for (var i = t._reactName, o = []; n !== null && n !== r; ) {
    var a = n,
      u = a.alternate,
      c = a.stateNode;
    if (u !== null && u === r) break;
    a.tag === 5 &&
      c !== null &&
      ((a = c),
      s
        ? ((u = sr(n, i)), u != null && o.unshift(dr(n, u, a)))
        : s || ((u = sr(n, i)), u != null && o.push(dr(n, u, a)))),
      (n = n.return);
  }
  o.length !== 0 && e.push({ event: t, listeners: o });
}
var Dp = /\r\n?/g,
  bp = /\u0000|\uFFFD/g;
function da(e) {
  return (typeof e == "string" ? e : "" + e)
    .replace(
      Dp,
      `
`
    )
    .replace(bp, "");
}
function $r(e, t, n) {
  if (((t = da(t)), da(e) !== t && n)) throw Error(E(425));
}
function ps() {}
var Yl = null,
  Xl = null;
function Jl(e, t) {
  return (
    e === "textarea" ||
    e === "noscript" ||
    typeof t.children == "string" ||
    typeof t.children == "number" ||
    (typeof t.dangerouslySetInnerHTML == "object" &&
      t.dangerouslySetInnerHTML !== null &&
      t.dangerouslySetInnerHTML.__html != null)
  );
}
var Zl = typeof setTimeout == "function" ? setTimeout : void 0,
  Up = typeof clearTimeout == "function" ? clearTimeout : void 0,
  fa = typeof Promise == "function" ? Promise : void 0,
  $p =
    typeof queueMicrotask == "function"
      ? queueMicrotask
      : typeof fa < "u"
      ? function (e) {
          return fa.resolve(null).then(e).catch(Ap);
        }
      : Zl;
function Ap(e) {
  setTimeout(function () {
    throw e;
  });
}
function gl(e, t) {
  var n = t,
    r = 0;
  do {
    var s = n.nextSibling;
    if ((e.removeChild(n), s && s.nodeType === 8))
      if (((n = s.data), n === "/$")) {
        if (r === 0) {
          e.removeChild(s), or(t);
          return;
        }
        r--;
      } else (n !== "$" && n !== "$?" && n !== "$!") || r++;
    n = s;
  } while (n);
  or(t);
}
function Ct(e) {
  for (; e != null; e = e.nextSibling) {
    var t = e.nodeType;
    if (t === 1 || t === 3) break;
    if (t === 8) {
      if (((t = e.data), t === "$" || t === "$!" || t === "$?")) break;
      if (t === "/$") return null;
    }
  }
  return e;
}
function pa(e) {
  e = e.previousSibling;
  for (var t = 0; e; ) {
    if (e.nodeType === 8) {
      var n = e.data;
      if (n === "$" || n === "$!" || n === "$?") {
        if (t === 0) return e;
        t--;
      } else n === "/$" && t++;
    }
    e = e.previousSibling;
  }
  return null;
}
var Ln = Math.random().toString(36).slice(2),
  Je = "__reactFiber$" + Ln,
  fr = "__reactProps$" + Ln,
  ut = "__reactContainer$" + Ln,
  ei = "__reactEvents$" + Ln,
  Fp = "__reactListeners$" + Ln,
  Bp = "__reactHandles$" + Ln;
function At(e) {
  var t = e[Je];
  if (t) return t;
  for (var n = e.parentNode; n; ) {
    if ((t = n[ut] || n[Je])) {
      if (
        ((n = t.alternate),
        t.child !== null || (n !== null && n.child !== null))
      )
        for (e = pa(e); e !== null; ) {
          if ((n = e[Je])) return n;
          e = pa(e);
        }
      return t;
    }
    (e = n), (n = e.parentNode);
  }
  return null;
}
function Sr(e) {
  return (
    (e = e[Je] || e[ut]),
    !e || (e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3) ? null : e
  );
}
function an(e) {
  if (e.tag === 5 || e.tag === 6) return e.stateNode;
  throw Error(E(33));
}
function $s(e) {
  return e[fr] || null;
}
var ti = [],
  un = -1;
function zt(e) {
  return { current: e };
}
function Y(e) {
  0 > un || ((e.current = ti[un]), (ti[un] = null), un--);
}
function Q(e, t) {
  un++, (ti[un] = e.current), (e.current = t);
}
var It = {},
  ge = zt(It),
  Se = zt(!1),
  Wt = It;
function Nn(e, t) {
  var n = e.type.contextTypes;
  if (!n) return It;
  var r = e.stateNode;
  if (r && r.__reactInternalMemoizedUnmaskedChildContext === t)
    return r.__reactInternalMemoizedMaskedChildContext;
  var s = {},
    i;
  for (i in n) s[i] = t[i];
  return (
    r &&
      ((e = e.stateNode),
      (e.__reactInternalMemoizedUnmaskedChildContext = t),
      (e.__reactInternalMemoizedMaskedChildContext = s)),
    s
  );
}
function Ce(e) {
  return (e = e.childContextTypes), e != null;
}
function hs() {
  Y(Se), Y(ge);
}
function ha(e, t, n) {
  if (ge.current !== It) throw Error(E(168));
  Q(ge, t), Q(Se, n);
}
function cc(e, t, n) {
  var r = e.stateNode;
  if (((t = t.childContextTypes), typeof r.getChildContext != "function"))
    return n;
  r = r.getChildContext();
  for (var s in r) if (!(s in t)) throw Error(E(108, Ef(e) || "Unknown", s));
  return ee({}, n, r);
}
function ms(e) {
  return (
    (e =
      ((e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext) || It),
    (Wt = ge.current),
    Q(ge, e),
    Q(Se, Se.current),
    !0
  );
}
function ma(e, t, n) {
  var r = e.stateNode;
  if (!r) throw Error(E(169));
  n
    ? ((e = cc(e, t, Wt)),
      (r.__reactInternalMemoizedMergedChildContext = e),
      Y(Se),
      Y(ge),
      Q(ge, e))
    : Y(Se),
    Q(Se, n);
}
var st = null,
  As = !1,
  vl = !1;
function dc(e) {
  st === null ? (st = [e]) : st.push(e);
}
function Vp(e) {
  (As = !0), dc(e);
}
function Ot() {
  if (!vl && st !== null) {
    vl = !0;
    var e = 0,
      t = H;
    try {
      var n = st;
      for (H = 1; e < n.length; e++) {
        var r = n[e];
        do r = r(!0);
        while (r !== null);
      }
      (st = null), (As = !1);
    } catch (s) {
      throw (st !== null && (st = st.slice(e + 1)), Du(Oi, Ot), s);
    } finally {
      (H = t), (vl = !1);
    }
  }
  return null;
}
var cn = [],
  dn = 0,
  gs = null,
  vs = 0,
  be = [],
  Ue = 0,
  qt = null,
  lt = 1,
  it = "";
function Ut(e, t) {
  (cn[dn++] = vs), (cn[dn++] = gs), (gs = e), (vs = t);
}
function fc(e, t, n) {
  (be[Ue++] = lt), (be[Ue++] = it), (be[Ue++] = qt), (qt = e);
  var r = lt;
  e = it;
  var s = 32 - Qe(r) - 1;
  (r &= ~(1 << s)), (n += 1);
  var i = 32 - Qe(t) + s;
  if (30 < i) {
    var o = s - (s % 5);
    (i = (r & ((1 << o) - 1)).toString(32)),
      (r >>= o),
      (s -= o),
      (lt = (1 << (32 - Qe(t) + s)) | (n << s) | r),
      (it = i + e);
  } else (lt = (1 << i) | (n << s) | r), (it = e);
}
function Hi(e) {
  e.return !== null && (Ut(e, 1), fc(e, 1, 0));
}
function Wi(e) {
  for (; e === gs; )
    (gs = cn[--dn]), (cn[dn] = null), (vs = cn[--dn]), (cn[dn] = null);
  for (; e === qt; )
    (qt = be[--Ue]),
      (be[Ue] = null),
      (it = be[--Ue]),
      (be[Ue] = null),
      (lt = be[--Ue]),
      (be[Ue] = null);
}
var Le = null,
  Te = null,
  X = !1,
  qe = null;
function pc(e, t) {
  var n = $e(5, null, null, 0);
  (n.elementType = "DELETED"),
    (n.stateNode = t),
    (n.return = e),
    (t = e.deletions),
    t === null ? ((e.deletions = [n]), (e.flags |= 16)) : t.push(n);
}
function ga(e, t) {
  switch (e.tag) {
    case 5:
      var n = e.type;
      return (
        (t =
          t.nodeType !== 1 || n.toLowerCase() !== t.nodeName.toLowerCase()
            ? null
            : t),
        t !== null
          ? ((e.stateNode = t), (Le = e), (Te = Ct(t.firstChild)), !0)
          : !1
      );
    case 6:
      return (
        (t = e.pendingProps === "" || t.nodeType !== 3 ? null : t),
        t !== null ? ((e.stateNode = t), (Le = e), (Te = null), !0) : !1
      );
    case 13:
      return (
        (t = t.nodeType !== 8 ? null : t),
        t !== null
          ? ((n = qt !== null ? { id: lt, overflow: it } : null),
            (e.memoizedState = {
              dehydrated: t,
              treeContext: n,
              retryLane: 1073741824,
            }),
            (n = $e(18, null, null, 0)),
            (n.stateNode = t),
            (n.return = e),
            (e.child = n),
            (Le = e),
            (Te = null),
            !0)
          : !1
      );
    default:
      return !1;
  }
}
function ni(e) {
  return (e.mode & 1) !== 0 && (e.flags & 128) === 0;
}
function ri(e) {
  if (X) {
    var t = Te;
    if (t) {
      var n = t;
      if (!ga(e, t)) {
        if (ni(e)) throw Error(E(418));
        t = Ct(n.nextSibling);
        var r = Le;
        t && ga(e, t)
          ? pc(r, n)
          : ((e.flags = (e.flags & -4097) | 2), (X = !1), (Le = e));
      }
    } else {
      if (ni(e)) throw Error(E(418));
      (e.flags = (e.flags & -4097) | 2), (X = !1), (Le = e);
    }
  }
}
function va(e) {
  for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13; )
    e = e.return;
  Le = e;
}
function Ar(e) {
  if (e !== Le) return !1;
  if (!X) return va(e), (X = !0), !1;
  var t;
  if (
    ((t = e.tag !== 3) &&
      !(t = e.tag !== 5) &&
      ((t = e.type),
      (t = t !== "head" && t !== "body" && !Jl(e.type, e.memoizedProps))),
    t && (t = Te))
  ) {
    if (ni(e)) throw (hc(), Error(E(418)));
    for (; t; ) pc(e, t), (t = Ct(t.nextSibling));
  }
  if ((va(e), e.tag === 13)) {
    if (((e = e.memoizedState), (e = e !== null ? e.dehydrated : null), !e))
      throw Error(E(317));
    e: {
      for (e = e.nextSibling, t = 0; e; ) {
        if (e.nodeType === 8) {
          var n = e.data;
          if (n === "/$") {
            if (t === 0) {
              Te = Ct(e.nextSibling);
              break e;
            }
            t--;
          } else (n !== "$" && n !== "$!" && n !== "$?") || t++;
        }
        e = e.nextSibling;
      }
      Te = null;
    }
  } else Te = Le ? Ct(e.stateNode.nextSibling) : null;
  return !0;
}
function hc() {
  for (var e = Te; e; ) e = Ct(e.nextSibling);
}
function Sn() {
  (Te = Le = null), (X = !1);
}
function qi(e) {
  qe === null ? (qe = [e]) : qe.push(e);
}
var Hp = ft.ReactCurrentBatchConfig;
function $n(e, t, n) {
  if (
    ((e = n.ref), e !== null && typeof e != "function" && typeof e != "object")
  ) {
    if (n._owner) {
      if (((n = n._owner), n)) {
        if (n.tag !== 1) throw Error(E(309));
        var r = n.stateNode;
      }
      if (!r) throw Error(E(147, e));
      var s = r,
        i = "" + e;
      return t !== null &&
        t.ref !== null &&
        typeof t.ref == "function" &&
        t.ref._stringRef === i
        ? t.ref
        : ((t = function (o) {
            var a = s.refs;
            o === null ? delete a[i] : (a[i] = o);
          }),
          (t._stringRef = i),
          t);
    }
    if (typeof e != "string") throw Error(E(284));
    if (!n._owner) throw Error(E(290, e));
  }
  return e;
}
function Fr(e, t) {
  throw (
    ((e = Object.prototype.toString.call(t)),
    Error(
      E(
        31,
        e === "[object Object]"
          ? "object with keys {" + Object.keys(t).join(", ") + "}"
          : e
      )
    ))
  );
}
function ya(e) {
  var t = e._init;
  return t(e._payload);
}
function mc(e) {
  function t(m, p) {
    if (e) {
      var f = m.deletions;
      f === null ? ((m.deletions = [p]), (m.flags |= 16)) : f.push(p);
    }
  }
  function n(m, p) {
    if (!e) return null;
    for (; p !== null; ) t(m, p), (p = p.sibling);
    return null;
  }
  function r(m, p) {
    for (m = new Map(); p !== null; )
      p.key !== null ? m.set(p.key, p) : m.set(p.index, p), (p = p.sibling);
    return m;
  }
  function s(m, p) {
    return (m = Rt(m, p)), (m.index = 0), (m.sibling = null), m;
  }
  function i(m, p, f) {
    return (
      (m.index = f),
      e
        ? ((f = m.alternate),
          f !== null
            ? ((f = f.index), f < p ? ((m.flags |= 2), p) : f)
            : ((m.flags |= 2), p))
        : ((m.flags |= 1048576), p)
    );
  }
  function o(m) {
    return e && m.alternate === null && (m.flags |= 2), m;
  }
  function a(m, p, f, j) {
    return p === null || p.tag !== 6
      ? ((p = Sl(f, m.mode, j)), (p.return = m), p)
      : ((p = s(p, f)), (p.return = m), p);
  }
  function u(m, p, f, j) {
    var S = f.type;
    return S === rn
      ? d(m, p, f.props.children, j, f.key)
      : p !== null &&
        (p.elementType === S ||
          (typeof S == "object" &&
            S !== null &&
            S.$$typeof === ht &&
            ya(S) === p.type))
      ? ((j = s(p, f.props)), (j.ref = $n(m, p, f)), (j.return = m), j)
      : ((j = ss(f.type, f.key, f.props, null, m.mode, j)),
        (j.ref = $n(m, p, f)),
        (j.return = m),
        j);
  }
  function c(m, p, f, j) {
    return p === null ||
      p.tag !== 4 ||
      p.stateNode.containerInfo !== f.containerInfo ||
      p.stateNode.implementation !== f.implementation
      ? ((p = Cl(f, m.mode, j)), (p.return = m), p)
      : ((p = s(p, f.children || [])), (p.return = m), p);
  }
  function d(m, p, f, j, S) {
    return p === null || p.tag !== 7
      ? ((p = Ht(f, m.mode, j, S)), (p.return = m), p)
      : ((p = s(p, f)), (p.return = m), p);
  }
  function h(m, p, f) {
    if ((typeof p == "string" && p !== "") || typeof p == "number")
      return (p = Sl("" + p, m.mode, f)), (p.return = m), p;
    if (typeof p == "object" && p !== null) {
      switch (p.$$typeof) {
        case Tr:
          return (
            (f = ss(p.type, p.key, p.props, null, m.mode, f)),
            (f.ref = $n(m, null, p)),
            (f.return = m),
            f
          );
        case nn:
          return (p = Cl(p, m.mode, f)), (p.return = m), p;
        case ht:
          var j = p._init;
          return h(m, j(p._payload), f);
      }
      if (Vn(p) || zn(p))
        return (p = Ht(p, m.mode, f, null)), (p.return = m), p;
      Fr(m, p);
    }
    return null;
  }
  function g(m, p, f, j) {
    var S = p !== null ? p.key : null;
    if ((typeof f == "string" && f !== "") || typeof f == "number")
      return S !== null ? null : a(m, p, "" + f, j);
    if (typeof f == "object" && f !== null) {
      switch (f.$$typeof) {
        case Tr:
          return f.key === S ? u(m, p, f, j) : null;
        case nn:
          return f.key === S ? c(m, p, f, j) : null;
        case ht:
          return (S = f._init), g(m, p, S(f._payload), j);
      }
      if (Vn(f) || zn(f)) return S !== null ? null : d(m, p, f, j, null);
      Fr(m, f);
    }
    return null;
  }
  function w(m, p, f, j, S) {
    if ((typeof j == "string" && j !== "") || typeof j == "number")
      return (m = m.get(f) || null), a(p, m, "" + j, S);
    if (typeof j == "object" && j !== null) {
      switch (j.$$typeof) {
        case Tr:
          return (m = m.get(j.key === null ? f : j.key) || null), u(p, m, j, S);
        case nn:
          return (m = m.get(j.key === null ? f : j.key) || null), c(p, m, j, S);
        case ht:
          var R = j._init;
          return w(m, p, f, R(j._payload), S);
      }
      if (Vn(j) || zn(j)) return (m = m.get(f) || null), d(p, m, j, S, null);
      Fr(p, j);
    }
    return null;
  }
  function k(m, p, f, j) {
    for (
      var S = null, R = null, N = p, P = (p = 0), $ = null;
      N !== null && P < f.length;
      P++
    ) {
      N.index > P ? (($ = N), (N = null)) : ($ = N.sibling);
      var T = g(m, N, f[P], j);
      if (T === null) {
        N === null && (N = $);
        break;
      }
      e && N && T.alternate === null && t(m, N),
        (p = i(T, p, P)),
        R === null ? (S = T) : (R.sibling = T),
        (R = T),
        (N = $);
    }
    if (P === f.length) return n(m, N), X && Ut(m, P), S;
    if (N === null) {
      for (; P < f.length; P++)
        (N = h(m, f[P], j)),
          N !== null &&
            ((p = i(N, p, P)), R === null ? (S = N) : (R.sibling = N), (R = N));
      return X && Ut(m, P), S;
    }
    for (N = r(m, N); P < f.length; P++)
      ($ = w(N, m, P, f[P], j)),
        $ !== null &&
          (e && $.alternate !== null && N.delete($.key === null ? P : $.key),
          (p = i($, p, P)),
          R === null ? (S = $) : (R.sibling = $),
          (R = $));
    return (
      e &&
        N.forEach(function (D) {
          return t(m, D);
        }),
      X && Ut(m, P),
      S
    );
  }
  function x(m, p, f, j) {
    var S = zn(f);
    if (typeof S != "function") throw Error(E(150));
    if (((f = S.call(f)), f == null)) throw Error(E(151));
    for (
      var R = (S = null), N = p, P = (p = 0), $ = null, T = f.next();
      N !== null && !T.done;
      P++, T = f.next()
    ) {
      N.index > P ? (($ = N), (N = null)) : ($ = N.sibling);
      var D = g(m, N, T.value, j);
      if (D === null) {
        N === null && (N = $);
        break;
      }
      e && N && D.alternate === null && t(m, N),
        (p = i(D, p, P)),
        R === null ? (S = D) : (R.sibling = D),
        (R = D),
        (N = $);
    }
    if (T.done) return n(m, N), X && Ut(m, P), S;
    if (N === null) {
      for (; !T.done; P++, T = f.next())
        (T = h(m, T.value, j)),
          T !== null &&
            ((p = i(T, p, P)), R === null ? (S = T) : (R.sibling = T), (R = T));
      return X && Ut(m, P), S;
    }
    for (N = r(m, N); !T.done; P++, T = f.next())
      (T = w(N, m, P, T.value, j)),
        T !== null &&
          (e && T.alternate !== null && N.delete(T.key === null ? P : T.key),
          (p = i(T, p, P)),
          R === null ? (S = T) : (R.sibling = T),
          (R = T));
    return (
      e &&
        N.forEach(function (W) {
          return t(m, W);
        }),
      X && Ut(m, P),
      S
    );
  }
  function C(m, p, f, j) {
    if (
      (typeof f == "object" &&
        f !== null &&
        f.type === rn &&
        f.key === null &&
        (f = f.props.children),
      typeof f == "object" && f !== null)
    ) {
      switch (f.$$typeof) {
        case Tr:
          e: {
            for (var S = f.key, R = p; R !== null; ) {
              if (R.key === S) {
                if (((S = f.type), S === rn)) {
                  if (R.tag === 7) {
                    n(m, R.sibling),
                      (p = s(R, f.props.children)),
                      (p.return = m),
                      (m = p);
                    break e;
                  }
                } else if (
                  R.elementType === S ||
                  (typeof S == "object" &&
                    S !== null &&
                    S.$$typeof === ht &&
                    ya(S) === R.type)
                ) {
                  n(m, R.sibling),
                    (p = s(R, f.props)),
                    (p.ref = $n(m, R, f)),
                    (p.return = m),
                    (m = p);
                  break e;
                }
                n(m, R);
                break;
              } else t(m, R);
              R = R.sibling;
            }
            f.type === rn
              ? ((p = Ht(f.props.children, m.mode, j, f.key)),
                (p.return = m),
                (m = p))
              : ((j = ss(f.type, f.key, f.props, null, m.mode, j)),
                (j.ref = $n(m, p, f)),
                (j.return = m),
                (m = j));
          }
          return o(m);
        case nn:
          e: {
            for (R = f.key; p !== null; ) {
              if (p.key === R)
                if (
                  p.tag === 4 &&
                  p.stateNode.containerInfo === f.containerInfo &&
                  p.stateNode.implementation === f.implementation
                ) {
                  n(m, p.sibling),
                    (p = s(p, f.children || [])),
                    (p.return = m),
                    (m = p);
                  break e;
                } else {
                  n(m, p);
                  break;
                }
              else t(m, p);
              p = p.sibling;
            }
            (p = Cl(f, m.mode, j)), (p.return = m), (m = p);
          }
          return o(m);
        case ht:
          return (R = f._init), C(m, p, R(f._payload), j);
      }
      if (Vn(f)) return k(m, p, f, j);
      if (zn(f)) return x(m, p, f, j);
      Fr(m, f);
    }
    return (typeof f == "string" && f !== "") || typeof f == "number"
      ? ((f = "" + f),
        p !== null && p.tag === 6
          ? (n(m, p.sibling), (p = s(p, f)), (p.return = m), (m = p))
          : (n(m, p), (p = Sl(f, m.mode, j)), (p.return = m), (m = p)),
        o(m))
      : n(m, p);
  }
  return C;
}
var Cn = mc(!0),
  gc = mc(!1),
  ys = zt(null),
  xs = null,
  fn = null,
  Qi = null;
function Ki() {
  Qi = fn = xs = null;
}
function Gi(e) {
  var t = ys.current;
  Y(ys), (e._currentValue = t);
}
function si(e, t, n) {
  for (; e !== null; ) {
    var r = e.alternate;
    if (
      ((e.childLanes & t) !== t
        ? ((e.childLanes |= t), r !== null && (r.childLanes |= t))
        : r !== null && (r.childLanes & t) !== t && (r.childLanes |= t),
      e === n)
    )
      break;
    e = e.return;
  }
}
function jn(e, t) {
  (xs = e),
    (Qi = fn = null),
    (e = e.dependencies),
    e !== null &&
      e.firstContext !== null &&
      (e.lanes & t && (Ne = !0), (e.firstContext = null));
}
function Fe(e) {
  var t = e._currentValue;
  if (Qi !== e)
    if (((e = { context: e, memoizedValue: t, next: null }), fn === null)) {
      if (xs === null) throw Error(E(308));
      (fn = e), (xs.dependencies = { lanes: 0, firstContext: e });
    } else fn = fn.next = e;
  return t;
}
var Ft = null;
function Yi(e) {
  Ft === null ? (Ft = [e]) : Ft.push(e);
}
function vc(e, t, n, r) {
  var s = t.interleaved;
  return (
    s === null ? ((n.next = n), Yi(t)) : ((n.next = s.next), (s.next = n)),
    (t.interleaved = n),
    ct(e, r)
  );
}
function ct(e, t) {
  e.lanes |= t;
  var n = e.alternate;
  for (n !== null && (n.lanes |= t), n = e, e = e.return; e !== null; )
    (e.childLanes |= t),
      (n = e.alternate),
      n !== null && (n.childLanes |= t),
      (n = e),
      (e = e.return);
  return n.tag === 3 ? n.stateNode : null;
}
var mt = !1;
function Xi(e) {
  e.updateQueue = {
    baseState: e.memoizedState,
    firstBaseUpdate: null,
    lastBaseUpdate: null,
    shared: { pending: null, interleaved: null, lanes: 0 },
    effects: null,
  };
}
function yc(e, t) {
  (e = e.updateQueue),
    t.updateQueue === e &&
      (t.updateQueue = {
        baseState: e.baseState,
        firstBaseUpdate: e.firstBaseUpdate,
        lastBaseUpdate: e.lastBaseUpdate,
        shared: e.shared,
        effects: e.effects,
      });
}
function ot(e, t) {
  return {
    eventTime: e,
    lane: t,
    tag: 0,
    payload: null,
    callback: null,
    next: null,
  };
}
function Et(e, t, n) {
  var r = e.updateQueue;
  if (r === null) return null;
  if (((r = r.shared), A & 2)) {
    var s = r.pending;
    return (
      s === null ? (t.next = t) : ((t.next = s.next), (s.next = t)),
      (r.pending = t),
      ct(e, n)
    );
  }
  return (
    (s = r.interleaved),
    s === null ? ((t.next = t), Yi(r)) : ((t.next = s.next), (s.next = t)),
    (r.interleaved = t),
    ct(e, n)
  );
}
function Jr(e, t, n) {
  if (
    ((t = t.updateQueue), t !== null && ((t = t.shared), (n & 4194240) !== 0))
  ) {
    var r = t.lanes;
    (r &= e.pendingLanes), (n |= r), (t.lanes = n), Di(e, n);
  }
}
function xa(e, t) {
  var n = e.updateQueue,
    r = e.alternate;
  if (r !== null && ((r = r.updateQueue), n === r)) {
    var s = null,
      i = null;
    if (((n = n.firstBaseUpdate), n !== null)) {
      do {
        var o = {
          eventTime: n.eventTime,
          lane: n.lane,
          tag: n.tag,
          payload: n.payload,
          callback: n.callback,
          next: null,
        };
        i === null ? (s = i = o) : (i = i.next = o), (n = n.next);
      } while (n !== null);
      i === null ? (s = i = t) : (i = i.next = t);
    } else s = i = t;
    (n = {
      baseState: r.baseState,
      firstBaseUpdate: s,
      lastBaseUpdate: i,
      shared: r.shared,
      effects: r.effects,
    }),
      (e.updateQueue = n);
    return;
  }
  (e = n.lastBaseUpdate),
    e === null ? (n.firstBaseUpdate = t) : (e.next = t),
    (n.lastBaseUpdate = t);
}
function js(e, t, n, r) {
  var s = e.updateQueue;
  mt = !1;
  var i = s.firstBaseUpdate,
    o = s.lastBaseUpdate,
    a = s.shared.pending;
  if (a !== null) {
    s.shared.pending = null;
    var u = a,
      c = u.next;
    (u.next = null), o === null ? (i = c) : (o.next = c), (o = u);
    var d = e.alternate;
    d !== null &&
      ((d = d.updateQueue),
      (a = d.lastBaseUpdate),
      a !== o &&
        (a === null ? (d.firstBaseUpdate = c) : (a.next = c),
        (d.lastBaseUpdate = u)));
  }
  if (i !== null) {
    var h = s.baseState;
    (o = 0), (d = c = u = null), (a = i);
    do {
      var g = a.lane,
        w = a.eventTime;
      if ((r & g) === g) {
        d !== null &&
          (d = d.next =
            {
              eventTime: w,
              lane: 0,
              tag: a.tag,
              payload: a.payload,
              callback: a.callback,
              next: null,
            });
        e: {
          var k = e,
            x = a;
          switch (((g = t), (w = n), x.tag)) {
            case 1:
              if (((k = x.payload), typeof k == "function")) {
                h = k.call(w, h, g);
                break e;
              }
              h = k;
              break e;
            case 3:
              k.flags = (k.flags & -65537) | 128;
            case 0:
              if (
                ((k = x.payload),
                (g = typeof k == "function" ? k.call(w, h, g) : k),
                g == null)
              )
                break e;
              h = ee({}, h, g);
              break e;
            case 2:
              mt = !0;
          }
        }
        a.callback !== null &&
          a.lane !== 0 &&
          ((e.flags |= 64),
          (g = s.effects),
          g === null ? (s.effects = [a]) : g.push(a));
      } else
        (w = {
          eventTime: w,
          lane: g,
          tag: a.tag,
          payload: a.payload,
          callback: a.callback,
          next: null,
        }),
          d === null ? ((c = d = w), (u = h)) : (d = d.next = w),
          (o |= g);
      if (((a = a.next), a === null)) {
        if (((a = s.shared.pending), a === null)) break;
        (g = a),
          (a = g.next),
          (g.next = null),
          (s.lastBaseUpdate = g),
          (s.shared.pending = null);
      }
    } while (!0);
    if (
      (d === null && (u = h),
      (s.baseState = u),
      (s.firstBaseUpdate = c),
      (s.lastBaseUpdate = d),
      (t = s.shared.interleaved),
      t !== null)
    ) {
      s = t;
      do (o |= s.lane), (s = s.next);
      while (s !== t);
    } else i === null && (s.shared.lanes = 0);
    (Kt |= o), (e.lanes = o), (e.memoizedState = h);
  }
}
function ja(e, t, n) {
  if (((e = t.effects), (t.effects = null), e !== null))
    for (t = 0; t < e.length; t++) {
      var r = e[t],
        s = r.callback;
      if (s !== null) {
        if (((r.callback = null), (r = n), typeof s != "function"))
          throw Error(E(191, s));
        s.call(r);
      }
    }
}
var Cr = {},
  et = zt(Cr),
  pr = zt(Cr),
  hr = zt(Cr);
function Bt(e) {
  if (e === Cr) throw Error(E(174));
  return e;
}
function Ji(e, t) {
  switch ((Q(hr, t), Q(pr, e), Q(et, Cr), (e = t.nodeType), e)) {
    case 9:
    case 11:
      t = (t = t.documentElement) ? t.namespaceURI : Ul(null, "");
      break;
    default:
      (e = e === 8 ? t.parentNode : t),
        (t = e.namespaceURI || null),
        (e = e.tagName),
        (t = Ul(t, e));
  }
  Y(et), Q(et, t);
}
function En() {
  Y(et), Y(pr), Y(hr);
}
function xc(e) {
  Bt(hr.current);
  var t = Bt(et.current),
    n = Ul(t, e.type);
  t !== n && (Q(pr, e), Q(et, n));
}
function Zi(e) {
  pr.current === e && (Y(et), Y(pr));
}
var J = zt(0);
function ws(e) {
  for (var t = e; t !== null; ) {
    if (t.tag === 13) {
      var n = t.memoizedState;
      if (
        n !== null &&
        ((n = n.dehydrated), n === null || n.data === "$?" || n.data === "$!")
      )
        return t;
    } else if (t.tag === 19 && t.memoizedProps.revealOrder !== void 0) {
      if (t.flags & 128) return t;
    } else if (t.child !== null) {
      (t.child.return = t), (t = t.child);
      continue;
    }
    if (t === e) break;
    for (; t.sibling === null; ) {
      if (t.return === null || t.return === e) return null;
      t = t.return;
    }
    (t.sibling.return = t.return), (t = t.sibling);
  }
  return null;
}
var yl = [];
function eo() {
  for (var e = 0; e < yl.length; e++)
    yl[e]._workInProgressVersionPrimary = null;
  yl.length = 0;
}
var Zr = ft.ReactCurrentDispatcher,
  xl = ft.ReactCurrentBatchConfig,
  Qt = 0,
  Z = null,
  ie = null,
  ae = null,
  ks = !1,
  Xn = !1,
  mr = 0,
  Wp = 0;
function pe() {
  throw Error(E(321));
}
function to(e, t) {
  if (t === null) return !1;
  for (var n = 0; n < t.length && n < e.length; n++)
    if (!Ge(e[n], t[n])) return !1;
  return !0;
}
function no(e, t, n, r, s, i) {
  if (
    ((Qt = i),
    (Z = t),
    (t.memoizedState = null),
    (t.updateQueue = null),
    (t.lanes = 0),
    (Zr.current = e === null || e.memoizedState === null ? Gp : Yp),
    (e = n(r, s)),
    Xn)
  ) {
    i = 0;
    do {
      if (((Xn = !1), (mr = 0), 25 <= i)) throw Error(E(301));
      (i += 1),
        (ae = ie = null),
        (t.updateQueue = null),
        (Zr.current = Xp),
        (e = n(r, s));
    } while (Xn);
  }
  if (
    ((Zr.current = Ns),
    (t = ie !== null && ie.next !== null),
    (Qt = 0),
    (ae = ie = Z = null),
    (ks = !1),
    t)
  )
    throw Error(E(300));
  return e;
}
function ro() {
  var e = mr !== 0;
  return (mr = 0), e;
}
function Xe() {
  var e = {
    memoizedState: null,
    baseState: null,
    baseQueue: null,
    queue: null,
    next: null,
  };
  return ae === null ? (Z.memoizedState = ae = e) : (ae = ae.next = e), ae;
}
function Be() {
  if (ie === null) {
    var e = Z.alternate;
    e = e !== null ? e.memoizedState : null;
  } else e = ie.next;
  var t = ae === null ? Z.memoizedState : ae.next;
  if (t !== null) (ae = t), (ie = e);
  else {
    if (e === null) throw Error(E(310));
    (ie = e),
      (e = {
        memoizedState: ie.memoizedState,
        baseState: ie.baseState,
        baseQueue: ie.baseQueue,
        queue: ie.queue,
        next: null,
      }),
      ae === null ? (Z.memoizedState = ae = e) : (ae = ae.next = e);
  }
  return ae;
}
function gr(e, t) {
  return typeof t == "function" ? t(e) : t;
}
function jl(e) {
  var t = Be(),
    n = t.queue;
  if (n === null) throw Error(E(311));
  n.lastRenderedReducer = e;
  var r = ie,
    s = r.baseQueue,
    i = n.pending;
  if (i !== null) {
    if (s !== null) {
      var o = s.next;
      (s.next = i.next), (i.next = o);
    }
    (r.baseQueue = s = i), (n.pending = null);
  }
  if (s !== null) {
    (i = s.next), (r = r.baseState);
    var a = (o = null),
      u = null,
      c = i;
    do {
      var d = c.lane;
      if ((Qt & d) === d)
        u !== null &&
          (u = u.next =
            {
              lane: 0,
              action: c.action,
              hasEagerState: c.hasEagerState,
              eagerState: c.eagerState,
              next: null,
            }),
          (r = c.hasEagerState ? c.eagerState : e(r, c.action));
      else {
        var h = {
          lane: d,
          action: c.action,
          hasEagerState: c.hasEagerState,
          eagerState: c.eagerState,
          next: null,
        };
        u === null ? ((a = u = h), (o = r)) : (u = u.next = h),
          (Z.lanes |= d),
          (Kt |= d);
      }
      c = c.next;
    } while (c !== null && c !== i);
    u === null ? (o = r) : (u.next = a),
      Ge(r, t.memoizedState) || (Ne = !0),
      (t.memoizedState = r),
      (t.baseState = o),
      (t.baseQueue = u),
      (n.lastRenderedState = r);
  }
  if (((e = n.interleaved), e !== null)) {
    s = e;
    do (i = s.lane), (Z.lanes |= i), (Kt |= i), (s = s.next);
    while (s !== e);
  } else s === null && (n.lanes = 0);
  return [t.memoizedState, n.dispatch];
}
function wl(e) {
  var t = Be(),
    n = t.queue;
  if (n === null) throw Error(E(311));
  n.lastRenderedReducer = e;
  var r = n.dispatch,
    s = n.pending,
    i = t.memoizedState;
  if (s !== null) {
    n.pending = null;
    var o = (s = s.next);
    do (i = e(i, o.action)), (o = o.next);
    while (o !== s);
    Ge(i, t.memoizedState) || (Ne = !0),
      (t.memoizedState = i),
      t.baseQueue === null && (t.baseState = i),
      (n.lastRenderedState = i);
  }
  return [i, r];
}
function jc() {}
function wc(e, t) {
  var n = Z,
    r = Be(),
    s = t(),
    i = !Ge(r.memoizedState, s);
  if (
    (i && ((r.memoizedState = s), (Ne = !0)),
    (r = r.queue),
    so(Sc.bind(null, n, r, e), [e]),
    r.getSnapshot !== t || i || (ae !== null && ae.memoizedState.tag & 1))
  ) {
    if (
      ((n.flags |= 2048),
      vr(9, Nc.bind(null, n, r, s, t), void 0, null),
      ue === null)
    )
      throw Error(E(349));
    Qt & 30 || kc(n, t, s);
  }
  return s;
}
function kc(e, t, n) {
  (e.flags |= 16384),
    (e = { getSnapshot: t, value: n }),
    (t = Z.updateQueue),
    t === null
      ? ((t = { lastEffect: null, stores: null }),
        (Z.updateQueue = t),
        (t.stores = [e]))
      : ((n = t.stores), n === null ? (t.stores = [e]) : n.push(e));
}
function Nc(e, t, n, r) {
  (t.value = n), (t.getSnapshot = r), Cc(t) && Ec(e);
}
function Sc(e, t, n) {
  return n(function () {
    Cc(t) && Ec(e);
  });
}
function Cc(e) {
  var t = e.getSnapshot;
  e = e.value;
  try {
    var n = t();
    return !Ge(e, n);
  } catch {
    return !0;
  }
}
function Ec(e) {
  var t = ct(e, 1);
  t !== null && Ke(t, e, 1, -1);
}
function wa(e) {
  var t = Xe();
  return (
    typeof e == "function" && (e = e()),
    (t.memoizedState = t.baseState = e),
    (e = {
      pending: null,
      interleaved: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: gr,
      lastRenderedState: e,
    }),
    (t.queue = e),
    (e = e.dispatch = Kp.bind(null, Z, e)),
    [t.memoizedState, e]
  );
}
function vr(e, t, n, r) {
  return (
    (e = { tag: e, create: t, destroy: n, deps: r, next: null }),
    (t = Z.updateQueue),
    t === null
      ? ((t = { lastEffect: null, stores: null }),
        (Z.updateQueue = t),
        (t.lastEffect = e.next = e))
      : ((n = t.lastEffect),
        n === null
          ? (t.lastEffect = e.next = e)
          : ((r = n.next), (n.next = e), (e.next = r), (t.lastEffect = e))),
    e
  );
}
function Pc() {
  return Be().memoizedState;
}
function es(e, t, n, r) {
  var s = Xe();
  (Z.flags |= e),
    (s.memoizedState = vr(1 | t, n, void 0, r === void 0 ? null : r));
}
function Fs(e, t, n, r) {
  var s = Be();
  r = r === void 0 ? null : r;
  var i = void 0;
  if (ie !== null) {
    var o = ie.memoizedState;
    if (((i = o.destroy), r !== null && to(r, o.deps))) {
      s.memoizedState = vr(t, n, i, r);
      return;
    }
  }
  (Z.flags |= e), (s.memoizedState = vr(1 | t, n, i, r));
}
function ka(e, t) {
  return es(8390656, 8, e, t);
}
function so(e, t) {
  return Fs(2048, 8, e, t);
}
function _c(e, t) {
  return Fs(4, 2, e, t);
}
function Rc(e, t) {
  return Fs(4, 4, e, t);
}
function Tc(e, t) {
  if (typeof t == "function")
    return (
      (e = e()),
      t(e),
      function () {
        t(null);
      }
    );
  if (t != null)
    return (
      (e = e()),
      (t.current = e),
      function () {
        t.current = null;
      }
    );
}
function Lc(e, t, n) {
  return (
    (n = n != null ? n.concat([e]) : null), Fs(4, 4, Tc.bind(null, t, e), n)
  );
}
function lo() {}
function Ic(e, t) {
  var n = Be();
  t = t === void 0 ? null : t;
  var r = n.memoizedState;
  return r !== null && t !== null && to(t, r[1])
    ? r[0]
    : ((n.memoizedState = [e, t]), e);
}
function Mc(e, t) {
  var n = Be();
  t = t === void 0 ? null : t;
  var r = n.memoizedState;
  return r !== null && t !== null && to(t, r[1])
    ? r[0]
    : ((e = e()), (n.memoizedState = [e, t]), e);
}
function zc(e, t, n) {
  return Qt & 21
    ? (Ge(n, t) || ((n = $u()), (Z.lanes |= n), (Kt |= n), (e.baseState = !0)),
      t)
    : (e.baseState && ((e.baseState = !1), (Ne = !0)), (e.memoizedState = n));
}
function qp(e, t) {
  var n = H;
  (H = n !== 0 && 4 > n ? n : 4), e(!0);
  var r = xl.transition;
  xl.transition = {};
  try {
    e(!1), t();
  } finally {
    (H = n), (xl.transition = r);
  }
}
function Oc() {
  return Be().memoizedState;
}
function Qp(e, t, n) {
  var r = _t(e);
  if (
    ((n = {
      lane: r,
      action: n,
      hasEagerState: !1,
      eagerState: null,
      next: null,
    }),
    Dc(e))
  )
    bc(t, n);
  else if (((n = vc(e, t, n, r)), n !== null)) {
    var s = ye();
    Ke(n, e, r, s), Uc(n, t, r);
  }
}
function Kp(e, t, n) {
  var r = _t(e),
    s = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null };
  if (Dc(e)) bc(t, s);
  else {
    var i = e.alternate;
    if (
      e.lanes === 0 &&
      (i === null || i.lanes === 0) &&
      ((i = t.lastRenderedReducer), i !== null)
    )
      try {
        var o = t.lastRenderedState,
          a = i(o, n);
        if (((s.hasEagerState = !0), (s.eagerState = a), Ge(a, o))) {
          var u = t.interleaved;
          u === null
            ? ((s.next = s), Yi(t))
            : ((s.next = u.next), (u.next = s)),
            (t.interleaved = s);
          return;
        }
      } catch {
      } finally {
      }
    (n = vc(e, t, s, r)),
      n !== null && ((s = ye()), Ke(n, e, r, s), Uc(n, t, r));
  }
}
function Dc(e) {
  var t = e.alternate;
  return e === Z || (t !== null && t === Z);
}
function bc(e, t) {
  Xn = ks = !0;
  var n = e.pending;
  n === null ? (t.next = t) : ((t.next = n.next), (n.next = t)),
    (e.pending = t);
}
function Uc(e, t, n) {
  if (n & 4194240) {
    var r = t.lanes;
    (r &= e.pendingLanes), (n |= r), (t.lanes = n), Di(e, n);
  }
}
var Ns = {
    readContext: Fe,
    useCallback: pe,
    useContext: pe,
    useEffect: pe,
    useImperativeHandle: pe,
    useInsertionEffect: pe,
    useLayoutEffect: pe,
    useMemo: pe,
    useReducer: pe,
    useRef: pe,
    useState: pe,
    useDebugValue: pe,
    useDeferredValue: pe,
    useTransition: pe,
    useMutableSource: pe,
    useSyncExternalStore: pe,
    useId: pe,
    unstable_isNewReconciler: !1,
  },
  Gp = {
    readContext: Fe,
    useCallback: function (e, t) {
      return (Xe().memoizedState = [e, t === void 0 ? null : t]), e;
    },
    useContext: Fe,
    useEffect: ka,
    useImperativeHandle: function (e, t, n) {
      return (
        (n = n != null ? n.concat([e]) : null),
        es(4194308, 4, Tc.bind(null, t, e), n)
      );
    },
    useLayoutEffect: function (e, t) {
      return es(4194308, 4, e, t);
    },
    useInsertionEffect: function (e, t) {
      return es(4, 2, e, t);
    },
    useMemo: function (e, t) {
      var n = Xe();
      return (
        (t = t === void 0 ? null : t), (e = e()), (n.memoizedState = [e, t]), e
      );
    },
    useReducer: function (e, t, n) {
      var r = Xe();
      return (
        (t = n !== void 0 ? n(t) : t),
        (r.memoizedState = r.baseState = t),
        (e = {
          pending: null,
          interleaved: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: e,
          lastRenderedState: t,
        }),
        (r.queue = e),
        (e = e.dispatch = Qp.bind(null, Z, e)),
        [r.memoizedState, e]
      );
    },
    useRef: function (e) {
      var t = Xe();
      return (e = { current: e }), (t.memoizedState = e);
    },
    useState: wa,
    useDebugValue: lo,
    useDeferredValue: function (e) {
      return (Xe().memoizedState = e);
    },
    useTransition: function () {
      var e = wa(!1),
        t = e[0];
      return (e = qp.bind(null, e[1])), (Xe().memoizedState = e), [t, e];
    },
    useMutableSource: function () {},
    useSyncExternalStore: function (e, t, n) {
      var r = Z,
        s = Xe();
      if (X) {
        if (n === void 0) throw Error(E(407));
        n = n();
      } else {
        if (((n = t()), ue === null)) throw Error(E(349));
        Qt & 30 || kc(r, t, n);
      }
      s.memoizedState = n;
      var i = { value: n, getSnapshot: t };
      return (
        (s.queue = i),
        ka(Sc.bind(null, r, i, e), [e]),
        (r.flags |= 2048),
        vr(9, Nc.bind(null, r, i, n, t), void 0, null),
        n
      );
    },
    useId: function () {
      var e = Xe(),
        t = ue.identifierPrefix;
      if (X) {
        var n = it,
          r = lt;
        (n = (r & ~(1 << (32 - Qe(r) - 1))).toString(32) + n),
          (t = ":" + t + "R" + n),
          (n = mr++),
          0 < n && (t += "H" + n.toString(32)),
          (t += ":");
      } else (n = Wp++), (t = ":" + t + "r" + n.toString(32) + ":");
      return (e.memoizedState = t);
    },
    unstable_isNewReconciler: !1,
  },
  Yp = {
    readContext: Fe,
    useCallback: Ic,
    useContext: Fe,
    useEffect: so,
    useImperativeHandle: Lc,
    useInsertionEffect: _c,
    useLayoutEffect: Rc,
    useMemo: Mc,
    useReducer: jl,
    useRef: Pc,
    useState: function () {
      return jl(gr);
    },
    useDebugValue: lo,
    useDeferredValue: function (e) {
      var t = Be();
      return zc(t, ie.memoizedState, e);
    },
    useTransition: function () {
      var e = jl(gr)[0],
        t = Be().memoizedState;
      return [e, t];
    },
    useMutableSource: jc,
    useSyncExternalStore: wc,
    useId: Oc,
    unstable_isNewReconciler: !1,
  },
  Xp = {
    readContext: Fe,
    useCallback: Ic,
    useContext: Fe,
    useEffect: so,
    useImperativeHandle: Lc,
    useInsertionEffect: _c,
    useLayoutEffect: Rc,
    useMemo: Mc,
    useReducer: wl,
    useRef: Pc,
    useState: function () {
      return wl(gr);
    },
    useDebugValue: lo,
    useDeferredValue: function (e) {
      var t = Be();
      return ie === null ? (t.memoizedState = e) : zc(t, ie.memoizedState, e);
    },
    useTransition: function () {
      var e = wl(gr)[0],
        t = Be().memoizedState;
      return [e, t];
    },
    useMutableSource: jc,
    useSyncExternalStore: wc,
    useId: Oc,
    unstable_isNewReconciler: !1,
  };
function He(e, t) {
  if (e && e.defaultProps) {
    (t = ee({}, t)), (e = e.defaultProps);
    for (var n in e) t[n] === void 0 && (t[n] = e[n]);
    return t;
  }
  return t;
}
function li(e, t, n, r) {
  (t = e.memoizedState),
    (n = n(r, t)),
    (n = n == null ? t : ee({}, t, n)),
    (e.memoizedState = n),
    e.lanes === 0 && (e.updateQueue.baseState = n);
}
var Bs = {
  isMounted: function (e) {
    return (e = e._reactInternals) ? Jt(e) === e : !1;
  },
  enqueueSetState: function (e, t, n) {
    e = e._reactInternals;
    var r = ye(),
      s = _t(e),
      i = ot(r, s);
    (i.payload = t),
      n != null && (i.callback = n),
      (t = Et(e, i, s)),
      t !== null && (Ke(t, e, s, r), Jr(t, e, s));
  },
  enqueueReplaceState: function (e, t, n) {
    e = e._reactInternals;
    var r = ye(),
      s = _t(e),
      i = ot(r, s);
    (i.tag = 1),
      (i.payload = t),
      n != null && (i.callback = n),
      (t = Et(e, i, s)),
      t !== null && (Ke(t, e, s, r), Jr(t, e, s));
  },
  enqueueForceUpdate: function (e, t) {
    e = e._reactInternals;
    var n = ye(),
      r = _t(e),
      s = ot(n, r);
    (s.tag = 2),
      t != null && (s.callback = t),
      (t = Et(e, s, r)),
      t !== null && (Ke(t, e, r, n), Jr(t, e, r));
  },
};
function Na(e, t, n, r, s, i, o) {
  return (
    (e = e.stateNode),
    typeof e.shouldComponentUpdate == "function"
      ? e.shouldComponentUpdate(r, i, o)
      : t.prototype && t.prototype.isPureReactComponent
      ? !ur(n, r) || !ur(s, i)
      : !0
  );
}
function $c(e, t, n) {
  var r = !1,
    s = It,
    i = t.contextType;
  return (
    typeof i == "object" && i !== null
      ? (i = Fe(i))
      : ((s = Ce(t) ? Wt : ge.current),
        (r = t.contextTypes),
        (i = (r = r != null) ? Nn(e, s) : It)),
    (t = new t(n, i)),
    (e.memoizedState = t.state !== null && t.state !== void 0 ? t.state : null),
    (t.updater = Bs),
    (e.stateNode = t),
    (t._reactInternals = e),
    r &&
      ((e = e.stateNode),
      (e.__reactInternalMemoizedUnmaskedChildContext = s),
      (e.__reactInternalMemoizedMaskedChildContext = i)),
    t
  );
}
function Sa(e, t, n, r) {
  (e = t.state),
    typeof t.componentWillReceiveProps == "function" &&
      t.componentWillReceiveProps(n, r),
    typeof t.UNSAFE_componentWillReceiveProps == "function" &&
      t.UNSAFE_componentWillReceiveProps(n, r),
    t.state !== e && Bs.enqueueReplaceState(t, t.state, null);
}
function ii(e, t, n, r) {
  var s = e.stateNode;
  (s.props = n), (s.state = e.memoizedState), (s.refs = {}), Xi(e);
  var i = t.contextType;
  typeof i == "object" && i !== null
    ? (s.context = Fe(i))
    : ((i = Ce(t) ? Wt : ge.current), (s.context = Nn(e, i))),
    (s.state = e.memoizedState),
    (i = t.getDerivedStateFromProps),
    typeof i == "function" && (li(e, t, i, n), (s.state = e.memoizedState)),
    typeof t.getDerivedStateFromProps == "function" ||
      typeof s.getSnapshotBeforeUpdate == "function" ||
      (typeof s.UNSAFE_componentWillMount != "function" &&
        typeof s.componentWillMount != "function") ||
      ((t = s.state),
      typeof s.componentWillMount == "function" && s.componentWillMount(),
      typeof s.UNSAFE_componentWillMount == "function" &&
        s.UNSAFE_componentWillMount(),
      t !== s.state && Bs.enqueueReplaceState(s, s.state, null),
      js(e, n, s, r),
      (s.state = e.memoizedState)),
    typeof s.componentDidMount == "function" && (e.flags |= 4194308);
}
function Pn(e, t) {
  try {
    var n = "",
      r = t;
    do (n += Cf(r)), (r = r.return);
    while (r);
    var s = n;
  } catch (i) {
    s =
      `
Error generating stack: ` +
      i.message +
      `
` +
      i.stack;
  }
  return { value: e, source: t, stack: s, digest: null };
}
function kl(e, t, n) {
  return { value: e, source: null, stack: n ?? null, digest: t ?? null };
}
function oi(e, t) {
  try {
    console.error(t.value);
  } catch (n) {
    setTimeout(function () {
      throw n;
    });
  }
}
var Jp = typeof WeakMap == "function" ? WeakMap : Map;
function Ac(e, t, n) {
  (n = ot(-1, n)), (n.tag = 3), (n.payload = { element: null });
  var r = t.value;
  return (
    (n.callback = function () {
      Cs || ((Cs = !0), (vi = r)), oi(e, t);
    }),
    n
  );
}
function Fc(e, t, n) {
  (n = ot(-1, n)), (n.tag = 3);
  var r = e.type.getDerivedStateFromError;
  if (typeof r == "function") {
    var s = t.value;
    (n.payload = function () {
      return r(s);
    }),
      (n.callback = function () {
        oi(e, t);
      });
  }
  var i = e.stateNode;
  return (
    i !== null &&
      typeof i.componentDidCatch == "function" &&
      (n.callback = function () {
        oi(e, t),
          typeof r != "function" &&
            (Pt === null ? (Pt = new Set([this])) : Pt.add(this));
        var o = t.stack;
        this.componentDidCatch(t.value, {
          componentStack: o !== null ? o : "",
        });
      }),
    n
  );
}
function Ca(e, t, n) {
  var r = e.pingCache;
  if (r === null) {
    r = e.pingCache = new Jp();
    var s = new Set();
    r.set(t, s);
  } else (s = r.get(t)), s === void 0 && ((s = new Set()), r.set(t, s));
  s.has(n) || (s.add(n), (e = fh.bind(null, e, t, n)), t.then(e, e));
}
function Ea(e) {
  do {
    var t;
    if (
      ((t = e.tag === 13) &&
        ((t = e.memoizedState), (t = t !== null ? t.dehydrated !== null : !0)),
      t)
    )
      return e;
    e = e.return;
  } while (e !== null);
  return null;
}
function Pa(e, t, n, r, s) {
  return e.mode & 1
    ? ((e.flags |= 65536), (e.lanes = s), e)
    : (e === t
        ? (e.flags |= 65536)
        : ((e.flags |= 128),
          (n.flags |= 131072),
          (n.flags &= -52805),
          n.tag === 1 &&
            (n.alternate === null
              ? (n.tag = 17)
              : ((t = ot(-1, 1)), (t.tag = 2), Et(n, t, 1))),
          (n.lanes |= 1)),
      e);
}
var Zp = ft.ReactCurrentOwner,
  Ne = !1;
function ve(e, t, n, r) {
  t.child = e === null ? gc(t, null, n, r) : Cn(t, e.child, n, r);
}
function _a(e, t, n, r, s) {
  n = n.render;
  var i = t.ref;
  return (
    jn(t, s),
    (r = no(e, t, n, r, i, s)),
    (n = ro()),
    e !== null && !Ne
      ? ((t.updateQueue = e.updateQueue),
        (t.flags &= -2053),
        (e.lanes &= ~s),
        dt(e, t, s))
      : (X && n && Hi(t), (t.flags |= 1), ve(e, t, r, s), t.child)
  );
}
function Ra(e, t, n, r, s) {
  if (e === null) {
    var i = n.type;
    return typeof i == "function" &&
      !ho(i) &&
      i.defaultProps === void 0 &&
      n.compare === null &&
      n.defaultProps === void 0
      ? ((t.tag = 15), (t.type = i), Bc(e, t, i, r, s))
      : ((e = ss(n.type, null, r, t, t.mode, s)),
        (e.ref = t.ref),
        (e.return = t),
        (t.child = e));
  }
  if (((i = e.child), !(e.lanes & s))) {
    var o = i.memoizedProps;
    if (
      ((n = n.compare), (n = n !== null ? n : ur), n(o, r) && e.ref === t.ref)
    )
      return dt(e, t, s);
  }
  return (
    (t.flags |= 1),
    (e = Rt(i, r)),
    (e.ref = t.ref),
    (e.return = t),
    (t.child = e)
  );
}
function Bc(e, t, n, r, s) {
  if (e !== null) {
    var i = e.memoizedProps;
    if (ur(i, r) && e.ref === t.ref)
      if (((Ne = !1), (t.pendingProps = r = i), (e.lanes & s) !== 0))
        e.flags & 131072 && (Ne = !0);
      else return (t.lanes = e.lanes), dt(e, t, s);
  }
  return ai(e, t, n, r, s);
}
function Vc(e, t, n) {
  var r = t.pendingProps,
    s = r.children,
    i = e !== null ? e.memoizedState : null;
  if (r.mode === "hidden")
    if (!(t.mode & 1))
      (t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }),
        Q(hn, Re),
        (Re |= n);
    else {
      if (!(n & 1073741824))
        return (
          (e = i !== null ? i.baseLanes | n : n),
          (t.lanes = t.childLanes = 1073741824),
          (t.memoizedState = {
            baseLanes: e,
            cachePool: null,
            transitions: null,
          }),
          (t.updateQueue = null),
          Q(hn, Re),
          (Re |= e),
          null
        );
      (t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }),
        (r = i !== null ? i.baseLanes : n),
        Q(hn, Re),
        (Re |= r);
    }
  else
    i !== null ? ((r = i.baseLanes | n), (t.memoizedState = null)) : (r = n),
      Q(hn, Re),
      (Re |= r);
  return ve(e, t, s, n), t.child;
}
function Hc(e, t) {
  var n = t.ref;
  ((e === null && n !== null) || (e !== null && e.ref !== n)) &&
    ((t.flags |= 512), (t.flags |= 2097152));
}
function ai(e, t, n, r, s) {
  var i = Ce(n) ? Wt : ge.current;
  return (
    (i = Nn(t, i)),
    jn(t, s),
    (n = no(e, t, n, r, i, s)),
    (r = ro()),
    e !== null && !Ne
      ? ((t.updateQueue = e.updateQueue),
        (t.flags &= -2053),
        (e.lanes &= ~s),
        dt(e, t, s))
      : (X && r && Hi(t), (t.flags |= 1), ve(e, t, n, s), t.child)
  );
}
function Ta(e, t, n, r, s) {
  if (Ce(n)) {
    var i = !0;
    ms(t);
  } else i = !1;
  if ((jn(t, s), t.stateNode === null))
    ts(e, t), $c(t, n, r), ii(t, n, r, s), (r = !0);
  else if (e === null) {
    var o = t.stateNode,
      a = t.memoizedProps;
    o.props = a;
    var u = o.context,
      c = n.contextType;
    typeof c == "object" && c !== null
      ? (c = Fe(c))
      : ((c = Ce(n) ? Wt : ge.current), (c = Nn(t, c)));
    var d = n.getDerivedStateFromProps,
      h =
        typeof d == "function" ||
        typeof o.getSnapshotBeforeUpdate == "function";
    h ||
      (typeof o.UNSAFE_componentWillReceiveProps != "function" &&
        typeof o.componentWillReceiveProps != "function") ||
      ((a !== r || u !== c) && Sa(t, o, r, c)),
      (mt = !1);
    var g = t.memoizedState;
    (o.state = g),
      js(t, r, o, s),
      (u = t.memoizedState),
      a !== r || g !== u || Se.current || mt
        ? (typeof d == "function" && (li(t, n, d, r), (u = t.memoizedState)),
          (a = mt || Na(t, n, a, r, g, u, c))
            ? (h ||
                (typeof o.UNSAFE_componentWillMount != "function" &&
                  typeof o.componentWillMount != "function") ||
                (typeof o.componentWillMount == "function" &&
                  o.componentWillMount(),
                typeof o.UNSAFE_componentWillMount == "function" &&
                  o.UNSAFE_componentWillMount()),
              typeof o.componentDidMount == "function" && (t.flags |= 4194308))
            : (typeof o.componentDidMount == "function" && (t.flags |= 4194308),
              (t.memoizedProps = r),
              (t.memoizedState = u)),
          (o.props = r),
          (o.state = u),
          (o.context = c),
          (r = a))
        : (typeof o.componentDidMount == "function" && (t.flags |= 4194308),
          (r = !1));
  } else {
    (o = t.stateNode),
      yc(e, t),
      (a = t.memoizedProps),
      (c = t.type === t.elementType ? a : He(t.type, a)),
      (o.props = c),
      (h = t.pendingProps),
      (g = o.context),
      (u = n.contextType),
      typeof u == "object" && u !== null
        ? (u = Fe(u))
        : ((u = Ce(n) ? Wt : ge.current), (u = Nn(t, u)));
    var w = n.getDerivedStateFromProps;
    (d =
      typeof w == "function" ||
      typeof o.getSnapshotBeforeUpdate == "function") ||
      (typeof o.UNSAFE_componentWillReceiveProps != "function" &&
        typeof o.componentWillReceiveProps != "function") ||
      ((a !== h || g !== u) && Sa(t, o, r, u)),
      (mt = !1),
      (g = t.memoizedState),
      (o.state = g),
      js(t, r, o, s);
    var k = t.memoizedState;
    a !== h || g !== k || Se.current || mt
      ? (typeof w == "function" && (li(t, n, w, r), (k = t.memoizedState)),
        (c = mt || Na(t, n, c, r, g, k, u) || !1)
          ? (d ||
              (typeof o.UNSAFE_componentWillUpdate != "function" &&
                typeof o.componentWillUpdate != "function") ||
              (typeof o.componentWillUpdate == "function" &&
                o.componentWillUpdate(r, k, u),
              typeof o.UNSAFE_componentWillUpdate == "function" &&
                o.UNSAFE_componentWillUpdate(r, k, u)),
            typeof o.componentDidUpdate == "function" && (t.flags |= 4),
            typeof o.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024))
          : (typeof o.componentDidUpdate != "function" ||
              (a === e.memoizedProps && g === e.memoizedState) ||
              (t.flags |= 4),
            typeof o.getSnapshotBeforeUpdate != "function" ||
              (a === e.memoizedProps && g === e.memoizedState) ||
              (t.flags |= 1024),
            (t.memoizedProps = r),
            (t.memoizedState = k)),
        (o.props = r),
        (o.state = k),
        (o.context = u),
        (r = c))
      : (typeof o.componentDidUpdate != "function" ||
          (a === e.memoizedProps && g === e.memoizedState) ||
          (t.flags |= 4),
        typeof o.getSnapshotBeforeUpdate != "function" ||
          (a === e.memoizedProps && g === e.memoizedState) ||
          (t.flags |= 1024),
        (r = !1));
  }
  return ui(e, t, n, r, i, s);
}
function ui(e, t, n, r, s, i) {
  Hc(e, t);
  var o = (t.flags & 128) !== 0;
  if (!r && !o) return s && ma(t, n, !1), dt(e, t, i);
  (r = t.stateNode), (Zp.current = t);
  var a =
    o && typeof n.getDerivedStateFromError != "function" ? null : r.render();
  return (
    (t.flags |= 1),
    e !== null && o
      ? ((t.child = Cn(t, e.child, null, i)), (t.child = Cn(t, null, a, i)))
      : ve(e, t, a, i),
    (t.memoizedState = r.state),
    s && ma(t, n, !0),
    t.child
  );
}
function Wc(e) {
  var t = e.stateNode;
  t.pendingContext
    ? ha(e, t.pendingContext, t.pendingContext !== t.context)
    : t.context && ha(e, t.context, !1),
    Ji(e, t.containerInfo);
}
function La(e, t, n, r, s) {
  return Sn(), qi(s), (t.flags |= 256), ve(e, t, n, r), t.child;
}
var ci = { dehydrated: null, treeContext: null, retryLane: 0 };
function di(e) {
  return { baseLanes: e, cachePool: null, transitions: null };
}
function qc(e, t, n) {
  var r = t.pendingProps,
    s = J.current,
    i = !1,
    o = (t.flags & 128) !== 0,
    a;
  if (
    ((a = o) ||
      (a = e !== null && e.memoizedState === null ? !1 : (s & 2) !== 0),
    a
      ? ((i = !0), (t.flags &= -129))
      : (e === null || e.memoizedState !== null) && (s |= 1),
    Q(J, s & 1),
    e === null)
  )
    return (
      ri(t),
      (e = t.memoizedState),
      e !== null && ((e = e.dehydrated), e !== null)
        ? (t.mode & 1
            ? e.data === "$!"
              ? (t.lanes = 8)
              : (t.lanes = 1073741824)
            : (t.lanes = 1),
          null)
        : ((o = r.children),
          (e = r.fallback),
          i
            ? ((r = t.mode),
              (i = t.child),
              (o = { mode: "hidden", children: o }),
              !(r & 1) && i !== null
                ? ((i.childLanes = 0), (i.pendingProps = o))
                : (i = Ws(o, r, 0, null)),
              (e = Ht(e, r, n, null)),
              (i.return = t),
              (e.return = t),
              (i.sibling = e),
              (t.child = i),
              (t.child.memoizedState = di(n)),
              (t.memoizedState = ci),
              e)
            : io(t, o))
    );
  if (((s = e.memoizedState), s !== null && ((a = s.dehydrated), a !== null)))
    return eh(e, t, o, r, a, s, n);
  if (i) {
    (i = r.fallback), (o = t.mode), (s = e.child), (a = s.sibling);
    var u = { mode: "hidden", children: r.children };
    return (
      !(o & 1) && t.child !== s
        ? ((r = t.child),
          (r.childLanes = 0),
          (r.pendingProps = u),
          (t.deletions = null))
        : ((r = Rt(s, u)), (r.subtreeFlags = s.subtreeFlags & 14680064)),
      a !== null ? (i = Rt(a, i)) : ((i = Ht(i, o, n, null)), (i.flags |= 2)),
      (i.return = t),
      (r.return = t),
      (r.sibling = i),
      (t.child = r),
      (r = i),
      (i = t.child),
      (o = e.child.memoizedState),
      (o =
        o === null
          ? di(n)
          : {
              baseLanes: o.baseLanes | n,
              cachePool: null,
              transitions: o.transitions,
            }),
      (i.memoizedState = o),
      (i.childLanes = e.childLanes & ~n),
      (t.memoizedState = ci),
      r
    );
  }
  return (
    (i = e.child),
    (e = i.sibling),
    (r = Rt(i, { mode: "visible", children: r.children })),
    !(t.mode & 1) && (r.lanes = n),
    (r.return = t),
    (r.sibling = null),
    e !== null &&
      ((n = t.deletions),
      n === null ? ((t.deletions = [e]), (t.flags |= 16)) : n.push(e)),
    (t.child = r),
    (t.memoizedState = null),
    r
  );
}
function io(e, t) {
  return (
    (t = Ws({ mode: "visible", children: t }, e.mode, 0, null)),
    (t.return = e),
    (e.child = t)
  );
}
function Br(e, t, n, r) {
  return (
    r !== null && qi(r),
    Cn(t, e.child, null, n),
    (e = io(t, t.pendingProps.children)),
    (e.flags |= 2),
    (t.memoizedState = null),
    e
  );
}
function eh(e, t, n, r, s, i, o) {
  if (n)
    return t.flags & 256
      ? ((t.flags &= -257), (r = kl(Error(E(422)))), Br(e, t, o, r))
      : t.memoizedState !== null
      ? ((t.child = e.child), (t.flags |= 128), null)
      : ((i = r.fallback),
        (s = t.mode),
        (r = Ws({ mode: "visible", children: r.children }, s, 0, null)),
        (i = Ht(i, s, o, null)),
        (i.flags |= 2),
        (r.return = t),
        (i.return = t),
        (r.sibling = i),
        (t.child = r),
        t.mode & 1 && Cn(t, e.child, null, o),
        (t.child.memoizedState = di(o)),
        (t.memoizedState = ci),
        i);
  if (!(t.mode & 1)) return Br(e, t, o, null);
  if (s.data === "$!") {
    if (((r = s.nextSibling && s.nextSibling.dataset), r)) var a = r.dgst;
    return (r = a), (i = Error(E(419))), (r = kl(i, r, void 0)), Br(e, t, o, r);
  }
  if (((a = (o & e.childLanes) !== 0), Ne || a)) {
    if (((r = ue), r !== null)) {
      switch (o & -o) {
        case 4:
          s = 2;
          break;
        case 16:
          s = 8;
          break;
        case 64:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
        case 67108864:
          s = 32;
          break;
        case 536870912:
          s = 268435456;
          break;
        default:
          s = 0;
      }
      (s = s & (r.suspendedLanes | o) ? 0 : s),
        s !== 0 &&
          s !== i.retryLane &&
          ((i.retryLane = s), ct(e, s), Ke(r, e, s, -1));
    }
    return po(), (r = kl(Error(E(421)))), Br(e, t, o, r);
  }
  return s.data === "$?"
    ? ((t.flags |= 128),
      (t.child = e.child),
      (t = ph.bind(null, e)),
      (s._reactRetry = t),
      null)
    : ((e = i.treeContext),
      (Te = Ct(s.nextSibling)),
      (Le = t),
      (X = !0),
      (qe = null),
      e !== null &&
        ((be[Ue++] = lt),
        (be[Ue++] = it),
        (be[Ue++] = qt),
        (lt = e.id),
        (it = e.overflow),
        (qt = t)),
      (t = io(t, r.children)),
      (t.flags |= 4096),
      t);
}
function Ia(e, t, n) {
  e.lanes |= t;
  var r = e.alternate;
  r !== null && (r.lanes |= t), si(e.return, t, n);
}
function Nl(e, t, n, r, s) {
  var i = e.memoizedState;
  i === null
    ? (e.memoizedState = {
        isBackwards: t,
        rendering: null,
        renderingStartTime: 0,
        last: r,
        tail: n,
        tailMode: s,
      })
    : ((i.isBackwards = t),
      (i.rendering = null),
      (i.renderingStartTime = 0),
      (i.last = r),
      (i.tail = n),
      (i.tailMode = s));
}
function Qc(e, t, n) {
  var r = t.pendingProps,
    s = r.revealOrder,
    i = r.tail;
  if ((ve(e, t, r.children, n), (r = J.current), r & 2))
    (r = (r & 1) | 2), (t.flags |= 128);
  else {
    if (e !== null && e.flags & 128)
      e: for (e = t.child; e !== null; ) {
        if (e.tag === 13) e.memoizedState !== null && Ia(e, n, t);
        else if (e.tag === 19) Ia(e, n, t);
        else if (e.child !== null) {
          (e.child.return = e), (e = e.child);
          continue;
        }
        if (e === t) break e;
        for (; e.sibling === null; ) {
          if (e.return === null || e.return === t) break e;
          e = e.return;
        }
        (e.sibling.return = e.return), (e = e.sibling);
      }
    r &= 1;
  }
  if ((Q(J, r), !(t.mode & 1))) t.memoizedState = null;
  else
    switch (s) {
      case "forwards":
        for (n = t.child, s = null; n !== null; )
          (e = n.alternate),
            e !== null && ws(e) === null && (s = n),
            (n = n.sibling);
        (n = s),
          n === null
            ? ((s = t.child), (t.child = null))
            : ((s = n.sibling), (n.sibling = null)),
          Nl(t, !1, s, n, i);
        break;
      case "backwards":
        for (n = null, s = t.child, t.child = null; s !== null; ) {
          if (((e = s.alternate), e !== null && ws(e) === null)) {
            t.child = s;
            break;
          }
          (e = s.sibling), (s.sibling = n), (n = s), (s = e);
        }
        Nl(t, !0, n, null, i);
        break;
      case "together":
        Nl(t, !1, null, null, void 0);
        break;
      default:
        t.memoizedState = null;
    }
  return t.child;
}
function ts(e, t) {
  !(t.mode & 1) &&
    e !== null &&
    ((e.alternate = null), (t.alternate = null), (t.flags |= 2));
}
function dt(e, t, n) {
  if (
    (e !== null && (t.dependencies = e.dependencies),
    (Kt |= t.lanes),
    !(n & t.childLanes))
  )
    return null;
  if (e !== null && t.child !== e.child) throw Error(E(153));
  if (t.child !== null) {
    for (
      e = t.child, n = Rt(e, e.pendingProps), t.child = n, n.return = t;
      e.sibling !== null;

    )
      (e = e.sibling), (n = n.sibling = Rt(e, e.pendingProps)), (n.return = t);
    n.sibling = null;
  }
  return t.child;
}
function th(e, t, n) {
  switch (t.tag) {
    case 3:
      Wc(t), Sn();
      break;
    case 5:
      xc(t);
      break;
    case 1:
      Ce(t.type) && ms(t);
      break;
    case 4:
      Ji(t, t.stateNode.containerInfo);
      break;
    case 10:
      var r = t.type._context,
        s = t.memoizedProps.value;
      Q(ys, r._currentValue), (r._currentValue = s);
      break;
    case 13:
      if (((r = t.memoizedState), r !== null))
        return r.dehydrated !== null
          ? (Q(J, J.current & 1), (t.flags |= 128), null)
          : n & t.child.childLanes
          ? qc(e, t, n)
          : (Q(J, J.current & 1),
            (e = dt(e, t, n)),
            e !== null ? e.sibling : null);
      Q(J, J.current & 1);
      break;
    case 19:
      if (((r = (n & t.childLanes) !== 0), e.flags & 128)) {
        if (r) return Qc(e, t, n);
        t.flags |= 128;
      }
      if (
        ((s = t.memoizedState),
        s !== null &&
          ((s.rendering = null), (s.tail = null), (s.lastEffect = null)),
        Q(J, J.current),
        r)
      )
        break;
      return null;
    case 22:
    case 23:
      return (t.lanes = 0), Vc(e, t, n);
  }
  return dt(e, t, n);
}
var Kc, fi, Gc, Yc;
Kc = function (e, t) {
  for (var n = t.child; n !== null; ) {
    if (n.tag === 5 || n.tag === 6) e.appendChild(n.stateNode);
    else if (n.tag !== 4 && n.child !== null) {
      (n.child.return = n), (n = n.child);
      continue;
    }
    if (n === t) break;
    for (; n.sibling === null; ) {
      if (n.return === null || n.return === t) return;
      n = n.return;
    }
    (n.sibling.return = n.return), (n = n.sibling);
  }
};
fi = function () {};
Gc = function (e, t, n, r) {
  var s = e.memoizedProps;
  if (s !== r) {
    (e = t.stateNode), Bt(et.current);
    var i = null;
    switch (n) {
      case "input":
        (s = zl(e, s)), (r = zl(e, r)), (i = []);
        break;
      case "select":
        (s = ee({}, s, { value: void 0 })),
          (r = ee({}, r, { value: void 0 })),
          (i = []);
        break;
      case "textarea":
        (s = bl(e, s)), (r = bl(e, r)), (i = []);
        break;
      default:
        typeof s.onClick != "function" &&
          typeof r.onClick == "function" &&
          (e.onclick = ps);
    }
    $l(n, r);
    var o;
    n = null;
    for (c in s)
      if (!r.hasOwnProperty(c) && s.hasOwnProperty(c) && s[c] != null)
        if (c === "style") {
          var a = s[c];
          for (o in a) a.hasOwnProperty(o) && (n || (n = {}), (n[o] = ""));
        } else
          c !== "dangerouslySetInnerHTML" &&
            c !== "children" &&
            c !== "suppressContentEditableWarning" &&
            c !== "suppressHydrationWarning" &&
            c !== "autoFocus" &&
            (nr.hasOwnProperty(c)
              ? i || (i = [])
              : (i = i || []).push(c, null));
    for (c in r) {
      var u = r[c];
      if (
        ((a = s != null ? s[c] : void 0),
        r.hasOwnProperty(c) && u !== a && (u != null || a != null))
      )
        if (c === "style")
          if (a) {
            for (o in a)
              !a.hasOwnProperty(o) ||
                (u && u.hasOwnProperty(o)) ||
                (n || (n = {}), (n[o] = ""));
            for (o in u)
              u.hasOwnProperty(o) &&
                a[o] !== u[o] &&
                (n || (n = {}), (n[o] = u[o]));
          } else n || (i || (i = []), i.push(c, n)), (n = u);
        else
          c === "dangerouslySetInnerHTML"
            ? ((u = u ? u.__html : void 0),
              (a = a ? a.__html : void 0),
              u != null && a !== u && (i = i || []).push(c, u))
            : c === "children"
            ? (typeof u != "string" && typeof u != "number") ||
              (i = i || []).push(c, "" + u)
            : c !== "suppressContentEditableWarning" &&
              c !== "suppressHydrationWarning" &&
              (nr.hasOwnProperty(c)
                ? (u != null && c === "onScroll" && G("scroll", e),
                  i || a === u || (i = []))
                : (i = i || []).push(c, u));
    }
    n && (i = i || []).push("style", n);
    var c = i;
    (t.updateQueue = c) && (t.flags |= 4);
  }
};
Yc = function (e, t, n, r) {
  n !== r && (t.flags |= 4);
};
function An(e, t) {
  if (!X)
    switch (e.tailMode) {
      case "hidden":
        t = e.tail;
        for (var n = null; t !== null; )
          t.alternate !== null && (n = t), (t = t.sibling);
        n === null ? (e.tail = null) : (n.sibling = null);
        break;
      case "collapsed":
        n = e.tail;
        for (var r = null; n !== null; )
          n.alternate !== null && (r = n), (n = n.sibling);
        r === null
          ? t || e.tail === null
            ? (e.tail = null)
            : (e.tail.sibling = null)
          : (r.sibling = null);
    }
}
function he(e) {
  var t = e.alternate !== null && e.alternate.child === e.child,
    n = 0,
    r = 0;
  if (t)
    for (var s = e.child; s !== null; )
      (n |= s.lanes | s.childLanes),
        (r |= s.subtreeFlags & 14680064),
        (r |= s.flags & 14680064),
        (s.return = e),
        (s = s.sibling);
  else
    for (s = e.child; s !== null; )
      (n |= s.lanes | s.childLanes),
        (r |= s.subtreeFlags),
        (r |= s.flags),
        (s.return = e),
        (s = s.sibling);
  return (e.subtreeFlags |= r), (e.childLanes = n), t;
}
function nh(e, t, n) {
  var r = t.pendingProps;
  switch ((Wi(t), t.tag)) {
    case 2:
    case 16:
    case 15:
    case 0:
    case 11:
    case 7:
    case 8:
    case 12:
    case 9:
    case 14:
      return he(t), null;
    case 1:
      return Ce(t.type) && hs(), he(t), null;
    case 3:
      return (
        (r = t.stateNode),
        En(),
        Y(Se),
        Y(ge),
        eo(),
        r.pendingContext &&
          ((r.context = r.pendingContext), (r.pendingContext = null)),
        (e === null || e.child === null) &&
          (Ar(t)
            ? (t.flags |= 4)
            : e === null ||
              (e.memoizedState.isDehydrated && !(t.flags & 256)) ||
              ((t.flags |= 1024), qe !== null && (ji(qe), (qe = null)))),
        fi(e, t),
        he(t),
        null
      );
    case 5:
      Zi(t);
      var s = Bt(hr.current);
      if (((n = t.type), e !== null && t.stateNode != null))
        Gc(e, t, n, r, s),
          e.ref !== t.ref && ((t.flags |= 512), (t.flags |= 2097152));
      else {
        if (!r) {
          if (t.stateNode === null) throw Error(E(166));
          return he(t), null;
        }
        if (((e = Bt(et.current)), Ar(t))) {
          (r = t.stateNode), (n = t.type);
          var i = t.memoizedProps;
          switch (((r[Je] = t), (r[fr] = i), (e = (t.mode & 1) !== 0), n)) {
            case "dialog":
              G("cancel", r), G("close", r);
              break;
            case "iframe":
            case "object":
            case "embed":
              G("load", r);
              break;
            case "video":
            case "audio":
              for (s = 0; s < Wn.length; s++) G(Wn[s], r);
              break;
            case "source":
              G("error", r);
              break;
            case "img":
            case "image":
            case "link":
              G("error", r), G("load", r);
              break;
            case "details":
              G("toggle", r);
              break;
            case "input":
              Fo(r, i), G("invalid", r);
              break;
            case "select":
              (r._wrapperState = { wasMultiple: !!i.multiple }),
                G("invalid", r);
              break;
            case "textarea":
              Vo(r, i), G("invalid", r);
          }
          $l(n, i), (s = null);
          for (var o in i)
            if (i.hasOwnProperty(o)) {
              var a = i[o];
              o === "children"
                ? typeof a == "string"
                  ? r.textContent !== a &&
                    (i.suppressHydrationWarning !== !0 &&
                      $r(r.textContent, a, e),
                    (s = ["children", a]))
                  : typeof a == "number" &&
                    r.textContent !== "" + a &&
                    (i.suppressHydrationWarning !== !0 &&
                      $r(r.textContent, a, e),
                    (s = ["children", "" + a]))
                : nr.hasOwnProperty(o) &&
                  a != null &&
                  o === "onScroll" &&
                  G("scroll", r);
            }
          switch (n) {
            case "input":
              Lr(r), Bo(r, i, !0);
              break;
            case "textarea":
              Lr(r), Ho(r);
              break;
            case "select":
            case "option":
              break;
            default:
              typeof i.onClick == "function" && (r.onclick = ps);
          }
          (r = s), (t.updateQueue = r), r !== null && (t.flags |= 4);
        } else {
          (o = s.nodeType === 9 ? s : s.ownerDocument),
            e === "http://www.w3.org/1999/xhtml" && (e = Su(n)),
            e === "http://www.w3.org/1999/xhtml"
              ? n === "script"
                ? ((e = o.createElement("div")),
                  (e.innerHTML = "<script></script>"),
                  (e = e.removeChild(e.firstChild)))
                : typeof r.is == "string"
                ? (e = o.createElement(n, { is: r.is }))
                : ((e = o.createElement(n)),
                  n === "select" &&
                    ((o = e),
                    r.multiple
                      ? (o.multiple = !0)
                      : r.size && (o.size = r.size)))
              : (e = o.createElementNS(e, n)),
            (e[Je] = t),
            (e[fr] = r),
            Kc(e, t, !1, !1),
            (t.stateNode = e);
          e: {
            switch (((o = Al(n, r)), n)) {
              case "dialog":
                G("cancel", e), G("close", e), (s = r);
                break;
              case "iframe":
              case "object":
              case "embed":
                G("load", e), (s = r);
                break;
              case "video":
              case "audio":
                for (s = 0; s < Wn.length; s++) G(Wn[s], e);
                s = r;
                break;
              case "source":
                G("error", e), (s = r);
                break;
              case "img":
              case "image":
              case "link":
                G("error", e), G("load", e), (s = r);
                break;
              case "details":
                G("toggle", e), (s = r);
                break;
              case "input":
                Fo(e, r), (s = zl(e, r)), G("invalid", e);
                break;
              case "option":
                s = r;
                break;
              case "select":
                (e._wrapperState = { wasMultiple: !!r.multiple }),
                  (s = ee({}, r, { value: void 0 })),
                  G("invalid", e);
                break;
              case "textarea":
                Vo(e, r), (s = bl(e, r)), G("invalid", e);
                break;
              default:
                s = r;
            }
            $l(n, s), (a = s);
            for (i in a)
              if (a.hasOwnProperty(i)) {
                var u = a[i];
                i === "style"
                  ? Pu(e, u)
                  : i === "dangerouslySetInnerHTML"
                  ? ((u = u ? u.__html : void 0), u != null && Cu(e, u))
                  : i === "children"
                  ? typeof u == "string"
                    ? (n !== "textarea" || u !== "") && rr(e, u)
                    : typeof u == "number" && rr(e, "" + u)
                  : i !== "suppressContentEditableWarning" &&
                    i !== "suppressHydrationWarning" &&
                    i !== "autoFocus" &&
                    (nr.hasOwnProperty(i)
                      ? u != null && i === "onScroll" && G("scroll", e)
                      : u != null && Ti(e, i, u, o));
              }
            switch (n) {
              case "input":
                Lr(e), Bo(e, r, !1);
                break;
              case "textarea":
                Lr(e), Ho(e);
                break;
              case "option":
                r.value != null && e.setAttribute("value", "" + Lt(r.value));
                break;
              case "select":
                (e.multiple = !!r.multiple),
                  (i = r.value),
                  i != null
                    ? gn(e, !!r.multiple, i, !1)
                    : r.defaultValue != null &&
                      gn(e, !!r.multiple, r.defaultValue, !0);
                break;
              default:
                typeof s.onClick == "function" && (e.onclick = ps);
            }
            switch (n) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                r = !!r.autoFocus;
                break e;
              case "img":
                r = !0;
                break e;
              default:
                r = !1;
            }
          }
          r && (t.flags |= 4);
        }
        t.ref !== null && ((t.flags |= 512), (t.flags |= 2097152));
      }
      return he(t), null;
    case 6:
      if (e && t.stateNode != null) Yc(e, t, e.memoizedProps, r);
      else {
        if (typeof r != "string" && t.stateNode === null) throw Error(E(166));
        if (((n = Bt(hr.current)), Bt(et.current), Ar(t))) {
          if (
            ((r = t.stateNode),
            (n = t.memoizedProps),
            (r[Je] = t),
            (i = r.nodeValue !== n) && ((e = Le), e !== null))
          )
            switch (e.tag) {
              case 3:
                $r(r.nodeValue, n, (e.mode & 1) !== 0);
                break;
              case 5:
                e.memoizedProps.suppressHydrationWarning !== !0 &&
                  $r(r.nodeValue, n, (e.mode & 1) !== 0);
            }
          i && (t.flags |= 4);
        } else
          (r = (n.nodeType === 9 ? n : n.ownerDocument).createTextNode(r)),
            (r[Je] = t),
            (t.stateNode = r);
      }
      return he(t), null;
    case 13:
      if (
        (Y(J),
        (r = t.memoizedState),
        e === null ||
          (e.memoizedState !== null && e.memoizedState.dehydrated !== null))
      ) {
        if (X && Te !== null && t.mode & 1 && !(t.flags & 128))
          hc(), Sn(), (t.flags |= 98560), (i = !1);
        else if (((i = Ar(t)), r !== null && r.dehydrated !== null)) {
          if (e === null) {
            if (!i) throw Error(E(318));
            if (
              ((i = t.memoizedState),
              (i = i !== null ? i.dehydrated : null),
              !i)
            )
              throw Error(E(317));
            i[Je] = t;
          } else
            Sn(), !(t.flags & 128) && (t.memoizedState = null), (t.flags |= 4);
          he(t), (i = !1);
        } else qe !== null && (ji(qe), (qe = null)), (i = !0);
        if (!i) return t.flags & 65536 ? t : null;
      }
      return t.flags & 128
        ? ((t.lanes = n), t)
        : ((r = r !== null),
          r !== (e !== null && e.memoizedState !== null) &&
            r &&
            ((t.child.flags |= 8192),
            t.mode & 1 &&
              (e === null || J.current & 1 ? oe === 0 && (oe = 3) : po())),
          t.updateQueue !== null && (t.flags |= 4),
          he(t),
          null);
    case 4:
      return (
        En(), fi(e, t), e === null && cr(t.stateNode.containerInfo), he(t), null
      );
    case 10:
      return Gi(t.type._context), he(t), null;
    case 17:
      return Ce(t.type) && hs(), he(t), null;
    case 19:
      if ((Y(J), (i = t.memoizedState), i === null)) return he(t), null;
      if (((r = (t.flags & 128) !== 0), (o = i.rendering), o === null))
        if (r) An(i, !1);
        else {
          if (oe !== 0 || (e !== null && e.flags & 128))
            for (e = t.child; e !== null; ) {
              if (((o = ws(e)), o !== null)) {
                for (
                  t.flags |= 128,
                    An(i, !1),
                    r = o.updateQueue,
                    r !== null && ((t.updateQueue = r), (t.flags |= 4)),
                    t.subtreeFlags = 0,
                    r = n,
                    n = t.child;
                  n !== null;

                )
                  (i = n),
                    (e = r),
                    (i.flags &= 14680066),
                    (o = i.alternate),
                    o === null
                      ? ((i.childLanes = 0),
                        (i.lanes = e),
                        (i.child = null),
                        (i.subtreeFlags = 0),
                        (i.memoizedProps = null),
                        (i.memoizedState = null),
                        (i.updateQueue = null),
                        (i.dependencies = null),
                        (i.stateNode = null))
                      : ((i.childLanes = o.childLanes),
                        (i.lanes = o.lanes),
                        (i.child = o.child),
                        (i.subtreeFlags = 0),
                        (i.deletions = null),
                        (i.memoizedProps = o.memoizedProps),
                        (i.memoizedState = o.memoizedState),
                        (i.updateQueue = o.updateQueue),
                        (i.type = o.type),
                        (e = o.dependencies),
                        (i.dependencies =
                          e === null
                            ? null
                            : {
                                lanes: e.lanes,
                                firstContext: e.firstContext,
                              })),
                    (n = n.sibling);
                return Q(J, (J.current & 1) | 2), t.child;
              }
              e = e.sibling;
            }
          i.tail !== null &&
            re() > _n &&
            ((t.flags |= 128), (r = !0), An(i, !1), (t.lanes = 4194304));
        }
      else {
        if (!r)
          if (((e = ws(o)), e !== null)) {
            if (
              ((t.flags |= 128),
              (r = !0),
              (n = e.updateQueue),
              n !== null && ((t.updateQueue = n), (t.flags |= 4)),
              An(i, !0),
              i.tail === null && i.tailMode === "hidden" && !o.alternate && !X)
            )
              return he(t), null;
          } else
            2 * re() - i.renderingStartTime > _n &&
              n !== 1073741824 &&
              ((t.flags |= 128), (r = !0), An(i, !1), (t.lanes = 4194304));
        i.isBackwards
          ? ((o.sibling = t.child), (t.child = o))
          : ((n = i.last),
            n !== null ? (n.sibling = o) : (t.child = o),
            (i.last = o));
      }
      return i.tail !== null
        ? ((t = i.tail),
          (i.rendering = t),
          (i.tail = t.sibling),
          (i.renderingStartTime = re()),
          (t.sibling = null),
          (n = J.current),
          Q(J, r ? (n & 1) | 2 : n & 1),
          t)
        : (he(t), null);
    case 22:
    case 23:
      return (
        fo(),
        (r = t.memoizedState !== null),
        e !== null && (e.memoizedState !== null) !== r && (t.flags |= 8192),
        r && t.mode & 1
          ? Re & 1073741824 && (he(t), t.subtreeFlags & 6 && (t.flags |= 8192))
          : he(t),
        null
      );
    case 24:
      return null;
    case 25:
      return null;
  }
  throw Error(E(156, t.tag));
}
function rh(e, t) {
  switch ((Wi(t), t.tag)) {
    case 1:
      return (
        Ce(t.type) && hs(),
        (e = t.flags),
        e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
      );
    case 3:
      return (
        En(),
        Y(Se),
        Y(ge),
        eo(),
        (e = t.flags),
        e & 65536 && !(e & 128) ? ((t.flags = (e & -65537) | 128), t) : null
      );
    case 5:
      return Zi(t), null;
    case 13:
      if ((Y(J), (e = t.memoizedState), e !== null && e.dehydrated !== null)) {
        if (t.alternate === null) throw Error(E(340));
        Sn();
      }
      return (
        (e = t.flags), e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
      );
    case 19:
      return Y(J), null;
    case 4:
      return En(), null;
    case 10:
      return Gi(t.type._context), null;
    case 22:
    case 23:
      return fo(), null;
    case 24:
      return null;
    default:
      return null;
  }
}
var Vr = !1,
  me = !1,
  sh = typeof WeakSet == "function" ? WeakSet : Set,
  L = null;
function pn(e, t) {
  var n = e.ref;
  if (n !== null)
    if (typeof n == "function")
      try {
        n(null);
      } catch (r) {
        ne(e, t, r);
      }
    else n.current = null;
}
function pi(e, t, n) {
  try {
    n();
  } catch (r) {
    ne(e, t, r);
  }
}
var Ma = !1;
function lh(e, t) {
  if (((Yl = cs), (e = tc()), Vi(e))) {
    if ("selectionStart" in e)
      var n = { start: e.selectionStart, end: e.selectionEnd };
    else
      e: {
        n = ((n = e.ownerDocument) && n.defaultView) || window;
        var r = n.getSelection && n.getSelection();
        if (r && r.rangeCount !== 0) {
          n = r.anchorNode;
          var s = r.anchorOffset,
            i = r.focusNode;
          r = r.focusOffset;
          try {
            n.nodeType, i.nodeType;
          } catch {
            n = null;
            break e;
          }
          var o = 0,
            a = -1,
            u = -1,
            c = 0,
            d = 0,
            h = e,
            g = null;
          t: for (;;) {
            for (
              var w;
              h !== n || (s !== 0 && h.nodeType !== 3) || (a = o + s),
                h !== i || (r !== 0 && h.nodeType !== 3) || (u = o + r),
                h.nodeType === 3 && (o += h.nodeValue.length),
                (w = h.firstChild) !== null;

            )
              (g = h), (h = w);
            for (;;) {
              if (h === e) break t;
              if (
                (g === n && ++c === s && (a = o),
                g === i && ++d === r && (u = o),
                (w = h.nextSibling) !== null)
              )
                break;
              (h = g), (g = h.parentNode);
            }
            h = w;
          }
          n = a === -1 || u === -1 ? null : { start: a, end: u };
        } else n = null;
      }
    n = n || { start: 0, end: 0 };
  } else n = null;
  for (Xl = { focusedElem: e, selectionRange: n }, cs = !1, L = t; L !== null; )
    if (((t = L), (e = t.child), (t.subtreeFlags & 1028) !== 0 && e !== null))
      (e.return = t), (L = e);
    else
      for (; L !== null; ) {
        t = L;
        try {
          var k = t.alternate;
          if (t.flags & 1024)
            switch (t.tag) {
              case 0:
              case 11:
              case 15:
                break;
              case 1:
                if (k !== null) {
                  var x = k.memoizedProps,
                    C = k.memoizedState,
                    m = t.stateNode,
                    p = m.getSnapshotBeforeUpdate(
                      t.elementType === t.type ? x : He(t.type, x),
                      C
                    );
                  m.__reactInternalSnapshotBeforeUpdate = p;
                }
                break;
              case 3:
                var f = t.stateNode.containerInfo;
                f.nodeType === 1
                  ? (f.textContent = "")
                  : f.nodeType === 9 &&
                    f.documentElement &&
                    f.removeChild(f.documentElement);
                break;
              case 5:
              case 6:
              case 4:
              case 17:
                break;
              default:
                throw Error(E(163));
            }
        } catch (j) {
          ne(t, t.return, j);
        }
        if (((e = t.sibling), e !== null)) {
          (e.return = t.return), (L = e);
          break;
        }
        L = t.return;
      }
  return (k = Ma), (Ma = !1), k;
}
function Jn(e, t, n) {
  var r = t.updateQueue;
  if (((r = r !== null ? r.lastEffect : null), r !== null)) {
    var s = (r = r.next);
    do {
      if ((s.tag & e) === e) {
        var i = s.destroy;
        (s.destroy = void 0), i !== void 0 && pi(t, n, i);
      }
      s = s.next;
    } while (s !== r);
  }
}
function Vs(e, t) {
  if (
    ((t = t.updateQueue), (t = t !== null ? t.lastEffect : null), t !== null)
  ) {
    var n = (t = t.next);
    do {
      if ((n.tag & e) === e) {
        var r = n.create;
        n.destroy = r();
      }
      n = n.next;
    } while (n !== t);
  }
}
function hi(e) {
  var t = e.ref;
  if (t !== null) {
    var n = e.stateNode;
    switch (e.tag) {
      case 5:
        e = n;
        break;
      default:
        e = n;
    }
    typeof t == "function" ? t(e) : (t.current = e);
  }
}
function Xc(e) {
  var t = e.alternate;
  t !== null && ((e.alternate = null), Xc(t)),
    (e.child = null),
    (e.deletions = null),
    (e.sibling = null),
    e.tag === 5 &&
      ((t = e.stateNode),
      t !== null &&
        (delete t[Je], delete t[fr], delete t[ei], delete t[Fp], delete t[Bp])),
    (e.stateNode = null),
    (e.return = null),
    (e.dependencies = null),
    (e.memoizedProps = null),
    (e.memoizedState = null),
    (e.pendingProps = null),
    (e.stateNode = null),
    (e.updateQueue = null);
}
function Jc(e) {
  return e.tag === 5 || e.tag === 3 || e.tag === 4;
}
function za(e) {
  e: for (;;) {
    for (; e.sibling === null; ) {
      if (e.return === null || Jc(e.return)) return null;
      e = e.return;
    }
    for (
      e.sibling.return = e.return, e = e.sibling;
      e.tag !== 5 && e.tag !== 6 && e.tag !== 18;

    ) {
      if (e.flags & 2 || e.child === null || e.tag === 4) continue e;
      (e.child.return = e), (e = e.child);
    }
    if (!(e.flags & 2)) return e.stateNode;
  }
}
function mi(e, t, n) {
  var r = e.tag;
  if (r === 5 || r === 6)
    (e = e.stateNode),
      t
        ? n.nodeType === 8
          ? n.parentNode.insertBefore(e, t)
          : n.insertBefore(e, t)
        : (n.nodeType === 8
            ? ((t = n.parentNode), t.insertBefore(e, n))
            : ((t = n), t.appendChild(e)),
          (n = n._reactRootContainer),
          n != null || t.onclick !== null || (t.onclick = ps));
  else if (r !== 4 && ((e = e.child), e !== null))
    for (mi(e, t, n), e = e.sibling; e !== null; ) mi(e, t, n), (e = e.sibling);
}
function gi(e, t, n) {
  var r = e.tag;
  if (r === 5 || r === 6)
    (e = e.stateNode), t ? n.insertBefore(e, t) : n.appendChild(e);
  else if (r !== 4 && ((e = e.child), e !== null))
    for (gi(e, t, n), e = e.sibling; e !== null; ) gi(e, t, n), (e = e.sibling);
}
var ce = null,
  We = !1;
function pt(e, t, n) {
  for (n = n.child; n !== null; ) Zc(e, t, n), (n = n.sibling);
}
function Zc(e, t, n) {
  if (Ze && typeof Ze.onCommitFiberUnmount == "function")
    try {
      Ze.onCommitFiberUnmount(Os, n);
    } catch {}
  switch (n.tag) {
    case 5:
      me || pn(n, t);
    case 6:
      var r = ce,
        s = We;
      (ce = null),
        pt(e, t, n),
        (ce = r),
        (We = s),
        ce !== null &&
          (We
            ? ((e = ce),
              (n = n.stateNode),
              e.nodeType === 8 ? e.parentNode.removeChild(n) : e.removeChild(n))
            : ce.removeChild(n.stateNode));
      break;
    case 18:
      ce !== null &&
        (We
          ? ((e = ce),
            (n = n.stateNode),
            e.nodeType === 8
              ? gl(e.parentNode, n)
              : e.nodeType === 1 && gl(e, n),
            or(e))
          : gl(ce, n.stateNode));
      break;
    case 4:
      (r = ce),
        (s = We),
        (ce = n.stateNode.containerInfo),
        (We = !0),
        pt(e, t, n),
        (ce = r),
        (We = s);
      break;
    case 0:
    case 11:
    case 14:
    case 15:
      if (
        !me &&
        ((r = n.updateQueue), r !== null && ((r = r.lastEffect), r !== null))
      ) {
        s = r = r.next;
        do {
          var i = s,
            o = i.destroy;
          (i = i.tag),
            o !== void 0 && (i & 2 || i & 4) && pi(n, t, o),
            (s = s.next);
        } while (s !== r);
      }
      pt(e, t, n);
      break;
    case 1:
      if (
        !me &&
        (pn(n, t),
        (r = n.stateNode),
        typeof r.componentWillUnmount == "function")
      )
        try {
          (r.props = n.memoizedProps),
            (r.state = n.memoizedState),
            r.componentWillUnmount();
        } catch (a) {
          ne(n, t, a);
        }
      pt(e, t, n);
      break;
    case 21:
      pt(e, t, n);
      break;
    case 22:
      n.mode & 1
        ? ((me = (r = me) || n.memoizedState !== null), pt(e, t, n), (me = r))
        : pt(e, t, n);
      break;
    default:
      pt(e, t, n);
  }
}
function Oa(e) {
  var t = e.updateQueue;
  if (t !== null) {
    e.updateQueue = null;
    var n = e.stateNode;
    n === null && (n = e.stateNode = new sh()),
      t.forEach(function (r) {
        var s = hh.bind(null, e, r);
        n.has(r) || (n.add(r), r.then(s, s));
      });
  }
}
function Ve(e, t) {
  var n = t.deletions;
  if (n !== null)
    for (var r = 0; r < n.length; r++) {
      var s = n[r];
      try {
        var i = e,
          o = t,
          a = o;
        e: for (; a !== null; ) {
          switch (a.tag) {
            case 5:
              (ce = a.stateNode), (We = !1);
              break e;
            case 3:
              (ce = a.stateNode.containerInfo), (We = !0);
              break e;
            case 4:
              (ce = a.stateNode.containerInfo), (We = !0);
              break e;
          }
          a = a.return;
        }
        if (ce === null) throw Error(E(160));
        Zc(i, o, s), (ce = null), (We = !1);
        var u = s.alternate;
        u !== null && (u.return = null), (s.return = null);
      } catch (c) {
        ne(s, t, c);
      }
    }
  if (t.subtreeFlags & 12854)
    for (t = t.child; t !== null; ) ed(t, e), (t = t.sibling);
}
function ed(e, t) {
  var n = e.alternate,
    r = e.flags;
  switch (e.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
      if ((Ve(t, e), Ye(e), r & 4)) {
        try {
          Jn(3, e, e.return), Vs(3, e);
        } catch (x) {
          ne(e, e.return, x);
        }
        try {
          Jn(5, e, e.return);
        } catch (x) {
          ne(e, e.return, x);
        }
      }
      break;
    case 1:
      Ve(t, e), Ye(e), r & 512 && n !== null && pn(n, n.return);
      break;
    case 5:
      if (
        (Ve(t, e),
        Ye(e),
        r & 512 && n !== null && pn(n, n.return),
        e.flags & 32)
      ) {
        var s = e.stateNode;
        try {
          rr(s, "");
        } catch (x) {
          ne(e, e.return, x);
        }
      }
      if (r & 4 && ((s = e.stateNode), s != null)) {
        var i = e.memoizedProps,
          o = n !== null ? n.memoizedProps : i,
          a = e.type,
          u = e.updateQueue;
        if (((e.updateQueue = null), u !== null))
          try {
            a === "input" && i.type === "radio" && i.name != null && ku(s, i),
              Al(a, o);
            var c = Al(a, i);
            for (o = 0; o < u.length; o += 2) {
              var d = u[o],
                h = u[o + 1];
              d === "style"
                ? Pu(s, h)
                : d === "dangerouslySetInnerHTML"
                ? Cu(s, h)
                : d === "children"
                ? rr(s, h)
                : Ti(s, d, h, c);
            }
            switch (a) {
              case "input":
                Ol(s, i);
                break;
              case "textarea":
                Nu(s, i);
                break;
              case "select":
                var g = s._wrapperState.wasMultiple;
                s._wrapperState.wasMultiple = !!i.multiple;
                var w = i.value;
                w != null
                  ? gn(s, !!i.multiple, w, !1)
                  : g !== !!i.multiple &&
                    (i.defaultValue != null
                      ? gn(s, !!i.multiple, i.defaultValue, !0)
                      : gn(s, !!i.multiple, i.multiple ? [] : "", !1));
            }
            s[fr] = i;
          } catch (x) {
            ne(e, e.return, x);
          }
      }
      break;
    case 6:
      if ((Ve(t, e), Ye(e), r & 4)) {
        if (e.stateNode === null) throw Error(E(162));
        (s = e.stateNode), (i = e.memoizedProps);
        try {
          s.nodeValue = i;
        } catch (x) {
          ne(e, e.return, x);
        }
      }
      break;
    case 3:
      if (
        (Ve(t, e), Ye(e), r & 4 && n !== null && n.memoizedState.isDehydrated)
      )
        try {
          or(t.containerInfo);
        } catch (x) {
          ne(e, e.return, x);
        }
      break;
    case 4:
      Ve(t, e), Ye(e);
      break;
    case 13:
      Ve(t, e),
        Ye(e),
        (s = e.child),
        s.flags & 8192 &&
          ((i = s.memoizedState !== null),
          (s.stateNode.isHidden = i),
          !i ||
            (s.alternate !== null && s.alternate.memoizedState !== null) ||
            (uo = re())),
        r & 4 && Oa(e);
      break;
    case 22:
      if (
        ((d = n !== null && n.memoizedState !== null),
        e.mode & 1 ? ((me = (c = me) || d), Ve(t, e), (me = c)) : Ve(t, e),
        Ye(e),
        r & 8192)
      ) {
        if (
          ((c = e.memoizedState !== null),
          (e.stateNode.isHidden = c) && !d && e.mode & 1)
        )
          for (L = e, d = e.child; d !== null; ) {
            for (h = L = d; L !== null; ) {
              switch (((g = L), (w = g.child), g.tag)) {
                case 0:
                case 11:
                case 14:
                case 15:
                  Jn(4, g, g.return);
                  break;
                case 1:
                  pn(g, g.return);
                  var k = g.stateNode;
                  if (typeof k.componentWillUnmount == "function") {
                    (r = g), (n = g.return);
                    try {
                      (t = r),
                        (k.props = t.memoizedProps),
                        (k.state = t.memoizedState),
                        k.componentWillUnmount();
                    } catch (x) {
                      ne(r, n, x);
                    }
                  }
                  break;
                case 5:
                  pn(g, g.return);
                  break;
                case 22:
                  if (g.memoizedState !== null) {
                    ba(h);
                    continue;
                  }
              }
              w !== null ? ((w.return = g), (L = w)) : ba(h);
            }
            d = d.sibling;
          }
        e: for (d = null, h = e; ; ) {
          if (h.tag === 5) {
            if (d === null) {
              d = h;
              try {
                (s = h.stateNode),
                  c
                    ? ((i = s.style),
                      typeof i.setProperty == "function"
                        ? i.setProperty("display", "none", "important")
                        : (i.display = "none"))
                    : ((a = h.stateNode),
                      (u = h.memoizedProps.style),
                      (o =
                        u != null && u.hasOwnProperty("display")
                          ? u.display
                          : null),
                      (a.style.display = Eu("display", o)));
              } catch (x) {
                ne(e, e.return, x);
              }
            }
          } else if (h.tag === 6) {
            if (d === null)
              try {
                h.stateNode.nodeValue = c ? "" : h.memoizedProps;
              } catch (x) {
                ne(e, e.return, x);
              }
          } else if (
            ((h.tag !== 22 && h.tag !== 23) ||
              h.memoizedState === null ||
              h === e) &&
            h.child !== null
          ) {
            (h.child.return = h), (h = h.child);
            continue;
          }
          if (h === e) break e;
          for (; h.sibling === null; ) {
            if (h.return === null || h.return === e) break e;
            d === h && (d = null), (h = h.return);
          }
          d === h && (d = null), (h.sibling.return = h.return), (h = h.sibling);
        }
      }
      break;
    case 19:
      Ve(t, e), Ye(e), r & 4 && Oa(e);
      break;
    case 21:
      break;
    default:
      Ve(t, e), Ye(e);
  }
}
function Ye(e) {
  var t = e.flags;
  if (t & 2) {
    try {
      e: {
        for (var n = e.return; n !== null; ) {
          if (Jc(n)) {
            var r = n;
            break e;
          }
          n = n.return;
        }
        throw Error(E(160));
      }
      switch (r.tag) {
        case 5:
          var s = r.stateNode;
          r.flags & 32 && (rr(s, ""), (r.flags &= -33));
          var i = za(e);
          gi(e, i, s);
          break;
        case 3:
        case 4:
          var o = r.stateNode.containerInfo,
            a = za(e);
          mi(e, a, o);
          break;
        default:
          throw Error(E(161));
      }
    } catch (u) {
      ne(e, e.return, u);
    }
    e.flags &= -3;
  }
  t & 4096 && (e.flags &= -4097);
}
function ih(e, t, n) {
  (L = e), td(e);
}
function td(e, t, n) {
  for (var r = (e.mode & 1) !== 0; L !== null; ) {
    var s = L,
      i = s.child;
    if (s.tag === 22 && r) {
      var o = s.memoizedState !== null || Vr;
      if (!o) {
        var a = s.alternate,
          u = (a !== null && a.memoizedState !== null) || me;
        a = Vr;
        var c = me;
        if (((Vr = o), (me = u) && !c))
          for (L = s; L !== null; )
            (o = L),
              (u = o.child),
              o.tag === 22 && o.memoizedState !== null
                ? Ua(s)
                : u !== null
                ? ((u.return = o), (L = u))
                : Ua(s);
        for (; i !== null; ) (L = i), td(i), (i = i.sibling);
        (L = s), (Vr = a), (me = c);
      }
      Da(e);
    } else
      s.subtreeFlags & 8772 && i !== null ? ((i.return = s), (L = i)) : Da(e);
  }
}
function Da(e) {
  for (; L !== null; ) {
    var t = L;
    if (t.flags & 8772) {
      var n = t.alternate;
      try {
        if (t.flags & 8772)
          switch (t.tag) {
            case 0:
            case 11:
            case 15:
              me || Vs(5, t);
              break;
            case 1:
              var r = t.stateNode;
              if (t.flags & 4 && !me)
                if (n === null) r.componentDidMount();
                else {
                  var s =
                    t.elementType === t.type
                      ? n.memoizedProps
                      : He(t.type, n.memoizedProps);
                  r.componentDidUpdate(
                    s,
                    n.memoizedState,
                    r.__reactInternalSnapshotBeforeUpdate
                  );
                }
              var i = t.updateQueue;
              i !== null && ja(t, i, r);
              break;
            case 3:
              var o = t.updateQueue;
              if (o !== null) {
                if (((n = null), t.child !== null))
                  switch (t.child.tag) {
                    case 5:
                      n = t.child.stateNode;
                      break;
                    case 1:
                      n = t.child.stateNode;
                  }
                ja(t, o, n);
              }
              break;
            case 5:
              var a = t.stateNode;
              if (n === null && t.flags & 4) {
                n = a;
                var u = t.memoizedProps;
                switch (t.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    u.autoFocus && n.focus();
                    break;
                  case "img":
                    u.src && (n.src = u.src);
                }
              }
              break;
            case 6:
              break;
            case 4:
              break;
            case 12:
              break;
            case 13:
              if (t.memoizedState === null) {
                var c = t.alternate;
                if (c !== null) {
                  var d = c.memoizedState;
                  if (d !== null) {
                    var h = d.dehydrated;
                    h !== null && or(h);
                  }
                }
              }
              break;
            case 19:
            case 17:
            case 21:
            case 22:
            case 23:
            case 25:
              break;
            default:
              throw Error(E(163));
          }
        me || (t.flags & 512 && hi(t));
      } catch (g) {
        ne(t, t.return, g);
      }
    }
    if (t === e) {
      L = null;
      break;
    }
    if (((n = t.sibling), n !== null)) {
      (n.return = t.return), (L = n);
      break;
    }
    L = t.return;
  }
}
function ba(e) {
  for (; L !== null; ) {
    var t = L;
    if (t === e) {
      L = null;
      break;
    }
    var n = t.sibling;
    if (n !== null) {
      (n.return = t.return), (L = n);
      break;
    }
    L = t.return;
  }
}
function Ua(e) {
  for (; L !== null; ) {
    var t = L;
    try {
      switch (t.tag) {
        case 0:
        case 11:
        case 15:
          var n = t.return;
          try {
            Vs(4, t);
          } catch (u) {
            ne(t, n, u);
          }
          break;
        case 1:
          var r = t.stateNode;
          if (typeof r.componentDidMount == "function") {
            var s = t.return;
            try {
              r.componentDidMount();
            } catch (u) {
              ne(t, s, u);
            }
          }
          var i = t.return;
          try {
            hi(t);
          } catch (u) {
            ne(t, i, u);
          }
          break;
        case 5:
          var o = t.return;
          try {
            hi(t);
          } catch (u) {
            ne(t, o, u);
          }
      }
    } catch (u) {
      ne(t, t.return, u);
    }
    if (t === e) {
      L = null;
      break;
    }
    var a = t.sibling;
    if (a !== null) {
      (a.return = t.return), (L = a);
      break;
    }
    L = t.return;
  }
}
var oh = Math.ceil,
  Ss = ft.ReactCurrentDispatcher,
  oo = ft.ReactCurrentOwner,
  Ae = ft.ReactCurrentBatchConfig,
  A = 0,
  ue = null,
  se = null,
  de = 0,
  Re = 0,
  hn = zt(0),
  oe = 0,
  yr = null,
  Kt = 0,
  Hs = 0,
  ao = 0,
  Zn = null,
  ke = null,
  uo = 0,
  _n = 1 / 0,
  rt = null,
  Cs = !1,
  vi = null,
  Pt = null,
  Hr = !1,
  xt = null,
  Es = 0,
  er = 0,
  yi = null,
  ns = -1,
  rs = 0;
function ye() {
  return A & 6 ? re() : ns !== -1 ? ns : (ns = re());
}
function _t(e) {
  return e.mode & 1
    ? A & 2 && de !== 0
      ? de & -de
      : Hp.transition !== null
      ? (rs === 0 && (rs = $u()), rs)
      : ((e = H),
        e !== 0 || ((e = window.event), (e = e === void 0 ? 16 : qu(e.type))),
        e)
    : 1;
}
function Ke(e, t, n, r) {
  if (50 < er) throw ((er = 0), (yi = null), Error(E(185)));
  kr(e, n, r),
    (!(A & 2) || e !== ue) &&
      (e === ue && (!(A & 2) && (Hs |= n), oe === 4 && vt(e, de)),
      Ee(e, r),
      n === 1 && A === 0 && !(t.mode & 1) && ((_n = re() + 500), As && Ot()));
}
function Ee(e, t) {
  var n = e.callbackNode;
  Hf(e, t);
  var r = us(e, e === ue ? de : 0);
  if (r === 0)
    n !== null && Qo(n), (e.callbackNode = null), (e.callbackPriority = 0);
  else if (((t = r & -r), e.callbackPriority !== t)) {
    if ((n != null && Qo(n), t === 1))
      e.tag === 0 ? Vp($a.bind(null, e)) : dc($a.bind(null, e)),
        $p(function () {
          !(A & 6) && Ot();
        }),
        (n = null);
    else {
      switch (Au(r)) {
        case 1:
          n = Oi;
          break;
        case 4:
          n = bu;
          break;
        case 16:
          n = as;
          break;
        case 536870912:
          n = Uu;
          break;
        default:
          n = as;
      }
      n = ud(n, nd.bind(null, e));
    }
    (e.callbackPriority = t), (e.callbackNode = n);
  }
}
function nd(e, t) {
  if (((ns = -1), (rs = 0), A & 6)) throw Error(E(327));
  var n = e.callbackNode;
  if (wn() && e.callbackNode !== n) return null;
  var r = us(e, e === ue ? de : 0);
  if (r === 0) return null;
  if (r & 30 || r & e.expiredLanes || t) t = Ps(e, r);
  else {
    t = r;
    var s = A;
    A |= 2;
    var i = sd();
    (ue !== e || de !== t) && ((rt = null), (_n = re() + 500), Vt(e, t));
    do
      try {
        ch();
        break;
      } catch (a) {
        rd(e, a);
      }
    while (!0);
    Ki(),
      (Ss.current = i),
      (A = s),
      se !== null ? (t = 0) : ((ue = null), (de = 0), (t = oe));
  }
  if (t !== 0) {
    if (
      (t === 2 && ((s = Wl(e)), s !== 0 && ((r = s), (t = xi(e, s)))), t === 1)
    )
      throw ((n = yr), Vt(e, 0), vt(e, r), Ee(e, re()), n);
    if (t === 6) vt(e, r);
    else {
      if (
        ((s = e.current.alternate),
        !(r & 30) &&
          !ah(s) &&
          ((t = Ps(e, r)),
          t === 2 && ((i = Wl(e)), i !== 0 && ((r = i), (t = xi(e, i)))),
          t === 1))
      )
        throw ((n = yr), Vt(e, 0), vt(e, r), Ee(e, re()), n);
      switch (((e.finishedWork = s), (e.finishedLanes = r), t)) {
        case 0:
        case 1:
          throw Error(E(345));
        case 2:
          $t(e, ke, rt);
          break;
        case 3:
          if (
            (vt(e, r), (r & 130023424) === r && ((t = uo + 500 - re()), 10 < t))
          ) {
            if (us(e, 0) !== 0) break;
            if (((s = e.suspendedLanes), (s & r) !== r)) {
              ye(), (e.pingedLanes |= e.suspendedLanes & s);
              break;
            }
            e.timeoutHandle = Zl($t.bind(null, e, ke, rt), t);
            break;
          }
          $t(e, ke, rt);
          break;
        case 4:
          if ((vt(e, r), (r & 4194240) === r)) break;
          for (t = e.eventTimes, s = -1; 0 < r; ) {
            var o = 31 - Qe(r);
            (i = 1 << o), (o = t[o]), o > s && (s = o), (r &= ~i);
          }
          if (
            ((r = s),
            (r = re() - r),
            (r =
              (120 > r
                ? 120
                : 480 > r
                ? 480
                : 1080 > r
                ? 1080
                : 1920 > r
                ? 1920
                : 3e3 > r
                ? 3e3
                : 4320 > r
                ? 4320
                : 1960 * oh(r / 1960)) - r),
            10 < r)
          ) {
            e.timeoutHandle = Zl($t.bind(null, e, ke, rt), r);
            break;
          }
          $t(e, ke, rt);
          break;
        case 5:
          $t(e, ke, rt);
          break;
        default:
          throw Error(E(329));
      }
    }
  }
  return Ee(e, re()), e.callbackNode === n ? nd.bind(null, e) : null;
}
function xi(e, t) {
  var n = Zn;
  return (
    e.current.memoizedState.isDehydrated && (Vt(e, t).flags |= 256),
    (e = Ps(e, t)),
    e !== 2 && ((t = ke), (ke = n), t !== null && ji(t)),
    e
  );
}
function ji(e) {
  ke === null ? (ke = e) : ke.push.apply(ke, e);
}
function ah(e) {
  for (var t = e; ; ) {
    if (t.flags & 16384) {
      var n = t.updateQueue;
      if (n !== null && ((n = n.stores), n !== null))
        for (var r = 0; r < n.length; r++) {
          var s = n[r],
            i = s.getSnapshot;
          s = s.value;
          try {
            if (!Ge(i(), s)) return !1;
          } catch {
            return !1;
          }
        }
    }
    if (((n = t.child), t.subtreeFlags & 16384 && n !== null))
      (n.return = t), (t = n);
    else {
      if (t === e) break;
      for (; t.sibling === null; ) {
        if (t.return === null || t.return === e) return !0;
        t = t.return;
      }
      (t.sibling.return = t.return), (t = t.sibling);
    }
  }
  return !0;
}
function vt(e, t) {
  for (
    t &= ~ao,
      t &= ~Hs,
      e.suspendedLanes |= t,
      e.pingedLanes &= ~t,
      e = e.expirationTimes;
    0 < t;

  ) {
    var n = 31 - Qe(t),
      r = 1 << n;
    (e[n] = -1), (t &= ~r);
  }
}
function $a(e) {
  if (A & 6) throw Error(E(327));
  wn();
  var t = us(e, 0);
  if (!(t & 1)) return Ee(e, re()), null;
  var n = Ps(e, t);
  if (e.tag !== 0 && n === 2) {
    var r = Wl(e);
    r !== 0 && ((t = r), (n = xi(e, r)));
  }
  if (n === 1) throw ((n = yr), Vt(e, 0), vt(e, t), Ee(e, re()), n);
  if (n === 6) throw Error(E(345));
  return (
    (e.finishedWork = e.current.alternate),
    (e.finishedLanes = t),
    $t(e, ke, rt),
    Ee(e, re()),
    null
  );
}
function co(e, t) {
  var n = A;
  A |= 1;
  try {
    return e(t);
  } finally {
    (A = n), A === 0 && ((_n = re() + 500), As && Ot());
  }
}
function Gt(e) {
  xt !== null && xt.tag === 0 && !(A & 6) && wn();
  var t = A;
  A |= 1;
  var n = Ae.transition,
    r = H;
  try {
    if (((Ae.transition = null), (H = 1), e)) return e();
  } finally {
    (H = r), (Ae.transition = n), (A = t), !(A & 6) && Ot();
  }
}
function fo() {
  (Re = hn.current), Y(hn);
}
function Vt(e, t) {
  (e.finishedWork = null), (e.finishedLanes = 0);
  var n = e.timeoutHandle;
  if ((n !== -1 && ((e.timeoutHandle = -1), Up(n)), se !== null))
    for (n = se.return; n !== null; ) {
      var r = n;
      switch ((Wi(r), r.tag)) {
        case 1:
          (r = r.type.childContextTypes), r != null && hs();
          break;
        case 3:
          En(), Y(Se), Y(ge), eo();
          break;
        case 5:
          Zi(r);
          break;
        case 4:
          En();
          break;
        case 13:
          Y(J);
          break;
        case 19:
          Y(J);
          break;
        case 10:
          Gi(r.type._context);
          break;
        case 22:
        case 23:
          fo();
      }
      n = n.return;
    }
  if (
    ((ue = e),
    (se = e = Rt(e.current, null)),
    (de = Re = t),
    (oe = 0),
    (yr = null),
    (ao = Hs = Kt = 0),
    (ke = Zn = null),
    Ft !== null)
  ) {
    for (t = 0; t < Ft.length; t++)
      if (((n = Ft[t]), (r = n.interleaved), r !== null)) {
        n.interleaved = null;
        var s = r.next,
          i = n.pending;
        if (i !== null) {
          var o = i.next;
          (i.next = s), (r.next = o);
        }
        n.pending = r;
      }
    Ft = null;
  }
  return e;
}
function rd(e, t) {
  do {
    var n = se;
    try {
      if ((Ki(), (Zr.current = Ns), ks)) {
        for (var r = Z.memoizedState; r !== null; ) {
          var s = r.queue;
          s !== null && (s.pending = null), (r = r.next);
        }
        ks = !1;
      }
      if (
        ((Qt = 0),
        (ae = ie = Z = null),
        (Xn = !1),
        (mr = 0),
        (oo.current = null),
        n === null || n.return === null)
      ) {
        (oe = 1), (yr = t), (se = null);
        break;
      }
      e: {
        var i = e,
          o = n.return,
          a = n,
          u = t;
        if (
          ((t = de),
          (a.flags |= 32768),
          u !== null && typeof u == "object" && typeof u.then == "function")
        ) {
          var c = u,
            d = a,
            h = d.tag;
          if (!(d.mode & 1) && (h === 0 || h === 11 || h === 15)) {
            var g = d.alternate;
            g
              ? ((d.updateQueue = g.updateQueue),
                (d.memoizedState = g.memoizedState),
                (d.lanes = g.lanes))
              : ((d.updateQueue = null), (d.memoizedState = null));
          }
          var w = Ea(o);
          if (w !== null) {
            (w.flags &= -257),
              Pa(w, o, a, i, t),
              w.mode & 1 && Ca(i, c, t),
              (t = w),
              (u = c);
            var k = t.updateQueue;
            if (k === null) {
              var x = new Set();
              x.add(u), (t.updateQueue = x);
            } else k.add(u);
            break e;
          } else {
            if (!(t & 1)) {
              Ca(i, c, t), po();
              break e;
            }
            u = Error(E(426));
          }
        } else if (X && a.mode & 1) {
          var C = Ea(o);
          if (C !== null) {
            !(C.flags & 65536) && (C.flags |= 256),
              Pa(C, o, a, i, t),
              qi(Pn(u, a));
            break e;
          }
        }
        (i = u = Pn(u, a)),
          oe !== 4 && (oe = 2),
          Zn === null ? (Zn = [i]) : Zn.push(i),
          (i = o);
        do {
          switch (i.tag) {
            case 3:
              (i.flags |= 65536), (t &= -t), (i.lanes |= t);
              var m = Ac(i, u, t);
              xa(i, m);
              break e;
            case 1:
              a = u;
              var p = i.type,
                f = i.stateNode;
              if (
                !(i.flags & 128) &&
                (typeof p.getDerivedStateFromError == "function" ||
                  (f !== null &&
                    typeof f.componentDidCatch == "function" &&
                    (Pt === null || !Pt.has(f))))
              ) {
                (i.flags |= 65536), (t &= -t), (i.lanes |= t);
                var j = Fc(i, a, t);
                xa(i, j);
                break e;
              }
          }
          i = i.return;
        } while (i !== null);
      }
      id(n);
    } catch (S) {
      (t = S), se === n && n !== null && (se = n = n.return);
      continue;
    }
    break;
  } while (!0);
}
function sd() {
  var e = Ss.current;
  return (Ss.current = Ns), e === null ? Ns : e;
}
function po() {
  (oe === 0 || oe === 3 || oe === 2) && (oe = 4),
    ue === null || (!(Kt & 268435455) && !(Hs & 268435455)) || vt(ue, de);
}
function Ps(e, t) {
  var n = A;
  A |= 2;
  var r = sd();
  (ue !== e || de !== t) && ((rt = null), Vt(e, t));
  do
    try {
      uh();
      break;
    } catch (s) {
      rd(e, s);
    }
  while (!0);
  if ((Ki(), (A = n), (Ss.current = r), se !== null)) throw Error(E(261));
  return (ue = null), (de = 0), oe;
}
function uh() {
  for (; se !== null; ) ld(se);
}
function ch() {
  for (; se !== null && !Of(); ) ld(se);
}
function ld(e) {
  var t = ad(e.alternate, e, Re);
  (e.memoizedProps = e.pendingProps),
    t === null ? id(e) : (se = t),
    (oo.current = null);
}
function id(e) {
  var t = e;
  do {
    var n = t.alternate;
    if (((e = t.return), t.flags & 32768)) {
      if (((n = rh(n, t)), n !== null)) {
        (n.flags &= 32767), (se = n);
        return;
      }
      if (e !== null)
        (e.flags |= 32768), (e.subtreeFlags = 0), (e.deletions = null);
      else {
        (oe = 6), (se = null);
        return;
      }
    } else if (((n = nh(n, t, Re)), n !== null)) {
      se = n;
      return;
    }
    if (((t = t.sibling), t !== null)) {
      se = t;
      return;
    }
    se = t = e;
  } while (t !== null);
  oe === 0 && (oe = 5);
}
function $t(e, t, n) {
  var r = H,
    s = Ae.transition;
  try {
    (Ae.transition = null), (H = 1), dh(e, t, n, r);
  } finally {
    (Ae.transition = s), (H = r);
  }
  return null;
}
function dh(e, t, n, r) {
  do wn();
  while (xt !== null);
  if (A & 6) throw Error(E(327));
  n = e.finishedWork;
  var s = e.finishedLanes;
  if (n === null) return null;
  if (((e.finishedWork = null), (e.finishedLanes = 0), n === e.current))
    throw Error(E(177));
  (e.callbackNode = null), (e.callbackPriority = 0);
  var i = n.lanes | n.childLanes;
  if (
    (Wf(e, i),
    e === ue && ((se = ue = null), (de = 0)),
    (!(n.subtreeFlags & 2064) && !(n.flags & 2064)) ||
      Hr ||
      ((Hr = !0),
      ud(as, function () {
        return wn(), null;
      })),
    (i = (n.flags & 15990) !== 0),
    n.subtreeFlags & 15990 || i)
  ) {
    (i = Ae.transition), (Ae.transition = null);
    var o = H;
    H = 1;
    var a = A;
    (A |= 4),
      (oo.current = null),
      lh(e, n),
      ed(n, e),
      Lp(Xl),
      (cs = !!Yl),
      (Xl = Yl = null),
      (e.current = n),
      ih(n),
      Df(),
      (A = a),
      (H = o),
      (Ae.transition = i);
  } else e.current = n;
  if (
    (Hr && ((Hr = !1), (xt = e), (Es = s)),
    (i = e.pendingLanes),
    i === 0 && (Pt = null),
    $f(n.stateNode),
    Ee(e, re()),
    t !== null)
  )
    for (r = e.onRecoverableError, n = 0; n < t.length; n++)
      (s = t[n]), r(s.value, { componentStack: s.stack, digest: s.digest });
  if (Cs) throw ((Cs = !1), (e = vi), (vi = null), e);
  return (
    Es & 1 && e.tag !== 0 && wn(),
    (i = e.pendingLanes),
    i & 1 ? (e === yi ? er++ : ((er = 0), (yi = e))) : (er = 0),
    Ot(),
    null
  );
}
function wn() {
  if (xt !== null) {
    var e = Au(Es),
      t = Ae.transition,
      n = H;
    try {
      if (((Ae.transition = null), (H = 16 > e ? 16 : e), xt === null))
        var r = !1;
      else {
        if (((e = xt), (xt = null), (Es = 0), A & 6)) throw Error(E(331));
        var s = A;
        for (A |= 4, L = e.current; L !== null; ) {
          var i = L,
            o = i.child;
          if (L.flags & 16) {
            var a = i.deletions;
            if (a !== null) {
              for (var u = 0; u < a.length; u++) {
                var c = a[u];
                for (L = c; L !== null; ) {
                  var d = L;
                  switch (d.tag) {
                    case 0:
                    case 11:
                    case 15:
                      Jn(8, d, i);
                  }
                  var h = d.child;
                  if (h !== null) (h.return = d), (L = h);
                  else
                    for (; L !== null; ) {
                      d = L;
                      var g = d.sibling,
                        w = d.return;
                      if ((Xc(d), d === c)) {
                        L = null;
                        break;
                      }
                      if (g !== null) {
                        (g.return = w), (L = g);
                        break;
                      }
                      L = w;
                    }
                }
              }
              var k = i.alternate;
              if (k !== null) {
                var x = k.child;
                if (x !== null) {
                  k.child = null;
                  do {
                    var C = x.sibling;
                    (x.sibling = null), (x = C);
                  } while (x !== null);
                }
              }
              L = i;
            }
          }
          if (i.subtreeFlags & 2064 && o !== null) (o.return = i), (L = o);
          else
            e: for (; L !== null; ) {
              if (((i = L), i.flags & 2048))
                switch (i.tag) {
                  case 0:
                  case 11:
                  case 15:
                    Jn(9, i, i.return);
                }
              var m = i.sibling;
              if (m !== null) {
                (m.return = i.return), (L = m);
                break e;
              }
              L = i.return;
            }
        }
        var p = e.current;
        for (L = p; L !== null; ) {
          o = L;
          var f = o.child;
          if (o.subtreeFlags & 2064 && f !== null) (f.return = o), (L = f);
          else
            e: for (o = p; L !== null; ) {
              if (((a = L), a.flags & 2048))
                try {
                  switch (a.tag) {
                    case 0:
                    case 11:
                    case 15:
                      Vs(9, a);
                  }
                } catch (S) {
                  ne(a, a.return, S);
                }
              if (a === o) {
                L = null;
                break e;
              }
              var j = a.sibling;
              if (j !== null) {
                (j.return = a.return), (L = j);
                break e;
              }
              L = a.return;
            }
        }
        if (
          ((A = s), Ot(), Ze && typeof Ze.onPostCommitFiberRoot == "function")
        )
          try {
            Ze.onPostCommitFiberRoot(Os, e);
          } catch {}
        r = !0;
      }
      return r;
    } finally {
      (H = n), (Ae.transition = t);
    }
  }
  return !1;
}
function Aa(e, t, n) {
  (t = Pn(n, t)),
    (t = Ac(e, t, 1)),
    (e = Et(e, t, 1)),
    (t = ye()),
    e !== null && (kr(e, 1, t), Ee(e, t));
}
function ne(e, t, n) {
  if (e.tag === 3) Aa(e, e, n);
  else
    for (; t !== null; ) {
      if (t.tag === 3) {
        Aa(t, e, n);
        break;
      } else if (t.tag === 1) {
        var r = t.stateNode;
        if (
          typeof t.type.getDerivedStateFromError == "function" ||
          (typeof r.componentDidCatch == "function" &&
            (Pt === null || !Pt.has(r)))
        ) {
          (e = Pn(n, e)),
            (e = Fc(t, e, 1)),
            (t = Et(t, e, 1)),
            (e = ye()),
            t !== null && (kr(t, 1, e), Ee(t, e));
          break;
        }
      }
      t = t.return;
    }
}
function fh(e, t, n) {
  var r = e.pingCache;
  r !== null && r.delete(t),
    (t = ye()),
    (e.pingedLanes |= e.suspendedLanes & n),
    ue === e &&
      (de & n) === n &&
      (oe === 4 || (oe === 3 && (de & 130023424) === de && 500 > re() - uo)
        ? Vt(e, 0)
        : (ao |= n)),
    Ee(e, t);
}
function od(e, t) {
  t === 0 &&
    (e.mode & 1
      ? ((t = zr), (zr <<= 1), !(zr & 130023424) && (zr = 4194304))
      : (t = 1));
  var n = ye();
  (e = ct(e, t)), e !== null && (kr(e, t, n), Ee(e, n));
}
function ph(e) {
  var t = e.memoizedState,
    n = 0;
  t !== null && (n = t.retryLane), od(e, n);
}
function hh(e, t) {
  var n = 0;
  switch (e.tag) {
    case 13:
      var r = e.stateNode,
        s = e.memoizedState;
      s !== null && (n = s.retryLane);
      break;
    case 19:
      r = e.stateNode;
      break;
    default:
      throw Error(E(314));
  }
  r !== null && r.delete(t), od(e, n);
}
var ad;
ad = function (e, t, n) {
  if (e !== null)
    if (e.memoizedProps !== t.pendingProps || Se.current) Ne = !0;
    else {
      if (!(e.lanes & n) && !(t.flags & 128)) return (Ne = !1), th(e, t, n);
      Ne = !!(e.flags & 131072);
    }
  else (Ne = !1), X && t.flags & 1048576 && fc(t, vs, t.index);
  switch (((t.lanes = 0), t.tag)) {
    case 2:
      var r = t.type;
      ts(e, t), (e = t.pendingProps);
      var s = Nn(t, ge.current);
      jn(t, n), (s = no(null, t, r, e, s, n));
      var i = ro();
      return (
        (t.flags |= 1),
        typeof s == "object" &&
        s !== null &&
        typeof s.render == "function" &&
        s.$$typeof === void 0
          ? ((t.tag = 1),
            (t.memoizedState = null),
            (t.updateQueue = null),
            Ce(r) ? ((i = !0), ms(t)) : (i = !1),
            (t.memoizedState =
              s.state !== null && s.state !== void 0 ? s.state : null),
            Xi(t),
            (s.updater = Bs),
            (t.stateNode = s),
            (s._reactInternals = t),
            ii(t, r, e, n),
            (t = ui(null, t, r, !0, i, n)))
          : ((t.tag = 0), X && i && Hi(t), ve(null, t, s, n), (t = t.child)),
        t
      );
    case 16:
      r = t.elementType;
      e: {
        switch (
          (ts(e, t),
          (e = t.pendingProps),
          (s = r._init),
          (r = s(r._payload)),
          (t.type = r),
          (s = t.tag = gh(r)),
          (e = He(r, e)),
          s)
        ) {
          case 0:
            t = ai(null, t, r, e, n);
            break e;
          case 1:
            t = Ta(null, t, r, e, n);
            break e;
          case 11:
            t = _a(null, t, r, e, n);
            break e;
          case 14:
            t = Ra(null, t, r, He(r.type, e), n);
            break e;
        }
        throw Error(E(306, r, ""));
      }
      return t;
    case 0:
      return (
        (r = t.type),
        (s = t.pendingProps),
        (s = t.elementType === r ? s : He(r, s)),
        ai(e, t, r, s, n)
      );
    case 1:
      return (
        (r = t.type),
        (s = t.pendingProps),
        (s = t.elementType === r ? s : He(r, s)),
        Ta(e, t, r, s, n)
      );
    case 3:
      e: {
        if ((Wc(t), e === null)) throw Error(E(387));
        (r = t.pendingProps),
          (i = t.memoizedState),
          (s = i.element),
          yc(e, t),
          js(t, r, null, n);
        var o = t.memoizedState;
        if (((r = o.element), i.isDehydrated))
          if (
            ((i = {
              element: r,
              isDehydrated: !1,
              cache: o.cache,
              pendingSuspenseBoundaries: o.pendingSuspenseBoundaries,
              transitions: o.transitions,
            }),
            (t.updateQueue.baseState = i),
            (t.memoizedState = i),
            t.flags & 256)
          ) {
            (s = Pn(Error(E(423)), t)), (t = La(e, t, r, n, s));
            break e;
          } else if (r !== s) {
            (s = Pn(Error(E(424)), t)), (t = La(e, t, r, n, s));
            break e;
          } else
            for (
              Te = Ct(t.stateNode.containerInfo.firstChild),
                Le = t,
                X = !0,
                qe = null,
                n = gc(t, null, r, n),
                t.child = n;
              n;

            )
              (n.flags = (n.flags & -3) | 4096), (n = n.sibling);
        else {
          if ((Sn(), r === s)) {
            t = dt(e, t, n);
            break e;
          }
          ve(e, t, r, n);
        }
        t = t.child;
      }
      return t;
    case 5:
      return (
        xc(t),
        e === null && ri(t),
        (r = t.type),
        (s = t.pendingProps),
        (i = e !== null ? e.memoizedProps : null),
        (o = s.children),
        Jl(r, s) ? (o = null) : i !== null && Jl(r, i) && (t.flags |= 32),
        Hc(e, t),
        ve(e, t, o, n),
        t.child
      );
    case 6:
      return e === null && ri(t), null;
    case 13:
      return qc(e, t, n);
    case 4:
      return (
        Ji(t, t.stateNode.containerInfo),
        (r = t.pendingProps),
        e === null ? (t.child = Cn(t, null, r, n)) : ve(e, t, r, n),
        t.child
      );
    case 11:
      return (
        (r = t.type),
        (s = t.pendingProps),
        (s = t.elementType === r ? s : He(r, s)),
        _a(e, t, r, s, n)
      );
    case 7:
      return ve(e, t, t.pendingProps, n), t.child;
    case 8:
      return ve(e, t, t.pendingProps.children, n), t.child;
    case 12:
      return ve(e, t, t.pendingProps.children, n), t.child;
    case 10:
      e: {
        if (
          ((r = t.type._context),
          (s = t.pendingProps),
          (i = t.memoizedProps),
          (o = s.value),
          Q(ys, r._currentValue),
          (r._currentValue = o),
          i !== null)
        )
          if (Ge(i.value, o)) {
            if (i.children === s.children && !Se.current) {
              t = dt(e, t, n);
              break e;
            }
          } else
            for (i = t.child, i !== null && (i.return = t); i !== null; ) {
              var a = i.dependencies;
              if (a !== null) {
                o = i.child;
                for (var u = a.firstContext; u !== null; ) {
                  if (u.context === r) {
                    if (i.tag === 1) {
                      (u = ot(-1, n & -n)), (u.tag = 2);
                      var c = i.updateQueue;
                      if (c !== null) {
                        c = c.shared;
                        var d = c.pending;
                        d === null
                          ? (u.next = u)
                          : ((u.next = d.next), (d.next = u)),
                          (c.pending = u);
                      }
                    }
                    (i.lanes |= n),
                      (u = i.alternate),
                      u !== null && (u.lanes |= n),
                      si(i.return, n, t),
                      (a.lanes |= n);
                    break;
                  }
                  u = u.next;
                }
              } else if (i.tag === 10) o = i.type === t.type ? null : i.child;
              else if (i.tag === 18) {
                if (((o = i.return), o === null)) throw Error(E(341));
                (o.lanes |= n),
                  (a = o.alternate),
                  a !== null && (a.lanes |= n),
                  si(o, n, t),
                  (o = i.sibling);
              } else o = i.child;
              if (o !== null) o.return = i;
              else
                for (o = i; o !== null; ) {
                  if (o === t) {
                    o = null;
                    break;
                  }
                  if (((i = o.sibling), i !== null)) {
                    (i.return = o.return), (o = i);
                    break;
                  }
                  o = o.return;
                }
              i = o;
            }
        ve(e, t, s.children, n), (t = t.child);
      }
      return t;
    case 9:
      return (
        (s = t.type),
        (r = t.pendingProps.children),
        jn(t, n),
        (s = Fe(s)),
        (r = r(s)),
        (t.flags |= 1),
        ve(e, t, r, n),
        t.child
      );
    case 14:
      return (
        (r = t.type),
        (s = He(r, t.pendingProps)),
        (s = He(r.type, s)),
        Ra(e, t, r, s, n)
      );
    case 15:
      return Bc(e, t, t.type, t.pendingProps, n);
    case 17:
      return (
        (r = t.type),
        (s = t.pendingProps),
        (s = t.elementType === r ? s : He(r, s)),
        ts(e, t),
        (t.tag = 1),
        Ce(r) ? ((e = !0), ms(t)) : (e = !1),
        jn(t, n),
        $c(t, r, s),
        ii(t, r, s, n),
        ui(null, t, r, !0, e, n)
      );
    case 19:
      return Qc(e, t, n);
    case 22:
      return Vc(e, t, n);
  }
  throw Error(E(156, t.tag));
};
function ud(e, t) {
  return Du(e, t);
}
function mh(e, t, n, r) {
  (this.tag = e),
    (this.key = n),
    (this.sibling =
      this.child =
      this.return =
      this.stateNode =
      this.type =
      this.elementType =
        null),
    (this.index = 0),
    (this.ref = null),
    (this.pendingProps = t),
    (this.dependencies =
      this.memoizedState =
      this.updateQueue =
      this.memoizedProps =
        null),
    (this.mode = r),
    (this.subtreeFlags = this.flags = 0),
    (this.deletions = null),
    (this.childLanes = this.lanes = 0),
    (this.alternate = null);
}
function $e(e, t, n, r) {
  return new mh(e, t, n, r);
}
function ho(e) {
  return (e = e.prototype), !(!e || !e.isReactComponent);
}
function gh(e) {
  if (typeof e == "function") return ho(e) ? 1 : 0;
  if (e != null) {
    if (((e = e.$$typeof), e === Ii)) return 11;
    if (e === Mi) return 14;
  }
  return 2;
}
function Rt(e, t) {
  var n = e.alternate;
  return (
    n === null
      ? ((n = $e(e.tag, t, e.key, e.mode)),
        (n.elementType = e.elementType),
        (n.type = e.type),
        (n.stateNode = e.stateNode),
        (n.alternate = e),
        (e.alternate = n))
      : ((n.pendingProps = t),
        (n.type = e.type),
        (n.flags = 0),
        (n.subtreeFlags = 0),
        (n.deletions = null)),
    (n.flags = e.flags & 14680064),
    (n.childLanes = e.childLanes),
    (n.lanes = e.lanes),
    (n.child = e.child),
    (n.memoizedProps = e.memoizedProps),
    (n.memoizedState = e.memoizedState),
    (n.updateQueue = e.updateQueue),
    (t = e.dependencies),
    (n.dependencies =
      t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }),
    (n.sibling = e.sibling),
    (n.index = e.index),
    (n.ref = e.ref),
    n
  );
}
function ss(e, t, n, r, s, i) {
  var o = 2;
  if (((r = e), typeof e == "function")) ho(e) && (o = 1);
  else if (typeof e == "string") o = 5;
  else
    e: switch (e) {
      case rn:
        return Ht(n.children, s, i, t);
      case Li:
        (o = 8), (s |= 8);
        break;
      case Tl:
        return (
          (e = $e(12, n, t, s | 2)), (e.elementType = Tl), (e.lanes = i), e
        );
      case Ll:
        return (e = $e(13, n, t, s)), (e.elementType = Ll), (e.lanes = i), e;
      case Il:
        return (e = $e(19, n, t, s)), (e.elementType = Il), (e.lanes = i), e;
      case xu:
        return Ws(n, s, i, t);
      default:
        if (typeof e == "object" && e !== null)
          switch (e.$$typeof) {
            case vu:
              o = 10;
              break e;
            case yu:
              o = 9;
              break e;
            case Ii:
              o = 11;
              break e;
            case Mi:
              o = 14;
              break e;
            case ht:
              (o = 16), (r = null);
              break e;
          }
        throw Error(E(130, e == null ? e : typeof e, ""));
    }
  return (
    (t = $e(o, n, t, s)), (t.elementType = e), (t.type = r), (t.lanes = i), t
  );
}
function Ht(e, t, n, r) {
  return (e = $e(7, e, r, t)), (e.lanes = n), e;
}
function Ws(e, t, n, r) {
  return (
    (e = $e(22, e, r, t)),
    (e.elementType = xu),
    (e.lanes = n),
    (e.stateNode = { isHidden: !1 }),
    e
  );
}
function Sl(e, t, n) {
  return (e = $e(6, e, null, t)), (e.lanes = n), e;
}
function Cl(e, t, n) {
  return (
    (t = $e(4, e.children !== null ? e.children : [], e.key, t)),
    (t.lanes = n),
    (t.stateNode = {
      containerInfo: e.containerInfo,
      pendingChildren: null,
      implementation: e.implementation,
    }),
    t
  );
}
function vh(e, t, n, r, s) {
  (this.tag = t),
    (this.containerInfo = e),
    (this.finishedWork =
      this.pingCache =
      this.current =
      this.pendingChildren =
        null),
    (this.timeoutHandle = -1),
    (this.callbackNode = this.pendingContext = this.context = null),
    (this.callbackPriority = 0),
    (this.eventTimes = ll(0)),
    (this.expirationTimes = ll(-1)),
    (this.entangledLanes =
      this.finishedLanes =
      this.mutableReadLanes =
      this.expiredLanes =
      this.pingedLanes =
      this.suspendedLanes =
      this.pendingLanes =
        0),
    (this.entanglements = ll(0)),
    (this.identifierPrefix = r),
    (this.onRecoverableError = s),
    (this.mutableSourceEagerHydrationData = null);
}
function mo(e, t, n, r, s, i, o, a, u) {
  return (
    (e = new vh(e, t, n, a, u)),
    t === 1 ? ((t = 1), i === !0 && (t |= 8)) : (t = 0),
    (i = $e(3, null, null, t)),
    (e.current = i),
    (i.stateNode = e),
    (i.memoizedState = {
      element: r,
      isDehydrated: n,
      cache: null,
      transitions: null,
      pendingSuspenseBoundaries: null,
    }),
    Xi(i),
    e
  );
}
function yh(e, t, n) {
  var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
  return {
    $$typeof: nn,
    key: r == null ? null : "" + r,
    children: e,
    containerInfo: t,
    implementation: n,
  };
}
function cd(e) {
  if (!e) return It;
  e = e._reactInternals;
  e: {
    if (Jt(e) !== e || e.tag !== 1) throw Error(E(170));
    var t = e;
    do {
      switch (t.tag) {
        case 3:
          t = t.stateNode.context;
          break e;
        case 1:
          if (Ce(t.type)) {
            t = t.stateNode.__reactInternalMemoizedMergedChildContext;
            break e;
          }
      }
      t = t.return;
    } while (t !== null);
    throw Error(E(171));
  }
  if (e.tag === 1) {
    var n = e.type;
    if (Ce(n)) return cc(e, n, t);
  }
  return t;
}
function dd(e, t, n, r, s, i, o, a, u) {
  return (
    (e = mo(n, r, !0, e, s, i, o, a, u)),
    (e.context = cd(null)),
    (n = e.current),
    (r = ye()),
    (s = _t(n)),
    (i = ot(r, s)),
    (i.callback = t ?? null),
    Et(n, i, s),
    (e.current.lanes = s),
    kr(e, s, r),
    Ee(e, r),
    e
  );
}
function qs(e, t, n, r) {
  var s = t.current,
    i = ye(),
    o = _t(s);
  return (
    (n = cd(n)),
    t.context === null ? (t.context = n) : (t.pendingContext = n),
    (t = ot(i, o)),
    (t.payload = { element: e }),
    (r = r === void 0 ? null : r),
    r !== null && (t.callback = r),
    (e = Et(s, t, o)),
    e !== null && (Ke(e, s, o, i), Jr(e, s, o)),
    o
  );
}
function _s(e) {
  if (((e = e.current), !e.child)) return null;
  switch (e.child.tag) {
    case 5:
      return e.child.stateNode;
    default:
      return e.child.stateNode;
  }
}
function Fa(e, t) {
  if (((e = e.memoizedState), e !== null && e.dehydrated !== null)) {
    var n = e.retryLane;
    e.retryLane = n !== 0 && n < t ? n : t;
  }
}
function go(e, t) {
  Fa(e, t), (e = e.alternate) && Fa(e, t);
}
function xh() {
  return null;
}
var fd =
  typeof reportError == "function"
    ? reportError
    : function (e) {
        console.error(e);
      };
function vo(e) {
  this._internalRoot = e;
}
Qs.prototype.render = vo.prototype.render = function (e) {
  var t = this._internalRoot;
  if (t === null) throw Error(E(409));
  qs(e, t, null, null);
};
Qs.prototype.unmount = vo.prototype.unmount = function () {
  var e = this._internalRoot;
  if (e !== null) {
    this._internalRoot = null;
    var t = e.containerInfo;
    Gt(function () {
      qs(null, e, null, null);
    }),
      (t[ut] = null);
  }
};
function Qs(e) {
  this._internalRoot = e;
}
Qs.prototype.unstable_scheduleHydration = function (e) {
  if (e) {
    var t = Vu();
    e = { blockedOn: null, target: e, priority: t };
    for (var n = 0; n < gt.length && t !== 0 && t < gt[n].priority; n++);
    gt.splice(n, 0, e), n === 0 && Wu(e);
  }
};
function yo(e) {
  return !(!e || (e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11));
}
function Ks(e) {
  return !(
    !e ||
    (e.nodeType !== 1 &&
      e.nodeType !== 9 &&
      e.nodeType !== 11 &&
      (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "))
  );
}
function Ba() {}
function jh(e, t, n, r, s) {
  if (s) {
    if (typeof r == "function") {
      var i = r;
      r = function () {
        var c = _s(o);
        i.call(c);
      };
    }
    var o = dd(t, r, e, 0, null, !1, !1, "", Ba);
    return (
      (e._reactRootContainer = o),
      (e[ut] = o.current),
      cr(e.nodeType === 8 ? e.parentNode : e),
      Gt(),
      o
    );
  }
  for (; (s = e.lastChild); ) e.removeChild(s);
  if (typeof r == "function") {
    var a = r;
    r = function () {
      var c = _s(u);
      a.call(c);
    };
  }
  var u = mo(e, 0, !1, null, null, !1, !1, "", Ba);
  return (
    (e._reactRootContainer = u),
    (e[ut] = u.current),
    cr(e.nodeType === 8 ? e.parentNode : e),
    Gt(function () {
      qs(t, u, n, r);
    }),
    u
  );
}
function Gs(e, t, n, r, s) {
  var i = n._reactRootContainer;
  if (i) {
    var o = i;
    if (typeof s == "function") {
      var a = s;
      s = function () {
        var u = _s(o);
        a.call(u);
      };
    }
    qs(t, o, e, s);
  } else o = jh(n, t, e, s, r);
  return _s(o);
}
Fu = function (e) {
  switch (e.tag) {
    case 3:
      var t = e.stateNode;
      if (t.current.memoizedState.isDehydrated) {
        var n = Hn(t.pendingLanes);
        n !== 0 &&
          (Di(t, n | 1), Ee(t, re()), !(A & 6) && ((_n = re() + 500), Ot()));
      }
      break;
    case 13:
      Gt(function () {
        var r = ct(e, 1);
        if (r !== null) {
          var s = ye();
          Ke(r, e, 1, s);
        }
      }),
        go(e, 1);
  }
};
bi = function (e) {
  if (e.tag === 13) {
    var t = ct(e, 134217728);
    if (t !== null) {
      var n = ye();
      Ke(t, e, 134217728, n);
    }
    go(e, 134217728);
  }
};
Bu = function (e) {
  if (e.tag === 13) {
    var t = _t(e),
      n = ct(e, t);
    if (n !== null) {
      var r = ye();
      Ke(n, e, t, r);
    }
    go(e, t);
  }
};
Vu = function () {
  return H;
};
Hu = function (e, t) {
  var n = H;
  try {
    return (H = e), t();
  } finally {
    H = n;
  }
};
Bl = function (e, t, n) {
  switch (t) {
    case "input":
      if ((Ol(e, n), (t = n.name), n.type === "radio" && t != null)) {
        for (n = e; n.parentNode; ) n = n.parentNode;
        for (
          n = n.querySelectorAll(
            "input[name=" + JSON.stringify("" + t) + '][type="radio"]'
          ),
            t = 0;
          t < n.length;
          t++
        ) {
          var r = n[t];
          if (r !== e && r.form === e.form) {
            var s = $s(r);
            if (!s) throw Error(E(90));
            wu(r), Ol(r, s);
          }
        }
      }
      break;
    case "textarea":
      Nu(e, n);
      break;
    case "select":
      (t = n.value), t != null && gn(e, !!n.multiple, t, !1);
  }
};
Tu = co;
Lu = Gt;
var wh = { usingClientEntryPoint: !1, Events: [Sr, an, $s, _u, Ru, co] },
  Fn = {
    findFiberByHostInstance: At,
    bundleType: 0,
    version: "18.3.1",
    rendererPackageName: "react-dom",
  },
  kh = {
    bundleType: Fn.bundleType,
    version: Fn.version,
    rendererPackageName: Fn.rendererPackageName,
    rendererConfig: Fn.rendererConfig,
    overrideHookState: null,
    overrideHookStateDeletePath: null,
    overrideHookStateRenamePath: null,
    overrideProps: null,
    overridePropsDeletePath: null,
    overridePropsRenamePath: null,
    setErrorHandler: null,
    setSuspenseHandler: null,
    scheduleUpdate: null,
    currentDispatcherRef: ft.ReactCurrentDispatcher,
    findHostInstanceByFiber: function (e) {
      return (e = zu(e)), e === null ? null : e.stateNode;
    },
    findFiberByHostInstance: Fn.findFiberByHostInstance || xh,
    findHostInstancesForRefresh: null,
    scheduleRefresh: null,
    scheduleRoot: null,
    setRefreshHandler: null,
    getCurrentFiber: null,
    reconcilerVersion: "18.3.1-next-f1338f8080-20240426",
  };
if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
  var Wr = __REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (!Wr.isDisabled && Wr.supportsFiber)
    try {
      (Os = Wr.inject(kh)), (Ze = Wr);
    } catch {}
}
Me.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = wh;
Me.createPortal = function (e, t) {
  var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
  if (!yo(t)) throw Error(E(200));
  return yh(e, t, null, n);
};
Me.createRoot = function (e, t) {
  if (!yo(e)) throw Error(E(299));
  var n = !1,
    r = "",
    s = fd;
  return (
    t != null &&
      (t.unstable_strictMode === !0 && (n = !0),
      t.identifierPrefix !== void 0 && (r = t.identifierPrefix),
      t.onRecoverableError !== void 0 && (s = t.onRecoverableError)),
    (t = mo(e, 1, !1, null, null, n, !1, r, s)),
    (e[ut] = t.current),
    cr(e.nodeType === 8 ? e.parentNode : e),
    new vo(t)
  );
};
Me.findDOMNode = function (e) {
  if (e == null) return null;
  if (e.nodeType === 1) return e;
  var t = e._reactInternals;
  if (t === void 0)
    throw typeof e.render == "function"
      ? Error(E(188))
      : ((e = Object.keys(e).join(",")), Error(E(268, e)));
  return (e = zu(t)), (e = e === null ? null : e.stateNode), e;
};
Me.flushSync = function (e) {
  return Gt(e);
};
Me.hydrate = function (e, t, n) {
  if (!Ks(t)) throw Error(E(200));
  return Gs(null, e, t, !0, n);
};
Me.hydrateRoot = function (e, t, n) {
  if (!yo(e)) throw Error(E(405));
  var r = (n != null && n.hydratedSources) || null,
    s = !1,
    i = "",
    o = fd;
  if (
    (n != null &&
      (n.unstable_strictMode === !0 && (s = !0),
      n.identifierPrefix !== void 0 && (i = n.identifierPrefix),
      n.onRecoverableError !== void 0 && (o = n.onRecoverableError)),
    (t = dd(t, null, e, 1, n ?? null, s, !1, i, o)),
    (e[ut] = t.current),
    cr(e),
    r)
  )
    for (e = 0; e < r.length; e++)
      (n = r[e]),
        (s = n._getVersion),
        (s = s(n._source)),
        t.mutableSourceEagerHydrationData == null
          ? (t.mutableSourceEagerHydrationData = [n, s])
          : t.mutableSourceEagerHydrationData.push(n, s);
  return new Qs(t);
};
Me.render = function (e, t, n) {
  if (!Ks(t)) throw Error(E(200));
  return Gs(null, e, t, !1, n);
};
Me.unmountComponentAtNode = function (e) {
  if (!Ks(e)) throw Error(E(40));
  return e._reactRootContainer
    ? (Gt(function () {
        Gs(null, null, e, !1, function () {
          (e._reactRootContainer = null), (e[ut] = null);
        });
      }),
      !0)
    : !1;
};
Me.unstable_batchedUpdates = co;
Me.unstable_renderSubtreeIntoContainer = function (e, t, n, r) {
  if (!Ks(n)) throw Error(E(200));
  if (e == null || e._reactInternals === void 0) throw Error(E(38));
  return Gs(e, t, n, !1, r);
};
Me.version = "18.3.1-next-f1338f8080-20240426";
function pd() {
  if (
    !(
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" ||
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"
    )
  )
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(pd);
    } catch (e) {
      console.error(e);
    }
}
pd(), (pu.exports = Me);
var Nh = pu.exports,
  hd,
  Va = Nh;
(hd = Va.createRoot), Va.hydrateRoot;
/**
 * @remix-run/router v1.16.1
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */ function xr() {
  return (
    (xr = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n)
              Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
    xr.apply(this, arguments)
  );
}
var jt;
(function (e) {
  (e.Pop = "POP"), (e.Push = "PUSH"), (e.Replace = "REPLACE");
})(jt || (jt = {}));
const Ha = "popstate";
function Sh(e) {
  e === void 0 && (e = {});
  function t(r, s) {
    let { pathname: i, search: o, hash: a } = r.location;
    return wi(
      "",
      { pathname: i, search: o, hash: a },
      (s.state && s.state.usr) || null,
      (s.state && s.state.key) || "default"
    );
  }
  function n(r, s) {
    return typeof s == "string" ? s : Rs(s);
  }
  return Eh(t, n, null, e);
}
function le(e, t) {
  if (e === !1 || e === null || typeof e > "u") throw new Error(t);
}
function md(e, t) {
  if (!e) {
    typeof console < "u" && console.warn(t);
    try {
      throw new Error(t);
    } catch {}
  }
}
function Ch() {
  return Math.random().toString(36).substr(2, 8);
}
function Wa(e, t) {
  return { usr: e.state, key: e.key, idx: t };
}
function wi(e, t, n, r) {
  return (
    n === void 0 && (n = null),
    xr(
      { pathname: typeof e == "string" ? e : e.pathname, search: "", hash: "" },
      typeof t == "string" ? In(t) : t,
      { state: n, key: (t && t.key) || r || Ch() }
    )
  );
}
function Rs(e) {
  let { pathname: t = "/", search: n = "", hash: r = "" } = e;
  return (
    n && n !== "?" && (t += n.charAt(0) === "?" ? n : "?" + n),
    r && r !== "#" && (t += r.charAt(0) === "#" ? r : "#" + r),
    t
  );
}
function In(e) {
  let t = {};
  if (e) {
    let n = e.indexOf("#");
    n >= 0 && ((t.hash = e.substr(n)), (e = e.substr(0, n)));
    let r = e.indexOf("?");
    r >= 0 && ((t.search = e.substr(r)), (e = e.substr(0, r))),
      e && (t.pathname = e);
  }
  return t;
}
function Eh(e, t, n, r) {
  r === void 0 && (r = {});
  let { window: s = document.defaultView, v5Compat: i = !1 } = r,
    o = s.history,
    a = jt.Pop,
    u = null,
    c = d();
  c == null && ((c = 0), o.replaceState(xr({}, o.state, { idx: c }), ""));
  function d() {
    return (o.state || { idx: null }).idx;
  }
  function h() {
    a = jt.Pop;
    let C = d(),
      m = C == null ? null : C - c;
    (c = C), u && u({ action: a, location: x.location, delta: m });
  }
  function g(C, m) {
    a = jt.Push;
    let p = wi(x.location, C, m);
    c = d() + 1;
    let f = Wa(p, c),
      j = x.createHref(p);
    try {
      o.pushState(f, "", j);
    } catch (S) {
      if (S instanceof DOMException && S.name === "DataCloneError") throw S;
      s.location.assign(j);
    }
    i && u && u({ action: a, location: x.location, delta: 1 });
  }
  function w(C, m) {
    a = jt.Replace;
    let p = wi(x.location, C, m);
    c = d();
    let f = Wa(p, c),
      j = x.createHref(p);
    o.replaceState(f, "", j),
      i && u && u({ action: a, location: x.location, delta: 0 });
  }
  function k(C) {
    let m = s.location.origin !== "null" ? s.location.origin : s.location.href,
      p = typeof C == "string" ? C : Rs(C);
    return (
      (p = p.replace(/ $/, "%20")),
      le(
        m,
        "No window.location.(origin|href) available to create URL for href: " +
          p
      ),
      new URL(p, m)
    );
  }
  let x = {
    get action() {
      return a;
    },
    get location() {
      return e(s, o);
    },
    listen(C) {
      if (u) throw new Error("A history only accepts one active listener");
      return (
        s.addEventListener(Ha, h),
        (u = C),
        () => {
          s.removeEventListener(Ha, h), (u = null);
        }
      );
    },
    createHref(C) {
      return t(s, C);
    },
    createURL: k,
    encodeLocation(C) {
      let m = k(C);
      return { pathname: m.pathname, search: m.search, hash: m.hash };
    },
    push: g,
    replace: w,
    go(C) {
      return o.go(C);
    },
  };
  return x;
}
var qa;
(function (e) {
  (e.data = "data"),
    (e.deferred = "deferred"),
    (e.redirect = "redirect"),
    (e.error = "error");
})(qa || (qa = {}));
function Ph(e, t, n) {
  n === void 0 && (n = "/");
  let r = typeof t == "string" ? In(t) : t,
    s = xo(r.pathname || "/", n);
  if (s == null) return null;
  let i = gd(e);
  _h(i);
  let o = null;
  for (let a = 0; o == null && a < i.length; ++a) {
    let u = Ah(s);
    o = bh(i[a], u);
  }
  return o;
}
function gd(e, t, n, r) {
  t === void 0 && (t = []), n === void 0 && (n = []), r === void 0 && (r = "");
  let s = (i, o, a) => {
    let u = {
      relativePath: a === void 0 ? i.path || "" : a,
      caseSensitive: i.caseSensitive === !0,
      childrenIndex: o,
      route: i,
    };
    u.relativePath.startsWith("/") &&
      (le(
        u.relativePath.startsWith(r),
        'Absolute route path "' +
          u.relativePath +
          '" nested under path ' +
          ('"' + r + '" is not valid. An absolute child route path ') +
          "must start with the combined path of all its parent routes."
      ),
      (u.relativePath = u.relativePath.slice(r.length)));
    let c = Tt([r, u.relativePath]),
      d = n.concat(u);
    i.children &&
      i.children.length > 0 &&
      (le(
        i.index !== !0,
        "Index routes must not have child routes. Please remove " +
          ('all child routes from route path "' + c + '".')
      ),
      gd(i.children, t, d, c)),
      !(i.path == null && !i.index) &&
        t.push({ path: c, score: Oh(c, i.index), routesMeta: d });
  };
  return (
    e.forEach((i, o) => {
      var a;
      if (i.path === "" || !((a = i.path) != null && a.includes("?"))) s(i, o);
      else for (let u of vd(i.path)) s(i, o, u);
    }),
    t
  );
}
function vd(e) {
  let t = e.split("/");
  if (t.length === 0) return [];
  let [n, ...r] = t,
    s = n.endsWith("?"),
    i = n.replace(/\?$/, "");
  if (r.length === 0) return s ? [i, ""] : [i];
  let o = vd(r.join("/")),
    a = [];
  return (
    a.push(...o.map((u) => (u === "" ? i : [i, u].join("/")))),
    s && a.push(...o),
    a.map((u) => (e.startsWith("/") && u === "" ? "/" : u))
  );
}
function _h(e) {
  e.sort((t, n) =>
    t.score !== n.score
      ? n.score - t.score
      : Dh(
          t.routesMeta.map((r) => r.childrenIndex),
          n.routesMeta.map((r) => r.childrenIndex)
        )
  );
}
const Rh = /^:[\w-]+$/,
  Th = 3,
  Lh = 2,
  Ih = 1,
  Mh = 10,
  zh = -2,
  Qa = (e) => e === "*";
function Oh(e, t) {
  let n = e.split("/"),
    r = n.length;
  return (
    n.some(Qa) && (r += zh),
    t && (r += Lh),
    n
      .filter((s) => !Qa(s))
      .reduce((s, i) => s + (Rh.test(i) ? Th : i === "" ? Ih : Mh), r)
  );
}
function Dh(e, t) {
  return e.length === t.length && e.slice(0, -1).every((r, s) => r === t[s])
    ? e[e.length - 1] - t[t.length - 1]
    : 0;
}
function bh(e, t) {
  let { routesMeta: n } = e,
    r = {},
    s = "/",
    i = [];
  for (let o = 0; o < n.length; ++o) {
    let a = n[o],
      u = o === n.length - 1,
      c = s === "/" ? t : t.slice(s.length) || "/",
      d = Uh(
        { path: a.relativePath, caseSensitive: a.caseSensitive, end: u },
        c
      );
    if (!d) return null;
    Object.assign(r, d.params);
    let h = a.route;
    i.push({
      params: r,
      pathname: Tt([s, d.pathname]),
      pathnameBase: Hh(Tt([s, d.pathnameBase])),
      route: h,
    }),
      d.pathnameBase !== "/" && (s = Tt([s, d.pathnameBase]));
  }
  return i;
}
function Uh(e, t) {
  typeof e == "string" && (e = { path: e, caseSensitive: !1, end: !0 });
  let [n, r] = $h(e.path, e.caseSensitive, e.end),
    s = t.match(n);
  if (!s) return null;
  let i = s[0],
    o = i.replace(/(.)\/+$/, "$1"),
    a = s.slice(1);
  return {
    params: r.reduce((c, d, h) => {
      let { paramName: g, isOptional: w } = d;
      if (g === "*") {
        let x = a[h] || "";
        o = i.slice(0, i.length - x.length).replace(/(.)\/+$/, "$1");
      }
      const k = a[h];
      return (
        w && !k ? (c[g] = void 0) : (c[g] = (k || "").replace(/%2F/g, "/")), c
      );
    }, {}),
    pathname: i,
    pathnameBase: o,
    pattern: e,
  };
}
function $h(e, t, n) {
  t === void 0 && (t = !1),
    n === void 0 && (n = !0),
    md(
      e === "*" || !e.endsWith("*") || e.endsWith("/*"),
      'Route path "' +
        e +
        '" will be treated as if it were ' +
        ('"' + e.replace(/\*$/, "/*") + '" because the `*` character must ') +
        "always follow a `/` in the pattern. To get rid of this warning, " +
        ('please change the route path to "' + e.replace(/\*$/, "/*") + '".')
    );
  let r = [],
    s =
      "^" +
      e
        .replace(/\/*\*?$/, "")
        .replace(/^\/*/, "/")
        .replace(/[\\.*+^${}|()[\]]/g, "\\$&")
        .replace(
          /\/:([\w-]+)(\?)?/g,
          (o, a, u) => (
            r.push({ paramName: a, isOptional: u != null }),
            u ? "/?([^\\/]+)?" : "/([^\\/]+)"
          )
        );
  return (
    e.endsWith("*")
      ? (r.push({ paramName: "*" }),
        (s += e === "*" || e === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$"))
      : n
      ? (s += "\\/*$")
      : e !== "" && e !== "/" && (s += "(?:(?=\\/|$))"),
    [new RegExp(s, t ? void 0 : "i"), r]
  );
}
function Ah(e) {
  try {
    return e
      .split("/")
      .map((t) => decodeURIComponent(t).replace(/\//g, "%2F"))
      .join("/");
  } catch (t) {
    return (
      md(
        !1,
        'The URL path "' +
          e +
          '" could not be decoded because it is is a malformed URL segment. This is probably due to a bad percent ' +
          ("encoding (" + t + ").")
      ),
      e
    );
  }
}
function xo(e, t) {
  if (t === "/") return e;
  if (!e.toLowerCase().startsWith(t.toLowerCase())) return null;
  let n = t.endsWith("/") ? t.length - 1 : t.length,
    r = e.charAt(n);
  return r && r !== "/" ? null : e.slice(n) || "/";
}
function Fh(e, t) {
  t === void 0 && (t = "/");
  let {
    pathname: n,
    search: r = "",
    hash: s = "",
  } = typeof e == "string" ? In(e) : e;
  return {
    pathname: n ? (n.startsWith("/") ? n : Bh(n, t)) : t,
    search: Wh(r),
    hash: qh(s),
  };
}
function Bh(e, t) {
  let n = t.replace(/\/+$/, "").split("/");
  return (
    e.split("/").forEach((s) => {
      s === ".." ? n.length > 1 && n.pop() : s !== "." && n.push(s);
    }),
    n.length > 1 ? n.join("/") : "/"
  );
}
function El(e, t, n, r) {
  return (
    "Cannot include a '" +
    e +
    "' character in a manually specified " +
    ("`to." +
      t +
      "` field [" +
      JSON.stringify(r) +
      "].  Please separate it out to the ") +
    ("`to." + n + "` field. Alternatively you may provide the full path as ") +
    'a string in <Link to="..."> and the router will parse it for you.'
  );
}
function Vh(e) {
  return e.filter(
    (t, n) => n === 0 || (t.route.path && t.route.path.length > 0)
  );
}
function yd(e, t) {
  let n = Vh(e);
  return t
    ? n.map((r, s) => (s === e.length - 1 ? r.pathname : r.pathnameBase))
    : n.map((r) => r.pathnameBase);
}
function xd(e, t, n, r) {
  r === void 0 && (r = !1);
  let s;
  typeof e == "string"
    ? (s = In(e))
    : ((s = xr({}, e)),
      le(
        !s.pathname || !s.pathname.includes("?"),
        El("?", "pathname", "search", s)
      ),
      le(
        !s.pathname || !s.pathname.includes("#"),
        El("#", "pathname", "hash", s)
      ),
      le(!s.search || !s.search.includes("#"), El("#", "search", "hash", s)));
  let i = e === "" || s.pathname === "",
    o = i ? "/" : s.pathname,
    a;
  if (o == null) a = n;
  else {
    let h = t.length - 1;
    if (!r && o.startsWith("..")) {
      let g = o.split("/");
      for (; g[0] === ".."; ) g.shift(), (h -= 1);
      s.pathname = g.join("/");
    }
    a = h >= 0 ? t[h] : "/";
  }
  let u = Fh(s, a),
    c = o && o !== "/" && o.endsWith("/"),
    d = (i || o === ".") && n.endsWith("/");
  return !u.pathname.endsWith("/") && (c || d) && (u.pathname += "/"), u;
}
const Tt = (e) => e.join("/").replace(/\/\/+/g, "/"),
  Hh = (e) => e.replace(/\/+$/, "").replace(/^\/*/, "/"),
  Wh = (e) => (!e || e === "?" ? "" : e.startsWith("?") ? e : "?" + e),
  qh = (e) => (!e || e === "#" ? "" : e.startsWith("#") ? e : "#" + e);
function Qh(e) {
  return (
    e != null &&
    typeof e.status == "number" &&
    typeof e.statusText == "string" &&
    typeof e.internal == "boolean" &&
    "data" in e
  );
}
const jd = ["post", "put", "patch", "delete"];
new Set(jd);
const Kh = ["get", ...jd];
new Set(Kh);
/**
 * React Router v6.23.1
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */ function jr() {
  return (
    (jr = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n)
              Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
    jr.apply(this, arguments)
  );
}
const jo = y.createContext(null),
  Gh = y.createContext(null),
  Zt = y.createContext(null),
  Ys = y.createContext(null),
  Dt = y.createContext({ outlet: null, matches: [], isDataRoute: !1 }),
  wd = y.createContext(null);
function Yh(e, t) {
  let { relative: n } = t === void 0 ? {} : t;
  Er() || le(!1);
  let { basename: r, navigator: s } = y.useContext(Zt),
    { hash: i, pathname: o, search: a } = Nd(e, { relative: n }),
    u = o;
  return (
    r !== "/" && (u = o === "/" ? r : Tt([r, o])),
    s.createHref({ pathname: u, search: a, hash: i })
  );
}
function Er() {
  return y.useContext(Ys) != null;
}
function bt() {
  return Er() || le(!1), y.useContext(Ys).location;
}
function kd(e) {
  y.useContext(Zt).static || y.useLayoutEffect(e);
}
function Mn() {
  let { isDataRoute: e } = y.useContext(Dt);
  return e ? dm() : Xh();
}
function Xh() {
  Er() || le(!1);
  let e = y.useContext(jo),
    { basename: t, future: n, navigator: r } = y.useContext(Zt),
    { matches: s } = y.useContext(Dt),
    { pathname: i } = bt(),
    o = JSON.stringify(yd(s, n.v7_relativeSplatPath)),
    a = y.useRef(!1);
  return (
    kd(() => {
      a.current = !0;
    }),
    y.useCallback(
      function (c, d) {
        if ((d === void 0 && (d = {}), !a.current)) return;
        if (typeof c == "number") {
          r.go(c);
          return;
        }
        let h = xd(c, JSON.parse(o), i, d.relative === "path");
        e == null &&
          t !== "/" &&
          (h.pathname = h.pathname === "/" ? t : Tt([t, h.pathname])),
          (d.replace ? r.replace : r.push)(h, d.state, d);
      },
      [t, r, o, i, e]
    )
  );
}
const Jh = y.createContext(null);
function Zh(e) {
  let t = y.useContext(Dt).outlet;
  return t && y.createElement(Jh.Provider, { value: e }, t);
}
function Nd(e, t) {
  let { relative: n } = t === void 0 ? {} : t,
    { future: r } = y.useContext(Zt),
    { matches: s } = y.useContext(Dt),
    { pathname: i } = bt(),
    o = JSON.stringify(yd(s, r.v7_relativeSplatPath));
  return y.useMemo(() => xd(e, JSON.parse(o), i, n === "path"), [e, o, i, n]);
}
function em(e, t) {
  return tm(e, t);
}
function tm(e, t, n, r) {
  Er() || le(!1);
  let { navigator: s } = y.useContext(Zt),
    { matches: i } = y.useContext(Dt),
    o = i[i.length - 1],
    a = o ? o.params : {};
  o && o.pathname;
  let u = o ? o.pathnameBase : "/";
  o && o.route;
  let c = bt(),
    d;
  if (t) {
    var h;
    let C = typeof t == "string" ? In(t) : t;
    u === "/" || ((h = C.pathname) != null && h.startsWith(u)) || le(!1),
      (d = C);
  } else d = c;
  let g = d.pathname || "/",
    w = g;
  if (u !== "/") {
    let C = u.replace(/^\//, "").split("/");
    w = "/" + g.replace(/^\//, "").split("/").slice(C.length).join("/");
  }
  let k = Ph(e, { pathname: w }),
    x = im(
      k &&
        k.map((C) =>
          Object.assign({}, C, {
            params: Object.assign({}, a, C.params),
            pathname: Tt([
              u,
              s.encodeLocation
                ? s.encodeLocation(C.pathname).pathname
                : C.pathname,
            ]),
            pathnameBase:
              C.pathnameBase === "/"
                ? u
                : Tt([
                    u,
                    s.encodeLocation
                      ? s.encodeLocation(C.pathnameBase).pathname
                      : C.pathnameBase,
                  ]),
          })
        ),
      i,
      n,
      r
    );
  return t && x
    ? y.createElement(
        Ys.Provider,
        {
          value: {
            location: jr(
              {
                pathname: "/",
                search: "",
                hash: "",
                state: null,
                key: "default",
              },
              d
            ),
            navigationType: jt.Pop,
          },
        },
        x
      )
    : x;
}
function nm() {
  let e = cm(),
    t = Qh(e)
      ? e.status + " " + e.statusText
      : e instanceof Error
      ? e.message
      : JSON.stringify(e),
    n = e instanceof Error ? e.stack : null,
    s = { padding: "0.5rem", backgroundColor: "rgba(200,200,200, 0.5)" };
  return y.createElement(
    y.Fragment,
    null,
    y.createElement("h2", null, "Unexpected Application Error!"),
    y.createElement("h3", { style: { fontStyle: "italic" } }, t),
    n ? y.createElement("pre", { style: s }, n) : null,
    null
  );
}
const rm = y.createElement(nm, null);
class sm extends y.Component {
  constructor(t) {
    super(t),
      (this.state = {
        location: t.location,
        revalidation: t.revalidation,
        error: t.error,
      });
  }
  static getDerivedStateFromError(t) {
    return { error: t };
  }
  static getDerivedStateFromProps(t, n) {
    return n.location !== t.location ||
      (n.revalidation !== "idle" && t.revalidation === "idle")
      ? { error: t.error, location: t.location, revalidation: t.revalidation }
      : {
          error: t.error !== void 0 ? t.error : n.error,
          location: n.location,
          revalidation: t.revalidation || n.revalidation,
        };
  }
  componentDidCatch(t, n) {
    console.error(
      "React Router caught the following error during render",
      t,
      n
    );
  }
  render() {
    return this.state.error !== void 0
      ? y.createElement(
          Dt.Provider,
          { value: this.props.routeContext },
          y.createElement(wd.Provider, {
            value: this.state.error,
            children: this.props.component,
          })
        )
      : this.props.children;
  }
}
function lm(e) {
  let { routeContext: t, match: n, children: r } = e,
    s = y.useContext(jo);
  return (
    s &&
      s.static &&
      s.staticContext &&
      (n.route.errorElement || n.route.ErrorBoundary) &&
      (s.staticContext._deepestRenderedBoundaryId = n.route.id),
    y.createElement(Dt.Provider, { value: t }, r)
  );
}
function im(e, t, n, r) {
  var s;
  if (
    (t === void 0 && (t = []),
    n === void 0 && (n = null),
    r === void 0 && (r = null),
    e == null)
  ) {
    var i;
    if ((i = n) != null && i.errors) e = n.matches;
    else return null;
  }
  let o = e,
    a = (s = n) == null ? void 0 : s.errors;
  if (a != null) {
    let d = o.findIndex(
      (h) => h.route.id && (a == null ? void 0 : a[h.route.id]) !== void 0
    );
    d >= 0 || le(!1), (o = o.slice(0, Math.min(o.length, d + 1)));
  }
  let u = !1,
    c = -1;
  if (n && r && r.v7_partialHydration)
    for (let d = 0; d < o.length; d++) {
      let h = o[d];
      if (
        ((h.route.HydrateFallback || h.route.hydrateFallbackElement) && (c = d),
        h.route.id)
      ) {
        let { loaderData: g, errors: w } = n,
          k =
            h.route.loader &&
            g[h.route.id] === void 0 &&
            (!w || w[h.route.id] === void 0);
        if (h.route.lazy || k) {
          (u = !0), c >= 0 ? (o = o.slice(0, c + 1)) : (o = [o[0]]);
          break;
        }
      }
    }
  return o.reduceRight((d, h, g) => {
    let w,
      k = !1,
      x = null,
      C = null;
    n &&
      ((w = a && h.route.id ? a[h.route.id] : void 0),
      (x = h.route.errorElement || rm),
      u &&
        (c < 0 && g === 0
          ? ((k = !0), (C = null))
          : c === g &&
            ((k = !0), (C = h.route.hydrateFallbackElement || null))));
    let m = t.concat(o.slice(0, g + 1)),
      p = () => {
        let f;
        return (
          w
            ? (f = x)
            : k
            ? (f = C)
            : h.route.Component
            ? (f = y.createElement(h.route.Component, null))
            : h.route.element
            ? (f = h.route.element)
            : (f = d),
          y.createElement(lm, {
            match: h,
            routeContext: { outlet: d, matches: m, isDataRoute: n != null },
            children: f,
          })
        );
      };
    return n && (h.route.ErrorBoundary || h.route.errorElement || g === 0)
      ? y.createElement(sm, {
          location: n.location,
          revalidation: n.revalidation,
          component: x,
          error: w,
          children: p(),
          routeContext: { outlet: null, matches: m, isDataRoute: !0 },
        })
      : p();
  }, null);
}
var Sd = (function (e) {
    return (
      (e.UseBlocker = "useBlocker"),
      (e.UseRevalidator = "useRevalidator"),
      (e.UseNavigateStable = "useNavigate"),
      e
    );
  })(Sd || {}),
  Ts = (function (e) {
    return (
      (e.UseBlocker = "useBlocker"),
      (e.UseLoaderData = "useLoaderData"),
      (e.UseActionData = "useActionData"),
      (e.UseRouteError = "useRouteError"),
      (e.UseNavigation = "useNavigation"),
      (e.UseRouteLoaderData = "useRouteLoaderData"),
      (e.UseMatches = "useMatches"),
      (e.UseRevalidator = "useRevalidator"),
      (e.UseNavigateStable = "useNavigate"),
      (e.UseRouteId = "useRouteId"),
      e
    );
  })(Ts || {});
function om(e) {
  let t = y.useContext(jo);
  return t || le(!1), t;
}
function am(e) {
  let t = y.useContext(Gh);
  return t || le(!1), t;
}
function um(e) {
  let t = y.useContext(Dt);
  return t || le(!1), t;
}
function Cd(e) {
  let t = um(),
    n = t.matches[t.matches.length - 1];
  return n.route.id || le(!1), n.route.id;
}
function cm() {
  var e;
  let t = y.useContext(wd),
    n = am(Ts.UseRouteError),
    r = Cd(Ts.UseRouteError);
  return t !== void 0 ? t : (e = n.errors) == null ? void 0 : e[r];
}
function dm() {
  let { router: e } = om(Sd.UseNavigateStable),
    t = Cd(Ts.UseNavigateStable),
    n = y.useRef(!1);
  return (
    kd(() => {
      n.current = !0;
    }),
    y.useCallback(
      function (s, i) {
        i === void 0 && (i = {}),
          n.current &&
            (typeof s == "number"
              ? e.navigate(s)
              : e.navigate(s, jr({ fromRouteId: t }, i)));
      },
      [e, t]
    )
  );
}
function wo(e) {
  return Zh(e.context);
}
function we(e) {
  le(!1);
}
function fm(e) {
  let {
    basename: t = "/",
    children: n = null,
    location: r,
    navigationType: s = jt.Pop,
    navigator: i,
    static: o = !1,
    future: a,
  } = e;
  Er() && le(!1);
  let u = t.replace(/^\/*/, "/"),
    c = y.useMemo(
      () => ({
        basename: u,
        navigator: i,
        static: o,
        future: jr({ v7_relativeSplatPath: !1 }, a),
      }),
      [u, a, i, o]
    );
  typeof r == "string" && (r = In(r));
  let {
      pathname: d = "/",
      search: h = "",
      hash: g = "",
      state: w = null,
      key: k = "default",
    } = r,
    x = y.useMemo(() => {
      let C = xo(d, u);
      return C == null
        ? null
        : {
            location: { pathname: C, search: h, hash: g, state: w, key: k },
            navigationType: s,
          };
    }, [u, d, h, g, w, k, s]);
  return x == null
    ? null
    : y.createElement(
        Zt.Provider,
        { value: c },
        y.createElement(Ys.Provider, { children: n, value: x })
      );
}
function pm(e) {
  let { children: t, location: n } = e;
  return em(ki(t), n);
}
new Promise(() => {});
function ki(e, t) {
  t === void 0 && (t = []);
  let n = [];
  return (
    y.Children.forEach(e, (r, s) => {
      if (!y.isValidElement(r)) return;
      let i = [...t, s];
      if (r.type === y.Fragment) {
        n.push.apply(n, ki(r.props.children, i));
        return;
      }
      r.type !== we && le(!1), !r.props.index || !r.props.children || le(!1);
      let o = {
        id: r.props.id || i.join("-"),
        caseSensitive: r.props.caseSensitive,
        element: r.props.element,
        Component: r.props.Component,
        index: r.props.index,
        path: r.props.path,
        loader: r.props.loader,
        action: r.props.action,
        errorElement: r.props.errorElement,
        ErrorBoundary: r.props.ErrorBoundary,
        hasErrorBoundary:
          r.props.ErrorBoundary != null || r.props.errorElement != null,
        shouldRevalidate: r.props.shouldRevalidate,
        handle: r.props.handle,
        lazy: r.props.lazy,
      };
      r.props.children && (o.children = ki(r.props.children, i)), n.push(o);
    }),
    n
  );
}
/**
 * React Router DOM v6.23.1
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */ function Ni() {
  return (
    (Ni = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n)
              Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
    Ni.apply(this, arguments)
  );
}
function hm(e, t) {
  if (e == null) return {};
  var n = {},
    r = Object.keys(e),
    s,
    i;
  for (i = 0; i < r.length; i++)
    (s = r[i]), !(t.indexOf(s) >= 0) && (n[s] = e[s]);
  return n;
}
function mm(e) {
  return !!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey);
}
function gm(e, t) {
  return e.button === 0 && (!t || t === "_self") && !mm(e);
}
const vm = [
    "onClick",
    "relative",
    "reloadDocument",
    "replace",
    "state",
    "target",
    "to",
    "preventScrollReset",
    "unstable_viewTransition",
  ],
  ym = "6";
try {
  window.__reactRouterVersion = ym;
} catch {}
const xm = "startTransition",
  Ka = ff[xm];
function jm(e) {
  let { basename: t, children: n, future: r, window: s } = e,
    i = y.useRef();
  i.current == null && (i.current = Sh({ window: s, v5Compat: !0 }));
  let o = i.current,
    [a, u] = y.useState({ action: o.action, location: o.location }),
    { v7_startTransition: c } = r || {},
    d = y.useCallback(
      (h) => {
        c && Ka ? Ka(() => u(h)) : u(h);
      },
      [u, c]
    );
  return (
    y.useLayoutEffect(() => o.listen(d), [o, d]),
    y.createElement(fm, {
      basename: t,
      children: n,
      location: a.location,
      navigationType: a.action,
      navigator: o,
      future: r,
    })
  );
}
const wm =
    typeof window < "u" &&
    typeof window.document < "u" &&
    typeof window.document.createElement < "u",
  km = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,
  ko = y.forwardRef(function (t, n) {
    let {
        onClick: r,
        relative: s,
        reloadDocument: i,
        replace: o,
        state: a,
        target: u,
        to: c,
        preventScrollReset: d,
        unstable_viewTransition: h,
      } = t,
      g = hm(t, vm),
      { basename: w } = y.useContext(Zt),
      k,
      x = !1;
    if (typeof c == "string" && km.test(c) && ((k = c), wm))
      try {
        let f = new URL(window.location.href),
          j = c.startsWith("//") ? new URL(f.protocol + c) : new URL(c),
          S = xo(j.pathname, w);
        j.origin === f.origin && S != null
          ? (c = S + j.search + j.hash)
          : (x = !0);
      } catch {}
    let C = Yh(c, { relative: s }),
      m = Nm(c, {
        replace: o,
        state: a,
        target: u,
        preventScrollReset: d,
        relative: s,
        unstable_viewTransition: h,
      });
    function p(f) {
      r && r(f), f.defaultPrevented || m(f);
    }
    return y.createElement(
      "a",
      Ni({}, g, { href: k || C, onClick: x || i ? r : p, ref: n, target: u })
    );
  });
var Ga;
(function (e) {
  (e.UseScrollRestoration = "useScrollRestoration"),
    (e.UseSubmit = "useSubmit"),
    (e.UseSubmitFetcher = "useSubmitFetcher"),
    (e.UseFetcher = "useFetcher"),
    (e.useViewTransitionState = "useViewTransitionState");
})(Ga || (Ga = {}));
var Ya;
(function (e) {
  (e.UseFetcher = "useFetcher"),
    (e.UseFetchers = "useFetchers"),
    (e.UseScrollRestoration = "useScrollRestoration");
})(Ya || (Ya = {}));
function Nm(e, t) {
  let {
      target: n,
      replace: r,
      state: s,
      preventScrollReset: i,
      relative: o,
      unstable_viewTransition: a,
    } = t === void 0 ? {} : t,
    u = Mn(),
    c = bt(),
    d = Nd(e, { relative: o });
  return y.useCallback(
    (h) => {
      if (gm(h, n)) {
        h.preventDefault();
        let g = r !== void 0 ? r : Rs(c) === Rs(d);
        u(e, {
          replace: g,
          state: s,
          preventScrollReset: i,
          relative: o,
          unstable_viewTransition: a,
        });
      }
    },
    [c, u, d, r, s, n, e, i, o, a]
  );
}
var Ed = { exports: {} },
  Sm = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED",
  Cm = Sm,
  Em = Cm;
function Pd() {}
function _d() {}
_d.resetWarningCache = Pd;
var Pm = function () {
  function e(r, s, i, o, a, u) {
    if (u !== Em) {
      var c = new Error(
        "Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types"
      );
      throw ((c.name = "Invariant Violation"), c);
    }
  }
  e.isRequired = e;
  function t() {
    return e;
  }
  var n = {
    array: e,
    bigint: e,
    bool: e,
    func: e,
    number: e,
    object: e,
    string: e,
    symbol: e,
    any: e,
    arrayOf: t,
    element: e,
    elementType: e,
    instanceOf: t,
    node: e,
    objectOf: t,
    oneOf: t,
    oneOfType: t,
    shape: t,
    exact: t,
    checkPropTypes: _d,
    resetWarningCache: Pd,
  };
  return (n.PropTypes = n), n;
};
Ed.exports = Pm();
var _m = Ed.exports;
const v = tu(_m);
No.propTypes = { children: v.node.isRequired };
const Xs = y.createContext({
    postList: [],
    fetching: !1,
    addPost: () => {},
    deletePost: () => {},
  }),
  Rm = (e, t) => {
    let n = e;
    return (
      t.type === "DELETE_POST"
        ? (n = e.filter((r) => r.id !== t.payload.postId))
        : t.type === "ADD_POST"
        ? (n = [t.payload, ...e])
        : t.type === "ADD_INITIAL_POST" && (n = t.payload.posts),
      n
    );
  };
function No({ children: e }) {
  const [t, n] = y.useReducer(Rm, []),
    [r, s] = y.useState(!1),
    i = (u) => {
      n({ type: "ADD_INITIAL_POST", payload: { posts: u } });
    },
    o = (u, c, d, h, g, w = null, k = null) => {
      n({
        type: "ADD_POST",
        payload: {
          id: Date.now(),
          userId: u,
          title: c,
          body: d,
          reactions: h,
          tags: g,
          views: 0,
          images: w,
          videos: k,
          comments: [],
          timestamp: new Date().toISOString(),
        },
      });
    },
    a = (u) => {
      n({ type: "DELETE_POST", payload: { postId: u } });
    };
  return (
    y.useEffect(() => {
      const u = new AbortController(),
        c = u.signal;
      return (
        s(!0),
        fetch("http://localhost:3000/api/posts", { signal: c })
          .then((d) => d.json())
          .then((d) => {
            const h = d.PostData || d.posts || d;
            i(h), s(!1);
          })
          .catch((d) => {
            d.name !== "AbortError" &&
              (console.error("Error fetching posts:", d), s(!1));
          }),
        () => {
          u.abort();
        }
      );
    }, []),
    l.jsx(Xs.Provider, {
      value: { postList: t, fetching: r, addPost: o, deletePost: a },
      children: e,
    })
  );
}
const Rd = ({ activeSection: e, onSectionToggle: t }) =>
  l.jsxs("div", {
    className: "section-toggle",
    children: [
      l.jsx("button", {
        className: `toggle-btn ${e === "home" ? "active" : ""}`,
        onClick: () => t("home"),
        children: "Home",
      }),
      l.jsx("button", {
        className: `toggle-btn ${e === "messages" ? "active" : ""}`,
        onClick: () => t("messages"),
        children: "Messages",
      }),
      l.jsx("div", { className: `toggle-indicator ${e}` }),
    ],
  });
Rd.propTypes = {
  activeSection: v.string.isRequired,
  onSectionToggle: v.func.isRequired,
};
const Td = ({ isScrolled: e, activeSection: t, onSectionToggle: n }) =>
  l.jsx("header", {
    className: `dynamic-header ${e ? "scrolled" : ""}`,
    children: l.jsxs("div", {
      className: "header-content",
      children: [
        l.jsx("h1", { className: "header-title", children: "Social Feed" }),
        l.jsx(Rd, { activeSection: t, onSectionToggle: n }),
      ],
    }),
  });
Td.propTypes = {
  isScrolled: v.bool.isRequired,
  activeSection: v.string.isRequired,
  onSectionToggle: v.func.isRequired,
};
function Pr({ user: e, size: t = 40, showOnlineStatus: n = !1, onClick: r }) {
  const [s, i] = y.useState(!1),
    [o, a] = y.useState(!0),
    u = { width: `${t}px`, height: `${t}px` },
    c = () => {
      a(!1);
    },
    d = () => {
      i(!0), a(!1);
    },
    h = (x) => {
      r && (x.preventDefault(), x.stopPropagation(), r(e));
    },
    g = (x) => {
      if (!x) return "U";
      const C = x.name || x.username;
      return C
        ? C.split(" ")
            .map((m) => m.charAt(0))
            .join("")
            .toUpperCase()
            .slice(0, 2)
        : "U";
    },
    w = (x) => {
      if (!x) return "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
      const C = [
          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
          "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
          "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
          "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
          "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
          "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
          "linear-gradient(135deg, #ff8a80 0%, #ea4c89 100%)",
          "linear-gradient(135deg, #8fd3f4 0%, #84fab0 100%)",
          "linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)",
          "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)",
          "linear-gradient(135deg, #fdbb2d 0%, #22c1c3 100%)",
          "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
          "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
          "linear-gradient(135deg, #fad0c4 0%, #ffd1ff 100%)",
          "linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%)",
          "linear-gradient(135deg, #b721ff 0%, #21d4fd 100%)",
        ],
        m = x
          .toString()
          .split("")
          .reduce((p, f) => f.charCodeAt(0) + ((p << 5) - p), 0);
      return C[Math.abs(m) % C.length];
    },
    k = () => {
      if (e != null && e.avatar && !s)
        return l.jsxs(l.Fragment, {
          children: [
            o &&
              l.jsx("div", {
                className: "user-avatar-skeleton",
                style: u,
                children: l.jsx("div", { className: "skeleton-pulse" }),
              }),
            l.jsx("img", {
              src: e.avatar,
              alt: `${e.name || e.username || "User"}'s avatar`,
              className: "post-avatar-img",
              style: { ...u, display: o ? "none" : "block" },
              onLoad: c,
              onError: d,
            }),
          ],
        });
      const x = g(e),
        C = w((e == null ? void 0 : e.id) || (e == null ? void 0 : e.userId));
      return l.jsx("div", {
        className: "user-avatar-initials",
        style: {
          ...u,
          background: C,
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: `${t * 0.4}px`,
          fontWeight: "600",
          fontFamily: "system-ui, -apple-system, sans-serif",
          textShadow: "0 1px 2px rgba(0,0,0,0.3)",
        },
        children: x,
      });
    };
  return l.jsxs("div", {
    className: `post-user-avatar ${r ? "clickable" : ""} ${
      n ? "has-status" : ""
    }`,
    onClick: h,
    role: r ? "button" : void 0,
    tabIndex: r ? 0 : void 0,
    onKeyDown: r
      ? (x) => {
          (x.key === "Enter" || x.key === " ") && h(x);
        }
      : void 0,
    children: [
      l.jsxs("div", {
        className: "avatar-wrapper",
        children: [
          k(),
          l.jsx("div", { className: "avatar-ring" }),
          n && l.jsx("div", { className: "pulse-ring" }),
        ],
      }),
      n &&
        l.jsx("div", {
          className: "user-status-indicator",
          children: l.jsx("div", { className: "status-dot online" }),
        }),
    ],
  });
}
Pr.propTypes = {
  user: v.shape({
    id: v.oneOfType([v.string, v.number]),
    userId: v.oneOfType([v.string, v.number]),
    avatar: v.string,
    name: v.string,
    username: v.string,
  }),
  size: v.number,
  showOnlineStatus: v.bool,
  onClick: v.func,
};
Pr.defaultProps = { user: null, size: 40, showOnlineStatus: !1, onClick: null };
const Ld = ({ show: e, onClose: t, onConfirm: n, post: r }) => {
  const [s, i] = y.useState(""),
    [o, a] = y.useState(""),
    [u, c] = y.useState(!1),
    d = [
      { value: "spam", label: "Spam or misleading content" },
      { value: "harassment", label: "Harassment or bullying" },
      { value: "hate_speech", label: "Hate speech or discrimination" },
      { value: "violence", label: "Violence or threats" },
      { value: "inappropriate", label: "Inappropriate or explicit content" },
      { value: "misinformation", label: "False or misleading information" },
      { value: "copyright", label: "Copyright infringement" },
      { value: "other", label: "Other" },
    ];
  y.useEffect(() => {
    e && (i(""), a(""), c(!1));
  }, [e]),
    y.useEffect(() => {
      const k = (x) => {
        x.key === "Escape" && e && !u && g();
      };
      return (
        e && document.addEventListener("keydown", k),
        () => {
          document.removeEventListener("keydown", k);
        }
      );
    }, [e, u]);
  const h = async (k) => {
      if ((k.preventDefault(), k.stopPropagation(), !s)) {
        alert("Please select a reason for reporting this post.");
        return;
      }
      c(!0);
      try {
        const x = {
          postId: r.id,
          reportedUserId: r.userId,
          reason: s,
          additionalDetails: o.trim(),
          timestamp: new Date().toISOString(),
        };
        await n(x);
      } catch (x) {
        console.error("Error submitting report:", x), c(!1);
      }
    },
    g = () => {
      u || (i(""), a(""), c(!1), t());
    },
    w = (k) => {
      k.target === k.currentTarget && !u && g();
    };
  return e
    ? l.jsx("div", {
        className: "modal-overlay",
        onClick: w,
        children: l.jsxs("div", {
          className: "modal-content",
          onClick: (k) => k.stopPropagation(),
          children: [
            l.jsxs("div", {
              className: "modal-header",
              children: [
                l.jsx("h2", { children: "Report Post" }),
                l.jsx("button", {
                  className: "modal-close",
                  onClick: g,
                  disabled: u,
                  type: "button",
                  children: l.jsx("svg", {
                    width: "24",
                    height: "24",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    children: l.jsx("path", {
                      d: "M18 6L6 18M6 6l12 12",
                      stroke: "currentColor",
                      strokeWidth: "2",
                    }),
                  }),
                }),
              ],
            }),
            l.jsxs("div", {
              className: "modal-body",
              children: [
                l.jsxs("div", {
                  className: "report-post-info",
                  children: [
                    l.jsxs("p", {
                      children: [
                        "You're reporting a post by ",
                        l.jsxs("strong", { children: ["@", r.userId] }),
                      ],
                    }),
                    l.jsx("p", {
                      className: "report-disclaimer",
                      children:
                        "Reports are reviewed by our team and action will be taken if the content violates our community guidelines.",
                    }),
                  ],
                }),
                l.jsxs("form", {
                  onSubmit: h,
                  children: [
                    l.jsxs("div", {
                      className: "form-group",
                      children: [
                        l.jsx("label", {
                          className: "form-label",
                          children: "Why are you reporting this post?",
                        }),
                        l.jsx("div", {
                          className: "radio-group",
                          children: d.map((k) =>
                            l.jsxs(
                              "label",
                              {
                                className: "radio-option",
                                children: [
                                  l.jsx("input", {
                                    type: "radio",
                                    name: "reportReason",
                                    value: k.value,
                                    checked: s === k.value,
                                    onChange: (x) => i(x.target.value),
                                    disabled: u,
                                  }),
                                  l.jsx("span", {
                                    className: "radio-label",
                                    children: k.label,
                                  }),
                                ],
                              },
                              k.value
                            )
                          ),
                        }),
                      ],
                    }),
                    l.jsxs("div", {
                      className: "form-group",
                      children: [
                        l.jsx("label", {
                          className: "form-label",
                          htmlFor: "additionalDetails",
                          children: "Additional details (optional)",
                        }),
                        l.jsx("textarea", {
                          id: "additionalDetails",
                          className: "form-textarea",
                          placeholder:
                            "Provide any additional context that might help us understand the issue...",
                          value: o,
                          onChange: (k) => a(k.target.value),
                          rows: "4",
                          maxLength: "500",
                          disabled: u,
                        }),
                        l.jsxs("div", {
                          className: "character-count",
                          children: [o.length, "/500"],
                        }),
                      ],
                    }),
                    l.jsxs("div", {
                      className: "modal-actions",
                      children: [
                        l.jsx("button", {
                          type: "button",
                          className: "btn btn-secondary",
                          onClick: g,
                          disabled: u,
                          children: "Cancel",
                        }),
                        l.jsx("button", {
                          type: "submit",
                          className: "btn btn-danger",
                          disabled: u || !s,
                          children: u ? "Submitting..." : "Submit Report",
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      })
    : null;
};
Ld.propTypes = {
  show: v.bool.isRequired,
  onClose: v.func.isRequired,
  onConfirm: v.func.isRequired,
  post: v.shape({
    id: v.oneOfType([v.string, v.number]).isRequired,
    userId: v.oneOfType([v.string, v.number]).isRequired,
  }).isRequired,
};
const Id = ({ show: e, onClose: t, onConfirm: n, username: r, userId: s }) => {
  const [i, o] = y.useState(!1);
  y.useEffect(() => {
    e && o(!1);
  }, [e]),
    y.useEffect(() => {
      const d = (h) => {
        h.key === "Escape" && e && !i && u();
      };
      return (
        e && document.addEventListener("keydown", d),
        () => {
          document.removeEventListener("keydown", d);
        }
      );
    }, [e, i]);
  const a = async (d) => {
      d.preventDefault(), d.stopPropagation(), o(!0);
      try {
        await n();
      } catch (h) {
        console.error("Error blocking user:", h), o(!1);
      }
    },
    u = () => {
      i || (o(!1), t());
    },
    c = (d) => {
      d.target === d.currentTarget && !i && u();
    };
  return e
    ? l.jsx("div", {
        className: "modal-overlay",
        onClick: c,
        children: l.jsxs("div", {
          className: "modal-content",
          onClick: (d) => d.stopPropagation(),
          children: [
            l.jsxs("div", {
              className: "modal-header",
              children: [
                l.jsxs("h2", { children: ["Block @", s, "?"] }),
                l.jsx("button", {
                  className: "modal-close",
                  onClick: u,
                  disabled: i,
                  type: "button",
                  children: l.jsx("svg", {
                    width: "24",
                    height: "24",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    children: l.jsx("path", {
                      d: "M18 6L6 18M6 6l12 12",
                      stroke: "currentColor",
                      strokeWidth: "2",
                    }),
                  }),
                }),
              ],
            }),
            l.jsxs("div", {
              className: "modal-body",
              children: [
                l.jsxs("div", {
                  className: "block-user-info",
                  children: [
                    l.jsx("div", {
                      className: "block-icon",
                      children: l.jsxs("svg", {
                        width: "48",
                        height: "48",
                        viewBox: "0 0 24 24",
                        fill: "none",
                        children: [
                          l.jsx("circle", {
                            cx: "12",
                            cy: "12",
                            r: "10",
                            stroke: "currentColor",
                            strokeWidth: "2",
                          }),
                          l.jsx("path", {
                            d: "M4.93 4.93l14.14 14.14",
                            stroke: "currentColor",
                            strokeWidth: "2",
                          }),
                        ],
                      }),
                    }),
                    l.jsxs("div", {
                      className: "block-details",
                      children: [
                        l.jsxs("p", {
                          children: [
                            l.jsx("strong", { children: r }),
                            " will no longer be able to:",
                          ],
                        }),
                        l.jsxs("ul", {
                          children: [
                            l.jsx("li", {
                              children: "See your posts and profile",
                            }),
                            l.jsx("li", { children: "Send you messages" }),
                            l.jsx("li", { children: "Follow you" }),
                            l.jsx("li", { children: "Tag you in posts" }),
                          ],
                        }),
                        l.jsx("p", { children: "You will also:" }),
                        l.jsxs("ul", {
                          children: [
                            l.jsx("li", {
                              children:
                                "No longer see their posts in your feed",
                            }),
                            l.jsx("li", {
                              children:
                                "Be automatically unfollowed from each other",
                            }),
                            l.jsx("li", {
                              children:
                                "Have all their posts removed from your timeline",
                            }),
                          ],
                        }),
                        l.jsxs("p", {
                          className: "block-note",
                          children: [
                            l.jsx("strong", { children: "Note:" }),
                            " This action can be undone by unblocking them from your settings.",
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
                l.jsxs("div", {
                  className: "modal-actions",
                  children: [
                    l.jsx("button", {
                      type: "button",
                      className: "btn btn-secondary",
                      onClick: u,
                      disabled: i,
                      children: "Cancel",
                    }),
                    l.jsx("button", {
                      type: "button",
                      className: "btn btn-danger",
                      onClick: a,
                      disabled: i,
                      children: i ? "Blocking..." : "Block",
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      })
    : null;
};
Id.propTypes = {
  show: v.bool.isRequired,
  onClose: v.func.isRequired,
  onConfirm: v.func.isRequired,
  username: v.string.isRequired,
  userId: v.oneOfType([v.string, v.number]).isRequired,
};
function Md({
  show: e,
  setShow: t,
  post: n,
  currentUserId: r,
  onDelete: s,
  onPostRemoved: i,
}) {
  const o = y.useRef(null),
    [a, u] = y.useState(!1),
    [c, d] = y.useState(!1),
    h = r === n.userId;
  y.useEffect(() => {
    const f = (j) => {
      o.current && !o.current.contains(j.target) && t(!1);
    };
    return (
      e && document.addEventListener("mousedown", f),
      () => {
        document.removeEventListener("mousedown", f);
      }
    );
  }, [e, t]),
    y.useEffect(() => {
      e || (u(!1), d(!1));
    }, [e]);
  const g = (f) => {
      f.preventDefault(), f.stopPropagation();
      try {
        s(n.id), t(!1);
      } catch (j) {
        console.error("Error deleting post:", j);
      }
    },
    w = (f) => {
      f.preventDefault(),
        f.stopPropagation(),
        t(!1),
        setTimeout(() => {
          d(!0);
        }, 100);
    },
    k = (f) => {
      f.preventDefault(),
        f.stopPropagation(),
        t(!1),
        setTimeout(() => {
          u(!0);
        }, 100);
    },
    x = async (f) => {
      try {
        // console.log("Report submitted:", f), i && i(n.id, "reported"), u(!1);
      } catch (j) {
        console.error("Error submitting report:", j);
      }
    },
    C = async () => {
      try {
        // console.log("User blocked:", n.userId),
          i && i(n.id, "blocked", n.userId),
          d(!1);
      } catch (f) {
        console.error("Error blocking user:", f);
      }
    },
    m = () => {
      u(!1);
    },
    p = () => {
      d(!1);
    };
  return e
    ? l.jsxs(l.Fragment, {
        children: [
          l.jsx("div", {
            className: "post-dropdown-container",
            ref: o,
            children: l.jsxs("div", {
              className: "post-dropdown-menu",
              children: [
                h &&
                  l.jsxs("button", {
                    className: "post-dropdown-item danger",
                    onClick: g,
                    type: "button",
                    children: [
                      l.jsxs("svg", {
                        width: "16",
                        height: "16",
                        viewBox: "0 0 24 24",
                        fill: "none",
                        children: [
                          l.jsx("path", {
                            d: "M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z",
                            stroke: "currentColor",
                            strokeWidth: "2",
                          }),
                          l.jsx("path", {
                            d: "M10 11v6M14 11v6",
                            stroke: "currentColor",
                            strokeWidth: "2",
                          }),
                        ],
                      }),
                      "Delete post",
                    ],
                  }),
                !h &&
                  l.jsxs(l.Fragment, {
                    children: [
                      l.jsxs("button", {
                        className: "post-dropdown-item",
                        onClick: w,
                        type: "button",
                        children: [
                          l.jsxs("svg", {
                            width: "16",
                            height: "16",
                            viewBox: "0 0 24 24",
                            fill: "none",
                            children: [
                              l.jsx("circle", {
                                cx: "12",
                                cy: "12",
                                r: "10",
                                stroke: "currentColor",
                                strokeWidth: "2",
                              }),
                              l.jsx("path", {
                                d: "M4.93 4.93l14.14 14.14",
                                stroke: "currentColor",
                                strokeWidth: "2",
                              }),
                            ],
                          }),
                          "Block @",
                          n.userId,
                        ],
                      }),
                      l.jsxs("button", {
                        className: "post-dropdown-item danger",
                        onClick: k,
                        type: "button",
                        children: [
                          l.jsx("svg", {
                            width: "16",
                            height: "16",
                            viewBox: "0 0 24 24",
                            fill: "none",
                            children: l.jsx("path", {
                              d: "M12 9v4M12 17h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
                              stroke: "currentColor",
                              strokeWidth: "2",
                            }),
                          }),
                          "Report post",
                        ],
                      }),
                    ],
                  }),
              ],
            }),
          }),
          l.jsx(Ld, { show: a, onClose: m, onConfirm: x, post: n }),
          l.jsx(Id, {
            show: c,
            onClose: p,
            onConfirm: C,
            username: n.username,
            userId: n.userId,
          }),
        ],
      })
    : null;
}
Md.propTypes = {
  show: v.bool.isRequired,
  setShow: v.func.isRequired,
  post: v.shape({
    id: v.oneOfType([v.string, v.number]).isRequired,
    userId: v.oneOfType([v.string, v.number]).isRequired,
    username: v.string.isRequired,
  }).isRequired,
  currentUserId: v.oneOfType([v.string, v.number]).isRequired,
  onDelete: v.func.isRequired,
  onPostRemoved: v.func.isRequired,
};
function Tm(e) {
  const t = new Date(),
    n = new Date(e),
    r = Math.floor((t - n) / 1e3);
  if (r < 60) return `${r}s`;
  const s = Math.floor(r / 60);
  if (s < 60) return `${s}m`;
  const i = Math.floor(s / 60);
  if (i < 24) return `${i}h`;
  const o = Math.floor(i / 24);
  if (o < 7) return `${o}d`;
  const a = Math.floor(o / 7);
  if (a < 4) return `${a}w`;
  const u = Math.floor(o / 30);
  if (u < 6) return `${u}m`;
  const c = {
    month: "short",
    day: "numeric",
    year: n.getFullYear() !== t.getFullYear() ? "numeric" : void 0,
  };
  return n.toLocaleDateString("en-US", c);
}
function So({
  post: e,
  showDropdown: t,
  setShowDropdown: n,
  onDelete: r,
  currentUserId: s,
  onPostRemoved: i,
}) {
  const o = (d) => {
      d.stopPropagation(), t && n(!1), (window.location.href = `/${e.userId}`);
    },
    a = (d) => {
      d.preventDefault(), d.stopPropagation(), n(!t);
    },
    u = (d) => {
      d.stopPropagation(),
        t && n(!1),
        (window.location.href = `/${e.userId}/status/${e.id}`);
    },
    c = (d) => {
      if (
        !(
          d.target.closest(".user-avatar-container") ||
          d.target.closest(".username") ||
          d.target.closest(".post-user-id") ||
          d.target.closest(".dropdown-trigger") ||
          d.target.closest(".post-dropdown") ||
          d.target.closest(".post-time")
        )
      ) {
        if (t) {
          n(!1);
          return;
        }
        u(d);
      }
    };
  return l.jsxs("div", {
    className: "post-header",
    onClick: c,
    children: [
      l.jsxs("div", {
        className: "post-user-info",
        children: [
          l.jsxs("div", {
            className: "user-avatar-container",
            onClick: o,
            children: [
              l.jsx(Pr, {
                user: {
                  avatar: e.UsersProfilePic,
                  name: e.username,
                  id: e.userId,
                },
                size: 44,
              }),
              l.jsx("div", { className: "user-status-indicator" }),
            ],
          }),
          l.jsxs("div", {
            className: "post-user-details",
            children: [
              l.jsxs("div", {
                className: "post-user-name",
                children: [
                  l.jsx("span", {
                    className: "username",
                    onClick: o,
                    children: e.username,
                  }),
                  l.jsx("span", {
                    className: "verification-badge",
                    children: l.jsx("svg", {
                      width: "16",
                      height: "16",
                      viewBox: "0 0 24 24",
                      fill: "none",
                      children: l.jsx("path", {
                        d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
                        stroke: "currentColor",
                        strokeWidth: "2",
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                      }),
                    }),
                  }),
                ],
              }),
              l.jsxs("div", {
                className: "post-meta",
                children: [
                  l.jsxs("span", {
                    className: "post-user-id",
                    onClick: o,
                    children: ["@", e.userId],
                  }),
                  l.jsx("span", {
                    className: "post-time-separator",
                    children: "•",
                  }),
                  l.jsx("span", {
                    className: "post-time",
                    onClick: (d) => d.stopPropagation(),
                    children: Tm(e.createdAt || e.timestamp),
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      l.jsxs("div", {
        className: "post-actions",
        children: [
          l.jsx("button", {
            className: "dropdown-trigger",
            onClick: a,
            "aria-label": "Post options",
            type: "button",
            children: l.jsxs("svg", {
              width: "20",
              height: "20",
              viewBox: "0 0 24 24",
              fill: "none",
              children: [
                l.jsx("circle", {
                  cx: "12",
                  cy: "12",
                  r: "1.5",
                  fill: "currentColor",
                }),
                l.jsx("circle", {
                  cx: "12",
                  cy: "6",
                  r: "1.5",
                  fill: "currentColor",
                }),
                l.jsx("circle", {
                  cx: "12",
                  cy: "18",
                  r: "1.5",
                  fill: "currentColor",
                }),
              ],
            }),
          }),
          t &&
            l.jsx(Md, {
              show: t,
              setShow: n,
              post: e,
              currentUserId: s,
              onDelete: r,
              onPostRemoved: i,
            }),
        ],
      }),
    ],
  });
}
So.propTypes = {
  post: v.shape({
    id: v.oneOfType([v.string, v.number]).isRequired,
    userId: v.oneOfType([v.string, v.number]).isRequired,
    username: v.string.isRequired,
    UsersProfilePic: v.string,
    createdAt: v.oneOfType([v.string, v.instanceOf(Date)]),
    timestamp: v.oneOfType([v.string, v.instanceOf(Date)]),
  }).isRequired,
  showDropdown: v.bool.isRequired,
  setShowDropdown: v.func.isRequired,
  onUserClick: v.func.isRequired,
  onDelete: v.func.isRequired,
  currentUserId: v.oneOfType([v.string, v.number]).isRequired,
  onPostRemoved: v.func.isRequired,
};
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Lm = (e) => e.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(),
  Im = (e) =>
    e.replace(/^([A-Z])|[\s-_]+(\w)/g, (t, n, r) =>
      r ? r.toUpperCase() : n.toLowerCase()
    ),
  Xa = (e) => {
    const t = Im(e);
    return t.charAt(0).toUpperCase() + t.slice(1);
  },
  zd = (...e) =>
    e
      .filter((t, n, r) => !!t && t.trim() !== "" && r.indexOf(t) === n)
      .join(" ")
      .trim(),
  Mm = (e) => {
    for (const t in e)
      if (t.startsWith("aria-") || t === "role" || t === "title") return !0;
  };
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var zm = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Om = y.forwardRef(
  (
    {
      color: e = "currentColor",
      size: t = 24,
      strokeWidth: n = 2,
      absoluteStrokeWidth: r,
      className: s = "",
      children: i,
      iconNode: o,
      ...a
    },
    u
  ) =>
    y.createElement(
      "svg",
      {
        ref: u,
        ...zm,
        width: t,
        height: t,
        stroke: e,
        strokeWidth: r ? (Number(n) * 24) / Number(t) : n,
        className: zd("lucide", s),
        ...(!i && !Mm(a) && { "aria-hidden": "true" }),
        ...a,
      },
      [
        ...o.map(([c, d]) => y.createElement(c, d)),
        ...(Array.isArray(i) ? i : [i]),
      ]
    )
);
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const q = (e, t) => {
  const n = y.forwardRef(({ className: r, ...s }, i) =>
    y.createElement(Om, {
      ref: i,
      iconNode: t,
      className: zd(`lucide-${Lm(Xa(e))}`, `lucide-${e}`, r),
      ...s,
    })
  );
  return (n.displayName = Xa(e)), n;
};
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Dm = [
    ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
    ["path", { d: "M19 12H5", key: "x3x0zl" }],
  ],
  bm = q("arrow-left", Dm);
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Um = [
    ["path", { d: "M12 7v14", key: "1akyts" }],
    [
      "path",
      {
        d: "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",
        key: "ruj8y",
      },
    ],
  ],
  $m = q("book-open", Um);
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Am = [
    ["path", { d: "M12 8V4H8", key: "hb8ula" }],
    [
      "rect",
      { width: "16", height: "12", x: "4", y: "8", rx: "2", key: "enze0r" },
    ],
    ["path", { d: "M2 14h2", key: "vft8re" }],
    ["path", { d: "M20 14h2", key: "4cs60a" }],
    ["path", { d: "M15 13v2", key: "1xurst" }],
    ["path", { d: "M9 13v2", key: "rq6x2g" }],
  ],
  Pl = q("bot", Am);
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Fm = [
    [
      "path",
      {
        d: "M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z",
        key: "l5xja",
      },
    ],
    [
      "path",
      {
        d: "M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z",
        key: "ep3f8r",
      },
    ],
    [
      "path",
      { d: "M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4", key: "1p4c4q" },
    ],
    ["path", { d: "M17.599 6.5a3 3 0 0 0 .399-1.375", key: "tmeiqw" }],
    ["path", { d: "M6.003 5.125A3 3 0 0 0 6.401 6.5", key: "105sqy" }],
    ["path", { d: "M3.477 10.896a4 4 0 0 1 .585-.396", key: "ql3yin" }],
    ["path", { d: "M19.938 10.5a4 4 0 0 1 .585.396", key: "1qfode" }],
    ["path", { d: "M6 18a4 4 0 0 1-1.967-.516", key: "2e4loj" }],
    ["path", { d: "M19.967 17.484A4 4 0 0 1 18 18", key: "159ez6" }],
  ],
  Bm = q("brain", Fm);
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Vm = [["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]],
  Hm = q("chevron-down", Vm);
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Wm = [["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]],
  qm = q("chevron-left", Wm);
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Qm = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]],
  Km = q("chevron-right", Qm);
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Gm = [["path", { d: "m18 15-6-6-6 6", key: "153udz" }]],
  Ym = q("chevron-up", Gm);
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Xm = [
    ["path", { d: "M10 2v2", key: "7u0qdc" }],
    ["path", { d: "M14 2v2", key: "6buw04" }],
    [
      "path",
      {
        d: "M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1",
        key: "pwadti",
      },
    ],
    ["path", { d: "M6 2v2", key: "colzsn" }],
  ],
  Jm = q("coffee", Xm);
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Zm = [
    ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
    ["path", { d: "M10 14 21 3", key: "gplh6r" }],
    [
      "path",
      {
        d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",
        key: "a6xqqp",
      },
    ],
  ],
  e0 = q("external-link", Zm);
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const t0 = [
    [
      "rect",
      { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" },
    ],
    ["path", { d: "M7 3v18", key: "bbkbws" }],
    ["path", { d: "M3 7.5h4", key: "zfgn84" }],
    ["path", { d: "M3 12h18", key: "1i2n21" }],
    ["path", { d: "M3 16.5h4", key: "1230mu" }],
    ["path", { d: "M17 3v18", key: "in4fa5" }],
    ["path", { d: "M17 7.5h4", key: "myr1c1" }],
    ["path", { d: "M17 16.5h4", key: "go4c1d" }],
  ],
  n0 = q("film", t0);
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const r0 = [
    ["line", { x1: "4", x2: "20", y1: "9", y2: "9", key: "4lhtct" }],
    ["line", { x1: "4", x2: "20", y1: "15", y2: "15", key: "vyu0kd" }],
    ["line", { x1: "10", x2: "8", y1: "3", y2: "21", key: "1ggp8o" }],
    ["line", { x1: "16", x2: "14", y1: "3", y2: "21", key: "weycgp" }],
  ],
  Od = q("hash", r0);
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const s0 = [
    ["path", { d: "m10 17 5-5-5-5", key: "1bsop3" }],
    ["path", { d: "M15 12H3", key: "6jk70r" }],
    ["path", { d: "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4", key: "u53s6r" }],
  ],
  l0 = q("log-in", s0);
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const i0 = [
    ["path", { d: "m16 17 5-5-5-5", key: "1bji2h" }],
    ["path", { d: "M21 12H9", key: "dn1m92" }],
    ["path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", key: "1uf3rs" }],
  ],
  o0 = q("log-out", i0);
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const a0 = [
    ["path", { d: "M7.9 20A9 9 0 1 0 4 16.1L2 22Z", key: "vv11sd" }],
  ],
  u0 = q("message-circle", a0);
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const c0 = [
    ["path", { d: "m14 10 7-7", key: "oa77jy" }],
    ["path", { d: "M20 10h-6V4", key: "mjg0md" }],
    ["path", { d: "m3 21 7-7", key: "tjx5ai" }],
    ["path", { d: "M4 14h6v6", key: "rmj7iw" }],
  ],
  d0 = q("minimize-2", c0);
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const f0 = [
    ["path", { d: "M9 18V5l12-2v13", key: "1jmyc2" }],
    ["circle", { cx: "6", cy: "18", r: "3", key: "fqmcym" }],
    ["circle", { cx: "18", cy: "16", r: "3", key: "1hluhg" }],
  ],
  p0 = q("music", f0);
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const h0 = [
    [
      "path",
      {
        d: "M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z",
        key: "1v9wt8",
      },
    ],
  ],
  m0 = q("plane", h0);
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const g0 = [
    [
      "path",
      {
        d: "M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z",
        key: "rib7q0",
      },
    ],
    [
      "path",
      {
        d: "M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z",
        key: "1ymkrd",
      },
    ],
  ],
  v0 = q("quote", g0);
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const y0 = [
    ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
    ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }],
  ],
  Co = q("search", y0);
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const x0 = [
    [
      "path",
      {
        d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
        key: "1ffxy3",
      },
    ],
    ["path", { d: "m21.854 2.147-10.94 10.939", key: "12cjpa" }],
  ],
  j0 = q("send", x0);
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const w0 = [
    ["circle", { cx: "18", cy: "5", r: "3", key: "gq8acd" }],
    ["circle", { cx: "6", cy: "12", r: "3", key: "w7nqdw" }],
    ["circle", { cx: "18", cy: "19", r: "3", key: "1xt0gg" }],
    [
      "line",
      { x1: "8.59", x2: "15.42", y1: "13.51", y2: "17.49", key: "47mynk" },
    ],
    [
      "line",
      { x1: "15.41", x2: "8.59", y1: "6.51", y2: "10.49", key: "1n3mei" },
    ],
  ],
  k0 = q("share-2", w0);
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const N0 = [
    [
      "path",
      {
        d: "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",
        key: "4pj2yx",
      },
    ],
    ["path", { d: "M20 3v4", key: "1olli1" }],
    ["path", { d: "M22 5h-4", key: "1gvqau" }],
    ["path", { d: "M4 17v2", key: "vumght" }],
    ["path", { d: "M5 18H3", key: "zchphs" }],
  ],
  S0 = q("sparkles", N0);
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const C0 = [
    ["path", { d: "M16 7h6v6", key: "box55l" }],
    ["path", { d: "m22 7-8.5 8.5-5-5L2 17", key: "1t1m79" }],
  ],
  tr = q("trending-up", C0);
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const E0 = [
    ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
    ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
    ["line", { x1: "19", x2: "19", y1: "8", y2: "14", key: "1bvyxn" }],
    ["line", { x1: "22", x2: "16", y1: "11", y2: "11", key: "1shjgl" }],
  ],
  P0 = q("user-plus", E0);
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const _0 = [
    ["path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", key: "975kel" }],
    ["circle", { cx: "12", cy: "7", r: "4", key: "17ys0d" }],
  ],
  mn = q("user", _0);
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const R0 = [
    ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
    ["path", { d: "m6 6 12 12", key: "d8bk6v" }],
  ],
  Ls = q("x", R0);
function Dd({ post: e }) {
  const [t, n] = y.useState(!1),
    [r, s] = y.useState(0),
    [i, o] = y.useState(!1),
    a = Mn(),
    c = bt().pathname.includes("/status/");
  y.useEffect(() => {
    const f = () => {
      o(window.innerWidth <= 768);
    };
    return (
      f(),
      window.addEventListener("resize", f),
      () => window.removeEventListener("resize", f)
    );
  }, []);
  const d = () => {
      n(!t);
    },
    h = () => {
      c || a(`/${e.userId}/status/${e.id}`);
    },
    g = (f, j) => {
      j.stopPropagation(), a(`/search?q=${encodeURIComponent(`#${f}`)}`);
    },
    w = (f) => {
      f.stopPropagation();
      const j = x();
      s((S) => (S - 1 + j.length) % j.length);
    },
    k = (f) => {
      f.stopPropagation();
      const j = x();
      s((S) => (S + 1) % j.length);
    },
    x = () => {
      const f = e.images && e.images.length > 0,
        j = e.videos && e.videos.length > 0;
      if (!f && !j) return [];
      const S = [];
      let R = 0;
      return (
        f &&
          e.images.forEach((N, P) => {
            S.push({
              type: "image",
              url: N,
              key: `image-${P}`,
              imageIndex: R++,
            });
          }),
        j &&
          e.videos.forEach((N, P) => {
            S.push({
              type: "video",
              url: N,
              key: `video-${P}`,
              imageIndex: null,
            });
          }),
        S
      );
    };
  y.useEffect(() => {
    s(0);
  }, [e.id]);
  const C = () => {
      const f = x();
      return f.length === 0
        ? null
        : l.jsx("div", {
            className: "post-media",
            children: l.jsxs("div", {
              className: "post-media-carousel",
              children: [
                l.jsxs("div", {
                  className: "post-media-carousel-container",
                  children: [
                    f.length > 1 &&
                      l.jsxs(l.Fragment, {
                        children: [
                          r > 0 &&
                            l.jsx("button", {
                              className:
                                "post-media-nav-btn post-media-nav-prev",
                              onClick: w,
                              "aria-label": "Previous media",
                              children: l.jsx(qm, { size: 20 }),
                            }),
                          r < f.length - 1 &&
                            l.jsx("button", {
                              className:
                                "post-media-nav-btn post-media-nav-next",
                              onClick: k,
                              "aria-label": "Next media",
                              children: l.jsx(Km, { size: 20 }),
                            }),
                        ],
                      }),
                    l.jsx("div", {
                      className: "post-media-carousel-slider",
                      style: {
                        transform: `translateX(-${r * 100}%)`,
                        transition: "transform 0.3s ease-in-out",
                      },
                      children: f.map((j, S) =>
                        l.jsx(
                          "div",
                          {
                            className: "post-media-carousel-item",
                            children:
                              j.type === "image"
                                ? l.jsx("img", {
                                    src: j.url,
                                    alt: `Media ${S + 1} of ${f.length}`,
                                    className:
                                      "post-media-carousel-content post-image",
                                    loading: "lazy",
                                    style: { cursor: "pointer" },
                                  })
                                : l.jsx("video", {
                                    src: j.url,
                                    className:
                                      "post-media-carousel-content post-video",
                                    controls: !0,
                                    preload: "metadata",
                                    onClick: (R) => R.stopPropagation(),
                                    onPlay: (R) => R.stopPropagation(),
                                    onPause: (R) => R.stopPropagation(),
                                    children:
                                      "Your browser does not support the video tag.",
                                  }),
                          },
                          j.key
                        )
                      ),
                    }),
                  ],
                }),
                f.length > 1 &&
                  l.jsx("div", {
                    className: "post-media-counter",
                    children: l.jsxs("span", {
                      children: [r + 1, " / ", f.length],
                    }),
                  }),
                f.length > 1 &&
                  l.jsx("div", {
                    className: "post-media-dots",
                    children: f.map((j, S) =>
                      l.jsx(
                        "button",
                        {
                          className: `post-media-dot ${
                            S === r ? "active" : ""
                          }`,
                          onClick: (R) => {
                            R.stopPropagation(), s(S);
                          },
                          "aria-label": `Go to media ${S + 1}`,
                        },
                        S
                      )
                    ),
                  }),
              ],
            }),
          });
    },
    m = () => {
      const f = e.images && e.images.length > 0,
        j = e.videos && e.videos.length > 0;
      if (!f && !j) return null;
      const S = [];
      let R = 0;
      f &&
        e.images.forEach((T, D) => {
          S.push({ type: "image", url: T, key: `image-${D}`, imageIndex: R++ });
        }),
        j &&
          e.videos.forEach((T, D) => {
            S.push({
              type: "video",
              url: T,
              key: `video-${D}`,
              imageIndex: null,
            });
          });
      const N = S.slice(0, 4),
        P = S.slice(4),
        $ = (T) =>
          T === 1
            ? "post-media-grid-1"
            : T === 2
            ? "post-media-grid-2"
            : T === 3
            ? "post-media-grid-3-custom"
            : "post-media-grid-4";
      return l.jsxs("div", {
        className: "post-media",
        children: [
          l.jsx("div", {
            className: `post-media-grid ${$(N.length)}`,
            children: N.map((T, D) =>
              l.jsx(
                "div",
                {
                  className: "post-media-item",
                  children:
                    T.type === "image"
                      ? l.jsx("img", {
                          src: T.url,
                          alt: `Post media ${D + 1}`,
                          className: "post-media-content post-image",
                          loading: "lazy",
                          style: { cursor: "pointer" },
                        })
                      : l.jsx("video", {
                          src: T.url,
                          className: "post-media-content post-video",
                          controls: !0,
                          preload: "metadata",
                          onClick: (W) => W.stopPropagation(),
                          onPlay: (W) => W.stopPropagation(),
                          onPause: (W) => W.stopPropagation(),
                          children:
                            "Your browser does not support the video tag.",
                        }),
                },
                T.key
              )
            ),
          }),
          P.length > 0 &&
            l.jsxs("div", {
              className: "post-media-scroll",
              children: [
                l.jsxs("div", {
                  className: "post-media-scroll-header",
                  onClick: (T) => {
                    T.stopPropagation(), d();
                  },
                  role: "button",
                  tabIndex: 0,
                  onKeyDown: (T) => {
                    (T.key === "Enter" || T.key === " ") &&
                      (T.preventDefault(), T.stopPropagation(), d());
                  },
                  "aria-expanded": t,
                  "aria-controls": "additional-media-content",
                  children: [
                    l.jsxs("span", {
                      className: "post-media-scroll-title",
                      children: ["Additional Media (", P.length, ")"],
                    }),
                    t
                      ? l.jsx(Ym, { size: 16, color: "#adb5bd" })
                      : l.jsx(Hm, { size: 16, color: "#adb5bd" }),
                  ],
                }),
                l.jsx("div", {
                  id: "additional-media-content",
                  className: `post-media-scroll-container ${
                    t ? "expanded" : ""
                  }`,
                  children: P.map((T, D) =>
                    l.jsx(
                      "div",
                      {
                        className: "post-media-scroll-item",
                        children:
                          T.type === "image"
                            ? l.jsx("img", {
                                src: T.url,
                                alt: `Additional media ${D + 1}`,
                                className: "post-media-scroll-content",
                                loading: "lazy",
                                style: { cursor: "pointer" },
                              })
                            : l.jsx("video", {
                                src: T.url,
                                className: "post-media-scroll-content",
                                controls: !0,
                                preload: "metadata",
                                onClick: (W) => W.stopPropagation(),
                                onPlay: (W) => W.stopPropagation(),
                                onPause: (W) => W.stopPropagation(),
                                children:
                                  "Your browser does not support the video tag.",
                              }),
                      },
                      T.key
                    )
                  ),
                }),
              ],
            }),
        ],
      });
    },
    p = () =>
      !e.tags || e.tags.length === 0
        ? null
        : l.jsx("div", {
            className: "post-tags",
            children: e.tags.map((f, j) =>
              l.jsx(
                "span",
                {
                  className: "post-tag",
                  onClick: (S) => g(f, S),
                  style: { cursor: "pointer" },
                  children: f,
                },
                j
              )
            ),
          });
  return l.jsxs("div", {
    className: "post-content",
    onClick: c ? void 0 : h,
    style: { cursor: c ? "default" : "pointer" },
    children: [
      l.jsx("h5", { className: "post-title", children: e.title }),
      l.jsx("p", {
        className: "post-body",
        style: { color: "#000", backgroundColor: "#fff" },
        children: e.body,
      }),
      c || i ? C() : m(),
      p(),
    ],
  });
}
function Eo({
  currentLikes: e,
  currentDislikes: t,
  userLiked: n,
  userDisliked: r,
  likeAnimation: s,
  dislikeAnimation: i,
  onLike: o,
  onDislike: a,
  onComments: u,
  onShare: c,
  post: d,
}) {
  const h = Mn(),
    g = () => {
      h(`/${d.userId}/status/${d.id}`), u && u();
    };
  return l.jsxs("div", {
    className: "post-reactions",
    children: [
      l.jsxs("button", {
        className: `post-action-btn ${n ? "liked" : ""}`,
        onClick: o,
        children: [
          l.jsx("span", {
            className: `post-action-icon ${s ? "animate-pulse" : ""}`,
            children: l.jsx("svg", {
              width: "16",
              height: "16",
              viewBox: "0 0 24 24",
              fill: n ? "currentColor" : "none",
              stroke: "currentColor",
              strokeWidth: "2",
              children: l.jsx("path", {
                d: "M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3",
              }),
            }),
          }),
          l.jsx("span", { children: e }),
        ],
      }),
      l.jsxs("button", {
        className: `post-action-btn ${r ? "disliked" : ""}`,
        onClick: a,
        children: [
          l.jsx("span", {
            className: `post-action-icon ${i ? "animate-pulse" : ""}`,
            children: l.jsx("svg", {
              width: "16",
              height: "16",
              viewBox: "0 0 24 24",
              fill: r ? "currentColor" : "none",
              stroke: "currentColor",
              strokeWidth: "2",
              children: l.jsx("path", {
                d: "M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17",
              }),
            }),
          }),
          l.jsx("span", { children: t }),
        ],
      }),
      l.jsxs("button", {
        className: "post-action-btn",
        onClick: g,
        children: [
          l.jsx("svg", {
            width: "16",
            height: "16",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            children: l.jsx("path", {
              d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
            }),
          }),
          l.jsx("span", { children: "Comment" }),
        ],
      }),
    ],
  });
}
Eo.propTypes = {
  currentLikes: v.number,
  currentDislikes: v.number,
  userLiked: v.bool,
  userDisliked: v.bool,
  likeAnimation: v.bool,
  dislikeAnimation: v.bool,
  onLike: v.func.isRequired,
  onDislike: v.func.isRequired,
  onComments: v.func,
  onShare: v.func,
  post: v.shape({
    id: v.oneOfType([v.string, v.number]).isRequired,
    userId: v.oneOfType([v.string, v.number]).isRequired,
  }).isRequired,
};
Eo.defaultProps = {
  currentLikes: 0,
  currentDislikes: 0,
  userLiked: !1,
  userDisliked: !1,
  likeAnimation: !1,
  dislikeAnimation: !1,
  onComments: null,
  onShare: null,
};
function Po({ views: e }) {
  return l.jsxs("div", {
    className: "post-views",
    children: [
      l.jsxs("svg", {
        width: "16",
        height: "16",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: [
          l.jsx("path", { d: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" }),
          l.jsx("circle", { cx: "12", cy: "12", r: "3" }),
        ],
      }),
      l.jsx("small", { children: e }),
    ],
  });
}
Po.propTypes = { views: v.number };
Po.defaultProps = { views: 0 };
function _o({ views: e, onShare: t, post: n, shareCount: r, userShared: s }) {
  const i = async () => {
    if (navigator.share)
      try {
        await navigator.share({
          title: `Post by ${n.username || "User"}`,
          text: n.content || "Check out this post!",
          url: `${window.location.origin}/${n.userId}/status/${n.id}`,
        });
      } catch (o) {
        console.log("Share cancelled or failed:", o);
      }
    else {
      const o = `${window.location.origin}/${n.userId}/status/${n.id}`;
      try {
        await navigator.clipboard.writeText(o),
          alert("Link copied to clipboard!");
      } catch (a) {
        console.log("Clipboard write failed:", a);
      }
    }
    t && t();
  };
  return l.jsxs("div", {
    className: "share-views-container",
    children: [
      l.jsx(Po, { views: e }),
      l.jsxs("button", {
        className: `post-action-btn share-btn ${s ? "shared" : ""}`,
        onClick: i,
        title: "Share this post",
        children: [
          l.jsxs("svg", {
            width: "16",
            height: "16",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            children: [
              l.jsx("circle", { cx: "18", cy: "5", r: "3" }),
              l.jsx("circle", { cx: "6", cy: "12", r: "3" }),
              l.jsx("circle", { cx: "18", cy: "19", r: "3" }),
              l.jsx("line", {
                x1: "8.59",
                y1: "13.51",
                x2: "15.42",
                y2: "17.49",
              }),
              l.jsx("line", {
                x1: "15.41",
                y1: "6.51",
                x2: "8.59",
                y2: "10.49",
              }),
            ],
          }),
          r > 0 && l.jsx("span", { children: r }),
        ],
      }),
    ],
  });
}
_o.propTypes = {
  views: v.number,
  onShare: v.func,
  post: v.shape({
    id: v.oneOfType([v.string, v.number]).isRequired,
    userId: v.oneOfType([v.string, v.number]).isRequired,
    username: v.string,
    content: v.string,
  }).isRequired,
  shareCount: v.number,
  userShared: v.bool,
};
_o.defaultProps = { views: 0, onShare: null, shareCount: 0, userShared: !1 };
function Ro({
  post: e,
  currentLikes: t,
  currentDislikes: n,
  userLiked: r,
  userDisliked: s,
  likeAnimation: i,
  dislikeAnimation: o,
  onLike: a,
  onDislike: u,
  onComments: c,
  onShare: d,
  shareCount: h,
  userShared: g,
}) {
  return l.jsxs("div", {
    className: "post-actions",
    children: [
      l.jsx(Eo, {
        currentLikes: t,
        currentDislikes: n,
        userLiked: r,
        userDisliked: s,
        likeAnimation: i,
        dislikeAnimation: o,
        onLike: a,
        onDislike: u,
        onComments: c,
        onShare: d,
        post: e,
      }),
      l.jsx(_o, {
        views: e.views,
        onShare: d,
        post: e,
        shareCount: h,
        userShared: g,
      }),
    ],
  });
}
Ro.propTypes = {
  post: v.shape({
    id: v.oneOfType([v.string, v.number]).isRequired,
    userId: v.oneOfType([v.string, v.number]).isRequired,
    views: v.number.isRequired,
    username: v.string,
    content: v.string,
  }).isRequired,
  currentLikes: v.number.isRequired,
  currentDislikes: v.number.isRequired,
  userLiked: v.bool.isRequired,
  userDisliked: v.bool.isRequired,
  likeAnimation: v.bool.isRequired,
  dislikeAnimation: v.bool.isRequired,
  onLike: v.func.isRequired,
  onDislike: v.func.isRequired,
  onComments: v.func,
  onShare: v.func,
  shareCount: v.number,
  userShared: v.bool,
};
function Js({ showComments: e, comments: t }) {
  if (!e) return null;
  const n = (s) => {
      const i = new Date(s),
        a = Math.floor((new Date() - i) / (1e3 * 60));
      return a < 1
        ? "Just now"
        : a < 60
        ? `${a}m ago`
        : a < 1440
        ? `${Math.floor(a / 60)}h ago`
        : a < 10080
        ? `${Math.floor(a / 1440)}d ago`
        : i.toLocaleDateString();
    },
    r = (s) =>
      l.jsxs(
        "div",
        {
          className: "post-comment",
          children: [
            l.jsxs("div", {
              className: "comment-header",
              children: [
                l.jsxs("div", {
                  className: "comment-user-info",
                  children: [
                    l.jsx(Pr, {
                      user: {
                        avatar: s.UsersProfilePic,
                        username: s.username,
                        id: s.userId,
                      },
                      size: 20,
                    }),
                    l.jsxs("div", {
                      className: "comment-user-details",
                      children: [
                        l.jsx("strong", {
                          className: "comment-username",
                          children: s.username,
                        }),
                        l.jsx("span", {
                          className: "comment-timestamp",
                          children: n(s.timestamp),
                        }),
                      ],
                    }),
                  ],
                }),
                l.jsxs("div", {
                  className: "comment-reactions",
                  children: [
                    l.jsxs("button", {
                      className: "comment-reaction-btn",
                      children: [
                        l.jsx("svg", {
                          width: "14",
                          height: "14",
                          viewBox: "0 0 24 24",
                          fill: "none",
                          stroke: "currentColor",
                          strokeWidth: "2",
                          children: l.jsx("path", {
                            d: "M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3",
                          }),
                        }),
                        l.jsx("span", { children: s.reactions.likes }),
                      ],
                    }),
                    l.jsxs("button", {
                      className: "comment-reaction-btn",
                      children: [
                        l.jsx("svg", {
                          width: "14",
                          height: "14",
                          viewBox: "0 0 24 24",
                          fill: "none",
                          stroke: "currentColor",
                          strokeWidth: "2",
                          children: l.jsx("path", {
                            d: "M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17",
                          }),
                        }),
                        l.jsx("span", { children: s.reactions.dislikes }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            l.jsx("div", {
              className: "comment-body",
              children: l.jsx("p", { children: s.body }),
            }),
          ],
        },
        s.id
      );
  return l.jsx("div", {
    className: "post-comments",
    children:
      t && t.length > 0
        ? l.jsx("div", { className: "comments-list", children: t.map(r) })
        : l.jsx("p", {
            className: "post-no-comments",
            children: "No comments yet...",
          }),
  });
}
Js.propTypes = {
  showComments: v.bool.isRequired,
  comments: v.arrayOf(
    v.shape({
      id: v.oneOfType([v.string, v.number]).isRequired,
      userId: v.oneOfType([v.string, v.number]).isRequired,
      username: v.string.isRequired,
      UsersProfilePic: v.string,
      body: v.string.isRequired,
      timestamp: v.string.isRequired,
      reactions: v.shape({
        likes: v.number.isRequired,
        dislikes: v.number.isRequired,
      }).isRequired,
    })
  ),
};
Js.defaultProps = { comments: [] };
function T0() {
  const { postList: e } = y.useContext(Xs),
    n = window.location.pathname.split("/").filter((B) => B !== "")[2],
    r = (B) => e.find((_e) => _e.id == B),
    [s, i] = y.useState(!0),
    [o, a] = y.useState(!1),
    [u, c] = y.useState(!1),
    [d, h] = y.useState(!0),
    [g, w] = y.useState(!1),
    [k, x] = y.useState(!1),
    [C, m] = y.useState(!1),
    [p, f] = y.useState(!1),
    [j, S] = y.useState(0),
    [R, N] = y.useState(0),
    [P, $] = y.useState(!1),
    [T, D] = y.useState(!1),
    [W, Pe] = y.useState(""),
    [I, O] = y.useState(!1),
    [V, te] = y.useState([]),
    _ = r(n);
  y.useEffect(() => {
    const B = setTimeout(() => {
      var _e, en;
      if (!e || e.length === 0) {
        i(!0);
        return;
      }
      _
        ? (S(((_e = _.reactions) == null ? void 0 : _e.likes) || 0),
          N(((en = _.reactions) == null ? void 0 : en.dislikes) || 0),
          te(_.comments || []),
          i(!1),
          a(!1))
        : (i(!1), a(!0));
    }, 100);
    return () => clearTimeout(B);
  }, [_, e]);
  const M = () => {
      T && (N((B) => B - 1), D(!1)),
        P ? (S((B) => B - 1), $(!1)) : (S((B) => B + 1), $(!0)),
        m(!0),
        setTimeout(() => m(!1), 600);
    },
    z = () => {
      P && (S((B) => B - 1), $(!1)),
        T ? (N((B) => B - 1), D(!1)) : (N((B) => B + 1), D(!0)),
        f(!0),
        setTimeout(() => f(!1), 600);
    },
    F = () => {
      x(!0),
        c(!1),
        setTimeout(() => {
          w(!0);
        }, 300);
    },
    K = () => {
      h(!d);
    },
    nt = (B) => {
      if ((B.preventDefault(), W.trim() === "")) return;
      O(!0);
      const _e = {
        id: Date.now(),
        text: W.trim(),
        author: "Current User",
        timestamp: new Date().toISOString(),
        likes: 0,
        replies: [],
      };
      te((en) => [...en, _e]),
        Pe(""),
        setTimeout(() => {
          O(!1);
        }, 500);
    },
    Oe = (B) => {
      Pe(B.target.value);
    },
    De = () => {
      window.location.href = "/";
    };
  return s
    ? l.jsxs("div", {
        className: "post",
        children: [
          l.jsx("button", {
            className: "cross-button",
            onClick: De,
            "aria-label": "Go to Home",
            children: l.jsx("svg", {
              width: "24",
              height: "24",
              viewBox: "0 0 24 24",
              fill: "none",
              children: l.jsx("path", {
                d: "M18 6L6 18M6 6L18 18",
                stroke: "currentColor",
                strokeWidth: "2",
                strokeLinecap: "round",
                strokeLinejoin: "round",
              }),
            }),
          }),
          l.jsx("div", {
            className: "post-page",
            children: l.jsx("div", {
              className: "post-card",
              children: l.jsx("div", {
                className: "post-card-body",
                children: l.jsx("div", { className: "loading-spinner" }),
              }),
            }),
          }),
        ],
      })
    : o
    ? l.jsxs("div", {
        className: "post",
        children: [
          l.jsx("button", {
            className: "cross-button",
            onClick: De,
            "aria-label": "Go to Home",
            children: l.jsx("svg", {
              width: "24",
              height: "24",
              viewBox: "0 0 24 24",
              fill: "none",
              children: l.jsx("path", {
                d: "M18 6L6 18M6 6L18 18",
                stroke: "currentColor",
                strokeWidth: "2",
                strokeLinecap: "round",
                strokeLinejoin: "round",
              }),
            }),
          }),
          l.jsx("div", {
            className: "post-page",
            children: l.jsx("div", {
              className: "post-card",
              children: l.jsx("div", {
                className: "post-card-body",
                children: l.jsxs("div", {
                  className: "error-message",
                  children: [
                    l.jsx("h3", { children: "Post not found" }),
                    l.jsx("p", {
                      children:
                        "The post you're looking for doesn't exist or has been deleted.",
                    }),
                    l.jsx("button", {
                      onClick: () => window.history.back(),
                      children: "Go Back",
                    }),
                  ],
                }),
              }),
            }),
          }),
        ],
      })
    : g
    ? l.jsxs("div", {
        className: "post",
        children: [
          l.jsx("button", {
            className: "cross-button",
            onClick: De,
            "aria-label": "Go to Home",
            children: l.jsx("svg", {
              width: "24",
              height: "24",
              viewBox: "0 0 24 24",
              fill: "none",
              children: l.jsx("path", {
                d: "M18 6L6 18M6 6L18 18",
                stroke: "currentColor",
                strokeWidth: "2",
                strokeLinecap: "round",
                strokeLinejoin: "round",
              }),
            }),
          }),
          l.jsx("div", {
            className: "post-page",
            children: l.jsx("div", {
              className: "post-card",
              children: l.jsx("div", {
                className: "post-card-body",
                children: l.jsxs("div", {
                  className: "error-message",
                  children: [
                    l.jsx("h3", { children: "Post Deleted" }),
                    l.jsx("p", {
                      children: "This post has been successfully deleted.",
                    }),
                    l.jsx("button", { onClick: De, children: "Go to Home" }),
                  ],
                }),
              }),
            }),
          }),
        ],
      })
    : l.jsxs("div", {
        className: "post",
        children: [
          l.jsx("button", {
            className: "cross-button",
            onClick: De,
            "aria-label": "Go to Home",
            children: l.jsx("svg", {
              width: "24",
              height: "24",
              viewBox: "0 0 24 24",
              fill: "none",
              children: l.jsx("path", {
                d: "M18 6L6 18M6 6L18 18",
                stroke: "currentColor",
                strokeWidth: "2",
                strokeLinecap: "round",
                strokeLinejoin: "round",
              }),
            }),
          }),
          l.jsx("div", {
            className: "post-page",
            children: l.jsx("div", {
              className: `post-card ${k ? "deleting" : ""}`,
              children: l.jsxs("div", {
                className: "post-card-body",
                children: [
                  l.jsx(So, {
                    post: _,
                    showDropdown: u,
                    setShowDropdown: c,
                    onDelete: F,
                  }),
                  l.jsx(Dd, { post: _ }),
                  l.jsx(Ro, {
                    post: _,
                    currentLikes: j,
                    currentDislikes: R,
                    userLiked: P,
                    userDisliked: T,
                    likeAnimation: C,
                    dislikeAnimation: p,
                    onLike: M,
                    onDislike: z,
                    onComments: K,
                  }),
                  l.jsx("div", {
                    className: "comment-input-section",
                    children: l.jsx("form", {
                      onSubmit: nt,
                      className: "comment-form",
                      children: l.jsxs("div", {
                        className: "comment-input-container",
                        children: [
                          l.jsx("input", {
                            type: "text",
                            value: W,
                            onChange: Oe,
                            placeholder: "Write a comment...",
                            className: "comment-input",
                            disabled: I,
                          }),
                          l.jsx("button", {
                            type: "submit",
                            className: `comment-submit-btn ${
                              I ? "submitting" : ""
                            }`,
                            disabled: I || W.trim() === "",
                            children: I ? "Posting..." : "Post",
                          }),
                        ],
                      }),
                    }),
                  }),
                  l.jsx(Js, { showComments: d, comments: V }),
                ],
              }),
            }),
          }),
        ],
      });
}
function To({ post: e, onDelete: t }) {
  const [n, r] = y.useState(!1),
    [s, i] = y.useState(!1),
    [o, a] = y.useState(!1),
    [u, c] = y.useState(!1),
    [d, h] = y.useState(!1),
    [g, w] = y.useState(!1),
    [k, x] = y.useState(e.reactions.likes),
    [C, m] = y.useState(e.reactions.dislikes),
    [p, f] = y.useState(!1),
    [j, S] = y.useState(!1),
    R = () => {
      j && (m((D) => D - 1), S(!1)),
        p ? (x((D) => D - 1), f(!1)) : (x((D) => D + 1), f(!0)),
        h(!0),
        setTimeout(() => h(!1), 600);
    },
    N = () => {
      p && (x((D) => D - 1), f(!1)),
        j ? (m((D) => D - 1), S(!1)) : (m((D) => D + 1), S(!0)),
        w(!0),
        setTimeout(() => w(!1), 600);
    },
    P = () => {
      c(!0),
        r(!1),
        setTimeout(() => {
          a(!0), t && t(e.id);
        }, 300);
    },
    $ = () => {
      i(!s);
    },
    T = () => {
      setShowUserModal(!0);
    };
  return o
    ? null
    : l.jsx(l.Fragment, {
        children: l.jsx("div", {
          className: `post-card ${u ? "deleting" : ""}`,
          children: l.jsxs("div", {
            className: "post-card-body",
            children: [
              l.jsx(So, {
                post: e,
                showDropdown: n,
                setShowDropdown: r,
                onUserClick: T,
                onDelete: P,
              }),
              l.jsx(Dd, { post: e }),
              l.jsx(Ro, {
                post: e,
                currentLikes: k,
                currentDislikes: C,
                userLiked: p,
                userDisliked: j,
                likeAnimation: d,
                dislikeAnimation: g,
                onLike: R,
                onDislike: N,
                onComments: $,
              }),
              l.jsx(Js, { showComments: s, comments: e.comments }),
            ],
          }),
        }),
      });
}
To.propTypes = {
  post: v.shape({
    id: v.oneOfType([v.string, v.number]).isRequired,
    userId: v.oneOfType([v.string, v.number]).isRequired,
    username: v.string.isRequired,
    UsersProfilePic: v.string,
    title: v.string.isRequired,
    body: v.string.isRequired,
    reactions: v.shape({
      likes: v.number.isRequired,
      dislikes: v.number.isRequired,
    }).isRequired,
    tags: v.arrayOf(v.string),
    views: v.number.isRequired,
    images: v.arrayOf(v.string),
    videos: v.arrayOf(v.string),
    comments: v.arrayOf(
      v.shape({
        id: v.oneOfType([v.string, v.number]).isRequired,
        userId: v.oneOfType([v.string, v.number]).isRequired,
        username: v.string.isRequired,
        UsersProfilePic: v.string,
        body: v.string.isRequired,
        timestamp: v.string.isRequired,
        reactions: v.shape({
          likes: v.number.isRequired,
          dislikes: v.number.isRequired,
        }).isRequired,
      })
    ),
    timestamp: v.string.isRequired,
  }).isRequired,
  onDelete: v.func,
};
To.defaultProps = { onDelete: null };
function bd({ onGetPostClick: e }) {
  return l.jsx("div", {
    className: "bg text-secondary px-4 py-5 text-center WelcomeMessage",
    children: l.jsxs("div", {
      className: "py-5",
      children: [
        l.jsx("h1", {
          className: "display-5 fw-bold text-black ",
          children: "Welcome to Twooter",
        }),
        l.jsxs("div", {
          className: "col-lg-6 mx-auto",
          children: [
            l.jsx("p", {
              className: "fs-5 mb-4",
              children:
                "This is a very unique and interesting social media platform where you can relax and have fun. On this website, you can learn about people's thoughts, get to know your friends, family, and the world.",
            }),
            l.jsx("div", {
              className: "d-grid gap-2 d-sm-flex justify-content-sm-center",
              children: l.jsx("button", {
                onClick: e,
                type: "button",
                className: "btn btn-outline-dark btn-lg px-4 me-sm-3 fw-bold",
                children: "View Posts",
              }),
            }),
          ],
        }),
      ],
    }),
  });
}
bd.propTypes = { onGetPostClick: v.func.isRequired };
function L0() {
  return l.jsx("div", {
    className: "LoadingPage",
    children: l.jsx("div", {
      className: "spinner-border",
      style: { width: "3rem", height: "3rem" },
      role: "status",
      children: l.jsx("span", {
        className: "visually-hidden",
        children: "Loading...",
      }),
    }),
  });
}
const Lo = ({ isActive: e, fetching: t, postList: n }) => (
  // console.log(n),
  l.jsxs("div", {
    className: `section home-section ${e ? "active" : ""}`,
    children: [
      t && l.jsx(L0, {}),
      !t && n.length === 0 && l.jsx(bd, {}),
      !t && n.map((r) => l.jsx(To, { post: r }, r.id)),
    ],
  })
);
Lo.propTypes = {
  isActive: v.bool.isRequired,
  fetching: v.bool.isRequired,
  postList: v.arrayOf(v.object).isRequired,
};
const Ud = ({ isActive: e }) =>
  l.jsx("div", {
    className: `section messages-section ${e ? "active" : ""}`,
    children: l.jsxs("div", {
      className: "messages-placeholder",
      children: [
        l.jsx("h2", { children: "Messages" }),
        l.jsx("p", { children: "Your messages will appear here" }),
      ],
    }),
  });
Ud.propTypes = { isActive: v.bool.isRequired };
const I0 = (e = ".posts-container", t = 50) => {
  const [n, r] = y.useState(!1);
  return (
    y.useEffect(() => {
      const s = (o) => {
          const a = o.target.scrollTop;
          r(a > t);
        },
        i = document.querySelector(e);
      if (i)
        return (
          i.addEventListener("scroll", s),
          () => i.removeEventListener("scroll", s)
        );
    }, [e, t]),
    n
  );
};
function M0() {
  const { postList: e, fetching: t } = y.useContext(Xs),
    [n, r] = y.useState("home"),
    s = I0(),
    i = (o) => {
      r(o);
    };
  return (
    console.log(e),
    l.jsxs("div", {
      className: "posts-container",
      children: [
        l.jsx(Td, { isScrolled: s, activeSection: n, onSectionToggle: i }),
        l.jsxs("div", {
          className: "posts-content",
          children: [
            l.jsx(Lo, { isActive: n === "home", fetching: t, postList: e }),
            l.jsx(Ud, { isActive: n === "messages" }),
          ],
        }),
      ],
    })
  );
}
function z0() {
  return l.jsx(M0, {});
}
function O0() {
  return l.jsx("div", {
    className: "bg text-secondary px-4 py-5 text-center WelcomeMessage",
    children: l.jsxs("div", {
      className: "py-5",
      children: [
        l.jsx("h1", {
          className: "display-5 fw-bold text-black ",
          children: "Search Page",
        }),
        l.jsx("div", {
          className: "col-lg-6 mx-auto",
          children: l.jsx("p", {
            className: "fs-5 mb-4",
            children:
              "Coming Soon! This page will allow you to search for posts, users, and more. Stay tuned for updates!",
          }),
        }),
      ],
    }),
  });
}
function D0() {
  return l.jsx(O0, {});
}
Ad.propTypes = { children: v.node.isRequired };
const $d = y.createContext({
    userList: [],
    fetching: !1,
    addUser: () => {},
    deleteUser: () => {},
    updateUser: () => {},
    getUserById: () => {},
  }),
  b0 = (e, t) => {
    let n = e;
    return (
      t.type === "DELETE_USER"
        ? (n = e.filter((r) => r.userId !== t.payload.userId))
        : t.type === "ADD_USER"
        ? (n = [t.payload, ...e])
        : t.type === "UPDATE_USER"
        ? (n = e.map((r) => (r.userId === t.payload.userId ? t.payload : r)))
        : t.type === "ADD_INITIAL_USERS" && (n = t.payload.users),
      n
    );
  };
function Ad({ children: e }) {
  const [t, n] = y.useReducer(b0, []),
    [r, s] = y.useState(!1),
    i = (d) => {
      n({ type: "ADD_INITIAL_USERS", payload: { users: d } });
    },
    o = async (d, h, g, w = null, k = null) => {
      const x = {
        userId: d,
        username: h,
        email: g,
        contactNumber: w,
        UsersProfilePic:
          k ||
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      };
      try {
        const C = await fetch("http://localhost:3000/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(x),
        });
        if (C.ok) {
          const m = await C.json();
          return n({ type: "ADD_USER", payload: m }), m;
        } else {
          const m = await C.json();
          throw new Error(m.error || "Failed to create user");
        }
      } catch (C) {
        throw (console.error("Error creating user:", C), C);
      }
    },
    a = async (d, h) => {
      try {
        const g = await fetch(`http://localhost:3000/api/users/${d}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(h),
        });
        if (g.ok) {
          const w = await g.json();
          return n({ type: "UPDATE_USER", payload: w }), w;
        } else {
          const w = await g.json();
          throw new Error(w.error || "Failed to update user");
        }
      } catch (g) {
        throw (console.error("Error updating user:", g), g);
      }
    },
    u = async (d) => {
      try {
        const h = await fetch(`http://localhost:3000/api/users/${d}`, {
          method: "DELETE",
        });
        if (h.ok) return n({ type: "DELETE_USER", payload: { userId: d } }), !0;
        {
          const g = await h.json();
          throw new Error(g.error || "Failed to delete user");
        }
      } catch (h) {
        throw (console.error("Error deleting user:", h), h);
      }
    },
    c = (d) => t.find((h) => h.userId === d);
  return (
    y.useEffect(() => {
      const d = new AbortController(),
        h = d.signal;
      return (
        s(!0),
        fetch("http://localhost:3000/api/users", { signal: h })
          .then((g) => g.json())
          .then((g) => {
            const w = Array.isArray(g) ? g : g.UserData || [];
            i(w), s(!1);
          })
          .catch((g) => {
            g.name !== "AbortError" &&
              (console.error("Error fetching users:", g), s(!1));
          }),
        () => {
          d.abort();
        }
      );
    }, []),
    l.jsx($d.Provider, {
      value: {
        userList: t,
        fetching: r,
        addUser: o,
        deleteUser: u,
        updateUser: a,
        getUserById: c,
      },
      children: e,
    })
  );
}
function U0() {
  var R;
  const { fetching: e, getUserById: t } = y.useContext($d),
    r = window.location.pathname.split("/").filter((N) => N !== "")[0],
    s = t(r),
    [i, o] = y.useState("posts"),
    [a, u] = y.useState(!1),
    [c, d] = y.useState(
      ((R = s == null ? void 0 : s.socialStats) == null
        ? void 0
        : R.followers) || 0
    ),
    [h, g] = y.useState(!1),
    k = (s == null ? void 0 : s.userId) === "current-user-123";
  if (!s)
    return l.jsx("div", {
      className: "user-profile-container",
      children: l.jsxs("div", {
        className: "loading-container",
        children: [
          l.jsx("div", { className: "loading-spinner" }),
          l.jsx("p", { children: "Loading user profile..." }),
        ],
      }),
    });
  const x = async () => {
      g(!0);
      try {
        await new Promise((N) => setTimeout(N, 500)),
          a
            ? (d((N) => N - 1),
              u(!1),
              // console.log(`Unfollowed user: ${s.userId}`))
            : (d((N) => N + 1),
              u(!0),
              // console.log(`Followed user: ${s.userId}`));
      } catch (N) {
        console.error("Error toggling follow status:", N);
      } finally {
        g(!1);
      }
    },
    C = s.posts.reduce((N, P) => N + P.reactions.likes, 0),
    m = s.posts.reduce((N, P) => N + P.views, 0),
    p = s.posts.reduce((N, P) => N + P.reactions.shares, 0),
    f = s.posts.reduce((N, P) => N + P.reactions.saves, 0),
    j = new Date(s.joinDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    S = new Date(s.lastSeen).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  return l.jsx("div", {
    className: "user-profile-container",
    children: l.jsxs("div", {
      className: "user-profile-content",
      children: [
        l.jsxs("div", {
          className: "profile-header",
          children: [
            l.jsx("div", {
              className: "profile-cover",
              style: { backgroundImage: `url(${s.coverPhoto})` },
              children: l.jsxs("div", {
                className: "profile-avatar-container",
                children: [
                  l.jsx(Pr, {
                    user: {
                      avatar: s.UsersProfilePic,
                      username: s.username,
                      id: s.userId,
                    },
                    size: 120,
                  }),
                  s.isVerified &&
                    l.jsx("div", {
                      className: "verified-badge",
                      children: "✓",
                    }),
                  l.jsx("div", {
                    className: `online-status ${
                      s.isOnline ? "online" : "offline"
                    }`,
                  }),
                ],
              }),
            }),
            l.jsxs("div", {
              className: "profile-info",
              children: [
                l.jsxs("div", {
                  className: "profile-main-info",
                  children: [
                    l.jsxs("h1", {
                      className: "profile-name",
                      children: [
                        s.displayName,
                        s.isVerified &&
                          l.jsx("span", {
                            className: "verified-icon",
                            children: "✓",
                          }),
                      ],
                    }),
                    l.jsxs("p", {
                      className: "profile-username",
                      children: ["@", s.username],
                    }),
                    s.bio &&
                      l.jsx("p", { className: "profile-bio", children: s.bio }),
                    l.jsxs("div", {
                      className: "profile-details",
                      children: [
                        s.location &&
                          l.jsxs("span", {
                            className: "profile-detail",
                            children: [
                              l.jsx("span", {
                                className: "detail-icon",
                                children: "📍",
                              }),
                              s.location,
                            ],
                          }),
                        s.website &&
                          l.jsxs("span", {
                            className: "profile-detail",
                            children: [
                              l.jsx("span", {
                                className: "detail-icon",
                                children: "🔗",
                              }),
                              l.jsx("a", {
                                href: s.website,
                                target: "_blank",
                                rel: "noopener noreferrer",
                                children: s.website,
                              }),
                            ],
                          }),
                        l.jsxs("span", {
                          className: "profile-detail",
                          children: [
                            l.jsx("span", {
                              className: "detail-icon",
                              children: "📅",
                            }),
                            "Joined ",
                            j,
                          ],
                        }),
                      ],
                    }),
                    !k &&
                      l.jsx("div", {
                        className: "follow-section",
                        children: l.jsx("button", {
                          className: `follow-btn ${a ? "following" : "follow"}`,
                          onClick: x,
                          disabled: h,
                          children: h
                            ? l.jsxs("div", {
                                className: "follow-loading",
                                children: [
                                  l.jsx("div", { className: "follow-spinner" }),
                                  l.jsx("span", {
                                    children: a
                                      ? "Unfollowing..."
                                      : "Following...",
                                  }),
                                ],
                              })
                            : l.jsx("span", {
                                children: a ? "Following" : "Follow",
                              }),
                        }),
                      }),
                  ],
                }),
                l.jsxs("div", {
                  className: "profile-stats",
                  children: [
                    l.jsxs("div", {
                      className: "stat-item",
                      children: [
                        l.jsx("span", {
                          className: "stat-number",
                          children: c,
                        }),
                        l.jsx("span", {
                          className: "stat-label",
                          children: "Followers",
                        }),
                      ],
                    }),
                    l.jsxs("div", {
                      className: "stat-item",
                      children: [
                        l.jsx("span", {
                          className: "stat-number",
                          children: s.socialStats.following,
                        }),
                        l.jsx("span", {
                          className: "stat-label",
                          children: "Following",
                        }),
                      ],
                    }),
                    l.jsxs("div", {
                      className: "stat-item",
                      children: [
                        l.jsx("span", {
                          className: "stat-number",
                          children: s.socialStats.posts,
                        }),
                        l.jsx("span", {
                          className: "stat-label",
                          children: "Posts",
                        }),
                      ],
                    }),
                    l.jsxs("div", {
                      className: "stat-item",
                      children: [
                        l.jsx("span", {
                          className: "stat-number",
                          children: C,
                        }),
                        l.jsx("span", {
                          className: "stat-label",
                          children: "Total Likes",
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        l.jsxs("div", {
          className: "profile-nav",
          children: [
            l.jsx("button", {
              className: `nav-tab ${i === "posts" ? "active" : ""}`,
              onClick: () => o("posts"),
              children: "Posts",
            }),
            l.jsx("button", {
              className: `nav-tab ${i === "followers" ? "active" : ""}`,
              onClick: () => o("followers"),
              children: "Followers",
            }),
            l.jsx("button", {
              className: `nav-tab ${i === "about" ? "active" : ""}`,
              onClick: () => o("about"),
              children: "About",
            }),
            l.jsx("button", {
              className: `nav-tab ${i === "activity" ? "active" : ""}`,
              onClick: () => o("activity"),
              children: "Activity",
            }),
            l.jsx("button", {
              className: `nav-tab ${i === "interests" ? "active" : ""}`,
              onClick: () => o("interests"),
              children: "Interests",
            }),
          ],
        }),
        l.jsxs("div", {
          className: "tab-content",
          children: [
            i === "posts" &&
              l.jsx("div", {
                className: "posts-section",
                children: l.jsx(Lo, {
                  isActive: !0,
                  fetching: e,
                  postList: s.posts,
                }),
              }),
            i === "followers" &&
              l.jsxs("div", {
                className: "followers-section",
                children: [
                  l.jsxs("div", {
                    className: "followers-header",
                    children: [
                      l.jsxs("h3", { children: ["Followers (", c, ")"] }),
                      l.jsx("div", {
                        className: "followers-actions",
                        children: l.jsxs("button", {
                          className: "sort-btn",
                          children: [
                            l.jsx("span", { children: "Sort by" }),
                            l.jsx("span", {
                              className: "sort-icon",
                              children: "↕️",
                            }),
                          ],
                        }),
                      }),
                    ],
                  }),
                  l.jsxs("div", {
                    className: "followers-list",
                    children: [
                      Array.from({ length: Math.min(c, 10) }, (N, P) =>
                        l.jsxs(
                          "div",
                          {
                            className: "follower-item",
                            children: [
                              l.jsxs("div", {
                                className: "follower-avatar",
                                children: [
                                  l.jsx("img", {
                                    src: `https://api.dicebear.com/7.x/avataaars/svg?seed=${P}`,
                                    alt: "follower avatar",
                                    className: "follower-img",
                                  }),
                                  l.jsx("div", {
                                    className: "follower-status online",
                                  }),
                                ],
                              }),
                              l.jsxs("div", {
                                className: "follower-info",
                                children: [
                                  l.jsxs("h4", {
                                    className: "follower-name",
                                    children: ["Follower ", P + 1],
                                  }),
                                  l.jsxs("p", {
                                    className: "follower-username",
                                    children: ["@follower", P + 1],
                                  }),
                                  l.jsx("p", {
                                    className: "follower-bio",
                                    children:
                                      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                                  }),
                                  l.jsxs("div", {
                                    className: "follower-stats",
                                    children: [
                                      l.jsxs("span", {
                                        className: "follower-stat",
                                        children: [
                                          Math.floor(Math.random() * 1e3),
                                          " followers",
                                        ],
                                      }),
                                      l.jsxs("span", {
                                        className: "follower-stat",
                                        children: [
                                          Math.floor(Math.random() * 100),
                                          " posts",
                                        ],
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                              l.jsxs("div", {
                                className: "follower-actions",
                                children: [
                                  l.jsx("button", {
                                    className: "follow-back-btn",
                                    children: "Follow Back",
                                  }),
                                  l.jsx("button", {
                                    className: "remove-follower-btn",
                                    children: "Remove",
                                  }),
                                ],
                              }),
                            ],
                          },
                          P
                        )
                      ),
                      c === 0 &&
                        l.jsxs("div", {
                          className: "no-followers",
                          children: [
                            l.jsx("div", {
                              className: "no-followers-icon",
                              children: "👥",
                            }),
                            l.jsx("h4", { children: "No followers yet" }),
                            l.jsx("p", {
                              children:
                                "When people follow this profile, they'll appear here.",
                            }),
                          ],
                        }),
                      c > 10 &&
                        l.jsx("div", {
                          className: "load-more",
                          children: l.jsx("button", {
                            className: "load-more-btn",
                            children: "Load More Followers",
                          }),
                        }),
                    ],
                  }),
                ],
              }),
            i === "about" &&
              l.jsxs("div", {
                className: "about-section",
                children: [
                  l.jsxs("div", {
                    className: "about-card",
                    children: [
                      l.jsx("h3", { children: "Contact Information" }),
                      l.jsxs("div", {
                        className: "info-grid",
                        children: [
                          l.jsxs("div", {
                            className: "info-item",
                            children: [
                              l.jsx("span", {
                                className: "info-label",
                                children: "Display Name",
                              }),
                              l.jsx("span", {
                                className: "info-value",
                                children: s.displayName,
                              }),
                            ],
                          }),
                          l.jsxs("div", {
                            className: "info-item",
                            children: [
                              l.jsx("span", {
                                className: "info-label",
                                children: "Username",
                              }),
                              l.jsxs("span", {
                                className: "info-value",
                                children: ["@", s.username],
                              }),
                            ],
                          }),
                          l.jsxs("div", {
                            className: "info-item",
                            children: [
                              l.jsx("span", {
                                className: "info-label",
                                children: "Email",
                              }),
                              l.jsx("span", {
                                className: "info-value",
                                children: s.profilePrivacy.contactVisible
                                  ? s.email
                                  : "Private",
                              }),
                            ],
                          }),
                          l.jsxs("div", {
                            className: "info-item",
                            children: [
                              l.jsx("span", {
                                className: "info-label",
                                children: "Phone",
                              }),
                              l.jsx("span", {
                                className: "info-value",
                                children: s.profilePrivacy.contactVisible
                                  ? s.contactNumber
                                  : "Private",
                              }),
                            ],
                          }),
                          l.jsxs("div", {
                            className: "info-item",
                            children: [
                              l.jsx("span", {
                                className: "info-label",
                                children: "User ID",
                              }),
                              l.jsx("span", {
                                className: "info-value",
                                children: s.userId,
                              }),
                            ],
                          }),
                          l.jsxs("div", {
                            className: "info-item",
                            children: [
                              l.jsx("span", {
                                className: "info-label",
                                children: "Verified",
                              }),
                              l.jsx("span", {
                                className: "info-value",
                                children: s.isVerified ? "Yes" : "No",
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                  l.jsxs("div", {
                    className: "about-card",
                    children: [
                      l.jsx("h3", { children: "Profile Details" }),
                      l.jsxs("div", {
                        className: "info-grid",
                        children: [
                          l.jsxs("div", {
                            className: "info-item",
                            children: [
                              l.jsx("span", {
                                className: "info-label",
                                children: "Location",
                              }),
                              l.jsx("span", {
                                className: "info-value",
                                children: s.location || "Not specified",
                              }),
                            ],
                          }),
                          l.jsxs("div", {
                            className: "info-item",
                            children: [
                              l.jsx("span", {
                                className: "info-label",
                                children: "Website",
                              }),
                              l.jsx("span", {
                                className: "info-value",
                                children: s.website
                                  ? l.jsx("a", {
                                      href: s.website,
                                      target: "_blank",
                                      rel: "noopener noreferrer",
                                      children: s.website,
                                    })
                                  : "Not specified",
                              }),
                            ],
                          }),
                          l.jsxs("div", {
                            className: "info-item",
                            children: [
                              l.jsx("span", {
                                className: "info-label",
                                children: "Joined",
                              }),
                              l.jsx("span", {
                                className: "info-value",
                                children: j,
                              }),
                            ],
                          }),
                          l.jsxs("div", {
                            className: "info-item",
                            children: [
                              l.jsx("span", {
                                className: "info-label",
                                children: "Last Seen",
                              }),
                              l.jsx("span", {
                                className: "info-value",
                                children: S,
                              }),
                            ],
                          }),
                          l.jsxs("div", {
                            className: "info-item",
                            children: [
                              l.jsx("span", {
                                className: "info-label",
                                children: "Online Status",
                              }),
                              l.jsx("span", {
                                className: "info-value",
                                children: l.jsx("span", {
                                  className: `status-indicator ${
                                    s.isOnline ? "online" : "offline"
                                  }`,
                                  children: s.isOnline ? "Online" : "Offline",
                                }),
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                  l.jsxs("div", {
                    className: "about-card",
                    children: [
                      l.jsx("h3", { children: "Content Statistics" }),
                      l.jsxs("div", {
                        className: "content-stats",
                        children: [
                          l.jsxs("div", {
                            className: "content-stat",
                            children: [
                              l.jsx("span", {
                                className: "stat-icon",
                                children: "📝",
                              }),
                              l.jsxs("div", {
                                children: [
                                  l.jsx("span", {
                                    className: "stat-title",
                                    children: "Posts Created",
                                  }),
                                  l.jsxs("span", {
                                    className: "stat-desc",
                                    children: [
                                      s.socialStats.posts,
                                      " total posts",
                                    ],
                                  }),
                                ],
                              }),
                            ],
                          }),
                          l.jsxs("div", {
                            className: "content-stat",
                            children: [
                              l.jsx("span", {
                                className: "stat-icon",
                                children: "👍",
                              }),
                              l.jsxs("div", {
                                children: [
                                  l.jsx("span", {
                                    className: "stat-title",
                                    children: "Likes Received",
                                  }),
                                  l.jsxs("span", {
                                    className: "stat-desc",
                                    children: [C, " total likes"],
                                  }),
                                ],
                              }),
                            ],
                          }),
                          l.jsxs("div", {
                            className: "content-stat",
                            children: [
                              l.jsx("span", {
                                className: "stat-icon",
                                children: "👁️",
                              }),
                              l.jsxs("div", {
                                children: [
                                  l.jsx("span", {
                                    className: "stat-title",
                                    children: "Views Generated",
                                  }),
                                  l.jsxs("span", {
                                    className: "stat-desc",
                                    children: [m, " total views"],
                                  }),
                                ],
                              }),
                            ],
                          }),
                          l.jsxs("div", {
                            className: "content-stat",
                            children: [
                              l.jsx("span", {
                                className: "stat-icon",
                                children: "📤",
                              }),
                              l.jsxs("div", {
                                children: [
                                  l.jsx("span", {
                                    className: "stat-title",
                                    children: "Shares Received",
                                  }),
                                  l.jsxs("span", {
                                    className: "stat-desc",
                                    children: [p, " total shares"],
                                  }),
                                ],
                              }),
                            ],
                          }),
                          l.jsxs("div", {
                            className: "content-stat",
                            children: [
                              l.jsx("span", {
                                className: "stat-icon",
                                children: "🔖",
                              }),
                              l.jsxs("div", {
                                children: [
                                  l.jsx("span", {
                                    className: "stat-title",
                                    children: "Saves Received",
                                  }),
                                  l.jsxs("span", {
                                    className: "stat-desc",
                                    children: [f, " total saves"],
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                  l.jsxs("div", {
                    className: "about-card",
                    children: [
                      l.jsx("h3", { children: "Privacy Settings" }),
                      l.jsxs("div", {
                        className: "privacy-settings",
                        children: [
                          l.jsxs("div", {
                            className: "privacy-item",
                            children: [
                              l.jsx("span", {
                                className: "privacy-label",
                                children: "Profile Visibility",
                              }),
                              l.jsx("span", {
                                className: "privacy-value",
                                children: s.profilePrivacy.profileVisibility,
                              }),
                            ],
                          }),
                          l.jsxs("div", {
                            className: "privacy-item",
                            children: [
                              l.jsx("span", {
                                className: "privacy-label",
                                children: "Contact Information",
                              }),
                              l.jsx("span", {
                                className: "privacy-value",
                                children: s.profilePrivacy.contactVisible
                                  ? "Visible"
                                  : "Hidden",
                              }),
                            ],
                          }),
                          l.jsxs("div", {
                            className: "privacy-item",
                            children: [
                              l.jsx("span", {
                                className: "privacy-label",
                                children: "Posts Visibility",
                              }),
                              l.jsx("span", {
                                className: "privacy-value",
                                children: s.profilePrivacy.postsVisible,
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            i === "activity" &&
              l.jsxs("div", {
                className: "activity-section",
                children: [
                  l.jsxs("div", {
                    className: "activity-card",
                    children: [
                      l.jsx("h3", { children: "Recent Activity" }),
                      l.jsx("div", {
                        className: "activity-list",
                        children: s.posts.map((N) =>
                          l.jsxs(
                            "div",
                            {
                              className: "activity-item",
                              children: [
                                l.jsx("div", {
                                  className: "activity-icon",
                                  children: "📝",
                                }),
                                l.jsxs("div", {
                                  className: "activity-content",
                                  children: [
                                    l.jsxs("span", {
                                      className: "activity-title",
                                      children: ['Posted "', N.title, '"'],
                                    }),
                                    l.jsx("span", {
                                      className: "activity-time",
                                      children: new Date(
                                        N.timestamp
                                      ).toLocaleDateString(),
                                    }),
                                    N.location &&
                                      l.jsxs("span", {
                                        className: "activity-location",
                                        children: ["📍 ", N.location],
                                      }),
                                  ],
                                }),
                                l.jsxs("div", {
                                  className: "activity-stats",
                                  children: [
                                    l.jsxs("span", {
                                      className: "activity-stat",
                                      children: [N.reactions.likes, " likes"],
                                    }),
                                    l.jsxs("span", {
                                      className: "activity-stat",
                                      children: [N.views, " views"],
                                    }),
                                    l.jsxs("span", {
                                      className: "activity-stat",
                                      children: [N.reactions.shares, " shares"],
                                    }),
                                  ],
                                }),
                              ],
                            },
                            N.id
                          )
                        ),
                      }),
                    ],
                  }),
                  l.jsxs("div", {
                    className: "activity-card",
                    children: [
                      l.jsx("h3", { children: "Popular Tags" }),
                      l.jsx("div", {
                        className: "tag-cloud",
                        children: Array.from(
                          new Set(s.posts.flatMap((N) => N.tags))
                        ).map((N, P) =>
                          l.jsxs(
                            "span",
                            { className: "tag-item", children: ["#", N] },
                            P
                          )
                        ),
                      }),
                    ],
                  }),
                  l.jsxs("div", {
                    className: "activity-card",
                    children: [
                      l.jsx("h3", { children: "Social Engagement" }),
                      l.jsxs("div", {
                        className: "engagement-stats",
                        children: [
                          l.jsxs("div", {
                            className: "engagement-item",
                            children: [
                              l.jsx("span", {
                                className: "engagement-label",
                                children: "Followers",
                              }),
                              l.jsx("span", {
                                className: "engagement-value",
                                children: c,
                              }),
                            ],
                          }),
                          l.jsxs("div", {
                            className: "engagement-item",
                            children: [
                              l.jsx("span", {
                                className: "engagement-label",
                                children: "Following",
                              }),
                              l.jsx("span", {
                                className: "engagement-value",
                                children: s.socialStats.following,
                              }),
                            ],
                          }),
                          l.jsxs("div", {
                            className: "engagement-item",
                            children: [
                              l.jsx("span", {
                                className: "engagement-label",
                                children: "Engagement Rate",
                              }),
                              l.jsxs("span", {
                                className: "engagement-value",
                                children: [
                                  m > 0 ? ((C / m) * 100).toFixed(1) : 0,
                                  "%",
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            i === "interests" &&
              l.jsxs("div", {
                className: "interests-section",
                children: [
                  l.jsxs("div", {
                    className: "about-card",
                    children: [
                      l.jsx("h3", { children: "Interests & Hobbies" }),
                      l.jsx("div", {
                        className: "interests-grid",
                        children: s.interests.map((N, P) =>
                          l.jsx(
                            "div",
                            {
                              className: "interest-item",
                              children: l.jsx("span", {
                                className: "interest-name",
                                children: N,
                              }),
                            },
                            P
                          )
                        ),
                      }),
                    ],
                  }),
                  l.jsxs("div", {
                    className: "about-card",
                    children: [
                      l.jsx("h3", { children: "Theme Preferences" }),
                      l.jsxs("div", {
                        className: "theme-info",
                        children: [
                          l.jsxs("div", {
                            className: "theme-item",
                            children: [
                              l.jsx("span", {
                                className: "theme-label",
                                children: "Theme",
                              }),
                              l.jsx("span", {
                                className: "theme-value",
                                children: s.customization.theme,
                              }),
                            ],
                          }),
                          l.jsxs("div", {
                            className: "theme-item",
                            children: [
                              l.jsx("span", {
                                className: "theme-label",
                                children: "Accent Color",
                              }),
                              l.jsxs("span", {
                                className: "theme-value",
                                children: [
                                  l.jsx("span", {
                                    className: "color-preview",
                                    style: {
                                      backgroundColor:
                                        s.customization.accentColor,
                                    },
                                  }),
                                  s.customization.accentColor,
                                ],
                              }),
                            ],
                          }),
                          l.jsxs("div", {
                            className: "theme-item",
                            children: [
                              l.jsx("span", {
                                className: "theme-label",
                                children: "Background Type",
                              }),
                              l.jsx("span", {
                                className: "theme-value",
                                children: s.customization.backgroundType,
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                  l.jsxs("div", {
                    className: "about-card",
                    children: [
                      l.jsx("h3", { children: "Content Preferences" }),
                      l.jsxs("div", {
                        className: "content-preferences",
                        children: [
                          l.jsxs("div", {
                            className: "preference-item",
                            children: [
                              l.jsx("span", {
                                className: "preference-label",
                                children: "Most Used Tags",
                              }),
                              l.jsx("div", {
                                className: "preference-tags",
                                children: Array.from(
                                  new Set(s.posts.flatMap((N) => N.tags))
                                )
                                  .slice(0, 5)
                                  .map((N, P) =>
                                    l.jsxs(
                                      "span",
                                      {
                                        className: "preference-tag",
                                        children: ["#", N],
                                      },
                                      P
                                    )
                                  ),
                              }),
                            ],
                          }),
                          l.jsxs("div", {
                            className: "preference-item",
                            children: [
                              l.jsx("span", {
                                className: "preference-label",
                                children: "Average Post Length",
                              }),
                              l.jsxs("span", {
                                className: "preference-value",
                                children: [
                                  s.posts.length > 0
                                    ? Math.round(
                                        s.posts.reduce(
                                          (N, P) => N + P.body.length,
                                          0
                                        ) / s.posts.length
                                      )
                                    : 0,
                                  " ",
                                  "characters",
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
          ],
        }),
      ],
    }),
  });
}
function $0() {
  return l.jsx(U0, {});
}
function A0() {
  const { addPost: e } = y.useContext(Xs),
    t = Mn(),
    n = y.useRef(),
    r = y.useRef(),
    s = y.useRef(),
    i = y.useRef(),
    o = y.useRef(),
    a = y.useRef(),
    u = (c) => {
      c.preventDefault();
      const d = n.current.value,
        h = r.current.value,
        g = s.current.value,
        w = i.current.value,
        k = o.current.value,
        x = { likes: w, dislikes: k },
        C = a.current.value.split(" ");
      (n.current.value = ""),
        (r.current.value = ""),
        (s.current.value = ""),
        (i.current.value = ""),
        (o.current.value = ""),
        (a.current.value = ""),
        e(d, h, g, x, C),
        t("/");
    };
  return l.jsx("div", {
    className: "mini-container",
    onSubmit: u,
    children: l.jsxs("form", {
      className: "row g-3 ",
      children: [
        l.jsxs("div", {
          className: "col-md-7",
          children: [
            l.jsx("label", {
              htmlFor: "inputPassword",
              className: "form-label  Items",
              children: "User Id*",
            }),
            l.jsx("input", {
              ref: n,
              type: "UserId",
              className: "form-control",
              placeholder: "user-1A@!",
            }),
          ],
        }),
        l.jsxs("div", {
          className: "col-7",
          children: [
            l.jsx("label", {
              htmlFor: "inputAddress",
              className: "form-label Items",
              children: "Post Title",
            }),
            l.jsx("input", {
              type: "text",
              ref: r,
              className: "form-control",
              id: "inputAddress",
              placeholder: "How are you feeling today...",
            }),
          ],
        }),
        l.jsxs("div", {
          className: "col-7",
          children: [
            l.jsx("label", {
              htmlFor: "inputAddress2",
              className: "form-label Items",
              children: "Post Content",
            }),
            l.jsx("textarea", {
              ref: s,
              className: "form-control",
              id: "exampleFormControlTextarea1",
              rows: "4",
              placeholder: "Tell us more about it...",
            }),
          ],
        }),
        l.jsxs("div", {
          className: "reactions",
          children: [
            l.jsxs("div", {
              className: "col-3",
              children: [
                l.jsx("label", {
                  htmlFor: "inputCity",
                  className: "form-label Items",
                  children: "Likes",
                }),
                l.jsx("input", {
                  ref: i,
                  type: "text",
                  className: "form-control",
                  id: "inputCity",
                  placeholder: "How many likes are there...",
                }),
              ],
            }),
            l.jsxs("div", {
              className: "col-3",
              children: [
                l.jsx("label", {
                  htmlFor: "inputCity",
                  className: "form-label Items",
                  children: "Dislikes",
                }),
                l.jsx("input", {
                  ref: o,
                  type: "text",
                  className: "form-control",
                  id: "inputCity",
                  placeholder: "How many dislikes are there...",
                }),
              ],
            }),
          ],
        }),
        l.jsxs("div", {
          className: "col-md-7",
          children: [
            l.jsx("label", {
              htmlFor: "inputCity",
              className: "form-label Items",
              children: "Enter your hashtags",
            }),
            l.jsx("input", {
              ref: a,
              type: "text",
              className: "form-control",
              id: "inputCity",
              placeholder: "Enter tags using space..",
            }),
          ],
        }),
        l.jsx("div", {
          className: "col-7",
          children: l.jsxs("div", {
            className: "form-check",
            children: [
              l.jsx("input", {
                className: "form-check-input",
                type: "checkbox",
                id: "gridCheck",
              }),
              l.jsx("label", {
                className: "form-check-label",
                htmlFor: "gridCheck",
                children: "Remember me",
              }),
            ],
          }),
        }),
        l.jsx("div", {
          className: "col-12",
          children: l.jsx("button", {
            type: "submit",
            className: "btn btn-dark",
            children: "Post",
          }),
        }),
      ],
    }),
  });
}
function F0() {
  return l.jsx(A0, {});
}
function B0() {
  return l.jsx(T0, {});
}
function V0() {
  return l.jsx("div", {
    className: "bg text-secondary px-4 py-5 text-center WelcomeMessage",
    children: l.jsxs("div", {
      className: "py-5",
      children: [
        l.jsx("h1", {
          className: "display-5 fw-bold text-black ",
          children: "Twitty Page",
        }),
        l.jsx("div", {
          className: "col-lg-6 mx-auto",
          children: l.jsx("p", {
            className: "fs-5 mb-4",
            children:
              "Coming Soon! This page will allow you to view and interact with our chat-bot. Stay tuned for updates!",
          }),
        }),
      ],
    }),
  });
}
function H0() {
  return l.jsx(V0, {});
}
function W0() {
  return l.jsx("div", {
    className: "auth",
    children: l.jsx("h1", { className: "", children: "Auth Page" }),
  });
}
var Fd = {
    color: void 0,
    size: void 0,
    className: void 0,
    style: void 0,
    attr: void 0,
  },
  Ja = wt.createContext && wt.createContext(Fd),
  q0 = ["attr", "size", "title"];
function Q0(e, t) {
  if (e == null) return {};
  var n = K0(e, t),
    r,
    s;
  if (Object.getOwnPropertySymbols) {
    var i = Object.getOwnPropertySymbols(e);
    for (s = 0; s < i.length; s++)
      (r = i[s]),
        !(t.indexOf(r) >= 0) &&
          Object.prototype.propertyIsEnumerable.call(e, r) &&
          (n[r] = e[r]);
  }
  return n;
}
function K0(e, t) {
  if (e == null) return {};
  var n = {};
  for (var r in e)
    if (Object.prototype.hasOwnProperty.call(e, r)) {
      if (t.indexOf(r) >= 0) continue;
      n[r] = e[r];
    }
  return n;
}
function Is() {
  return (
    (Is = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n)
              Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
    Is.apply(this, arguments)
  );
}
function Za(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    t &&
      (r = r.filter(function (s) {
        return Object.getOwnPropertyDescriptor(e, s).enumerable;
      })),
      n.push.apply(n, r);
  }
  return n;
}
function Ms(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? Za(Object(n), !0).forEach(function (r) {
          G0(e, r, n[r]);
        })
      : Object.getOwnPropertyDescriptors
      ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
      : Za(Object(n)).forEach(function (r) {
          Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(n, r));
        });
  }
  return e;
}
function G0(e, t, n) {
  return (
    (t = Y0(t)),
    t in e
      ? Object.defineProperty(e, t, {
          value: n,
          enumerable: !0,
          configurable: !0,
          writable: !0,
        })
      : (e[t] = n),
    e
  );
}
function Y0(e) {
  var t = X0(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function X0(e, t) {
  if (typeof e != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t || "default");
    if (typeof r != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function Bd(e) {
  return (
    e &&
    e.map((t, n) =>
      wt.createElement(t.tag, Ms({ key: n }, t.attr), Bd(t.child))
    )
  );
}
function tt(e) {
  return (t) =>
    wt.createElement(J0, Is({ attr: Ms({}, e.attr) }, t), Bd(e.child));
}
function J0(e) {
  var t = (n) => {
    var { attr: r, size: s, title: i } = e,
      o = Q0(e, q0),
      a = s || n.size || "1em",
      u;
    return (
      n.className && (u = n.className),
      e.className && (u = (u ? u + " " : "") + e.className),
      wt.createElement(
        "svg",
        Is(
          { stroke: "currentColor", fill: "currentColor", strokeWidth: "0" },
          n.attr,
          r,
          o,
          {
            className: u,
            style: Ms(Ms({ color: e.color || n.color }, n.style), e.style),
            height: a,
            width: a,
            xmlns: "http://www.w3.org/2000/svg",
          }
        ),
        i && wt.createElement("title", null, i),
        e.children
      )
    );
  };
  return Ja !== void 0
    ? wt.createElement(Ja.Consumer, null, (n) => t(n))
    : t(Fd);
}
function Z0(e) {
  return tt({
    tag: "svg",
    attr: { viewBox: "0 0 1024 1024" },
    child: [
      {
        tag: "path",
        attr: {
          d: "M816 768h-24V428c0-141.1-104.3-257.7-240-277.1V112c0-22.1-17.9-40-40-40s-40 17.9-40 40v38.9c-135.7 19.4-240 136-240 277.1v340h-24c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h216c0 61.8 50.2 112 112 112s112-50.2 112-112h216c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM512 888c-26.5 0-48-21.5-48-48h96c0 26.5-21.5 48-48 48zM304 768V428c0-55.6 21.6-107.8 60.9-147.1S456.4 220 512 220c55.6 0 107.8 21.6 147.1 60.9S720 372.4 720 428v340H304z",
        },
        child: [],
      },
    ],
  })(e);
}
function eg(e) {
  return tt({
    tag: "svg",
    attr: {
      viewBox: "0 0 1024 1024",
      fill: "currentColor",
      fillRule: "evenodd",
    },
    child: [
      {
        tag: "path",
        attr: {
          d: "M799.855 166.312c.023.007.043.018.084.059l57.69 57.69c.041.041.052.06.059.084a.118.118 0 0 1 0 .069c-.007.023-.018.042-.059.083L569.926 512l287.703 287.703c.041.04.052.06.059.083a.118.118 0 0 1 0 .07c-.007.022-.018.042-.059.083l-57.69 57.69c-.041.041-.06.052-.084.059a.118.118 0 0 1-.069 0c-.023-.007-.042-.018-.083-.059L512 569.926 224.297 857.629c-.04.041-.06.052-.083.059a.118.118 0 0 1-.07 0c-.022-.007-.042-.018-.083-.059l-57.69-57.69c-.041-.041-.052-.06-.059-.084a.118.118 0 0 1 0-.069c.007-.023.018-.042.059-.083L454.073 512 166.371 224.297c-.041-.04-.052-.06-.059-.083a.118.118 0 0 1 0-.07c.007-.022.018-.042.059-.083l57.69-57.69c.041-.041.06-.052.084-.059a.118.118 0 0 1 .069 0c.023.007.042.018.083.059L512 454.073l287.703-287.702c.04-.041.06-.052.083-.059a.118.118 0 0 1 .07 0Z",
        },
        child: [],
      },
    ],
  })(e);
}
function tg(e) {
  return tt({
    tag: "svg",
    attr: { viewBox: "0 0 1024 1024" },
    child: [
      {
        tag: "path",
        attr: {
          d: "M946.5 505L560.1 118.8l-25.9-25.9a31.5 31.5 0 0 0-44.4 0L77.5 505a63.9 63.9 0 0 0-18.8 46c.4 35.2 29.7 63.3 64.9 63.3h42.5V940h691.8V614.3h43.4c17.1 0 33.2-6.7 45.3-18.8a63.6 63.6 0 0 0 18.7-45.3c0-17-6.7-33.1-18.8-45.2zM568 868H456V664h112v204zm217.9-325.7V868H632V640c0-22.1-17.9-40-40-40H432c-22.1 0-40 17.9-40 40v228H238.1V542.3h-96l370-369.7 23.1 23.1L882 542.3h-96.1z",
        },
        child: [],
      },
    ],
  })(e);
}
function ng(e) {
  return tt({
    tag: "svg",
    attr: { viewBox: "0 0 1024 1024" },
    child: [
      {
        tag: "path",
        attr: {
          d: "M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M464 336a48 48 0 1 0 96 0 48 48 0 1 0-96 0zm72 112h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456c0-4.4-3.6-8-8-8z",
        },
        child: [],
      },
    ],
  })(e);
}
function rg(e) {
  return tt({
    tag: "svg",
    attr: { viewBox: "0 0 1024 1024" },
    child: [
      { tag: "defs", attr: {}, child: [] },
      {
        tag: "path",
        attr: {
          d: "M521.7 82c-152.5-.4-286.7 78.5-363.4 197.7-3.4 5.3.4 12.3 6.7 12.3h70.3c4.8 0 9.3-2.1 12.3-5.8 7-8.5 14.5-16.7 22.4-24.5 32.6-32.5 70.5-58.1 112.7-75.9 43.6-18.4 90-27.8 137.9-27.8 47.9 0 94.3 9.3 137.9 27.8 42.2 17.8 80.1 43.4 112.7 75.9 32.6 32.5 58.1 70.4 76 112.5C865.7 417.8 875 464.1 875 512c0 47.9-9.4 94.2-27.8 137.8-17.8 42.1-43.4 80-76 112.5s-70.5 58.1-112.7 75.9A352.8 352.8 0 0 1 520.6 866c-47.9 0-94.3-9.4-137.9-27.8A353.84 353.84 0 0 1 270 762.3c-7.9-7.9-15.3-16.1-22.4-24.5-3-3.7-7.6-5.8-12.3-5.8H165c-6.3 0-10.2 7-6.7 12.3C234.9 863.2 368.5 942 520.6 942c236.2 0 428-190.1 430.4-425.6C953.4 277.1 761.3 82.6 521.7 82zM395.02 624v-76h-314c-4.4 0-8-3.6-8-8v-56c0-4.4 3.6-8 8-8h314v-76c0-6.7 7.8-10.5 13-6.3l141.9 112a8 8 0 0 1 0 12.6l-141.9 112c-5.2 4.1-13 .4-13-6.3z",
        },
        child: [],
      },
    ],
  })(e);
}
function sg(e) {
  return tt({
    tag: "svg",
    attr: { viewBox: "0 0 1024 1024" },
    child: [
      {
        tag: "path",
        attr: {
          d: "M928 160H96c-17.7 0-32 14.3-32 32v640c0 17.7 14.3 32 32 32h832c17.7 0 32-14.3 32-32V192c0-17.7-14.3-32-32-32zm-40 110.8V792H136V270.8l-27.6-21.5 39.3-50.5 42.8 33.3h643.1l42.8-33.3 39.3 50.5-27.7 21.5zM833.6 232L512 482 190.4 232l-42.8-33.3-39.3 50.5 27.6 21.5 341.6 265.6a55.99 55.99 0 0 0 68.7 0L888 270.8l27.6-21.5-39.3-50.5-42.7 33.2z",
        },
        child: [],
      },
    ],
  })(e);
}
function lg(e) {
  return tt({
    tag: "svg",
    attr: { viewBox: "0 0 1024 1024" },
    child: [
      {
        tag: "path",
        attr: {
          d: "M904 160H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8zm0 624H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8zm0-312H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8z",
        },
        child: [],
      },
    ],
  })(e);
}
function ig(e) {
  return tt({
    tag: "svg",
    attr: { viewBox: "0 0 1024 1024" },
    child: [
      {
        tag: "path",
        attr: {
          d: "M464 512a48 48 0 1 0 96 0 48 48 0 1 0-96 0zm200 0a48 48 0 1 0 96 0 48 48 0 1 0-96 0zm-400 0a48 48 0 1 0 96 0 48 48 0 1 0-96 0zm661.2-173.6c-22.6-53.7-55-101.9-96.3-143.3a444.35 444.35 0 0 0-143.3-96.3C630.6 75.7 572.2 64 512 64h-2c-60.6.3-119.3 12.3-174.5 35.9a445.35 445.35 0 0 0-142 96.5c-40.9 41.3-73 89.3-95.2 142.8-23 55.4-34.6 114.3-34.3 174.9A449.4 449.4 0 0 0 112 714v152a46 46 0 0 0 46 46h152.1A449.4 449.4 0 0 0 510 960h2.1c59.9 0 118-11.6 172.7-34.3a444.48 444.48 0 0 0 142.8-95.2c41.3-40.9 73.8-88.7 96.5-142 23.6-55.2 35.6-113.9 35.9-174.5.3-60.9-11.5-120-34.8-175.6zm-151.1 438C704 845.8 611 884 512 884h-1.7c-60.3-.3-120.2-15.3-173.1-43.5l-8.4-4.5H188V695.2l-4.5-8.4C155.3 633.9 140.3 574 140 513.7c-.4-99.7 37.7-193.3 107.6-263.8 69.8-70.5 163.1-109.5 262.8-109.9h1.7c50 0 98.5 9.7 144.2 28.9 44.6 18.7 84.6 45.6 119 80 34.3 34.3 61.3 74.4 80 119 19.4 46.2 29.1 95.2 28.9 145.8-.6 99.6-39.7 192.9-110.1 262.7z",
        },
        child: [],
      },
    ],
  })(e);
}
function og(e) {
  return tt({
    tag: "svg",
    attr: { viewBox: "0 0 1024 1024" },
    child: [
      {
        tag: "path",
        attr: {
          d: "M696 480H544V328c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v152H328c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h152v152c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V544h152c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8z",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z",
        },
        child: [],
      },
    ],
  })(e);
}
function ag(e) {
  return tt({
    tag: "svg",
    attr: { viewBox: "0 0 1024 1024" },
    child: [
      {
        tag: "path",
        attr: {
          d: "M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0 0 11.6 0l43.6-43.5a8.2 8.2 0 0 0 0-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z",
        },
        child: [],
      },
    ],
  })(e);
}
const Yt = {
    activeColor: "rgb(52 71 178 / 51%)",
    createPostActiveColor: "rgb(52 71 178 / 51%)",
    itemBorderRadius: "1.5rem",
    createPostBorderRadius: "2.5rem",
    backgroundColor: "#000000",
  },
  ug = [
    { to: "/", icon: l.jsx(tg, { className: "me-2" }), label: "Home" },
    { to: "/search", icon: l.jsx(ag, { className: "me-2" }), label: "Search" },
    {
      to: "/notifications",
      icon: l.jsx(Z0, { className: "me-2" }),
      label: "Notifications",
    },
    {
      to: "/i/twitty",
      icon: l.jsx(ig, { className: "me-2" }),
      label: "Tweety",
    },
    { to: "/about", icon: l.jsx(ng, { className: "me-2" }), label: "About Us" },
    {
      to: "/contact",
      icon: l.jsx(sg, { className: "me-2" }),
      label: "Contact Us",
    },
    { to: "/login", icon: l.jsx(rg, { className: "me-2" }), label: "Log in" },
  ],
  Vd = ({ open: e, setOpen: t }) => {
    const n = bt();
    return n.pathname === "/" || n.pathname === "/home"
      ? l.jsx("button", {
          className: "btn d-lg-none position-fixed",
          style: {
            top: 15,
            width: 20,
            zIndex: 10,
            backgroundColor: Yt.backgroundColor,
            color: "#fff",
          },
          onClick: () => t((s) => !s),
          "aria-label": "Toggle sidebar",
          children: e ? l.jsx(eg, { size: 24 }) : l.jsx(lg, { size: 24 }),
        })
      : null;
  };
Vd.propTypes = { open: v.bool.isRequired, setOpen: v.func.isRequired };
const cg = "/assets/twooter-logo2-VSSUNtpH.png",
  dg = () =>
    l.jsx("div", {
      className: "w-100 d-none d-sm-flex align-items-center mb-4 px-3",
      style: {
        justifyContent: "flex-start",
        gap: "0.75rem",
        position: "absolute",
        top: "0.7rem",
        left: "3rem",
        height: "5rem",
      },
      children: l.jsxs(ko, {
        to: "/",
        className: "d-flex align-items-center text-decoration-none",
        children: [
          l.jsx("img", {
            src: cg,
            alt: "Twooter Logo",
            className: "rounded-circle",
            style: { width: 40, height: 40, objectFit: "cover" },
          }),
          l.jsx("span", {
            className: "fs-4 fw-bold text-white ms-2",
            children: "Twooter",
          }),
        ],
      }),
    }),
  Hd = ({ to: e, icon: t, label: n, pathname: r, onClick: s }) =>
    l.jsx("li", {
      className: "w-100",
      children: l.jsxs(ko, {
        to: e,
        className:
          "nav-link text-white w-100 d-flex align-items-center justify-content-center",
        style: {
          backgroundColor: r === e ? Yt.activeColor : "transparent",
          color: "#fff",
          fontWeight: r === e ? "bold" : "normal",
          borderRadius: Yt.itemBorderRadius,
          transition: "background-color 0.3s, color 0.3s, border-radius 0.3s",
          minHeight: 48,
        },
        onClick: s,
        children: [t, n],
      }),
    });
Hd.propTypes = {
  to: v.string.isRequired,
  icon: v.element.isRequired,
  label: v.string.isRequired,
  pathname: v.string.isRequired,
  onClick: v.func,
};
const Wd = ({ pathname: e, onLinkClick: t, isResponsive: n = !1 }) =>
  l.jsx("ul", {
    className: "nav nav-pills flex-column mb-auto w-100",
    style: {
      gap: "0.5rem",
      marginTop: n ? "1rem" : "2rem",
      marginBottom: n ? "1rem" : "2rem",
      alignItems: "center",
      paddingRight: n ? 0 : "1rem",
      paddingLeft: n ? 0 : "11rem",
    },
    children: ug.map(({ to: r, icon: s, label: i }) =>
      l.jsx(Hd, { to: r, icon: s, label: i, pathname: e, onClick: t }, r)
    ),
  });
Wd.propTypes = {
  pathname: v.string.isRequired,
  onLinkClick: v.func,
  isResponsive: v.bool,
};
const qd = ({ pathname: e, onLinkClick: t, isResponsive: n = !1 }) =>
  l.jsx("div", {
    className: "d-flex justify-content-center pe-3",
    style: {
      marginLeft: n ? 0 : "11rem",
      width: "100%",
      justifyContent: "center",
    },
    children: l.jsxs(ko, {
      to: "/createpost",
      className: "btn fw-bold d-flex align-items-center justify-content-center",
      style: {
        backgroundColor:
          e === "/create-post" ? Yt.createPostActiveColor : "#fff",
        color: e === "/create-post" ? "#fff" : "#3949ab",
        border: "none",
        fontWeight: "bold",
        borderRadius: Yt.createPostBorderRadius,
        transition:
          "background-color 0.3s, color 0.3s, border-radius 0.3s, box-shadow 0.3s",
        boxShadow:
          e === "/create-post"
            ? "0 0 0 0.2rem rgba(57, 72, 171, 0.22)"
            : "none",
        minHeight: 52,
        maxWidth: 200,
        padding: "0rem 1.5rem",
      },
      onClick: t,
      children: [l.jsx(og, { className: "me-2" }), "Create Post"],
    }),
  });
qd.propTypes = {
  pathname: v.string.isRequired,
  onLinkClick: v.func,
  isResponsive: v.bool,
};
const Io = ({ onLinkClick: e, isResponsive: t = !1 }) => {
  const n = bt(),
    { pathname: r } = n;
  return l.jsxs(l.Fragment, {
    children: [
      l.jsx(dg, {}),
      l.jsx(Wd, { pathname: r, onLinkClick: e, isResponsive: t }),
      l.jsx(qd, { pathname: r, onLinkClick: e, isResponsive: t }),
    ],
  });
};
Io.propTypes = { onLinkClick: v.func, isResponsive: v.bool };
const fg = () =>
    l.jsx("div", {
      className: "sidebar d-none d-lg-flex p-3 flex-column flex-shrink-0",
      style: {
        backgroundColor: Yt.backgroundColor,
        minHeight: "100vh",
        width: "25vw",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1050,
        justifyContent: "center",
        overflow: "hidden",
        borderRight: "2px solid #333",
      },
      children: l.jsx("div", {
        className: "w-100 d-flex flex-column align-items-center",
        style: {
          height: "80vh",
          justifyContent: "space-between",
          paddingTop: "2rem",
          paddingBottom: "2rem",
        },
        children: l.jsx(Io, {}),
      }),
    }),
  Qd = ({ open: e, setOpen: t }) =>
    e &&
    l.jsx("div", {
      className: "position-fixed top-0 start-0 w-100 h-100",
      style: {
        background: "rgba(0,0,0,0.7)",
        zIndex: 2e3,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
      onClick: () => t(!1),
      children: l.jsx("div", {
        className:
          "rounded-4 shadow-lg mt-4 d-flex flex-column align-items-center",
        style: {
          backgroundColor: Yt.backgroundColor,
          width: 280,
          padding: "1.5rem",
          margin: 0,
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid #333",
        },
        onClick: (n) => n.stopPropagation(),
        children: l.jsx(Io, { onLinkClick: () => t(!1), isResponsive: !0 }),
      }),
    });
Qd.propTypes = { open: v.bool.isRequired, setOpen: v.func.isRequired };
const Mo = () => {
    const [e, t] = y.useState(!1);
    return l.jsxs(l.Fragment, {
      children: [
        l.jsx(Vd, { open: e, setOpen: t }),
        l.jsx(fg, {}),
        l.jsx(Qd, { open: e, setOpen: t }),
      ],
    });
  },
  pg = ({ suggestions: e, searchTerm: t, onSuggestionClick: n }) =>
    e.length === 0
      ? null
      : l.jsxs("div", {
          className: "search-suggestions",
          children: [
            t === "" &&
              l.jsxs("div", {
                className: "suggestions-header",
                children: [
                  l.jsx(tr, { size: 16 }),
                  l.jsx("span", { children: "Trending & Popular" }),
                ],
              }),
            e.map((r, s) =>
              l.jsxs(
                "div",
                {
                  className: "suggestion-item",
                  onClick: () => n(r),
                  children: [
                    r.startsWith("#")
                      ? l.jsx(Od, { size: 16, className: "suggestion-icon" })
                      : l.jsx(tr, { size: 16, className: "suggestion-icon" }),
                    l.jsx("span", { children: r }),
                  ],
                },
                s
              )
            ),
          ],
        }),
  hg = ({
    searchTerm: e,
    setSearchTerm: t,
    isSearchFocused: n,
    setIsSearchFocused: r,
    onSearch: s,
    suggestions: i,
    onSuggestionClick: o,
    searchRef: a,
  }) => (
    y.useEffect(() => {
      const u = (c) => {
        a.current && !a.current.contains(c.target) && r(!1);
      };
      return (
        n && document.addEventListener("mousedown", u),
        () => {
          document.removeEventListener("mousedown", u);
        }
      );
    }, [n, a, r]),
    l.jsx("div", {
      className: "search-form",
      ref: a,
      children: l.jsxs("div", {
        className: "search-container",
        children: [
          l.jsx(Co, { className: "search-icon", size: 20 }),
          l.jsx("input", {
            type: "text",
            placeholder: "Search hashtags, topics...",
            value: e,
            onChange: (u) => t(u.target.value),
            onFocus: () => r(!0),
            onKeyDown: (u) => {
              u.key === "Enter" && s(u);
            },
            className: "search-input",
          }),
          n &&
            l.jsx(pg, { suggestions: i, searchTerm: e, onSuggestionClick: o }),
        ],
      }),
    })
  ),
  mg = ({
    isUserMenuOpen: e,
    setIsUserMenuOpen: t,
    isLoggedIn: n,
    onLogout: r,
  }) => {
    const s = Mn(),
      i = (u) => {
        u.preventDefault(), u.stopPropagation(), s("/login");
      },
      o = (u) => {
        u.preventDefault(), u.stopPropagation(), s("/signup");
      },
      a = (u) => {
        u.preventDefault(), u.stopPropagation(), r();
      };
    return l.jsxs("div", {
      className: "user-menu",
      children: [
        l.jsx("button", {
          className: "user-icon-button",
          onClick: () => t(!e),
          type: "button",
          "aria-label": "User menu",
          children: l.jsx(mn, { size: 24 }),
        }),
        e &&
          l.jsx("div", {
            className: "user-dropdown",
            children: n
              ? l.jsxs(l.Fragment, {
                  children: [
                    l.jsx("div", {
                      className: "user-info",
                      children: l.jsx("span", { children: "Welcome, User!" }),
                    }),
                    l.jsxs("button", {
                      onClick: a,
                      className: "menu-item",
                      type: "button",
                      children: [l.jsx(o0, { size: 16 }), "Logout"],
                    }),
                  ],
                })
              : l.jsxs(l.Fragment, {
                  children: [
                    l.jsxs("button", {
                      onClick: i,
                      className: "menu-item",
                      type: "button",
                      children: [l.jsx(l0, { size: 16 }), "Login"],
                    }),
                    l.jsxs("button", {
                      onClick: o,
                      className: "menu-item",
                      type: "button",
                      children: [l.jsx(P0, { size: 16 }), "Sign Up"],
                    }),
                  ],
                }),
          }),
      ],
    });
  },
  gg = ({ suggestions: e, searchTerm: t, onSuggestionClick: n }) =>
    !e || e.length === 0
      ? l.jsx("div", {
          className: "mobile-search-suggestions",
          children: l.jsxs("div", {
            className: "no-suggestions",
            children: [
              l.jsx(tr, { size: 16 }),
              l.jsx("span", { children: "Start typing to see suggestions..." }),
            ],
          }),
        })
      : l.jsxs("div", {
          className: "mobile-search-suggestions",
          children: [
            t === "" &&
              l.jsxs("div", {
                className: "suggestions-header",
                children: [
                  l.jsx(tr, { size: 16 }),
                  l.jsx("span", { children: "Trending & Popular" }),
                ],
              }),
            e.map((r, s) =>
              l.jsxs(
                "div",
                {
                  className: "suggestion-item",
                  onClick: () => n(r),
                  children: [
                    r.startsWith("#")
                      ? l.jsx(Od, { size: 16, className: "suggestion-icon" })
                      : l.jsx(tr, { size: 16, className: "suggestion-icon" }),
                    l.jsx("span", { children: r }),
                  ],
                },
                s
              )
            ),
          ],
        }),
  vg = ({
    searchTerm: e,
    setSearchTerm: t,
    isMobileSearchOpen: n,
    setIsMobileSearchOpen: r,
    onSearch: s,
    suggestions: i,
    onSuggestionClick: o,
  }) => {
    const a = y.useRef(null);
    y.useEffect(() => {
      n &&
        a.current &&
        setTimeout(() => {
          a.current.focus();
        }, 100);
    }, [n]);
    const u = () => {
        r(!1), t("");
      },
      c = (w) => {
        w.key === "Enter" && (s(w), u()), w.key === "Escape" && u();
      },
      d = (w) => {
        t(w), o(w);
      },
      h = (w) => {
        t(w.target.value);
      },
      g = (w) => {
        w.preventDefault(), e.trim() && (s(w), u());
      };
    return n
      ? l.jsxs(l.Fragment, {
          children: [
            l.jsx("div", {
              className: `mobile-search-overlay ${n ? "active" : ""}`,
              onClick: u,
            }),
            l.jsxs("div", {
              className: `mobile-search-container ${n ? "active" : ""}`,
              children: [
                l.jsx("div", {
                  className: "mobile-search-header",
                  children: l.jsxs("div", {
                    className: "mobile-search-input-wrapper",
                    children: [
                      l.jsx(Co, {
                        className: "mobile-search-icon-input",
                        size: 20,
                      }),
                      l.jsx("input", {
                        ref: a,
                        type: "text",
                        placeholder: "Search hashtags, topics...",
                        value: e,
                        onChange: h,
                        onKeyDown: c,
                        className: "mobile-search-input",
                      }),
                      l.jsx("button", {
                        className: "mobile-search-close",
                        onClick: u,
                        "aria-label": "Close search",
                        type: "button",
                        children: l.jsx(Ls, { size: 20 }),
                      }),
                    ],
                  }),
                }),
                l.jsx("div", {
                  className: "mobile-search-actions",
                  children: l.jsx("button", {
                    className: "mobile-search-submit",
                    onClick: g,
                    disabled: !e.trim(),
                    type: "button",
                    children: "Search",
                  }),
                }),
                l.jsx(gg, {
                  suggestions: i,
                  searchTerm: e,
                  onSuggestionClick: d,
                }),
              ],
            }),
          ],
        })
      : null;
  },
  yg = ({ searchTerm: e, onBackToMain: t }) =>
    l.jsxs("div", {
      className: "search-content",
      children: [
        l.jsx("div", {
          className: "search-header",
          children: l.jsxs("button", {
            onClick: t,
            className: "back-button",
            children: [l.jsx(bm, { size: 20 }), "Back"],
          }),
        }),
        l.jsxs("div", {
          className: "search-results",
          children: [
            l.jsx("div", {
              className: "search-term-display",
              children: l.jsxs("span", {
                children: ['Results for: "', e, '"'],
              }),
            }),
            l.jsxs("div", {
              className: "coming-soon-message",
              children: [
                l.jsx("h3", { children: "🚀 Coming Soon..." }),
                l.jsx("p", {
                  children:
                    "We're working hard to bring you this amazing search feature!",
                }),
                l.jsxs("div", {
                  className: "feature-list",
                  children: [
                    l.jsx("div", {
                      className: "feature-item",
                      children: "🔍 Advanced search capabilities",
                    }),
                    l.jsx("div", {
                      className: "feature-item",
                      children: "🏷️ Hashtag exploration",
                    }),
                    l.jsx("div", {
                      className: "feature-item",
                      children: "📈 Trending analysis",
                    }),
                    l.jsx("div", {
                      className: "feature-item",
                      children: "🎯 Personalized results",
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  xg = [
    {
      id: "joke",
      name: "Tell a Joke",
      icon: S0,
      background:
        "https://images.unsplash.com/photo-1567653418876-5bb0e566e1c2?w=400&h=300&fit=crop",
      gradient: "from-yellow-400 to-orange-500",
      description: "Get a random joke",
    },
    {
      id: "quote",
      name: "Daily Quote",
      icon: v0,
      background:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      gradient: "from-blue-400 to-purple-500",
      description: "Inspirational quotes",
    },
    {
      id: "movie",
      name: "Movie Recommendation",
      icon: n0,
      background:
        "https://img.freepik.com/free-photo/creative-movie-concept_23-2147681340.jpg",
      gradient: "from-purple-400 to-pink-500",
      description: "Discover movies",
    },
    {
      id: "dish",
      name: "Recipe Ideas",
      icon: Jm,
      background:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop",
      gradient: "from-green-400 to-blue-500",
      description: "Random recipes",
    },
    {
      id: "book",
      name: "Book Suggestion",
      icon: $m,
      background:
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
      gradient: "from-indigo-400 to-purple-500",
      description: "Book recommendations",
    },
    {
      id: "travel",
      name: "Travel Ideas",
      icon: m0,
      background:
        "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop",
      gradient: "from-teal-400 to-cyan-500",
      description: "Travel destinations",
    },
    {
      id: "funfact",
      name: "Fun Facts",
      icon: Bm,
      background:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
      gradient: "from-orange-400 to-red-500",
      description: "Interesting facts",
    },
    {
      id: "music",
      name: "Music Discovery",
      icon: p0,
      background:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
      gradient: "from-pink-400 to-red-500",
      description: "Music recommendations",
    },
  ],
  jg = async (e) => {
    try {
      let t, n;
      switch (e.id) {
        case "joke":
          return (
            (t = await fetch(
              "https://official-joke-api.appspot.com/random_joke"
            )),
            (n = await t.json()),
            {
              feature: e.name,
              title: "Random Joke",
              content: `${n.setup}

${n.punchline} 😄`,
              shareUrl: `https://official-joke-api.appspot.com/jokes/${n.id}`,
              redirectUrl: "https://official-joke-api.appspot.com/",
            }
          );
        case "quote":
          return (
            (t = await fetch("https://dummyjson.com/quotes/random")),
            (n = await t.json()),
            {
              feature: e.name,
              title: "Daily Inspiration",
              content: `"${n.quote}"

— ${n.author} ✨`,
              shareUrl: `https://dummyjson.com/quotes/${n.id}`,
              redirectUrl: "https://dummyjson.com/quotes",
            }
          );
        case "funfact":
          return (
            (t = await fetch(
              "https://uselessfacts.jsph.pl/random.json?language=en"
            )),
            (n = await t.json()),
            {
              feature: e.name,
              title: "Did You Know?",
              content: `🧠 ${n.text}

Share this interesting fact with your friends!`,
              shareUrl: "https://uselessfacts.jsph.pl/",
              redirectUrl: "https://uselessfacts.jsph.pl/",
            }
          );
        case "dish":
          (t = await fetch(
            "https://www.themealdb.com/api/json/v1/1/random.php"
          )),
            (n = await t.json());
          const r = n.meals[0];
          return {
            feature: e.name,
            title: r.strMeal,
            content: `🍽️ ${r.strMeal}

📍 Origin: ${r.strArea}
🥘 Category: ${r.strCategory}

${r.strInstructions.substring(0, 150)}...`,
            shareUrl: `https://www.themealdb.com/meal/${r.idMeal}`,
            redirectUrl: `https://www.themealdb.com/meal/${r.idMeal}`,
            imageUrl: r.strMealThumb,
          };
        case "travel":
          (t = await fetch("https://jsonplaceholder.typicode.com/users")),
            (n = await t.json());
          const s = [
              {
                name: "Paris, France",
                emoji: "🇫🇷",
                famous: "Eiffel Tower",
                cuisine: "French cuisine",
              },
              {
                name: "Tokyo, Japan",
                emoji: "🇯🇵",
                famous: "Mount Fuji",
                cuisine: "Sushi and Ramen",
              },
              {
                name: "New York, USA",
                emoji: "🇺🇸",
                famous: "Statue of Liberty",
                cuisine: "Pizza and Bagels",
              },
              {
                name: "London, UK",
                emoji: "🇬🇧",
                famous: "Big Ben",
                cuisine: "Fish and Chips",
              },
              {
                name: "Rome, Italy",
                emoji: "🇮🇹",
                famous: "Colosseum",
                cuisine: "Pasta and Pizza",
              },
              {
                name: "Sydney, Australia",
                emoji: "🇦🇺",
                famous: "Opera House",
                cuisine: "Seafood",
              },
              {
                name: "Mumbai, India",
                emoji: "🇮🇳",
                famous: "Gateway of India",
                cuisine: "Spicy Curries",
              },
              {
                name: "Cairo, Egypt",
                emoji: "🇪🇬",
                famous: "Pyramids of Giza",
                cuisine: "Falafel and Kebabs",
              },
            ],
            i = s[Math.floor(Math.random() * s.length)];
          return {
            feature: e.name,
            title: `Visit ${i.name}`,
            content: `${i.emoji} ${i.name}

🏛️ Famous for: ${i.famous}
🍽️ Must try: ${i.cuisine}

✈️ Perfect destination for your next adventure!

Tip: Book flights 6-8 weeks in advance for best prices!`,
            shareUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(
              i.name.split(",")[0]
            )}`,
            redirectUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(
              i.name.split(",")[0]
            )}`,
            imageUrl: `https://picsum.photos/400/300?random=${Math.floor(
              Math.random() * 1e3
            )}`,
          };
        case "book":
          (t = await fetch(
            "https://openlibrary.org/subjects/fiction.json?limit=50"
          )),
            (n = await t.json());
          const o = n.works[Math.floor(Math.random() * n.works.length)];
          return {
            feature: e.name,
            title: o.title,
            content: `📚 "${o.title}"
👤 by ${o.authors ? o.authors.map((h) => h.name).join(", ") : "Unknown Author"}

📖 First published: ${o.first_publish_year || "N/A"}

A great addition to your reading list!`,
            shareUrl: `https://openlibrary.org${o.key}`,
            redirectUrl: `https://openlibrary.org${o.key}`,
            imageUrl: o.cover_id
              ? `https://covers.openlibrary.org/b/id/${o.cover_id}-M.jpg`
              : null,
          };
        case "movie":
          (t = await fetch("https://api.sampleapis.com/movies/animation")),
            (n = await t.json());
          const a = n[Math.floor(Math.random() * n.length)];
          return {
            feature: e.name,
            title: a.title,
            content: `🎬 "${a.title}"
📅 Released: ${a.releaseDate}
⭐ Rating: ${a.imdbRating || "N/A"}

${
  a.plot
    ? a.plot.substring(0, 150) + "..."
    : "A great movie recommendation for you!"
}`,
            shareUrl: `https://www.imdb.com/find?q=${encodeURIComponent(
              a.title
            )}`,
            redirectUrl: `https://www.imdb.com/find?q=${encodeURIComponent(
              a.title
            )}`,
            imageUrl: a.posterURL,
          };
        case "music":
          (t = await fetch("https://dummyjson.com/products?limit=100")),
            (n = await t.json());
          const u = n.products[Math.floor(Math.random() * n.products.length)],
            c = [
              {
                genre: "Pop",
                artist: "Taylor Swift",
                album: "Folklore",
                year: "2020",
              },
              {
                genre: "Rock",
                artist: "Queen",
                album: "A Night at the Opera",
                year: "1975",
              },
              {
                genre: "Hip-Hop",
                artist: "Kendrick Lamar",
                album: "DAMN.",
                year: "2017",
              },
              {
                genre: "Jazz",
                artist: "Miles Davis",
                album: "Kind of Blue",
                year: "1959",
              },
              {
                genre: "Electronic",
                artist: "Daft Punk",
                album: "Random Access Memories",
                year: "2013",
              },
              {
                genre: "Country",
                artist: "Johnny Cash",
                album: "At Folsom Prison",
                year: "1968",
              },
              {
                genre: "R&B",
                artist: "Stevie Wonder",
                album: "Songs in the Key of Life",
                year: "1976",
              },
              {
                genre: "Classical",
                artist: "Ludwig van Beethoven",
                album: "Symphony No. 9",
                year: "1824",
              },
            ],
            d = c[Math.floor(Math.random() * c.length)];
          return {
            feature: e.name,
            title: `${u.title} Vibes`,
            content: `🎵 "${d.album}"
👤 by ${d.artist}
🎭 Genre: ${d.genre}
📅 Released: ${d.year}
⭐ Rating: ${u.rating}/5

🎧 Perfect for your ${u.category.toLowerCase()} moments!

Discover amazing music that matches your mood!`,
            shareUrl: `https://open.spotify.com/search/${encodeURIComponent(
              d.artist
            )}`,
            redirectUrl: `https://open.spotify.com/search/${encodeURIComponent(
              d.artist
            )}`,
            imageUrl: u.thumbnail,
          };
        default:
          throw new Error("Unknown feature type");
      }
    } catch (t) {
      return (
        console.error("API Error:", t),
        {
          feature: e.name,
          title: "Demo Content",
          content: `Sorry, we couldn't fetch live data right now. Here's a demo ${e.name.toLowerCase()}!

Try again in a moment - our APIs are usually very reliable!`,
          shareUrl: "#",
          redirectUrl: "#",
        }
      );
    }
  },
  wg = ({ features: e, isMobile: t, onFeatureClick: n }) =>
    t
      ? l.jsx("div", {
          className: "mobile-features-container",
          children: l.jsx("div", {
            className: "mobile-features-grid",
            children: e.map((r) =>
              l.jsxs(
                "button",
                {
                  className: "mobile-feature-item clickable-item",
                  onClick: () => n(r),
                  children: [
                    l.jsx("div", {
                      className: "mobile-feature-background",
                      style: { backgroundImage: `url(${r.background})` },
                    }),
                    l.jsx("div", {
                      className: `mobile-feature-gradient bg-gradient-to-br ${r.gradient}`,
                    }),
                    l.jsx("div", {
                      className: "feature-item-icon",
                      children: l.jsx(r.icon, { size: 16 }),
                    }),
                    l.jsxs("div", {
                      className: "feature-item-content",
                      children: [
                        l.jsx("span", {
                          className: "feature-item-title",
                          children: r.name,
                        }),
                        l.jsx("span", {
                          className: "feature-item-desc",
                          children: r.description,
                        }),
                      ],
                    }),
                  ],
                },
                r.id
              )
            ),
          }),
        })
      : l.jsx("div", {
          className: "features-grid",
          children: e.map((r) =>
            l.jsxs(
              "div",
              {
                className: "feature-card",
                onClick: () => n(r),
                children: [
                  l.jsx("div", {
                    className: "card-background",
                    style: { backgroundImage: `url(${r.background})` },
                  }),
                  l.jsx("div", {
                    className: `card-gradient bg-gradient-to-br ${r.gradient}`,
                  }),
                  l.jsxs("div", {
                    className: "card-content",
                    children: [
                      l.jsx("div", {
                        className: "card-icon",
                        children: l.jsx(r.icon, { size: 18 }),
                      }),
                      l.jsx("h3", {
                        className: "card-title",
                        a: !0,
                        children: r.name,
                      }),
                    ],
                  }),
                  l.jsx("div", { className: "card-shimmer" }),
                ],
              },
              r.id
            )
          ),
        }),
  kg = ({
    selectedFeature: e,
    isLoading: t,
    error: n,
    searchResults: r,
    onBack: s,
    onRetry: i,
    onShare: o,
    onRedirect: a,
    isMobile: u = !1,
  }) =>
    l.jsxs("div", {
      className: `feature-result-container ${u ? "mobile" : "desktop"}`,
      children: [
        l.jsx("div", {
          className: "result-header",
          children: l.jsx("button", {
            onClick: s,
            className: "close-button",
            "aria-label": "Close",
            children: l.jsx(Ls, { size: u ? 18 : 20 }),
          }),
        }),
        l.jsx("div", {
          className: "result-content",
          children: t
            ? l.jsxs("div", {
                className: "loading-container",
                children: [
                  l.jsx("div", { className: "loading-spinner" }),
                  l.jsxs("p", {
                    className: "loading-text",
                    children: [
                      "Finding you the perfect ",
                      e.name.toLowerCase(),
                      "...",
                    ],
                  }),
                ],
              })
            : n
            ? l.jsxs("div", {
                className: "error-container",
                children: [
                  l.jsx("div", { className: "error-icon", children: "⚠️" }),
                  l.jsx("h3", {
                    className: "error-title",
                    children: "Oops! Something went wrong",
                  }),
                  l.jsx("p", { className: "error-message", children: n }),
                  l.jsx("button", {
                    onClick: i,
                    className: "try-again-button",
                    children: "Try Again",
                  }),
                ],
              })
            : r
            ? l.jsxs("div", {
                className: "search-result",
                children: [
                  l.jsx("div", {
                    className: "result-icon",
                    children: l.jsx(e.icon, { size: u ? 20 : 24 }),
                  }),
                  r.imageUrl &&
                    l.jsx("img", {
                      src: r.imageUrl,
                      alt: r.title,
                      className: "result-image",
                      onError: (c) => {
                        c.target.style.display = "none";
                      },
                    }),
                  l.jsx("h2", { className: "result-title", children: r.title }),
                  l.jsx("div", {
                    className: "result-text",
                    children: r.content,
                  }),
                  l.jsxs("div", {
                    className: `action-buttons ${
                      u ? "mobile-buttons" : "desktop-buttons"
                    }`,
                    children: [
                      l.jsx("button", {
                        onClick: i,
                        className: "try-again-button",
                        children: "Get Another",
                      }),
                      l.jsxs("button", {
                        onClick: o,
                        className: "share-button",
                        children: [l.jsx(k0, { size: 14 }), "Share"],
                      }),
                      l.jsxs("button", {
                        onClick: a,
                        className: "redirect-button",
                        children: [l.jsx(e0, { size: 14 }), "More"],
                      }),
                    ],
                  }),
                ],
              })
            : null,
        }),
      ],
    }),
  Ng = ({ onBackToMain: e, isMobile: t = !0, isQuickAccess: n = !1 }) => {
    const [r, s] = y.useState(null),
      [i, o] = y.useState(!1),
      [a, u] = y.useState(null),
      [c, d] = y.useState(null),
      [h, g] = y.useState(!1),
      w = async (f) => {
        // console.log("=== FEATURE CLICKED ===", f.name, {
        //   isMobile: t,
        //   isQuickAccess: n,
        // }),
          g(!1),
          s(f),
          o(!0),
          d(null),
          u(null);
        try {
          const j = await jg(f);
          u(j);
        } catch (j) {
          console.error("Error fetching data:", j),
            d("Failed to fetch data. Please try again."),
            u(null);
        } finally {
          o(!1);
        }
      },
      k = async () => {
        if (a)
          if (navigator.share)
            try {
              await navigator.share({
                title: a.title,
                text: a.content,
                url: a.shareUrl,
              });
            } catch (f) {
              console.log("Error sharing:", f);
            }
          else
            navigator.clipboard.writeText(`${a.title}

${a.content}

${a.shareUrl}`),
              alert("Content copied to clipboard!");
      },
      x = () => {
        a && a.redirectUrl && window.open(a.redirectUrl, "_blank");
      },
      C = () => {
        s(null), u(null), o(!1), d(null), g(!1), e && e();
      },
      m = () => {
        r && w(r);
      },
      p = () => {
        g(!h);
      };
    return r && (i || a || c)
      ? l.jsx(kg, {
          selectedFeature: r,
          isLoading: i,
          error: c,
          searchResults: a,
          onBack: C,
          onRetry: m,
          onShare: k,
          onRedirect: x,
          isMobile: t,
        })
      : l.jsx("div", {
          className: "feature-panel mobile-feature-panel}",
          children: l.jsx(wg, {
            features: xg,
            isMobile: t,
            showMobileDropdown: h,
            onToggleDropdown: p,
            onFeatureClick: w,
          }),
        });
  },
  Sg = [
    "#trending",
    "#technology",
    "#javascript",
    "#react",
    "#webdev",
    "#programming",
    "#design",
    "#ui",
    "#ux",
    "#frontend",
    "#backend",
    "#mobile",
    "#ios",
    "#android",
    "#nodejs",
    "#python",
    "#css",
    "#html",
    "#database",
    "#ai",
    "#machinelearning",
    "#startup",
    "#business",
    "#marketing",
    "#socialmedia",
    "#news",
    "#sports",
    "#music",
    "#movies",
    "#travel",
  ],
  _l = [
    "#trending",
    "#technology",
    "#javascript",
    "#react",
    "#webdev",
    "#programming",
    "#design",
    "#ui",
  ],
  Cg = () => {
    const [e, t] = y.useState(""),
      [n, r] = y.useState(!1),
      [s, i] = y.useState(_l),
      [o, a] = y.useState("main"),
      u = y.useRef(null);
    return (
      y.useEffect(() => {
        if (e.trim() === "") i(_l);
        else {
          const g = Sg.filter((w) => w.toLowerCase().includes(e.toLowerCase()));
          i(g.slice(0, 8));
        }
      }, [e]),
      {
        searchTerm: e,
        setSearchTerm: t,
        isSearchFocused: n,
        setIsSearchFocused: r,
        suggestions: s,
        currentView: o,
        searchRef: u,
        handleSearch: (g) => {
          g.preventDefault(),
            e.trim() && (console.log("Searching for:", e), a("search"), r(!1));
        },
        handleSuggestionClick: (g) => {
          console.log("Suggestion clicked:", g), t(g), a("search"), r(!1);
        },
        handleBackToMain: () => {
          a("main"), t(""), i(_l);
        },
      }
    );
  },
  Eg = () => {
    const [e, t] = y.useState(!1),
      [n, r] = y.useState(!1);
    return {
      isUserMenuOpen: e,
      setIsUserMenuOpen: t,
      isLoggedIn: n,
      handleLogin: () => {
        console.log("Login clicked"), r(!0), t(!1);
      },
      handleSignup: () => {
        console.log("Signup clicked"), r(!0), t(!1);
      },
      handleLogout: () => {
        console.log("Logout clicked"), r(!1), t(!1);
      },
    };
  };
var qr = { BASE_URL: "/", MODE: "production", DEV: !1, PROD: !0, SSR: !1 };
const eu = ({ isOpen: e, onToggle: t, position: n = "bottom-right" }) => {
    const [r, s] = y.useState([
        {
          id: 1,
          text: "Hi! I'm your AI assistant powered by advanced AI models. How can I help you today?",
          sender: "bot",
          timestamp: new Date(),
        },
      ]),
      [i, o] = y.useState(""),
      [a, u] = y.useState(!1),
      [c, d] = y.useState(!1),
      [h, g] = y.useState("gemini"),
      w = y.useRef(null),
      k = y.useRef(null),
      x = {
        openai: {
          url: "https://api.openai.com/v1/chat/completions",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${qr.VITE_OPENAI_API_KEY || ""}`,
          },
        },
        huggingface: {
          url: "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium",
          headers: {
            Authorization: `Bearer ${qr.VITE_HUGGINGFACE_API_KEY || ""}`,
            "Content-Type": "application/json",
          },
        },
        cohere: {
          url: "https://api.cohere.ai/v1/generate",
          headers: {
            Authorization: `Bearer ${qr.VITE_COHERE_API_KEY || ""}`,
            "Content-Type": "application/json",
          },
        },
        gemini: {
          url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
          headers: { "Content-Type": "application/json" },
        },
      },
      C = () => {
        var I;
        (I = w.current) == null || I.scrollIntoView({ behavior: "smooth" });
      };
    y.useEffect(() => {
      C();
    }, [r]),
      y.useEffect(() => {
        e &&
          !c &&
          setTimeout(() => {
            var I;
            (I = k.current) == null || I.focus();
          }, 100);
      }, [e, c]);
    const m = async (I) => {
        try {
          const O = await fetch(x.openai.url, {
            method: "POST",
            headers: x.openai.headers,
            body: JSON.stringify({
              model: "gpt-3.5-turbo",
              messages: [
                {
                  role: "system",
                  content:
                    "You are a helpful assistant for a website. Be concise and friendly.",
                },
                { role: "user", content: I },
              ],
              max_tokens: 150,
              temperature: 0.7,
            }),
          });
          if (!O.ok) throw new Error(`OpenAI API error: ${O.status}`);
          return (await O.json()).choices[0].message.content;
        } catch (O) {
          return (
            console.error("OpenAI API Error:", O),
            "I'm having trouble connecting to the AI service. Please try again later."
          );
        }
      },
      p = async (I) => {
        var O;
        try {
          const V = await fetch(x.huggingface.url, {
            method: "POST",
            headers: x.huggingface.headers,
            body: JSON.stringify({
              inputs: I,
              parameters: { max_length: 100, temperature: 0.7, do_sample: !0 },
            }),
          });
          if (!V.ok) throw new Error(`Hugging Face API error: ${V.status}`);
          return (
            ((O = (await V.json())[0]) == null ? void 0 : O.generated_text) ||
            "I'm not sure how to respond to that."
          );
        } catch (V) {
          return (
            console.error("Hugging Face API Error:", V),
            "I'm having trouble connecting to the AI service. Please try again later."
          );
        }
      },
      f = async (I) => {
        try {
          const O = await fetch(x.cohere.url, {
            method: "POST",
            headers: x.cohere.headers,
            body: JSON.stringify({
              model: "command-light",
              prompt: `Human: ${I}
AI:`,
              max_tokens: 100,
              temperature: 0.7,
              stop_sequences: [
                `
Human:`,
              ],
            }),
          });
          if (!O.ok) throw new Error(`Cohere API error: ${O.status}`);
          return (await O.json()).generations[0].text.trim();
        } catch (O) {
          return (
            console.error("Cohere API Error:", O),
            "I'm having trouble connecting to the AI service. Please try again later."
          );
        }
      },
      j = async (I) => {
        var O;
        try {
          const V =
              qr.VITE_GEMINI_API_KEY ||
              "AIzaSyA938qM6CH57oOQ6Or6K_KcR5x3yDSF088",
            te = `${x.gemini.url}?key=${V}`,
            _ = await fetch(te, {
              method: "POST",
              headers: x.gemini.headers,
              body: JSON.stringify({
                contents: [{ parts: [{ text: I }] }],
                generationConfig: {
                  temperature: 0.7,
                  topK: 1,
                  topP: 1,
                  maxOutputTokens: 200,
                  stopSequences: [],
                },
                safetySettings: [
                  {
                    category: "HARM_CATEGORY_HARASSMENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE",
                  },
                  {
                    category: "HARM_CATEGORY_HATE_SPEECH",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE",
                  },
                  {
                    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE",
                  },
                  {
                    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE",
                  },
                ],
              }),
            });
          if (!_.ok) {
            const z = await _.json();
            throw (
              (console.error("Gemini API Error Details:", z),
              new Error(
                `Gemini API error: ${_.status} - ${
                  ((O = z.error) == null ? void 0 : O.message) ||
                  "Unknown error"
                }`
              ))
            );
          }
          const M = await _.json();
          if (M.candidates && M.candidates.length > 0) {
            const z = M.candidates[0];
            if (z.content && z.content.parts && z.content.parts.length > 0)
              return z.content.parts[0].text;
          }
          return "I'm not sure how to respond to that.";
        } catch (V) {
          return (
            console.error("Gemini API Error:", V),
            "I'm having trouble connecting to the Gemini AI service. Please try again later."
          );
        }
      },
      S = async (I) => R(I),
      R = (I) => {
        const O = I.toLowerCase();
        if (O.includes("weather"))
          return "I'd love to help with weather information! You can check weather.com or your local weather app for the most accurate forecast.";
        if (O.includes("time") || O.includes("date"))
          return `The current time is ${new Date().toLocaleTimeString()} and today is ${new Date().toLocaleDateString()}.`;
        if (O.includes("calculate") || O.includes("math")) {
          try {
            const V = N(I);
            if (V !== null) return `The answer is: ${V}`;
          } catch {}
          return "I can help with basic calculations! Try asking me something like '2 + 2' or 'what is 10% of 50?'";
        }
        return O.includes("help") || O.includes("support")
          ? "I'm here to help! You can ask me questions about various topics, request information, or just have a conversation. What would you like to know?"
          : O.includes("hello") || O.includes("hi") || O.includes("hey")
          ? "Hello! Nice to meet you. I'm your AI assistant. How can I help you today?"
          : O.includes("thank")
          ? "You're welcome! I'm happy to help. Is there anything else you'd like to know?"
          : O.includes("bye") || O.includes("goodbye")
          ? "Goodbye! It was nice chatting with you. Feel free to come back anytime you need help!"
          : O.includes("programming") || O.includes("coding")
          ? "I can help with programming questions! While I'm running in offline mode, I can provide guidance on common programming concepts, debugging tips, and best practices."
          : O.includes("recipe") || O.includes("cooking")
          ? "I'd be happy to help with cooking questions! While I can't access real-time recipes, I can provide general cooking tips and techniques."
          : `That's an interesting question about "${I}". I'm currently running in offline mode, but I'm here to help with information, calculations, programming questions, and general conversation. Could you try rephrasing your question or asking about something specific?`;
      },
      N = (I) => {
        const O = /(\d+(?:\.\d+)?)\s*([\+\-\*\/])\s*(\d+(?:\.\d+)?)/,
          V = I.match(O);
        if (V) {
          const [, te, _, M] = V,
            z = parseFloat(te),
            F = parseFloat(M);
          switch (_) {
            case "+":
              return z + F;
            case "-":
              return z - F;
            case "*":
              return z * F;
            case "/":
              return F !== 0 ? z / F : "Cannot divide by zero";
            default:
              return null;
          }
        }
        return null;
      },
      P = async (I) => {
        switch (h) {
          case "openai":
            return await m(I);
          case "huggingface":
            return await p(I);
          case "cohere":
            return await f(I);
          case "gemini":
            return await j(I);
          case "free":
          default:
            return await S(I);
        }
      },
      $ = async (I) => {
        if ((I.preventDefault(), !i.trim())) return;
        const O = {
          id: Date.now(),
          text: i,
          sender: "user",
          timestamp: new Date(),
        };
        s((te) => [...te, O]);
        const V = i;
        o(""), u(!0);
        try {
          const te = await P(V),
            _ = {
              id: Date.now() + 1,
              text: te,
              sender: "bot",
              timestamp: new Date(),
            };
          s((M) => [...M, _]);
        } catch (te) {
          console.error("Error getting AI response:", te);
          const _ = {
            id: Date.now() + 1,
            text: "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.",
            sender: "bot",
            timestamp: new Date(),
          };
          s((M) => [...M, _]);
        } finally {
          u(!1);
        }
      },
      T = (I) => {
        I.key === "Enter" && !I.shiftKey && (I.preventDefault(), $(I));
      },
      D = (I) =>
        new Intl.DateTimeFormat("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: !0,
        }).format(I),
      W = (I) => {
        I.stopPropagation(), d(!c);
      },
      Pe = () => {
        switch (n) {
          case "bottom-left":
            return "chatbot-bottom-left";
          case "bottom-right":
          default:
            return "chatbot-bottom-right";
        }
      };
    return l.jsxs("div", {
      className: `chatbot-container ${Pe()}`,
      children: [
        l.jsxs("button", {
          className: `chatbot-toggle ${e ? "active" : ""}`,
          onClick: t,
          "aria-label": "Toggle chatbot",
          type: "button",
          children: [
            e ? l.jsx(Ls, { size: 24 }) : l.jsx(u0, { size: 24 }),
            !e && l.jsx("div", { className: "chatbot-notification-dot" }),
          ],
        }),
        e &&
          l.jsxs("div", {
            className: `chatbot-window ${c ? "minimized" : ""}`,
            children: [
              l.jsxs("div", {
                className: "chatbot-header",
                children: [
                  l.jsxs("div", {
                    className: "chatbot-header-info",
                    children: [
                      l.jsx("div", {
                        className: "chatbot-avatar",
                        children: l.jsx(Pl, { size: 20 }),
                      }),
                      l.jsxs("div", {
                        className: "chatbot-title",
                        children: [
                          l.jsx("h4", { children: "AI Assistant" }),
                          l.jsxs("span", {
                            className: "chatbot-status",
                            children: ["Online • ", h.toUpperCase()],
                          }),
                        ],
                      }),
                    ],
                  }),
                  l.jsxs("div", {
                    className: "chatbot-header-actions",
                    children: [
                      l.jsx("button", {
                        className: "chatbot-minimize",
                        onClick: W,
                        "aria-label": "Minimize chat",
                        type: "button",
                        children: l.jsx(d0, { size: 16 }),
                      }),
                      l.jsx("button", {
                        className: "chatbot-close",
                        onClick: t,
                        "aria-label": "Close chat",
                        type: "button",
                        children: l.jsx(Ls, { size: 16 }),
                      }),
                    ],
                  }),
                ],
              }),
              !c && !1,
              !c &&
                l.jsxs(l.Fragment, {
                  children: [
                    l.jsxs("div", {
                      className: "chatbot-messages",
                      children: [
                        r.map((I) =>
                          l.jsxs(
                            "div",
                            {
                              className: `chatbot-message ${I.sender}`,
                              children: [
                                l.jsx("div", {
                                  className: "message-avatar",
                                  children:
                                    I.sender === "bot"
                                      ? l.jsx(Pl, { size: 16 })
                                      : l.jsx(mn, { size: 16 }),
                                }),
                                l.jsxs("div", {
                                  className: "message-content",
                                  children: [
                                    l.jsx("div", {
                                      className: "message-bubble",
                                      children: I.text,
                                    }),
                                    l.jsx("div", {
                                      className: "message-time",
                                      children: D(I.timestamp),
                                    }),
                                  ],
                                }),
                              ],
                            },
                            I.id
                          )
                        ),
                        a &&
                          l.jsxs("div", {
                            className: "chatbot-message bot",
                            children: [
                              l.jsx("div", {
                                className: "message-avatar",
                                children: l.jsx(Pl, { size: 16 }),
                              }),
                              l.jsx("div", {
                                className: "message-content",
                                children: l.jsx("div", {
                                  className: "message-bubble typing",
                                  children: l.jsxs("div", {
                                    className: "typing-dots",
                                    children: [
                                      l.jsx("span", {}),
                                      l.jsx("span", {}),
                                      l.jsx("span", {}),
                                    ],
                                  }),
                                }),
                              }),
                            ],
                          }),
                        l.jsx("div", { ref: w }),
                      ],
                    }),
                    l.jsx("form", {
                      className: "chatbot-input-form",
                      onSubmit: $,
                      children: l.jsxs("div", {
                        className: "chatbot-input-wrapper",
                        children: [
                          l.jsx("input", {
                            ref: k,
                            type: "text",
                            value: i,
                            onChange: (I) => o(I.target.value),
                            onKeyPress: T,
                            placeholder: "Ask me anything...",
                            className: "chatbot-input",
                            disabled: a,
                          }),
                          l.jsx("button", {
                            type: "submit",
                            className: "chatbot-send",
                            disabled: !i.trim() || a,
                            "aria-label": "Send message",
                            children: l.jsx(j0, { size: 18 }),
                          }),
                        ],
                      }),
                    }),
                  ],
                }),
            ],
          }),
      ],
    });
  },
  Kd = () => {
    const [e, t] = y.useState(!1),
      [n, r] = y.useState(!1),
      [s, i] = y.useState(!1),
      [o, a] = y.useState(!1),
      [u, c] = y.useState("main"),
      [d, h] = y.useState(null),
      [g, w] = y.useState(!1),
      k = y.useRef(null),
      x = y.useRef(null),
      C = Mn(),
      m = bt(),
      {
        searchTerm: p,
        setSearchTerm: f,
        isSearchFocused: j,
        setIsSearchFocused: S,
        suggestions: R,
        searchRef: N,
        handleSearch: P,
        handleSuggestionClick: $,
      } = Cg(),
      {
        isUserMenuOpen: T,
        setIsUserMenuOpen: D,
        isLoggedIn: W,
        handleLogout: Pe,
      } = Eg(),
      I = m.pathname === "/" || m.pathname === "/home",
      O = m.pathname === "/search",
      V = () => {
        w(!g);
      },
      te = () => {
        c("main"), h(null), a(!1), r(!1);
      },
      _ = () => {
        c("login"), D(!1), i(!1), a(!1);
      },
      M = () => {
        c("signup"), D(!1), i(!1), a(!1);
      },
      z = (b) => {
        console.log("Login successful:", b), c("main");
      },
      F = (b) => {
        console.log("Signup successful:", b), c("main");
      },
      K = async (b) => {
        f(b), r(!1), a(!1), C(`/search?q=${encodeURIComponent(b)}`);
      },
      nt = (b) => {
        $(b), K(b);
      };
    y.useEffect(() => {
      const b = () => {
        const _r = window.innerWidth <= 768;
        t(_r);
      };
      return (
        b(),
        window.addEventListener("resize", b),
        () => window.removeEventListener("resize", b)
      );
    }, []);
    const Oe = (b) => {
        b.preventDefault(), b.stopPropagation(), r(!0), a(!1);
      },
      De = (b) => {
        b.preventDefault(), b.stopPropagation(), i(!s), a(!1);
      };
    y.useEffect(() => {
      const b = (_r) => {
        s && k.current && !k.current.contains(_r.target) && i(!1),
          o && x.current && !x.current.contains(_r.target) && a(!1);
      };
      return (
        (s || o) &&
          (document.addEventListener("click", b),
          document.addEventListener("touchstart", b)),
        () => {
          document.removeEventListener("click", b),
            document.removeEventListener("touchstart", b);
        }
      );
    }, [s, o]);
    const B = (b) => {
        b.preventDefault(), b.stopPropagation(), C("/login");
      },
      _e = (b) => {
        b.preventDefault(), b.stopPropagation(), C("/signup");
      },
      en = (b) => {
        b.preventDefault(), b.stopPropagation(), Pe(), i(!1);
      },
      zo = () => {
        switch (u) {
          case "search":
            return l.jsx(yg, {
              searchTerm: p,
              searchResults: d,
              onBackToMain: te,
            });
          case "login":
            return l.jsx(Login, {
              onLoginSuccess: z,
              onBackToMain: te,
              onSwitchToSignup: M,
            });
          case "signup":
            return l.jsx(SignUp, {
              onSignupSuccess: F,
              onBackToMain: te,
              onSwitchToLogin: _,
            });
          case "main":
          default:
            return l.jsx(Ng, {
              onSearch: K,
              onBackToMain: te,
              searchTerm: p,
              isMobile: e,
            });
        }
      },
      Zs = !O;
    return e
      ? l.jsxs(l.Fragment, {
          children: [
            l.jsxs("div", {
              className: "mobile-header-icons-container",
              style: { display: I ? "block" : "none" },
              children: [
                l.jsx("div", { className: "mobile-header-spacer" }),
                l.jsxs("div", {
                  className: "mobile-header-icons",
                  children: [
                    Zs &&
                      l.jsx("button", {
                        className: "mobile-search-icon",
                        onClick: Oe,
                        onTouchEnd: Oe,
                        onMouseDown: (b) => b.preventDefault(),
                        "aria-label": "Open search",
                        type: "button",
                        style: {
                          WebkitTapHighlightColor: "transparent",
                          touchAction: "manipulation",
                          userSelect: "none",
                        },
                        children: l.jsx(Co, { size: 24 }),
                      }),
                    l.jsxs("div", {
                      className: "mobile-user-menu",
                      ref: k,
                      children: [
                        l.jsx("button", {
                          className: "mobile-user-icon",
                          onClick: De,
                          onTouchEnd: De,
                          onMouseDown: (b) => b.preventDefault(),
                          "aria-label": "User menu",
                          type: "button",
                          style: {
                            WebkitTapHighlightColor: "transparent",
                            touchAction: "manipulation",
                            userSelect: "none",
                          },
                          children: l.jsx(mn, { size: 24 }),
                        }),
                        s &&
                          l.jsx("div", {
                            className: "user-dropdown",
                            children: W
                              ? l.jsxs(l.Fragment, {
                                  children: [
                                    l.jsx("div", {
                                      className: "user-info",
                                      children: l.jsx("span", {
                                        children: "Welcome, User!",
                                      }),
                                    }),
                                    l.jsxs("button", {
                                      onClick: en,
                                      className: "menu-item",
                                      type: "button",
                                      children: [
                                        l.jsx(mn, { size: 16 }),
                                        "Logout",
                                      ],
                                    }),
                                  ],
                                })
                              : l.jsxs(l.Fragment, {
                                  children: [
                                    l.jsxs("button", {
                                      onClick: B,
                                      className: "menu-item",
                                      type: "button",
                                      children: [
                                        l.jsx(mn, { size: 16 }),
                                        "Login",
                                      ],
                                    }),
                                    l.jsxs("button", {
                                      onClick: _e,
                                      className: "menu-item",
                                      type: "button",
                                      children: [
                                        l.jsx(mn, { size: 16 }),
                                        "Sign Up",
                                      ],
                                    }),
                                  ],
                                }),
                          }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            Zs &&
              l.jsx(vg, {
                searchTerm: p,
                setSearchTerm: f,
                isMobileSearchOpen: n,
                setIsMobileSearchOpen: r,
                onSearch: K,
                suggestions: R,
                onSuggestionClick: nt,
              }),
            l.jsx("div", { className: "mobile-main-content", children: zo() }),
            l.jsx(eu, { isOpen: g, onToggle: V, position: "bottom-left" }),
          ],
        })
      : l.jsxs(l.Fragment, {
          children: [
            l.jsxs("div", {
              className: "right-sidebar",
              children: [
                l.jsxs("div", {
                  className: "right-sidebar__header",
                  children: [
                    Zs &&
                      l.jsx(hg, {
                        searchTerm: p,
                        setSearchTerm: f,
                        isSearchFocused: j,
                        setIsSearchFocused: S,
                        onSearch: K,
                        suggestions: R,
                        onSuggestionClick: nt,
                        searchRef: N,
                      }),
                    l.jsx(mg, {
                      isUserMenuOpen: T,
                      setIsUserMenuOpen: D,
                      isLoggedIn: W,
                      onLogin: _,
                      onSignup: M,
                      onLogout: Pe,
                    }),
                  ],
                }),
                l.jsx("div", {
                  className: "right-sidebar__content",
                  children: zo(),
                }),
              ],
            }),
            l.jsx(eu, { isOpen: g, onToggle: V, position: "bottom-right" }),
          ],
        });
  };
function Pg() {
  return l.jsx(No, {
    children: l.jsxs("div", {
      className: "main",
      children: [
        l.jsx(Mo, {}),
        l.jsx("div", { className: "body", children: l.jsx(wo, {}) }),
        l.jsx(Kd, {}),
      ],
    }),
  });
}
function _g() {
  return l.jsx(No, {
    children: l.jsxs("div", {
      className: "main",
      children: [
        l.jsx(Mo, {}),
        l.jsx("div", { className: "body", children: l.jsx(wo, {}) }),
      ],
    }),
  });
}
function Rg() {
  return l.jsx("div", {
    className: "bg text-secondary px-4 py-5 text-center WelcomeMessage",
    children: l.jsxs("div", {
      className: "py-5",
      children: [
        l.jsx("h1", {
          className: "display-5 fw-bold text-black ",
          children: "Notifications",
        }),
        l.jsx("div", {
          className: "col-lg-6 mx-auto",
          children: l.jsx("p", {
            className: "fs-5 mb-4",
            children:
              "Coming Soon! This page will provide you with updates on your posts, likes, comments, and more. Stay tuned for updates!",
          }),
        }),
      ],
    }),
  });
}
function Tg() {
  return l.jsx(Rg, {});
}
function Lg() {
  return l.jsx("div", {
    className: "bg text-secondary px-4 py-5 text-center ContactUs",
    children: l.jsxs("div", {
      className:
        "card-body text-center flex flex-column align-items-center justify-content-center",
      children: [
        l.jsx("h5", { className: "card-title", children: "Contact Us" }),
        l.jsxs("p", {
          className: "card-text",
          children: [
            "If you have any questions or feedback, please reach out to us at",
            l.jsx("a", {
              href: "mailto:kanhaiaggarwal@gmail.com",
              children: l.jsx("span", {
                className: "badge text-bg-light",
                children: "kanhaiaggarwal@gmail.com",
              }),
            }),
          ],
        }),
      ],
    }),
  });
}
function Ig() {
  return l.jsx(Lg, {});
}
function Mg() {
  return l.jsx("div", { children: "Hello this the Image Page" });
}
function zg() {
  return l.jsx(Mg, {});
}
function Og() {
  return l.jsx(Ad, {
    children: l.jsxs("div", {
      className: "main",
      children: [
        l.jsx(Mo, {}),
        l.jsx("div", { className: "body", children: l.jsx(wo, {}) }),
        l.jsx(Kd, {}),
      ],
    }),
  });
}
hd(document.getElementById("root")).render(
  l.jsx(y.StrictMode, {
    children: l.jsx(jm, {
      children: l.jsxs(pm, {
        children: [
          l.jsxs(we, {
            element: l.jsx(Pg, {}),
            children: [
              l.jsx(we, { path: "/", element: l.jsx(z0, {}) }),
              l.jsx(we, { path: "/createpost", element: l.jsx(F0, {}) }),
              l.jsx(we, {
                path: "/:username/status/:id",
                element: l.jsx(B0, {}),
              }),
              l.jsx(we, { path: "/notifications", element: l.jsx(Tg, {}) }),
              l.jsx(we, { path: "/contact", element: l.jsx(Ig, {}) }),
              l.jsx(we, { path: "/search", element: l.jsx(D0, {}) }),
            ],
          }),
          l.jsx(we, {
            element: l.jsx(_g, {}),
            children: l.jsx(we, { path: "/i/twitty", element: l.jsx(H0, {}) }),
          }),
          l.jsx(we, {
            element: l.jsx(Og, {}),
            children: l.jsx(we, { path: "/:username", element: l.jsx($0, {}) }),
          }),
          l.jsx(we, {
            path: "/:username/status/:id/photo/:num",
            element: l.jsx(zg, {}),
          }),
          l.jsx(we, { path: "/auth", element: l.jsx(W0, {}) }),
        ],
      }),
    }),
  })
);
