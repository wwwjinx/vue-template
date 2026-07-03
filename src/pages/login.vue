<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = ref({
  email: '',
  password: '',
})
const error = ref('')

const { toggleTheme } = useTheme()

async function handleLogin() {
  try {
    error.value = ''
    console.log('Login attempt:', form.value)
    await new Promise(resolve => setTimeout(resolve, 500))
    router.push('/')
  }
  catch (err) {
    error.value = '登录失败，请检查您的凭据。'
    console.error('Login error:', err)
  }
}
</script>

<template>
  <div class="login-wrapper">
    <button class="theme-toggle" @click="toggleTheme">
      切换模式 (Light/Dark)
    </button>

    <div class="login-card">
      <div class="header">
        <h1>欢迎回来</h1>
        <p>请登录您的账号以继续</p>
      </div>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>电子邮箱</label>
          <input
            v-model="form.email"
            type="email"
            placeholder="email@example.com"
            required
          >
        </div>

        <div class="form-group">
          <label>密码</label>
          <input
            v-model="form.password"
            type="password"
            placeholder="••••••••"
            required
          >
        </div>

        <p v-if="error" class="error-msg">
          {{ error }}
        </p>

        <button type="submit" class="btn-primary btn">
          登 录
        </button>
      </form>

      <div class="footer">
        还没有账号？ <a href="#">立即注册</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-wrapper {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-page);
  color: var(--text-main);
  font-family: var(--font-main);
  transition: var(--transition);
}

.login-card {
  background: var(--bg-card);
  padding: 40px;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  width: 100%;
  max-width: 520px;
  transition: var(--transition);
}

.header {
  margin-bottom: 32px;
  text-align: center;
}

.header h1 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
}

.header p {
  color: var(--text-muted);
  font-size: 14px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  margin-bottom: 8px;
}

.form-group input {
  width: 100%;
  padding: 12px 16px;
  background: var(--input-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  color: var(--text-main);
  font-size: 15px;
  transition: var(--transition);
  outline: none;
}

.form-group input:focus {
  border-color: var(--input-focus);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--input-focus) 20%, transparent);
}

.error-msg {
  color: #dc2626;
  text-align: center;
  font-size: 14px;
  margin-top: 8px;
}

.btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: var(--radius-md);
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  margin-top: 10px;
}

.btn-primary {
  background: var(--primary-btn-bg);
  color: var(--primary-btn-text);
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn-primary:active {
  transform: translateY(0);
}

.footer {
  margin-top: 24px;
  text-align: center;
  font-size: 14px;
  color: var(--text-muted);
}

.footer a {
  color: var(--text-main);
  text-decoration: none;
  font-weight: 600;
}

.theme-toggle {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 8px 16px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 20px;
  cursor: pointer;
  color: var(--text-main);
  font-size: 12px;
  transition: var(--transition);
  z-index: 100;
}
</style>
