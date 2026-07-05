import { createRouter, createWebHistory } from 'vue-router'
import { handleHotUpdate, routes } from 'vue-router/auto-routes'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const whitePath = [import.meta.env.VITE_LOGIN_URL]

router.beforeEach((to, from, next) => {
  if (whitePath.includes(to.path)) {
    next()
  }
  else {
    const { token } = useToken()

    if (token) {
      next()
    }
    else {
      next({
        path: import.meta.env.VITE_LOGIN_URL,
        replace: true,
      })
    }
  }
})

export default router

// 这将在运行时更新路由而无需重新加载页面
if (import.meta.hot) {
  handleHotUpdate(router)
}
