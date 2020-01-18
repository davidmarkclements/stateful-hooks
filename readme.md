# stateful-hooks

Give your react hooks state on the server side


## Usage

This is a drop-in module that will modifiy React ssr behaviour.

Use as a preloaoder

```shh
node -r stateful-hooks my-app.js
```

Or react in the entry point before requiring react:

```js
require('stateful-hooks')
const React = require('react')
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

## License

MIT