import type { MenuInfo } from '@/types/system'
import { request } from '@/utils/request'

export function listMenu(query: Record<string, unknown> = {}) {
  return request<MenuInfo[]>({
    url: '/system/menu/list',
    method: 'get',
    params: query,
  })
}

export function getMenu(menuId: number) {
  return request<MenuInfo>({
    url: `/system/menu/${menuId}`,
    method: 'get',
  })
}

export function addMenu(data: Partial<MenuInfo>) {
  return request<MenuInfo>({
    url: '/system/menu/',
    method: 'post',
    data,
  })
}

export function updateMenu(data: Partial<MenuInfo>) {
  return request<MenuInfo>({
    url: '/system/menu/',
    method: 'put',
    data,
  })
}

export function delMenu(menuIds: number | string) {
  return request<unknown>({
    url: `/system/menu/${menuIds}`,
    method: 'delete',
  })
}

export function menuTreeselect() {
  return request<MenuInfo[]>({
    url: '/system/menu/treeselect',
    method: 'get',
  })
}
