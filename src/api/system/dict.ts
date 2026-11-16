import type { DictDataInfo, DictTypeInfo, PageResult } from '@/types/system'
import { request } from '@/utils/request'

export function listDictType(query: Record<string, unknown>) {
  return request<PageResult<DictTypeInfo>>({
    url: '/system/dict/type/list',
    method: 'get',
    params: query,
  })
}

export function getDictType(dictId: number) {
  return request<DictTypeInfo>({
    url: `/system/dict/type/${dictId}`,
    method: 'get',
  })
}

export function addDictType(data: Partial<DictTypeInfo>) {
  return request<DictTypeInfo>({
    url: '/system/dict/type',
    method: 'post',
    data,
  })
}

export function updateDictType(data: Partial<DictTypeInfo>) {
  return request<DictTypeInfo>({
    url: '/system/dict/type',
    method: 'put',
    data,
  })
}

export function delDictType(dictIds: number | string) {
  return request<unknown>({
    url: `/system/dict/type/${dictIds}`,
    method: 'delete',
  })
}

export function optionDictTypes() {
  return request<DictTypeInfo[]>({
    url: '/system/dict/type/optionselect',
    method: 'get',
  })
}

export function getDicts(dictType: string) {
  return request<DictDataInfo[]>({
    url: `/system/dict/data/type/${dictType}`,
    method: 'get',
  })
}

export function listDictData(query: Record<string, unknown>) {
  return request<PageResult<DictDataInfo>>({
    url: '/system/dict/data/list',
    method: 'get',
    params: query,
  })
}

export function getDictData(dictCode: number) {
  return request<DictDataInfo>({
    url: `/system/dict/data/${dictCode}`,
    method: 'get',
  })
}

export function addDictData(data: Partial<DictDataInfo>) {
  return request<DictDataInfo>({
    url: '/system/dict/data',
    method: 'post',
    data,
  })
}

export function updateDictData(data: Partial<DictDataInfo>) {
  return request<DictDataInfo>({
    url: '/system/dict/data',
    method: 'put',
    data,
  })
}

export function delDictData(dictCodes: number | string) {
  return request<unknown>({
    url: `/system/dict/data/${dictCodes}`,
    method: 'delete',
  })
}
