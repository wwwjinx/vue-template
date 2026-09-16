/**
 * 使用 token
 */
const token = ref(typeof sessionStorage === 'undefined' ? '' : sessionStorage.getItem('token') ?? '')

export function useToken() {
  function setToken(value: string) {
    token.value = value
    if (typeof sessionStorage !== 'undefined')
      sessionStorage.setItem('token', value)
  }

  function removeToken() {
    token.value = ''
    if (typeof sessionStorage !== 'undefined')
      sessionStorage.removeItem('token')
  }

  return {
    token,
    setToken,
    removeToken,
  }
}
