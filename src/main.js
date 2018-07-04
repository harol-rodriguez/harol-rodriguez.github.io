import './scss/root.scss'
import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from 'axios'
import router from './routes'
import {store} from './store'

import App from './App.vue'

window.eventHub = new Vue();


Vue.use(VueRouter, axios)

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
