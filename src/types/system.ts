/** 与后端 camelCase 字段对齐的系统管理类型。 */

export interface PageResult<T> {
  rows: T[]
  total: number
}

export interface LoginResult {
  token: string
}

export interface DeptInfo {
  deptId?: number
  deptName?: string
  parentId?: number
  orderNum?: number
  leader?: string
  phone?: string
  email?: string
  status?: string
  ancestors?: string
  createTime?: string
  children?: DeptInfo[]
}

export interface RoleInfo {
  roleId: number
  roleName: string
  roleKey: string
  roleSort: number
  dataScope?: string
  menuCheckStrictly?: number
  deptCheckStrictly?: number
  status: string
  delFlag?: string
  createTime?: string
  remark?: string
  menuIds?: number[]
  flag?: boolean
}

export interface UserInfo {
  userId: number
  deptId?: number | null
  userName: string
  nickName: string
  userType?: string | null
  email?: string | null
  phonenumber?: string | null
  sex?: string | null
  avatar?: string | null
  status?: string | null
  delFlag?: string | null
  loginIp?: string | null
  loginDate?: string | null
  createTime?: string | null
  remark?: string | null
  admin?: boolean
  dept?: DeptInfo | null
  roleIds?: number[] | null
  roles?: RoleInfo[] | null
  password?: string
}

export interface CurrentUserPayload {
  user: UserInfo
  roles: string[]
  permissions: string[]
}

export interface MenuInfo {
  menuId: number
  menuName: string
  parentId?: number
  orderNum?: number
  path?: string | null
  component?: string | null
  query?: string | null
  routeName?: string | null
  isFrame?: number | null
  isCache?: number | null
  menuType?: string | null
  visible?: string | null
  status?: string | null
  perms?: string | null
  icon?: string | null
  createTime?: string | null
  remark?: string | null
  children?: MenuInfo[]
}

export interface RouteMetaConfig {
  title?: string
  icon?: string
  noCache?: boolean
  link?: string
  affix?: boolean
  activeMenu?: string
  hidden?: boolean
}

export interface RouterRecord {
  name?: string
  path: string
  hidden?: boolean
  redirect?: string
  component?: string | (() => Promise<unknown>) | object
  query?: string
  alwaysShow?: boolean
  meta?: RouteMetaConfig
  children?: RouterRecord[]
  permissions?: string[]
}

export interface DictTypeInfo {
  dictId: number
  dictName?: string
  dictType?: string
  status?: string
  createTime?: string
  remark?: string
}

export interface DictDataInfo {
  dictCode: number
  dictSort?: number
  dictLabel?: string
  dictValue?: string
  dictType?: string
  cssClass?: string | null
  listClass?: string | null
  isDefault?: string
  status?: string
  createTime?: string
  remark?: string
}

export interface OperLogInfo {
  operId: number
  title?: string
  businessType?: number
  method?: string
  requestMethod?: string
  operatorType?: number
  operName?: string
  deptName?: string
  operUrl?: string
  operIp?: string
  operLocation?: string
  operParam?: string
  jsonResult?: string
  status?: number
  errorMsg?: string
  operTime?: string
  costTime?: number
}

export interface LoginLogInfo {
  infoId: number
  userName?: string
  ipaddr?: string
  loginLocation?: string
  browser?: string
  os?: string
  status?: string
  msg?: string
  loginTime?: string
}
