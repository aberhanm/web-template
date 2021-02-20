/**
 * @description 补充element-ui的部分props的传参
 */
import {VNode} from 'vue';

export interface ColumnPropsWithoutProp {
  type?: 'selection' | 'index' | 'expand';
  index?: number | ((index?: number) => void);
  columnKey?: string;
  label?: string;
  width?: string;
  minWidth?: string;
  fixed?: string | boolean;
  renderHeader?: (h: any, data?: any) => VNode | string;
  sortable?: boolean | string;
  sortMethod?: (a?: any, b?: any) => void;
  sortBy?: string | any[] | ((row?: any, index?: number) => void);
  sortOrders?: any[];
  resizable?: boolean;
  formatter?: (row?: any, column?: any, cellValue?: any, index?: number) => VNode | string;
  showOverflowTooltip?: boolean;
  align?: string;
  headerAlign?: string;
  className?: string;
  labelClassName?: string;
  selectable?: (row?: any, index?: number) => void;
  reserveSelection?: boolean;
  filters?: {text?: string, value?: any}[];
  filterPlacement?: string;
  filterMultiple?: boolean;
  filterMethod?: (value?: any, row?: any, column?: any) => void;
  filteredValue?: any[];
}

export interface ColumnProps extends ColumnPropsWithoutProp {
  prop?: string;
}
