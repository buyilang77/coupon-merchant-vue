import request from '@/utils/request'
import qs from 'qs'

export function fetchList(query) {
  return request({
    url: '/coupons',
    method: 'get',
    params: {
      filter: {
        title: query.title,
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

export function createCoupon(data) {
  return request({
    url: '/coupons',
    method: 'post',
    data
  })
}

export function updateCoupon(id, data) {
  return request({
    url: '/coupons/' + id,
    method: 'put',
    data
  })
}
export function destroyCoupon(id) {
  return request({
    url: '/coupons/' + id,
    method: 'delete'
  })
}
