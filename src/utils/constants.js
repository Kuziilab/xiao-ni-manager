// 应用常量

// 商品状态
export const PRODUCT_STATUS = {
  unsold: { label: '未售出', color: 'var(--color-status-unsold)' },
  sold: { label: '已售出', color: 'var(--color-status-sold)' },
  'pending-listing': { label: '待上架', color: 'var(--color-status-pending-listing)' },
  'personal-selling': { label: '个人正售', color: 'var(--color-status-personal-selling)' },
  consignment: { label: '商家寄售', color: 'var(--color-status-consignment)' }
}

export const PRODUCT_STATUS_LIST = Object.entries(PRODUCT_STATUS).map(([value, info]) => ({
  value,
  label: info.label,
  color: info.color
}))

// 目标类型
export const GOAL_TYPE = {
  daily: '每日目标',
  'long-term': '长期目标'
}

// 收支类型
export const TRANSACTION_TYPE = {
  income: '收入',
  expense: '支出'
}

// 默认收支类别
export const DEFAULT_INCOME_CATEGORIES = ['上课', '设计', '定制', '批发', '其他收入']
export const DEFAULT_EXPENSE_CATEGORIES = ['材料', '工具', '包装', '运费', '摊位费', '其他支出']

// 数据库名称和版本
export const DB_NAME = 'xiaoNiManagerDB'
export const DB_VERSION = 1

// 图片处理参数
export const IMAGE_MAX_WIDTH = 800
export const IMAGE_QUALITY = 0.75
export const DIARY_IMAGE_MAX_WIDTH = 1200
export const DIARY_IMAGE_QUALITY = 0.80

// 备份提醒间隔（毫秒）
export const BACKUP_REMINDER_MS = 7 * 24 * 60 * 60 * 1000
