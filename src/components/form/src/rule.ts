/**
 * @description 验证相关
 */
import {typeOf, getStringDate} from '@/utils/tools/type';
import {reg, validation} from '@/utils/tools/validate';
import {FormItem, FormItemNormal} from './form.interface';
import {dateFormatter} from '@/utils/tools/type';
import { getStorage } from '@/utils/tools/store';

interface RULEMAP {
  required: any;
  daterange: any;
  dateBefore: any;
  dateAfter: any;
  string: any;
  integer: any;
  float: any;
  phone: any;
  mail: any;
  idNo: any;
  number: any;
  dateFailure: any;
  strFloat: any;
}

export type RuleType = keyof RULEMAP;

const RuleMap: RULEMAP = {
  required(item: FormItemNormal, model: any, param1: string, param2: string) {
    if (item.type === 'daterange') {
      return {
        validator(rule: any, value: string, callback: any) {
          const start = model[item.props[0]];
          const end = model[item.props[1]];
          if (!start || !end) {
            callback([new Error('请选择日期范围')]);
          }
        },
      };
    } else {
      return {required: true, message: `${item.label || '此项'}为必填项`};
    }
  },
  daterange(item: FormItem, model: any) {
    return {
      validator(rule: any, value: string, callback: any) {
        if (item.type !== 'daterange') {return false; }
        const start = model[item.props[0]];
        const end = model[item.props[1]];
        if (start && end) {
          const startValue = +getStringDate(start);
          const endValue = +getStringDate(end);
          if (endValue <= startValue) {
            callback([new Error('开始日期不得大于结束日期')]);
          }
        }
      },
    };
  },
  dateBefore(item: FormItem, model: any) {
    return {
      validator(rule: any, value: string, callback: any) {
        if (item.type !== 'date') {return false; }
        if (!value) {return false; }

        const valueNum = +getStringDate(value);
        const serverTime = getStorage('serverTime');
        const newDateNum = +getStringDate(dateFormatter(new Date(serverTime || null), 'YYYY-MM-dd') + ' 23:59:59');
        if (valueNum >= newDateNum) {
          callback([new Error(`${item.label}不能晚于当前时间`)]);
        }
      },
    };
  },
  dateAfter(item: FormItem, model: any) {
    return {
      validator(rule: any, value: string, callback: any) {
        if (item.type !== 'date') {return false; }
        if (!value) {return false; }

        const valueNum = +getStringDate(value);
        const serverTime = getStorage('serverTime');
        const newDateNum = +getStringDate(dateFormatter(new Date(serverTime || null), 'YYYY-MM-dd'));
        if (valueNum < newDateNum) {
          callback([new Error(`${item.label}不能早于当前时间`)]);
        }
      },
    };
  },
  dateFailure(item: FormItem, model: any) {
    return {
      validator(rule: any, value: string, callback: any) {
        if (item.type === 'listFn') {return false; }
        if (!value) {return false; }

        const valueNum = +getStringDate(value);
        const serverTime = getStorage('serverTime');
        const newDateNum = +new Date(serverTime || null);
        if (valueNum < newDateNum) {
          callback([new Error(`${item.label}已失效`)]);
        }
      },
    };
  },
  string(item: FormItem, model: any, min: string, max: string) {
    const rules = [];
    if (!isNaN(parseInt(min, 10))) {
      rules.push({min: +min, message: `不得少于${+min}个字符`});
    }
    if (!isNaN(parseInt(max, 10))) {
      rules.push({max: +max, message: `不得超过${+max}个字符`});
    }
    return rules;
  },
  integer(item: FormItem, model: any, min: string, max: string) {
    const rules = [];
    rules.push({pattern: /^\d+$/, message: '只能输入整数'});
    if (!isNaN(parseInt(min, 10))) {
      rules.push({min: +min, message: `不得少于${+min}位数`});
    }
    if (!isNaN(parseInt(max, 10))) {
      rules.push({max: +max, message: `不得超过${+max}位数`});
    }
    return rules;
  },
  number(item: FormItem, model: any, min: string, max: string) {
    const rules = [{pattern: /^\d*$/, message: '只能输入数字'}];
    return rules;
  },
  float(item: FormItem, model: any, dMax: string, dMin: string) {
    const rules = [];
    rules.push({pattern: /^\d+(\.\d+)?$/, message: '请输入数字'});
    if (!isNaN(parseInt(dMax, 10))) {
      rules.push({pattern: new RegExp(`^\\d+(\\.\\d{1,${+dMax}})?$`), message: `小数点后至多${+dMax}位数`});
    }
    if (!isNaN(parseInt(dMin, 10))) {
      rules.push({pattern: new RegExp(`^\\d+\\.\\d{${+dMin},}$`), message: `至少精确到小数点后${+dMin}位`});
    }
    return rules;
  },
  strFloat(item: FormItem, model: any, min: string, max: string, dMax: string, dMin: string) {
    return {
      validator(rule: any, value: string, callback: any) {
        if (!value) {
          return false;
        }
        if (isNaN(+value)) {
          return callback([new Error('请输入数字')]);
        }
        const UMin = parseFloat(min);
        const UMax = parseFloat(max);
        const UDMax = parseFloat(dMax);
        const UDMin = parseFloat(dMin);
        if (!isNaN(UMin) && +value < UMin) {
          return callback([new Error(`不得小于${UMin}`)]);
        }
        if (!isNaN(UMax) && +value > UMax) {
          return callback([new Error(`不得大于${UMax}`)]);
        }
        if (!isNaN(UDMax) && !new RegExp(`^\\d+(\\.\\d{1,${UDMax}})?$`).test(value)) {
          return callback([new Error(`小数点后至多${UDMax}位`)]);
        }
        if (!isNaN(UDMin) && !new RegExp(`^\\d+\\.\\d{${UDMin},}$`).test(value)) {
          return callback([new Error(`至少精确到小数点后${UDMin}位`)]);
        }
      },
    };
  },
  phone() {
    return {pattern: reg.phone, trigger: 'blur', message: '手机号码格式错误'};
  },
  mail() {
    return {pattern: reg.email, trigger: 'blur', message: '邮件格式错误'};
  },
  idNo() {
    return {
      trigger: 'blur',
      validator(rule: any, value: string, callback: any) {
        const checkResult = validation.idNo(value);
        if (!checkResult.flag) {
          callback([new Error(checkResult.msg)]);
        }
      },
    };
  },
};

export default {
  getRules(item: FormItemNormal, model: any) {
    const rules = item.rules || [];
    let newRules: any[] = [];
    // validator只认一个，多个分开写的话后面得合并
    let validatorList: any[] = [];
    rules.forEach((rule: any | string) => {
      if (typeof rule === 'string') {
        const ruleName = rule.replace(/\(.*\)/, '') as RuleType;
        const paramsMatch = rule.match(/\((.*)\)/);
        let params: any[] = [];


        if (paramsMatch) {
          params = paramsMatch[1].split(',');
        }

        if (RuleMap[ruleName]) {
          const mapRule = RuleMap[ruleName](item, model, ...params);
          if (typeOf(mapRule) === 'array') {
            newRules = newRules.concat(mapRule.filter((mRule: any) => !mRule.validator));
            validatorList = validatorList.concat(mapRule.filter((mRule: any) => !!mRule.validator));
          } else {
            if (mapRule.validator) {
              validatorList.push(mapRule);
            } else {
              newRules.push(mapRule);
            }
          }
        }
      } else {
        if (rule.validator) {
          validatorList.push(rule);
        } else {
          newRules.push(rule);
        }
      }
    });


    if (validatorList.length) {
      const validateFinal = {
        validator(rule: any, value: string, callback: any) {
          validatorList.forEach((valid: any) => {
            valid.validator(rule, value, callback);
          });
          callback();
        },
      };
      newRules.push(validateFinal);
    }

    return newRules.length ? newRules : [];
  },
};
