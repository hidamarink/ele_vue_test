<template>
  <div id="app">
<!--    <img alt="Vue logo" src="./assets/logo.png">-->
    <suspension msg="Vue.js App"/>
    <div>计数{{count}}</div>
  </div>
</template>

<script>
import suspension from './components/suspension.vue'

export default {
  name: 'App',
  data(){
    return {
        count:0
    }
  },
  components: {
    suspension
  },
  mounted() {
    let that = this;
    console.log("-------------------------");
    setInterval(function (){
      that.count++;
    },100);
  }

}
</script>

<style>
#app {
  user-select: none;
  width: 100%;
  height: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  background-color: aqua;
  border: 3px dashed mediumturquoise;
}
</style>
