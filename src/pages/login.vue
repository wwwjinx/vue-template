<script setup lang="ts">
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const { toggleTheme, isDark } = useTheme()

const loading = ref(false)
const showPassword = ref(false)
const error = ref('')
const form = reactive({
  username: '',
  password: '',
})

async function handleLogin() {
  error.value = ''
  if (!form.username.trim()) {
    error.value = '请输入用户名'
    return
  }
  if (!form.password) {
    error.value = '请输入密码'
    return
  }

  loading.value = true
  try {
    await userStore.login(form.username, form.password)
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
    const target = redirect.startsWith('/') && !redirect.startsWith('//') ? redirect : '/'
    await router.push(target)
  }
  catch (err) {
    error.value = err instanceof Error ? err.message : '登录失败'
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="login-page">
    <button
      type="button"
      class="theme-toggle"
      :aria-label="isDark ? '切换浅色模式' : '切换深色模式'"
      @click="toggleTheme"
    >
      <span v-if="isDark" class="i-mdi-weather-sunny icon" />
      <span v-else class="i-mdi-weather-night icon" />
    </button>

    <form class="login-card" @submit.prevent="handleLogin">
      <div class="brand">
        <img src="/yugutou_logo.png" alt="鱼骨头" class="logo">
        <h1>鱼骨头</h1>
        <p>欢迎回来</p>
      </div>

      <div class="fields">
        <div class="field">
          <span class="i-mdi-account-outline field-icon" />
          <input
            v-model="form.username"
            type="text"
            placeholder="用户名"
            autocomplete="username"
          >
        </div>
        <div class="field">
          <span class="i-mdi-lock-outline field-icon" />
          <input
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="密码"
            autocomplete="current-password"
            class="has-toggle"
          >
          <button
            type="button"
            class="password-toggle"
            :aria-label="showPassword ? '隐藏密码' : '显示密码'"
            @click="showPassword = !showPassword"
          >
            <span v-if="showPassword" class="i-mdi-eye-off icon" />
            <span v-else class="i-mdi-eye icon" />
          </button>
        </div>
      </div>

      <div v-if="error" class="error">
        {{ error }}
      </div>

      <button type="submit" class="submit" :disabled="loading">
        {{ loading ? '登录中…' : '登录' }}
      </button>
    </form>
  </main>
</template>

<style scoped>
.login-page {
  position: relative;
  display: flex;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  background: var(--bg-page-gradient, var(--bg-page));
  transition: background 0.2s ease;
}

.theme-toggle {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 50;
  display: flex;
  width: 36px;
  height: 36px;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  border: 1px solid var(--border);
  background-color: var(--bg-card);
  color: var(--text-muted);
  cursor: pointer;
  transition: color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease;
}

.theme-toggle:hover {
  color: var(--text-main);
}

.icon,
.field-icon {
  width: 20px;
  height: 20px;
  display: inline-block;
}

.login-card {
  width: 100%;
  max-width: 420px;
  border-radius: 16px;
  border: 1px solid var(--border);
  background-color: var(--bg-card);
  padding: 32px;
  box-shadow: var(--shadow);
  transition: background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.brand {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo {
  width: 56px;
  height: 56px;
  background-color: #fff;
  object-fit: contain;
}

.brand h1 {
  margin: 16px 0 0;
  font-size: 24px;
  font-weight: 600;
  letter-spacing: -0.025em;
  color: var(--text-main);
}

.brand p {
  margin: 4px 0 0;
  font-size: 14px;
  color: var(--text-muted);
}

.fields {
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.field {
  position: relative;
}

.field-icon {
  position: absolute;
  top: 50%;
  left: 12px;
  color: var(--text-muted);
  transform: translateY(-50%);
  pointer-events: none;
}

.field input {
  width: 100%;
  height: 44px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background-color: var(--input-bg);
  padding: 8px 12px 8px 40px;
  font-size: 15px;
  color: var(--text-main);
  outline: none;
  transition: border-color 0.2s ease;
}

.field input.has-toggle {
  padding-right: 40px;
}

.field input::placeholder {
  color: var(--text-muted);
}

.field input:focus {
  border-color: var(--input-focus);
}

.password-toggle {
  position: absolute;
  top: 50%;
  right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  transform: translateY(-50%);
  transition: color 0.2s ease;
}

.password-toggle:hover {
  color: var(--text-main);
}

.error {
  margin-top: 20px;
  border-radius: 8px;
  background-color: rgb(239 68 68 / 10%);
  padding: 8px 12px;
  font-size: 14px;
  color: #ef4444;
}

.submit {
  margin-top: 24px;
  display: flex;
  height: 44px;
  width: 100%;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 8px;
  background-color: var(--primary-btn-bg);
  padding: 0 16px;
  font-size: 15px;
  font-weight: 500;
  color: var(--primary-btn-text);
  cursor: pointer;
  transition: filter 0.2s ease, transform 0.15s ease, opacity 0.2s ease;
}

.submit:hover:not(:disabled) {
  filter: brightness(1.25);
}

.submit:active:not(:disabled) {
  transform: scale(0.98);
}

.submit:disabled {
  opacity: 0.5;
  cursor: default;
}
</style>
