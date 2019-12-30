import React from "react";
import format from "string-format";

const LOCAL_STORAGE_LOCALE_KEY = "locale";

let current = "zh";
let fallback = "en";
let handlers = [];
let global = {};

const localeFromLocalStorage = localStorage.getItem(LOCAL_STORAGE_LOCALE_KEY);

if (localeFromLocalStorage != null && localeFromLocalStorage.trim() !== "") {
  current = localeFromLocalStorage;
} else {
  current = navigator.language.substring(0, 2);
}

const LocaleContext = React.createContext(current);

const createTranslate = local => {
  return (key, ...params) => {
    const keyOfGlobal = Object.keys(global);
    const keyOfLocal = local ? Object.keys(local) : [];
    if (keyOfLocal.length) {
      const sameKey = keyOfGlobal.filter(item => keyOfLocal.includes(item));
      if (sameKey.length) {
        console.warn(
          `intl:It is not recommended to have the same key, you have sameKey ${sameKey.join(
            ","
          )} use in intl.global `
        );
      }
    }
    const languages = { ...global, ...local };
    const item = languages[key];
    if (item === undefined) {
      throw new Error(`intl:Can't find the key [${key}] in locales`);
    }
    let text = item[current];
    if (text === undefined) {
      text = item[fallback];
    }
    if (text === undefined || typeof text !== "string") {
      throw new Error(
        `intl:No languages(${current},${fallback}) for the key[${key}]`
      );
    }
    return format(text, ...params);
  };
};

const onChanged = handler => {
  if (handler && typeof handler === "function") {
    handlers.push(handler);
  } else {
    throw Error("intl:The parameter of intl.onChanged must be a function");
  }
  return () => {
    handlers = handlers.filter(f => f !== handler);
  };
};

const intl = target => props => (
  <LocaleContext.Consumer>
    {value => React.createElement(target, { ...props, locale: value })}
  </LocaleContext.Consumer>
);

intl.locale = (currentLocale, fallbackLocale) => {
  if (!currentLocale) {
    throw Error("intl: Intl.locale must have more than one parameter");
  }
  if (
    typeof currentLocale !== "string" ||
    (fallbackLocale && typeof fallbackLocale !== "string")
  ) {
    throw Error(
      `intl:The parameter of intl.locale must be a string but get ${currentLocale},${fallbackLocale}`
    );
  } else {
    if (current === currentLocale && fallback === fallbackLocale) return;
    setTimeout(() => {
      current = currentLocale;
      fallback = fallbackLocale;
      localStorage.setItem(LOCAL_STORAGE_LOCALE_KEY, current);
      handlers.forEach(handler => handler(current));
    });
  }
};

intl.global = languages => {
  global = languages || {};
};

intl.load = languages => createTranslate(languages);

intl.LocaleContextProvider = class extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      locale: current
    };
    this.removeHandler = onChanged(this.handleChange.bind(this));
  }

  componentWillUnmount() {
    this.removeHandler();
  }

  handleChange(locale) {
    if (this.state.locale === locale) return;
    this.setState({ locale });
  }

  render() {
    if (this.state.locale == null) return null;
    return (
      <LocaleContext.Provider value={this.state.locale}>
        {this.props.children}
      </LocaleContext.Provider>
    );
  }
};

export default intl;
