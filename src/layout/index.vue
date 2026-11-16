<script setup lang="ts">
import Navbar from './components/Navbar.vue'
import Sidebar from './components/Sidebar.vue'

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
  background: var(--bg-page-gradient, var(--bg-page));
}

.sidebar-container {
  width: var(--sidebar-width, 230px);
  flex-shrink: 0;
  transition: width 0.2s;
  overflow: hidden;
}

.collapsed .sidebar-container {
  width: var(--sidebar-collapsed-width, 64px);
}

.main-container {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  background: transparent;
}

.app-main {
  flex: 1;
  padding: 16px;
  overflow: auto;
}
</style>
