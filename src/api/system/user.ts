import type { PageResult, RoleInfo, UserInfo } from '@/types/system'
import { request } from '@/utils/request'

export function listUser(query: Record<string, unknown>) {
  return request<PageResult<UserInfo>>({
    url: '/system/user/list',
    method: 'get',
    params: query,
  })
}

export function getUser(userId: number) {
  return request<UserInfo>({
    url: `/system/user/${userId}`,
    method: 'get',
  })
}

export function optionUserRoles() {
  return request<{ roles: RoleInfo[] }>({
    url: '/system/user/',
    method: 'get',
  })
}

export function addUser(data: Partial<UserInfo>) {
  return request<UserInfo>({
    url: '/system/user/',
    method: 'post',
    data,
  })
}

export function updateUser(data: Partial<UserInfo>) {
  return request<UserInfo>({
    url: '/system/user/',
    method: 'put',
    data,
  })
}

export function delUser(userIds: number | string) {
  return request<unknown>({
    url: `/system/user/${userIds}`,
    method: 'delete',
  })
}

export function resetUserPwd(userId: number, password: string) {
  return request<unknown>({
    url: '/system/user/resetPwd',
    method: 'put',
    data: { userId, password },
  })
}

export function changeUserStatus(userId: number, status: string) {
  return request<unknown>({
    url: '/system/user/changeStatus',
    method: 'put',
    data: { userId, status },
  })
}
