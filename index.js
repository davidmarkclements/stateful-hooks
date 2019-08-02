// 'use strict'
const react = tryToLoad('react')
const reactDomServer = tryToLoad('react-dom/server')
const {
  // I'll be fine:
  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: internals
} = react
const { renderToString } = reactDomServer
const map = new Map()
const { prepareStackTrace, stackTraceLimit } = Error
reactDomServer.renderToString = (element) => {
  install()
  const str = renderToString(element)
  uninstall()
  return str
}

function noop () {}
const rsshDispatcher = {
  rssh: true,
  useMemo,
  useReducer,
  useRef,
  useState,
  useCallback,
  useContext,
  useLayoutEffect: noop,
  useImperativeHandle: noop,
  useEffect: noop,
  useDebugValue: noop
}
var reactDispatcher = null
var dispatcher = null
Object.defineProperty(internals.ReactCurrentDispatcher, 'current', {
  get () {
    return dispatcher
  },
  set (d) {
    if (d !== null && d.rssh !== true) {
      reactDispatcher = Object.assign({}, d)
      Object.assign(d, rsshDispatcher)
      Object.defineProperty(internals.ReactCurrentDispatcher, 'current', {
        value: d, configurable: true, writable: true
      })
      return d
    }
    return (dispatcher = d)
  }
}, {configurable: true})

const current = {
  rendering: null,
  index: 0,
  useState: react.useState
}
function rendering (cmp) {
  current.rendering = cmp
  current.index = 0
}
function before () {
  Error.stackTraceLimit = 3
  Error.prepareStackTrace = (_, stack) => stack
  const { stack } = Error()
  Error.stackTraceLimit = stackTraceLimit
  const frame = stack[2]
  const id = frame.getFileName() + frame.getLineNumber() + frame.getColumnNumber()
  rendering(id)
}
function after () {
  Error.prepareStackTrace = prepareStackTrace
}
function install () {
  dispatcher = rsshDispatcher
  internals.ReactCurrentDispatcher.current = dispatcher
}
function uninstall () {
  dispatcher = rsshDispatcher
  current.rendering = null
  current.index = 0
}
function useStateDispatcher (states) {
  return Function( // eslint-disable-line
    'newState',
    `this.states[${current.index}] = newState`
  ).bind({ states })
}
function useReducerDispatcher (states, reducer) {
  return Function( // eslint-disable-line
    'action',
    `this.states[${current.index}] = this.reducer(this.states[${current.index}], action)`
  ).bind({ states, reducer })
}
function useMemoDispatcher (states) {
  return Function( // eslint-disable-line
    'fn',
    'deps',
    `
      const lastDeps = this.states[${current.index}]
      if (!('val' in this)) return (this.val = fn())
      if (deps.length !== lastDeps.length) {
        this.states[${current.index}] = deps
        return (this.val = fn())
      }
      
      for (var i = 0; i < deps.length; i++) {
        if (!Object.is(deps[i], lastDeps[i])) {
          this.states[${current.index}] = deps
          return (this.val = fn())
        }
      }
      return this.val
    `
  ).bind({ states })
}
function getState (initialState, makeDispatcher, opts = null) {
  let meta = map.get(current.rendering)
  const { index } = current
  if (!meta) {
    meta = {}
    meta.hooksUsed = true
    meta.hooks = meta.hooks || {
      states: [],
      dispatchers: []
    }
    meta.hooks.states[index] = initialState
    const dispatch = makeDispatcher(meta.hooks.states, opts)
    meta.hooks.dispatchers[index] = dispatch
    current.index++
    map.set(current.rendering, meta)
    return [initialState, dispatch]
  }
  const state = meta.hooks.states[index]
  const dispatch = meta.hooks.dispatchers[index]
  current.index++
  return [state, dispatch]
}

function useMemo (fn, deps) {
  const [ , getVal ] = getState(deps, useMemoDispatcher)
  return getVal(fn, deps)
}
function useReducer (reducer, initialState, init) {
  if (typeof init === 'function') initialState = init(initialState)
  return getState(initialState, useReducerDispatcher, reducer)
}

function useRef (val) {
  return { current: val }
}

function useState (initialState) {
  return getState(initialState, useStateDispatcher)
}

function useCallback (cb, deps) {
  return useMemo(() => cb, deps)
}

function useContext (context) {
  return reactDispatcher.useContext(context)
}

function inject () {
  const {
    useMemo,
    useReducer,
    useRef,
    useState,
    useCallback,
    useContext
  } = react
  function _useMemo (...args) {
    before()
    const result = useMemo(...args)
    after()
    return result
  }
  function _useReducer (...args) {
    before()
    const result = useReducer(...args)
    after()
    return result
  }
  function _useRef (...args) {
    before()
    const result = useRef(...args)
    after()
    return result
  }
  function _useState (...args) {
    before()
    const result = useState(...args)
    after()
    return result
  }
  function _useCallback (...args) {
    before()
    const result = useCallback(...args)
    after()
    return result
  }
  function _useContext (...args) {
    before()
    const result = useContext(...args)
    after()
    return result
  }
  Object.assign(react, {
    useMemo: _useMemo,
    useReducer: _useReducer,
    useRef: _useRef,
    useState: _useState,
    useCallback: _useCallback,
    useContext: _useContext
  })
}

inject()

function tryToLoad (peer) {
  if (require.cache[require.resolve(peer)]) {
    console.error(`
      react-ssr-stateful-hooks must be loaded before react
    `)
    process.exit(1)
  }
  try {
    return require(peer)
  } catch (e) {
    console.error(`
      react-ssr-stateful-hooks depends on ${peer} as a peer dependency, 
      ensure that ${peer} is installed in your application
    `)
    process.exit(1)
  }
}