import request from '@/utils/request'
import qs from 'qs'

export function fetchList(id, query) {
  return request({
    url: '/recharge-card/' + id + '/items',
    method: 'get',
    params: {
      filter: {
        code: query.code,
        status: query.status
      },
      page: query.page,
      limit: query.limit
    },
    paramsSerializer: params => {
      return qs.stringify(params, { indices: true })
    }
  })
}
export function updateItemStatus(id, data) {
  return request({
    url: '/recharge-card/items/' + id,
    method: 'patch',
    data
  })
}
export function createItem(id, data) {
  return request({
    url: '/recharge-card/' + id + '/items',
    method: 'post',
    data
  })
}
export function importRechargeCard(coupon_id, data) {
  return request({
    url: `/import/recharge-card/${coupon_id}/item`,
    method: 'post',
    data
  })
}
export function exportItem(id) {
  return request({
    url: `/export/recharge-card/${id}`,
    method: 'get',
    responseType: 'blob'
  })
}
export function importRechargeCardTemplate() {
  return request({
    url: `/import/template/recharge-card`,
    method: 'get',
    responseType: 'blob'
  })
}
export function bulkUpdateItem(data) {
  return request({
    url: '/recharge-card/items/bulk-update',
    method: 'patch',
    data
  })
}
