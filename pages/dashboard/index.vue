<script setup>
const { status, data, signOut } = useAuth();

const user = ref(null);

const getEmail = async () => {
  user.value = await $fetch('/api/dashboard/user', {
    credentials: 'include',
  });
};

const logOut = async () => {
  await signOut('auth0');
};
</script>

<template>
  <NuxtLayout>
    <div><h1>This is the dashboard page, a protected route</h1></div>
    <div><NuxtLink to="/">Go to home</NuxtLink></div>
    <div>Status: {{ status }}</div>
    <div>Data: {{ data }}</div>
    <div><button @click="getEmail">Get user (protected api call)</button>{{ user }}</div>
    <div><button @click="logOut">logout</button></div>
  </NuxtLayout>
</template>
