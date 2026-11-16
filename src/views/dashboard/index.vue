<script setup lang="ts">
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
</script>

<template>
  <ElCard>
    <h2 class="title">
      欢迎，{{ userStore.nickName || userStore.name || '用户' }}
    </h2>
    <p class="desc">
      这是系统管理首页。请从左侧菜单进入用户、角色、菜单、部门、字典和日志管理。
    </p>
  </ElCard>
</template>

<style scoped>
.title {
  margin: 0 0 8px;
  font-size: 20px;
}
.desc {
  margin: 0;
  color: var(--el-text-color-secondary);
}
</style>
