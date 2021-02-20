/**
 * @description axios封装
 * @author fayfang
 * @date 2020-04-10
 */
import axios from 'axios';
import { on } from './tools/event';
import { extend, querySerialize, getSerializeValue } from './tools/lib';
import { setStorage} from './tools/store';
import { Notification, Loading, Message } from 'element-ui';

export const Version = 'v1';
export const BaseUrl = '/yourself-api-path/:version';

// 基于promise封装jsonp,与axios形成统一的函数风格
function jsonp(url: string, params: any) {
  const callbackName = `jsonp${+new Date()}`;
  const jsonpParams = {
    format: 'json',
    RF_ENCODE: 'UTF-8',
    callback: callbackName,
    _: +new Date(),
  };

  function error(err: Error, reject: any) {
    window[callbackName] = undefined;
    console.error(err);
    reject();
  }

  const finalParams = extend(jsonpParams, params);

  const p = new Promise((resolve: any, reject: any) => {
    const script = document.createElement('script');

    window[callbackName] = (json: string) => {
      window[callbackName] = undefined;
      document.head.removeChild(script);
      resolve(json);
    };

    on(script, 'error', (err: Error) => {
      error(err, reject);
    });
    on(script, 'abort', (err: Error) => {
      error(err, reject);
    });

    script.src = url + querySerialize(finalParams);
    document.head.appendChild(script);
  });

  return p;
}


export default class AxiosHttp {
  public readonly axios: any;
  public defaultConfig: any;
  public loadingVM: any;
  public loadingCounter: number = 0;
  constructor() {
    this.axios = axios;
    this.defaultConfig = {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Login-Type': 'customer',
      },
      data: {},
      timeout: 300000,
      // 和后台协定，4xx和5xx的返回码得获取内容展示相关逻辑
      validateStatus(status: number) {
        return status >= 200 && status < 600;
      },
    };
  }
  public errorWarning(status: number, data: any) {
    let message = '';
    switch (+status) {
    case 400:
      message = '字段校验失败';
      break;
    case 401:
      message = '用户登录失效';
      break;
    case 403:
      message = '用户禁止访问';
      break;
    case 404:
      message = '请求未定义';
      break;
    case 405:
      message = '请求方法错误';
      break;
    case 422:
      message = '对象验证错误';
      break;
    case 500:
      message = '服务器出错';
      break;
    default:
      message = '未知错误';
    }

    Notification({
      title: '出错了！',
      message: data.message || `${message}(${status})`,
      type: 'error',
    });
  }
  public doAxios(options: any) {
    let base = BaseUrl;
    base = base.replace(':version', options.version || Version);
    if (typeof options.baseUrl !== 'undefined') {
      base = options.baseUrl;
    }
    options.url = base + options.url;
    const ajaxObj = extend(true, {
      headers: {
      },
    },
    this.defaultConfig,
    options);

    /**
     * 本地和开发环境权限获取等有差异
     * 别问，问就是架构如此
     */

    const loadingVM = this.loading(options);
    // 封装一层统一回调，后续有统一错误码加载这个回调里
    return axios(ajaxObj).then((res) => {
      if (res.headers['login-required'] && res.headers['login-required'] === 'True' && res.status === 200) {
        const oauthUrl = res.headers['oauth-url'];
        /**
         * 玩不过了，研发不给本地支持方案，只能去测试登录完塞cookie
         */
        if (oauthUrl && process.env.NODE_ENV === 'development') {
          // window.location.href = oauthUrl;
        } else {
          window.location.reload();
        }
      }
      // 更新服务器时间
      try {
        const date = res.headers.date || res.headers.Date;
        const currentTime = new Date(date);
        setStorage('serverTime', +currentTime);
      } catch (err) {console.error(err); }

      // 统一提示信息
      // 统一错误提示
      if (+res.status >= 400) {
        if (options.defineError) {
          return res;
        } else {
          this.errorWarning(res.status, res.data);
          throw new Error((res.data && res.data.message) || '未知错误');
        }
      } else if (options.normalNotice) {
        const defaultMessage = options.method === 'get' ? '获取成功'
                            : options.method === 'post' ? '新增成功'
                            : options.method === 'put' ? '修改成功'
                            : options.method === 'patch' ? '修改成功'
                            : options.method === 'delete' ? '删除成功'
                            : '成功';
        Notification({
          title: '已成功！',
          type: 'success',
          message: options.noticeSuccessMssage || res.data.message || defaultMessage,
        });
      }

      // logout返回的是个字符串，你敢信？
      if (options.url.indexOf('/LoginApp/v1/logout') > -1 && res.data === 'logout') {
        return {};
      }

      if (+res.data.code === 401) {
        const errorMsg = '用户未登录';
        Message({
          message: errorMsg,
          type: 'error',
        });
        setTimeout(() => {
          this.logout();
        }, 2000);
        throw new Error(errorMsg);
      }
      if (+res.data.code !== 200 && +res.data.code !== 0) {
        const errorMsg = (res.data && res.data.message) || '未知错误';
        Message({
          message: errorMsg,
          type: 'error',
        });
        throw new Error(errorMsg);
      }

      return res.data || {};
    }).catch((err) => {
      throw new Error(err);
    }).finally(() => {
      if (loadingVM) {
        loadingVM.close();
      } else {
        this.closeLoading(options);
      }
    });
  }
  public get(url: string, params?: any, config?: HTTPCONFIG) {
    let useUrl;
    if (params && url.indexOf('?') > -1) {
      const pathValue = getSerializeValue(params);
      useUrl = `${url}${pathValue ? `&${pathValue}` : ''}`;
    } else if (params) {
      useUrl = `${url}?${getSerializeValue(params)}`;
    } else {
      useUrl = url;
    }
    let getConfig = {
      method: 'get',
      url: useUrl,
    };

    if (config) { getConfig = extend(getConfig, config); }
    return this.doAxios(getConfig);
  }
  public post(url: string, data?: any, config?: HTTPCONFIG) {
    let postConfig = {
      method: 'post',
      url,
      data,
    };
    if (config) { postConfig = extend(postConfig, config); }
    return this.doAxios(postConfig);
  }
  public put(url: string, data?: any, config?: HTTPCONFIG) {
    let putConfig = {
      method: 'put',
      url,
      data,
    };
    if (config) { putConfig = extend(putConfig, config); }
    return this.doAxios(putConfig);
  }
  public patch(url: string, data?: any, config?: HTTPCONFIG) {
    let putConfig = {
      method: 'patch',
      url,
      data,
    };
    if (config) { putConfig = extend(putConfig, config); }
    return this.doAxios(putConfig);
  }
  public delete(url: string, params?: any, config?: HTTPCONFIG) {
    let deleteConfig = {
      method: 'delete',
      url: params ? `${url}?${getSerializeValue(params)}` : url,
    };
    if (config) { deleteConfig = extend(deleteConfig, config); }
    return this.doAxios(deleteConfig);
  }
  public jsonp(url: string, params?: any) {
    return jsonp(url, params);
  }
  public getUrl(url: string) {
    return BaseUrl.replace(':version', Version) + url;
  }
  public logout() {
    const iframe = document.createElement('iframe');
    const box = document.createElement('div');
    box.style.display = 'none';
    iframe.src = 'https://nuc-hk-di1.sit.cmft.com/LoginApp/v1/logout';
    box.appendChild(iframe);
    document.body.appendChild(box);
    iframe.onload = () => {
      this.get('/LoginApp/v1/logout', {}, {baseUrl: ''}).then(() => {
        window.location.reload();
      });
    };
  }
  private loading(config: HTTPCONFIG): any {
    if (config.noLoading) { return false; }
    const options = {
      customClass: 'http-loading',
      text: config.loadingText,
      fullscreen: config.loadingTarget ? false : true,
      target: config.loadingTarget,
    };
    if (config.loadingTarget) {
      const VM = Loading.service(options);
      return VM;
    } else {
      if (this.loadingCounter === 0) {
        const VM = Loading.service(options);
        this.loadingVM = VM;
        this.loadingCounter ++;
      }

      return false;
    }
  }
  private closeLoading(config: HTTPCONFIG) {
    if (config.noLoading) { return false; }
    if (!config.loadingTarget) {
      this.loadingCounter --;
      if (this.loadingCounter <= 0) {
        this.loadingCounter = 0;
        this.loadingVM.close();
      }
    }
  }
}

export interface HTTPCONFIG {
  baseUrl?: string;
  version?: string;
  defineError?: boolean;
  normalNotice?: boolean;
  noticeSuccessMssage?: string;
  noLoading?: boolean;
  loadingTarget?: HTMLElement;
  loadingText?: string;
  [props: string]: any;
}
