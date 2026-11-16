import type { App, Directive } from 'vue'
import { hasPermission, hasRole } from '@/utils/auth'

function mounted(el: HTMLElement, allowed: boolean) {
  if (!allowed)
    el.parentNode?.removeChild(el)
}

export const hasPermi: Directive<HTMLElement, string | string[]> = {
  mounted(el, binding) {
    mounted(el, hasPermission(binding.value))
  },
}

export const hasRoleDirective: Directive<HTMLElement, string | string[]> = {
  mounted(el, binding) {
    mounted(el, hasRole(binding.value))
  },
}

export function setupPermissionDirectives(app: App) {
  app.directive('hasPermi', hasPermi)
  app.directive('hasRole', hasRoleDirective)
}
