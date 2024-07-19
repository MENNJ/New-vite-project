<template>
  <div>
    <canvas ref="photobox" class="fixed w-full h-full cursor-pointer"></canvas>
  </div>
</template>

<script>
import { gsap } from "gsap";
import pubUse from '../utils/pub-use';

document.body.classList.add('dark:bg-gray-900');

export default {
  name: "PhotoBox",
  data() {
    return {
      canvas: null,
      content: null,
      img_total: 28,
      row_max: 7,
      line_max: 4,
      img_width: Math.floor(700 / 2),
      img_height: Math.floor(1000 / 2),
      img_margin: 200,
      total_width: 0,
      total_height: 0,
      img_data: [],
      if_movable: false,
      lastX: 0,
      lastY: 0,
      velocityX: 0,
      velocityY: 0,
      scaleFactor: 1,  // Scaling factor for images
      isAnimating: false, // To track if animation is running
      borderRadius: 40, // Radius for rounded corners
    };
  },
  mounted() {
    this.setScaleFactor();
    this.init();
    window.addEventListener("resize", this.resize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resize);
  },
  methods: {
    setScaleFactor() {
      const screenWidth = window.innerWidth;
      if (screenWidth <= 768) { // Example threshold for mobile devices
        this.scaleFactor = 0.5; // Mobile devices
      } else {
        this.scaleFactor = 1; // Desktop devices
      }
      this.img_width *= this.scaleFactor;
      this.img_height *= this.scaleFactor;
      this.img_margin *= this.scaleFactor;
      this.borderRadius *= this.scaleFactor;
    },
    init() {
      this.canvas = this.$refs.photobox;
      this.content = this.canvas.getContext("2d");
      this.total_width = this.row_max * (this.img_width + this.img_margin) - this.img_margin;
      this.total_height = this.line_max * (this.img_height + this.img_margin) - this.img_margin;
      this.resize();
      this.createEvents();
      this.createImgData();
    },
    resize() {
      this.canvas.width = this.canvas.clientWidth;
      this.canvas.height = this.canvas.clientHeight;
      if (this.img_data.length > 0) this.moveImgs(0, 0);
    },
    createImgData() {
      this.img_data = [];
      for (let i = 0; i < this.img_total; i++) {
        let img = new Image();
        img.src = `${pubUse.getAssetsFile('photo (2).png')}`;
        img.onload = () => {
          let col_index = i % this.row_max;
          let line_index = Math.floor(i / this.row_max);
          let x = col_index * (this.img_width + this.img_margin);
          let y = line_index * (this.img_height + this.img_margin);
          this.img_data.push({img, x, y});
          this.drawRoundedImage(img, x, y, this.img_width, this.img_height, this.borderRadius);
        };
      }
    },
    drawRoundedImage(img, x, y, width, height, radius) {
      this.content.save();
      this.content.beginPath();
      this.content.moveTo(x + radius, y);
      this.content.lineTo(x + width - radius, y);
      this.content.quadraticCurveTo(x + width, y, x + width, y + radius);
      this.content.lineTo(x + width, y + height - radius);
      this.content.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      this.content.lineTo(x + radius, y + height);
      this.content.quadraticCurveTo(x, y + height, x, y + height - radius);
      this.content.lineTo(x, y + radius);
      this.content.quadraticCurveTo(x, y, x + radius, y);
      this.content.closePath();
      this.content.clip();
      this.content.drawImage(img, x, y, width, height);
      this.content.restore();
    },
    createEvents() {
      // Mouse events
      this.canvas.addEventListener("mousedown", this.onMouseDown);
      this.canvas.addEventListener("mouseup", this.onMouseUp);
      this.canvas.addEventListener("mouseleave", this.onMouseLeave);
      this.canvas.addEventListener("mousemove", this.onMouseMove);

      // Touch events
      this.canvas.addEventListener("touchstart", this.onTouchStart, { passive: false });
      this.canvas.addEventListener("touchend", this.onTouchEnd, { passive: false });
      this.canvas.addEventListener("touchmove", this.onTouchMove, { passive: false });
    },
    onMouseDown(e) {
      this.if_movable = true;
      this.lastX = e.clientX;
      this.lastY = e.clientY;
      this.velocityX = 0;
      this.velocityY = 0;
      this.isAnimating = false;
      gsap.killTweensOf(this);
    },
    onMouseUp(e) {
      this.if_movable = false;
      this.checkImg(e.clientX, e.clientY);
      this.applyInertia();
    },
    onMouseLeave() {
      this.if_movable = false;
      this.applyInertia();
    },
    onMouseMove(e) {
      if (!this.if_movable) return;
      let deltaX = e.clientX - this.lastX;
      let deltaY = e.clientY - this.lastY;
      this.velocityX = deltaX;
      this.velocityY = deltaY;
      this.moveImgs(deltaX, deltaY);
      this.lastX = e.clientX;
      this.lastY = e.clientY;
    },
    onTouchStart(e) {
      if (e.touches.length === 1) {
        this.if_movable = true;
        this.lastX = e.touches[0].clientX;
        this.lastY = e.touches[0].clientY;
        this.velocityX = 0;
        this.velocityY = 0;
        this.isAnimating = false;
        gsap.killTweensOf(this);
      } else {
        e.preventDefault();
      }
    },
    onTouchEnd(e) {
      if (e.touches.length === 0) {
        this.if_movable = false;
        this.checkImg(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
        this.applyInertia();
      }
    },
    onTouchMove(e) {
      if (e.touches.length === 1) {
        if (!this.if_movable) return;
        let deltaX = e.touches[0].clientX - this.lastX;
        let deltaY = e.touches[0].clientY - this.lastY;
        this.velocityX = deltaX;
        this.velocityY = deltaY;
        this.moveImgs(deltaX, deltaY);
        this.lastX = e.touches[0].clientX;
        this.lastY = e.touches[0].clientY;
      } else {
        e.preventDefault();
      }
    },
    moveImgs(x, y) {
      this.content.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.img_data.forEach((img) => {
        img.x += x;
        if (img.x > (this.total_width - this.img_width))
          img.x -= this.total_width + this.img_margin;
        if (img.x < -this.img_width)
          img.x += this.total_width + this.img_margin;
        img.y += y;
        if (img.y > (this.total_height - this.img_height))
          img.y -= this.total_height + this.img_margin;
        if (img.y < -this.img_height)
          img.y += this.total_height + this.img_margin;
        this.drawRoundedImage(img.img, img.x, img.y, this.img_width, this.img_height, this.borderRadius);
      });
    },
    checkImg(x, y) {
      let img = this.img_data.find(img =>
          x >= img.x && x < img.x + this.img_width &&
          y >= img.y && y < img.y + this.img_height
      );
      if (img) console.log(img, img.img);
    },
    applyInertia() {
      if (this.isAnimating) return;
      this.isAnimating = true;

      gsap.to(this, {
        duration: 1,
        velocityX: 0,
        velocityY: 0,
        ease: "power3.out",
        onUpdate: () => {
          this.moveImgs(this.velocityX, this.velocityY);
        },
        onComplete: () => {
          this.isAnimating = false;
        }
      });
    }
  }
};
</script>

<style>
* {
  padding: 0;
  margin: 0;
}

body {
  width: 100%;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.84);
  overflow: hidden;

}

@media (prefers-color-scheme: dark) {
  body {
    background-color: black;
    color: white;
  }
}


</style>
