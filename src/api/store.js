import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/stores',
    method: 'get',
    params: query
  })
}

export function fetchStore(id) {
  return request({
    url: '/stores/' + id,
    method: 'get'
  })
}

export function createStore(data) {
  return request({
    url: '/stores',
    method: 'post',
    data
  })
}

export function updateStore(id, data) {
  return request({
    url: '/stores/' + id,
    method: 'put',
    data
  })
}

export function destroy(id) {
  return request({
    url: '/stores/' + id,
    method: 'delete'
  })
}
