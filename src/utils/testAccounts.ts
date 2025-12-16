/**
 * 测试账号配置
 * 这些账号可以用于开发和测试环境
 */

export interface TestAccount {
  email: string
  password: string
  name: string
  role: 'admin' | 'trader' | 'user'
  balance?: number
  description?: string
}

/**
 * 预定义的测试账号列表
 */
export const testAccounts: TestAccount[] = [
  {
    email: 'admin@test.com',
    password: 'Admin123456!',
    name: '管理员',
    role: 'admin',
    balance: 1000000,
    description: '系统管理员账号，拥有所有权限'
  },
  {
    email: 'trader@test.com',
    password: 'Trader123456!',
    name: '专业交易员',
    role: 'trader',
    balance: 500000,
    description: '专业交易员账号，用于测试跟单功能'
  },
  {
    email: 'user1@test.com',
    password: 'User123456!',
    name: '普通用户1',
    role: 'user',
    balance: 100000,
    description: '普通用户账号1，用于测试基本交易功能'
  },
  {
    email: 'user2@test.com',
    password: 'User123456!',
    name: '普通用户2',
    role: 'user',
    balance: 50000,
    description: '普通用户账号2，用于测试多用户交互'
  },
  {
    email: 'vip@test.com',
    password: 'Vip123456!',
    name: 'VIP用户',
    role: 'user',
    balance: 2000000,
    description: 'VIP用户账号，用于测试高级功能'
  }
]

/**
 * 获取测试账号
 */
export function getTestAccount(email: string): TestAccount | undefined {
  return testAccounts.find(account => account.email === email)
}

/**
 * 获取所有测试账号的邮箱列表
 */
export function getTestAccountEmails(): string[] {
  return testAccounts.map(account => account.email)
}

/**
 * 验证是否为测试账号
 */
export function isTestAccount(email: string): boolean {
  return testAccounts.some(account => account.email === email)
}

/**
 * 默认测试账号（用于快速登录）
 */
export const defaultTestAccount: TestAccount = testAccounts[0]
