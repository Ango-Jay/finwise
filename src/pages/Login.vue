<script setup>
import { reactive, ref, computed, watch, defineAsyncComponent } from "vue";
import { liveQuery } from "dexie";
import { useObservable } from "@vueuse/rxjs";
import { db } from "../services/db";
import { RouterLink, useRouter } from "vue-router";
import { useVuelidate } from "@vuelidate/core";
import { required, email, minLength, helpers } from "@vuelidate/validators";
import { useSnackbar } from "vue3-snackbar";
import { useAppStore } from "../store";
import Spinner from "../components/loader-utils/Spinner.vue";
import Logo from "../assets/img/logo-main.png";
import Eye from "../assets/icon/password-eye.svg";
import EyeSlash from "../assets/icon/eye-slash-solid.svg";

const Slider = defineAsyncComponent(() => import("../components/Slider.vue"));

const appStore = useAppStore();
const router = useRouter();
const snackbar = useSnackbar();
const users = useObservable(liveQuery(() => db.users.toArray())) || [];

const state = reactive({
  email: "",
  password: "",
});
const clearForm = () => {
  state.email = "";
  state.password = "";
};
const rules = computed(() => {
  return {
    email: {
      required: helpers.withMessage("Please enter a valid email", required),
      email: helpers.withMessage("Please enter a valid email", email),
      $autoDirty: true,
    },
    password: {
      required: helpers.withMessage("Please enter a password", required),
      min: helpers.withMessage(
        "Password cannot be less than eight characters",
        minLength(8)
      ),
      $autoDirty: true,
    },
  };
});
const v$ = useVuelidate(rules, state);
const isSuccess = ref(false);
const isLoading = ref(false);

const showPassword = ref(false);
const togglePasswordInputType = computed(() => {
  if (showPassword.value) return "text";
  return "password";
});

watch(showPassword, (newVal, oldVal) => {
  console.log("new: ", newVal, " old: ", oldVal);
});

const handleLogin = async () => {
  const isFormCorrect = await v$.value.$validate();
  if (isFormCorrect) {
    try {
      isLoading.value = true;

      setTimeout(async () => {
        const currentUser = users.value?.find(
          (user) => user?.email === state.email
        );

        if (currentUser) {
          const isPasswordCorrect = currentUser.password === state.password;
          if (isPasswordCorrect) {
            isLoading.value = false;
            isSuccess.value = true;
            appStore.$patch((store) => {
              store.isAuth = true;
              store.user = {
                firstname: currentUser.firstname,
                lastname: currentUser.lastname,
                email: currentUser.email,
                id: currentUser.uniqueId,
              };
            });
            snackbar.add({
              type: "success",
              text: "Success",
            });
            router.push({
              name: "home",
            });
          } else {
            isLoading.value = false;
            isSuccess.value = false;
            state.password = "";
            snackbar.add({
              type: "error",
              text: "Wrong password",
            });
          }
        } else {
          isLoading.value = false;
          isSuccess.value = false;
          clearForm();
          snackbar.add({
            type: "error",
            text: "User does not exist",
          });
          // router.push("/signup")
        }
      }, 3000);
    } catch (error) {
      console.log(error);
      isLoading.value = false;
    }
  }
};
</script>

<template>
  <div
    class="w-full min-h-[100vh] bg-backdrop flex flex-col lg:flex-row items-center lg:items-start justify-center lg:justify-start pb-[5rem] lg:pb-0"
  >
    <div
      class="hidden lg:flex flex-col items-center justify-center w-full h-full min-h-[100vh] lg:w-[50%] pt-[5rem] px-8 bg-primary"
    >
      <Slider />
    </div>

    <div
      class="flex flex-col items-center justify-center w-full lg:w-[50%] pt-[5rem] px-6 sm:px-8"
    >
      <div class="flex items-center mb-4">
        <div
          class="flex justify-center items-center shrink-0 grow-0 w-[40px] min-w-[40px] h-[40px]"
        >
          <img class="w-full h-full  rounded-full object-contain" :src="Logo" alt="logo" />
        </div>
        <h2 class="text-primary text-2xl font-semibold ml-2">FinWise</h2>
      </div>
      <h4 class="text-sm sm:text-base text-light">
        Making money management a breeze.
      </h4>

      <div class="text-white text-left w-full mt-[4rem] sm:w-[400px]">
        <h1 class="text-[32px] font-semibold text-center sm:text-left">
          Welcome back&excl;
        </h1>
        <div class="border-t-3 border-primary w-[200px] rounded-lg"></div>
      </div>
<form
@submit.prevent="handleLogin"
>
      <div class="w-full mt-4 sm:w-[400px]">
        <div class="my-4 flex flex-col relative">
          <label
            class="text-light font-bold mb-2 uppercase text-[13px]"
            for="email"
            >Email</label
          >
          <input
            name="email"
            class="bg-dark appearance-none p-4 rounded-2xl text-light"
            type="email"
            v-model="state.email"
          />
          <div
            class="text-red-500 text-[13px]"
            v-for="error of v$.email.$errors"
            :key="error.$uid"
          >
            <div>{{ error.$message }}</div>
          </div>
        </div>
        <div class="my-4 flex flex-col relative">
          <label
            class="text-light font-semibold mb-2 uppercase text-[13px]"
            for="password"
            >Password</label
          >
          <a href="." class="absolute top-0 right-0 text-[13px] text-primary"
            >forgot password?</a
          >
          <input
            name="password"
            class="bg-dark appearance-none p-4 rounded-2xl text-light"
            :type="togglePasswordInputType"
            v-model="state.password"
          />
          <div
            class="text-red-500 text-[13px]"
            v-for="error of v$.password.$errors"
            :key="error.$uid"
          >
            <div>{{ error.$message }}</div>
          </div>
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="absolute flex right-4 top-[63%] translate-y-[-50%] w-[25px] h-[20px] fill-light"
          >
            <inline-svg
              :src="Eye"
              v-if="!showPassword"
              class="text-light"
              width="20"
              height="20"
              aria-label="password show"
            ></inline-svg>
            <inline-svg
              :src="EyeSlash"
              v-if="showPassword"
              class="text-light"
              width="20"
              height="20"
              aria-label="password hide"
            ></inline-svg>
          </button>
        </div>

        <button
        type="submit"
        
          class="flex justify-center items-center py-4 bg-primary text-white font-semibold w-full rounded-2xl mt-8"
        >
          <Spinner :isLoading="isLoading" />
          Login
        </button>
        <div class="text-light mt-8 text-center">
          <p>
            Don&apos;t have an account?
            <RouterLink to="/signup" class="text-primary">Sign up!</RouterLink>
          </p>
        </div>
      </div>
    </form>
    </div>
  </div>
</template>
