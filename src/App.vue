<template>
  <div id="app" @mousemove="operatingWeb">
    <div class="background">
      <!-- vue-particles组件，粒子特效 -->
        <vue-particles
          class="login-bg"
          color="#4F4F4F"
          :particleOpacity="0.7"
          :particlesNumber="100"
          shapeType="circle"
          :particleSize="4"
          linesColor="#4F4F4F"
          :linesWidth="1"
          :lineLinked="true"
          :lineOpacity="0.4"
          :linesDistance="150"
          :moveSpeed="3"
          :hoverEffect="true"
          hoverMode="grab"
          :clickEffect="true"
          clickMode="push"
        />
        <router-view/>
      <live2d
        class="live2d"
        :style="style"
        :model="[1, 53]"
        :direction="direction"
        :size="size"
        :show="show"
      ></live2d>
    </div>
    
  </div>
</template>

<script>
import live2d from '../src/components/kanban-musume.vue'
export default {
  name: 'App',
  components: {
    live2d
  },
  data () {
    return {
      timmer: null,
      show: false,
      direction: 'right',
      style: '',
      width: 500,
      height: 500,
      size: 350,
      tips: {
        mouseover: [{
          selector: '.vue-live2d',
          texts: ['这样可以修改默认语句']
        }]
      }
    }
  },
  created () {
    // tips 未使用，可自行在组件绑定此参数，注意此参数只会初始化一次
    this.tips = this.customTips
    this.init();
  },
  methods:{
    operatingWeb(){
      this.show = false
      clearTimeout(this.timmer);
      this.init();
    },
    init() {
      this.timmer = setTimeout(() => {
        // 执行事件
        this.show = true;
      }, 10000);
    },
  }
}
</script>

<style lang="scss">
* {
    margin: 0;
    padding: 0;
  }
  a {
    text-decoration: none;
  }
  .live2d{
    position: fixed;
    bottom: 0px;
    right:0px;
    z-index: 9999;
  }
  .login-bg{
        top: 0;
        position: absolute;
        width: 100%;
        height: 100%;
    }
#app {
  /* font-family: 'Avenir', Helvetica, Arial, sans-serif; */
  font-family: 'Microsoft YaHei';
  background: #F7F7F7;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0;
  min-width: 700px;
  font-size: 16px;
  min-width: 1010Px;//忽略单个属性的最简单的方法是在像素单元声明中使用大写
}
</style>
