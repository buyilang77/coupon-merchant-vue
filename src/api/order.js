import request from '@/utils/request'
import qs from 'qs'

export function fetchList(query) {
  return request({
    url: '/orders',
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

export function updateOrder(id, data) {
  return request({
    url: '/orders/' + id,
    method: 'patch',
    data
  })
}

export function orderShipment(id, data) {
  return request({
    url: '/orders/' + id + '/shipment',
    method: 'patch',
    data
  })
}

export function fetchLogisticsCompanies() {
  return request({
    url: '/logistics-companies',
    method: 'get'
  })
}
