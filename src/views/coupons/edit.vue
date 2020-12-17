<template>
  <coupon-form :is-edit="true" />
</template>
<script>
import CouponForm from './components/CouponForm'
export default {
  name: 'CouponEdit',
  components: { CouponForm }
}
</script>
