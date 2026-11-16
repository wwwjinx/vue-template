import type { RouterRecord } from '@/types/system'
import { isExternal } from '@/utils/validate'

export const HOME_ROUTE: RouterRecord = {
  path: '/',
  name: 'Index',
  hidden: false,
  meta: { title: '首页', icon: 'dashboard', affix: true },
}

export function resolveMenuPath(basePath = '', routePath = ''): string {
  if (isExternal(routePath))
    return routePath
  if (isExternal(basePath))
    return basePath
  const parts = [basePath, routePath].filter(part => part && part !== '/')
  const joined = parts.join('/').replace(/\/+/g, '/')
  return joined.startsWith('/') ? joined : `/${joined}`
}

export function showingChildren(item: RouterRecord): RouterRecord[] {
  return (item.children ?? []).filter(child => !child.hidden)
}

export interface ResolvedView {
  path: string
  component?: string
  title?: string
  activeMenu?: string
}

export function flattenViews(routes: RouterRecord[], basePath = ''): ResolvedView[] {
  const result: ResolvedView[] = []
  for (const item of routes) {
    if (item.hidden)
      continue
    const fullPath = resolveMenuPath(basePath, item.path)
    const kids = showingChildren(item)
    if (typeof item.component === 'string' && item.component !== 'Layout' && item.component !== 'ParentView' && item.component !== 'InnerLink') {
      result.push({
        path: fullPath,
        component: item.component,
        title: item.meta?.title,
        activeMenu: item.meta?.activeMenu,
      })
    }
    if (kids.length)
      result.push(...flattenViews(kids, kids.length && item.component === 'ParentView' ? fullPath : (item.component === 'Layout' ? fullPath : fullPath)))
  }
  return result
}

export function findViewByPath(routes: RouterRecord[], pathname: string): ResolvedView | undefined {
  const normalized = pathname.replace(/\/+$/, '') || '/'
  return flattenViews(routes).find((item) => {
    const path = item.path.replace(/\/+$/, '') || '/'
    return path === normalized
  })
}
