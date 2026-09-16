export enum ContentTypeEnum {
  JSON = 'application/json;charset=UTF-8',
  FORM_URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
  FORM_DATA = 'multipart/form-data;charset=UTF-8',
}

export class ApiError extends Error {
  code: number
  data?: unknown

  constructor(message: string, code: number, data?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.data = data
  }
}

export interface ApiResponse<T = unknown> {
  code: number
  msg?: string
  data?: T
  success?: boolean
  total?: number
  more?: boolean
  rows?: unknown[]
}

export enum ResultEnum {
  Success0 = 0,
  Success200 = 200,
  Error = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  MethodNotAllowed = 405,
  RequestTimeout = 408,
  InternalServerError = 500,
  NotImplemented = 501,
  BadGateway = 502,
  ServiceUnavailable = 503,
  GatewayTimeout = 504,
  HttpVersionNotSupported = 505,
}

/**
 * 根据状态码，生成对应的错误信息
 * @param {number|string} status 状态码
 * @returns {string} 错误信息
 */
export function ShowMessage(status: number | string): string {
  switch (status) {
    case 400:
      return '请求错误(400)'
    case 401:
      return '未授权，请重新登录(401)'
    case 403:
      return '拒绝访问(403)'
    case 404:
      return '请求出错(404)'
    case 408:
      return '请求超时(408)'
    case 500:
      return '服务器错误(500)'
    case 501:
      return '服务未实现(501)'
    case 502:
      return '网络错误(502)'
    case 503:
      return '服务不可用(503)'
    case 504:
      return '网络超时(504)'
    case 505:
      return 'HTTP版本不受支持(505)'
    default:
      return `连接出错(${status})!`
  }
}
