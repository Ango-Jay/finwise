<script setup>
import { ref, reactive, computed, watchEffect } from "vue";
import { useVuelidate } from "@vuelidate/core";
import {
  required,
  email,
  minLength,
  helpers,
  numeric,
} from "@vuelidate/validators";
import DatePickerIcon from "../../assets/icon/calendar-days-regular.svg";
import ChevronRight from "../../assets/icon/chevron-right-solid.svg";
import ClipboardIcon from "../../assets/icon/clipboard_list.svg";

const today = new Date().toISOString().substring(0, 10);
const initialBalanceFormattedFieldType = ref("number");
const state = reactive({
  startDate: "",
  endDate: "",
  initialBalance: "",
  initialBalanceFormatted: 0,
  name: "",
  description: "",
});
const rules = computed(() => {
  return {
    startDate: {
      required: helpers.withMessage("Please choose a date", required),
      $autoDirty: true,
    },
    endDate: {
      required: helpers.withMessage("Please choose a date", required),
      $autoDirty: true,
    },
    initialBalanceFormatted: {
      required: helpers.withMessage("Please enter an amount", required),
      $autoDirty: true,
    },
  };
});
const v$ = useVuelidate(rules, state);

// const handleInitialBalanceFieldChange = (event)=>{
//     console.log("changeEvent, : ", event);
// state.initialBalance = `${event.target.value}`
// state.initialBalanceFormatted = `${event.target.value}`
// }

watchEffect(() => {
  if (
    state.initialBalanceFormatted &&
    initialBalanceFormattedFieldType.value === "number"
  ) {
    state.initialBalance = `${state.initialBalanceFormatted}`;
  }
});

const handleInitialBalanceFieldFocus = (event) => {
  if (state.initialBalance) {
    initialBalanceFormattedFieldType.value = "number";
    state.initialBalanceFormatted = state.initialBalance;
  }
};
const handleInitialBalanceFieldBlur = (event) => {
  initialBalanceFormattedFieldType.value = "text";
  if (!event.target.value) return;
};
watchEffect(() => {
  if (initialBalanceFormattedFieldType.value === "text") {
    // format value on blur
    state.initialBalanceFormatted = `${parseFloat(
      state.initialBalance.replace(/,/g, "")
    ).toLocaleString("en-US", {
      style: "decimal",
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    })}`;
  }
});
</script>
<template>
  <div class="w-full pt-[3rem] pb-[5rem] xs:pb-[3rem]">
    <h2 class="text-light font-bold px-6 flex items-center">
      <span class="w-[15px] min-w-[15px] h-[15px] inline-flex mr-2">
        <inline-svg
          :src="ClipboardIcon"
          class="fill-primary w-full h-full"
          aria-label="budget"
        ></inline-svg>
      </span>
      Budget Details
      <span class="font-normal ml-1">- Set new plan Information</span>
    </h2>
    <div class="border-t border-light w-full mt-4"></div>
    <div class="w-full mt-[3rem] px-6">
      <div class="my-4 flex flex-col relative">
        <label
          class="text-light font-bold mb-2 uppercase text-[13px]"
          for="name"
          >Budget Name</label
        >
        <input
          class="bg-backdrop appearance-none p-4 rounded-2xl text-light"
          name="name"
          type="text"
          placeholder="Name of your budget"
          v-model="state.name"
        />
      </div>
      <div class="my-4 flex flex-col relative">
        <label
          class="text-light font-bold mb-2 uppercase text-[13px]"
          for="startDate"
          >Start Date <span class="text-primary">*</span></label
        >
        <div class="w-full relative mt-4">
          <div
            class="flex items-center w-full bg-backdrop outline-0 rounded-2xl p-4"
          >
            <p
              class="text-[#999CA3] font-normal select-none pointer-events-none"
              v-if="!state.startDate"
            >
              When should the plan start, ex. 01-12-2022
            </p>
            <span class="text-light">
              {{ state.startDate }}
            </span>
            <div class="w-[25px] h-[25px] mr-4 ml-auto">
              <inline-svg
                :src="DatePickerIcon"
                class="fill-light w-full h-full"
                aria-label="date picker"
              ></inline-svg>
            </div>
          </div>
          <input
            class="appearance-none opacity-0 absolute top-0 left-0 w-full h-full datepicker-input p-4 rounded-2xl text-light"
            name="startDate"
            type="date"
            :min="today"
            v-model="state.startDate"
          />
        </div>
        <div
          class="text-red-500 text-[13px]"
          v-for="error of v$.startDate.$errors"
          :key="error.$uid"
        >
          <div>{{ error.$message }}</div>
        </div>
      </div>

      <div class="my-4 flex flex-col relative">
        <label
          class="text-light font-bold mb-2 uppercase text-[13px]"
          for="endDate"
          >End Date <span class="text-primary">*</span></label
        >
        <div class="w-full relative mt-4">
          <div
            class="flex items-center w-full bg-backdrop outline-0 rounded-2xl p-4"
          >
            <p
              class="text-[#999CA3] font-normal select-none pointer-events-none"
              v-if="!state.endDate"
            >
              When should the plan end, ex. 01-12-2022
            </p>
            <span class="text-light">
              {{ state.endDate }}
            </span>
            <div class="w-[25px] h-[25px] mr-4 ml-auto">
              <inline-svg
                :src="DatePickerIcon"
                class="fill-light w-full h-full"
                aria-label="date picker"
              ></inline-svg>
            </div>
          </div>
          <input
            class="appearance-none opacity-0 absolute top-0 left-0 w-full h-full datepicker-input p-4 rounded-2xl text-light"
            name="endDate"
            type="date"
            :min="today"
            v-model="state.endDate"
          />
        </div>
        <div
          class="text-red-500 text-[13px]"
          v-for="error of v$.endDate.$errors"
          :key="error.$uid"
        >
          <div>{{ error.$message }}</div>
        </div>
      </div>
      <div class="my-4 flex flex-col relative">
        <label
          class="text-light font-bold mb-2 uppercase text-[13px]"
          for="initialBalanceFormatted"
          >Initial Balance <span class="text-primary">*</span></label
        >
        <div class="relative">
          <input
            class="bg-backdrop appearance-none p-4 rounded-2xl text-light w-full relative z-[5]"
            :class="{
              'bg-transparent': initialBalanceFormattedFieldType === 'text',
            }"
            name="initialBalanceFormatted"
            :type="initialBalanceFormattedFieldType"
            v-model="state.initialBalanceFormatted"
            @focus="handleInitialBalanceFieldFocus"
            @blur="handleInitialBalanceFieldBlur"
          />
          <span
            class="absolute w-full h-full top-0 left-0 z-[3] text-light p-4 rounded-2xl bg-backdrop"
            v-if="initialBalanceFormattedFieldType === 'text'"
          >
            {{ state.initialBalanceFormatted }}
          </span>
        </div>

        <div
          class="text-red-500 text-[13px]"
          v-for="error of v$.initialBalanceFormatted.$errors"
          :key="error.$uid"
        >
          <div>{{ error.$message }}</div>
        </div>
      </div>
      <div class="my-4 flex flex-col relative">
        <label
          class="text-light font-bold mb-2 uppercase text-[13px]"
          for="description"
          >Description</label
        >
        <textarea
          name="description"
          class="bg-backdrop rounded-2xl text-light p-4"
          v-model="state.description"
        ></textarea>
      </div>

      <button
        class="flex items-center justify-center mx-auto min-w-[250px] p-3 text-light bg-primary rounded-xl mt-8 btn-style"
      >
        Proceed
        <span class="w-[15px] min-w-[15px] h-[15px] ml-2">
          <inline-svg
            :src="ChevronRight"
            class="fill-light w-full h-full"
            aria-label="next"
          ></inline-svg>
        </span>
      </button>
    </div>
  </div>
</template>
