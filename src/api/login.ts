import type { CurrentUserPayload, LoginResult, RouterRecord } from '@/types/system'
import { request } from '@/utils/request'

/** 登录。成功时拦截器已解开 data，返回 `{ token }`。 */
export function login(username: string, password: string) {
  return request<LoginResult>({
    url: '/login',
    method: 'post',
    data: { username, password },
    meta: { ignoreAuth: true },
  })
}

export function getInfo() {
  return request<CurrentUserPayload>({
    url: '/getInfo',
    method: 'get',
  })
}

export function getRouters() {
  return request<RouterRecord[]>({
    url: '/getRouters',
    method: 'get',
  })
}

export function logout() {
  return request<unknown>({
    url: '/logout',
    method: 'post',
  })
}
