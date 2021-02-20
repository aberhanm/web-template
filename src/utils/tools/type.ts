const class2type = (() => {
  const classTotype: any = {};
  'Boolean Number String Function Array Date RegExp Object Error Symbol'.split(' ').forEach((name) => {
    classTotype[ '[object ' + name + ']' ] = name.toLowerCase();
  });
  return classTotype;
})();

const hasOwn = class2type.hasOwnProperty;

export const typeOf = (obj: any) => {
  if (obj === null || obj === undefined) {
    return obj + '';
  }
  return typeof obj === 'object' || typeof obj === 'function' ?
          class2type[ Object.prototype.toString.call(obj) ] || 'object' :
          typeof obj;
};

/**
 * @description 把string转Date
 */
export const getStringDate = (str: string) => {
  const strList = str.split(/[^\d]/).map((item) => +item) as [number, number];
  strList[1] = strList[1] - 1;
  return new Date(...strList);
};

export const dateFormatter = (date: any, format = 'YYYY-MM-dd HH:mm:ss') => {
  if (date === '' || date === undefined || date === null) {
    return '';
  } else if (typeOf(date) !== 'date') {
    return date;
  } else {
    const DATEMap: any = {
      // 月(0-11,0代表1月)
      'M+': date.getMonth() + 1,
      // 日(1-31)
      'd+': date.getDate(),
      // 小时(0-12)
      'h+': date.getHours() % 12 || 12,
      // 小时(0-23)
      'H+': date.getHours(),
      // 分(0-59)
      'm+': date.getMinutes(),
      // 秒(0-59)
      's+': date.getSeconds(),
      // 毫秒(0-999)
      'S': date.getMilliseconds(),
      // 季度(1-4)
      'q+': Math.floor((date.getMonth() + 3) / 3),
    };

    // 0-6, 0代表星期天
    const week = ['日', '一', '二', '三', '四', '五', '六'];
    // 年
    format = format.replace(/Y+/, (match) => (date.getFullYear() + '').substring(4 - match.length));
    // 星期
    format = format.replace(/E+/, (match) => {
      return (match.length > 1 ? (match.length > 2 ? '星期' : '周') : '') + week[date.getDay()];
    });

    let key;
    let value: any;
    for (key in DATEMap) {
      if  (DATEMap[key]) {
        value = DATEMap[key];
        format = format.replace(new RegExp(key),
                            (match) => match.length === 1 ? value : ('00' + value).substring((value + '').length));
      }
    }
    return format;
  }
};

export const batchDateFormatter = function(obj: any, format?: string) {
  const keys = Object.keys(obj);
  keys.forEach((key) => {
    const item = obj[key];
    if (typeOf(item) === 'date') {
      obj[key] = dateFormatter(obj[key], format);
    }
  });
};

export function isUndef(v: any): boolean {
  return v === undefined || v === null;
}

export function isDef(v: any): boolean {
  return v !== undefined && v !== null;
}

export function isTrue(v: any): boolean {
  return v === true;
}

export function isFalse(v: any): boolean {
  return v === false;
}

export function isPrimitive(value: any): boolean {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  );
}

export function isObject(obj: any): boolean {
  return obj !== null && typeof obj === 'object';
}

const ToString = Object.prototype.toString;

export function toRawType(value: any): string {
  return ToString.call(value).slice(8, -1);
}

export function isPlainObject(obj: any): boolean {
  return ToString.call(obj) === '[object Object]';
}

export function isRegExp(v: any): boolean {
  return ToString.call(v) === '[object RegExp]';
}

export function isValidArrayIndex(val: any): boolean {
  const n = parseFloat(String(val));
  return n >= 0 && Math.floor(n) === n && isFinite(val);
}

export function isPromise(val: any): boolean {
  return (
    isDef(val) &&
    typeof val.then === 'function' &&
    typeof val.catch === 'function'
  );
}
