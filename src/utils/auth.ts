import { useUserStore } from '@/stores/user'

export const ALL_PERMISSION = '*:*:*'
export const SUPER_ROLE = 'admin'

export function hasPermission(required: string | string[]): boolean {
  const list = Array.isArray(required) ? required : [required]
  if (!list.length)
    return false
  const permissions = useUserStore().permissions
  return permissions.includes(ALL_PERMISSION) || list.some(item => permissions.includes(item))
}

export function hasRole(required: string | string[]): boolean {
  const list = Array.isArray(required) ? required : [required]
  if (!list.length)
    return false
  const roles = useUserStore().roles
  return roles.includes(SUPER_ROLE) || list.some(item => roles.includes(item))
}
