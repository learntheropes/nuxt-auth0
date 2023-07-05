<script setup>
definePageMeta({
  auth: false,
});
const domain = ref(null);
onMounted(() => {
  domain.value = window.location.hostname;
});
</script>

<template>
  This domain: {{ domain }}
  <NuxtLayout>
    <h1>This is the home page</h1>
    <NuxtLink to="/dashboard">Go to dashboard</NuxtLink>
  </NuxtLayout>
</template>
