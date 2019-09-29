/**
 * const.js
 *
 * @author zxy
 */
const ERROR_401 = '401'
const ERROR_404 = '404'
const ERROR_500 = '500'

export default {
  IS_PROD: ['production', 'prod'].includes(process.env.NODE_ENV),
  // http status
  FORBIDDEN: 403,
  HEADERS: {
    token: '',
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  // error codes
  ERROR_401,
  ERROR_404,
  ERROR_500,
  ERROR_CODES: [ERROR_401, ERROR_404, ERROR_500],
  // routers
  HOME_ROUTER: {
    path: '/',
    component: resolve => require(['@/views/Home.vue'], resolve),
    view: 'Home'
  },
  NONE_PERMISSION_ROUTER: { path: '*', redirect: `/${ERROR_401}` },
  NOT_FOUND_ROUTER: { path: '*', redirect: `/${ERROR_404}` },
  // the permission checked
  PERMISSION_FUNCTION(store) {
    return code => {
      return Array.isArray(code)
        ? code.filter(t => store.state.permissions[t]).length
        : store.state.permissions[code] || 0
    }
  },
  // session timeout setting
  TIMEOUT: [
    '您当前的登录已超时，请重新登录',
    '提示',
    {
      confirmButtonText: '确定',
      callback: () => {
        // jump to login page
        const protocol = window.location.href.split(':')[0]
        window.location.href = `${protocol}://${window.location.host}/${process.env.VUE_APP_NAME}/`
      }
    }
  ]
}
