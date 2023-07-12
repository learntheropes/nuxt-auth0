<script setup>
definePageMeta({
  auth: false,
});
</script>

<template>
  <NuxtLayout>
    <h1>This is the home page, a public page</h1>
    <NuxtLink to="/dashboard">Go to dashboard, a protected route</NuxtLink>
  </NuxtLayout>
</template>
