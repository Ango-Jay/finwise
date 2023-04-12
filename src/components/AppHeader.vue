<script setup>
import { useAppStore } from "../store";
import { storeToRefs } from "pinia";
import { liveQuery } from "dexie";
import { useObservable } from "@vueuse/rxjs";
import { db } from "../services/db";
import { watchEffect, ref } from "vue";

const store = useAppStore()
const { user, isMobile } = storeToRefs(store);
const users = useObservable(liveQuery(() => db.users.toArray())) || [];
const currentUser = ref({})
const imageSrc = ref("")
watchEffect(()=>{
if(users.value?.length){
  currentUser.value = users.value?.find(
          (item) => item?.uniqueId === user.value.id
        ); 
}
if (Object.keys(currentUser.value).length && currentUser.value?.image ) {
    const image = URL.createObjectURL(currentUser.value.image);
   imageSrc.value = image
  }
})
watchEffect(()=>{
  if(Object.keys(currentUser.value).length){
    store.updateUser(currentUser.value)
    console.log("REPEAT");
  }   
})
</script>

<template>
  <header
    class="w-full h-[76px] flex items-center  shadow px-6 sm:px-10 sticky top-0 bg-backdrop z-[20]"
  >
  <button
  class="w-[30px] min-w-[30px] h-[30px] flex lg:hidden mr-10"
  @click="store.toggleMobile"
  >
  <inline-svg
            src="src/assets/icon/nav_burger.svg"
            class="fill-light hover:fill-primary"
            width="30"
            height="30"
            aria-label="nav"
          ></inline-svg>
  </button>
    <RouterLink to="/settings" class="flex items-center">
      <div v-if="currentUser.image" class="w-[40px] min-w-[40px] h-[40px] rounded-full">
      <img :src="imageSrc" alt="user" class="w-full h-full object-cover rounded-full">
      </div>
      <div
        v-else
        class="w-[40px] min-w-[40px] h-[40px] rounded-full flex items-center justify-center text-primary bg-dark"
      >
        <h2 class="font-semibold text-lg uppercase">
          {{ user.firstname.charAt(0) }}

          <span class="">
            {{ user.lastname.charAt(0) }}
          </span>
        </h2>
      </div>
      <!-- <h2 class="text-light font-semibold capitalise ml-2">
        {{ user.firstname }}
        <span class="ml-1">
          {{ user.lastname }}
        </span>
      </h2> -->
    </RouterLink>

    <div class="flex items-center ml-auto">
      <div
        class="relative w-[20px] hover:w-[300px] group transition-[width] duration-[300ms]"
      >
        <input
          type="text"
          class="w-full h-full py-2 group-hover:pl-[2rem] appearance-none bg-light rounded-2xl text-dark opacity-0 group-hover:opacity-100"
        />
        <div class="absolute top-[50%] translate-y-[-50%] left-[5px]">
          <inline-svg
            src="src/assets/icon/magnifying-glass-solid.svg"
            class="fill-light group-hover:fill-dark"
            width="20"
            height="20"
            aria-label="search"
          ></inline-svg>
        </div>
      </div>
      <div class="relative btn-style cursor-pointer ml-8">
        <inline-svg
          src="src/assets/icon/bell-solid.svg"
          class="fill-light"
          width="20"
          height="20"
          aria-label="notifications"
        ></inline-svg>
        <div
          class="w-[5px] min-w-[10px] h-[10px] rounded-full bg-primary absolute top-[-5px] right-0"
        ></div>
      </div>
    </div>
  </header>
  <div
  v-if="isMobile"
  class="drawer-overlay"
  @click="store.toggleMobile"
  >

  </div>
</template>
