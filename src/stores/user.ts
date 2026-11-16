import { acceptHMRUpdate, defineStore } from 'pinia'
import { getInfo, login as loginApi, logout as logoutApi } from '@/api/login'
import { useToken } from '@/hooks/useToken'
import { usePermissionStore } from '@/stores/permission'

export const useUserStore = defineStore('user', {
  state: () => ({
    id: 0 as number,
    name: '',
    nickName: '',
    avatar: '',
    roles: [] as string[],
    permissions: [] as string[],
  }),
  actions: {
    resetState() {
      this.id = 0
      this.name = ''
      this.nickName = ''
      this.avatar = ''
      this.roles = []
      this.permissions = []
    },
    async login(username: string, password: string) {
      const res = await loginApi(username, password)
      if (!res?.token)
        throw new Error('登录响应缺少 token')
      useToken().setToken(res.token)
    },
    async getInfo() {
      const res = await getInfo()
      const user = res.user
      this.roles = res.roles?.length ? res.roles : ['ROLE_DEFAULT']
      this.permissions = res.permissions ?? []
      this.id = user.userId
      this.name = user.userName
      this.nickName = user.nickName
      this.avatar = user.avatar || ''
      return res
    },
    async logOut() {
      try {
        await logoutApi()
      }
      catch {
        // 远端失败也清本地会话
      }
      finally {
        useToken().removeToken()
        this.resetState()
        usePermissionStore().resetRoutes()
      }
    },
  },
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
