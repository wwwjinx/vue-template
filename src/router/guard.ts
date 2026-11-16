import type { Router, RouteRecordRaw } from 'vue-router'
import { useToken } from '@/hooks/useToken'
import { notFoundRoute } from '@/router/routes'
import { usePermissionStore } from '@/stores/permission'
import { useUserStore } from '@/stores/user'
import { isExternal } from '@/utils/validate'

export function setupRouterGuard(router: Router) {
  const loginPath = import.meta.env.VITE_LOGIN_URL || '/login'
  const whiteList = [loginPath]

  router.beforeEach(async (to) => {
    const { token } = useToken()

    if (token.value) {
      if (to.path === loginPath)
        return { path: '/' }

      const userStore = useUserStore()
      if (userStore.roles.length === 0) {
        try {
          await userStore.getInfo()
          const accessRoutes = await usePermissionStore().generateRoutes()
          accessRoutes.forEach((route) => {
            if (!isExternal(route.path))
              router.addRoute(route as RouteRecordRaw)
          })
          if (!router.hasRoute('NotFound'))
            router.addRoute(notFoundRoute)
          return { ...to, replace: true }
        }
        catch {
          await userStore.logOut()
          return { path: loginPath, query: { redirect: to.fullPath }, replace: true }
        }
      }
      return true
    }

    if (whiteList.includes(to.path))
      return true

    return { path: loginPath, query: { redirect: to.fullPath }, replace: true }
  })
}
