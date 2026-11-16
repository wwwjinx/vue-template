<script setup lang="ts">
import type { RouterRecord } from '@/types/system'
import { resolveMenuPath, showingChildren } from '@/utils/menuPath'
import { isExternal } from '@/utils/validate'

const props = withDefaults(defineProps<{
  item: RouterRecord
  basePath?: string
}>(), {
  basePath: '',
})

const onlyOneChild = ref<RouterRecord>()

function hasOneShowingChild(item: RouterRecord): boolean {
  const children = showingChildren(item)
  if (children.length === 1) {
    onlyOneChild.value = children[0]
    return true
  }
  if (children.length === 0) {
    onlyOneChild.value = { ...item, path: '', children: undefined }
    return true
  }
  return false
}

function resolvePath(routePath = ''): string {
  return resolveMenuPath(props.basePath, routePath)
}

const title = computed(() => props.item.meta?.title || props.item.name || '')
</script>

<template>
  <template v-if="!item.hidden">
    <template v-if="hasOneShowingChild(item) && !onlyOneChild?.children && !item.alwaysShow">
      <a v-if="isExternal(resolvePath(onlyOneChild?.path))" :href="resolvePath(onlyOneChild?.path)" target="_blank" rel="noopener noreferrer">
        <ElMenuItem :index="resolvePath(onlyOneChild?.path)">
          <MenuIcon :name="onlyOneChild?.meta?.icon || item.meta?.icon" />
          <template #title>
            <span>{{ onlyOneChild?.meta?.title || title }}</span>
          </template>
        </ElMenuItem>
      </a>
      <ElMenuItem v-else :index="resolvePath(onlyOneChild?.path)">
        <MenuIcon :name="onlyOneChild?.meta?.icon || item.meta?.icon" />
        <template #title>
          <span>{{ onlyOneChild?.meta?.title || title }}</span>
        </template>
      </ElMenuItem>
    </template>

    <ElSubMenu v-else :index="resolvePath(item.path)" teleported>
      <template #title>
        <MenuIcon :name="item.meta?.icon" />
        <span>{{ title }}</span>
      </template>
      <SidebarItem
        v-for="child in showingChildren(item)"
        :key="child.path"
        :item="child"
        :base-path="resolvePath(item.path)"
      />
    </ElSubMenu>
  </template>
</template>
