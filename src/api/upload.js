import request from '@/utils/request'

export function image(data) {
  return request({
    url: '/upload_image',
    method: 'post',
    data
  })
}
