import { http } from '@/utils/request'

export interface DictResult {
  id: string
  dictValue: string
  dictLabel: string
  [key: string]: unknown
}

/** 按字典类型拉取字典项，后端路径按实际接口调整 */
export function getDictByTypeApi(dictType: string) {
  return http.Get<DictResult[]>(`/dict/${dictType}`)
}
