'use strict'
const { renderToString } = require('react-dom/server')
const { createElement, useState } = require('react')

const Component = () => {
  const [count, update ] = useState(0)
  return createElement('div', null, 
    createElement('span', null, 'count:' + count)
  )
}

var i = 100000;
console.time('bench')
while (i--) renderToString(createElement(Component))
console.timeEnd('bench')