<template>
  <div class="dark:bg-whit">
    <div class=" fixed w-[150%] h-[200%]  grid 2xl:grid-cols-[repeat(6,1fr)] xl:grid-cols-[repeat(4,1fr)] lg:grid-cols-[repeat(4,1fr)] md:grid-cols-[repeat(3,1fr)] grid-cols-[repeat(3,1fr)] left-0 top-0  js-grid">
      <div v-for="(src, index) in imageSources" :key="index" class="relative">
        <figure :data-src="src" class="absolute inset-2  js-plane"></figure>
      </div>
    </div>
    <div class="js-page"></div>
  </div>
</template>

<script>
// Import necessary libraries
import * as THREE from 'three'; // Three.js library for 3D rendering
import gsap from 'gsap'; // GSAP library for animations
import { onMounted } from 'vue'; // Vue.js hooks and ref function

export default {
  name: 'InteractiveGrid',
  setup() {
    // Array of image sources
    const imageSources = [
      'https://images.pexels.com/photos/18173391/pexels-photo-18173391.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/24460824/pexels-photo-24460824.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/21533296/pexels-photo-21533296.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/3009205/pexels-photo-3009205.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/27143629/pexels-photo-27143629.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/27216502/pexels-photo-27216502.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/27139481/pexels-photo-27139481.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/17266857/pexels-photo-17266857.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/5290758/pexels-photo-5290758.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/5267760/pexels-photo-5267760.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/425160/pexels-photo-425160.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/1038935/pexels-photo-1038935.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/2681319/pexels-photo-2681319.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/1122409/pexels-photo-1122409.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/1010079/pexels-photo-1010079.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/763097/pexels-photo-763097.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/711022/pexels-photo-711022.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/1229102/pexels-photo-1229102.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/1115204/pexels-photo-1115204.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/3299386/pexels-photo-3299386.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/925743/pexels-photo-925743.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/1258333/pexels-photo-1258333.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/1529881/pexels-photo-1529881.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      // ... (other image sources)
    ];

    // 检测浏览器是否为Firefox，操作系统是否为Windows
    const isFirefox = navigator.userAgent.indexOf('Firefox') > -1;
    const isWindows = navigator.appVersion.indexOf('Win') !== -1;

    // 鼠标移动和滚轮的倍数
    const mouseMultiplier = 0.6;
    const firefoxMultiplier = 20;

    // 根据操作系统调整乘数
    const multipliers = {
      mouse: isWindows ? mouseMultiplier * 2 : mouseMultiplier,
      firefox: isWindows ? firefoxMultiplier * 2 : firefoxMultiplier,
    };

    // 获取初始窗口尺寸
    let ww = window.innerWidth;
    let wh = window.innerHeight;

    // 用于管理场景和交互的核心类
    class Core {
      constructor() {
        // 平滑滚动的目标和当前位置
        this.tx = 0;
        this.ty = 0;
        this.cx = 0;
        this.cy = 0;

        this.diff = 0;

        // 用于存储鼠标位置的滚轮和对象
        this.on = { x: 0, y: 0 };
        this.max = { x: 0, y: 0 };

        this.isDragging = false;

        // 获取DOM元素
        this.el = document.querySelector('.js-grid');

        // 创建一个新的Three.js场景
        this.scene = new THREE.Scene();

        // 创建正交摄影机
        this.camera = new THREE.OrthographicCamera(
            ww / -2, ww / 2, wh / 2, wh / -2, 1, 1000
        );
        this.camera.lookAt(this.scene.position);
        this.camera.position.z = 1;

        // 创建WebGL渲染器
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(ww, wh);
        this.renderer.setPixelRatio(gsap.utils.clamp(1, 1.5, window.devicePixelRatio));

        // 设置渲染器的背景颜色为透明
        // this.renderer.setClearAlpha(0.0);

        // 将渲染器的画布附加到文档正文
        document.body.appendChild(this.renderer.domElement);

        // 将平面添加到场景中
        this.addPlanes();
        // 为交互添加事件侦听器
        this.addEvents();
        // 调整窗口大小
        this.resize();
      }

      // 添加事件侦听器
      addEvents() {
        gsap.ticker.add(this.tick);

        window.addEventListener('mousemove', this.onMouseMove);
        window.addEventListener('mousedown', this.onMouseDown);
        window.addEventListener('mouseup', this.onMouseUp);
        // 添加触摸事件监听器
        window.addEventListener('touchstart', this.onTouchStart);
        window.addEventListener('touchmove', this.onTouchMove);
        window.addEventListener('touchend', this.onTouchEnd);

      }

      // 将平面添加到场景中
      addPlanes() {
        const planes = [...document.querySelectorAll('.js-plane')];

        this.planes = planes.map((el, i) => {
          const plane = new Plane();
          plane.init(el, i);

          this.scene.add(plane);

          return plane;
        });
      }

      // 用于渲染场景的动画循环
      tick = () => {
        const xDiff = this.tx - this.cx;
        const yDiff = this.ty - this.cy;

        this.cx += xDiff * 0.085;
        this.cx = Math.round(this.cx * 100) / 100;

        this.cy += yDiff * 0.085;
        this.cy = Math.round(this.cy * 100) / 100;

        this.diff = Math.max(
            Math.abs(yDiff * 0.0001),
            Math.abs(xDiff * 0.0001)
        );

        if (this.planes.length) {
          this.planes.forEach((plane) =>
              plane.update(this.cx, this.cy, this.max, this.diff)
          );
        }

        this.renderer.render(this.scene, this.camera);
      }

      // 处理鼠标移动事件
      onMouseMove = ({ clientX, clientY }) => {
        if (!this.isDragging) return;

        this.tx = this.on.x + clientX * 2.5;
        this.ty = this.on.y - clientY * 2.5;
      }

      // 处理鼠标按下事件
      onMouseDown = ({ clientX, clientY }) => {
        if (this.isDragging) return;

        this.isDragging = true;

        this.on.x = this.tx - clientX * 2.5;
        this.on.y = this.ty + clientY * 2.5;
      }

      // 处理鼠标向上事件
      onMouseUp = () => {
        if (!this.isDragging) return;

        this.isDragging = false;
      }

      // 处理触摸开始事件
      onTouchStart = (e) => {
        if (this.isDragging) return;

        this.isDragging = true;

        const touch = e.touches[0];
        this.on.x = this.tx - touch.clientX * 2.5;
        this.on.y = this.ty + touch.clientY * 2.5;
      }

      // 处理触摸移动事件
      onTouchMove = (e) => {
        if (!this.isDragging) return;

        const touch = e.touches[0];
        this.tx = this.on.x + touch.clientX * 2.5;
        this.ty = this.on.y - touch.clientY * 2.5;
      }

      // 处理触摸结束事件
      onTouchEnd = () => {
        if (!this.isDragging) return;

        this.isDragging = false;
      }

      // 处理窗口大小调整事件
      resize = () => {
        ww = window.innerWidth;
        wh = window.innerHeight;

        const { bottom, right } = this.el.getBoundingClientRect();

        this.max.x = right;
        this.max.y = bottom;
      }
    }

    // 每个图像的平面类
    class Plane extends THREE.Object3D {
      init(el) {
        this.el = el;

        this.x = 0;
        this.y = 0;

        this.my = 1;

        // 定义平面几何图形和着色器材质
        this.geometry = new THREE.PlaneBufferGeometry(1, 1, 1, 1);
        this.material = new THREE.ShaderMaterial({
          fragmentShader: `
          precision mediump float;

          uniform vec2 u_res;
          uniform vec2 u_size;
          uniform sampler2D u_texture;
          uniform float u_radius; // Add a uniform for the corner radius

          vec2 cover(vec2 screenSize, vec2 imageSize, vec2 uv) {
            float screenRatio = screenSize.x / screenSize.y;
            float imageRatio = imageSize.x / imageSize.y;

            vec2 newSize = screenRatio < imageRatio
              ? vec2(imageSize.x * (screenSize.y / imageSize.y), screenSize.y)
              : vec2(screenSize.x, imageSize.y * (screenSize.x / imageSize.x));
            vec2 newOffset = (screenRatio < imageRatio
              ? vec2((newSize.x - screenSize.x) / 2.0, 0.0)
              : vec2(0.0, (newSize.y - screenSize.y) / 2.0)) / newSize;

            return uv * screenSize / newSize + newOffset;
          }

          varying vec2 vUv;

          void main() {
            vec2 uv = vUv;
            vec2 uvCover = cover(u_res, u_size, uv);
            vec4 texture = texture2D(u_texture, uvCover);

            // Calculate distance from the center of the plane
            vec2 res = u_res / 2.0;
            vec2 pos = uv * u_res;
            vec2 dist = abs(pos - res);

            // Calculate the corner radius area
            float radius = u_radius * min(u_res.x, u_res.y);
            if (dist.x > (res.x - radius) && dist.y > (res.y - radius)) {
              vec2 d = dist - (res - vec2(radius));
              if (length(d) > radius) {
                discard; // Discard fragments outside the rounded corners
              }
            }

            gl_FragColor = texture;
          }`,

          vertexShader: `
            precision mediump float;

            uniform float u_diff;

            varying vec2 vUv;

            void main() {
              vec3 pos = position;

              pos.y *= 1. - u_diff;
              pos.x *= 1. - u_diff;

              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
            }`
          ,
          uniforms: {
            u_texture: { value: 0 },
            u_res: { value: new THREE.Vector2(1, 1) },
            u_size: { value: new THREE.Vector2(1, 1) },
            u_diff: { value: 0 },
            u_radius: { value: 0.05 },
          },
        });

        // 加载纹理并设置其属性
        this.texture = new THREE.TextureLoader().load(this.el.dataset.src, (texture) => {
          texture.minFilter = THREE.LinearFilter;
          texture.generateMipmaps = false;

          const { naturalWidth, naturalHeight } = texture.image;
          const { u_size, u_texture } = this.material.uniforms;

          u_texture.value = texture;
          u_size.value.x = naturalWidth;
          u_size.value.y = naturalHeight;
        });

        // 使用几何图形和材质创建网格
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.add(this.mesh);

        // 调整平面的大小和位置
        this.resize();
      }

      // Update plane's position and uniforms
      update = (x, y, max, diff) => {
        const { right, bottom } = this.rect;
        const { u_diff } = this.material.uniforms;

        this.y = gsap.utils.wrap(
            -(max.y - bottom),
            bottom,
            y * this.my
        ) - this.yOffset;

        this.x = gsap.utils.wrap(
            -(max.x - right),
            right,
            x
        ) - this.xOffset;

        u_diff.value = diff;

        this.position.x = this.x;
        this.position.y = this.y;
      }

      // Adjust plane's size and position on resize
      resize() {
        this.rect = this.el.getBoundingClientRect();

        const { left, top, width, height } = this.rect;
        const { u_res } = this.material.uniforms;

        this.xOffset = (left + (width / 2)) - (ww / 2);
        this.yOffset = (top + (height / 2)) - (wh / 2);

        this.position.x = this.xOffset;
        this.position.y = this.yOffset;

        u_res.value.x = width;
        u_res.value.y = height;

        this.mesh.scale.set(width, height, 1);
      }
    }
    document.body.classList.add('dark:bg-blue-100');

    // 在装载组件时创建Core类的实例
    onMounted(() => {
      new Core();
    });

    return {
      imageSources,
    };
  },
};

</script>

<style>
html {
  height: 100%;
  width: 100%;
  overflow: hidden;
}

body {
  height: 100%;
  width: 100%;
  overflow: hidden;
  padding: 0;
  margin: 0;
  cursor: -webkit-grab;
  cursor: grab;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  background-color: #f56900;
}
</style>
