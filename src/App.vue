<script setup>
import { Vue3Snackbar } from "vue3-snackbar";
import { useAppStore } from "./store";
import { storeToRefs } from "pinia";
import Sidenav from "./components/Sidenav.vue";
import AppHeader from "./components/AppHeader.vue";
import { ref, watchEffect } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const state = useAppStore();
const { isAuth } = storeToRefs(state);

const active = ref("");
watchEffect(() => {
  active.value = `${route.name}`;
});
</script>

<template>
  <div class="min-h-[100vh] w-full flex flex-col items-stretch">
    <sidenav :active="active" v-if="isAuth" />

    <div
      class="w-full bg-backdrop min-h-[100vh]"
      :class="{ 'lg:ml-auto lg:w-[75%] xl:w-[82%]': isAuth }"
    >
      <AppHeader v-if="isAuth" />
      <div 
      class="w-full"
      :class="{'lg:max-w-[1024px] xl:max-w-[1280px] 2xl:max-w-[1440px] mx-auto': isAuth}"
      >
      <router-view></router-view>
    </div>
    </div>
  </div>
  <vue3-snackbar top right :duration="4000"></vue3-snackbar>
</template>
