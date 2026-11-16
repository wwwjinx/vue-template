<script setup lang="ts">
const router = useRouter()
</script>

<template>
  <div class="not-found">
    <h2>404</h2>
    <p>页面不存在</p>
    <ElButton type="primary" @click="router.push('/index')">
      返回首页
    </ElButton>
  </div>
</template>

<style scoped>
.not-found {
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
}
</style>
