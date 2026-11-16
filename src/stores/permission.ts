import type { RouteRecordRaw } from 'vue-router'
import type { RouterRecord } from '@/types/system'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { getRouters } from '@/api/login'
import { constantLayoutRoutes, loadView } from '@/router/routes'

function cloneRoutes(routes: RouterRecord[]): RouterRecord[] {
  return JSON.parse(JSON.stringify(routes)) as RouterRecord[]
}

function filterChildren(childrenMap: RouterRecord[], lastRouter?: RouterRecord): RouterRecord[] {
  let children: RouterRecord[] = []
  childrenMap.forEach((el) => {
    const item = { ...el }
    item.path = lastRouter ? `${lastRouter.path}/${item.path}` : item.path
    if (item.children?.length && item.component === 'ParentView')
      children = children.concat(filterChildren(item.children, item))
    else
      children.push(item)
  })
  return children
}

function filterAsyncRouter(asyncRouterMap: RouterRecord[], type = false): RouterRecord[] {
  return asyncRouterMap.filter((route) => {
    if (type && route.children)
      route.children = filterChildren(route.children)

    if (route.component) {
      if (route.component === 'Layout')
        route.component = () => import('@/layout/index.vue')
      else if (route.component === 'ParentView')
        route.component = () => import('@/components/ParentView/index.vue')
      else if (route.component === 'InnerLink')
        route.component = () => import('@/components/InnerLink/index.vue')
      else if (typeof route.component === 'string')
        route.component = loadView(route.component)
    }

    if (route.children?.length)
      route.children = filterAsyncRouter(route.children, type)
    else
      delete route.children

    return true
  })
}

export const usePermissionStore = defineStore('permission', {
  state: () => ({
    routes: [] as RouterRecord[],
    addRoutes: [] as RouterRecord[],
    sidebarRouters: [] as RouterRecord[],
  }),
  actions: {
    resetRoutes() {
      this.routes = []
      this.addRoutes = []
      this.sidebarRouters = []
    },
    async generateRoutes(): Promise<RouteRecordRaw[]> {
      const data = (await getRouters()) ?? []
      const sidebarRoutes = filterAsyncRouter(cloneRoutes(data))
      const rewriteRoutes = filterAsyncRouter(cloneRoutes(data), true)
      this.addRoutes = rewriteRoutes
      this.routes = constantLayoutRoutes.concat(rewriteRoutes)
      this.sidebarRouters = constantLayoutRoutes.concat(sidebarRoutes)
      return rewriteRoutes as unknown as RouteRecordRaw[]
    },
  },
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(usePermissionStore, import.meta.hot))
