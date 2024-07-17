<template>

  <div class="fixed top-0 flex flex-col  items-center w-lvw  dark:bg-blue-100">

    <div class="flex justify-between w-full items-center h-16 py-2.5">
      <p class="text-lg font-bold tracking-widest ml-4">{{ route.query.title }}</p>
      <p class="cursor-pointer mr-4" @click="router.push('Home')">
        <svg height="25px" viewBox="0 0 24 24" width="25px" xmlns="http://www.w3.org/2000/svg">
          <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2">
            <path
                d="M16 5V4C16 3.44772 15.5523 3 15 3H6C5.44771 3 5 3.44772 5 4V20C5 20.5523 5.44772 21 6 21H15C15.5523 21 16 20.5523 16 20V19"
                stroke-dasharray="46" stroke-dashoffset="46">
              <animate attributeName="stroke-dashoffset" dur="0.5s" fill="freeze" values="46;0"/>
            </path>
            <path d="M10 12h11" opacity="0" stroke-dasharray="12" stroke-dashoffset="12">
              <set attributeName="opacity" begin="0.6s" to="1"/>
              <animate attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s" fill="freeze" values="12;0"/>
            </path>
            <path d="M21 12l-3.5 -3.5M21 12l-3.5 3.5" opacity="0" stroke-dasharray="6" stroke-dashoffset="6">
              <set attributeName="opacity" begin="0.8s" to="1"/>
              <animate attributeName="stroke-dashoffset" begin="0.8s" dur="0.2s" fill="freeze" values="6;0"/>
            </path>
          </g>
        </svg>
      </p>
    </div>

    <div class="w-lvw h-12 border-solid border border-y-gray-300"></div>

    <div class="w-full h-12 flex justify-start items-center">
      <span class="font-sans text-lg text-gray-400 font-semibold ml-4 ">哪一款适合你 ?</span>
    </div>


    <div class="flex  w-[100vw]  justify-center flex-wrap">
      <div class="swiper" style="z-index:0; padding: 0 60px 40px 60px">
        <div class="swiper-wrapper ">


          <div class="swiper-slide   dark:bg-slate-800 bg-gray-100">
            <Starport :port="String(route.query.title)"
                      class="p-[40px] portrait:w-[50vw] portrait:h-[50vw] landscape:w-[50vh] landscape:h-[50vh]">
              <img :src="route.query.img" alt="Gallery Image"/>
            </Starport>
          </div>


          <div class="swiper-slide   dark:bg-slate-800  bg-gray-100">
            <div class="portrait:w-[50vw] portrait:h-[50vw] landscape:w-[50vh] landscape:h-[50vh] p-[40px] ">
              <img alt="Alternate Image" src="../assets/Air_Max.png">
            </div>
          </div>

        </div>
        <div class="swiper-pagination"></div>
      </div>
    </div>
  </div>
</template>

<script>
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';

export default {
  name: 'MySwiper',
  mounted() {
    new Swiper('.swiper', {
      slidesPerView: 1,
      spaceBetween: 20,
      pagination: {
        el: '.swiper-pagination',
      },
    })
  },

};
</script>

<script setup>
import {Starport} from 'vue-starport';
import {useRoute, useRouter} from 'vue-router';

const route = useRoute();
const router = useRouter();
</script>

<style scoped>
@import 'src/css/swiper-bundle.min.css';

body {
  overflow: hidden;
}

.swiper {
  --swiper-pagination-color: #000000;
}

.swiper-wrapper {
  display: flex;
  justify-content: flex-start;
  transition-duration: 0ms;
  transform: translate3d(0px, 0px, 0px);
  transition-delay: 0ms;
}

.swiper-slide {
  display: flex;
  justify-content: center;
  border-radius: 25px;
  height: auto;
}

.swiper-pagination {
}

</style>
