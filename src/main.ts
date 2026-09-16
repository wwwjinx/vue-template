import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import pinia from './stores'
import 'virtual:uno.css'
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
app.mount('#app')

router.onError((error, to, from) => {
  console.error(`routerError:: ${error}`, { to, from })
})
