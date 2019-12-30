# REACT-SIMPLE-INTL

Internationalize React apps.This library provides an API to handle translations.

# Example

```javascript
// index.js
import React from "react";
import ReactDOM from "react-dom";
import Global from "./Global";

ReactDOM.render(<Global />, document.getElementById("root"));

// Global.js
import React from "react";
import intl from "react-simple-intl";
import A from "./A";
import B from "./B";
intl.global({
  hello: {
    zh: "你好",
    en: "Hello"
  },
  greeting: {
    zh: "你好",
    en: "greeting"
  }
});
export default class extends React.PureComponent {
  render() {
    return (
      <intl.LocaleContextProvider>
        <A />
        <B />
      </intl.LocaleContextProvider>
    );
  }
}

// A.js
import React from "react";
import intl from "react-simple-intl";
const t = intl.load({
  greeting: {
    zh: "你好",
    en: "greeting"
  }
});
class A extends React.PureComponent {
  handleChangeLanguage(language) {
    intl.locale(language);
  }
  render() {
    return (
      <div>
        <button onClick={() => this.handleChangeLanguage("zh")}>中文</button>
        <button onClick={() => this.handleChangeLanguage("en")}>英文</button>
        <div>{t("hello")}</div>
        <div>{t("greeting")}</div>
      </div>
    );
  }
}
export default intl(A);

// B.js
import React from "react";
import intl from "react-simple-intl";
const t = intl.load({
  hey: {
    zh: "你好",
    en: "hey"
  }
});
class B extends React.PureComponent {
  render() {
    return (
      <div>
        <div>{t("hey")}</div>
        <div>{t("hello")}</div>
      </div>
    );
  }
}
export default intl(B);
```

# Contribute

### Let's make react-simple-intl better! If you're interested in helping, all contributions are welcome and appreciated.
