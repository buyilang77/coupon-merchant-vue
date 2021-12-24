import request from '@/utils/request'
import qs from 'qs'

export function fetchList(query) {
  return request({
    url: '/recharge-card',
    method: 'get',
    params: {
      filter: {
        name: query.name
      },
      page: query.page,
      limit: query.limit
    },
    paramsSerializer: params => {
      return qs.stringify(params, { indices: true })
    }
  })
}
export function fetchOrders(query) {
  console.log(query)
  return request({
    url: '/recharge-card/orders',
    method: 'get',
    params: {
      filter: {
        order_num: query.order_num
      },
      page: query.page,
      limit: query.limit
    },
    paramsSerializer: params => {
      return qs.stringify(params, { indices: true })
    }
  })
}

export function createData(data) {
  return request({
    url: '/recharge-card',
    method: 'post',
    data
  })
}

export function fetchData(id) {
  return request({
    url: '/recharge-card/' + id,
    method: 'get'
  })
}

export function updateData(id, data) {
  return request({
    url: '/recharge-card/' + id,
    method: 'put',
    data
  })
}

export function destroyData(id) {
  return request({
    url: '/recharge-card/' + id,
    method: 'delete'
  })
}
