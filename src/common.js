import Vue from 'vue'
import router from '@/router'
import store from '@/store'
import _ from 'lodash'
import Const from '@/assets/js/const'
import Util from '@/assets/js/util'

const { FORBIDDEN, HOME_ROUTER, HEADERS, PERMISSION_FUNCTION, TIMEOUT } = Const
const QUERY_URL = `/${process.env.VUE_APP_NAME}/query_user_permissions`

Const.IS_PROD && (store.state.token = '')
Vue.prototype.hasPermissions = PERMISSION_FUNCTION(store)

export default {
  // axios default setting
  request: {
    use: axios => {
      axios.defaults.headers.common.token = HEADERS.token
      axios.interceptors.response.use(
        data => data,
        err => {
          if (Const.ERROR_CODES.includes(`${err.response.status}`)) {
            router.push(`/${err.response.status}`)
          } else if (err.response.status === Const.FORBIDDEN) {
            Vue.prototype.$alert(...TIMEOUT)
          } else {
            console.log(err.response)
          }

          return Promise.resolve(err)
        }
      )
      Vue.prototype.axios = axios
    }
  },
  // initialization core entry
  initialization() {
    try {
      const { data, headers } = Util.syncRequest(QUERY_URL, HEADERS)
      if (data.status === FORBIDDEN) throw FORBIDDEN

      store.state.user = data.user
      const nodes = data.permissions.childNote
      if (_.isEmpty(nodes)) {
        // jump 401 view
        router.addRoutes(Util.getNonePermissionRouters())
      } else {
        store.state.token = headers.token
        store.state.menus = Util.filterMenus(_.cloneDeep(nodes))
        store.state.permissions = Util.filterPermissions(_.cloneDeep(nodes))
        router.options.routes = Util.getMenuTrees(store.state.menus)
        router.addRoutes(Util.getMenuRouters(store.state.menus, HOME_ROUTER))
      }
    } catch (e) {
      console.log(e)

      // Status code (403) def logged timeout
      e === FORBIDDEN && Vue.prototype.$alert(...TIMEOUT)
    }
  }
}
