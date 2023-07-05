<script setup>
const { status, data, signOut } = useAuth();

const email = ref(null);

const getEmail = async () => {
  const user = await $fetch('/api/dashboard/user', {
    credentials: 'include',
  });
  email.value = user.email;
  return user;
};

const logOut = async () => {
  await signOut();
};
</script>

<template>
  <NuxtLayout>
    <div><h1>This is the dashboard page, a proteted route</h1></div>
    <div><button @click="getEmail">Get user</button></div>
    <div><NuxtLink to="/">Go to home</NuxtLink></div>
    <div>{{ email }}</div>
    <div><button @click="logOut">logout</button></div>
    <div>Status: {{ status }}</div>
    <div>Data: {{ data }}</div>
  </NuxtLayout>
</template>
