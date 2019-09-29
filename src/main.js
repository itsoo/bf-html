import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/scss/main.scss'
import Const from '@/assets/js/const'
import Common from '@/common'

Const.HEADERS.token = store.state.token = 'F81A8C71352A51D616E8229AF1F9669A'

// system properties init
Vue.prototype.APP_NAME = `${process.env.VUE_APP_NAME}`
Vue.prototype.APP_TITLE = `${process.env.VUE_APP_TITLE}`
Vue.config.productionTip = false

// use element ui
Vue.use(ElementUI)

// common init
Common.request.use(axios)
Common.initialization()

new Vue({
  mode: 'history',
  router,
  store,
  render: resolve => resolve(App)
}).$mount('#app')
