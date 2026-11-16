import type { OperLogInfo, PageResult } from '@/types/system'
import { request } from '@/utils/request'

export function listOperlog(query: Record<string, unknown>) {
  return request<PageResult<OperLogInfo>>({
    url: '/monitor/operlog/list',
    method: 'get',
    params: query,
  })
}

export function delOperlog(operIds: number | string) {
  return request<unknown>({
    url: `/monitor/operlog/${operIds}`,
    method: 'delete',
  })
}

export function cleanOperlog() {
  return request<unknown>({
    url: '/monitor/operlog/clean',
    method: 'delete',
  })
}
