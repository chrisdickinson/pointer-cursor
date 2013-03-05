var interact = require('interact')
  , cursor = require('./index')
  , element

var pointer = interact(document.body)
  , current

pointer.on('attain', function(movements) {
  var to = current = cursor(element, true, true)
  element = to.element
  movements.pipe(to)
})

document.body.onclick = function(ev) {
  if(current) {
    current.click(ev.button)
  }
}
