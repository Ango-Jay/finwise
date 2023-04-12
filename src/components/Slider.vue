<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination, Autoplay } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import Img1 from "../assets/img/login-illustration-1.svg"
import Img2 from "../assets/img/login-illustration-2.svg"
import Img3 from "../assets/img/login-illustration-3.svg"
import Img4 from "../assets/img/login-illustration-4.svg"



const slides = [
  {
    imgSrc: Img1,
    text: "Start your journey to financial growth today",
  },
  {
    imgSrc: Img2,
    text: "Get your finances in order",
  },
  {
    imgSrc: Img3,
    text: "Invest in your financial education",
  },
  {
    imgSrc: Img4,
    text: "Set goals and crush 'em'",
  },
];
</script>

<template>
  <Swiper
    :spaceBetween="0"
    :centeredSlides="true"
    :autoplay="{
      delay: 5000,
      disableOnInteraction: false,
    }"
    :pagination="{
      clickable: true,
    }"
    :modules="[Autoplay, Pagination]"
    class="pt-[4rem] w-full min-h-[500px] flex justify-center items-center"
  >
    <SwiperSlide
      v-for="slide in slides"
      style="
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
      "
    >
      <img
        :src="slide.imgSrc"
        style="height: 300px"
        class="mx-auto w-[350px] max-h-[350px]"
        alt="financial growth"
      />
      <h2 class="text-white mt-8">
        {{ slide.text }}
      </h2>
    </SwiperSlide>
  </Swiper>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
