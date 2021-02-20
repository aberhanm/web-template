/**
 * @description 组件注册
 */
import Vue from 'vue';
import ClaimTable from './table';
import ClaimForm from './form';
import ClaimHeader from './header';
import ClaimSelectTree from './selectTree';
import ClaimSelectAll from './selectAll';
import ClaimCard from './card';
import ClaimCascader from './cascader';
import ClaimShowTable from './showTable';

Vue.use(ClaimTable);
Vue.use(ClaimForm);
Vue.use(ClaimHeader);
Vue.use(ClaimSelectTree);
Vue.use(ClaimSelectAll);
Vue.use(ClaimCard);
Vue.use(ClaimCascader);
Vue.use(ClaimShowTable);
