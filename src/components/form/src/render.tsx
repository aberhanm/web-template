import {extend} from '@/utils/tools/lib';
import {typeOf as typeFn} from '@/utils/tools/type';
import Vue, {CreateElement} from 'vue';
import RULE from './rule';
import { getStorage } from '@/utils/tools/store';

import {
  FormItemInput,
  FormItemTextarea,
  FormItemSelect,
  FormItemDate,
  FormItemDatetime,
  FormItemTime,
  FormItemSwitch,
  FormItemDaterange,
  FormItem,
  FormItemNormal,
  FormItemTree,
  FormItemDateLong,
} from './form.interface';

const attrGeter = {
  input(item: FormItemInput) {
    return extend(true, {
      attrs: {
        placeholder: `请输入${item.label || ''}`,
        clearable: true,
      },
    }, item.dataObject);
  },
  textarea(item: FormItemTextarea) {
    return extend(true, {
      attrs: {
        placeholder: `请输入${item.label || ''}`,
        clearable: true,
        type: 'textarea',
      },
    }, item.dataObject);
  },
  select(item: FormItemSelect) {
    return extend(true, {
      attrs: {
        placeholder: `请选择${item.label || ''}`,
        clearable: true,
        style: 'width: 100%',
      },
    }, item.dataObject);
  },
  date(item: FormItemDate | FormItemDateLong) {
    const serverTime = getStorage('serverTime');
    const rules = item.rules || [];
    const attrs: any = {
      placeholder: `请选择${item.label || ''}`,
      clearable: true,
      type: 'date',
      style: 'width: 100%',
      valueFormat: 'yyyy-MM-dd',
    };

    if (rules.indexOf('dateBefore') > -1) {
      attrs.pickerOptions = {
        disabledDate(time: any) {
          return time.getTime() > new Date(serverTime || null);
        },
      };
    }

    return extend(true, {
      attrs,
    }, item.dataObject);
  },
  datetime(item: FormItemDatetime) {
    return extend(true, {
      attrs: {
        placeholder: `请选择${item.label || ''}`,
        clearable: true,
        type: 'datetime',
        style: 'width: 100%',
        valueFormat: 'yyyy-MM-dd HH:mm:ss',
      },
    }, item.dataObject);
  },
  time(item: FormItemTime) {
    return extend(true, {
      attrs: {
        placeholder: `请选择${item.label || ''}`,
        clearable: true,
        style: 'width: 100%',
        valueFormat: 'HH:mm:ss',
      },
    }, item.dataObject);
  },
  switch(item: FormItemSwitch) {
    return extend(true, {
      attrs: {
        activeText: '是',
        inactiveText: '否',
      },
    }, item.dataObject);
  },
  tree(item: FormItemTree) {
    return extend(true, {
      attrs: {
        placeholder: `请选择${item.label || ''}`,
        clearable: true,
      },
    }, item.dataObject);
  },
};

const eventHandler = {
  handleDaterangeChange(val: string, item: FormItemDaterange, model: any, type: string) {
    if (val) {
      if (type === 'start') {
        model[item.props[0]] = val + ' 00:00:00';
      }
      if (type === 'end') {
        model[item.props[1]] = val + ' 23:59:59';
      }
    }
  },
};

function getPathObj(model: any, prop: string) {
  const pList: string[] = prop.split('.');
  const last: string = pList.pop() || '';

  let obj = model;
  pList.forEach((p: string) => {
    if (typeFn(obj[p]) === 'object' || typeFn(obj[p]) === 'array') {
      obj = obj[p];
    } else if (typeFn(obj[+p]) === 'array') {
      obj = obj[p];
    } else {
      console.error(`${p}属性未定义`);
    }
  });

  return {
    obj,
    key: last,
  };
}

export function renderItem(this: any, h: CreateElement, item: FormItem): any {
  if (item.type === 'title') {
    return (
      item.renderFn ? item.renderFn.call(this._renderProxy, h) :
      <div class='claim-form-title' key={item.key}>{item.label}</div>
    );
  } else if (item.type === 'custom') {
    return (
      <div class='claim-form-item' style={{width: item.width || this.colWidth}} key={item.key}>
        {
          item.renderFn ? item.renderFn.call(this._renderProxy, h) : <el-form-item
            label={item.label}>
            {item.valueFn ? item.valueFn() : item.value}
          </el-form-item>
        }
      </div>
    );
  } else if (item.type === 'listFn') {
    return item.listFn(h).map((cItem) => renderItem.call(this, h, cItem));
  } else {
    return (
      <div class='claim-form-item' style={{width: item.width || this.colWidth}} key={item.key || item.prop}>
        <el-form-item
          label={item.label}
          prop={item.prop}
          rules={RULE.getRules(item, this.model)}
          labelWidth={item.labelWidth}>
          {
            renderFormItem.call(this._renderProxy, h, item, this.model)
          }
        </el-form-item>
      </div>
    );
  }
}

export function renderFormItem(this: any, h: CreateElement, item: FormItemNormal, model: any) {
  const {obj, key} = getPathObj(model, item.prop);

  const getDisabled = () => {
    return this.showOnly || (item.disabledFn ? item.disabledFn() : false);
  };

  switch (item.type) {
    case 'input':
      const inputInner = (item.appendFn && item.appendFn.call(this, h)) ? <span slot='append'>{item.appendFn.call(this, h)}</span> : '';
      if (item.noTrim) {
        return (
          <el-input
            { ...attrGeter.input(item) }
            disabled={getDisabled()}
            v-model={obj[key]}>
            {inputInner}
          </el-input>
        );
      } else {
        return (
          <el-input
            { ...attrGeter.input(item) }
            disabled={getDisabled()}
            v-model_trim={obj[key]}>
            {inputInner}
          </el-input>
        );
      }
    case 'textarea':
      return (
        <el-input
          { ...attrGeter.textarea(item )}
          disabled={getDisabled()}
          v-model={obj[key]}>
        </el-input>
      );
    case 'select':
      let options: any[] = [];
      options = item.optionsFn();
      return (
        <el-select
          { ...attrGeter.select(item) }
          disabled={getDisabled()}
          v-model={obj[key]}>
          {
            options.map((opt: any) => {
              return (
                <el-option label={opt.label} value={opt.value} disabled={opt.disabled} key={opt.value}></el-option>
              );
            })
          }
        </el-select>
      );
    case 'radio':
      let radios: any[] = [
        {
          label: '是',
          value: 'Y',
        }, {
          label: '否',
          value: 'N',
        },
      ];
      if (item.radiosFn) {
        radios = item.radiosFn();
      }
      return (
        <el-radio-group
          { ...item.dataObject }
          v-model={obj[key]}
          disabled={getDisabled()}>
          {
            radios.map((opt: any) => {
              return (
                <el-radio label={opt.value} disabled={opt.disabled} key={opt.value}>{opt.label}</el-radio>
              );
            })
          }
        </el-radio-group>
      );
    case 'checkbox':
      let checkboxes: any[] = [];
      if (item.checkboxesFn) {
        checkboxes = item.checkboxesFn();
      }

      if (item.checkAll) {
        return (
          <claim-select-all v-model={obj[key]} disabled={getDisabled()} checkList={checkboxes}></claim-select-all>
        );
      } else if (item.checkOnly) {
        return (
          <el-checkbox true-label='Y' false-label='N' v-model={obj[key]} disabled={getDisabled()}></el-checkbox>
        );
      } else {
        return (
          <el-checkbox-group
            { ...item.dataObject }
            v-model={obj[key]}
            disabled={getDisabled()}>
            {
              checkboxes.map((opt: any) => {
                return (
                  <el-checkbox label={opt.value} key={opt.value}>{opt.label}</el-checkbox>
                );
              })
            }
          </el-checkbox-group>
        );
      }
    case 'dateLong':
      const {obj: fOBJ, key: fKey} = getPathObj(model, item.foreverKey);
      return (
        <div class='claim-form-dateforever'>
          <el-date-picker
            { ...attrGeter.date(item) }
            disabled={getDisabled() || fOBJ[fKey] === 'Y'}
            v-model={obj[key]}>
          </el-date-picker>
          <el-checkbox true-label='Y' false-label='N' disabled={getDisabled()} v-model={fOBJ[fKey]} on-change={
            (val: boolean) => {
              if (val) {
                Vue.set(obj, key, '9999-12-31');
              } else {
                Vue.set(obj, key, '');
              }
            }
          }>长期</el-checkbox>
        </div>
      );
    case 'date':
      return (
        <el-date-picker
          { ...attrGeter.date(item) }
          disabled={getDisabled()}
          v-model={obj[key]}>
        </el-date-picker>
      );
    case 'datetime':
      return (
        <el-date-picker
          { ...attrGeter.datetime(item) }
          disabled={getDisabled()}
          v-model={obj[key]}>
        </el-date-picker>
      );
    case 'time':
      return (
        <el-time-picker
          { ...attrGeter.time(item) }
          disabled={getDisabled()}
          v-model={obj[key]}>
        </el-time-picker>
      );
    case 'switch':
      return (
        <el-switch
          { ...attrGeter.switch(item) }
          disabled={getDisabled()}
          v-model={obj[key]}>
        </el-switch>
      );
    case 'daterange':
      const dResult0 = getPathObj(model, item.props[0]);
      const dResult1 = getPathObj(model, item.props[1]);
      return (
        <div class='claim-form-daterange'>
          <el-date-picker
            disabled={getDisabled()}
            clearable
            type='date'
            valueFormat='yyyy-MM-dd'
            placeholder='请选择开始日期'
            on-change={(val: string) => {eventHandler.handleDaterangeChange(val, item, model, 'start'); }}
            v-model={dResult0.obj[dResult0.key]}>
          </el-date-picker>
          <span>&ensp;-&ensp;</span>
          <el-date-picker
            disabled={getDisabled()}
            clearable
            type='date'
            valueFormat='yyyy-MM-dd'
            placeholder='请选择结束日期'
            on-change={(val: string) => {eventHandler.handleDaterangeChange(val, item, model, 'end'); }}
            v-model={dResult1.obj[dResult1.key]}>
          </el-date-picker>
        </div>
      );
    case 'tree':
      return (
        <claim-selectTree
          { ...attrGeter.tree(item) }
          multiple={item.multiple}
          disabled={getDisabled()}
          filterable={item.filterable}
          treeData={item.treeDataFn()}
          v-model={obj[key]}>
        </claim-selectTree>
      );
    case 'cascader':
      return (
        <claim-cascader
          { ...item.dataObject }
          list={item.listFn()}
          disabled={getDisabled()}
          v-model={obj[key]}>
        </claim-cascader>
      );
    default:
      return <span>无此类型</span>;
  }
}
