import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/electronic-card-template',
    method: 'get',
    params: {
      page: query.page,
      limit: query.limit
    }
  })
}
export function createData(data) {
  return request({
    url: '/electronic-card-template',
    method: 'post',
    data
  })
}
export function fetchData(id) {
  return request({
    url: '/electronic-card-template/' + id,
    method: 'get'
  })
}
export function updateData(id, data) {
  return request({
    url: '/electronic-card-template/' + id,
    method: 'put',
    data
  })
}
export function destroyData(id) {
  return request({
    url: '/electronic-card-template/' + id,
    method: 'delete'
  })
}
