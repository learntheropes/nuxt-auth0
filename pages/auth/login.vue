<script setup>
definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: `/dashboard`,
  },
});

const { signIn } = useAuth();

const email = ref(null);

const signInHandler = async () => {
  try {
    await signIn('magic-link', {
      email: email.value,
      callbackUrl: `/dashboard`,
    });
  } catch (error) {
    alert(error);
  }
};
const { query } = useRoute();
</script>

<template>
  This page query: {{ query }}
  <NuxtLayout>
    <form @submit.prevent="signInHandler">
      <input v-model="email" />
      <input type="submit" value="Send email" />
    </form>
  </NuxtLayout>
</template>
