/**
* Detect Element Resize
*
* https://github.com/sdecima/javascript-detect-element-resize
* Sebastian Decima
*
* version: 0.5.3
**/
const requestFrame = (function () {
  var raf = window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    function (fn) { return window.setTimeout(fn, 20) }
  return function (fn) { return raf(fn) }
})()

const cancelFrame = (function () {
  var cancel = window.cancelAnimationFrame ||
    window.mozCancelAnimationFrame ||
    window.webkitCancelAnimationFrame || window.clearTimeout
  return function (id) { return cancel(id) }
})()

const resetTriggers = function (element) {
  const triggers = element.__resizeTriggers__
  const expand = triggers.firstElementChild
  const contract = triggers.lastElementChild
  const expandChild = expand.firstElementChild

  contract.scrollLeft = contract.scrollWidth
  contract.scrollTop = contract.scrollHeight
  expandChild.style.width = expand.offsetWidth + 1 + 'px'
  expandChild.style.height = expand.offsetHeight + 1 + 'px'
  expand.scrollLeft = expand.scrollWidth
  expand.scrollTop = expand.scrollHeight
}

const checkTriggers = function (element) {
  return element.offsetWidth !== element.__resizeLast__.width || element.offsetHeight !== element.__resizeLast__.height
}

const scrollListener = function (e) {
  const element = this
  resetTriggers(this)
  if (this.__resizeRAF__) {
    cancelFrame(this.__resizeRAF__)
  }
  this.__resizeRAF__ = requestFrame(function () {
    if (checkTriggers(element)) {
      element.__resizeLast__.width = element.offsetWidth
      element.__resizeLast__.height = element.offsetHeight
      element.__resizeListeners__.forEach(function (fn) {
        fn.call(element, e)
      })
    }
  })
}

const domPrefixes = 'Webkit Moz O ms'.split(' ')
const startEvents = 'webkitAnimationStart animationstart oAnimationStart MSAnimationStart'.split(' ')
const animationName = 'resizeanim'

let attachEvent = document.attachEvent
let animation = false
let keyframeprefix = ''
let animationstartevent = 'animationstart'
let pfx = ''

if (!attachEvent) {
  /* Detect CSS Animations support to detect element display/re-attach */
  const elm = document.createElement('fakeelement')

  if (elm.style.animationName !== undefined) { animation = true }

  if (animation === false) {
    for (var i = 0; i < domPrefixes.length; i++) {
      if (elm.style[ domPrefixes[i] + 'AnimationName' ] !== undefined) {
        pfx = domPrefixes[ i ]
        keyframeprefix = '-' + pfx.toLowerCase() + '-'
        animationstartevent = startEvents[ i ]
        animation = true
        break
      }
    }
  }
}

let stylesCreated = false

const createStyles = function () {
  if (!stylesCreated) {
    const animationKeyframes = '@' + keyframeprefix + 'keyframes ' + animationName + ' { from { opacity: 0; } to { opacity: 0; } } ';
    const animationStyle = keyframeprefix + 'animation: 1ms ' + animationName + '; '
    // opacity:0 works around a chrome bug https://code.google.com/p/chromium/issues/detail?id=286360
    const css = animationKeyframes +
      '.resize-triggers { ' + animationStyle + 'visibility: hidden; opacity: 0; } ' +
      '.resize-triggers, .resize-triggers > div, .contract-trigger:before { content: " "; display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; } .resize-triggers > div { background: #eee; overflow: auto; } .contract-trigger:before { width: 200%; height: 200%; }'

    const head = document.head || document.getElementsByTagName('head')[0]
    const style = document.createElement('style')

    style.type = 'text/css'
    if (style.styleSheet) {
      style.styleSheet.cssText = css
    } else {
      style.appendChild(document.createTextNode(css))
    }

    head.appendChild(style)
    stylesCreated = true
  }
};

export const onResize = (function () {
  if (attachEvent) {
    return function (elem, fn) {
      elem.attachEvent('onresize', fn)
    }
  } else {
    return function (elem, fn) {
      if (!elem.__resizeTriggers__) {
        if (getComputedStyle(elem).position === 'static') {
          elem.style.position = 'relative'
        }

        createStyles()
        elem.__resizeLast__ = {}
        elem.__resizeListeners__ = []

        const resizeEl = elem.__resizeTriggers__ = document.createElement('div')
        resizeEl.className = 'resize-triggers'
        resizeEl.innerHTML = '<div class="expand-trigger"><div></div></div><div class="contract-trigger"></div>'
        elem.appendChild(resizeEl)

        resetTriggers(elem)
        elem.addEventListener('scroll', scrollListener, true)

        /* Listen for a css animation to detect element display/re-attach */
        if (animationstartevent) {
          resizeEl.addEventListener(animationstartevent, function (e) {
            if (e.animationName === animationName) {
              resetTriggers(elem)
            }
          })
        }
      }

      elem.__resizeListeners__.push(fn)
    }
  }
})();

export const offResize = (function () {
  if (attachEvent) {
    return function (elem, fn) {
      elem.detachEvent('onresize', fn)
    }
  } else {
    return function (elem, fn) {
      elem.__resizeListeners__.splice(elem.__resizeListeners__.indexOf(fn), 1)

      if (!elem.__resizeListeners__.length) {
        elem.removeEventListener('scroll', scrollListener)
        elem.__resizeTriggers__ = !elem.removeChild(elem.__resizeTriggers__)
      }
    }
  }
})();
