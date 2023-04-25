<script setup>
import { useAppStore } from "../store";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { watchEffect, ref } from "vue";
import Logo from "../assets/img/logo-main.png";
import HomeImg from "../assets/icon/house-solid.svg";
import BudgetImg from "../assets/icon/clipboard_list.svg";
import TransactionsImg from "../assets/icon/paper-plane-solid.svg";
import SubscriptionsImg from "../assets/icon/credit-card-solid.svg";
import LoansImg from "../assets/icon/money-bill-wave-solid.svg";
import SavingsImg from "../assets/icon/wallet-solid.svg";
import LogoutIcon from "../assets/icon/logout.svg";
import SettingsIcon from "../assets/icon/gear-solid.svg";
import NavIcon from "../assets/icon/nav_burger.svg";

const props = defineProps({
  active: String,
});

const router = useRouter();

const isSettings = ref(false);
watchEffect(() => {
  if (props.active === "settings") {
    isSettings.value = true;
  } else {
    isSettings.value = false;
  }
});

const state = useAppStore();
const { isMobile } = storeToRefs(state);

const toggleIsMobile = () => {
  state.$patch({ isMobile: !isMobile });
};
const handleLogout = () => {
  state.$patch((store) => {
    store.isAuth = false;
    store.isMobile = false;
    store.user = {};
  });
  router.push({
    name: "login",
  });
};

const sections = [
  {
    name: "home",
    iconSrc: HomeImg,
  },
  {
    name: "budget",
    iconSrc: BudgetImg,
  },
  {
    name: "transactions",
    iconSrc: TransactionsImg,
  },
  {
    name: "subscriptions",
    iconSrc: SubscriptionsImg,
  },
  {
    name: "loans",
    iconSrc: LoansImg,
  },
  {
    name: "savings",
    iconSrc: SavingsImg,
  },
];
</script>

<template>
  <div
    class="z-[600] lg:z-[1] w-[80%] sm:w-[250px] lg:w-[25%] xl:w-[18%] min-h-[100vh] bg-dark fixed left-0 top-0 overflow-y-auto transition-[transform] duration-300"
    :class="{ 'translate-x-[-100vw] lg:translate-x-0': !isMobile }"
  >
    <div class="w-full h-full min-h-[100vh] flex flex-col">
      <div className="mt-6 w-full flex items-center relative">
        <div class="flex items-center mx-auto lg:mr-auto">
          <img
            className="w-[40px]  min-w-[40px]  h-[40px]  object-contain"
            :src="Logo"
            alt="logo"
          />
          <h2 class="text-primary text-2xl font-semibold ml-2">FinWise</h2>
        </div>
        <div
          className="w-[30px] min-w-[30px] h-[30px] absolute top-[0.8rem] right-0 mr-4 flex lg:hidden"
        >
          <button
            class="w-[30px] min-w-[30px] h-[30px] flex lg:hidden mr-10"
            @click="state.toggleMobile"
          >
            <inline-svg
              :src="NavIcon"
              class="fill-light hover:fill-primary"
              width="30"
              height="30"
              aria-label="nav"
            ></inline-svg>
          </button>
        </div>
      </div>

      <div class="w-full mt-[3rem] flex flex-col items-center">
        <div
          v-for="section in sections"
          class="w-[80%] h-[50px] mx-auto flex items-center justify-center relative mb-4 group"
        >
          <RouterLink
            to="/home"
            class="w-[70%] text-light font-semibold relative z-[5] flex items-center justify-between"
          >
            <span>
              <inline-svg
                :src="section.iconSrc"
                class="fill-light mr-4"
                width="20"
                height="20"
                :aria-label="section.name"
              ></inline-svg>
            </span>
            <span class="absolute top-0 left-[2rem] capitalize">
              {{ section.name }}
            </span>
          </RouterLink>
          <div
            class="absolute w-full h-[50px] top-0 left-0 px-6 z-[4] bg-primary rounded-2xl opacity-0 group-hover:opacity-100 hover:opacity-100"
            :class="{ 'opacity-100': props.active.includes(section.name) }"
          ></div>
        </div>
      </div>

      <div
        class="mt-auto w-[80%] mx-auto mb-6 flex items-center justify-between"
      >
        <button
          class="flex items-center font-semibold text-light fill-light hover:text-primary hover:fill-primary"
          @click="handleLogout"
        >
          <span>
            <inline-svg
              :src="LogoutIcon"
              class="mr-4"
              width="18"
              height="18"
              aria-label="logout"
            ></inline-svg>
          </span>

          Logout
        </button>
        <RouterLink to="/settings">
          <inline-svg
            :src="SettingsIcon"
            class="fill-light mr-4 hover:fill-primary"
            :class="{ 'fill-primary': isSettings }"
            width="20"
            height="20"
            aria-label="settings"
          ></inline-svg>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
