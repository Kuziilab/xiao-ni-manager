// SVG 图标组件集合
// 统一规格：24×24 viewBox, 1.5px stroke, currentColor, fill="none"
// 使用：import { IconSearch } from '../icons/index.js'
// 渲染：<IconSearch class="icon" />

// 函数式组件工厂
const icon = (name, paths) => ({
  name,
  functional: true,
  props: { size: { default: 24 } },
  render(h, { props }) {
    return h('svg', {
      attrs: {
        xmlns: 'http://www.w3.org/2000/svg',
        width: props.size,
        height: props.size,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        'stroke-width': '1.5',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
      }
    }, paths.map(d => h('path', { attrs: { d } })))
  }
})

// 搜索 - 放大镜
export const IconSearch = icon('IconSearch', [
  'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z',
  'M21 21l-4.35-4.35'
])

// 添加 - 圆圈加号
export const IconAdd = icon('IconAdd', [
  'M12 5v14',
  'M5 12h14'
])

// 盒子 - 仓库/商品
export const IconBox = icon('IconBox', [
  'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z',
  'M3.27 6.96L12 12.01l8.73-5.05',
  'M12 22.08V12'
])

// 标签 - 商品
export const IconTag = icon('IconTag', [
  'M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z',
  'M7 7h.01'
])

// 文件夹加号 - 新分类
export const IconFolder = icon('IconFolder', [
  'M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z',
  'M12 11v6',
  'M9 14h6'
])

// 金钱 - 售出/价格
export const IconMoney = icon('IconMoney', [
  'M12 2v20',
  'M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6'
])

// 编辑 - 铅笔
export const IconEdit = icon('IconEdit', [
  'M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z'
])

// 删除 - 垃圾桶
export const IconDelete = icon('IconDelete', [
  'M3 6h18',
  'M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2',
  'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6',
  'M10 11v6',
  'M14 11v6'
])

// 完成 - 圆圈打勾
export const IconCheck = icon('IconCheck', [
  'M22 11.08V12a10 10 0 1 1-5.93-9.14',
  'M22 4L12 14.01l-3-3'
])

// 取消/关闭 - 叉号
export const IconClose = icon('IconClose', [
  'M18 6L6 18',
  'M6 6l12 12'
])

// 日历
export const IconCalendar = icon('IconCalendar', [
  'M8 2v4',
  'M16 2v4',
  'M3 10h18',
  'M21 4H3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z'
])

// 筛选 - 三条横线滑块
export const IconFilter = icon('IconFilter', [
  'M4 21v-7',
  'M4 10V3',
  'M12 21v-9',
  'M12 8V3',
  'M20 21v-5',
  'M20 12V3',
  'M1 14h6',
  'M9 8h6',
  'M17 16h6'
])

// 下载 - 备份
export const IconDownload = icon('IconDownload', [
  'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4',
  'M7 10l5 5 5-5',
  'M12 15V3'
])

// 上传 - 恢复
export const IconUpload = icon('IconUpload', [
  'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4',
  'M17 8l-5-5-5 5',
  'M12 3v12'
])

// 星星 - 今日目标
export const IconStar = icon('IconStar', [
  'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'
])

// 靶心 - 长期目标
export const IconTarget = icon('IconTarget', [
  'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z',
  'M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z',
  'M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z'
])

// 收入 - 向上箭头
export const IconIncome = icon('IconIncome', [
  'M12 19V5',
  'M5 12l7-7 7 7'
])

// 支出 - 向下箭头
export const IconExpense = icon('IconExpense', [
  'M12 5v14',
  'M19 12l-7 7-7-7'
])

// 统计 - 柱状图
export const IconChart = icon('IconChart', [
  'M18 20V10',
  'M12 20V4',
  'M6 20v-6'
])

// 右箭头 - 列表项跳转
export const IconArrowRight = icon('IconArrowRight', [
  'M9 18l6-6-6-6'
])

// 左箭头
export const IconArrowLeft = icon('IconArrowLeft', [
  'M15 18l-6-6 6-6'
])

// 相机 - 拍照
export const IconCamera = icon('IconCamera', [
  'M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z',
  'M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'
])

// 图片
export const IconImage = icon('IconImage', [
  'M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z',
  'M8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z',
  'M21 15l-5-5L5 21'
])

// 仓库标签栏图标
export const IconWarehouse = icon('IconWarehouse', [
  'M3 21V9l9-7 9 7v12',
  'M3 21h6v-6h6v6h6'
])

// 记事标签栏图标
export const IconNotes = icon('IconNotes', [
  'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z',
  'M14 2v6h6',
  'M16 13H8',
  'M16 17H8',
  'M10 9H8'
])

// 记账标签栏图标
export const IconAccounting = icon('IconAccounting', [
  'M12 1v2',
  'M12 21v2',
  'M4.22 2h15.56',
  'M4.22 22h15.56',
  'M1 4.22v15.56',
  'M23 4.22v15.56',
  'M4 12h16',
  'M8 5v14',
  'M16 5v14'
])

// 我标签栏图标
export const IconProfile = icon('IconProfile', [
  'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2',
  'M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'
])

// 更多 - 三个点
export const IconMore = icon('IconMore', [
  'M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z',
  'M19 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z',
  'M5 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z'
])

// 备份 - 保存图标
export const IconSave = icon('IconSave', [
  'M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z',
  'M17 21v-8H7v8',
  'M7 3v5h8'
])

// 位置
export const IconLocation = icon('IconLocation', [
  'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z',
  'M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'
])

// 时钟
export const IconClock = icon('IconClock', [
  'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z',
  'M12 6v6l4 2'
])

// 杯子 - 手工/工艺
export const IconCraft = icon('IconCraft', [
  'M18 8h1a4 4 0 0 1 0 8h-1',
  'M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z',
  'M6 1v3',
  'M10 1v3',
  'M14 1v3'
])

// 购物车
export const IconCart = icon('IconCart', [
  'M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6'
])
