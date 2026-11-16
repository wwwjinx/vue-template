<script setup lang="ts">
import {
  Collection,
  Document,
  Grid,
  Menu as MenuIcon,
  Notebook,
  Odometer,
  Setting,
  Share,
  Tickets,
  User,
  UserFilled,
} from '@element-plus/icons-vue'

const props = defineProps<{
  name?: string
}>()

const iconMap: Record<string, typeof User> = {
  'system': Setting,
  'user': User,
  'peoples': UserFilled,
  'tree-table': Grid,
  'tree': Share,
  'dict': Collection,
  'log': Document,
  'form': Tickets,
  'logininfor': Notebook,
  'dashboard': Odometer,
  'menu': MenuIcon,
}

const icon = computed(() => {
  const key = (props.name || '').trim()
  return iconMap[key] || MenuIcon
})
</script>

<template>
  <ElIcon v-if="name && name !== '#'">
    <component :is="icon" />
  </ElIcon>
</template>
