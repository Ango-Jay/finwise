<script setup>
import { ref } from "vue";

const props = defineProps({
  tabList: Array,
  customClass: String,
});

const activeTab = ref(1);
</script>

<template>
  <div class="flex flex-col">
    <div class="w-full px-6 sm:px-10">
      <ul class="w-full" :class="customClass">
        <li
          class="flex shrink-0 w-full xs:w-auto justify-center relative h-[3rem] "
          :class="{ 'bg-dark': index + 1 === activeTab }"
          v-for="(tab, index) in tabList"
          :key="index"
        >
          <label
            class="absolute text-center w-full top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%] z-[3]"
            :for="`tab-${index}`"
            v-text="tab"
          />
          <input
            class="appearance-none w-full py-4 cursor-pointer relative z-[5]"
            type="radio"
            :name="`tab-${index}`"
            :value="index + 1"
            v-model="activeTab"
          />
        </li>
      </ul>
      <div class="w-full border-t border-primary"></div>
    </div>
    <template v-for="(tab, index) in tabList">
      <div :key="index" v-if="index + 1 === activeTab">
        <slot :name="`tabPanel-${index + 1}`" />
      </div>
    </template>
  </div>
</template>
