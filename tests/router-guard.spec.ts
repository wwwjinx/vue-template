import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import { useToken } from '@/hooks/useToken'
import { setupRouterGuard } from '@/router/guard'

const LoginPage = defineComponent({ name: 'LoginPage', template: '<div>login</div>' })
const HomePage = defineComponent({ name: 'HomePage', template: '<div>home</div>' })

function createTestRouter() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/login', component: LoginPage },
      { path: '/index', component: HomePage, meta: { title: '首页' } },
      { path: '/', redirect: '/index' },
    ],
  })
  setupRouterGuard(router)
  return router
}

describe('router guard', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    sessionStorage.clear()
    useToken().removeToken()
  })

  it('redirects unauthenticated visits to login', async () => {
    const router = createTestRouter()
    await router.push('/index')
    await router.isReady()
    await nextTick()
    expect(router.currentRoute.value.path).toBe('/login')
    expect(router.currentRoute.value.query.redirect).toBe('/index')
  })

  it('allows visiting the login page without a token', async () => {
    const router = createTestRouter()
    await router.push('/login')
    await router.isReady()
    expect(router.currentRoute.value.path).toBe('/login')
  })
})
