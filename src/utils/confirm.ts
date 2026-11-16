import { ElMessageBox } from 'element-plus'

export function confirm(content: string, title = '提示') {
  return new Promise<void>((resolve, reject) => {
    ElMessageBox.confirm(content, title, {
      type: 'warning',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    })
      .then(() => resolve())
      .catch(() => reject(new Error('cancel')))
  })
}
