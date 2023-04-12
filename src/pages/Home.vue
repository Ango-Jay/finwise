<script setup>
import { useAppStore } from "../store";
import { storeToRefs } from "pinia";
import ActionCard from "../components/Cards/ActionCard.vue";
import ReportsChart from "../components/ReportsChart.vue";
import DashImg from "../assets/img/stacked-steps.svg"



const { user } = storeToRefs(useAppStore());
const bgImage = `bg-[url(${DashImg})] `
</script>

<template>
  <div class="w-full px-6 sm:px-10 mt-[3rem]">
    <div
      class="w-full h-[250px] flex flex-col bg-dark border-0 border-primary rounded-xl p-8 shadow bg-[50%] bg-right bg-no-repeat"
   :class="bgImage"
      >
      <h4 class="text-2xl text-light font-semibold">
        Hi <span class="text-primary">{{ user.firstname }}</span>
      </h4>
      <p class="text-light mt-4">What would you like to do today?</p>

      <div class="flex items-center mt-auto">
        <RouterLink
          to="/settings"
          class="p-3 border border-primary rounded-xl bg-dark text-primary min-w-[100px] btn-style"
        >
          Update Profile
        </RouterLink>
        <button
          class="p-3 bg-primary text-light rounded-xl min-w-[150px] ml-4 capitalize btn-style"
        >
          Add a new budget plan
        </button>
      </div>
    </div>
  </div>
  <div class="w-full px-6 sm:px-10 mt-[3rem] pb-[3rem]">
    <div class="w-full grid grid-cols-3 gap-[1.5rem]">
      <ActionCard title="Budget" subTitle="Add New Budget Plan" />
      <ActionCard title="Transactions" subTitle="Add New Transaction" />
      <ActionCard title="Card" subTitle="Add Card to track" />
      <div class="flex flex-col">
        <ActionCard title="Savings" subTitle="Add Savings" />
        <div class="mt-6">
          <ActionCard title="Loans" subTitle="Add New Loan" />
        </div>
      </div>
      <ActionCard title="Subscriptions" subTitle="Add New Subscriptions" />
      <div>
        <ReportsChart
          :data="{
            labels: ['Savings', 'Transaction'],
            datasets: [{ data: [40, 20] }],
          }"
        />
      </div>
    </div>
  </div>
</template>
