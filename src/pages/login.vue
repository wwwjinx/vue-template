<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const { toggleTheme } = useTheme()

const formRef = ref<FormInstance>()
const loading = ref(false)
const form = reactive({
  username: '',
  password: '',
})
const rules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

async function handleLogin() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid)
    return
  loading.value = true
  try {
    await userStore.login(form.username, form.password)
    ElMessage.success('登录成功')
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
    await router.push(redirect)
  }
  catch (err) {
    ElMessage.error(err instanceof Error ? err.message : '登录失败')
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-wrapper">
    <ElButton class="theme-toggle" text @click="toggleTheme">
      切换模式
    </ElButton>
    <ElCard class="login-card" shadow="always">
      <h1 class="title">
        欢迎回来
      </h1>
      <p class="subtitle">
        请登录账号以继续
      </p>
      <ElForm ref="formRef" :model="form" :rules="rules" @submit.prevent="handleLogin">
        <ElFormItem prop="username">
          <ElInput v-model="form.username" placeholder="用户名" size="large" />
        </ElFormItem>
        <ElFormItem prop="password">
          <ElInput v-model="form.password" type="password" show-password placeholder="密码" size="large" @keyup.enter="handleLogin" />
        </ElFormItem>
        <ElButton type="primary" size="large" class="submit" :loading="loading" @click="handleLogin">
          登 录
        </ElButton>
      </ElForm>
    </ElCard>
  </div>
</template>

<style scoped>
.login-wrapper {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-page, var(--el-bg-color-page));
}
.login-card {
  width: 100%;
  max-width: 420px;
}
.title {
  margin: 0 0 8px;
  text-align: center;
  font-size: 24px;
}
.subtitle {
  margin: 0 0 24px;
  text-align: center;
  color: var(--el-text-color-secondary);
}
.submit {
  width: 100%;
}
.theme-toggle {
  position: fixed;
  top: 16px;
  right: 16px;
}
</style>
