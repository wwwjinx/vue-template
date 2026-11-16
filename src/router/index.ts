import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import { routes as autoRoutes, handleHotUpdate } from 'vue-router/auto-routes'
import { setupRouterGuard } from '@/router/guard'
import { constantLayoutRoutes, hiddenConstantRoutes } from '@/router/routes'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    ...autoRoutes,
    ...(constantLayoutRoutes as RouteRecordRaw[]),
    ...hiddenConstantRoutes,
  ],
  scrollBehavior: () => ({ top: 0 }),
})

setupRouterGuard(router)

export default router

if (import.meta.hot)
  handleHotUpdate(router)
