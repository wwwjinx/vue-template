import type { DeptInfo } from '@/types/system'
import { request } from '@/utils/request'

export function listDept(query: Record<string, unknown> = {}) {
  return request<DeptInfo[]>({
    url: '/system/dept/list',
    method: 'get',
    params: query,
  })
}

export function treeselectDept(query: Record<string, unknown> = {}) {
  return request<DeptInfo[]>({
    url: '/system/dept/treeselect',
    method: 'get',
    params: query,
  })
}

export function getDept(deptId: number) {
  return request<DeptInfo>({
    url: `/system/dept/${deptId}`,
    method: 'get',
  })
}

export function addDept(data: Partial<DeptInfo>) {
  return request<DeptInfo>({
    url: '/system/dept/',
    method: 'post',
    data,
  })
}

export function updateDept(data: Partial<DeptInfo>) {
  return request<DeptInfo>({
    url: '/system/dept/',
    method: 'put',
    data,
  })
}

export function delDept(deptIds: number | string) {
  return request<unknown>({
    url: `/system/dept/${deptIds}`,
    method: 'delete',
  })
}
