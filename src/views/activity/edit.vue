<template>
  <activity-form :is-edit="true" />
</template>
<script>
import ActivityForm from './components/ActivityForm'
export default {
  name: 'ActivityEdit',
  components: { ActivityForm }
}
</script>
