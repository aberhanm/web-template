/**
 * @description 用于去yapi拉取接口生成interface
 */
const parser = require('./yapi.parser');


const apiId = process.env.npm_config_id;
const isObj = process.env.npm_config_obj;
const isType = process.env.npm_config_type;
const token = process.env.npm_config_token || 'default';

if (!apiId) {
  throw new Error('未发现apiId')
}

parser(apiId, isObj, isType, token)
