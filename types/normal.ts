/**
 * @description 这里保存全局通用的结构
 * @param MapInter 枚举值的常用结构
 */

export interface MapInter {
  value: string | number;
  label: string;
  parent?: string;
  [prop: string]: any;
}
