import type { RouteRecordRaw } from 'vue-router'
import type { RouterRecord } from '@/types/system'

const viewModules = import.meta.glob('../views/**/*.vue')

export function loadView(view: string) {
  const normalized = view.replace(/^\/+/, '').replace(/\.vue$/, '')
  for (const path of Object.keys(viewModules)) {
    const dir = path.replace('../views/', '').replace(/\.vue$/, '')
    if (dir === normalized)
      return viewModules[path]
  }
  return viewModules['../views/error/404.vue']
}

export const constantLayoutRoutes: RouterRecord[] = [
  {
    path: '/',
    name: 'RootLayout',
    hidden: false,
    component: () => import('@/layout/index.vue'),
    redirect: '/index',
    children: [
      {
        path: 'index',
        name: 'Index',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '首页', icon: 'dashboard', affix: true },
      },
    ],
  },
]

export const hiddenConstantRoutes: RouteRecordRaw[] = [
  {
    path: '/system/dict-data',
    component: () => import('@/layout/index.vue'),
    meta: { hidden: true, title: '字典数据' },
    children: [
      {
        path: 'index/:dictId',
        name: 'DictData',
        component: () => import('@/views/system/dict/data.vue'),
        meta: { title: '字典数据', activeMenu: '/system/dict' },
      },
    ],
  },
]

export const notFoundRoute: RouteRecordRaw = {
  path: '/:pathMatch(.*)*',
  name: 'NotFound',
  component: () => import('@/views/error/404.vue'),
  meta: { hidden: true, title: '404' },
}
