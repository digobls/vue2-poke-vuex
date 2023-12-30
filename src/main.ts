import './assets/scss/main.scss';

import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router';
import router from "@/router/router";

Vue.config.productionTip = false
Vue.use(VueRouter);

new Vue({
  el: '#app',
  router,
  render: h => h(App)
});
