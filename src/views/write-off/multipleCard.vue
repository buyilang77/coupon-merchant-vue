<template>
  <div />
</template>

<script>
export default {
  name: 'MultipleCard',
  created() {
    this.$message('该功能完善中!')
    setTimeout(() => {
      this.$router.back()
    }, 500)
  }
}
</script>

<style scoped>

</style>
