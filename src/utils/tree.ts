export function handleTree<T extends Record<string, unknown>>(
  data: T[],
  id = 'id',
  parentId = 'parentId',
  children = 'children',
): T[] {
  const childrenListMap = new Map<unknown, T[]>()
  const nodeIds = new Map<unknown, T>()
  const tree: T[] = []

  for (const item of data) {
    const pid = item[parentId]
    const list = childrenListMap.get(pid) ?? []
    list.push(item)
    childrenListMap.set(pid, list)
    nodeIds.set(item[id], item)
  }

  for (const item of data) {
    if (!nodeIds.has(item[parentId]))
      tree.push(item)
  }

  function assignChildren(item: T) {
    const childList = childrenListMap.get(item[id])
    if (childList) {
      Object.assign(item, { [children]: childList })
      childList.forEach(assignChildren)
    }
  }

  tree.forEach(assignChildren)
  return tree
}
