<script setup>
definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: `/dashboard`,
  },
});
</script>

<template>
  <NuxtLayout> Check your inbox </NuxtLayout>
</template>
