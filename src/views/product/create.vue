<template>
  <product-form :is-edit="false" />
</template>
<script>
import ProductForm from './components/ProductForm'
export default {
  components: { ProductForm }
}
</script>
