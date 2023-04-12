<script setup>
const props = defineProps({
    title: {
        type: String,
          required: true
    },
    subTitle: {
        type: String,
          required: true
    },
})
</script>

<template>
<div class="bg-dark py-4 px-3 rounded-xl">
<div class="w-full flex justify-between items-center">

  <h2
  class="text-light text-xl"
  >
 {{ props.title }}
  </h2>
  <button class="w-[40px] min-w-[50px] h-[50px] bg-backdrop rounded-full flex items-center justify-center btn-style">
    <inline-svg
          src="src/assets/icon/plus-solid.svg"
          class="fill-light"
          width="20"
          height="20"
          aria-label="add"
        ></inline-svg>
  </button>

</div>
<h2 class="text-light mt-8">
{{ props.subTitle }}
</h2>
</div>
</template>