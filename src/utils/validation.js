// 表单验证

export function required(value, fieldName = '此项') {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return `${fieldName}不能为空`
  }
  return null
}

export function isNumber(value, fieldName = '此项') {
  const num = Number(value)
  if (isNaN(num)) {
    return `${fieldName}必须是数字`
  }
  return null
}

export function isPositiveNumber(value, fieldName = '此项') {
  const num = Number(value)
  if (isNaN(num) || num < 0) {
    return `${fieldName}必须是非负数字`
  }
  return null
}

export function isPositive(value, fieldName = '此项') {
  const num = Number(value)
  if (isNaN(num) || num <= 0) {
    return `${fieldName}必须是正数`
  }
  return null
}

export function maxLength(value, max, fieldName = '此项') {
  if (value && value.length > max) {
    return `${fieldName}不能超过${max}个字符`
  }
  return null
}

export function validateProduct(form) {
  const errors = {}
  if (!form.name?.trim()) errors.name = '请输入商品名称'
  if (!form.sellingPrice || Number(form.sellingPrice) < 0) errors.sellingPrice = '请输入有效售价'
  if (form.status && !['unsold', 'sold', 'pending-listing', 'personal-selling', 'consignment'].includes(form.status)) {
    errors.status = '请选择有效状态'
  }
  return Object.keys(errors).length ? errors : null
}

export function validateBatch(form) {
  const errors = {}
  if (!form.quantity || Number(form.quantity) <= 0) errors.quantity = '请输入有效数量'
  if (form.unitCost === '' || Number(form.unitCost) < 0) errors.unitCost = '请输入有效成本'
  return Object.keys(errors).length ? errors : null
}

export function validateCategory(form) {
  const errors = {}
  if (!form.name?.trim()) errors.name = '请输入分类名称'
  return Object.keys(errors).length ? errors : null
}

export function validateGoal(form) {
  const errors = {}
  if (!form.name?.trim()) errors.name = '请输入目标名称'
  return Object.keys(errors).length ? errors : null
}
