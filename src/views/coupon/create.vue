<template>
  <coupon-form :is-edit="false" />
</template>
<script>
import CouponForm from './components/CouponForm'
export default {
  name: 'CouponCreate',
  components: { CouponForm }
}
</script>
