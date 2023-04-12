<script setup>
import { storeToRefs } from "pinia";
import { useAppStore } from "../../store";
import { reactive, ref, computed } from "vue";
import { liveQuery } from "dexie";
import { useObservable } from "@vueuse/rxjs";
import { db } from "../../services/db";
import { useSnackbar } from "vue3-snackbar";
import { useVuelidate } from "@vuelidate/core";
import { required, helpers, minLength } from "@vuelidate/validators";
import Spinner from "../../components/loader-utils/Spinner.vue";
import EyeIcon from "../../assets/icon/password-eye.svg"
import EyeSlashIcon from "../../assets/icon/eye-slash-solid.svg"

const { user } = storeToRefs(useAppStore());
const snackbar = useSnackbar();
const users = useObservable(liveQuery(() => db.users.toArray())) || [];
const state = reactive({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});
const showPassword = reactive({
  currentPassword: false,
  newPassword: false,
  confirmPassword: false,
});
const valueIsSameAs = (value) => {
  return value === state.newPassword;
};
const mustNotEqual = (value) => {
  return value !== state.currentPassword;
  // return helpers.withMessage("Old and New password cannot be the same", value.includes(state.currentPassword))
};

const rules = {
  currentPassword: {
    required: helpers.withMessage("Please enter a password", required),
    min: helpers.withMessage(
      "Password cannot be less than eight characters",
      minLength(8)
    ),
  },
  newPassword: {
    required: helpers.withMessage("Please enter a password", required),
    min: helpers.withMessage(
      "Password cannot be less than eight characters",
      minLength(8)
    ),
    mustNotEqual: helpers.withMessage(
      "Old and New password cannot be the same",
      mustNotEqual
    ),
  },
  confirmPassword: {
    required: helpers.withMessage("Please confirm password", required),
    min: helpers.withMessage(
      "Password cannot be less than eight characters",
      minLength(8)
    ),
    sameAs: helpers.withMessage("Passwords do not match", valueIsSameAs),
  },
};
const v$ = useVuelidate(rules, state);
const isSuccess = ref(false);
const isLoading = ref(false);
const clearForm = () => {
  (state.currentPassword = ""),
    (state.newPassword = ""),
    (state.confirmPassword = "");
};
const togglePasswordInputTypeCurent = computed(() => {
  if (showPassword.currentPassword) return "text";
  return "password";
});
const togglePasswordInputTypeNew = computed(() => {
  if (showPassword.newPassword) return "text";
  return "password";
});
const togglePasswordInputTypeConfirm = computed(() => {
  if (showPassword.confirmPassword) return "text";
  return "password";
});

const handleChangePassword = async () => {
  const isFormCorrect = await v$.value.$validate();
  if (isFormCorrect && users) {
    isLoading.value = true;
    setTimeout(async () => {
      try {
        const checkifOldPasswordIsValid = () => {
          const currentUser = users.value.find(
            (item) => item.uniqueId === user.value.id
          );
          if (currentUser.password === state.currentPassword) {
            return true;
          }
          return false;
        };
        if (checkifOldPasswordIsValid()) {
          await db.users.update(user.value.id, {
            password: state.newPassword,
          });

          snackbar.add({
            type: "success",
            text: "Password Updated",
          });
          isLoading.value = false;
          isSuccess.value = true;

          clearForm();
        } else {
          snackbar.add({
            type: "error",
            text: "Current password is incorrect",
          });
          isLoading.value = false;
        }
      } catch (error) {
        console.log(error);
        snackbar.add({
          type: "error",
          text: "Something went wrong",
        });
        isLoading.value = false;
      }
    }, 3000);
  }
};
</script>

<template>
  <div class="w-full px-10 mt-[3rem]">
    <div class="w-full mb-8">
      <div class="flex flex-col w-full">
        <label
          class="text-primary font-bold mb-2 text-[13px]"
          for="currentPassword"
          >Current Password</label
        >
        <div class="relative w-full">
          <input
            name="currentPassword"
            class="w-full bg-dark appearance-none px-4 py-3 rounded-2xl text-light"
            :type="togglePasswordInputTypeCurent"
            v-model="state.currentPassword"
          />
          <button
            type="button"
            @click="
              showPassword.currentPassword = !showPassword.currentPassword
            "
            class="absolute flex right-4 top-[50%] translate-y-[-50%] w-[25px] h-[20px] fill-light"
          >
            <inline-svg
              :src="EyeIcon"
              v-if="!showPassword.currentPassword"
              class="text-light"
              width="20"
              height="20"
              aria-label="password show"
            ></inline-svg>
            <inline-svg
            :src="EyeSlashIcon"
              v-if="showPassword.currentPassword"
              class="text-light"
              width="20"
              height="20"
              aria-label="password hide"
            ></inline-svg>
          </button>
        </div>
      </div>
      <div
        class="text-red-500 text-[13px]"
        v-for="error of v$.currentPassword.$errors"
        :key="error.$uid"
      >
        <div>{{ error.$message }}</div>
      </div>
      <div class="w-full mt-8 border-t border-primary"></div>
    </div>
    <div class="w-full mb-8">
      <div class="flex flex-col w-full">
        <label class="text-primary font-bold mb-2 text-[13px]" for="newPassword"
          >New Password</label
        >
        <div class="relative w-full">
          <input
            name="newPassword"
            class="w-full bg-dark appearance-none px-4 py-3 rounded-2xl text-light"
            :type="togglePasswordInputTypeNew"
            v-model="state.newPassword"
          />
          <button
            type="button"
            @click="showPassword.newPassword = !showPassword.newPassword"
            class="absolute flex right-4 top-[50%] translate-y-[-50%] w-[25px] h-[20px] fill-light"
          >
            <inline-svg
      :src="EyeIcon"
              v-if="!showPassword.newPassword"
              class="text-light"
              width="20"
              height="20"
              aria-label="password show"
            ></inline-svg>
            <inline-svg
            :src="EyeSlashIcon"
              v-if="showPassword.newPassword"
              class="text-light"
              width="20"
              height="20"
              aria-label="password hide"
            ></inline-svg>
          </button>
        </div>
      </div>
      <div
        class="text-red-500 text-[13px]"
        v-for="error of v$.newPassword.$errors"
        :key="error.$uid"
      >
        <div>{{ error.$message }}</div>
      </div>
      <div class="w-full mt-8 border-t border-primary"></div>
    </div>
    <div class="w-full mb-8">
      <div class="flex flex-col w-full">
        <label
          class="text-primary font-bold mb-2 text-[13px]"
          for="confirmPassword"
          >Confirm Password</label
        >
        <div class="relative w-full">
          <input
            name="confirmPassword"
            class="w-full bg-dark appearance-none px-4 py-3 rounded-2xl text-light"
            :type="togglePasswordInputTypeConfirm"
            v-model="state.confirmPassword"
          />
          <button
            type="button"
            @click="
              showPassword.confirmPassword = !showPassword.confirmPassword
            "
            class="absolute flex right-4 top-[50%] translate-y-[-50%] w-[25px] h-[20px] fill-light"
          >
            <inline-svg
            :src="EyeIcon"
              v-if="!showPassword.confirmPassword"
              class="text-light"
              width="20"
              height="20"
              aria-label="password show"
            ></inline-svg>
            <inline-svg
              :src="EyeSlashIcon"
              v-if="showPassword.confirmPassword"
              class="text-light"
              width="20"
              height="20"
              aria-label="password hide"
            ></inline-svg>
          </button>
        </div>
      </div>
      <div
        class="text-red-500 text-[13px]"
        v-for="error of v$.confirmPassword.$errors"
        :key="error.$uid"
      >
        <div>{{ error.$message }}</div>
      </div>
      <div class="w-full mt-8 border-t border-primary"></div>
    </div>
    <div class="flex w-full sm:justify-end mt-[3rem] items-center">
      <button
        class="bg-primary text-light p-3 rounded-xl min-w-full sm:min-w-[120px] btn-style flex justify-center items-center"
        @click="handleChangePassword"
      >
        <Spinner :isLoading="isLoading" />
        Update
      </button>
    </div>
  </div>
</template>
