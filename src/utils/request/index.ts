import type { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import type { ApiResponse, RequestMeta } from './tools/enum'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useToken } from '@/hooks/useToken'
import { ContentTypeEnum, ResultEnum, ShowMessage } from './tools/enum'

export type { RequestMeta }

export interface RequestConfig extends AxiosRequestConfig {
  meta?: RequestMeta
}

type InterceptorsConfig = InternalAxiosRequestConfig & RequestConfig

interface InterceptorsResponse extends AxiosResponse {
  config: InterceptorsConfig
}

export const baseURL = import.meta.env.DEV ? '/api' : (import.meta.env.VITE_BASE_URL || '/api')

function shouldAttachToken(config: RequestConfig): boolean {
  if (config.meta?.ignoreAuth === true)
    return false
  return true
}

function shouldNotify(config: RequestConfig): boolean {
  if (config.meta?.hideNotify === true)
    return false
  return true
}

export const axiosInstance = axios.create({
  baseURL,
  timeout: 20000,
  headers: {
    'Content-Type': ContentTypeEnum.JSON,
    'Accept': 'application/json, text/plain, */*',
  },
})

axiosInstance.interceptors.request.use(
  (config: InterceptorsConfig) => {
    if (shouldAttachToken(config)) {
      const { token } = useToken()
      if (token.value)
        config.headers.Authorization = `Bearer ${token.value}`
    }
    return config
  },
  (error) => {
    console.error(error)
    throw error
  },
)

axiosInstance.interceptors.response.use(
  async (response: InterceptorsResponse) => {
    const meta = response.config.meta ?? {}

    if (meta.rawResponse === true)
      return response

    if (meta.resType === 'blob' || response.data instanceof Blob)
      return response.data
    if (meta.resType === 'text')
      return response.data

    const payload = response.data as ApiResponse
    const { code, msg, data } = payload

    if (code !== ResultEnum.Success0 && code !== ResultEnum.Success200) {
      if (code === ResultEnum.Unauthorized) {
        useToken().removeToken()
        const { useUserStore } = await import('@/stores/user')
        useUserStore().resetState()
        const { default: router } = await import('@/router')
        const loginPath = import.meta.env.VITE_LOGIN_URL || '/login'
        if (router.currentRoute.value.path !== loginPath)
          await router.push(loginPath)
      }
      if (shouldNotify(response.config)) {
        const message = msg ?? `请求失败 ${code}`
        console.error(message)
        ElMessage.error(message)
      }
      throw new Error(`请求失败 ${code}, ${msg}`)
    }

    return (meta.originalRes ? payload : data)
  },
  (error) => {
    console.error(error)
    if (axios.isAxiosError(error) && (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT'))
      throw new Error(ShowMessage(ResultEnum.RequestTimeout))
    if (axios.isAxiosError(error) && error.response)
      throw new Error(ShowMessage(error.response.status) || `HTTP请求错误[${error.response.status}]`)
    throw error
  },
)

export function request<T = unknown>(config: RequestConfig) {
  return axiosInstance.request<unknown, T>(config)
}

export default request
