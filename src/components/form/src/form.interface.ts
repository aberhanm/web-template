import {VNode, CreateElement} from 'vue';
import {MapInter} from '$types/normal';
import {TreeData} from '@/components/selectTree/src/selectTree.interface';
import {RuleType} from './rule';

export type FormItemType = 'title' | 'input' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date' | 'datetime' | 'time'
                            | 'switch' | 'daterange' | 'custom' | 'listFn' | 'tree' | 'dateLong' | 'cascader';

interface DATAOBJ {
  class?: {
    [props: string]: boolean;
  };
  style?: {
    [props: string]: string;
  };
  attrs?: {
    [props: string]: any;
  };
  props?: {
    [props: string]: any;
  };
  domProps?: {
    [props: string]: string;
  };
  on?: {
    [props: string]: any;
  };
  nativeOn?: {
    [props: string]: any;
  };
  directives?: {
    [props: string]: any;
  };
  scopedSlots?: {
    [props: string]: any;
  };
  key?: {
    [props: string]: any;
  };
}


export interface FormItemBase<PROPTYPE = string> {
  type: FormItemType;
  prop: PROPTYPE;
  label?: string;
  width?: string;
  labelWidth?: string | number;
  rules?: RuleType[] | any[];
  key?: string | number;
  renderFn?(h: CreateElement): VNode | VNode[] | string;
  disabledFn?(): boolean;
}

export interface FormItemTitle {
  type: 'title';
  label?: string;
  key: string | number;
  renderFn?(h: CreateElement): VNode | VNode[] | string;
}
export interface FormItemListFn {
  type: 'listFn';
  key?: string | number;
  listFn(h?: CreateElement): FormItem[];
}
export interface FormItemCustom extends Pick<FormItemBase, 'type' | 'label' | 'width' | 'labelWidth' | 'key' | 'renderFn'> {
  type: 'custom';
  value?: any;
  valueFn?: () => any;
}

export interface FormItemInput<PROPTYPE = string> extends FormItemBase<PROPTYPE> {
  type: 'input';
  dataObject?: DATAOBJ;
  noTrim?: boolean;
  appendFn?(h: CreateElement): VNode | VNode[] | string;
}
export interface FormItemCascader<PROPTYPE = string> extends FormItemBase<PROPTYPE> {
  type: 'cascader';
  listFn: () => MapInter[];
  dataObject?: DATAOBJ;
}
export interface FormItemTree<PROPTYPE = string> extends FormItemBase<PROPTYPE> {
  type: 'tree';
  multiple?: boolean;
  treeDataFn: () => TreeData[];
  dataObject?: DATAOBJ;
  filterable?: boolean;
}
export interface FormItemTextarea<PROPTYPE = string> extends FormItemBase<PROPTYPE> {
  type: 'textarea';
  dataObject?: DATAOBJ;
}
/**
 * @param {Function} optionsFn 这里用函数返回，是因直接使用数组无法响应变化，下面的radiosFn、checkboxesFn同理
 */
export interface FormItemSelect<PROPTYPE = string> extends FormItemBase<PROPTYPE> {
  type: 'select';
  dataObject?: DATAOBJ;
  optionsFn: () => MapInter[];
}
export interface FormItemRadio<PROPTYPE = string> extends FormItemBase<PROPTYPE> {
  type: 'radio';
  radiosFn?: () => MapInter[];
  dataObject?: DATAOBJ;
}
export interface FormItemCheckbox<PROPTYPE = string> extends FormItemBase<PROPTYPE> {
  type: 'checkbox';
  checkboxesFn?: () => MapInter[];
  indeterminate?: boolean;
  checkAll?: boolean;
  checkOnly?: boolean;
  dataObject?: DATAOBJ;
}
export interface FormItemDate<PROPTYPE = string> extends FormItemBase<PROPTYPE> {
  type: 'date';
  dataObject?: DATAOBJ;
}
export interface FormItemDateLong<PROPTYPE = string> extends FormItemBase<PROPTYPE> {
  type: 'dateLong';
  dataObject?: DATAOBJ;
  foreverKey: PROPTYPE;
}
export interface FormItemDatetime<PROPTYPE = string> extends FormItemBase<PROPTYPE> {
  type: 'datetime';
  dataObject?: DATAOBJ;
}
export interface FormItemTime<PROPTYPE = string> extends FormItemBase<PROPTYPE> {
  type: 'time';
  dataObject?: DATAOBJ;
}
export interface FormItemSwitch<PROPTYPE = string> extends FormItemBase<PROPTYPE> {
  type: 'switch';
  dataObject?: DATAOBJ;
}
export interface FormItemDaterange<PROPTYPE = string> extends FormItemBase<PROPTYPE> {
  type: 'daterange';
  props: [string, string];
}

export type FormItem<PROPTYPE= string> = FormItemTitle | FormItemCustom | FormItemListFn | FormItemNormal<PROPTYPE>;

export type FormItemNormal<PROPTYPE= string> = FormItemInput<PROPTYPE> | FormItemTextarea<PROPTYPE> | FormItemSelect<PROPTYPE>
| FormItemRadio<PROPTYPE> | FormItemCheckbox<PROPTYPE> | FormItemDate<PROPTYPE> | FormItemDaterange<PROPTYPE>
| FormItemDatetime<PROPTYPE> | FormItemTime<PROPTYPE> | FormItemSwitch<PROPTYPE>
| FormItemTree<PROPTYPE> | FormItemDateLong<PROPTYPE> | FormItemCascader<PROPTYPE>;

export interface Form extends Vue {
  validate(): boolean;
  clearValidate(): void;
}
