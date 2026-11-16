<script setup lang="ts">
import { Expand, Fold, SwitchButton } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/user'

defineProps<{
  collapse: boolean
}>()

const emit = defineEmits<{
  toggle: []
}>()

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const { toggleTheme, isDark } = useTheme()

const crumbs = computed(() => {
  return route.matched
    .filter(item => item.meta?.title && item.path !== '/')
    .map(item => ({ path: item.path, title: String(item.meta.title) }))
})

async function onLogout() {
  try {
    await ElMessageBox.confirm('确定退出登录吗？', '提示', { type: 'warning' })
  }
  catch {
    return
  }
  await userStore.logOut()
  await router.push(import.meta.env.VITE_LOGIN_URL || '/login')
}
</script>

<template>
  <div class="navbar">
    <div class="left">
      <ElIcon class="fold" @click="emit('toggle')">
        <Fold v-if="!collapse" />
        <Expand v-else />
      </ElIcon>
      <ElBreadcrumb separator="/">
        <ElBreadcrumbItem :to="{ path: '/index' }">
          首页
        </ElBreadcrumbItem>
        <ElBreadcrumbItem v-for="item in crumbs.filter(c => c.path !== '/index')" :key="item.path">
          {{ item.title }}
        </ElBreadcrumbItem>
      </ElBreadcrumb>
    </div>
    <div class="right">
      <ElButton text @click="toggleTheme">
        {{ isDark ? '浅色' : '深色' }}
      </ElButton>
      <ElDropdown trigger="click">
        <span class="user">
          {{ userStore.nickName || userStore.name || '用户' }}
        </span>
        <template #dropdown>
          <ElDropdownMenu>
            <ElDropdownItem :icon="SwitchButton" @click="onLogout">
              退出登录
            </ElDropdownItem>
          </ElDropdownMenu>
        </template>
      </ElDropdown>
    </div>
  </div>
</template>

<style scoped>
.navbar {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid var(--el-border-color-light);
  background: var(--el-bg-color);
}
.left,
.right {
  display: flex;
  align-items: center;
  gap: 12px;
}
.fold {
  font-size: 18px;
  cursor: pointer;
}
.user {
  cursor: pointer;
  font-size: 14px;
}
</style>
