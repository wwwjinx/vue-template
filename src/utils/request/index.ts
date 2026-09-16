import type { ApiResponse } from './tools/enum'
import adapterFetch from 'alova/fetch'
import { createAlova } from 'alova'
import vueHook from 'alova/vue'
import { ContentTypeEnum, ResultEnum, ShowMessage } from './tools/enum'

export const baseURL = import.meta.env.VITE_BASE_URL || ''

export const alovaInstance = createAlova({
  baseURL,
  requestAdapter: adapterFetch(),
  statesHook: vueHook,
  timeout: 20000,
  cacheFor: null,
  beforeRequest: (method) => {
    method.config.headers = {
      'Content-Type': ContentTypeEnum.JSON,
      Accept: 'application/json, text/plain, */*',
      ...method.config.headers,
    }

    if (method.meta?.ignoreAuth !== true) {
      const { token } = useToken()
      if (token.value) {
        method.config.headers.Authorization = `Bearer ${token.value}`
      }
    }
  },
  responded: {
    onSuccess: async (response, method) => {
      const { config } = method
      const { requestType } = config

      if (requestType === 'upload' || requestType === 'download') {
        return response
      }

      if (!response.ok) {
        const errorMessage = ShowMessage(response.status) || `HTTP请求错误[${response.status}]`
        console.error(`请求失败, ${errorMessage}`)
        throw new Error(errorMessage)
      }

      const data = await response.json() as ApiResponse
      const { code, msg, data: rawData } = data

      if (code !== ResultEnum.Success0 && code !== ResultEnum.Success200) {
        if (code === ResultEnum.Unauthorized) {
          useToken().removeToken()
          const { default: router } = await import('@/router')
          const loginPath = import.meta.env.VITE_LOGIN_URL || '/login'
          if (router.currentRoute.value.path !== loginPath) {
            await router.push(loginPath)
          }
        }
        if (config.meta?.hideNotify !== true) {
          console.error(msg ?? `请求失败 ${code}`)
        }
        throw new Error(`请求失败 ${code}, ${msg}`)
      }

      return (method.meta?.originalRes ? data : rawData) as ApiResponse
    },
  },
})

/** 兼容上游命名风格 */
export const http = alovaInstance

export default alovaInstance
