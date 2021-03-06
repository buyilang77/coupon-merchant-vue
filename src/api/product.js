import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/products',
    method: 'get',
    params: query
  })
}

export function fetchProduct(id) {
  return request({
    url: '/products/' + id,
    method: 'get'
  })
}

export function createProduct(data) {
  return request({
    url: '/products',
    method: 'post',
    data
  })
}

export function updateProduct(id, data) {
  return request({
    url: '/products/' + id,
    method: 'put',
    data
  })
}

export function destroy(id) {
  return request({
    url: '/products/' + id,
    method: 'delete'
  })
}
