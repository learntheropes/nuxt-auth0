<script setup>
const props = defineProps({
  error: Object,
  required: true,
});

const handleError = () => clearError({ redirect: '/' });
</script>

<template>
  <div>
    <div>This is the error page</div>
    <div>Error Code: {{ error.statusCode }}</div>
    <div>Error Message: {{ error.statusMessage }}</div>
    <div><button @click="handleError">Go to the home page</button></div>
  </div>
</template>