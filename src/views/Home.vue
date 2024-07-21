<template>
  <Nva_bar />
  <div ref="photos" class="photos dark:bg-blue-100">
    <div class="photos_line" v-for="(line, index) in lines" :key="index">
      <div class="photos_line_photo bg-white dark:bg-slate-800 ring-1 ring-slate-900/5 shadow-xl" v-for="(photo, photoIndex) in line" :key="photoIndex">
        <Starport :port="String(photo.title)" style="width:100%; height:70%;">
          <img :src="photo.imgSrc" />
        </Starport>
        <router-link
            :to="{ path:'/home2', query:{ img:photo.imgSrc, title:photo.title }}"
            type="button"
            class="bg-[#e8e8e8] text-center w-48 rounded-2xl h-14 relative font-sans text-black text-xl font-semibold group dark:bg-black dark:text-white">
          <div class="bg-green-400 max-w-full rounded-xl h-12 w-1/4 absolute left-1 top-1 group-hover:w-[184px] z-10 duration-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="32" viewBox="0 0 448 512">
              <path fill="currentColor" d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224H32c-17.7 0-32 14.3-32 32s14.3 32 32 32h306.7L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/>
            </svg>
          </div>
          <p class="mt-3.5 ml-4 dark:text-white">Go Back</p>
        </router-link>
      </div>
    </div>
  </div>
  <RouterView />
</template>

<script setup>
import { Starport } from "vue-starport";
import { ref, onMounted } from 'vue';
import { gsap } from 'gsap';
import pubUse from '../utils/pub-use';

const lines = ref([
  Array.from({ length: 8 }, (_, i) => ({ imgSrc: `${pubUse.getAssetsFile('Air_Max.png')}`, title: `Apple Air_Max${i + 1}` })),
  Array.from({ length: 8 }, (_, i) => ({ imgSrc: `${pubUse.getAssetsFile('Air_Max.png')}`, title: `Apple Air_Max${i + 9}` })),
  Array.from({ length: 8 }, (_, i) => ({ imgSrc: `${pubUse.getAssetsFile('Air_Max.png')}`, title: `Apple Air_Max${i + 17}` })),
  Array.from({ length: 8 }, (_, i) => ({ imgSrc: `${pubUse.getAssetsFile('Air_Max.png')}`, title: `Apple Air_Max${i + 25}` })),
]);

const photos = ref(null);

onMounted(() => {
  const photobox = {
    container: photos.value,
    imgData: [],
    containerWidth: 0,
    containerHeight: 0,
    photoWidth: 0,
    photoHeight: 0,
    ifMovable: false,
    mouseX: 0,
    mouseY: 0,
    standardWidth: 1440,
    scaleNums: 1,
    init() {
      this.resize();
      window.addEventListener("resize", this.resize.bind(this));
      this.container.addEventListener("mousedown", this.onMouseDown.bind(this));
      this.container.addEventListener("mouseup", this.onMouseUp.bind(this));
      this.container.addEventListener("mouseleave", this.onMouseUp.bind(this));
      this.container.addEventListener("mousemove", this.onMouseMove.bind(this));
      this.container.addEventListener("touchstart", this.onTouchStart.bind(this));
      this.container.addEventListener("touchend", this.onMouseUp.bind(this));
      this.container.addEventListener("touchmove", this.onTouchMove.bind(this));
    },
    resize() {
      const imgs = [...document.querySelectorAll(".photos_line_photo")];
      this.containerWidth = this.container.offsetWidth;
      this.containerHeight = this.container.offsetHeight;
      this.photoWidth = imgs[0].offsetWidth;
      this.photoHeight = imgs[0].offsetHeight;
      this.scaleNums = document.body.offsetWidth / this.standardWidth;
      this.container.style.transform = `scale(${this.scaleNums})`;
      gsap.to(imgs, { transform: `translate(0,0)`, duration: 0, ease: 'power4.out' });
      this.imgData = imgs.map(img => ({
        node: img,
        x: img.offsetLeft,
        y: img.offsetTop,
        movX: 0,
        movY: 0,
        ani: 0
      }));
    },
    onMouseDown(event) {
      this.ifMovable = true;
      this.mouseX = event.clientX;
      this.mouseY = event.clientY;
    },
    onMouseUp() {
      this.ifMovable = false;
    },
    onMouseMove(event) {
      this.move(event.clientX, event.clientY);
    },
    onTouchStart(event) {
      this.ifMovable = true;
      this.mouseX = event.touches[0].clientX;
      this.mouseY = event.touches[0].clientY;
    },
    onTouchMove(event) {
      this.move(event.touches[0].clientX, event.touches[0].clientY);
    },
    move(x, y) {
      if (!this.ifMovable) return;
      const distanceX = (x - this.mouseX) / this.scaleNums;
      const distanceY = (y - this.mouseY) / this.scaleNums;
      this.imgData.forEach(img => {
        let duration = 1;
        img.movX += distanceX;
        if (img.x + img.movX > this.containerWidth) {
          img.movX -= this.containerWidth;
          duration = 0;
        }
        if (img.x + img.movX < -this.photoWidth) {
          img.movX += this.containerWidth;
          duration = 0;
        }
        img.movY += distanceY;
        if (img.y + img.movY > this.containerHeight) {
          img.movY -= this.containerHeight;
          duration = 0;
        }
        if (img.y + img.movY < -this.photoHeight) {
          img.movY += this.containerHeight;
          duration = 0;
        }
        if (img.ani) img.ani.kill();
        img.ani = gsap.to(img.node, {
          transform: `translate(${img.movX}px,${img.movY}px)`,
          duration: duration,
          ease: 'power4.out'
        });
      });
      this.mouseX = x;
      this.mouseY = y;
    }
  };

  photobox.init();
});
</script>

<style>
html{
  overflow: hidden;
}
* {
  padding: 0;
  margin: 0;
}

img {
  width: 100%;
  height: auto;
  pointer-events: none;
  user-select: none;
  z-index: 99999;
}

div {
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
}

body {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

/* homecss */
.photos {
  position: absolute;
  flex-direction: column;
  overflow: hidden;
}

.photos_line {
  font-size: 1px;
  height: 342em;
  margin-bottom: 48em;
  flex-shrink: 0;
}

.photos_line_photo {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  font-size: 1px;
  width: 234em;
  height: 100%;
  margin-right: 36em;
  border-radius: 15em;
  overflow: hidden;
  flex-shrink: 0;
}

.photos_line_photo img {
  z-index: 999;
  background-repeat: round;
  transition: 1s;
}

.photos_line_photo h2 {
  font-size: 20px;
  transition: 0.6s;
  z-index: 99999;
  color: #f56900;
  opacity: 0;
}

.photos_line_photo:hover h2 {
  z-index:1;
  opacity: 1;
  transform: scale(1) translateY(-320%);
}

.photos_line_photo button:active {
  box-shadow: 4px 4px 12px #c5c5c5, -4px -4px 12px #ffffff;
}

@media screen and (max-aspect-ratio: 1.5/1) {
  .photos_line, .photos_line_photo {
    font-size: 2px;
  }
}

@media screen and (max-aspect-ratio: 0.8/1) {
  .photos_line, .photos_line_photo {
    font-size: 2.8px;
  }
}


</style>
