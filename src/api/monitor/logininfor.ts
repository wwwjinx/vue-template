import type { LoginLogInfo, PageResult } from '@/types/system'
import { request } from '@/utils/request'

export function listLogininfor(query: Record<string, unknown>) {
  return request<PageResult<LoginLogInfo>>({
    url: '/monitor/logininfor/list',
    method: 'get',
    params: query,
  })
}

export function delLogininfor(infoIds: number | string) {
  return request<unknown>({
    url: `/monitor/logininfor/${infoIds}`,
    method: 'delete',
  })
}

export function cleanLogininfor() {
  return request<unknown>({
    url: '/monitor/logininfor/clean',
    method: 'delete',
  })
}
