import Vue from 'vue';
import App from './App.vue';
import router from './router/index';
import store from './store';
import element from 'element-ui';
import AxiosHttp from './utils/http';
import './components/index';
import 'element-ui/lib/theme-chalk/index.css';
import './style/index.styl';
import './utils/bugFix';

Vue.config.productionTip = false;
Vue.use(element, { size: 'small'});
Vue.prototype.$http = new AxiosHttp();

export default new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
