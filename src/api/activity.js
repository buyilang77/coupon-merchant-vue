import request from '@/utils/request'
import qs from 'qs'

export function fetchList(query) {
  return request({
    url: '/activities',
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

export function createActivity(data) {
  return request({
    url: '/activities',
    method: 'post',
    data
  })
}

export function fetchActivity(id) {
  return request({
    url: '/activities/' + id,
    method: 'get'
  })
}

export function updateActivity(id, data) {
  return request({
    url: '/activities/' + id,
    method: 'put',
    data
  })
}

export function destroyActivity(id) {
  return request({
    url: '/activities/' + id,
    method: 'delete'
  })
}
