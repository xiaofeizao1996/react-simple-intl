"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _stringFormat = _interopRequireDefault(require("string-format"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj &&
        typeof Symbol === "function" &&
        obj.constructor === Symbol &&
        obj !== Symbol.prototype
        ? "symbol"
        : typeof obj;
    };
  }
  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }
  return _assertThisInitialized(self);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf
    ? Object.getPrototypeOf
    : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
      };
  return _getPrototypeOf(o);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    );
  }
  return self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: { value: subClass, writable: true, configurable: true }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf =
    Object.setPrototypeOf ||
    function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };
  return _setPrototypeOf(o, p);
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly)
      symbols = symbols.filter(function(sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    keys.push.apply(keys, symbols);
  }
  return keys;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys(Object(source), true).forEach(function(key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function(key) {
        Object.defineProperty(
          target,
          key,
          Object.getOwnPropertyDescriptor(source, key)
        );
      });
    }
  }
  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

var LOCAL_STORAGE_LOCALE_KEY = "locale";
var current = "zh";
var fallback = "en";
var handlers = [];
var global = {};
var localeFromLocalStorage = localStorage.getItem(LOCAL_STORAGE_LOCALE_KEY);

if (localeFromLocalStorage != null && localeFromLocalStorage.trim() !== "") {
  current = localeFromLocalStorage;
} else {
  current = navigator.language.substring(0, 2);
}

var LocaleContext = _react["default"].createContext(current);

var createTranslate = function createTranslate(local) {
  return function(key) {
    var keyOfGlobal = Object.keys(global);
    var keyOfLocal = local ? Object.keys(local) : [];

    if (keyOfLocal.length) {
      var sameKey = keyOfGlobal.filter(function(item) {
        return keyOfLocal.includes(item);
      });

      if (sameKey.length) {
        console.warn(
          "intl:It is not recommended to have the same key, you have sameKey ".concat(
            sameKey.join(","),
            " use in intl.global "
          )
        );
      }
    }

    var languages = _objectSpread({}, global, {}, local);

    var item = languages[key];

    if (item === undefined) {
      throw new Error("intl:Can't find the key [".concat(key, "] in locales"));
    }

    var text = item[current];

    if (text === undefined) {
      text = item[fallback];
    }

    if (text === undefined || typeof text !== "string") {
      throw new Error(
        "intl:No languages("
          .concat(current, ",")
          .concat(fallback, ") for the key[")
          .concat(key, "]")
      );
    }

    for (
      var _len = arguments.length,
        params = new Array(_len > 1 ? _len - 1 : 0),
        _key = 1;
      _key < _len;
      _key++
    ) {
      params[_key - 1] = arguments[_key];
    }

    return _stringFormat["default"].apply(void 0, [text].concat(params));
  };
};

var onChanged = function onChanged(handler) {
  if (handler && typeof handler === "function") {
    handlers.push(handler);
  } else {
    throw Error("intl:The parameter of intl.onChanged must be a function");
  }

  return function() {
    handlers = handlers.filter(function(f) {
      return f !== handler;
    });
  };
};

var intl = function intl(target) {
  return function(props) {
    return _react["default"].createElement(
      LocaleContext.Consumer,
      null,
      function(value) {
        return _react["default"].createElement(
          target,
          _objectSpread({}, props, {
            locale: value
          })
        );
      }
    );
  };
};

intl.locale = function(currentLocale, fallbackLocale) {
  if (!currentLocale) {
    throw Error("intl: Intl.locale must have more than one parameter");
  }

  if (
    typeof currentLocale !== "string" ||
    (fallbackLocale && typeof fallbackLocale !== "string")
  ) {
    throw Error(
      "intl:The parameter of intl.locale must be a string but get "
        .concat(currentLocale, ",")
        .concat(fallbackLocale)
    );
  } else {
    if (current === currentLocale && fallback === fallbackLocale) return;
    setTimeout(function() {
      current = currentLocale;
      fallback = fallbackLocale;
      localStorage.setItem(LOCAL_STORAGE_LOCALE_KEY, current);
      handlers.forEach(function(handler) {
        return handler(current);
      });
    });
  }
};

intl.global = function(languages) {
  global = languages || {};
};

intl.load = function(languages) {
  return createTranslate(languages);
};

intl.LocaleContextProvider =
  /*#__PURE__*/
  (function(_React$PureComponent) {
    _inherits(_class, _React$PureComponent);

    function _class(props) {
      var _this;

      _classCallCheck(this, _class);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(_class).call(this, props)
      );
      _this.state = {
        locale: current
      };
      _this.removeHandler = onChanged(
        _this.handleChange.bind(_assertThisInitialized(_this))
      );
      return _this;
    }

    _createClass(_class, [
      {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
          this.removeHandler();
        }
      },
      {
        key: "handleChange",
        value: function handleChange(locale) {
          if (this.state.locale === locale) return;
          this.setState({
            locale: locale
          });
        }
      },
      {
        key: "render",
        value: function render() {
          if (this.state.locale == null) return null;
          return _react["default"].createElement(
            LocaleContext.Provider,
            {
              value: this.state.locale
            },
            this.props.children
          );
        }
      }
    ]);

    return _class;
  })(_react["default"].PureComponent);

var _default = intl;
exports["default"] = _default;
