import _ from 'lodash'
import Const from '@/assets/js/const'

/**
 * util.js
 *
 * @author zxy
 */
export default {
  // sync request
  syncRequest(url, header = {}) {
    const xhr = new XMLHttpRequest()
    let data = {},
      headers = {}

    xhr.open('GET', url, false)
    // set request header
    Object.entries(header).forEach(([k, v]) => xhr.setRequestHeader(k, v))
    xhr.onload = () => {
      data = JSON.parse(xhr.responseText)
    }
    xhr.onerror = e => {
      console.error(e)

      throw xhr.statusText
    }
    xhr.send()

    // set response header
    xhr
      .getAllResponseHeaders()
      .split('\n')
      .filter(s => s)
      .forEach(s => {
        const arr = s.split(':')
        headers[_.trim(arr[0])] = _.trim(arr[1])
      })

    return { data, headers }
  },

  // get menu router's path
  getPath(url, permissions) {
    if (url) return url

    if (permissions) return _.toLower(`/${permissions}`)

    return ''
  },

  // get router node
  getRouterNode({ icon, name, url, permissions }) {
    return {
      icon: icon,
      name: name,
      path: this.getPath(url, permissions),
      component: resolve => require([`@/views/${permissions}.vue`], resolve),
      view: `${permissions}`
    }
  },

  // get error routers
  getErrorRouters(errorCodes, routers = []) {
    errorCodes.forEach(e =>
      routers.push({
        name: e,
        path: `/${e}`,
        component: resolve => require([`@/views/error/${e}.vue`], resolve),
        view: `${e}`
      })
    )

    return routers
  },

  // get all menus for trees
  getMenuTrees(nodes, routers = []) {
    if (!nodes) return routers

    // add children
    const addChildren = (nodes, child = []) => {
      if (!nodes) return null

      nodes.forEach(t => {
        let node = this.getRouterNode(t)
        node.child = addChildren(t.childNote)
        child.push(node)
      })

      return child
    }

    nodes.forEach(t => {
      let node = this.getRouterNode(t)
      node.child = addChildren(t.childNote)
      routers.push(node)
    })

    return routers
  },

  // get none permission routers
  getNonePermissionRouters(routers = []) {
    this.getErrorRouters([Const.ERROR_401], routers)
    routers.push(Const.NONE_PERMISSION_ROUTER)

    return routers
  },

  // get all menus for routers
  getMenuRouters(nodes, ...routers) {
    if (!nodes) return routers

    // add node
    const addNode = (routers, nodes) => {
      if (!nodes) return null

      nodes.forEach(t => {
        if (!_.startsWith(t.permissions, '@')) {
          routers.push(this.getRouterNode(t))
        }
      })
    }

    // setting user routers
    nodes.forEach(t => {
      if (!_.startsWith(t.permissions, '@')) {
        routers.push(this.getRouterNode(t))
      }

      addNode(routers, t.childNote)
    })

    this.getErrorRouters(Const.ERROR_CODES, routers)
    routers.push(Const.NOT_FOUND_ROUTER)

    return routers
  },

  // filter all nodes for menus
  filterMenus(nodes) {
    if (!nodes) return null

    nodes.forEach(t => {
      const arr = this.filterMenus(t.childNote)
      t.childNote = _.isEmpty(arr) ? null : arr
    })

    return nodes.filter(({ type }) => type === '2')
  },

  // filter all nodes for permissions
  filterPermissions(nodes, hashMap = {}) {
    if (nodes) {
      nodes
        .filter(({ type }) => type === '3')
        .forEach(({ permissions }) => (hashMap[permissions] = 1))
      nodes.forEach(({ childNote }) =>
        this.filterPermissions(childNote, hashMap)
      )
    }

    return hashMap
  }
}
