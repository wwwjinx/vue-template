import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import pinia from './stores'
import 'virtual:uno.css'
import '@/styles/index.css'

const app = createApp(App)

app.use(pinia)
app.use(router)
app.mount('#app')

// 全局错误处理

app.config.errorHandler = (err, vm, info) => {
  console.error(`errorHandler:: ${err}`, {
    info,
    componentName: vm?.$options.__name,
    vm,
  })
}

router.onError((error, to, from) => {
  console.error(`routerError:: ${error}`, { to, from })
})
