
'use strict'
require('.')
const { equal } = require('assert')
const { renderToString } = require('react-dom/server')
const { createElement, useState } = require('react')
const Component = () => {
  const [count, update ] = useState(0)
  setTimeout(() => {
    update(count + 1)
  }, 100)
  return createElement('div', null, 
    createElement('span', null, 'count:' + count)
  )
}

console.log('TAP version 13')
console.log('# Subtest: useState SSR')
equal(renderToString(createElement(Component)), '<div data-reactroot=""><span>count:0</span></div>')
console.log('    ok 1 - initial render')
setTimeout(() => {
  equal(renderToString(createElement(Component)), '<div data-reactroot=""><span>count:1</span></div>')
  console.log('    ok 2 - updated state render')
  console.log('    1..2')
  console.log('ok 1 - useState SSR')
  console.log()
}, 200)