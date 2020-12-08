import request from '@/utils/request'
import qs from 'qs'

export function fetchList(id, query) {
  return request({
    url: '/coupons/' + id + '/items',
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

export function updateItem(id, data) {
  return request({
    url: '/coupons/' + id + '/item',
    method: 'patch',
    data
  })
}
