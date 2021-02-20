import Vue, { VNode } from 'vue';
import { Component } from 'vue';
import AxiosHttp from './utils/http';

declare global {
  namespace JSX {
    // tslint:disable no-empty-interface
    interface Element extends VNode {}
    // tslint:disable no-empty-interface
    interface ElementClass extends Vue {}
    interface IntrinsicElements {
      [elem: string]: any;
    }
  }

  // 对于window属性的调用打开
  interface Window {
    [prop: string]: any;
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    _renderProxy: any;
    $http: AxiosHttp;
  }
  // 用于组件注册
  interface VueConstructor {
    options: {name: string};
    install: (v: VueConstructor) => void;
  }
}
