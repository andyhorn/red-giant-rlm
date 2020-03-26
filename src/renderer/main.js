import Vue from 'vue'
import axios from 'axios'

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

import App from './App'
import router from './router'
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  template: '<App/>'
}).$mount('#app')
