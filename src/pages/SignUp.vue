<script setup>
import { reactive, ref, watch, computed, defineAsyncComponent } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, email, minLength, helpers } from "@vuelidate/validators";
import { db } from "../services/db";
import { useRouter } from "vue-router";
import { useSnackbar } from "vue3-snackbar";
import Spinner from "../components/loader-utils/Spinner.vue";
import Logo from "../assets/img/logo-main.png";
import Eye from "../assets/icon/password-eye.svg";
import EyeSlash from "../assets/icon/eye-slash-solid.svg";
const Slider = defineAsyncComponent(() => import("../components/Slider.vue"));

const router = useRouter();
const snackbar = useSnackbar();
const state = reactive({
  firstname: "",
  lastname: "",
  email: "",
  password: "",
  confirmPassword: "",
  isTerms: false,
});

const valueIsSameAs = (value) => {
  return value === state.password;
};
const mustBeTrue = (value) => {
  return value === true;
};
const rules = computed(() => {
  return {
    firstname: {
      required: helpers.withMessage("Please enter a name", required),
      min: helpers.withMessage("Please enter a valid name", minLength(3)),
      $autoDirty: true,
    },
    lastname: {
      required: helpers.withMessage("Please enter a name", required),
      min: helpers.withMessage("Please enter a valid name", minLength(3)),
      $autoDirty: true,
    },
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
    confirmPassword: {
      required: helpers.withMessage("Please confirm password", required),
      min: helpers.withMessage(
        "Password cannot be less than eight characters",
        minLength(8)
      ),
      sameAs: helpers.withMessage("Passwords do not match", valueIsSameAs),
      $autoDirty: true,
    },
    isTerms: {
      mustBeTrue: helpers.withMessage("Please accept the terms", mustBeTrue),
    },
  };
});
const v$ = useVuelidate(rules, state);

const showPassword = ref(false);
const showConfirmPassword = ref(false);
const togglePasswordInputType = computed(() => {
  if (showPassword.value) return "text";
  return "password";
});
const toggleConfirmPasswordInputType = computed(() => {
  if (showConfirmPassword.value) return "text";
  return "password";
});

watch(showPassword, (newVal, oldVal) => {});
watch(showConfirmPassword, (newVal, oldVal) => {});

const isSuccess = ref(false);
const isLoading = ref(false);

const submitForm = async () => {
  const isFormCorrect = await v$.value.$validate();
  if (isFormCorrect) {
    try {
      isLoading.value = true;
      // isSuccess.value = false
      setTimeout(async () => {
        await db.users.add({
          firstname: state.firstname,
          lastname: state.lastname,
          email: state.email,
          password: state.password,
          image: null,
        });
        snackbar.add({
          type: "success",
          text: "User created",
        });
        isLoading.value = false;
        isSuccess.value = true;
        router.push("/");
      }, 3000);
    } catch (error) {
      snackbar.add({
        type: "error",
        text: "Sorry an error occured",
      });
      isLoading.value = false;
    }
  }
};
</script>
<template>
  <div
    class="w-full min-h-[100vh] bg-backdrop lg:bg-primary flex flex-col lg:flex-row items-center lg:items-start justify-center lg:justify-start pb-[5rem] lg:pb-0"
  >
    <div
      class="hidden lg:flex flex-col items-center justify-center fixed top-0 left-0 w-full h-full min-h-[100vh] lg:w-[50%] pt-[5rem] px-8 bg-primary"
    >
      <Slider />
    </div>

    <div
      class="flex flex-col items-center lg:bg-backdrop justify-center w-full lg:w-[50%] lg:ml-auto pt-[3rem] px-6 sm:px-8 lg:pb-[5rem]"
    >
      <div class="flex flex-col items-center mb-4">
        <div class="flex items-center">
          <div
            class="flex justify-center items-center w-[40px] min-w-[40px] h-[40px]"
          >
            <img
              class="w-full h-full rounded-full object-contain"
              :src="Logo"
              alt="logo"
            />
          </div>
          <h2 class="text-primary text-2xl font-semibold ml-2">FinWise</h2>
        </div>
        <!-- <h4 class="text-sm lg:hidden text-light">Making money management a breeze.</h4> -->
      </div>
      <div class="w-full sm:w-[80%] lg:pl-8 mt-8">
        <h1
          class="text-primary text-3xl font-semibold text-center lg:text-left"
        >
          Sign up
        </h1>
        <p class="text-light text-center lg:text-left text-sm mt-2">
          Create an account to start your journey to personal financial growth.
        </p>
      </div>

      <div class="w-full sm:w-[80%] py-8 sm:p-8 sm:p-0 mx-auto">
        <!-- <form
          method="POST"
          @submit.prevent="submitForm"> -->
        <div>
          <div class="my-4 flex flex-col relative">
            <label
              class="text-light font-bold mb-2 uppercase text-[13px]"
              for="firstname"
              >Firstname</label
            >
            <input
              class="bg-dark appearance-none p-4 rounded-2xl text-light"
              name="firstname"
              type="text"
              v-model="state.firstname"
            />
            <div
              class="text-red-500 text-[13px]"
              v-for="error of v$.firstname.$errors"
              :key="error.$uid"
            >
              <div>{{ error.$message }}</div>
            </div>
          </div>
          <div class="my-4 flex flex-col relative">
            <label
              class="text-light font-bold mb-2 uppercase text-[13px]"
              for="lastname"
              >Lastname</label
            >
            <input
              class="bg-dark appearance-none p-4 rounded-2xl text-light"
              name="lastname"
              type="text"
              v-model="state.lastname"
            />
            <div
              class="text-red-500 text-[13px]"
              v-for="error of v$.lastname.$errors"
              :key="error.$uid"
            >
              <div>{{ error.$message }}</div>
            </div>
          </div>
          <div class="my-4 flex flex-col relative">
            <label
              class="text-light font-bold mb-2 uppercase text-[13px]"
              for="email"
              >Email</label
            >
            <input
              class="bg-dark appearance-none p-4 rounded-2xl text-light"
              name="email"
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
              class="text-light font-bold mb-2 uppercase text-[13px]"
              for="password"
              >Password</label
            >
            <div class="relative w-full">
              <input
                class="bg-dark appearance-none p-4 rounded-2xl text-light w-full"
                name="password"
                :type="togglePasswordInputType"
                v-model="state.password"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute flex right-4 top-[50%] translate-y-[-50%] w-[25px] h-[20px] fill-light"
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
            <div
              class="text-red-500 text-[13px]"
              v-for="error of v$.password.$errors"
              :key="error.$uid"
            >
              <div>{{ error.$message }}</div>
            </div>
          </div>
          <div class="my-4 flex flex-col relative">
            <label
              class="text-light font-bold mb-2 uppercase text-[13px]"
              for="confirmPassword"
              >Confirm Password</label
            >
            <div class="relative w-full">
              <input
                class="bg-dark appearance-none p-4 rounded-2xl text-light w-full"
                name="confirmPassword"
                :type="toggleConfirmPasswordInputType"
                v-model="state.confirmPassword"
              />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute flex right-4 top-[50%] translate-y-[-50%] w-[25px] h-[20px] fill-light"
              >
                <inline-svg
                  :src="Eye"
                  v-if="!showConfirmPassword"
                  class="text-light"
                  width="20"
                  height="20"
                  aria-label="password show"
                ></inline-svg>
                <inline-svg
                  :src="EyeSlash"
                  v-if="showConfirmPassword"
                  class="text-light"
                  width="20"
                  height="20"
                  aria-label="password hide"
                ></inline-svg>
              </button>
            </div>
            <div
              class="text-red-500 text-[13px]"
              v-for="error of v$.confirmPassword.$errors"
              :key="error.$uid"
            >
              <div>{{ error.$message }}</div>
            </div>
            <div class="flex items-center mt-6 mb-4 text-light">
              <div class="relative h-[25px] w-[25px]">
                <input
                  type="checkbox"
                  class="absolute opacity-0 cursor-pointer w-full h-full relative z-[5] peer"
                  name="terms"
                  v-model="state.isTerms"
                />
                <span
                  class="absolute top-[50%] translate-y-[-50%] left-0 h-[25px] z-[2] w-[25px] bg-light hover:bg-light after:content-[''] after:absolute after:hidden after:left-[9px] after:top-[5px] after:w-[5px] after:h-[10px] after:border-solid after:border-white after:border-r-[2px] after:border-b-[2px] after:rotate-45 peer-checked:after:block peer-checked:bg-primary"
                ></span>
              </div>
              <h4 class="ml-6">
                I agree to the
                <span class="text-primary cursor-pointer"
                  >terms and conditions</span
                >
              </h4>
            </div>
            <div
              class="text-red-500 text-[13px]"
              v-for="error of v$.isTerms.$errors"
              :key="error.$uid"
            >
              <div>{{ error.$message }}</div>
            </div>
          </div>
          <button
            @click="submitForm"
            class="flex justify-center items-center py-4 bg-primary text-white font-semibold w-full rounded-2xl mt-8"
          >
            <Spinner :isLoading="isLoading" />

            Sign up
          </button>
          <!-- </form> -->
          <div class="text-light mt-8 text-center">
            <p>
              Already have an account?
              <RouterLink to="/login" class="text-primary">Log in!</RouterLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
