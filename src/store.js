import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '',
    user: {},
    menus: [],
    permissions: {}
  },
  mutations: {},
  actions: {}
})
