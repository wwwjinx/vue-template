<script setup lang="ts">
import { usePermissionStore } from '@/stores/permission'
import SidebarItem from './SidebarItem.vue'

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
  background: var(--sidebar-bg);
  color: var(--sidebar-text);
  border-right: 1px solid var(--sidebar-border);
  box-shadow: var(--sidebar-shadow);
}

.logo {
  height: var(--topbar-height);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--sidebar-active-text);
  border-bottom: 1px solid var(--sidebar-logo-border);
  flex-shrink: 0;
}

.sidebar :deep(.el-scrollbar) {
  flex: 1;
}

.sidebar :deep(.el-menu) {
  border-right: none;
  background: var(--sidebar-bg);
  --el-menu-bg-color: var(--sidebar-bg);
  --el-menu-text-color: var(--sidebar-text);
  --el-menu-hover-bg-color: var(--sidebar-hover-bg);
  --el-menu-active-color: var(--sidebar-active-text);
  --el-menu-item-height: 40px;
}

.sidebar :deep(.el-sub-menu__title) {
  height: 46px;
  line-height: 46px;
  color: var(--sidebar-title);
  font-size: 14px;
  border-left: 3px solid transparent;
}

.sidebar :deep(.el-sub-menu__title:hover) {
  color: var(--sidebar-hover-text) !important;
  background: var(--sidebar-submenu-hover-bg) !important;
}

.sidebar :deep(.el-menu-item) {
  height: 40px;
  line-height: 40px;
  font-size: 13px;
  color: var(--sidebar-text);
  border-left: 3px solid transparent;
}

.sidebar :deep(.el-menu-item:hover) {
  color: var(--sidebar-hover-text) !important;
  background: var(--sidebar-hover-bg) !important;
}

.sidebar :deep(.el-menu-item.is-active) {
  color: var(--sidebar-active-text) !important;
  font-weight: 700;
  background: var(--sidebar-active-bg) !important;
  border-left-color: var(--primary-color);
}

.sidebar :deep(.el-sub-menu .el-menu) {
  background: var(--sidebar-bg);
}
</style>
