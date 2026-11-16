import type { DictDataInfo } from '@/types/system'
import { getDicts } from '@/api/system/dict'

export interface DictResult {
  id?: number | string
  dictValue: string
  dictLabel: string
  [key: string]: unknown
}

/** 按字典类型拉取字典项，对接 /system/dict/data/type/{dictType} */
export async function getDictByTypeApi(dictType: string): Promise<DictResult[]> {
  const list = (await getDicts(dictType)) ?? []
  return list.map((item: DictDataInfo) => ({
    ...item,
    id: item.dictCode,
    dictValue: item.dictValue ?? '',
    dictLabel: item.dictLabel ?? '',
  }))
}
