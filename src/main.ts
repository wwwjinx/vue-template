import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { createApp } from 'vue'
import App from '@/App.vue'
import { setupPermissionDirectives } from '@/directive/permission'
import router from '@/router'
import pinia from './stores'
import 'virtual:uno.css'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import '@/styles/index.css'

const app = createApp(App)

app.config.errorHandler = (err, instance, info) => {
  console.error(`errorHandler:: ${err}`, {
    info,
    componentName: instance?.$options.__name,
    instance,
  })
}

app.use(pinia)
app.use(router)
app.use(ElementPlus, { locale: zhCn })
setupPermissionDirectives(app)
app.mount('#app')

router.onError((error, to, from) => {
  console.error(`routerError:: ${error}`, { to, from })
})
