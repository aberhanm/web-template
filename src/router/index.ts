import Vue from 'vue';
import Router from 'vue-router';
import NotFound from '@/views/notFound.vue';

const RoutesVm = new Router({
  base: '/yourself-path',
  mode: 'history',
  routes: [
    {
      path: '*',
      component: NotFound,
    },
    {
      path: '/home',
      name: 'home',
      component: () => import(/* webpackChunkName: "home" */ '@/views/home.vue'),
    },

  ],
});

Vue.use(Router);

export default RoutesVm;
