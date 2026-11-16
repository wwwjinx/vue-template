import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getInfo, getRouters, login, logout } from '@/api/login'
import { request } from '@/utils/request'

vi.mock('@/utils/request', () => ({
  request: vi.fn(),
  default: vi.fn(),
}))

const requestMock = vi.mocked(request)

describe('login api', () => {
  beforeEach(() => {
    requestMock.mockReset()
  })

  it('posts /login with username/password and ignoreAuth', async () => {
    requestMock.mockResolvedValue({ token: 'tok-1' })
    const res = await login('admin', 'admin123')

    expect(requestMock).toHaveBeenCalledTimes(1)
    expect(requestMock).toHaveBeenCalledWith({
      url: '/login',
      method: 'post',
      data: { username: 'admin', password: 'admin123' },
      meta: { ignoreAuth: true },
    })
    expect(res.token).toBe('tok-1')
  })

  it('reads user/roles/permissions from unwrapped getInfo data', async () => {
    requestMock.mockResolvedValue({
      user: { userId: 1, userName: 'admin', nickName: '管理员' },
      roles: ['admin'],
      permissions: ['*:*:*'],
    })
    const res = await getInfo()
    expect(requestMock).toHaveBeenCalledWith({ url: '/getInfo', method: 'get' })
    expect(res.user.userName).toBe('admin')
    expect(res.permissions).toContain('*:*:*')
  })

  it('loads getRouters and logout with expected paths', async () => {
    requestMock.mockResolvedValueOnce([]).mockResolvedValueOnce(undefined)
    await getRouters()
    await logout()
    expect(requestMock).toHaveBeenNthCalledWith(1, { url: '/getRouters', method: 'get' })
    expect(requestMock).toHaveBeenNthCalledWith(2, { url: '/logout', method: 'post' })
  })
})
