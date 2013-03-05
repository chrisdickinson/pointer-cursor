module.exports = cursor

var document = require('global/document')
  , window = require('global/window')
  , through = require('through')
  , events = require('synthetic-dom-events')
  , debounce = require('debounce')
  , parents = require('ancestors')
  , property = determine_property()

function cursor(el, constrain, dohover) {
  el = el || create()
  constrain = constrain === undefined ? true : !!constrain
  dohover = !!dohover

  var stream = through(write, end)
    , resize = debounce(onresize, 33) 
    , last = document.body
    , x, y, w, h

  stream.on('pipe', onpipe)

  if(constrain) {
    window.addEventListener('resize', resize)
    resize()
  }

  stream.element = el
  stream.click = click
  stream.target = target

  return stream

  function target() {
    var target = document.elementFromPoint(x-0.1, y-0.1)
    return target
  }

  function click(button) {
    var el = target()
      , ev = events('click', {button: button || 0})

    if(!el) {
      return
    }

    return el.dispatchEvent(ev)
  }

  function hover() {
    var el = target()
      , ev

    if(el === last || el === null) {
      return
    }

    var lhs = parents(last).reverse()
      , rhs = parents(el).reverse()
      , common = null

    for(var i = 0, len = Math.min(lhs.length, rhs.length); i < len; ++i) {
      if(lhs[i] !== rhs[i]) {
        break
      }
    }

    common = i

    for(var i = lhs.length - 1; i !== common - 1; --i) {
      lhs[i].dispatchEvent(events('mouseout', {}))
    }

    rhs.unshift(el)

    for(var i = rhs.length - 1; i > common - 1; --i) {
      if(rhs[i]) {
        rhs[i].dispatchEvent(events('mouseover', {}))
      }
    }

    last = el
  }

  function onpipe(stream) {
    var initial = stream.initial || {x: 0, y: 0}
    position(x = initial.x, y = initial.y)
  }

  function write(movement) {
    x += movement.dx
    y += movement.dy

    if(constrain) {
      constraints()
    }

    position(x, y)

    if(dohover) {
      hover()
    }
  }

  function end() {
    // do nothing
    window.removeEventListener('resize', resize)
    stream.queue(null)
  }

  function onresize() {
    w = window.innerWidth
    h = window.innerHeight
  }

  function constraints() {
    x = x > w ? w : x < 1 ? 0 : x
    y = y > h ? h : y < 1 ? 0 : y
  }

  function position() {
    el.style[property] = 'translate('+(x+10)+'px, '+(y+10)+'px)'
  }
}

function create() {
  var el = document.createElement('div')
  el.id = 'pointer-cursor'
  el.style.position = 'absolute'
  el.style.left = 
  el.style.top = '-10px'

  el.style[property] = 'translate(0px, 0px)'
  el.style.zIndex = 10000
  document.body.appendChild(el)
  return el
}

function determine_property() {
  var el = document.createElement('div')
    , props

  props = [
    'webkitTransform'
  , 'mozTransform'
  , 'msTransform'
  , 'oTransform'
  , 'transform'
  ]

  for(var i = 0, len = props.length; i < len; ++i) {
    if(props[i] in el.style) {
      return props[i]
    }
  }
  
  return props[i - 1]
}
