<script setup lang="ts">
import { usePermissionStore } from '@/stores/permission'

defineProps<{
  collapse: boolean
}>()

const route = useRoute()
const permissionStore = usePermissionStore()

const activeMenu = computed(() => {
  const { meta, path } = route
  return (meta.activeMenu as string | undefined) || path
})
</script>

<template>
  <div class="sidebar">
    <div class="logo">
      <span v-show="!collapse">管理系统</span>
      <span v-show="collapse">管</span>
    </div>
    <ElScrollbar>
      <ElMenu
        :default-active="activeMenu"
        :collapse="collapse"
        :unique-opened="true"
        router
        background-color="#1f2d3d"
        text-color="#bfcbd9"
        active-text-color="#409eff"
      >
        <SidebarItem
          v-for="item in permissionStore.sidebarRouters"
          :key="item.path"
          :item="item"
          :base-path="item.path"
        />
      </ElMenu>
    </ElScrollbar>
  </div>
</template>

<style scoped>
.sidebar {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #1f2d3d;
  color: #bfcbd9;
}
.logo {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: #fff;
  border-bottom: 1px solid rgb(255 255 255 / 8%);
  flex-shrink: 0;
}
.sidebar :deep(.el-menu) {
  border-right: none;
}
.sidebar :deep(.el-scrollbar) {
  flex: 1;
}
</style>
