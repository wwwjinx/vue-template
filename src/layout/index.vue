<script setup lang="ts">
const collapse = ref(false)
</script>

<template>
  <div class="app-wrapper" :class="{ collapsed: collapse }">
    <aside class="sidebar-container">
      <Sidebar :collapse="collapse" />
    </aside>
    <div class="main-container">
      <Navbar :collapse="collapse" @toggle="collapse = !collapse" />
      <section class="app-main">
        <RouterView />
      </section>
    </div>
  </div>
</template>

<style scoped>
.app-wrapper {
  display: flex;
  min-height: 100%;
  width: 100%;
}
.sidebar-container {
  width: 210px;
  flex-shrink: 0;
  transition: width 0.2s;
  overflow: hidden;
}
.collapsed .sidebar-container {
  width: 64px;
}
.main-container {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  background: var(--el-bg-color-page, #f5f7fa);
}
.app-main {
  flex: 1;
  padding: 16px;
  overflow: auto;
}
</style>
