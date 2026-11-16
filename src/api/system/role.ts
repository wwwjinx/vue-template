import type { MenuInfo, PageResult, RoleInfo } from '@/types/system'
import { request } from '@/utils/request'

export function listRole(query: Record<string, unknown>) {
  return request<PageResult<RoleInfo>>({
    url: '/system/role/list',
    method: 'get',
    params: query,
  })
}

export function getRole(roleId: number) {
  return request<RoleInfo>({
    url: `/system/role/${roleId}`,
    method: 'get',
  })
}

export function addRole(data: Partial<RoleInfo>) {
  return request<RoleInfo>({
    url: '/system/role/',
    method: 'post',
    data,
  })
}

export function updateRole(data: Partial<RoleInfo>) {
  return request<unknown>({
    url: '/system/role/',
    method: 'put',
    data,
  })
}

export function delRole(roleIds: number | string) {
  return request<unknown>({
    url: `/system/role/${roleIds}`,
    method: 'delete',
  })
}

export function changeRoleStatus(roleId: number, status: string) {
  return request<unknown>({
    url: '/system/role/changeStatus',
    method: 'put',
    data: { roleId, status },
  })
}

export function roleMenuTreeselect(roleId: number) {
  return request<{ menus: MenuInfo[], checkedKeys: number[] }>({
    url: `/system/menu/roleMenuTreeselect/${roleId}`,
    method: 'get',
  })
}
