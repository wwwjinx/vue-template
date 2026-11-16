import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    icon?: string
    noCache?: boolean
    link?: string
    affix?: boolean
    activeMenu?: string
    hidden?: boolean
  }
}

export {}
