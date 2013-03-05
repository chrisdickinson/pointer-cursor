# pointer-cursor

for when you've got a fullscreen game, but you want a cursor.

```javascript
var interact = require('interact')
  , cursor = require('./index')
  , element

var pointer = interact(document.body)
  , current

pointer.on('attain', function(movements) {
  var to = current = cursor(element, true)
  element = to.element
  movements.pipe(to)
})

document.body.onclick = function(ev) {
  if(current) {
    current.click(ev.button)
  }
}
```

## api

#### cursor([element][, constrainToWindow][, dispatchHover]) -> writable stream

creates a cursor element if none is given, and returns it as a writable
stream suitable for piping `interact` movement streams into.

if `constrainToWindow` isn't given, it defaults to `true`; the cursor will
not be able to leave the window.

if `dispatchHover` isn't given, it defaults to `false`; enabling it will
dispatch `mouseover` and `mouseout` events to the elements hovered. note that
this is experimental and slow. 

#### stream.click([button=0])

dispatch a click event to the currently hovered element.

#### stream.element

the element representing the cursor.

#### stream.target() -> element or null

the element currently hovered.

## license

MIT
