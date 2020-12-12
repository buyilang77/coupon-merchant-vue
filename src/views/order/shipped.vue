<template>
  <order-list :type="type" />
</template>
<script>
import OrderList from './components/OrderList'
export default {
  components: { OrderList },
  data() {
    return {
      type: 'shipped'
    }
  }
}
</script>
