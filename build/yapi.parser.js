const https = require('https');
const fs = require('fs');
const path = require('path');
const Config = require('../config')

module.exports = function(apiId, isObj, isType, token) {
  const YapiPath = `https://ws-di1.sit.cmrh.com/api/interface/get?id=${apiId}&token=${Config.tokenMap[token]}`

  https.get(YapiPath, (res) => {
    let rawData = '';
    res.on('data', (chunk) => {rawData += chunk});
    res.on('end', () => {
      const element = JSON.parse(rawData).data;

      const method = element.method;
      const rsb = element.res_body;
      const prsb = JSON.parse(rsb);
      let output = '';
      output += (
        '/**\n' +
        ' * @id = '+ apiId + '\n' +
        ' * @path = '+ element.path + '\n' +
        ' * @method = '+ method + '\n' +
        ' * @title = '+ element.title + '\n' +
        (element.tag ? ' * @tag = '+ element.tag.join(',') + '\n' : '') +
        (element.custom_field_value ? ' * @access = '+ element.custom_field_value + '\n' : '') +
        ' */\n\n'
      );

      const name = 'API'+apiId;
      output += bodyInsert(name, prsb)

      if (element.req_query && element.req_query.length) {
        output += '// 以下为req的query部分\n';
        output += `export type ${name + '_REQQuery'} =\n${element.req_query.map(qry => `'${qry.name}' | // ${qry.desc}`).join('\n')} \n'' ;\n`
      }
      if (element.req_body_other) {
        output += '// 以下为req的body部分\n';
        const prbo = JSON.parse(element.req_body_other);
        const oName = name + '_REQBody';
        const oResult = bodyInsert(oName, prbo);
        output += oResult;
        // 有obj参数的时候，另外再生成一个对象，用于方便引入
        if (isObj) {
          const oOBJ = objParser(oResult, oName);
          output += oOBJ;
        }
      }

      const FILENAME = `${token.toUpperCase()}_${apiId}${isObj ? '_OBJ' : ''}${isType ? '_TYPE' : ''}`
      fs.writeFileSync(path.resolve(__dirname, `../types/yapi/${FILENAME}.ts`), output)
    })
  })

  // res_body 和 req_body_other 的内容写入
  const bodyInsert = function(name, prsb) {
    if (prsb.type === 'object') {
      let innerStr = '';
      const extraInterList = []
      innerStr += `export interface ${name} {\n${inserObj(prsb, name, extraInterList)}}\n`
      extraInterList.reverse().forEach((inter) => {
        innerStr += inter
        innerStr += '\n'
      })

      return innerStr
    } else if (prsb.type === 'array') {
      let innerStr = '';
      const extraInterList = []
      innerStr += `export type ${name} = Array<${insertArray(prsb.items, name, extraInterList)}>;\n`
      extraInterList.reverse().forEach((inter) => {
        innerStr += inter
        innerStr += '\n'
      })

      return innerStr
    } else {
      return `export type ${name} = ${prsb.type === 'integer' ? 'number' : prsb.type};\n`
    }
  }

  // 获取接口字段的ts类型
  const inserObj = function(obj, name, list) {
    let str = '';
    name = name || '';

    if (!obj.properties) return '';
    const ppts = obj.properties;
    const required = obj.required || [];

    let keys = getOBJKey(ppts)
    if (isType && keys.length) {
      list.push(`export type ${name}Type =\n${keys.map((key, idx) => {
        if (idx === keys.length - 1) {
          return `'${key}';`;
        } else {
          return `'${key}' |\n`;
        }
      }).join('')}\n`)
    }


    for (let key in ppts) {
      const item = ppts[key];
      const space = '  ';
      const type = item.type;
      if (item.description) {
        str += `${space}/** ${item.description} */\n`
      }
      str += `${space}${key}${~required.indexOf(key) ? '' : '?'}: `

      switch(type) {
        case 'string':
        case 'number':
        case 'boolean':
        case 'null':
          str += type
          break;
        case 'integer':
          str += 'number'
          break;
        case 'object':
          const oName = name + key.replace(key[0],key[0].toUpperCase())
          str += oName

          list.push(`export interface ${oName} {\n${inserObj(item, oName, list)}}\n`)
          break;

        case 'array':
          const aName = name + key.replace(key[0],key[0].toUpperCase())
          str += `Array<${insertArray(item.items, aName, list)}>`
          break;
      }
      str += ';'

      str += '\n'
    }
    return str
  }

  // 数组的结构特殊，另外写递归
  const insertArray = function(arrayObj, name, list) {
    let str = '';
    if (arrayObj.type === 'object') {
      name += 'Item'
      str += name

      list.push(`export interface ${name} {\n${inserObj(arrayObj, name, list)}}\n`)
    } else if (arrayObj.type === 'array') {
      name += 'Array'
      str += `Array<${insertArray(arrayObj.items, name, list)}>`
    } else {
      str += (arrayObj.type === 'integer' ? 'number' : (arrayObj.type || 'any'))
    }

    return str
  }
  // 获取属性的key值
  function getOBJKey(obj) {
    let keys = [];
    Object.prototype.toString.call({});
    function getKEYS(target, pre) {
      for (let key in target) {
        if (target[key].properties && Object.keys(target[key].properties).length) {
          getKEYS(target[key].properties, pre + key + '.');
        } else {
          keys.push(pre + key);
        }
      }
    }

    getKEYS(obj, '');
    return keys;
  }

  function objParser(interStr, oName) {
    const name = oName.replace(/\_/g, '')
    const outStr = interStr
      .replace(/\s*\/\*\*.*?\*\//g, '')
      .replace(/\nexport\stype(.|\n)*?\;\n/g, '')
      .replace(/\?/g, '')
      .replace(/\_(?=[\dA-Za-z]\s?)/g, '')
      .replace(/\sinterface\s/g, ' const ')
      .replace(/\{(?=\n)/g, '= {')
      .replace(/(string)\;/g, `'',`)
      .replace(/(number)\;/g, `0,`)
      .replace(/boolean\;/g, `false,`)
      .replace(/null\;/g, `null,`)
      .replace(/Array\<(string|number)\>\;/g, `[],`)
      .replace(/Array\<(.*?)\>\;/g, `[$1],`)
      .replace(/\;/g, `,`)
      .replace(/\}/g, `};`)
      .split(/export\s/)
      .reverse()
      .join('')
      .replace(new RegExp(`const\\s${name}\\s`), `export const ${name}: ${oName} `)

    return outStr

  }
}
