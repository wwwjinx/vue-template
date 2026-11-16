import { getToken, removeToken as persistRemoveToken, setToken as persistSetToken } from '@/utils/handleToken'

/**
 * 使用 token
 */
const token = ref(getToken())

export function useToken() {
  function setToken(value: string) {
    token.value = value
    persistSetToken(value)
  }

  function removeToken() {
    token.value = ''
    persistRemoveToken()
  }

  return {
    token,
    setToken,
    removeToken,
  }
}
