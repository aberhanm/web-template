/*
  ** 存储类公共方法
  ** 包括cookies、sessionstorage、localstorage等方法
*/
export const setCookie = (name: string, value: any, expires = 0.5) => {
  const exp = new Date();
  exp.setTime(exp.getTime() + expires * 24 * 60 * 60 * 1000);
  document.cookie = name + '=' + escape(value) + ';expires=' + exp.toUTCString();
};

export const getCookie = (name: string) => {
  const reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
  const arr = document.cookie.match(reg);
  if (arr) {
    return unescape(arr[2]);
  } else {
    return null;
  }
};

export const delCookie = (name: string) => {
  const exp = new Date();
  exp.setTime(exp.getTime() - 1);
  const cval = getCookie(name);

  if (cval != null) {
    document.cookie = name + '=' + cval + ';expires=' + exp.toUTCString();
  }
};

/**
 * @description 加上namebase，防止同域名下的存储命名冲突
 */
const nameBase = 'yourself_product_name_';

export const setStorage = (name: string, value: any, type = 'session') => {
  name = nameBase + name;
  const storage = window[`${type}Storage`];
  if (!storage) { return false; }
  value = typeof value === 'object' ? JSON.stringify(value) : value;
  // 防止缓存爆满报错
  try {
    storage.setItem(name, value);
  } catch (e) {
    console.error(e);
  }
};

export const getStorage = (name: string, type = 'session') => {
  name = nameBase + name;
  const storage = window[`${type}Storage`];
  if (!storage) { return; }
  let data = storage.getItem(name) || '';

  try {
    data = JSON.parse(data);
  } catch (e) {}

  return data;
};

export const delStorage = (name: string, type = 'session') => {
  name = nameBase + name;
  const storage = window[`${type}Storage`];
  if (!storage) { return; }
  storage.removeItem(name);
};
