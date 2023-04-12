<script setup>
import { storeToRefs } from "pinia";
import { useAppStore } from "../../store";
import { reactive, watchEffect, ref } from "vue";
import { db } from "../../services/db";
import { useVuelidate } from "@vuelidate/core";
import { required, email, minLength, helpers } from "@vuelidate/validators";
import { useSnackbar } from "vue3-snackbar";
import Spinner from "../loader-utils/Spinner.vue";
import { useRouter } from "vue-router";
import { liveQuery } from "dexie";
import { useObservable } from "@vueuse/rxjs";
import UserIcon from "../../assets/icon/user-solid.svg"
import EnvelopeIcon from "../../assets/icon/envelope-solid.svg"
import UploadIcon from "../../assets/icon/cloud-arrow-up-solid.svg"


const router = useRouter();
const store = useAppStore();
const { user } = storeToRefs(store);
const users = useObservable(liveQuery(() => db.users.toArray())) || [];
const currentUser = ref({});

const snackbar = useSnackbar();
const state = reactive({
  firstname: "",
  lastname: "",
  email: "",
});
watchEffect(() => {
  if (Object.keys(user).length) {
    state.firstname = user.value.firstname;
    state.lastname = user.value.lastname;
    state.email = user.value.email;

    currentUser.value = users.value?.find(
      (item) => item?.uniqueId === user.value.id
    );
  }
});
const rules = {
  firstname: {
    required: helpers.withMessage("Please enter a name", required),
    min: helpers.withMessage("Please enter a valid name", minLength(3)),
  },
  lastname: {
    required: helpers.withMessage("Please enter a name", required),
    min: helpers.withMessage("Please enter a valid name", minLength(3)),
  },
  email: {
    required: helpers.withMessage("Please enter a valid email", required),
    email: helpers.withMessage("Please enter a valid email", email),
  },
};
const v$ = useVuelidate(rules, state);
const isSuccess = ref(false);
const isLoading = ref(false);

const profileImage = ref([]);
const imageSrc = ref("");

watchEffect(() => {
  if (currentUser.value?.image && !profileImage.value.length) {
    profileImage.value = [currentUser.value.image];
  }
});
watchEffect(() => {
  if (profileImage.value.length > 0 && profileImage.value[0].file) {
    const image = URL.createObjectURL(profileImage.value[0].file);
    imageSrc.value = image;
  }
  if (profileImage.value.length > 0 && !profileImage.value[0].file) {
    const image = URL.createObjectURL(profileImage.value[0]);
    imageSrc.value = image;
  }
});

const handleUpdate = async () => {
  const isFormCorrect = await v$.value.$validate();
  if (isFormCorrect) {
    try {
      isLoading.value = true;
      setTimeout(async () => {
        await db.users.update(user.value.id, {
          firstname: state.firstname,
          lastname: state.lastname,
          email: state.email,
          image:
            profileImage.value.length && profileImage.value[0].file
              ? profileImage.value[0].file
              : currentUser.value.image,
        });

        snackbar.add({
          type: "success",
          text: "Updated",
        });

        isLoading.value = false;
        isSuccess.value = true;
        store.$patch((appState) => {
          appState.user = {
            firstname: currentUser.value.firstname,
            lastname: currentUser.value.lastname,
            email: currentUser.value.email,
            id: currentUser.value.uniqueId,
          };
        });
      }, 3000);
    } catch (error) {
      isLoading.value = false;
      snackbar.add({
        type: "error",
        text: "Something went wrong",
      });
    }
  }
};
const navigateToHome = () => {
  router.push({
    name: "home",
  });
};
</script>

<template>
  <div class="flex items-center px-6 sm:px-10 w-full mt-[3rem]">
    <div class="flex flex-col sm:flex-row sm:items-center">
      <div
        class="w-[100px] h-[100px] mb-4 sm:mb-0 rounded-full border border-primary bg-dark flex items-center justify-center"
      >
        <inline-svg
          v-if="!imageSrc"
          :src="UserIcon"
          class="fill-primary"
          width="50"
          height="50"
          aria-label="user"
        ></inline-svg>
        <img
          v-if="imageSrc"
          class="w-full h-full object-cover rounded-full"
          :src="imageSrc"
          alt="user"
        />
      </div>
      <div class="text-light text-lg capitalise sm:ml-4 font-semibold">
        <h4>
          {{ user.firstname }}
          <span class="ml-1">
            {{ user.lastname }}
          </span>
        </h4>
        <h4 class="text-sm mt-2 font-normal">
          {{ user.email }}
        </h4>
      </div>
    </div>
    <div class="hidden md:flex ml-auto items-center text-sm">
      <button
        class="border border-primary bg-light text-primary p-3 rounded-xl min-w-[100px] btn-style"
        @click="navigateToHome"
      >
        Cancel
      </button>
      <button
        class="bg-primary text-light p-3 rounded-xl min-w-[100px] ml-4 btn-style flex justify-center items-center"
        @click="handleUpdate"
      >
        <Spinner :isLoading="isLoading" />
        Save
      </button>
    </div>
  </div>

  <div class="w-full px-6 sm:px-10 mt-[3rem]">
    <div class="w-full mb-8">
      <div class="w-full flex flex-col md:flex-row md:items-center">
        <div class="flex flex-col w-full md:w-[50%] md:mr-4 mb-4 md:mb-0">
          <label class="text-primary font-bold mb-2 text-[13px]" for="firstname"
            >First name</label
          >
          <input
            name="firstname"
            class="bg-dark appearance-none px-4 py-3 rounded-2xl text-light"
            type="text"
            v-model="state.firstname"
          />
        </div>
        <div class="flex flex-col w-full md:w-[50%] md:ml-4">
          <label class="text-primary font-bold mb-2 text-[13px]" for="lastname"
            >Last name</label
          >
          <input
            name="lastname"
            class="bg-dark appearance-none px-4 py-3 rounded-2xl text-light"
            type="text"
            v-model="state.lastname"
          />
        </div>
      </div>
      <div class="w-full mt-8 border-t border-primary"></div>
    </div>
    <div class="w-full mb-8">
      <div class="flex flex-col w-full sm:w-[80%]">
        <label class="text-primary font-bold mb-2 text-[13px]" for="email"
          >Email</label
        >
        <div class="w-full relative">
          <input
            name="email"
            class="w-full bg-dark appearance-none pl-[2.5rem] py-3 pr-4 rounded-2xl text-light"
            type="text"
            v-model="state.email"
          />
          <inline-svg
            :src="EnvelopeIcon"
            class="fill-light absolute left-[10px] top-[50%] translate-y-[-50%]"
            width="20"
            height="20"
            aria-label="password show"
          ></inline-svg>
        </div>
      </div>
      <div class="w-full mt-8 border-t border-primary"></div>
    </div>

    <div class="w-full mb-8">
      <div class="flex flex-col sm:flex-row">
        <div
          class="shrink-0 w-[50px] min-w-[50px] h-[50px] border border-primary rounded-full mb-4 sm:mb-0 ml-auto sm:ml-0 mr-auto sm:mr-4 flex items-center justify-center bg-dark"
        >
          <inline-svg
            v-if="!profileImage.length"
    :src="UserIcon"
            class="fill-primary"
            width="25"
            height="25"
            aria-label="user"
          ></inline-svg>
          <img
            :src="imageSrc"
            class="w-full h-full object-cover rounded-full"
            v-if="profileImage.length > 0"
            alt="user"
          />
        </div>

        <file-upload
          style="display: flex"
          class="flex flex-col justify-center items-center grow bg-dark text-light py-4 rounded-xl btn-style"
          post-action="/upload/post"
          :multiple="false"
          :drop="true"
          :drop-directory="true"
          v-model="profileImage"
        >
          <inline-svg
            :src="UploadIcon"
            class="fill-primary"
            width="35"
            height="35"
            aria-label="user"
          ></inline-svg>
          <h4 class="mt-4 text-sm sm:text-base">
            <span class="font-semibold">Click to upload</span> or drag and drop
          </h4>
          <h4 class="text-sm sm:text-base">PNG, JPG (max 3mb)</h4>
        </file-upload>
      </div>
      <div class="w-full mt-8 border-t border-primary"></div>
    </div>
    <div
      class="flex flex-col-reverse sm:flex-row md:hidden ml-auto items-center text-sm"
    >
      <button
        class="border border-primary bg-light text-primary p-3 rounded-xl min-w-full sm:min-w-[100px] btn-style"
        @click="navigateToHome"
      >
        Cancel
      </button>
      <button
        class="bg-primary text-light p-3 rounded-xl min-w-full sm:min-w-[100px] ml-0 sm:ml-4 mb-4 sm:mb-0 btn-style flex justify-center items-center"
        @click="handleUpdate"
      >
        <Spinner :isLoading="isLoading" />
        Save
      </button>
    </div>
  </div>
</template>
