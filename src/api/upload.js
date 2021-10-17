import request from '@/utils/request'

export function image(data) {
  return request({
    url: '/upload-image',
    method: 'post',
    data
  })
}
export function uploadCouponItem(coupon_id, data) {
  return request({
    url: `/import/${coupon_id}/item`,
    method: 'post',
    data
  })
}
