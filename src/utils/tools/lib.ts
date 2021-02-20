import {isPlainObject, typeOf} from './type';
import {TreeData} from '@/components/selectTree/src/selectTree.interface';

interface anyProp {
  [prop: string]: any;
}

function extendTS0<T, U>(type: boolean, first: U, second: T): T & U;
function extendTS0<T, U, X>(type: boolean, first: U, second: T, third: X): X & T & U;
function extendTS0(...args: any[]): any {
  return extend(...args);
}

export const extendTS = extendTS0;

export const extend = function(this: any, ...args: any[]): any {
  let options;
  let name;
  let src;
  let copy;
  let copyIsArray;
  let clone;
  let target = arguments[0] || {};
  let i = 1;
  const length = arguments.length;
  let deep = false;

  // Handle a deep copy situation
  if (typeof target === 'boolean') {
    deep = target;

    // Skip the boolean and the target
    target = arguments[i] || {};
    i++;
  }

  // Handle case when target is a string or something (possible in deep copy)
  if (typeof target !== 'object' && typeof target !== 'function') {
    target = {};
  }

  // Extend jQuery itself if only one argument is passed
  if (i === length) {
    target = this;
    i--;
  }

  for (; i < length; i++) {
    // Only deal with non-null/undefined values
    options = arguments[i];
    if (options !== null) {
      // Extend the base object
      for (name in options) {
        if (options[name] !== undefined) {
          src = target[name];
          copy = options[name];

          // Prevent never-ending loop
          if (target === copy) {
            continue;
          }

          // Recurse if we're merging plain objects or arrays
          copyIsArray = Array.isArray(copy);
          if (deep && copy && (isPlainObject(copy) || copyIsArray)) {
            if (copyIsArray) {
              copyIsArray = false;
              clone = src && Array.isArray(src) ? src : [];
            } else {
              clone = src && isPlainObject(src) ? src : {};
            }

            // Never move original objects, clone them
            target[ name ] = extend(deep, clone, copy);

          // Don't bring in undefined values
          } else if (copy !== undefined) {
            target[ name ] = copy;
          }
        }
      }
    }
  }
  // Return the modified object
  return target;
};

export const getSerializeValue = function(input: any) {
  const outStr: any[] = [];

  const addPath = (obj: any, path: string) => {
    const ObjType = typeOf(obj);

    if (ObjType === 'array') {
      obj.forEach((item: any) => {
        addPath(item, path);
      });
    } else if (ObjType === 'object') {
      const Keys = Object.keys(obj);
      Keys.forEach((item) => {
        const cPath = path ? `${path}.${item}` : item;
        addPath(obj[item], cPath);
      });
    } else {
      if (obj && obj.trim) { obj = obj.trim(); }
      if (obj !== '' && obj !== undefined) {
        outStr.push(`${path}=${encodeURIComponent(obj)}`);
      }
    }
  };

  addPath(input, '');

  return outStr.join('&');
};

export function transFormdata(data: any) {
  const fmd = new FormData();
  for (const key in data) {
    if (data[key] !== undefined) {
      fmd.append(key, data[key]);
    }
  }

  return fmd;
}

export const getPathValue = function(obj: any, path: string): any {
  let tempObj = obj;
  let i = 0;

  const keyArr = path.split('.');

  for (const len = keyArr.length; i < len - 1; i++) {
    const key = keyArr[i];

    if (key in tempObj) {
      tempObj = tempObj[key];
    } else {
      // console.error(`the prop path:${path} is not correct!`)
      break;
    }
  }

  return {
    o: tempObj,
    v: tempObj[keyArr[i]],
    k: keyArr[i],
  };
};

export const setPathValue = function(obj: any, path: string, value: any): any {
  const keyArr = path.split('.');
  const length = keyArr.length;
  let tempObj = obj;

  for (let i = 0; i < length; i++) {
    const key = keyArr[i];

    if (i === length - 1) {
      tempObj[key] = value;
    } else if (obj.hasOwnProperty(key)) {
      tempObj = obj[key];
    } else {
      obj[key] = {};
      tempObj = obj[key];
    }
  }
};

export const querySerialize = (params: any) => {
  const arr = [];
  let value = null;
  for (const key in params) {
    if (params[key]) {
      value = params[key];
      if (value !== 0 && !value) { continue; }
      arr.push(key + '=' + encodeURIComponent((typeof value === 'object' ? JSON.stringify(value) : value)));
    }
  }
  return arr.length ? '?' + arr.join('&') : '';
};

export const transList2TreeData = (list: any[]): TreeData[] => {
  const listMap: any = {};
  const ROOTLIST: TreeData[] = [];

  list.forEach((item) => {
    if (item.parent === item.value || !item.parent || +item.level === 1) {
      ROOTLIST.push(item);
    } else if (listMap[item.parent]) {
      listMap[item.parent].push(item);
    } else {
      listMap[item.parent] = [item];
    }
  });

  function insertChildren(inList: any[]) {
    inList.forEach((item) => {
      item.children = listMap[item.value] || [];
      insertChildren(item.children);
    });
  }

  insertChildren(ROOTLIST);
  return ROOTLIST;
};

export const getScrollWidth = function(): number {
  let wrapWidth = 0;
  let innerWidth = 0;

  const wrap = document.createElement('div');
  wrap.style.cssText = 'position: absolute;top:-1000px;width:100px;height:100px;overflow:hidden;';
  document.body.appendChild(wrap);

  wrapWidth = wrap.offsetWidth;

  wrap.style.overflow = 'scroll';

  const inner = document.createElement('div');
  inner.style.width = '100%';
  wrap.appendChild(inner);

  innerWidth = inner.offsetWidth;
  document.body.removeChild(wrap);

  return wrapWidth - innerWidth;
};
