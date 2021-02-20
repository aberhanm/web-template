/*
  ** 计算相关基础方法，看项目要用哪些再增加吧
*/

// 加减乘除去除浮点数bug
// 加
export const add = (a: number, b: number) => {
  let c;
  let d;
  let e;
  try {
    c = a.toString().split('.')[1].length;
  } catch (f) {
    c = 0;
  }
  try {
    d = b.toString().split('.')[1].length;
  } catch (f) {
    d = 0;
  }
  e = Math.pow(10, Math.max(c, d));
  return (multiple(a, e) + multiple(b, e)) / e;
};

// 减
export const minus = (a: number, b: number) => {
  let c;
  let d;
  let e;
  try {
    c = a.toString().split('.')[1].length;
  } catch (f) {
    c = 0;
  }
  try {
    d = b.toString().split('.')[1].length;
  } catch (f) {
    d = 0;
  }
  e = Math.pow(10, Math.max(c, d));
  return (multiple(a, e) - multiple(b, e)) / e;
};
// 乘
export const multiple = (a: number, b: number) => {
  let c = 0;
  const d = a.toString();
  const e = b.toString();
  let f;
  let g;
  try {
    f = d.split('.')[1].length;
  } catch (h) {
    f = 0;
  }
  try {
    g = e.split('.')[1].length;
  } catch (h) {
    g = 0;
  }
  c = f + g;
  return Number(d.replace('.', '')) * Number(e.replace('.', '')) / Math.pow(10, c);
};
// 除
export const division = (a: number, b: number) => {
  if (isNaN(a) || !a) {
    return a;
  }
  let c = 0;
  let d = 0;
  let e = 0;
  let f = 0;
  try {
    e = a.toString().split('.')[1].length;
  } catch (g) {
    e = 0;
  }
  try {
    f = b.toString().split('.')[1].length;
  } catch (g) {
    f = 0;
  }
  c = Number(a.toString().replace('.', ''));
  d = Number(b.toString().replace('.', ''));
  return multiple(c / d, Math.pow(10, f - e));
};
