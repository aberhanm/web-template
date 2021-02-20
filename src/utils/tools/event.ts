/*
  ** 事件类公共方法
*/
export const on = function(elem: HTMLElement | Document | Window, type: string, fn: any) {
  if (elem && type && fn) {
    elem.addEventListener(type, fn, false);
  }
};

export const off = function(elem: HTMLElement | Document | Window, type: string, fn: any) {
  if (elem && type && fn) {
    elem.removeEventListener(type, fn, false);
  }
};

export const debounce = function(callback: (...cbargs: any) => any, delay: number = 300, immediate: boolean = false) {
  let timeout: any = null;
  let result: any = null;
  return function(this: any, ...args: any[]) {
    const context = this;
    const later = function() {
      timeout = null;
      if (!immediate) { result = callback.apply(context, args); }
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, delay);
    if (callNow) { result = callback.apply(context, args); }
    return result;
  };
};

export const throttle = function(callback: (...cbargs: any) => any, delay: number) {
  let context: any = null;
  let args: any = null;
  let timeout: any = null;
  let result: any = null;
  let previous = Date.now();
  const later = function() {
    previous = +new Date();
    timeout = null;
    result = callback.apply(context, args);
  };
  return function(this: any) {
    const now = +new Date();
    const remaining = delay - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0) {
      clearTimeout(timeout);
      previous = now;
      result = callback.apply(context, args);
    } else if (!timeout) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
};
