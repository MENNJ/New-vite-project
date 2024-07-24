<template>
  <div class="md:hidden">
    <div
        class="flex flex-col gap-[4.5px] cursor-pointer"
        @click="handleToggleMenu"
    >
      <div
          :class="['w-6  h-1 bg-black rounded-sm dark:bg-white', isOpen ? 'rotate-45' : '', 'origin-left ease-in-out duration-500']"
      />
      <div
          :class="['w-6  h-1 bg-black rounded-sm dark:bg-white', isOpen ? 'opacity-0' : '', 'ease-in-out duration-500']"
      />
      <div
          :class="['w-6  h-1 bg-black rounded-sm dark:bg-white', isOpen ? '-rotate-45' : '', 'origin-left ease-in-out duration-500']"
      />
    </div>
    <div v-if="isOpen" class="absolute left-0 top-12 w-full h-[calc(100vh-48px)] bg-white flex flex-col items-center justify-center gap-8 font-medium text-xl z-10 dark:bg-black">
      <router-link :class="menuClass" class="dark:text-white" style="--i:1" to="/">Home</router-link>
      <router-link :class="menuClass" class="dark:text-white" style="--i:2" to="/">Friends</router-link>
      <router-link :class="menuClass" class="dark:text-white" style="--i:3" to="/">Groups</router-link>
      <router-link :class="menuClass" class="dark:text-white" style="--i:4" to="/">Stories</router-link>
      <router-link :class="menuClass" class="dark:text-white" style="--i:5" to="/">Login</router-link>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';

export default {
  setup() {
    const isOpen = ref(false);
    const isOpen_1 = ref(false);

    const links = [
      { text: 'Home', to: '/' },
      { text: 'Friends', to: '/' },
      { text: 'Groups', to: '/' },
      { text: 'Stories', to: '/' },
      { text: 'Login', to: '/' },
    ];

    const handleToggleMenu = () => {
      if(!isOpen.value){
       isOpen_1.value=true;
       isOpen.value=!isOpen.value
      }else {
        setTimeout(() => {
          isOpen.value = !isOpen.value;
        }, 1000); // 与动画持续时间相同
        isOpen_1.value=false;
        }
    };

    const menuClass = computed(() => (isOpen_1.value ? 'son' : 'slide-out'));

    return {
      isOpen,
      handleToggleMenu,
      links,
      menuClass,
    };
  },
};
</script>

<style>
.son {
  opacity: 0;
  animation: slideTop 1s ease forwards;
  animation-delay: calc(var(--i) * 0.1s);
}

.slide-out {
  animation: slideTopOut 1s ease forwards;
  animation-delay: calc(var(--i) * 0.1s);
}

@keyframes slideTop {
  0% {
    transform: translateY(100%);
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slideTopOut {
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(100%);
    opacity: 0;
  }
}
</style>
