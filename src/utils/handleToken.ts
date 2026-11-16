/**
 * 使用 token
 */

const tokenKey = import.meta.env.VITE_TOKEN_KEY

function canUseSessionStorage() {
  return typeof sessionStorage !== 'undefined'
}

export function getToken() {
  if (!canUseSessionStorage())
    return ''
  return sessionStorage.getItem(tokenKey) ?? ''
}

export function setToken(token: string) {
  if (!canUseSessionStorage())
    return
  sessionStorage.setItem(tokenKey, token)
}

export function removeToken() {
  if (!canUseSessionStorage())
    return
  sessionStorage.removeItem(tokenKey)
}
