<h1 align="center">stateful-hooks</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <a href="https://github.com/davidmarkclements/stateful-hooks#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/davidmarkclements/stateful-hooks/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://github.com/davidmarkclements/stateful-hooks/blob/master/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/github/license/davidmarkclements/stateful-hooks" />
  </a>
  <a href="https://twitter.com/davidmarkclem" target="_blank">
    <img alt="Twitter: davidmarkclem" src="https://img.shields.io/twitter/follow/davidmarkclem.svg?style=social" />
  </a>
</p>

> Give your react hooks state on the server side

### 🏠 [Homepage](https://github.com/davidmarkclements/stateful-hooks#readme)

## Usage

This is a drop-in module that will modifiy React hooks SSR behaviour.

Use as a preloaoder

```shh
node -r stateful-hooks my-app.js
```

Or react in the entry point before requiring react:

```js
require('stateful-hooks')
const React = require('react')
```

## Install

```sh
npm install
```

## Run tests

```sh
npm test
```

## Stateful Hooks

The following hooks retain state on the server side when `stateful-hooks` has been applied:

* useState - persists state across requests
* useReducer  - persists state across requests 
* useMemo - persists memoization across requests
* useCallback - persists memoization across requests
* useContext - supplies context state during ssr
* useRef - returns `{current: input}` instead of `undefined`
* useEffect - can be enabled on a case by case basis by setting `useEffect.ssr` to true. In SSR mode use effect is called during rendering.

## Server-side `useEffect`

`useEffect` is a client-side only hook, however we can opt in to making the useEffect call into a server-side hook by setting `useEffect.ssr = true` right before it is called:

```js
import { useEffect } from 'react'
const MyComponent = () => {
  const [ state, update ] = useState(0)
  useEffect.ssr = true
  useEffect(() => {
    update(1) // this will be called server side
  })
  useEffect(() => {
    update(2) // this will NOT be called server side
  })
}
```

## Avoiding server state

In the event that server state is unwanted in a particular context, ensure the `update` function is called within `useEffect` (without setting `useEffect.ssr` to true) so that it's client side only. 

## Author

👤 **David Mark Clements**

* Twitter: [@davidmarkclem](https://twitter.com/davidmarkclem)
* Github: [@davidmarkclements](https://github.com/davidmarkclements)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/davidmarkclements/stateful-hooks/issues). 

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2020 [David Mark Clements](https://github.com/davidmarkclements).<br />
This project is [MIT](https://github.com/davidmarkclements/stateful-hooks/blob/master/LICENSE) licensed.

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_