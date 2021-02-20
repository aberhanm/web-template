/**
 * @description 这里用于补充直接写对象无法调起ts类型关联的功能
 */
import {ColumnProps, ColumnPropsWithoutProp} from '$types/element';
import {FormItem} from '@/components/form/src/form.interface';

/**
 * @name tableColumns
 * @description 用于传入columns的props约束
 */
const tableColumns = function(options: any) {
  return options;
};

type ExtendType = '$null$'; // 这里定义几个用于填充props以说明对应功能的prop值
type CombinedType<PType, EType> =  PType | EType;

interface ExtendProp<PropType> extends ColumnPropsWithoutProp {
  prop?: CombinedType<PropType, ExtendType>;
}
interface ExtendExtraProp<PropType, ExtraType> extends ColumnPropsWithoutProp {
  prop?: CombinedType<PropType, ExtraType>;
}

/**
 * @name formItems
 * @description 用于form的items的约束
 */
const formItems = function(items: FormItem[]) {
  return items;
};

// 输出实例
const creator = {
  tableColumns,
  formItems,
};

export interface Creator {
  /**
   * @name tableColumns
   * @description 用于传入columns的props约束
   * @param ITEMSTYPE prop属性的可能值
   * @param EXTRATYPE 额外的prop可能值
   */
  tableColumns<ITEMSTYPE>(options: (ExtendProp<ITEMSTYPE>)[]): ColumnProps[];
  tableColumns<ITEMSTYPE, EXTRATYPE>(options: (ExtendExtraProp<ITEMSTYPE, EXTRATYPE>)[]): ColumnProps[];
  tableColumns(options: ColumnProps[]): ColumnProps[];
  /**
   * @name formItems
   * @description 用于form的items的约束
   * @description 这里 '$null$'用于 某些字段后台api还没有声明之前占位使用
   */
  formItems<PROPTYPE>(items: FormItem<CombinedType<PROPTYPE, ExtendType>>[]): FormItem<CombinedType<PROPTYPE, ExtendType>>[];
  formItems<PROPTYPE>(items: Array<FormItem<PROPTYPE>[]>): Array<FormItem<PROPTYPE>[]>;
  formItems(items: FormItem[]): FormItem[];
}

export default creator as Creator;
