<script setup>
import ArrowLeft from "../../assets/icon/arrow-left-solid.svg"
import Image1 from "../../assets/img/budget-1.svg"
import BudgetDetails from "../../components/CreateBudget_forms/BudgetInitial.vue"
import { ref } from "vue";

const stagesCompleted = ref([])
const handleCompleted = (stage)=>{
    stagesCompleted.value = [
        ...stagesCompleted.value,
        stage
    ]
}
</script>

<template>
    <div class="w-full mt-[3rem] xs:px-10">
        <div class="w-full flex flex-col sm:flex-row  sm:items-center px-6 xs:px-0">
            <h2 class="font-bold text-primary text-xl">
            Create a Budget Plan
        </h2>
        <button
        class="flex max-w-[200px] min-w-[150px] items-center justify-center text-light border border-light rounded-xl py-2 px-3 mt-8 sm:mt-0 sm:ml-auto btn-style"
        >
        <inline-svg
                  :src="ArrowLeft"
                  class="fill-light mr-2"
                  width="20"
                  height="20"
                  aria-label="back to home"
                ></inline-svg>
            Back to home
        </button>
        </div>
 
        <div class="w-full pt-[3rem] pb-0 xs:pb-[3rem] flex ">
<div class="w-[30%] min-w-[230px] h-[350px] grow-0 shrink-0 hidden md:flex flex-col bg-dark rounded-lg p-3 mr-4">
    <h4
    class="text-light text-lg font-semibold my-4"
    >
        What is the name of your budget ?
    </h4>
    <inline-svg
                  :src="Image1"
                  class="w-full my-auto"
                  aria-label="create a budget plan"
                ></inline-svg>

                <div class="w-full flex items-center justify-center mt-4">
        <div class="w-[15px] min-w-[15px] h-[15px] rounded-full bg-backdrop border border-light mr-4"></div>
        <div class="w-[15px] min-w-[15px] h-[15px] rounded-full bg-backdrop border border-light"></div>
    </div>
</div>
<div class="w-full md:w-[70%] bg-dark rounded-lg md:ml-4 ">
<BudgetDetails />
</div>
        </div>
    </div>
</template>