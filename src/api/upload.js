import request from '@/utils/request'

export function image(data) {
  return request({
    url: '/upload-image',
    method: 'post',
    data
  })
}
