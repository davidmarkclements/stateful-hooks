
'use strict'
require('.') // rssh
const { renderToString } = require('react-dom/server')
const { createElement, useState } = require('react')

const Component = () => {
  const [count, update ] = useState(0)
  setTimeout(() => {
    update(count + 1)
  }, 100)
  return createElement('div', null, [
    createElement('span', null, 'count:' + count)
  ])
}

console.log(renderToString(createElement(Component)))

setTimeout(() => {
  console.log(renderToString(createElement(Component)))
}, 200)