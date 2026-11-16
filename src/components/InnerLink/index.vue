<script setup lang="ts">
const route = useRoute()
const link = computed(() => String(route.meta.link || ''))
</script>

<template>
  <div class="text-sm p-4">
    <p v-if="link">
      外部链接：
      <a :href="link" target="_blank" rel="noopener noreferrer">{{ link }}</a>
    </p>
    <p v-else>
      未配置外部链接
    </p>
  </div>
</template>
