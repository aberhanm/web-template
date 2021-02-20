import { AxiosPromise } from 'axios';
import {setStorage, getStorage} from './store';
/**
 * @description 并行任务处理器
 */


const parallelTaskMap: any = {};
export const parallelTask = (name: string, fn: () => Promise<any>): Promise<any> => {
  if (!parallelTaskMap[name]) {
    return parallelTaskMap[name] = fn().finally(() => {
      parallelTaskMap[name] = null;
      delete parallelTaskMap[name];
    });
  } else {
    return parallelTaskMap[name];
  }
};

export const httpSave = (name: string, fn: () => AxiosPromise<any>): Promise<any> => {
  const storeName = `HttpSave_${name}`;
  const store = getStorage(storeName);
  if (store) {
    return Promise.resolve(store);
  } else {
    return parallelTask(name, fn).then((res: any) => {
      setStorage(storeName, res.data);
      return res.data;
    });
  }
};

// const warterfallTaskMap: any = {};
// export const warterfallTask = (name: string, fn: any) => {
// };
