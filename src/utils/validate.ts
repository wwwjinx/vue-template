export function isExternal(path: string | undefined | null): boolean {
  if (!path)
    return false
  return /^(?:https?:|mailto:|tel:)/.test(path)
}
