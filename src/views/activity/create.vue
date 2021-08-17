<template>
  <activity-form :is-edit="false" />
</template>
<script>
import ActivityForm from './components/ActivityForm'
export default {
  name: 'ActivityEdit',
  components: { ActivityForm }
}
</script>
